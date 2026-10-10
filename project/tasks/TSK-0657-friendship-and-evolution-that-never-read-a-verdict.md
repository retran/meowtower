---
id: TSK-0657
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-1900, REQ-1902, REQ-1904, REQ-1908, REQ-1910, REQ-1934, REQ-1936, REQ-1938]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Friendship grows from shared scenes, a familiar evolves at set levels, and no answer changes either

After this task, `src/game/friendship.ts` gives friendship points for shared scenes, rest stops and campfire talks, evolves a familiar at its levels in its own scene at the next rest stop, and has no state or rule that removes a familiar or its progress.

## Acceptance criteria

1. Given a familiar in the active team, when a scene, a rest stop and a campfire talk are shared, then it gains 1, 2 and 3 points, and each friendship level costs 10 points; given a log of all right answers and the same log with all wrong and «Не знаю» answers, then the friendship and the evolutions are equal (REQ-1902, REQ-1904). Closed by: a unit test of the points and a replay test over the two logs.
2. Given a planned friendship with a roster familiar, when the story reaches it, then it has one outcome, success, whatever the tasks' answers were (REQ-1900). Closed by: an integration test with a log of only wrong answers.
3. Given a non-starter at friendship level 5, when the next rest stop comes, then it evolves to its second stage in its own scene; given a starter, then it evolves at levels 5 and 12 (REQ-1934, REQ-1904). Closed by: a unit test with the three thresholds read from `familiars.yaml`.
4. Given a familiar past level 12 whose third stage hasn't shipped, when a rest stop comes, then it stays at its second stage; given a content update adds the third stage, then it evolves at the next rest stop and the friendship it earned is kept (REQ-1936, REQ-1938). Closed by: a unit test with the file before and after the update.
5. Given the familiar state, when its schema is read, then it has no value for dead, ill or lost, no rule removes a familiar from the roster, and a lost battle grants and removes nothing (REQ-1908, REQ-1910). Closed by: a unit test of the schema and a property test over generated logs that a familiar, an item, a currency or progress never disappears.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/game/friendship.ts` with the points and thresholds read from `familiars.yaml`. Write `familiar_friendship` and `familiar_evolved` to the log. The values are starting values ADR-0140 chose so that about 12 points a day give level 5 in about 4 days and level 12 in about 10, and they are content, so a change needs no code. A familiar's second friendship scene opens on day 5 of play as ADR-0330 amends it.

## Depends on

- TSK-0644 (blocking): the thresholds and costs are content.
- TSK-0656 (blocking): the roster and its stages.

The epic realising ADR-0090 supplies rest stops and the epic realising ADR-0110 the campfire talks and the planned friendships; until they land, tests send the shared-scene events by hand.

## Evidence

Not yet.

## Left alone

Battles, stats, paths and legendaries, which come after the MVP, and the evolution scene's text, which ADR-0110 writes.
