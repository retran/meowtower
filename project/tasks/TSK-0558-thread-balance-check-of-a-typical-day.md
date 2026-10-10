---
id: TSK-0558
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0512]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A typical day of play yields between 8 and 10 guiding threads

After this task, a balance check replays a simulated day of 28 tasks at a clean share near 0,7 through the grant sources and reports the thread yield, and it fails outside 8 to 10 and when the lowest content rate of finds takes the day above 10.

## Acceptance criteria

1. Given a simulated day of 28 tasks at a clean share near 0,7, when the grants are counted, then the yield is between 8 and 10 threads (REQ-0512). Closed by: the balance check's output.
2. Given the same day with thread finds at their lowest content rate, when the grants are counted, then the yield is not above 10. Closed by: the balance check's output.
3. Given the check, when it runs, then it prints the yield by source, so a yield outside the band shows which source moved it. Closed by: the check's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the check as a test in `tests/` that reads the grant sources of TSK-0557 and the content data of finds, using a seeded day of 28 tasks. ADR-0190's simulation group runs it as part of the verify command once that epic exists; until then it is a test in the unit suite. The rate of thread finds is the one knob this decision leaves to tune the yield, and it lives in ADR-0140's content.

## Depends on

- TSK-0557 (blocking): the grant sources the check counts.
- The epic realising ADR-0140 supplies the content rate of finds and the quest and row triggers; the check uses stand-in rates until then.
- The epic realising ADR-0190 supplies the simulation group that runs it.

## Evidence

Not yet.

## Left alone

The thread-find rates themselves, which ADR-0140's content sets, and the morning grant, which ADR-0330's epic builds and which adds to the day's yield.
