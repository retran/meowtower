---
id: TSK-0726
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2924]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The same seeds, times and verdicts give the same outcomes, branches, states, awards and finale

After this task, group 2 plays a simulated log twice from the same seeds, times and verdicts and fails, naming the first part that differs, unless the outcomes, branches, states, awards, chests, reward queue and chapter finale hash the same by canonical JSON.

## Acceptance criteria

1. Given a 30-day simulated run played twice with the same seeds, answer times and verdicts, when group 2 compares them, then the hashes of the canonical JSON of outcomes, branches, states, awards, chests, reward queue and chapter finale are equal (REQ-2924). Closed by: an integration test.
2. Given the second play changes one verdict, when the test compares them, then the hashes differ and the report names the part that differs first. Closed by: an integration test, which shows the test can fail.
3. Given a fixture module that reads the wall clock inside the played code, when the test runs, then it fails and names the part that differs. Closed by: an integration test with the fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the determinism test to group 2. It runs the engine, the game rules and the Director headless with no server and no client, feeds the seeds, times and verdicts of TSK-0728's profiles twice, and compares by the hash of canonical JSON, with sorted keys. The comparison covers the seven parts in REQ-2924 and no other.

The epics realising ADR-0070 and ADR-0140 supply the Director and the rules that make awards, chests, the reward queue and the finale. Until they exist the test runs on the stand-in play loop and the parts it already has, and each real part joins as its epic lands.

## Depends on

- TSK-0724 (blocking): the test is a check of group 2 in the runner.
- TSK-0728 (blocking): it reuses the harness's profiles, seeds and headless run.

## Evidence

Not yet.

## Left alone

What the simulated play should produce, which the simulation tasks and the epics of the engine decisions check.
