export type NormalizeImageOptions = {
  /** Maximum width/height of the output canvas, in pixels. */
  maxSize?: number;
  /** "cover" centre-crops to a square; "contain" letterboxes the whole image. */
  fit?: "cover" | "contain";
  /** Output encoding. PNG preserves transparency and strips metadata. */
  mime?: "image/png" | "image/webp";
  quality?: number;
};

const ALLOWED_MIME = /^image\/(png|jpe?g|gif|webp|bmp|avif)$/i;
const ALLOWED_EXT = /\.(png|jpe?g|gif|webp|bmp|avif)$/i;

/**
 * Reads an image file and re-encodes it through a canvas.
 *
 * This does three useful things for us:
 *  - strips EXIF/XMP/ICC metadata (including accidental text markers that
 *    older database guards mistook for embedded SVG/HTML);
 *  - shrinks avatars/logos to a sane size before they are stored as data URLs;
 *  - rasterises images that are really SVG/HEIC/etc. under a different name,
 *    so the stored value is always a genuine raster PNG/WebP.
 */
export async function normalizeImageFile(
  file: File,
  { maxSize = 512, fit = "cover", mime = "image/png", quality = 0.92 }: NormalizeImageOptions = {},
): Promise<string> {
  const typeOk = file.type ? ALLOWED_MIME.test(file.type) : false;
  const extOk = ALLOWED_EXT.test(file.name);
  if ((!typeOk && !extOk) || /\.svg($|\?)/i.test(file.name)) {
    throw new Error("UNSUPPORTED_IMAGE_TYPE");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    if (!sourceWidth || !sourceHeight) throw new Error("INVALID_IMAGE");

    const canvas = document.createElement("canvas");
    canvas.width = maxSize;
    canvas.height = maxSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("CANVAS_UNAVAILABLE");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (fit === "cover") {
      const side = Math.min(sourceWidth, sourceHeight);
      const sx = (sourceWidth - side) / 2;
      const sy = (sourceHeight - side) / 2;
      ctx.drawImage(image, sx, sy, side, side, 0, 0, maxSize, maxSize);
    } else {
      const scale = Math.min(maxSize / sourceWidth, maxSize / sourceHeight);
      const drawWidth = Math.max(1, Math.round(sourceWidth * scale));
      const drawHeight = Math.max(1, Math.round(sourceHeight * scale));
      ctx.drawImage(
        image,
        Math.round((maxSize - drawWidth) / 2),
        Math.round((maxSize - drawHeight) / 2),
        drawWidth,
        drawHeight,
      );
    }

    return canvas.toDataURL(mime, quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("INVALID_IMAGE"));
    image.src = src;
  });
}
