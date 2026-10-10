---
id: TSK-0643
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3652, REQ-3654, REQ-3656, REQ-3658]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A science question repeats only outside a 45 or 90 day window, and every repeat is marked

After this task, `pickScience` returns the least recently shown approved question of a topic, never-shown first, keeps the repeat window of 45 game days before stage 0.5 and 90 from it, and marks a repeat in `item_shown`.

## Acceptance criteria

1. Given a topic with 50 approved questions and a simulation of 90 game days before stage 0.5, when each pick is read, then no question repeats within 45 game days while the topic has a question not shown in that time (REQ-3652). Closed by: a simulation test.
2. Given the same simulation at stage 0.5 or later, when each pick is read, then no question repeats within 90 game days while the topic has a question not shown in that time (REQ-3654). Closed by: a simulation test with the stage set to 0.5.
3. Given a topic whose every approved question was shown inside the window, when a pick is made, then the question shown longest ago comes and its `item_shown` event carries `repeat: true` (REQ-3656, REQ-3658). Closed by: a unit test.
4. Given the bank file's `repeatWindowDays` that doesn't match the build's stage, when the verify command runs, then it fails naming the value and the stage (REQ-3652, REQ-3654). Closed by: a unit test of the check with both stages.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `pickScience` to `src/server/science.ts`. A game day ends at 04:00. Break ties by the slot's seed, so the same state gives the same pick. The report counts only the first answer to a repeated question, which ADR-0180 holds, so the event's mark is the whole contract here.

## Depends on

- TSK-0642 (blocking): the pick takes only approved questions.

The epic realising ADR-0070 supplies the science slot and its topic. Until it lands, the topic is an argument. The stage comes from the stage setting of the epic realising ADR-0190.

## Evidence

Not yet.

## Left alone

The topics' place outside the skill graph, which ADR-0050 owns, and the growth of the bank from 200 to 400 questions at stage 0.5, which is the parent's and the agent's work.
