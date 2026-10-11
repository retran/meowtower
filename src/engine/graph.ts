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

const GraphFile = z
  .object({
    nodes: z.record(z.string().min(1), Node),
    topics: z
      .array(
        z.object({ id: z.string().min(1), name: z.string().min(1) }).strict(),
      )
      .default([]),
    sloGoals: z.array(SloGoal).default([]),
    changes: z.array(z.string()).default([]),
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

/** Checks a parsed value against the schema and the prerequisite graph. */
export function checkGraph(value: unknown): GraphData {
  const parsed = GraphFile.safeParse(value);
  if (!parsed.success)
    throw new GraphInvalid(parsed.error.issues.map(describe).join("; "));
  checkNodes(parsed.data);
  checkPrereqs(parsed.data);
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
  changes(): string[];
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
    changes: () => [...data.changes],
  };
}

/** Loads the graph from its YAML text, refusing it with GraphInvalid if it breaks. */
export function openGraph(text: string): Graph {
  let value: unknown;
  try {
    value = parse(text, { maxAliasCount: 100 });
  } catch (error) {
    throw new GraphInvalid(`yaml: ${(error as Error).message}`);
  }
  return queriesOver(checkGraph(value ?? {}));
}

/** Reads a graph back from the canonical text stored for it. */
export function openCanonical(canonical: string): Graph {
  return queriesOver(checkGraph(JSON.parse(canonical)));
}
