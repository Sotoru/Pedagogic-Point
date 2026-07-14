import sanitizeHtml from "sanitize-html";

// Authored article HTML (introduzione, domande answers) is first-party but
// sanitized before rendering as a defence-in-depth measure. Allow the common
// formatting tags editors emit; drop everything else (scripts, styles, events).
export function cleanHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p", "br", "b", "strong", "i", "em", "u", "s", "blockquote",
      "ul", "ol", "li", "a", "h2", "h3", "h4", "span", "code", "pre",
    ],
    allowedAttributes: { a: ["href", "title", "target", "rel"] },
    // Force safe link behaviour on any anchor that survives.
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
  });
}
