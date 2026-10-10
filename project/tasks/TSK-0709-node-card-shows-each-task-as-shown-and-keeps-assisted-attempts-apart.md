---
id: TSK-0709
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-2310, REQ-2312, REQ-2314, REQ-2316, REQ-2328, REQ-2368]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The node card shows each task as the player saw it, and assisted attempts reach only the "with help" figures

After this task, the node card shows a node's state with its «сама» estimate and uncertainty, the share of correct assisted attempts under «решает с подсказкой» and every task exactly as shown, and the skill map and states read unassisted first attempts only.

## Acceptance criteria

1. Given random logs, when a property test changes only the answers of assisted attempts, then the skill map, the states and the ladder stay equal while the «с помощью» figures change (REQ-2310, REQ-2312). Closed by: a property test over 1,000 generated logs.
2. Given a node, when its card is built, then it shows the state, the «сама» estimate with its uncertainty and, beside it under «решает с подсказкой», the share of correct assisted attempts (REQ-2314, REQ-2316). Closed by: a unit test and a Playwright test of the card.
3. Given a node with 120 attempts, when the card pages its task log, then each page holds 50 rows, and each row shows the task from the `shown` view of its `item_shown` event, her answer, the correct answer, the time, the help she used and the review (REQ-2328). Closed by: an integration test and a Playwright test.
4. Given a wrong attempt whose task lists a risk term and whose term explanation she didn't open, when the card is built, then the attempt carries «возможна языковая причина»; given any one of the three conditions missing, then it carries none (REQ-2368). Closed by: a unit test over the eight combinations.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the node card's report part and its screen under the Parent Room. The card draws each task from the `shown` view, so the parent sees what the player saw. Assisted attempts reach the report only in the «с помощью» figures. The page size of 50 rows is a value ADR-0180 chose, from about 140 attempts a node in a year.

The epic realising ADR-0060 supplies the states, estimates, uncertainty and state history, and the epic realising ADR-0040 supplies each task's `shown` view and its risk terms; until they exist the tests use fixtures shaped as SPC-0060 and SPC-0040 state them.

## Depends on

- TSK-0708 (blocking): the part is built in `src/parent/` and served from the cache.

## Evidence

Not yet.

## Left alone

The state history's lesson marks and labels, which TSK-0721 adds to the same card, and the mean depth of help and the estimate matrix, which later decisions add.
