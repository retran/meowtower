// The template layer of the maths nodes (ADR-0040, ADR-0490, ADR-0530). A template is a small
// declarative spec: how its parameters are drawn, what the answer is, a second independent route
// to the same answer, the traps with their wrong answers, and the Dutch groups it belongs to. Its
// texts live in a per-domain strings file (ADR-0160), never in the code. `compile` turns a spec and
// its strings into a task that is rebuilt byte for byte from a seed. Pure: no clock, no network.
// The strings are a plain blank, not finished story text: ADR-0130 has a model write the story frame
// around the same numbers, so a string states the maths once, in neutral words, with no joke.
import { existsSync, readFileSync } from "node:fs";
import { z } from "zod";
import { strayNumbers } from "../engine/tasks/graph.js";
import { agree, evaluate, readsFraction, writeValue } from "./expr.js";
import { setWordsLang } from "./words.js";
import { formatQ } from "../math/format.js";
import { Q } from "../math/q.js";
import { candidateSeed, Xoshiro128 } from "../math/rng.js";
import {
  type Checker,
  choiceAnswer,
  decimalAnswer,
  fractionAnswer,
  integerAnswer,
  lineAnswer,
  mixedAnswer,
  orderAnswer,
  pairAnswer,
  setAnswer,
  timeAnswer,
} from "../shared/answer.js";

export type AnswerKind =
  | "integer"
  | "decimal"
  | "compare"
  | "choice"
  | "set"
  | "pair"
  | "order"
  | "line"
  | "fraction"
  | "mixed"
  | "time";

/** An answer by kind: a number, a sign or an option, a list of options, or two numbers. */
export type Answer = Q | string | readonly string[] | readonly [Q, Q];

/** The signs a comparison offers, in the order the player sees them. */
export const SIGNS = ["<", "=", ">"] as const;

export interface TrapSpec<P> {
  readonly id: string;
  readonly kind: "conceptual" | "procedural" | "fact";
  /** The wrong answer the misconception gives, or null where it does not apply to these parameters. */
  readonly wrong: (p: P) => Answer | null;
}

/** Where a template comes from when it is not plain Dutch base content (ADR-0490). */
export type Origin =
  { readonly extension: string } | { readonly olympiad: string };

export interface Spec<P> {
  /** The template identifier: the node, the subtype and a two-digit number, such as `N1.compare.01`. */
  readonly id: string;
  readonly node: string;
  readonly subtype: string;
  /** The task form, one of the distinct forms of the domain's research record. */
  readonly form: string;
  /** The Dutch groups the template belongs to, first and last (ADR-0530). */
  readonly groups: readonly [number, number];
  readonly origin?: Origin;
  readonly answer: AnswerKind;
  readonly draw: (rng: Xoshiro128) => P;
  readonly valid?: (p: P) => boolean;
  readonly solve: (p: P) => Answer;
  /** A second route to the answer, written differently from `solve`, so a slip in one shows. */
  readonly reference: (p: P) => Answer;
  readonly traps?: readonly TrapSpec<P>[];
  /** The role of each number placeholder, such as a price or a count: the structure ADR-0130 sends the story writer. */
  readonly roles?: Readonly<Record<string, string>>;
  /** The picture of the task, drawn by code from the drawn numbers alone (RES-1200). */
  readonly picture?: (p: P, labels: PictureLabels) => string;
  /** The values the strings may name; every `{name}` in a string is filled from here. */
  readonly vars: (p: P) => Record<string, string>;
  /** How a fraction or mixed answer is judged: any equal fraction, or only the simplest form. Default: simplest. */
  readonly rule?: "equivalent" | "simplest";
  /** The clock face of a `time` task: an analogue clock accepts both halves of the day. Default: digital. */
  readonly face?: "analogue" | "digital";
  /** How far an entry may lie from the answer of a `line` task and still be right (ADR-0520). */
  readonly within?: (p: P) => Q;
  /** The options of a choice or set task, in the order shown. */
  readonly options?: (p: P) => readonly string[];
  /** Numbers the solution and hints may state that no parameter or answer holds, such as 10 for tens. */
  readonly constants?: readonly number[];
}

const Strings = z
  .object({
    text: z.string().min(1),
    solution: z.array(z.string().min(1)).min(1),
    hints: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
    explain: z.record(z.string(), z.string().min(1)).default({}),
  })
  .strict();
export type TaskStrings = z.infer<typeof Strings>;

const cache = new Map<string, Record<string, TaskStrings>>();

/** The strings of one domain from `content/tasks-<domain>.<language>.json`, checked against their schema. */
export function taskStrings(
  domain: string,
  lang = "ru",
): Record<string, TaskStrings> {
  const name = `${domain.toLowerCase()}.${lang}`;
  const hit = cache.get(name);
  if (hit) return hit;
  const file = new URL(`../../content/tasks-${name}.json`, import.meta.url);
  // Russian is the source: a language that has no file yet shows it.
  const raw = (
    lang !== "ru" && !existsSync(file)
      ? {}
      : JSON.parse(readFileSync(file, "utf8"))
  ) as Record<string, unknown>;
  const parsed = Object.fromEntries(
    Object.entries(raw).map(([id, value]) => [id, Strings.parse(value)]),
  );
  cache.set(name, parsed);
  return parsed;
}

/** The languages a picture can be labelled in. */
export type Lang = "ru" | "en" | "nl";

/** The words and letters a picture carries, from `content/pictures.<language>.json`. */
export interface PictureLabels {
  readonly compass: { n: string; e: string; s: string; w: string };
  /** The letters of a symmetry task, by template id, in the order its options name them. */
  readonly letters: Readonly<Record<string, readonly string[]>>;
}

const PictureFile = z.object({
  compass: z.object({
    n: z.string(),
    e: z.string(),
    s: z.string(),
    w: z.string(),
  }),
  letters: z.record(z.string(), z.array(z.string())),
});

const labelCache = new Map<Lang, PictureLabels>();

export function pictureLabels(lang: Lang): PictureLabels {
  const hit = labelCache.get(lang);
  if (hit) return hit;
  const file = new URL(`../../content/pictures.${lang}.json`, import.meta.url);
  const parsed = PictureFile.parse(JSON.parse(readFileSync(file, "utf8")));
  labelCache.set(lang, parsed);
  return parsed;
}

/** What a compiled template builds for one seed. */
export interface Made {
  readonly text: string;
  /** A picture drawn by code from the drawn numbers, or null where the task has none. */
  readonly svg: string | null;
  readonly options: readonly string[] | null;
  readonly answer: Answer;
  /** The answer as the player enters it. */
  readonly entry: string;
  readonly checker: Checker;
  readonly traps: readonly {
    readonly id: string;
    readonly kind: TrapSpec<unknown>["kind"];
    readonly wrong: Answer;
    readonly entry: string;
    readonly explanation: string;
  }[];
  readonly solution: readonly string[];
  readonly hints: readonly [string, string, string];
  /** True when `solve` and `reference` agree for these parameters. */
  readonly referenceAgrees: boolean;
  /** The numbers the texts may state; any other number in them is a stray. */
  readonly allowed: readonly Q[];
  /** A key of the drawn parameters, for the check that two seeds differ. */
  readonly paramsKey: string;
}

export interface Compiled {
  readonly id: string;
  readonly node: string;
  readonly subtype: string;
  readonly form: string;
  readonly groups: readonly [number, number];
  readonly origin: Origin | undefined;
  readonly answer: AnswerKind;
  /** Builds the task for a base seed; the same seed always builds the same task. */
  readonly make: (seed: Uint8Array, lang?: Lang) => Made;
}

/** How an answer is entered, as the checker of its kind reads it. */
export function entryOf(kind: AnswerKind, answer: Answer): string {
  if (kind === "integer" || kind === "decimal" || kind === "line") {
    if (!(answer instanceof Q)) throw new TypeError("answer_not_a_number");
    if (kind === "integer" && answer.d !== 1n)
      throw new TypeError("answer_not_an_integer");
    return kind === "integer"
      ? answer.n.toString()
      : formatQ(answer, {
          decimal: ",",
          group: "",
          mul: "",
          div: "",
          minus: "-",
        });
  }
  if (kind === "fraction" || kind === "mixed") {
    if (!(answer instanceof Q)) throw new TypeError("answer_not_a_number");
    if (kind === "mixed" && answer.d === 1n) return answer.n.toString();
    if (
      kind === "fraction" ||
      (answer.n < 0n ? -answer.n : answer.n) < answer.d
    )
      return `${answer.n.toString()}/${answer.d.toString()}`;
    const whole = answer.n / answer.d;
    const rest = answer.n % answer.d;
    return rest === 0n
      ? whole.toString()
      : `${whole.toString()} ${rest.toString()}/${answer.d.toString()}`;
  }
  if (kind === "time") {
    if (!Array.isArray(answer) || answer.length !== 2)
      throw new TypeError("answer_not_a_time");
    const [h, m] = answer as unknown as readonly [Q, Q];
    return `${h.n.toString()}:${m.n.toString().padStart(2, "0")}`;
  }
  if (kind === "pair") {
    if (!Array.isArray(answer) || answer.length !== 2)
      throw new TypeError("answer_not_a_pair");
    const [a, b] = answer as unknown as readonly [Q, Q];
    return `${a.n.toString()}; ${b.n.toString()}`;
  }
  if (kind === "set" || kind === "order")
    return (answer as readonly string[]).join(",");
  return answer as string;
}

const keyOf = (answer: Answer): string =>
  answer instanceof Q
    ? answer.toString()
    : typeof answer === "string"
      ? answer
      : answer.map((x) => (x instanceof Q ? x.toString() : x)).join("|");

const sameAnswer = (a: Answer, b: Answer): boolean => keyOf(a) === keyOf(b);

function checkerOf(
  kind: AnswerKind,
  answer: Answer,
  options: readonly string[] | null,
  within: Q,
  rule: "equivalent" | "simplest",
  face: "analogue" | "digital",
): Checker {
  switch (kind) {
    case "integer":
      return integerAnswer(answer as Q);
    case "decimal":
      return decimalAnswer(answer as Q);
    case "compare":
      return choiceAnswer(answer as string, SIGNS);
    case "time": {
      const [h, m] = answer as unknown as readonly [Q, Q];
      return timeAnswer(Number(h.n), Number(m.n), face);
    }
    case "fraction":
      return fractionAnswer(answer as Q, rule);
    case "mixed":
      return mixedAnswer(answer as Q, rule);
    case "line":
      return lineAnswer(answer as Q, within);
    case "choice":
      return choiceAnswer(answer as string, options ?? []);
    case "set":
      return setAnswer(answer as readonly string[], options ?? []);
    case "order":
      return orderAnswer(answer as readonly string[]);
    case "pair": {
      const [a, b] = answer as readonly [Q, Q];
      return pairAnswer(a, b);
    }
  }
}

/** The writing of numbers in a language: English takes a decimal point and a division sign. */
export const notation = (text: string, lang: string): string =>
  lang === "en"
    ? text.replace(/(\d),(\d)/g, "$1.$2").replace(/ : (?=[\d(])/g, " \u00F7 ")
    : text;

/** Fills a string's placeholders; `computed` collects the values its `{=...}` expressions work out. */
const fill = (
  template: string,
  vars: Record<string, string>,
  id: string,
  computed: Q[] = [],
  lang = "ru",
): string =>
  template.replace(/\{([^{}]+)\}/g, (_, body: string) => {
    const [head = "", one, few, many] = body.split("|");
    let value = vars[head];
    if (head.startsWith("=")) {
      const worked = evaluate(head.slice(1), vars, id);
      computed.push(...partsOf(worked));
      value = writeValue(worked, readsFraction(head, vars));
    }
    if (value === undefined)
      throw new RangeError(`unfilled_placeholder:${id}:${head}`);
    return one === undefined || few === undefined || many === undefined
      ? value
      : `${value} ${agree(value, [one, few, many], lang)}`;
  });

const NUMBER_TOKEN = /\d+(?:[ \u00A0]\d{3})*(?:,\d+)?/g;

/** Every number a string states, as `Q`; a token that is not a finite decimal is skipped. */
function numbersIn(text: string): Q[] {
  return [...text.matchAll(NUMBER_TOKEN)].map((m) =>
    Q.fromDecimal(m[0].replace(/[ \u00A0]/g, "")),
  );
}

const MAX_CANDIDATES = 1000;

/** Compiles a spec with its strings into a task builder (REQ-1202: the same seed gives the same task). */
export function compile<P>(
  spec: Spec<P>,
  strings: Record<string, TaskStrings>,
): Compiled {
  const source = strings[spec.id];
  if (source === undefined) throw new RangeError(`no_strings:${spec.id}`);
  const domain = spec.id.charAt(0);
  return {
    id: spec.id,
    node: spec.node,
    subtype: spec.subtype,
    form: spec.form,
    groups: spec.groups,
    origin: spec.origin,
    answer: spec.answer,
    make(seed, lang = "ru") {
      const text =
        lang === "ru" ? source : (taskStrings(domain, lang)[spec.id] ?? source);
      setWordsLang(lang);
      for (let k = 0; k < MAX_CANDIDATES; k += 1) {
        const rng = Xoshiro128.fromSeed(candidateSeed(seed, k));
        const p = spec.draw(rng);
        if (spec.valid && !spec.valid(p)) continue;
        const answer = spec.solve(p);
        const options = spec.options ? spec.options(p) : null;
        const traps = (spec.traps ?? []).flatMap((t) => {
          const wrong = t.wrong(p);
          return wrong === null || sameAnswer(wrong, answer)
            ? []
            : [{ spec: t, wrong }];
        });
        // Two traps that give the same wrong answer are one trap: the task is drawn again.
        const keys = traps.map((t) => keyOf(t.wrong));
        if (new Set(keys).size !== keys.length) continue;
        const vars = spec.vars(p);
        const computed: Q[] = [];
        const stringsOf = (s: string): string =>
          notation(fill(s, vars, spec.id, computed, lang), lang);
        const checker = checkerOf(
          spec.answer,
          answer,
          options,
          spec.within ? spec.within(p) : Q.of(0n),
          spec.rule ?? "simplest",
          spec.face ?? "digital",
        );
        const made: Made = {
          text: stringsOf(text.text),
          svg: spec.picture ? spec.picture(p, pictureLabels(lang)) : null,
          options,
          answer,
          entry: entryOf(spec.answer, answer),
          checker,
          // An entry the checker can't parse never reaches a verdict, so it can't be a mistake to explain.
          traps: traps
            .filter(
              (t) =>
                checker(entryOf(spec.answer, t.wrong)).verdict !== "unparsed",
            )
            .map((t) => ({
              id: t.spec.id,
              kind: t.spec.kind,
              wrong: t.wrong,
              entry: entryOf(spec.answer, t.wrong),
              explanation: stringsOf(text.explain[t.spec.id] ?? ""),
            })),
          solution: text.solution.map(stringsOf),
          hints: [
            stringsOf(text.hints[0]),
            stringsOf(text.hints[1]),
            stringsOf(text.hints[2]),
          ],
          referenceAgrees: sameAnswer(answer, spec.reference(p)),
          allowed: withNegatives([
            ...Object.values(vars).flatMap(numbersIn),
            ...numbersOfAnswer(answer),
            ...traps.flatMap((t) => numbersOfAnswer(t.wrong)),
            ...computed,
            ...(spec.constants ?? []).map((c) =>
              Number.isInteger(c)
                ? Q.of(BigInt(c))
                : Q.fromDecimal(String(c).replace(".", ",")),
            ),
          ]),
          paramsKey: JSON.stringify(vars),
        };
        return made;
      }
      throw new RangeError(`no_valid_parameters:${spec.id}`);
    },
  };
}

/** A number and, for a fraction, the numbers a text reads in it: numerator, denominator, whole part and rest. */
const partsOf = (x: Q): Q[] => {
  if (x.d === 1n) return [x];
  const n = x.n < 0n ? -x.n : x.n;
  return [x, Q.of(n), Q.of(x.d), Q.of(n / x.d), Q.of(n % x.d)];
};

/** A number written with its sign dropped, as `-5` is read in a text, still counts as the number. */
const withNegatives = (list: readonly Q[]): Q[] => [
  ...list,
  ...list.map((q) => q.neg()),
];

const numbersOfAnswer = (answer: Answer): Q[] =>
  answer instanceof Q
    ? partsOf(answer)
    : typeof answer === "string"
      ? numbersIn(answer)
      : (answer as readonly (Q | string)[]).flatMap((x) =>
          x instanceof Q ? [x] : numbersIn(x),
        );

/** The numbers in the made texts that nothing in the task allows (REQ-1214). */
export function strayIn(made: Made): string[] {
  return strayNumbers(
    [
      made.text,
      ...made.solution,
      ...made.hints,
      ...made.traps.map((t) => t.explanation),
    ],
    made.allowed,
  );
}

/** Types a spec by its parameters and stores it in the list every domain file exports. */
export const defineSpec = <P>(spec: Spec<P>): Spec<never> =>
  spec as unknown as Spec<never>;
