import preview from "../.storybook/preview";
import { CategoryTag } from "@/components/CategoryTag";
import { CATEGORIE } from "@/app/content";
import { CATEGORIA_NON_MAPPATA, categoriaArgType } from "./fixtures";
import { css } from "@/styled-system/css";
import { Flex } from "@/styled-system/jsx";

const meta = preview.meta({
  title: "Components/CategoryTag",
  component: CategoryTag,
  argTypes: { categoria: categoriaArgType },
});

// All five accents at once. This is the story that earns its keep: `practice` is
// mapped by no article in the live database (docs/todo-list.md), so an axe crawl
// of the site never renders it — which is exactly the blind spot ADR 0011
// wrote check:contrast to cover, and this covers it again on real DOM.
export const TutteLeCategorie = meta.story({
  // `args` is unused by `render` but keeps the required prop satisfied.
  args: { categoria: "apprendimento" },
  render: () => (
    <Flex gap="3" wrap="wrap" align="center">
      {CATEGORIE.map((c) => (
        <CategoryTag key={c} categoria={c} />
      ))}
    </Flex>
  ),
});

export const Singola = meta.story({
  args: { categoria: "bes" },
});

// An unmapped category falls back to the `secondary` accent rather than throwing.
// 25 articles hit this branch in production today — see docs/todo-list.md.
export const CategoriaNonMappata = meta.story({
  args: { categoria: CATEGORIA_NON_MAPPATA },
  decorators: [
    (Story) => (
      <div>
        <p className={css({ textStyle: "body-md", color: "muted", marginBottom: "3" })}>
          Categoria assente da <code>categoryAccent</code>: rende con l&apos;accento di riserva.
        </p>
        <Story />
      </div>
    ),
  ],
});
