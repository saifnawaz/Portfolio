/* Small partials shared by several sections. */
import { html, rich } from "./html.js";

/** Numbered label + big italic heading, on the shared two-column grid. */
export const sectionHead = ({ id, number, label, title }) => html`
  <header class="section-head split" data-reveal>
    <p class="section-head__label label"><span aria-hidden="true">(${number})</span> ${label}</p>
    ${title ? html`<h2 class="section-head__title" id="${id}-title">${rich(title)}</h2>` : ""}
  </header>
`;

/** A link, or a muted "soon" label while its url is still empty. */
export const smartLink = ({ label, url }, className = "link") => {
  if (!url) {
    return html`<span class="${className} is-soon">${label} <span class="soon">soon</span></span>`;
  }
  const external = /^https?:\/\//.test(url);
  return html`<a class="${className}" href="${url}" ${external ? html`target="_blank" rel="noopener noreferrer"` : ""}
    >${label}<span class="arrow" aria-hidden="true">↗</span>${external ? html`<span class="sr-only"> (opens in a new tab)</span>` : ""}</a
  >`;
};
