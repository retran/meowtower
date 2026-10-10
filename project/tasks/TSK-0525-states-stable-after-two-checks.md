---
id: TSK-0525
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0944]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A node becomes "stable" only after "fluent" in two checks at least 14 days apart, one of them a full block

After this task, the rule `stable` reads the whole history of a node's checks and gives "stable" only when two checks at least 14 days apart were both "fluent", at least one was a full block and no later check was worse, and a probe is never one of the two.

## Acceptance criteria

1. Given a full block "fluent" on day 0 and another on day 14, when the state is read, then it is "stable" by `stable`; given the second on day 13, then it is "fluent" (REQ-0944). Closed by: a unit test for each.
2. Given a probe "fluent (probe)" on day 0 and a full block "fluent" on day 14, then the state is "stable"; given two probes 14 days apart and no block, then it is "fluent (probe)" and not "stable" (REQ-0944). Closed by: a unit test for each.
3. Given two "fluent" checks 14 days apart and a later check that scores "understands", when the state is read, then it isn't "stable" (REQ-0944). Closed by: a unit test.
4. Given the same history read in a recompute at a later time, then the state is the same, because the rule reads the log's events and not the clock. Closed by: a unit test at two fixed times.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `stable` rule to `src/engine/states/rules.ts` over the checks of TSK-0523, as SPC-0060 states it. The Ascent's anchor form counts as a check once Ascents exist; the draft defers them until after the MVP, so a full block is the only check that qualifies at first.

## Depends on

- TSK-0524 (blocking): the rule table and the golden test this rule joins.

## Evidence

Not yet.

## Left alone

The retention check after the MVP, which holds a stable node and which ADR-0400's epic builds, and the Ascent anchor form.
