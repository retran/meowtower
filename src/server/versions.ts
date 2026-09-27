// The model, threshold and graph versions the content files name (SPC-0020).
// `content/versions.json` holds them until ADR-0060's model and threshold
// files and ADR-0050's graph file name their own; MEOWTOWER_VERSIONS points
// elsewhere for a test.
import { readFileSync } from "node:fs";
import type { Versions } from "../engine/projections/registry.js";

const DEFAULT = new URL("../../content/versions.json", import.meta.url);

export function readContentVersions(
  path: string | URL = process.env["MEOWTOWER_VERSIONS"] ?? DEFAULT,
): Versions {
  const v = JSON.parse(readFileSync(path, "utf8")) as Partial<Versions>;
  if (!v.model || !v.thresholds || !v.graph)
    throw new Error(`versions_invalid: ${String(path)} lacks a version`);
  return { model: v.model, thresholds: v.thresholds, graph: v.graph };
}
