---
id: TSK-0982
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0350
closes: [REQ-3912]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A local judge's answer is read as one label with a probability for each label, and anything else goes to the safety model

After this task, the gateway's local route sends one check to a judge as a one-token, grammar-limited request, reads the label probabilities and renormalises them, treats an answer outside the check's labels as an error, and sends the same question to `SAFETY_MODEL`.

## Acceptance criteria

1. Given a mocked local judge that returns a label outside the check's set, one that omits a label's probability, and one that reports a probability of 1.2, when the gateway reads each answer, then each is an error, the same question reaches `SAFETY_MODEL`, and `llm_log` records `judge_fell_back` (REQ-3912). Closed by: a gateway test with the three mocked answers.
2. Given a valid answer whose 100 reported candidates include the labels `A` to `C` with probabilities 0.5, 0.3 and 0.1, when the gateway reads it, then the label probabilities are 0.5556, 0.3333 and 0.1111, they sum to 1, and the check applies the thresholds of the judge's `bakeoff` row while `SAFETY_MODEL` applies its own (REQ-3912). Closed by: a unit test.
3. Given a request over the slot's 4,096 tokens, when the gateway builds it, then it isn't sent and the question goes to `SAFETY_MODEL`; given 3 errors or timeouts in a row, then the judge is `down`, its checks go straight to their standby route and the next probe that passes marks it `up` (REQ-3912). Closed by: a gateway test with a clock stub.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the local route to the gateway. Each request is `POST /completion` with the check's fixed prompt first, rendered once by `POST /apply-template` with thinking off and cached, and the cleaned text after it, with `id_slot` set to a free slot of that check, `cache_prompt` true, `temperature` 0, a fixed `seed`, `n_predict` 1, a grammar that allows only the check's labels, `n_probs` 100 and `post_sampling_probs` false. The labels are the Latin capitals `A` to `H`, and a check with more than 8 answers stays on its hosted route. A request that waits for a slot counts toward the 1500 ms timeout.

Choice from SPC-0350: the 100 candidates are read before the grammar acts, so the thresholds hold for the model's own distribution. Stage 0 on the pinned build confirms the reading by finding every label among the 100 (ADR-0360 entry 91); if one is missing, the reading moves after the grammar.

## Depends on

- TSK-0980 (not blocking): the task tests on a stub judge that serves the same routes, so it can land first, and the real process is reached once that task lands.

The epic realising ADR-0100 supplies the gateway, its timeout of 1500 ms, `llm_log` and the fallback to `SAFETY_MODEL`; until it exists the task runs on a minimal gateway module with the same call shape, and the hosted routes stay with that epic.

## Evidence

Not yet.

## Left alone

Which route a check takes, which TSK-0985 resolves, and the start-up and probe steps that mark a judge `up`, which TSK-0983 builds.
