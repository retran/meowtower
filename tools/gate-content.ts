// The build's pass of every fixed string and every rendered template through the text gate
// (ADR-0160, TSK-0682, REQ-3326, REQ-3308). A language file other than a shipped one is skipped
// here, and the key check of TSK-0676 reports it.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isShipped } from "../src/shared/i18n.js";
import { type Kind, type Rule, textGate } from "../src/shared/voice/gate.js";

export interface ContentFinding {
  readonly check: "forbidden_in_content";
  readonly file: string;
  readonly key: string;
  readonly rule: Rule;
  readonly match: string;
  readonly seed?: number;
}

/** The gate's kind for a key: `system.*` is a System line, `ui.*` a label, and the rest story. */
export const kindOf = (key: string): Kind =>
  key.startsWith("system.")
    ? "system"
    : key.startsWith("ui.")
      ? "label"
      : "story";

type Value =
  string | string[] | Record<string, string> | (string | { pause: string })[];

/** Every string a value holds: a plural form, a line of a System message, or the string itself. */
export function stringsOf(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value))
    return value.flatMap((line) =>
      stringsOf(
        typeof line === "object" && line && "pause" in line
          ? (line as { pause: string }).pause
          : line,
      ),
    );
  if (value && typeof value === "object")
    return Object.values(value).flatMap(stringsOf);
  return [];
}

/** Gates every value of a flat key-value file. */
export function gateStrings(
  file: string,
  values: Record<string, Value>,
): ContentFinding[] {
  const found: ContentFinding[] = [];
  for (const [key, value] of Object.entries(values))
    for (const text of stringsOf(value)) {
      const result = textGate(text, {
        lang: "ru",
        kind: kindOf(key),
        source: "fixed",
        key,
      });
      if (!result.ok)
        found.push({
          check: "forbidden_in_content",
          file,
          key,
          rule: result.rule,
          match: result.match,
        });
    }
  return found;
}

/** Gates the paragraphs of a Markdown canon file, as story text. */
export function gateCanon(file: string, markdown: string): ContentFinding[] {
  const found: ContentFinding[] = [];
  markdown.split(/\n\s*\n/).forEach((paragraph, i) => {
    const result = textGate(paragraph, {
      lang: "ru",
      kind: "story",
      source: "fixed",
    });
    if (!result.ok)
      found.push({
        check: "forbidden_in_content",
        file,
        key: `paragraph ${i + 1}`,
        rule: result.rule,
        match: result.match,
      });
  });
  return found;
}

/** A template as the gate reads it: an id and the lines it shows for a seed. */
export interface Rendered {
  readonly id: string;
  render(seed: number): string[];
}

/** Renders `seeds` seeds of every template and gates each line (REQ-3326). */
export function gateTemplates(
  templates: readonly Rendered[],
  seeds = 200,
): ContentFinding[] {
  const found: ContentFinding[] = [];
  for (const template of templates)
    for (let seed = 1; seed <= seeds; seed += 1)
      for (const text of template.render(seed)) {
        const result = textGate(text, {
          lang: "ru",
          kind: "story",
          source: "template",
        });
        if (!result.ok)
          found.push({
            check: "forbidden_in_content",
            file: template.id,
            key: template.id,
            rule: result.rule,
            match: result.match,
            seed,
          });
      }
  return found;
}

/** The content files the gate reads under `root`: shipped languages' string files and the canon. */
export function contentFiles(root: string): {
  json: string[];
  markdown: string[];
} {
  const json: string[] = [];
  const i18n = join(root, "content", "i18n");
  if (existsSync(i18n))
    for (const name of readdirSync(i18n)) {
      const code = /^([a-z]+)\.json$/.exec(name)?.[1];
      if (code && isShipped(code)) json.push(join("content", "i18n", name));
    }
  const content = join(root, "content");
  if (existsSync(content))
    for (const name of readdirSync(content))
      if (/\.ru\.json$/.test(name) && name !== "shaming.ru.json")
        json.push(join("content", name));
  const markdown = existsSync(join(content, "canon.ru.md"))
    ? [join("content", "canon.ru.md")]
    : [];
  return { json, markdown };
}

/** Everything the build gates: the content files, plus the rendered templates the caller passes. */
export function gateContent(
  root: string,
  templates: readonly Rendered[] = [],
): ContentFinding[] {
  const { json, markdown } = contentFiles(root);
  return [
    ...json.flatMap((file) =>
      gateStrings(
        file,
        JSON.parse(readFileSync(join(root, file), "utf8")) as Record<
          string,
          Value
        >,
      ),
    ),
    ...markdown.flatMap((file) =>
      gateCanon(file, readFileSync(join(root, file), "utf8")),
    ),
    ...gateTemplates(templates),
  ];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const findings = gateContent(process.cwd());
  for (const f of findings)
    console.log(
      `forbidden_in_content: ${f.file}: ${f.key}: ${f.rule} ${f.match}`,
    );
  console.log(`gate-content: ${findings.length} findings`);
  process.exit(findings.length ? 1 : 0);
}
