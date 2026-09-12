import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.SITE_URL ?? "https://blog.liuguangzhong.top";

export default defineConfig({
  output: "static",
  site,
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
