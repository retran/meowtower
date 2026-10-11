// Step-by-step input for a word problem (ADR-0040, REQ-0705 to REQ-0776). An
// entered step is an expression `a op b`, optionally with its result `= c`. It
// is matched against every valid solution path of the problem, labelled, and
// credited. An entered step the engine can't recognise is labelled unclassified
// and adds no error (REQ-0709). The result mark of a task depends only on its
// final answer, whatever method reached it (REQ-0848).
import { Q } from "../../math/q.js";

export type Op = "add" | "sub" | "mul" | "div";
export type Label = "correct" | "calculation" | "structure" | "unclassified";

/** One valid solution path: its steps, each written `a op b`. */
export interface ValidPath {
  readonly steps: readonly string[];
}

interface Expr {
  readonly op: Op;
  readonly left: Q;
  readonly right: Q;
  /** The result the player wrote after `=`, when she wrote one. */
  readonly result?: Q;
}

export interface MatchResult {
  readonly labels: readonly Label[];
  /** The index of the first valid path every step belongs to, or undefined. */
  readonly path: number | undefined;
  /** The steps that are an error: a calculation error or a structure trap. */
  readonly errors: number;
}

const OPS: Record<string, Op> = {
  "+": "add",
  "-": "sub",
  "−": "sub",
  "·": "mul",
  "×": "mul",
  "*": "mul",
  ":": "div",
  "÷": "div",
  "/": "div",
};

const STEP = /^\s*(\S+)\s*([+\-−·×*:÷/])\s*(\S+)\s*(?:=\s*(\S+))?\s*$/;

/** Reads one step, or undefined when it isn't an expression the engine knows. */
function parse(text: string): Expr | undefined {
  const m = STEP.exec(text);
  if (!m) return undefined;
  const op = OPS[m[2] ?? ""];
  if (op === undefined) return undefined;
  try {
    const left = Q.fromDecimal(m[1] ?? "");
    const right = Q.fromDecimal(m[3] ?? "");
    const result = m[4] === undefined ? undefined : Q.fromDecimal(m[4]);
    return result === undefined
      ? { op, left, right }
      : { op, left, right, result };
  } catch {
    return undefined;
  }
}

const apply = (e: Expr): Q => {
  switch (e.op) {
    case "add":
      return e.left.add(e.right);
    case "sub":
      return e.left.sub(e.right);
    case "mul":
      return e.left.mul(e.right);
    case "div":
      return e.left.div(e.right);
  }
};

/** The same operation on the same operands, whatever the result written. */
const sameExpr = (a: Expr, b: Expr): boolean =>
  a.op === b.op && a.left.eq(b.left) && a.right.eq(b.right);

const parsedPaths = (paths: readonly ValidPath[]): Expr[][] =>
  paths.map((p) =>
    p.steps.map((s) => parse(s)).filter((e): e is Expr => e !== undefined),
  );

/**
 * Labels each entered step, and finds the first valid path that every entered
 * step belongs to. A step is correct when its operation and operands are a path
 * step and its result, if written, is right; a calculation error when only the
 * result is wrong; a structure trap when it matches one; and unclassified
 * otherwise (REQ-0707, REQ-0709).
 */
export function matchSteps(
  entered: readonly string[],
  paths: readonly ValidPath[],
  structureTraps: readonly string[],
): MatchResult {
  const pathExprs = parsedPaths(paths);
  const traps = structureTraps
    .map((t) => parse(t))
    .filter((e): e is Expr => e !== undefined);
  const exprs = entered.map((text) => parse(text));

  const labels: Label[] = exprs.map((e): Label => {
    if (e === undefined) return "unclassified";
    const inPath = pathExprs.some((steps) => steps.some((s) => sameExpr(s, e)));
    if (inPath) {
      const onPath = pathExprs.flat().find((s) => sameExpr(s, e));
      if (
        e.result === undefined ||
        onPath === undefined ||
        e.result.eq(apply(onPath))
      )
        return "correct";
      return "calculation";
    }
    if (traps.some((t) => sameExpr(t, e))) return "structure";
    return "unclassified";
  });

  const path = pathExprs.findIndex(
    (steps) =>
      exprs.every(
        (e) => e !== undefined && steps.some((s) => sameExpr(s, e)),
      ) &&
      steps.every((s) => exprs.some((e) => e !== undefined && sameExpr(s, e))),
  );
  const errors = labels.filter(
    (l) => l === "calculation" || l === "structure",
  ).length;
  return { labels, path: path === -1 ? undefined : path, errors };
}

/**
 * The credit of a step-by-step answer: full when its final answer is right and
 * its steps are one valid path, half when the final answer is right and its
 * steps aren't recognised, and none when the final answer is wrong (REQ-0774,
 * REQ-0776).
 */
export function stepCredit(
  finalCorrect: boolean,
  entered: readonly string[],
  paths: readonly ValidPath[],
  structureTraps: readonly string[],
): 0 | 0.5 | 1 {
  if (!finalCorrect) return 0;
  const { path } = matchSteps(entered, paths, structureTraps);
  return path === undefined ? 0.5 : 1;
}

/** The result mark of a task: by its final answer alone (REQ-0848). */
export const resultMark = (finalCorrect: boolean): 0 | 1 =>
  finalCorrect ? 1 : 0;
