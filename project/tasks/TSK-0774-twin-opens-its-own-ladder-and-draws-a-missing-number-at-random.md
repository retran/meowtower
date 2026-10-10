---
id: TSK-0774
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5104, REQ-5166]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parallel task opens its own ladder for 1 thread, keeps the first task's features, and draws a missing-number twin at random

After this task, opening the ladder on the parallel task of a second attempt costs 1 guiding thread of its own whether or not the first task's ladder was open, no task spends more than 4 threads across both attempts, and the twin keeps the first task's template, subtype and difficulty features, except that the twin of a problem with a missing number is drawn at random between a missing-number and a solvable problem of the same tier.

## Acceptance criteria

1. Given a first attempt with an open ladder and a twin that follows, when she opens the twin's ladder, then it spends 1 thread of its own and logs `thread_spent` with reason `hint_ladder` for the twin's item (REQ-5104). Closed by: a ledger test.
2. Given every path through the two attempts, an opening and an explanation on each, when the threads are summed, then no task spends more than 4 (REQ-5104). Closed by: a state-machine test over the paths.
3. Given 1,000 seeds of a template and a subtype, when the twin is generated, then it has the first task's template, subtype and difficulty features with new numbers (REQ-5166). Closed by: a generator test.
4. Given 1,000 seeds of a problem with a missing number, when the twin is drawn, then both a missing-number and a solvable problem of the same tier occur (REQ-5166). Closed by: the generator test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Charge the twin's ladder opening to the twin's own item id, so the charge key of TSK-0773 gives it a thread of its own. The twin is a task of its own, and a free ladder there would weaken the check that the first hint helped.

Make the parallel-task generator keep the template, subtype and difficulty features, and add the random draw for a missing number's twin. The share of missing-number twins is RES-4040's decision, so the draw takes the share as a parameter; I chose an even draw as the default until that decision supplies it, because REQ-5166 asks only that both kinds occur.

The ceiling of 4 threads a task replaces ADR-0080's 8 in the balance check.

## Depends on

- TSK-0773 (blocking): the charge key and the ladder ledger the twin's opening uses.

The epic realising ADR-0040 supplies the parallel task of a second attempt and the epic realising ADR-0250 the missing-number subtype; this task runs on the stand-in twin and a fixture subtype and leaves the real draw's share to them.

## Evidence

Not yet.

## Left alone

The trigger that brings a twin after a miss or a deep hint, which REQ-7164 states and ADR-0430 owns, and the rewards of a second attempt, which ADR-0140 keeps.
