// The studio's storage (ADR-3280, REQ-8264, REQ-8274, REQ-8278, REQ-8316, REQ-8318): story nodes
// with versions that an edit adds and never changes, the statuses a node moves through, libraries
// with the nodes each entry is used in, and the background jobs with their progress.
import { randomUUID } from "node:crypto";
import type { Db } from "../db/index.js";

export const LEVELS = ["campaign", "arc", "adventure", "encounter"] as const;
export type Level = (typeof LEVELS)[number];
export const STATUSES = ["draft", "approved", "playing", "played"] as const;
export type Status = (typeof STATUSES)[number];
export const KINDS = [
  "character",
  "place",
  "faction",
  "item",
  "fact",
  "event",
  "summary",
] as const;
export type Kind = (typeof KINDS)[number];

/** The level a node of each level sits in; a campaign sits in none. */
const PARENT_LEVEL: Readonly<Record<Level, Level | null>> = {
  campaign: null,
  arc: "campaign",
  adventure: "arc",
  encounter: "adventure",
};

/** Which status may follow which: a draft is approved, an approved one plays, a played one stays. */
const NEXT: Readonly<Record<Status, readonly Status[]>> = {
  draft: ["approved"],
  approved: ["draft", "playing"],
  playing: ["played"],
  played: [],
};

export class StudioRefused extends Error {
  constructor(readonly reason: string) {
    super(`studio_refused: ${reason}`);
    this.name = "StudioRefused";
  }
}

export interface StoryNode {
  readonly id: string;
  readonly level: Level;
  readonly parentId: string | null;
  readonly title: string;
  readonly status: Status;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface StoryVersion {
  readonly version: number;
  readonly body: unknown;
  readonly prompt: string | null;
  readonly author: "parent" | "generator";
  readonly createdAt: string;
}

interface NodeRow {
  id: string;
  level: Level;
  parent_id: string | null;
  title: string;
  status: Status;
  current_version: number;
  created_at: string;
  updated_at: string;
}

const nodeOfRow = (r: NodeRow): StoryNode => ({
  id: r.id,
  level: r.level,
  parentId: r.parent_id,
  title: r.title,
  status: r.status,
  version: Number(r.current_version),
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const stamp = (now: number): string => new Date(now).toISOString();

export async function getNode(db: Db, id: string): Promise<StoryNode | null> {
  const row = (await db
    .prepare("SELECT * FROM story_nodes WHERE id = ?")
    .get(id)) as NodeRow | undefined;
  return row ? nodeOfRow(row) : null;
}

/** The nodes inside one node, or the campaigns where `parentId` is null, oldest first. */
export async function childrenOf(
  db: Db,
  parentId: string | null,
): Promise<StoryNode[]> {
  const rows = (await (parentId === null
    ? db
        .prepare(
          "SELECT * FROM story_nodes WHERE parent_id IS NULL ORDER BY created_at, id",
        )
        .all()
    : db
        .prepare(
          "SELECT * FROM story_nodes WHERE parent_id = ? ORDER BY created_at, id",
        )
        .all(parentId))) as NodeRow[];
  return rows.map(nodeOfRow);
}

/** Makes a node with its first version. The parent must be of the level above. */
export async function createNode(
  db: Db,
  now: number,
  input: {
    level: Level;
    parentId: string | null;
    title: string;
    body: unknown;
    author?: "parent" | "generator";
    prompt?: string | null;
  },
): Promise<StoryNode> {
  const title = input.title.trim();
  if (title === "" || title.length > 120)
    throw new StudioRefused("the title is 1 to 120 characters");
  const above = PARENT_LEVEL[input.level];
  if (above === null && input.parentId !== null)
    throw new StudioRefused("a campaign sits in no node");
  if (above !== null) {
    const parent = input.parentId ? await getNode(db, input.parentId) : null;
    if (parent?.level !== above)
      throw new StudioRefused(`a ${input.level} sits in a ${above}`);
  }
  const id = randomUUID();
  const at = stamp(now);
  await db.transaction(async () => {
    await db
      .prepare(
        "INSERT INTO story_nodes (id, level, parent_id, title, status, current_version, created_at, updated_at) VALUES (?, ?, ?, ?, 'draft', 1, ?, ?)",
      )
      .run(id, input.level, input.parentId, title, at, at);
    await db
      .prepare(
        "INSERT INTO story_versions (node_id, version, body, prompt, author, created_at) VALUES (?, 1, ?, ?, ?, ?)",
      )
      .run(
        id,
        JSON.stringify(input.body),
        input.prompt ?? null,
        input.author ?? "parent",
        at,
      );
  })();
  return (await getNode(db, id)) as StoryNode;
}

/**
 * An edit: a new version beside the old ones, which stay readable (REQ-8264). A node that was
 * approved goes back to draft, because the approval was of the text before this one.
 */
export async function editNode(
  db: Db,
  now: number,
  id: string,
  body: unknown,
  options: {
    prompt?: string | null;
    author?: "parent" | "generator";
    title?: string;
  } = {},
): Promise<StoryNode> {
  const node = await getNode(db, id);
  if (!node) throw new StudioRefused("no such node");
  if (node.status === "playing" || node.status === "played")
    throw new StudioRefused(`a ${node.status} node is not edited`);
  const title = (options.title ?? node.title).trim();
  if (title === "" || title.length > 120)
    throw new StudioRefused("the title is 1 to 120 characters");
  const at = stamp(now);
  const version = node.version + 1;
  await db.transaction(async () => {
    await db
      .prepare(
        "INSERT INTO story_versions (node_id, version, body, prompt, author, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .run(
        id,
        version,
        JSON.stringify(body),
        options.prompt ?? null,
        options.author ?? "parent",
        at,
      );
    await db
      .prepare(
        "UPDATE story_nodes SET current_version = ?, title = ?, status = 'draft', updated_at = ? WHERE id = ?",
      )
      .run(version, title, at, id);
  })();
  return (await getNode(db, id)) as StoryNode;
}

export async function versionsOf(db: Db, id: string): Promise<StoryVersion[]> {
  const rows = (await db
    .prepare(
      "SELECT version, body, prompt, author, created_at FROM story_versions WHERE node_id = ? ORDER BY version",
    )
    .all(id)) as {
    version: number;
    body: string;
    prompt: string | null;
    author: "parent" | "generator";
    created_at: string;
  }[];
  return rows.map((r) => ({
    version: Number(r.version),
    body: JSON.parse(r.body) as unknown,
    prompt: r.prompt,
    author: r.author,
    createdAt: r.created_at,
  }));
}

/**
 * The ids a node's current body leads to: a `links` array of ids or of `{ to }` objects, which is
 * how the graph of a level draws its edges (ADR-3280). A body with none leads nowhere.
 */
export async function linksOf(db: Db, id: string): Promise<string[]> {
  const row = (await db
    .prepare(
      `SELECT v.body AS body FROM story_nodes n
         JOIN story_versions v ON v.node_id = n.id AND v.version = n.current_version
        WHERE n.id = ?`,
    )
    .get(id)) as { body: string } | undefined;
  if (!row) return [];
  const body = JSON.parse(row.body) as { links?: unknown } | null;
  if (!Array.isArray(body?.links)) return [];
  return (body.links as unknown[]).flatMap((l) =>
    typeof l === "string"
      ? [l]
      : typeof (l as { to?: unknown } | null)?.to === "string"
        ? [(l as { to: string }).to]
        : [],
  );
}

export async function versionOf(
  db: Db,
  id: string,
  version: number,
): Promise<StoryVersion | null> {
  return (await versionsOf(db, id)).find((v) => v.version === version) ?? null;
}

/** Moves a node to the status that may follow its own (REQ-8274). */
export async function setStatus(
  db: Db,
  now: number,
  id: string,
  next: Status,
): Promise<StoryNode> {
  const node = await getNode(db, id);
  if (!node) throw new StudioRefused("no such node");
  if (!NEXT[node.status].includes(next))
    throw new StudioRefused(`a ${node.status} node does not become ${next}`);
  if (node.level === "encounter")
    throw new StudioRefused("an encounter has no status of its own");
  await db
    .prepare("UPDATE story_nodes SET status = ?, updated_at = ? WHERE id = ?")
    .run(next, stamp(now), id);
  return (await getNode(db, id)) as StoryNode;
}

/* ---------------------------------- libraries ---------------------------------- */

export interface LibraryEntry {
  readonly id: string;
  readonly kind: Kind;
  readonly name: string;
  readonly body: string;
  readonly version: number;
}

interface EntryRow {
  id: string;
  kind: Kind;
  name: string;
  body: string;
  version: number;
}

const entryOfRow = (r: EntryRow): LibraryEntry => ({
  id: r.id,
  kind: r.kind,
  name: r.name,
  body: r.body,
  version: Number(r.version),
});

export async function addEntry(
  db: Db,
  now: number,
  input: { kind: Kind; name: string; body: string },
): Promise<LibraryEntry> {
  const name = input.name.trim();
  if (name === "" || name.length > 120)
    throw new StudioRefused("the name is 1 to 120 characters");
  const id = randomUUID();
  const at = stamp(now);
  await db.transaction(async () => {
    await db
      .prepare(
        "INSERT INTO library_entries (id, kind, name, body, version, created_at, updated_at) VALUES (?, ?, ?, ?, 1, ?, ?)",
      )
      .run(id, input.kind, name, input.body, at, at);
    await db
      .prepare(
        "INSERT INTO library_versions (entry_id, version, name, body, created_at) VALUES (?, 1, ?, ?, ?)",
      )
      .run(id, name, input.body, at);
  })();
  return (await getEntry(db, id)) as LibraryEntry;
}

export async function getEntry(
  db: Db,
  id: string,
): Promise<LibraryEntry | null> {
  const row = (await db
    .prepare(
      "SELECT id, kind, name, body, version FROM library_entries WHERE id = ?",
    )
    .get(id)) as EntryRow | undefined;
  return row ? entryOfRow(row) : null;
}

export async function listEntries(
  db: Db,
  kind?: Kind,
): Promise<LibraryEntry[]> {
  const rows = (await (kind
    ? db
        .prepare(
          "SELECT id, kind, name, body, version FROM library_entries WHERE kind = ? ORDER BY name, id",
        )
        .all(kind)
    : db
        .prepare(
          "SELECT id, kind, name, body, version FROM library_entries ORDER BY kind, name, id",
        )
        .all())) as EntryRow[];
  return rows.map(entryOfRow);
}

/** An edit of an entry adds a version, as an edit of a node does; every story agent reads the new one. */
export async function editEntry(
  db: Db,
  now: number,
  id: string,
  input: { name: string; body: string },
): Promise<LibraryEntry> {
  const entry = await getEntry(db, id);
  if (!entry) throw new StudioRefused("no such entry");
  const name = input.name.trim();
  if (name === "" || name.length > 120)
    throw new StudioRefused("the name is 1 to 120 characters");
  const at = stamp(now);
  const version = entry.version + 1;
  await db.transaction(async () => {
    await db
      .prepare(
        "INSERT INTO library_versions (entry_id, version, name, body, created_at) VALUES (?, ?, ?, ?, ?)",
      )
      .run(id, version, name, input.body, at);
    await db
      .prepare(
        "UPDATE library_entries SET name = ?, body = ?, version = ?, updated_at = ? WHERE id = ?",
      )
      .run(name, input.body, version, at, id);
  })();
  return (await getEntry(db, id)) as LibraryEntry;
}

export async function useEntry(
  db: Db,
  entryId: string,
  nodeId: string,
): Promise<void> {
  if (!(await getEntry(db, entryId))) throw new StudioRefused("no such entry");
  if (!(await getNode(db, nodeId))) throw new StudioRefused("no such node");
  await db
    .prepare(
      "INSERT INTO library_uses (entry_id, node_id) VALUES (?, ?) ON CONFLICT DO NOTHING",
    )
    .run(entryId, nodeId);
}

export async function unuseEntry(
  db: Db,
  entryId: string,
  nodeId: string,
): Promise<void> {
  await db
    .prepare("DELETE FROM library_uses WHERE entry_id = ? AND node_id = ?")
    .run(entryId, nodeId);
}

/** Where an entry is used (REQ-8316): the nodes it is attached to, with their level and title. */
export async function usesOf(
  db: Db,
  entryId: string,
): Promise<{ nodeId: string; level: Level; title: string }[]> {
  const rows = (await db
    .prepare(
      `SELECT n.id AS id, n.level AS level, n.title AS title
         FROM library_uses u JOIN story_nodes n ON n.id = u.node_id
        WHERE u.entry_id = ? ORDER BY n.created_at, n.id`,
    )
    .all(entryId)) as { id: string; level: Level; title: string }[];
  return rows.map((r) => ({ nodeId: r.id, level: r.level, title: r.title }));
}

/* ------------------------------------ jobs ------------------------------------- */

export type JobState = "queued" | "running" | "done" | "failed";

export interface Job {
  readonly id: string;
  readonly kind: string;
  readonly nodeId: string | null;
  readonly state: JobState;
  readonly progress: number;
  readonly message: string;
}

interface JobRow {
  id: string;
  kind: string;
  node_id: string | null;
  state: JobState;
  progress: number;
  message: string;
}

const jobOfRow = (r: JobRow): Job => ({
  id: r.id,
  kind: r.kind,
  nodeId: r.node_id,
  state: r.state,
  progress: Number(r.progress),
  message: r.message,
});

/** Queues a background job for a node, to be run and reported by the code that starts it (REQ-8318). */
export async function startJob(
  db: Db,
  now: number,
  kind: string,
  nodeId: string | null,
): Promise<Job> {
  const id = randomUUID();
  const at = stamp(now);
  await db
    .prepare(
      "INSERT INTO studio_jobs (id, kind, node_id, state, progress, message, created_at, updated_at) VALUES (?, ?, ?, 'queued', 0, '', ?, ?)",
    )
    .run(id, kind, nodeId, at, at);
  return (await getJob(db, id)) as Job;
}

export async function getJob(db: Db, id: string): Promise<Job | null> {
  const row = (await db
    .prepare(
      "SELECT id, kind, node_id, state, progress, message FROM studio_jobs WHERE id = ?",
    )
    .get(id)) as JobRow | undefined;
  return row ? jobOfRow(row) : null;
}

/** Reports a job's progress; a job that is done or failed no longer changes. */
export async function reportJob(
  db: Db,
  now: number,
  id: string,
  update: { state?: JobState; progress?: number; message?: string },
): Promise<Job> {
  const job = await getJob(db, id);
  if (!job) throw new StudioRefused("no such job");
  if (job.state === "done" || job.state === "failed")
    throw new StudioRefused(`a ${job.state} job does not change`);
  const progress = Math.max(
    0,
    Math.min(100, Math.round(update.progress ?? job.progress)),
  );
  await db
    .prepare(
      "UPDATE studio_jobs SET state = ?, progress = ?, message = ?, updated_at = ? WHERE id = ?",
    )
    .run(
      update.state ?? (job.state === "queued" ? "running" : job.state),
      update.state === "done" ? 100 : progress,
      update.message ?? job.message,
      stamp(now),
      id,
    );
  return (await getJob(db, id)) as Job;
}

export async function jobsOf(db: Db, nodeId?: string): Promise<Job[]> {
  const rows = (await (nodeId
    ? db
        .prepare(
          "SELECT id, kind, node_id, state, progress, message FROM studio_jobs WHERE node_id = ? ORDER BY created_at, id",
        )
        .all(nodeId)
    : db
        .prepare(
          "SELECT id, kind, node_id, state, progress, message FROM studio_jobs ORDER BY created_at, id",
        )
        .all())) as JobRow[];
  return rows.map(jobOfRow);
}
