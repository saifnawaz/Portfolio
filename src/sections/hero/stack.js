/**
 * A small fanned stack of project cards (desktop only, see stack.css), from
 * content.projects.items: the same screenshots as the Work list. A project
 * without a screenshot gets a typographic card.
 *
 * Pure CSS: hovering the stack spreads the cards, hovering one lifts it and
 * shows its name; each card links to its row in Work (#project-<slug>).
 */
import "./stack.css";
import { html } from "../../lib/html.js";
import { projectId } from "../../lib/ui.js";

export const renderStack = (items) => html`
  <ul class="stack" role="list" aria-label="Projects" style="--n: ${items.length}">
    ${items.map(
      (item, i) => html`<li class="stack__card" style="--i: ${i}">
        <a class="stack__link" href="#${projectId(item)}">
          <span class="stack__frame">
            ${item.image
              ? html`<img src="${item.image}" alt="" width="1440" height="900" loading="lazy" decoding="async" fetchpriority="low" />`
              : html`<span class="stack__blank" aria-hidden="true"><span>${item.title}</span><span class="label">${item.status}</span></span>`}
            <span class="stack__name label">${item.title}<span class="sr-only">, jump to project</span></span>
          </span>
        </a>
      </li>`,
    )}
  </ul>
`;
