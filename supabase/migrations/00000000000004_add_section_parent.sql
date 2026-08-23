-- Allow sub-sections within link_sections for nested organization.

ALTER TABLE public.link_sections
  ADD COLUMN parent_id uuid REFERENCES public.link_sections(id) ON DELETE SET NULL;

CREATE INDEX idx_link_sections_parent ON public.link_sections (parent_id) WHERE parent_id IS NOT NULL;
