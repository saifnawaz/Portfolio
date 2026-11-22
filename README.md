# Saif Nawaz · Portfolio

Personal portfolio. Vite + vanilla JS, prerendered to static HTML at build time, deployed on Vercel.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/
npm run preview   # serve the built site locally
```

## Editing content

All text and data live in [`src/data/content.js`](src/data/content.js): bio, facts, projects, stack, certificates, contact links, and page title/description.

- `*word*` sets a word in the accent colour (titles and the about lead).
- An empty `url: ""` shows a muted "(soon)" label instead of a broken link.
- Images go in `public/` and are referenced from the root, e.g. `"/assets/projects/tika.webp"`. Project screenshots look best at 16:10 (1440×900).
- Search the file for `TODO` to find the placeholders: email, LinkedIn, résumé, GitHub repos, the Tika screenshot, and the production URL.

## How it's built

```
index.html               shell with <!--head--> and <!--app--> markers
src/
  data/content.js        all text and data
  sections/              one folder per section (JS + CSS together)
    index.js             the page order: add, remove, reorder here
    hero/  about/  projects/  toolkit/  contact/
  layout/                nav, footer, <head> tags
  lib/                   html templating, scroll reveal, clock, shared partials
  styles/                tokens.css (colours, type, spacing), base.css, fonts
  render.js              builds the page HTML from content + sections
  main.js                client entry: CSS + small behaviours
plugins/
  prerender.js           renders render.js into index.html (build and dev)
  preload-fonts.js       preloads the fonts used above the fold
```

Sections render to HTML on the server, so the shipped page already contains everything and works without JavaScript. Client JS only adds the scroll reveal, the nav show/hide, and the live clock.

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

2. Add `talks: { label: "Talks", title: "...", ... }` to `content.js`. The `label` gives it a number and a nav link.
3. Import it in `src/sections/index.js` and put it in the list.

### Remove or reorder a section

Edit the list in `src/sections/index.js`. Numbering and nav links follow automatically.

### Swap the hero

The hero is a placeholder. Replace `src/sections/hero/` with a new design; keep the page's single `<h1>` in it and read text from `content.hero`. Any element with `data-clock data-tz="Asia/Karachi"` becomes a live clock.

### Change the look

Colours, fonts, type scale and spacing are CSS variables in [`src/styles/tokens.css`](src/styles/tokens.css). Add `data-reveal` to any element to give it the scroll-in animation (stagger with `style="--reveal-i: 1"`).

## Deploy (Vercel)

Push to GitHub, then import the repo in Vercel. The Vite preset is detected automatically (build `npm run build`, output `dist`). Once you have the domain, set `site.url` in `content.js` to turn on canonical and social preview tags.
