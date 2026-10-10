---
id: TSK-0647
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-1700, REQ-1716, REQ-1718, REQ-1722, REQ-1724, REQ-1736, REQ-1738]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A room takes its branch, a floor its state and a chapter its finale from the versioned thresholds, and the Director logs each decision

After this task, `src/game/branch.ts` computes the room branch, the floor state and the chapter finale variant from `thresholds.json`, the Director logs `room_outcome` and `floor_outcome` with the thresholds version, and a rebuilt projection replays the logged result.

## Acceptance criteria

1. Given slot values of 1, 0.5 and 0 over a room, when the clean share is exactly 0.6, then the room takes `success`, and at 0.59 it takes `alt`; a rapid guess or an assisted first attempt enters at 0.5 when correct and 0 when wrong (REQ-1716, REQ-1736). Closed by: a unit test with both shares and the caps.
2. Given a floor's rooms and its Guardian's problem, when the state is computed over the scored tasks without mental arithmetic, warm-ups and check facts, then 0.8 gives `triumph`, 0.5 gives `victory` and 0.49 gives `cunning`; given a floor with no rooms and no Guardian, then it gets no state and stays out of the day's summary and out of the chapter finale's shares (REQ-1722, REQ-1724, REQ-1736). Closed by: a unit test with the boundary values and the empty floor.
3. Given a chapter's floor-days, when the finale is computed, then it takes the triumph variant when at least 0.5 of them are `triumph` or `victory` and at least 0.3 are `triumph`, and no variant is chosen by a model (REQ-1738). Closed by: a unit test with the boundary values.
4. Given each of the two room branches and the three floor states, when the campaign advances, then the next scene, the floor count and the quests advance by the same step in every case and only the scene, the lines and the bonus differ (REQ-1718). Closed by: a unit test that compares the campaign counters after each branch and state.
5. Given a recorded adventure's log, when it is fed twice with the same content versions, then both runs give identical branches and states; given `thresholds.json` changes to version 2 and the projections are rebuilt, then every logged room branch and floor state stays as logged and carries its own version (REQ-1700). Closed by: a replay test and a rebuild test over the log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Read the thresholds only through the loader of TSK-0644. Log `room_outcome` and `floor_outcome` when the Director decides each, with the thresholds version used, and let a projection read the logged result and never derive it again under a newer version, because the player has already seen the scene. Take the three Guardian-ending states and the Director's call sites from the epic realising ADR-0070; this task supplies the functions and the events.

## Depends on

- TSK-0644 (blocking): the thresholds and their version.
- TSK-0645 (blocking): the slot values and the caps.

The epic realising ADR-0070 supplies the Director that calls these functions; until it lands, tests call them directly and a stand-in adventure of the epic realising ADR-0030 calls them from its fixed script.

## Evidence

Not yet.

## Left alone

The scenes and lines a branch picks, which the epic realising ADR-0110 writes, and the calibration of the values, which TSK-0649 tests.
