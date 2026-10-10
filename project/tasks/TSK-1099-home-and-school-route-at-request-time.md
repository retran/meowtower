---
id: TSK-1099
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7000, REQ-7012, REQ-7052, REQ-7072]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The route computes the screen at request time from the log and writes nothing

After this task, `GET /api/parent/report/home-and-school` returns each goal row and each Cito row in one of four quadrants or none, computed from the log on each request, written nowhere, and kept away from the Director and every model call.

## Acceptance criteria

1. Given a fixture snapshot with goals and a fixture Cito result, when the route is called, then each row carries its quadrant, high or low at home crossed with high or low at school, or none with its reason (REQ-7000). Closed by: a route test.
2. Given a goal row, when the screen shows it, then each linked node's current state appears beside its state at the snapshot's document date (REQ-7012). Closed by: a Playwright test on the screen.
3. Given a full recompute from the log, when the route is called again, then its JSON is byte-identical, the log holds no event written by the route and `report_cache` holds no quadrant (REQ-7072). Closed by: a route test that recomputes and compares the bytes.
4. Given a file in `src/engine/director/` that imports `src/parent/school/`, when lint runs, then `school_snapshot_in_director` fails; given the same simulated log with and without the quadrant function present, then the Director's choices, the knowledge model and every model call body are byte-identical (REQ-7052). Closed by: the lint rule's fixture test and a property test.
5. Given a past date, when the owner runs `./meowtower report home-and-school --as-of <date>`, then it prints the rows the screen would have shown on that date. Closed by: the command's output on a fixture log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the route on the loopback listener that SPC-0310 already gives the screen, calling the pure function of an as-of date, today by default. No cache, because a snapshot holds at most 400 goals and a result a few categories, and a cached quadrant would outlive a correction. The screen holds one row per goal with a confirmed link and one per category entry of each current Cito result, in a Cito section of its own. Put the route's code in `src/parent/school/` only.

## Depends on

- TSK-1098 (blocking): the route returns each row's quadrant or reason.

The epic realising ADR-0310 supplies the screen, the snapshots and the loopback route; this task replaces its two «измерения расходятся» marks. ADR-0210's scope guard keeps this task out of the tree until the MVP ends.

## Evidence

Not yet.

## Left alone

The checks, the cause lines and the basis marks, which TSK-1100 and TSK-1101 add, and the p95 of the build, which TSK-1104 measures.
