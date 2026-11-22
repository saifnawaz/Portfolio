/**
 * Page sections, in order. Reorder, add or remove them here.
 *
 * A section is a folder in src/sections/ with a module that exports:
 *   id                      the element id, and the key of its block in content.js
 *   render(content, meta)   returns its HTML; meta has { label, number }
 *   init(element)           optional, runs in the browser for behaviour
 * Its CSS sits next to it and is imported by the module.
 */
import hero from "./hero/hero.js";
import about from "./about/about.js";
import projects from "./projects/projects.js";
import toolkit from "./toolkit/toolkit.js";
import contact from "./contact/contact.js";

export default [hero, about, projects, toolkit, contact];
