---
id: TSK-1030
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6630, REQ-6640]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report draws its own lines only from a list fixed before her data exists

After this task, `verify/contrasts.json` lists each contrast that may draw an interpretation line with the decision that approved it, `src/parent/contrasts.ts` implements exactly those, and a per-node figure shows its interval and draws no line.

## Acceptance criteria

1. Given a fixture that adds a contrast to `src/parent/contrasts.ts` with no entry in `verify/contrasts.json`, and another that adds an entry with no code, when group 1 runs, then each fails with `contrast_not_declared` (REQ-6630). Closed by: a group 1 check and its two fixtures.
2. Given the file, when it is read, then it holds the language line and the maths line, each naming ADR-0380, and every later entry names the decision that approved it (REQ-6630). Closed by: a unit test.
3. Given a per-node figure whose 80 % interval lies wholly below 0.8, when the report is built, then the figure shows its interval and no interpretation line is drawn from it (REQ-6640). Closed by: a report test over a fixture log with 40 nodes.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `verify/contrasts.json` and `src/parent/contrasts.ts`. The function that draws a line takes a contrast's identifier, and no other module in `src/parent/` draws one. The profile's change lines at 97.5 % are entries ADR-0390 adds under its own approval (REQ-6730), so this file holds two entries when this task lands. A per-node figure draws no line because across 40 node comparisons about 8 would clear an 80 % interval by chance.

## Depends on

- TSK-1028 (blocking): the lines read the intervals.

## Evidence

Not yet.

## Left alone

What the two lines compare and when they appear, which TSK-1031 builds.
