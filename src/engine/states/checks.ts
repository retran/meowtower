// The checks of a node (ADR-0060, SPC-0060, TSK-0523): a full block of five graded first
// attempts within seven days that covers every subtype of weight 0.2 or more, and a probe
// of two probe tasks on different subtypes (or of three choice tasks with at least four
// options each, for a node the graph tests only by choice). Pure: it reads observations,
// never the clock. Checks never span a lesson mark (REQ-0952) and never hold a control fact
// (REQ-0932).
import type { LogEvent, Observation } from "../model/observations.js";

const DAY_MS = 86_400_000;
export const BLOCK_SIZE = 5;
export const BLOCK_DAYS = 7;
/** The subtype weight from which a full block must cover a subtype (SPC-0060). */
export const COVER_WEIGHT = 0.2;
export const PROBE_CHOICE_SIZE = 3;
export const PROBE_MIN_OPTIONS = 4;

export interface Subtype {
  readonly id: string;
  readonly weight: number;
}

export interface Check {
  readonly kind: "block" | "probe";
  /** The observations the check reads, in log order. */
  readonly items: readonly Observation[];
  /** The log index of the check's last observation, which orders checks (REQ-0934). */
  readonly seq: number;
  /** The time of the check's last observation, in milliseconds since the epoch. */
  readonly at: number;
}

/**
 * The log index of each node's newest lesson mark that the parent has not removed, by node
 * (REQ-0952). A removed mark is as if it had never been set (REQ-0952).
 */
export function marksOf(log: readonly LogEvent[]): Map<string, number> {
  const active = new Map<string, number>();
  for (const [index, event] of log.entries()) {
    const p = event.payload as { node?: string; subtype?: string | null };
    if (p.node === undefined) continue;
    const key = `${p.node}|${p.subtype ?? ""}`;
    if (event.type === "parent_tag_added") active.set(key, index);
    else if (event.type === "parent_tag_removed") active.delete(key);
  }
  const byNode = new Map<string, number>();
  for (const [key, seq] of active) {
    const node = key.split("|")[0] ?? "";
    byNode.set(node, Math.max(byNode.get(node) ?? -1, seq));
  }
  return byNode;
}

/** A window of five observations that is a full block, or undefined (REQ-0950). */
const blockOver = (
  window: readonly Observation[],
  subtypes: readonly Subtype[],
): Check | undefined => {
  const first = window[0];
  const last = window[window.length - 1];
  if (first === undefined || last === undefined) return undefined;
  if (last.at - first.at > BLOCK_DAYS * DAY_MS) return undefined;
  const seen = new Set(window.map((o) => o.subtype));
  const covered = subtypes
    .filter((s) => s.weight >= COVER_WEIGHT)
    .every((s) => seen.has(s.id));
  return covered
    ? { kind: "block", items: window, seq: last.seq, at: last.at }
    : undefined;
};

/**
 * The full blocks of a node's observations, in log order. Each block is the next five
 * consecutive graded observations that qualify; a window that doesn't qualify moves on by
 * one, so consecutive blocks never share an observation.
 */
export function fullBlocksOf(
  own: readonly Observation[],
  subtypes: readonly Subtype[],
): Check[] {
  const graded = own.filter((o) => !o.control);
  const blocks: Check[] = [];
  let start = 0;
  while (start + BLOCK_SIZE <= graded.length) {
    const window = graded.slice(start, start + BLOCK_SIZE);
    const block = blockOver(window, subtypes);
    if (block) {
      blocks.push(block);
      start += BLOCK_SIZE;
    } else {
      start += 1;
    }
  }
  return blocks;
}

/**
 * The probes of a node: consecutive pairs of probe tasks on different subtypes, or, for a
 * choice-only node, consecutive triples of choice tasks with at least four options each
 * (REQ-0954). A pair on one subtype is passed over.
 */
export function probesOf(
  own: readonly Observation[],
  choiceOnly: boolean,
): Check[] {
  const probes: Check[] = [];
  if (choiceOnly) {
    const eligible = own.filter(
      (o) => o.form === "choice" && o.options >= PROBE_MIN_OPTIONS,
    );
    for (
      let i = 0;
      i + PROBE_CHOICE_SIZE <= eligible.length;
      i += PROBE_CHOICE_SIZE
    ) {
      const items = eligible.slice(i, i + PROBE_CHOICE_SIZE);
      const last = items[items.length - 1];
      if (last)
        probes.push({ kind: "probe", items, seq: last.seq, at: last.at });
    }
    return probes;
  }
  const tasks = own.filter((o) => o.probe);
  let i = 0;
  while (i + 1 < tasks.length) {
    const a = tasks[i];
    const b = tasks[i + 1];
    if (a && b && a.subtype !== b.subtype) {
      probes.push({ kind: "probe", items: [a, b], seq: b.seq, at: b.at });
      i += 2;
    } else {
      i += 1;
    }
  }
  return probes;
}

/** Every complete check of a node, blocks and probes together, in log order (REQ-0934). */
export function checksOf(
  own: readonly Observation[],
  subtypes: readonly Subtype[],
  choiceOnly: boolean,
): Check[] {
  return [...fullBlocksOf(own, subtypes), ...probesOf(own, choiceOnly)].sort(
    (a, b) => a.seq - b.seq,
  );
}

/** True when every observation of the node is a choice task (the graph tests it by choice). */
export const choiceOnlyOf = (own: readonly Observation[]): boolean =>
  own.length > 0 && own.every((o) => o.form === "choice");
