// The build rules a template's scored tasks must meet (ADR-0040, REQ-0700,
// REQ-0706, REQ-0708, REQ-0710). A template declares its facts, and the verify
// group reads them the way `checkParamsLanguageFree` reads parameter schemas:
// a rule that breaks is a finding, named by the template it came from.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Finding } from "./static-checks.js";

export interface TaskFacts {
  readonly template: string;
  readonly inputClass: "free" | "structured";
  readonly answer: "choice" | "comparison" | "number" | "fraction" | "other";
  readonly scored: boolean;
  /** The number of options a choice task offers. */
  readonly options?: number;
  readonly comparison?: "sign" | "largest" | "order" | "other";
  /** For an order, how many numbers it orders. */
  readonly orderSize?: number;
  readonly tier?: "warmup" | "easy" | "tutorial" | "core";
}

/** The tiers where the sign form of a comparison is allowed (REQ-0710). */
export const SIGN_TIERS: readonly string[] = ["warmup", "easy", "tutorial"];

/** Checks the template facts, returning one finding per broken rule. */
export function checkTaskRules(facts: readonly TaskFacts[]): Finding[] {
  const findings: Finding[] = [];
  const fail = (f: TaskFacts, check: string) =>
    findings.push({ check, file: f.template, match: check });
  for (const f of facts) {
    if (f.inputClass === "free" && f.answer === "choice")
      fail(f, "choice_free_input");
    if (!f.scored) continue;
    if (f.answer === "choice" && (f.options ?? 0) < 4)
      fail(f, "choice_options");
    if (f.answer === "comparison") {
      if (f.comparison === "sign") {
        if (!SIGN_TIERS.includes(f.tier ?? "")) fail(f, "comparison_sign");
      } else if (f.comparison === "largest") {
        // The largest of four numbers is allowed (REQ-0708).
      } else if (f.comparison === "order") {
        if (f.orderSize === undefined || f.orderSize < 3 || f.orderSize > 4)
          fail(f, "comparison_order");
      } else {
        fail(f, "comparison_form");
      }
    }
  }
  return findings;
}

/**
 * Loads the facts every template under src/templates declares, from its
 * `taskFacts` export. Before any real template exists the directory is empty,
 * and the check reads none.
 */
export async function loadTaskFacts(root: string): Promise<TaskFacts[]> {
  const dir = join(root, "src", "templates");
  if (!existsSync(dir)) return [];
  const found: TaskFacts[] = [];
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort()) {
    const mod = (await import(pathToFileURL(join(dir, file)).href)) as Record<
      string,
      unknown
    >;
    const facts = mod["taskFacts"];
    if (facts !== undefined) found.push(...(facts as TaskFacts[]));
  }
  return found;
}

/** A template's computation facts: the traps it lists and their explanations. */
export interface GraphFacts {
  readonly template: string;
  readonly traps: readonly string[];
  readonly explain: Readonly<Record<string, string>>;
}

/**
 * Every trap a template lists has a template explanation (REQ-1214). A trap
 * with none is a finding, named by its template and trap.
 */
export function checkExplainCoverage(facts: readonly GraphFacts[]): Finding[] {
  return facts.flatMap((f) =>
    f.traps
      .filter((trap) => f.explain[trap] === undefined)
      .map((trap) => ({
        check: "explain_missing",
        file: f.template,
        match: trap,
      })),
  );
}

/** Loads the facts every template under src/templates exports as `name`. */
export async function loadFacts<T>(root: string, name: string): Promise<T[]> {
  const dir = join(root, "src", "templates");
  if (!existsSync(dir)) return [];
  const found: T[] = [];
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort()) {
    const mod = (await import(pathToFileURL(join(dir, file)).href)) as Record<
      string,
      unknown
    >;
    const facts = mod[name];
    if (facts !== undefined) found.push(...(facts as T[]));
  }
  return found;
}
