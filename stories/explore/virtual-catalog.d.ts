declare module "virtual:storybook-catalog" {
  const entries: import("./catalog").CatalogEntry[];
  export default entries;
}
