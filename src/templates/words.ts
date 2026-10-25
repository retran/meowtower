// A number from 0 to 100 written in words, read from `content/tasks-numbers.ru.json` so no word sits
// in the code (ADR-0160). The words are nominative, as a task states a number.
import { readFileSync } from "node:fs";
import { z } from "zod";

const Words = z
  .object({
    units: z.array(z.string()).length(20),
    tens: z.array(z.string()).length(10),
    hundred: z.string().min(1),
  })
  .strict();

const words = Words.parse(
  JSON.parse(
    readFileSync(
      new URL("../../content/tasks-numbers.ru.json", import.meta.url),
      "utf8",
    ),
  ),
);

/** `n` from 0 to 100 in words, such as twenty-three, in the Russian of `content/tasks-numbers.ru.json`. */
export function numberWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 100)
    throw new RangeError("out_of_range");
  if (n === 100) return words.hundred;
  if (n < 20) return words.units[n] ?? "";
  const tens = words.tens[Math.floor(n / 10)] ?? "";
  const ones = n % 10;
  return ones === 0 ? tens : `${tens} ${words.units[ones] ?? ""}`;
}
