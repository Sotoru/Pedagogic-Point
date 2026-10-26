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
  ListsToggle,
  CreateLink,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { css } from "@/styled-system/css";
import { EditorBlockType, EditorLinkDialog } from "./EditorControls";

// Markdown WYSIWYG for the article body. Loaded via next/dynamic(ssr:false)
// from ArticleForm, so plugins initialize client-side only (per MDXEditor docs).
// `markdown` behaves like defaultValue — we do NOT feed onChange state back in.
export function BodyEditor({ markdown, onChange }: { markdown: string; onChange: (md: string) => void }) {
  return (
    <MDXEditor
      // MDXEditor's unlayered CSS supplies its own light-only defaults.
      // Override its public variables (also passed to popup roots) with
      // semantic tokens; important crosses the vendor/Panda layer boundary.
      className={css({
        "--basePageBg": "{colors.surface} !important",
        "--baseBase": "{colors.surface} !important",
        "--baseBgSubtle": "{colors.surface} !important",
        "--baseBg": "{colors.surface-container} !important",
        "--baseBgHover": "{colors.border-subtle} !important",
        "--baseBgActive": "{colors.border-subtle} !important",
        "--baseLine": "{colors.border-subtle} !important",
        "--baseBorder": "{colors.outline} !important",
        "--baseBorderHover": "{colors.primary} !important",
        "--baseSolid": "{colors.outline} !important",
        "--baseSolidHover": "{colors.primary} !important",
        "--baseText": "{colors.muted} !important",
        "--baseTextContrast": "{colors.on-surface} !important",
        "--accentText": "{colors.secondary} !important",
        "--accentTextContrast": "{colors.secondary} !important",
        "--accentSolid": "{colors.secondary} !important",
        "--accentSolidHover": "{colors.secondary} !important",
        "--font-body": "{fonts.inter} !important",
        "& [data-placeholder]": { color: "muted !important" },
      })}
      markdown={markdown}
      onChange={onChange}
      contentEditableClassName="prose"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin({ LinkDialog: EditorLinkDialog }),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
                <EditorBlockType />
              <ListsToggle />
              <CreateLink />
            </>
          ),
        }),
      ]}
    />
  );
}
