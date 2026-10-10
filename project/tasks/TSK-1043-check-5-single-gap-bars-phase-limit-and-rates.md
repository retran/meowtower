---
id: TSK-1043
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6670, REQ-6674]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Check 5 holds the single-gap and no-gap bars, a phase limit, and a rate the report's own code measures

After this task, check 5 passes only when each single-gap student gets its own line on at least 15 of 20 seeds and the other on at most 4, the student with no gap gets any line on at most 4, and `--check5-rates` measures the rates with the same line functions.

## Acceptance criteria

1. Given the maths-gap student with the maths line on 15 seeds and the language line on 4, and the language-gap student symmetric, when the bars are applied, then both pass; given 14 own lines or 5 other lines, then it fails with `check5_bar_missed` (REQ-6670). Closed by: a unit test on the bar function.
2. Given the no-gap student with any line on 4 seeds and on 5 seeds, when the bar is applied, then 4 passes and 5 fails (REQ-6674). Closed by: a unit test.
3. Given a seed whose four cells don't hold 20 after 120 simulated game days, when the check runs, then it fails with `check5_phase_short` and names the seed and the presentation, and every seed's game days to its checkpoint are reported (REQ-6670). Closed by: a simulation test with a stand-in schedule too slow for one seed.
4. Given the counts each of the 80 seeds reached at its read, when `npm run verify -- --check5-rates` runs, then it draws 500 fresh answer sets for each seed, 10,000 for each student, calls the report's line functions with no Director, and writes each student's own, other, both and either rates with their 95 % Wilson intervals to `artifacts/check5-rates.json` (REQ-6670). Closed by: the command's output and a schema test of the file.
5. Given a measured joint rate for the both-gaps student below 0.825, when the command runs, then it reports `check5_rate_low` for the owner (REQ-6670). Closed by: a unit test with a fixed rate.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the three bars to the check, the phase limit and `--check5-rates` to `tools/`. I chose 120 simulated game days as the phase limit because at 2 letters a day after the first phase it leaves room for about 180 letters beyond the phase's limit, far more than the 80 a seed needs. I chose 95 % as the floor for a working report on a fixed seed set, below the 97 % the bar was chosen for, because a measured rate carries its own sampling error. The bar of 14 passes 95.3 % of seed sets at a joint rate of 0.825, so it holds while the measured joint rate is at least that. A green check 5 shows that the report can tell apart what the generator encodes; it can't show what her gap is, because the same agent writes the students and the code.

The artifact is one file overwritten on each run, inside ADR-0190's retention of the last 20 reports. The command runs at the probe stage's acceptance and after any change to `src/parent/contrasts.ts` or `src/parent/intervals.ts`.

## Depends on

- TSK-1042 (blocking): the students, the seed reading and the both-gaps bar.

## Evidence

Not yet.

## Left alone

Wiring the check to the real Director and probe, which the epic realising ADR-0430 does when its probe exists, and the owner's decision on a new seed set after `check5_bar_missed`.
