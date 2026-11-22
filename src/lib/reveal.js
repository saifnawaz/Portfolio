/**
 * Scroll reveals, triggered once as elements enter the viewport.
 *
 *   [data-reveal]   the element fades up. Stagger with style="--reveal-i: 1".
 *   [data-split]    plain-text headings/paragraphs: split into their rendered
 *                   lines, each sliding up out of its own mask. Once revealed,
 *                   the original markup is restored so it reflows on resize.
 *
 * Splitting waits for web fonts, since line breaks depend on them, and happens
 * only as an element is revealed: one layout per element, spread over the
 * scroll, instead of all of them at once while the page loads.
 * Everything is skipped for reduced-motion users (CSS keeps it all visible).
 */
import { reducedMotion } from "./scroll.js";

export function initReveal(root = document) {
  if (reducedMotion || !("IntersectionObserver" in window)) {
    root.querySelectorAll("[data-reveal], [data-split]").forEach((el) => el.classList.add("is-in"));
    return;
  }

  const toSplit = new Set(); // waiting to be split when revealed
  const pending = new Map(); // split element -> its original HTML, until restored

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
    if (!toSplit.has(el)) {
      el.classList.add("is-in");
      return;
    }
    toSplit.delete(el);
    pending.set(el, el.innerHTML);
    splitLines(el);
    // Two frames, so the lines' hidden start position is styled before they slide.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.classList.add("is-in");
        const lines = el.querySelectorAll(".split-line > span");
        const last = lines[lines.length - 1];
        const restore = () => {
          if (!pending.has(el)) return;
          el.innerHTML = pending.get(el);
          el.classList.remove("is-split");
          el.classList.add("is-done");
          pending.delete(el);
        };
        last?.addEventListener("transitionend", restore, { once: true });
        // In case transitionend never fires: wait out the last line's delay + duration.
        const style = last && getComputedStyle(last);
        const seconds = style ? parseFloat(style.transitionDelay) + parseFloat(style.transitionDuration) : 0;
        setTimeout(restore, seconds * 1000 + 300);
      }),
    );
  };

  root.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));

  const splitTargets = [...root.querySelectorAll("[data-split]")];
  const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
  fontsReady.then(() => {
    for (const el of splitTargets) {
      if ([...el.children].some((child) => child.children.length)) {
        el.classList.add("is-done"); // nested markup: just fade it with the rest
        el.setAttribute("data-reveal", "");
      } else {
        toSplit.add(el);
      }
      observer.observe(el);
    }
  });
}

/**
 * Wraps each rendered line of el's text in .split-line > span. Simple inline
 * elements (e.g. <em>) are kept: each word remembers its wrapper.
 */
function splitLines(el) {
  // Measure in normal flow: if it was split before, .is-split's flex column
  // would put every word on its own "line".
  el.classList.remove("is-split");

  // Words, each with its inline wrapper (or null) and whether a space precedes it.
  const words = [];
  let spaceBefore = false;
  for (const node of el.childNodes) {
    const wrap = node.nodeType === Node.ELEMENT_NODE ? node : null;
    for (const [, space, word] of node.textContent.matchAll(/(\s*)(\S+)/g)) {
      words.push({ word, wrap, space: words.length > 0 && (spaceBefore || space.length > 0) });
      spaceBefore = false;
    }
    spaceBefore = /\s$/.test(node.textContent);
  }

  // Lay the words out as spans to see where the lines break.
  const spans = words.map(({ word }) => Object.assign(document.createElement("span"), { textContent: word }));
  el.textContent = "";
  spans.forEach((span, i) => el.append(...(words[i].space ? [" ", span] : [span])));
  const lines = [];
  let top = null;
  spans.forEach((span, i) => {
    if (top === null || Math.abs(span.offsetTop - top) > 2) {
      lines.push([]);
      top = span.offsetTop;
    }
    lines[lines.length - 1].push(words[i]);
  });

  // Rebuild: one masked line per row, re-wrapping words in their original elements.
  el.textContent = "";
  lines.forEach((line, i) => {
    const mask = Object.assign(document.createElement("span"), { className: "split-line" });
    const inner = document.createElement("span");
    inner.style.setProperty("--line", i);
    let group = null; // current wrapper clone
    line.forEach(({ word, wrap, space }, j) => {
      if (space && j > 0) (group && wrap && group.source === wrap ? group : inner).append(" ");
      if (wrap) {
        if (!group || group.source !== wrap) {
          group = wrap.cloneNode(false);
          group.source = wrap;
          inner.append(group);
        }
        group.append(word);
      } else {
        group = null;
        inner.append(word);
      }
    });
    mask.append(inner);
    el.append(mask);
  });
  el.classList.add("is-split");
}
