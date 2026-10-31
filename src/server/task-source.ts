// The tasks of the registry (EPC-0480) as the game shows them. Until the Director of ADR-0070 chooses a task
// from the model of what the player knows, the registry is walked as a ladder: from the templates of group 1
// to those of group 8 over the tasks of an adventure, one template of each step drawn by the session's seed.
import { baseSeed } from "../math/rng.js";
import { templates } from "../templates/index.js";
import type { Compiled, Made } from "../templates/spec.js";

const byId = new Map(templates.map((c) => [c.id, c]));

/** The registry in the order it is walked: by the first group of a template, then by its id. */
const ladder: readonly Compiled[] = [...templates].sort(
  (a, b) => a.groups[0] - b.groups[0] || (a.id < b.id ? -1 : 1),
);

export const hexOf = (seed: Uint8Array): string =>
  Buffer.from(seed).toString("hex");
const seedOf = (hex: string): Uint8Array =>
  Uint8Array.from(Buffer.from(hex, "hex"));

/** True when the id names a template of the registry. */
export const isRegistryTemplate = (id: string | undefined): boolean =>
  id !== undefined && byId.has(id);

export interface RegistryItem {
  readonly template: Compiled;
  readonly made: Made;
  readonly seed: string;
}

/** The template and seed of the `index`-th task of an adventure, `tasks` tasks long. */
export function pick(
  sessionId: string,
  index: number,
  tasks: number,
): { template: Compiled; base: Uint8Array } {
  const step = Math.max(1, Math.floor(ladder.length / tasks));
  const bytes = baseSeed(sessionId, "ladder", index);
  const dice = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const at = Math.min(
    ladder.length - 1,
    Math.floor((index * ladder.length) / tasks) + (dice.getUint32(0) % step),
  );
  const template = ladder[at];
  if (!template) throw new RangeError("registry_empty");
  return { template, base: baseSeed(sessionId, template.id, index) };
}

/** A task rebuilt from its template id and base seed, as it was shown. */
export function rebuild(templateId: string, seed: string): RegistryItem | null {
  const template = byId.get(templateId);
  if (!template) return null;
  return { template, made: template.make(seedOf(seed)), seed };
}

/** The parallel task of a second attempt: the same template drawn at another seed, with other numbers. */
export function twinOf(
  templateId: string,
  sessionId: string,
  first: Made,
): RegistryItem | null {
  const template = byId.get(templateId);
  if (!template) return null;
  for (let k = 0; k < 20; k += 1) {
    const base = baseSeed(sessionId, `${templateId}.twin`, k);
    const made = template.make(base);
    if (made.paramsKey !== first.paramsKey)
      return { template, made, seed: hexOf(base) };
  }
  return null;
}

/** What the answer field accepts: whole numbers for a stand-in task or an integer answer, any short entry otherwise. */
export const inputKindOf = (
  templateId: string | undefined,
): "integer" | "text" => {
  const template = templateId === undefined ? undefined : byId.get(templateId);
  return template && template.answer !== "integer" ? "text" : "integer";
};

export type RegistryVerdict = "correct" | "wrong" | "unparsed" | "dont_know";

/** The check of the template's own checker; a half-right entry is not yet right. */
export function judge(
  item: RegistryItem,
  raw: string,
  dontKnow: boolean,
): RegistryVerdict {
  if (dontKnow) return "dont_know";
  const verdict = item.made.checker(raw).verdict;
  return verdict === "correct"
    ? "correct"
    : verdict === "unparsed"
      ? "unparsed"
      : "wrong";
}
