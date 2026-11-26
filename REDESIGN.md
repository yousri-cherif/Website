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

**Project** (opened from Index)
- Images are the same size and centered. They scroll vertically, one per screen.
- Desktop: the project name is fixed on the left and the counter `1/n` is fixed on the right, both at the vertical center. The counter updates on scroll.
- Mobile: the images are full width, and the name and counter sit in a small fixed bar at the bottom.

**Info**
- No photo.
- About: bio, with `@yousri.cherif` as the last line.
- Contact: email, plus "Commissions and rates on request."
- Selected clients stays hidden until there are more clients.
- `© 2026` at the bottom left.
- There is no Close button anywhere on the site.

## Nav
- Desktop: "Yousri Cherif" on the left, `Index   Info` (no comma, 32px apart plus the invisible parentheses) at the center, "Photographer" on the right.
- Index and Info get parentheses on hover, and the current page keeps them, also in the mobile menu: (Index). Close gets them on hover too, hanging outside the word so it stays flush with the margin. Never on the name. The parentheses are part of the text line, always there but invisible until shown, so they align with the text and nothing moves.
- Mobile: the name on the left and `Index, Info` on the right.
- The name is in medium weight (500). The current page in the nav is medium italic (tokens `--nav-current-weight` and `--nav-current-style`). The hovered project in Index is italic.

## Type and grid
- Ubuntu Sans 12/16 everywhere (Regular, Medium, Italic, Medium Italic). Pure black `#000` on pure white `#fff`, never grey.
- Selected text: white on black, as on anadominguez.es.
- Desktop grid: 12 columns, 20px margin, 20px gutter.

## Design system
- Every value (font, text sizes, colors, margins, spacing, columns) lives in `css/tokens.css`. Change it there and it updates on every page.
- `css/site.css` only references tokens and holds no raw values.
- Text roles: body, heading, nav, button and caption. Today they're all 12/16; to change a role, point it to another size.
- Mobile breakpoint: 767px. It's written in both `tokens.css` and `site.css`, because CSS can't use a variable inside a media query.
- No animations for now. Things appear and disappear instantly.

## Code
- Pages: `index.html` (Home), `index/index.html` (Index), `info/index.html` (Info).
- One script for all pages: `js/site.js` (mobile menu, Home click, Index hover).
- Home: clicking the left half of the screen goes to the previous image, the right half to the next. Arrow keys work too. With a mouse, the cursor is replaced by the counter (1/4) that follows it and inverts over photos; over the nav it returns to normal. On touch screens the counter stays at the bottom center.
- Preview on your Mac: run `python3 -m http.server 4321`, then open http://localhost:4321.

## Code rules
- Clean over quick: no patches on patches. When something changes, restructure so the code reads as if it was written that way from the start.
- No raw values in `site.css`: add or reuse a token.
- CSS order: reset, base, nav, bottom bar, Home, Index and Info, small screens.
- JS: one function per feature (`initMenu`, `initHome`, `initIndexPreview`). Use CSS instead of JS wherever CSS can do it (hover states, for example).
- Small commits with clear messages.

## Workflow
- `main` is the live site (GitHub Pages, yousricherif.com).
- `v1` tags the old site.
- All redesign work happens on `redesign`, with small commits.
- To launch, merge the pull request into `main`.
