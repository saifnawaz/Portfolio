/**
 * Scroll reveals, triggered once as elements enter the viewport.
 *
 *   [data-reveal]   the element fades up. Stagger with style="--reveal-i: 1".
 *   [data-split]    plain-text headings/paragraphs: split into their rendered
 *                   lines, each sliding up out of its own mask. Once revealed,
 *                   the original markup is restored so it reflows on resize.
 *
 * Splitting waits for web fonts, since line breaks depend on them.
 * Everything is skipped for reduced-motion users (CSS keeps it all visible).
 */
import { reducedMotion } from "./scroll.js";

export function initReveal(root = document) {
  if (reducedMotion || !("IntersectionObserver" in window)) {
    root.querySelectorAll("[data-reveal], [data-split]").forEach((el) => el.classList.add("is-in"));
    return;
  }

  const pending = new Map(); // split element -> its original HTML

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Also reveal anything already scrolled past (e.g. after a reload mid-page).
        if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) continue;
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  const reveal = (el) => {
    el.classList.add("is-in");
    if (!pending.has(el)) return;
    const lines = el.querySelectorAll(".split-line > span");
    const restore = () => {
      if (!pending.has(el)) return;
      el.innerHTML = pending.get(el);
      el.classList.remove("is-split");
      el.classList.add("is-done");
      pending.delete(el);
    };
    lines[lines.length - 1]?.addEventListener("transitionend", restore, { once: true });
    setTimeout(restore, 1500 + lines.length * 90); // in case transitionend never fires
  };

  root.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));

  const splitTargets = [...root.querySelectorAll("[data-split]")];
  const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
  fontsReady.then(() => {
    for (const el of splitTargets) {
      if (el.children.length) {
        el.classList.add("is-done"); // has markup: just fade it with the rest
        el.setAttribute("data-reveal", "");
        observer.observe(el);
        continue;
      }
      pending.set(el, el.innerHTML);
      splitLines(el);
      observer.observe(el);
    }
  });

  // Line breaks change with width: re-split anything not revealed yet.
  let timer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      for (const [el, original] of pending) {
        if (el.classList.contains("is-in")) continue;
        el.innerHTML = original;
        splitLines(el);
      }
    }, 150);
  });
}

/** Wraps each rendered line of el's text in .split-line > span. */
function splitLines(el) {
  const words = el.textContent.replace(/\s+/g, " ").trim().split(" ");
  const spans = words.map((word) => Object.assign(document.createElement("span"), { textContent: word }));
  el.textContent = "";
  spans.forEach((span, i) => el.append(...(i ? [" ", span] : [span])));

  const lines = [];
  let top = null;
  for (const span of spans) {
    if (top === null || Math.abs(span.offsetTop - top) > 2) {
      lines.push([]);
      top = span.offsetTop;
    }
    lines[lines.length - 1].push(span.textContent);
  }

  el.textContent = "";
  lines.forEach((line, i) => {
    const mask = Object.assign(document.createElement("span"), { className: "split-line" });
    const inner = Object.assign(document.createElement("span"), { textContent: line.join(" ") });
    inner.style.setProperty("--line", i);
    mask.append(inner);
    el.append(mask);
  });
  el.classList.add("is-split");
}
