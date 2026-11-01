// A prepared scenario (ADR-3270): a graph of encounters that the Master turns into full scenes.
// It is data, so code can refuse one that can't be played.
import { z } from "zod";

const Id = z.string().min(1);

/** The turning points of the three-act shape; `rising` and `pause` fill the space between them. */
export const BEATS = [
  "inciting",
  "first_turn",
  "rising",
  "midpoint",
  "low_point",
  "pause",
  "climax",
  "resolution",
] as const;
export type Beat = (typeof BEATS)[number];

export const Scenario = z.object({
  id: Id,
  premise: z.string().min(1),
  /** Who wants what, against what, with what at stake. */
  conflict: z.object({
    wants: z.string().min(1),
    against: z.string().min(1),
    stakes: z.string().min(1),
  }),
  /** The dramatic question the climax answers. */
  question: z.string().min(1),
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
      act: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      beat: z.enum(BEATS),
      tension: z.number().int().min(1).max(5),
      /** The value the encounter turns: a scene with no turn is no scene. */
      value: z.object({ from: z.string().min(1), to: z.string().min(1) }),
      /** Exits are what passing the encounter led to, and never the player's choices. */
      exits: z.array(z.object({ when: z.string().min(1), next: Id })),
      /** Library entries that reach the Master by default in this encounter (REQ-8336). */
      attached: z.array(Id).optional(),
    }),
  ),
  endings: z.array(z.object({ id: Id, outcome: z.string().min(1) })),
  /** Library entries that reach the Master by default throughout (REQ-8336). */
  attached: z.array(Id).optional(),
});
export type Scenario = z.infer<typeof Scenario>;
type Encounter = Scenario["encounters"][number];

export const MIN_ENCOUNTERS = 10;
export const MAX_ENCOUNTERS = 20;
const MIN_ENDINGS = 2;
/** At least this share of encounters must lead to different places by how they went. */
const MIN_BRANCHING = 0.5;
const NEEDED_BEATS: readonly Beat[] = [
  "inciting",
  "first_turn",
  "midpoint",
  "low_point",
  "climax",
];

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

/** The structural faults of the three-act shape. */
function shapeFaults(
  scenario: Scenario,
  encounters: ReadonlyMap<string, Encounter>,
): string[] {
  const faults: string[] = [];
  const all = scenario.encounters;
  for (const act of [1, 2, 3])
    if (!all.some((e) => e.act === act)) faults.push(`missing_act:${act}`);
  for (const beat of NEEDED_BEATS)
    if (!all.some((e) => e.beat === beat)) faults.push(`missing_beat:${beat}`);
  for (const encounter of all) {
    if (
      encounter.beat !== "pause" &&
      encounter.value.from === encounter.value.to
    )
      faults.push(`no_turn:${encounter.id}`);
    for (const next of targetsOf(encounter)) {
      const after = encounters.get(next);
      if (after && after.act < encounter.act)
        faults.push(`act_backwards:${encounter.id}`);
    }
  }
  const peak = Math.max(...all.map((e) => e.tension));
  const climaxes = all.filter((e) => e.beat === "climax");
  if (climaxes.length > 0 && climaxes.every((e) => e.tension < peak))
    faults.push("climax_not_peak");
  return faults;
}

/** Whether a path from `id` reaches an ending with no climax on it. */
function skipsClimax(
  id: string,
  encounters: ReadonlyMap<string, Encounter>,
  seen: Set<string>,
): boolean {
  const encounter = encounters.get(id);
  if (!encounter) return true;
  if (encounter.beat === "climax" || seen.has(id)) return false;
  seen.add(id);
  return targetsOf(encounter).some((next) =>
    skipsClimax(next, encounters, seen),
  );
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
  faults.push(...shapeFaults(scenario, encounters));
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
  else {
    if (least < plan.minChecks) faults.push("too_few_checks");
    if (skipsClimax(scenario.start, encounters, new Set()))
      faults.push("path_without_climax");
  }
  return faults;
}
