import type { Hono } from "hono";
import type { Db } from "./database.js";

// Stage 0's spike write (ADR-0190), until ADR-0020's event log replaces it.
// The insert commits before the reply is built, so a reply the client sees
// always stands for a durable write (REQ-2508).
export function mountStage0(app: Hono, db: Db): void {
  app.post("/api/stage0/write", async (c) => {
    const { id } = await c.req.json<{ id: string }>();
    db.prepare("INSERT OR IGNORE INTO stage0_writes VALUES (?, ?)").run(
      id,
      new Date().toISOString(),
    );
    return c.json({ id }, 201);
  });
  app.get("/api/stage0/write/:id", (c) => {
    const id = c.req.param("id");
    const row = db.prepare("SELECT id FROM stage0_writes WHERE id = ?").get(id);
    return row ? c.json({ id }) : c.json({}, 404);
  });
}
