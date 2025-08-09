// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: false,
  bracketSameLine: true,
  trailingComma: "es5",
  importOrder: [
    "^(@astro|astro)",
    "<THIRD_PARTY_MODULES>",
    "^@/(?!components)(.*)$",
    "^@/components/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tailwindAttributes: ["class"],
  plugins: [
    "prettier-plugin-astro",
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};
