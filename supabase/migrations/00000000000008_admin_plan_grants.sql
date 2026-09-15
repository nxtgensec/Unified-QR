-- Admin plan grants audit trail (manual premium access).
-- Allows admins to grant/revoke premium plans for a specific email and keeps
-- a record of who did what, when, and until when.

CREATE TABLE IF NOT EXISTS public.admin_plan_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_email text NOT NULL,
  target_user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('free', 'day', 'week', 'month', 'year')),
  expires_at timestamptz,
  granted_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_plan_grants ENABLE ROW LEVEL SECURITY;

-- Service-role only: grants are written and read server-side by admin functions.
GRANT ALL ON TABLE public.admin_plan_grants TO service_role;
REVOKE ALL ON TABLE public.admin_plan_grants FROM anon, authenticated;

CREATE POLICY "grants_service_role_all" ON public.admin_plan_grants
  FOR ALL TO service_role USING (true) WITH CHECK (true);