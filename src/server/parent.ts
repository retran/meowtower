import { Hono } from "hono";
import { lang, t } from "../shared/i18n.js";
import type { Db } from "./database.js";
import { issuePairingCode } from "./devices.js";
import { takeSnapshot } from "./snapshots.js";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const escape = (s: string): string =>
  s.replace(/[&<>"]/g, (ch) => `&#${ch.charCodeAt(0)};`);

// The Parent Room's listener, published on the Mac's loopback only (REQ-2510).
// ADR-0180 fills the room; ADR-0020's export routes mount here and nowhere else.
export function createParentApp({
  db,
  now = Date.now,
  dbPath,
  snapshots,
}: {
  db: Db;
  now?: () => number;
  dbPath?: string;
  snapshots?: string;
}): Hono {
  const app = new Hono();
  // Only the Mac reaches this listener, so only the Mac issues pairing codes.
  app.post("/pair-code", (c) => c.json({ code: issuePairingCode(db, now()) }));
  // ./meowtower db-snapshot: one snapshot on demand, its time kept for status.
  app.post("/snapshot", async (c) => {
    if (!dbPath || !snapshots) return c.json({ error: "backup_failed" }, 500);
    try {
      const taken = await takeSnapshot(dbPath, snapshots, new Date(now()));
      writeFileSync(
        join(snapshots, "last.json"),
        JSON.stringify({
          file: taken.file,
          ms: taken.ms,
          at: new Date(now()).toISOString(),
        }),
      );
      return c.json(taken);
    } catch (err) {
      console.error(`backup_failed: ${String(err)}`);
      return c.json({ error: "backup_failed" }, 500);
    }
  });
  app.get("/", (c) =>
    c.html(
      `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">` +
        `<title>${escape(t("parent.room.title"))}</title></head>` +
        `<body><h1>${escape(t("parent.room.title"))}</h1></body></html>`,
    ),
  );
  return app;
}
