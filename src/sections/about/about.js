/**
 * About, in two columns (one on mobile):
 *   left   the section label and a big statement (sticky on desktop)
 *   right  a short bio whose words brighten as you scroll through it,
 *          then "Path", a timeline that draws itself (path.js),
 *          and "Off the clock", interests with hover images (interests.js)
 *
 * Without JS (or with reduced motion) everything is plain, static text.
 */
import "./about.css";
import { html } from "../../lib/html.js";
import { asideHead } from "../../lib/ui.js";
import { onScroll, reducedMotion } from "../../lib/scroll.js";
import { initPath, renderPath } from "./path.js";
import { initInterests, renderInterests } from "./interests.js";

const DIM = 0.5; // starting opacity: still 4.5:1 against the background

export default {
  id: "about",

  render: ({ about }, { label, number }) => html`
    <section class="section about" id="about" aria-labelledby="about-title">
      <div class="wrap cols">
        <div class="cols__aside">${asideHead({ id: "about", number, label, title: about.statement })}</div>

        <div class="cols__body">
          <p class="about__bio">${about.bio}</p>

          ${about.path?.length
            ? html`<div>
                <h3 class="cols__block-title label" data-reveal>${about.pathTitle}</h3>
                ${renderPath(about.path)}
              </div>`
            : ""}

          ${about.interests?.length
            ? html`<div>
                <h3 class="cols__block-title label" data-reveal>${about.interestsTitle}</h3>
                ${renderInterests(about.interests)}
              </div>`
            : ""}
        </div>
      </div>
    </section>
  `,

  init(section) {
    const bio = section.querySelector(".about__bio");
    if (bio && !reducedMotion) scrubWords(bio);
    initPath(section.querySelector(".path"));
    initInterests(section.querySelector(".interests"));
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
