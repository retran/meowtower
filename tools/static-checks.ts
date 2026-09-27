// Static checks of ADR-0190's verify group 1, run by the lint verb.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

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

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.cwd();
  const findings = [...checkNoKeyInClient(root), ...checkNoPush(root)];
  console.log(
    "static checks: key_in_client searched dist/client, src/client and content for sk-or-; " +
      "push_code searched the code base for VAPID keys, push tables, push libraries and push.apple.com",
  );
  for (const f of findings) console.log(`${f.check}: ${f.file}: ${f.match}`);
  process.exit(findings.length ? 1 : 0);
}
