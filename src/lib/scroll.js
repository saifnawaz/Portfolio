/**
 * Scrolling: Lenis smooth scroll (wheel/trackpad; touch stays native), one
 * shared scroll signal for scroll-linked effects, and in-page anchor links.
 * With prefers-reduced-motion, Lenis is off and scrolling is fully native.
 */
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Guarded: this module is also loaded at build time (prerender), where there is no window.
export const reducedMotion =
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const scrollFns = new Set();
const resizeFns = new Set();
let lenis = null;

const notify = () => {
  const y = window.scrollY;
  for (const fn of scrollFns) fn(y);
};

/** Calls fn(scrollY) on every scroll frame, and once right away. */
export function onScroll(fn) {
  scrollFns.add(fn);
  fn(window.scrollY);
  return () => scrollFns.delete(fn);
}

/** Calls fn() once per frame while the viewport is being resized. */
export function onResize(fn) {
  resizeFns.add(fn);
  return () => resizeFns.delete(fn);
}

/**
 * Calls fn() once, when el comes within a viewport's height of the screen
 * (layout reads for things further down stay out of the page load).
 */
export function whenNear(el, fn) {
  if (!("IntersectionObserver" in window)) return fn();
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      fn();
    },
    { rootMargin: "100% 0px 100% 0px" },
  );
  observer.observe(el);
}

/** Freezes page scrolling (e.g. while the mobile menu is open), or releases it. */
export function lockScroll(locked) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.classList.toggle("is-scroll-locked", locked);
}

export function initScroll() {
  if (!reducedMotion) {
    lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
    // Fires in the same frame Lenis moves the page (and on native scrolls too),
    // so scroll-linked effects never lag behind the content.
    lenis.on("scroll", notify);
    document.addEventListener("click", onAnchorClick);
  } else {
    let queued = false;
    window.addEventListener(
      "scroll",
      () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          notify();
        });
      },
      { passive: true },
    );
  }

  let resizeQueued = false;
  window.addEventListener("resize", () => {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      for (const fn of resizeFns) fn();
      notify();
    });
  });
}

/** Page offset of an element's layout box, ignoring transforms (a row still
    waiting for its scroll reveal is translated down; its final spot is not). */
function layoutTop(el) {
  let y = 0;
  for (let node = el; node; node = node.offsetParent) y += node.offsetTop;
  return y;
}

/** Smooth-scrolls in-page links through Lenis and moves focus to the target. */
function onAnchorClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
  const link = event.target.closest('a[href^="#"]');
  const id = link && decodeURIComponent(link.getAttribute("href").slice(1));
  const target = id && document.getElementById(id);
  if (!target) return;

  event.preventDefault();
  lenis.scrollTo(id === "main" ? 0 : layoutTop(target) - (parseFloat(getComputedStyle(target).scrollMarginTop) || 0));
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  history.pushState(null, "", `#${id}`);
}
