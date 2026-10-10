---
id: TSK-0719
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-1354, REQ-1356, REQ-1358, REQ-1360]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The motor check repeats monthly, every update is a new threshold version, and only a person changes the catalogue

After this task, the projection marks the 10 pure-input tasks of Session 0 as due once a device type's last calibration is 30 days old, each update to the motor correction is a new threshold version that keeps the old, the running game can't write the catalogue, and a catalogue change with no approved record fails verify and start-up.

## Acceptance criteria

1. Given a device type whose last calibration is 30 days old, when the projection is read, then the 10 pure-input tasks of Session 0 are due on that type; given 29 days, then they aren't; given a result, then the motor correction updates from it (REQ-1354). Closed by: a unit test with a fake clock.
2. Given the monthly result, when the motor correction updates, then a new threshold version is written, the replaced version stays readable, and the full recompute of ADR-0020 starts (REQ-1356). Closed by: an integration test.
3. Given the Compose file, when it is read, then the `meowtower` service mounts `content/` read-only, and a write from the running service to `content/thresholds.json` fails (REQ-1358). Closed by: the compose smoke test in `tests/smoke/compose.test.ts` and an integration test that attempts the write.
4. Given a change to a catalogue value, when no entry in `content/thresholds.lock` names an approved record in `project/adrs/` for the new content hash, then verify fails and the server refuses to start on that content; given a new entry that names an approved record, then both pass (REQ-1360). Closed by: two integration tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the due marking, the version write and the lock check for the catalogue. The 30 days is a choice ADR-0180 made to read "once a month". The epic realising ADR-0090 places the 10 tasks in the device's next adventure as story, and the epic realising ADR-0070 reads the due marking. A `thresholds_changed_unversioned` state covers both the catalogue and the `vwo` section.

The lock check extends the one TSK-0713 builds for the `vwo` section, so the two share a function and a file.

## Depends on

- TSK-0718 (blocking): it supplies the projection, the motor correction and the calibration the versions apply to.
- TSK-0713 (blocking): it builds `thresholds.lock` and the check this task extends.

## Evidence

Not yet.

## Left alone

How the pure-input tasks are placed in the adventure, which ADR-0090 owns, and the decision records that approve a catalogue value, which the owner writes when a value changes.
