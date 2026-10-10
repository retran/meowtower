---
id: TSK-1101
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7054, REQ-7056]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each row names the basis of each node's state and carries «одна проверка» when a node rests on one block

After this task, every row on the screen lists its nodes with the basis of each state, one block or two checks, and carries «одна проверка» when any of its nodes rests on one block.

## Acceptance criteria

1. Given a row with nodes at `block-fast`, `block-slow` and `stable`, when the screen shows it, then each node reads «один блок», «один блок» and «две проверки» in turn (REQ-7054). Closed by: a Playwright test.
2. Given a row in which any node rests on one block, then the row carries «одна проверка»; given a row in which every node is `stable`, then it doesn't (REQ-7056). Closed by: a Playwright test, two fixtures.
3. Given a Cito row, when the nodes are listed, then they are the category's tested nodes and not its mapped nodes, and a goal row lists its linked nodes (REQ-7054). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the basis to each node of a row from its `node_snapshots` rule: every state except «устойчиво» rests on one block of 5 answers, and a state from one block changes class about one block in four with no change in her, so the parent has to see which states are that fragile. The mark will be common, since every row with no stable node carries it, and a Cito row of 10 or more nodes almost always. Strings go under `parent.school.*` in `ru.json`.

## Depends on

- TSK-1099 (blocking): it extends the screen the route returns.

## Evidence

Not yet.

## Left alone

The quadrant's checks and causes, which TSK-1100 adds, and any rule that would hide the mark when it is common, because the parent needs to see it.
