// The profile of the child and her interests (ADR-3420, REQ-8280, REQ-8282): one text the parent writes for the
// whole campaign. It holds no real name or school, which the parent lists in `MEOWTOWER_EGRESS_NAMES` for the
// egress guard, so a profile with one of those names is refused when it is saved. The gateway cleans the same
// names from every request again before it leaves.

/** The longest profile, in characters. */
export const PROFILE_MAX = 2000;

export interface ProfileFault {
  readonly code: "name" | "too_long";
  /** The name it holds, or its length. */
  readonly held: string;
}

/** The names the parent listed for the egress guard. */
export const egressNames = (): string[] =>
  (process.env["MEOWTOWER_EGRESS_NAMES"] ?? "")
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n !== "");

/** What is wrong with a profile, or null where it can be saved. */
export function profileFault(
  text: string,
  names: readonly string[],
): ProfileFault | null {
  if (text.length > PROFILE_MAX)
    return { code: "too_long", held: String(text.length) };
  const lower = text.toLowerCase();
  // A name of one character would match inside any word.
  const held = names.find(
    (n) => n.trim().length >= 2 && lower.includes(n.trim().toLowerCase()),
  );
  return held === undefined ? null : { code: "name", held };
}
