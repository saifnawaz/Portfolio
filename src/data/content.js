/**
 * All text and data for the site lives here.
 * Section modules (src/sections/*) only handle layout.
 *
 * Conventions
 * - Each section reads the block with the same key as its id
 *   (sections/about reads `about`, and so on).
 * - A block with a `label` gets a numbered heading and a nav link.
 * - Wrap words in *asterisks* to set them in a quieter secondary tone.
 * - An empty url ("") renders as a muted "soon" label, never a broken link.
 * - Images go in /public/images/{projects,certs,interests} as WebP and are
 *   referenced from the site root ("/images/projects/tika.webp").
 */
export default {
  site: {
    name: "Saif Nawaz",
    title: "Saif Nawaz · AI student & developer",
    description:
      "Saif Nawaz, BS Artificial Intelligence student at the University of Karachi. Building for the web, learning AI, open to internships.",
    url: "https://saifnawaz.vercel.app", // turns on social preview tags
    location: "Karachi, PK",
    timezone: "Asia/Karachi",
    utcOffset: "UTC+5",
  },

  hero: {
    firstName: "Saif",
    lastName: "Nawaz",
    study: "BS-AI · University of Karachi", // shown in the details under the name
    status: "Open to internships",
    // *asterisks* here are highlighted in red
    statement: "I build *web apps* and I'm learning how *machines think*.",
    currently: [
      { label: "Now building", value: "Lecture Notes AI" },
      { label: "Reading", value: "Tuesdays with Morrie" },
    ],
  },

  about: {
    label: "About",
    // *asterisks* here are highlighted in red
    statement: "I like knowing how things work *underneath*.",
    bio: "I'm Saif. I love building things, reading, and thinking about how stuff works. I'm studying AI because I want to understand how machines learn, and I enjoy figuring out how computers work underneath.",
    pathTitle: "Path",
    // The line draws through these in order; the last point is red and pulses.
    path: [
      { when: "Before", title: "Aptech", detail: "Diploma in Software Development" },
      { when: "Now", title: "University of Karachi", detail: "BS Artificial Intelligence" },
      { when: "Next", title: "Internship", detail: "Software or AI" },
    ],
    interestsTitle: "Off the clock",
    // image is optional: on hover it floats next to the cursor (tap on touch).
    // Add imageAlt to describe it; leave it out if the image is decorative.
    interests: [
      { name: "Books", image: "" }, // e.g. "/images/interests/books.webp"
      { name: "Cricket", image: "" },
      { name: "Chess", image: "" },
    ],
  },

  projects: {
    label: "Work",
    title: "Selected projects",
    items: [
      {
        slug: "tika", // used in links (#project-tika) and by toolkit.stack[].usedIn
        title: "Tika",
        blurb:
          "A child vaccination booking system. It started as an unfinished PHP project; I'm rebuilding it properly in Laravel with new features and a new identity.",
        role: "Solo",
        stack: ["Laravel", "PHP", "MySQL"],
        status: "Complete",
        image: "/images/projects/tika.webp",
        imageAlt: "Tika's landing page",
        links: [{ label: "GitHub", url: "https://github.com/saifnawaz/Tika.git" }],
      },
      {
        slug: "library",
        title: "Library System",
        blurb:
          "An OOP course project: all the library logic lives in Python classes, with a web frontend on top and an LLM assistant that only answers library questions.",
        role: "With a teammate",
        stack: ["Python", "OOP", "Web frontend", "LLM"],
        status: "Live",
        image: "/images/projects/library-system.webp",
        links: [
          { label: "Live site", url: "https://saifnawaz.pythonanywhere.com" },
          { label: "GitHub", url: "https://github.com/saifnawaz/University-Library-Management-System.git" }, // TODO: repo link
        ],
      },
      {
        slug: "assembled",
        title: "Assembled",
        blurb:
          "Design hackathon entry: a landing page for a PC shop where the computer comes apart piece by piece as you scroll.",
        role: "With Anas Shiekh",
        stack: ["founding.dev AI builder", "Design"],
        status: "Live",
        image: "/images/projects/assembled.webp",
        links: [{ label: "Live site", url: "https://assembled.foundingdev.com" }],
      },
    ],
  },

  toolkit: {
    label: "Toolkit",
    title: "Stack & certificates",
    stackTitle: "Stack",
    // usedIn: project slugs (see projects.items[].slug). Empty shows "Coursework".
    stack: [
      { name: "JavaScript", tag: "Web", usedIn: ["library", "assembled"] },
      { name: "PHP / Laravel", tag: "Backend", usedIn: ["tika"] },
      { name: "Python", tag: "AI / Scripting", usedIn: ["library"] },
      { name: "C / C++", tag: "Core", usedIn: [] },
      { name: "Java", tag: "Core", usedIn: [] },
      { name: "SQL", tag: "Data", usedIn: ["tika"] },
      { name: "Git / GitHub", tag: "Tools", usedIn: ["tika", "library", "assembled"] },
    ],
    certificatesTitle: "Certificates",
    // image: a scan or photo of the certificate (e.g. "/images/certs/aptech.webp").
    // With an image, the row previews it on hover and opens it full-screen on click.
    certificates: [
      { name: "Diploma in Software Development", issuer: "Aptech", year: "2026", image: "" },
      { name: "German A2 course", issuer: "Goethe-Institut", year: "2026", image: "" },
      {
        name: "Vortex Science Olympiad: Winner, Al-Khawrizmi's Arithmetic module",
        issuer: "Bahria College",
        year: "2025",
        image: "/images/certs/vortex-arithmetic-winner.webp",
        imageAlt: "Vortex Science Olympiad trophy: Al Khawrizmi's Arithmetic Module Winner",
      },
      {
        name: "Agent Sprint, The Engineer's Code 2026 (participation)",
        issuer: "SENTEC · NED",
        year: "2026",
        image: "/images/certs/sentec-agent-sprint.webp",
      },
      {
        name: "Vibe Coding Competition, TechFest'26 (participation)",
        issuer: "CS&IT · NED",
        year: "2026",
        image: "/images/certs/techfest-vibe-coding.webp",
      },
      {
        name: "Design Hackathon: Assembled (participation)",
        issuer: "founding.dev",
        year: "2026",
        image: "/images/certs/founding-dev-hackathon.webp",
      },
      {
        name: "Professional Networking for Career Growth",
        issuer: "HP LIFE",
        year: "2026",
        image: "/images/certs/hp-life-networking.webp",
      },
    ],
  },

  contact: {
    label: "Contact",
    title: "Let's talk",
    note: "I'm looking for software and AI internships. Email is the fastest way to reach me.",
    email: "saifaptech100@gmail.com", // the big heading becomes a mailto link
    links: [
      { label: "GitHub", url: "https://github.com/saifnawaz" },
      { label: "LinkedIn", url: "www.linkedin.com/in/saif-nawaz-154891352" },
      { label: "Résumé", url: "" }, // TODO: put resume.pdf in /public and use "/resume.pdf"
    ],
  },

  footer: {
    credit: "Designed and built in Karachi",
  },
};
