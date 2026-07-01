import type { WeeklyMemory } from "@types";
import { ApiClient, BibleClient } from "@youversion/platform-core";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { bookMap } from "../src/lib/generateBibleUrl.ts";
import inputVerses from "./init_weekly-memory.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_KEY = process.env.YOUVERSION_API_KEY;

if (!API_KEY) throw new Error("No API key provided.");

const apiClient = new ApiClient({ appKey: API_KEY });
const bibleClient = new BibleClient(apiClient);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function parseVerseToPassageId(verseStr: string): string {
  const lastColonIndex = verseStr.lastIndexOf(":");
  if (lastColonIndex === -1) throw new Error(`Invalid verse format: ${verseStr}`);

  const verseNum = verseStr.substring(lastColonIndex + 1).trim();
  const rest = verseStr.substring(0, lastColonIndex).trim();

  const lastSpaceIndex = rest.lastIndexOf(" ");
  if (lastSpaceIndex === -1) throw new Error(`Invalid verse format: ${verseStr}`);

  const bookName = rest.substring(0, lastSpaceIndex).trim();
  const chapterNum = rest.substring(lastSpaceIndex + 1).trim();

  const bookAbbr = bookMap[bookName];
  if (!bookAbbr) {
    throw new Error(`Book name "${bookName}" not found in bookMap.`);
  }

  return `${bookAbbr}.${chapterNum}.${verseNum}`;
}

async function populateVerseTexts(verses: Array<Omit<WeeklyMemory, "text">>, versionId: number) {
  const updatedVerses: Array<WeeklyMemory> = [];

  for (const item of verses) {
    try {
      console.log(`Fetching text for: ${item.verse}...`);

      const passageId = parseVerseToPassageId(item.verse);

      const passageData = await bibleClient.getPassage(versionId, passageId, "text");

      updatedVerses.push({
        id: item.id,
        verse: item.verse,
        text: passageData.content?.trim() || "",
      });
    } catch (error) {
      console.error(`Error processing verse ${item.verse}:`, error);
      updatedVerses.push({
        id: item.id,
        verse: item.verse,
        text: "",
      });
    }

    await sleep(200);
  }

  return updatedVerses;
}

const VERSION_ID = 111;
const outputPath = path.join(__dirname, "new_weekly-memory.json");

async function main() {
  try {
    const finalData = await populateVerseTexts(inputVerses, VERSION_ID);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(finalData, null, 2), "utf-8");

    console.log(`Data successfully saved to ${outputPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
