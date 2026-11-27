// Eleventy builds the site from src/ into _site/.
// src/ holds everything the site serves: page templates, shared parts
// (_includes/), data for the pages (_data/), and static files (css/, js/,
// images/, favicon/), which are copied as they are.
// content/ holds the text and image lists edited in Pages CMS; the data
// files in src/_data/ read it.

import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { CONTENT_DIR } from "./lib/content.js";
import { checkImageSizes } from "./lib/check-images.js";

export default function (eleventyConfig) {
  for (const path of ["css", "js", "images", "favicon", "favicon.ico", "CNAME"]) {
    eleventyConfig.addPassthroughCopy(`src/${path}`);
  }

  // Old site's PDF portfolio page (and its stylesheet), kept until we
  // decide what happens to it.
  for (const path of ["portfolio", "assets", "style.css"]) {
    eleventyConfig.addPassthroughCopy(path);
  }

  // Rebuild in the preview when CMS content changes.
  eleventyConfig.addWatchTarget(`${CONTENT_DIR}/`);

  eleventyConfig.on("eleventy.before", () => checkImageSizes("src/images"));

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  // Text typed in the CMS with blank lines between paragraphs → paragraphs.
  eleventyConfig.addFilter("paragraphs", (text) =>
    text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
  );

  // Every <img> in the pages is converted to WebP, at most 2000px wide,
  // and gets its real width and height, so the page never jumps while
  // images load. The originals in images/ stay untouched.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp"],
    widths: [2000],
    urlPath: "/img/",
    outputDir: "_site/img/",
    htmlOptions: {
      imgAttributes: { decoding: "async" },
    },
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
