---
id: TSK-0922
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6018, REQ-6020, REQ-6022]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A correction names the file, the goal and the field, wins over a parse, and a disagreement shows both values

After this task, the parent can correct any parsed value or add a goal the parser missed, the projection `school_values` holds the correction's value in force, and a reparse that disagrees with a correction marks the row and shows both values.

## Acceptance criteria

1. Given a correction to a goal's level, when the event is read, then it names the snapshot's hash, the goal's key and the field and no parse event, and after a reparse under a new version it still applies (REQ-6018). Closed by: a projection test over a log with a correction and a reparse.
2. Given a parse and a correction for the same field, when `school_values` is read, then the value in force is the correction's, and a failed parse after the correction leaves the earlier read values in force (REQ-6020). Closed by: a projection test.
3. Given a correction and a later parse under another parser version that gives another value, when the row is read, then it is marked `disagrees`, the Parent Room shows both values side by side with «Новое чтение документа расходится с вашей правкой», and one notice is raised for that parser version and none for a second reparse under it (REQ-6022). Closed by: a projection test and a Parent Room test.
4. Given the parent confirms one of the two values, when the event is read, then a new correction carries the current `parserVersionSeen` and the mark is gone (REQ-6022). Closed by: a projection test.
5. Given a correction that names a goal no parse read, when it is saved, then the goal's key comes from the wording and subdomain the parent entered, two events set `wording` and `subdomain` in one call to `appendEvents`, and a later correction of a parsed goal's wording keeps its key and its links (ADR-0310). Closed by: a route test and a projection test.
6. Given a full recompute, when `school_values` is rebuilt, then it equals the stored rows (ADR-0310). Closed by: a recompute test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the projection `school_values` with one row for each snapshot, scope and field, where the scope is a goal key, a subdomain name or the whole snapshot. A row holds the latest `outcome: read` parse's value, the latest correction's value, the value in force and the `disagrees` mark. A correction with `subdomain` set and no goal changes a subdomain's `level` or `shareMastered`. A row is marked `disagrees` when a parse after the correction in log order, under a `parserVersion` other than the correction's `parserVersionSeen`, gives another value.

Add the route `POST /api/parent/school/snapshots/:sha256/corrections` and the panel in the tab «Данные школы», both on the loopback listener. I chose that a correction may name a goal the parse didn't read, as ADR-0310 did, so a parser that reads a photograph badly still leaves a usable snapshot.

## Depends on

- TSK-0916 (blocking): the schemas of the correction and parse events.

## Evidence

Not yet.

## Left alone

Hiding a withdrawn snapshot from this projection, which TSK-0924 adds. The reparse itself, which TSK-0921 builds.
