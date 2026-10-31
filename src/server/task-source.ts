// The tasks of the registry (EPC-0480) as the game shows them. Until the Director of ADR-0070 chooses a task
// from the model of what the player knows, the registry is walked as a ladder: from the templates of group 1
// to those of group 8 over the tasks of an adventure, one template of each step drawn by the session's seed.
import { baseSeed } from "../math/rng.js";
import { templates } from "../templates/index.js";
import type { InputSpec } from "../shared/api.js";
import type { Compiled, Lang, Made } from "../templates/spec.js";

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
export function rebuild(
  templateId: string,
  seed: string,
  lang: Lang = "ru",
  frame?: string,
): RegistryItem | null {
  const template = byId.get(templateId);
  if (!template) return null;
  return { template, made: template.make(seedOf(seed), lang, frame), seed };
}

/** The parallel task of a second attempt: the same template drawn at another seed, with other numbers. */
export function twinOf(
  templateId: string,
  sessionId: string,
  first: Made,
  lang: Lang = "ru",
): RegistryItem | null {
  const template = byId.get(templateId);
  if (!template) return null;
  for (let k = 0; k < 20; k += 1) {
    const base = baseSeed(sessionId, `${templateId}.twin`, k);
    const made = template.make(base, lang);
    if (made.paramsKey !== first.paramsKey)
      return { template, made, seed: hexOf(base) };
  }
  return null;
}

/** How a task is put before the player: its text, its options and the input they answer through. */
export interface Presented {
  readonly text: string;
  readonly options: string[] | null;
  readonly input: InputSpec;
  /** The correct answer as the player reads it. */
  readonly answer: string;
}

const NUMBERS = (n: number): string[] =>
  Array.from({ length: n }, (_, i) => String(i + 1));

/** Splits `Question? 1) a; 2) b. Closing sentence.` into the question and the options. */
function numberedList(text: string): { text: string; labels: string[] } | null {
  const m = /^(.*?)\s1\) (.*)\.\s[^.]*\.$/su.exec(text);
  if (!m) return null;
  return { text: m[1] ?? "", labels: (m[2] ?? "").split(/; \d+\) /) };
}

const FORMATS = [
  "decimal",
  "fraction",
  "mixed",
  "pair",
  "time",
  "line",
] as const;
const formatOf = (kind: string): InputSpec["format"] =>
  FORMATS.find((f) => f === kind);

/** A task as shown with a frame: the buttons come from the template's own text, the words from the frame. */
export function presentFramed(
  template: Compiled,
  seed: Uint8Array,
  lang: Lang,
  frame: string,
): Presented {
  return {
    ...present({ template, made: template.make(seed, lang) }),
    text: template.make(seed, lang, frame).text,
  };
}

/** The buttons of a compare, choice, set or order task, or the field of any other. */
export function present({
  template,
  made,
}: Pick<RegistryItem, "template" | "made">): Presented {
  const kind = template.answer;
  if (kind === "compare")
    return {
      text: made.text,
      options: ["<", "=", ">"],
      input: { kind: "choice", values: ["<", "=", ">"] },
      answer: made.entry,
    };
  if (kind === "choice" || kind === "set") {
    const values = [...(made.options ?? [])];
    const listed = numberedList(made.text);
    const inline = /([^\s;]+(?:; [^\s;]+)+)/u.exec(made.text)?.[1]?.split("; ");
    const labels =
      listed?.labels.length === values.length
        ? listed.labels
        : values.every((v) => /^\d+$/.test(v)) &&
            inline?.length === values.length
          ? inline
          : values;
    const name = (entry: string): string =>
      labels[values.indexOf(entry.trim())] ?? entry;
    return {
      text: listed?.labels.length === values.length ? listed.text : made.text,
      options: labels,
      input: { kind, values },
      answer: made.entry.split(",").map(name).join("; "),
    };
  }
  if (kind === "order") {
    const m = /^(.*): (.*)\.$/su.exec(made.text);
    const labels = (m?.[2] ?? "").split("; ");
    const values = NUMBERS(labels.length);
    return {
      text: `${m?.[1] ?? made.text}.`,
      options: labels,
      input: { kind, values },
      answer: made.entry
        .split(",")
        .map((v) => labels[Number(v) - 1] ?? v)
        .join("; "),
    };
  }
  const format = formatOf(kind);
  return {
    text: made.text,
    options: null,
    input: {
      kind: kind === "integer" ? "integer" : "text",
      ...(format ? { format } : {}),
    },
    answer: made.entry,
  };
}

/** The input of a task shown: a stand-in task takes a whole number. */
export function inputOf(
  templateId: string | undefined,
  seed: string,
  lang: Lang = "ru",
): InputSpec {
  const item = templateId ? rebuild(templateId, seed, lang) : null;
  return item ? present(item).input : { kind: "integer" };
}

const plain = (entry: string): string =>
  entry.replace(/\s/g, "").replace(".", ",");

/** The trap an entry falls into, by the wrong answer it wrote. */
export function trapOf(item: RegistryItem, raw: string): string | null {
  return item.made.traps.find((t) => plain(t.entry) === plain(raw))?.id ?? null;
}

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
