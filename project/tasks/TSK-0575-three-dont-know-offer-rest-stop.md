---
id: TSK-0575
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0346, REQ-0348]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Three «Не знаю» in a row bring the familiar's offer of a rest stop and log an avoidance signal

After this task, three «Не знаю» answers with no other answer between them make the familiar offer a rest stop and log `rest_stop_offered` and `avoidance_signal`, and the player loses nothing for it.

## Acceptance criteria

1. Given three answers «Не знаю» in a row, when the third review closes, then the next packets are an easy task and then the familiar's offer of a rest stop, and `rest_stop_offered` is logged (REQ-0346). Closed by: an integration test.
2. Given the same run, when the log is read, then one `avoidance_signal` stands in it, and no reward, thread or estimate changed because of it (REQ-0348). Closed by: an integration test that reads the log and the reward projection.
3. Given «Нельзя узнать» between two «Не знаю», when the run is counted, then it is broken and no offer comes. Closed by: a unit test.
4. Given the button waiting after a rest stop of 4 minutes ago, when a run of three «Не знаю» ends, then the offer still comes. Closed by: an integration test with a fake clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Count runs of «Не знаю» in the answer route, using ADR-0250's rule that «Нельзя узнать» is another answer. Place the offer in the gentle sequence, as the campfire scene after its easy task, as SPC-0090 states it. A decline starts no wait. The easy task is the one the plan's easy-task slot of TSK-0566 provides.

## Depends on

- TSK-0574 (blocking): the offer plays the rest stop scene that task builds.
- TSK-0569 (blocking): the offer is a timed event at a boundary, in the scheduler's order.
- TSK-0566 (blocking): the easy task that comes before the offer is that task's easy task.

The epic realising ADR-0070 supplies the fatigue signal that also offers a rest stop, at most once in 10 minutes from the last offer; this task leaves it to that epic.

## Evidence

Not yet.

## Left alone

How the report shows an avoidance signal, which is ADR-0180's.
