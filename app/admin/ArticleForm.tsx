"use client";

import { useActionState, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CATEGORIE } from "@/app/content";
import type { Article } from "@/app/content";
import type { ActionResult } from "./actions";
import { UnsplashPicker } from "./UnsplashPicker";
import { css } from "@/styled-system/css";

// MDXEditor touches the DOM/browser APIs — load client-only.
const BodyEditor = dynamic(() => import("./BodyEditor").then((m) => m.BodyEditor), {
  ssr: false,
  loading: () => <div className={css({ color: "muted", textStyle: "body-sm" })}>Caricamento editor…</div>,
});

const label = css({ textStyle: "body-sm", color: "muted", marginBottom: "1.5", display: "block" });
const field = css({
  width: "100%",
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "outline-variant",
  backgroundColor: "surface",
  color: "on-surface",
  paddingInline: "4",
  paddingBlock: "3",
  textStyle: "body-md",
  _focusVisible: { outline: "2px solid", outlineColor: "primary" },
});
const group = css({ marginBottom: "5" });

type FormAction = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

export function ArticleForm({
  action,
  initial,
  submitLabel,
}: {
  action: FormAction;
  initial?: Article;
  submitLabel: string;
}) {
  const [result, formAction, pending] = useActionState(action, null);

  // Controlled fields that need JS: body (MDXEditor) and copertina (Unsplash).
  const [body, setBody] = useState(initial?.body ?? "");
  const [copertina, setCopertina] = useState(initial?.copertina ?? "");

  return (
    <form action={formAction}>
      {/* Body + copertina are controlled; mirror them into the form via hidden inputs. */}
      <input type="hidden" name="body" value={body} />
      <input type="hidden" name="copertina" value={copertina} />

      <div className={group}>
        <label className={label} htmlFor="titolo">Titolo *</label>
        <input id="titolo" name="titolo" required defaultValue={initial?.titolo} className={field} />
      </div>

      <div className={group}>
        <label className={label} htmlFor="slug">Slug (vuoto = generato dal titolo)</label>
        <input id="slug" name="slug" defaultValue={initial?.slug} placeholder="generato-dal-titolo" className={field} />
      </div>

      <div className={css({ display: "grid", gap: "4", gridTemplateColumns: { md: "1fr 1fr" } })}>
        <div className={group}>
          <label className={label} htmlFor="categoria">Categoria</label>
          <select id="categoria" name="categoria" defaultValue={initial?.categoria ?? ""} className={field}>
            <option value="">—</option>
            {CATEGORIE.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={group}>
          <label className={label} htmlFor="autore">Autore</label>
          <input id="autore" name="autore" defaultValue={initial?.autore} className={field} />
        </div>
      </div>

      <div className={group}>
        <label className={label} htmlFor="introduzione">Introduzione (HTML semplice)</label>
        <textarea id="introduzione" name="introduzione" rows={4} defaultValue={initial?.introduzione} className={field} />
      </div>

      <div className={group}>
        <label className={label}>Copertina</label>
        {copertina && (
          <div
            className={css({
              position: "relative",
              aspectRatio: "2/1",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "2",
              border: "1px solid",
              borderColor: "outline-variant",
            })}
          >
            <Image src={copertina} alt="" fill sizes="820px" className={css({ objectFit: "cover" })} unoptimized />
          </div>
        )}
        <div className={css({ display: "flex", gap: "2" })}>
          <input
            value={copertina}
            onChange={(e) => setCopertina(e.target.value)}
            placeholder="URL immagine"
            className={field}
          />
          <UnsplashPicker onSelect={setCopertina} />
        </div>
      </div>

      <div className={group}>
        <label className={label}>Contenuto (Markdown)</label>
        <div
          className={css({
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "outline-variant",
            overflow: "hidden",
            backgroundColor: "surface",
          })}
        >
          <BodyEditor markdown={body} onChange={setBody} />
        </div>
      </div>

      <label className={css({ display: "flex", alignItems: "center", gap: "2", marginBottom: "6" })}>
        <input type="checkbox" name="evidenza" defaultChecked={initial?.evidenza} />
        <span className={css({ textStyle: "body-md", color: "on-surface" })}>In evidenza (Hero)</span>
      </label>

      {result && !result.ok && (
        <p className={css({ color: "error", textStyle: "body-sm", marginBottom: "4" })}>{result.error}</p>
      )}
      {result && result.ok && (
        <p className={css({ color: "primary", textStyle: "body-sm", marginBottom: "4" })}>Salvato.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={css({
          cursor: "pointer",
          borderRadius: "full",
          backgroundColor: "primary",
          color: "surface",
          paddingInline: "8",
          paddingBlock: "3",
          textStyle: "button",
          _disabled: { opacity: 0.5, cursor: "default" },
        })}
      >
        {pending ? "Salvataggio…" : submitLabel}
      </button>
    </form>
  );
}
