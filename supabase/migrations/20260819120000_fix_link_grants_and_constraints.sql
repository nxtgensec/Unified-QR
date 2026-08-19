-- Fix C5: Add missing GRANTs for link tables (without these, anon/authenticated get permission errors)
GRANT SELECT ON public.link_pages TO anon, authenticated;
GRANT SELECT ON public.link_sections TO anon, authenticated;
GRANT SELECT ON public.link_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.link_pages TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.link_sections TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.link_items TO authenticated;
GRANT ALL ON public.link_pages TO service_role;
GRANT ALL ON public.link_sections TO service_role;
GRANT ALL ON public.link_items TO service_role;

-- Fix C6/H5: Validate destination URLs are http(s) only
ALTER TABLE public.qr_codes
  ADD CONSTRAINT valid_destination CHECK (
    destination IS NULL OR destination ~ '^https?://'
  );

-- Fix M6: Validate link page slugs
ALTER TABLE public.link_pages
  ADD CONSTRAINT valid_slug CHECK (
    slug ~ '^[a-z0-9-]+$'
  );
