---
id: SPC-0020
artifact: spec
status: live
revised: 2026-09-27
checked-at:
states: [REQ-2200, REQ-2202, REQ-2204, REQ-2206, REQ-2208, REQ-2210, REQ-2212, REQ-2214, REQ-2216, REQ-2218, REQ-2220, REQ-2222, REQ-2224, REQ-2226, REQ-2228, REQ-2230, REQ-2232, REQ-2234, REQ-2236, REQ-2238, REQ-2240, REQ-2242, REQ-3800, REQ-3802, REQ-3804, REQ-3808, REQ-3816]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The event log, its projections, the blob store and the export

## Scope

This document covers the append-only table `events`, the one function that writes it, the event schemas and their versions, the projections rebuilt from the log with their version record, the recompute, the blob store for draft-pad images, the parameter rule for task templates, and the raw data export. It is written at the component level: tables, triggers, functions, modules, commands and files inside the `meowtower` container.

It leaves out what other documents and decisions define. The container, the database file's volume and durability, the migration runner, the snapshots and the two listeners are SPC-0010's. The routes that write events, idempotency per request and the resume point's contents are ADR-0030's. Each event type's payload beyond the facts this document names belongs to the decision that owns the type in ADR-0020's Event catalogue. The knowledge model and what its projections compute are ADR-0060's, the contents of `llm_log` are ADR-0100's, the report and the Parent Room's pages are ADR-0180's, and the budgets are in ADR-0190's Baselines table. Erasing a fact from the log is not part of the system.

## Boundary

| Surface | What it is |
| --- | --- |
| Table `events` | The log. One row per event, never updated or deleted. |
| Triggers `events_no_update`, `events_no_delete` | `BEFORE UPDATE ON events` and `BEFORE DELETE ON events`, each `RAISE(ABORT, 'events are append-only')`. |
| Table `blobs` and its two triggers | One row per stored image, keyed by its SHA-256 hash; two triggers reject any change to a row and any removal, with the same message as `events`. |
| `appendEvents` in `src/engine/events/` | The only code that inserts into `events`. It takes one or more events and returns their `seq` and `id` once the transaction commits. |
| `src/shared/events.ts` | One zod schema per event type and payload version, and one upcaster from each version to the next. |
| Projection registry | The list of tables that are projections, each with the function that folds events into it. |
| Table `derived_meta` | One row per projection table: `model_version`, `threshold_version`, `graph_version`, `last_event_seq` and `computed_at`. |
| Tables `items_view` and `attempts_view` | The flat projections of tasks shown and of attempts that the export writes as `items` and `attempts`. |
| `./meowtower recompute` | Runs a full recompute inside `meowtower`, through `POST /recompute` on the Parent Room's listener, and prints the tables rebuilt, the last event and the time taken. |
| `./meowtower export` | Runs the export inside `meowtower` and prints the output directory. |
| `GET /api/parent/export/<file>` | The export's files, served only on the loopback listener `http://localhost:8080`. |
| `data/blobs/<sha256>.webp` | Draft-pad images, one file per hash, written once. |
| `data/exports/<UTC timestamp>/` | One export: `events.jsonl`, `events.parquet`, `attempts.csv`, `attempts.parquet`, `items.csv`, `items.parquet` and `fields.csv`. |
| Failure states | `log_write_failed`, `log_guard_missing`, `event_schema_unknown`, `projection_diverged`, `recompute_failed`, `blob_changed`, `log_large`, `recompute_slow`. |

### What this part requires from other parts

- SPC-0010 supplies the database opened with `synchronous=FULL` in the volume `meowtower-db`, the numbered migration runner and its snapshot before a pending migration, the loopback listener, the `./meowtower` command, the `data/` directory and the place where the parent sees notices.
- ADR-0030 supplies every route that records play, each calling `appendEvents`, and sets `idem_key` on the events a request writes.
- The owning decision of each type in ADR-0020's Event catalogue supplies the fields of its payload beyond the facts this document names, as a new schema version where events of the type exist.
- ADR-0040 supplies the task templates and their parameter schemas; ADR-0060 supplies the knowledge projections, the model version and the model; ADR-0100 supplies the `llm_log` rows that `llm_call` points to; ADR-0120 supplies `explain_cache` and the explanation request; ADR-0180 supplies the report and the Parent Room page that links the export.
- ADR-0190 holds the budgets named here, and its verify command runs the checks this part adds.

### Permitted dependencies

- Only `appendEvents` inserts into `events`, and no code updates or deletes a row of it.
- A projection depends on the log and on the versioned content files only. It reads no clock, no random source and no network.
- A game projection doesn't import the knowledge model, the Director or the answer check, directly or through a shared module.
- `explain_cache` is read only by the path that serves a requested explanation, in `src/server/explain/`, which also drains the cache and counts its rows; no projection, report or export reads it, and a check in the lint verb fails any other file under `src/` or `tools/` that names it.
- The export reads only its own `VACUUM INTO` copy, never the live database.

## Behaviour

### The event envelope

Every event has a `seq` that is an `INTEGER PRIMARY KEY AUTOINCREMENT`, so the log has one increasing order over all events and no number is used twice; an `id` that is a unique ULID; its `type`; and `v`, the version of its payload schema (REQ-3800). Every event carries `ts`, the server time in UTC, `client_ms`, the device time, and `device_id`, and carries `session_id` and `adventure_id` when it happens inside a session or an adventure (REQ-2202). An event the server writes on its own carries the device identifier `server` and the server time as its device time (REQ-2202). The envelope also holds `payload` as JSON and `idem_key`, unique where present.

### Writing the log

`events` rejects every change and every removal: an `UPDATE` or `DELETE` on it fails with `events are append-only`, whichever code or connection runs it (REQ-2226). At start-up `meowtower` reads `sqlite_master` and refuses to start when either trigger on `events` or on `blobs` is missing (REQ-2226). The migration runner refuses a migration whose SQL drops or replaces one of those triggers (REQ-2226). A lint rule rejects SQL that names `events` anywhere but in `appendEvents` and the migrations (REQ-2226).

`appendEvents` validates each payload against the schema for its type and version, inserts the rows, and applies each new event to every registered projection, in one transaction. The caller replies only after that transaction commits. When a payload fails its schema, nothing of the call is written.

A new payload version adds a schema and an upcaster from the version before it. Stored events are never rewritten, and projections read an old payload through the upcasters. At start-up `meowtower` refuses to start when the log holds a type or version that has no schema.

A correction is a new event, such as `item_excluded`, `item_flagged` or `parent_tag_removed`, which the projections apply; the event it corrects stays as it was (REQ-2228).

### What the log records

The type names are those of ADR-0020's Event catalogue. Each schema requires at least the facts in this table, so an event that lacks one of them is refused.

| Fact | Event types | Requirement |
| --- | --- | --- |
| A task shown: its full rendered view with its `locale`, template and template version, seed, parameters, node, subtype, purpose and attempt number | `item_shown` | REQ-2204 |
| A second attempt's link to the task it follows, as `parentItemId` | `item_shown` | REQ-2206 |
| The correct answer and the short solution of a task shown, as they would be shown | `item_shown` | REQ-3804 |
| An attempt: its input summary (time to the first key press, time of submission, edits and erasures, key presses, focus losses with their duration, input method), the answer as entered and as parsed, the assisted flag and the hint level | `attempt_submitted` | REQ-2208 |
| The verdict, the game outcome, the trap, the error class and the step matching of an attempt | `verdict` | REQ-2208 |
| The hints shown and the guiding threads spent on an attempt | `hint_shown`, `thread_spent` | REQ-2208 |
| Whether and for how long the short solution and the detailed explanation were shown, the latter with `dwellMs` and never its text | `solution_shown`, `explanation_shown` | REQ-2208 |
| A draft-pad image as it stood when the answer was submitted, by its SHA-256 hash | `scratch_snapshot` | REQ-2210 |
| A term-hint tap, with the term and the `itemId` | `glossary_opened` | REQ-2212 |
| Every scene shown, every choice, her free text in its cleaned form and every name she gives | `scene_shown`, `choice_made`, `free_text`, `name_given` | REQ-2214 |
| Every economy event: rewards, chests offered and chosen, forging, purchases, levels, quest progress, familiar friendship, hatching and evolution, and threads earned and spent | `reward_granted`, `chest_offered`, `chest_chosen`, `forge_crafted`, `shop_purchase`, `level_up`, `quest_progress`, `familiar_friendship`, `familiar_hatched`, `familiar_evolved`, `thread_granted`, `thread_spent` | REQ-2216 |
| Every pause, resume, change of device, eye exercise, rest stop, soft stop and extension | `adventure_paused`, `adventure_resumed`, `device_lease_taken`, `eye_exercise`, `rest_stop_offered`, `rest_stop_started`, `rest_stop_ended`, `soft_stop`, `extension` | REQ-2218 |
| Every parent action: lesson tags added and removed, tasks flagged or excluded, settings changed | `parent_tag_added`, `parent_tag_removed`, `item_flagged`, `item_excluded`, `settings_changed` | REQ-2220 |
| Every safety event, and a reference to the `llm_log` row of every model call | `safety_event`, `llm_call` | REQ-2222 |

### The blob store

When an answer arrives with a draft-pad image, `meowtower` hashes the WebP with SHA-256, creates `data/blobs/<sha256>.webp` with exclusive create so an existing file is never overwritten, syncs it to disk, inserts the `blobs` row, and only then appends `scratch_snapshot` with the hash (REQ-2210). Hashing the file again shows whether it changed since (REQ-2210). `meowtower` refuses an image larger than 512 KB; the client scales the pad to at most 1024 px on its long side before sending.

### Task parameters

Every template's parameter schema admits numbers, exact rationals as a numerator and a denominator, booleans and enum identifiers, and no free string, so a task's parameters don't depend on the display language (REQ-3808). A static check in the lint verb walks every template's parameter schema and fails on a string-typed field (REQ-3808). The rendered view in `item_shown` carries its `locale`, `ru` for now.

### Projections

Every game and diagnostic table other than `events` and the seven tables below is a projection: a pure function of the log and the versioned content files, registered in the projection registry. The game projections (`adventures`, `sessions`, `inventory`, `progress`, `quests`, `threads`, `familiars`, `outcomes`, `reward_queue`, `resume_snapshot`, `items_view`, `attempts_view` and the others RES-2550 lists) fold only the decisions the log holds, so a recompute under new model, threshold or graph versions leaves every logged outcome, reward and branch as it was (REQ-2224). The knowledge projections (`node_estimates`, `node_snapshots`, `limits`, `report_cache`, `thresholds` and the frontier) are the ones a new model or threshold version changes.

Every projection records the model, threshold and graph versions it was computed with, the `seq` of the last event it took in, and the time it was computed, in its `derived_meta` row (REQ-3802). Each `node_snapshots` row carries the three versions too, and rows from earlier model versions stay beside the current ones (REQ-3802).

Seven tables are not projections, and no recompute registers or touches them: `blobs`, `explain_cache`, `devices`, `llm_log`, `art_jobs`, `frames` and `bakeoff` (REQ-2242).

### Recompute

A full recompute builds every registered projection into a shadow table `<name>__next` from `seq` 1 while play goes on, catches up to the head of the log, then in one short transaction applies the events that arrived meanwhile and swaps each shadow table in (REQ-2200). With the same model, threshold and graph versions, every rebuilt table holds the same rows as before in every column except `computed_at` (REQ-2200). It keeps the `node_snapshots` rows of earlier model versions and adds rows under the current one. It uses the graph version in the content files. `./meowtower recompute` runs it on demand.

The build runs on the server's connection in chunks of 500 events, each its own transaction, yielding between them, so an append waits at most for one chunk; it builds up to the head of the log as it stood at the start, and the swap's transaction folds in the rest. A projection folds each event into the table it is given, its own or its shadow, from one table definition. A recompute that fails drops its shadow tables and leaves the projections as they were. The check `projection_diverged` derives each projection afresh and reports the table with its first differing row, as stored and as derived. `recompute_failed`, `recompute_slow` and `log_large` join the parent's notices in `data/snapshots/notices.json` that SPC-0010 describes, and `log_large` is checked when a session ends.

At start-up, before it accepts a play request, `meowtower` rebuilds every registered projection table that is missing (REQ-2232). It then runs a full recompute when the model or threshold version in the content files differs from `derived_meta` (REQ-2230). The versions come from `content/versions.json` until the model, threshold and graph files name their own, and the server reads them before it opens the database, since a table rebuilt at open records them. A start-up recompute that fails leaves the old projections, raises `recompute_failed` and lets the server start. A graph version change triggers no recompute yet.

A projection marked `versioned`, `node_snapshots` among them, carries the model, threshold and graph versions in its rows; a recompute keeps the rows of other versions and rebuilds the current versions' rows, and the check `projection_diverged` compares the current versions' rows only. `node_snapshots` stays empty until the knowledge model of ADR-0060 is set.

A check in the lint verb follows each game projection's runtime imports, type-only imports aside, and fails one that reaches `src/engine/model/`, `src/engine/states/`, `src/engine/director/` or `src/shared/answer.ts`, directly or through any module between, naming the chain (REQ-2224). The knowledge projections and the registry are not game projections for this check.

### The explanation cache

`explain_cache` is read only when an explanation is requested. `explanation_shown` records what was shown, so emptying the cache changes no event, no projection and no report (REQ-3816). Migration `0008_explain_cache.sql` creates the table with ADR-0120's columns. After the cache is emptied, a requested explanation falls back to live generation or the template explanation.

### The export

`./meowtower export` runs the export inside `meowtower` on the Mac (REQ-2238). It takes a fresh `VACUUM INTO` copy, reads only that copy, and writes `data/exports/<UTC timestamp>/`. The directory holds the raw log as `events.jsonl`, one event a line, and as `events.parquet` (REQ-2234); the flat tables of attempts and of tasks shown as `attempts.csv`, `attempts.parquet`, `items.csv` and `items.parquet` (REQ-2236); and `fields.csv`, the field dictionary generated from the zod schemas' descriptions. DuckDB, through `@duckdb/node-api`, writes the Parquet files.

The Parent Room offers the same export through `GET /api/parent/export/<file>` on the loopback listener only; the same path through `https://<mac-name>.local` answers 404, so a Parent Room opened on another device offers no export (REQ-2240).

## Failure paths

| Condition | What happens |
| --- | --- |
| Any code runs `UPDATE` or `DELETE` on `events`, or changes a `blobs` row's hash | SQLite aborts the statement with `events are append-only`, and the row stays as it was. |
| The transaction in `appendEvents` fails, for example on a full disk | `meowtower` raises `log_write_failed` as a Parent Room notice and in `./meowtower status`, and replies 503. The client keeps the answer in its queue and shows the player the same waiting scene as `server_unreachable`. |
| A payload fails its schema | `appendEvents` writes nothing of the call and throws, naming the type, version and field. |
| A trigger on `events` or `blobs` is missing at start-up | `meowtower` exits with `log_guard_missing`, naming the trigger. |
| A pending migration drops or replaces a guarded trigger | The migration runner refuses it, applies nothing of it, and `meowtower` doesn't start. |
| The log holds a type or version with no schema | `meowtower` exits with `event_schema_unknown`, naming the type and version. |
| A stored projection differs from a fresh derivation of the log | The verify command reports `projection_diverged` with the table and the first differing row. |
| A recompute fails | The old projections stay in place, `meowtower` raises `recompute_failed` to the parent with the version that failed and when, and play goes on. |
| A full recompute of one year's log takes longer than 60 seconds | `meowtower` raises `recompute_slow` once, against the budget in ADR-0190's Baselines table; play isn't blocked. |
| `events` passes 1 GB | `meowtower` raises `log_large` once, as a Parent Room notice. |
| A file in `data/blobs/` no longer hashes to its name | The verify command reports `blob_changed`, naming each such file. |
| A draft-pad image is larger than 512 KB | `meowtower` refuses it, and no `blobs` row or `scratch_snapshot` event is written. |
| A file for a new image's hash already exists | The exclusive create fails, `meowtower` keeps the existing file and its row, and logs `scratch_snapshot` with that hash. |
| A template's parameter schema has a string-typed field | The lint verb's static check fails, naming the template and field. |
| An export is requested through `https://<mac-name>.local` | `meowtower` answers 404. |

Amended by ADR-0220, ADR-0240, ADR-0260, ADR-0310, ADR-0330 and ADR-0340, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.
