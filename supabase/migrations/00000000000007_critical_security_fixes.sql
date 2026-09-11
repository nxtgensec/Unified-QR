-- Critical security fixes (audit pass)
-- C1) Team invites: invitees can no longer hijack their invite (team_id/role swap).
-- C2) Profiles: users can no longer self-promote plan / plan_expires_at.
-- C3) Payments: idempotent order table so one payment cannot re-verify forever.
-- C5) Image data-URL guard: reject SVG data URLs at the DB layer.
-- Applied with: npm run db:push

-- ────────────────────────────────────────────────────────────────────
-- C1. TEAM INVITES — restrict UPDATE to owner/admin; invitees accept
--     through a SECURITY DEFINER function instead of a raw PATCH.
-- --------------------------------------------------------------------
-- The old policy let any invitee PATCH their invite and rewrite
-- team_id/role before joining, escalating to any team as admin.
DROP POLICY IF EXISTS "ti_update_owner_or_invitee" ON public.team_invites;

-- Only team owner/admins may update invites directly (mirrors m06 insert gate).
CREATE POLICY "ti_update_owner_admin" ON public.team_invites
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members m
      JOIN public.teams t ON t.id = m.team_id
      WHERE m.team_id = team_invites.team_id
        AND m.user_id = auth.uid()
        AND (t.created_by = auth.uid() OR m.role IN ('owner', 'admin'))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members m
      JOIN public.teams t ON t.id = m.team_id
      WHERE m.team_id = team_invites.team_id
        AND m.user_id = auth.uid()
        AND (t.created_by = auth.uid() OR m.role IN ('owner', 'admin'))
    )
  );

-- Invitees accept the invite via this function. It atomically validates
-- the token/email, marks the invite accepted and inserts the membership,
-- so the invitee can never rewrite team_id or role.
CREATE OR REPLACE FUNCTION public.accept_team_invite(p_token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite RECORD;
  v_uid uuid;
  v_email text;
BEGIN
  v_uid := auth.uid();
  v_email := lower(auth.jwt() ->> 'email');
  IF v_uid IS NULL OR v_email IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_invite
  FROM public.team_invites
  WHERE token = p_token
    AND status = 'pending'
    AND expires_at > now()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite is invalid or expired';
  END IF;

  IF lower(v_invite.email) <> v_email THEN
    RAISE EXCEPTION 'This invite was sent to a different email';
  END IF;

  -- Mark accepted, then create the membership (same transaction).
  UPDATE public.team_invites
  SET status = 'accepted'
  WHERE id = v_invite.id;

  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (v_invite.team_id, v_uid, v_invite.role)
  ON CONFLICT (team_id, user_id) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.accept_team_invite(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.accept_team_invite(text) TO authenticated;

-- ────────────────────────────────────────────────────────────────────
-- C2. PROFILES — prevent self-promotion of plan / plan_expires_at
-- --------------------------------------------------------------------
-- Previously the "own profile update" policy let users write any column
-- including plan and plan_expires_at, so a PATCH to /profiles could
-- grant themselves a paid plan forever. Restrict to non-plan columns.
DROP POLICY IF EXISTS "own profile update" ON public.profiles;
CREATE POLICY "own profile update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Column-level grants: table-level UPDATE/INSERT were granted in init.sql,
-- so first revoke those, then re-grant scoped to the safe columns.
-- plan/plan_expires_at stay writable only via service_role.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (display_name, avatar_url) ON public.profiles TO authenticated;

-- Same on INSERT: a fresh row must never self-promote a plan. The
-- handle_new_user trigger (SECURITY DEFINER) still creates full rows.
REVOKE INSERT ON public.profiles FROM authenticated;
GRANT INSERT (id, display_name, avatar_url) ON public.profiles TO authenticated;

-- ────────────────────────────────────────────────────────────────────
-- C3. PAYMENTS — idempotent order ledger
-- --------------------------------------------------------------------
-- Backs verifyCashfreePayment: an order_id can be consumed once.
CREATE TABLE IF NOT EXISTS public.payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      text NOT NULL UNIQUE,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan          text NOT NULL,
  amount        integer NOT NULL,
  currency      text NOT NULL,
  order_status  text NOT NULL DEFAULT 'paid' CHECK (order_status IN ('paid', 'consumed')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  consumed_at   timestamptz
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- users may read their own payment records; only service_role writes.
CREATE POLICY "own payments read" ON public.payments
  FOR SELECT TO authenticated USING (user_id = auth.uid());

GRANT SELECT ON public.payments TO authenticated;
GRANT INSERT, UPDATE ON public.payments TO service_role;

CREATE INDEX payments_user_id_idx ON public.payments(user_id);

-- ────────────────────────────────────────────────────────────────────
-- C5. IMAGE DATA-URL GUARD — reject SVG / non-image data URLs at the DB
-- --------------------------------------------------------------------
-- Svg files can carry <script>; they are only ever loaded in <img> in the
-- browser, but the raw SVG is embedded in downloaded QR files and can be
-- re-served. Enforce raster-only (and size) server-side so direct REST
-- writes cannot bypass the client-side upload checks.
CREATE OR REPLACE FUNCTION public.guard_image_data_url()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_value text;
  v_payload text;
  v_decoded text;
BEGIN
  EXECUTE format('SELECT ($1).%I', TG_ARGV[0]) USING NEW INTO v_value;

  IF v_value IS NULL OR v_value = '' THEN
    RETURN NEW;
  END IF;

  -- Allow external https?:// image URLs (e.g. Google OAuth avatars) — those
  -- render inside <img> only and cannot execute scripts via that context.
  IF v_value ~ '^https?://' THEN
    RETURN NEW;
  END IF;

  -- Must be a data:image URL, but NOT svg/xml (script-capable carriers).
  IF v_value !~ '^data:image/(png|jpe?g|gif|webp|bmp|avif);base64,' THEN
    RAISE EXCEPTION 'Only raster images (PNG/JPEG/WebP/GIF) may be uploaded as data URLs';
  END IF;

  -- 6.5 MB cap on the raw data URL (≈ a 4.8 MB binary file after base64).
  IF length(v_value) > 6815744 THEN
    RAISE EXCEPTION 'Image is too large (max ~4 MB binary)';
  END IF;

  -- Reject rasters whose decoded payload is actually an SVG/XML/HTML that has
  -- been relabelled (base64 of "<svg", "<?xml" or "<script" markers).
  -- LATIN1 maps every byte 1:1 so the binary decode never fails on real
  -- PNG/JPEG/WebP payloads.
  v_payload := regexp_replace(v_value, '^data:image/[a-z0-9.+-]+;base64,', '');
  v_decoded := convert_from(decode(v_payload, 'base64'), 'LATIN1');
  IF v_decoded ~* '<(svg|script|!DOCTYPE|html|iframe|object|embed|style[[:space:]]+)' THEN
    RAISE EXCEPTION 'This image contains disallowed embedded content';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_image_data_url() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS trg_guard_qr_logo ON public.qr_codes;
CREATE TRIGGER trg_guard_qr_logo
  BEFORE INSERT OR UPDATE OF logo_url ON public.qr_codes
  FOR EACH ROW EXECUTE FUNCTION public.guard_image_data_url('logo_url');

DROP TRIGGER IF EXISTS trg_guard_link_avatar ON public.link_pages;
CREATE TRIGGER trg_guard_link_avatar
  BEFORE INSERT OR UPDATE OF avatar_url ON public.link_pages
  FOR EACH ROW EXECUTE FUNCTION public.guard_image_data_url('avatar_url');

DROP TRIGGER IF EXISTS trg_guard_profile_avatar ON public.profiles;
CREATE TRIGGER trg_guard_profile_avatar
  BEFORE INSERT OR UPDATE OF avatar_url ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_image_data_url('avatar_url');