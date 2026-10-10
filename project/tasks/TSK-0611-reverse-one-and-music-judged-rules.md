---
id: TSK-0611
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1562, REQ-1564, REQ-1568, REQ-1570, REQ-1512]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Reverse One is always reversed, wants nothing of hers and is the only look-alike, and the game's music has no tick

After this task, the Reverse One's sprite is one asset in the heroine's colours reversed that the Master can't choose, the checklist refuses a reply where it wants her things or poses as her or a second look-alike appears, and the parent listens to each music track for ticking before it ships.

## Acceptance criteria

1. Given the Master's reply schema, when a reply tries to set a sprite for the Reverse One, then the schema refuses it, and the client draws the one asset (REQ-1564). Closed by: a schema test and a screenshot test of the asset's colours against the heroine's.
2. Given labelled lines where the Reverse One wants her place, name, home, family, room, familiars or friends, where it poses as her, and where a second look-alike of her appears, when the safety check runs, then each is flagged (REQ-1562, REQ-1568, REQ-1570). Closed by: the test set's report with the count of positives for each.
3. Given a week of the dialogue book, when the parent reads it, then the parent judges that the Reverse One wants none of her things, never poses as her, speaks back to front and is her only look-alike (REQ-1562, REQ-1568, REQ-1570). Closed by: the parent's judgement, because these are about how a figure reads over a week.
4. Given each music track before it ships, when the parent listens, then the parent hears no ticking sound (REQ-1512). Closed by: the parent's judgement, because a tick reads as a clock and only a listener can tell it from rhythm; the judgement is recorded for each track in the music list.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the sprite rule to the reply schema, the checklist items and their labelled lines to the test set, and the music list with its per-track judgement field to `content/`. The art itself is ADR-0170's, so this task uses the placeholder asset it supplies.

## Depends on

- TSK-0599 (blocking): the checklist items run in that task's safety check.

The epic realising ADR-0170 draws the Reverse One; until it exists the client draws a coloured placeholder in reversed colours.

## Evidence

Not yet.

## Left alone

The music itself and the art, which the owner and ADR-0170 produce.
