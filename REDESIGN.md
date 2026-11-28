# Redesign 2026: site spec

Photography portfolio. Minimal and curated. This file is the source of truth for the redesign.
The Figma file (Website 2.0) is the visual reference.

## Pages

**Home**
- One curated image at a time, 8 in total, no titles.
- Clicking or tapping shows the next image.
- The counter `1/8` at the bottom center is the only UI besides the nav.

**Index**
- A plain list: `Name, type`. Types are editorial, commercial or personal only.
- No numbers, years or lines.
- Desktop: hovering a line shows a small preview image (2 columns, top-aligned with the list) and sets the line in italic.
- Mobile: no hover, so tapping a line opens the project.

**Project** (opened from Index, at `/projects/<slug>/`)
- Images scroll vertically, centered, each fitted in a frame one screen tall (portrait and landscape alike), with about a sixth of a screen between them.
- After the last image, half a screen of white, then other projects as previews in a row, exactly in the middle of the screen, with "Related projects" (body text, like the Index list) centered 128px above them: 4 on large screens, 3 on medium ones (up to 1023px), 2 on phones. Fixed heights (280px, 200px on phones); on very narrow screens they shrink to stay inside the margins. Picked at random on each visit (never the current one). Clicking one opens that project. Without JavaScript, the next ones in the list show.
- Scrolled to the very end, only those previews are visible, centered on an otherwise white screen.
- The nav stays fixed on top.

**Info**
- No photo.
- About: bio, with `@yousri.cherif` as the last line.
- Contact: email, plus "Commissions and rates on request."
- Selected clients stays hidden until there are more clients.
- `© 2026` at the bottom left.
- There is no Close button anywhere on the site.

## Nav
- Desktop: "Yousri Cherif" on the left, `Index   Info` (no comma) at the center, on the page columns: "Index" ends where column 6 ends (the Index preview's right edge), "Info" starts at column 7 (the page content), one gutter apart, "Photographer" on the right.
- Index and Info get parentheses on hover, and the current page keeps them, also in the mobile menu: (Index). In the desktop nav and on Close, they hang outside the word, so the word itself stays aligned. Never on the name. The parentheses are part of the text line, always there but invisible until shown, so nothing moves.
- Small screens: the name on the left and the word "Menu" on the right. It opens a full-screen menu with Index and Info centered and turns into "Close".
- Over photos the nav stays readable: it's white with a "difference" blend, so it shows black on white and inverts over images (as on anadominguez.es).
- The name is in medium weight (500). The current page in the nav is medium italic (tokens `--nav-current-weight` and `--nav-current-style`). The hovered project in Index is italic.

## Type and grid
- Ubuntu Sans 12/16 everywhere (Regular, Medium, Italic, Medium Italic). Pure black `#000` on pure white `#fff`, never grey.
- Selected text: white on black, as on anadominguez.es.
- Desktop grid: 12 columns, 20px margin, 24px gutter.

## Design system
- Every value (font, text sizes, colors, margins, spacing, columns) lives in `src/css/tokens.css`. Change it there and it updates on every page.
- `src/css/site.css` only references tokens and holds no raw values.
- Text roles: body, heading, nav, button and caption. Today they're all 12/16; to change a role, point it to another size.
- Mobile breakpoint: 767px. It's written in both `tokens.css` and `site.css`, because CSS can't use a variable inside a media query.
- No animations for now. Things appear and disappear instantly.

## Code
- The site is built with Eleventy: templates in `src/` become plain HTML in `_site/` (not committed).
- Content lives in `content/`, edited in Pages CMS (setup in `.pages.yml`); design and layout stay in code:
  - `content/projects.json`: every project (name, type, status shown/hidden, images, preview image), in Index order. The preview image shows on Index and under Related projects; if empty, the first image is used. A shown project gets its page, its Index line and a place among the "more projects". Its web address comes from its name.
  - `content/home.json`: the Home images, in order.
  - `content/info.json`: the Info text (about, Instagram, email, contact note).
  - `src/_data/` reads these files and shapes them for the pages (only shown projects, web addresses). `lib/` holds the helpers.
  - When a page gets a new piece of content, add its field to `.pages.yml` and the template in the same commit.
- Shared layout (head, nav, mobile menu): `src/_includes/base.njk`.
- Pages: `src/index.njk` (Home), `src/index/index.njk` (Index), `src/info/index.njk` (Info), `src/projects/project.njk` (one page per project), `src/404.njk`.
- Images: originals in `src/images/`. The build converts every page image to WebP (max 2000px wide) and adds its width and height, so pages don't jump while loading. Visitors only download these copies.
  - Prepare photos before uploading: in Finder, select them, right-click → Quick Actions → "Prepare for website", type the project name. It saves copies (long edge 2000px, JPG quality 85, metadata and GPS removed) as `project-01.jpg`, `project-02.jpg`… all in one folder, `Pictures/Website`. Preparing more photos for a project later continues its numbering, so nothing is overwritten. Originals stay untouched.
    - Code: `tools/prepare-images.js` (macOS only, nothing to install). The Quick Action, `tools/Prepare for website.workflow`, just runs it.
    - Install or update it on a Mac: copy the `.workflow` to `~/Library/Services/`. It expects the repo at `~/Developer/Website`.
  - Names: lowercase with dashes, `project-number.jpg` (e.g. `alaia-01.jpg`). Order is set in the CMS, not by the number.
  - The build stops if an original is over 10 MB (`lib/check-images.js`), so camera files never land in Git's history.
- One script for all pages: `src/js/site.js` (mobile menu, Home click, Index hover).
- Home: clicking the left half of the screen goes to the previous image, the right half to the next. Arrow keys work too: right and up go forward (the counter goes up), left and down go back. With a mouse, the cursor is replaced by the counter (1/4) that follows it and inverts over photos; over the nav it returns to normal. On touch screens the counter stays at the bottom center.
- Preview on your Mac: run `npm start` in the project folder, then open http://localhost:4321. It rebuilds and reloads on every change.

## Code rules
- Clean over quick: no patches on patches. When something changes, restructure so the code reads as if it was written that way from the start.
- No raw values in `site.css`: add or reuse a token.
- CSS order: reset, base, nav, bottom bar, Home, Index and Info, project, small screens.
- JS: one function per feature (`initMenu`, `initHome`, `initIndexPreview`). Use CSS instead of JS wherever CSS can do it (hover states, for example).
- Small commits with clear messages.

## Workflow
- `main` is the live site (GitHub Pages, yousricherif.com).
- `v1` tags the old site.
- All redesign work happens on `redesign`, with small commits.
- To launch:
  1. In GitHub: Settings → Pages → Source: "GitHub Actions" (the site is now built, not served as raw files).
  2. Merge the pull request into `main`. `.github/workflows/deploy.yml` builds and publishes it.
  3. In Pages CMS, switch the branch to `main`: from then on every save goes live within about a minute.
