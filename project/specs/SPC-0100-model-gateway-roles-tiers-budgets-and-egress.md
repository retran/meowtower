---
id: SPC-0100
artifact: spec
status: live
revised: 2026-09-29
states: [REQ-1642, REQ-1644, REQ-1646, REQ-1648, REQ-1650, REQ-1652, REQ-1654, REQ-1656, REQ-1686, REQ-1688, REQ-1690, REQ-1692, REQ-1694, REQ-1696, REQ-2602, REQ-2604, REQ-2606, REQ-2608, REQ-2612, REQ-2614, REQ-2616, REQ-2618, REQ-2620, REQ-2622, REQ-2624, REQ-2626, REQ-2628, REQ-2630, REQ-2632, REQ-2634, REQ-2638, REQ-2644, REQ-2700, REQ-2702, REQ-2704, REQ-2706, REQ-2708, REQ-2710, REQ-2712, REQ-2714, REQ-2716, REQ-2718, REQ-2720, REQ-2722, REQ-2726, REQ-2728, REQ-5034, REQ-5036, REQ-5038, REQ-5040, REQ-5042, REQ-5044, REQ-5046, REQ-5048, REQ-5050, REQ-5052, REQ-5054, REQ-6412, REQ-6686, REQ-6688]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The model gateway, its roles, privacy tiers and budgets, and what leaves the Mac

## Scope

This document covers the model gateway: the one server module that opens a connection to a model service. It states the roles and their configuration, the request classes, the egress guard, the two privacy tiers, the start-up check, the two keys and the budget buckets, the call log, the gateway's four modes, the bake-off route, the Master's model pick and the Parent Room's page on what leaves the Mac. It is written at the module level: the gateway's interface to its callers, its calls to OpenRouter, the settings it reads, the tables and events it writes and its failure states.

ADR-0350, the local judge, is a child of this document. This document states the contract between the gateway and ADR-0350 under "The contract with the local judge", and ADR-0350 states the judge processes, the route resolver and the Parent Room's list of checks. What the Master's order holds and how its replies are checked belong to ADR-0110, how explanations are written and cached to ADR-0120, what the library plays when a budget runs out to ADR-0110 and SPC-0090, the riddle parse's graph and verdicts to ADR-0230, the sandbox's files to ADR-0340, the Dutch probe's offline text run to ADR-0430, and when the automated checks run the gateway in `replay` mode to ADR-0190.

## Boundary

### What callers see

The gateway lives in `src/server/gateway/`, a path I chose. A caller hands it one typed request of a request class and a role, and gets back the role's parsed output or one of two typed results, `BudgetExhausted` or `ProviderFailed`. Each request class is a `.strict()` zod schema that refuses an unknown field.

| Request class | Roles | Fields |
| --- | --- | --- |
| `StoryRequest` | `MASTER_MODEL` with `MASTER_FALLBACK_MODEL`, `PLANNER_MODEL`, `FREE_PEN_MODEL` | the order ADR-0110 defines, the cached canon block by its hash, and `readerAge`, an integer from the Parent Room setting |
| `ExplainRequest` | `EXPLAIN_MODEL` | the task text as shown, the engine's solution steps and answer, the player's answer, any matched misconception with its engine calculation, the error class, the familiar's kind, name, traits and sample lines, and, for the gateway alone, the id of the `thread_spent` event that paid for it (REQ-2604) |
| `BlindCheckRequest` | `LIVE_CHECK_MODEL` for explanations | the task text and the finished explanation (REQ-2606) |
| `JudgeRequest` | the judge route of ADR-0350, then `SAFETY_MODEL` | one cleaned text, which for a composed riddle is its masked text, and one question typed as Noul (yes or no), Choice or Score |
| `ParseRequest` | `PARSE_MODEL` | the fixed parse prompt by its hash and the riddle's masked text; the token list `n1` to `nm` and the schema version stay on the server (REQ-5036, REQ-5038) |
| `ContentRequest` | every offline role, `LIVE_GEN_MODEL`, and `LIVE_CHECK_MODEL` for live frames | canon text, frames with placeholders, bake-off prompts, framing and puzzle drafts, picture specifications built from JSON card ids, and, after the MVP, the probe run's requests: a template's structural specification, the probe's style guide, the Mainland's canon names and the target length (REQ-6688) |

### Roles

Each role takes its model id from `.env` (REQ-1642). The code fixes each role's privacy tier, key, budget bucket, request classes, timeout and `max_tokens`, and `.env` changes only the model.

| Role | Tier | Key | Bucket | Default model |
| --- | --- | --- | --- | --- |
| `MASTER_MODEL` | player | play | adventure | `z-ai/glm-5.3` |
| `MASTER_FALLBACK_MODEL` | player | play | adventure | `z-ai/glm-5` |
| `PLANNER_MODEL` | player | play | adventure | `z-ai/glm-5.3` |
| `FREE_PEN_MODEL` | player | play | adventure | the adventure's Master model |
| `LIVE_GEN_MODEL` | content | play | adventure | set in `.env` |
| `LIVE_CHECK_MODEL` | player | play | adventure for frames, explanations for explanations | set in `.env` |
| `SAFETY_MODEL` | player | play | the caller's bucket | set in `.env` |
| `JUDGE_MODEL` | player | play | the caller's bucket | `typesafe/jev-1.13` |
| `EXPLAIN_MODEL` | player | play | explanations | set in `.env` |
| `PARSE_MODEL` | player | play | parse | the model `LIVE_CHECK_MODEL` uses |
| `LIVE_ART_MODEL` | content | play | live art | off in the MVP |
| `FRAMING_MODEL` | content | offline | the run's budget | the model `PLANNER_MODEL` uses |
| `PUZZLE_MODEL` | content | offline | the run's budget | the model `PLANNER_MODEL` uses |
| `GEN_MODEL`, `CHECK_MODEL`, `ART_JUDGE_MODEL` | content | offline | the run's budget | set in `.env` |
| `ART_MODEL_CHAR`, `ART_MODEL_KEY`, `ART_MODEL_BG` | content | offline | art run | set in `.env` |
| `PROBE_TEXT_MODEL`, after the MVP | content | offline | the run's budget | the model `GEN_MODEL` uses |
| `PROBE_LANGUAGE_MODEL`, after the MVP | content | offline | the run's budget | the model `LIVE_CHECK_MODEL` uses |

### Settings

The server reads these from `.env` at start and at no other time:

- one variable per role in the table above;
- `MASTER_MODEL_CHOICES`, the Master models an owner-approved decision names;
- `JUDGE_CHECKS`, the checks moved to `JUDGE_MODEL`, by the check names ADR-0350 uses;
- `PLAYER_TIER_PROVIDERS` and `CONTENT_TIER_PROVIDERS`;
- `OPENROUTER_PLAY_KEY` and `OPENROUTER_OFFLINE_KEY`;
- the budget values of the buckets table below, and `VERIFY_LIVE_BUDGET_USD`;
- `GATEWAY_MODE`, one of `play`, `verify`, `replay` or `bakeoff`.

### Tables and events

The gateway writes one `llm_log` row per call, a service table outside the projections that no projection reads, with the role, model, provider, tier, key, tokens, cost, latency, outcome, request and response. The import check fails any projection code that names `llm_log`. The gateway stores the cached canon block once by its hash. It appends these events through `appendEvents`:

| Event | When |
| --- | --- |
| `llm_call` | every call; points to its `llm_log` row |
| `budget_month_spent` | once, when the month of play reaches its limit |
| `master_pick_rejected` | the parent's Master pick failed its check before an adventure |

The `bakeoff` table holds the bake-off's anonymised answers, the parent's scores and each check's test-set records.

### Failure states

| State | Next step | Audience |
| --- | --- | --- |
| `model_config_invalid` | the server doesn't start; the message names the role, the model and the missing fact | the owner |
| `judge_file_mismatch` | the server doesn't start; the message names the configured model file and the one the local judge serves | the owner |
| `models_unverified` | the server starts with every live call off; the check retries every 10 minutes | the owner |
| `egress_blocked` | the request isn't sent and the caller gets `ProviderFailed`; reported once per cause | the owner |
| `mask_incomplete` | the `ParseRequest` isn't sent; the riddle turns into a card riddle for the same target, as ADR-0230 decides; reported once per cause | the owner |
| `provider_failed` | the caller gets `ProviderFailed` | the owner, in `llm_log` |
| `judge_fell_back` | the same question goes to `SAFETY_MODEL` | the owner, in `llm_log` |
| `master_pick_rejected` | the adventure runs on `MASTER_MODEL`; the parent can pick again | the parent |
| `budget_adventure_spent`, `budget_explain_spent`, `parse_budget_spent` | fallbacks to the end of the adventure or game day | the parent, in the day's cost line |
| `budget_month_spent` | fallbacks to the end of the month and a notice | the parent |
| `sandbox_budget_spent` | sandbox model features fall back to the end of the month; one notice | the parent |
| `offline_key_refused` | OpenRouter answered HTTP 402 on the offline key; the call falls back and the run or the sandbox reports it | the owner |
| `recording_missing` | a `replay` request with no recording fails | the building agent |

The player sees none of these states: each caller falls back to the library, the cache, a template or sentence cards, and the story reads the same.

### Permitted dependencies

The dependencies run one way. Only `src/server/gateway/` opens a connection to a model service, the local judges included, and a lint rule refuses `fetch` to any host outside it. Callers import the request classes and the typed results and never an HTTP client. The gateway imports `appendEvents`, reads the Parent Room's settings for the names to clean, the topic names in the skill graph file, `content/numerals.ru.json` and ADR-0350's route resolver, and imports nothing from the engine, the Director or the Master. The gateway and every request-class builder import no hypothesis schema, no `hypothesis_days` projection and nothing from `src/parent/hypotheses/`, as ADR-0450's check `hypothesis_to_gateway` enforces. After the MVP, `src/engine/probe/` and the server's probe routes import nothing from the gateway, and `tools/probe/` reaches a model only through it, as ADR-0430 states.

## Behaviour

### Roles and configuration

Each role's model comes from `.env`, so switching a model needs a restart of the server container and no code change and no rebuild (REQ-1642). The server reads `.env` only at start, so every changed model passes the start-up check before a call uses it (REQ-1646). A model enters the play configuration only when an owner-approved decision record in `project/adrs/` names it, whether it is the bake-off's choice or a substitute (REQ-1656). That record's list of approved Master models is `MASTER_MODEL_CHOICES`.

Every call carries its role's `max_tokens` and ends at its role's timeout. Both values are rows of ADR-0190's Baselines table, which `verify/baselines.json` carries:

| Role | Timeout | `max_tokens` |
| --- | --- | --- |
| `MASTER_MODEL`, `MASTER_FALLBACK_MODEL`, `FREE_PEN_MODEL` | what remains of the 12 seconds since the order | 2,000 |
| `PLANNER_MODEL` | 60 s | 4,000 |
| `LIVE_GEN_MODEL` | 30 s | 4,000 |
| `LIVE_CHECK_MODEL` | 10 s | 1,000 |
| `EXPLAIN_MODEL` | 15 s | 2,000 |
| `SAFETY_MODEL` | 5 s | 200 |
| `JUDGE_MODEL` | 1500 ms | 200 |
| `PARSE_MODEL` | 10 s | 4,000 |
| every offline text role | 120 s | 8,000 |
| every art role | 300 s | none; the reservation is one image at its listed price |

### The start-up check

Before the server listens, it reads OpenRouter's two catalogue listings, the default one and the image-output one, and `GET /api/v1/endpoints/zdr`. The server refuses to start as `model_config_invalid` when a configured model, text, image or judge, is missing from the catalogue (REQ-1644). It also refuses when a player-tier model, each entry of `MASTER_MODEL_CHOICES` and `PARSE_MODEL` included, has no zero-retention endpoint at a provider on the player-tier list (REQ-2628). It refuses when `JUDGE_CHECKS` names a check with no passing test-set record for the configured `JUDGE_MODEL` in the `bakeoff` table (REQ-1688). It refuses when a provider on either tier list has no row in `content/providers.json`, the table that gives each provider's OpenRouter slug, company, country and retention (REQ-2648). The refusal names the role or provider, the model and the missing fact. When a configured local judge's `/props` names a model file other than the configured one, the server refuses to start as `judge_file_mismatch`, naming both files (REQ-1644).

When the catalogue can't be reached, the server starts with every live call off, as `models_unverified`, and the game runs on the library and the cache. The check retries every 10 minutes, and the first pass turns live calls on.

### The bake-off

`tools/bakeoff.ts` sets the gateway's `bakeoff` mode and sends every candidate through the gateway on the route, endpoint, tier and provider list play would use (REQ-1654). It runs on the offline key and stops at the bake-off budget of $25 (REQ-2710), reporting the candidates it finished. It sends the same 12 prompts to every candidate. The Master's candidates include GLM 5.3, Claude Haiku 4.5, Gemini 3.8 Flash, GPT-6 Luna and the fallback GLM 5 (REQ-1652). It stores the answers in the `bakeoff` table with the model's name removed, and the Parent Room shows them to the parent for blind scoring, which chooses the text models (REQ-1648). A candidate with any safety failure is marked excluded and never enters `MASTER_MODEL_CHOICES` (REQ-1650). ADR-0350 states the bake-off of local judge candidates.

### The Master's route and the parent's pick

Every Master request names `[MASTER_MODEL, MASTER_FALLBACK_MODEL]` in OpenRouter's `models` list, so an order the Master's model fails goes to `MASTER_FALLBACK_MODEL` before the caller gets `ProviderFailed` and ADR-0110 falls back to the library (REQ-1692).

The Parent Room offers the Master's model only from `MASTER_MODEL_CHOICES` (REQ-1694). A pick takes effect at the next adventure, and an open adventure keeps its model (REQ-1696). Before that adventure starts, the gateway checks the pick against the catalogue and the zero-retention list. When the pick has no zero-retention endpoint at a provider on the player-tier list, the adventure starts on `MASTER_MODEL` and the gateway appends `master_pick_rejected`, which the Parent Room shows (REQ-2630).

### The judge route

A `JudgeRequest` goes only to the judge route, and the judge roles take no other request class, so a judge never writes text, solves a task or judges a picture (REQ-1686). The route for each check is the one ADR-0350 resolves: a local judge, `JUDGE_MODEL` or `SAFETY_MODEL`. A check reaches a judge model, hosted or local, only when the judge matched the reference model on the check's labelled Russian test set at the stage 0 bake-off and the `bakeoff` table holds that passing record (REQ-1688).

Agreement is the share, in percent, of a test set's items on which the judge's label equals the reference model's label. The bake-off sends the reference model through the gateway twice on each item, as two separate requests with the settings play uses for that model and no response cache, and the reference's self-agreement is the share of items on which its two labels are equal. A judge matches the reference when its agreement is no more than one percentage point below the reference's self-agreement and it gives the gravest label on every item where the reference gives it: `serious` on `signal`, whose labels are none, everyday, `scared` and serious in rising order, and a failing answer on `safety` (REQ-1688). ADR-0350's tie between judges reads this measure.

When the judge that answers a check errs, passes its timeout of 1500 ms or gives an answer ADR-0350 refuses, the gateway sends the same question with the same text to `SAFETY_MODEL` and logs `judge_fell_back` (REQ-1690).

### What leaves the Mac

The server sends off the Mac only five kinds of data: content made without the player, the player's story material, the age the parent set, the one-task explanation request and a composed riddle with every number masked (REQ-5042). Story material is her cleaned free text, invented names, story memory and summary outcome events, and a model's output made from them, such as a Master reply sent to a check. Each kind travels only in the classes named here: story material in `StoryRequest` and `JudgeRequest`, the age only in the `StoryRequest` field `readerAge`, the explanation request in `ExplainRequest` and `BlindCheckRequest`, the masked riddle in `ParseRequest` and `JudgeRequest`, and content in `ContentRequest`. The event log, times, estimates, node states, scratchpads, lesson tags, reports, her real name, her school group and the school's goal list have no field in any class. Her answers have none either, apart from the one answer an `ExplainRequest` carries and the masked riddle (REQ-5042).

An `ExplainRequest` carries only the fields the class table lists, with no name of the player, no time, no estimate, no node id and no history of other tasks (REQ-2604). Before it sends one, the gateway finds the `thread_spent` event the request names in the log, and refuses the request when that event is missing or belongs to another task, so an explanation leaves the Mac only after she spent a thread on that task's explanation (REQ-2602). The gateway then removes the event's id from the body it sends. A `BlindCheckRequest` carries only the task text and the finished explanation (REQ-2606).

A `ParseRequest` carries the riddle with every number replaced by a token, `n1` to `nm` in text order (REQ-5036). A number is a digit run, a decimal, a fraction or a Russian numeral word from `content/numerals.ru.json`, such as «пять» (five) or «полтора» (one and a half). The map from tokens to numbers stays on the Mac, and no request class has a field for it. A `ParseRequest` holds no target expression, node id, topic name or task id (REQ-5038). `PARSE_MODEL` runs on the player tier with `zdr: true`, so only an endpoint that keeps nothing receives a riddle (REQ-5040). Its timeout is 10 seconds and its `max_tokens` 4,000.

No request class has a field for a figure the Parent Room computes: the ability profile, the weekly breakdown, retention checks, transfer figures, the quadrants, the probe's results and every other addendum 2 figure stay on the Mac, as do the hypotheses ADR-0450 keeps (REQ-6686). A test searches every request schema and fails on a field typed with a Parent Room figure, probe result or hypothesis schema, and on a numeric field other than `readerAge`, the one answer an `ExplainRequest` carries and the probe run's target length, a rule I chose.

After the MVP, the Dutch probe's Russian and Dutch texts are written only by the offline probe run, under `PROBE_TEXT_MODEL`, `CHECK_MODEL` and `PROBE_LANGUAGE_MODEL` on the content tier and the offline key, in `ContentRequest`s whose fields hold no answer, tap, opened word or other data about the player (REQ-6688). ADR-0430 states the run and its import rule. No Dutch probe text is built until the owner amends the rule in `CLAUDE.md` that text the player sees is in Russian only.

The picture builder takes JSON card ids and never a string, so no text the player wrote reaches a picture prompt (REQ-2632).

### The egress guard

Before a request leaves the Mac, the egress guard cleans it and then scans it. The guard runs on every string field except the cached canon block, `readerAge` and the fields the engine fills from templates and content: the task text, the solution steps, the engine's answer and the misconception's calculation. I chose to exempt the engine's fields, because a long number in a task would otherwise match the phone pattern.

The guard replaces the family names, school, street and city the parent sets in the Parent Room with neutral labels, and every phone number, postal address and e-mail address its patterns find (REQ-2612). It reads her real name from the Parent Room setting and cleans it like a family name, so a request names the heroine only by the name she gave her in the game (REQ-2634). The labels and patterns are these, which I chose; the test set `tests/fixtures/egress-patterns.json` holds Dutch and Russian phone numbers, Dutch postcodes and e-mail addresses for each.

| Match | Label | Pattern |
| --- | --- | --- |
| her real name or a family name the parent set, in any case form | «[имя]» (name) | the set value, case-insensitive, with the Russian case endings of the lexicon |
| the school the parent set | «[школа]» (school) | the set value, case-insensitive |
| the street the parent set | «[улица]» (street) | the set value, case-insensitive |
| the city the parent set | «[город]» (city) | the set value, case-insensitive |
| a phone number | «[телефон]» (phone) | 10 to 15 digits, with spaces, dashes, dots or brackets between groups, starting with `+` or `0`, or starting with `8` followed by 10 digits |
| a postal address | «[адрес]» (address) | a Dutch postcode, 4 digits, an optional space and 2 capital letters; or a street word, «улица», «ул.», «проспект», «пр.», «дом», «д.» or a word ending in `straat`, `laan`, `weg`, `plein` or `gracht`, followed by a house number |
| an e-mail address | «[почта]» (mail) | a local part, `@`, and a domain with at least one dot |

In a `StoryRequest`, the guard then replaces each remaining digit run in her free text with «[число]» (number) in the copy sent out; the Parent Room keeps her text as she wrote it. It refuses to send a `StoryRequest` that still holds a digit, a node id or a topic name from the skill graph file, as `egress_blocked` (REQ-2608). ADR-0110 states what else an order may not hold. A riddle is cleaned first and masked after. The guard refuses to send a `ParseRequest` whose text still holds a digit or a numeral word after masking, as `mask_incomplete` (REQ-5036).

### Privacy tiers

The player tier covers every role that receives story material or an explanation request: `MASTER_MODEL`, `MASTER_FALLBACK_MODEL`, `PLANNER_MODEL`, `FREE_PEN_MODEL`, `EXPLAIN_MODEL`, `LIVE_CHECK_MODEL`, `SAFETY_MODEL`, `JUDGE_MODEL` and `PARSE_MODEL`. Its requests carry `provider: { zdr: true, data_collection: "deny", only: [...] }`, with the list from `PLAYER_TIER_PROVIDERS`, so they reach only an endpoint that keeps no copy (REQ-2616) at a provider on the player-tier list (REQ-2618). The player-tier list starts as Google Vertex, Amazon Bedrock, Azure and xAI, with Mistral for GLM models only and TypeSafe for Jev only (REQ-2622). Each entry of a provider list is a provider's OpenRouter slug, or a slug and a model prefix as `slug:prefix`, such as `mistral:z-ai/glm-` and `typesafe:typesafe/jev-`, a format I chose. The gateway builds each request's `only` list from the entries whose prefix matches the role's model or that have none. The gateway applies no region filter (REQ-2644).

Every other request is in the content tier and carries `provider: { data_collection: "deny", only: [...] }`, with the player-tier list and `CONTENT_TIER_PROVIDERS` together (REQ-2620). The content-tier list starts as Anthropic, OpenAI, Google AI Studio, Seed and Mistral (REQ-2624). The owner sets the OpenRouter account to forbid storage and training and to allow no provider outside the two lists (REQ-2614). Both lists are settings in `.env`, which a restart of the server container applies with no rebuild (REQ-2626).

### Keys

The gateway holds two OpenRouter keys. The play key carries a spending limit of $60 that resets each month (REQ-2718), and the play roles spend from it. Offline runs spend from the offline key (REQ-2728). The gateway refuses an offline role on the play key. It refuses a play role on the offline key, apart from `verify` mode, `bakeoff` mode and a call marked as a sandbox call, which only the sandbox's own routes can make. The framing of hint rungs and the retelling of puzzles run under `FRAMING_MODEL` and `PUZZLE_MODEL`, offline roles on the offline key, and never under `PLANNER_MODEL` (REQ-5034). The sandbox's model features spend from the offline key and never from the play key (REQ-5050).

Between runs, the offline key's limit is the sandbox's $20 a month, reset at 00:00 UTC on the 1st. Before each offline run, the owner sets the limit so that what remains of it equals that run's budget (REQ-6412), and after the run sets it to $20 plus what the month's offline runs have spent on the key, so the sandbox keeps its $20 a month. `verify --live`'s budget is what remains of the limit during that run. After the MVP, a probe text run's budget is $20 a run, set on the offline key's limit the same way (ADR-0430).

### Budgets

The gateway counts spend in buckets. Each call first reserves its worst-case cost, the model's listed prices applied to the input tokens and to `max_tokens`, and the gateway refuses the call with `BudgetExhausted` when the reservation would pass the bucket's limit. After the reply, the gateway settles the reservation at the cost OpenRouter reports in the response's `usage` field. A Master reply reserves together with the checks it needs, each check at the cost of its `SAFETY_MODEL` fallback where that is dearer than its judge route, a worst case I chose. Concurrent calls, such as the scenes the Master drafts ahead, therefore can't pass a limit together.

| Bucket | Limit | Key | Counts | When it runs out |
| --- | --- | --- | --- | --- |
| Adventure | $1.5 an adventure (REQ-2702) | play | the Master, the planner, live frames, blind checks of frames, the judge's checks and `SAFETY_MODEL`; `FREE_PEN_MODEL` in the current adventure (REQ-5054) | live calls stop for that adventure; the game plays the library and the pools with no live frames at the usual pace (REQ-2714) |
| Explanations | $0.3 and 20 live generations a game day (REQ-2704, REQ-2706) | play | `EXPLAIN_MODEL` and its blind check | a spent thread still gets an explanation from the cache or the template (REQ-2716) |
| Parse | $0.1 a game day (REQ-5046) | play | `PARSE_MODEL` | «Сплети загадку» (Weave a riddle) offers sentence cards for the rest of the game day |
| Month of play | $60 from 00:00 UTC on the 1st (REQ-2718) | play | every call on the play key, read from the main database file's `llm_log` | every session to the end of the month uses the fallbacks (REQ-2720), and the Parent Room shows a notice (REQ-2722) |
| Live art | $0.5 an adventure (REQ-2712) | play | `LIVE_ART_MODEL` | off in the MVP, where the gateway refuses every call to the role |
| Art run | $40 a run (REQ-2708) | offline | offline art | the run stops and reports what it made |
| Bake-off | $25 (REQ-2710) | offline | the bake-off | the run stops and reports the candidates it finished |
| Sandbox | $20 a month from 00:00 UTC on the 1st (REQ-5052) | offline | every sandbox call, the command-line sandbox's included | sandbox model features fall back to the end of the month |

A game day ends at 04:00, and the explanation and parse buckets reset then. «Свободное перо» (Free Pen) has no bucket of its own: it spends from the current adventure's bucket, which is the open adventure, or after the finale the one that finished that game day (REQ-5054). SPC-0090 states how «Свободное перо» closes when that bucket runs out. ADR-0280 states the puzzle run's bucket, ADR-0430 the probe text run's $20 under "Keys", and ADR-0190 the `verify --live` budget.

From 00:00 UTC on the 1st to the end of the game day then in progress, the gateway treats every daily bucket on the play key, the adventure bucket included, as spent, so the fallbacks run and a calendar month in UTC holds the buckets of at most 31 game days. The daily buckets on the play key, the adventure's $1.5, the explanations' $0.3 and the parse's $0.1, sum to $1.9 a day, or $58.90 over those 31 game days, below the $60 monthly limit (REQ-5048). A group 1 check reads the play-key bucket of every role that is on from `verify/baselines.json`, multiplies each by 31 and fails as `bucket_sum_over_limit` when the sum reaches the monthly limit. The check counts a bucket set per adventure as daily, since at most one adventure starts in a game day, as SPC-0090 states. The live art bucket joins the sum when `LIVE_ART_MODEL` turns on.

When the month of play reaches $60, by the gateway's own count or because OpenRouter refuses a call on the play key with HTTP 402, the gateway refuses every later play call to the end of the month and appends `budget_month_spent` once (REQ-2720). The Parent Room shows its notice until the month ends (REQ-2722).

When any bucket runs out, a check whose cost was reserved with its Master reply runs on that reservation. The gateway answers each pending check that holds no reservation with `BudgetExhausted`, and the caller discards every generated text whose checks haven't passed, so the game shows only text that passed a safety check (REQ-2726).

### The log

Every call to an external model service writes an `llm_log` row with its cost and appends an `llm_call` event, the judge's calls included (REQ-2700). A sandbox call writes both to the sandbox's database file, as ADR-0340 states. A nightly job deletes request and response bodies after 90 days and keeps the row. The gateway reports once to the owner when an adventure's Master calls read less than half their input from the cache, and once when the body store passes 1 GB.

### Modes

The gateway reads `GATEWAY_MODE` at start and logs it. The `tower` service starts only in `play`, and the `tools` container starts the other three.

- `play`: every role spends from its own key, as above.
- `verify`, for `verify --live` and `verify --record`: every call, play roles included, spends from the offline key (REQ-2728). `VERIFY_LIVE_BUDGET_USD` caps the whole run beside the play buckets, and `verify --record` stores each reply in `tests/recordings/` under the hash of its request.
- `replay`: the gateway answers each request from `tests/recordings/` by the hash of its request body and opens no network connection. A request with no recording fails as `recording_missing`.
- `bakeoff`, which only `tools/bakeoff.ts` sets: the play roles spend from the offline key through the route play uses, and the run stops at the bake-off budget of $25 (REQ-1654, REQ-2710).

### The page on what leaves the Mac

The Parent Room's page on what leaves the Mac is a text in the content files. It names the five kinds of data that leave the Mac, matching the list under "What leaves the Mac" item for item (REQ-5044). It states that summary outcome events coarsely reflect how well the player does in a domain (REQ-2638). The server builds its list of providers when the page opens, from `PLAYER_TIER_PROVIDERS`, `CONTENT_TIER_PROVIDERS` and each provider's row in `content/providers.json`, the row the start-up check reads, so it names each provider's country as the gateway is configured (REQ-2648). It says that voice input through Safari's speech recognition goes from the iPad to Apple and never through the server. ADR-0350 states the page's list of checks on her text. A test compares the five kinds with the list under "What leaves the Mac" and the providers the page names with the configured lists.

## The contract with the local judge

ADR-0350 offers the gateway a route resolver: for each judge check, the route `local`, `hosted` or `safety`, and for a local route the judge's name, its state and its loopback address. The gateway asks the resolver for each `JudgeRequest` and sends the request on the route it returns.

The gateway offers ADR-0350:

- the `JudgeRequest` class, whose text is the same cleaned text a hosted judge reads;
- the 1500 ms judge timeout and the fallback to `SAFETY_MODEL` of "The judge route";
- an `llm_log` row for each local call, with provider `local`, the judge's name, the model file's hash, cost 0 and no key;
- the replay of local requests from `tests/recordings/`, by a hash that includes the judge's name and file hash;
- the bake-off tool's local route, which ADR-0350 runs its candidates through;
- the rows of `content/providers.json` the start-up check reads, from which the page's list of checks takes each provider's company, country and retention.

Three rules bind both parts. A local call carries no OpenRouter key and reserves nothing from any bucket. A local judge that fails ADR-0350's checks sends its checks to their standby route and never stops the server, except that a judge serving a model file other than the configured one stops it as `judge_file_mismatch`, and ADR-0350's checks replace the catalogue and zero-retention checks for a local judge. ADR-0350 opens no connection to a judge except through the gateway.

## Failure paths

| Condition | What happens |
| --- | --- |
| A provider on either tier list has no row in `content/providers.json` | `model_config_invalid`: the server doesn't start and names the provider. |
| A configured model is missing from the catalogue | `model_config_invalid`: the server doesn't start and names the role, the model and the fact. |
| A player-tier model, a Master choice or `PARSE_MODEL` has no zero-retention endpoint at a player-tier provider | `model_config_invalid`: the server doesn't start. |
| `JUDGE_CHECKS` names a check with no passing test-set record | `model_config_invalid`: the server doesn't start. |
| A configured local judge's `/props` names another model file | `judge_file_mismatch`: the server doesn't start and names both files. |
| The catalogue can't be reached at start | `models_unverified`: live calls stay off and the check retries every 10 minutes. |
| No zero-retention endpoint remains between checks | OpenRouter answers 404 to `zdr: true`, and the caller gets `ProviderFailed`. |
| A request has a field outside its class | The schema refuses it before any network call, and the caller gets `ProviderFailed`. |
| An `ExplainRequest` names no matching `thread_spent` event | The gateway refuses it, and the caller gets `ProviderFailed`. |
| A `StoryRequest` holds a digit, node id or topic name after cleaning | `egress_blocked`: nothing is sent and the caller falls back. |
| A `ParseRequest` holds a digit or numeral word after masking | `mask_incomplete`: nothing is sent, and the riddle turns into a card riddle for the same target. |
| The Master's model fails an order | OpenRouter moves it to `MASTER_FALLBACK_MODEL`; if both fail, `provider_failed` and the caller falls back. |
| The judge errs, times out after 1500 ms or gives a refused answer | `judge_fell_back`: the same question goes to `SAFETY_MODEL`. |
| The parent's Master pick fails its check | The adventure runs on `MASTER_MODEL`, and `master_pick_rejected` shows in the Parent Room. |
| A reservation would pass a bucket's limit | `BudgetExhausted`; a check reserved with its Master reply still runs, unchecked generated text is dropped, and the caller falls back. |
| A play-key call to a daily bucket between 00:00 UTC on the 1st and the end of that game day | The bucket counts as spent, and the caller falls back. |
| OpenRouter answers HTTP 402 on the play key | The month counts as spent: fallbacks to the month's end and one `budget_month_spent`. |
| OpenRouter answers HTTP 402 on the offline key | `offline_key_refused`: the call falls back and the run or the sandbox reports it. |
| An offline role is sent on the play key, or a play role on the offline key outside `verify` mode, `bakeoff` mode and a sandbox call | The gateway refuses the call. |
| A call to `LIVE_ART_MODEL` in the MVP | The gateway refuses it. |
| The play-key daily buckets times 31 reach $60 | `bucket_sum_over_limit`: the build fails. |
| A `replay` request has no recording | `recording_missing`: the request fails. |
