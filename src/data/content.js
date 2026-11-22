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
 * - Images go in /public and are referenced from the site root ("/assets/...").
 */
export default {
  site: {
    name: "Saif Nawaz",
    title: "Saif Nawaz · AI student & developer",
    description:
      "Saif Nawaz, BS Artificial Intelligence student at the University of Karachi. Building for the web, learning AI, open to internships.",
    url: "", // TODO: production URL, e.g. "https://saifnawaz.vercel.app" (turns on social preview tags)
    location: "Karachi, PK",
    timezone: "Asia/Karachi",
    utcOffset: "UTC+5",
  },

  hero: {
    firstName: "Saif",
    lastName: "Nawaz",
    tagline: "AI student at the University of Karachi",
    status: "Open to internships",
    // *asterisks* here are highlighted in red
    statement: "I build *web apps* and I'm learning how *machines think*.",
    currently: [
      { label: "Now building", value: "Tika, in Laravel" },
      { label: "Reading", value: "Book title" }, // TODO
      { label: "Listening", value: "Artist or album" }, // TODO
    ],
  },

  about: {
    label: "About",
    title: "Hello, I'm Saif.",
    lead: "I'm a BS Artificial Intelligence student at the University of Karachi. I like building things people actually use, and understanding how they work underneath.",
    facts: [
      { label: "Studying", text: "BS Artificial Intelligence, University of Karachi" },
      { label: "Before that", text: "Diploma in Software Development, Aptech" },
      { label: "Outside code", text: "Books, music, cricket, chess and story games" },
    ],
  },

  projects: {
    label: "Work",
    title: "Selected projects",
    items: [
      {
        title: "Tika",
        blurb:
          "A child vaccination booking system. It started as an unfinished PHP project; I'm rebuilding it properly in Laravel with new features and a new identity.",
        role: "Solo",
        stack: ["Laravel", "PHP", "MySQL"],
        status: "In progress",
        image: "", // TODO: e.g. "/assets/projects/tika.webp"
        links: [{ label: "GitHub", url: "" }], // TODO: repo link
      },
      {
        title: "Library System",
        blurb:
          "An OOP course project: all the library logic lives in Python classes, with a web frontend on top and an LLM assistant that only answers library questions.",
        role: "With a teammate",
        stack: ["Python", "OOP", "Web frontend", "LLM"],
        status: "Live",
        image: "/assets/projects/library-system.webp",
        links: [
          { label: "Live site", url: "https://saifnawaz.pythonanywhere.com" },
          { label: "GitHub", url: "" }, // TODO: repo link
        ],
      },
      {
        title: "Assembled",
        blurb:
          "Design hackathon entry: a landing page for a PC shop where the computer comes apart piece by piece as you scroll.",
        role: "With Anas Shiekh",
        stack: ["Web design", "Scroll animation"],
        status: "Live",
        image: "/assets/projects/assembled.webp",
        links: [
          { label: "Live site", url: "https://assembled.foundingdev.com" },
          { label: "GitHub", url: "" }, // TODO: repo link (github.com/saifnawaz/Design-Hackathon is not public)
        ],
      },
    ],
  },

  toolkit: {
    label: "Toolkit",
    title: "Stack & certificates",
    stackTitle: "Stack",
    stack: [
      { name: "JavaScript", tag: "Web" },
      { name: "PHP / Laravel", tag: "Backend" },
      { name: "Python", tag: "AI / Scripting" },
      { name: "C / C++", tag: "Core" },
      { name: "Java", tag: "Core" },
      { name: "SQL", tag: "Data" },
      { name: "Git / GitHub", tag: "Tools" },
    ],
    certificatesTitle: "Certificates",
    certificates: [
      { name: "Diploma in Software Development", issuer: "Aptech" },
      { name: "German A2", issuer: "Goethe-Institut" },
      { name: "Design Hackathon: Assembled", issuer: "founding.dev" },
    ],
  },

  contact: {
    label: "Contact",
    title: "Let's talk",
    note: "I'm looking for software and AI internships. Email is the fastest way to reach me.",
    email: "", // TODO: your email address (the big heading becomes a mailto link)
    links: [
      { label: "GitHub", url: "https://github.com/saifnawaz" },
      { label: "LinkedIn", url: "" }, // TODO
      { label: "Résumé", url: "" }, // TODO: put resume.pdf in /public and use "/resume.pdf"
    ],
  },

  footer: {
    credit: "Designed and built in Karachi",
  },
};
