/**
 * Vite plugin: renders the page into index.html.
 * - build: loads `entry` once through a short-lived Vite server.
 * - dev:   loads it on every page request, and reloads the browser when a
 *          JS file in src/ changes (content and templates render server-side).
 *
 * index.html needs two markers: <!--head--> and <!--app-->.
 * `entry` must export render() returning { head, body } strings.
 */
import path from "node:path";
import { createServer } from "vite";

export default function prerender({ entry = "/src/render.js" } = {}) {
  let root, srcDir;

  return {
    name: "portfolio:prerender",

    configResolved(config) {
      root = config.root;
      srcDir = path.join(root, "src");
    },

    handleHotUpdate({ file, server }) {
      if (path.normalize(file).startsWith(srcDir) && file.endsWith(".js")) {
        server.moduleGraph.invalidateAll();
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },

    transformIndexHtml: {
      order: "pre",
      async handler(html, ctx) {
        const { render } = ctx.server
          ? await ctx.server.ssrLoadModule(entry)
          : await loadOnce(root, entry);
        const { head, body } = render();
        return html.replace("<!--head-->", head).replace("<!--app-->", body);
      },
    },
  };
}

async function loadOnce(root, entry) {
  const server = await createServer({
    root,
    configFile: false,
    logLevel: "error",
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  try {
    return await server.ssrLoadModule(entry);
  } finally {
    await server.close();
  }
}
