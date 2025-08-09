const bookMap: Record<string, string> = {
  Genesis: "GEN",
  Exodus: "EXO",
  Leviticus: "LEV",
  Numbers: "NUM",
  Deuteronomy: "DEU",
  Joshua: "JOS",
  Judges: "JDG",
  Ruth: "RUT",
  "1 Samuel": "1SA",
  "2 Samuel": "2SA",
  "1 Kings": "1KI",
  "2 Kings": "2KI",
  "1 Chronicles": "1CH",
  "2 Chronicles": "2CH",
  Ezra: "EZR",
  Nehemiah: "NEH",
  Esther: "EST",
  Job: "JOB",
  Psalms: "PSA",
  Proverbs: "PRO",
  Ecclesiastes: "ECC",
  "Song of Solomon": "SNG",
  Isaiah: "ISA",
  Jeremiah: "JER",
  Lamentations: "LAM",
  Ezekiel: "EZK",
  Daniel: "DAN",
  Hosea: "HOS",
  Joel: "JOL",
  Amos: "AMO",
  Obadiah: "OBA",
  Jonah: "JON",
  Micah: "MIC",
  Nahum: "NAM",
  Habakkuk: "HAB",
  Zephaniah: "ZEP",
  Haggai: "HAG",
  Zechariah: "ZEC",
  Malachi: "MAL",
  Matthew: "MAT",
  Mark: "MRK",
  Luke: "LUK",
  John: "JHN",
  Acts: "ACT",
  Romans: "ROM",
  "1 Corinthians": "1CO",
  "2 Corinthians": "2CO",
  Galatians: "GAL",
  Ephesians: "EPH",
  Philippians: "PHP",
  Colossians: "COL",
  "1 Thessalonians": "1TH",
  "2 Thessalonians": "2TH",
  "1 Timothy": "1TI",
  "2 Timothy": "2TI",
  Titus: "TIT",
  Philemon: "PHM",
  Hebrews: "HEB",
  James: "JAS",
  "1 Peter": "1PE",
  "2 Peter": "2PE",
  "1 John": "1JN",
  "2 John": "2JN",
  "3 John": "3JN",
  Jude: "JUD",
  Revelation: "REV",
};

const bibleVersions: Record<string, { id: number; code: string }> = {
  ESV: { id: 59, code: "ESV" },
  KJV: { id: 1, code: "KJV" },
  NKJV: { id: 114, code: "NKJV" },
  NIV: { id: 111, code: "NIV" },
  NLT: { id: 206, code: "NLT" },
  ASV: { id: 12, code: "ASV" },
};

// export function generateBibleUrl(ref: string, bibleVersion = "NIV") {
//   const match = ref.match(/^([\d ]?[A-Za-z ]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
//   if (!match) return null;

//   const [, book, chapter, verseStart, verseEnd] = match;

//   const code = bookMap[book.trim()];
//   if (!code) return null;

//   const versePart = verseEnd ? `${verseStart}-${verseEnd}` : verseStart;
//   const version = bibleVersions[bibleVersion];

//   return `https://www.bible.com/bible/${version.id}/${code}.${chapter}.${versePart}.${version.code}`;
// }

export function generateBibleUrl(ref: string, bibleVersion = "NIV") {
  const version = bibleVersions[bibleVersion];
  if (!version) return null;

  const verseMatch = ref.match(/^([\d ]?[A-Za-z ]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
  const chapterMatch = ref.match(/^([\d ]?[A-Za-z ]+)\s+(\d+)$/);

  if (verseMatch) {
    const [, book, chapter, verseStart, verseEnd] = verseMatch;
    const code = bookMap[book.trim()];
    if (!code) return null;
    const versePart = verseEnd ? `${verseStart}-${verseEnd}` : verseStart;
    return `https://www.bible.com/bible/${version.id}/${code}.${chapter}.${versePart}.${version.code}`;
  }

  if (chapterMatch) {
    const [, book, chapter] = chapterMatch;
    const code = bookMap[book.trim()];
    if (!code) return null;
    return `https://www.bible.com/bible/${version.id}/${code}.${chapter}.${version.code}`;
  }

  return null;
}
