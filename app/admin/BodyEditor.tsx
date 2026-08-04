"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { css } from "@/styled-system/css";

// Markdown WYSIWYG for the article body. Loaded via next/dynamic(ssr:false)
// from ArticleForm, so plugins initialize client-side only (per MDXEditor docs).
// `markdown` behaves like defaultValue — we do NOT feed onChange state back in.
export function BodyEditor({ markdown, onChange }: { markdown: string; onChange: (md: string) => void }) {
  return (
    <div
      className={css({
        "& .mdxeditor": { backgroundColor: "surface" },
        // check:a11y caught the toolbar's "Block type" placeholder at 1.9:1:
        // MDXEditor paints it with var(--baseBorderHover), a border colour used as
        // text. !important is load-bearing, not laziness: its stylesheet is
        // unlayered and Panda's utilities are in @layer utilities, so unlayered
        // wins on the cascade whatever the specificity. Importance outranks layers.
        // ponytail: a literal, not a token, because MDXEditor's chrome stays light
        // even under our .dark — a theming token would flip and break this in dark
        // mode. Swap it for `muted` once MDXEditor's own dark-theme class is wired
        // up (tracked in docs/todo-list.md); the value is light `outline`.
        "& .mdxeditor [data-placeholder] > span:first-child": { color: "#646d74 !important" },
      })}
    >
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        contentEditableClassName="prose"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
                <CreateLink />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
