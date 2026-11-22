# Saif Nawaz · Portfolio

Personal portfolio. Vite + vanilla JS, prerendered to static HTML at build time, deployed on Vercel.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/
npm run preview   # serve the built site locally
```

## Editing content

All text and data live in [`src/data/content.js`](src/data/content.js): the About statement, bio, path and interests, projects, stack, certificates, contact links, and page title/description.

- `*word*` sets a word in a quieter secondary tone (in the hero and About statements, red instead).
- The hero's statement and "Currently" list are `hero.statement` and `hero.currently`; `hero.study` is the line in the details under the name. (On phones narrower than 380px the "Currently" list is hidden.)
- Projects: each has a `slug` ("tika"); its row gets the id `project-tika`, which the hero's card stack links to.
- Toolkit: each skill has `usedIn` (project slugs; empty shows "Coursework"), shown when the row is hovered. Certificates take `year` and `image`: with an image, the row previews it on hover and opens it full-screen on click or tap.
- About: `about.path` is the timeline (the last point is red and pulses); `about.interests` are the "Off the clock" words, each with an optional `image` that floats next to the cursor on hover (tap on touch).
- An empty `url: ""` shows a muted "(soon)" label instead of a broken link.
- Images go in `public/` and are referenced from the root, e.g. `"/assets/projects/tika.webp"`. Project screenshots look best at 16:10 (1440×900).
- Search the file for `TODO` to find the placeholders: résumé, GitHub repos, the Tika screenshot, certificate years and images, and the production URL.

## How it's built

```
index.html               shell with <!--head--> and <!--app--> markers
src/
  data/content.js        all text and data
  sections/              one folder per section (JS + CSS together)
    index.js             the page order: add, remove, reorder here
    hero/                the name: fit-to-width, letter intro, cursor field, shrink-into-nav; project card stack
    about/               sticky statement, word-brighten bio, Path timeline, interests
    toolkit/             sticky heading, skill rows with "used in", certificate rows + lightbox
    projects/  contact/
  layout/                nav (+ full-screen menu on phones), footer, <head> tags, background (dot grid)
  lib/                   scroll (Lenis), reveals, magnetic links, cursor, clock, html templating
  styles/                tokens.css (colours, type, spacing), base.css, fonts
  assets/fonts/          Clash Display + Satoshi (self-hosted)
  render.js              builds the page HTML from content + sections
  main.js                client entry: CSS + small behaviours
plugins/
  prerender.js           renders render.js into index.html (build and dev)
  preload-fonts.js       preloads the fonts used above the fold
```

Sections render to HTML on the server, so the shipped page already contains everything and works without JavaScript. Client JS only adds motion and small behaviours (see below), all of which switch off for `prefers-reduced-motion`.

### Add a section

1. Create `src/sections/<id>/<id>.js` (and `<id>.css`):

   ```js
   import "./talks.css";
   import { html } from "../../lib/html.js";
   import { sectionHead } from "../../lib/ui.js";

   export default {
     id: "talks",
     render: ({ talks }, { label, number }) => html`
       <section class="section" id="talks" aria-labelledby="talks-title">
         <div class="wrap">
           ${sectionHead({ id: "talks", number, label, title: talks.title })}
           ...
         </div>
       </section>
     `,
     // init(element) { ... }   optional browser-side behaviour
   };
   ```

2. Add `talks: { label: "Talks", title: "...", ... }` to `content.js`. The `label` gives it a number and a nav link (and a link in the phone menu).
3. Import it in `src/sections/index.js` and put it in the list.

### Remove or reorder a section

Edit the list in `src/sections/index.js`. Numbering and nav links follow automatically.

### Swap the hero

Replace `src/sections/hero/` with a new design; keep the page's single `<h1>` in it and read text from `content.hero`. The current hero sets `dockLogo: true`, which means it reveals the nav logo itself (the name shrinks into it, `hero/morph.js`). A hero without that flag gets an always-visible nav logo. Any element with `data-clock data-tz="Asia/Karachi"` becomes a live clock.

### Change the look

Colours, fonts, type scale and spacing are CSS variables in [`src/styles/tokens.css`](src/styles/tokens.css). The palette is monochrome plus one red (`--accent`), used in a few bold places: hero highlights, the project-row hover fill, the contact section, and small details. Text on red uses `--on-accent` (near-black, 5.65:1) or `--on-accent-muted` (4.77:1); white on red fails AA, so avoid it.

Background: a fixed canvas dot grid (`layout/background.js`; dots warm to red near the cursor on desktop), a drifting red glow behind the hero (`hero/glow.js`) and a static film grain (`base.css`). All of it is static with reduced motion.

### Motion toolkit

| Attribute / module | Effect |
| --- | --- |
| `data-reveal` | Fades up when scrolled into view. Stagger with `style="--reveal-i: 1"`. |
| `data-split` | Plain-text heading/paragraph revealed line by line (mask slide-up). |
| `data-magnetic` | Link drifts toward the cursor (desktop). |
| `lib/scroll.js` | Lenis smooth scroll; `onScroll(fn)` / `onResize(fn)` for scroll-linked effects. |
| `lib/cursor.js` | Custom cursor dot that grows over links (desktop mouse only). |
| `lib/preview.js` | Floating image next to the cursor over items with `data-image` (project rows, interests, certificates). |
| `lib/lightbox.js` | Full-screen image viewer (modal dialog; Esc, click outside or Close; focus stays inside). |
| `.cols` (base.css) | Two columns with a sticky label + heading on the left (`asideHead()` in `lib/ui.js`); About and Toolkit use it. |

Everything is off with `prefers-reduced-motion`: native scrolling, no animations, all content visible.

## Fonts

Self-hosted. [Clash Display](https://www.fontshare.com/fonts/clash-display) and [Satoshi](https://www.fontshare.com/fonts/satoshi) from Fontshare (ITF Free Font License, free for personal and commercial use) live in `src/assets/fonts/`. Geist Mono (SIL OFL) comes from `@fontsource/geist-mono`.

## Deploy (Vercel)

Push to GitHub, then import the repo in Vercel. The Vite preset is detected automatically (build `npm run build`, output `dist`). Once you have the domain, set `site.url` in `content.js` to turn on canonical and social preview tags.
