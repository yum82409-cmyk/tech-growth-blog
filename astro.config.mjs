import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.SITE_URL;

export default defineConfig({
  output: "static",
  ...(site ? { site } : {}),
  integrations: [mdx(), ...(site ? [sitemap()] : [])],
  vite: { plugins: [tailwindcss()] },
});