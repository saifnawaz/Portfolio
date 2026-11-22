/**
 * Builds the page HTML from content.js. Runs at build time (and per request
 * in dev) through plugins/prerender.js, so the shipped HTML already contains
 * everything; client JS only adds behaviour.
 */
import content from "./data/content.js";
import sections from "./sections/index.js";
import head from "./layout/head.js";
import { html } from "./lib/html.js";

export function render() {
  // Sections whose content block has a label get a number and a nav link.
  let count = 0;
  const page = sections.map((section) => {
    const label = content[section.id]?.label ?? null;
    const number = label ? String(++count).padStart(2, "0") : null;
    return { ...section, label, number };
  });

  const body = html`
    <a class="skip-link" href="#main">Skip to content</a>
    <main id="main" tabindex="-1">${page.map((section) => section.render(content, section))}</main>
  `;

  return { head: String(head(content)), body: String(body) };
}
