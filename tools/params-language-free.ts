// REQ-3808: a task's parameters are numbers, exact rationals (an integer
// numerator and denominator), booleans or enum identifiers, never free text,
// so the same parameters render the same task in any display language.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import type { Finding } from "./static-checks.js";

export interface TemplateSchema {
  template: string;
  schema: z.ZodType;
}

type JsonSchema = {
  type?: string | string[];
  enum?: unknown[];
  const?: unknown;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
};

function walk(node: JsonSchema, path: string, out: string[]): void {
  for (const alt of [...(node.anyOf ?? []), ...(node.oneOf ?? [])])
    walk(alt, path, out);
  const types = Array.isArray(node.type)
    ? node.type
    : node.type
      ? [node.type]
      : [];
  if (
    types.includes("string") &&
    node.enum === undefined &&
    node.const === undefined
  ) {
    out.push(path || "(root)");
  }
  for (const [key, child] of Object.entries(node.properties ?? {})) {
    walk(child, path ? `${path}.${key}` : key, out);
  }
  if (node.items) walk(node.items, `${path}[]`, out);
}

export function checkParamsLanguageFree(
  templates: TemplateSchema[],
): Finding[] {
  return templates.flatMap(({ template, schema }) => {
    const fields: string[] = [];
    walk(z.toJSONSchema(schema) as JsonSchema, "", fields);
    return fields.map((match) => ({
      check: "params_language",
      file: template,
      match,
    }));
  });
}

/** Loads every template under src/templates (ADR-0040): one file per node. */
export async function loadTemplateSchemas(
  root: string,
): Promise<TemplateSchema[]> {
  const dir = join(root, "src", "templates");
  if (!existsSync(dir)) return [];
  const found: TemplateSchema[] = [];
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort()) {
    const mod = (await import(pathToFileURL(join(dir, file)).href)) as Record<
      string,
      unknown
    >;
    for (const value of Object.values(mod)) {
      const t = value as { id?: unknown; paramsSchema?: unknown };
      if (typeof t?.id === "string" && t.paramsSchema instanceof z.ZodType) {
        found.push({ template: t.id, schema: t.paramsSchema });
      }
    }
  }
  return found;
}
