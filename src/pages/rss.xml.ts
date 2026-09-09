import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const posts = (await getCollection("blog", ({ data }) => !data.archived)).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
  const site = context.site ?? new URL(context.url.origin);

  return rss({
    title: "技术成长档案",
    description: "嵌入式、Python 与 AI 应用方向的学习实践、问题排查和阶段性复盘。",
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
  });
};
