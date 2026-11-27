// The projects shown on the site, in the order set in the CMS.
// Projects with status "hidden" are left out everywhere.
// Each project's web address comes from its name.

import { readContent, slugify } from "../../lib/content.js";

export default async function () {
  const { projects } = await readContent("projects");
  const shown = projects
    .filter((project) => project.status === "shown")
    .map((project) => ({ ...project, slug: slugify(project.name) }));

  const slugs = shown.map((project) => project.slug);
  const duplicate = slugs.find((slug, i) => slugs.indexOf(slug) !== i);
  if (duplicate) {
    throw new Error(`Two projects share the web address /projects/${duplicate}/. Rename one of them.`);
  }

  return shown;
}
