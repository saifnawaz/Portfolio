/**
 * About: heading, a lead paragraph whose words brighten as you scroll through
 * it, and three facts. Without JS (or with reduced motion) the lead is plain text.
 */
import "./about.css";
import { html, rich } from "../../lib/html.js";
import { sectionHead } from "../../lib/ui.js";
import { onScroll, reducedMotion } from "../../lib/scroll.js";

const DIM = 0.4; // starting opacity: still >= 3:1 contrast for this large text

export default {
  id: "about",

  render: ({ about }, { label, number }) => html`
    <section class="section about" id="about" aria-labelledby="about-title">
      <div class="wrap">
        ${sectionHead({ id: "about", number, label, title: about.title })}

        <div class="split">
          <div>
            <p class="about__lead">${rich(about.lead)}</p>
            <dl class="about__facts">
              ${about.facts.map(
                (fact, i) => html`
                  <div class="about__fact" data-reveal style="--reveal-i: ${i}">
                    <dt class="label">${fact.label}</dt>
                    <dd>${fact.text}</dd>
                  </div>
                `,
              )}
            </dl>
          </div>
        </div>
      </div>
    </section>
  `,

  init(section) {
    const lead = section.querySelector(".about__lead");
    if (lead && !reducedMotion) scrubWords(lead);
  },
};

/** Words go from dim to full white as the paragraph moves up the viewport. */
function scrubWords(el) {
  const words = el.textContent.replace(/\s+/g, " ").trim().split(" ");
  const spans = words.map((word) => Object.assign(document.createElement("span"), { textContent: word }));
  el.textContent = "";
  spans.forEach((span, i) => el.append(...(i ? [" ", span] : [span])));

  const levels = spans.map(() => -1);
  onScroll(() => {
    const box = el.getBoundingClientRect();
    const start = innerHeight * 0.85; // top of the paragraph here: nothing lit yet
    const end = innerHeight * 0.45; // bottom of the paragraph here: everything lit
    const progress = Math.min(Math.max((start - box.top) / (start - end + box.height), 0), 1);
    const lit = progress * (spans.length + 2); // each word fades over a two-word window

    spans.forEach((span, i) => {
      const t = Math.min(Math.max((lit - i) / 2, 0), 1);
      const level = Math.round((DIM + (1 - DIM) * t) * 100) / 100;
      if (level !== levels[i]) {
        levels[i] = level;
        span.style.opacity = level;
      }
    });
  });
}
