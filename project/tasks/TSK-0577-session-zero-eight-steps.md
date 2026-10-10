---
id: TSK-0577
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0132, REQ-0136, REQ-0138, REQ-0140]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Session 0 runs eight steps in order in 20 to 25 minutes and lets her choose a name, a cloak colour and a focus but no look

After this task, the first time the game runs, Session 0 replaces the adventure and runs its eight steps in order, each with a time budget that sums to 22 minutes, and the heroine's creation offers a name, a cloak colour and a focus and no choice of look.

## Acceptance criteria

1. Given a fresh database, when the first session is played through, then the steps come in order: the transparency talk, creating the heroine, choosing the starting familiar, the first chest, training on trivial numbers, motor calibration of 10 plain-input tasks, the vocabulary probe, and the first scene with the end of the row (REQ-0136). Closed by: an integration test over the packets.
2. Given the creation step, when its packets are read, then they offer a name, a cloak colour and a focus, and no choice of look (REQ-0138, REQ-0140). Closed by: an integration test and a Playwright test of the creation screen.
3. Given the step budgets, when they are summed, then they total 22 minutes: 2, 2, 2, 1, 4, 3, 5 and 3 (REQ-0132). Closed by: a unit test over the constants.
4. Given the stage 0.2 adult session of REQ-3010, when Session 0 is played start to end, then it takes 20 to 25 minutes (REQ-0132). Closed by: a person's judgement with the logged times, because the length depends on how a real player reads and chooses and no test can fix it.
5. Given she leaves during Session 0, when she returns, then it resumes at the same step. Closed by: an integration test with a restart.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add a Session 0 flow to the play routes that takes the place of `adventure_planned` on the first game day, using the stand-in scenes and tasks for the steps whose content the other epics build. The step budgets are the ones ADR-0090 chose, and the motor calibration and the vocabulary probe set their outputs, the input-speed correction and the list of risky terms, as events that later epics read. Session 0 counts as that game day's adventure, so no new adventure starts that day.

## Depends on

The epic realising ADR-0330 changes the training step to the answer field and «Не знаю» on trivial numbers with no thread, hint or explanation; this task builds the step with trivial numbers and leaves that change to that epic. The epic realising ADR-0070 reads the input-speed correction, and the epic realising ADR-0110 supplies the story text of the first scene.

## Evidence

Not yet.

## Left alone

The skip rule for estimates, which TSK-0578 builds, and the art of the three character sheets, which ADR-0170 owns.
