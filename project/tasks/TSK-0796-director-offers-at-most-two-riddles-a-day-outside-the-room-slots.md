---
id: TSK-0796
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5256, REQ-5258, REQ-5264]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director offers at most 2 riddles a game day as a story scene outside the room slots, on a node she understands

After this task, `planFloor` places at most one riddle on a floor that holds word problems and at most 2 riddles a game day of either form, as a story scene set by a Tangle or a Guardian outside the room slots, for a word-problem template whose tier node is at least at «Понимает» (understands), and with the purpose `compose`.

## Acceptance criteria

1. Given a simulated game day, when the plan is read, then it holds at most 2 riddles of either form, and a floor holds at most one (REQ-5258). Closed by: a Director test over 60 simulated days.
2. Given a plan with a riddle, when the floor's rooms are read, then each has the length it had without the riddle and the riddle's slot sits outside the room slots of REQ-1000's three sources (REQ-5264). Closed by: the Director test.
3. Given a tier node below «Понимает», when the Director chooses a riddle target, then it offers none for that type, and at «Понимает» or above it may (REQ-5256). Closed by: the Director test with two node states.
4. Given a template of the floor, when the target is generated, then it is an expression, a bar diagram or a short note with the purpose `compose`, and ADR-0060 and ADR-0070 never read that purpose as an observation (REQ-5256). Closed by: a generator test and a projection test.
5. Given the text form's conditions failing one at a time, the flag off, live calls off, the parse bucket unable to reserve two parses and the free-text field switched off, when the Director offers a riddle, then it offers a card riddle in place of the text form (REQ-5264). Closed by: the Director test with four fixtures.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the riddle placement to `planFloor` of ADR-0070: a story scene outside the room slots, set by a Tangle or a Guardian, because the addendum frames the riddle as a question one of them asks backwards, so it adds nothing to a room's length. The target is a word-problem template of that floor whose tier node is at least at «Понимает», because ADR-0060 keeps states for each node and no record yet defines a state for each type. Add the value `compose` to the purpose field.

ADR-0230 reads REQ-5218's four conditions as gating the text form only, and REQ-5096 wins for cards: a card riddle calls no model and writes no text, so the four conditions don't apply to it. ADR-0360 revises the requirement's wording through REQ-6420; this task follows the decision's reading and the epic realising ADR-0360 holds the wording.

## Depends on

- TSK-0789 (blocking): the card form the Director falls back to.

The epics realising ADR-0040, ADR-0060 and ADR-0070 supply the generator, the node states and the Director; this task adds the placement to the Director as it stands.

## Evidence

Not yet.

## Left alone

A state for composing, which no record defines and REQ-5252 forbids drawing from the stream, and the choice of node under a retention check, which ADR-0400 owns.
