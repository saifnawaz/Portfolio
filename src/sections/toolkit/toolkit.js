/**
 * Stack + certificates, from content.toolkit.
 * A certificate can take an optional `url` (e.g. a credential link).
 */
import "./toolkit.css";
import { html } from "../../lib/html.js";
import { sectionHead } from "../../lib/ui.js";

const list = (title, rows, i) => html`
  <div class="toolkit__col" data-reveal style="--reveal-i: ${i}">
    <h3 class="toolkit__title label">${title}</h3>
    <ul class="toolkit__rows" role="list">
      ${rows.map(
        (row) => html`
          <li class="toolkit__row">
            ${row.url
              ? html`<a class="toolkit__name" href="${row.url}" target="_blank" rel="noopener noreferrer"
                  >${row.name}<span class="sr-only"> (opens in a new tab)</span></a
                >`
              : html`<span class="toolkit__name">${row.name}</span>`}
            <span class="toolkit__tag label">${row.tag}</span>
          </li>
        `,
      )}
    </ul>
  </div>
`;

export default {
  id: "toolkit",

  render: ({ toolkit }, { label, number }) => html`
    <section class="section toolkit" id="toolkit" aria-labelledby="toolkit-title">
      <div class="wrap">
        ${sectionHead({ id: "toolkit", number, label, title: toolkit.title })}
        <div class="split">
          <div class="toolkit__grid">
            ${list(toolkit.stackTitle, toolkit.stack, 0)}
            ${list(
              toolkit.certificatesTitle,
              toolkit.certificates.map((c) => ({ name: c.name, tag: c.issuer, url: c.url })),
              1,
            )}
          </div>
        </div>
      </div>
    </section>
  `,
};
