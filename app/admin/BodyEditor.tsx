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
    <div className={css({ "& .mdxeditor": { backgroundColor: "surface" } })}>
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
