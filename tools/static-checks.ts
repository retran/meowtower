// Static checks of ADR-0190's verify group 1, run by the lint verb.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

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
];
/** Projection modules that aren't game projections: the knowledge ones and the registry, which imports every projection by design. */
const NOT_GAME = new Set(["knowledge.ts", "registry.ts"]);

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

export function checkGameProjectionImports(root: string): Finding[] {
  const dir = join(root, "src", "engine", "projections");
  if (!existsSync(dir)) return [];
  const games = readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && !NOT_GAME.has(f))
    .map((f) => join(dir, f));
  const forbidden = (path: string): boolean => {
    const rel = relative(root, path).split(sep).join("/");
    return FORBIDDEN_FOR_GAME.some((f) =>
      f.endsWith("/") ? rel.startsWith(f) : rel === f,
    );
  };
  const findings: Finding[] = [];
  for (const start of games) {
    // Breadth-first, so the chain reported is a shortest one.
    const from = new Map<string, string | null>([[start, null]]);
    const queue = [start];
    while (queue.length) {
      const at = queue.shift() as string;
      if (forbidden(at)) {
        const chain: string[] = [];
        for (let p: string | null = at; p; p = from.get(p) ?? null)
          chain.unshift(relative(root, p));
        findings.push({
          check: "game_projection_imports",
          file: relative(root, start),
          match: chain.join(" -> "),
        });
        break;
      }
      for (const next of runtimeImports(at))
        if (!from.has(next)) {
          from.set(next, at);
          queue.push(next);
        }
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
      "events_sql searched the code outside src/engine/events, migrations and tests for SQL naming events; " +
      `params_language read ${templates.length} templates in src/templates for string parameters; ` +
      "blob_write searched the code outside the blob store for writes or deletes in data/blobs; " +
      "projection_purity searched src/engine/projections for clocks, random sources and network modules; " +
      "verdict_words searched the battle lines and short solutions in content/i18n/ru.json for «верно» and «неверно»; " +
      "game_projection_imports followed the runtime imports of each game projection in src/engine/projections to the knowledge model, the Director and the answer check; " +
      "explain_cache searched the code outside src/server/explain, migrations and tests for the explanation cache",
  );
  for (const f of findings) console.log(`${f.check}: ${f.file}: ${f.match}`);
  process.exit(findings.length ? 1 : 0);
}
