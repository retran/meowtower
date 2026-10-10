---
id: TSK-0524
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0934, REQ-0936, REQ-0938, REQ-0940, REQ-0942, REQ-0946]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each node's state follows from a named rule over its listed attempts, never from a probability

After this task, the rule engine gives each node a state by the rules `block-low`, `block-mid`, `block-slow`, `block-fast`, `probe-fast`, `open` and `none`, stores the rule's identifier and the item identifiers it used on the row, and carries the label key whose Russian string for "not mastered" is «Пока не освоено».

## Acceptance criteria

1. Given fixture logs with a full block scoring 2 and 2,5, when the states are read, then both are "not mastered" by `block-low`; given blocks scoring 3 and 3,5, then both are "understands" by `block-mid` (REQ-0936, REQ-0938). Closed by: a unit test for each score.
2. Given a block scoring 4 whose right answers have a median time above the threshold, when the state is read, then it is "understands" with the label «Понимает, нужна скорость» by `block-slow`; given the same block with a median at or below it, then it is "fluent" by `block-fast` (REQ-0940, REQ-0942). Closed by: a unit test for each.
3. Given a probe whose two tasks are right and each no slower than the threshold, when the state is read, then it is "fluent (probe)" by `probe-fast`; given a choice-only probe with all 3 right, then the same; given a probe with one wrong, then the state is "being clarified" by `open` (REQ-0942). Closed by: a unit test for each.
4. Given a node with no unassisted first attempt, when the state is read, then it is "not checked" by `none`, and "stretch: not checked" on a stretch node. Closed by: a unit test.
5. Given a state row, when it is read, then it holds the rule identifier and the item identifiers the rule used, and no state depends on `pKnow` or another probability: changing `pKnow` in a fixture leaves the state unchanged (REQ-0934). Closed by: a unit test that varies the parameters and compares the states.
6. Given the key `state.not_mastered`, when the Russian file is read, then its string is «Пока не освоено» and no code holds the string (REQ-0946). Closed by: a unit test on the language file and the static check of the lint verb.
7. Given several complete checks that match, when the state is read, then the newest check by the `seq` of its last observation sets the tested state. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/states/rules.ts` with the table of rules from SPC-0060, over the checks of TSK-0523 and the fluency threshold of TSK-0521. Add the golden test of ADR-0060: fixed fixture logs run through the rule engine and are compared with stored states, and the test fails naming the fixture when a state changes and `RULES_VERSION` didn't. Create `src/engine/states/version.ts` with `RULES_VERSION`.

The state's label and chip fill come from a key and a mapping; the Russian strings live in the per-language file `content/i18n/ru.json`, which ADR-0160 shapes.

## Depends on

- TSK-0523 (blocking): the block and probe definitions.
- TSK-0521 (blocking): the fluency threshold and `fast`.

## Evidence

Not yet.

## Left alone

The state "stable", which TSK-0525 adds, inference, which TSK-0526 adds, and how the report draws a state with its evidence, which ADR-0180's epic builds.
