-- Daily visitor counter: one row per UTC/local day, bumped via a SECURITY DEFINER RPC
-- so anonymous visitors can increment without a direct INSERT grant.
CREATE TABLE public.visitor_counts (
  day date PRIMARY KEY,
  count integer NOT NULL DEFAULT 0
);

GRANT SELECT ON public.visitor_counts TO anon, authenticated;
GRANT ALL ON public.visitor_counts TO service_role;

ALTER TABLE public.visitor_counts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads visitor counts" ON public.visitor_counts
  FOR SELECT TO anon, authenticated USING (true);

-- Atomic upsert; returns the new count for today. SECURITY DEFINER bypasses RLS
-- so anonymous callers can increment without INSERT/UPDATE grants on the table.
CREATE OR REPLACE FUNCTION public.increment_visitor_count(p_day date)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  INSERT INTO public.visitor_counts (day, count)
  VALUES (p_day, 1)
  ON CONFLICT (day) DO UPDATE SET count = public.visitor_counts.count + 1
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_visitor_count(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_visitor_count(date) TO anon, authenticated;

-- Ship the full row to Realtime so the badge auto-updates across clients.
ALTER TABLE public.visitor_counts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.visitor_counts;
