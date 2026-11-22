/**
 * Hero (placeholder). To redesign it, replace this folder; keep the page's
 * single <h1> in here and read text from content.hero.
 * The Karachi clock is any element with [data-clock] (see lib/clock.js).
 */
import "./hero.css";
import { html } from "../../lib/html.js";

export default {
  id: "hero",

  render: ({ hero, site }) => html`
    <section class="hero" id="hero" aria-labelledby="hero-title">
      <div class="hero__portrait">
        <img
          src="${hero.portrait.src}"
          alt="${hero.portrait.alt}"
          width="${hero.portrait.width}"
          height="${hero.portrait.height}"
          fetchpriority="high"
        />
      </div>

      <div class="hero__inner wrap">
        <h1 class="hero__name" id="hero-title">
          <span class="hero__line"><span>${hero.firstName}</span></span>
          <span class="hero__line"><span>${hero.lastName}</span></span>
        </h1>

        <div class="hero__foot">
          <p class="hero__tagline">${hero.tagline}</p>
          <ul class="hero__meta label" role="list">
            <li class="hero__status"><span class="hero__dot" aria-hidden="true"></span>${hero.status}</li>
            <li>
              ${site.location} <span aria-hidden="true">·</span>
              <time data-clock data-tz="${site.timezone}" data-suffix="${site.utcOffset}">${site.utcOffset}</time>
            </li>
          </ul>
        </div>
      </div>
    </section>
  `,
};
