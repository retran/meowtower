---
id: TSK-0658
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-1952, REQ-1954, REQ-3532, REQ-3534]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A hatching offers the canon name first, lets her give her own, and never suggests a name already in use

After this task, `suggestNames` offers the familiar's canon name first, drops a suggestion that equals a move's name or any name in use, fills the dropped place from the hand-written list under the same filter, and accepts a name of her own.

## Acceptance criteria

1. Given a hatching, when the suggestions are built, then the canon name of the familiar is the first suggestion (REQ-1952). Closed by: a unit test.
2. Given a hatching, when she sends a name of her own, then it replaces the canon name, and the familiar is stored under her name (REQ-1954). Closed by: an integration test over the route.
3. Given a suggestion that equals the name of any move in `familiars.yaml`, when the filter runs, then it is dropped; given a suggestion that equals the current name of anything she has named, canon names included, then it is dropped (REQ-3532, REQ-3534). Closed by: a unit test with one fixture for each.
4. Given names that differ only by case, a trailing space or «ё» for «е», when they are compared, then they are equal, so «Мёд» and «мед » are one name (REQ-3532, REQ-3534). Closed by: a unit test with the three differences.
5. Given a dropped suggestion, when the list is filled, then the place is taken from ADR-0110's hand-written list under the same filter, and the screen receives the same number of suggestions (REQ-3534). Closed by: a unit test with a list that has to fill two places.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the filter to `src/game/names.ts` and call it before the hatching screen shows the suggestions that the naming window of ADR-0110 draws. A move name is a word she meets in battle scenes, and two creatures with one name would blur which one the story means. Names come from the log's `name_given` events.

## Depends on

- TSK-0656 (blocking): the roster, the canon names and the moves.

The epic realising ADR-0110 supplies the naming window and the hand-written list. The screen that shows the suggestions belongs to the epic realising ADR-0150.

## Evidence

Not yet.

## Left alone

The naming of the starter in Session 0, which TSK-0656 takes, and the numeral flag of ADR-0110 for a name like a number.
