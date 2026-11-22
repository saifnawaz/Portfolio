/**
 * Hero: a statement and a "Currently" list, a fanned stack of project cards
 * (desktop, stack.js), then the name edge to edge, with small details under it
 * (status, study, location + clock).
 *
 * - Each letter is its own span (for the intro and the cursor reaction).
 *   (Clash Display has no kerning table, so splitting the name loses nothing.)
 * - The name fills the width via CSS: font-size = 100cqi / (name width in em).
 *   JS measures that em width once the font is loaded (`--name-em`).
 * - The Karachi clock is any element with [data-clock] (see lib/clock.js).
 */
import "./hero.css";
import { html, rich } from "../../lib/html.js";
import { initLetterField } from "./letters.js";
import { initNameMorph } from "./morph.js";
import { initGlow } from "./glow.js";
import { renderStack } from "./stack.js";

const NAME_FONT = '600 100px "Clash Display"';

const word = (text, start) =>
  html`<span class="hero__word">${[...text].map(
    (char, i) => html`<span class="hero__char" style="--i: ${start + i}">${char}</span>`,
  )}</span>`;

export default {
  id: "hero",
  dockLogo: true, // the name shrinks into the nav logo on scroll (see morph.js)

  render: ({ hero, site, projects }) => {
    const first = hero.firstName.toUpperCase();
    const last = hero.lastName.toUpperCase();
    return html`
      <section class="hero" id="hero" aria-labelledby="hero-title">
        <div class="hero__glow" aria-hidden="true"><span></span></div>
        <div class="hero__top">
          <div class="hero__intro">
            ${hero.statement ? html`<p class="hero__statement" data-split>${rich(hero.statement)}</p>` : ""}
            ${hero.currently?.length
              ? html`<div class="hero__now">
                  <p class="hero__now-title label">Currently</p>
                  <dl>
                    ${hero.currently.map(
                      (item, i) => html`<div class="hero__now-row" style="--i: ${i}">
                        <dt class="label">${item.label}</dt>
                        <dd>${item.value}</dd>
                      </div>`,
                    )}
                  </dl>
                </div>`
              : ""}
          </div>
          ${projects?.items?.length ? renderStack(projects.items) : ""}
        </div>

        <h1 class="hero__name" id="hero-title">
          <span class="sr-only">${hero.firstName} ${hero.lastName}</span>
          <span class="hero__name-text" aria-hidden="true">${word(first, 0)} ${word(last, first.length)}</span>
        </h1>

        <div class="hero__meta label">
          <p class="hero__status"><span class="dot" aria-hidden="true"></span>${hero.status}</p>
          ${hero.study ? html`<p>${hero.study}</p>` : ""}
          <p>
            ${site.location} <span aria-hidden="true">·</span>
            <time data-clock data-tz="${site.timezone}" data-suffix="${site.utcOffset}">${site.utcOffset}</time>
          </p>
        </div>
      </section>
    `;
  },

  init(hero) {
    const text = hero.querySelector(".hero__name-text");
    const timeout = new Promise((resolve) => setTimeout(resolve, 2500));
    const remeasure = initNameMorph(text);

    Promise.race([document.fonts.load(NAME_FONT), timeout])
      .catch(() => {})
      .then(() => {
        fit(hero, text);
        remeasure();
        // Two frames so the hidden start state is painted before the intro runs.
        requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("is-ready")));
      });

    initGlow(hero);

    // Letters react to the mouse only while the name is still the hero (not mid-shrink).
    initLetterField(hero, [...hero.querySelectorAll(".hero__char")], {
      isActive: () => window.scrollY < 40,
    });
  },
};

/** Measures the name's width in em, so CSS can size it to fill the row exactly. */
function fit(hero, text) {
  const previous = text.style.transform;
  text.style.transform = "none"; // measure the unscaled name
  const size = parseFloat(getComputedStyle(text).fontSize);
  hero.style.setProperty("--name-em", (text.getBoundingClientRect().width / size).toFixed(4));
  text.style.transform = previous;
}
