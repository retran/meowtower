// The player's age band, read from the parent's file (REQ-3712). The file is
// `personal/player.md`, which the repository excludes from every commit. A
// repository without it reports `age_unset`, and no age is written in the code.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function ageBand(root: string): string {
  const file = join(root, "personal", "player.md");
  if (!existsSync(file)) return "age_unset";
  const m = /^age_band:\s*(\S+)\s*$/m.exec(readFileSync(file, "utf8"));
  return m?.[1] ?? "age_unset";
}
