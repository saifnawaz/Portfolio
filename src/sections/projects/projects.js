/**
 * Projects, from content.projects.items. Add a project by adding an object.
 * A project without `image` gets a placeholder tile; a status of "Live"
 * gets a filled dot, anything else (e.g. "In progress") an outlined one.
 */
import "./projects.css";
import { html } from "../../lib/html.js";
import { sectionHead, smartLink } from "../../lib/ui.js";

const pad = (n) => String(n).padStart(2, "0");

const shot = (project) => {
  const media = project.image
    ? html`<img src="${project.image}" alt="${project.imageAlt ?? `Screenshot of ${project.title}`}" loading="lazy" decoding="async" />`
    : html`<span class="project__placeholder" aria-hidden="true">
        <span class="project__placeholder-title">${project.title}</span>
        <span class="label">Screenshot soon</span>
      </span>`;

  // The screenshot repeats the first real link for pointer users; keyboard and
  // screen reader users get the same link once, in the links row.
  const href = project.links?.find((link) => link.url)?.url;
  return href
    ? html`<a class="project__shot" href="${href}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true" data-reveal>${media}</a>`
    : html`<div class="project__shot" data-reveal>${media}</div>`;
};

const project = (item, i, total) => html`
  <article class="project" aria-labelledby="project-${i}-title">
    ${shot(item)}
    <div class="project__info" data-reveal style="--reveal-i: 1">
      <p class="project__index label">${pad(i + 1)} / ${pad(total)}</p>
      <h3 class="project__title" id="project-${i}-title">${item.title}</h3>
      <p class="project__blurb">${item.blurb}</p>

      <dl class="project__meta">
        <div>
          <dt class="label">Role</dt>
          <dd>${item.role}</dd>
        </div>
        <div>
          <dt class="label">Stack</dt>
          <dd>
            <ul class="project__stack" role="list">
              ${item.stack.map((tech) => html`<li>${tech}</li>`)}
            </ul>
          </dd>
        </div>
        <div>
          <dt class="label">Status</dt>
          <dd class="project__status ${item.status.toLowerCase() === "live" ? "is-live" : ""}">${item.status}</dd>
        </div>
      </dl>

      ${item.links?.length ? html`<div class="project__links label">${item.links.map((link) => smartLink(link))}</div>` : ""}
    </div>
  </article>
`;

export default {
  id: "projects",

  render: ({ projects }, { label, number }) => html`
    <section class="section projects" id="projects" aria-labelledby="projects-title">
      <div class="wrap">
        ${sectionHead({ id: "projects", number, label, title: projects.title })}
        <div class="projects__list">
          ${projects.items.map((item, i) => project(item, i, projects.items.length))}
        </div>
      </div>
    </section>
  `,
};
