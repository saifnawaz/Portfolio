/**
 * Hover preview: one floating image that follows the cursor while it is over
 * an item with a `data-image` inside `list`. Used by the project rows and the
 * About interests. Mouse only, off for reduced motion (callers show the image
 * inline instead).
 *
 *   initPreview(listElement, { item: ".project" })
 */
import "./preview.css";
import { onScroll, reducedMotion } from "./scroll.js";

const EASE = 0.16; // smoothing per 60fps frame
const GAP = 28; // px between cursor and preview

export function initPreview(list, { item = "[data-image]" } = {}) {
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!list || !canHover || reducedMotion) return;
  const sources = [...list.querySelectorAll("[data-image]")];
  if (!sources.length) return;

  const box = Object.assign(document.createElement("div"), { className: "hover-preview" });
  box.setAttribute("aria-hidden", "true");
  const img = Object.assign(document.createElement("img"), { alt: "", decoding: "async" });
  box.append(img);
  document.body.append(box);

  let pointer = null;
  let x = 0;
  let y = 0;
  let frame = 0;
  let last = 0;
  let visible = false;

  const show = (el) => {
    const src = el?.dataset.image;
    if (src) {
      if (img.getAttribute("src") !== src) img.src = src;
      if (!visible) [x, y] = [pointer.x, pointer.y]; // appear at the cursor, don't fly in
    }
    visible = Boolean(src);
    box.classList.toggle("is-visible", visible);
    list.classList.toggle("is-previewing", visible);
  };

  const itemAt = (target) => {
    const el = target?.closest(item);
    return el && list.contains(el) ? el : null;
  };

  const tick = (now) => {
    const dt = Math.min(now - (last || now), 64);
    last = now;
    const k = 1 - Math.pow(1 - EASE, dt / 16.67 || 1);
    x += (pointer.x - x) * k;
    y += (pointer.y - y) * k;

    // Sit to the right of the cursor; flip left near the right edge.
    const { width, height } = box.getBoundingClientRect();
    const left = x + GAP + width > innerWidth ? x - GAP - width : x + GAP;
    box.style.transform = `translate3d(${left.toFixed(1)}px, ${(y - height / 2).toFixed(1)}px, 0)`;

    const settled = Math.abs(pointer.x - x) < 0.3 && Math.abs(pointer.y - y) < 0.3;
    frame = visible || !settled ? requestAnimationFrame(tick) : 0;
    if (!frame) last = 0;
  };

  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  list.addEventListener("pointerenter", () => sources.forEach((el) => (new Image().src = el.dataset.image)), {
    once: true,
  });
  list.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    pointer = { x: event.clientX, y: event.clientY };
    show(itemAt(event.target));
    start();
  });
  list.addEventListener("pointerleave", () => show(null));

  // Items move under a still cursor while scrolling: keep the preview in sync.
  onScroll(() => {
    if (visible && pointer) show(itemAt(document.elementFromPoint(pointer.x, pointer.y)));
  });
}
