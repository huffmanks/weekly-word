import type { CollectionEntry } from "astro:content";

export type Site = {
  title: string;
  description: string;
  email: string;
};

export type Heading = {
  depth: number;
  slug: string;
  text: string;
};

export type TOCHeading = Heading & {
  subheadings: TOCHeading[];
};

export type WeeklyVerses = {
  id: number;
  verses: string;
  text: string;
};

export type SermonsAccumulator = {
  [year: string]: CollectionEntry<"sermons">[];
};
