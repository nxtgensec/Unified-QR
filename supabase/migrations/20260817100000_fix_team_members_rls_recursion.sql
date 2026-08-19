-- Fix infinite recursion in team_members RLS policies.
--
-- The old policies queried team_members from within a policy ON team_members,
-- causing PostgreSQL to loop forever. Fix: check against the teams table
-- (no self-reference) + allow reading your own row.

DROP POLICY IF EXISTS "member reads own teams" ON public.team_members;
CREATE POLICY "member reads own teams" ON public.team_members FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.created_by = auth.uid())
);

DROP POLICY IF EXISTS "leave team or owner removes member" ON public.team_members;
CREATE POLICY "leave team or owner removes member" ON public.team_members FOR DELETE TO authenticated USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.teams t WHERE t.id = team_id AND t.created_by = auth.uid())
);
