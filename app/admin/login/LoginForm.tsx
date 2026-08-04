"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { css } from "@/styled-system/css";

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

const button = css({
  width: "100%",
  cursor: "pointer",
  borderRadius: "full",
  backgroundColor: "primary",
  color: "surface",
  paddingBlock: "3",
  textStyle: "button",
  _disabled: { opacity: 0.5, cursor: "default" },
});

export function LoginForm() {
  const [error, formAction, pending] = useActionState(login, null);
  return (
    <form action={formAction} className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
      <input
        type="password"
        name="password"
        // A placeholder is not a label: it vanishes as soon as you type and is
        // not reliably announced. The field has no visible caption by design, so
        // the name is carried by aria-label.
        aria-label="Password"
        placeholder="Password"
        // This page exists only to type this password; sending focus there is the
        // whole point. The blanket rule can't tell it from a hijacked page load.
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        required
        className={field}
      />
      {error && <p className={css({ color: "error", textStyle: "body-sm" })}>{error}</p>}
      <button type="submit" disabled={pending} className={button}>
        {pending ? "Accesso…" : "Entra"}
      </button>
    </form>
  );
}
