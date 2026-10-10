---
id: TSK-0654
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-2104, REQ-2106, REQ-2108, REQ-2110, REQ-2134, REQ-2140, REQ-2146, REQ-2184, REQ-2186]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A chest offers three rewards from the three largest shortfalls by rules she could compute, and answers never enter the choice

After this task, `src/game/chest.ts` builds a chest from the three categories where her stock falls furthest short of her next goal, sets each reward's quality by the branch, and logs the three offered rewards.

## Acceptance criteria

1. Given a stock and a next goal, when a chest is built, then it offers three rewards from three different categories of cosmetics, shards and yarn, buttons and Diary pages, the three with the largest shortfall, and each reward shows before she picks (REQ-2104, REQ-2184). Closed by: a unit test with four categories and a reply test that the three are in the reply.
2. Given the same state on the same day, when a chest is built twice, then both chests are equal, no random source is read, and given two categories that tie, then the tie breaks by a hash of the day's seed and the category name and the same way whatever the answers (REQ-2106, REQ-2186). Closed by: a unit test with permuted answer logs and a static check that `chest.ts` imports no random source.
3. Given a room on `success` or a floor on `triumph`, when the chest is built, then its slots are sparkling, good and ordinary in order of shortfall; given a room on `alt`, a floor on `victory` or `cunning` or a stateless floor, then the slots are good, ordinary and ordinary (REQ-2108, REQ-2110). Closed by: a unit test over the branches and states.
4. Given a Diary page takes the largest shortfall in a success chest, when the chest is built, then the page counts as good and the sparkling slot moves to the next category, and if the pages are in the first slot the third slot stays ordinary; pages are offered only once the Diary has opened (REQ-2108). Closed by: a unit test with each case.
5. Given the three qualities, when buttons, shards and yarn are offered, then they are 15, 25 and 40 buttons, 5, 8 and 12 shards, and 2, 3 and 4 yarn, a cosmetic is an item she doesn't own from the category the quality names, a curiosity, an accessory or an outfit, and the floor chest on a floor's first `triumph` adds the floor's special reward (REQ-2134, REQ-2140, REQ-2146). Closed by: a unit test over the amounts and the categories.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Compute the shortfall of each category from the next goal as a share from 0 to 1, as RES-2100 defines it. Log `chest_offered` with the three rewards, so a resume before the pick shows the same three, and write `chest_chosen` once, so a reload or a double tap can't re-roll or grant twice. The split of qualities by branch is the rule ADR-0140 chose so that `success` beats `alt` by exactly one step in two slots; the amendments of ADR-0330 and ADR-0370 hold where they differ.

## Depends on

- TSK-0644 (blocking): the amounts are content.
- TSK-0647 (blocking): the room branch and floor state the quality follows.
- TSK-0653 (blocking): the cosmetic items and their categories come from the catalogue.
- TSK-0652 (not blocking): the grant of the picked reward uses the grants table; tests seed rewards by events.

## Evidence

Not yet.

## Left alone

The screens that show the chest and the quality words, which the epic realising ADR-0150 builds, and the materials beside the pick, which TSK-0652 grants.
