-- Add plan_expires_at column to profiles for time-based plans.
-- Free plans never expire; paid plans set this timestamp on payment verification.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan_expires_at timestamptz DEFAULT NULL;

COMMENT ON COLUMN public.profiles.plan_expires_at IS
  'Null for free plans. Set to now() + duration on payment verification.';
