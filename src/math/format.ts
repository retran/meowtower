// Number formatting (ADR-0040, REQ-1226): a number is written with the decimal
// sign and the group separator of the locale's notation profile in the
// language file. For `ru` that is a decimal comma and a no-break space in every
// number of 4 digits or more, as the catalogue writes 12 500 and 3,5.
import { t } from "../shared/i18n.js";
import type { Q } from "./q.js";

export interface Notation {
  decimal: string;
  group: string;
  mul: string;
  div: string;
  minus: string;
}

/** The locale's notation profile, read from the language file's `notation.` keys. */
export function notation(): Notation {
  return {
    decimal: t("notation.decimal"),
    group: t("notation.group"),
    mul: t("notation.mul"),
    div: t("notation.div"),
    minus: t("notation.minus"),
  };
}

/** Groups the digits of a whole number in threes from the right, from 4 digits up. */
const grouped = (digits: string, separator: string): string =>
  digits.length < 4 ? digits : digits.replace(/\B(?=(\d{3})+$)/g, separator);

/**
 * Writes `q` as a decimal. A fraction with no finite decimal, such as 1/3, is
 * refused: it is written as a fraction by the renderer, not here.
 */
export function formatQ(q: Q, profile: Notation = notation()): string {
  // A finite decimal has a denominator of 2s and 5s only.
  let d = q.d;
  let twos = 0;
  let fives = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    twos++;
  }
  while (d % 5n === 0n) {
    d /= 5n;
    fives++;
  }
  if (d !== 1n) throw new RangeError("not_a_finite_decimal");
  const places = Math.max(twos, fives);
  const scale = 10n ** BigInt(places);
  const magnitude = ((q.n < 0n ? -q.n : q.n) * scale) / q.d;
  const digits = magnitude.toString().padStart(places + 1, "0");
  const whole = digits.slice(0, digits.length - places);
  const fraction = digits.slice(digits.length - places);
  const sign = q.n < 0n ? profile.minus : "";
  return (
    sign +
    grouped(whole, profile.group) +
    (places > 0 ? profile.decimal + fraction : "")
  );
}
