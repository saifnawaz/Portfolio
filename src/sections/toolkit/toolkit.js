/**
 * Toolkit, from content.toolkit, in the same two columns as About: the label
 * and heading stick on the left while the lists scroll on the right.
 *
 * Stack: one row per skill (name + tag). Hovering or focusing a row fills it
 * red and shows the projects it was used in (`usedIn`, project slugs), or
 * "Coursework". On phones it is a two-column grid with that line always shown.
 *
 * Touch: instead of hover, the skill and certificate crossing the middle of
 * the screen fill red (lib/touch.js), one per list.
 *
 * Certificates: rows like the project list. With an `image`, hovering floats
 * the image next to the cursor (lib/preview.js) and clicking or tapping opens
 * it full-screen (lib/lightbox.js); without JS the link opens the image itself.
 * `imageAlt` describes an image that isn't the certificate itself (e.g. a trophy photo).
 */
import "./toolkit.css";
import { html } from "../../lib/html.js";
import { asideHead, projectSlug } from "../../lib/ui.js";
import { initPreview } from "../../lib/preview.js";
import { openLightbox } from "../../lib/lightbox.js";
import { initScrollActive } from "../../lib/touch.js";

const usedInText = (slugs, titles) =>
  slugs?.length ? `Used in: ${slugs.map((slug) => titles.get(slug) ?? slug).join(" · ")}` : "Coursework";

const skill = (item, i, titles) => html`
  <li class="skill" tabindex="0" data-reveal style="--reveal-i: ${i}">
    <span class="skill__name">${item.name}</span>
    <span class="skill__tag label">${item.tag}</span>
    <span class="skill__used label">${usedInText(item.usedIn, titles)}</span>
  </li>
`;

const certificate = (item, i) => html`
  <li class="cert" data-reveal style="--reveal-i: ${i}" ${item.image ? html`data-image="${item.image}"` : ""}>
    <h4 class="cert__name">
      ${item.image
        ? html`<a class="cert__link" href="${item.image}" data-alt="${item.imageAlt ?? `${item.name} certificate`}"
            ><span class="cert__title">${item.name}</span><span class="sr-only"> (view ${item.imageAlt ? "photo" : "certificate"})</span></a
          >`
        : html`<span class="cert__title">${item.name}</span>`}
    </h4>
    <p class="cert__issuer label"><span class="sr-only">Issued by </span>${item.issuer}</p>
    <p class="cert__year label">${item.year ?? ""}</p>
    <span class="cert__arrow" aria-hidden="true">${item.image ? "↗" : ""}</span>
  </li>
`;

export default {
  id: "toolkit",

  render: ({ toolkit, projects }, { label, number }) => {
    const titles = new Map((projects?.items ?? []).map((item) => [projectSlug(item), item.title]));
    return html`
      <section class="section toolkit" id="toolkit" aria-labelledby="toolkit-title">
        <div class="wrap cols">
          <div class="cols__aside">${asideHead({ id: "toolkit", number, label, title: toolkit.title })}</div>

          <div class="cols__body">
            <div>
              <h3 class="cols__block-title label" data-reveal>${toolkit.stackTitle}</h3>
              <ul class="skills" role="list">
                ${toolkit.stack.map((item, i) => skill(item, i, titles))}
              </ul>
            </div>

            <div>
              <h3 class="cols__block-title label" data-reveal>${toolkit.certificatesTitle}</h3>
              <ol class="certs" role="list">
                ${toolkit.certificates.map(certificate)}
              </ol>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  init(section) {
    const list = section.querySelector(".certs");
    initPreview(list, { item: ".cert" });
    initScrollActive(section.querySelector(".skills"), ".skill");
    initScrollActive(list, ".cert");
    list?.addEventListener("click", (event) => {
      const link = event.target.closest(".cert__link"); // covers the whole row, arrow included
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      const name = link.querySelector(".cert__title").textContent.trim();
      openLightbox({ src: link.getAttribute("href"), alt: link.dataset.alt, caption: name });
    });
  },
};
