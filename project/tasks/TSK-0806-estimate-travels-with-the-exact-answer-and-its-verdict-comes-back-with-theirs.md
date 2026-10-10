---
id: TSK-0806
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5306, REQ-5308, REQ-5310, REQ-5370]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The estimate travels with the exact answer in one request, its verdict comes back beside the exact verdict, and the outcome reads the exact answer alone

After this task, the task window shows the estimate step first on an item with an estimate, the client locks her pick and sends it as `estimate` in `AnswerIn` beside the exact answer, `AnswerOut` carries her pick and the correct option beside the exact verdict, and nothing about the estimate's verdict leaves the server earlier.

## Acceptance criteria

1. Given an item with an estimate, when it is shown, then the answer field, the keypad and «Готово» (Done) are hidden and the thread button is inactive until she picks an option (REQ-5306). Closed by: a state-machine test.
2. Given every task kind with and without an estimate, when the packets are read, then none holds the correct index, an option in value order across seeds, or any value the estimate's verdict could be worked out from before `AnswerOut` (REQ-5306, REQ-5370). Closed by: a packet test.
3. Given a first attempt with a pick, when `AnswerOut` is read, then it carries the estimate's `picked` and `correct` beside `feedback.correctAnswer`, and the review draws both together with her pick outlined and the correct option marked (REQ-5308). Closed by: an integration test and a Playwright test.
4. Given two attempts with the same exact answer and different estimates, when their outcome, streak change and rewards are compared, then they are equal (REQ-5310). Closed by: a rewards test on fixtures.
5. Given an `AnswerIn` for an item with an estimate carrying no pick and no «Не знаю» (I don't know), when it arrives, then the server logs nothing and replies `422 estimate_missing` and the client shows the estimate step again (REQ-5306). Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the estimate step to state `open` of ADR-0080's attempt flow, as ADR-0240 amends it. «Не знаю» works in the step and gives `alt` as usual, with no estimate recorded; ADR-0360 adds that an `AnswerIn` carrying `insufficient` needs no pick either, which ADR-0250's epic builds. A resume before «Готово» shows the estimate step again, because the server never held the pick; the attempt's time already counts in no measure under TSK-0809.

`AnswerIn` gains `estimate?: { option }` and `AnswerOut` gains `estimate?: { picked, correct }`; both change SPC-0030's `.strict()` schemas and `Room` gains `estimate?: { options }`. The answer route judges both at once, so no estimate verdict can leave it before the exact answer. ADR-0370 sets `estimate_missing` to `422`. ADR-0140 reads the first attempt's verdict and never the `estimate` field, so it needs no change.

## Depends on

- TSK-0804 (blocking): the options the step shows.
- TSK-0813 (blocking): the `estimate` field on `attempt_submitted` and the `estimateRight` field on `verdict`.

The epic realising ADR-0150 supplies the design system's options and the epic realising ADR-0080 the attempt flow; this task adds the step to the flow in `src/server/play.ts` and draws it with the plainest controls until then.

## Evidence

Not yet.

## Left alone

The pixel layout of the four options, which ADR-0150 and its specification own, and the labels, which TSK-0807 holds.
