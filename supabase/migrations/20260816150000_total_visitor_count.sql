-- Total visitor count: sum of all daily rows.
CREATE OR REPLACE FUNCTION public.get_total_visitor_count()
RETURNS integer
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(SUM(count), 0)::integer FROM public.visitor_counts;
$$;

REVOKE ALL ON FUNCTION public.get_total_visitor_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_total_visitor_count() TO anon, authenticated;
