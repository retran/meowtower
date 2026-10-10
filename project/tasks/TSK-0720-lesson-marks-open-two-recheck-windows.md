---
id: TSK-0720
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-1400, REQ-1402, REQ-1404]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A lesson mark opens a recheck from day 1 to 3 and another from day 12 to 16

After this task, the parent marks nodes or subtypes as «занимались на уроке» with a date and a note, the `parent_tags` projection opens two recheck windows counted in game days from the mark, and the Director's recheck term can read them.

## Acceptance criteria

1. Given the mark form, when the parent submits nodes or subtypes with a lesson date and an optional note, then `POST /api/parent/tags` writes `parent_tag_added` with them; given she removes the mark, then `parent_tag_removed` is written and the full recompute starts, so the mark is treated as never set (REQ-1400). Closed by: an integration test and a Playwright test.
2. Given a lesson mark on game day 5, when the projection is read, then recheck 1 is open on days 6 to 8 and recheck 2 on days 17 to 21, and a day with no play doesn't count as a game day (REQ-1402, REQ-1404). Closed by: a unit test with a 30-day fixture.
3. Given an open window, when a stand-in Director reads `parent_tags`, then it collects a full block of 5 tasks inside the window, and the recheck is done once the block forms; given the window closes with no full block, then the mark shows «перепроверка позже», the recheck keeps its priority and the label comes from the late block with a note (REQ-1402, REQ-1404). Closed by: an integration test of both paths in the 30-day simulation.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two routes, the form in the Parent Room, the `parent_tags` projection and its two windows. The windows count in game days from the day of the mark, and the width of the second, 12 to 16, is a default the requirements step chose from "about 14 days". Recheck blocks sit outside the cap of 4 parent-topic tasks a day, so a block of 5 tasks fits a window, as ADR-0070 decided; the Director reads the windows through its recheck term.

The epic realising ADR-0070 supplies the Director and the full-block rule. Until it exists a stand-in selector in the test reads the windows and forms the block, and the real Director replaces it.

## Depends on

- TSK-0708 (blocking): the lessons list and the form sit in the Parent Room the report builds on.

## Evidence

Not yet.

## Left alone

The labels the marks produce, which TSK-0721 builds, how the Director balances many marks against the frontier, which ADR-0070 owns, and the lesson-mark form's opening from links, which a later decision adds.
