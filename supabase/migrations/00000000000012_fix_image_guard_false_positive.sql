-- Fix false positives in the image data-URL guard.
--
-- The previous implementation scanned decoded raster bytes for text markers
-- such as "<svg", "<style " or "<!DOCTYPE". Real PNG/JPEG files can contain
-- those byte sequences by coincidence (compressed data, EXIF/XMP metadata,
-- ICC profiles, etc.), so valid avatars and logos were rejected with
-- "This image contains disallowed embedded content".
--
-- The guard now validates the actual file signature (magic bytes) instead of
-- looking for text markers. Only genuine raster formats are accepted, which
-- keeps the original security property (no SVG/XML/HTML payloads) without
-- rejecting normal photos. Size limits and the raster-only data URL prefix
-- check are unchanged.

create or replace function public.guard_image_data_url()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
declare
  v_value text;
  v_b64 text;
  v_payload bytea;
  v_len integer;
begin
  execute format('select ($1).%I', tg_argv[0]) using new into v_value;

  if v_value is null or v_value = '' then
    return new;
  end if;

  -- Allow external https?:// image URLs (e.g. Google OAuth avatars) -- those
  -- render inside <img> only and cannot execute scripts via that context.
  if v_value ~* '^https?://' then
    return new;
  end if;

  -- Must be a raster data:image URL, but NOT svg/xml (script-capable carriers).
  if v_value !~* '^data:image/(png|jpe?g|gif|webp|bmp|avif);base64,' then
    raise exception 'Only raster images (PNG/JPEG/WebP/GIF) may be uploaded as data URLs';
  end if;

  -- 6.5 MB cap on the raw data URL (~4.8 MB binary after base64).
  if length(v_value) > 6815744 then
    raise exception 'Image is too large (max ~4 MB binary)';
  end if;

  -- Strip the data URL header and any whitespace before decoding.
  v_b64 := regexp_replace(v_value, '^data:image/[a-z0-9.+-]+;base64,', '', 'i');
  v_b64 := regexp_replace(v_b64, '\s', '', 'g');

  begin
    v_payload := decode(v_b64, 'base64');
  exception
    when others then
      raise exception 'Image data is not valid base64';
  end;

  v_len := octet_length(v_payload);
  if v_len < 12 then
    raise exception 'Image data is empty or truncated';
  end if;

  -- Validate the file signature. This accepts only real raster images and
  -- rejects SVG/XML/HTML relabelled as an image, without false positives from
  -- arbitrary byte sequences inside compressed image data.
  if not (
       -- PNG: 89 50 4E 47 0D 0A 1A 0A
       substring(v_payload from 1 for 8) = decode('89504e470d0a1a0a', 'hex')
       -- JPEG: FF D8 FF
    or substring(v_payload from 1 for 3) = decode('ffd8ff', 'hex')
       -- GIF87a / GIF89a
    or substring(v_payload from 1 for 6) in (
         decode('474946383761', 'hex'),
         decode('474946383961', 'hex')
       )
       -- WebP: "RIFF" .... "WEBP"
    or (
         substring(v_payload from 1 for 4) = decode('52494646', 'hex')
         and substring(v_payload from 9 for 4) = decode('57454250', 'hex')
       )
       -- BMP: "BM"
    or substring(v_payload from 1 for 2) = decode('424d', 'hex')
       -- AVIF: size + "ftyp" + "avif"/"avis" brand
    or (
         substring(v_payload from 5 for 4) = decode('66747970', 'hex')
         and substring(v_payload from 9 for 4) in (
           decode('61766966', 'hex'),
           decode('61766973', 'hex')
         )
       )
  ) then
    raise exception 'This image is not a valid PNG, JPEG, GIF, WebP, BMP or AVIF file';
  end if;

  return new;
end;
$function$;

comment on function public.guard_image_data_url() is
  'Validates raster image data URLs by file signature (PNG/JPEG/GIF/WebP/BMP/AVIF) and size.';
