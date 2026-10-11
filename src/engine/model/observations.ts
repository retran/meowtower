// The observations of the knowledge model (ADR-0060, TSK-0516): one pure function from
// the event log, in order, to the observations of the "on her own" estimate and of the
// "with help" estimate (REQ-0914 to REQ-0930). It reads no clock and no file, so one log
// always gives the same lists.

/** The purposes whose attempts are never observations of the estimate (REQ-0914). */
export const NOT_ESTIMATED = ["warmup", "session0"] as const;
/** The purpose of a control fact, which counts as its own node and subtype (REQ-0930). */
export const CONTROL = "control";

/** The weight of an attempt carrying the fatigue mark (ADR-0070, REQ-0918). */
export const FATIGUE_WEIGHT = 0.5;

export interface LogEvent {
  readonly type: string;
  readonly payload: unknown;
}

export interface Observation {
  readonly itemId: string;
  readonly node: string;
  readonly subtype: string;
  /** Score: 1 right, 0.5 partly right, 0 wrong or "Не знаю" (REQ-0918). */
  readonly c: number;
  /** Weight: 1, or 0.5 with the fatigue mark. */
  readonly w: number;
  readonly timeMs: number;
  /** False when the attempt was interrupted or came from another device (REQ-0224). */
  readonly timeCounts: boolean;
  readonly control: boolean;
}

export interface Observations {
  /** Graded first attempts with no help before the answer: the "on her own" estimate. */
  readonly own: Observation[];
  /** Second attempts and assisted attempts, listed apart for the "with help" estimate. */
  readonly help: Observation[];
}

interface Item {
  node: string;
  subtype: string;
  purpose: string;
  parent: string | null;
}

interface Attempt {
  attemptNo: number;
  assisted: boolean;
  hintLevel: number;
  interrupted: boolean;
  crossDevice: boolean;
  submittedMs: number;
  fatigue: boolean;
  rapidGuess: boolean;
}

const SCORE: Record<string, number> = {
  correct: 1,
  partial: 0.5,
  wrong: 0,
  dont_know: 0,
};

const field = <T>(payload: unknown, key: string): T | undefined =>
  (payload as Record<string, unknown> | undefined)?.[key] as T | undefined;

/**
 * The observations of a log, in order. An item excluded by its last exclusion event
 * is in no list; an attempt marked rapidGuess is in no list; an unparsed entry is no
 * attempt at all (REQ-0916, REQ-0918, REQ-0930).
 */
export function observationsOf(log: readonly LogEvent[]): Observations {
  const items = new Map<string, Item>();
  const attempts = new Map<string, Attempt>();
  const verdicts = new Map<string, { verdict: string }>();
  const excluded = new Set<string>();

  for (const event of log) {
    const p = event.payload;
    const itemId = field<string>(p, "itemId");
    if (event.type === "item_shown" && itemId !== undefined) {
      items.set(itemId, {
        node: field<string>(p, "node") ?? "",
        subtype: field<string>(p, "subtype") ?? "",
        purpose: field<string>(p, "purpose") ?? "",
        parent: field<string>(p, "parentItemId") ?? null,
      });
    } else if (event.type === "attempt_submitted" && itemId !== undefined) {
      const input = field<{ submittedMs?: number }>(p, "input");
      attempts.set(itemId, {
        attemptNo: field<number>(p, "attemptNo") ?? 1,
        assisted: field<boolean>(p, "assisted") ?? false,
        hintLevel: field<number>(p, "hintLevel") ?? 0,
        interrupted: field<boolean>(p, "interrupted") ?? false,
        crossDevice: field<boolean>(p, "crossDevice") ?? false,
        submittedMs: input?.submittedMs ?? 0,
        fatigue: field<boolean>(p, "fatigue") ?? false,
        rapidGuess: field<boolean>(p, "rapidGuess") ?? false,
      });
    } else if (event.type === "verdict" && itemId !== undefined) {
      verdicts.set(itemId, { verdict: field<string>(p, "verdict") ?? "" });
    } else if (event.type === "item_excluded" && itemId !== undefined) {
      excluded.add(itemId);
    } else if (event.type === "item_included" && itemId !== undefined) {
      excluded.delete(itemId);
    }
  }

  const own: Observation[] = [];
  const help: Observation[] = [];
  for (const [itemId, attempt] of attempts) {
    const item = items.get(itemId);
    const verdict = verdicts.get(itemId)?.verdict;
    if (item === undefined || verdict === undefined) continue;
    if (!(verdict in SCORE) || excluded.has(itemId) || attempt.rapidGuess)
      continue;
    const control = item.purpose === CONTROL;
    const obs: Observation = {
      itemId,
      node: item.node,
      subtype: item.subtype,
      c: SCORE[verdict] ?? 0,
      w: attempt.fatigue ? FATIGUE_WEIGHT : 1,
      timeMs: attempt.submittedMs,
      timeCounts: !(attempt.interrupted || attempt.crossDevice),
      control,
    };
    const estimated = !(NOT_ESTIMATED as readonly string[]).includes(
      item.purpose,
    );
    if (attempt.attemptNo === 2 || attempt.assisted || attempt.hintLevel > 0) {
      if (estimated) help.push(obs);
    } else if (estimated) {
      own.push(obs);
    }
  }
  return { own, help };
}
