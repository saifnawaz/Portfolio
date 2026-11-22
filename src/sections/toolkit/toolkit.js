/**
 * Stack + certificates, from content.toolkit.
 * A certificate can take an optional `url` (e.g. a credential link).
 * On phones the stack is a two-column grid of cells; certificates stay a list.
 */
import "./toolkit.css";
import { html } from "../../lib/html.js";
import { sectionHead } from "../../lib/ui.js";

const list = (title, rows, i, kind) => html`
  <div class="toolkit__col">
    <h3 class="toolkit__title label" data-reveal style="--reveal-i: ${i}">${title}</h3>
    <ul class="toolkit__rows toolkit__rows--${kind}" role="list">
      ${rows.map(
        (row, r) => html`
          <li class="toolkit__row" data-reveal style="--reveal-i: ${i + r * 0.6}">
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
            ${list(toolkit.stackTitle, toolkit.stack, 0, "stack")}
            ${list(
              toolkit.certificatesTitle,
              toolkit.certificates.map((c) => ({ name: c.name, tag: c.issuer, url: c.url })),
              1,
              "certificates",
            )}
          </div>
        </div>
      </div>
    </section>
  `,
};
