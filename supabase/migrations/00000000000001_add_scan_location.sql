-- Add geo-location columns to scans table
-- Applied with: npm run db:push

ALTER TABLE public.scans
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS country_code text;
