/**
 * Tiny HTML templating.
 *
 *   html`<p>${text}</p>`   escapes every interpolated value, joins arrays,
 *                          and skips null / undefined / false.
 *   raw(string)            marks a string as trusted HTML (no escaping).
 *   rich(text)             escapes text and turns *words* into <em>words</em>.
 */
const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

class SafeHTML {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

export const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

export const raw = (value) => new SafeHTML(String(value));

const toHTML = (value) => {
  if (value == null || value === false) return "";
  if (Array.isArray(value)) return value.map(toHTML).join("");
  if (value instanceof SafeHTML) return value.value;
  return escape(value);
};

export const html = (strings, ...values) =>
  new SafeHTML(strings.reduce((out, str, i) => out + toHTML(values[i - 1]) + str));

export const rich = (text) => raw(escape(text).replace(/\*(.+?)\*/g, "<em>$1</em>"));
