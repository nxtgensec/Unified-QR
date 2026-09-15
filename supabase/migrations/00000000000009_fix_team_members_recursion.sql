-- Fix 42P17 "infinite recursion detected in policy for relation team_members".
-- The m06 policies on team_members self-referenced team_members inside their
-- own USING/WITH CHECK clauses. Any authenticated query that touched
-- team_members (directly, or via the qr_codes/teams/team_invites policies that
-- subquery it) re-entered tm_select_own forever, producing the recursion error.
--
-- Fix: route the membership / owner-admin checks through SECURITY DEFINER
-- helper functions (like get_team_members / remove_team_member). SECURITY
-- DEFINER runs as the owner, so the inner table scan is not itself subject to
-- RLS and cannot recurse.

CREATE OR REPLACE FUNCTION public.is_team_member(p_team_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members m
    WHERE m.team_id = p_team_id AND m.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_team_owner_or_admin(p_team_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members m
    JOIN public.teams t ON t.id = m.team_id
    WHERE m.team_id = p_team_id
      AND m.user_id = auth.uid()
      AND (t.created_by = auth.uid() OR m.role IN ('owner', 'admin'))
  );
$$;

REVOKE ALL ON FUNCTION public.is_team_member(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_team_member(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.is_team_owner_or_admin(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_team_owner_or_admin(uuid) TO authenticated;

-- Members of the same team can see the roster; users can read their own rows.
DROP POLICY IF EXISTS "tm_select_own" ON public.team_members;
CREATE POLICY "tm_select_own" ON public.team_members
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR public.is_team_member(team_id)
  );

-- Owner/admin can add members directly, or a user accepts their pending invite.
DROP POLICY IF EXISTS "tm_insert_owner" ON public.team_members;
CREATE POLICY "tm_insert_owner" ON public.team_members
  FOR INSERT TO authenticated WITH CHECK (
    public.is_team_owner_or_admin(team_id)
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

-- Owner/admin can remove members; users can always leave a team themselves.
DROP POLICY IF EXISTS "tm_delete_owner" ON public.team_members;
CREATE POLICY "tm_delete_owner" ON public.team_members
  FOR DELETE TO authenticated USING (
    public.is_team_owner_or_admin(team_id) OR user_id = auth.uid()
  );

-- The m06 invite-based insert policy is retained as-is (it only references
-- team_invites, never team_members, so it cannot recurse).