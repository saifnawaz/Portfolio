/**
 * Scroll reveal: elements with [data-reveal] fade up once as they enter the
 * viewport. Stagger siblings with style="--reveal-i: 1" (2, 3, ...).
 * The CSS lives in styles/base.css and is off for reduced-motion users.
 */
export function initReveal(root = document) {
  const items = root.querySelectorAll("[data-reveal]");
  const show = (element) => element.classList.add("is-in");

  if (!("IntersectionObserver" in window)) {
    items.forEach(show);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Also show anything already scrolled past (e.g. after a reload mid-page).
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );

  items.forEach((element) => observer.observe(element));
}
