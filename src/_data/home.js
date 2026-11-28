// The Home images, in order.

import { readContent } from "../../lib/content.js";

export default async function () {
  const { images } = await readContent("home");
  return images;
}
