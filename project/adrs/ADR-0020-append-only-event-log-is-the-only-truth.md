---
id: ADR-0020
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-2200, REQ-2202, REQ-2204, REQ-2206, REQ-2208, REQ-2210, REQ-2212, REQ-2214, REQ-2216, REQ-2218, REQ-2220, REQ-2222, REQ-2224, REQ-2226, REQ-2228, REQ-2230, REQ-2232, REQ-2234, REQ-2236, REQ-2238, REQ-2240, REQ-2242, REQ-3800, REQ-3802, REQ-3804, REQ-3808, REQ-3816]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0020. An append-only event log in SQLite is the only truth, and every other table is a projection rebuilt from it

## Decision

The SQLite table `events` is the only record of what happened in play. Every other game and diagnostic table is a projection that the server can delete and rebuild from `events` alone. Seven tables stand outside that rule, as RES-2550 resolved: `blobs` is truth beside the log, `explain_cache` is a cache, and `devices`, `llm_log`, `art_jobs`, `frames` and `bakeoff` are service tables. This record builds on ADR-0010, which puts the database in the named volume `tower-db` and takes the snapshots.

The log works like this:

- Each row is one event with this envelope (REQ-3800, REQ-2202): `seq`, an `INTEGER PRIMARY KEY AUTOINCREMENT`, so the order is one increasing sequence over the whole log and a number is never reused; `id`, a ULID, unique; `ts`, the server time in UTC; `client_ms`, the device time; `device_id`; `session_id` and `adventure_id` where the event happens inside them; `type`; `v`, the payload schema version; `payload`, JSON; and `idem_key`, unique where present, which ADR-0030 uses to record a repeated request once. An event the server writes on its own, such as a pause on lease expiry or a command on the Mac, carries the device identifier `server` and the server time as its device time, so no event lacks either field.
- Two triggers reject every change: `BEFORE UPDATE ON events` and `BEFORE DELETE ON events` each run `RAISE(ABORT, 'events are append-only')` (REQ-2226). The same two triggers guard the `sha256` column of `blobs`. At start-up the server reads `sqlite_master`, and if either trigger is missing it refuses to start. The migration runner refuses any migration whose SQL drops or replaces those triggers.
- One function, `appendEvents` in `src/engine/events/`, is the only code that inserts into `events`, and a lint rule rejects SQL naming `events` anywhere else. It validates every payload against its zod schema for that type and version, inserts the rows, and applies each new event to the projections, all in one transaction. The request is answered only after that transaction commits, which is what ADR-0010's `synchronous=FULL` makes durable.
- Each event type has a zod schema per payload version in `src/shared/events.ts`. A new version adds a schema and an upcaster from the previous one; stored events are never rewritten, and projections read old payloads through the upcasters. The server refuses to start if the log holds a type or version with no schema.
- The catalogue starts from the 48 types in RES-2550. Together they record every task shown with its full rendered view, template and version, seed, parameters, node, subtype, purpose, attempt number, correct answer and short solution, and a second attempt's `parentItemId` (`item_shown`: REQ-2204, REQ-2206, REQ-3804). Every attempt is recorded with its input summary, raw and parsed answer, verdict, outcome, trap, error class, step matching, assisted flag, hint level and threads (`attempt_submitted`, `verdict`, `hint_shown`, `thread_spent`), and when and how long the short solution and the detailed explanation were shown (`solution_shown`, `explanation_shown` with `dwellMs`) (REQ-2208). Term-hint taps are `glossary_opened` with the term and the `itemId` (REQ-2212). Story events are `scene_shown`, `choice_made`, the cleaned `free_text` and `name_given` (REQ-2214). Economy events run from `reward_granted` to `familiar_hatched` (REQ-2216). Pauses, resumes, device changes, breaks, soft stops and extensions have their own types (REQ-2218), as do parent actions (REQ-2220) and `safety_event` and `llm_call`, the latter holding the `llm_log` row's identifier (REQ-2222). I add `item_flagged`, because REQ-2220 names flagging as a parent action and the draft's list has no type for it. The names above are the draft's. A later decision adds or renames a type the same way, with a schema, a version and the projections that read it, and ADR-0080 and ADR-0090 do so for thread grants, breaks and the soft stop; a type renamed after events of it exist keeps an upcaster from the old name. The event catalogue under Consequences is the one list of type names, and every decision uses the names it holds.
- A draft-pad image arrives with the answer as WebP. The server hashes it with SHA-256, writes `data/blobs/<sha256>.webp` with exclusive create so an existing file is never overwritten, syncs it to disk, adds the `blobs` row, and only then logs `scratch_snapshot` with the hash (REQ-2210). Re-hashing the file shows whether it changed since. The server refuses an image over 512 KB, a ceiling I chose; the client scales the pad to at most 1024 px on its long side first.
- A task's parameters are language-free (REQ-3808): the parameter schema of every template admits numbers, exact rationals as numerator and denominator, booleans and enum identifiers, and no free string. The rendered view in `item_shown` carries its `locale`, `ru` for now. ADR-0040 writes the templates to this rule; a static check walks every template's parameter schema.
- Projections are pure functions of the log and the versioned content files: they read no clock, no random source and no network. The game projections (`adventures`, `sessions`, `inventory`, `progress`, `quests`, `threads`, `familiars`, `outcomes`, `reward_queue`, `resume_snapshot` and the rest RES-2550 lists) only fold the decisions the log holds. Their code may not import the knowledge model, the Director or the answer check, so a recompute under new versions can't change an outcome, a reward or a branch already logged (REQ-2224). The knowledge projections (`node_estimates`, `node_snapshots`, `limits`, `report_cache`, `thresholds` and the frontier) are the ones a new model or threshold version changes.
- Every projection records its model, threshold and graph versions, the `seq` of the last event it took in and the time it was computed (REQ-3802). A table `derived_meta` holds one row per projection table. `node_snapshots` also carries the versions on each row, because snapshots from earlier model versions stay beside the current ones.
- A full recompute builds every projection into a shadow table `<name>__next` from `seq` 1 while play goes on. It then catches up to the head of the log, and in one short transaction applies the events that arrived meanwhile and swaps the tables. It rebuilds only tables registered as projections, and the seven tables above are not registered, so it can't touch them (REQ-2242). It keeps the `node_snapshots` rows of earlier model versions and adds rows under the new one. `./tower recompute` (ADR-0010) runs it on demand.
- At start-up, before it accepts a play request, the server rebuilds any projection table that is missing (REQ-2232). It also runs a full recompute if the model or threshold version in the content files differs from `derived_meta` (REQ-2230).
- A correction is a new event, such as `item_excluded`, `item_flagged` or `parent_tag_removed`, and the projections apply it; the original event stays as it was (REQ-2228).
- `explain_cache` is read only when an explanation is requested. No projection and no report reads it, and `explanation_shown` logs the lines as shown, so emptying the cache loses no fact about play (REQ-3816).
- `./tower export` runs the export inside the `tower` container (REQ-2238). It takes a fresh `VACUUM INTO` copy, reads only that copy, and writes `data/exports/<UTC timestamp>/` holding `events.jsonl` and `events.parquet` (REQ-2234), `attempts` and `items` each as `.csv` and `.parquet` (REQ-2236), and `fields.csv`, the field dictionary generated from the zod schemas' descriptions. DuckDB, through `@duckdb/node-api`, writes the Parquet files. The Parent Room offers the same export only on ADR-0010's loopback listener, `http://localhost:8080`, so a Parent Room opened on the iPad has no export route (REQ-2240).

What works once this is accepted: the server writes events with the full envelope, the database refuses to change or delete them, projections rebuild after deletion and on a version change, snapshots and backups carry the log, and the export writes all five files for whatever events exist. What doesn't work yet: nothing produces play events until ADR-0030 opens the API and ADR-0040 generates tasks, and the knowledge projections have no model until ADR-0060.

## Why

RES-2200 and RES-2550 record the owner's draft: one immutable log, everything else derived, versions on every snapshot, triggers against `UPDATE` and `DELETE`. The requirements elaborate that, so this record fixes the mechanics the draft left open and doesn't reopen the choice.

The draft's reason holds for this game in particular. The model, the thresholds and the graph will change (RES-0900, RES-1300), and the parent wants to see one history under two model versions (RES-2200). Only a log of facts allows that, because a table of current estimates forgets what it was computed from.

Writing the log and the projections in one SQLite transaction is what makes REQ-0206 and REQ-2200 cheap to keep. A projection can't be ahead of or behind the log it was built from, so the test that compares a stored projection with a fresh derivation compares two things that must be equal.

The shadow-table recompute exists because REQ-2230 fires on a version change, and a recompute that stops play would stop it at the moment the owner deploys a new model. My estimate, not measured, is about 500 events and 1 MB of log a day, most of it the rendered view in `item_shown`. That makes about 180,000 events and 400 MB a year, which a replay in `better-sqlite3` reads in seconds.

The import rule on game projections is what keeps REQ-2224 a check. A game projection that called the knowledge model could, after a recompute, grant a reward the child never saw, and no test of the log alone would notice.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: tables of current state, updated in place | the least code and the smallest database; every read is one row | a new model or threshold can't be applied to the past, so REQ-2200 and REQ-2230 fail, and a lost update leaves no trace |
| Events in JSONL files on the Mac's disk, projections in SQLite | readable with any text tool, and append-only by opening the file in append mode | no transaction spans a file and a database, so a crash between them breaks REQ-0206; nothing at the storage level rejects an edit, against REQ-2226 |
| A dedicated event store, such as KurrentDB, or PostgreSQL | streams, subscriptions and tooling built for event sourcing; roles that can deny `UPDATE` | a second server on the Mac for one player; loses `VACUUM INTO` single-file snapshots, which ADR-0010's backups and REQ-2524 rely on |
| Events as an audit trail beside state tables that are also truth | fast reads and simple writes, with a history for debugging | two truths drift apart, and nothing says which one wins; REQ-2200 needs the log alone to rebuild every view |
| No stored projections: derive each view from the log on every read | nothing can drift, and there is no recompute | every resume and every report replays the whole log, so the time a person waits grows with every day she plays |

## What it costs

The strongest objection is that a mistake in the log is permanent. A bug that logs a wrong fact can only be answered by a correcting event, and every future version of the code must carry an upcaster for every payload version ever written. A state table would let a developer fix the row and move on.

I accept that because the alternative loses the property the whole report rests on. I narrow the cost two ways: payloads are validated on write, so a malformed event never lands, and the simulation in ADR-0190 runs 30 days through the log before the child plays a day.

A second cost is that nothing can be erased. A name or a line she typed stays in the log for good, cleaned as RES-2600 describes but not removable. Erasing it would need a decision this record doesn't make, listed as unsettled below.

The developer does more work on every feature: an event type, a schema, a projection and a rebuild test, where a state table would need one `UPDATE`. That cost falls on the autonomous development in RES-2900, not on the family.

Storage grows by my estimate of 400 MB a year. The log never drains, by design. The ceiling is a `log_large` notice in the Parent Room when `events` passes 1 GB, a ceiling I chose, fired once. A full recompute of one year's log must finish in 60 seconds on the Mac, a budget I chose. A slower run raises `recompute_slow` once, and play isn't blocked meanwhile, because the rebuild runs in shadow tables. Both numbers, and the 512 KB image ceiling, stand in the Baselines table of ADR-0190.

## What would reverse it

- A full recompute of one year of real or simulated log takes more than 10 minutes on the family Mac. Then projections get checkpoints: the recompute starts from a stored state at a known `seq` for game projections, and only knowledge projections replay from the start.
- The owner needs to erase a fact about the player, for example a real name she typed. Then the log needs a redaction design, such as encrypting free text with a per-record key the parent can destroy, and that decision amends this one.
- A stage-0 test shows SQLite triggers can be bypassed by the server's own code path, for example through a `VACUUM` or a schema rewrite the migration runner allows. Then the guard moves to a check that compares a rolling hash of the log at each start-up.

## Consequences

- The security boundary protects the log's integrity, and the likeliest damage comes first. The server's own bugs are met by the single append function, the lint rule and the triggers. A careless migration is met by the runner's check and the snapshot before each migration (ADR-0010). A person at the Mac editing the database is met by the named volume, which no Mac program can open. Root inside the Docker virtual machine can still drop the triggers; this record doesn't defend against that.
- These failure states, each with one audience, join those ADR-0010 names:
  - `log_write_failed`: the parent, as a Parent Room notice and in `./tower status`. The server replies 503, the client keeps the answer in its queue, and to the player it looks like `server_unreachable`, deliberately.
  - `log_guard_missing`: the developer; the server refuses to start and names the missing trigger.
  - `event_schema_unknown`: the developer; the server refuses to start and names the type and version.
  - `projection_diverged`: the developer; the verify command reports the table and the first differing row.
  - `recompute_failed`: the parent; the old projections stay in place, and the Parent Room says which version failed and when.
  - `blob_changed`: the developer; the verify command re-hashes `data/blobs/` and names each file whose hash differs from its name.
  - `log_large` and `recompute_slow`: the parent, once each, as above.
- Work created: the `events` table and its triggers; `appendEvents`; the schemas and upcasters; the projection registry with shadow rebuild; `derived_meta`; the blob store; the export tool; the lint rule and the import rule.
- ADR-0030 builds the API's idempotency on `idem_key` and the resume point on the `resume_snapshot` projection.
- Premortem, written as though it already happened: after two months the owner changed the model, the recompute ran, and the report showed a node mastered that the old report had marked not mastered. That was expected. But the inventory also changed, because a quest projection had read an estimate to decide a reward. The import rule had a gap for a helper module both sides shared. The fix was a rebuild test that runs the game projections under two model versions and requires identical output, which the list below now includes.

### Event catalogue

This record owns the catalogue. Each type below has one name, used in every decision, and one owning decision, which defines its payload; the other decisions read it. A new or renamed type enters this table in the same change as its schema.

| Event | Owner | Meaning |
| --- | --- | --- |
| `adventure_planned` | ADR-0030 | a new adventure entered the state `planned` |
| `adventure_started` | ADR-0030 | an adventure became `active` |
| `adventure_paused` | ADR-0030 | play paused, with the reason `leave`, `background`, `idle` or `lease_expired` |
| `adventure_resumed` | ADR-0030 | a paused adventure became `active` again |
| `adventure_completed` | ADR-0030 | an adventure reached its finale |
| `adventure_wrapped_up` | ADR-0030 | the three-day rule closed an adventure, with the secrets she didn't open |
| `session_started` | ADR-0030 | a session began on a device |
| `session_ended` | ADR-0030 | a session ended, by leaving or lease expiry |
| `device_lease_taken` | ADR-0030 | a device took the adventure's lease on a tap |
| `settings_changed` | ADR-0030 | the parent changed a setting through `PUT /api/parent/settings` |
| `scene_prepared` | ADR-0030 | scene lines and branches that passed the checks, kept for a resume |
| `text_draft_saved` | ADR-0030 | a draft of her free text, at most once every 10 seconds |
| `rewards_delivered` | ADR-0030 | the client confirmed it showed a grant or ceremony |
| `attempt_late` | ADR-0030 | a queued answer arrived for a task that already had its attempt; kept, unscored |
| `item_focus` | ADR-0030 | the task window gained or lost focus on the device (RES-2550) |
| `item_shown` | ADR-0040 | a task was shown, with its full view, template, seed, parameters, answer and solution; ADR-0070 adds `purpose`, `flowSlot` and `why`, ADR-0130 the frame fields |
| `verdict` | ADR-0040 | the checker's credit, class and trap for an attempt; ADR-0140 adds the outcome and ADR-0070 `rapidGuess` |
| `scratch_snapshot` | ADR-0020 | a draft-pad image stored in the blob store, by its hash |
| `item_flagged` | ADR-0020 | the parent flagged a task |
| `model_activated` | ADR-0060 | a knowledge-model version became active |
| `attempt_submitted` | ADR-0080 | an answer arrived, with its raw input, attempt number, `assisted` and hint level |
| `hint_shown` | ADR-0080 | a hint rung was bought and shown |
| `solution_shown` | ADR-0080 | the short solution was shown, by itself or on request |
| `explanation_bought` | ADR-0080 | a thread was spent on a detailed explanation |
| `twin_unavailable` | ADR-0080 | no parallel task could be built, so the second attempt was skipped |
| `thread_granted` | ADR-0080 | threads were granted, with the source, the amount to the stock and the buttons from surplus |
| `thread_spent` | ADR-0080 | a thread was spent on a hint rung or an explanation |
| `pocket_thread_given` | ADR-0080 | the backpack pocket gave its thread for this room or floor |
| `day_opened` | ADR-0090 | the first server contact of a game day |
| `plan_built` | ADR-0090 | the day's plan of floors and slots, built or rebuilt from her pace |
| `floor_entered` | ADR-0090 | she entered a floor |
| `room_opened` | ADR-0090 | a room opened, with its drawn length |
| `eye_exercise` | ADR-0090 | an eye exercise played, with its kind |
| `rest_stop_offered` | ADR-0090 | the game offered a rest stop |
| `rest_stop_started` | ADR-0090 | a rest stop began |
| `rest_stop_ended` | ADR-0090 | a rest stop ended |
| `soft_stop` | ADR-0090 | the soft stop played |
| `extension` | ADR-0090 | she chose «Ещё один ряд», which moves the soft-stop point |
| `save_accepted` | ADR-0090 | she accepted the offer to save and continue tomorrow |
| `finish_today` | ADR-0090 | the parent ended the day; ADR-0030 serves the route |
| `avoidance_signal` | ADR-0090 | three «Не знаю» in a row |
| `anxiety_signal` | ADR-0090 | an anxiety signal fired, with its kind |
| `zone_changed` | ADR-0090 | the device reported a new time zone |
| `clock_jump` | ADR-0090 | the clock or the zone moved by more than a minute in a session |
| `llm_call` | ADR-0100 | a model call, pointing to its `llm_log` row |
| `budget_month_spent` | ADR-0100 | the month's play budget ran out |
| `master_pick_rejected` | ADR-0100 | the parent's Master model failed the check, so the adventure runs on `MASTER_MODEL` |
| `scene_shown` | ADR-0110 | a scene's lines as shown |
| `choice_made` | ADR-0110 | she chose a scene option |
| `free_text` | ADR-0110 | her cleaned free text |
| `name_given` | ADR-0110 | she named or renamed something |
| `plan_written` | ADR-0110 | the planner's summary and beats after a session |
| `safety_event` | ADR-0110 | a safety signal and its level |
| `line_approved` | ADR-0110 | a pool line entered the pool |
| `diary_cipher` | ADR-0110 | a cipher answer, after the MVP; never scored as maths |
| `explanation_shown` | ADR-0120 | a detailed explanation was shown, with its source and dwell time, never its text |
| `frame_accepted` | ADR-0130 | the parent accepted a frame, with its text and hash |
| `frame_removed` | ADR-0130 | a frame left the library |
| `live_frames_paused` | ADR-0130 | the day's rejection share passed 30 %, so live frames stop |
| `science_approved` | ADR-0130 | the parent approved a science question by its hash |
| `room_outcome` | ADR-0140 | a room's branch, with the thresholds version |
| `floor_outcome` | ADR-0140 | a floor's state, with the thresholds version; it marks the floor completed |
| `combo` | ADR-0140 | a clean row or a big clean row fired |
| `reward_reopened` | ADR-0140 | a queued reward came back |
| `reward_granted` | ADR-0140 | a grant, with its amount |
| `chest_offered` | ADR-0140 | a chest's three offered rewards |
| `chest_chosen` | ADR-0140 | her pick from a chest |
| `level_up` | ADR-0140 | the heroine reached a new level |
| `quest_progress` | ADR-0140 | a daily quest counted an act or was met |
| `forge_crafted` | ADR-0140 | she forged an item |
| `shop_purchase` | ADR-0140 | she bought an item |
| `familiar_friendship` | ADR-0140 | a familiar gained friendship points |
| `familiar_evolved` | ADR-0140 | a familiar evolved |
| `familiar_hatched` | ADR-0140 | a familiar hatched |
| `looks_set` | ADR-0150 | she changed her theme, palette, text size or sound |
| `glossary_opened` | ADR-0150 | she tapped a marked term, with the term and `itemId` |
| `parent_tag_added` | ADR-0180 | the parent marked a lesson |
| `parent_tag_removed` | ADR-0180 | the parent removed a lesson mark |
| `item_excluded` | ADR-0180 | the parent excluded a task as ambiguous |
| `glossary_entry_approved` | ADR-0180 | the parent approved a glossary entry's Dutch word |
| `calibration` | ADR-0180 | an adult's calibration task in the Parent Room |

Seven names in the drafts are not event types. `explanation_ready`, `lease_moved` and `stop_offer` are messages on ADR-0030's SSE stream. `explanation_fallback` is a state: the log records it as `explanation_shown` with its source and reason. `no_review_candidate`, `no_island_candidate` and `repeat_forced` are values of the `why` field of `item_shown`.

## How I will know it was realised

1. A test runs `UPDATE events SET type = type` and `DELETE FROM events` against a real database, and both fail with "events are append-only".
2. A test drops one trigger in a copy and starts the server on it, and the server exits naming the trigger.
3. After a simulated 30-day run, a test deletes each projection table in turn, recomputes with the same versions, and finds every row identical to the one before, comparing every column except `computed_at`.
4. The same run recomputed under a second model version gives identical `inventory`, `progress`, `outcomes`, `threads`, `familiars` and `reward_queue` tables, and `node_snapshots` holds rows under both versions.
5. After the recompute, the row counts and a content hash of `blobs`, `explain_cache`, `devices`, `llm_log`, `art_jobs`, `frames` and `bakeoff` equal their values before it.
6. Emptying `explain_cache` and rebuilding the report gives a report identical to the one before.
7. Every event of the 30-day run validates against its schema, and has a unique ULID, a `seq` one greater than the previous event's, a server time, a device time and a device identifier.
8. For every `scratch_snapshot` event, `data/blobs/<sha256>.webp` exists and its SHA-256 equals its name.
9. `./tower export` writes the five named outputs, DuckDB reads each Parquet file, and the row counts of `events.jsonl` and `events.parquet` equal the count of `events` in the copy.
10. A request to `/api/parent/export/events.jsonl` through `https://<mac-name>.local` gets 404, and the same path on `http://localhost:8080` returns the file.
11. The static check finds a string-typed field in no template's parameter schema.

## What this does not settle

- Every player-facing string in per-language files, REQ-3810, is ADR-0160's.
- The curriculum overlay that adds to the base graph without changing it, REQ-3812, is ADR-0050's.
- The report keeping graph layers apart, REQ-3814, is ADR-0180's; the log only records the layers each session had on.
- The HTTP routes that write events, idempotency per request and the resume point's contents are ADR-0030's.
- The contents of `llm_log`, its growth and its ceiling are ADR-0100's.
- The knowledge model's projections and their versions are ADR-0060's; this record fixes only how they are stored and rebuilt.
- Erasing a fact from the log. No decision in the design does it, and it needs the owner if the family wants it.
- Whether a recompute may choose a graph version, which RES-2200 leaves open. Here a recompute always uses the graph version in the content files.
