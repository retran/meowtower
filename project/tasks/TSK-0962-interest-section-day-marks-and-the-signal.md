---
id: TSK-0962
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6064, REQ-6206, REQ-6288, REQ-6290, REQ-6292, REQ-6294]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report's summary shows an Interest section, the parent marks each day, and a signal says when the story is stopping being hers

After this task, the summary screen holds the Interest section for the last 14 days of play, the Parent Room asks one question for each day of play without a mark, and the signal "the story is stopping being hers" rises when her own words fall and her unchanged starters rise.

## Acceptance criteria

1. Given 14 days of synthetic play with day marks, when the summary screen opens, then it is one of the report's nine screens and the Interest section shows, for each adventure, whether she came back by herself from the parent's mark, her extensions, her own words, the share of her sends that are `own` or `starter_edited`, the share of free-action points passed with «Дальше» and no send, the optional activities and the systems she used, the repetitiveness figure with the week's median opening similarity, and the task-window share against 60 % (REQ-6064, REQ-6288). Closed by: a projection test and a Playwright test on the screen.
2. Given an adventure whose task window was open for 28 of 40 active minutes, when the share is computed, then it is 70 %, counted from the window's `open` state to its `closed` state, and a static check finds nothing in `src/engine/director/` importing the share or the Interest projection (REQ-6206). Closed by: a unit test and the static check.
3. Given days of play in the last 7 days with no mark, when the parent opens the Parent Room, then it asks one question with two answers for each, an answer appends `parent_day_marked`, and a day older than 7 days drops out (REQ-6290). Closed by: a route test and a Playwright test.
4. Given a synthetic profile whose own words per adventure fall 40 % between the last 14 days of play and the 14 before while its unchanged starters rise, when the report is built, then the signal rises with one line at the top of the section; given profiles where only one of the two moves, or the fall is 29 %, then it stays down; given fewer than 28 days of play, then «мало данных» (too little data) shows in its place; and both windows leave out adventures played with the free-text field off (REQ-6292). Closed by: a unit test over the profiles.
5. Given the weekly rows of the section, when a week's signal rose, then the week doesn't count towards a backlog item's acceptance, and the parent judges the item on the weeks that count (REQ-6294). Closed by: a unit test on the week flags, and judgement, the parent's when accepting the item, because the loss of interest the signal stands for is the parent's reading.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the Interest projection, the task-window share, the day-mark route `POST /api/parent/day-mark`, and the signal with its two windows to the Parent Room's summary screen. The share is reported and never enforced, by the owner's research decision of 2026-09-28, because a cap would push graded attempts below 28 on the first slow days. Nothing in the Director reads the share or the signal.

Record a gap ADR-0330 itself names: the signal can't see a child who stops sending at all, because REQ-6292 needs the unchanged-starter share to rise too. The share of points passed with «Дальше» and no send shows beside her own words to cover that case, and the section shows it with the rest.

## Depends on

- TSK-0953 (blocking): `origin` and `ownWords` are the figures the section and the signal read.
- TSK-0956 (blocking): `text_freshness_scored` carries the repetitiveness figure.
- TSK-0957 (not blocking): the opening similarity comes from it; without it the section shows no similarity until it lands.
- TSK-0959 (not blocking): its rereading, favourite and hidden-detail events feed the optional activities, and a count of zero shows until it lands.
- TSK-0960 (not blocking): its card events feed the optional activities, and a count of zero shows until it lands.
- TSK-0961 (not blocking): its pen events feed the optional activities, and a count of zero shows until it lands.

The epic realising ADR-0180 supplies the report's nine screens and the Parent Room; until it exists the task runs on a stand-in summary page and the real screens' placement stays with that epic.

## Evidence

Not yet.

## Left alone

The backlog row's wording in ADR-0190, which that epic carries, and the signal's other reversal conditions, which the owner reads from the section after the first 8 weeks.
