/* Client entry: styles plus small behaviours. The HTML itself is prerendered. */
import "./styles/index.css";
import sections from "./sections/index.js"; // also pulls in each section's CSS
import "./layout/footer.js"; // for its CSS
import { initReveal } from "./lib/reveal.js";
import { initClock } from "./lib/clock.js";

window.__portfolioReady = true;

for (const section of sections) {
  const element = document.getElementById(section.id);
  if (element) section.init?.(element);
}

initReveal();
initClock();
