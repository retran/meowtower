---
id: TSK-0517
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0908, REQ-0912, REQ-0920]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each pair of node and subtype keeps its own "on her own" estimate, which falls with time and rises after a walkthrough

After this task, `src/engine/model/bkt.ts` holds `pKnow` for every pair of node and subtype and updates it by the four steps of ADR-0060 for each observation, with the v1 parameters read from `content/model.v1.json`, so the Director and the states have an estimate that forgets.

## Acceptance criteria

1. Given two subtypes of one node, when observations arrive for only one, then the other's `pKnow` is its prior and the first one's has moved (REQ-0908). Closed by: a unit test.
2. Given a pair with `H` of 60 days and no new evidence, when `pKnow` is evaluated 60 days after its last observation, then it is half its value at that observation, and 120 days after, a quarter (REQ-0912). Closed by: a unit test with exact values.
3. Given a `postFeedback` mark since the pair's last observation, when the next observation arrives, then `p` first rises to `p + (1 - p) * 0.15` and then takes the evidence step (REQ-0920). Closed by: a unit test against a hand-computed value.
4. Given a fixed sequence of 10 observations on one pair, when the four steps run in the order forgetting, feedback, evidence, practice, then each intermediate `p` equals the value in the test, and `H` is 60 days, times 1,5 after a right answer at least 3 days after the previous observation up to 365 days, back to 60 after a wrong answer, and unchanged after a partial one. Closed by: a unit test with golden values.
5. Given an observation of a control fact, when it is applied, then it moves its node's pair like any observation. Closed by: a unit test.
6. Given a free-input template, a choice among 4 options and a 3-step template, when `pGuess` and `pSlip` are read, then they are 0,03, 0,25 and `max(0.10, 1 - 0.95^3)`. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `content/model.v1.json` with the v1 values of ADR-0060's table: `pInit` by level for the group 7 and group 8 rows, `pLearnPractice` 0,05, `pLearnFeedback` 0,15, `pGuess` by answer form, `pSlip`, and the half-life rules. Add `src/engine/model/bkt.ts` as a pure function from the observations of TSK-0516 and the parameters to one estimate per pair.

Forgetting is a decay towards zero, the plain reading of a half-life, because it makes the estimate fall for any starting value while no evidence arrives; a decay towards the prior would raise an estimate that sits below it. The model evaluates forgetting at a fixed "now", the server time of the event that triggered the run, so a recompute of the same log at a later hour gives the same projection.

The admission of new forms to the estimate, the `estimate` stream and the `pGuess` of unanswerable problems belong to ADR-0210, ADR-0240 and ADR-0250.

## Depends on

- TSK-0516 (blocking): the observations with their scores and weights.

## Evidence

Not yet.

## Left alone

The bounds that keep a right answer from lowering `p`, which TSK-0518 checks, the priors by school group, which TSK-0519 reads, and the node aggregate, which TSK-0520 builds.
