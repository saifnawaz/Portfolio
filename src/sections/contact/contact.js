/**
 * Contact, from content.contact. Until `email` is filled in, the big heading
 * is plain text and the email row shows "(soon)".
 * "Let's talk" scales up slightly as it scrolls into view. On phones it fills
 * the width like the hero name (CSS: 100cqi / --title-em, measured here), and
 * the links become full-width rows.
 */
import "./contact.css";
import { html } from "../../lib/html.js";
import { sectionHead, smartLink } from "../../lib/ui.js";
import { onScroll, reducedMotion, whenNear } from "../../lib/scroll.js";

export default {
  id: "contact",

  render: ({ contact }, { label, number }) => {
    const { email } = contact;
    const title = email
      ? html`<a href="mailto:${email}" data-magnetic
          >${contact.title}<span class="contact__arrow" aria-hidden="true">↗</span
          ><span class="sr-only">, email ${email}</span></a
        >`
      : html`<span>${contact.title}</span>`;

    return html`
      <section class="section contact" id="contact" aria-labelledby="contact-title" data-surface="accent">
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
    if (!title) return;
    whenNear(section, () => fitTitle(section, title));
    if (reducedMotion) return;
    // Entering from the bottom of the viewport -> its middle: scale 0.85 -> 1.
    onScroll(() => {
      const top = title.getBoundingClientRect().top;
      const progress = Math.min(Math.max((innerHeight - top) / (innerHeight * 0.5), 0), 1);
      title.style.transform = `scale(${(0.85 + 0.15 * progress).toFixed(4)})`;
    });
  },
};

/** Measures the title's width in em (once Clash Display is in), so CSS can make it fill the row. */
function fitTitle(section, title) {
  const timeout = new Promise((resolve) => setTimeout(resolve, 2500));
  Promise.race([document.fonts.load('600 100px "Clash Display"'), timeout])
    .catch(() => {})
    .then(() => {
      const text = title.firstElementChild; // the inline text (or the email link)
      const em = text.offsetWidth / parseFloat(getComputedStyle(title).fontSize); // offsetWidth ignores the scale
      if (em > 0) section.style.setProperty("--title-em", em.toFixed(4));
    });
}

