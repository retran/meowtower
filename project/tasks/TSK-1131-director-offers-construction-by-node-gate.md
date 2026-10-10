---
id: TSK-1131
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7200, REQ-7238, REQ-7240]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director offers a construction only when its nodes are at "understands" or above, from any floor that lets a riddle play

After this task, the Director can draw a riddle's target from any of the seven constructions as well as from the word-problem types of T1 to T4, only when every node the construction needs passes the gate, and from any floor where a riddle may play.

## Acceptance criteria

1. Given a synthetic log, when the Director plans a floor where ADR-0230's floor rule lets a riddle play, then the target can come from a construction as well as from a problem type, with at most one riddle on a floor that holds word problems and at most 2 riddles a game day (REQ-7200, REQ-7240). Closed by: a Director test over seven constructions.
2. Given the nodes A3 for equal groups, A4 for the two meanings of division, F2 for a fraction of a number, D4 for decimals, P2 for a percentage of a number or P3 for a discount, P4 for a ratio, and A11 with the node of each operation for a multi-step expression, when one of them falls below "understands", then the construction isn't offered from the next floor on (REQ-7238). Closed by: a Director test that opens and closes each gate.
3. Given a node whose `testedState` is "understands", "fluent" or "stable", or whose `inferredState` is "fluent (inferred)", then it passes the gate; given any other, then it doesn't (REQ-7238). Closed by: a unit test, five fixtures.
4. Given a target of the shape N − p % of N, then the gate reads P3, and given any other percentage target, P2, by the target's shape and not by a template field (REQ-7238). Closed by: a unit test, two fixtures.
5. Given several eligible sources, when the Director chooses, then it takes the one with the fewest confirmed riddles over the last 28 game days, counting every `compose_confirmed` of the source whatever followed it, and breaks a tie by the riddle's seed (REQ-7240). Closed by: a Director test with fixture counts and a tie.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the gate and the source choice to ADR-0230's target selection: "a word-problem template of that floor whose tier node is at 'understands' or above, or a construction template from any floor whose nodes pass the gate". A construction has no problem type, so the tier node can't stand in for it. The nodes per operation of a multi-step expression are the defaults REQ-7238 lists: `+` and `−` need A2 within 100 and A5 above it, `·` needs A3 within the table and A6 above it, `:` needs A4 within the table and A9 above it, and an expression with a decimal, a fraction, a percentage or a ratio also needs that family's node. The gate reads the state when the Director plans the floor. The window of 28 game days is the one RES-4210's profile uses, so both readings of the composing stream cover the same span.

## Depends on

- TSK-1130 (blocking): the gate reads the construction a template declares.

The epic realising ADR-0060 supplies the node states and the epic realising ADR-0230 the floor rule and the confirmed-riddle events.

## Evidence

Not yet.

## Left alone

The choice of a division meaning, which TSK-1132 adds, and the case where no construction passes: the Director then draws from ADR-0230's problem types alone, or offers no riddle, and the report line shows «ещё не предлагалась», which TSK-1135 adds.
