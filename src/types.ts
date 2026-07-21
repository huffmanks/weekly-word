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

export type WeeklyMemory = {
  id: number;
  verse: string;
  text: string;
};

export type DailyReading = {
  id: number;
  chapter: string;
  date: string;
  verses: Array<DailyReadingVerse>;
};

export type DailyReadingVerse = {
  number: number;
  text: string;
};

export type PurposeGroup = {
  id: string;
  title: string;
  day: number;
  point: string;
  verse: string;
  question: string;
  img: string;
};

export type Purpose = {
  purpose: string;
  group: Array<PurposeGroup>;
};

export type SermonsAccumulator = {
  [year: string]: CollectionEntry<"sermons">[];
};
