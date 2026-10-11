// The computation graph (ADR-0040, REQ-1214, REQ-1234): givens and the steps
// that compute from them, one graph gives the solution, the three hints and the
// explanation of every trap. A text is written with placeholders that name a
// graph value, so a number in it is always one the graph computes or a given.
// The texts themselves come from the language file (ADR-0160), so this module
// holds no words.
import { formatQ, notation } from "../../math/format.js";
import { Q } from "../../math/q.js";

export type Op = "add" | "sub" | "mul" | "div";

export interface Given {
  readonly id: string;
  readonly value: Q;
}

export interface Step {
  readonly id: string;
  readonly op: Op;
  readonly args: readonly [string, string];
}

export interface Graph {
  readonly givens: readonly Given[];
  readonly steps: readonly Step[];
  /** The id of the node that holds the correct answer. */
  readonly answer: string;
}

export type Values = ReadonlyMap<string, Q>;

/** A trap computes its wrong answer from the graph's values (REQ-1234). */
export interface Trap {
  readonly id: string;
  readonly apply: (values: Values) => Q;
}

const APPLY: Record<Op, (a: Q, b: Q) => Q> = {
  add: (a, b) => a.add(b),
  sub: (a, b) => a.sub(b),
  mul: (a, b) => a.mul(b),
  div: (a, b) => a.div(b),
};

/** The value of a node that must exist; a missing id is a broken graph. */
export function valueOf(values: Values, id: string): Q {
  const value = values.get(id);
  if (value === undefined) throw new RangeError(`no_value:${id}`);
  return value;
}

/** Every given and every step, computed exactly in `Q`. */
export function evaluate(graph: Graph): Map<string, Q> {
  const values = new Map<string, Q>();
  for (const given of graph.givens) values.set(given.id, given.value);
  for (const step of graph.steps) {
    const [x, y] = step.args;
    const a = valueOf(values, x);
    const b = valueOf(values, y);
    values.set(step.id, APPLY[step.op](a, b));
  }
  return values;
}

const symbol = (op: Op): string => {
  const n = notation();
  return { add: "+", sub: n.minus, mul: n.mul, div: n.div }[op];
};

/** Fills `{name}` placeholders: a node's value, `{answer}` or `{op}`. */
const fill = (
  template: string,
  values: Values,
  answerId: string,
  op?: Op,
): string =>
  template.replace(/\{(\w+)\}/g, (_, name: string) => {
    if (name === "answer") return formatQ(valueOf(values, answerId));
    if (name === "op") {
      if (op === undefined) throw new RangeError("no_operation");
      return symbol(op);
    }
    return formatQ(valueOf(values, name));
  });

/** One line per step, `a · b = c`, in the order the graph computes them. */
export function solution(graph: Graph, values: Values): string[] {
  return graph.steps.map((step) => {
    const [x, y] = step.args;
    return `${formatQ(valueOf(values, x))} ${symbol(step.op)} ${formatQ(valueOf(values, y))} = ${formatQ(valueOf(values, step.id))}`;
  });
}

/** The three hints, from the first step's operation and the graph's values. */
export function hints(
  graph: Graph,
  values: Values,
  texts: readonly [string, string, string],
): string[] {
  const first = graph.steps[0];
  if (first === undefined) throw new RangeError("no_steps");
  return texts.map((text) => fill(text, values, graph.answer, first.op));
}

/** An explanation of one trap, filled from the graph's values. */
export function explanation(
  graph: Graph,
  values: Values,
  template: string,
): string {
  return fill(template, values, graph.answer);
}

/** The wrong answer a trap computes in `Q` (REQ-1234). */
export const wrongAnswer = (trap: Trap, values: Values): Q =>
  trap.apply(values);

const NUMBER = /\d+(?:[  ]\d{3})*(?:,\d+)?/g;

/**
 * The numbers written in the texts that no allowed value equals. A number is
 * matched with its group spaces (`12 500`) and its decimal comma (`2,5`).
 */
export function strayNumbers(
  texts: readonly string[],
  allowed: readonly Q[],
): string[] {
  const stray: string[] = [];
  for (const text of texts)
    for (const match of text.matchAll(NUMBER)) {
      const written = match[0];
      const value = Q.fromDecimal(written.replace(/[  ]/g, ""));
      if (!allowed.some((a) => a.eq(value))) stray.push(written);
    }
  return stray;
}
