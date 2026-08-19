-- UnifiedQR — Full database schema
-- Consolidated from 13 incremental migrations into a single initial migration.
-- Apply with: supabase db push

-- ================================================================
-- 1. PROFILES
-- ================================================================
CREATE TABLE public.profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name   text,
  avatar_url     text,
  plan           text NOT NULL DEFAULT 'free',
  plan_expires_at timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile select"   ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "own profile insert"   ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update"   ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ================================================================
-- 2. QR CODES
-- ================================================================
CREATE TABLE public.qr_codes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id         uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  name            text NOT NULL DEFAULT 'Untitled QR Code',
  type            text NOT NULL DEFAULT 'url',
  content         text NOT NULL DEFAULT '',
  is_dynamic      boolean NOT NULL DEFAULT false,
  slug            text UNIQUE,
  destination     text,
  active          boolean NOT NULL DEFAULT true,
  template_id     integer NOT NULL DEFAULT 1,
  fg              text,
  bg              text,
  body_shape      text,
  eye_shape       text,
  gradient_type   text,
  gradient_color  text,
  gradient_angle  integer,
  frame_text      text,
  frame_style     text,
  logo_url        text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT valid_destination CHECK (destination IS NULL OR destination ~ '^https?://')
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.qr_codes TO authenticated;
GRANT SELECT ON public.qr_codes TO anon;
GRANT ALL ON public.qr_codes TO service_role;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own codes all" ON public.qr_codes FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "public active dynamic lookup" ON public.qr_codes FOR SELECT TO anon, authenticated
  USING (is_dynamic AND active);

CREATE INDEX qr_codes_user_id_idx ON public.qr_codes(user_id);
CREATE INDEX qr_codes_team_id_idx ON public.qr_codes(team_id);

-- ================================================================
-- 3. SCANS
-- ================================================================
CREATE TABLE public.scans (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id    uuid NOT NULL REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  scanned_at timestamptz NOT NULL DEFAULT now(),
  device     text,
  referrer   text
);

GRANT SELECT, INSERT ON public.scans TO authenticated;
GRANT INSERT ON public.scans TO anon;
GRANT ALL ON public.scans TO service_role;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can record a scan" ON public.scans FOR INSERT TO anon, authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.qr_codes c WHERE c.id = code_id AND c.is_dynamic AND c.active)
);
CREATE POLICY "owner reads scans" ON public.scans FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.qr_codes c WHERE c.id = code_id AND c.user_id = auth.uid())
);

CREATE INDEX scans_code_id_idx ON public.scans(code_id);

-- ================================================================
-- 4. TEAMS, TEAM MEMBERS, TEAM INVITES
-- ================================================================
CREATE TABLE public.teams (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.team_members (
  team_id   uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role      text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE public.team_invites (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email      text NOT NULL,
  token      text NOT NULL UNIQUE,
  role       text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days'
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_invites TO authenticated;
GRANT ALL ON public.teams TO service_role;
GRANT ALL ON public.team_members TO service_role;
GRANT ALL ON public.team_invites TO service_role;

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Teams: owner manages; any authenticated may create.
CREATE POLICY "team visible to members" ON public.teams FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.team_members m WHERE m.team_id = id AND m.user_id = auth.uid())
);
CREATE POLICY "any authenticated creates team" ON public.teams FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "owner manages team" ON public.teams FOR ALL TO authenticated
  USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- team_members: own rows + invite join (no circular queries via teams).
CREATE POLICY "tm_select_own" ON public.team_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "tm_insert_via_invite" ON public.team_members FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.team_invites inv
      WHERE inv.team_id = team_members.team_id
        AND lower(inv.email) = lower(auth.jwt() ->> 'email')
        AND inv.status = 'pending'
        AND inv.expires_at > now()
    )
  );

CREATE POLICY "tm_delete_leave" ON public.team_members FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- SECURITY DEFINER helpers to bypass circular RLS.
CREATE OR REPLACE FUNCTION public.get_team_members(p_team_id uuid)
RETURNS TABLE (team_id uuid, user_id uuid, role text, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT tm.team_id, tm.user_id, tm.role, tm.joined_at
  FROM public.team_members tm
  WHERE tm.team_id = p_team_id
    AND EXISTS (SELECT 1 FROM public.teams t WHERE t.id = p_team_id AND t.created_by = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.remove_team_member(p_team_id uuid, p_user_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  DELETE FROM public.team_members
  WHERE team_id = p_team_id AND user_id = p_user_id
    AND EXISTS (SELECT 1 FROM public.teams t WHERE t.id = p_team_id AND t.created_by = auth.uid());
$$;

-- team_invites: owner/invitee access (via teams, not team_members).
CREATE POLICY "ti_select_owner_or_invitee" ON public.team_invites FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_invites.team_id AND t.created_by = auth.uid())
  OR lower(email) = lower(auth.jwt() ->> 'email')
);
CREATE POLICY "ti_insert_owner" ON public.team_invites FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_invites.team_id AND t.created_by = auth.uid())
  );
CREATE POLICY "ti_update_owner_or_invitee" ON public.team_invites FOR UPDATE TO authenticated
  USING (
    lower(email) = lower(auth.jwt() ->> 'email')
    OR EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_invites.team_id AND t.created_by = auth.uid())
  )
  WITH CHECK (
    lower(email) = lower(auth.jwt() ->> 'email')
    OR EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_invites.team_id AND t.created_by = auth.uid())
  );

-- Shared code library: team members can read/update team codes (via teams, not team_members).
CREATE POLICY "qr_team_select" ON public.qr_codes FOR SELECT TO authenticated USING (
  team_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.teams t WHERE t.id = qr_codes.team_id AND t.created_by = auth.uid())
);
CREATE POLICY "qr_team_update" ON public.qr_codes FOR UPDATE TO authenticated
  USING (
    team_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.teams t WHERE t.id = qr_codes.team_id AND t.created_by = auth.uid())
  )
  WITH CHECK (
    team_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.teams t WHERE t.id = qr_codes.team_id AND t.created_by = auth.uid())
  );

CREATE INDEX team_members_user_id_idx ON public.team_members(user_id);
CREATE INDEX team_invites_token_idx ON public.team_invites(token);

-- ================================================================
-- 5. VISITOR COUNTS
-- ================================================================
CREATE TABLE public.visitor_counts (
  day   date PRIMARY KEY,
  count integer NOT NULL DEFAULT 0
);

GRANT SELECT ON public.visitor_counts TO anon, authenticated;
GRANT ALL ON public.visitor_counts TO service_role;
ALTER TABLE public.visitor_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public reads visitor counts" ON public.visitor_counts
  FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.increment_visitor_count(p_day date)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE new_count integer;
BEGIN
  INSERT INTO public.visitor_counts (day, count) VALUES (p_day, 1)
  ON CONFLICT (day) DO UPDATE SET count = public.visitor_counts.count + 1
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_visitor_count(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_visitor_count(date) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_total_visitor_count()
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(SUM(count), 0)::integer FROM public.visitor_counts;
$$;

REVOKE ALL ON FUNCTION public.get_total_visitor_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_total_visitor_count() TO anon, authenticated;

ALTER TABLE public.visitor_counts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.visitor_counts;

-- ================================================================
-- 6. LINK PAGES (workspace / bio-link)
-- ================================================================
CREATE TABLE public.link_pages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug        text NOT NULL UNIQUE,
  title       text NOT NULL DEFAULT 'My Links',
  subtitle    text,
  avatar_url  text,
  theme_color text NOT NULL DEFAULT '#6366f1',
  theme_bg    text NOT NULL DEFAULT '#ffffff',
  theme_font  text NOT NULL DEFAULT 'system',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE TABLE public.link_sections (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id    uuid NOT NULL REFERENCES public.link_pages(id) ON DELETE CASCADE,
  title      text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  visible    boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.link_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.link_sections(id) ON DELETE CASCADE,
  title      text NOT NULL DEFAULT '',
  url        text NOT NULL DEFAULT '',
  icon_emoji text,
  icon_url   text,
  sort_order integer NOT NULL DEFAULT 0,
  visible    boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.link_pages TO anon, authenticated;
GRANT SELECT ON public.link_sections TO anon, authenticated;
GRANT SELECT ON public.link_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.link_pages TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.link_sections TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.link_items TO authenticated;
GRANT ALL ON public.link_pages TO service_role;
GRANT ALL ON public.link_sections TO service_role;
GRANT ALL ON public.link_items TO service_role;

ALTER TABLE public.link_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read link pages by slug" ON public.link_pages FOR SELECT USING (true);
CREATE POLICY "Public can read visible sections" ON public.link_sections FOR SELECT USING (visible = true);
CREATE POLICY "Public can read visible items" ON public.link_items FOR SELECT USING (visible = true);

CREATE POLICY "Users can manage their own link pages" ON public.link_pages FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own link sections" ON public.link_sections FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.link_pages WHERE link_pages.id = link_sections.page_id AND link_pages.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.link_pages WHERE link_pages.id = link_sections.page_id AND link_pages.user_id = auth.uid())
  );

CREATE POLICY "Users can manage their own link items" ON public.link_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.link_sections
      JOIN public.link_pages ON link_pages.id = link_sections.page_id
      WHERE link_sections.id = link_items.section_id AND link_pages.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.link_sections
      JOIN public.link_pages ON link_pages.id = link_sections.page_id
      WHERE link_sections.id = link_items.section_id AND link_pages.user_id = auth.uid()
    )
  );

CREATE INDEX idx_link_pages_user ON public.link_pages(user_id);
CREATE UNIQUE INDEX idx_link_pages_slug ON public.link_pages(slug);
CREATE INDEX idx_link_sections_page ON public.link_sections(page_id, sort_order);
CREATE INDEX idx_link_items_section ON public.link_items(section_id, sort_order);

-- ================================================================
-- 7. TRIGGERS & FUNCTIONS
-- ================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER qr_codes_updated_at   BEFORE UPDATE ON public.qr_codes   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_updated_at   BEFORE UPDATE ON public.profiles   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Revoke public execution of internal functions.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;
