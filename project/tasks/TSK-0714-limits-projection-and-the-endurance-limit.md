---
id: TSK-0714
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-1300, REQ-1302, REQ-1304, REQ-1310, REQ-1312, REQ-1314, REQ-1316, REQ-1346]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The limits projection computes a result for each session, smoothed over 7 sessions, and measures endurance

After this task, the `limits` projection holds one `LimitsResult` for each session with a slot for each of the twelve limits, computed only from tasks answered in play, with timings that exclude background and pause, smoothed over the last 7 sessions, and with the endurance limit measured.

## Acceptance criteria

1. Given the event log, when `limits` is rebuilt, then it holds one `LimitsResult` for each session with twelve limit slots, the language-risk limit included, and it reads no task given only to measure a limit (REQ-1300, REQ-1346). Closed by: a projection test, and a static test that no `purpose` value in the event schemas names a limit measurement.
2. Given 9 sessions of fixture data, when the report smooths a limit, then a share pools its numerators and denominators over the last 7, a median is the median of the pooled times and a count is the mean per session; given 4 sessions, then it uses 4 (REQ-1302). Closed by: a unit test with hand-computed values.
3. Given an attempt that spent 40 seconds in the background and 5 paused, when its time is read, then it excludes both; given an attempt marked `interrupted`, then it gives accuracy and no time (REQ-1304). Closed by: a unit test.
4. Given times-table control facts at the start, the end and in two extensions, 2 in each, when endurance is computed, then it takes the median time at each point from those facts only (REQ-1310); given a last median of 1.5 times the first, then no time flag, and a hair above, then the flag (REQ-1312); given a mistake at the last point and none at the first, then the accuracy flag rises apart from the time (REQ-1314). Closed by: a unit test with each boundary.
5. Given two extensions, each starting after the soft stop at 60 minutes of active time, when endurance is computed, then each is compared with the start and the end (REQ-1316). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `limits` projection to the registry of ADR-0020 with its class declared, the smoothing and the endurance function. How a share, a median and a count smooth is a choice ADR-0180 made: pooling keeps a short session from weighing as much as a long one. The other limits fill the same result in TSK-0715 and TSK-0716.

The device-measured answer time and the `interrupted` flag come from the events of ADR-0020 and ADR-0030. The epic realising ADR-0070 places the control facts; until it exists the tests feed them.

## Depends on

- TSK-0708 (blocking): the limits feed the report model and its cache.

## Evidence

Not yet.

## Left alone

The other eleven limits, which TSK-0715 and TSK-0716 build, the limits screen, which TSK-0717 builds, and the full views after the MVP.
