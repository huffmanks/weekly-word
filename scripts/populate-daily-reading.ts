import type { DailyReading } from "@types";
import { ApiClient, BibleClient } from "@youversion/platform-core";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { bookMap } from "../src/lib/generateBibleUrl.ts";
import dailyReadings from "./init_daily-reading.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_KEY = process.env.YOUVERSION_API_KEY;

if (!API_KEY) throw new Error("No API key provided.");

const apiClient = new ApiClient({
  appKey: API_KEY,
});
const bibleClient = new BibleClient(apiClient);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function parseChapterString(chapterStr: string) {
  const lastSpaceIndex = chapterStr.lastIndexOf(" ");
  const bookName = chapterStr.substring(0, lastSpaceIndex).trim();
  const chapterNum = parseInt(chapterStr.substring(lastSpaceIndex + 1), 10);

  const bookAbbr = bookMap[bookName];
  if (!bookAbbr) {
    throw new Error(`Book name "${bookName}" not found in bookMap.`);
  }

  return { bookAbbr, chapterNum };
}

async function populateVerses(readings: Array<Omit<DailyReading, "verses">>, versionId: number) {
  const updatedReadings = [];

  for (const reading of readings) {
    try {
      console.log(`Processing chapter: ${reading.chapter}...`);

      const { bookAbbr, chapterNum } = parseChapterString(reading.chapter);

      const chapterData = await bibleClient.getChapter(versionId, bookAbbr, chapterNum);
      const versesList = chapterData.verses || [];

      if (versesList.length === 0) throw new Error("No verses found for this chapter");

      const formattedVerses = [];

      for (const v of versesList) {
        try {
          const singleVerseData = await bibleClient.getPassage(versionId, v.passage_id, "text");

          formattedVerses.push({
            number: v.title,
            text: singleVerseData.content || "",
          });

          await sleep(125);
        } catch (verseError) {
          console.error(`Error fetching individual verse ${v.passage_id}:`, verseError);
          formattedVerses.push({
            number: v.title,
            text: "",
          });

          await sleep(125);
        }
      }

      updatedReadings.push({
        ...reading,
        verses: formattedVerses,
      });

      await sleep(500);
    } catch (error) {
      console.error(`Error processing ${reading.chapter}:`, error);
      updatedReadings.push({ ...reading, verses: [] });
    }
  }

  return updatedReadings;
}

const VERSION_ID = 111;
const outputPath = path.join(__dirname, "new_daily-reading.json");

async function main() {
  try {
    const finalData = await populateVerses(dailyReadings, VERSION_ID);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(finalData, null, 2), "utf-8");

    console.log(`Data successfully saved to ${outputPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
