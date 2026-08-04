import preview from "../.storybook/preview";
import { ClockIcon, RefreshIcon, SunIcon, MoonIcon, ChevronDown } from "./icons";
import { css } from "@/styled-system/css";
import { Flex } from "@/styled-system/jsx";

// icons.tsx is a module of five functions, not a component, so it gets one sheet
// rather than five story files. Each icon carries `aria-hidden` of its own — the
// visible name beside it is for the reader of this page, and the components that
// use these icons name themselves with aria-label instead.
const ICONS = [
  ["ClockIcon", <ClockIcon key="c" />],
  ["RefreshIcon", <RefreshIcon key="r" />],
  ["SunIcon", <SunIcon key="s" />],
  ["MoonIcon", <MoonIcon key="m" />],
  ["ChevronDown", <ChevronDown key="d" />],
] as const;

const meta = preview.meta({
  title: "Foundations/Icons",
});

export const Tutte = meta.story({
  render: () => (
    <Flex gap="8" wrap="wrap" align="flex-start">
      {ICONS.map(([name, node]) => (
        <Flex key={name} direction="column" align="center" gap="2" color="on-surface">
          {node}
          <span className={css({ textStyle: "label-caps", color: "muted" })}>{name}</span>
        </Flex>
      ))}
    </Flex>
  ),
});
