import "./footer.css";
import { html } from "../lib/html.js";

export default function footer({ site, footer }) {
  return html`
    <footer class="site-footer">
      <div class="wrap site-footer__inner label">
        <span>© ${new Date().getFullYear()} ${site.name}</span>
        <span>${footer.credit}</span>
        <a class="site-footer__top" href="#main">Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  `;
}
