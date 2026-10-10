---
id: TSK-1081
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6924]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A subtype with both formats takes only bare templates until its node is fluent or 14 game days pass

After this task, the item builder takes only bare templates of a subtype that has templates in both formats, from the subtype's first show until its node is fluent by a tested result or 14 game days have passed, and the node's bare share never falls below half.

## Acceptance criteria

1. Given a subtype with a bare and a context template, first shown on game day D, and its node not fluent, when the item builder picks on D itself and on each of D+1 to D+13, then it always takes the bare template (REQ-6924). Closed by: an item builder test with a fixed clock.
2. Given the same subtype, when the 14th game day after D begins and the node is still not fluent, then the builder may take the context template (REQ-6924). Closed by: the same test on D+14.
3. Given the node becomes fluent by a probe or a full block on D+5, when the builder next picks, then the context template is allowed at once; given the node holds only an inferred fluent, then the hold stays (REQ-6924). Closed by: the same test with fixture states.
4. Given a held subtype on a node whose other subtypes have no bare template, when the builder picks over a simulated month, then the node's bare share of scored tasks stays at or above half, so ADR-0290's half-bare rule still holds. Closed by: a simulation test on a fixture graph.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Put the format hold in the item builder before ADR-0290's half-bare rule: a held subtype takes a bare template whatever the node's bare count, so the node's bare share only rises. Hold the context format and never the bare one, because holding bare could break the half-bare rule on a node whose other subtypes have no bare template. Count the 14 game days from the game day of the subtype's first show with `gameDayOf`, the first show included. Read each subtype's first show from the used sets TSK-1080 folds. A hold ends once, when the node is first fluent by a tested result, and never returns for a node that later falls below fluent.

## Depends on

- TSK-1080 (blocking): it reads the used sets and the `testedState` reader that task adds.

The epic realising ADR-0040 supplies the item builder and the epic realising ADR-0060 the tested states; until they exist the task runs on fixture templates and fixture states.

## Evidence

Not yet.

## Left alone

`transfer_hold` in `why`, which TSK-1082 adds for both holds, and the side-slot rule, which TSK-1083 adds.
