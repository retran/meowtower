---
id: TSK-0985
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0350
closes: [REQ-3916, REQ-3924]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each judge check takes the route its own test set proves, and every other check stays on its hosted route

After this task, the gateway computes one route for each judge check from the `bakeoff` rows in the order local judge, `JUDGE_MODEL`, `SAFETY_MODEL`, appends `judge_route_changed` when the evidence changes, and sends a check to its standby route while its judge isn't `up`.

## Acceptance criteria

1. Given `LOCAL_JUDGES` empty, when every check's route is resolved, then each is the route ADR-0100 gives, and a replayed adventure makes the same calls it made before this epic (REQ-3924). Closed by: a route test and a replay test.
2. Given synthetic `bakeoff` rows, when routes resolve, then a check goes to the judge at 95 % agreement over the one at 91 %; a tie of 95.0 % and 94.5 % goes to the judge that passes the most checks and then to the one with fewer parameters; and a check whose only local row passed agreement and failed latency stays on its hosted route (REQ-3916, REQ-3924). Closed by: a route test over the synthetic rows.
3. Given a route that changes because a file, a prompt, a test-set version, the in-flight count, a new row or the configuration changed, when the next probe runs, then one `judge_route_changed` is appended for each affected check with the matching `reason`; and given a judge that goes `down` or `up`, then none is appended and the route table keeps the local route (REQ-3924). Closed by: an event test.
4. Given a game day in which 6 % of the checks routed to a judge were answered by a fallback or a standby route, when the share first passes 5 %, then one `local_judge_falling_back` notice names the share, the day's local p95, the hours the fallbacks fell in and the judge's state, and none repeats until a game day below 5 % or the share doubles. Closed by: a notice test over three simulated days.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `resolveJudgeRoute(check)` to the gateway: it reads the route table, the judges' states and the probe results, all held in memory, and never opens a connection or waits. Among several passing judges the one with the highest agreement answers; judges within one percentage point of the best tie, because on a test set of a few hundred items a smaller gap is below its sampling error. A passing local judge wins over `JUDGE_MODEL`, because the owner asked on 2026-09-27 for a local analogue and a judge that passed both tests meets the same evidence standard.

Register `judge_route_changed` (version 1) with the payload ADR-0350 gives. `./meowtower status` prints each judge's state and the game day's share of its calls that fell back, read from `llm_log`, beside the bake-off's p95, so the owner can compare them in the first week of play.

## Depends on

- TSK-0983 (blocking): the judge's states `up`, `unverified` and `down`, and the probe, decide the standby route.
- TSK-0984 (not blocking): the route reads `bakeoff` rows, and the task tests on synthetic rows, so it can land first.

The epic realising ADR-0100 supplies `JUDGE_MODEL`, `JUDGE_CHECKS` and its start-up check; until it exists the task runs on a fixture configuration naming one hosted judge, and the real model lists stay with that epic. The epic realising ADR-0020 holds the event catalogue this task registers into.

## Evidence

Not yet.

## Left alone

Which model answers which check, which the stage 0 bake-off decides and may decide as "every check stays hosted", and how agreement is measured, which the epic realising ADR-0100 owns.
