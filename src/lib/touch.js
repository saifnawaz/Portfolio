/**
 * Touch-native interactions, for phones and devices without hover (where the
 * desktop hover effects never fire). Desktop with a mouse is left as it is.
 *
 *   TOUCH_QUERY             phones (<768px) or no-hover devices; use it in CSS too
 *   initScrollActive(list)  the item crossing the middle of the screen gets
 *                           .is-active (styled like :hover), one per list
 */
import { reducedMotion } from "./scroll.js";

export const TOUCH_QUERY = "(max-width: 47.99rem), (hover: none)";

/** True in touch mode (always false at build time, where there is no window). */
export const touchMode = () => typeof matchMedia === "function" && matchMedia(TOUCH_QUERY).matches;

/**
 * Marks the item of `list` (matching `selector`) that sits in a band across
 * the middle of the viewport with .is-active, and clears it once it leaves.
 * Only one item per list: the one nearest the middle, or with
 * { prefer: "last" } the last one in the band (stacked cards: the one on top).
 * Touch mode only, and off with reduced motion (everything stays static).
 */
export function initScrollActive(list, selector, { prefer = "nearest" } = {}) {
  if (!list || reducedMotion || !("IntersectionObserver" in window)) return;
  const query = matchMedia(TOUCH_QUERY);
  const items = [...list.querySelectorAll(selector)];
  if (!items.length) return;

  const inBand = new Set();
  let active = null;

  const setActive = (el) => {
    if (el === active) return;
    active?.classList.remove("is-active");
    el?.classList.add("is-active");
    active = el;
  };

  const pick = () => {
    const candidates = items.filter((el) => inBand.has(el)); // DOM order
    if (prefer === "last" || candidates.length < 2) return setActive(candidates.at(-1) ?? null);
    const middle = innerHeight / 2;
    let best = null;
    let bestDistance = Infinity;
    for (const el of candidates) {
      const box = el.getBoundingClientRect();
      const distance = Math.abs(box.top + box.height / 2 - middle);
      if (distance < bestDistance - 2) [best, bestDistance] = [el, distance]; // ties: the earlier one
    }
    setActive(best);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inBand.add(entry.target);
        else inBand.delete(entry.target);
      }
      pick();
    },
    { rootMargin: "-45% 0px -45% 0px" }, // a band 10% of the viewport tall, centred
  );

  const sync = () => {
    observer.disconnect();
    inBand.clear();
    setActive(null);
    if (query.matches) items.forEach((el) => observer.observe(el));
  };
  query.addEventListener("change", sync);
  sync();
}
