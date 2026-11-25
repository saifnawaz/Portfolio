/**
 * Scroll-linked: the hero name shrinks into the nav logo.
 *
 * The name stays in normal flow, so its top edge scrolls with the page; we
 * only scale it (origin top-left) toward the logo's size and slide it sideways
 * onto the logo. No vertical offset: the name's top moves exactly with the
 * page and its bottom moves up faster (it is shrinking), so the content below
 * it (role, buttons, status, strip) can never catch up with it. The scroll
 * distance is the one it takes the name's top to reach the logo; at that
 * moment it hands over to the real nav logo (crisp text, a working link) and
 * the nav turns solid. With reduced motion there is no scaling: the logo
 * simply appears once the name has scrolled past.
 *
 * Phones (two-line name): it shrinks to about two logo-heights (each line
 * roughly logo-sized) and crossfades into the one-line logo as it lands
 * (`--logo-in` on the nav). Nothing else in the hero fades.
 */
import { onScroll, onResize, reducedMotion } from "../../lib/scroll.js";

const CROSSFADE = 0.8; // two-line name: crossfade to the logo from here to the end
const STACKED = "(max-width: 47.99rem)"; // the name is on two lines (hero.css)

export function initNameMorph(text) {
  const nav = document.querySelector("[data-nav]");
  const logo = nav?.querySelector(".site-nav__logo");
  if (!nav || !logo) return () => {};

  let distance = 1; // scroll needed to dock
  let endScale = 1;
  let shiftX = 0;
  let stacked = false;
  let lastY = 0;

  const measure = () => {
    const previous = text.style.transform;
    text.style.transform = "none";
    const name = text.getBoundingClientRect();
    const target = logo.getBoundingClientRect();
    text.style.transform = previous;

    stacked = matchMedia(STACKED).matches;
    if (!stacked || reducedMotion) {
      nav.style.removeProperty("--logo-in");
      text.style.opacity = "";
    }
    distance = Math.max(1, name.top + window.scrollY - target.top);
    endScale = stacked ? (target.height * 2) / name.height : target.width / name.width;
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
        ? `translate3d(${(shiftX * progress).toFixed(2)}px, 0, 0) scale(${(1 + (endScale - 1) * progress).toFixed(4)})`
        : "";

    if (stacked) {
      const fade = Math.min(Math.max((progress - CROSSFADE) / (1 - CROSSFADE), 0), 1);
      text.style.opacity = fade ? (1 - fade).toFixed(3) : "";
      nav.style.setProperty("--logo-in", fade.toFixed(3));
    }
  };

  onResize(measure);
  onScroll(update);
  measure();
  return measure; // call again if the name's size changes (e.g. after fonts load)
}
