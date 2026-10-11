// The reference solver (ADR-0040): it computes each stand-in task's answer by
// plain integer arithmetic. It imports nothing from src/, so a template and this
// solver can't share a bug.
export type Operation = "add" | "sub" | "mul";

/** The operation of each stand-in task, as its text asks: 1 adds, 2 subtracts, 3 multiplies. */
export const OPERATION_OF_TASK: Readonly<Record<number, Operation>> = {
  1: "add",
  2: "sub",
  3: "mul",
};

export function solveReference(op: Operation, a: number, b: number): number {
  if (op === "add") return a + b;
  if (op === "sub") return a - b;
  return a * b;
}
