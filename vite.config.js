import { defineConfig } from "vite";
import prerender from "./plugins/prerender.js";

export default defineConfig({
  plugins: [prerender({ entry: "/src/render.js" })],
});
