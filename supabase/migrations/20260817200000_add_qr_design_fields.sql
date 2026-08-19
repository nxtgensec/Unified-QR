-- Add QR design customization columns to qr_codes table.
-- These columns store per-code overrides for body shape, eye shape,
-- gradient, frame/CTA, and logo. NULL means "use template default".

ALTER TABLE public.qr_codes
  ADD COLUMN body_shape   text,
  ADD COLUMN eye_shape    text,
  ADD COLUMN gradient_type text,
  ADD COLUMN gradient_color text,
  ADD COLUMN frame_text   text,
  ADD COLUMN frame_style  text,
  ADD COLUMN logo_url     text;
