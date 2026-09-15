create or replace function public.guard_image_data_url()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
declare
  v_value text;
  v_payload bytea;
begin
  execute format('select ($1).%I', tg_argv[0]) using new into v_value;

  if v_value is null or v_value = '' then
    return new;
  end if;

  -- Allow external https?:// image URLs (e.g. Google OAuth avatars) -- those
  -- render inside <img> only and cannot execute scripts via that context.
  if v_value ~ '^https?://' then
    return new;
  end if;

  -- Must be a data:image URL, but NOT svg/xml (script-capable carriers).
  if v_value !~ '^data:image/(png|jpe?g|gif|webp|bmp|avif);base64,' then
    raise exception 'Only raster images (PNG/JPEG/WebP/GIF) may be uploaded as data URLs';
  end if;

  -- 6.5 MB cap on the raw data URL (-- a 4.8 MB binary file after base64).
  if length(v_value) > 6815744 then
    raise exception 'Image is too large (max ~4 MB binary)';
  end if;

  -- Reject rasters whose decoded payload is actually an SVG/XML/HTML that has
  -- been relabelled (base64 of "<svg", "<?xml" or "<script" markers).
  -- We search the decoded bytes directly: converting binary to TEXT would fail
  -- because PostgreSQL text cannot contain NUL bytes (images may contain them).
  v_payload := decode(regexp_replace(v_value, '^data:image/[a-z0-9.+-]+;base64,', ''), 'base64');

  if position(convert_to('<svg', 'UTF8') in v_payload) > 0
     or position(convert_to('<script', 'UTF8') in v_payload) > 0
     or position(convert_to('<!DOCTYPE', 'UTF8') in v_payload) > 0
     or position(convert_to('<html', 'UTF8') in v_payload) > 0
     or position(convert_to('<iframe', 'UTF8') in v_payload) > 0
     or position(convert_to('<object', 'UTF8') in v_payload) > 0
     or position(convert_to('<embed', 'UTF8') in v_payload) > 0
     or position(convert_to('<style ', 'UTF8') in v_payload) > 0 then
    raise exception 'This image contains disallowed embedded content';
  end if;

  return new;
end;
$function$;