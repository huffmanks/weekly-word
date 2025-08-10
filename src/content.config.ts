import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

const sermons = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes/weekly-word/sermons" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    pastor: reference("pastors"),
    series: reference("series").default("uncategorized"),
    podcast: z
      .object({
        title: z.string().nullable(),
        audio: z.string().nullable(),
        image: z.string().nullable(),
        link: z.string().nullable(),
      })
      .optional(),
    verses: z.array(z.string()).optional(),
  }),
});

const pastors = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes/weekly-word/pastors" }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
    email: z.string().email(),
    church: z.object({
      title: z.string(),
      location: z.string(),
    }),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes/weekly-word/series" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
  }),
});

export const collections = { pastors, series, sermons };
