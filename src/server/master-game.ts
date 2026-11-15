// The Master in the child's game (ADR-3270, ADR-3280, REQ-8266, REQ-8268, REQ-8272). A new daily adventure
// starts from an adventure the parent approved, which the studio then marks as playing. Her words go to the
// Master, which answers in story text, and a check she is asked for goes to the Director's task. Everything
// the game needs to go on is read from the log, so a restart or a second device resumes at the same place.
import { appendEvents, type NewEvent } from "../engine/events/append.js";
import {
  adventureEvents,
  eventsOfTypes,
  type StoredEvent,
} from "../engine/events/read.js";
import { translator } from "../shared/i18n.js";
import { engineOutcomeOf, ladder } from "../story/check.js";
import { MasterFailed } from "../story/master-gateway.js";
import { recordTurn, takeTurn } from "../story/turn.js";
import type { Db } from "./db/index.js";
import { raise } from "./failures.js";
import { parentSettings } from "./parent-room.js";
import { pendingCheck, setCheckTask } from "./sandbox/director.js";
import {
  enterEncounter,
  type MasterFactory,
  type Scene,
  scenarioOf,
} from "./sandbox/play.js";
import {
  childrenOf,
  getNode,
  setStatus,
  StudioRefused,
} from "./studio/store.js";

/** What `advance` found for the next answer of `/next`. */
export type Phase =
  | "plain" // the adventure has no scenario: the game goes on with plain tasks
  | "scene" // a scene is open, and `/next` shows it
  | "task" // a check waits for its task, and `/next` draws it
  | "ended"; // the scenario's last scene has been read, and the adventure is complete

export interface MasterGame {
  /** Starts a scenario for a new adventure; false, with a notice for the parent, where none is approved. */
  begin(adventureId: string, sessionId: string): Promise<boolean>;
  /** Takes the turn that is owed, if any, and says what `/next` shows. */
  advance(adventureId: string, sessionId: string): Promise<Phase>;
}

/** The id of the one branch that closes a scene with no choice to make. */
export const CONTINUE = "continue";
/** A scene the Master wrote carries the encounter in its id: `<encounter>~<n>`. */
const MARK = "~";
const ENDING = `${MARK}end`;
const RETRY = `${MARK}retry`;

const encounterOf = (sceneId: string): string => sceneId.split(MARK)[0] ?? "";

interface Branch {
  choiceId: string;
  text: string;
}

type Owed =
  { kind: "turn"; said: string } | { kind: "enter"; encounter: string };

interface State {
  started: { nodeId: string; encounter: string } | null;
  encounter: string;
  scene: { sceneId: string; branches: Branch[] } | null;
  owed: Owed | null;
  lastSaid: string;
  /** The last scene of the scenario was shown and closed. */
  finale: boolean;
  completed: boolean;
}

/** Reads where a Master adventure stands from its events, in order. */
export function stateOf(events: readonly StoredEvent[]): State {
  const s: State = {
    started: null,
    encounter: "",
    scene: null,
    owed: null,
    lastSaid: "",
    finale: false,
    completed: false,
  };
  let lost: Owed | null = null;
  for (const e of events) {
    const p = (e.payload ?? {}) as Record<string, unknown>;
    const str = (k: string): string =>
      typeof p[k] === "string" ? (p[k] as string) : "";
    if (e.type === "scenario_started") {
      s.started = { nodeId: str("nodeId"), encounter: str("encounter") };
      s.encounter = str("encounter");
    } else if (e.type === "scene_prepared") {
      const id = str("sceneId");
      if (id.endsWith(RETRY)) lost = s.owed;
      s.scene = {
        sceneId: id,
        branches: (p["branches"] as Branch[] | undefined) ?? [],
      };
      s.encounter = encounterOf(id) || s.encounter;
      s.owed = null;
    } else if (e.type === "free_text" && s.scene?.sceneId === str("sceneId")) {
      s.owed = { kind: "turn", said: str("cleaned") };
      s.lastSaid = str("cleaned");
      s.scene = null;
    } else if (
      e.type === "choice_made" &&
      s.scene?.sceneId === str("sceneId")
    ) {
      const choice = str("choiceId");
      const closed = s.scene;
      s.scene = null;
      if (closed.sceneId.endsWith(ENDING)) s.finale = true;
      else if (closed.sceneId.endsWith(RETRY)) s.owed = lost;
      else if (choice === CONTINUE) s.owed = null;
      else s.owed = { kind: "enter", encounter: choice };
    } else if (e.type === "turn_taken") {
      s.lastSaid = str("said");
      s.owed = null;
    } else if (e.type === "adventure_completed") s.completed = true;
  }
  return s;
}

const sceneEvent = (
  scene: Scene,
  at: { adventureId: string; sessionId: string },
): NewEvent => ({
  type: "scene_prepared",
  v: 2,
  payload: { ...scene, starters: scene.starters ?? [] },
  origin: "server",
  ...at,
});

export function createMasterGame(options: {
  db: Db;
  master: MasterFactory;
  now: () => number;
}): MasterGame {
  const { db, master, now } = options;
  /** One owed turn at a time for an adventure, so two requests never narrate the same action twice. */
  const chains = new Map<string, Promise<unknown>>();
  const exclusive = <T>(key: string, work: () => Promise<T>): Promise<T> => {
    const run = (chains.get(key) ?? Promise.resolve()).then(work, work);
    chains.set(
      key,
      run.catch(() => undefined),
    );
    return run;
  };

  async function pick(): Promise<{ id: string; first: string } | null> {
    const rows = (await db
      .prepare(
        `SELECT id FROM story_nodes
         WHERE level = 'adventure' AND status = 'approved' AND archived_at IS NULL AND needs_review = 0
         ORDER BY updated_at, id`,
      )
      .all()) as { id: string }[];
    for (const row of rows) {
      const first = (await childrenOf(db, row.id))[0];
      if (first) return { id: row.id, first: first.id };
    }
    return null;
  }

  async function begin(
    adventureId: string,
    sessionId: string,
  ): Promise<boolean> {
    const chosen = await pick();
    if (!chosen) {
      raise(
        "no_approved_scenario",
        "the studio holds no approved adventure with an encounter, so the game plays plain tasks",
        now,
      );
      return false;
    }
    const scene = await enterEncounter(db, chosen.id, chosen.first);
    await setStatus(db, now(), chosen.id, "playing");
    const at = { adventureId, sessionId };
    await appendEvents(db, [
      {
        type: "scenario_started",
        v: 1,
        payload: { nodeId: chosen.id, encounter: chosen.first },
        origin: "server",
        ...at,
      },
      sceneEvent(scene, at),
    ]);
    return true;
  }

  /** The scene the Master's words make, with its buttons: the way on, or the exits, and the starters for the field. */
  async function sceneAfter(
    nodeId: string,
    encounter: string,
    id: string,
    reply: string,
    starters: readonly string[],
    checkAsked: boolean,
    ending: boolean,
  ): Promise<Scene> {
    const exits = (await enterEncounter(db, nodeId, encounter)).branches;
    const way = checkAsked || ending;
    return {
      sceneId: id,
      lines: [{ speaker: "narrator", text: reply }],
      branches: way ? [{ choiceId: CONTINUE, text: "" }] : exits,
      ...(way ? {} : { starters: [...starters] }),
    };
  }

  async function turn(
    adventureId: string,
    sessionId: string,
    st: State,
    said: string,
    outcome: ReturnType<typeof engineOutcomeOf>,
  ): Promise<void> {
    const started = st.started as NonNullable<State["started"]>;
    const at = { adventureId, sessionId };
    const lang = (await parentSettings(db)).language;
    const words = translator(lang);
    const count = (await eventsOfTypes(db, ["turn_taken"])).length;
    try {
      const result = await takeTurn({
        model: master(db, started.nodeId),
        scenario: await scenarioOf(db, started.nodeId),
        encounter: st.encounter,
        said,
        ...(outcome ? { checkResult: ladder(outcome) } : {}),
        profile: (await parentSettings(db)).profile,
        lang,
        blockedText: words.t("story.master.blocked"),
      });
      await recordTurn(db, result, at);
      let encounter = st.encounter;
      const moved = result.calls.find((c) => c.tool === "at_encounter");
      if (moved?.tool === "at_encounter") {
        const target = await getNode(db, moved.input.encounter);
        if (
          target?.level === "encounter" &&
          target.parentId === started.nodeId &&
          target.archivedAt === null
        )
          encounter = target.id;
      }
      const asked = result.calls.find((c) => c.tool === "request_check");
      const task =
        asked?.tool === "request_check"
          ? await setCheckTask(db, encounter, now(), asked.input, at)
          : null;
      const leaf =
        (await enterEncounter(db, started.nodeId, encounter)).branches
          .length === 0;
      const ending =
        !task && leaf && result.calls.some((c) => c.tool === "end_scene");
      const id = ending
        ? `${encounter}${ENDING}`
        : `${encounter}${MARK}${String(count)}`;
      const scene = await sceneAfter(
        started.nodeId,
        encounter,
        id,
        result.reply,
        result.starters,
        task !== null,
        ending,
      );
      await appendEvents(db, [
        sceneEvent(
          {
            ...scene,
            branches: scene.branches.map((b) =>
              b.choiceId === CONTINUE
                ? { ...b, text: words.t("story.master.continue") }
                : b,
            ),
          },
          at,
        ),
      ]);
    } catch (err) {
      if (!(err instanceof MasterFailed)) throw err;
      // Her action waits: the retry scene returns it to the owed turn once she taps on.
      await appendEvents(db, [
        sceneEvent(
          {
            sceneId: `${st.encounter}${MARK}${String(count)}${RETRY}`,
            lines: [
              { speaker: "narrator", text: words.t("story.master.blocked") },
            ],
            branches: [
              { choiceId: CONTINUE, text: words.t("story.master.continue") },
            ],
          },
          at,
        ),
      ]);
    }
  }

  async function advance(
    adventureId: string,
    sessionId: string,
  ): Promise<Phase> {
    return exclusive(adventureId, async () => {
      const events = await adventureEvents(db, adventureId);
      const st = stateOf(events);
      if (!st.started) return "plain";
      if (st.completed) return "ended";
      if (st.scene) return "scene";
      const at = { adventureId, sessionId };
      if (st.finale) {
        await appendEvents(db, [
          {
            type: "adventure_completed",
            v: 1,
            payload: { adventureId },
            origin: "server",
            ...at,
          },
        ]);
        try {
          await setStatus(db, now(), st.started.nodeId, "played");
        } catch (err) {
          if (!(err instanceof StudioRefused)) throw err;
        }
        return "ended";
      }
      if (st.owed?.kind === "enter") {
        await appendEvents(db, [
          sceneEvent(
            await enterEncounter(db, st.started.nodeId, st.owed.encounter),
            at,
          ),
        ]);
        return "scene";
      }
      if (pendingCheck(events)) return "task";
      const outcome = engineOutcomeOf(events);
      if (st.owed?.kind === "turn" || outcome) {
        await turn(
          adventureId,
          sessionId,
          st,
          st.owed?.kind === "turn" ? st.owed.said : st.lastSaid,
          outcome,
        );
        return "scene";
      }
      // Nothing is owed and no scene is open: the encounter's own scene is shown again.
      await appendEvents(db, [
        sceneEvent(
          await enterEncounter(db, st.started.nodeId, st.encounter),
          at,
        ),
      ]);
      return "scene";
    });
  }

  return { begin, advance };
}
