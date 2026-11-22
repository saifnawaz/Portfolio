/**
 * Contact, from content.contact. Until `email` is filled in, the big heading
 * is plain text and the email row shows "(soon)".
 * "Let's talk" scales up slightly as it scrolls into view.
 */
import "./contact.css";
import { html } from "../../lib/html.js";
import { sectionHead, smartLink } from "../../lib/ui.js";
import { onScroll, reducedMotion } from "../../lib/scroll.js";

export default {
  id: "contact",

  render: ({ contact }, { label, number }) => {
    const { email } = contact;
    const title = email
      ? html`<a href="mailto:${email}" data-magnetic
          >${contact.title}<span class="contact__arrow" aria-hidden="true">↗</span
          ><span class="sr-only">, email ${email}</span></a
        >`
      : contact.title;

    return html`
      <section class="section contact" id="contact" aria-labelledby="contact-title">
        <div class="wrap">
          ${sectionHead({ id: "contact", number, label })}
          <h2 class="contact__title" id="contact-title">${title}</h2>

          <div class="contact__foot">
            <p class="contact__note" data-split>${contact.note}</p>
            <ul class="contact__links label" role="list" data-reveal style="--reveal-i: 1">
              <li>${smartLink({ label: email || "Email", url: email ? `mailto:${email}` : "" }, "link", { magnetic: true })}</li>
              ${contact.links.map((link) => html`<li>${smartLink(link, "link", { magnetic: true })}</li>`)}
            </ul>
          </div>
        </div>
      </section>
    `;
  },

  init(section) {
    const title = section.querySelector(".contact__title");
    if (!title || reducedMotion) return;
    // Entering from the bottom of the viewport -> its middle: scale 0.85 -> 1.
    onScroll(() => {
      const top = title.getBoundingClientRect().top;
      const progress = Math.min(Math.max((innerHeight - top) / (innerHeight * 0.5), 0), 1);
      title.style.transform = `scale(${(0.85 + 0.15 * progress).toFixed(4)})`;
    });
  },
};
