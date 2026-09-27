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
    ...checkParamsLanguageFree(templates),
  ];
  console.log(
    "static checks: key_in_client searched dist/client, src/client and content for sk-or-; " +
      "push_code searched the code base for VAPID keys, push tables, push libraries and push.apple.com; " +
      "events_sql searched the code outside src/engine/events, migrations and tests for SQL naming events; " +
      `params_language read ${templates.length} templates in src/templates for string parameters; ` +
      "blob_write searched the code outside the blob store for writes or deletes in data/blobs; " +
      "projection_purity searched src/engine/projections for clocks, random sources and network modules; " +
      "verdict_words searched the battle lines and short solutions in content/i18n/ru.json for «верно» and «неверно»",
  );
  for (const f of findings) console.log(`${f.check}: ${f.file}: ${f.match}`);
  process.exit(findings.length ? 1 : 0);
}
