// Reads the files in content/, the part of the site edited in Pages CMS
// (see .pages.yml). Templates never read these files directly: the data
// files in src/_data/ load them and shape them for the pages.

import { readFile } from "node:fs/promises";

export const CONTENT_DIR = "content";

export async function readContent(name) {
  const file = new URL(`../${CONTENT_DIR}/${name}.json`, import.meta.url);
  return JSON.parse(await readFile(file, "utf8"));
}

// "White Suit" → "white-suit". Used for project web addresses.
export function slugify(text) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
