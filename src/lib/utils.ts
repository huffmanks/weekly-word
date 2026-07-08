import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, "");
  const wordCount = textOnly.split(/\s+/).length;
  const readingTimeMinutes = (wordCount / 200 + 1).toFixed();
  return `${readingTimeMinutes} min read`;
}

export function paramOverrideDateTime(paramDate: string, paramTime: string): void {
  const targetOverrideString = `${paramDate}T${paramTime}:00`;
  const overrideCurrentDate = new Date(targetOverrideString);

  const OriginalDate = window.Date;

  function MockedDate(this: Date, ...args: Array<unknown>) {
    if (args.length === 0) {
      return overrideCurrentDate;
    }
    return new (OriginalDate as unknown as new (...args: Array<unknown>) => Date)(...args);
  }

  MockedDate.prototype = OriginalDate.prototype;
  MockedDate.now = () => overrideCurrentDate.getTime();
  MockedDate.UTC = OriginalDate.UTC;
  MockedDate.parse = OriginalDate.parse;

  window.Date = MockedDate as unknown as typeof Date;
}
