---
id: RES-2200
artifact: research
status: approved
revised: 2026-09-26
---

# The draft proposes an append-only event log as the only source of truth, with every estimate and the report recomputed from it

## Summary

The owner's draft specification proposes that one immutable event log is the only source of truth for Tower Chronicles. Everything else, from node estimates to the parent report, is a derived view that the server can delete and rebuild from the log at any time. The draft lists what each event carries and what gets written: every task shown, a summary of input per attempt, every attempt, draft snapshots, scenes and choices, game-economy events, pauses and breaks, parent actions and safety events. The log holds facts, meaning what was shown, what the player entered and what the game decided at that moment; conclusions are computed. Each derived snapshot records the model, threshold and graph versions it was built with, so a change of thresholds or model triggers a full recompute and old snapshots stay comparable. SQLite triggers forbid `UPDATE` and `DELETE` on the `events` table, and corrections arrive as new events. The parent can export the raw log and flat tables locally on the Mac. This record covers the log, its contents, versioning, immutability and the export; the parent report is in RES-2300 and the endpoints that write to the log are in RES-2400.

## The question

What does the game store as the truth about the player's play, and how are estimates and the report derived from it? The draft assumes that recording everything and computing later costs little and pays off, because thresholds and models will change. That assumption holds for one child on one Mac, but the draft never sizes the log, the draft-snapshot images or the time a full recompute takes, so "record everything" has no stated limit.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles: specification), sections «Текущий объём (MVP)» (Current scope, the MVP) introduction and «Записываем всё, считаем потом» (Record everything, compute later), on 2026-09-26. The draft is a draft, so every finding below is what the draft proposes, not what was decided.

The draft leaves these points open:

- the list of event types and their schemas, apart from `item_excluded`;
- how long the log and the draft-snapshot images are kept, and how large they may grow;
- how long a full recompute may take, and whether play is blocked while it runs;
- what the field dictionary in the export contains;
- whether "only locally, on the Mac" allows the Parent Room export when the parent opens the Parent Room from another device, since RES-2400 lists export endpoints under `/api/parent/export/`;
- whether the graph version, which each snapshot records, can be chosen on recompute: the recompute endpoint in RES-2400 takes only `modelVersion` and `thresholdVersion`.

## Findings

### The draft makes an immutable event log the only source of truth and every other table a derived view

The draft uses event sourcing. Every other game and diagnostic table is a derived view that can be deleted at any moment and rebuilt from the log; seven other tables live beside the log, as the next finding says. The MVP summary repeats the principle: «Записываем всё, считаем потом» (Record everything, compute later), with all estimates and the report as recomputable views.

### Resolved: seven tables live beside the log and are not derived views: `blobs` as truth, `explain_cache` as cache, and `devices`, `llm_log`, `art_jobs`, `frames` and `bakeoff` as service

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's data model names four service tables in its prose (devices, tokens, `llm_log` and the graphics queue) and marks more in its table list. The table list wins, because a recompute that deleted `blobs` would lose the scratchpad images and one that deleted `explain_cache` would pay OpenRouter to write it again. Turning those tables into projections of new events was the other option, better at keeping one truth; RES-2550 holds the comparison and the kinds. A full recompute rebuilds every derived view and leaves the seven tables alone.

### Every event carries server time, device time, a device identifier, a session and an adventure

Each event is written with the server time, the device time, `deviceId`, the session and the adventure.

### The draft lists what the log records

The log records the following.

- Every task shown: its full rendered view (text, SVG, options, terms), the template and its version, the seed, the parameters, the node, the subtype, the purpose (`purpose`) and the attempt number. A second attempt links to the original task.
- An input summary for each attempt: time to the first key press, time of submission, number of edits and erasures, number of key presses, focus losses and their duration, and the input method.
- Every attempt: its number, the answer as entered and as parsed, the verdict and the game outcome, the trap and the error class, the step-by-step matching, the `assisted` flag, the hint level, the guiding threads spent, whether the short solution and the detailed explanation were shown and how long the player looked at them.
- Draft snapshots at the moment of answering, stored as an image in the file store by hash, and taps on term hints.
- Scenes, choices and free text (after cleaning) and names; rewards, chests, forging, purchases, levels, quests, familiar friendship and evolutions; guiding threads earned and spent.
- Pauses, resumes, change of device, eye exercises, rest stops, the soft stop and extensions.
- Parent actions: lesson tags, «задание неоднозначное» (the task is ambiguous) and settings.
- Safety events and references to `llm_log` records.

### The log keeps facts and computes conclusions

Facts are what was shown, what the player entered, and what the game decided and showed at that moment: the outcome, the rewards and the branch. The game never rewrites its past decisions. Conclusions are computed from the log and never stored as truth: node estimates, states, «решает с подсказкой» (solves with a hint), limits, the frontier and the report.

### Each derived snapshot records the versions it was built with

Each derived snapshot stores the model version (`modelVersion`), the threshold and graph versions, and the number of the last event it took into account. A change of thresholds or model triggers a full recompute of the history, run by `./tower recompute` or by a button in the Parent Room. Old snapshots keep their version, so one history can be compared under two model versions. Derived tables can be deleted, and the server rebuilds them at start-up.

### The events table is append-only, enforced by SQLite triggers

The `events` table only grows. SQLite triggers forbid `UPDATE` and `DELETE`. Corrections arrive as new events, for example `item_excluded` from the parent.

### The parent can export the raw log and flat tables, locally on the Mac only

The Parent Room and the command `./tower export` export:

| What | Formats |
| --- | --- |
| Raw event log | JSONL and Parquet |
| Flat table of attempts | CSV and Parquet |
| Flat table of tasks shown | CSV and Parquet |
| Field dictionary | not stated |

DuckDB writes the Parquet files. Export runs only locally, on the Mac.

## Conclusions

1. The game must keep one event log as the only source of truth, and every estimate, state and report view must be derivable from it alone.
2. Every event must carry the server time, the device time, the device identifier, the session and the adventure.
3. The log must record every task shown with its full rendered view, template and template version, seed, parameters, node, subtype, purpose and attempt number, and a second attempt must link to its original task.
4. The log must record, for every attempt, the input summary, the answer as entered and as parsed, the verdict, the game outcome, the trap, the error class, the step matching, the assisted flag, the hint level, the threads spent, and whether and for how long the short solution and the detailed explanation were shown.
5. The log must record draft snapshots by hash, term-hint taps, scenes, choices, cleaned free text, names, game-economy events, pauses, resumes, device changes, breaks, soft stops, extensions, parent actions, safety events and `llm_log` references.
6. The game must never rewrite a decision it logged, and must store node estimates, states, limits, the frontier and the report only as derived views.
7. Each derived snapshot must record the model version, the threshold version, the graph version and the last event it took into account.
8. A change of model or thresholds must trigger a full recompute, and old snapshots must stay available under their own version for comparison.
9. The server must rebuild any deleted derived table from the log at start-up.
10. The `events` table must reject `UPDATE` and `DELETE` at the database level, and every correction must be a new event.
11. The parent must be able to export the raw log as JSONL and Parquet, flat tables of attempts and tasks shown as CSV and Parquet, and a field dictionary, from the Parent Room and from `./tower export`, on the Mac only.
12. A full recompute must rebuild every derived view and must not delete or change `blobs`, `explain_cache`, `devices`, `llm_log`, `art_jobs`, `frames` or `bakeoff`.

## Sources

- The owner's draft «Хроники Башни — спецификация», sections «Текущий объём (MVP)» and «Записываем всё, считаем потом», read 2026-09-26; not kept in the repository - every finding and conclusion above.
