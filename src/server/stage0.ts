import type { Hono } from "hono";
import { appendEvents, LogWriteFailed } from "../engine/events/append.js";
import { eventByIdemKey } from "../engine/events/read.js";
import type { Db } from "./database.js";
import { raise } from "./failures.js";

// Until TSK-0040 pairs devices, a request names its own device, and one that
// names none is logged under this identifier.
const UNPAIRED = "unpaired";

interface Stage0Write {
  id: string;
  answer?: string;
  deviceId?: string;
  clientMs?: number;
}

// Stage 0's spike write (ADR-0190) appends one event to the log. The event's
// type is TSK-0200's default, `attempt_submitted` at version 0 carrying the
// raw answer, which the epic realising ADR-0080 upcasts from. The append
// commits before the reply is built, so a reply the client sees always stands
// for a durable write (REQ-2508).
export function mountStage0(app: Hono, db: Db): void {
  app.post("/api/stage0/write", async (c) => {
    const body = await c.req.json<Stage0Write>();
    if (eventByIdemKey(db, body.id)) return c.json({ id: body.id }, 201);
    try {
      appendEvents(db, [
        {
          type: "attempt_submitted",
          v: 0,
          payload: { raw: body.answer ?? "" },
          origin: {
            deviceId: body.deviceId ?? UNPAIRED,
            clientMs: body.clientMs ?? Date.now(),
          },
          idemKey: body.id,
        },
      ]);
    } catch (err) {
      if (!(err instanceof LogWriteFailed)) throw err;
      raise("log_write_failed", err.message);
      return c.json({ error: "log_write_failed" }, 503);
    }
    return c.json({ id: body.id }, 201);
  });
  app.get("/api/stage0/write/:id", (c) => {
    const id = c.req.param("id");
    return eventByIdemKey(db, id) ? c.json({ id }) : c.json({}, 404);
  });
}
