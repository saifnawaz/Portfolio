/* Small partials shared by several sections. */
import { html, rich } from "./html.js";

/** Numbered label + big heading (revealed line by line), on the shared two-column grid. */
export const sectionHead = ({ id, number, label, title }) => html`
  <header class="section-head split">
    <p class="section-head__label label" data-reveal><span aria-hidden="true">(${number})</span> ${label}</p>
    ${title ? html`<h2 class="section-head__title" id="${id}-title" data-split>${rich(title)}</h2>` : ""}
  </header>
`;

/**
 * A link, or a muted "soon" label while its url is still empty.
 * { magnetic: true } makes the link drift toward the cursor (lib/magnetic.js).
 */
export const smartLink = ({ label, url }, className = "link", { magnetic = false } = {}) => {
  if (!url) {
    return html`<span class="${className} is-soon">${label} <span class="soon">(soon)</span></span>`;
  }
  const external = /^https?:\/\//.test(url);
  return html`<a class="${className}" href="${url}" ${external ? html`target="_blank" rel="noopener noreferrer"` : ""} ${magnetic ? html`data-magnetic` : ""}
    >${label}<span class="arrow" aria-hidden="true">↗</span>${external ? html`<span class="sr-only"> (opens in a new tab)</span>` : ""}</a
  >`;
};

/** A project's slug ("tika"), from content.js or derived from its title. */
export const projectSlug = (item) => item.slug ?? item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Anchor id of a project row, e.g. "project-tika" (the hero cards and toolkit link here). */
export const projectId = (item) => `project-${projectSlug(item)}`;
