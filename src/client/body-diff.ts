// The difference between two bodies of a node, field by field (ADR-3360, REQ-8308): what a waiting
// version changes against the current one, with the path of each field that differs.

export type Change = "added" | "removed" | "changed";

export interface Difference {
  /** The field's path, such as `goal` or `exits.0.when`. */
  readonly path: string;
  readonly before: string | null;
  readonly after: string | null;
  readonly change: Change;
}

/** Every leaf of a body with the path that leads to it, in the order the body holds them. */
function leaves(value: unknown, path: string, into: Map<string, string>): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      leaves(item, path === "" ? String(i) : `${path}.${String(i)}`, into);
    });
    return;
  }
  if (typeof value === "object" && value !== null) {
    for (const [key, item] of Object.entries(value))
      leaves(item, path === "" ? key : `${path}.${key}`, into);
    return;
  }
  if (path !== "")
    into.set(path, typeof value === "string" ? value : String(value));
}

export interface DiffOptions {
  /** Top-level fields shown as one row where they differ, with a summary of each side. */
  readonly collapse?: readonly string[];
  /** Top-level fields left out of the comparison. */
  readonly skip?: readonly string[];
}

const objectOf = (v: unknown): Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};

/** A short account of a field that is too large to list: its encounters, or its size. */
function summary(value: unknown): string | null {
  if (value === undefined) return null;
  const encounters = objectOf(value)["encounters"];
  return Array.isArray(encounters)
    ? `${String(encounters.length)} encounters`
    : `${String(JSON.stringify(value)?.length ?? 0)} characters`;
}

/** The fields that differ between `before` and `after`; a field that is the same is left out. */
export function diffBodies(
  before: unknown,
  after: unknown,
  options: DiffOptions = {},
): Difference[] {
  const collapse = new Set(options.collapse ?? []);
  const skip = new Set(options.skip ?? []);
  const outer = (body: unknown): Record<string, unknown> =>
    Object.fromEntries(
      Object.entries(objectOf(body)).filter(
        ([k]) => !collapse.has(k) && !skip.has(k),
      ),
    );
  const was = new Map<string, string>();
  const now = new Map<string, string>();
  leaves(Array.isArray(before) ? before : outer(before), "", was);
  leaves(Array.isArray(after) ? after : outer(after), "", now);
  const paths = [...new Set([...was.keys(), ...now.keys()])];
  const rows = paths.flatMap((path): Difference[] => {
    const b = was.get(path) ?? null;
    const a = now.get(path) ?? null;
    if (b === a) return [];
    return [
      {
        path,
        before: b,
        after: a,
        change: b === null ? "added" : a === null ? "removed" : "changed",
      },
    ];
  });
  const big = [...collapse].flatMap((key): Difference[] => {
    const b = objectOf(before)[key];
    const a = objectOf(after)[key];
    if (JSON.stringify(b) === JSON.stringify(a)) return [];
    return [
      {
        path: key,
        before: summary(b),
        after: summary(a),
        change:
          b === undefined ? "added" : a === undefined ? "removed" : "changed",
      },
    ];
  });
  return [...rows, ...big];
}
