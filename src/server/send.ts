// The one place a body leaves the server (SPC-0030): parsed by its strict
// schema first, so a field outside it (a task's design, an early answer) never
// reaches the client. A body that fails is logged and becomes a bare 500.
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { z } from "zod";
import type { Source } from "./outgoing.js";

export function send<S extends z.ZodType>(
  c: Context,
  schema: S,
  body: z.input<S>,
  status: ContentfulStatusCode = 200,
  source: Source = "fixed",
): Response {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    console.error(
      `packet_invalid: ${c.req.method} ${c.req.path}: ${parsed.error.message}`,
    );
    return c.json({ error: "packet_invalid" }, 500);
  }
  // The app sets the gate on the context, so no body leaves around it (REQ-3326).
  const gate = c.get("outgoing");
  const safe = gate ? gate.body(parsed.data, source) : parsed.data;
  return c.json(safe as object, status);
}
