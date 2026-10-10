---
id: TSK-0547
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1056, REQ-1132]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A 30-day simulation classifies at least 90 % of the nodes into their true state and shows guessing buys no gain

After this task, `tools/simulate.ts` plays synthetic profiles through the Director and the knowledge model with a simulated clock, and its 30-day run, its "guesses" profile and its "rushes for bonuses" profile give the figures ADR-0070 predicts.

## Acceptance criteria

1. Given a synthetic profile with known true node states, when 30 days of daily play run under the planned frontier budget, then at least 90 % of the simulated nodes are classified into their true state, on every profile (REQ-1056). Closed by: the simulation's report.
2. Given the "guesses" profile and the "rushes for bonuses" profile, which answers faster than the minimum time in 30 % of tasks, when each runs against the same profile without guessing, then each raises node estimates by no more than 5 percentage points (REQ-1132). Closed by: the simulation's report.
3. Given the 30-day run, when it is read, then every adventure has at least 28 graded first attempts at 1,0 times the fluency threshold and at least 25 at 1,5 times, and story never exceeds 10 minutes. Closed by: the timed simulation's report.
4. Given the same seed, when the simulation runs twice, then the reports are identical. Closed by: a test over two runs.
5. Given a 90-day run, when the domain windows are read, then every 3 consecutive adventure days with 3 completed floors give all 8 domains a floor, and a domain missing for 2 days opens the next route. Closed by: the simulation's report.
6. Given a year of log, when `nextTask` is timed, then it answers within 100 ms at the 95th percentile, and `planDay` and `planFloor` within 1 s, on the family Mac or its stand-in. Closed by: the timing output beside ADR-0190's baselines.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `tools/simulate.ts`, importing the Director and the knowledge model and nothing from `src/server/`, with synthetic profiles of known true states. The classification target and the profiles' budgets follow ADR-0070; ADR-0190's epic wires the tool into the verify command and adds the simulation's other targets, such as the success share range and the model versions not scoring lower (REQ-2908 to REQ-2922).

If the 90 % figure isn't met after two rounds of weight tuning, ADR-0070 says the flow corridor or the frontier budget gives way, and the owner decides which; the report says so and the task isn't closed with a lower figure.

## Depends on

- TSK-0534 (blocking): the frontier choice and `nextTask`.
- TSK-0537 (blocking): obligations and island checks that classification relies on.
- TSK-0538 (blocking): `planDay` and the window.
- TSK-0542 (blocking): the plan targets the timed run checks.
- TSK-0544 (blocking): the rapid-guess rule the guessing profiles exercise.
- The epic realising ADR-0060 supplies the model the simulation replays.

## Evidence

Not yet.

## Left alone

The verify command and the other simulation targets of ADR-0190, and the report's drawing of the figures.
