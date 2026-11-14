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

/** The fields that differ between `before` and `after`; a field that is the same is left out. */
export function diffBodies(before: unknown, after: unknown): Difference[] {
  const was = new Map<string, string>();
  const now = new Map<string, string>();
  leaves(before, "", was);
  leaves(after, "", now);
  const paths = [...new Set([...was.keys(), ...now.keys()])];
  return paths.flatMap((path): Difference[] => {
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
}
