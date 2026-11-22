import { defineConfig } from "vite";
import prerender from "./plugins/prerender.js";
import preloadFonts from "./plugins/preload-fonts.js";

export default defineConfig({
  plugins: [
    prerender({ entry: "/src/render.js" }),
    // Fonts visible on first paint: the hero name and body text.
    preloadFonts([/ClashDisplay-Semibold/, /Satoshi-Regular/]),
  ],
});
