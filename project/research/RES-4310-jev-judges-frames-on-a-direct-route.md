---
id: RES-4310
artifact: research
status: approved
revised: 2026-10-31
elaborates: RES-1600
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One Jev request on OpenRouter can check every variant of a frame and choose the best

## Summary

Jev answers named questions on OpenRouter, so one request can ask whether each variant is safe, holds a joke or changes the task, and which variant is best. The owner decided on 2026-10-31 that this replaces the blind solves and the safety model for frames. This record doesn't cover the player's own text.

## The question

RES-0720 trusts blind solves to show that a frame keeps the task, at 3 calls a variant. The assumption is that only solving proves it. The owner judges this check redundant, because the engine fixes the numbers and the answer and code checks the placeholders, so what remains is whether the words still ask the same thing, which a yes-or-no question can read.

## Method

I read OpenRouter's Jev guide and its decisions reference and TypeSafe's models page on 2026-10-31. No real call ran.

## Findings

### Jev is on OpenRouter

`POST https://openrouter.ai/api/v1/systemone` takes the model `typesafe/jev-1.14`, `state` and `questions`, bills to the OpenRouter account and returns `usage.cost`. OpenRouter's guide doesn't state a retention policy, so RES-1600's zero-retention route is unconfirmed for this version.

### Noul and Choice share one request

A Noul answer is the probability of yes. A Choice takes its options from the keys of `criteria` and returns `choice` with optional `probabilities`. Questions have no separate count limit (TypeSafe's page).

### English is Jev's main language

TypeSafe's page says other languages are handled less well and should be tested on your own content, and no test set exists.

### A yes-or-no reading is weaker than solving

A blind solve fails when the words lead to another answer. Jev reads the text against the template and gives a probability, and nothing measures how often it misses a changed question, most of all in Russian and Dutch.

## Conclusions

1. A frame's checks must run on the judge in one request with the choice of the best variant.
2. A check must treat doubt as a no.
3. When the judge errs or times out, the task must show its template text.

## Sources

- [OpenRouter Jev guide](https://openrouter.ai/docs/guides/community/jev), read 2026-10-31 - endpoints, ids and billing.
- [Decisions reference](https://openrouter.ai/docs/api/api-reference/alphadecisions/submit-a-decisions-request.md), read 2026-10-31 - question and answer formats.
- [TypeSafe models](https://docs.typesafe.ai/models), read 2026-10-31 - languages and limits.
