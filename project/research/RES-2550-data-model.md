---
id: RES-2550
artifact: research
status: draft
revised: 2026-09-26
---

# The draft proposes an append-only event log as the only truth, with every other game table rebuilt from it

## Summary

The owner's draft makes the append-only event table `events` the single source
of truth. Every other game and diagnostic table is a projection of that log,
which the command `./tower recompute` can delete and rebuild. The draft gives
the event envelope, 48 event types and the payloads for a shown task, a
submitted attempt, a verdict, a shown explanation and the resume snapshot, all
as TypeScript types. It lists 34 SQLite tables in 21 rows, each marked as
truth, service, cache, projection or deferred. It also prepares three
extensions for a later Dutch stage: a locale, a curriculum layer and a graph
overlay. This record carries the types and the table list in full. The stack,
backups and repository layout are in the platform record, and privacy and cost
have records of their own.

## The question

Where does the game keep what happened, and what may be derived from it? The
draft assumes that one immutable log can carry every fact and that each
projection can be rebuilt cheaply at any time. That holds only while the log
records everything a projection needs and while replaying the whole log stays
fast enough on the parent's Mac; the draft sets no limit on either.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles -
specification), the opening paragraph and the subsections «Модель данных»
(data model) and «Задел на голландский этап» (groundwork for the Dutch stage),
on 2026-09-26. I translated the comments in the TypeScript block and the text
of the table into English and left the code, identifiers and table rows as
the draft gives them. No alternatives were compared, because the record
carries the owner's proposal for later requirements to cite.

The draft leaves these open:

- The shape of `NodeId`, `FloorId`, `ItemView`, `Answer`, `SolutionView`,
  `EventPayload` and `NodeEstimate`, which the types use but don't define.
- The payloads of the event types other than `item_shown`,
  `attempt_submitted`, `verdict` and `explanation_shown`.
- The shape of `quests`, `grants` and `params`, typed as `unknown`.
- The fields of the `OutcomeEvent` schema that the autonomous development
  section names.

## Findings

### The draft makes the event log the only truth

The truth is the event log `events`, which only grows. Every other game and
diagnostic table is a derived projection of the log. Any of them can be deleted
and rebuilt with `./tower recompute`. Seven tables live apart from the log and
are not projections; the next finding lists them.

### Resolved: seven tables live outside the projections, as the table list marks them: `blobs` as truth, `explain_cache` as cache, and `devices`, `llm_log`, `art_jobs`, `frames` and `bakeoff` as service

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's prose said: «Отдельно от журнала живут только служебные таблицы:
устройства и токены, `llm_log`, очередь графики» (only the service tables
live apart from the log: devices and tokens, `llm_log`, the graphics queue).
Its table list also marks `blobs` as «истина» (truth), `explain_cache` as
«кэш» (cache), and `frames` and `bakeoff` as «служебная» (service).

I compared two options:

| Option | Better at | Why it loses or wins |
| --- | --- | --- |
| The table list holds: seven tables outside the projections | matches what each table stores; a recompute never throws away bytes or paid-for text it can't rebuild | wins |
| The prose holds: `blobs`, `explain_cache`, `frames` and `bakeoff` become projections of new events | one truth for everything, so a parent's frame approval or hidden explanation replays from the log | loses: scratchpad images can't live in the log, a rebuilt explanation cache would cost OpenRouter calls, and the bake-off runs once at stage 0 |

The seven tables fall into three kinds:

- Truth beside the log: `blobs`, the metadata of files the log points to by
  hash. The backup keeps the log and `data/blobs/` together (RES-2500).
- Service: `devices`, `llm_log`, `art_jobs`, `frames` and `bakeoff`. They
  hold device tokens, request records, job queues and review statuses that
  are not facts about play.
- Cache: `explain_cache`, explanation texts with placeholders. Deleting it
  loses no fact; the game falls back to live generation or templates
  (RES-0600).

`./tower recompute` deletes and rebuilds only the projections, and never
touches these seven. This reverses if the parent's approvals of frames and
explanations must replay from the log; then each approval becomes an event as
well.

### The draft defines the event envelope, the event types and the main payloads

The draft's TypeScript, with comments translated:

```typescript
// src/shared/events.ts - the event envelope and the main payloads (zod schemas with the same fields)
interface Event<T extends EventType = EventType> {
  id: string;                            // ULID
  seq: number;                           // global monotonic number
  ts: string;                            // server time, ISO
  clientMs?: number;                     // device time (performance.now from the start of the session)
  deviceId: string; sessionId?: string; adventureId?: string;
  type: T;
  v: number;                             // payload schema version
  payload: EventPayload[T];
}

type EventType =
  | "adventure_planned" | "adventure_started" | "adventure_paused" | "adventure_resumed"
  | "adventure_completed" | "adventure_wrapped_up" | "device_lease_taken"
  | "session_started" | "session_ended" | "floor_entered" | "room_opened"
  | "item_shown" | "item_focus" | "attempt_submitted" | "verdict"
  | "hint_shown" | "solution_shown" | "explanation_requested" | "explanation_shown"
  | "scratch_snapshot" | "glossary_opened"
  | "scene_shown" | "choice_made" | "free_text" | "name_given" | "plan_written"
  | "reward_granted" | "chest_offered" | "chest_chosen" | "thread_earned" | "thread_spent"
  | "level_up" | "quest_progress" | "forge_crafted" | "shop_purchase"
  | "familiar_friendship" | "familiar_evolved" | "familiar_hatched"
  | "break_started" | "break_ended" | "stop_offered" | "extended"
  | "parent_tag_added" | "parent_tag_removed" | "item_excluded" | "settings_changed"
  | "safety_event" | "llm_call";

interface ItemShown {                    // payload of the item_shown event
  itemId: string;                        // opaque id the client saw
  attempt: 1 | 2; parentItemId?: string; // for the second attempt - the original task
  purpose: "warmup" | "probe" | "block" | "spotcheck" | "control" | "ladder" | "science"
         | "calibration" | "stretch" | "recheck" | "easy" | "review" | "parent_topic" | "second_attempt";
  scored: boolean;
  node: NodeId; subtype: string;
  templateId: string; templateVersion: number;
  seed: string; params: unknown; paramsHash: string; difficulty: Record<string, number | string>;
  frameId?: string; frameSource?: "library" | "live";
  shown: ItemView;                       // the full rendered view
  correct: Answer;                       // the correct answer (on the server; not sent to the client before the attempt)
  solution: SolutionView;                // the short solution, as it will be shown
  flowSlot?: "frontier" | "review" | "parent_topic";
  floor: FloorId; roomId?: string; slot?: number;
  thresholdVersion: string; engineVersion: string;
}

interface AttemptSubmitted {             // payload of the attempt_submitted event
  itemId: string; attempt: 1 | 2;
  raw: string; parsed?: Answer;          // the server's parse
  input: { firstKeyMs: number; submitMs: number; edits: number; deletions: number;
           keystrokes: number; focusLost: number; focusLostMs: number;
           inputMethod: "ipad-touch" | "ipad-pencil" | "ipad-keyboard" | "desktop-keyboard" | "desktop-mouse" };
  steps?: string[]; modelChoice?: number;
  scratchKind: "none" | "canvas" | "grid-text";
  assisted: boolean;                     // true: second attempt, or a hint before answering
  hintLevel: 0 | 1 | 2 | 3;
  interrupted: boolean;                  // paused mid-task: accuracy counts in the estimate, time does not
  clientSeq: number;
}

interface Verdict {                      // payload of the verdict event - what the game decided and showed at that moment
  itemId: string; attempt: 1 | 2;
  verdict: "correct" | "partial" | "wrong" | "dont_know";
  outcome?: "clean" | "partial" | "alt"; // first attempt only
  rapidGuess: boolean;
  trapId?: string;
  errorClass?: "conceptual" | "procedural" | "fact" | "slip" | "unclassified";
  steps?: { raw: string; value?: string; match: "ok" | "calc" | "wrong_op" | "unclassified" }[];
  comboAfter: number;
  postFeedback: boolean;                 // the same node was already reviewed today
}

interface ExplanationShown {             // payload of the explanation_shown event
  itemId: string; source: "llm" | "cache" | "template";
  cacheKey: string; promptVersion: string;
  validation: { placeholdersOk: boolean; noRawNumerals: boolean; allStepsCovered: boolean;
                blindAnswerMatches: boolean; safetyOk: boolean };
  lines: { speaker: string; text: string }[]; // as shown, numbers filled in by code
  dwellMs?: number;
}

interface ResumeSnapshot {               // derived projection; cached in resume_snapshot
  adventureId: string; lastEventSeq: number;
  route: FloorId[]; floorIndex: number; floor: FloorId;
  roomId?: string; roomLength?: number; slot?: number;
  pendingItem?: { itemId: string; attempt: 1 | 2;
    state: "shown" | "hint_shown" | "answered_feedback_pending" | "solution_shown"
         | "explanation_pending" | "explanation_shown" | "second_attempt_shown";
    hintLevel: 0 | 1 | 2 | 3; threadsSpent: number };
  pendingScene?: { sceneId: string; lineIndex: number; choicesShown: boolean; draft?: string };
  pendingRewards: { chestId?: string; grants: unknown[]; ceremonies: ("level" | "evolution" | "hatch")[] };
  pendingBreak?: "eyes" | "camp";
  game: { combo: number; flowWindow: number[]; eyeActiveMs: number; quests: unknown;
          planBeat: number; rngState: string; preparedSceneIds: string[] };
}

interface DerivedMeta {                  // in every derived table and snapshot
  modelVersion: string; thresholdVersion: string; graphVersion: string;
  lastEventSeq: number; computedAt: string;
}

interface AttemptView {                  // flat projection: one row = one attempt (for the report and the export)
  itemId: string; attempt: 1 | 2; parentItemId?: string;
  sessionId: string; adventureId: string; deviceId: string; inputMethod: string;
  node: NodeId; subtype: string; templateId: string; templateVersion: number; purpose: string; scored: boolean;
  text: string; correct: string; raw: string; verdict: string; outcome?: string;
  assisted: boolean; hintLevel: number; solutionShown: boolean; explanationShown: boolean;
  rapidGuess: boolean; postFeedback: boolean; interrupted: boolean; excluded: boolean;
  trapId?: string; errorClass?: string;
  firstKeyMs: number; submitMs: number; edits: number; focusLostMs: number;
  scratchKind: string; glossaryOpened: string[]; termsRisky: string[];
  sessionMinute: number; fatigued: boolean; thresholdVersion: string;
}

interface LimitsResult {
  stepsHeld: number | null;              // the highest k on the ladder
  intermediateAnswerShare: number;
  endurance: { points: { at: "start" | "middle" | "end" | "ext"; medianMs: number;
                         correct: number; total: number }[];
               slowdown: number; accuracyFlag: boolean };
  baseSpeed: { factMs: Record<string, number>; slowFacts: string[]; wrongFacts: string[] };
  scratch: { node: NodeId; withScratch: number; without: number }[];
  errorMix: Record<"conceptual" | "procedural" | "fact" | "slip" | "unclassified", number>;
  slips: number; impulsive: number; avoidance: number;
  rapidGuessShare: number;               // share of answers faster than minMs
  anxiety: { altStreaks: number; lateRapidGuessRise: boolean; hesitations: number; phrases: number };
  flow: { successShare: number; reviewShare: number; inCorridor: boolean };
  languageRisk: { term: string; nodes: NodeId[] }[];
  help: { assistedFirstShare: number; dontKnowFirstShare: number; secondAttemptSuccess: number;
          explanationsShown: number; hintLevels: Record<1 | 2 | 3, number> };
}

type NodeState = "not_mastered" | "understands" | "fluent" | "stable"
               | "in_progress" | "fluent_inferred" | "cut" | "stretch_untested";
```

### The draft marks an attempt as assisted when help came before the answer

`AttemptSubmitted.assisted` is true for a second attempt and for an attempt
that followed a hint. The field `interrupted` marks a task paused midway: its
accuracy counts in the estimate and its time doesn't. `ItemShown.correct`
stays on the server and doesn't reach the client before the attempt. The
`Verdict.outcome` field exists only for the first attempt.

### The draft lists the SQLite tables and what kind each one is

The draft's table list, translated:

| Table | Kind | What it stores |
| --- | --- | --- |
| `events` | truth | the event log (the `Event` envelope); only grows, triggers forbid `UPDATE` and `DELETE` |
| `blobs` | truth | file metadata by hash (scratchpad snapshots); the files themselves are `data/blobs/<sha256>.webp` |
| `devices` | service | devices, tokens (hashes), type, last sign-in, revocation |
| `llm_log` | service | every LLM request and response, cost (the `llm_call` event points to the record) |
| `art_jobs` | service | the graphics generation queue, variants, judge scores |
| `explain_cache` | cache | explanation texts with placeholders, keyed by "template + version + trap + graph form + familiar + prompt version", status (hidden by the parent) |
| `frames` | service | live frames and their statuses only (the library is in `content/frames.ru.json`) |
| `bakeoff` | service | candidate model answers, anonymous keys, automatic checks, scores |
| `items_view`, `attempts_view` | projection | shown tasks and attempts (`AttemptView`) |
| `node_estimates` | projection with model version | current `NodeEstimate` by node and subtype |
| `node_snapshots` | projection with model version | daily snapshots of estimates and states; snapshots from earlier model versions are kept for comparison |
| `limits`, `report_cache` | projection with model version | limits and the assembled report |
| `resume_snapshot` | projection | the `ResumeSnapshot` of the open adventure |
| `adventures`, `sessions` | projection | adventures and sessions: status, route, start, end, pauses, extensions, versions of graph, templates and thresholds |
| `thresholds` | projection | fluency thresholds with version and device type |
| `parent_tags` | projection | "practised in a lesson" tags, recheck dates |
| `story`, `scenes` | projection | campaign memory (summaries, facts, relations, running jokes from `plan_written` events), scenes and dialogues with the parent's marks |
| `familiars`, `inventory`, `progress`, `quests`, `threads` | projection | the heroine's familiars (name, traits, friendship, stage), items and materials, experience and level, quests of the day, stock of guiding threads |
| `outcomes`, `reward_queue` | projection | outcomes of rooms and floors; missed secrets with a deadline |
| `name_forms`, `line_shows`, `safety_events`, `interest_profile` | projection | case forms of names, counts of line shows, safety triggers, favourite characters and themes |
| `generated_entities`, `checkpoints` | later | items and creatures made by AI; Ascents |

Research on 2026-09-26 confirmed the `generated_entities` deferral when it
resolved when live art arrives: live art comes after the MVP with the AI-made
items and creatures this table would hold, and RES-2800 holds the comparison.

The tables `generated_entities` and `checkpoints` are deferred until after the
MVP by the draft.

### The draft forbids changes to the log at the database level

Triggers reject `UPDATE` and `DELETE` on `events`. Every derived table and
snapshot carries `DerivedMeta`: model, threshold and graph versions, the last
event sequence number it saw, and the time it was computed. Node snapshots
from earlier model versions are kept for comparison.

### The draft prepares three extensions for a Dutch stage

Everything is in Russian for now, and the draft names three extensions the
architecture is ready for. The Dutch stage is deferred until after the MVP by
the draft.

1. Locale. Task parameters don't depend on the language, and rendering is set
   per locale (`render.ru`, `render.nl`). All strings go through i18n keys.
   The notation profile (signs, thousands separator, time format) is part of
   the locale. Frames and the lexicon are separate files (`frames.nl.json`,
   `lexicon.nl.json`). The same parameters in two languages let the parent
   separate a language barrier from a gap in the maths.
2. Curriculum layer. Templates with `curriculum: "nl"` attach to nodes as extra
   subtypes: happend delen to A9, verhoudingstabel to P4, contextsommen to T1
   to T4.
3. Graph overlay. `graph.nl.yaml` adds nodes and links without changing the
   base graph. The session records which layers are on, and the report never
   mixes layers without an explicit choice.

## Conclusions

1. The event log must be the only source of truth for game and diagnostic
   data, and must only grow.
2. The database must reject every `UPDATE` and `DELETE` on the event log.
3. Every projection must be rebuildable from the event log alone, by deleting
   it and running a full recompute.
4. Every event must carry a ULID, a global monotonic sequence number, server
   time, the device, the event type and a payload schema version.
5. Every derived table and snapshot must record the model, threshold and graph
   versions it was computed with, the last event sequence number it saw and
   the time it was computed.
6. A shown task must record its node, subtype, template and template version,
   seed, parameters, full rendered view, correct answer and short solution, so
   the task can be reproduced from the log.
7. The correct answer of a task must stay on the server until the player
   submits the first attempt.
8. An attempt must be recorded as assisted when it is a second attempt or when
   a hint came before the answer.
9. A task paused midway must count towards accuracy and must not count towards
   time.
10. The resume snapshot must be a projection of the log that restores the
    pending task, scene, rewards and break of the open adventure.
11. Snapshots of node estimates from earlier model versions must be kept when
    the model version changes.
12. Task parameters must not depend on the language, and every player-facing
    string must go through i18n keys, so a Dutch locale can be added without
    changing the parameters.
13. A Dutch graph overlay must add nodes and links without changing the base
    graph, and the report must not mix layers unless the parent chooses to.
14. Only `events` and `blobs` may hold truth, `explain_cache` must be a cache
    that can be emptied without losing a fact, and `devices`, `llm_log`,
    `art_jobs`, `frames` and `bakeoff` must be service tables; a full
    recompute must rebuild every other table and leave these seven untouched.

## Sources

- The owner's draft «Хроники Башни — спецификация», the opening paragraph and the subsections «Модель данных» and «Задел на голландский этап», read 2026-09-26; not kept in the repository - supports every finding above.
