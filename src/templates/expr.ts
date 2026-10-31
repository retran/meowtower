// What a task's string may compute. `{=a*b}` writes a value worked out from the drawn numbers, so a solution
// shows its intermediate results without code in the template, and `{a|one|few|many}` writes a number with the
// form of its noun. Values are exact: they are computed in `Q`, never in floating point.
import { formatQ } from "../math/format.js";
import { Q } from "../math/q.js";
import { digits } from "./draw.js";

const SLASH = "⁄";

/** A value as a text holds it: `12 500`, `2,5`, `−3`, `3⁄4` or `2 3⁄4`. */
export function readValue(text: string): Q | null {
  const t = text.trim().replace("−", "-");
  const fraction = new RegExp(`^(-?)(?:(\\d+)\\s)?(\\d+)${SLASH}(\\d+)$`).exec(
    t,
  );
  if (fraction) {
    const [, sign, whole, n = "0", d = "1"] = fraction;
    const value = Q.of(BigInt(whole ?? "0")).add(
      Q.of(BigInt(n)).div(Q.of(BigInt(d))),
    );
    return sign ? Q.of(0n).sub(value) : value;
  }
  const plain = t.replace(/[\s ]/g, "");
  return /^-?\d+(,\d+)?$/.test(plain) ? Q.fromDecimal(plain) : null;
}

/** A value as a task writes it: grouped digits, a decimal comma, or a fraction that has no finite decimal. */
export function writeValue(x: Q, asFraction = false): string {
  const negative = x.n < 0n;
  const n = negative ? -x.n : x.n;
  const sign = negative ? "−" : "";
  if (x.d === 1n) return `${sign}${digits(Number(n))}`;
  let d = x.d;
  while (d % 2n === 0n) d /= 2n;
  while (d % 5n === 0n) d /= 5n;
  if (d !== 1n || asFraction)
    return `${sign}${n.toString()}${SLASH}${x.d.toString()}`;
  return formatQ(x, { decimal: ",", group: "", mul: "", div: "", minus: "−" });
}

const whole = (x: Q): bigint => {
  const q = x.n / x.d;
  return x.n < 0n && x.n % x.d !== 0n ? q - 1n : q;
};
const sorted = (xs: readonly Q[]): Q[] => [...xs].sort((p, q) => p.cmp(q));
const gcd = (a: bigint, b: bigint): bigint =>
  b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b);

/** The functions an expression may call: `nth(k, ...)` is the k-th smallest of its numbers, from 1. */
const FUNCTIONS: Readonly<
  Record<string, (args: readonly Q[]) => Q | undefined>
> = {
  min: (a) => sorted(a)[0],
  max: (a) => sorted(a)[a.length - 1],
  floor: ([x]) => (x ? Q.of(whole(x)) : undefined),
  mod: ([x, y]) => (x && y ? x.sub(y.mul(Q.of(whole(x.div(y))))) : undefined),
  gcd: ([x, y]) => (x && y ? Q.of(gcd(x.n, y.n)) : undefined),
  pow: ([x, y]) => (x && y ? Q.of(x.n ** y.n) : undefined),
  nth: ([k, ...rest]) => (k ? sorted(rest)[Number(k.n) - 1] : undefined),
};

/** True when an expression reads a fraction, so that its result is written as a fraction too. */
export const readsFraction = (
  source: string,
  vars: Readonly<Record<string, string>>,
): boolean =>
  (source.match(/\w+/g) ?? []).some((name) => vars[name]?.includes(SLASH));

/** Evaluates an expression of numbers, variables, `+ - * /`, brackets and the functions above. */
export function evaluate(
  source: string,
  vars: Readonly<Record<string, string>>,
  id: string,
): Q {
  // A comma between digits with no space is a decimal comma; an argument comma stands alone.
  const tokens = source.match(/\d+(?:\.\d+)?|\w+|[-+*/(),]/g) ?? [];
  let at = 0;
  const fail = (why: string): never => {
    throw new RangeError(`bad_expression:${id}:${source}:${why}`);
  };
  const atom = (): Q => {
    const token = tokens[at];
    at += 1;
    if (token === undefined) return fail("end");
    if (token === "-") return Q.of(0n).sub(atom());
    if (token === "(") {
      const value = sum();
      if (tokens[at] !== ")") return fail("bracket");
      at += 1;
      return value;
    }
    if (/^\d/.test(token)) return Q.fromDecimal(token.replace(".", ","));
    const fn = FUNCTIONS[token];
    if (fn && tokens[at] === "(") {
      at += 1;
      const args = [sum()];
      while (tokens[at] === ",") {
        at += 1;
        args.push(sum());
      }
      if (tokens[at] !== ")") return fail("bracket");
      at += 1;
      return fn(args) ?? fail(`arguments of ${token}`);
    }
    const text = vars[token];
    if (text === undefined) return fail(`unknown ${token}`);
    return readValue(text) ?? fail(`not a number ${token}`);
  };
  const product = (): Q => {
    let value = atom();
    while (tokens[at] === "*" || tokens[at] === "/") {
      const op = tokens[at];
      at += 1;
      const right = atom();
      value = op === "*" ? value.mul(right) : value.div(right);
    }
    return value;
  };
  function sum(): Q {
    let value = product();
    while (tokens[at] === "+" || tokens[at] === "-") {
      const op = tokens[at];
      at += 1;
      const right = product();
      value = op === "+" ? value.add(right) : value.sub(right);
    }
    return value;
  }
  const value = sum();
  if (at !== tokens.length) return fail("trailing");
  return value;
}

/** The Russian form of a noun after a number: one, few or many; a fraction takes the form of few. */
export function agree(
  value: string,
  [one, few, many]: readonly [string, string, string],
): string {
  const parsed = readValue(value);
  if (parsed === null) return many;
  if (parsed.d !== 1n || value.includes(SLASH)) return few;
  const n = parsed.n < 0n ? -parsed.n : parsed.n;
  const hundred = n % 100n;
  const ten = n % 10n;
  if (hundred >= 11n && hundred <= 14n) return many;
  if (ten === 1n) return one;
  return ten >= 2n && ten <= 4n ? few : many;
}
