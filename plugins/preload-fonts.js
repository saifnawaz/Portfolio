/**
 * Vite plugin (build only): adds <link rel="preload"> for bundled font files
 * whose names match `patterns`, so above-the-fold text renders in the right
 * font straight away. File names are hashed, so this runs after bundling.
 */
export default function preloadFonts(patterns = []) {
  let base = "/";

  return {
    name: "portfolio:preload-fonts",
    apply: "build",

    configResolved(config) {
      base = config.base;
    },

    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        return Object.keys(ctx.bundle ?? {})
          .filter((file) => file.endsWith(".woff2") && patterns.some((pattern) => pattern.test(file)))
          .map((file) => ({
            tag: "link",
            attrs: { rel: "preload", as: "font", type: "font/woff2", href: base + file, crossorigin: "" },
            injectTo: "head",
          }));
      },
    },
  };
}
