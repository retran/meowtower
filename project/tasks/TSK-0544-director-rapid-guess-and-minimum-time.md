---
id: TSK-0544
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1114, REQ-1118, REQ-1120, REQ-1122]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An answer faster than its template's minimum time is a rapid guess and stays out of every estimate and block

After this task, the server marks `rapidGuess: true` on the `verdict` of an answer that arrives faster than the template's minimum time plus the motor correction, the model keeps that attempt out of every estimate and block, and the Director adds one task of the same node later in the session.

## Acceptance criteria

1. Given a template outside the small spaces with `fluencyMs` of 20,000, when its minimum time is read, then it is `max(1500, min(0.15 * 20000, 10000))` = 3,000 ms plus the motor correction; given `fluencyMs` of 5,000, then 1,500 ms; given 100,000, then 10,000 ms (REQ-1114). Closed by: a unit test for the three values.
2. Given a player whose median time per key press in Session 0's pure-input tasks on the tablet is 400 ms and a correct answer of 3 key presses with «Готово», when the motor correction is read, then it is 400 ms times 4 (REQ-1118). Closed by: a unit test with the device type as an argument.
3. Given a device type with no Session 0 yet, when the minimum time is read, then the motor correction is 0 (REQ-1120). Closed by: a unit test.
4. Given an answer 1 ms faster than its minimum time and one 1 ms slower, when each is judged, then the first is a rapid guess and the second isn't, for a sample of templates on each device type, with and without Session 0 (REQ-1122). Closed by: a unit test over the sample.
5. Given an attempt flagged `interrupted` or `crossDevice`, when it is judged, then it is never a rapid guess; given the client's time measured from the task's appearance to «Готово» without pauses, then that time is the one compared. Closed by: a unit test.
6. Given an attempt that carries `rapidGuess: true`, when the model reads the log, then the attempt is in no estimate, no state, no probe and no block, and the Director adds one task of the same node later in the session (REQ-1122). Closed by: an integration test over the model's observation function and the next slots.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the rapid-guess test to `src/engine/director/guards.ts`, called on each verdict by the server. The motor correction reads the latest calibration version of Session 0, which the epic realising ADR-0180 owns; until then the correction is 0 on every device type. The minimum time of basic facts and control facts is ADR-0290's, replacing REQ-1116 by REQ-5840, and the weights of a bonus are ADR-0140's, which pays a rapid guess none.

## Depends on

- TSK-0534 (blocking): the slot function that places the replacement task.
- The epic realising ADR-0060 supplies the observation function that drops the marked attempt; its observation task reads the mark already.
- The epic realising ADR-0180 supplies the Session 0 calibration versions.

## Evidence

Not yet.

## Left alone

The minimum time of basic and control facts, which ADR-0290's epic sets, the bonus a rapid guess earns, which ADR-0140's epic withholds, and the 15 % flag, which TSK-0546 builds.
