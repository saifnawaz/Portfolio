/**
 * Full-screen image viewer: a modal <dialog>, created on first use.
 * Focus stays inside while it is open and returns to the opener on close.
 * Closes on Esc, the Close button, or a click anywhere except the image.
 *
 *   openLightbox({ src: "/cert.webp", alt: "Certificate", caption: "German A2" })
 */
import "./lightbox.css";
import { lockScroll } from "./scroll.js";

let dialog = null;

function create() {
  dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.innerHTML = `
    <button class="lightbox__close label" type="button" autofocus>Close</button>
    <figure class="lightbox__figure">
      <img class="lightbox__img" alt="" decoding="async" />
      <figcaption class="lightbox__caption label"></figcaption>
    </figure>`;
  document.body.append(dialog);

  const img = dialog.querySelector(".lightbox__img");
  dialog.addEventListener("click", (event) => {
    if (event.target !== img) dialog.close();
  });
  dialog.addEventListener("close", () => lockScroll(false));
  // Keep Tab inside (the Close button is the only control), not out to the browser UI.
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    dialog.querySelector(".lightbox__close").focus();
  });
}

export function openLightbox({ src, alt = "", caption = "" }) {
  if (!dialog) create();
  const img = dialog.querySelector(".lightbox__img");
  img.src = src;
  img.alt = alt;
  dialog.querySelector(".lightbox__caption").textContent = caption;
  dialog.setAttribute("aria-label", caption || alt || "Image");
  dialog.showModal();
  lockScroll(true);
}
