import { addons } from "storybook/manager-api";
import { create, getPreferredColorScheme, themes } from "storybook/theming";
import { semanticTokens } from "../theme/tokens.gen";

const base = getPreferredColorScheme();
const primary = semanticTokens.colors.primary.value;

addons.setConfig({
  theme: create({
    base,
    brandTitle: "PedagogicPoint · UI",
    brandUrl: "?path=/story/panoramica--benvenuto",
    brandTarget: "_self",
    colorPrimary: base === "dark" ? primary._dark : primary.base,
    colorSecondary: base === "dark" ? semanticTokens.colors.secondary.value._dark : semanticTokens.colors.secondary.value.base,
    appBg: themes[base].appContentBg,
  }),
  layout: { navSize: 280, showPanel: false },
  sidebar: { showRoots: true },
});
