/* Client entry: styles plus small behaviours. The HTML itself is prerendered. */
import "./styles/index.css";
import sections from "./sections/index.js"; // also pulls in each section's CSS
import "./layout/footer.js"; // for its CSS
import { initNav } from "./layout/nav.js";
import { initScroll } from "./lib/scroll.js";
import { initReveal } from "./lib/reveal.js";
import { initClock } from "./lib/clock.js";
import { initMagnetic } from "./lib/magnetic.js";
import { initCursor } from "./lib/cursor.js";
import { initBackground } from "./layout/background.js";
import { initHeadingSlide } from "./lib/touch.js";

window.__portfolioReady = true;

function start() {
  initScroll();

  for (const section of sections) {
    const element = document.getElementById(section.id);
    if (element) section.init?.(element);
  }

  initNav();
  initReveal();
  initHeadingSlide();
  initClock();
  initMagnetic();
  initCursor();
}

// Start one frame in: the browser first lays out and paints the prerendered
// page on its own, so the measurements below read a finished layout instead
// of forcing the first (most expensive) one inside this script.
requestAnimationFrame(() => setTimeout(start, 0));

// Decorative background: after load, off the critical path.
const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 200));
window.addEventListener("load", () => idle(initBackground), { once: true });
