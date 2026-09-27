// The one place a body leaves the server (SPC-0030): parsed by its strict
// schema first, so a field outside it (a task's design, an early answer) never
// reaches the client. A body that fails is logged and becomes a bare 500.
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { z } from "zod";

export function send<S extends z.ZodType>(
  c: Context,
  schema: S,
  body: z.input<S>,
  status: ContentfulStatusCode = 200,
): Response {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    console.error(
      `packet_invalid: ${c.req.method} ${c.req.path}: ${parsed.error.message}`,
    );
    return c.json({ error: "packet_invalid" }, 500);
  }
  return c.json(parsed.data as object, status);
}
