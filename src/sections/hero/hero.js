/**
 * Hero: the name, edge to edge, plus a one-liner and two corner details.
 *
 * - Each letter is its own span (for the intro and the cursor reaction).
 *   (Clash Display has no kerning table, so splitting the name loses nothing.)
 * - The name fills the width via CSS: font-size = 100cqi / (name width in em).
 *   JS measures that em width once the font is loaded (`--name-em`).
 * - The Karachi clock is any element with [data-clock] (see lib/clock.js).
 */
import "./hero.css";
import { html } from "../../lib/html.js";
import { initLetterField } from "./letters.js";

const NAME_FONT = '600 100px "Clash Display"';

const word = (text, start) =>
  html`<span class="hero__word">${[...text].map(
    (char, i) => html`<span class="hero__char" style="--i: ${start + i}">${char}</span>`,
  )}</span>`;

export default {
  id: "hero",

  render: ({ hero, site }) => {
    const first = hero.firstName.toUpperCase();
    const last = hero.lastName.toUpperCase();
    return html`
      <section class="hero" id="hero" aria-labelledby="hero-title">
        <p class="hero__line"><span>${hero.tagline}</span></p>

        <h1 class="hero__name" id="hero-title">
          <span class="sr-only">${hero.firstName} ${hero.lastName}</span>
          <span class="hero__name-text" aria-hidden="true">${word(first, 0)} ${word(last, first.length)}</span>
        </h1>

        <div class="hero__meta label">
          <p class="hero__status"><span class="dot" aria-hidden="true"></span>${hero.status}</p>
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

    Promise.race([document.fonts.load(NAME_FONT), timeout])
      .catch(() => {})
      .then(() => {
        fit(hero, text);
        // Two frames so the hidden start state is painted before the intro runs.
        requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("is-ready")));
      });

    // Letters react to the mouse only while the name is still the hero (not mid-shrink).
    initLetterField(hero, [...hero.querySelectorAll(".hero__char")], {
      isActive: () => window.scrollY < 40,
    });
  },
};

/** Measures the name's width in em, so CSS can size it to fill the row exactly. */
function fit(hero, text) {
  const size = parseFloat(getComputedStyle(text).fontSize);
  hero.style.setProperty("--name-em", (text.getBoundingClientRect().width / size).toFixed(4));
}
