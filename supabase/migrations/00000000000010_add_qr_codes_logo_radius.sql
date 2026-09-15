-- Add logo corner radius to saved QR codes for the round-to-square logo slider.

ALTER TABLE public.qr_codes
  ADD COLUMN logo_radius integer;