import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";
import { css } from "@/styled-system/css";
import { Flex } from "@/styled-system/jsx";

// Top header: container-max width, 24px/48px padding. Brand-only and centered
// for now (nav links intentionally omitted until categories/about ship).
export function Nav() {
  return (
    <header>
      <Flex
        as="nav"
        position="relative"
        align="center"
        justify="center"
        gap="4"
        marginInline="auto"
        maxWidth="container-max"
        paddingInline={{ base: "margin-mobile", md: "margin-desktop" }}
        paddingBlock="6"
      >
        <Link href="/" aria-label="PedagogicPoint home" className={css({ flexShrink: 0 })}>
          {/* Uniform 64px, but clamp scales it down on narrow phones so the
              wide script wordmark never overflows the margins (~5.3x font width). */}
          <Wordmark
            overrides={{ fontSize: "clamp(2.5rem,16vw,4rem)", lineHeight: "1", letterSpacing: "-0.02em" }}
          />
        </Link>
        {/* Absolute so the wordmark stays optically centered (design: brand centered for now). */}
        <div
          className={css({
            position: "absolute",
            right: { base: "margin-mobile", md: "margin-desktop" },
            top: "50%",
            transform: "translateY(-50%)",
          })}
        >
          <ThemeToggle />
        </div>
      </Flex>
    </header>
  );
}
