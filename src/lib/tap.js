/**
 * Tap feedback for touch (and pen) input: whatever is tapped presses in
 * (scale 0.97) with a brief red tint, then springs back, each in ≤150ms.
 * Mouse input is ignored, so desktop is unchanged. Reduced motion: tint only.
 *
 * Web Animations, not CSS: they layer over each element's own transitions
 * and transforms (e.g. the stacking cards' scale) without overriding them.
 */
import { reducedMotion } from "./scroll.js";

const TAPPABLE = 'a, button:not(:disabled), [role="button"], summary, label, .skill';
const ROW_LINKS = ".project__link, .cert__link, .project__arrow, .cert__arrow"; // stand for their row: press the row
const ROWS = ".project, .cert, .skill"; // filled blocks: tint with an overlay, not text colour
const DELAY = 60; // ms before pressing, so a touch that turns into a scroll doesn't flash
const PRESS = 120; // ms in, and again out

export function initTap() {
  let pending = 0; // timer for a press about to start
  let pendingEl = null;
  let current = null; // { animation, start } of the press showing now

  const keyframes = (el) => {
    const end = reducedMotion ? {} : { transform: "scale(0.97)" };
    if (el.matches(ROWS)) end.boxShadow = "inset 0 0 0 100vmax rgb(255 59 48 / 0.14)";
    else if (el.closest('[data-surface="accent"]')) end.opacity = 0.7; // red on red would vanish
    else end.color = "#ff3b30"; // --accent
    return [{}, end];
  };

  const press = (el) => {
    const animation = el.animate(keyframes(el), { duration: PRESS, easing: "ease-out", fill: "forwards" });
    current = { animation, start: performance.now() };
  };

  const release = () => {
    clearTimeout(pending);
    pending = 0;
    if (!current) return;
    const { animation, start } = current;
    current = null;
    // Let the press be seen in full, then play it back out.
    setTimeout(() => {
      animation.reverse();
      animation.finished.then(() => animation.cancel(), () => {});
    }, Math.max(0, PRESS - (performance.now() - start)));
  };

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType === "mouse" || !event.isPrimary) return;
      release();
      let el = event.target.closest?.(TAPPABLE);
      if (!el) return;
      if (el.matches(ROW_LINKS)) el = el.closest(ROWS) ?? el;
      pendingEl = el;
      pending = setTimeout(() => {
        pending = 0;
        press(el);
      }, DELAY);
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerup",
    (event) => {
      if (event.pointerType === "mouse") return;
      // A tap quicker than DELAY: still show the whole press.
      if (pending) {
        clearTimeout(pending);
        pending = 0;
        press(pendingEl);
      }
      release();
    },
    { passive: true },
  );

  // The browser took the touch over for scrolling: no press.
  document.addEventListener("pointercancel", release, { passive: true });
}
