"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteArticolo } from "./actions";
import { css } from "@/styled-system/css";

// One row in the admin list: title/meta + edit link + delete (with confirm).
export function ArticleRow({
  id,
  titolo,
  slug,
  categoria,
  evidenza,
}: {
  id: string;
  titolo: string;
  slug: string;
  categoria: string;
  evidenza: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    if (!confirm(`Eliminare "${titolo}"? L'azione è irreversibile.`)) return;
    startTransition(() => {
      void deleteArticolo(id);
    });
  };

  return (
    <li
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "4",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "outline-variant",
        backgroundColor: "surface",
        paddingInline: "4",
        paddingBlock: "3",
        opacity: pending ? 0.5 : 1,
      })}
    >
      <div className={css({ flex: "1", minWidth: "0" })}>
        <p className={css({ textStyle: "body-md", color: "primary", truncate: true })}>
          {titolo || "(senza titolo)"} {evidenza && <span title="In evidenza">★</span>}
        </p>
        <p className={css({ textStyle: "body-sm", color: "muted", truncate: true })}>
          /{slug} · {categoria || "—"}
        </p>
      </div>
      <Link
        href={`/admin/${id}`}
        className={css({ textStyle: "button", color: "primary", paddingInline: "3", paddingBlock: "1.5" })}
      >
        Modifica
      </Link>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className={css({
          cursor: "pointer",
          textStyle: "button",
          color: "error",
          paddingInline: "3",
          paddingBlock: "1.5",
          _disabled: { cursor: "default", opacity: 0.5 },
        })}
      >
        Elimina
      </button>
    </li>
  );
}
