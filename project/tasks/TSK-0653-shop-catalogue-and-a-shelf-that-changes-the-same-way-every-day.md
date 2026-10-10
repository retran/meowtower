---
id: TSK-0653
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-2112, REQ-2114, REQ-2118, REQ-2120, REQ-2122, REQ-2156, REQ-2160, REQ-2162, REQ-2164, REQ-2166, REQ-2168, REQ-2178]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The shop sells for buttons at fixed prices from a shelf of six items that changes by the same rule every day

After this task, `src/game/shop.ts` holds a catalogue of at least 20 items, a shelf of 1 focus, 2 outfits, 2 accessories and 1 curiosity that replaces 2 slots each game day, a purchase for buttons at the prices shown, and a build check that fails on a payment SDK or a ranking route.

## Acceptance criteria

1. Given the catalogue in `economy.json` outside the forge recipes, when the content check runs, then it holds at least 20 items, each with a category and no power field, and a trick entry names an animation preset and no field any rule reads (REQ-2178). Closed by: a unit test of the count and the schema.
2. Given the shelf, when it is built, then it holds 1 focus, 2 outfits, 2 accessories and 1 curiosity at the prices 800, 450, 200 and 80 buttons, each price is in the reply before she buys, and a purchase spends buttons and no other currency (REQ-2112, REQ-2114, REQ-2156, REQ-2160). Closed by: an integration test over the shop reply and one purchase.
3. Given a game day, when the shelf is replaced, then 2 slots change to items of the same category, emptied slots first and then the longest-standing, picked by a hash of the day's seed; the same day and shelf give the same items; an item she owns isn't offered; and an item that left the shelf unsold doesn't return for 7 days (REQ-2162, REQ-2164, REQ-2166, REQ-2168). Closed by: a unit test and a 30-day simulation that reads each constraint.
4. Given a slot whose category has no item to offer, when the shelf is built, then the slot shows the shopkeeper's restocking line and the Parent Room tells the owner once that the catalogue needs items (`shelf_slot_empty`) (REQ-2162). Closed by: an integration test with a catalogue of 6 items.
5. Given the repository, when the static check runs, then it fails on a payment SDK in the dependencies, a payment route, a premium currency, a leaderboard or a ranking route, and the shop opens on day 8 of play and not before (REQ-2118, REQ-2120, REQ-2122). Closed by: the check's fixture test and a test of the opening day.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/game/shop.ts` and the catalogue to `economy.json`: items by id with a category, and the words in `shop.ru.json` of the epic realising ADR-0160. The shop opens on day 8 of play as ADR-0330 amends ADR-0140. The six recipes of TSK-0655 are items outside the 20.

## Depends on

- TSK-0644 (blocking): the catalogue and the prices are content.
- TSK-0651 (not blocking): the day of play it supplies opens the shop; tests pass a fixture day number.
- TSK-0652 (not blocking): grants fill the button balance; tests seed it with `reward_granted` events.

## Evidence

Not yet.

## Left alone

The screens that draw the shop, which the epic realising ADR-0150 owns, and the pictures of the items, which ADR-0170 owns.
