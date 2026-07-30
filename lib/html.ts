import sanitizeHtml from "sanitize-html";

// Authored intro HTML is first-party but sanitized before rendering as a
// defence-in-depth measure. The long-form article body uses Markdown instead.
export function cleanHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: ["p", "br", "b", "strong", "i", "em", "u", "s", "a", "span", "code"],
    allowedAttributes: { a: ["href", "title", "target", "rel"] },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
  });
}
