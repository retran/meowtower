// The versions the projections are computed with (SPC-0020). A module of its
// own, importing nothing, so the registry and the projections both read it.
export interface Versions {
  model: string;
  thresholds: string;
  graph: string;
}

/**
 * The versions the projections are computed with, as the content files name
 * them. The server sets them at start-up (`useVersions`); until the model,
 * threshold and graph files of ADR-0060 and ADR-0050 exist, each is "none".
 */
export const VERSIONS: Versions = {
  model: "none",
  thresholds: "none",
  graph: "none",
};

export function useVersions(versions: Versions): void {
  Object.assign(VERSIONS, versions);
}

export const versionLabel = (v: Versions = VERSIONS): string =>
  `model ${v.model}, thresholds ${v.thresholds}, graph ${v.graph}`;
