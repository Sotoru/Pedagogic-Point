import Markdown from "markdown-to-jsx";
import { css } from "@/styled-system/css";

const prose = css({
  textStyle: "body-lg",
  color: "on-surface",
  "& h2": { textStyle: "headline-sm", marginTop: "10", color: "primary" },
  "& h3": { textStyle: "headline-sm", marginTop: "8", color: "primary" },
  "& p": { marginTop: "4" },
  "& a": { color: "primary", textDecoration: "underline" },
  "& blockquote": {
    marginTop: "6",
    paddingLeft: "5",
    borderLeft: "3px solid",
    borderColor: "primary",
    color: "muted",
  },
  "& ul": { marginTop: "4", listStyleType: "disc", paddingLeft: "6" },
  "& ol": { marginTop: "4", listStyleType: "decimal", paddingLeft: "6" },
  "& li": { marginTop: "1" },
  "& code": {
    paddingInline: "1",
    borderRadius: "4px",
    backgroundColor: "surface-container",
    fontSize: "0.9em",
  },
  "& pre": {
    marginTop: "4",
    overflowX: "auto",
    padding: "4",
    borderRadius: "8px",
    backgroundColor: "surface-container",
  },
  "& pre code": { padding: "0", backgroundColor: "transparent" },
});

export function MarkdownBody({ children }: { children: string }) {
  return (
    <div className={prose}>
      <Markdown options={{ disableParsingRawHTML: true }}>{children}</Markdown>
    </div>
  );
}
