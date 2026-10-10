---
id: TSK-0557
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0502, REQ-0504, REQ-0506, REQ-0508, REQ-0510]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each source grants its own number of threads: a quest 1, a clean row 1, a big row 0, a find 1 or 2, a familiar 2

After this task, one function logs `thread_granted` for each source with the amount RES-0500's table gives, so the rules of ADR-0140 call it when a quest, a row, a find or a familiar's growth fires and need decide only that it fired.

## Acceptance criteria

1. Given a completed daily quest, when the grant is logged, then it holds source `daily_quest` and 1 thread (REQ-0502). Closed by: a unit test.
2. Given a streak of clean, unassisted, scored first attempts that aren't rapid guesses reaching 3 in one adventure, when the grant is logged, then it holds 1 thread; given the streak reaching 5, 10 and 15, then each holds 0 and logs no event (REQ-0504, REQ-0506). Closed by: a unit test at 3, 5, 10 and 15.
3. Given a story find or a chest find of threads with content data of 1 and of 2, when the grant is logged, then it holds that number and never another (REQ-0508). Closed by: a unit test for each; the content schema refuses a find of 0 or 3.
4. Given the familiar hatching and evolving, when each grant is logged, then it holds 2 threads (REQ-0510). Closed by: a unit test for each.
5. Given any source, when a grant is logged, then it fills the stock through TSK-0555's ledger and the cap and the buttons apply to it. Closed by: a unit test over a full stock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `grantThreads(source, count)` to `src/engine/attempt/threads.ts`, with the amounts in one table keyed by source. The sources' triggers, which first attempts count towards a streak and when a quest completes, are ADR-0140's; until its epic exists the grant is called by tests and by the stand-in rewards of the play routes. The morning grant is ADR-0330's REQ-6248 and is outside this task, as REQ-0500 is superseded.

## Depends on

- TSK-0555 (blocking): the ledger every grant goes through.
- The epic realising ADR-0140 supplies the triggers: a quest, a row, a find and a familiar's growth.

## Evidence

Not yet.

## Left alone

The triggers and what an outcome earns, which ADR-0140's epic decides, and the morning grant, which ADR-0330's epic builds.
