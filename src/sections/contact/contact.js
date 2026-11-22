/**
 * Contact, from content.contact. Until `email` is filled in, the big heading
 * is plain text and the email row shows "(soon)".
 */
import "./contact.css";
import { html } from "../../lib/html.js";
import { sectionHead, smartLink } from "../../lib/ui.js";

export default {
  id: "contact",

  render: ({ contact }, { label, number }) => {
    const { email } = contact;
    const title = email
      ? html`<a href="mailto:${email}"
          >${contact.title}<span class="contact__arrow" aria-hidden="true">↗</span
          ><span class="sr-only">, email ${email}</span></a
        >`
      : contact.title;

    return html`
      <section class="section contact" id="contact" aria-labelledby="contact-title">
        <div class="wrap">
          ${sectionHead({ id: "contact", number, label })}
          <h2 class="contact__title" id="contact-title" data-reveal>${title}</h2>

          <div class="contact__foot" data-reveal style="--reveal-i: 1">
            <p class="contact__note">${contact.note}</p>
            <ul class="contact__links label" role="list">
              <li>${smartLink({ label: email || "Email", url: email ? `mailto:${email}` : "" })}</li>
              ${contact.links.map((link) => html`<li>${smartLink(link)}</li>`)}
            </ul>
          </div>
        </div>
      </section>
    `;
  },
};
