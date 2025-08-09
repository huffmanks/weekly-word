// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

const isDev = process.env.NODE_ENV === "development";

// https://astro.build/config
export default defineConfig({
  site: isDev ? "http://localhost:4321" : "https://word.huffmanks.com",
  base: "/",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap(), mdx(), pagefind()],
});
