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
