// A small layered layout for the studio's graphs (ADR-3280, REQ-8258): no dependency, a few dozen
// nodes at most. A node sits one layer right of the furthest node that leads to it; the nodes of a
// layer stand in the order given. An edge that would close a loop is left out of the layering, so a
// graph with a loop still draws, and the checks of the scenario are what refuse the loop.
export interface LayoutNode {
  readonly id: string;
  /** The ids of the nodes this one leads to; an id that names no node is ignored. */
  readonly links: readonly string[];
}

export interface Placed {
  readonly id: string;
  readonly layer: number;
  readonly x: number;
  readonly y: number;
}

export interface Layout {
  readonly nodes: readonly Placed[];
  readonly edges: readonly { from: string; to: string }[];
  readonly width: number;
  readonly height: number;
}

export interface LayoutSize {
  readonly nodeWidth: number;
  readonly nodeHeight: number;
  readonly gapX: number;
  readonly gapY: number;
}

export const DEFAULT_SIZE: LayoutSize = {
  nodeWidth: 168,
  nodeHeight: 64,
  gapX: 56,
  gapY: 24,
};

export function layoutGraph(
  nodes: readonly LayoutNode[],
  size: LayoutSize = DEFAULT_SIZE,
): Layout {
  const ids = new Set(nodes.map((n) => n.id));
  const out = new Map<string, string[]>();
  for (const n of nodes)
    out.set(
      n.id,
      [...new Set(n.links)].filter((to) => ids.has(to) && to !== n.id),
    );

  // Depth-first from each node in order; an edge back to a node still on the stack closes a loop.
  const back = new Set<string>();
  const state = new Map<string, "open" | "done">();
  const visit = (id: string): void => {
    state.set(id, "open");
    for (const to of out.get(id) ?? []) {
      if (state.get(to) === "open") back.add(`${id}>${to}`);
      else if (!state.has(to)) visit(to);
    }
    state.set(id, "done");
  };
  for (const n of nodes) if (!state.has(n.id)) visit(n.id);

  const edges: { from: string; to: string }[] = [];
  for (const [from, tos] of out) for (const to of tos) edges.push({ from, to });
  const forward = edges.filter((e) => !back.has(`${e.from}>${e.to}`));

  // Longest path from a root: a layer is one more than the deepest node that leads in.
  const incoming = new Map<string, string[]>();
  for (const e of forward)
    incoming.set(e.to, [...(incoming.get(e.to) ?? []), e.from]);
  const layerOf = new Map<string, number>();
  const layer = (id: string): number => {
    const known = layerOf.get(id);
    if (known !== undefined) return known;
    const value = Math.max(-1, ...(incoming.get(id) ?? []).map(layer)) + 1;
    layerOf.set(id, value);
    return value;
  };
  for (const n of nodes) layer(n.id);

  const rows = new Map<number, number>();
  const placed = nodes.map((n): Placed => {
    const l = layerOf.get(n.id) ?? 0;
    const row = rows.get(l) ?? 0;
    rows.set(l, row + 1);
    return {
      id: n.id,
      layer: l,
      x: l * (size.nodeWidth + size.gapX),
      y: row * (size.nodeHeight + size.gapY),
    };
  });
  const layers = Math.max(0, ...placed.map((p) => p.layer)) + 1;
  const tallest = Math.max(0, ...rows.values());
  return {
    nodes: placed,
    edges,
    width:
      nodes.length === 0
        ? 0
        : layers * size.nodeWidth + (layers - 1) * size.gapX,
    height:
      nodes.length === 0
        ? 0
        : tallest * size.nodeHeight + (tallest - 1) * size.gapY,
  };
}
