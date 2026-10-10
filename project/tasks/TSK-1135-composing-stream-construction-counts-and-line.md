---
id: TSK-1135
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7254, REQ-7256, REQ-7258]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The composing stream counts each verdict per construction, form and meaning, and the report line shows the counts

After this task, the composing stream keeps, for each construction and form, the count of each verdict other than `unparsed` and of each error class, for division also the counts per requested meaning and per parsed kind, and the report line «Может составить задачу» shows them as counts with no state.

## Acceptance criteria

1. Given a log of construction riddles, when the projection replays it, then it holds for each construction and each form, text or cards, the count of each verdict other than `unparsed` and of each error class, and an `unparsed` riddle adds to none (REQ-7254). Closed by: a projection test.
2. Given riddles on the two meanings of division, then the stream also holds each verdict's count per requested meaning and per the division kind the parse gave (REQ-7256). Closed by: a projection test, two meanings and two parsed kinds.
3. Given the report line, when it is shown, then it holds the counts beside the matrix of type by steps, as counts with no state and no share, and a construction with no riddle reads «ещё не предлагалась» (REQ-7258). Closed by: a report test.
4. Given the same log with every construction riddle removed, when the projections run, then every estimate, state, probe, block, success share, holding-steps count and step-input share is unchanged. Closed by: a projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the key construction and form, and the meaning split, to the composing stream of ADR-0230, whose existing key is tier, problem type and form. The keys are fixed: 7 constructions by 2 forms by 4 verdicts, plus the 2 by 2 meaning split, so the counters don't grow with play. The line shows no share, so ADR-0380's rule that every share carries its count and interval has nothing to apply to; a share added later takes that rule. No study RES-4260 read measures one child by composing, so the counts support no state. The profile's conceptual-understanding bar reads the stream under REQ-6750 and ADR-0390 counts a construction riddle by ADR-0230's riddle rule, so this task changes neither.

## Depends on

- TSK-1129 (blocking): it counts the new error classes.
- TSK-1130 (blocking): its key is the construction a template declares.

The epic realising ADR-0180 supplies the report line and the epic realising ADR-0230 the stream.

## Evidence

Not yet.

## Left alone

A composing state and any share of the counts, and the report of operator stories against divide-then-multiply stories, which a later record writes from the named graph.
