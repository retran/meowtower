---
id: TSK-0652
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-2100, REQ-2102, REQ-2130, REQ-2136, REQ-2138, REQ-2142, REQ-2148, REQ-2150, REQ-2152, REQ-2154]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Grants follow one table in the content file, read no clock, and take nothing away

After this task, `src/game/grants.ts` gives buttons, shards, yarn, floor materials and moon motes from the grant table of `economy.json`, writes `reward_granted` once for each grant with its amount, and reads no time field.

## Acceptance criteria

1. Given a first attempt and a second attempt, when buttons are granted, then the first gives 1 and the second 0 (REQ-2130). Closed by: a unit test.
2. Given a clean unassisted scored first attempt that isn't a rapid guess, a floor in any state and a Guardian problem in any ending, when shards and yarn are granted, then they give 1 shard, 2 shards and 3 yarn, and an assisted first attempt gives no shard (REQ-2136, REQ-2138, REQ-2142). Closed by: a unit test with one row for each source.
3. Given a room chest, a floor chest, a success-branch find and an Observatory visit, when materials are granted, then they give 1 and 2 of the floor's material beside the pick, 1 more of it, and 1 moon mote (REQ-2148, REQ-2150, REQ-2152, REQ-2154). Closed by: a unit test with one row for each source.
4. Given the same answers sent after 2 seconds and after 60 seconds, when the grants are read, then they are identical, and no grant function imports a clock or reads a time field (REQ-2102). Closed by: a property test over generated timings and a static check of the imports.
5. Given a log of all «Не знаю» and wrong answers, when every currency and owned item is read after each event, then none is lower than before it (REQ-2100). Closed by: a property test over 1,000 generated logs; and given a reload or a replayed request, then no grant is written twice.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the grant table to `economy.json` as data: a row is a source and its amounts, so a later decision adds a row without code. ADR-0260, ADR-0280 and ADR-0290 each add rows to it through their epics. The table follows RES-2100, and every amount is a starting value for the two weeks of stage 0.3 play to check. Write `reward_granted` with the amount granted, so a later price change never rewrites history. The Tower has nine floor-worlds, each material is a content id, and the moon mote belongs to the Observatory.

## Depends on

- TSK-0644 (blocking): the grant table.
- TSK-0645 (blocking): the clean, rapid and assisted flags that a grant keys on.

The thread column belongs to the epic realising ADR-0080, which owns the stock, the cap and the spending; this task calls its grant and adds none of its own.

## Evidence

Not yet.

## Left alone

The chest's three offered rewards, the shop's prices and the forge, which the next tasks build, and the rows later decisions add.
