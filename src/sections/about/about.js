import "./about.css";
import { html, rich } from "../../lib/html.js";
import { sectionHead } from "../../lib/ui.js";

export default {
  id: "about",

  render: ({ about }, { label, number }) => html`
    <section class="section about" id="about" aria-labelledby="about-title">
      <div class="wrap">
        ${sectionHead({ id: "about", number, label, title: about.title })}

        <div class="split">
          <div>
            <p class="about__lead" data-reveal>${rich(about.lead)}</p>
            <dl class="about__facts">
              ${about.facts.map(
                (fact, i) => html`
                  <div class="about__fact" data-reveal style="--reveal-i: ${i + 1}">
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
};
