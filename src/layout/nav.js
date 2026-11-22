/**
 * Fixed top nav. Links are generated from the sections that have a label in
 * content.js, so adding or removing a section updates the nav by itself.
 */
import "./nav.css";
import { html } from "../lib/html.js";

const initials = (name) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .join("");

export default function nav({ site }, sections) {
  return html`
    <header class="site-nav" data-nav>
      <div class="wrap site-nav__inner">
        <a class="site-nav__brand" href="#main" aria-label="${site.name}, back to top">
          <span class="site-nav__brand-full">${site.name}</span>
          <span class="site-nav__brand-short">${initials(site.name)}</span>
        </a>
        <nav aria-label="Sections">
          <ul class="site-nav__links label" role="list">
            ${sections
              .filter((section) => section.label)
              .map((section) => html`<li><a href="#${section.id}">${section.label}</a></li>`)}
          </ul>
        </nav>
      </div>
    </header>
  `;
}

/** Hide while scrolling down, show on the way back up. */
export function initNav() {
  const header = document.querySelector("[data-nav]");
  if (!header) return;

  let lastY = window.scrollY;
  let queued = false;

  const update = () => {
    queued = false;
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 24);
    if (Math.abs(y - lastY) < 6) return; // ignore tiny jitters
    header.classList.toggle("is-hidden", y > lastY && y > window.innerHeight * 0.5);
    lastY = y;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  // Never hide it while a keyboard user is inside it.
  header.addEventListener("focusin", () => header.classList.remove("is-hidden"));
  update();
}
