// The code's check of a body above the encounters when the parent saves it (ADR-3280, REQ-8306): the
// fields the form shows are checked, and every other field passes, so what a generator wrote, such as the
// whole scenario, is kept as it is. A text that is as stored is not refused for its length.
import type { Fault } from "./body-check.js";

export type UpperLevel = "campaign" | "arc" | "adventure";

export const LEVEL_TEXT_MAX = 4000;
export const ADVENTURE_KINDS = [
  "mythology",
  "case",
  "character",
  "filler",
] as const;

type Spec = { readonly path: readonly string[]; readonly kind?: "kind" };

const FIELDS: Readonly<Record<UpperLevel, readonly Spec[]>> = {
  campaign: [{ path: ["logline"] }, { path: ["theme"] }],
  arc: [{ path: ["logline"] }, { path: ["closingQuestion"] }],
  adventure: [
    { path: ["logline"] },
    { path: ["premise"] },
    { path: ["question"] },
    { path: ["kind"], kind: "kind" },
    { path: ["conflict", "wants"] },
    { path: ["conflict", "against"] },
    { path: ["conflict", "stakes"] },
  ],
};

const objectOf = (v: unknown): Record<string, unknown> | null =>
  typeof v === "object" && v !== null && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;

const shown = (v: unknown): string => {
  const t = typeof v === "string" ? v : (JSON.stringify(v) ?? "nothing");
  return t.length > 40 ? `${t.slice(0, 40)}...` : t;
};

const at = (root: unknown, path: readonly string[]): unknown =>
  path.reduce<unknown>((o, k) => objectOf(o)?.[k], root);

/** The first fault in a campaign, an arc or an adventure's body, or null where it can be stored. */
export function checkLevelBody(
  level: UpperLevel,
  body: unknown,
  stored?: unknown,
  around?: { readonly self: string; readonly siblings: readonly string[] },
): Fault | null {
  const b = objectOf(body);
  if (!b)
    return {
      field: "body",
      code: "not_object",
      held: shown(body),
      need: "an object",
    };
  for (const spec of FIELDS[level]) {
    const field = spec.path.join(".");
    for (let i = 1; i < spec.path.length; i += 1) {
      const parent = at(b, spec.path.slice(0, i));
      if (parent !== undefined && !objectOf(parent))
        return {
          field: spec.path.slice(0, i).join("."),
          code: "not_object",
          held: shown(parent),
          need: "an object",
        };
    }
    const value = at(b, spec.path);
    if (value === undefined) continue;
    if (typeof value !== "string")
      return { field, code: "not_text", held: shown(value), need: "text" };
    if (spec.kind === "kind") {
      if (
        value !== "" &&
        !(ADVENTURE_KINDS as readonly string[]).includes(value)
      )
        return {
          field,
          code: "unknown_kind",
          held: shown(value),
          need:
            ADVENTURE_KINDS.slice(0, -1).join(", ") +
            " or " +
            ADVENTURE_KINDS.at(-1),
        };
      continue;
    }
    if (value.length > LEVEL_TEXT_MAX && at(stored, spec.path) !== value)
      return {
        field,
        code: "too_long",
        held: String(value.length),
        need: String(LEVEL_TEXT_MAX),
      };
  }
  const links = b["links"];
  if (around && links !== undefined) {
    if (!Array.isArray(links))
      return {
        field: "links",
        code: "not_object",
        held: shown(links),
        need: "a list",
      };
    for (const [i, raw] of (links as unknown[]).entries()) {
      const target = typeof raw === "string" ? raw : objectOf(raw)?.["to"];
      const field = `links.${String(i)}`;
      if (typeof target !== "string")
        return { field, code: "not_text", held: shown(raw), need: "text" };
      if (target === around.self)
        return { field, code: "own_link", held: target, need: "another node" };
      if (!around.siblings.includes(target))
        return {
          field,
          code: "unknown_sibling",
          held: target,
          need: "a node of this level",
        };
    }
  }
  return null;
}
