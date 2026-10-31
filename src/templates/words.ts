// A number from 0 to 999,999 written in words, read from `content/tasks-numbers.ru.json` so no word sits
// in the code (ADR-0160). The words are nominative, as a task states a number.
import { readFileSync } from "node:fs";
import { z } from "zod";

const Words = z
  .object({
    units: z.array(z.string()).length(20),
    tens: z.array(z.string()).length(10),
    hundred: z.string().min(1),
    hundreds: z.array(z.string()).length(10),
    feminine: z.object({ "1": z.string(), "2": z.string() }),
    thousand: z.tuple([z.string(), z.string(), z.string()]),
  })
  .strict();

const LatinWords = z
  .object({
    units: z.array(z.string()).length(20),
    tens: z.array(z.string()).length(10),
    hundred: z.string().min(1),
    thousand: z.string().min(1),
  })
  .strict();
type Latin = z.infer<typeof LatinWords>;

const latin = (lang: string): Latin =>
  LatinWords.parse(
    JSON.parse(
      readFileSync(
        new URL(`../../content/tasks-numbers.${lang}.json`, import.meta.url),
        "utf8",
      ),
    ),
  );
const english = latin("en");
const dutch = latin("nl");

let wordsLang = "ru";

/** Chooses the language `numberWords` writes in; a task is built in one go, so this holds for that build. */
export const setWordsLang = (lang: string): void => {
  wordsLang = lang;
};

/** Below a hundred: `twenty-one` in English, `eenentwintig` in Dutch, with its unit first. */
function tensAndUnits(n: number, w: Latin): string {
  if (n < 20) return w.units[n] ?? "";
  const tens = w.tens[Math.floor(n / 10)] ?? "";
  const one = n % 10;
  if (one === 0) return tens;
  const unit = w.units[one] ?? "";
  if (w === english) return `${tens}-${unit}`;
  return `${unit}${unit.endsWith("e") ? "\u00EBn" : "en"}${tens}`;
}

/** Below a thousand. A Dutch number is written as one word, an English one with spaces. */
function latinBelow1000(n: number, w: Latin): string {
  const h = Math.floor(n / 100);
  const rest = tensAndUnits(n % 100, w);
  const tail = n % 100 === 0 ? "" : rest;
  if (h === 0) return tail;
  if (w === english)
    return [`${w.units[h] ?? ""} ${w.hundred}`, tail].filter(Boolean).join(" ");
  return `${h === 1 ? "" : (w.units[h] ?? "")}${w.hundred}${tail}`;
}

function latinWords(n: number, w: Latin): string {
  if (!Number.isInteger(n) || n < 0 || n > 999_999)
    throw new RangeError("out_of_range");
  if (n === 0) return w.units[0] ?? "";
  const k = Math.floor(n / 1000);
  const low = latinBelow1000(n % 1000, w);
  if (k === 0) return low;
  const high =
    w === english
      ? `${latinBelow1000(k, w)} ${w.thousand}`
      : `${k === 1 ? "" : latinBelow1000(k, w)}${w.thousand}`;
  return [high, low].filter(Boolean).join(" ");
}

const words = Words.parse(
  JSON.parse(
    readFileSync(
      new URL("../../content/tasks-numbers.ru.json", import.meta.url),
      "utf8",
    ),
  ),
);

/** Words for 1 to 999; `feminine` takes the forms that agree with a feminine noun, such as thousand. */
function below1000(n: number, feminine: boolean): string {
  const h = words.hundreds[Math.floor(n / 100)] ?? "";
  const rest = n % 100;
  let tail = "";
  if (rest >= 20) {
    const tens = words.tens[Math.floor(rest / 10)] ?? "";
    const ones = rest % 10;
    tail = ones === 0 ? tens : `${tens} ${unit(ones, feminine)}`;
  } else if (rest > 0) {
    tail = unit(rest, feminine);
  }
  return [h, tail].filter((x) => x !== "").join(" ");
}

function unit(n: number, feminine: boolean): string {
  if (feminine && (n === 1 || n === 2))
    return words.feminine[String(n) as "1" | "2"];
  return words.units[n] ?? "";
}

/** The noun form a count takes: one thousand, two thousand, five thousand. */
function thousandForm(k: number): string {
  const last = k % 10;
  const lastTwo = k % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return words.thousand[2];
  if (last === 1) return words.thousand[0];
  if (last >= 2 && last <= 4) return words.thousand[1];
  return words.thousand[2];
}

/** `n` from 0 to 999,999 in words, such as twenty-three, in the Russian of `content/tasks-numbers.ru.json`. */
export function numberWords(n: number): string {
  if (wordsLang === "en") return latinWords(n, english);
  if (wordsLang === "nl") return latinWords(n, dutch);
  if (!Number.isInteger(n) || n < 0 || n > 999_999)
    throw new RangeError("out_of_range");
  if (n === 0) return words.units[0] ?? "";
  const k = Math.floor(n / 1000);
  const rest = n % 1000;
  const parts: string[] = [];
  if (k > 0) parts.push(below1000(k, true), thousandForm(k));
  if (rest > 0) parts.push(below1000(rest, false));
  return parts.join(" ");
}
