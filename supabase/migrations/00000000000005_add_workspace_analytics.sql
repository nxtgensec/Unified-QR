-- Workspace analytics: page views + link clicks
-- Follows the exact same pattern as QR scans (migration 0 + 1)

-- ────────────────────────────────────────────────────────────────────
-- PAGE VIEWS
-- ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.link_page_views (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id      uuid NOT NULL REFERENCES public.link_pages(id) ON DELETE CASCADE,
  viewed_at    timestamptz NOT NULL DEFAULT now(),
  device       text,
  referrer     text,
  city         text,
  country      text,
  country_code text
);

CREATE INDEX IF NOT EXISTS idx_link_page_views_page ON public.link_page_views(page_id, viewed_at DESC);

-- Grants
GRANT SELECT, INSERT ON public.link_page_views TO authenticated;
GRANT INSERT ON public.link_page_views TO anon;
GRANT ALL ON public.link_page_views TO service_role;

-- RLS
ALTER TABLE public.link_page_views ENABLE ROW LEVEL SECURITY;

-- Public can record a view (validated: page must exist)
CREATE POLICY "anyone can record a page view"
  ON public.link_page_views FOR INSERT TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.link_pages p WHERE p.id = page_id)
  );

-- Owner reads views through page ownership chain
CREATE POLICY "owner reads page views"
  ON public.link_page_views FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.link_pages p
      WHERE p.id = link_page_views.page_id AND p.user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────────────
-- LINK CLICKS
-- ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.link_item_clicks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id      uuid NOT NULL REFERENCES public.link_items(id) ON DELETE CASCADE,
  clicked_at   timestamptz NOT NULL DEFAULT now(),
  device       text,
  referrer     text,
  city         text,
  country      text,
  country_code text
);

CREATE INDEX IF NOT EXISTS idx_link_item_clicks_item ON public.link_item_clicks(item_id, clicked_at DESC);

-- Grants
GRANT SELECT, INSERT ON public.link_item_clicks TO authenticated;
GRANT INSERT ON public.link_item_clicks TO anon;
GRANT ALL ON public.link_item_clicks TO service_role;

-- RLS
ALTER TABLE public.link_item_clicks ENABLE ROW LEVEL SECURITY;

-- Public can record a click (validated: item exists)
CREATE POLICY "anyone can record a link click"
  ON public.link_item_clicks FOR INSERT TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.link_items i WHERE i.id = item_id)
  );

-- Owner reads clicks through item → section → page ownership chain
CREATE POLICY "owner reads link clicks"
  ON public.link_item_clicks FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.link_items i
      JOIN public.link_sections s ON s.id = i.section_id
      JOIN public.link_pages p ON p.id = s.page_id
      WHERE i.id = link_item_clicks.item_id AND p.user_id = auth.uid()
    )
  );
