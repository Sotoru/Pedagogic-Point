import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { css } from "@/styled-system/css";

export const metadata: Metadata = { title: "Admin — Login", robots: { index: false } };

export default function LoginPage() {
  return (
    <main
      className={css({
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        paddingInline: "margin-mobile",
        backgroundColor: "surface-container",
      })}
    >
      <div
        className={css({
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "surface",
          borderRadius: "24px",
          padding: { base: "8", md: "10" },
          boxShadow: "hover-active",
        })}
      >
        <h1 className={css({ textStyle: "headline-sm", color: "primary", marginBottom: "6" })}>Area riservata</h1>
        <LoginForm />
      </div>
    </main>
  );
}
