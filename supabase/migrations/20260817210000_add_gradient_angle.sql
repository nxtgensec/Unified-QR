ALTER TABLE qr_codes ADD COLUMN gradient_angle integer;

UPDATE qr_codes SET gradient_angle = 135 WHERE gradient_type IS NOT NULL;
