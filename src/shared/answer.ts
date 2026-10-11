// The number answer kinds (ADR-0040, REQ-0732 to REQ-0778). Each kind parses an
// entry with `Q` and compares it with the correct answer by value and by form,
// so `12 500`, `2,50` and `2/4` are judged by what they say, not how they are
// spelled. A kind returns correct, half credit, wrong or unparsed, and accepts
// `dont_know` with no credit. This module reads no clock and no network.
import { Q } from "../math/q.js";

export type Verdict = "correct" | "half" | "wrong" | "unparsed" | "dont_know";
export type Credit = 1 | 0.5 | 0;
export type Form =
  | "integer"
  | "decimal"
  | "fraction"
  | "improper"
  | "mixed"
  | "quotient_remainder"
  | "none";

export interface Checked {
  readonly verdict: Verdict;
  readonly credit: Credit;
  /** The form the entry was written in, which the trap classifier reads. */
  readonly form: Form;
}

export type Checker = (entry: string) => Checked;

/** The rule a fraction task applies: any equal fraction, or the simplest form. */
export type Rule = "equivalent" | "simplest";

/** The entry a learner sends for `dont_know`, accepted by every kind. */
export const DONT_KNOW = "dont_know";

const correct = (form: Form): Checked => ({
  verdict: "correct",
  credit: 1,
  form,
});
const half = (form: Form): Checked => ({ verdict: "half", credit: 0.5, form });
const wrong = (form: Form): Checked => ({ verdict: "wrong", credit: 0, form });
const UNPARSED: Checked = { verdict: "unparsed", credit: 0, form: "none" };
const DONT: Checked = { verdict: "dont_know", credit: 0, form: "none" };

/** The verdict for an entry that matches or misses by value. */
const judge = (equal: boolean, form: Form): Checked =>
  equal ? correct(form) : wrong(form);

const INTEGER = /^[+-]?\d+$/;
// Digits grouped in threes with a regular or a no-break space: `12 500`.
const GROUPED = /^[+-]?\d{1,3}(?:[  ]\d{3})+$/;
const DECIMAL = /^[+-]?\d+(?:[.,]\d+)?$/;
const FRACTION = /^([+-]?\d+)\s*\/\s*(\d+)$/;
const MIXED = /^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/;
const QUOTIENT = /^(\d+)\s+r\s+(\d+)$/;

/** Every kind answers `dont_know` the same way, before it parses the entry. */
const accepting =
  (parse: Checker): Checker =>
  (entry) =>
    entry === DONT_KNOW ? DONT : parse(entry.trim());

const reduced = (n: bigint, d: bigint): boolean => {
  const value = Q.of(n, d);
  return value.n === n && value.d === d;
};

const isImproper = (n: bigint, d: bigint): boolean => (n < 0n ? -n : n) >= d;

/** A whole number: `12500`, `007`, or grouped `12 500`. */
export const integerAnswer = (correctValue: Q): Checker =>
  accepting((t) => {
    if (INTEGER.test(t) || GROUPED.test(t)) {
      const digits = t.replace(/[  ]/g, "").replace(/^\+/, "");
      return judge(Q.of(BigInt(digits)).eq(correctValue), "integer");
    }
    return UNPARSED;
  });

/** A decimal with a comma or a point, or a whole number (REQ-0742). */
export const decimalAnswer = (correctValue: Q): Checker =>
  accepting((t) => {
    if (!DECIMAL.test(t)) return UNPARSED;
    const form: Form = /[.,]/.test(t) ? "decimal" : "integer";
    return judge(Q.fromDecimal(t).eq(correctValue), form);
  });

/**
 * A fraction. A decimal is refused even when its value is equal (REQ-0746).
 * Under `simplest`, an equal fraction that isn't fully reduced gets half
 * credit (REQ-0750).
 */
export const fractionAnswer = (correctValue: Q, rule: Rule): Checker =>
  accepting((t) => {
    if (DECIMAL.test(t)) return wrong("decimal");
    const m = FRACTION.exec(t);
    if (!m) return UNPARSED;
    const n = BigInt(m[1] ?? "0");
    const d = BigInt(m[2] ?? "0");
    if (d === 0n) return UNPARSED;
    const form: Form = isImproper(n, d) ? "improper" : "fraction";
    if (!Q.of(n, d).eq(correctValue)) return wrong(form);
    if (rule === "equivalent") return correct(form);
    return reduced(n, d) ? correct(form) : half(form);
  });

/**
 * A mixed number, or an improper fraction equal to it (REQ-0752). Under
 * `simplest`, an equal improper fraction and a mixed number whose fractional
 * part isn't reduced get half credit (REQ-0754, REQ-0756).
 */
export const mixedAnswer = (correctValue: Q, rule: Rule): Checker =>
  accepting((t) => {
    if (DECIMAL.test(t)) return wrong("decimal");
    const mixed = MIXED.exec(t);
    if (mixed) {
      const [, sign = "", whole = "0", a = "0", den = "0"] = mixed;
      const d = BigInt(den);
      if (d === 0n) return UNPARSED;
      const magnitude = Q.of(BigInt(whole) * d + BigInt(a), d);
      const value = sign === "-" ? magnitude.neg() : magnitude;
      if (!value.eq(correctValue)) return wrong("mixed");
      if (rule === "equivalent") return correct("mixed");
      const proper = BigInt(a) < d;
      return proper && reduced(BigInt(a), d) ? correct("mixed") : half("mixed");
    }
    const f = FRACTION.exec(t);
    if (!f) return UNPARSED;
    const n = BigInt(f[1] ?? "0");
    const d = BigInt(f[2] ?? "0");
    if (d === 0n) return UNPARSED;
    const form: Form = isImproper(n, d) ? "improper" : "fraction";
    if (!Q.of(n, d).eq(correctValue)) return wrong(form);
    return rule === "equivalent" ? correct(form) : half(form);
  });

/** The value of an unknown, as a number or a fraction (REQ-0778). */
export const equationValue = (correctValue: Q): Checker =>
  accepting((t) => {
    if (DECIMAL.test(t)) {
      const form: Form = /[.,]/.test(t) ? "decimal" : "integer";
      return judge(Q.fromDecimal(t).eq(correctValue), form);
    }
    const f = FRACTION.exec(t);
    if (!f) return UNPARSED;
    const n = BigInt(f[1] ?? "0");
    const d = BigInt(f[2] ?? "0");
    if (d === 0n) return UNPARSED;
    const form: Form = isImproper(n, d) ? "improper" : "fraction";
    return judge(Q.of(n, d).eq(correctValue), form);
  });

/**
 * A quotient and a remainder: `6 r 19` for 79 ÷ 10 is rejected, because a
 * remainder must be below the divisor, even though 6 · 10 + 19 = 79 (REQ-0758).
 */
export const quotientRemainder = (
  dividend: bigint,
  divisor: bigint,
): Checker => {
  if (divisor <= 0n) throw new RangeError("bad_divisor");
  return accepting((t) => {
    const m = QUOTIENT.exec(t);
    if (!m) return UNPARSED;
    const quotient = BigInt(m[1] ?? "0");
    const remainder = BigInt(m[2] ?? "0");
    if (remainder >= divisor) return wrong("quotient_remainder");
    return judge(
      quotient * divisor + remainder === dividend,
      "quotient_remainder",
    );
  });
};
