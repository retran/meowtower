---
id: TSK-0718
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-1348, REQ-1350, REQ-1352, REQ-1362, REQ-1364]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Fluency thresholds are kept for each device type and start from the catalogue and the motor correction

After this task, the `thresholds` projection holds one fluency threshold for each template and device type, starts each from its catalogue value plus the Session 0 motor correction or, where Session 0 is missing, from an adult's calibration, and is never fitted to her times on target nodes.

## Acceptance criteria

1. Given a template and the device types iPad and computer, when the projection is built, then it holds a separate value with a version for each device type (REQ-1362). Closed by: a projection test.
2. Given a catalogue value of 6 seconds, a pure-input time of 2.4 seconds, a reference time of 1.8 seconds and 3 key presses in the answer, when the starting threshold is computed, then it is 6 + (2.4 - 1.8) x 3 = 7.8 seconds (REQ-1350). Closed by: a unit test.
3. Given no Session 0 on a device type and an adult's median of 5 seconds over 3 tasks of the node, when the threshold is computed, then it is max(catalogue, 2.5 x 5 = 12.5) = 12.5 seconds (REQ-1352); given neither, then it is the catalogue value and the Parent Room shows `threshold_uncalibrated` with the request for the 3-task calibration. Closed by: a unit test and a Playwright test of the notice.
4. Given a month of her times on a target node that are all faster than the threshold, when the projection is rebuilt, then no threshold changes (REQ-1348). Closed by: a unit test over the rebuild.
5. Given a "fast" probe of 5 tasks in which the median is within the threshold and one task is over it, when the rule is applied, then the probe isn't fast (REQ-1364). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `thresholds` projection and the calibration mode in which an adult solves 3 tasks of a node on a device type and writes `calibration` events, which no player projection reads. The motor correction is the one input from the player, her pure-input time minus the reference time, times the number of key presses in the template's answer, which ADR-0040 gives each template. Where neither Session 0 nor a calibration exists the catalogue value stands, because a missing threshold would stop every time-based limit; that is a choice ADR-0180 made.

The fast-probe rule is applied by ADR-0060 with the thresholds from this projection; this task supplies the rule as a function that epic calls.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

The monthly motor check, the threshold versions and the catalogue's guard, which TSK-0719 builds, and the catalogue's own values, which RES-1200 and RES-1300 set.
