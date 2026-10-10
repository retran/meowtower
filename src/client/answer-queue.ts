// The answer queue (SPC-0030, REQ-2434): an answer is committed to the event
// queue's store before it is sent, retried from 1 second doubling to at most
// 30 seconds until the server replies, and flushed on launch before the client
// asks to resume. The server removes it from the queue by a `2xx` reply or
// `409 lease_moved`; any other `4xx` apart from `401`, `408` and `429` is
// final, so the entry leaves the queue and is listed as refused at once.
import type { AnswerIn, AnswerOut } from "../shared/api.js";
import { postAnswer, UNREACHABLE } from "./api.js";
import { enqueue, entries, remove, type QueueEntry } from "./event-queue.js";

export const FIRST_RETRY_MS = 1000;
export const MAX_RETRY_MS = 30 * 1000;
/** An answer unsent this long shows as `queue_stuck` in the settings. */
export const STUCK_AFTER_MS = 24 * 60 * 60 * 1000;

interface Queued {
  sessionId: string;
  answer: AnswerIn;
}

/** An answer the server refused for good, listed in the settings. */
export interface Refused {
  at: number;
  error: string;
}
const refused: Refused[] = [];
export const refusedAnswers = (): Refused[] => [...refused];

export type Delivery =
  | { kind: "sent"; reply: AnswerOut }
  | { kind: "moved" }
  | { kind: "refused"; error: string };

let wake: (() => void) | undefined;
// A connection that comes back ends the wait at once.
addEventListener("online", () => wake?.());

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    const timer = setTimeout(done, ms);
    function done(): void {
      clearTimeout(timer);
      wake = undefined;
      resolve();
    }
    wake = done;
  });

/** A wait that grows from 1 second to 30 and starts over with a new clock. */
export function retryClock(): () => Promise<void> {
  let delay = FIRST_RETRY_MS;
  return async () => {
    const now = delay;
    delay = Math.min(delay * 2, MAX_RETRY_MS);
    await sleep(now);
  };
}

/** One attempt: what the server answered, or null where it can be tried again. */
async function attempt(entry: QueueEntry): Promise<Delivery | null> {
  const queued = entry.body as Queued;
  const res = await postAnswer(queued.sessionId, queued.answer);
  if (res.status === UNREACHABLE) return null;
  if (res.status === 200) {
    await remove(entry.idemKey);
    return { kind: "sent", reply: res.body as unknown as AnswerOut };
  }
  if (res.status === 409 && res.body["error"] === "lease_moved") {
    await remove(entry.idemKey);
    return { kind: "moved" };
  }
  const final =
    res.status >= 400 &&
    res.status < 500 &&
    ![401, 408, 429].includes(res.status);
  if (!final) return null;
  await remove(entry.idemKey);
  const error = String(res.body["error"] ?? res.status);
  refused.push({ at: entry.queuedAt, error });
  return { kind: "refused", error };
}

/**
 * Commits the answer, then sends it until the server replies. `onWaiting`
 * runs each time a send gets no usable reply, so the screen can show the
 * waiting scene instead of an outcome (REQ-2438).
 */
export async function submitAnswer(
  sessionId: string,
  answer: Omit<AnswerIn, "clientSeq">,
  clientSeq: number,
  onWaiting: () => void,
): Promise<Delivery> {
  const full: AnswerIn = { ...answer, clientSeq };
  const entry = await enqueue("answer", `answer:${clientSeq}`, {
    sessionId,
    answer: full,
  } satisfies Queued);
  const wait = retryClock();
  for (;;) {
    const delivered = await attempt(entry);
    if (delivered) return delivered;
    onWaiting();
    await wait();
  }
}

/**
 * One pass over the answers a previous launch left unsent, in the order made.
 * True when none is left, so the client may ask to resume.
 */
export async function flushOnce(): Promise<boolean> {
  for (const entry of await entries()) {
    if (entry.kind !== "answer") continue;
    if (!(await attempt(entry))) return false;
  }
  return true;
}

/** The entries that have waited 24 hours or more. */
export async function stuckEntries(now = Date.now()): Promise<QueueEntry[]> {
  return (await entries()).filter(
    (e) => e.kind === "answer" && now - e.queuedAt >= STUCK_AFTER_MS,
  );
}
