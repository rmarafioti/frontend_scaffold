// Scaffold element (with PhotoPicker.jsx): shrinks a visitor's photo in the browser before the
// contact form sends it, as docs/cms/contact.md → Photos says, so 3 photos fit under the Server
// Action's body limit. Re-encoding as a jpg also strips the photo's metadata (a phone's GPS
// location), so it never leaves the browser. Browser-only: it uses createImageBitmap and canvas.

const MAX_SIDE = 1600;
const MAX_BYTES = 1024 * 1024;
// Tried in order: the guide's 0.8 first, then once lower if the photo is still over 1 MB.
const JPEG_QUALITIES = [0.8, 0.6];

// The size that fits the long side within maxSide, keeping the aspect ratio. Never scales up.
export function scaledSize(width, height, maxSide = MAX_SIDE) {
  const scale = Math.min(1, maxSide / Math.max(width, height));
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function toJpegBlob(canvas, quality) {
  return new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
}

// Returns the shrunk photo as a jpg File named `name`, or null when it can't be decoded or is
// still over 1 MB at the lowest quality.
export async function shrinkPhoto(file, name) {
  let bitmap;
  try {
    // "from-image" applies the photo's rotation, so a phone photo stays upright.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null;
  }

  const { width, height } = scaledSize(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  for (const quality of JPEG_QUALITIES) {
    const blob = await toJpegBlob(canvas, quality);
    if (blob && blob.size <= MAX_BYTES)
      return new File([blob], name, { type: "image/jpeg" });
  }
  return null;
}
