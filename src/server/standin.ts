// The stand-in adventure of EPC-0030: fixed hand-written tasks and a plain
// check, until the epics realising ADR-0040, ADR-0070 and ADR-0140 replace the
// tasks, the sequence, the check and the grants. Texts live in the language file.
import { t } from "../shared/i18n.js";

export interface StandinTask {
  n: number;
  params: { a: number; b: number };
  answer: string;
}

export const STANDIN_TASKS: readonly StandinTask[] = [
  { n: 1, params: { a: 3, b: 4 }, answer: "7" },
  { n: 2, params: { a: 5, b: 2 }, answer: "3" },
  { n: 3, params: { a: 2, b: 6 }, answer: "12" },
];

export const ROOM_LENGTH = STANDIN_TASKS.length;

export const taskText = (task: StandinTask): string =>
  t(`standin.task.${task.n}.text`);
export const taskSolution = (task: StandinTask): string[] => [
  t(`standin.task.${task.n}.solution`),
];

const normalise = (raw: string): string => raw.replace(/\s+/g, "");

export type Verdict = "correct" | "wrong" | "dont_know" | "unparsed";

/** The stand-in check: equal to the answer is correct, anything else isn't. */
export function standinVerdict(
  raw: string,
  dontKnow: boolean,
  answer: string,
): Verdict {
  if (dontKnow) return "dont_know";
  const given = normalise(raw);
  if (given === "") return "unparsed";
  return given === normalise(answer) ? "correct" : "wrong";
}
