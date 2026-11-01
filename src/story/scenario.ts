// A prepared scenario (ADR-3270): a graph of encounters that the Master turns into full scenes.
// It is data, so code can refuse one that can't be played.
import { z } from "zod";

const Id = z.string().min(1);

/** Snyder's 15 beats; an encounter holds one, and several may share an encounter's span. */
export const BEATS = [
  "opening_image",
  "theme_stated",
  "set_up",
  "catalyst",
  "debate",
  "break_into_two",
  "b_story",
  "fun_and_games",
  "midpoint",
  "bad_guys_close_in",
  "all_is_lost",
  "dark_night",
  "break_into_three",
  "finale",
  "final_image",
] as const;
export type Beat = (typeof BEATS)[number];

export const KINDS = ["mythology", "case", "character", "filler"] as const;

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
  logline: z.string().min(1),
  kind: z.enum(KINDS),
  /** A closes in the episode, B carries relationships, C moves the mythology. */
  lines: z.object({ a: z.string(), b: z.string(), c: z.string() }),
  clock: z.object({ what: z.string(), shortens: z.string() }).optional(),
  opposition: z.object({ who: z.string(), why: z.string() }),
  setups: z.array(z.object({ id: Id, plant: Id, pays: Id, what: z.string() })),
  cliffhanger: z.object({
    kind: z.string().min(1),
    question: z.string().min(1),
    prepared: z.string().min(1),
    exit: z.string().min(1),
  }),
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
      line: z.enum(["a", "b", "c"]),
      /** What someone in the scene hides, for the Master to keep readable. */
      subtext: z.string(),
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
  "catalyst",
  "break_into_two",
  "midpoint",
  "all_is_lost",
  "finale",
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
    if (encounter.value.from === encounter.value.to)
      faults.push(`no_turn:${encounter.id}`);
    for (const next of targetsOf(encounter)) {
      const after = encounters.get(next);
      if (after && after.act < encounter.act)
        faults.push(`act_backwards:${encounter.id}`);
    }
  }
  const peak = Math.max(...all.map((e) => e.tension));
  const finales = all.filter((e) => e.beat === "finale");
  if (finales.length > 0 && finales.every((e) => e.tension < peak))
    faults.push("finale_not_peak");
  if (!scenario.clock && scenario.kind !== "filler") faults.push("no_clock");
  return faults;
}

/** Whether `to` can be reached from `from`. */
function reaches(
  from: string,
  to: string,
  encounters: ReadonlyMap<string, Encounter>,
  seen = new Set<string>(),
): boolean {
  if (from === to) return true;
  const encounter = encounters.get(from);
  if (!encounter || seen.has(from)) return false;
  seen.add(from);
  return targetsOf(encounter).some((n) => reaches(n, to, encounters, seen));
}

function setupFaults(
  scenario: Scenario,
  encounters: ReadonlyMap<string, Encounter>,
): string[] {
  return scenario.setups.flatMap((s) => {
    if (!encounters.has(s.plant) || !encounters.has(s.pays))
      return [`setup_unknown:${s.id}`];
    return s.plant !== s.pays && reaches(s.plant, s.pays, encounters)
      ? []
      : [`setup_order:${s.id}`];
  });
}

/** Whether a path from `id` reaches an ending with no finale on it. */
function skipsFinale(
  id: string,
  encounters: ReadonlyMap<string, Encounter>,
  seen: Set<string>,
): boolean {
  const encounter = encounters.get(id);
  if (!encounter) return true;
  if (encounter.beat === "finale" || seen.has(id)) return false;
  seen.add(id);
  return targetsOf(encounter).some((next) =>
    skipsFinale(next, encounters, seen),
  );
}

/** The faults that stop a scenario from being played; an empty list means it can run (REQ-8204). */
export function checkScenario(
  scenario: Scenario,
  plan: { readonly minChecks: number; readonly names?: readonly string[] },
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
  faults.push(...setupFaults(scenario, encounters));
  for (const name of plan.names ?? [])
    if (scenario.logline.includes(name)) faults.push(`logline_names:${name}`);
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
    if (skipsFinale(scenario.start, encounters, new Set()))
      faults.push("path_without_finale");
  }
  return faults;
}
