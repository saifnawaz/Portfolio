/**
 * Scroll-linked: the hero name shrinks into the nav logo.
 *
 * The name stays in normal flow, so its top edge scrolls with the page; we
 * only scale it (origin top-left) toward the logo's size. The scroll distance
 * is chosen so its top reaches the logo exactly when the shrink finishes; at
 * that moment it hands over to the real nav logo (crisp text, a working link)
 * and the nav turns solid. With reduced motion there is no scaling: the logo
 * simply appears once the name has scrolled past.
 *
 * Touch (lib/touch.js): a subtle parallax too. The name drifts down by LAG of
 * the scroll, so it moves slower than the page; the docking distance grows to
 * match, so it still lands exactly on the logo.
 */
import { onScroll, onResize, reducedMotion } from "../../lib/scroll.js";
import { touchMode } from "../../lib/touch.js";

const LAG = 0.15; // share of the scroll the name holds back (touch only)

export function initNameMorph(text) {
  const nav = document.querySelector("[data-nav]");
  const logo = nav?.querySelector(".site-nav__logo");
  if (!nav || !logo) return () => {};

  let distance = 1; // scroll needed to dock
  let endScale = 1;
  let shiftX = 0;
  let lag = 0;
  let lastY = 0;

  const measure = () => {
    const previous = text.style.transform;
    text.style.transform = "none";
    const name = text.getBoundingClientRect();
    const target = logo.getBoundingClientRect();
    text.style.transform = previous;

    lag = !reducedMotion && touchMode() ? LAG : 0;
    distance = Math.max(1, (name.top + window.scrollY - target.top) / (1 - lag));
    endScale = target.width / name.width;
    shiftX = target.left - name.left;
    update(lastY);
  };

  const update = (y) => {
    lastY = y;
    const progress = Math.min(Math.max(y / distance, 0), 1);
    const docked = progress >= 1;
    nav.classList.toggle("is-compact", docked);
    if (reducedMotion) return;

    text.style.visibility = docked ? "hidden" : "";
    text.style.transform =
      progress > 0 && !docked
        ? `translate3d(${(shiftX * progress).toFixed(2)}px, ${(y * lag).toFixed(2)}px, 0) scale(${(1 + (endScale - 1) * progress).toFixed(4)})`
        : "";
  };

  onResize(measure);
  onScroll(update);
  measure();
  return measure; // call again if the name's size changes (e.g. after fonts load)
}
