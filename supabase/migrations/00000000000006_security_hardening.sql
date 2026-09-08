-- Security hardening pass
-- 1) Analytics flooding: revoke anon/authenticated INSERT on analytics tables and
--    the visitor-counter RPC; all writes now go through rate-limited server fns.
-- 2) Team access: gate shared codes + helpers on team_members (roles enforced).
-- 3) Link pages: add `published` flag and gate public reads on it.
-- 4) delete_my_account: clean up owned teams explicitly before removing the user.
-- Applied with: npm run db:push

-- ────────────────────────────────────────────────────────────────────
-- 1. ANALYTICS WRITE HARDENING
-- --------------------------------------------------------------------
-- Scans: only the service-role `recordScan` server fn writes. The
-- "anyone can record a scan" RLS policy is a direct REST abuse vector.
DROP POLICY IF EXISTS "anyone can record a scan" ON public.scans;
REVOKE INSERT ON public.scans FROM anon, authenticated;

-- Link analytics: written only by the service-role server fns.
DROP POLICY IF EXISTS "anyone can record a page view" ON public.link_page_views;
REVOKE INSERT ON public.link_page_views FROM anon, authenticated;

DROP POLICY IF EXISTS "anyone can record a link click" ON public.link_item_clicks;
REVOKE INSERT ON public.link_item_clicks FROM anon, authenticated;

-- Visitor counter: reads stay public; increments move behind `recordVisit`.
REVOKE EXECUTE ON FUNCTION public.increment_visitor_count(date) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_visitor_count(date) TO service_role;

-- ────────────────────────────────────────────────────────────────────
-- 2. TEAM COLLABORATION – membership-gated access with roles
-- --------------------------------------------------------------------
-- Shared-code reads: any team member.
DROP POLICY IF EXISTS "qr_team_select" ON public.qr_codes;
CREATE POLICY "qr_team_select" ON public.qr_codes
  FOR SELECT TO authenticated USING (
    team_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.team_members m
      WHERE m.team_id = qr_codes.team_id AND m.user_id = auth.uid()
    )
  );

-- Shared-code updates/deletes: owner or admin only.
DROP POLICY IF EXISTS "qr_team_update" ON public.qr_codes;
CREATE POLICY "qr_team_update" ON public.qr_codes
  FOR UPDATE TO authenticated USING (
    team_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.team_members m
      JOIN public.teams t ON t.id = m.team_id
      WHERE m.team_id = qr_codes.team_id
        AND m.user_id = auth.uid()
        AND (t.created_by = auth.uid() OR m.role IN ('owner', 'admin'))
    )
  )
  WITH CHECK (
    team_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.team_members m
      JOIN public.teams t ON t.id = m.team_id
      WHERE m.team_id = qr_codes.team_id
        AND m.user_id = auth.uid()
        AND (t.created_by = auth.uid() OR m.role IN ('owner', 'admin'))
    )
  );

DROP POLICY IF EXISTS "qr_team_delete" ON public.qr_codes;
CREATE POLICY "qr_team_delete" ON public.qr_codes
  FOR DELETE TO authenticated USING (
    team_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.team_members m
      JOIN public.teams t ON t.id = m.team_id
      WHERE m.team_id = qr_codes.team_id
        AND m.user_id = auth.uid()
        AND (t.created_by = auth.uid() OR m.role IN ('owner', 'admin'))
    )
  );

-- Team rows visible to all members (not just the owner/admin subset).
DROP POLICY IF EXISTS "team visible to members" ON public.teams;
CREATE POLICY "team visible to members" ON public.teams
  FOR SELECT TO authenticated USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.team_members m
      WHERE m.team_id = id AND m.user_id = auth.uid()
    )
  );

-- team_members: members of the same team can see the roster.
DROP POLICY IF EXISTS "tm_select_own" ON public.team_members;
CREATE POLICY "tm_select_own" ON public.team_members
  FOR SELECT TO authenticated USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.team_members m
      WHERE m.team_id = team_members.team_id AND m.user_id = auth.uid()
    )
  );

-- Owner/admin can add members directly (e.g. from the roster UI).
DROP POLICY IF EXISTS "tm_insert_owner" ON public.team_members;
CREATE POLICY "tm_insert_owner" ON public.team_members
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members m
      JOIN public.teams t ON t.id = m.team_id
      WHERE m.team_id = team_members.team_id
        AND m.user_id = auth.uid()
        AND (t.created_by = auth.uid() OR m.role IN ('owner', 'admin'))
    )
    OR (
      user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.team_invites inv
        WHERE inv.team_id = team_members.team_id
          AND lower(inv.email) = lower(auth.jwt() ->> 'email')
          AND inv.status = 'pending'
          AND inv.expires_at > now()
      )
    )
  );

-- Owner/admin can remove members.
DROP POLICY IF EXISTS "tm_delete_owner" ON public.team_members;
CREATE POLICY "tm_delete_owner" ON public.team_members
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.team_members m
      JOIN public.teams t ON t.id = m.team_id
      WHERE m.team_id = team_members.team_id
        AND m.user_id = auth.uid()
        AND (t.created_by = auth.uid() OR m.role IN ('owner', 'admin'))
    )
    OR user_id = auth.uid()
  );

-- Invites: owner or admin may invite.
DROP POLICY IF EXISTS "ti_insert_owner" ON public.team_invites;
CREATE POLICY "ti_insert_owner" ON public.team_invites
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members m
      JOIN public.teams t ON t.id = m.team_id
      WHERE m.team_id = team_invites.team_id
        AND m.user_id = auth.uid()
        AND (t.created_by = auth.uid() OR m.role IN ('owner', 'admin'))
    )
  );

-- ────────────────────────────────────────────────────────────────────
-- 3. LINK PAGES – published flag gates public reads
-- --------------------------------------------------------------------
ALTER TABLE public.link_pages
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "Public can read link pages by slug" ON public.link_pages;
CREATE POLICY "Public can read published link pages" ON public.link_pages
  FOR SELECT TO anon, authenticated USING (published = true);

-- ────────────────────────────────────────────────────────────────────
-- 4. delete_my_account – explicit team cleanup before user deletion
-- --------------------------------------------------------------------
-- Removing an owner used to cascade-delete their teams, silently dropping
-- other members' memberships and unsharing their codes. Clean up owned
-- teams deterministically first: unlink codes, drop memberships/invites,
-- then let the FK cascade remove the empty team rows.
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_team_id uuid;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Unlink codes owned by other members of teams we created, so they survive.
  UPDATE public.qr_codes
     SET team_id = NULL, updated_at = now()
   WHERE team_id IN (
     SELECT id FROM public.teams WHERE created_by = v_uid
   )
     AND user_id <> v_uid;

  -- Remove our team memberships so we never delete ourselves via those rows.
  DELETE FROM public.team_members WHERE user_id = v_uid;

  -- Clean owned teams' invitations and member rows, then the teams/owner rows.
  DELETE FROM public.team_invites
   WHERE team_id IN (SELECT id FROM public.teams WHERE created_by = v_uid);

  DELETE FROM public.team_members
   WHERE team_id IN (SELECT id FROM public.teams WHERE created_by = v_uid);

  DELETE FROM public.teams WHERE created_by = v_uid;

  -- Finally remove the auth user; profiles, qr_codes and scans cascade from it.
  DELETE FROM auth.users WHERE id = v_uid;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.delete_my_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;