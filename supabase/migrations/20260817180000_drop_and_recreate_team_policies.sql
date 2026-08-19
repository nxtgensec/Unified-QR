-- BREAK THE CIRCULAR DEPENDENCY between team_members and teams policies.
--
-- Problem: team_members SELECT policy queries teams, and teams SELECT policy
-- queries team_members → infinite recursion.
--
-- Fix: team_members SELECT policy only checks user_id = auth.uid().
-- Owner access to member lists uses a SECURITY DEFINER function instead.

-- ============================================================
-- 1. team_members — drop all policies, recreate without cycle
-- ============================================================
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'team_members' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.team_members', pol.policyname);
  END LOOP;
END $$;

-- SELECT: only your own rows. No subqueries to other tables that reference back.
CREATE POLICY "tm_select_own" ON public.team_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- INSERT: only via a valid pending invite for your email.
CREATE POLICY "tm_insert_via_invite" ON public.team_members
  FOR INSERT TO authenticated
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

-- DELETE: only remove yourself (leave). Owner removal handled by SECURITY DEFINER.
CREATE POLICY "tm_delete_leave" ON public.team_members
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 2. SECURITY DEFINER function for owner to list team members
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_team_members(p_team_id uuid)
RETURNS TABLE (team_id uuid, user_id uuid, role text, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  -- Only the team owner may call this
  SELECT tm.team_id, tm.user_id, tm.role, tm.joined_at
  FROM public.team_members tm
  WHERE tm.team_id = p_team_id
    AND EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = p_team_id AND t.created_by = auth.uid()
    );
$$;

-- ============================================================
-- 3. SECURITY DEFINER function for owner to remove a member
-- ============================================================
CREATE OR REPLACE FUNCTION public.remove_team_member(p_team_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE sql SECURITY DEFINER
AS $$
  DELETE FROM public.team_members
  WHERE team_id = p_team_id AND user_id = p_user_id
    AND EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = p_team_id AND t.created_by = auth.uid()
    );
$$;

-- ============================================================
-- 4. team_invites — drop and recreate with no team_members refs
-- ============================================================
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'team_invites' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.team_invites', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "ti_select_owner_or_invitee" ON public.team_invites
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_invites.team_id AND t.created_by = auth.uid()
    )
    OR lower(email) = lower(auth.jwt() ->> 'email')
  );

CREATE POLICY "ti_insert_owner" ON public.team_invites
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_invites.team_id AND t.created_by = auth.uid()
    )
  );

CREATE POLICY "ti_update_owner_or_invitee" ON public.team_invites
  FOR UPDATE TO authenticated
  USING (
    lower(email) = lower(auth.jwt() ->> 'email')
    OR EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_invites.team_id AND t.created_by = auth.uid()
    )
  )
  WITH CHECK (
    lower(email) = lower(auth.jwt() ->> 'email')
    OR EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = team_invites.team_id AND t.created_by = auth.uid()
    )
  );

-- ============================================================
-- 5. qr_codes — fix team-related policies to use teams table
-- ============================================================
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE tablename = 'qr_codes' AND schemaname = 'public'
      AND policyname LIKE '%team%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.qr_codes', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "qr_team_select" ON public.qr_codes
  FOR SELECT TO authenticated
  USING (
    team_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = qr_codes.team_id AND t.created_by = auth.uid()
    )
  );

CREATE POLICY "qr_team_update" ON public.qr_codes
  FOR UPDATE TO authenticated
  USING (
    team_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = qr_codes.team_id AND t.created_by = auth.uid()
    )
  )
  WITH CHECK (
    team_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.teams t
      WHERE t.id = qr_codes.team_id AND t.created_by = auth.uid()
    )
  );
