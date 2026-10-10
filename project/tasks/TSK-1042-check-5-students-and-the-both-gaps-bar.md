---
id: TSK-1042
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6666, REQ-7402]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Check 5 plays four students whose accuracy follows the presentation, and counts both lines on one seed

After this task, `tests/simulation/probe-students.ts` defines four synthetic students, the check reads each seed's report at its first checkpoint, and the student with both gaps passes only when both lines stand on the same seed on at least 14 of 20 seeds.

## Acceptance criteria

1. Given the four students, when their rates are read, then the maths-gap student answers 55 % on every presentation, the language-gap student 90 % bare, 90 % Russian, 45 % Dutch and 85 % Dutch after the words, the no-gap student 90 % everywhere, and the both-gaps student 55 %, 55 %, 15 % and 50 %; and none of ADR-0190's ten synthetic profiles varies by presentation (REQ-6666). Closed by: a unit test over the student table and the ten profiles.
2. Given seeds 1 to 20 for each student, when a seed runs, then the check reads the report `report_cache` holds at the first rebuild at which the `bare`, `ru`, `nl` and `nl_after_words` cells each hold at least 20 graded first attempts, even when that comes after the first phase closes, and counts the language line and the maths line shown there (REQ-7402). Closed by: a simulation test on the stand-in schedule.
3. Given a run of the both-gaps student with both lines on one report on 14 seeds and another run with them on 13, when the bar is applied, then the first passes and the second fails, and a seed that shows one line only counts for neither (REQ-7402). Closed by: a unit test on the bar function with fixed seed results.
4. Given the seed list, when it is changed, then a test fails until the recorded list is changed in a decision (REQ-7402). Closed by: a unit test that compares the list with the recorded constant 1 to 20.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `tests/simulation/probe-students.ts` and the seed-reading step of check 5 in group 3 of ADR-0190's verify. I chose seeds 1 to 20 for each student, fixed in the check's code, because with fixed seeds a build passes or fails the same way every time and seeds changed until the check passes would make it a test of the seeds. The bar is 14, where REQ-6672 said 15, because at a joint rate of 0.840 the bar of 15 passes 91.4 % of seed sets and 14 passes 97.0 %; REQ-7402 replaces REQ-6672.

The probe doesn't exist yet. The check runs on a stand-in schedule that shows each seed's four cells four letters a day, answers each letter at its presentation's rate with a seeded generator, and reads the report's own line functions of TSK-1031. The epic realising ADR-0430 replaces the stand-in with the real Director and probe, and the check's code and bars stay as they are.

## Depends on

- TSK-1031 (blocking): the line functions the check reads.

## Evidence

Not yet.

## Left alone

The single-gap and no-gap bars, the phase limit and the rate measurement, which TSK-1043 builds.
