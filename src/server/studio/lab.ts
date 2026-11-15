// The prompt lab (ADR-3280, REQ-8302): the version of each prompt, a change tried in the sandbox for one run,
// and a run of a frame that reports its story, the judge's score and what it cost, so two runs can be compared.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { z } from "zod";
import type { Db } from "../db/index.js";
import {
  codeFault,
  judged,
  SOFT_FAULTS,
  type FrameFault,
} from "../frames/check.js";
import {
  FRAME_SCHEMA,
  frameSystem,
  frameUser,
  NO_SLOTS,
  promptOf,
  runWithPromptPatch,
  situationOf,
} from "../frames/request.js";
import type { Gateway } from "../gateway/gateway.js";
import { present } from "../task-source.js";
import type { Compiled, Lang } from "../../templates/spec.js";

const LANGS: readonly Lang[] = ["ru", "en", "nl"];

export interface PromptInfo {
  readonly id: string;
  readonly file: string;
  /** The first 12 hex digits of the hash of the file's text: the same text is the same version. */
  readonly version: string;
  /** The fields of the prompt that are text, which a run can try with a change. */
  readonly fields: readonly string[];
}

const FILES: readonly { id: string; file: string }[] = LANGS.flatMap((l) => [
  { id: `frames.${l}`, file: `content/frames/prompt.${l}.json` },
  { id: `scenario.${l}`, file: `content/story/scenario.${l}.json` },
]);

const read = (file: string): string =>
  readFileSync(new URL(`../../../${file}`, import.meta.url), "utf8");

const versionOf = (text: string): string =>
  createHash("sha256").update(text).digest("hex").slice(0, 12);

const textFields = (text: string): string[] =>
  Object.entries(JSON.parse(text) as Record<string, unknown>)
    .filter(([, v]) => typeof v === "string")
    .map(([k]) => k);

/** Each prompt with its version. */
export function promptVersions(): PromptInfo[] {
  return FILES.map(({ id, file }) => {
    const text = read(file);
    return { id, file, version: versionOf(text), fields: textFields(text) };
  });
}

/** The text of each text field of one prompt, or null where there is no such prompt. */
export function promptTexts(
  id: string,
): { id: string; version: string; texts: Record<string, string> } | null {
  const entry = FILES.find((f) => f.id === id);
  if (!entry) return null;
  const text = read(entry.file);
  const parsed = JSON.parse(text) as Record<string, unknown>;
  return {
    id,
    version: versionOf(text),
    texts: Object.fromEntries(
      Object.entries(parsed).filter(
        (e): e is [string, string] => typeof e[1] === "string",
      ),
    ),
  };
}

export interface FramePatch {
  readonly field: string;
  readonly text: string;
}

/** Runs `fn` with one text of a language's frame prompt changed; a field that holds no text is refused. */
export function withPromptPatch<T>(
  lang: Lang,
  patch: FramePatch,
  fn: () => T,
): T {
  const fields = textFields(read(`content/frames/prompt.${lang}.json`));
  if (!fields.includes(patch.field))
    throw new Error(`no text field "${patch.field}" in the frame prompt`);
  return runWithPromptPatch({ lang, ...patch }, fn);
}

export interface FrameRunInput {
  readonly template: Compiled;
  readonly base: Uint8Array;
  readonly lang: Lang;
  readonly action?: { readonly tried: string; readonly hard: string };
  readonly patch?: FramePatch;
}

export interface FrameRun {
  readonly story: string | null;
  /** The judge's score, or null where the story was refused before it or the judge failed. */
  readonly score: number | null;
  readonly fault: FrameFault | "author" | "judge" | null;
  readonly costUsd: number;
  /** The version of the frame prompt file, whether or not a change was tried on it. */
  readonly version: string;
  readonly patched: boolean;
}

const Reply = z.object({ story: z.string() });
const LEVEL = 2;

/**
 * One run of a frame for a task: the author writes a story, code checks it and the judge scores it, with the
 * change in the prompt where one is given. The cost is what the run added to the log of `db`.
 */
export async function runFrame(
  gateway: Gateway,
  db: Db,
  input: FrameRunInput,
): Promise<FrameRun> {
  const { template, base, lang, action, patch } = input;
  const mark = (await db
    .prepare("SELECT COALESCE(MAX(id), 0) AS m FROM llm_log")
    .get()) as { m: number };
  const body = async (): Promise<
    Omit<FrameRun, "costUsd" | "version" | "patched">
  > => {
    const plain = template.make(base, lang);
    const filled = template.make(base, lang, template.blank(lang)).text;
    const answers = present({ template, made: plain }).options ?? [];
    const reply = await gateway.call({
      role: "TASK_TEXT_MODEL",
      bucket: "lab",
      system: frameSystem(lang, LEVEL),
      user: frameUser({
        task: filled,
        roles: template.roles,
        lang,
        slots: action
          ? { ...NO_SLOTS, situation: situationOf(lang, action) }
          : NO_SLOTS,
        answers,
        kind: template.answer,
        picture: plain.svg,
        told: [],
      }),
      schema: FRAME_SCHEMA,
    });
    if (!reply.ok) return { story: null, score: null, fault: "author" };
    let story: string;
    try {
      story = Reply.parse(JSON.parse(reply.text)).story;
    } catch {
      return { story: null, score: null, fault: "author" };
    }
    const fault = codeFault(story, filled, lang);
    if (fault && !SOFT_FAULTS.includes(fault))
      return { story, score: null, fault };
    const verdict = await judged(
      gateway,
      "lab",
      [{ text: story, soft: fault !== null }],
      { template, made: plain },
      answers,
      lang,
      LEVEL,
      action,
    );
    if (!verdict) return { story, score: null, fault: "judge" };
    return { story, score: verdict.score, fault };
  };
  const run = patch ? await withPromptPatch(lang, patch, body) : await body();
  const spent = (await db
    .prepare(
      "SELECT COALESCE(SUM(cost_usd), 0) AS usd FROM llm_log WHERE id > ?",
    )
    .get(Number(mark.m))) as { usd: number };
  return {
    ...run,
    costUsd: Number(spent.usd),
    version:
      promptVersions().find((p) => p.id === `frames.${lang}`)?.version ?? "",
    patched: patch !== undefined,
  };
}

export { promptOf };
