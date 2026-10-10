---
id: TSK-0729
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2912, REQ-2914, REQ-2916, REQ-2918]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A 60-minute simulated adventure yields enough scored attempts and keeps the success share in its corridor

After this task, group 3 plays a timed adventure of 60 minutes for each profile and fails unless it yields at least 28 scored first attempts at 1.0 times the fluency threshold and at least 25 at 1.5 times, and unless the success share stays between 0.65 and 0.85 in every session and between 0.70 and 0.80 on average.

## Acceptance criteria

1. Given a 60-minute simulated adventure with answer times equal to 1.0 times the fluency threshold, when it ends, then it holds at least 28 scored first attempts; given a Director that offers 27, then group 3 fails (REQ-2912). Closed by: an integration test with a stand-in Director that offers 27.
2. Given the same adventure at 1.5 times the threshold, when it ends, then it holds at least 25 scored first attempts (REQ-2914). Closed by: an integration test.
3. Given the mixed profiles after the cold start, when their sessions are read, then every session's success share lies between 0.65 and 0.85 (REQ-2916), and the mean across sessions lies between 0.70 and 0.80 (REQ-2918). Closed by: an integration test over the mixed profiles with a stand-in that breaks each bound in turn.
4. Given the adventure targets 30 to 40 graded first attempts, when the report prints the run, then it shows the count beside the 28 and 25 minimums, so a drop in the target is visible. Closed by: the report's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the timed adventure and the corridor checks to group 3. The guideline of 30 to 40 graded first attempts was set by the owner's decision of 2026-09-28, and the minimums of 28 and 25 were imposed by the owner's decision of 2026-09-26, so the report keeps them apart. The timed adventure is required from stage 0.2, and the corridor from stage 0.1.

The epics realising ADR-0070 and ADR-0090 supply the Director, the day plan and the active-time count. Until they exist the checks run on the stand-in play loop and prove they can fail.

## Depends on

- TSK-0728 (blocking): it supplies the profiles, the seeds and the headless run.

## Evidence

Not yet.

## Left alone

How the Director fills the hour, which ADR-0070 owns, and the 10-second transitions and the soft stop, which ADR-0090 owns.
