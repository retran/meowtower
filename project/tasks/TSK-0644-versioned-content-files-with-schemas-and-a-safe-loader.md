---
id: TSK-0644
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-1728, REQ-1930, REQ-2158, REQ-2174]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every number the game rules use lives in a versioned content file that the server validates and never half-loads

After this task, `content/thresholds.json`, `content/economy.json` and `content/familiars.yaml` exist with a `version` field and a zod schema, the server refuses a file that fails its schema, and a change to a threshold, a price, a recipe, a stage or a friendship cost needs no code change.

## Acceptance criteria

1. Given the three files, when the server starts, then it validates each against its schema, and a file that fails is refused with `content_invalid`, the file and the path of the field; given a running server and a new file that fails, then the server keeps the last valid version (REQ-1728). Closed by: an integration test with one broken file at start and one broken file after a valid load.
2. Given no valid content at the first start-up, when the server starts, then it refuses to start with `content_invalid` (REQ-1728). Closed by: an integration test with an empty `content/`.
3. Given `thresholds.json` at version 2 with a room threshold of 0.65, when the server restarts, then the module's room branch uses 0.65 with no code change (REQ-1728). Closed by: a unit test that edits the file and not the code.
4. Given a shop price and a forge recipe row in `economy.json`, when either is edited, then the typed accessor returns the new number at the next load (REQ-2158, REQ-2174). Closed by: a unit test for each.
5. Given an evolution threshold and a friendship cost in `familiars.yaml`, when either is edited, then the accessor returns the new number and no function holds either number as a literal (REQ-1930). Closed by: a unit test and a search of `src/game/` for the starting values as literals.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/game/content.ts` with the loaders and the schemas. Fill the files with the starting values ADR-0140 gives: thresholds version 1 from its table, and in `economy.json` the experience amounts, the grant table, the chest amounts, the shop prices, the forge recipes, the quest pool and the catalogue ids. Player-facing names in these files are ids only, because a price must not change when a language is added and the words live in the per-language files of ADR-0160. Put a `notes` field in `thresholds.json` for the order in which a review changes a threshold, which TSK-0649 fills.

## Depends on

Nothing in this epic. The strings these ids point to are the epic realising ADR-0160's.

## Evidence

Not yet.

## Left alone

The rules that read these files, which the other tasks of this epic build, and the Parent Room's report of `content_invalid`, which the epic realising ADR-0180 shows; the log of the owner's status report holds it until then.
