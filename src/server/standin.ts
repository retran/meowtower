// The stand-in adventure of EPC-0030: fixed hand-written tasks and a plain
// check, until the epics realising ADR-0040, ADR-0070 and ADR-0140 replace the
// tasks, the sequence, the check and the grants. Texts live in the language file.
import { t } from "../shared/i18n.js";

export interface StandinTask {
  n: number;
  params: { a: number; b: number };
  answer: string;
  /** The parallel task of the second attempt, until ADR-0080's epic. */
  twin: { params: { a: number; b: number }; answer: string };
}

export const STANDIN_TASKS: readonly StandinTask[] = [
  {
    n: 1,
    params: { a: 3, b: 4 },
    answer: "7",
    twin: { params: { a: 2, b: 6 }, answer: "8" },
  },
  {
    n: 2,
    params: { a: 5, b: 2 },
    answer: "3",
    twin: { params: { a: 6, b: 4 }, answer: "2" },
  },
  {
    n: 3,
    params: { a: 2, b: 6 },
    answer: "12",
    twin: { params: { a: 3, b: 5 }, answer: "15" },
  },
];

export const ROOM_LENGTH = STANDIN_TASKS.length;

/** The tasks after which the stand-in adventure reaches its finale. */
export const STANDIN_ADVENTURE_TASKS = 60;
/** The rooms on each stand-in floor, for where play stopped. */
export const STANDIN_ROOMS_PER_FLOOR = 5;

/**
 * Why the stand-in shows a task: task 2 is an unscored warm-up and the others
 * are scored, so the parent can play both side by side (REQ-2430). Only the
 * server's log holds it; no packet carries it (REQ-2428).
 */
export const standinPurpose = (task: StandinTask): string =>
  task.n === 2 ? "warmup" : "standin";

/** The guiding threads a session starts with, until ADR-0080's epic. */
export const STANDIN_THREADS = 5;

const key = (task: StandinTask, twin: boolean): string =>
  `standin.task.${task.n}${twin ? ".twin" : ""}`;
export const taskText = (task: StandinTask, twin = false): string =>
  t(`${key(task, twin)}.text`);
export const taskSolution = (task: StandinTask, twin = false): string[] => [
  t(`${key(task, twin)}.solution`),
];
// A task and its twin share the hint rungs and the template explanation,
// which name no number.
export const taskHint = (task: StandinTask, level: number): string =>
  t(`standin.task.${task.n}.hint.${level}`);
export const taskExplanation = (task: StandinTask): string =>
  t(`standin.task.${task.n}.explanation`);

/** The stand-in task an item_shown's subtype names. */
export const taskOf = (subtype: string): StandinTask | undefined =>
  STANDIN_TASKS.find((task) => subtype === `task-${task.n}`);

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
