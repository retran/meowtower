// The template verification run (ADR-0040, TSK-0493). Every template runs on
// 10,000 seeds and is checked against the independent reference solver: no
// invalid parameters, no disagreement with the reference answer, no equal traps,
// no number in a solution that the parameters or the answer don't give, and no
// text breaking the text rules. Generation is timed against 50 ms at the 95th
// percentile, and a template whose fallback share exceeds 1 % is reported.
// Run as `npm run verify:templates`; `--golden` rewrites tests/golden/.
import { writeFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import {
  distinct,
  generate,
  type Built,
  type Template,
} from "../src/engine/tasks/template.js";
import { baseSeed } from "../src/math/rng.js";
import { Q } from "../src/math/q.js";
import { templates as registry } from "../src/templates/index.js";
import { strayIn, type Compiled } from "../src/templates/spec.js";
import {
  STANDIN_TASKS,
  standinTemplate,
  taskSolution,
  taskText,
} from "../src/server/standin.js";
import {
  OPERATION_OF_TASK,
  solveReference,
  type Operation,
} from "./reference/solver.js";

export const SEEDS = 10_000;
export const BUDGET_MS = 50;
export const FALLBACK_LIMIT = 0.01;

/** One rendered task: its text and its solution, as the player would see them. */
export interface Rendered {
  readonly texts: readonly string[];
  readonly solution: readonly string[];
}

export interface TemplateReport {
  readonly template: string;
  readonly seeds: number;
  readonly invalid: number;
  readonly disagreements: number;
  readonly equalTraps: number;
  readonly foreignNumbers: number;
  readonly textFindings: number;
  readonly fallbackShare: number;
  readonly p95Ms: number;
  readonly findings: readonly string[];
}

/** The text rules of the readability and number formatting, over rendered texts. */
export const TEXT_RULES: readonly {
  readonly name: string;
  readonly pattern: RegExp;
}[] = [
  { name: "decimal_point", pattern: /\d\.\d/ },
  { name: "asterisk", pattern: /\*/ },
  { name: "division_slash", pattern: /\d\s*\/\s*\d/ },
  { name: "ungrouped_four_digits", pattern: /(?<![\d  ])\d{4,}(?!\d)/ },
];

const numbersIn = (text: string): string[] => text.match(/\d+/g) ?? [];

/** Runs one template over `seeds` seeds and reports what the run found. */
export function verifyTemplate<P extends { a: number; b: number }>(
  template: Template<P>,
  operation: Operation,
  render: (built: Built<P>) => Rendered,
  seeds = SEEDS,
): TemplateReport {
  let invalid = 0;
  let disagreements = 0;
  let equalTraps = 0;
  let foreignNumbers = 0;
  let textFindings = 0;
  let fallbacks = 0;
  const times: number[] = [];
  for (let i = 0; i < seeds; i++) {
    const base = baseSeed(`verify-${i}`, template.id, 0);
    const started = performance.now();
    const drawn = generate(template, base);
    times.push(performance.now() - started);
    if (drawn.status === "generation_error") {
      invalid++;
      continue;
    }
    if (drawn.status === "generation_fallback") fallbacks++;
    const { built } = drawn;
    if (!template.valid(built.params)) invalid++;
    const reference = solveReference(operation, built.params.a, built.params.b);
    if (!built.answer.eq(Q.of(BigInt(reference)))) disagreements++;
    if (!distinct(built.answer, built.traps)) equalTraps++;
    const rendered = render(built);
    const allowed = new Set(
      [built.params.a, built.params.b, reference].map((n) => String(n)),
    );
    foreignNumbers += rendered.solution
      .flatMap(numbersIn)
      .filter((n) => !allowed.has(n)).length;
    for (const text of [...rendered.texts, ...rendered.solution])
      for (const rule of TEXT_RULES)
        if (rule.pattern.test(text)) textFindings++;
  }
  const sorted = [...times].sort((x, y) => x - y);
  const p95Ms = sorted[Math.ceil(0.95 * sorted.length) - 1] ?? 0;
  const fallbackShare = fallbacks / seeds;
  const findings: string[] = [];
  if (invalid > 0) findings.push(`invalid ${invalid}`);
  if (disagreements > 0) findings.push(`disagreements ${disagreements}`);
  if (equalTraps > 0) findings.push(`equal traps ${equalTraps}`);
  if (foreignNumbers > 0) findings.push(`foreign numbers ${foreignNumbers}`);
  if (textFindings > 0) findings.push(`text rules ${textFindings}`);
  if (fallbackShare > FALLBACK_LIMIT)
    findings.push(`fallback share ${(fallbackShare * 100).toFixed(2)}%`);
  if (p95Ms > BUDGET_MS)
    findings.push(`p95 ${p95Ms.toFixed(2)} ms over ${BUDGET_MS} ms`);
  return {
    template: template.id,
    seeds,
    invalid,
    disagreements,
    equalTraps,
    foreignNumbers,
    textFindings,
    fallbackShare,
    p95Ms,
    findings,
  };
}

/** The stand-in templates: each task and its twin, with its own operation. */
export function standinSubjects(): {
  template: Template<{ a: number; b: number }>;
  operation: Operation;
  render: (built: Built<{ a: number; b: number }>) => Rendered;
}[] {
  return STANDIN_TASKS.flatMap((task) =>
    [false, true].map((twin) => {
      const operation = OPERATION_OF_TASK[task.n];
      if (operation === undefined) throw new RangeError("no_operation");
      return {
        template: standinTemplate(task, twin),
        operation,
        render: () => ({
          texts: [taskText(task, twin)],
          solution: taskSolution(task, twin),
        }),
      };
    }),
  );
}

/** A golden record: one generated task, its parameters and its rendered view. */
export interface GoldenRecord {
  readonly template: string;
  readonly version: string;
  readonly effectiveSeed: string;
  readonly params: { a: number; b: number };
  readonly answer: string;
  readonly texts: readonly string[];
  readonly solution: readonly string[];
}

export const GOLDEN_SEEDS = 20;
export const GOLDEN_PATH = fileURLToPath(
  new URL("../tests/golden/standin.json", import.meta.url),
);

/** Twenty seeds for each stand-in template, rebuilt and rendered (ADR-0040). */
export function goldenRecords(): GoldenRecord[] {
  return standinSubjects().flatMap(({ template, render }) =>
    Array.from({ length: GOLDEN_SEEDS }, (_, i) => {
      const base = baseSeed(`golden-${i}`, template.id, 0);
      const drawn = generate(template, base);
      if (drawn.status === "generation_error") throw new Error("golden_error");
      const rendered = render(drawn.built);
      return {
        template: template.id,
        version: template.version,
        effectiveSeed: drawn.effectiveSeed,
        params: drawn.built.params,
        answer: drawn.built.answer.toString(),
        texts: [...rendered.texts],
        solution: [...rendered.solution],
      };
    }),
  );
}

/** What a run over one registry template found (ADR-0490): the checks of the unit test, on many seeds. */
export function verifyCompiled(c: Compiled, seeds = SEEDS): TemplateReport {
  let invalid = 0;
  let disagreements = 0;
  let equalTraps = 0;
  let foreignNumbers = 0;
  let textFindings = 0;
  const times: number[] = [];
  for (let i = 0; i < seeds; i++) {
    const started = performance.now();
    let made;
    try {
      made = c.make(baseSeed(`verify-${i}`, c.id, 0));
    } catch {
      invalid++;
      continue;
    }
    times.push(performance.now() - started);
    if (!made.referenceAgrees) disagreements++;
    if (made.checker(made.entry).verdict !== "correct") invalid++;
    const entries = made.traps.map((t) => t.entry);
    if (
      new Set(entries).size !== entries.length ||
      made.traps.some((t) => made.checker(t.entry).verdict === "correct")
    )
      equalTraps++;
    foreignNumbers += strayIn(made).length;
    for (const text of [made.text, ...made.solution, ...made.hints])
      for (const rule of TEXT_RULES)
        if (rule.pattern.test(text)) textFindings++;
  }
  const sorted = [...times].sort((x, y) => x - y);
  const p95Ms = sorted[Math.ceil(0.95 * sorted.length) - 1] ?? 0;
  const findings: string[] = [];
  if (invalid > 0) findings.push(`invalid ${invalid}`);
  if (disagreements > 0) findings.push(`disagreements ${disagreements}`);
  if (equalTraps > 0) findings.push(`equal traps ${equalTraps}`);
  if (foreignNumbers > 0) findings.push(`foreign numbers ${foreignNumbers}`);
  if (textFindings > 0) findings.push(`text rules ${textFindings}`);
  if (p95Ms > BUDGET_MS)
    findings.push(`p95 ${p95Ms.toFixed(2)} ms over ${BUDGET_MS} ms`);
  return {
    template: c.id,
    seeds,
    invalid,
    disagreements,
    equalTraps,
    foreignNumbers,
    textFindings,
    fallbackShare: 0,
    p95Ms,
    findings,
  };
}

function main(): number {
  if (process.argv.includes("--golden")) {
    writeFileSync(GOLDEN_PATH, `${JSON.stringify(goldenRecords(), null, 2)}\n`);
    console.log(`golden: wrote ${GOLDEN_PATH}`);
    return 0;
  }
  let failed = false;
  for (const subject of standinSubjects()) {
    const r = verifyTemplate(
      subject.template,
      subject.operation,
      subject.render,
    );
    console.log(
      `${r.template}: seeds ${r.seeds}, invalid ${r.invalid}, disagreements ${r.disagreements}, ` +
        `equal traps ${r.equalTraps}, foreign numbers ${r.foreignNumbers}, text findings ${r.textFindings}, ` +
        `fallback share ${(r.fallbackShare * 100).toFixed(2)}%, p95 ${r.p95Ms.toFixed(3)} ms (budget ${BUDGET_MS} ms)`,
    );
    for (const finding of r.findings) console.log(`  finding: ${finding}`);
    if (r.findings.length > 0) failed = true;
  }
  for (const c of registry) {
    const r = verifyCompiled(c);
    if (r.findings.length > 0) {
      console.log(`${r.template}: ${r.findings.join(", ")}`);
      failed = true;
    }
  }
  console.log(`registry: ${registry.length} templates, ${SEEDS} seeds each`);
  return failed ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main());
