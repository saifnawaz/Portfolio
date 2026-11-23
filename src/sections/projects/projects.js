/**
 * Projects as a list, from content.projects.items. Add a project by adding an object.
 *
 * - The whole row opens the project's first link that has a url.
 * - Desktop: hovering a row floats its screenshot next to the cursor (lib/preview.js).
 *   Touch, no JS, or reduced motion: the screenshot is shown inline in the row.
 * - Touch (phones and no-hover screens): stacking cards. Each card sticks below
 *   the nav and the next slides over it; the covered card scales down and
 *   darkens (initStack). The card crossing the middle of the screen fills red
 *   (lib/touch.js).
 * - Status "Live" gets a filled accent dot, anything else (e.g. "In progress") a hollow one.
 */
import "./projects.css";
import { html } from "../../lib/html.js";
import { projectId, sectionHead, smartLink } from "../../lib/ui.js";
import { initPreview } from "../../lib/preview.js";
import { initScrollActive, touchMode, TOUCH_QUERY } from "../../lib/touch.js";
import { onScroll, reducedMotion } from "../../lib/scroll.js";

const pad = (n) => String(n).padStart(2, "0");

const row = (item, i) => {
  const primary = item.links?.find((link) => link.url);
  const extras = (item.links ?? []).filter((link) => link.url && link !== primary);
  const live = item.status.toLowerCase() === "live";
  const alt = item.imageAlt ?? `Screenshot of ${item.title}`;

  return html`
    <li class="project" id="${projectId(item)}" data-reveal style="--reveal-i: ${i}" ${item.image ? html`data-image="${item.image}"` : ""}>
      <span class="project__num label">${pad(i + 1)}</span>

      <div class="project__main">
        <h3 class="project__title">
          ${primary
            ? html`<a class="project__link" href="${primary.url}" target="_blank" rel="noopener noreferrer"
                >${item.title}<span class="sr-only"> (${primary.label}, opens in a new tab)</span></a
              >`
            : item.title}
        </h3>
        <p class="project__blurb">${item.blurb}</p>
      </div>

      <div class="project__meta">
        <p class="project__role"><span class="sr-only">Role: </span>${item.role}</p>
        <p class="project__stack"><span class="sr-only">Stack: </span>${item.stack.join(" / ")}</p>
        <p class="project__status label">
          <span class="dot ${live ? "" : "is-hollow"}" aria-hidden="true"></span>${item.status}
        </p>
      </div>
      <span class="project__arrow" aria-hidden="true">${primary ? "↗" : ""}</span>

      ${extras.length ? html`<p class="project__extras label">${extras.map((link) => smartLink(link))}</p>` : ""}
      ${item.image ? html`<img class="project__thumb" src="${item.image}" alt="${alt}" loading="lazy" decoding="async" />` : ""}
    </li>
  `;
};

export default {
  id: "projects",

  render: ({ projects }, { label, number }) => html`
    <section class="section projects" id="projects" aria-labelledby="projects-title">
      <div class="wrap">
        ${sectionHead({ id: "projects", number, label, title: projects.title })}

        <div class="projects__head label" aria-hidden="true" data-reveal>
          <span>No.</span><span>Project</span><span>Role</span><span>Stack</span><span>Status</span>
        </div>
        <ol class="projects__list" role="list">
          ${projects.items.map(row)}
        </ol>
      </div>
    </section>
  `,

  init(section) {
    const list = section.querySelector(".projects__list");
    if (!touchMode()) initPreview(list, { item: ".project" }); // cards show their screenshot
    initScrollActive(list, ".project", { prefer: "last" }); // the card on top
    initStack(list);
  },
};

/**
 * Sets --cover (0..1) on each card as the next card slides over it: 0 while
 * the next card is a full card-height below, 1 once it fully covers it.
 * Touch mode only; with reduced motion the cards don't stick at all.
 */
function initStack(list) {
  if (!list || reducedMotion) return;
  const query = matchMedia(TOUCH_QUERY);
  const cards = [...list.querySelectorAll(".project")];
  const covers = cards.map(() => 0);
  let near = false;

  const update = () => {
    if (!near || !query.matches) return;
    // Read every box first, then write: one layout per frame at most.
    const boxes = cards.map((card) => card.getBoundingClientRect());
    cards.forEach((card, i) => {
      const next = boxes[i + 1];
      const box = boxes[i];
      const cover = next ? Math.min(Math.max(1 - (next.top - box.top) / box.height, 0), 1) : 0;
      const rounded = Math.round(cover * 1000) / 1000;
      if (rounded === covers[i]) return;
      covers[i] = rounded;
      card.style.setProperty("--cover", rounded);
    });
  };

  new IntersectionObserver((entries) => {
    near = entries[0].isIntersecting;
    update();
  }).observe(list);

  query.addEventListener("change", () => {
    if (query.matches) return update();
    cards.forEach((card, i) => {
      covers[i] = 0;
      card.style.removeProperty("--cover");
    });
  });
  onScroll(update);
}
