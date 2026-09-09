import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    status: z.enum(["seedling", "budding", "evergreen"]),
    archived: z.boolean().default(false),
  }),
});

const project = defineCollection({
  loader: glob({ base: "./src/content/project", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()).default([]),
    projectStatus: z.enum(["validated", "host-validated", "in-progress", "experiment"]),
    validationNote: z.string(),
    githubUrl: z.url().optional(),
    demoUrl: z.url().optional(),
    archived: z.boolean().default(false),
  }),
});

export const collections = { blog, project };
