import { combineTags } from "storybook/internal/csf";

type StoryEntry = {
  id: string;
  title: string;
  name: string;
  tags: readonly string[];
};

export type CatalogEntry = StoryEntry & {
  section: "Componenti" | "UI";
  group: string;
  componentTitle: string;
};

export type PreviewTheme = "light" | "dark" | "system";

export function catalogEntries(entries: readonly StoryEntry[]): CatalogEntry[] {
  return entries
    .flatMap<CatalogEntry>((entry) => {
      const [section, area, ...rest] = entry.title.split("/");
      const tags = combineTags("dev", "test", ...entry.tags);
      if (
        (section !== "Componenti" && section !== "UI") ||
        !area ||
        !tags.includes("dev") ||
        tags.some((tag) => ["regression", "diagnostic"].includes(tag))
      )
        return [];
      return [
        {
          ...entry,
          tags,
          section,
          group: section === "UI" ? "UI" : area,
          componentTitle: rest.join(" / ") || area,
        },
      ];
    })
    .sort((a, b) => a.title.localeCompare(b.title, "it"));
}

// The last story of each title stands for the component in the gallery.
export function representativeEntries(entries: readonly CatalogEntry[]): CatalogEntry[] {
  return [...new Map(entries.toReversed().map((entry) => [entry.title, entry])).values()].sort((a, b) =>
    a.title.localeCompare(b.title, "it"),
  );
}

export function storyHref(id: string): string {
  return `./?path=/story/${encodeURIComponent(id)}`;
}

export function comparisonHref(id: string): string {
  return `./?path=/story/esplora-confronto--affiancato&args=initialStoryId:${encodeURIComponent(id)}`;
}

export function previewHref(id: string, theme: PreviewTheme): string {
  const params = new URLSearchParams({ id, viewMode: "story", embed: "true", globals: `theme:${theme}` });
  return `./iframe.html?${params}`;
}

export async function loadCatalog(signal?: AbortSignal): Promise<CatalogEntry[]> {
  signal?.throwIfAborted();
  const { default: entries } = await import("virtual:storybook-catalog");
  signal?.throwIfAborted();
  return entries;
}

// Nested previews speak on the same Storybook channel as the story hosting
// them: without this their events would re-render or re-select the host.
export function installPreviewIsolation(container: HTMLElement): () => void {
  const isolate = (event: MessageEvent<unknown>) => {
    const previews = container.querySelectorAll<HTMLIFrameElement>("iframe[data-story-preview]");
    if (![...previews].some((frame) => frame.contentWindow === event.source)) return;
    let data: unknown;
    try {
      data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    } catch {
      return;
    }
    if (typeof data === "object" && data !== null && "key" in data && data.key === "storybook-channel")
      event.stopImmediatePropagation();
  };
  window.addEventListener("message", isolate, true);
  return () => window.removeEventListener("message", isolate, true);
}
