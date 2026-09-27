// The session's stream (SPC-0030): messages go out on the SSE route to every
// open connection and stay readable on the poll route for a client whose
// stream dropped. Messages live in memory: after a restart the resume packet,
// not the poll route, brings a client back.
import type { Context, Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { PollOut, StreamMessage } from "../shared/api.js";
import { send } from "./send.js";

type Listener = (message: StreamMessage) => void;

export interface Stream {
  publish(sessionId: string, message: StreamMessage): void;
  after(sessionId: string, seq: number): StreamMessage[];
  subscribe(sessionId: string, listener: Listener): () => void;
}

export function createStream(): Stream {
  const sent = new Map<string, StreamMessage[]>();
  const listeners = new Map<string, Set<Listener>>();
  return {
    publish(sessionId, message) {
      const parsed = StreamMessage.parse(message);
      sent.set(sessionId, [...(sent.get(sessionId) ?? []), parsed]);
      for (const listener of listeners.get(sessionId) ?? []) listener(parsed);
    },
    after(sessionId, seq) {
      return (sent.get(sessionId) ?? []).filter((m) => m.seq > seq);
    },
    subscribe(sessionId, listener) {
      const set = listeners.get(sessionId) ?? new Set();
      set.add(listener);
      listeners.set(sessionId, set);
      return () => set.delete(listener);
    },
  };
}

/** Mounts the SSE and poll routes; `authorise` answers 401 for an unpaired device. */
export function mountStream(
  app: Hono,
  stream: Stream,
  authorise: (c: Context) => Response | null,
): void {
  app.get("/api/session/:id/events", (c) => {
    const refused = authorise(c);
    if (refused) return refused;
    const sessionId = c.req.param("id");
    return streamSSE(c, async (sse) => {
      const unsubscribe = stream.subscribe(sessionId, (message) => {
        void sse.writeSSE({
          event: message.type,
          id: String(message.seq),
          data: JSON.stringify(message),
        });
      });
      await new Promise<void>((resolve) => sse.onAbort(resolve));
      unsubscribe();
    });
  });

  app.get("/api/session/:id/poll", (c) => {
    const refused = authorise(c);
    if (refused) return refused;
    const after = Number(c.req.query("after") ?? 0);
    if (!Number.isInteger(after) || after < 0)
      return c.json({ error: "bad_request" }, 400);
    return send(c, PollOut, {
      messages: stream.after(c.req.param("id"), after),
    });
  });
}
