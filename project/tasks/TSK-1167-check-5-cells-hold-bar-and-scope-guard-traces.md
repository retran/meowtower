---
id: TSK-1167
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-7500, REQ-7504]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Check 5 waits for 20 on every cell, the hold tool reads its interval once, and each scope-guard trace names its backlog item

After this task, build check 5 reads a seed only when each of its four cells holds 20 graded first attempts, `tools/hypothesis-hold.ts` accepts a hold only when the upper limit of the 95 % Wilson interval of its false-label rate is at or below 10 %, and each trace in `verify/scope-guard.json` names the backlog item whose epic builds its part. This settles entries 1, 3 and 37 of ADR-0460.

## Acceptance criteria

1. Given a seed in which `bare` holds 10 graded first attempts and the other three cells hold 20, when check 5 runs, then the seed isn't read and the check waits, and given 20 in all four cells, then it is read (REQ-7500). Closed by: a unit test over both seeds.
2. Given the four players of 20 seeds each, when the check runs, then the maths-gap player sits at 55 % on every presentation, the language-gap player at 90 %, 90 %, 45 % and 85 %, the no-gap player at 90 % and the both-gaps player at 55 %, 55 %, 15 % and 50 % on `bare`, Russian, Dutch and Dutch-after-words (REQ-7500). Closed by: a unit test over the four players' rates.
3. Given a fixed run of 2,000 synthetic hypotheses at one H, when the tool reads its interval once, then it accepts the H for a true false-label rate of 8 % and refuses it for 10.3 %, and it prints for each H from 7 to 56 the rate, its 95 % Wilson interval and the number of hypotheses run (REQ-7504). Closed by: a unit test over two fixture rates and the tool's output.
4. Given a fixture whose trace names no backlog item, when group 1 runs, then the scope guard fails and names the trace, and given the Dutch locale and probe traces, then each keeps its condition on the owner's amendment of `CLAUDE.md`. Closed by: a fixture test of the scope guard.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the tool to the bar of REQ-7504: a fixed 2,000 hypotheses, read once, so the interval keeps its 2.5 % chance of passing a rate above 10 % and a rule that stopped at its first pass would lose it; at 2,000 the bound passes a true rate of about 8.6 % or less. Add the rule that a seed waits for its cells, since at 10 bare observations the both-gaps player's joint rate falls to 74.6 % and a working report would pass on only 77 % of seed sets.

## Depends on

Nothing. The epic realising ADR-0450 supplies `tools/hypothesis-hold.ts` and its rule functions, and the epic realising ADR-0380 supplies check 5's generator and its players; where either hasn't landed, this task changes the stand-in each fixture names and that epic's task takes the change over.

## Evidence

Not yet.

## Left alone

The hold's value H and the label itself, which ADR-0450 owns, and the order of the backlog in the stage 0.3 review record, which no code reads.
