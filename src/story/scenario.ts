// A prepared scenario (ADR-3270): a graph of encounters that the Master turns into full scenes.
// It is data, so code can refuse one that can't be played.
import { z } from "zod";

const Id = z.string().min(1);

export const Scenario = z.object({
  id: Id,
  premise: z.string().min(1),
  start: Id,
  encounters: z.array(
    z.object({
      id: Id,
      place: z.string().min(1),
      situation: z.string().min(1),
      goal: z.string().min(1),
      people: z.array(z.object({ name: z.string().min(1), aim: z.string() })),
      pressure: z.string().min(1),
      /** How many checks the Master must bring into this encounter. */
      checks: z.number().int().min(0),
      /** Exits are what passing the encounter led to, and never the player's choices. */
      exits: z.array(z.object({ when: z.string().min(1), next: Id })),
    }),
  ),
  endings: z.array(z.object({ id: Id, outcome: z.string().min(1) })),
});
export type Scenario = z.infer<typeof Scenario>;
type Encounter = Scenario["encounters"][number];

export const MIN_ENCOUNTERS = 10;
export const MAX_ENCOUNTERS = 20;
const MIN_ENDINGS = 2;
/** At least this share of encounters must lead to different places by how they went. */
const MIN_BRANCHING = 0.5;

const targetsOf = (encounter: Encounter): string[] =>
  encounter.exits.map((exit) => exit.next);

/** The fewest checks on any path from `id` to an ending; null when a loop is met. */
function fewestChecks(
  id: string,
  encounters: ReadonlyMap<string, Encounter>,
  known: Map<string, number>,
  open: Set<string>,
): number | null {
  const encounter = encounters.get(id);
  if (!encounter) return 0;
  if (open.has(id)) return null;
  const seen = known.get(id);
  if (seen !== undefined) return seen;
  open.add(id);
  let least = Number.POSITIVE_INFINITY;
  for (const next of targetsOf(encounter)) {
    const rest = fewestChecks(next, encounters, known, open);
    if (rest === null) return null;
    least = Math.min(least, rest);
  }
  open.delete(id);
  const own = encounter.checks + least;
  known.set(id, own);
  return own;
}

/** The faults that stop a scenario from being played; an empty list means it can run (REQ-8204). */
export function checkScenario(
  scenario: Scenario,
  plan: { readonly minChecks: number },
): string[] {
  const faults: string[] = [];
  const encounters = new Map(scenario.encounters.map((e) => [e.id, e]));
  const endings = new Set(scenario.endings.map((e) => e.id));
  const { length } = scenario.encounters;
  if (length < MIN_ENCOUNTERS || length > MAX_ENCOUNTERS)
    faults.push("encounter_count");
  if (scenario.endings.length < MIN_ENDINGS) faults.push("too_few_endings");
  for (const encounter of scenario.encounters) {
    const targets = targetsOf(encounter);
    if (targets.length === 0) faults.push(`dead_end:${encounter.id}`);
    for (const next of targets)
      if (!encounters.has(next) && !endings.has(next))
        faults.push(`unknown_target:${encounter.id}:${next}`);
  }
  const branching = scenario.encounters.filter(
    (e) => new Set(targetsOf(e)).size > 1,
  ).length;
  if (branching < length * MIN_BRANCHING) faults.push("few_branches");
  if (!encounters.has(scenario.start)) return [...faults, "unknown_start"];
  const reached = new Set<string>();
  const walk = (id: string): void => {
    const encounter = encounters.get(id);
    if (!encounter || reached.has(id)) return;
    reached.add(id);
    targetsOf(encounter).forEach(walk);
  };
  walk(scenario.start);
  for (const encounter of scenario.encounters)
    if (!reached.has(encounter.id)) faults.push(`unreachable:${encounter.id}`);
  const least = fewestChecks(scenario.start, encounters, new Map(), new Set());
  if (least === null) faults.push("loop");
  else if (least < plan.minChecks) faults.push("too_few_checks");
  return faults;
}
