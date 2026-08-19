-- Teams, members, invites + shared code library.
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.team_members (
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE public.team_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email text NOT NULL,
  token text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days'
);

ALTER TABLE public.qr_codes ADD COLUMN team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL;

CREATE INDEX team_members_user_id_idx ON public.team_members(user_id);
CREATE INDEX team_invites_token_idx ON public.team_invites(token);
CREATE INDEX qr_codes_team_id_idx ON public.qr_codes(team_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_invites TO authenticated;
GRANT ALL ON public.teams TO service_role;
GRANT ALL ON public.team_members TO service_role;
GRANT ALL ON public.team_invites TO service_role;

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Teams: visible to members; owner manages; any authenticated user may create.
CREATE POLICY "team visible to members" ON public.teams FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.team_members m WHERE m.team_id = id AND m.user_id = auth.uid())
);
CREATE POLICY "any authenticated creates team" ON public.teams FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "owner manages team" ON public.teams FOR ALL TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

-- Memberships: read for teams you belong to; join only via a valid pending invite.
CREATE POLICY "member reads own teams" ON public.team_members FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.team_members mine WHERE mine.team_id = team_id AND mine.user_id = auth.uid())
);
CREATE POLICY "join team with invite" ON public.team_members FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.team_invites inv
    WHERE inv.team_id = team_id
      AND lower(inv.email) = lower(auth.jwt() ->> 'email')
      AND inv.status = 'pending'
      AND inv.expires_at > now()
  )
);
CREATE POLICY "leave team or owner removes member" ON public.team_members FOR DELETE TO authenticated USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.team_members m
    WHERE m.team_id = team_id AND m.user_id = auth.uid() AND m.role IN ('owner', 'admin')
  )
);

-- Invites: members view; owner/admin create; invitee accepts or owner/admin revokes.
CREATE POLICY "members view invites" ON public.team_invites FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.team_members m WHERE m.team_id = team_id AND m.user_id = auth.uid())
);
CREATE POLICY "owner or admin creates invites" ON public.team_invites FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.team_members m
    WHERE m.team_id = team_id AND m.user_id = auth.uid() AND m.role IN ('owner', 'admin')
  )
);
CREATE POLICY "invitee accepts or owner revokes" ON public.team_invites FOR UPDATE TO authenticated
USING (
  lower(email) = lower(auth.jwt() ->> 'email')
  OR EXISTS (
    SELECT 1 FROM public.team_members m
    WHERE m.team_id = team_id AND m.user_id = auth.uid() AND m.role IN ('owner', 'admin')
  )
)
WITH CHECK (
  lower(email) = lower(auth.jwt() ->> 'email')
  OR EXISTS (
    SELECT 1 FROM public.team_members m
    WHERE m.team_id = team_id AND m.user_id = auth.uid() AND m.role IN ('owner', 'admin')
  )
);

-- Shared code library: team members can read and update codes assigned to the team.
CREATE POLICY "team members access team codes" ON public.qr_codes FOR SELECT TO authenticated USING (
  team_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.team_members m WHERE m.team_id = team_id AND m.user_id = auth.uid())
);
CREATE POLICY "team members update team codes" ON public.qr_codes FOR UPDATE TO authenticated
USING (
  team_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.team_members m WHERE m.team_id = team_id AND m.user_id = auth.uid())
)
WITH CHECK (
  team_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.team_members m WHERE m.team_id = team_id AND m.user_id = auth.uid())
);
