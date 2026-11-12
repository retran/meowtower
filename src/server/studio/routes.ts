// The studio's routes in the Parent Room (ADR-3280): every one needs the parent's session, which
// the room hands in as `guard`.
import type { Context, Hono } from "hono";
import { z } from "zod";
import {
  adventureEventCounts,
  eventsOfAdventure,
} from "../../engine/events/read.js";
import type { Db } from "../db/index.js";
import { createSandbox, sandboxState } from "../sandbox/sandbox.js";
import {
  addEntry,
  childrenOf,
  createNode,
  editEntry,
  editNode,
  getEntry,
  getJob,
  getNode,
  jobsOf,
  KINDS,
  LEVELS,
  linksOf,
  listEntries,
  setStatus,
  STATUSES,
  StudioRefused,
  unuseEntry,
  useEntry,
  usesOf,
  versionOf,
  versionsOf,
} from "./store.js";

const NodeIn = z
  .object({
    level: z.enum(LEVELS),
    parentId: z.string().nullable(),
    title: z.string(),
    body: z.unknown(),
  })
  .strict();
const EditIn = z
  .object({
    body: z.unknown(),
    title: z.string().optional(),
    prompt: z.string().max(4000).nullable().optional(),
  })
  .strict();
const StatusIn = z.object({ status: z.enum(STATUSES) }).strict();
const EntryIn = z
  .object({
    kind: z.enum(KINDS),
    name: z.string(),
    body: z.string().max(20000),
  })
  .strict();
const EntryEditIn = z
  .object({ name: z.string(), body: z.string().max(20000) })
  .strict();
const ResetIn = z.object({ from: z.enum(["empty", "copy"]) }).strict();
const UseIn = z.object({ nodeId: z.string() }).strict();

export function mountStudio(
  app: Hono,
  db: Db,
  now: () => number,
  guard: (c: Context) => Promise<string | Response>,
): void {
  const base = "/api/parent/studio";

  /** A refusal of the store becomes a 400 with its reason; anything else is a fault. */
  const refused = (c: Context, err: unknown): Response => {
    if (err instanceof StudioRefused)
      return c.json({ error: "studio_refused", reason: err.reason }, 400);
    throw err;
  };

  app.get(`${base}/nodes`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const parent = c.req.query("parent");
    const nodes = await childrenOf(db, parent ? parent : null);
    return c.json({
      nodes: await Promise.all(
        nodes.map(async (n) => ({ ...n, links: await linksOf(db, n.id) })),
      ),
    });
  });

  app.post(`${base}/nodes`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const body = NodeIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    try {
      return c.json(await createNode(db, now(), body.data), 201);
    } catch (err) {
      return refused(c, err);
    }
  });

  app.get(`${base}/nodes/:id`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const node = await getNode(db, c.req.param("id"));
    if (!node) return c.json({ error: "node_unknown" }, 404);
    const versions = await versionsOf(db, node.id);
    return c.json({ node, body: versions.at(-1)?.body ?? null });
  });

  app.put(`${base}/nodes/:id`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const body = EditIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    try {
      return c.json(
        await editNode(db, now(), c.req.param("id"), body.data.body, {
          ...(body.data.title === undefined ? {} : { title: body.data.title }),
          ...(body.data.prompt === undefined
            ? {}
            : { prompt: body.data.prompt }),
        }),
      );
    } catch (err) {
      return refused(c, err);
    }
  });

  app.get(`${base}/nodes/:id/versions`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    if (!(await getNode(db, c.req.param("id"))))
      return c.json({ error: "node_unknown" }, 404);
    return c.json({ versions: await versionsOf(db, c.req.param("id")) });
  });

  app.get(`${base}/nodes/:id/versions/:v`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const found = await versionOf(
      db,
      c.req.param("id"),
      Number(c.req.param("v")),
    );
    return found ? c.json(found) : c.json({ error: "version_unknown" }, 404);
  });

  app.post(`${base}/nodes/:id/status`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const body = StatusIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    try {
      return c.json(
        await setStatus(db, now(), c.req.param("id"), body.data.status),
      );
    } catch (err) {
      return refused(c, err);
    }
  });

  app.get(`${base}/library`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const kind = z.enum(KINDS).safeParse(c.req.query("kind"));
    return c.json({
      entries: await listEntries(db, kind.success ? kind.data : undefined),
    });
  });

  app.post(`${base}/library`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const body = EntryIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    try {
      return c.json(await addEntry(db, now(), body.data), 201);
    } catch (err) {
      return refused(c, err);
    }
  });

  app.get(`${base}/library/:id`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const entry = await getEntry(db, c.req.param("id"));
    if (!entry) return c.json({ error: "entry_unknown" }, 404);
    return c.json({ entry, uses: await usesOf(db, entry.id) });
  });

  app.put(`${base}/library/:id`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const body = EntryEditIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    try {
      return c.json(await editEntry(db, now(), c.req.param("id"), body.data));
    } catch (err) {
      return refused(c, err);
    }
  });

  app.post(`${base}/library/:id/uses`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const body = UseIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    try {
      await useEntry(db, c.req.param("id"), body.data.nodeId);
      return c.json({ uses: await usesOf(db, c.req.param("id")) });
    } catch (err) {
      return refused(c, err);
    }
  });

  app.delete(`${base}/library/:id/uses/:node`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    await unuseEntry(db, c.req.param("id"), c.req.param("node"));
    return c.json({ uses: await usesOf(db, c.req.param("id")) });
  });

  // The log of each adventure beside the general log (REQ-8276): the adventures that have events,
  // and one adventure's events in order.
  app.get(`${base}/logs/adventures`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    return c.json({ adventures: await adventureEventCounts(db) });
  });

  app.get(`${base}/logs/adventures/:id`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const events = await eventsOfAdventure(db, c.req.param("id"));
    if (events.length === 0) return c.json({ error: "adventure_unknown" }, 404);
    return c.json({
      events: events.map((e) => ({
        seq: e.seq,
        ts: e.ts,
        type: e.type,
        sessionId: e.sessionId,
        payload: e.payload,
      })),
    });
  });

  // The sandbox (ADR-3350): its state, and a reset from nothing or from a copy of her game. It lives
  // in Postgres beside the profile's schema, so the routes answer 409 where the game runs on SQLite.
  const url = (): string | null =>
    db.dialect === "postgres"
      ? (process.env["MEOWTOWER_DATABASE_URL"] ?? null)
      : null;

  app.get(`${base}/sandbox`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const at = url();
    if (!at) return c.json({ error: "sandbox_unavailable" }, 409);
    return c.json(await sandboxState(at, db, now()));
  });

  app.post(`${base}/sandbox/reset`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const at = url();
    if (!at) return c.json({ error: "sandbox_unavailable" }, 409);
    const body = ResetIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    const made = await createSandbox(at, db, body.data.from);
    await made.db.close();
    return c.json(await sandboxState(at, db, now()));
  });

  app.get(`${base}/jobs`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const node = c.req.query("node");
    return c.json({ jobs: await jobsOf(db, node ? node : undefined) });
  });

  app.get(`${base}/jobs/:id`, async (c) => {
    const who = await guard(c);
    if (who instanceof Response) return who;
    const job = await getJob(db, c.req.param("id"));
    return job ? c.json(job) : c.json({ error: "job_unknown" }, 404);
  });
}
