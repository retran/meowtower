// The code's check of an encounter's body when the parent saves it (ADR-3360, REQ-8306, REQ-8600). It
// checks the shape of what is there and not that every field is filled, so an unfinished encounter
// can be kept; a fault names the field, the value it holds and what it needs, and the page words it.

export interface Fault {
  /** The field's path, such as `situation` or `exits.0.next`. */
  readonly field: string;
  readonly code:
    | "not_object"
    | "unknown_field"
    | "not_text"
    | "too_long"
    | "not_whole_number"
    | "out_of_range"
    | "unknown_encounter"
    | "own_exit"
    | "empty";
  readonly held: string;
  readonly need: string;
}

export const TEXT_MAX = 600;
export const CHECKS_MAX = 6;
const TEXTS = ["place", "situation", "goal", "pressure"] as const;
/** What the scenario writer puts in a body besides the form's fields; the form keeps them as they are. */
const SCENARIO = [
  "id",
  "act",
  "beat",
  "tension",
  "value",
  "line",
  "subtext",
  "accepts",
  "attached",
];
const KNOWN: readonly string[] = [
  ...TEXTS,
  "checks",
  "people",
  "exits",
  ...SCENARIO,
];

const shown = (value: unknown): string => {
  const text =
    typeof value === "string" ? value : (JSON.stringify(value) ?? "nothing");
  return text.length > 40 ? `${text.slice(0, 40)}...` : text;
};

const fault = (
  field: string,
  code: Fault["code"],
  held: unknown,
  need: string,
): Fault => ({ field, code, held: shown(held), need });

/** A text field: text of at most `TEXT_MAX` characters, which may be empty. */
function textFault(field: string, value: unknown): Fault | null {
  if (typeof value !== "string") return fault(field, "not_text", value, "text");
  if (value.length > TEXT_MAX)
    return {
      field,
      code: "too_long",
      held: String(value.length),
      need: String(TEXT_MAX),
    };
  return null;
}

const objectOf = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

/** The first fault in an encounter's body, or null where it can be stored. */
export function checkEncounterBody(
  body: unknown,
  around: { readonly self: string; readonly siblings: readonly string[] },
): Fault | null {
  const b = objectOf(body);
  if (!b) return fault("body", "not_object", body, "an object");
  for (const key of Object.keys(b))
    if (!KNOWN.includes(key))
      return fault(key, "unknown_field", key, "a field of the form");
  for (const field of TEXTS) {
    if (b[field] === undefined) continue;
    const found = textFault(field, b[field]);
    if (found) return found;
  }
  const checks = b["checks"];
  if (checks !== undefined) {
    if (typeof checks !== "number" || !Number.isInteger(checks))
      return fault("checks", "not_whole_number", checks, "a whole number");
    if (checks < 0 || checks > CHECKS_MAX)
      return fault(
        "checks",
        "out_of_range",
        checks,
        `0 to ${String(CHECKS_MAX)}`,
      );
  }
  const people = b["people"];
  if (people !== undefined) {
    if (!Array.isArray(people))
      return fault("people", "not_object", people, "a list");
    for (const [i, raw] of people.entries()) {
      const p = objectOf(raw) ?? {};
      const name = p["name"];
      if (typeof name !== "string" || name.trim() === "")
        return fault(`people.${String(i)}.name`, "empty", name ?? "", "text");
      const long = textFault(`people.${String(i)}.name`, name);
      if (long) return long;
      const aim =
        p["aim"] === undefined
          ? null
          : textFault(`people.${String(i)}.aim`, p["aim"]);
      if (aim) return aim;
    }
  }
  const exits = b["exits"];
  if (exits !== undefined) {
    if (!Array.isArray(exits))
      return fault("exits", "not_object", exits, "a list");
    for (const [i, raw] of exits.entries()) {
      const x = objectOf(raw) ?? {};
      const at = `exits.${String(i)}`;
      const when = x["when"];
      if (typeof when !== "string" || when.trim() === "")
        return fault(`${at}.when`, "empty", when ?? "", "text");
      const long = textFault(`${at}.when`, when);
      if (long) return long;
      const next = x["next"];
      if (next === around.self)
        return fault(`${at}.next`, "own_exit", next, "another encounter");
      if (typeof next !== "string" || !around.siblings.includes(next))
        return fault(
          `${at}.next`,
          "unknown_encounter",
          next ?? "",
          "an encounter of this adventure",
        );
    }
  }
  return null;
}
