---
id: TSK-0607
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1508, REQ-1658, REQ-1678, REQ-1680, REQ-1682, REQ-1684]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The campaign runs from a calendar in a content file, its MVP stand-ins hold, and a cipher answer is play and never maths

After this task, `content/campaign.ru.json` runs the chapters from the start date the parent sets, a change of campaign leaves every diagnostic record as it was, each chapter ends with a story finale that awards its title and main reward, a rank opening opens on its date with the badge at E, and a cipher answer is a `diary_cipher` event the knowledge model never scores.

## Acceptance criteria

1. Given a campaign changed after 30 simulated days, when the diagnostic projections are rebuilt, then every record equals the one before the change, and `campaignId` appears only in the story tables (REQ-1658). Closed by: a projection test and a search of the schemas.
2. Given a chapter's last daily adventure, when it finishes, then its finale awards the chapter title and main reward; given a season finale, then it awards its title and reward and the rank is unchanged (REQ-1678, REQ-1680). Closed by: an integration test over a simulated chapter and a season.
3. Given a rank's calendar date, when the game day arrives, then the rank opening opens while the badge stays E (REQ-1682). Closed by: a test with a fake clock.
4. Given an enciphered Diary page, when it arrives, then it is already developed (REQ-1684). Closed by: an integration test.
5. Given a cipher answer, when the knowledge projection runs, then the answer is a `diary_cipher` event, no skill estimate changes and no maths record is written (REQ-1508). Closed by: a projection test with and without the event.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the calendar reader and the MVP stand-ins as RES-1600 states them, the `diary_cipher` event, and its exclusion in the input filter of the knowledge model. ADR-0280 adds the `puzzle_*` events to that exclusion. The rewards themselves are ADR-0140's grant.

## Depends on

Nothing in this epic. The epic realising ADR-0140 grants the rewards; this task tests the finale with a stand-in grant and leaves the amounts to that epic. The epic realising ADR-0060 owns the knowledge model's input filter; this task adds the exclusion there.

## Evidence

Not yet.

## Left alone

The campaign's text and the cipher puzzle itself, which the canon and ADR-0280 own.
