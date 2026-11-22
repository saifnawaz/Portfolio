/* <head> tags built from content.site, so page metadata lives with the rest of the text. */
import { html } from "../lib/html.js";

export default function head({ site }) {
  return html`
    <title>${site.title}</title>
    <meta name="description" content="${site.description}" />
    <meta name="author" content="${site.name}" />
    <meta name="theme-color" content="#080808" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${site.title}" />
    <meta property="og:description" content="${site.description}" />
    <meta name="twitter:card" content="summary" />
    ${site.url
      ? html`<link rel="canonical" href="${site.url}" />
          <meta property="og:url" content="${site.url}" />`
      : ""}
  `;
}
