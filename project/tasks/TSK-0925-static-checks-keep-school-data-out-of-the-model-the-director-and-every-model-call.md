---
id: TSK-0925
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6000, REQ-6002, REQ-6030, REQ-6048, REQ-6058]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Static checks keep school data out of the knowledge model, the Director and every model call

After this task, three checks in the lint verb fail when school code reaches the model, the Director or the gateway, a property test shows no school event changes an estimate, and a recorder shows no goal wording leaving the home.

## Acceptance criteria

1. Given a 30-day simulated log, when random school events are inserted, then `node_estimates` and `node_snapshots` are byte-identical with and without them (REQ-6000). Closed by: a property test.
2. Given a fixture file under `src/engine/model/` or `src/engine/states/` that names `school_snapshot_`, or imports `src/engine/school/` or `src/parent/school/` directly or through any module between, when the lint verb runs, then `school_events_in_model` fails and names the chain (REQ-6002). Closed by: the check's test with one direct and one indirect fixture.
3. Given a fixture where the model gateway reaches `src/engine/school/` or `src/parent/school/`, and one where a file under those two directories reaches the gateway, when the lint verb runs, then `school_data_to_gateway` fails on each (REQ-6030). Closed by: the check's test with both fixtures.
4. Given the request-class schemas of the gateway, when a test reads them, then none imports a type from the school's code or has a field typed as a goal, a goal list or a school value (REQ-6030, REQ-6048). Closed by: a schema test.
5. Given an import, a correction, a mapping and a read of both screens, when a recorder logs every outbound request of the server, then none holds a goal's wording, and every route that reads or writes the goal list or its wording answers `404` through `https://<mac-name>.local` (REQ-6048). Closed by: a recorder test and a route test on both listeners.
6. Given a log that holds only `school_snapshot_goal_linked` events, when the Director's value is computed for every node, then it equals the value from a log with no links; given a fixture file under `src/engine/director/` that names `school_snapshot_` or imports the school's code, then `school_snapshot_in_director` fails and names the chain (REQ-6058). Closed by: a Director unit test and the check's test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `school_events_in_model`, `school_data_to_gateway` and `school_snapshot_in_director` to `tools/static-checks.ts`, each following imports the way the check on game projections of ADR-0020 does, and each naming the import chain it found. The knowledge model folds only the event types it names, so an unnamed type changes nothing by construction; the checks make that hold every time.

The Director's school-goal term of the epic realising ADR-0290 reads only `school_goal_mapped`, so a snapshot link never reaches it. This task adds the check and the unit test that keep it so; it doesn't touch the term.

## Depends on

- TSK-0916 (blocking): the event names the checks search for.

The epic realising ADR-0100 supplies the gateway and its strict request classes, and the epic realising ADR-0190 the group 1 runner; until they exist the checks run as lint rules over fixtures.

## Evidence

Not yet.

## Left alone

The fourth check, `school_export_scope`, which TSK-0929 adds with the export. ADR-0420's addition to `school_snapshot_in_director`, which that decision's epic makes.
