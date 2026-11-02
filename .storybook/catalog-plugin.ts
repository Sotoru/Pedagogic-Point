import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { storyNameFromExport, toId } from "storybook/internal/csf";
import type { Indexer } from "storybook/internal/types";
import type { Plugin } from "vite";

import { catalogEntries } from "../stories/explore/catalog.ts";

const MODULE_ID = "virtual:storybook-catalog";
const RESOLVED_ID = `\0${MODULE_ID}`;
const isStory = (file: string) => /\.stories\.tsx?$/.test(file);

// Indexes the stories with Storybook's own indexers, so the gallery and the
// comparison never need a hand-kept list of components.
export function storyCatalogPlugin(storiesDirectory: string, indexers: Indexer[]): Plugin {
  return {
    name: "storybook-catalog",
    resolveId(id) {
      if (id === MODULE_ID) return RESOLVED_ID;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return;
      const files = (await readdir(storiesDirectory, { recursive: true })).filter(isStory).sort();
      const inputs = await Promise.all(
        files.map(async (file) => {
          const filename = join(storiesDirectory, file);
          this.addWatchFile(filename);
          const indexer = indexers.find(({ test }) => test.test(filename));
          if (!indexer) throw new Error(`No Storybook indexer for ${filename}`);
          return indexer.createIndex(filename, {
            makeTitle(title) {
              if (!title) throw new Error(`Storybook title required in ${filename}`);
              return title;
            },
          });
        }),
      );
      const entries = catalogEntries(
        inputs.flat().flatMap((input) =>
          input.type === "story" && input.title
            ? [
                {
                  id: input.__id ?? toId(input.metaId ?? input.title, storyNameFromExport(input.exportName)),
                  title: input.title,
                  name: input.name ?? storyNameFromExport(input.exportName),
                  tags: input.tags ?? [],
                },
              ]
            : [],
        ),
      );
      return `export default ${JSON.stringify(entries)};`;
    },
    configureServer(server) {
      const refresh = (file: string) => {
        if (relative(storiesDirectory, file).startsWith("..") || !isStory(file)) return;
        const catalog = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (catalog) {
          server.moduleGraph.invalidateModule(catalog);
          server.ws.send({ type: "full-reload" });
        }
      };
      server.watcher.on("add", refresh).on("change", refresh).on("unlink", refresh);
      server.httpServer?.once("close", () => {
        server.watcher.off("add", refresh).off("change", refresh).off("unlink", refresh);
      });
    },
  };
}
