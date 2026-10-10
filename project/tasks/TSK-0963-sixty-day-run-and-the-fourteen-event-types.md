---
id: TSK-0963
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6296, REQ-6298]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A 60-day simulation shows the story rules hold and the log holds the 14 event types

After this task, the simulation group of ADR-0190 runs 60 simulated days against the rules of this epic, and the log it writes holds every event type ADR-0330 owns, with `free_text` at version 2.

## Acceptance criteria

1. Given 60 simulated days, when the run ends, then every adventure played with the field on holds at least 2 free-action points with one not tied to a trial, and at least 4 with 3 not tied to a trial on a completed 3-floor adventure, and every adventure holds one interlude and a known character in a scene order (REQ-6296). Closed by: the simulation group's report.
2. Given the same run, when the report is read, then systems open on the days of the schedule, starters only insert, the free pen holds no task, score or knowledge-model event, and first scenes hold none of the listed return phrases (REQ-6296). Closed by: the simulation group's report.
3. Given synthetic profiles, when the report is built, then the signal rises on the profile whose own words fall 40 % while its unchanged starters rise and stays down on the others, and no whitelisted sequence joins a do-not-use list (REQ-6296). Closed by: the simulation group's report.
4. Given the run's log, when it is counted by type, then it holds at least one `system_unlocked`, `route_offered`, `route_chosen`, `free_pen_started`, `free_pen_ended`, `starter_inserted`, `share_card_created`, `share_card_viewed`, `scene_rewatched`, `chapter_reread`, `scene_favorited`, `hidden_detail_found`, `parent_day_marked` and `text_freshness_scored`, and `free_text` events at version 2 read through the upcaster (REQ-6298). Closed by: the report's count by type.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add one scenario group to the simulation of ADR-0190 that plays 60 days with a scripted player who uses each part, and the synthetic profiles of the signal. The run needs no model call: it uses stub Master replies and the library. REQ-6296 requires the run before acceptance, so verify prints its result in its summary.

## Depends on

- TSK-0948 (blocking): the run checks the schedule's days.
- TSK-0949 (blocking): the run checks that days 1 and 2 are unassisted and that threads arrive on day 2.
- TSK-0950 (blocking): the run reads both routes of each adventure.
- TSK-0951 (blocking): the run reads `route_offered` and `route_chosen`.
- TSK-0952 (blocking): the run checks that starters only insert.
- TSK-0953 (blocking): the run reads the free-action points and the origins.
- TSK-0954 (blocking): the run reads the interlude and the known character.
- TSK-0955 (blocking): the run reads each first scene.
- TSK-0956 (blocking): the run checks the do-not-use lists.
- TSK-0957 (blocking): the run reads the opening scores.
- TSK-0958 (blocking): the run's replies pass the refusal check.
- TSK-0959 (blocking): the run rereads, favourites and finds details.
- TSK-0960 (blocking): the run makes and views cards.
- TSK-0961 (blocking): the run writes in the pen.
- TSK-0962 (blocking): the run builds the signal and the day marks.

The epic realising ADR-0190 supplies the simulation group; until it exists the run is a Vitest scenario file under `tests/simulation/`, and the group's report format stays with that epic.

## Evidence

Not yet.

## Left alone

The parent's reading of a week of the dialogue book, which TSK-0952, TSK-0953, TSK-0958 and TSK-0960 each close for their own requirements.
