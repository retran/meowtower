// REQ-7520: every equation a solution states is true. A kit template has no second route to its answer, so this
// test is what checks one independently: it reads the working a child sees and computes it again.
import { describe, expect, it } from "vitest";
import { Q } from "../../src/math/q.js";
import { evaluate } from "../../src/templates/expr.js";
import { templates } from "../../src/templates/index.js";

const SEEDS = 25;
const seedOf = (i: number): Uint8Array =>
  Uint8Array.from({ length: 32 }, (_, k) => (i * 41 + k * 3) % 256);

const WHOLE = String.raw`\d{1,3}(?:[  ]\d{3})+|\d+`;
const NUMBER = String.raw`(?:\d+ (?:${WHOLE})⁄(?:${WHOLE})|(?:${WHOLE})⁄(?:${WHOLE})|(?:${WHOLE})(?:,\d+)?)`;
const TERM = String.raw`[−(]*${NUMBER}\)*`;
const CHAIN = String.raw`${TERM}(?: [×:+−] ${TERM})*`;
const AT_END = new RegExp(String.raw`(?<![\d,⁄−( ]|\d | [×:+−] )${CHAIN}$`);
const AT_START = new RegExp(String.raw`^${CHAIN}(?![\d⁄%]|,\d| ?[a-z])`);

/** The value of a chain as a solution writes it. */
function valueOf(text: string): Q | null {
  const source = text
    .replace(/(\d)[  ](?=\d{3}(?!\d))/g, "$1")
    .replace(/(\d+) (\d+)⁄(\d+)/g, "($1+$2/$3)")
    .replace(/(\d+)⁄(\d+)/g, "($1/$2)")
    .replace(/(\d),(\d)/g, "$1.$2")
    .replace(/×/g, "*")
    .replace(/ : /g, "/")
    .replace(/−/g, "-");
  try {
    return evaluate(source, {}, "solution");
  } catch {
    return null;
  }
}

/** The equations of a line that don't hold, with the sides as they are written. */
export function falseEquations(line: string): string[] {
  const parts = line.split(" = ");
  const found: string[] = [];
  for (let i = 0; i + 1 < parts.length; i += 1) {
    const left = AT_END.exec(parts[i] ?? "")?.[0];
    const right = AT_START.exec(parts[i + 1] ?? "")?.[0];
    if (!left || !right) continue;
    const [x, y] = [valueOf(left), valueOf(right)];
    if (x && y && !x.eq(y)) found.push(`${left} = ${right}`);
  }
  return found;
}

/** True when a line computes the answer: a chain with an operation, then `=`, then the answer. */
function reaches(line: string, answer: Q): boolean {
  const parts = line.split(" = ");
  return parts.some((part, i) => {
    const left = AT_END.exec(parts[i - 1] ?? "")?.[0];
    const right = AT_START.exec(part)?.[0];
    if (!left || !right || !/ [\u00D7:+\u2212] /.test(left)) return false;
    return valueOf(right)?.eq(answer) === true;
  });
}

/** The kit tasks whose answer is chosen or read and not computed: the largest, a median, a place in a row. */
const NOT_COMPUTED = new Set([
  "M13.instruments.13",
  "G1.shapes.06",
  "G1.shapes.08",
  "G3.symmetry.01",
  "G3.symmetry.08",
  "G3.symmetry.09",
  "G3.symmetry.12",
  "G4.coordinates.09",
  "G5.solids-nets.06",
  "G6.views.02",
  "G6.views.06",
  "G6.blocks.02",
  "G6.blocks.10",
  "S1.tables.01",
  "S2.bar-line.08",
  "S2.bar-line.13",
  "S3.mean.07",
  "S3.missing.07",
  "S4.pie.10",
  "S5.global.01",
  "S5.global.11",
  "S5.global-1S.05",
  "S6.patterns.05",
  "S7.median-mode.01",
  "S7.median-mode.02",
  "S7.median-mode.04",
  "S7.median-mode.11",
  "S7.median-mode.12",
  "M2.calendar.12",
  "M3.whole.11",
  "M3.cents.03",
  "M3.cents.06",
  "M4.same-area.04",
  "M4.same-area.05",
  "M5.formula.01",
  "M5.formula.07",
  "M5.formula.11",
  "M10.capacity-1S.02",
  "M10.capacity-1S.04",
  "M13.instruments.06",
  "M14.average-speed.11",
]);

describe("the working of a solution", () => {
  it("catches a false equation", () => {
    expect(falseEquations("Разница: 140 − 144 = 4 евро.")).toHaveLength(1);
    expect(falseEquations("Значит, 3 × 7 = 21.")).toEqual([]);
    expect(falseEquations("1 2⁄5 + 1⁄5 = 1 3⁄5.")).toEqual([]);
    expect(falseEquations("Цена: 25 × 4 = 100 = 50 × 2.")).toEqual([]);
  });

  it("states only true equations in every task", () => {
    const wrong = new Map<string, string>();
    for (const template of templates)
      for (let i = 0; i < SEEDS; i += 1)
        for (const line of template.make(seedOf(i)).solution)
          for (const equation of falseEquations(line))
            wrong.set(template.id, equation);
    expect([...wrong]).toEqual([]);
  });

  it("reaches the answer in the kit tasks, which have no second route", () => {
    const missing: string[] = [];
    for (const template of templates) {
      if (!/^[MGST]\d/.test(template.id) || NOT_COMPUTED.has(template.id))
        continue;
      if (
        !["integer", "decimal", "fraction", "mixed"].includes(template.answer)
      )
        continue;
      for (let i = 0; i < 8; i += 1) {
        const made = template.make(seedOf(i));
        if (!(made.answer instanceof Q)) continue;
        const answer = made.answer;
        if (!made.solution.some((line) => reaches(line, answer))) {
          missing.push(template.id);
          break;
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
