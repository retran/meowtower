---
id: TSK-0878
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5772, REQ-5774, REQ-5776, REQ-5778, REQ-5780]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A solved puzzle gives its Diary page, a mark, 2 or 3 star yarn and a title for each series of five, the same after a hint

After this task, `puzzle_solved` grants a Diary page with the solution in the Keeper's hand and a mark for its theme, 2 star yarn or 3 for a puzzle of the week, a cosmetic title for every fifth puzzle solved in one theme, and nothing else.

## Acceptance criteria

1. Given a solved puzzle, when the rewards run, then the Diary has the page with the full solution and the theme's mark (REQ-5772). Closed by: a rewards test and a Playwright test of the page.
2. Given a solved puzzle and a solved puzzle of the week, when the rewards run, then they grant 2 and 3 star yarn, and the same after a rung as without one (REQ-5774, REQ-5778). Closed by: a rewards test over four cases.
3. Given 10 solved puzzles in one theme, when the rewards run, then a title is granted at the 5th and the 10th solve (REQ-5776). Closed by: a rewards test.
4. Given a solved puzzle, when the ledgers are read, then it granted only the page, the mark, star yarn, a title and the free thread of REQ-5786, and boxing or leaving a puzzle grants and takes nothing (REQ-5780). Closed by: a ledger diff over a fixture day.
5. Given `content/economy.json`, when ADR-0140's build check reads it, then the puzzle amounts and the titles for each theme are in it, and no rule reads a trick field. Closed by: the build check's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the puzzle rows to the rewards table and the puzzle amounts and the titles for each theme's series to `content/economy.json`, as ADR-0280 amends ADR-0140. The rewards read `puzzle_solved` only, and that one only grants. Star yarn buys forge tricks that change a spell's look and never its power, so puzzle yarn gives no advantage in the adventure.

## Depends on

- TSK-0875 (blocking): `puzzle_solved` is written by that flow.

The epic realising ADR-0140 supplies the rewards table and the forge.

## Evidence

Not yet.

## Left alone

The economy's balance simulation, which TSK-0879 runs, and the titles' wording, which ADR-0160's content owns.
