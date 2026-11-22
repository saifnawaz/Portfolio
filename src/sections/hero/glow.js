/**
 * The red glow behind the hero follows the mouse with heavy easing
 * (its slow drift is a CSS animation on the inner layer). Mouse only,
 * off for reduced motion; the loop stops once it has caught up.
 */
import { reducedMotion } from "../../lib/scroll.js";

const FOLLOW = 0.35; // share of the cursor's offset from the hero centre
const EASE = 0.035; // heavy easing per 60fps frame

export function initGlow(hero) {
  const glow = hero.querySelector(".hero__glow");
  if (!glow || reducedMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let frame = 0;
  let last = 0;

  const tick = (now) => {
    const dt = Math.min(now - (last || now), 64);
    last = now;
    const k = 1 - Math.pow(1 - EASE, dt / 16.67 || 1);
    x += (tx - x) * k;
    y += (ty - y) * k;
    glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    const settled = Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5;
    frame = settled || document.hidden ? 0 : requestAnimationFrame(tick);
    if (!frame) last = 0;
  };
  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const box = hero.getBoundingClientRect();
    tx = (event.clientX - (box.left + box.width / 2)) * FOLLOW;
    ty = (event.clientY - (box.top + box.height / 2)) * FOLLOW;
    start();
  });
  hero.addEventListener("pointerleave", () => {
    tx = ty = 0;
    start();
  });
}
