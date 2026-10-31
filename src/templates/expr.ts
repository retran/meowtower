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
export function writeValue(x: Q): string {
  const negative = x.n < 0n;
  const n = negative ? -x.n : x.n;
  const sign = negative ? "−" : "";
  if (x.d === 1n) return `${sign}${digits(Number(n))}`;
  let d = x.d;
  while (d % 2n === 0n) d /= 2n;
  while (d % 5n === 0n) d /= 5n;
  if (d !== 1n) return `${sign}${n.toString()}${SLASH}${x.d.toString()}`;
  return formatQ(x, { decimal: ",", group: "", mul: "", div: "", minus: "−" });
}

/** Evaluates an expression of numbers, variables, `+ - * /` and brackets. */
export function evaluate(
  source: string,
  vars: Readonly<Record<string, string>>,
  id: string,
): Q {
  const tokens = source.match(/\d+(?:[.,]\d+)?|\w+|[-+*/()]/g) ?? [];
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
  if (parsed.d !== 1n) return few;
  const n = parsed.n < 0n ? -parsed.n : parsed.n;
  const hundred = n % 100n;
  const ten = n % 10n;
  if (hundred >= 11n && hundred <= 14n) return many;
  if (ten === 1n) return one;
  return ten >= 2n && ten <= 4n ? few : many;
}
