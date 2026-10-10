---
id: TSK-0617
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0120
closes: [REQ-0622, REQ-0624]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A failed or late explanation is replaced by the engine's template within 10 seconds, and the thread pays once

After this task, a generated explanation that fails a check, arrives after 10 seconds, has no model to reach, or finds the budget spent with no stored variant is replaced by the template explanation framed by the same familiar, and the one guiding thread already spent pays for it with no refund and no second charge.

## Acceptance criteria

1. Given six bad replies, a digit, «половина», 9 sentences, a step the graph lacks, step results out of order and a forbidden word, when each is generated, then each shows the template explanation and logs `explanation_fallback` with reason `check_failed` and the failing check (REQ-0622). Closed by: an integration test with one reply for each.
2. Given a model that answers after 11 seconds, when the thread is spent, then the template explanation appears at 10 seconds, and the log holds one `explanation_bought` and no second debit or refund (REQ-0622, REQ-0624). Closed by: an integration test with a fake clock.
3. Given a retry, a reconnect and a fallback for one spend, when each returns, then each returns the same explanation keyed to the `explanation_bought` event (REQ-0624). Closed by: an integration test over the three.
4. Given a template explanation that fails the length or the forbidden-word check at run time, when it is shown, then the engine's short solution framed by the same familiar line pool shows instead. Closed by: a unit test with a template fixture that fails each.
5. Given every template's explanation and short solution, when verify runs, then each passes the blind solve and the safety check, as ADR-0370 states, and a fixture template that fails one fails verify. Closed by: the verify step's output and its failing fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Wire the 10-second timer in the existing `explainer` path of `src/server/play.ts` and return the reason with `explanation_fallback`, which ADR-0080 names and this record gives its reasons: `check_failed`, `timeout`, `provider_failed` and `reuse_failed`. The model's reply must arrive within 7 seconds, a split ADR-0120 chose, with the judge and the blind solve getting the rest. The log's `explanation_shown` holds the `explanation_bought` id, the source `variant`, `template` or `solution`, and never the text.

## Depends on

- TSK-0615 (blocking): the fallback replaces what that task generates.
- TSK-0616 (blocking): the order variant, then template, reads the cache.

The epic realising ADR-0040 supplies the engine's `explain` for each template and trap and the short solution, and the epic realising ADR-0080 supplies the thread's debit; until they exist the fallback uses the stand-in `taskExplanation` and `taskSolution`.

## Evidence

Not yet.

## Left alone

The explanation budget's enforcement, which the epic realising ADR-0100 owns, and the Parent Room's cost line.
