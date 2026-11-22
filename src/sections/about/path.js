/**
 * "Path": a timeline (horizontal, vertical on narrow screens) whose line draws
 * itself as you scroll into it. Each point appears as the line reaches it;
 * the last one is red and pulses.
 *
 * The line runs from the first dot to the last: JS measures them and sets
 * --from / --end on the list. Without JS (or with reduced motion) the line
 * is fully drawn and every point is shown.
 */
import { html } from "../../lib/html.js";
import { onResize, onScroll, reducedMotion, whenNear } from "../../lib/scroll.js";

const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

export const renderPath = (points) => html`
  <ol class="path" role="list" style="--n: ${points.length}">
    ${points.map(
      (point) => html`<li class="path__point">
        <span class="path__dot" aria-hidden="true"></span>
        <p class="path__when label">${point.when}</p>
        <p class="path__title">${point.title}</p>
        ${point.detail ? html`<p class="path__detail">${point.detail}</p>` : ""}
      </li>`,
    )}
  </ol>
`;

export function initPath(list) {
  if (!list) return;
  const points = [...list.children];
  let stops = points.map(() => 0); // where each dot sits along the line, 0..1

  const measure = () => {
    const horizontal = getComputedStyle(list).display === "grid";
    const box = list.getBoundingClientRect();
    const centers = points.map((point) => {
      const dot = point.querySelector(".path__dot").getBoundingClientRect();
      return horizontal ? dot.left + dot.width / 2 - box.left : dot.top + dot.height / 2 - box.top;
    });
    const from = centers[0];
    const to = centers[centers.length - 1];
    list.style.setProperty("--from", `${from}px`);
    list.style.setProperty("--end", `${(horizontal ? box.width : box.height) - to}px`);
    stops = centers.map((c) => (c - from) / (to - from || 1));
  };
  // Measured once it is near the screen (fonts are in by then: text wrapping
  // moves the dots on narrow screens), and again on resize.
  whenNear(list, () => {
    (document.fonts?.ready ?? Promise.resolve()).then(measure);
    onResize(measure);
  });

  if (reducedMotion) return;
  list.setAttribute("data-scrub", "");
  let last = -1;
  onScroll(() => {
    const box = list.getBoundingClientRect();
    const start = innerHeight * 0.85; // top of the list here: nothing drawn yet
    const end = innerHeight * 0.55; // bottom of the list here: fully drawn
    const progress = Math.round(clamp01((start - box.top) / (start - end + box.height)) * 1000) / 1000;
    if (progress === last) return;
    last = progress;
    list.style.setProperty("--progress", progress);
    points.forEach((point, i) => point.classList.toggle("is-reached", progress > 0 && progress >= stops[i] - 0.001));
  });
}
