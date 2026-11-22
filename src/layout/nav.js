/**
 * Fixed top nav. Links are generated from the sections that have a label in
 * content.js, so adding or removing a section updates the nav by itself.
 *
 * The logo is the site name. If a section sets `dockLogo: true` (the hero),
 * that section reveals the logo itself (the name shrinks into it) by toggling
 * `.is-compact`; otherwise the logo is always visible and the nav turns solid
 * once the page scrolls.
 *
 * Below 48rem (with JS) the links fold into a "Menu" button that opens a
 * full-screen <dialog> (focus stays inside; Esc, a tap anywhere or a link closes it).
 * Without JS the inline links stay visible at every width.
 */
import "./nav.css";
import { html } from "../lib/html.js";
import { lockScroll, onScroll } from "../lib/scroll.js";

const MENU_ID = "site-menu";

export default function nav({ site }, sections) {
  const docked = sections.some((section) => section.dockLogo);
  const links = sections.filter((section) => section.label);
  return html`
    <header class="site-nav" data-nav ${docked ? html`data-dock` : ""}>
      <div class="site-nav__inner">
        <a class="site-nav__brand" href="#main"><span class="site-nav__logo">${site.name}</span></a>
        <nav aria-label="Sections">
          <ul class="site-nav__links label" role="list">
            ${links.map((section) => html`<li><a class="site-nav__link" href="#${section.id}" data-magnetic>${section.label}</a></li>`)}
          </ul>
        </nav>
        <button class="site-nav__menu label" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="${MENU_ID}">
          Menu
        </button>
      </div>
    </header>

    <dialog class="site-menu" id="${MENU_ID}" aria-label="Menu">
      <div class="site-menu__bar">
        <a class="site-nav__brand" href="#main"><span class="site-nav__logo">${site.name}</span></a>
        <button class="site-menu__close label" type="button" autofocus>Close</button>
      </div>
      <nav aria-label="Sections">
        <ul class="site-menu__links" role="list">
          ${links.map(
            (section, i) => html`<li style="--i: ${i}">
              <a class="site-menu__link" href="#${section.id}"
                ><span class="site-menu__num label" aria-hidden="true">(${section.number})</span>${section.label}</a
              >
            </li>`,
          )}
        </ul>
      </nav>
    </dialog>
  `;
}

export function initNav() {
  const header = document.querySelector("[data-nav]");
  if (!header) return;
  initMenu(header);
  if (!header.hasAttribute("data-dock")) onScroll((y) => header.classList.toggle("is-compact", y > 24));
}

function initMenu(header) {
  const menu = document.getElementById(MENU_ID);
  const toggle = header.querySelector(".site-nav__menu");
  if (!menu || !toggle || typeof menu.showModal !== "function") return;

  const settle = () => {
    toggle.setAttribute("aria-expanded", "false");
    lockScroll(false);
  };
  // Unlock right away (not on the async "close" event), so a link's smooth scroll can run.
  const close = () => {
    if (!menu.open) return;
    menu.close();
    settle();
  };

  toggle.addEventListener("click", () => {
    menu.showModal();
    toggle.setAttribute("aria-expanded", "true");
    lockScroll(true);
  });
  menu.addEventListener("close", settle); // Esc
  // Any tap closes it: a link (which then scrolls to its section), the close button, or empty space.
  menu.addEventListener("click", close);
  matchMedia("(min-width: 48rem)").addEventListener("change", (event) => event.matches && close());
}
