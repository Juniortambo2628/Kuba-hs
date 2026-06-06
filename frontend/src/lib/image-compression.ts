export type ImageCompressionPreset =
  | "default"
  | "avatar"
  | "thumbnail"
  | "cms"
  | "document"
  | "booking"
  | "review";

export interface ImageCompressionOptions {
  preset?: ImageCompressionPreset;
  /** Skip compression when file is already below this size (bytes). */
  maxBytesBeforeSkip?: number;
}

const PRESET_CONFIG: Record<
  ImageCompressionPreset,
  { maxWidth: number; maxHeight: number; quality: number }
> = {
  default: { maxWidth: 1200, maxHeight: 1200, quality: 0.82 },
  avatar: { maxWidth: 600, maxHeight: 600, quality: 0.85 },
  thumbnail: { maxWidth: 800, maxHeight: 800, quality: 0.8 },
  cms: { maxWidth: 1920, maxHeight: 1920, quality: 0.82 },
  document: { maxWidth: 1600, maxHeight: 1600, quality: 0.85 },
  booking: { maxWidth: 1200, maxHeight: 1200, quality: 0.8 },
  review: { maxWidth: 1200, maxHeight: 1200, quality: 0.8 },
};

const SKIP_TYPES = new Set(["image/svg+xml", "image/gif"]);
const DEFAULT_SKIP_BYTES = 200 * 1024;

function isCompressible(file: Blob): boolean {
  if (!file.type.startsWith("image/")) return false;
  return !SKIP_TYPES.has(file.type);
}

function scaleDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let w = width;
  let h = height;

  if (w > maxWidth) {
    h = Math.round(h * (maxWidth / w));
    w = maxWidth;
  }
  if (h > maxHeight) {
    w = Math.round(w * (maxHeight / h));
    h = maxHeight;
  }

  return { width: w, height: h };
}

function outputMimeType(inputType: string): string {
  if (inputType === "image/png" || inputType === "image/webp") {
    return inputType;
  }
  return "image/jpeg";
}

function fileNameWithMime(name: string, mime: string): string {
  const base = name.replace(/\.[^.]+$/, "") || "image";
  const ext =
    mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  return `${base}.${ext}`;
}

/**
 * Compress and resize a raster image in the browser before upload.
 * Returns the original file for PDFs, SVG, GIF, or when compression does not help.
 */
export async function compressImageFile(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const preset = options.preset ?? "default";
  const maxBytes = options.maxBytesBeforeSkip ?? DEFAULT_SKIP_BYTES;

  if (!isCompressible(file) || file.size <= maxBytes) {
    return file;
  }

  const { maxWidth, maxHeight, quality } = PRESET_CONFIG[preset];
  const mimeType = outputMimeType(file.type);

  try {
    const blob = await compressBlob(file, maxWidth, maxHeight, quality, mimeType);
    if (!blob || blob.size >= file.size) {
      return file;
    }
    return new File([blob], fileNameWithMime(file.name, mimeType), {
      type: mimeType,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

/** Compress a Blob (e.g. Uppy file data) and return a File. */
export async function compressBlobToFile(
  blob: Blob,
  filename: string,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const file =
    blob instanceof File
      ? blob
      : new File([blob], filename, {
          type: blob.type || "image/jpeg",
          lastModified: Date.now(),
        });
  return compressImageFile(file, options);
}

export async function compressImageFiles(
  files: File[],
  options: ImageCompressionOptions = {}
): Promise<File[]> {
  return Promise.all(files.map((f) => compressImageFile(f, options)));
}

/** Map FilePond / media collection names to compression presets. */
export function compressionPresetForCollection(
  collection: string
): ImageCompressionPreset {
  switch (collection) {
    case "avatars":
      return "avatar";
    case "logos":
    case "icons":
      return "thumbnail";
    case "banners":
    case "site_settings":
      return "cms";
    case "thumbnail":
    case "services":
      return "thumbnail";
    case "issue_images":
      return "booking";
    case "review_images":
      return "review";
    default:
      return "default";
  }
}

/** Map admin DashboardImageUpload type slugs to presets. */
export function compressionPresetForAdminType(
  type: "avatar" | "logo" | "cms" | "category_thumbnail"
): ImageCompressionPreset {
  switch (type) {
    case "avatar":
      return "avatar";
    case "logo":
    case "category_thumbnail":
      return "thumbnail";
    case "cms":
    default:
      return "cms";
  }
}

async function compressBlob(
  file: Blob,
  maxWidth: number,
  maxHeight: number,
  quality: number,
  mimeType: string
): Promise<Blob | null> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const img = await loadImage(objectUrl);
    const { width, height } = scaleDimensions(
      img.naturalWidth,
      img.naturalHeight,
      maxWidth,
      maxHeight
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0, width, height);

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), mimeType, quality);
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
