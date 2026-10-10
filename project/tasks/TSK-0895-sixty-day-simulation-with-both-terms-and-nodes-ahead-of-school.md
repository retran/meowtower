---
id: TSK-0895
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5828, REQ-5872]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A 60-day simulation holds the corridor with both new terms on, and a node ahead of school opens on its prerequisites

After this task, a 60-day simulation in ADR-0190's group 3 runs every profile with block priority, the school-goal term, the Volley and the bare share on, and fails when the corridor, the three-day window, the stretch cap or the honest-difficulty property breaks.

## Acceptance criteria

1. Given every simulated profile and both new terms on, when the 60-day simulation runs, then the flow corridor holds, the three-day window holds, no day has more than 2 stretch tasks, and the property test finds no value term that rises as the expected chance of success falls (REQ-5828). Closed by: the group 3 simulation's report.
2. Given a block that is ready, when the simulation reads its nodes' values, then each has a block priority of 0 on that day (REQ-5822). Closed by: an assertion in the same run.
3. Given every node with templates of both formats, when the simulation ends, then at least half of its scored tasks in every 30 days are bare (REQ-5864). Closed by: an assertion in the same run.
4. Given a fixed state, when the school-group setting changes across its values, then the candidate set of 1S nodes up to the end of group 8 is the same, and a 1S node whose prerequisites are ready is a candidate at every value; stretch nodes keep their gate (REQ-5872). Closed by: a property test over the setting's values.
5. Given a profile that answers facts within the threshold at 2 floors in 3 and again at 1 in 2, when 60 days have run, then the report states the share of blocks 1 and 2's facts that are automatic at each share and the share of A and N tasks in the last 14 days (ADR-0290's reversal conditions 2 and 5). Closed by: the simulation's report, which names the two numbers and fails nothing, because the two reversal conditions are the owner's to weigh.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the simulation to group 3 with the profiles ADR-0190 keeps, and run it with `content/director.v2.json`, the Volley share of TSK-0893 and the bare share of TSK-0894. Assert the corridor, the three-day window, the stretch cap and the honest-difficulty property, which is acceptance test 10 of the owner's addendum, and the bare share, which is acceptance test 12.

The candidate set of ADR-0070 already admits frontier nodes by their prerequisites alone. This task proves it with a property test and changes the code only where the test fails: neither the school-group setting, a school goal nor a school snapshot gates it, and the school group moves only the priors.

The 45 % line of ADR-0290's fifth reversal condition and the 90 % line of its second are reported, not asserted, because crossing either asks the owner for a choice and doesn't fail the build.

## Depends on

- TSK-0888 (blocking): the two terms the run switches on.
- TSK-0893 (blocking): the Volley is part of every simulated day.
- TSK-0894 (blocking): the bare share is asserted in the same run.

The epic realising ADR-0190 supplies `tools/simulate.ts`, the profiles and the group 3 runner. Until it exists, the task writes the simulation as a vitest run over fixture profiles and that epic moves it.

## Evidence

Not yet.

## Left alone

Tuning the weights. If the simulation breaks the window, the corridor or the cap after one round of tuning, ADR-0290's first reversal condition applies and the owner decides.
