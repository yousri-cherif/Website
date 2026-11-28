// Stops the build when an original image is too large, so a full-size
// camera file never ends up in the repository (Git keeps every file in
// its history, even after it is deleted). Visitors never download the
// originals: the build makes small WebP copies. Only image files are
// checked.

import { readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const MAX_IMAGE_MB = 10;
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

export async function checkImageSizes(dir) {
  const tooLarge = [];

  for (const name of await readdir(dir)) {
    if (!IMAGE_EXTENSIONS.includes(extname(name).toLowerCase())) continue;
    const { size } = await stat(join(dir, name));
    const mb = size / 1024 / 1024;
    if (mb > MAX_IMAGE_MB) tooLarge.push(`${name} (${mb.toFixed(1)} MB)`);
  }

  if (tooLarge.length) {
    throw new Error(
      `Images over ${MAX_IMAGE_MB} MB: ${tooLarge.join(", ")}. ` +
        "Export them as JPG, long edge 2000px, quality 85, and upload again.",
    );
  }
}
