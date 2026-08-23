-- Add source and batch_id columns to qr_codes so bulk-created codes
-- are distinguishable from individually-created ones.

ALTER TABLE public.qr_codes
  ADD COLUMN source text NOT NULL DEFAULT 'individual',
  ADD COLUMN batch_id text;

ALTER TABLE public.qr_codes
  ADD CONSTRAINT qr_codes_source_check CHECK (source IN ('individual', 'bulk'));

CREATE INDEX idx_qr_codes_source ON public.qr_codes (source);
CREATE INDEX idx_qr_codes_batch_id ON public.qr_codes (batch_id) WHERE batch_id IS NOT NULL;
