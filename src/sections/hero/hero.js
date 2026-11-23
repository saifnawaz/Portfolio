/**
 * Hero: a role line and two buttons (View work, Résumé), a fanned stack of
 * project cards (desktop, stack.js), then the name edge to edge, with small
 * details under it (status, study, location + clock).
 *
 * - Each letter is its own span (for the intro and the cursor reaction).
 *   (Clash Display has no kerning table, so splitting the name loses nothing.)
 * - The name fills the width via CSS: font-size = 100cqi / (name width in em).
 *   JS measures that em width once the font is loaded (`--name-em`).
 * - Phones (<48rem): the name comes first, on two lines ("SAIF" / "NAWAZ"),
 *   each filling the width on its own (`--word-em` per word); then the role
 *   line, the buttons, a one-line status, a swipeable strip of project
 *   thumbnails (each jumps to its project) and a small scroll cue.
 * - The Karachi clock is any element with [data-clock] (see lib/clock.js).
 */
import "./hero.css";
import { html } from "../../lib/html.js";
import { projectId } from "../../lib/ui.js";
import { initLetterField } from "./letters.js";
import { initNameMorph } from "./morph.js";
import { initGlow } from "./glow.js";
import { renderStack } from "./stack.js";

const NAME_FONT = '600 100px "Clash Display"';
// Rough em widths of 4- and 5-letter words, until JS measures the real ones.
const WORD_EM = { 4: 2.35, 5: 3.82 };

// " · " inside a value: a no-break space before the dot keeps it off the start of a line.
const glueDots = (text) => String(text).replace(/ · /g, "\u00a0· ");

/** A hero button: { label, url, icon, primary }. External/PDF links open in a new tab. */
const button = ({ label, url, icon, primary }) => {
  const newTab = /^https?:|\.pdf$/i.test(url);
  return html`<a class="hero__btn ${primary ? "is-primary" : ""}" href="${url}" data-magnetic
    ${newTab ? html`target="_blank" rel="noopener noreferrer"` : ""}
    >${label}${icon ? html` <span class="hero__btn-icon" aria-hidden="true">${icon}</span>` : ""}${newTab
      ? html`<span class="sr-only"> (opens in a new tab)</span>`
      : ""}</a
  >`;
};

/** Phones: a row of small project cards to swipe through; each jumps to its project. */
const strip = (items) => html`
  <nav class="hero__strip" aria-label="Projects">
    <ul role="list">
      ${items.map(
        (item) => html`<li>
          <a class="hero__thumb" href="#${projectId(item)}">
            ${item.image
              ? html`<img src="${item.image}" alt="" width="1440" height="900" loading="lazy" decoding="async" />`
              : html`<span class="hero__thumb-blank" aria-hidden="true"></span>`}
            <span class="hero__thumb-title label">${item.title}</span>
          </a>
        </li>`,
      )}
    </ul>
  </nav>
`;

const word = (text, start) =>
  html`<span class="hero__word" style="--word-em: ${WORD_EM[text.length] ?? text.length * 0.75}">${[...text].map(
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
            ${hero.role ? html`<p class="hero__role">${hero.role}</p>` : ""}
            ${hero.actions?.length ? html`<div class="hero__actions">${hero.actions.map(button)}</div>` : ""}
          </div>
          ${projects?.items?.length ? renderStack(projects.items) : ""}
        </div>

        <h1 class="hero__name" id="hero-title">
          <span class="sr-only">${hero.firstName} ${hero.lastName}</span>
          <span class="hero__name-text" aria-hidden="true">${word(first, 0)} ${word(last, first.length)}</span>
        </h1>

        <div class="hero__meta label">
          <p class="hero__status"><span class="dot" aria-hidden="true"></span>${hero.status}</p>
          ${hero.study ? html`<p>${glueDots(hero.study)}</p>` : ""}
          <p>
            ${site.location} <span aria-hidden="true">·</span>
            <time data-clock data-tz="${site.timezone}" data-suffix="${site.utcOffset}">${site.utcOffset}</time>
          </p>
        </div>

        ${projects?.items?.length ? strip(projects.items) : ""}
        <a class="hero__cue label" href="#about">Scroll <span aria-hidden="true">↓</span></a>
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
        // The two layouts measure differently: refit when crossing the phone breakpoint.
        matchMedia("(max-width: 47.99rem)").addEventListener("change", () => {
          fit(hero, text);
          remeasure();
        });
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

/**
 * Measures widths in em, so CSS can size the name to fill the row exactly:
 * the whole name (one line, `--name-em`) and each word (phones, `--word-em`).
 */
function fit(hero, text) {
  const previous = text.style.transform;
  text.style.transform = "none"; // measure the unscaled name
  const em = (el) => el.getBoundingClientRect().width / parseFloat(getComputedStyle(el).fontSize);
  const words = [...text.querySelectorAll(".hero__word")];
  const wordEms = words.map(em); // read everything before writing
  if (!matchMedia("(max-width: 47.99rem)").matches) hero.style.setProperty("--name-em", em(text).toFixed(4));
  words.forEach((word, i) => word.style.setProperty("--word-em", wordEms[i].toFixed(4)));
  text.style.transform = previous;
}
