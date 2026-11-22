/**
 * "Off the clock": interests as large words in a row. On hover a word turns
 * red; if it has an image, the image floats next to the cursor (the same
 * hover preview as the project rows, lib/preview.js). Words with an image are
 * buttons: on touch (or from the keyboard) they show the image inline below.
 */
import { html } from "../../lib/html.js";
import { initPreview } from "../../lib/preview.js";
import { reducedMotion } from "../../lib/scroll.js";

const PHOTO_ID = "interest-photo";

export const renderInterests = (items) => html`
  <ul class="interests" role="list" data-reveal>
    ${items.map(
      (item) => html`<li class="interest" ${item.image ? html`data-image="${item.image}" data-alt="${item.imageAlt ?? ""}"` : ""}>
        ${item.image
          ? html`<button class="interest__word" type="button" aria-expanded="false" aria-controls="${PHOTO_ID}">
              ${item.name}
            </button>`
          : html`<span class="interest__word" data-cursor>${item.name}</span>`}
      </li>`,
    )}
  </ul>
  ${items.some((item) => item.image)
    ? html`<figure class="interests__photo" id="${PHOTO_ID}" hidden><img alt="" decoding="async" /></figure>`
    : ""}
`;

export function initInterests(list) {
  if (!list) return;
  initPreview(list, { item: ".interest" });

  const photo = document.getElementById(PHOTO_ID);
  if (!photo) return;
  const img = photo.querySelector("img");
  const floating = matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion;
  const entries = [...list.children].map((li) => ({ li, button: li.querySelector("button") }));
  let open = null;

  const toggle = (entry) => {
    open = open === entry ? null : entry;
    for (const { li, button } of entries) {
      li.classList.toggle("is-open", open?.li === li);
      button?.setAttribute("aria-expanded", String(open?.li === li));
    }
    if (open) {
      img.src = open.li.dataset.image;
      img.alt = open.li.dataset.alt;
    }
    photo.hidden = !open;
  };

  for (const entry of entries) {
    // With a mouse the image already floats on hover: clicks only open it from the keyboard.
    entry.button?.addEventListener("click", (event) => {
      if (floating && event.detail > 0) return;
      toggle(entry);
    });
  }
}
