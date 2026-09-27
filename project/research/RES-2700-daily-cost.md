---
id: RES-2700
artifact: research
status: draft
revised: 2026-09-27
---

# The draft estimates the OpenRouter cost of daily play at about $20 to $40 a month, capped by hard budgets

## Summary

The owner's draft estimates that daily play costs about $20 to $40 a month in
OpenRouter calls, for 30 adventures with explanations. The largest item is the
Master and the planner, at about $0.5 to $1.0 an adventure, under a hard
budget of $1.5 an adventure. Explanations cost about $0.03 to $0.15 a day,
under a budget of $0.3 a day and 20 live generations. One-off offline art is
capped at $40 a run and the model bake-off at $25. The draft proposed a
monthly limit of about $50 on the OpenRouter key; research sets it at $60 on
a key used only for play, above the $55.80 the daily caps allow in a 31-day
month, with offline runs on a second key. Jev's checks, which the owner
allowed on 2026-09-27, cost about $0.005 an adventure by research's
estimate, on the play key through OpenRouter's zero-retention route, as
research decided the same day on the owner's instruction. With GLM as the
Master and the planner, by the owner's decision of 2026-09-27, research
estimates an adventure at about $0.45 to $0.55, and the budgets stay. When a budget runs out, the
game falls back to the library, the cache and templates, and the story keeps
its pace. This record covers the estimates, the limits, prompt caching and the
fallbacks. What leaves the Mac is in the privacy record, and art generation is
in the graphics record.

## The question

What does a day of play cost, and what keeps the cost from running away? The
draft assumes that fixed budgets per adventure, per day and per month bound
the spend and that the fallbacks keep the game playable when a budget runs
out. The figures are estimates the draft means to replace after the first
week, so a limit set from them could be too tight or too loose until
`llm_log` shows real costs.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles -
specification), the opening paragraph and the subsection «Стоимость
ежедневной игры» (cost of daily play), on 2026-09-26. I checked that the
monthly figure agrees with the items: 30 adventures at $0.58 to $1.30 each for
the Master, live frames and explanations gives about $17 to $39. No
alternatives were compared, because the record carries the owner's proposal
for later requirements to cite. The prices are the draft's estimates as of
2026-09-26 and change with OpenRouter's prices.

The draft leaves these open:

- Which adventure length the per-adventure estimates assume. The draft's
  opening gives about 30 to 45 minutes, and the owner has since set the
  adventure of the day at one hour. The owner decided that the estimates need
  no recomputing; see the resolved finding.
- The exact monthly limit: the draft proposes about $50. Resolved below at
  $60, on a play key of its own.
- Who sets the budget variables and whether the parent sees them in the Parent
  Room.

## Findings

### The draft treats every figure as an estimate for the first week to correct

All figures are estimates. The first week of play will show the real costs
through `llm_log`.

### Resolved: The cost estimates stay as the draft gives them for the one-hour adventure

The owner decided on 2026-09-26: the cost estimates, computed for an
adventure of 30 to 45 minutes, don't need recomputing for one hour. A longer
adventure might need more than 8 to 15 live Master calls, but the hard budget
`LLM_BUDGET_USD_PER_SESSION` caps the spend whatever the length, the fallbacks
keep the game running past it, and `llm_log` replaces the estimates with real
costs after the first week.

### The draft gives a cost table with a limit for each item

The draft's table, translated:

| Item | Estimate | Limit |
| --- | --- | --- |
| The Master (about 8 to 15 live calls plus batched scene drafts and both room branches) and the planner, canon in the prompt cache | about $0.5 to $1.0 an adventure | `LLM_BUDGET_USD_PER_SESSION = 1.5` (together with live frames and checks) |
| Live frames and blind checks | about $0.05 to $0.15 an adventure | within the shared limit |
| Detailed explanations: about 4 to 8 a day for threads, most from the cache; a live generation about $0.01 to $0.02 plus a blind check about $0.002 | about $0.03 to $0.15 a day | `EXPLAIN_BUDGET_USD_PER_DAY = 0.3`, at most 20 live generations a day |
| Filling the explanation cache offline (optional) | a few dollars for the full set of templates | none |
| Live pictures (later) | about $0.1 to $0.3 an adventure | `LIVE_ART_BUDGET_USD = 0.5` |
| Free mode (later) | about $0.2 to $0.5 a day | `LLM_BUDGET_USD_FREE = 0.7` a day |
| Offline art | several tens of dollars for the full set | `ART_BUDGET_USD = 40` a run |
| Offline library of frames and lines | a few dollars | none |
| Model bake-off (once, stage 0) | about $5 to $20, depending on the candidates | `BAKEOFF_BUDGET_USD = 25` |
| A month (30 adventures with explanations) | about $20 to $40 | a monthly limit on the OpenRouter key, about $50 proposed |

Live pictures and free mode are deferred until after the MVP by the draft.

### Resolved: the MVP budget has no live art line, because live art comes after the MVP

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's graphics section described live art without marking it as later,
while this cost table marks it «позже» (later). RES-2800 compares the two
options and defers live art with the AI-made items and creatures it would
draw (RES-1600). So `LIVE_ART_BUDGET_USD` stays unset in the MVP, and the
monthly estimate of about $20 to $40 holds without the $0.1 to $0.3 an
adventure live pictures would add.

### The draft caches the canon in the prompt

The canon, without the secrets of future checkpoints, and the stable part of
the system prompt go in a separate cacheable block with an explicit cache
point. The cache lives for minutes, so the first call after a rest stop costs
more; the estimate includes this. The Master's and the planner's requests go
only to zero-retention endpoints (RES-2600), and OpenRouter's zero-retention
page, read 2026-09-26, allows in-memory prompt caching under that rule, so
the cache and this estimate still hold.

### The draft chooses pools and pre-written branches over live calls for reactions

Reactions to answers come from a pool chosen by outcome, and room branches
come from pre-written pairs. The draft gives the reason: live calls would mean
about 70 calls and waits a session.

### The draft falls back without stopping the game when a budget runs out

- Adventure budget spent: the Master switches to the scene library and the
  fallback pools, live frames turn off, and the story moves gently to the end
  of the row at the usual pace.
- Explanation budget spent: the cache or a template explanation answers, and
  the thread still gives an explanation.
- Monthly limit spent: the same fallbacks apply to every session until the end
  of the month, and the parent sees a notice.

### Resolved: the play key carries a monthly limit of $60, and offline runs use a second key

Proposed by research on 2026-09-26; the owner approves it with this record.

I read OpenRouter's model catalogue (`GET /api/v1/models`) on 2026-09-26
for the prices of the draft's models, in US dollars a million tokens:

| Model | Input | Output | Cache read | Cache write |
| --- | --- | --- | --- | --- |
| `anthropic/claude-sonnet-5` (the draft's Master; live frames, explanations) | 2.00 | 10.00 | 0.20 | 2.50 |
| `anthropic/claude-opus-5.5` (the draft's planner; offline library) | 4.00 | 20.00 | 0.20 | 5.00 |
| `google/gemini-3.8-flash` (checks, safety) | 0.75 | 3.75 | 0.075 | 0.04 |
| `openai/gpt-5.5` (offline blind check) | 5.00 | 30.00 | 0.50 | - |

The cache write price is for the 5-minute cache. OpenRouter's prompt caching
page, read 2026-09-26, gives Anthropic a 5-minute cache written at 1.25 times
the input price and a 1-hour cache written at 2 times, with reads at 0.1
times. The owner decided the estimates stay (the finding above), so I checked
them without replacing them. With the draft's call counts (8 to 15 live
calls, about 10 batched scene drafts and about 5 branch pairs), about 3,000
fresh input tokens and 700 output tokens a call, and a cached block of about
30,000 tokens, an adventure costs about $0.9 to $1.1 by my calculation:
about $0.45 to $0.6 for the Master's calls, $0.1 to $0.2 for cache writes,
$0.25 for the planner and $0.1 for checks and frames. That sits at the top of
the draft's $0.5 to $1.0. The size of the cached block is an assumption:
`content/canon.ru.md` doesn't exist yet, and the English canon records hold
about 30,700 words. Each further 30,000 tokens of cached canon adds about
$0.4 to $0.6 an adventure, and then `LLM_BUDGET_USD_PER_SESSION` binds before
the adventure ends. The 1-hour cache costs one write of about $0.12 for 30,000
tokens, against about $0.075 for each 5-minute write, so it is cheaper
whenever a rest stop or a long room would let the 5-minute cache expire twice
or more in an adventure.

Three monthly limits were weighed:

- $50, the draft's figure. It covers the estimate of $20 to $40 with room.
  But the daily caps allow up to 31 × ($1.5 + $0.3) = $55.80 in a long month,
  so in a month when the caps bind most days the monthly limit fires in the
  last days and cuts every session to fallbacks. Two guards then do one job,
  and the second one shortens the story.
- $60. It sits above the $55.80 the daily caps allow, so those caps shape the
  normal spend and the monthly limit fires only when something bypasses them,
  such as a bug that repeats calls. It costs at most $10 more than the draft's
  figure, and only in a month that reaches it.
- No monthly limit, relying on the caps. Nothing then stops a bug in the
  budget code itself.

$60 wins, because it is the lowest limit that never cuts play the daily caps
allow. OpenRouter lets a key carry a credit `limit` with `limit_reset` set to
`daily`, `weekly` or `monthly`, resetting at midnight UTC (OpenRouter's key
and limits documentation, read 2026-09-26). So the play key gets `limit: 60`
and `limit_reset: monthly`, and the game counts its own monthly spend from
`llm_log` against the same $60 before each call, switching to the fallbacks
before OpenRouter refuses a call; a refused call (HTTP 402) triggers the same
fallbacks. The month runs from 00:00 UTC on the 1st, the key's own boundary.
Offline runs (art, the bake-off, the frame and line library, filling the
explanation cache) use a second key with no reset, whose limit the parent sets
to the run's budget before each run, so an art run of up to $40 can't spend
the month's play budget.

### Resolved: Jev's checks cost about $0.005 an adventure on a TypeSafe key, counted inside the adventure budget

The owner decided on 2026-09-27: Jev can be used to evaluate safety and similar judgements, for example the safety check on free text and sorting free-text choices. Jev runs at TypeSafe, outside OpenRouter, so its cost falls outside the OpenRouter key and its $60 limit. RES-1600 lists the checks it may take.

TypeSafe's model page, read 2026-09-27, prices Jev 1.13 at $0.042 a million input tokens, with output free. My estimate assumes about 40 checks an adventure, one for each of about 30 Master replies and drafts and about 10 free-text entries, at about 3,000 input tokens each for the checklist and the text. That gives about 120,000 tokens, or about $0.005 an adventure and $0.15 in a 30-day month. The same checks on `google/gemini-3.8-flash` at $0.75 a million input tokens would cost about $0.09 an adventure before output, so moving them to Jev lowers the adventure's cost slightly. The call count and token size are assumptions until `llm_log` shows real ones.

I compared two ways to bound this spend. A spending limit on the TypeSafe key would mirror the OpenRouter key, but research found no published key limit in TypeSafe's documentation on 2026-09-27. Counting Jev's cost in `llm_log` and inside `LLM_BUDGET_USD_PER_SESSION` works whatever TypeSafe offers, so it wins, and the game's own monthly count adds Jev's spend to the $60. When the adventure budget or the monthly count runs out, the game falls back as it does for any live call, to library scenes and pools checked offline, so no text shows without a safety check. Proposed by research on 2026-09-27; the owner approves it with this record.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. Jev runs through OpenRouter's zero-retention route, `typesafe/jev-1.13`, not TypeSafe's direct API (RES-2600 holds the reason). Its cost therefore falls on the play key and inside its $60 limit, and the question of a TypeSafe key limit no longer arises. OpenRouter's listing, read 2026-09-27, gives the same $0.042 a million input tokens, so the estimate of about $0.005 an adventure stands. Jev's calls are still logged in `llm_log` and counted inside `LLM_BUDGET_USD_PER_SESSION`, as for any other live call. The draft of this finding billed Jev on a TypeSafe key outside the $60.

### Resolved: with GLM as the Master and the planner, an adventure costs about $0.45 to $0.55 by estimate, and the budgets and the $60 limit stay

The owner decided on 2026-09-27: "GLM is good enough for stories." RES-1600 makes `z-ai/glm-5.3` through Mistral's zero-retention endpoint the default for the Master and the planner, with `z-ai/glm-5` at Amazon Bedrock as the Master's fallback, and puts the owner's four story candidates in the bake-off. The owner also decided that every model is configurable, and research proposes that the parent may switch the Master's model in the Parent Room among the bake-off's approved models.

Prices a million tokens at the zero-retention endpoint each would use, from OpenRouter's endpoint listings read 2026-09-27, and the Master's cost an adventure by the method of the finding on the monthly limit above (23 to 30 calls, about 3,000 fresh input tokens, 700 output tokens and a cached block of about 30,000 tokens a call):

| Model and endpoint | Input | Output | Cache read | The Master, an adventure |
| --- | --- | --- | --- | --- |
| `anthropic/claude-sonnet-5`, the draft's default | 2.00 | 10.00 | 0.20 | about $0.45 to $0.6, plus $0.1 to $0.2 of cache writes |
| `z-ai/glm-5.3` at Mistral | 1.40 | 4.40 | 0.14 | about $0.26 to $0.34 |
| `z-ai/glm-5` at Amazon Bedrock | 1.00 | 3.20 | none listed | about $0.81 to $1.06 |
| `anthropic/claude-haiku-4.5` at Vertex or Bedrock | 1.00 | 5.00 | 0.10 | about $0.22 to $0.29, plus cache writes |
| `google/gemini-3.8-flash` at Vertex | 0.75 | 3.75 | 0.075 | about $0.16 to $0.21 |
| `openai/gpt-5.4-mini` at Azure | 0.75 | 4.50 | 0.075 | about $0.18 to $0.23 |
| `openai/gpt-6-luna` at Azure | 0.10 | 0.50 | 0.01 | about $0.02 to $0.03 |

With `z-ai/glm-5.3` the planner costs about $0.07 an adventure in place of about $0.25 on `anthropic/claude-opus-5.5`, scaled by the two models' prices. An adventure then costs about $0.45 to $0.55 by my calculation: $0.26 to $0.34 for the Master, about $0.04 for the first full read of the canon block, $0.07 for the planner and $0.1 for checks and frames. That is about half the $0.9 to $1.1 I computed for the draft's models, and inside the draft's $0.5 to $1.0.

Two assumptions carry this estimate. First, the cache: Mistral lists a cache read price for `z-ai/glm-5.3`, but OpenRouter marks the endpoint as without implicit caching, so the canon block must be marked for caching explicitly. If the cache doesn't take, every call pays the whole block, about $0.049 a call and $1.13 to $1.47 an adventure, and `LLM_BUDGET_USD_PER_SESSION` binds near the end. Second, the fallback: `z-ai/glm-5` at Bedrock lists no cache price, so an adventure that falls back often costs more than one on the draft's Sonnet. `llm_log` shows both in the first week.

I compared lowering the budgets to match the cheaper default with keeping them. Lower budgets would catch a runaway sooner, but the parent may switch the Master to any approved model, and the draft's Sonnet at about $0.9 to $1.1 must still fit. So `LLM_BUDGET_USD_PER_SESSION` stays $1.5, the play key's limit stays $60, and the estimates in conclusion 11 stand until `llm_log` replaces them. The bake-off adds seven cheap candidates to about 12 prompts and 3 repeats each; at the prices above they add under $2, so `BAKEOFF_BUDGET_USD` stays $25. Proposed by research on 2026-09-27; the owner approves it with this record.

## Conclusions

1. Every LLM call must be logged in `llm_log` with its cost, so real costs can
   replace the estimates after the first week.
2. An adventure's LLM spend for the Master, the planner, live frames and blind
   checks must stop at `LLM_BUDGET_USD_PER_SESSION`, which starts at $1.5.
3. The daily spend on explanations must stop at `EXPLAIN_BUDGET_USD_PER_DAY`,
   which starts at $0.3, with at most 20 live explanation generations a day.
4. An offline art run must stop at `ART_BUDGET_USD`, which starts at $40, and
   the model bake-off must stop at `BAKEOFF_BUDGET_USD`, which starts at $25.
5. The OpenRouter key must carry a monthly spending limit.
6. When the adventure budget runs out, the game must switch to the scene
   library and fallback pools, turn off live frames and keep the story's pace.
7. When the explanation budget runs out, a guiding thread must still produce an
   explanation from the cache or a template.
8. When the monthly limit runs out, every session until the end of the month
   must use the fallbacks, and the parent must see a notice.
9. Reactions to answers must come from pools and room branches from
   pre-written pairs, with no live call for either.
10. The canon and the stable part of the system prompt must be sent as a
    separate cacheable block, without the secrets of future checkpoints.
11. The per-adventure cost estimates must stand as the draft gives them for
    the one-hour adventure, by the owner's decision, until `llm_log` gives
    real costs.
12. The MVP must make no live art calls and must set no live art budget; the
    $0.5 an adventure `LIVE_ART_BUDGET_USD` applies only once AI-made items
    and creatures arrive.
13. The OpenRouter key for play must carry a limit of $60 with a monthly
    reset, and the game must stop live calls at the same $60 by its own
    count in `llm_log`, falling back as conclusion 8 says, also when
    OpenRouter refuses a call for the limit.
14. Offline runs must use a second OpenRouter key, separate from the play
    key, whose limit is set to the run's budget.
15. The canon block should use the 1-hour prompt cache, unless `llm_log`
    shows the 5-minute cache is written at most once an adventure.
16. Every Jev call must be logged in `llm_log` with its cost and counted
    inside `LLM_BUDGET_USD_PER_SESSION` and the game's own monthly count.
    (The draft of this conclusion gave the reason that Jev is billed on a
    TypeSafe key outside the OpenRouter limit.)
17. When a budget runs out, Jev's checks must fall back with the other live
    calls, and no text may show without a safety check.
18. Jev's calls must go on the play key through OpenRouter's zero-retention
    route, inside its $60 limit, as research decided on 2026-09-27 on the
    owner's instruction.
19. With `z-ai/glm-5.3` as the Master and the planner, by the owner's
    decision of 2026-09-27, `LLM_BUDGET_USD_PER_SESSION` must stay $1.5 and
    the play key's limit $60, because the parent may switch the Master to any
    model the bake-off approved, and the dearest must still fit.
20. The canon block sent to `z-ai/glm-5.3` must be marked for caching, and
    the first week's `llm_log` must confirm the cache reads, because without
    them an adventure costs about three times the estimate.

## Sources

- The owner's draft «Хроники Башни — спецификация», the opening paragraph and the subsection «Стоимость ежедневной игры», read 2026-09-26; not kept in the repository - supports every finding above.
- OpenRouter, "Zero Data Retention" (https://openrouter.ai/docs/guides/features/zdr), read 2026-09-26 - in-memory prompt caching is allowed on zero-retention endpoints.
- OpenRouter, model catalogue (https://openrouter.ai/api/v1/models), read 2026-09-26 - the prices in the resolved finding on the monthly limit.
- OpenRouter, "Prompt Caching" (https://openrouter.ai/docs/features/prompt-caching), read 2026-09-26 - Anthropic's 5-minute and 1-hour cache and their write and read multipliers.
- OpenRouter, "Update an API key" (https://openrouter.ai/docs/api/api-reference/api-keys/update-keys) and "Team Spend Controls: Setup Guide" (https://openrouter.ai/blog/tutorials/team-spend-controls-setup/), read 2026-09-26 - a key's `limit` and `limit_reset` of daily, weekly or monthly, reset at midnight UTC.
- The owner's decision that the cost estimates need no recomputing for the one-hour adventure, relayed 2026-09-26 - conclusion 11 and the resolved finding.
- The owner's decision of 2026-09-27, relayed that day: Jev can be used to evaluate safety and similar judgements.
- TypeSafe AI, «Models», https://docs.typesafe.ai/models, read 2026-09-27 - Jev 1.13 at $0.042 a million input tokens, output free; no key spending limit found in the documentation.
- OpenRouter API, `GET https://openrouter.ai/api/v1/endpoints/zdr`, read 2026-09-27 - `typesafe/jev-1.13` listed as a zero-retention endpoint at $0.042 a million input tokens.
- The owner's decisions of 2026-09-27, relayed that day: "GLM is good enough for stories"; the story candidates; "The model should be configurable".
- OpenRouter API, `GET https://openrouter.ai/api/v1/endpoints/zdr` and `GET https://openrouter.ai/api/v1/models/<id>/endpoints` for `z-ai/glm-5.3`, `z-ai/glm-5`, `anthropic/claude-haiku-4.5`, `google/gemini-3.8-flash`, `openai/gpt-5.4-mini` and `openai/gpt-6-luna`, read 2026-09-27 - the input, output and cache read prices at each zero-retention endpoint, and the implicit caching flag.
