// Small helpers the template specs share: seeded draws, the sign of a comparison, and exact numbers.
import { Q } from "../math/q.js";
import type { Xoshiro128 } from "../math/rng.js";
import { SIGNS } from "./spec.js";

/** An integer from `lo` up to and including `hi`. */
export const between = (rng: Xoshiro128, lo: number, hi: number): number =>
  lo + rng.int(hi - lo + 1);

/** One element of a non-empty list. */
export function pick<T>(rng: Xoshiro128, list: readonly T[]): T {
  const item = list[rng.int(list.length)];
  if (item === undefined) throw new RangeError("empty_list");
  return item;
}

/** A whole number as `Q`. */
export const qi = (n: number): Q => Q.of(BigInt(n));

/** The sign that stands between `a` and `b`: `<`, `=` or `>`. */
export const signOf = (a: number, b: number): (typeof SIGNS)[number] =>
  a < b ? "<" : a > b ? ">" : "=";

/** A whole number as the text of a task: digits, with a no-break space in groups of three from 1,000. */
export const digits = (n: number): string =>
  n.toString().replace(/\B(?=(\d{3})+$)/g, "\u00A0");
