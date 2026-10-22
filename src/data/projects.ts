export type Screenshot = {
  /** Path under public/, e.g. "/projects/tika/dashboard.png" */
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  /** Gallery cell: "wide" spans both columns, "tall" spans two rows (phone shots). */
  layout?: "wide" | "tall";
};

export type CaseStudySection = {
  title: string;
  paragraphs: string[];
  list?: string[];
  stats?: { value: string; label: string }[];
};

export type Project = {
  /** URL of the case study: /projects/<slug> */
  slug: string;
  title: string;
  /** One-liner shown on the card */
  summary: string;
  tags: string[];
  liveUrl: string;
  repoUrl: string;
  /** The first one is used on the card. Leave empty to hide images. */
  screenshots: Screenshot[];
  caseStudy: CaseStudySection[];
  note?: string;
};

export const projects: Project[] = [
  {
    slug: "tika",
    title: "Tika",
    summary:
      "Rebuilt my old PHP semester project into a secure Laravel app with auto vaccination schedules and race-safe booking",
    tags: ["Laravel 13", "PHP 8.5", "MySQL", "Tailwind 4", "Pest", "Playwright"],
    // TODO: replace "#" with the real links. Buttons stay hidden until then.
    liveUrl: "#",
    repoUrl: "#",
    screenshots: [
      {
        src: "/projects/tika/admin-dashboard.webp",
        alt: "Admin overview with stat tiles and charts for doses given per month and overdue doses by vaccine",
        caption: "Admin dashboard",
        width: 1440,
        height: 900,
        layout: "wide",
      },
      {
        src: "/projects/tika/parent-home.webp",
        alt: "Parent home page with an overdue doses alert and a card for each child showing a vaccination progress bar",
        caption: "Parent home",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/tika/child-schedule-phone.webp",
        alt: "Phone-width view of a child's schedule with a progress bar and overdue, upcoming, completed and missed counts",
        caption: "Child schedule on a phone",
        width: 390,
        height: 844,
        layout: "tall",
      },
      {
        src: "/projects/tika/booking-confirm.webp",
        alt: "Last booking step: a four-step indicator (vaccines, hospital, time, confirm) above the appointment summary",
        caption: "Booking, step 4 of 4",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/tika/hospital-stock.webp",
        alt: "Hospital stock page with usable doses per vaccine, a low-stock warning and batches marked expired or expiring soon",
        caption: "Hospital vaccine stock",
        width: 1440,
        height: 900,
      },
      {
        src: "/projects/tika/login.webp",
        alt: "Tika login page with the logo and the tagline Every dose, on time",
        caption: "Login",
        width: 1440,
        height: 900,
      },
    ],
    caseStudy: [
      {
        title: "The problem",
        paragraphs: [
          "Tika started as my semester project: a child vaccination booking site in raw PHP. When I went back to it, almost every page built SQL by pasting user input straight into the query. Passwords were stored in plaintext. The login check only ran in JavaScript, so anyone who knew the right URL could delete data.",
        ],
      },
      {
        title: "The rebuild",
        paragraphs: [
          "Patching it wasn't worth it, so I rebuilt it in Laravel. There are three roles: parent, hospital and admin. A hospital can't take bookings until an admin approves it, and ownership policies make sure parents and hospitals only ever touch their own records. I also gave it a proper identity as Tika.",
        ],
      },
      {
        title: "The hardest part",
        paragraphs: [
          "A race condition in booking. MariaDB defaults to REPEATABLE READ, so when two parents booked the last slot at the same moment, both read it as free and both bookings went through.",
          "I fixed it with locking reads, so the second request waits for the first to finish. To prove each lock was doing real work, I deleted them one at a time and watched its concurrency test fail.",
        ],
      },
      {
        title: "Features",
        paragraphs: [],
        list: [
          "Vaccination schedule generated from the child's date of birth, with each dose marked due, overdue, missed or catch-up",
          "Stock reserved at booking time, with batch expiry handling",
          "Notifications",
          "PDF vaccination certificates",
          "Admin dashboard built on real data",
          "Activity log",
        ],
      },
      {
        title: "Testing",
        paragraphs: [
          "The backend is tested with Pest. On top of that, Playwright checks 28 pages at desktop and phone width, and those checks caught a bug the backend tests had missed for two phases.",
        ],
        stats: [
          { value: "319", label: "Automated tests" },
          { value: "28", label: "Pages checked on desktop + phone" },
        ],
      },
    ],
    note: "Vaccination schedule is demo data, not medical guidance.",
  },
];

export type UpcomingProject = {
  title: string;
  summary: string;
  status: string;
  tags: string[];
};

// Shown below the finished projects as quieter teaser cards.
export const upcomingProjects: UpcomingProject[] = [
  {
    title: "Lecture board to notes",
    summary:
      "An AI app that turns photos of lecture boards into clean notes, flashcards and MCQs.",
    status: "In progress",
    tags: ["Python", "LLM", "OCR"],
  },
];

export const upcomingNote = {
  text: "More projects on the way — I'm building in public, so check back or follow along on",
  linkLabel: "GitHub",
};

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
