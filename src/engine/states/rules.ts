// The state of each node (ADR-0060, SPC-0060, TSK-0524, TSK-0525): a named rule over the
// node's checks, never a probability. The newest complete check sets the tested state, and
// `stable` reads the whole history. Each state keeps its rule's identifier and the item
// identifiers the rule read (REQ-0934). Pure: it takes the log and the graph's subtypes and
// reads the clock only through the event times it is given.
import { fluencyThresholdSeconds } from "../model/beta.js";
import { reviewOf } from "../model/review.js";
import {
  type LogEvent,
  observationsOf,
  type Observation,
} from "../model/observations.js";
import {
  type Check,
  checksOf,
  choiceOnlyOf,
  marksOf,
  type Subtype,
} from "./checks.js";

const DAY_MS = 86_400_000;
/** Days two fluent checks must lie apart for `stable` (REQ-0944). */
export const STABLE_GAP_DAYS = 14;

/** The tested states of a node, with the labels of the record (SPC-0060, REQ-0936 to REQ-0946). */
export type StateName =
  | "not mastered"
  | "understands"
  | "understands, needs speed"
  | "fluent"
  | "fluent (probe)"
  | "being clarified"
  | "stable"
  | "not checked"
  | "stretch: not checked";

export type RuleId =
  | "block-low"
  | "block-mid"
  | "block-slow"
  | "block-fast"
  | "probe-fast"
  | "open"
  | "none"
  | "stable";

/** The label key of each state, in the per-language file (REQ-0946). */
export const LABEL_KEYS: Record<StateName, string> = {
  "not mastered": "state.not_mastered",
  understands: "state.understands",
  "understands, needs speed": "state.understands_needs_speed",
  fluent: "state.fluent",
  "fluent (probe)": "state.fluent_probe",
  "being clarified": "state.being_clarified",
  stable: "state.stable",
  "not checked": "state.not_checked",
  "stretch: not checked": "state.stretch_not_checked",
};

export interface Verdict {
  readonly state: StateName;
  readonly rule: RuleId;
  /** The item identifiers the rule read; empty for `none`. */
  readonly items: readonly string[];
  /** The time of the check the verdict comes from, in milliseconds; 0 with none. */
  readonly at: number;
}

export interface NodeState extends Verdict {
  readonly node: string;
  /** The node's checks, in log order, each with its verdict. */
  readonly checks: readonly { check: Check; verdict: Verdict }[];
  /** True when the node's newest complete check is a full block that reads fluent. */
  readonly fluentBlock: boolean;
  /** True when the node's last probe scored 0 out of 2 (the block owed, TSK-0526). */
  readonly probeZero: boolean;
  /** The time of the node's last graded first attempt, or undefined with none. */
  readonly lastAttemptAt: number | undefined;
  /** The next review of the ladder of TSK-0522; null with no unassisted attempt. */
  readonly nextReview: number | null;
}

const median = (xs: readonly number[]): number => {
  const sorted = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? (sorted[mid] ?? 0)
    : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
};

/** The verdict of one complete check, by its rule (SPC-0060 rule table). */
export function verdictOf(check: Check, node: string): Verdict {
  const threshold = fluencyThresholdSeconds(node) * 1000;
  const ids = check.items.map((o) => o.itemId);
  if (check.kind === "block") {
    const score = check.items.reduce((acc, o) => acc + o.c, 0);
    const right = check.items.filter((o) => o.c === 1);
    if (score <= 2.5)
      return verdict("not mastered", "block-low", ids, check.at);
    if (score <= 3.5) return verdict("understands", "block-mid", ids, check.at);
    const slow = median(right.map((o) => o.timeMs)) > threshold;
    return slow
      ? verdict("understands, needs speed", "block-slow", ids, check.at)
      : verdict("fluent", "block-fast", ids, check.at);
  }
  const fast = check.items.every((o) => o.c === 1 && o.timeMs <= threshold);
  return fast
    ? verdict("fluent (probe)", "probe-fast", ids, check.at)
    : verdict("being clarified", "open", ids, check.at);
}

const verdict = (
  state: StateName,
  rule: RuleId,
  items: readonly string[],
  at: number,
): Verdict => ({ state, rule, items, at });

const isFluent = (v: Verdict): boolean =>
  v.rule === "block-fast" || v.rule === "probe-fast";

/**
 * `stable` (REQ-0944): two fluent checks at least 14 days apart, one of them a full block,
 * and no check after the first of the two is worse than fluent. Two probes never qualify.
 * Reads the log's event times only, so the answer is the same at any later clock.
 */
export function stableOf(
  checks: readonly { check: Check; verdict: Verdict }[],
): { items: readonly string[] } | undefined {
  for (let i = 0; i < checks.length; i += 1) {
    for (let j = i + 1; j < checks.length; j += 1) {
      const first = checks[i];
      const second = checks[j];
      if (!first || !second) continue;
      const pair = [first, second];
      if (!pair.every((c) => isFluent(c.verdict))) continue;
      if (!pair.some((c) => c.check.kind === "block")) continue;
      if (second.check.at - first.check.at < STABLE_GAP_DAYS * DAY_MS) continue;
      const later = checks.slice(i + 1);
      if (later.some((c) => !isFluent(c.verdict))) continue;
      return { items: [...first.verdict.items, ...second.verdict.items] };
    }
  }
  return undefined;
}

/**
 * The state of one node. `own` is its graded first attempts, unassisted, in log order;
 * `markSeq` is the log index of its newest active lesson mark, or -1 (REQ-0952).
 */
export function nodeStateOf(
  node: { id: string; stretch: boolean },
  own: readonly Observation[],
  subtypes: readonly Subtype[],
  markSeq: number,
): NodeState {
  const choiceOnly = choiceOnlyOf(own);
  const counted = own.filter((o) => o.seq > markSeq);
  const checks = checksOf(counted, subtypes, choiceOnly).map((check) => ({
    check,
    verdict: verdictOf(check, node.id),
  }));
  const last = checks[checks.length - 1];
  const lastAttempt = own[own.length - 1];
  const lastAttemptAt = lastAttempt?.at;
  const lastProbe = [...checks].reverse().find((c) => c.check.kind === "probe");
  const probeZero =
    lastProbe !== undefined && lastProbe.check.items.every((o) => o.c === 0);
  const base = (() => {
    if (last) return last.verdict;
    if (counted.length > 0)
      return verdict("being clarified", "open", [], lastAttemptAt ?? 0);
    return verdict(
      node.stretch ? "stretch: not checked" : "not checked",
      "none",
      [],
      0,
    );
  })();
  const stable = stableOf(checks);
  const final: Verdict = stable
    ? verdict("stable", "stable", stable.items, last?.verdict.at ?? 0)
    : base;
  return {
    node: node.id,
    ...final,
    checks,
    fluentBlock:
      last !== undefined &&
      last.check.kind === "block" &&
      isFluent(last.verdict),
    probeZero,
    lastAttemptAt,
    nextReview: reviewOf(own, 0).nextReview,
  };
}

/** The states of every node of the graph, from the log, in the graph's node order. */
export function statesOf(
  graph: {
    nodes(): { id: string; level: string }[];
    subtypes(id: string): { id: string; weight: number }[];
  },
  log: readonly LogEvent[],
): NodeState[] {
  const { own } = observationsOf(log);
  const marks = marksOf(log);
  return graph.nodes().map((n) =>
    nodeStateOf(
      { id: n.id, stretch: n.level === "stretch" },
      own.filter((o) => o.node === n.id),
      graph.subtypes(n.id),
      marks.get(n.id) ?? -1,
    ),
  );
}
