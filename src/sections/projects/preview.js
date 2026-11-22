/**
 * Desktop hover preview: one floating screenshot that follows the cursor
 * while it is over a project row with a `data-image`. Mouse only, off for
 * reduced motion (rows then show their inline screenshot instead, via CSS).
 */
import { onScroll, reducedMotion } from "../../lib/scroll.js";

const EASE = 0.16; // smoothing per 60fps frame
const GAP = 28; // px between cursor and preview

export function initPreview(list) {
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!list || !canHover || reducedMotion) return;
  const rows = [...list.querySelectorAll("[data-image]")];
  if (!rows.length) return;

  const box = Object.assign(document.createElement("div"), { className: "project-preview" });
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

  const show = (row) => {
    const src = row?.dataset.image;
    if (src) {
      if (img.getAttribute("src") !== src) img.src = src;
      if (!visible) [x, y] = [pointer.x, pointer.y]; // appear at the cursor, don't fly in
    }
    visible = Boolean(src);
    box.classList.toggle("is-visible", visible);
    list.classList.toggle("is-previewing", visible);
  };

  const rowAtPointer = () => {
    if (!pointer) return null;
    const row = document.elementFromPoint(pointer.x, pointer.y)?.closest(".project");
    return row && list.contains(row) ? row : null;
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

  list.addEventListener("pointerenter", () => rows.forEach((row) => (new Image().src = row.dataset.image)), {
    once: true,
  });
  list.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    pointer = { x: event.clientX, y: event.clientY };
    show(event.target.closest(".project"));
    start();
  });
  list.addEventListener("pointerleave", () => show(null));

  // Rows move under a still cursor while scrolling: keep the preview in sync.
  onScroll(() => {
    if (visible) show(rowAtPointer());
  });
}
