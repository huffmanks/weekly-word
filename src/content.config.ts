import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

const sermons = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes/weekly-word/sermons" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().nullable().optional(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    pastor: reference("pastors"),
    series: reference("series").default("uncategorized"),
    image: z.string(),
    podcast: z.object({
      title: z.string().nullable().optional(),
      audio: z.string().nullable().optional(),
      image: z.string().nullable().optional(),
      link: z.string().nullable().optional(),
      fileSize: z.number().nullable().optional(),
      duration: z.number().nullable().optional(),
    }),
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

const purposes = defineCollection({
  loader: glob({ pattern: "purposes.json", base: "./src/data" }),
  schema: z.array(
    z.object({
      purpose: z.string(),
      group: z.array(
        z.object({
          id: z.string(),
          day: z.number(),
          title: z.string(),
          point: z.string(),
          verse: z.string(),
          question: z.string(),
          img: z.string(),
        })
      ),
    })
  ),
});

export const collections = { pastors, purposes, series, sermons };
