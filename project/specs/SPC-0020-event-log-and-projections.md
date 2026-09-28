---
id: SPC-0020
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-2200, REQ-2202, REQ-2204, REQ-2206, REQ-2208, REQ-2210, REQ-2212, REQ-2214, REQ-2216, REQ-2218, REQ-2220, REQ-2222, REQ-2224, REQ-2226, REQ-2228, REQ-2230, REQ-2232, REQ-2234, REQ-2236, REQ-2238, REQ-2240, REQ-2242, REQ-3800, REQ-3802, REQ-3804, REQ-3808, REQ-3816, REQ-5062, REQ-5064, REQ-5066, REQ-5068, REQ-5070, REQ-5072, REQ-5074, REQ-5152, REQ-5154, REQ-5156, REQ-5168, REQ-5356, REQ-5358, REQ-5426]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The event log, its projections, the blob store and the export

## Scope

This document covers the append-only table `events`, the one function that writes it, the event envelope with its `profile` mark, the file's role record `db_role`, the event schemas with their owners and versions, the event types the log holds, the projections rebuilt from the log with their version record, the recompute, the blob store for draft-pad images and school snapshot files, the parameter rule for task templates, and the raw data export. It is written at the component level: tables, triggers, functions, modules, commands and files inside the `meowtower` container.

It leaves out what other documents and decisions define. The container, the database file's volume and durability, the migration runner, the snapshots and the two listeners are SPC-0010's. The routes that write events, idempotency per request and the resume point's contents are ADR-0030's. Each event type's payload beyond the facts this document names belongs to the decision that owns the type, as the schema's `owner` names it. The knowledge model and what its projections compute are ADR-0060's, the contents of `llm_log` are ADR-0100's, the report and the Parent Room's pages are ADR-0180's, and the budgets are in ADR-0190's Baselines table. The sandbox's files, snapshot, reset and confirmed actions are ADR-0340's; the school snapshot import, its parser and the export for the school are ADR-0310's. Erasing a fact from the log is not part of the system.

## Boundary

| Surface | What it is |
| --- | --- |
| Table `events` | The log. One row per event, never updated or deleted. Its column `profile` is `main` or `sandbox`. |
| Triggers `events_no_update`, `events_no_delete` | `BEFORE UPDATE ON events` and `BEFORE DELETE ON events`, each `RAISE(ABORT, 'events are append-only')`. |
| Trigger `events_profile_guard` | `BEFORE INSERT ON events`, `RAISE(ABORT, 'event profile does not match database')` when the new row's `profile` differs from the role in `db_role`, or when `db_role` holds no row. |
| Table `db_role` and its two triggers | One row, `id = 1`, whose `role` is `main` or `sandbox`; two triggers refuse any `UPDATE` or `DELETE` on it. |
| Table `blobs` and its two triggers | One row per stored file, keyed by its SHA-256 hash, with its size and media type; two triggers reject any change to a row and any removal, with the same message as `events`. |
| `appendEvents(ctx, events)` in `src/engine/events/` | The only code that inserts into `events`. `ctx` is `{ db, profile }`, which the caller builds. It takes one or more events and returns their `seq` and `id` once the transaction commits. |
| `src/shared/events.ts` | One zod schema per event type and payload version, each declaring its owning decision as `owner: "ADR-NNNN"`, and one upcaster from each version to the next. |
| Projection registry | The list of tables that are projections, each with the function that folds events into it. |
| Table `derived_meta` | One row per projection table: `model_version`, `threshold_version`, `graph_version`, `last_event_seq` and `computed_at`. |
| Tables `items_view` and `attempts_view` | The flat projections of tasks shown and of attempts that the export writes as `items` and `attempts`. |
| `./meowtower recompute` | Runs a full recompute inside `meowtower`, through `POST /recompute` on the Parent Room's listener, and prints the tables rebuilt, the last event and the time taken. |
| `./meowtower export` | Runs the export of the whole log inside `meowtower` and prints the output directory. |
| `GET /api/parent/export/<file>` | The export's files, served only on the loopback listener `http://localhost:8080`. |
| `data/blobs/<sha256>.<ext>` | Draft-pad images and school snapshot files, one file per hash, written once and set read-only; `<ext>` is `webp`, `pdf`, `png` or `jpg`. |
| `data/exports/<UTC timestamp>/` | One export: `events.jsonl`, `events.parquet`, `attempts.csv`, `attempts.parquet`, `items.csv`, `items.parquet` and `fields.csv`. |
| Failure states | `log_write_failed`, `log_guard_missing`, `event_schema_unknown`, `projection_diverged`, `recompute_failed`, `blob_changed`, `log_large`, `recompute_slow`, `SandboxEventRefused`, `database_role_mismatch`. |

### What this part requires from other parts

- SPC-0010 supplies the database opened with `synchronous=FULL` in the volume `meowtower-db`, the numbered migration runner and its snapshot before a pending migration, the loopback listener, the `./meowtower` command, the `data/` directory and the place where the parent sees notices.
- ADR-0030 supplies every route that records play, each calling `appendEvents`, and sets `idem_key` on the events a request writes.
- The owning decision of each type supplies the fields of its payload beyond the facts this document names, as a new schema version where events of the type exist.
- ADR-0340 supplies the sandbox's database file, opened with the role `sandbox`, the engine context `{ db, profile: "sandbox" }` its handlers pass, and the flag its route trees set for every request.
- ADR-0040 supplies the task templates and their parameter schemas; ADR-0060 supplies the knowledge projections, the model version and the model; ADR-0100 supplies the `llm_log` rows that `llm_call` points to; ADR-0120 supplies `explain_cache` and the explanation request; ADR-0180 supplies the report and the Parent Room page that links the export.
- ADR-0190 holds the budgets named here, and its verify command runs the checks this part adds.

### Permitted dependencies

- Only `appendEvents` inserts into `events`, and no code updates or deletes a row of it.
- A projection depends on the log and on the versioned content files only. It reads no clock, no random source and no network.
- A game projection doesn't import the knowledge model, the Director or the answer check, directly or through a shared module.
- The knowledge model reads no `puzzle_*` and no `school_snapshot_*` event; ADR-0280 and ADR-0310 state the checks that hold it.
- `explain_cache` is read only by the path that serves a requested explanation, in `src/server/explain/`, which also drains the cache and counts its rows; no projection, report or export reads it, and a check in the lint verb fails any other file under `src/` or `tools/` that names it.
- `appendEvents` takes its profile from the context it is given, never from the database handle.
- `sandbox_action_applied` is written only to a sandbox file.
- The export reads only its own `VACUUM INTO` copy, never the live database.

## Behaviour

### The event envelope

Every event has a `seq` that is an `INTEGER PRIMARY KEY AUTOINCREMENT`, so the log has one increasing order over all events and no number is used twice; an `id` that is a unique ULID; its `type`; and `v`, the version of its payload schema (REQ-3800). Every event carries `ts`, the server time in UTC, `client_ms`, the device time, and `device_id`, and carries `session_id` and `adventure_id` when it happens inside a session or an adventure (REQ-2202). An event the server writes on its own carries the device identifier `server` and the server time as its device time (REQ-2202). An event appended while a request on the sandbox's route trees is in progress carries the device identifier `sandbox`, whatever context its caller built (REQ-2202). The envelope also holds `payload` as JSON, `idem_key`, unique where present, and `profile`, `TEXT NOT NULL DEFAULT 'main'`, which is `main` in the player's file and `sandbox` in a sandbox file.

### Writing the log

`events` rejects every change and every removal: an `UPDATE` or `DELETE` on it fails with `events are append-only`, whichever code or connection runs it (REQ-2226). `db_role` rejects every change and removal the same way, and `events_profile_guard` refuses an insert whose `profile` differs from the file's role, so the player's file refuses a sandbox event and a sandbox file refuses a main one (REQ-2226). The guarded triggers are `events_no_update`, `events_no_delete`, `events_profile_guard`, the two triggers on `db_role` and the two on `blobs`. At start-up `meowtower` reads `sqlite_master`, matches each guarded trigger against its own expected message, and refuses to start when one is missing (REQ-2226). The migration runner refuses a migration whose SQL drops or replaces a guarded trigger (REQ-2226). A lint rule rejects SQL that names `events` outside `src/engine/events/` and the migrations, so every reader and the one writer of the log live in that directory (REQ-2226).

`openDatabase(path, { role })` writes the role into `db_role` on a file's first open and exits with `database_role_mismatch` when the stored role differs. `appendEvents` compares each event's profile with the role cached on the handle at open and throws `SandboxEventRefused` before the `INSERT`, so the trigger is the second guard. It then validates each payload against the schema for its type and version, inserts the rows, and applies each new event to every registered projection, in one transaction. The caller replies only after that transaction commits. When a payload fails its schema, or a type has no schema, nothing of the call is written (REQ-5062).

### Event schemas, owners and versions

The server writes an event only when `src/shared/events.ts` holds a schema for its type and version, and every schema names its owning decision as `owner` (REQ-5062). A check in ADR-0190's verify group 1 fails when a type has no owner, or when its owner isn't an approved decision in `project/adrs/`, naming the type (REQ-5062). A type whose owning decision's item hasn't started has no schema, so `appendEvents` refuses it: the six `school_snapshot_*` types have none until ADR-0310's item starts after the MVP (REQ-5062).

No event type, schema field or code path names the vendor of the school's learning system; the school's types are `school_snapshot_*` (REQ-5064). A check in verify group 1 searches `src/`, `content/` and `tools/` for the vendor's name, which `verify/scope-guard.json` lists, and fails on a hit, naming the file (REQ-5064).

A new payload version adds a schema and an upcaster from the version before it. Stored events are never rewritten, and projections read an old payload through the upcasters. At start-up `meowtower` refuses to start when the log holds a type or version that has no schema.

`item_shown`, `attempt_submitted` and `verdict` each have one payload version 2 that holds every field the owner's addendum 1 adds, each field optional, with an upcaster from version 1, so a version 1 event reads as a version 2 one and a stage that hasn't built an item leaves its field absent (REQ-5066). The upcaster fills `forms` with an empty list, `openingPhase` with `none` and `hintMaxLevel` with 3, and leaves the estimate fields absent (REQ-5066, REQ-5156). The version 2 fields are:

| Type | Version 2 fields | Owner of the field |
| --- | --- | --- |
| `item_shown` | `forms`, the list of new forms the task uses, empty for an ordinary task and for an estimate | ADR-0210 |
| `item_shown` | the estimate's four option values and the index of the correct one | ADR-0240 |
| `item_shown` | `withheldGiven` and `unusedGiven` | ADR-0250 |
| `item_shown` | `openingPhase`: `none`, `model` or `plan` | ADR-0270 |
| `item_shown` | `track: "sources"` and `questionLevel` | ADR-0300 |
| `attempt_submitted` | `hintMaxLevel`, 0 to 3, beside `hintLevel`, 0 to 3 | ADR-0220 |
| `attempt_submitted` | `estimate`, with `option` (0 to 3) and `value` (a rational), and `timings.checkMs` | ADR-0240 |
| `attempt_submitted` | `insufficient`, with `missing` (0 to 3 or `null`) | ADR-0250 |
| `attempt_submitted` | `openingPhase`, and no `planChoice` | ADR-0270 |
| `attempt_submitted` | a `region` index as a raw answer | ADR-0300 |
| `verdict` | `estimateRight` and `estimateLabel` | ADR-0240 |
| `verdict` | the verdicts `insufficient_correct`, `insufficient_partial` and `false_insufficient`, and the classes `answered_insufficient` and `used_extra_data` | ADR-0250 |

Other types have a version 2 of their own, each with an upcaster:

| Type | Version 2 | Upcaster from version 1 |
| --- | --- | --- |
| `hint_shown` | a hint rung shown to the player, with `ladderOpenedBy`: `thread` or `free_step` (REQ-5068, REQ-5152) | reads the rung as shown |
| `thread_spent` | a guiding thread spent on opening a task's or a Diary puzzle's hint ladder, reason `hint_ladder`, or on an explanation, reason `explanation`, with the task's `itemId`, or the puzzle's id when the spend is for a puzzle (REQ-5070, REQ-5154) | version 1's reason `hint` stays readable, and the server never writes it again |
| `free_text` | adds `origin` (`own`, `starter_edited` or `starter_unchanged`) and `ownWords` | sets `origin: "own"` and counts `ownWords` |
| `item_excluded` | adds `source` (`parent_room` or `sandbox`), and `templateId`, `templateVersion` and `paramsHash` in place of an `itemId` for a task generated in the sandbox | sets `source: "parent_room"` |

`rest_stop_ended` carries a reason, `tap`, `timeout`, `puzzle_opened` or `screen_opened` with the screen's name, and `save_accepted` a reason, `adventure` or `puzzle`, each in a new payload version (ADR-0280). `settings_changed` records a sound change with the key `sound.music` or `sound.effects` and the value `{ on, volume }`, and `looks_set` refuses a sound field (ADR-0320). `school_goal_mapped` is keyed by `goalKey` (ADR-0310).

A correction is a new event, such as `item_excluded`, `item_flagged`, `parent_tag_removed`, `content_restored` or `school_snapshot_corrected`, which the projections apply; the event it corrects stays as it was (REQ-2228).

### What the log records

Each schema requires at least the facts in this table, so an event that lacks one of them is refused. A version 2 field of `item_shown`, `attempt_submitted` or `verdict` in this table, such as `forms` or the ladder length, is optional in the schema and written on every event once the stage that builds its item is in play, as the section above states.

| Fact | Event types | Requirement |
| --- | --- | --- |
| A task shown: its full rendered view with its `locale`, template and template version, seed, parameters, node, subtype, purpose, attempt number and `forms` | `item_shown` | REQ-2204 |
| A second attempt's link to the task it follows, as `parentItemId` | `item_shown` | REQ-2206 |
| The correct answer and the short solution of a task shown, as they would be shown | `item_shown` | REQ-3804 |
| An attempt: its input summary (time to the first key press, time of submission, edits and erasures, key presses, focus losses with their duration, input method), the answer as entered and as parsed, the assisted flag, the hint level and the ladder length | `attempt_submitted` | REQ-2208, REQ-5156 |
| The verdict, the game outcome, the trap, the error class and the step matching of an attempt | `verdict` | REQ-2208 |
| Each hint rung shown on a task, whether or not a thread paid for it, as `thread` when its request spent the thread and `free_step` when it was shown free | `hint_shown` | REQ-2208, REQ-5068, REQ-5152 |
| Each guiding thread spent, on opening a hint ladder with the reason `hint_ladder` or on an explanation with the reason `explanation` | `thread_spent` | REQ-2208, REQ-5070, REQ-5154 |
| Whether and for how long the short solution and the detailed explanation were shown, the latter with `dwellMs` and never its text | `solution_shown`, `explanation_shown` | REQ-2208 |
| The estimate: the option she picked, as the field `estimate` of the attempt, and whether it was right, as `estimateRight` on the verdict | `attempt_submitted`, `verdict` | REQ-5358 |
| Each use of the inverse check: `itemId`, the preliminary answer as `preliminaryRaw`, the value she typed as `checkRaw` and `checkParsed`, the `target` and whether it matched, as `match` | `self_check_used` | REQ-5356 |
| An answer of «Нельзя узнать» (can't be known), as one of the verdicts `insufficient_correct`, `insufficient_partial` or `false_insufficient`, each distinct from `dont_know` and from each other | `verdict` | REQ-5426 |
| A draft-pad image as it stood when the answer was submitted, by its SHA-256 hash | `scratch_snapshot` | REQ-2210 |
| A term-hint tap, with the term and the `itemId` | `glossary_opened` | REQ-2212 |
| Every scene shown, every choice, her free text in its cleaned form with its origin and her own word count, and every name she gives | `scene_shown`, `choice_made`, `free_text`, `name_given` | REQ-2214 |
| Every economy event: rewards, chests offered and chosen, forging, purchases, levels, quest progress, familiar friendship, hatching and evolution, and threads earned and spent | `reward_granted`, `chest_offered`, `chest_chosen`, `forge_crafted`, `shop_purchase`, `level_up`, `quest_progress`, `familiar_friendship`, `familiar_hatched`, `familiar_evolved`, `thread_granted`, `thread_spent` | REQ-2216 |
| Every pause, resume, change of device, eye exercise with how it ended, rest stop, soft stop and extension | `adventure_paused`, `adventure_resumed`, `device_lease_taken`, `eye_exercise`, `eye_exercise_ended`, `rest_stop_offered`, `rest_stop_started`, `rest_stop_ended`, `soft_stop`, `extension` | REQ-2218 |
| Every parent action: lesson tags added and removed, tasks flagged or excluded, settings changed, content disabled and restored, framing lines and puzzles approved or rejected, the mark «тренировали факты» (we trained facts), horizons, test results, school goals and their mapping, the fact threshold, the day marks, reaction lines flagged and riddles labelled | `parent_tag_added`, `parent_tag_removed`, `item_flagged`, `item_excluded`, `settings_changed`, `content_disabled`, `content_restored`, `rung_framing_approved`, `rung_framing_removed`, `puzzle_approved`, `puzzle_rejected`, `facts_trained_marked`, `horizon_set`, `external_test_recorded`, `school_goals_imported`, `school_goal_mapped`, `fact_threshold_set`, `parent_day_marked`, `reaction_line_flagged`, `compose_labelled` | REQ-2220 |
| Every safety event, and a reference to the `llm_log` row of every model call, in the same database file as that row | `safety_event`, `llm_call` | REQ-2222 |

The parent's approval of a puzzle is `puzzle_approved` for the puzzle's hash; the parent's approval of a hint rung's framing is `rung_framing_approved`; each time a template or a puzzle is turned off is `content_disabled`, with `kind` (`template` or `puzzle`), `id`, `source` and `echo`; and the mark «тренировали факты» is `facts_trained_marked`, with `facts`, `lessonDate` and an optional `note` (REQ-5074). A sandbox action that changes the player's game is written once to the player's file as that action's own event with `source: "sandbox"`; ADR-0340 states the confirmed actions.

### One record per fact

Each estimate, grouping, plan choice and self-check is recorded in one place only (REQ-5072). A fact that arrives in the same request as the answer is a field of `attempt_submitted`, and a fact she commits before the answer is an event type of its own (REQ-5072). So the estimate is the field `estimate` of `attempt_submitted`, and no `estimate_submitted` type exists (REQ-5072). The grouping is `grouping_submitted`, and the grouping an attempt submits is the last `grouping_submitted` of that attempt before its `attempt_submitted`; when she drew nothing, the server appends a `grouping_submitted` with an empty set and `none` in the attempt's transaction (REQ-5072). Each self-check is `self_check_used`, and the preliminary answer is logged only there, never as `attempt_submitted` (REQ-5072, REQ-5356). The plan is `plan_submitted`, which names the attempt it belongs to and carries `planChoice`, and `attempt_submitted` carries no `planChoice` (REQ-5072). `attempt_submitted` carries no `grouping` and no `selfCheck` field, and no `self_corrected` type exists: the report derives a saved or spoiled answer from `self_check_used` and the attempt that follows it (REQ-5072).

### Hint rungs and the resume

Opening a task's hint ladder logs one `thread_spent` with the reason `hint_ladder` and one `hint_shown` with `ladderOpenedBy: "thread"` for rung 1 (REQ-5154, REQ-5152). Each later rung on the same attempt logs `hint_shown` with `ladderOpenedBy: "free_step"` and no `thread_spent` (REQ-5152, REQ-5068). A ladder the familiar opens free logs `free_step` on every rung, and a reader tells it from a rung after a paid opening by whether the task has a `thread_spent` with the reason `hint_ladder` (REQ-5152). A Diary puzzle's rung is a `puzzle_hint` with the same `ladderOpenedBy` values and writes no `hint_shown` (REQ-5152, REQ-5072).

`attempt_submitted` carries `hintMaxLevel`, the number of rungs the task's ladder has, fixed when the task was shown, beside `hintLevel`, the deepest rung she saw, so a rung 1 on a one-rung ladder reads apart from rung 1 of three (REQ-5156).

The `resume_snapshot` projection keeps, for the task in progress, whether its ladder is open and which rungs she saw. A resume shows them again, spends no thread and writes no `hint_shown` for a rung she already saw (REQ-5168).

### Event types the addendum's decisions own

Each type below has its schema and owner in `src/shared/events.ts`, and the server writes none of them before that schema exists (REQ-5062). The owner defines the payload beyond what this document names.

| Event types | Owner | What they record | Requirement |
| --- | --- | --- | --- |
| `bridge_word_seen`, `bridge_card_opened`, `bridge_check_answered`, `facts_trained_marked` | ADR-0210 | a task with Dutch bridge keywords shown, a word card opened, a short check on a word answered, and the parent's mark «тренировали факты» | REQ-5062, REQ-5074 |
| `rung_framing_approved`, `rung_framing_removed` | ADR-0220 | the parent's approval of one framing line, with `framingId`, `familiarKind`, `rung`, `textHash` and `edited`, and its removal from play | REQ-5062, REQ-5074 |
| `compose_shown`, `compose_submitted`, `compose_parsed`, `compose_confirmed`, `compose_labelled` | ADR-0230 | a riddle offered, her text or cards, the parse, her confirmation with the riddle's verdict, and the parent's label | REQ-5062 |
| `self_check_used` | ADR-0240 | one use of the inverse check | REQ-5062, REQ-5356 |
| `refusal_guard_changed` | ADR-0250 | the refusal guard raised or cleared, with `state`, `itemIds`, `count` and `share` | REQ-5062 |
| `grouping_submitted` | ADR-0260 | a grouping task's links and mark as drawn, each set with its score | REQ-5062, REQ-5072 |
| `plan_submitted`, `plan_draft` | ADR-0270 | a plan: the cards she laid in order, the cards shown, its graph, `planChoice`, its faults, its help and the control that ended it, with the attempt it belongs to; and a partly laid plan, the newest per item, which a resume in `plan` restores | REQ-5062, REQ-5072 |
| `puzzle_offered`, `puzzle_opened`, `puzzle_move`, `puzzle_attempt`, `puzzle_hint`, `puzzle_solved`, `puzzle_shelved`, `puzzle_unshelved`, `puzzle_closed`, `puzzle_approved`, `puzzle_rejected` | ADR-0280 | a Diary puzzle's life from offer to close, and the parent's approval or rejection of it | REQ-5062, REQ-5074 |
| `horizon_set`, `external_test_recorded`, `school_goals_imported`, `school_goal_mapped`, `cito_rule_checked`, `volley_started`, `volley_completed`, `fact_threshold_set` | ADR-0290 | test horizons, Cito results, the parent's school goals and their mapping, a check of the Cito facts, the Volley, and the fact threshold | REQ-5062 |
| `school_snapshot_imported`, `school_snapshot_parsed`, `school_snapshot_corrected`, `school_snapshot_withdrawn`, `school_snapshot_goal_linked`, `school_snapshot_goal_unlinked` | ADR-0310, after the MVP | a school snapshot file kept, each parse of it, the parent's corrections and withdrawal, and its goals' links to nodes | REQ-5062, REQ-5064 |
| `eye_exercise_ended`, `reaction_line_shown`, `reaction_line_flagged` | ADR-0320 | how an eye exercise ended, with `kind`, `endedBy` and `activeMs`; a prepared line shown after her free text; the parent's flag on such a line | REQ-5062 |
| `system_unlocked`, `route_offered`, `route_chosen`, `free_pen_started`, `free_pen_ended`, `starter_inserted`, `share_card_created`, `share_card_viewed`, `scene_rewatched`, `chapter_reread`, `scene_favorited`, `hidden_detail_found`, `parent_day_marked`, `text_freshness_scored` | ADR-0330 | the systems opened, the day's two routes and her choice, the Free Pen, starters, share cards, rewatches and rereads, favourites, hidden details, the parent's day marks, and the freshness score of the Master's text | REQ-5062 |
| `content_disabled`, `content_restored`, `sandbox_action_applied` | ADR-0340 | a template or puzzle turned off or back on, and, in a sandbox file only, a pointer to the player's-file event a confirmed action wrote | REQ-5062, REQ-5074 |
| `judge_route_changed` | ADR-0350 | a judge check's route changed, with `check`, `route`, `model`, `modelHash`, `runtimeBuild` and `reason` | REQ-5062 |

### The blob store

When an answer arrives with a draft-pad image, `meowtower` hashes the WebP with SHA-256, creates `data/blobs/<sha256>.webp` with exclusive create so an existing file is never overwritten, sets it read-only, syncs it and its directory to disk, inserts the `blobs` row with the hash, size and media type, and only then appends `scratch_snapshot` with the hash (REQ-2210). Hashing the file again shows whether it changed since (REQ-2210). `meowtower` refuses an image larger than 512 KB (ADR-0020); the client scales the pad to at most 1024 px on its long side before sending.

A school snapshot file enters the same store in the same order, as `data/blobs/<sha256>.<ext>` with `<ext>` `pdf`, `png`, `jpg` or `webp`, before its `school_snapshot_imported` event; ADR-0310 states the import. The store takes a school file of at most 25 MB in PDF, PNG, JPEG or WebP, and a PDF of at most 20 pages (ADR-0310). The verify check `blob_changed` re-hashes every file in `data/blobs/`, of every extension.

### Task parameters

Every template's parameter schema admits numbers, exact rationals as a numerator and a denominator, booleans and enum identifiers, and no free string, so a task's parameters don't depend on the display language (REQ-3808). A static check in the lint verb walks every template's parameter schema and fails on a string-typed field (REQ-3808). The rendered view in `item_shown` carries its `locale`, `ru` for now.

### Projections

Every game and diagnostic table other than `events` and the service tables below is a projection: a pure function of the log and the versioned content files, registered in the projection registry. The game projections (`adventures`, `sessions`, `inventory`, `progress`, `quests`, `threads`, `familiars`, `outcomes`, `reward_queue`, `resume_snapshot`, `items_view`, `attempts_view`, `disabled_content`, `systems_open`, `school_values`, `school_snapshot_changes` and the others RES-2550 lists) fold only the decisions the log holds, so a recompute under new model, threshold or graph versions leaves every logged outcome, reward and branch as it was (REQ-2224). The knowledge projections (`node_estimates`, `node_snapshots`, `limits`, `report_cache`, `thresholds`, `fact_states`, `estimate_stream` and the frontier) are the ones a new model or threshold version changes. The streams of the new forms, `grouping_stream`, the composing stream, the `plan` stream and `check_week`, and `phrase_counts` and `cito_rules`, are registered projections too, rebuilt by every recompute.

Every projection records the model, threshold and graph versions it was computed with, the `seq` of the last event it took in, and the time it was computed, in its `derived_meta` row (REQ-3802). Each `node_snapshots` row carries the three versions too, and rows from earlier model versions stay beside the current ones (REQ-3802).

These service tables are not projections, and no recompute registers or touches them: `blobs`, `explain_cache`, `devices`, `llm_log`, `art_jobs`, `frames`, `bakeoff`, `db_role` and `local_judge_files` (REQ-2242). In a sandbox file the same tables hold the sandbox's own rows.

### Recompute

A full recompute builds every registered projection into a shadow table `<name>__next` from `seq` 1 while play goes on, catches up to the head of the log, then in one short transaction applies the events that arrived meanwhile and swaps each shadow table in (REQ-2200). With the same model, threshold and graph versions, every rebuilt table holds the same rows as before in every column except `computed_at` (REQ-2200). It keeps the `node_snapshots` rows of earlier model versions and adds rows under the current one. It uses the graph version in the content files. `./meowtower recompute` runs it on demand.

The build runs on the server's connection in chunks of 500 events, each its own transaction, yielding between them, so an append waits at most for one chunk; it builds up to the head of the log as it stood at the start, and the swap's transaction folds in the rest. A projection folds each event into the table it is given, its own or its shadow, from one table definition. A recompute that fails drops its shadow tables and leaves the projections as they were. The check `projection_diverged` derives each projection afresh and reports the table with its first differing row, as stored and as derived. `recompute_failed`, `recompute_slow` and `log_large` join the parent's notices in `data/snapshots/notices.json` that SPC-0010 describes, and `log_large` is checked when a session ends.

At start-up, before it accepts a play request, `meowtower` rebuilds every registered projection table that is missing (REQ-2232). It then runs a full recompute when the model or threshold version in the content files differs from `derived_meta` (REQ-2230). A change of the fact threshold, logged as `fact_threshold_set`, makes the `thresholds` projection a new threshold version, and appending it starts a full recompute that replays every fact under the new value (REQ-2230). The versions come from `content/versions.json` until the model, threshold and graph files name their own, and the server reads them before it opens the database, since a table rebuilt at open records them. A start-up recompute that fails leaves the old projections, raises `recompute_failed` and lets the server start. A graph version change triggers no recompute yet.

A projection marked `versioned`, `node_snapshots` among them, carries the model, threshold and graph versions in its rows; a recompute keeps the rows of other versions and rebuilds the current versions' rows, and the check `projection_diverged` compares the current versions' rows only. `node_snapshots` stays empty until the knowledge model of ADR-0060 is set.

A check in the lint verb follows each game projection's runtime imports, type-only imports aside, and fails one that reaches `src/engine/model/`, `src/engine/states/`, `src/engine/director/` or `src/shared/answer.ts`, directly or through any module between, naming the chain (REQ-2224). The knowledge projections and the registry are not game projections for this check.

### The explanation cache

`explain_cache` is read only when an explanation is requested. `explanation_shown` records what was shown, so emptying the cache changes no event, no projection and no report (REQ-3816). Migration `0008_explain_cache.sql` creates the table with ADR-0120's columns. After the cache is emptied, a requested explanation falls back to live generation or the template explanation.

### The export

`./meowtower export` runs the export of the whole log inside `meowtower` on the Mac (REQ-2238). It takes a fresh `VACUUM INTO` copy, reads only that copy, and writes `data/exports/<UTC timestamp>/`. The directory holds the raw log as `events.jsonl`, one event a line, and as `events.parquet` (REQ-2234); the flat tables of attempts and of tasks shown as `attempts.csv`, `attempts.parquet`, `items.csv` and `items.parquet` (REQ-2236); and `fields.csv`, the field dictionary generated from the zod schemas' descriptions. DuckDB, through `@duckdb/node-api`, writes the Parquet files. The export for the school is a second export, which ADR-0310 states.

The Parent Room offers the same export through `GET /api/parent/export/<file>` on the loopback listener only; the same path through `https://<mac-name>.local` answers 404, so a Parent Room opened on another device offers no export (REQ-2240).

## Failure paths

| Condition | What happens |
| --- | --- |
| Any code runs `UPDATE` or `DELETE` on `events` or `db_role`, or changes a `blobs` row's hash | SQLite aborts the statement, and the row stays as it was; on `events` and `blobs` the message is `events are append-only`. |
| An event's profile differs from the file's role | `appendEvents` throws `SandboxEventRefused` before the insert and writes nothing of the call; code that bypasses it meets `events_profile_guard`, which aborts with `event profile does not match database`. |
| A file's stored role differs from the role it is opened with | `openDatabase` exits with `database_role_mismatch`. |
| `db_role` holds no row | `events_profile_guard` refuses every insert. |
| The transaction in `appendEvents` fails, for example on a full disk | `meowtower` raises `log_write_failed` as a Parent Room notice and in `./meowtower status`, and replies 503. The client keeps the answer in its queue and shows the player the same waiting scene as `server_unreachable`. |
| A payload fails its schema | `appendEvents` writes nothing of the call and throws, naming the type, version and field. |
| An event's type has no schema, such as a `school_snapshot_*` type before ADR-0310's item starts | `appendEvents` writes nothing of the call and throws, naming the type. |
| A schema declares no owner, or an owner that isn't an approved decision | The verify group 1 check fails, naming the type. |
| A file under `src/`, `content/` or `tools/` holds the vendor's name | The verify group 1 check fails, naming the file. |
| A guarded trigger on `events`, `db_role` or `blobs` is missing at start-up | `meowtower` exits with `log_guard_missing`, naming the trigger. |
| A pending migration drops or replaces a guarded trigger | The migration runner refuses it, applies nothing of it, and `meowtower` doesn't start. |
| The log holds a type or version with no schema | `meowtower` exits with `event_schema_unknown`, naming the type and version. |
| A stored projection differs from a fresh derivation of the log | The verify command reports `projection_diverged` with the table and the first differing row. |
| A recompute fails | The old projections stay in place, `meowtower` raises `recompute_failed` to the parent with the version that failed and when, and play goes on. |
| A full recompute of one year's log takes longer than 60 seconds | `meowtower` raises `recompute_slow` once, against the budget in ADR-0190's Baselines table; play isn't blocked. |
| `events` passes 1 GB | `meowtower` raises `log_large` once, as a Parent Room notice. |
| A file in `data/blobs/` no longer hashes to its name | The verify command reports `blob_changed`, naming each such file. |
| A draft-pad image is larger than 512 KB | `meowtower` refuses it, and no `blobs` row or `scratch_snapshot` event is written. |
| A school snapshot file is over 25 MB, a PDF of more than 20 pages, or of a type other than PDF, PNG, JPEG or WebP | `meowtower` refuses it, and no file, `blobs` row or event is written. |
| A file for a new image's hash already exists | The exclusive create fails, `meowtower` keeps the existing file and its row, and logs `scratch_snapshot` with that hash. |
| A resume restores a hint rung she already saw | No `hint_shown` and no `thread_spent` is written for it. |
| A template's parameter schema has a string-typed field | The lint verb's static check fails, naming the template and field. |
| An export is requested through `https://<mac-name>.local` | `meowtower` answers 404. |

## Open review findings

- An agent reviewer asked for every game projection to be named here and for each new stream projection to be put in the game or the knowledge class, because the import check of REQ-2224 depends on the class. I kept the list as it is, because the decisions that register `grouping_stream`, the composing stream, the `plan` stream, `check_week`, `phrase_counts` and `cito_rules` don't place them in either class, and a spec that picked one would decide what no approved decision has.
- The reviewer found that a crash between the synced blob file and its `blobs` row leaves a file with no row, and the next upload of the same image then finds the file and no row. I left the failure path as it is, because no approved decision says how `meowtower` recovers from it; the decision that owns the blob store, ADR-0020 as ADR-0310 amends it, has to set the recovery.
- The reviewer asked for a reason beside the 512 KB, 25 MB, 20-page and 500-event limits, the export's `VACUUM INTO` copy, the refusal of a sound field in `looks_set` and the graph version that triggers no recompute. I kept them without reasons, because a specification states what the system does and the reasons live in the decisions.
- A second agent reviewer found that the upcasters leave version 1 hints unread: `thread_spent` version 1's reason `hint` isn't mapped to a paid opening, and the `hint_shown` upcaster names no `ladderOpenedBy`, so the rule that tells a paid ladder from a free one misreads version 1 tasks. No approved decision gives these upcaster values, so the owner of `hint_shown` and `thread_spent`, ADR-0080 as ADR-0220 amends it, has to set them.
- The second reviewer found that the threshold version has two sources once the log holds `fact_threshold_set`: `content/versions.json` and the `thresholds` projection, and start-up compares only the first with `derived_meta`. No approved decision says which source `derived_meta` records or what start-up compares after a parent's change, so ADR-0290 and ADR-0180, which own the fact threshold and the `thresholds` projection, have to settle it.
- The second reviewer asked for the upcaster values of `rest_stop_ended` and `save_accepted` version 2. ADR-0280, which adds their reasons, gives none, so this document names the owner beside the rule and leaves the values to it.
