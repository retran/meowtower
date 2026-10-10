---
id: TSK-1094
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7002, REQ-7004, REQ-7006, REQ-7008, REQ-7010, REQ-7014]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A goal's home side reads block states of tested nodes at the snapshot's document date

After this task, `src/parent/school/quadrants.ts` holds the pure function that reads a goal as high, low or neither at home from the block states of its linked nodes on the snapshot's document date, and puts a goal with no usable reading in no quadrant with its reason.

## Acceptance criteria

1. Given a node whose `node_snapshots` row has the rule `block-slow`, `block-fast` or `stable`, when the function reads it, then it is high; given `block-low` or `block-mid`, then low; given `probe-fast`, `open`, `none` or an inference rule, then it has no reading and the goal shows `home_untested` (REQ-7002, REQ-7004). Closed by: a unit test, one fixture for each rule.
2. Given `goalTasksTimed` is `false` and a node at `block-slow`, then the goal row counts it as high; given `goalTasksTimed` is `true`, then it counts as neither and the goal shows `home_speed_only`, and a Cito row keeps it high both ways (REQ-7006). Closed by: a unit test with both settings.
3. Given a goal whose linked nodes are all high, then it is high; all low, then low; some high and some low, then neither with `home_split` (REQ-7008). Closed by: a unit test, three fixtures.
4. Given a snapshot with a document date, when the function reads a linked node, then it uses the `node_snapshots` row of the last play day on or before that date, and not a later one (REQ-7010). Closed by: a unit test with a state that changes the day after.
5. Given a linked node with no unassisted first attempt on or before the document date, or whose last one lies 31 days before it, then the goal shows `home_stale`; given 30 days, then it reads (REQ-7014). Closed by: a unit test at 30 and 31 days.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the home side of `quadrants.ts` as a pure function of an as-of date over `node_snapshots` and the goal's confirmed links, reading no inferred state, no probe-only state and no other stream. Add the field `goalTasksTimed` to `content/school-goal-catalogue.json`, shipped `false`, in a new approved version of the catalogue, as ADR-0420 chose that file because it already carries a person's approval per version and nothing about the player. Thirty days is ADR-0180's threshold for a node not checked for a long time, so read it from there and don't repeat the number. The function takes the date as an argument and never reads the clock.

## Depends on

Nothing within this epic. The epic realising ADR-0060 supplies `node_snapshots` and its rules, and the epic realising ADR-0310 the goal links and snapshots; the task runs on fixtures of both.

## Evidence

Not yet.

## Left alone

The school side, which TSK-1095 reads, the ordering of reasons, which TSK-1098 sets, and the current state shown beside the document-date state, which TSK-1099 puts on the screen.
