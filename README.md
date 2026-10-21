# Saif Nawaz — Portfolio

My personal portfolio site: a single page with a short intro, skills, education, projects and contact links. It's a fully static site, built to be fast on phones and deployed on Vercel.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) with TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev) for animations, loaded through `LazyMotion` to keep the bundle small
- [Lenis](https://lenis.darkroom.engineering) for smooth inertia scrolling
- `next/font`: Bricolage Grotesque for headings and body, Martian Mono for labels, nav and buttons

## Features

- Light theme by default with a dark toggle that remembers the choice. An inline script applies the saved theme before first paint, so there is no flash.
- Sticky navbar that blurs the background on scroll and collapses to a menu on mobile.
- Animations:
  - The hero name slides up letter by letter from behind a mask.
  - Section headings get a mask reveal; content fades up as it scrolls into view.
  - Skills are shown as infinite marquee rows of chips.
  - A thin scroll-progress bar runs along the top of the page.
- `prefers-reduced-motion` turns off Lenis, the marquee and all slide animations.
- One accent color, set by a single CSS variable.
- No backend. The page is prerendered as static HTML.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx        # fonts, metadata, theme script, navbar + footer
│   ├── page.tsx          # section order
│   └── globals.css       # color tokens (light/dark) and the accent color
├── components/
│   ├── sections/         # one component per section
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Education.tsx
│   │   ├── Projects.tsx
│   │   └── Contact.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx
│   ├── ProjectCard.tsx
│   ├── Section.tsx       # shared section wrapper (spacing + numbered heading)
│   ├── SectionHeading.tsx
│   ├── Marquee.tsx       # infinite chip row used by Skills
│   ├── Reveal.tsx        # fade/slide-up on scroll
│   ├── SmoothScroll.tsx  # Lenis setup
│   ├── ScrollProgress.tsx
│   ├── MotionProvider.tsx
│   ├── Container.tsx
│   └── icons.tsx
├── data/                 # all personal content lives here
│   ├── site.ts           # name, intro, about, contact links, nav (nav order = section numbers)
│   ├── skills.ts
│   ├── education.ts
│   └── projects.ts
└── lib/
    └── motion.ts         # shared animation presets
```

## Editing content

All content lives in `src/data/`, so components never need to change for a content update.

- **Contact links:** `contact` in `src/data/site.ts`
- **Add a project:** append an entry to `projects` in `src/data/projects.ts`. While the list is empty, the section shows a "currently building" state.
- **Accent color:** `--accent` at the top of `src/app/globals.css`

## Deploying

Push to GitHub and import the repo on [Vercel](https://vercel.com/new). No configuration or environment variables are needed.
