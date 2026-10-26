"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { $createParagraphNode } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { useCellValue, usePublisher } from "@mdxeditor/gurx";
import {
  activeEditor$,
  cancelLinkEdit$,
  convertSelectionToNode$,
  currentBlockType$,
  linkDialogState$,
  readOnly$,
  removeLink$,
  switchFromPreviewToLinkEdit$,
  updateLink$,
  type BlockType,
} from "@mdxeditor/editor";
import { css } from "@/styled-system/css";
import { Button } from "@/components/Button";

// Public MDXEditor extension points, without patching vendor DOM or CSS internals.
export function EditorBlockType() {
  const current = useCellValue(currentBlockType$);
  const readOnly = useCellValue(readOnly$);
  const convert = usePublisher(convertSelectionToNode$);
  return (
    <select
      aria-label="Tipo di blocco"
      value={current}
      disabled={readOnly}
      onChange={(event) => {
        const value = event.target.value as BlockType;
        if (value === "paragraph") convert(() => $createParagraphNode());
        else if (value === "quote") convert(() => $createQuoteNode());
        else if (value) convert(() => $createHeadingNode(value));
      }}
      className={css({
        backgroundColor: "surface-container", color: "on-surface",
        border: "1px solid", borderColor: "outline", borderRadius: "4px",
        padding: "1", textStyle: "body-md", minHeight: "8",
      })}
    >
      <option value="" disabled>Tipo di blocco</option>
      <option value="paragraph">Paragrafo</option>
      <option value="quote">Citazione</option>
      <option value="h1">Titolo 1</option>
      <option value="h2">Titolo 2</option>
      <option value="h3">Titolo 3</option>
      <option value="h4">Titolo 4</option>
      <option value="h5">Titolo 5</option>
      <option value="h6">Titolo 6</option>
    </select>
  );
}

const field = css({
  display: "block", width: "100%", minWidth: "0", marginTop: "1.5",
  backgroundColor: "surface", color: "on-surface", border: "1px solid",
  borderColor: "outline", borderRadius: "12px", padding: "3", textStyle: "body-md",
});

export function EditorLinkDialog() {
  const state = useCellValue(linkDialogState$);
  const editor = useCellValue(activeEditor$);
  const update = usePublisher(updateLink$);
  const cancel = usePublisher(cancelLinkEdit$);
  const edit = usePublisher(switchFromPreviewToLinkEdit$);
  const remove = usePublisher(removeLink$);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [copyMessage, setCopyMessage] = useState("");
  const editing = state.type === "edit";

  useEffect(() => {
    if (editing && !dialog.current?.open) dialog.current?.showModal();
  }, [editing]);

  const cancelEdit = () => {
    dialog.current?.close();
    cancel();
  };

  if (state.type === "inactive") return <></>;
  if (state.type === "preview") {
    return (
      <div role="group" aria-label="Collegamento" className={css({
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2", padding: "3",
        backgroundColor: "surface", color: "on-surface", textStyle: "body-md",
      })}>
        <a href={state.href ?? "about:blank"} target="_blank" rel="noreferrer" className={css({ width: "100%", overflowWrap: "anywhere", color: "secondary", textDecoration: "underline" })}>
          {state.url}
        </a>
        <Button type="button" onClick={() => { setCopyMessage(""); edit(); }}>Modifica link</Button>
        <Button type="button" onClick={async () => {
          try {
            await navigator.clipboard.writeText(state.url);
            setCopyMessage("Collegamento copiato.");
          } catch {
            setCopyMessage("Copia non riuscita. Puoi selezionare e copiare l'indirizzo qui sopra.");
          }
        }}>Copia link</Button>
        <Button type="button" onClick={() => { editor?.focus(); remove(); }}>Rimuovi link</Button>
        <span role="status">{copyMessage}</span>
      </div>
    );
  }

  // Portal avoids nesting this form inside the article form. Native dialog
  // supplies focus containment and Escape; close before restoring editor focus.
  return createPortal(
    <dialog ref={dialog} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); cancelEdit(); }} className={css({
      width: "calc(100% - 2rem)", maxWidth: "480px", maxHeight: "85dvh", overflow: "auto",
      margin: "auto", padding: "5", borderRadius: "20px", border: "1px solid", borderColor: "outline",
      backgroundColor: "surface", color: "on-surface", fontFamily: "inter", textStyle: "body-md",
      _backdrop: { backgroundColor: "rgba(0,0,0,0.5)" },
    })}>
      <h2 id={titleId} className={css({ textStyle: "headline-sm", marginBottom: "4" })}>Modifica collegamento</h2>
      <form onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const data = new FormData(event.currentTarget);
        dialog.current?.close();
        update({
          url: String(data.get("url") ?? "").trim(),
          title: String(data.get("title") ?? ""),
          text: state.withAnchorText ? String(data.get("text") ?? "") : state.text,
        });
        editor?.focus();
      }} className={css({ display: "grid", gap: "4" })}>
        <label>Indirizzo URL
          <input name="url" inputMode="url" defaultValue={state.url} className={field} />
        </label>
        {state.withAnchorText && <label>Testo del collegamento
          <input name="text" defaultValue={state.text} className={field} />
        </label>}
        <label>Titolo del collegamento (facoltativo)
          <input name="title" defaultValue={state.title} className={field} />
        </label>
        <div className={css({ display: "flex", flexWrap: "wrap", gap: "2" })}>
          <Button type="submit">Salva link</Button>
          <Button type="button" onClick={cancelEdit}>Annulla</Button>
        </div>
      </form>
    </dialog>,
    document.body,
  );
}
