/**
 * Custom cursor: a small dot that follows the mouse and grows over links.
 * It replaces the native pointer only on mouse devices without reduced
 * motion; if this never runs, the normal cursor stays.
 */
import "./cursor.css";
import { reducedMotion } from "./scroll.js";

const INTERACTIVE = "a, button, [data-cursor]";

export function initCursor() {
  if (reducedMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const dot = Object.assign(document.createElement("div"), { className: "cursor" });
  dot.setAttribute("aria-hidden", "true");
  document.body.append(dot);
  const root = document.documentElement;

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      if (!dot.classList.contains("is-visible")) {
        dot.classList.add("is-visible");
        root.classList.add("has-cursor"); // hide the native pointer once ours is showing
      }
    },
    { passive: true },
  );
  document.addEventListener("pointerover", (event) => {
    dot.classList.toggle("is-hover", Boolean(event.target.closest?.(INTERACTIVE)));
  });
  root.addEventListener("pointerleave", () => dot.classList.remove("is-visible"));
  window.addEventListener("pointerdown", () => dot.classList.add("is-down"));
  window.addEventListener("pointerup", () => dot.classList.remove("is-down"));
}
