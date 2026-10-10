---
id: TSK-1121
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A 60-day simulation shows the probe's order, window, floor and phase rules hold

After this task, group 3 of the verify command runs the probe over 60 simulated game days with the switch on and some days skipped, and it fails when a family's order, window, floor or phase rule breaks or when the probe costs the graph its floor of first attempts.

## Acceptance criteria

1. Given the simulation, when its log is read, then no two presentations of one family fall on one game day, every presentation falls fewer than 14 game days after the family's first, `nl_after_words` follows `nl` directly on a later game day, and the same orders come out of a replay. Closed by: the simulation's report.
2. Given the same run, then for each of `bare`, `ru` and `nl_source` its before-count and after-count differ by at most 1, at most 2 letters stand on a floor after the track tasks and before the rooms, and no two open families share a template. Closed by: the simulation's report.
3. Given the same run, then every completed first-phase day shows 3 or 4 letters while at least 3 eligible templates hold an approved pair, and the phase switches at 20 observations in each of `ru`, `nl` and `nl_after_words` or at 28 game days with play, whichever comes first. Closed by: the simulation's report.
4. Given a 60-minute simulation with 3 letters a day, when the adventure completes, then it holds at least 28 graph first attempts, or 25 where rooms were trimmed for a slow pace, and when both floors can't fit before the soft stop it plays to the soft stop and resumes the next game day. Closed by: the simulation's report.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the probe to the simulation of ADR-0190's group 3, with fixture pairs for at least 4 templates, and add the baselines ADR-0430 names to ADR-0190's table: the probe text run at $20 on the offline key, the probe letters at 3 to 5 a game day in the first phase planned as 3 or 4 and 1 to 2 after planned as 2, and the probe cell floor of 12 observations. Report the share of first-phase days on which the graph minimum and the letters didn't both fit, because ADR-0430 reopens the letters' count if more than 2 adventures in 30 game days resume the next day for that reason. Build check 5 of ADR-0380 runs through the `nl_probe` projection; run it on this simulation's log.

## Depends on

- TSK-1114 (blocking): it checks the floor and the order that task plans.
- TSK-1117 (blocking): it checks the stream's fence.
- TSK-1118 (blocking): it reads the cells that the phase counts.

## Evidence

Not yet.

## Left alone

The reversal conditions that need real data: the share of `nl` attempts that open a card, the declines among native-reviewed decisions and the phase ending under 12 in a cell. The owner reads them from the log after the probe has run.
