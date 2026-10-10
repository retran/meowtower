---
id: TSK-0716
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-1332, REQ-1334, REQ-1336, REQ-1338, REQ-1340, REQ-1344]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The limits for impulsiveness, avoidance, anxiety, flow and help are computed

After this task, `LimitsResult` holds the last five limits: the share of wrong answers faster than 30 % of the threshold and the rapid-guess share, runs of «Не знаю», runs of `alt` outcomes with the late-session guess share, the success share against its corridor, and the help measures.

## Acceptance criteria

1. Given a task whose fluency threshold is 10 seconds, when a wrong answer takes 2.9 seconds, then it counts as too fast, and 3.1 seconds doesn't; given a session, then the limit holds its share of rapid guesses among its answers, with `rapid_guess_flag` above 15 % (REQ-1332, REQ-1334). Closed by: a unit test at the boundary and a unit test over a session.
2. Given answers «Не знаю», «Не знаю», «Не знаю» in a row and 2 rest stops offered, when the limit is computed, then it counts one run of 3 and 2 stops; given two in a row, then no run (REQ-1336). Closed by: a unit test.
3. Given 3 `alt` outcomes in a row, when the limit is computed, then it counts one run; given a rapid-guess share of 20 % in the last third of a session and 10 % in the first two thirds, then the signal is raised, and 10 % against 10 % isn't (REQ-1338). Closed by: a unit test.
4. Given sessions in two floors, when the flow limit is computed, then it holds the success share by session and by floor against the 70 to 80 % target and the share of review slots (REQ-1340). Closed by: a unit test.
5. Given a fixture, when the help limit is computed, then it holds the hints taken before the answer with their level, «Не знаю» on first attempts, second-attempt correctness, the detailed explanations opened with their reading time, and the share of assisted first attempts with `help_share_flag` (REQ-1344). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the five functions to `LimitsResult`. Until the game records erasures, long hesitation and the phrases «страшно» and «не хочу», anxiety uses the two signals above only; the run of 3 follows RES-0300, and thirds match the parts of a session the full report splits by. The flags `rapid_guess_flag` and `help_share_flag` come from the Director of ADR-0070.

The functions read the answer kind from the attempt. An answer of «Нельзя узнать», which ADR-0250 adds, ends a run of «Не знаю» and is never counted as one, so the functions need no change when that kind arrives.

## Depends on

- TSK-0714 (blocking): it supplies the result type and the smoothing.
- TSK-0718 (blocking): the share of fast wrong answers reads each task's fluency threshold from the `thresholds` projection.

## Evidence

Not yet.

## Left alone

The limits screen, which TSK-0717 builds, and the anxiety signals from erasures, hesitation and phrases, which the log defines now and a later decision measures.
