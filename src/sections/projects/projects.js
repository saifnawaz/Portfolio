/**
 * Projects as a list, from content.projects.items. Add a project by adding an object.
 *
 * - The whole row opens the project's first link that has a url.
 * - Desktop: hovering a row floats its screenshot next to the cursor (preview.js).
 *   Touch, no JS, or reduced motion: the screenshot is shown inline in the row.
 * - Status "Live" gets a filled accent dot, anything else (e.g. "In progress") a hollow one.
 */
import "./projects.css";
import { html } from "../../lib/html.js";
import { sectionHead, smartLink } from "../../lib/ui.js";
import { initPreview } from "./preview.js";

const pad = (n) => String(n).padStart(2, "0");

const row = (item, i) => {
  const primary = item.links?.find((link) => link.url);
  const extras = (item.links ?? []).filter((link) => link.url && link !== primary);
  const live = item.status.toLowerCase() === "live";
  const alt = item.imageAlt ?? `Screenshot of ${item.title}`;

  return html`
    <li class="project" data-reveal style="--reveal-i: ${i}" ${item.image ? html`data-image="${item.image}"` : ""}>
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

      <p class="project__role"><span class="sr-only">Role: </span>${item.role}</p>
      <p class="project__stack"><span class="sr-only">Stack: </span>${item.stack.join(" / ")}</p>
      <p class="project__status label">
        <span class="dot ${live ? "" : "is-hollow"}" aria-hidden="true"></span>${item.status}
      </p>
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
    initPreview(section.querySelector(".projects__list"));
  },
};
