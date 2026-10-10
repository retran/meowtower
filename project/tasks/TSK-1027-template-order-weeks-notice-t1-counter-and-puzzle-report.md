---
id: TSK-1027
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-5670, REQ-5796]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director takes the least recently shown template, and four counters and notices get one rule each

After this task, the Director and the science bank take the least recently shown eligible template, `yarn_weeks_high` reaches the owner once per rise, the T1 counter is its own projection, and the puzzle report counts a rungless solve as 0 and fires its box line once per rise.

## Acceptance criteria

1. Given three eligible templates of the chosen technique shown 5, 2 and never, when the Director chooses, then it takes the never-shown one, and the day's seed breaks a tie; given the science bank, then it chooses its questions in the same order. Closed by: a Director test and a bank test.
2. Given `yarn_weeks_high` rising, falling and rising again, when `./meowtower status` runs after each, then the notice shows once at the first rise, not again while the value stays high, and again only after it cleared and rose. Closed by: a status test.
3. Given first-shown T1 problems, second attempts and riddles she composed, when the projection `word_problem_cycle_t1` counts, then it counts the `item_shown` events of first-shown T1 problems only, and the share that opens with a model choice over any 30 days is between 20 % and 30 %, or within one problem of that range (REQ-5670). Closed by: a projection test and a 30-day simulation.
4. Given a puzzle solved with no rung and two solved at rungs 1 and 3, when the report builds its mean of the highest rung, then the mean is 1.33; given the box rising past 20, falling to 20 and rising again, then the box line shows at the first rise and again at the second only; and the section «Нестандартное мышление» sits on the readiness screen labelled as a reserve (REQ-5796). Closed by: a report test over a fixture log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the Director's template choice, the status notice, the counter and the report. The status command is where the owner reads every other notice, and a line that returns only on new information fires once per condition. The T2 to T4 cycle never sees T1 problems, so the T1 counter is its own projection beside `word_problem_cycle`. A solve with no help is the case the mean exists to show.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The Director's technique choice and the puzzle bank's offers, which ADR-0260 and ADR-0280 own.
