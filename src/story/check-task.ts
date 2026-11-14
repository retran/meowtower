// The task of a check (ADR-3270, REQ-8174, REQ-8176): when the Master calls `request_check`, the
// Director chooses the node, the subtype and the purpose, whatever she tried. It is `nextTask` of
// ADR-0070 over the log: the success share of her graded first attempts decides review or frontier,
// and the slots this log has already decided inside the corridor keep review at its band. One log
// gives one answer, and neither the Master nor her words reach the choice.
import {
  outcomesOf,
  successShare,
  CORRIDOR_HIGH,
  CORRIDOR_LOW,
} from "../engine/director/corridor.js";
import { nodeFactsOf } from "../engine/director/facts.js";
import {
  type DirectorConfig,
  nextTask,
  type Slot,
} from "../engine/director/nextTask.js";
import type { Graph } from "../engine/graph.js";
import type { LogEvent } from "../engine/model/observations.js";
import type { ModelParamsT } from "../engine/model/params.js";

export interface CheckTaskInput {
  readonly graph: Graph;
  readonly params: ModelParamsT;
  readonly config: DirectorConfig;
  readonly log: readonly LogEvent[];
  readonly now: number;
  /** Leaves out a node with no template to draw a task from. */
  readonly canGenerate?: (node: string) => boolean;
}

/** The Director's slot for a check, and whether the share was inside the flow corridor. */
export type ChosenTask = Slot & { readonly corridor: boolean };

/** The slots this log decided inside the corridor, and the review ones among them. */
function corridorCounts(log: readonly LogEvent[]): {
  inCorridor: number;
  reviewAmong: number;
} {
  let inCorridor = 0;
  let reviewAmong = 0;
  for (const e of log) {
    if (e.type !== "check_task_chosen") continue;
    const p = e.payload as { corridor?: unknown; purpose?: unknown };
    if (p.corridor !== true) continue;
    inCorridor += 1;
    if (p.purpose === "review") reviewAmong += 1;
  }
  return { inCorridor, reviewAmong };
}

/** Chooses the task of a check, or nothing where no node can give one. */
export function chooseCheckTask(input: CheckTaskInput): ChosenTask | undefined {
  const { graph, params, config, log, now } = input;
  const share = successShare(outcomesOf(log));
  const slot = nextTask({
    nodes: nodeFactsOf({ graph, log, params, now, config }),
    now,
    share,
    ...corridorCounts(log),
    params,
    config,
    ...(input.canGenerate ? { canGenerate: input.canGenerate } : {}),
  });
  if (!slot) return undefined;
  const corridor =
    share === null || (share >= CORRIDOR_LOW && share <= CORRIDOR_HIGH);
  return { ...slot, corridor };
}
