/**
 * Magnetic links: [data-magnetic] elements drift toward the cursor while it is
 * over them and ease back when it leaves. Mouse only, off for reduced motion.
 */
import { reducedMotion } from "./scroll.js";

const PULL = 0.3; // share of the cursor's offset from the centre
const MAX = 10; // px
const EASE = 0.15; // smoothing per 60fps frame

export function initMagnetic(root = document) {
  if (reducedMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  root.querySelectorAll("[data-magnetic]").forEach(magnetize);
}

function magnetize(el) {
  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let frame = 0;
  let last = 0;
  const clamp = (v) => Math.max(-MAX, Math.min(MAX, v));

  const tick = (now) => {
    const dt = Math.min(now - (last || now), 64);
    last = now;
    const k = 1 - Math.pow(1 - EASE, dt / 16.67 || 1);
    x += (tx - x) * k;
    y += (ty - y) * k;
    const settled = Math.abs(tx - x) < 0.05 && Math.abs(ty - y) < 0.05;
    el.style.transform = settled && !tx && !ty ? "" : `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    frame = settled ? 0 : requestAnimationFrame(tick);
    if (!frame) last = 0;
  };
  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  el.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const box = el.getBoundingClientRect();
    // Centre without our own offset, so the pull doesn't feed back on itself.
    const cx = box.left + box.width / 2 - x;
    const cy = box.top + box.height / 2 - y;
    tx = clamp((event.clientX - cx) * PULL);
    ty = clamp((event.clientY - cy) * PULL);
    start();
  });
  el.addEventListener("pointerleave", () => {
    tx = ty = 0;
    start();
  });
}
