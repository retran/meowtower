// The skill graph (SPC-0050, ADR-0050): one YAML file holds every node, its
// level, its subtypes and their weights, and its prerequisites. The loader parses
// it with the `yaml` package at its default cap of 100 aliases, checks it with one
// strict schema, and gives it a version that a comment doesn't change (REQ-0804).
// The queries are read-only and nothing else reads the file (REQ-0808).
import { createHash } from "node:crypto";
import { parse } from "yaml";
import { z } from "zod";

export class GraphInvalid extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GraphInvalid";
  }
}

const Level = z.enum(["1F", "1S", "1F/1S", "stretch"]);
const SubtypeLevel = z.enum(["1F", "1S", "stretch"]);
/** The nine domains of RES-0800, each by its letter (SPC-0050). */
const Domain = z.enum(["N", "A", "F", "D", "P", "M", "G", "S", "T"]);

/** The graph file, the only file the loader reads (ADR-0050). */
export const GRAPH_FILE = new URL("../../content/graph.yaml", import.meta.url)
  .pathname;

const Subtype = z
  .object({
    id: z.string().min(1),
    level: SubtypeLevel,
    weight: z.number().positive(),
    slo: z.array(z.string()).default([]),
    method: z.enum(["formula", "squares", "sides", "cubes"]).optional(),
  })
  .strict();

const Prereq = z
  .object({
    node: z.string().min(1),
    subtype: z.string().min(1).optional(),
  })
  .strict();

const Node = z
  .object({
    domain: Domain,
    level: Level,
    typicalGroup: z.number().int().min(1).max(8),
    ruOnly: z.boolean().default(false),
    stretchGate: z.array(z.string().min(1)).min(1).optional(),
    subtypes: z.array(Subtype),
    prereqs: z.array(Prereq).default([]),
  })
  .strict()
  .superRefine((node, ctx) => {
    const stretch = node.level === "stretch";
    if (stretch && node.stretchGate === undefined)
      ctx.addIssue({
        code: "custom",
        path: ["stretchGate"],
        message: "required on a stretch node",
      });
    if (!stretch && node.stretchGate !== undefined)
      ctx.addIssue({
        code: "custom",
        path: ["stretchGate"],
        message: "allowed only on a stretch node",
      });
  });

const SloGoal = z
  .object({
    id: z.string().min(1),
    level: Level,
    text: z.string().min(1),
  })
  .strict();

/** A deliberate change: the node and field it excuses from the fixture, and why (REQ-0806). */
const ChangeLine = z
  .object({
    node: z.string().min(1),
    field: z.enum(["domain", "level", "prereqs"]),
    reason: z.string().min(1),
  })
  .strict();

const GraphFile = z
  .object({
    nodes: z.record(z.string().min(1), Node),
    topics: z
      .array(
        z.object({ id: z.string().min(1), name: z.string().min(1) }).strict(),
      )
      .default([]),
    sloGoals: z.array(SloGoal).default([]),
    changes: z.array(ChangeLine).default([]),
  })
  .strict();

export type GraphData = z.infer<typeof GraphFile>;
export type NodeRecord = GraphData["nodes"][string];
export type SubtypeRecord = NodeRecord["subtypes"][number];

/** Keys sorted at every depth, so one graph has one serialisation (REQ-0804). */
const sortKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortKeys((value as Record<string, unknown>)[key])]),
    );
  return value;
};

/** The canonical serialisation of a parsed graph: sorted keys, no whitespace. */
export const canonicalOf = (data: unknown): string =>
  JSON.stringify(sortKeys(data));

/** `g-` and the first 12 hex digits of SHA-256 over the canonical serialisation. */
export const versionOf = (canonical: string): string =>
  `g-${createHash("sha256").update(canonical).digest("hex").slice(0, 12)}`;

/**
 * A node's id starts with its domain's letter, and its level agrees with its
 * subtypes (SPC-0050, rule 1): a 1F/1S node holds a 1F and a 1S subtype, a
 * stretch node holds only stretch subtypes, and a 1F or 1S node holds at least
 * one subtype at its own level.
 */
function checkNodes(data: GraphData): void {
  for (const [id, node] of Object.entries(data.nodes)) {
    if (!id.startsWith(node.domain))
      throw new GraphInvalid(
        `node ${id}: domain: the id must start with ${node.domain}`,
      );
    checkMethods(id, node);
    const levels = new Set(node.subtypes.map((s) => s.level));
    const ok =
      node.level === "stretch"
        ? node.subtypes.every((s) => s.level === "stretch")
        : node.level === "1F/1S"
          ? levels.has("1F") && levels.has("1S")
          : levels.has(node.level);
    if (!ok)
      throw new GraphInvalid(
        `node ${id}: level: ${node.level} disagrees with its subtypes`,
      );
  }
}

/** The methods each measurement node allows, and the 1F method of each (SPC-0050, rule 4). */
const METHODS: Readonly<
  Record<string, { allowed: readonly string[]; oneF: readonly string[] }>
> = {
  M4: { allowed: ["formula", "squares", "sides"], oneF: ["squares", "sides"] },
  M5: { allowed: ["formula", "squares", "sides"], oneF: ["squares", "sides"] },
  M7: { allowed: ["formula", "cubes"], oneF: ["cubes"] },
};

/**
 * Rule 4 (REQ-0816): M4, M5 and M7 carry a method on every subtype; a formula is
 * 1S; a 1F subtype is squares or sides on M4 and M5, and cubes on M7. No other node
 * carries a method.
 */
function checkMethods(id: string, node: NodeRecord): void {
  const spec = METHODS[id];
  for (const sub of node.subtypes) {
    if (spec === undefined) {
      if (sub.method !== undefined)
        throw new GraphInvalid(
          `node ${id}: subtype ${sub.id}: method is allowed only on M4, M5 and M7`,
        );
      continue;
    }
    if (sub.method === undefined)
      throw new GraphInvalid(
        `node ${id}: subtype ${sub.id}: method is missing`,
      );
    if (!spec.allowed.includes(sub.method))
      throw new GraphInvalid(
        `node ${id}: subtype ${sub.id}: method ${sub.method} is not allowed on ${id}`,
      );
    if (sub.method === "formula" && sub.level !== "1S")
      throw new GraphInvalid(
        `node ${id}: subtype ${sub.id}: a formula is 1S, not ${sub.level}`,
      );
    if (sub.level === "1F" && !spec.oneF.includes(sub.method))
      throw new GraphInvalid(
        `node ${id}: subtype ${sub.id}: a 1F subtype of ${id} takes ${spec.oneF.join(" or ")}, not ${sub.method}`,
      );
  }
}

/** The field values rule 3 compares, as one string per field. */
const fieldsOf = (
  node: NodeRecord,
): Record<"domain" | "level" | "prereqs", string> => ({
  domain: node.domain,
  level: node.level,
  prereqs: JSON.stringify(node.prereqs.map((p) => [p.node, p.subtype ?? null])),
});

/**
 * Rule 3 (SPC-0050, REQ-0806): each base node's domain, level and prerequisites
 * equal the fixture's, unless a changes line names that node and field. A line
 * excuses only the field it names. A difference without one is graph_drift.
 */
function checkFixture(data: GraphData, fixture: GraphData): void {
  for (const [id, expected] of Object.entries(fixture.nodes)) {
    const actual = data.nodes[id];
    if (actual === undefined) continue;
    const want = fieldsOf(expected);
    const got = fieldsOf(actual);
    for (const field of ["domain", "level", "prereqs"] as const) {
      if (want[field] === got[field]) continue;
      const excused = data.changes.some(
        (c) => c.node === id && c.field === field,
      );
      if (!excused)
        throw new GraphInvalid(
          `graph_drift: node ${id}: ${field} differs from RES-0800 and no changes line names it`,
        );
    }
  }
}

/** A prerequisite cycle, or a prerequisite on a node the file doesn't hold. */
function checkPrereqs(data: GraphData): void {
  const ids = new Set(Object.keys(data.nodes));
  for (const [id, node] of Object.entries(data.nodes))
    for (const prereq of node.prereqs)
      if (!ids.has(prereq.node))
        throw new GraphInvalid(
          `node ${id}: prerequisite ${prereq.node} is not a node`,
        );
  const state = new Map<string, "open" | "done">();
  const visit = (id: string, path: string[]): void => {
    const seen = state.get(id);
    if (seen === "done") return;
    if (seen === "open")
      throw new GraphInvalid(
        `prerequisite cycle ${[...path, id].join(" -> ")}`,
      );
    state.set(id, "open");
    for (const prereq of data.nodes[id]?.prereqs ?? [])
      visit(prereq.node, [...path, id]);
    state.set(id, "done");
  };
  for (const id of ids) visit(id, []);
}

/** A zod issue as a message that names its node and its field. */
const describe = (issue: z.core.$ZodIssue): string => {
  const [root, node, ...rest] = issue.path;
  const where =
    root === "nodes" && typeof node === "string"
      ? `node ${node}`
      : issue.path.map(String).join(".") || "file";
  const field = root === "nodes" ? rest.map(String).join(".") : "";
  const place = field ? `${where}: ${field}` : where;
  return `${place}: ${issue.message}`;
};

/** Checks a parsed value against the schema and the prerequisite graph, and against the fixture when one is given. */
export function checkGraph(value: unknown, fixture?: unknown): GraphData {
  const parsed = GraphFile.safeParse(value);
  if (!parsed.success)
    throw new GraphInvalid(parsed.error.issues.map(describe).join("; "));
  checkNodes(parsed.data);
  checkPrereqs(parsed.data);
  if (fixture !== undefined) {
    const expected = GraphFile.safeParse(fixture);
    if (!expected.success)
      throw new GraphInvalid(
        `fixture: ${expected.error.issues.map(describe).join("; ")}`,
      );
    checkFixture(parsed.data, expected.data);
  }
  return parsed.data;
}

export interface Graph {
  graphVersion(): string;
  canonical(): string;
  nodes(): {
    id: string;
    domain: string;
    level: string;
    typicalGroup: number;
    ruOnly: boolean;
  }[];
  typicalGroup(id: string): number;
  node(id: string): {
    domain: string;
    level: string;
    ruOnly: boolean;
    stretchGate: string[] | undefined;
  };
  subtypes(id: string): SubtypeRecord[];
  prereqs(id: string): { node: string; subtype: string | undefined }[];
  stretchGate(id: string): string[];
  topics(): GraphData["topics"];
  sloGoals(): GraphData["sloGoals"];
  changes(
    previous?: Graph,
  ): { node: string; field: string; reason: string; new: boolean }[];
}

/** The read-only queries over a checked graph. */
function queriesOver(data: GraphData): Graph {
  const canonical = canonicalOf(data);
  const version = versionOf(canonical);
  const nodeOf = (id: string): NodeRecord => {
    const node = data.nodes[id];
    if (node === undefined) throw new RangeError(`no_node:${id}`);
    return node;
  };
  return {
    graphVersion: () => version,
    canonical: () => canonical,
    nodes: () =>
      Object.entries(data.nodes).map(([id, n]) => ({
        id,
        domain: n.domain,
        level: n.level,
        typicalGroup: n.typicalGroup,
        ruOnly: n.ruOnly,
      })),
    typicalGroup: (id) => nodeOf(id).typicalGroup,
    node: (id) => {
      const n = nodeOf(id);
      return {
        domain: n.domain,
        level: n.level,
        ruOnly: n.ruOnly,
        stretchGate: n.stretchGate,
      };
    },
    subtypes: (id) => nodeOf(id).subtypes.map((s) => ({ ...s })),
    prereqs: (id) =>
      nodeOf(id).prereqs.map((p) => ({ node: p.node, subtype: p.subtype })),
    stretchGate: (id) => [...(nodeOf(id).stretchGate ?? [])],
    topics: () => data.topics.map((t) => ({ ...t })),
    sloGoals: () => data.sloGoals.map((g) => ({ ...g })),
    changes: (previous) => {
      const before =
        previous === undefined
          ? new Set<string>()
          : new Set(
              previous
                .changes()
                .map((c) => JSON.stringify([c.node, c.field, c.reason])),
            );
      return data.changes.map((c) => ({
        node: c.node,
        field: c.field,
        reason: c.reason,
        new: !before.has(JSON.stringify([c.node, c.field, c.reason])),
      }));
    },
  };
}

/** Loads the graph from its YAML text, refusing it with GraphInvalid if it breaks. */
export function openGraph(text: string, fixtureText?: string): Graph {
  let value: unknown;
  try {
    value = parse(text, { maxAliasCount: 100 });
  } catch (error) {
    throw new GraphInvalid(`yaml: ${(error as Error).message}`);
  }
  const fixture =
    fixtureText === undefined ? undefined : parseText(fixtureText);
  return queriesOver(checkGraph(value ?? {}, fixture));
}

function parseText(text: string): unknown {
  try {
    return parse(text, { maxAliasCount: 100 }) ?? {};
  } catch (error) {
    throw new GraphInvalid(`yaml: ${(error as Error).message}`);
  }
}

/** Reads a graph back from the canonical text stored for it. */
export function openCanonical(canonical: string): Graph {
  return queriesOver(checkGraph(JSON.parse(canonical)));
}

/** The node counts RES-0800 gives per domain, and in total (SPC-0050, rule 2). */
export const EXPECTED_DOMAINS: Readonly<
  Record<string, [total: number, stretch: number]>
> = {
  N: [8, 1],
  A: [17, 3],
  F: [8, 0],
  D: [7, 1],
  P: [7, 1],
  M: [14, 2],
  G: [7, 1],
  S: [7, 1],
  T: [4, 0],
};

/**
 * Rule 2 (SPC-0050, REQ-0800): the 79 maths nodes in nine domains with their
 * counts, 69 at 1F, 1S or 1F/1S and 10 at stretch. It runs on the whole file, not
 * on a test fixture, so it is called by `graph check` and the content tests.
 */
export function checkCounts(graph: Graph): void {
  const nodes = graph.nodes();
  const problems: string[] = [];
  for (const [domain, [total, stretch]] of Object.entries(EXPECTED_DOMAINS)) {
    const inDomain = nodes.filter((n) => n.domain === domain);
    const gotStretch = inDomain.filter((n) => n.level === "stretch").length;
    if (inDomain.length !== total || gotStretch !== stretch)
      problems.push(
        `domain ${domain} has ${inDomain.length} nodes (${gotStretch} stretch), expected ${total} (${stretch})`,
      );
  }
  const stretch = nodes.filter((n) => n.level === "stretch").length;
  if (nodes.length !== 79 || stretch !== 10 || nodes.length - stretch !== 69)
    problems.push(
      `${nodes.length} nodes (${stretch} stretch), expected 79 (10)`,
    );
  if (problems.length > 0)
    throw new GraphInvalid(`counts: ${problems.join("; ")}`);
}
