// The checklist (ADR-3280, REQ-8304): where each game feature is tested. A feature is a screen of
// the client or a route of the studio, read from the source so a new one without a place is found.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface Checklist {
  readonly features: readonly {
    id: string;
    tests: readonly string[];
    /** Why a feature with no test has none; a feature with neither is unplaced. */
    untested?: string;
  }[];
}

export interface Gaps {
  /** Features with no entry, or an entry that names no test. */
  readonly unplaced: string[];
  /** Entries for a feature that no longer exists. */
  readonly stale: string[];
  /** Entries that name a test file that is not there, as `feature: path`. */
  readonly missingFiles: string[];
}

/** The files that mount the game's own routes, and what each route is called on the checklist. */
const ROUTE_FILES: readonly (readonly [string, string])[] = [
  ["play.ts", "api"],
  ["stream.ts", "api"],
  ["pairing.ts", "api"],
  ["parent-room.ts", "api"],
  ["accounts/routes.ts", "api"],
  ["app.ts", "api"],
  ["parent.ts", "parent-app"],
];

/** The checklist as the repository keeps it; `root` is the repository's root, for the tests. */
export function readChecklist(root?: string): Checklist {
  const file = root
    ? join(root, "content", "checklist.json")
    : new URL("../../../content/checklist.json", import.meta.url);
  return JSON.parse(readFileSync(file, "utf8")) as Checklist;
}

/**
 * The screens of the client and the routes of the studio and of the game, as `screen:/path` and
 * `api:METHOD /path`; a route of the parent app on the owner's computer reads `parent-app:`.
 */
export function featuresOf(root: string): string[] {
  const screens: string[] = [];
  for (const name of readdirSync(join(root, "src", "client")).sort()) {
    if (!name.endsWith(".ts")) continue;
    const source = readFileSync(join(root, "src", "client", name), "utf8");
    for (const m of source.matchAll(/^ {2}path: "(\/[^"]*)",$/gm))
      screens.push(`screen:${m[1] as string}`);
  }
  const routes = readFileSync(
    join(root, "src", "server", "studio", "routes.ts"),
    "utf8",
  );
  const api: string[] = [];
  for (const m of routes.matchAll(
    /app\.(get|post|put|delete|all)\(\s*`\$\{(base|playBase)\}([^`]*)`/g,
  ))
    api.push(
      `api:${(m[1] as string).toUpperCase()} ${m[2] === "playBase" ? "/sandbox/play" : ""}${m[3] as string}`,
    );
  for (const [file, prefix] of ROUTE_FILES) {
    const source = readFileSync(join(root, "src", "server", file), "utf8");
    for (const m of source.matchAll(
      /\bapp\.(get|post|put|delete|all)\(\s*"(\/[^"]*)"/g,
    ))
      api.push(`${prefix}:${(m[1] as string).toUpperCase()} ${m[2] as string}`);
  }
  return [...screens, ...api];
}

/** What is wrong with a checklist beside the features that exist; every list empty means it holds. */
export function gaps(
  features: readonly string[],
  checklist: Checklist,
  exists: (path: string) => boolean,
): Gaps {
  const placed = new Map(
    checklist.features.map((f) => [
      f.id,
      f.tests.length > 0 || (f.untested?.trim() ?? "") !== "",
    ]),
  );
  return {
    unplaced: features.filter((f) => placed.get(f) !== true),
    stale: checklist.features
      .map((f) => f.id)
      .filter((id) => !features.includes(id)),
    missingFiles: checklist.features.flatMap((f) =>
      f.tests.filter((t) => !exists(t)).map((t) => `${f.id}: ${t}`),
    ),
  };
}
