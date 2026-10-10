// Static checks of ADR-0190's verify group 1, run by the lint verb.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECTIONS } from "../src/engine/projections/registry.js";

export interface Finding {
  check: string;
  file: string;
  match: string;
}

const SKIP = new Set([
  "node_modules",
  "dist",
  ".git",
  "data",
  "design",
  "personal",
  "project",
  "canon",
  "fixtures",
]);

function files(root: string, dir = root): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(root, path) : [path];
  });
}

function scan(
  check: string,
  paths: string[],
  root: string,
  pattern: RegExp,
): Finding[] {
  return paths.flatMap((path) => {
    const hit = pattern.exec(readFileSync(path, "utf8"));
    return hit ? [{ check, file: relative(root, path), match: hit[0] }] : [];
  });
}

/** REQ-2504: no model-service key in anything a client receives. */
export function checkNoKeyInClient(root: string): Finding[] {
  const clientDirs = ["dist/client", "src/client", "content"].map((d) =>
    join(root, d),
  );
  const paths = clientDirs.flatMap((d) => (existsSync(d) ? files(d) : []));
  return scan("key_in_client", paths, root, /sk-or-[A-Za-z0-9-]*/);
}

/**
 * REQ-6506: a device keeps only the unsent entries of its event queue, so the
 * client opens IndexedDB only in the queue's module, uses the Cache API only
 * in the service worker, and writes no localStorage, sessionStorage, cookie or
 * origin-private file system. Comments are left out of the search.
 */
export function checkClientStorage(root: string): Finding[] {
  const dir = join(root, "src", "client");
  const queue = join(dir, "event-queue.ts");
  const worker = join(dir, "sw.ts");
  const paths = (existsSync(dir) ? files(dir) : []).filter((p) =>
    p.endsWith(".ts"),
  );
  const banned: { pattern: RegExp; only?: string }[] = [
    { pattern: /\bindexedDB\b/, only: queue },
    { pattern: /\bcaches\b/, only: worker },
    { pattern: /\b(?:localStorage|sessionStorage)\.setItem\(/ },
    { pattern: /\b(?:localStorage|sessionStorage)\.removeItem\(/ },
    {
      pattern: /\b(?:localStorage|sessionStorage)(?:\[[^\]]*\]|\.\w+)\s*=(?!=)/,
    },
    { pattern: /\bdocument\.cookie\s*=(?!=)/ },
    { pattern: /\bgetDirectory\s*\(/ },
  ];
  return paths.flatMap((path) => {
    const code = readFileSync(path, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1");
    return banned.flatMap(({ pattern, only }) => {
      if (only === path) return [];
      const hit = pattern.exec(code);
      return hit
        ? [
            {
              check: "client_storage",
              file: relative(root, path),
              match: hit[0],
            },
          ]
        : [];
    });
  });
}

/** REQ-2544, REQ-2546: the MVP holds no push code at all. */
export function checkNoPush(root: string): Finding[] {
  const self = join(root, "tools", "static-checks.ts");
  const tests = join(root, "tests");
  const paths = files(root).filter((p) => p !== self && !p.startsWith(tests));
  return scan(
    "push_code",
    paths,
    root,
    /push_subscriptions|vapid|web-push|push\.apple\.com|pushManager|PushSubscription/i,
  );
}

/**
 * REQ-2226: SQL naming the log lives only in appendEvents' module and in the
 * migrations, so no other code can write around it. Tests are exempt, because
 * the guard's own test must try the forbidden statements.
 */
export function checkEventsSqlConfined(root: string): Finding[] {
  const allowed = ["src/engine/events", "migrations", "tests"].map((d) =>
    join(root, d),
  );
  const self = join(root, "tools", "static-checks.ts");
  const paths = files(root).filter(
    (p) =>
      /\.(?:[cm]?[jt]s|sql)$/.test(p) &&
      p !== self &&
      !allowed.some((d) => p.startsWith(d + sep)),
  );
  return scan(
    "events_sql",
    paths,
    root,
    /\b(?:FROM|INTO|UPDATE|JOIN|TABLE|ON)\s+["`]?events\b/,
  );
}

/** REQ-2532: only the blob store writes into data/blobs, and nothing deletes there. */
export function checkBlobWritesConfined(root: string): Finding[] {
  const store = join(root, "src", "engine", "blobs", "store.ts");
  const tests = join(root, "tests");
  const self = join(root, "tools", "static-checks.ts");
  const paths = files(root).filter(
    (p) =>
      /\.(ts|js|mjs|sh)$/.test(p) &&
      p !== store &&
      p !== self &&
      !p.startsWith(tests),
  );
  return paths.flatMap((path) =>
    readFileSync(path, "utf8")
      .split("\n")
      .filter(
        (line) =>
          /blobs/.test(line) &&
          /\b(unlink|unlinkSync|rmSync|rm\s*\(|writeFile|appendFile|renameSync|truncate)/.test(
            line,
          ),
      )
      .map((line) => ({
        check: "blob_write",
        file: relative(root, path),
        match: line.trim(),
      })),
  );
}

/**
 * REQ-3816: only the explanation request, in src/server/explain/, reads
 * \`explain_cache\`, so no projection, report or export can depend on it and
 * emptying it loses no fact about play. Migrations create it; tests fill it.
 */
export function checkExplainCacheConfined(root: string): Finding[] {
  const allowed = join(root, "src", "server", "explain") + sep;
  const skipped = [
    join(root, "tests") + sep,
    join(root, "migrations") + sep,
    allowed,
  ];
  const self = join(root, "tools", "static-checks.ts");
  const paths = files(root).filter(
    (p) =>
      /\.(ts|js|mjs|sh|sql)$/.test(p) &&
      p !== self &&
      !skipped.some((d) => p.startsWith(d)),
  );
  return scan("explain_cache", paths, root, /\bexplain_cache\b/);
}

/** Projections are pure folds: no clock, random source or network (SPC-0020). */
export function checkProjectionsPure(root: string): Finding[] {
  const dir = join(root, "src", "engine", "projections");
  return scan(
    "projection_purity",
    existsSync(dir) ? files(dir) : [],
    root,
    /Date\.now|new Date\(|Math\.random|performance\.now|from "node:(crypto|http|https|net|dgram)"|\bfetch\(/,
  );
}

/** REQ-2414: no answer reply says «верно» or «неверно», in any case. */
export const REPLY_KEYS = /^(battle\.|standin\.task\.\d+\.solution)/;
export function checkNoVerdictWords(root: string): Finding[] {
  const path = join(root, "content", "i18n", "ru.json");
  if (!existsSync(path)) return [];
  const strings = JSON.parse(readFileSync(path, "utf8")) as Record<
    string,
    string
  >;
  const word = /(?<!\p{L})(не)?верно(?!\p{L})/iu;
  return Object.entries(strings)
    .filter(([key, text]) => REPLY_KEYS.test(key) && word.test(text))
    .map(([key, text]) => ({
      check: "verdict_words",
      file: relative(root, path),
      match: `${key}: ${text}`,
    }));
}

/**
 * REQ-2224 (ADR-0020): no game projection reaches the knowledge model, the
 * Director or the answer check, directly or through any module between,
 * helpers both sides share included, so a recompute under new versions can't
 * change a logged outcome, reward or branch. Type-only imports are skipped:
 * they leave nothing at run time.
 */
export const FORBIDDEN_FOR_GAME = [
  "src/engine/model/",
  "src/engine/states/",
  "src/engine/director/",
  "src/shared/answer.ts",
  // The two modules that read the model, threshold and graph versions.
  "src/engine/projections/versions.ts",
  "src/server/versions.ts",
];

function runtimeImports(path: string): string[] {
  const text = readFileSync(path, "utf8");
  const found: string[] = [];
  const pattern =
    /^\s*(?:import|export)\s+(?!type\b)(?:[^;]*?\sfrom\s+)?["'](\.{1,2}\/[^"']+)["']/gm;
  for (const m of text.matchAll(pattern)) {
    const spec = m[1];
    if (!spec) continue;
    const target = join(path, "..", spec.replace(/\.js$/, ".ts"));
    if (existsSync(target)) found.push(target);
  }
  return found;
}

/** What the check reads of a registry entry, so a fixture can stand in for one. */
export interface ProjectionEntry {
  name: string;
  class: "game" | "knowledge";
  module: string;
}

/** The source without its comments, so a comment that names a table doesn't count. */
function withoutComments(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

/**
 * Walks the runtime imports from `start`, breadth-first so the chain reported
 * is a shortest one, and returns the chain to the first module `hit` accepts.
 */
function chainTo(
  start: string,
  hit: (path: string) => boolean,
): string[] | undefined {
  const from = new Map<string, string | null>([[start, null]]);
  const queue = [start];
  while (queue.length) {
    const at = queue.shift() as string;
    if (hit(at)) {
      const chain: string[] = [];
      for (let p: string | null = at; p; p = from.get(p) ?? null)
        chain.unshift(p);
      return chain;
    }
    for (const next of runtimeImports(at))
      if (!from.has(next)) {
        from.set(next, at);
        queue.push(next);
      }
  }
  return undefined;
}

export function checkGameProjectionImports(
  root: string,
  projections: readonly ProjectionEntry[] = PROJECTIONS,
): Finding[] {
  const forbidden = (path: string): boolean => {
    const rel = relative(root, path).split(sep).join("/");
    return FORBIDDEN_FOR_GAME.some((f) =>
      f.endsWith("/") ? rel.startsWith(f) : rel === f,
    );
  };
  const namesLlmLog = (path: string): boolean =>
    /\bllm_log\b/.test(withoutComments(readFileSync(path, "utf8")));
  const byModule = new Map<string, ProjectionEntry[]>();
  for (const entry of projections) {
    const path = fileURLToPath(entry.module);
    byModule.set(path, [...(byModule.get(path) ?? []), entry]);
  }
  const findings: Finding[] = [];
  for (const [start, entries] of byModule) {
    const classes = new Set(entries.map((e) => e.class));
    if (classes.size > 1)
      findings.push({
        check: "projection_class_mixed",
        file: relative(root, start),
        match: entries.map((e) => `${e.name}: ${e.class}`).join(", "),
      });
    if (classes.has("game")) {
      const chain = chainTo(start, forbidden);
      if (chain)
        findings.push({
          check: "game_projection_imports",
          file: relative(root, start),
          match: chain.map((p) => relative(root, p)).join(" -> "),
        });
    }
    const chain = chainTo(start, namesLlmLog);
    if (chain) {
      const files = chain.map((p) => relative(root, p));
      findings.push({
        check: "projection_reads_llm_log",
        file: files[files.length - 1] as string,
        match: files.join(" -> "),
      });
    }
  }
  return findings;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.cwd();
  const { checkParamsLanguageFree, loadTemplateSchemas } =
    await import("./params-language-free.js");
  const templates = await loadTemplateSchemas(root);
  const findings = [
    ...checkNoKeyInClient(root),
    ...checkNoPush(root),
    ...checkClientStorage(root),
    ...checkEventsSqlConfined(root),
    ...checkBlobWritesConfined(root),
    ...checkProjectionsPure(root),
    ...checkNoVerdictWords(root),
    ...checkGameProjectionImports(root),
    ...checkExplainCacheConfined(root),
    ...checkParamsLanguageFree(templates),
  ];
  console.log(
    "static checks: key_in_client searched dist/client, src/client and content for sk-or-; " +
      "push_code searched the code base for VAPID keys, push tables, push libraries and push.apple.com; " +
      "client_storage searched src/client for IndexedDB outside the queue's module, the Cache API outside the service worker, and localStorage, sessionStorage, cookie and origin-private file system writes; " +
      "events_sql searched the code outside src/engine/events, migrations and tests for SQL naming events; " +
      `params_language read ${templates.length} templates in src/templates for string parameters; ` +
      "blob_write searched the code outside the blob store for writes or deletes in data/blobs; " +
      "projection_purity searched src/engine/projections for clocks, random sources and network modules; " +
      "verdict_words searched the battle lines and short solutions in content/i18n/ru.json for «верно» and «неверно»; " +
      "game_projection_imports followed the runtime imports of each game projection in the registry to the knowledge model, the Director, the answer check and the version modules, and projection_reads_llm_log followed every projection's runtime imports for llm_log; " +
      "explain_cache searched the code outside src/server/explain, migrations and tests for the explanation cache",
  );
  for (const f of findings) console.log(`${f.check}: ${f.file}: ${f.match}`);
  process.exit(findings.length ? 1 : 0);
}
