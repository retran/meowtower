---
id: TSK-0728
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2908, REQ-2910, REQ-2920]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Ten synthetic profiles are classified, converge over 30 days and tell "knows" from "doesn't know"

After this task, group 3 simulates the ten synthetic profiles from «всё знает» to «учится после разбора», each with an answer-time model and fixed seeds, and fails, naming the profile and the nodes, when fewer than 90 % of nodes are classified correctly, an estimate fails to converge, or the model tells "knows" from "doesn't know" below 90 %.

## Acceptance criteria

1. Given the ten profiles, when each runs as a single run and as a 30-day run under the reduced frontier budget, then at least 90 % of nodes are classified correctly on every profile; given a profile that falls to 89 %, then group 3 fails and names the profile (REQ-2908). Closed by: an integration test with a model plugged in that misclassifies on purpose.
2. Given a 30-day run, when every node observed at least 5 times is read, then its absolute error at day 30 is no larger than at day 10 and below 0.3; given a node that fails either, then group 3 names it (REQ-2910). Closed by: an integration test with a fixture model that doesn't converge.
3. Given the same 30-day run, when the model's "knows" and "doesn't know" calls are compared with each profile's true state, then the accuracy is at least 90 % (REQ-2920). Closed by: an integration test.
4. Given the same seeds, when the simulation runs twice, then the report holds the same figures, so a failure reproduces from its seed. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Build the harness in `tests/simulation/`: the ten profiles of RES-2900, each with a model of answer time and a true state for each node, fixed seeds, single runs, 30-day runs and the reduced frontier budget of RES-3900. The harness runs the engine, the knowledge model, the Director and the game rules headless. Group 3 reports each measure against its threshold and names the profile and the nodes that fail.

The convergence test is a choice ADR-0190 made where the research left the test open: for every node observed at least 5 times, the absolute error at day 30 is no larger than at day 10 and below 0.3.

The epics realising ADR-0050, ADR-0060 and ADR-0070 supply the graph, the knowledge model and the Director. Until they exist the harness plays a stand-in model and the checks above prove that the harness can pass and fail. The thresholds then apply to each real part as its epic lands.

## Depends on

- TSK-0724 (blocking): group 3 runs inside the runner.

## Evidence

Not yet.

## Left alone

The timed adventure and the success corridor, which TSK-0729 builds on this harness, and the comparison between model versions, which TSK-0730 owns. The refit of the model's values after 4 to 6 weeks of real play, which RES-3000 sets.
