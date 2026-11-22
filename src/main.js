/* Client entry: styles plus small behaviours. The HTML itself is prerendered. */
import "./styles/index.css";
import sections from "./sections/index.js";
import { initReveal } from "./lib/reveal.js";
import { initClock } from "./lib/clock.js";

window.__portfolioReady = true;

for (const section of sections) {
  const element = document.getElementById(section.id);
  if (element) section.init?.(element);
}

initReveal();
initClock();
