---
id: TSK-0717
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-2356, REQ-2358, REQ-2360, REQ-2370, REQ-1308]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The limits screen shows one row for each of the twelve limits, with «мало данных» below three sessions

After this task, the v1 limits screen shows one row for each of the twelve limits with its value, the number of sessions behind it and its flag, shows «мало данных» where fewer than 3 sessions hold data, draws no chart, and lists the terms and nodes of the language-risk limit.

## Acceptance criteria

1. Given a fixture with sessions of data, when the screen is built, then it holds twelve rows named holding steps, endurance, speed of the basics, mental or written, error type, carelessness, impulsiveness and rapid guesses, avoidance, anxiety, flow, language risk and help, each with its current value, the number of sessions behind it and its flag where the limit has one; and the summary shows one line for each limit (REQ-2356). Closed by: a unit test and a Playwright test.
2. Given a fixture with 2 sessions, when the screen is built, then all twelve rows show «мало данных» in place of the value; given the same fixture with 3 sessions, then they show values (REQ-2358). Closed by: a unit test with both fixtures.
3. Given the screen, when its markup is searched, then it holds no chart element and no split of a limit by part of the session or by task kind (REQ-2360). Closed by: a Playwright test that finds no canvas, SVG chart or per-part column.
4. Given mistakes on tasks that hold a risk term whose explanation she didn't open, when the language-risk row is built, then it lists them by term and node (REQ-2370). Closed by: a unit test.
5. Given the avoidance and anxiety rows, when the parent reads their wording, then the parent judges that they read as observations with a prompt to talk with the player, and as no grade (REQ-1308). Closed by: the parent's judgement, because whether a sentence reads as a grade is a matter of tone that no program can settle.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the limits screen and its report part, reading `LimitsResult` through the smoothing of TSK-0714. The floor of 3 sessions and the window of 7 are values RES-2300 chose, because a single day's value would otherwise read as a trait. The screen shows no chart and splits nothing; the full views come after the MVP and add views over the same result.

The strings come from `parent.*` in the Russian string file, and the label check of TSK-0708 covers them.

## Depends on

- TSK-0714 (blocking): the screen reads its result type and smoothing.
- TSK-0715 (blocking): five of the twelve rows are computed there.
- TSK-0716 (blocking): five more rows are computed there.
- TSK-0710 (blocking): the one line for each limit goes onto its summary screen.

## Evidence

Not yet.

Criterion 5 rests on the parent's judgement, because the wording of an observation against a grade is tone.

## Left alone

The full limits screen after the MVP, with its views of REQ-1306, and the Russian wording, which ADR-0160 owns.
