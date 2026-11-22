/**
 * Fixed top nav. Links are generated from the sections that have a label in
 * content.js, so adding or removing a section updates the nav by itself.
 *
 * The logo is the site name. If a section sets `dockLogo: true` (the hero),
 * that section reveals the logo itself (the name shrinks into it) by toggling
 * `.is-compact`; otherwise the logo is always visible and the nav turns solid
 * once the page scrolls.
 */
import "./nav.css";
import { html } from "../lib/html.js";
import { onScroll } from "../lib/scroll.js";

export default function nav({ site }, sections) {
  const docked = sections.some((section) => section.dockLogo);
  return html`
    <header class="site-nav" data-nav ${docked ? html`data-dock` : ""}>
      <div class="site-nav__inner">
        <a class="site-nav__brand" href="#main"><span class="site-nav__logo">${site.name}</span></a>
        <nav aria-label="Sections">
          <ul class="site-nav__links label" role="list">
            ${sections
              .filter((section) => section.label)
              .map((section) => html`<li><a class="site-nav__link" href="#${section.id}">${section.label}</a></li>`)}
          </ul>
        </nav>
      </div>
    </header>
  `;
}

export function initNav() {
  const header = document.querySelector("[data-nav]");
  if (!header || header.hasAttribute("data-dock")) return;
  onScroll((y) => header.classList.toggle("is-compact", y > 24));
}
