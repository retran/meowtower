---
id: TSK-0712
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-2324, REQ-2326, REQ-0711, REQ-2362, REQ-2364, REQ-2366]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The misconceptions screen groups traps across nodes and lists the unrecognised, and the science screen shows no score

After this task, the misconceptions screen lists the traps that fired by frequency with up to 3 examples a row and one row for a misconception across nodes, with every unrecognised answer or step listed below it, and the science screen lists each topic's questions with the first option and the misconception it names, and no score.

## Acceptance criteria

1. Given the trap «длиннее — больше» fired in D1 and in P1, when the screen is built, then it is one row ordered by frequency, and a row with 5 firings shows 3 examples (REQ-2324, REQ-2326). Closed by: a unit test and a Playwright test.
2. Given an answer and a step the engine didn't recognise, when the screen is built, then each is listed below the rows as unclassified with its task, for the parent to review by hand (REQ-0711). Closed by: a unit test.
3. Given a topic with 3 answered questions, when the science screen is built, then it lists each question, the option she chose first and, for a wrong option, the misconception it names (REQ-2362). Closed by: a unit test.
4. Given a misconception she chose twice, when the screen is built, then it is marked as a topic to talk about, and once is not (REQ-2364). Closed by: a unit test.
5. Given the science screen, when its text is searched, then it holds no score, state or percentage (REQ-2366). Closed by: a Playwright test that scans the rendered text.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two report parts and their screens. The screen groups by the misconception identifier ADR-0040 gives each trap, which is shared across nodes. The cap of 3 examples a row is a value ADR-0180 chose, so a frequent trap doesn't push the rest off the screen; the node card holds every attempt. An unrecognised answer is one the trap classifier of ADR-0040 returns as unclassified, and an unrecognised step is one the step matcher couldn't place.

The epics realising ADR-0040 and ADR-0130 supply the misconception identifiers, the step matching and the science questions with their misconceptions. Until they exist the tests use fixtures.

## Depends on

- TSK-0708 (blocking): the parts join the report model and its cache.

## Evidence

Not yet.

## Left alone

The science questions and their misconceptions, which ADR-0130 owns, and the story book screen, which ADR-0110 provides.
