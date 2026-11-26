// Eleventy builds the site from src/ into _site/.
// src/ holds everything the site serves: page templates, shared parts
// (_includes/), content (_data/: projects, Home images), and static files
// (css/, js/, images/, favicon/), which are copied as they are.

import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  for (const path of ["css", "js", "images", "favicon", "favicon.ico", "CNAME"]) {
    eleventyConfig.addPassthroughCopy(`src/${path}`);
  }

  // Old site's PDF portfolio page (and its stylesheet), kept until we
  // decide what happens to it.
  for (const path of ["portfolio", "assets", "style.css"]) {
    eleventyConfig.addPassthroughCopy(path);
  }

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
