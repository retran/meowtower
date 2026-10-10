---
id: TSK-1019
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-1518, REQ-1520, REQ-1548, REQ-1620, REQ-3316, REQ-3320, REQ-3330]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every library text carries a minimum level, names characters by id, and passes the numeral and guilt tests

After this task, each library scene and branch carries a minimum creepiness level as a pool line does, pool lines lose their maximum, hand-written texts name canon characters by entity id, and a content test fails the build on a numeral, «узелок» or a guilt phrase.

## Acceptance criteria

1. Given a library scene, a branch and a pool line, when the content schema validates them, then each carries a minimum level, the pool line has no maximum and the schema refuses one, and the server never takes a text whose minimum is above the level in force (REQ-1520). Closed by: a schema test and a selection test over levels 0 to 2.
2. Given every scene order to the Master, when it is built, then it carries the creepiness level in force, and the coverage test of REQ-1620 counts the level 0 scenes and branches and Guardian endings for every floor (REQ-1518, REQ-1620). Closed by: an order test and the coverage test.
3. Given `scenes.ru.json`, `branches.ru.json` and the pool lines, when the numeral test runs, then it fails on a fixture text holding a digit or a numeral word from the shared list outside names from the canon's entity list (REQ-1548). Closed by: a content test with a failing fixture.
4. Given every `content/*.ru.json` and every string file, when the content test runs, then it fails on any form of «узелок» and on any phrase of the guilt list in `content/safety.ru.json`, and a text that names a canon character by hand and not by entity id fails; from the autumn chapter's finale on the resolved name of the ally is «Бантик» (REQ-3316, REQ-3320, REQ-3330). Closed by: a content test with fixtures for each failure.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the minimum-level field to the library content schemas and remove the pool line's maximum, because no requirement or decision gives the maximum a job and a field no rule reads goes wrong without any check noticing. A fallback would otherwise show a level that the parent or her fear turned off. Resolve each entity id to the current name at use, because a hand-written text can't follow REQ-3330's date without the lookup, and the content test is the check the finding asked for. Seed the guilt list with REQ-3316's two examples and leave the rest to the content step and the parent's review.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The guilt list's phrases beyond REQ-3316's examples and the Russian texts themselves, which the content step writes and the parent reviews.
