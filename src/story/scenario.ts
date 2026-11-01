// A prepared scenario (ADR-3270): a graph of scenes with options, checks and endings that the
// Master leads her through. It is data, so code can refuse one that can't be played.
import { z } from "zod";

const Id = z.string().min(1);

export const Scenario = z.object({
  id: Id,
  premise: z.string().min(1),
  start: Id,
  scenes: z.array(
    z.object({
      id: Id,
      text: z.string().min(1),
      options: z.array(z.object({ label: z.string().min(1), next: Id })),
      check: z
        .object({
          why: z.string().min(1),
          clean: Id,
          partial: Id,
          alt: Id,
        })
        .optional(),
    }),
  ),
  endings: z.array(z.object({ id: Id, outcome: z.string().min(1) })),
});
export type Scenario = z.infer<typeof Scenario>;
type Scene = Scenario["scenes"][number];

export const MIN_SCENES = 15;
export const MAX_SCENES = 30;
const MIN_ENDINGS = 2;

const targetsOf = (scene: Scene): string[] => [
  ...scene.options.map((o) => o.next),
  ...(scene.check
    ? [scene.check.clean, scene.check.partial, scene.check.alt]
    : []),
];

/** The fewest checks on any path from `id` to an ending; null when a loop is met. */
function fewestChecks(
  id: string,
  scenes: ReadonlyMap<string, Scene>,
  known: Map<string, number>,
  open: Set<string>,
): number | null {
  const scene = scenes.get(id);
  if (!scene) return 0;
  if (open.has(id)) return null;
  const seen = known.get(id);
  if (seen !== undefined) return seen;
  open.add(id);
  let least = Number.POSITIVE_INFINITY;
  for (const next of targetsOf(scene)) {
    const rest = fewestChecks(next, scenes, known, open);
    if (rest === null) return null;
    least = Math.min(least, rest);
  }
  open.delete(id);
  const own = (scene.check ? 1 : 0) + least;
  known.set(id, own);
  return own;
}

/** The faults that stop a scenario from being played; an empty list means it can run (REQ-8204). */
export function checkScenario(
  scenario: Scenario,
  plan: { readonly minChecks: number },
): string[] {
  const faults: string[] = [];
  const scenes = new Map(scenario.scenes.map((s) => [s.id, s]));
  const endings = new Set(scenario.endings.map((e) => e.id));
  const { length } = scenario.scenes;
  if (length < MIN_SCENES || length > MAX_SCENES) faults.push("scene_count");
  if (scenario.endings.length < MIN_ENDINGS) faults.push("too_few_endings");
  for (const scene of scenario.scenes) {
    const targets = targetsOf(scene);
    if (targets.length === 0) faults.push(`dead_end:${scene.id}`);
    for (const next of targets)
      if (!scenes.has(next) && !endings.has(next))
        faults.push(`unknown_target:${scene.id}:${next}`);
  }
  if (!scenes.has(scenario.start)) return [...faults, "unknown_start"];
  const reached = new Set<string>();
  const walk = (id: string): void => {
    const scene = scenes.get(id);
    if (!scene || reached.has(id)) return;
    reached.add(id);
    targetsOf(scene).forEach(walk);
  };
  walk(scenario.start);
  for (const scene of scenario.scenes)
    if (!reached.has(scene.id)) faults.push(`unreachable:${scene.id}`);
  const least = fewestChecks(scenario.start, scenes, new Map(), new Set());
  if (least === null) faults.push("loop");
  else if (least < plan.minChecks) faults.push("too_few_checks");
  return faults;
}
