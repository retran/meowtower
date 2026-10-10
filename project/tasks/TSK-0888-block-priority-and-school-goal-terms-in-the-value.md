---
id: TSK-0888
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5822, REQ-5824, REQ-5826]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director's value gains block priority and a school-goal term, and takes the larger of a goal and a lesson mark

After this task, `content/director.v2.json` holds the weights of v1 plus `block_priority` 1.5 and `school_goal` 1.0, and the value of a node includes both terms, with a confirmed school goal and a fresh lesson mark counted once as the larger of the two.

## Acceptance criteria

1. Given fixture nodes whose block is unready with `citoBlock` 1, 3 and 6, a node whose block is ready and a node with `null`, and `cito:M7` active, when `block_priority` is computed, then it is 1, 4/6, 1/6, 0 and 0 (REQ-5822). Closed by: a unit test.
2. Given two nodes equal in every other term, one with an unready block 1 and one with `null`, when the value is computed, then the first scores 1.5 higher; given no active horizon, then both score the same (REQ-5822). Closed by: a unit test on the v2 value function.
3. Given an input list of confirmed links from goals the parent entered, when `school_goal` is read for a node a link reaches, then it is 1; given an unconfirmed link, a goal that came from a school snapshot, or the empty list the MVP passes, then it is 0 (REQ-5824). Closed by: a unit test over four fixture inputs.
4. Given a node reached by a confirmed goal and by a fresh lesson mark, when its value is computed, then the term is the larger of the two, 1.5, and never 2.5 (REQ-5826). Closed by: a unit test.
5. Given every `citoBlock` `null`, or no horizon active, when the v2 value is computed for the fixture nodes, then each equals its v1 value (ADR-0290's rule that each part keeps the game working when absent). Closed by: a unit test that compares the two files' values.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two term functions and `content/director.v2.json` beside v1. The school-goal function takes the confirmed links of goals the parent entered as an input and reads no event. The MVP passes an empty list, so `school_goal` is 0 there, because the goal import, the events `school_goals_imported` and `school_goal_mapped` and the mapping panel come after the MVP and ADR-0210's scope guard keeps school code out of the tree until then. After the MVP, a projection of `school_goal_mapped` feeds the input.

`block_priority(v)` is `(7 - b) / 6` for the node's own `citoBlock` `b`, as ADR-0360 amended ADR-0290, and 0 when that block is ready, the node's block is `null` or no horizon is active. `school_goal(v)` reads only `school_goal_mapped`. The value is the formula of ADR-0070 with `1.5 * block_priority(v)` added and its last term changed to `max(2.0 * recheck, 1.5 * parent_topic, 1.0 * school_goal)`. A term never reads the expected chance of success.

The epic realising ADR-0070 supplies the value formula and `content/director.v1.json`. Until it exists, this task adds the two term functions and a function that sums the v2 formula over fixture inputs, and that epic wires them into `planFloor`.

## Depends on

- TSK-0885 (blocking): the active horizon comes from the `horizons` projection.
- TSK-0887 (blocking): `citoBlock` and block readiness come from the graph and `cito_blocks`.

## Evidence

Not yet.

## Left alone

The 60-day simulation that proves the corridor, the window and the stretch cap with both terms on, which TSK-0895 runs. The goal import with its 200-goal cap, and the two events that carry the parent's goal list, which wait for the stage after the MVP.
