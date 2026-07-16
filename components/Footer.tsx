import { Wordmark } from "./Wordmark";
import { css } from "@/styled-system/css";
import { Flex } from "@/styled-system/jsx";

// Footer (design.md): container-max, three-way flex — wordmark left, links center,
// copyright right. Links in muted label-caps, no dividers. Stacks below md.
export function Footer() {
  const meta = css({ textStyle: "label-caps", color: "muted" });
  return (
    <footer className={css({ borderTop: "1px solid", borderColor: "border-subtle" })}>
      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="between"
        gap="6"
        marginInline="auto"
        maxWidth="container-max"
        paddingInline={{ base: "margin-mobile", md: "margin-desktop" }}
        paddingBlock="12"
      >
        <Wordmark variant="brand-wordmark-sm" />
        <nav
          className={css({
            textStyle: "label-caps",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "6",
            color: "muted",
          })}
        >
          <a href="#">Informativa sulla privacy</a>
          <a href="#">Termini di servizio</a>
          <a href="#">Feed RSS</a>
        </nav>
        <p className={meta}>© 2024 PedagogicPoint. Tutti i diritti riservati.</p>
      </Flex>
    </footer>
  );
}
