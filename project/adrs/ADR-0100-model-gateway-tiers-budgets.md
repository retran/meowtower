---
id: ADR-0100
artifact: adr
status: approved
revised: 2026-10-10
addresses: [REQ-2602, REQ-2604, REQ-2606, REQ-2608, REQ-2612, REQ-2614, REQ-2616, REQ-2618, REQ-2620, REQ-2622, REQ-2624, REQ-2626, REQ-2628, REQ-2630, REQ-2632, REQ-2634, REQ-2638, REQ-2644, REQ-2700, REQ-2702, REQ-2704, REQ-2706, REQ-2708, REQ-2710, REQ-2712, REQ-2714, REQ-2716, REQ-2718, REQ-2720, REQ-2722, REQ-2726, REQ-2728, REQ-1642, REQ-1644, REQ-1646, REQ-1648, REQ-1650, REQ-1652, REQ-1654, REQ-1656, REQ-1686, REQ-1688, REQ-1690, REQ-1692, REQ-1694, REQ-1696]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0100. Every model call goes through one server gateway to OpenRouter, with per-role configured models, two privacy tiers fixed by role, budgets reserved before each call and a full log

## Decision

The server (ADR-0010) holds one module, the model gateway. It's the only code
in the game or its tools that opens a connection to an external model
service. Every other component hands the gateway a typed request, and the
gateway builds the HTTP call, checks it, sends it, logs it and charges it. A
lint rule forbids `fetch` to any host outside the gateway module, so a second
path to a model can't appear unnoticed.

The gateway has six parts.

1. Roles. The roles are `MASTER_MODEL`, `MASTER_FALLBACK_MODEL`,
   `PLANNER_MODEL`, `EXPLAIN_MODEL`, `LIVE_GEN_MODEL`, `LIVE_CHECK_MODEL`,
   `SAFETY_MODEL`, `JUDGE_MODEL`, `ART_JUDGE_MODEL`, `GEN_MODEL`,
   `CHECK_MODEL`, `LIVE_ART_MODEL`, `ART_MODEL_CHAR`, `ART_MODEL_KEY` and
   `ART_MODEL_BG`. Each takes its model id from `.env`, with the defaults
   RES-1600 sets: `z-ai/glm-5.3` for the Master and the planner, `z-ai/glm-5`
   as the Master's fallback and `typesafe/jev-1.13` as the judge. The code
   fixes each role's privacy tier, key, budget bucket, timeout and request
   class. Configuration can change a role's model and never its tier, because
   a setting that moved the Master to the content tier would send her text to
   a provider that keeps it. The server reads `.env` only at start, so every
   changed model passes the start-up check before a call uses it (REQ-1642,
   REQ-1646).
2. Request classes. Each class is a strict zod schema that refuses unknown
   fields, and the gateway accepts these five:
   - `StoryRequest`, for the Master and the planner, with the order ADR-0110
     defines;
   - `ExplainRequest`, with the fields REQ-2604 lists and the id of the
     `thread_spent` event that paid for it; the gateway finds that event in
     the log before sending, so an explanation leaves the Mac only after a
     thread was spent on that task (REQ-2602);
   - `BlindCheckRequest`, with the task text and the finished explanation
     only (REQ-2606);
   - `JudgeRequest`, with one cleaned text and one question typed as Noul,
     Choice or Score (REQ-2640);
   - `ContentRequest`, for the canon, frames with placeholders, bake-off
     prompts and picture specifications. The picture builder takes JSON card
     ids and never a string, so no text she wrote can reach a picture prompt
     (REQ-2632).

   These classes carry the four kinds of data REQ-2646 lets out: content
   made without the player, her story material, the age the parent set and
   the one-task explanation request. The age travels only in the
   `StoryRequest` field `readerAge`, an integer from the Parent Room setting
   (ADR-0180), because the owner decided on 2026-09-27 that the Master writes
   for that age (REQ-1840). The log, answers, times, estimates, node states,
   scratchpads, lesson tags, reports, her real name and her school group
   have no field to travel in.
3. The egress guard. Before a request with her material leaves, the guard
   replaces the family names, school, street and city the parent sets in the
   Parent Room with neutral labels such as «[имя]» and «[город]». It does
   the same for every phone number, postal address and e-mail address its
   patterns find (REQ-2612). It reads her real name from the Parent Room
   setting of REQ-3710 and cleans it the same way, so the heroine reaches a
   model only by her game name (REQ-2634, REQ-3712). The guard then scans
   every part of each `StoryRequest` except the cached canon block and the
   `readerAge` field. It refuses to send one that holds a digit, a node id or a topic name from
   the skill graph file (ADR-0050), because REQ-2608 and REQ-1604 forbid
   them. A refused call costs one library scene, and a sent one can't be
   recalled. So the order names the creepiness level and the checkpoint by
   words, and digit runs in her free text become «[число]» in the copy sent
   out. The Parent Room keeps her text as she wrote it.
4. Privacy tiers. The player tier covers the Master, the planner, the
   Explainer, `LIVE_CHECK_MODEL`, `SAFETY_MODEL` and
   `JUDGE_MODEL`. Its requests carry `provider: { zdr: true,
   data_collection: "deny", only: [...] }`, with the list from
   `PLAYER_TIER_PROVIDERS` (REQ-2616, REQ-2618). The default list is Google
   Vertex, Amazon Bedrock, Azure and xAI, with `mistral` and `amazon-bedrock`
   for a GLM model and `typesafe` for Jev (REQ-2622). Every other request is
   in the content tier. It carries `provider: { data_collection: "deny",
   only: [...] }`, where the list adds `CONTENT_TIER_PROVIDERS` to the player
   list: Anthropic, OpenAI, Google AI Studio, Seed and Mistral by default
   (REQ-2620, REQ-2624). The owner sets the OpenRouter account to forbid
   storage and training and to allow no provider outside the two lists
   (REQ-2614). Both lists are settings in `.env`, which a restart of the
   server container applies with no rebuild (REQ-2626). The gateway applies
   no region filter (REQ-2644).
5. The start-up check. Before the server listens, it reads both OpenRouter
   catalogue listings, the default one and the image-output one (RES-1600),
   and `GET /api/v1/endpoints/zdr`. The server refuses to start when a
   configured model is missing from the catalogue (REQ-1644). It also refuses
   when a player-tier model, each entry of `MASTER_MODEL_CHOICES` included,
   has no zero-retention endpoint at a provider its tier allows (REQ-2628).
   The refusal names the role, the model and the missing fact. When the
   catalogue can't be reached, the server starts with every live call off,
   and the game runs on the library and the cache. The check then retries
   every 10 minutes, a period I chose, and the first pass turns live calls
   on. Between checks, `zdr: true` on each request keeps the guard, because
   OpenRouter answers 404 when no endpoint meets it.
6. Budgets and the log. Each call first reserves its worst-case cost, which
   is the model's listed prices applied to the input tokens and to
   `max_tokens`. The gateway refuses the call when a reservation would pass a
   limit. After the reply it settles the reservation at the cost OpenRouter
   reports in the response's `usage` field. Reserving before sending keeps
   concurrent calls from passing a limit together, such as the 2 to 3 scenes
   the Master drafts ahead. A Master reply reserves together with the checks
   it needs, so the budget never pays for a reply it can't afford to check.
   Every call, the judge's included, writes a row to `llm_log`, the service
   table RES-2200 keeps outside the projections, and appends an `llm_call`
   event that points to it (REQ-2700). The row holds the role, model,
   provider, tier, key, tokens, cost, latency, outcome, request and response.
   The gateway reports once to the owner when an adventure's Master calls
   read less than half their input from the cache. RES-2700 conclusion 20
   finds that such an adventure costs about three times its estimate.

The budgets are imposed on this decision by the requirements, which carry
the owner-approved figures of RES-2700:

| Bucket | Limit | Counts | When it runs out |
| --- | --- | --- | --- |
| Adventure | $1.5 an adventure (REQ-2702) | the Master, the planner, live frames, blind checks, the judge and `SAFETY_MODEL` | live calls stop for that adventure; ADR-0110 plays the library and the pools at the usual pace, with no live frames (REQ-2714) |
| Explanations | $0.3 and 20 live generations a game day, which ends at 04:00 (REQ-2704, REQ-2706) | `EXPLAIN_MODEL` and its blind check | a spent thread still gets an explanation from the cache or a template, which ADR-0120 writes (REQ-2716) |
| Month of play | $60 from 00:00 UTC on the 1st, by the game's own count and by the play key's `limit: 60` with `limit_reset: monthly` (REQ-2718, REQ-2720) | every call on the play key, the judge's included (REQ-2724) | every session to the month's end uses the fallbacks, also after an HTTP 402 from OpenRouter; one `budget_month_spent` event makes the Parent Room show a notice until the month ends (REQ-2722) |
| Art run | $40 a run (REQ-2708) | offline art on the offline key | the run stops and reports what it made |
| Bake-off | $25 (REQ-2710) | the bake-off on the offline key | the run stops and reports the candidates it finished |
| Live art | $0.5 an adventure (REQ-2712) | `LIVE_ART_MODEL`, after the MVP | unset in the MVP, where the role is off and the gateway refuses any call to it |

Offline runs spend from a second OpenRouter key. The gateway refuses an
offline role on the play key, and a play role on the offline key outside
verify mode (REQ-2728). The owner sets the offline key's limit to the run's
budget before each run (REQ-2730).

The gateway runs in one of three modes, which the server reads from
`GATEWAY_MODE` at start and logs. The `tower` service always starts in
`play`; the `tools` container of ADR-0190 starts the other two.

- `play`: every role on its own key, as above.
- `verify`, for `verify --live` and `verify --record` (ADR-0190): every
  call, play roles included, spends from the offline key, because a live
  evaluation is an offline run and REQ-2728 keeps it off the play key's
  monthly limit. The run's own budget, `VERIFY_LIVE_BUDGET_USD`, caps the
  whole run beside the play buckets, and `verify --record` stores each reply
  in `tests/recordings/` under the hash of its request.
- `replay`, for every automated check: the gateway answers each request
  from `tests/recordings/` by the hash of its request body and opens no
  network connection, so no check calls a model (REQ-2950). A request with no
  recording fails as `recording_missing`, the state ADR-0190 names. When any bucket runs out, the gateway drops text it generated but
hasn't checked, because the checks can't be paid for. Only library text
checked offline shows then (REQ-2726).

The judge and the Master's routes follow RES-1600:

- A `JudgeRequest` goes only to `JUDGE_MODEL`, and the judge takes no other
  class, so Jev never writes text, solves a task or judges a picture
  (REQ-1686).
- The setting `JUDGE_CHECKS` names the checks moved to Jev. The server
  refuses to start when it names a check that has no passing test-set record
  for the configured judge in the `bakeoff` table (REQ-1688).
- When Jev errs or passes its timeout of 1500 ms, the gateway sends the same
  question to `SAFETY_MODEL` (REQ-1690). I chose 1500 ms as three times the
  500 ms upper latency RES-1600 cites.
- Every Master request names `[MASTER_MODEL, MASTER_FALLBACK_MODEL]` in
  OpenRouter's `models` list. A failure at Mistral then moves the same
  request to `z-ai/glm-5` at Amazon Bedrock before ADR-0110 retries or
  falls back (REQ-1692).

The bake-off tool, `tools/bakeoff.ts`, sends every candidate through the
gateway with the tier and provider list play would use (REQ-1654). It runs on
the offline key under the $25 bucket. It sends the 12 prompts of RES-1600 to
every candidate, the owner's five of 2026-09-27 among them (REQ-1652). It
stores anonymised answers in the `bakeoff` table for the parent's blind
scoring (REQ-1648), and it excludes a candidate with any safety failure
(REQ-1650). A model enters `.env` for play only when an owner-approved
decision record in `project/adrs/` names it (REQ-1656). That record's list
of approved Master models becomes `MASTER_MODEL_CHOICES`.

The parent picks the Master's model in the Parent Room from
`MASTER_MODEL_CHOICES` alone (REQ-1694). The pick applies at the next
adventure, so one adventure keeps one voice and one cache (REQ-1696). Before
that adventure starts, the gateway checks the pick against the catalogue and
the zero-retention list. On a failure it starts the adventure on
`MASTER_MODEL` and appends a `master_pick_rejected` event, which the Parent
Room shows (REQ-2630).

The Parent Room's page on what leaves the Mac is a text in the content files.
It names the four kinds of data, the age among them, and states that summary outcome events
coarsely reflect how well she does in a domain (REQ-2636, REQ-2638). It names
TypeSafe, in the United States, as the company that reads her cleaned text
for safety checks and keeps none of it (REQ-2642). A test compares the
providers and the judge company the page names with the defaults in the code,
so the page can't drift from the routes.

Each failure state has one audience. The player sees none of them, on
purpose: each ends in the library, the cache or a template, and the story
reads the same, so a failure never reaches her as a verdict.

| State | Next step | Audience |
| --- | --- | --- |
| `model_config_invalid`: a model is missing or has no zero-retention endpoint | the server doesn't start; the message names the role, the model and the fix | the owner |
| `models_unverified`: the catalogue can't be reached at start | fallback-only play; the check retries every 10 minutes | the owner |
| `egress_blocked`: the guard found a digit, a node id or a topic name | the request isn't sent and the caller falls back; reported once per cause | the owner |
| `provider_failed`: OpenRouter or both routed models failed | the caller falls back | the owner, in `llm_log` |
| `judge_fell_back`: Jev erred or timed out | the same question goes to `SAFETY_MODEL` | the owner, in `llm_log` |
| `master_pick_rejected` | the adventure runs on `MASTER_MODEL`; the parent can pick again | the parent |
| `budget_adventure_spent`, `budget_explain_spent` | fallbacks for the rest of the adventure or game day | the parent, in the day's cost line |
| `budget_month_spent` | fallbacks to the month's end and a notice | the parent |

The security boundary is the parent's Mac. It protects her maths results and
the text she writes. The threats, most likely first:

1. A code change puts a maths field into a story request. The strict schemas
   and the egress guard stop it.
2. A provider keeps or trains on her text. `zdr: true` and the start-up check
   stop it.
3. The owner edits `.env` and routes a model badly. The fixed tiers and the
   start-up check stop it.
4. OpenRouter itself reads the traffic. It keeps metadata and no prompts
   while the account's logging stays off (RES-2600).
5. Someone steals a key from `.env`. The key limits cap the loss at $60 a
   month on play and at the run's budget offline.

Voice input lies outside this boundary. The owner decided on 2026-09-27:
voice input may use Safari's speech recognition, which sends her voice to
Apple. That audio goes from the iPad's own system to Apple, never through
the server, so the gateway neither sees nor cleans it, and the Parent Room's
page on what leaves the Mac says so.

Once this is accepted, the server can make every live call the design needs,
inside its budgets and privacy tiers. The game still runs with the gateway
switched off, because every caller has a fallback. The bake-off screen, the
Master pick and the notices need ADR-0180's Parent Room. The explanation
template needs ADR-0120. Until those land, the gateway records the events
they read, and no screen shows them.

## Why

RES-2600 settles what can leave the Mac and to which providers, and RES-2700
settles the budgets. The question left to design is where those rules live
so that they hold every time. A single gateway puts them in one place a test can
reach. With separate clients, each caller would repeat the tiers, the
clean-up and the budget count. The first caller to forget one would leak her
text or overspend, and no test would fail.

The two tiers follow RES-2600's resolved finding on providers. `zdr: true` on
every request would drop the Seed background model, whose one endpoint isn't
zero-retention. `data_collection: "deny"` alone lets a provider keep prompts
for its own compliance reasons. Fixing the tier by role in code keeps the
owner's decision of 2026-09-27 that models are configurable (RES-1600), and
it stops a configuration edit from weakening a tier.

RES-2600 leaves open which patterns count as phones, addresses and e-mail
addresses, and whether her own name is cleaned. I chose to clean her real
name as one of the parent's names, because REQ-2634 can't hold otherwise. The
exact patterns go to the specification, with a test set of Dutch and Russian
phone numbers, Dutch postcodes and e-mail addresses.

The reservation answers the question of concurrency. The Master drafts
scenes ahead in parallel, so a check after each call would let several calls
pass the limit together. The monthly count of $60 sits above the $55.80 the
daily caps allow in a 31-day month (RES-2700). It fires only when something
bypasses the daily caps, such as a bug that repeats calls.

The rule for an unreachable catalogue is mine. REQ-1644 and REQ-2628 require
a refusal when a model is missing, and an unreachable catalogue proves
nothing missing. Refusing to start then would cost her the game over a
network fault.

The strongest objection is that REQ-1644 and REQ-2628 tie her daily game to
a third party's listing. If Mistral drops its zero-retention endpoint for
`z-ai/glm-5.3` overnight, the next start refuses. The morning's adventure is
lost, although the library could have carried it. I keep the refusal because
the requirements impose it. A server that started without the check would
route her text by `zdr: true` alone, to whichever endpoint happened to
remain. Two facts soften it. The server starts only after a Mac restart or an
`.env` change, so a running server keeps playing. The refusal names a
one-line fix: another model from `MASTER_MODEL_CHOICES`, or the Bedrock
fallback. Only the owner can trade this availability for a fallback-only
start, so I list it for the owner under What this does not settle.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: each component calls OpenRouter with its own settings | the least code up front; each caller tunes its own call | each caller repeats the tiers, the clean-up and the budget count, so the rules hold only where somebody remembered them; REQ-2700's full log needs one place anyway |
| Call each provider's own API (Vertex, Bedrock, Azure, xAI, Mistral) | no intermediary sees request metadata; one company fewer in the chain | five SDKs, five keys and five bills with no shared spending limit, so REQ-2718's key limit can't exist; the bake-off would need an adapter per provider; OpenRouter keeps metadata only (RES-2600) |
| A proxy such as LiteLLM in its own container | budgets, logging and fallbacks already built | its budget and log live outside the event log of ADR-0020; the tier-by-role rule and the egress guard would still be ours to write; one more service to keep running on the Mac |
| One tier: `zdr: true` on every request | the simplest rule; no request ever goes to a provider that keeps it | RES-2600 found it drops the Seed background model and the art plan of RES-2800 with it |
| A local model on the Mac for the player tier | her text stays at home | RES-2600 found no Mac-sized model in the Russian bake-off, and the owner chose GLM for the story on 2026-09-27 |

## What it costs

The gateway is the largest piece of plumbing in the server. It needs five
request schemas, the guard, the reservations, the start-up check and the log,
all before the Master writes a line. Every new use of a model pays for a
schema and a test before it ships, and that friction is deliberate.

The owner does more work. They set the OpenRouter account's allowlist and
privacy switches by hand at stage 0. They set the offline key's limit before
each offline run, and they fix `.env` when the start-up check refuses. The
parent scores the bake-off blind: about 12 prompts for each candidate, once at
stage 0 and again at each rerun.

If nobody attends for a month, play goes on. The monthly count stops live
calls at $60, the game runs on fallbacks, and the only table that grows is
`llm_log`.

`llm_log` stores whole requests and responses, and each Master row would
repeat a cached canon block of about 30,000 tokens (RES-2700). I chose to
store the canon block once by its hash. A nightly job deletes request and
response bodies after 90 days and keeps the metadata row, which the cost
count needs. The deletion is safe, because the `scene_shown` events keep the
text she saw. The body store reports once to the owner when it passes 1 GB, a
ceiling I chose.

The egress guard also refuses some harmless text, such as a topic word she
used in a story sense. Each refusal costs one library scene where a live one
would have played.

## What would reverse it

- OpenRouter stops offering `zdr`, `only` or key limits, or lists no
  zero-retention endpoint for any approved Master candidate. Direct provider
  APIs are then the only route that keeps REQ-2616.
- The first month's `llm_log` shows reservations refusing more than 5% of the
  calls that would have fitted by their settled cost. Reservations then move
  from the worst case to a percentile of past costs.
- The owner decides the Mac can run a model for the player tier. The local
  route then replaces the player tier for that role.

## Consequences

- ADR-0110, ADR-0120 and ADR-0130 call models only through the gateway's
  request classes. Each gets a typed `BudgetExhausted` or `ProviderFailed`
  result to fall back on.
- The skill graph file of ADR-0050 gains the list of topic names, in Russian
  and English, that the egress guard reads.
- The Parent Room of ADR-0180 gains the names to clean, the Master pick, the
  bake-off scoring screen, the cost line and the month's notice. Each reads
  an event this decision defines.
- `.env` gains every role variable, `MASTER_MODEL_CHOICES`, `JUDGE_CHECKS`,
  `PLAYER_TIER_PROVIDERS`, `CONTENT_TIER_PROVIDERS`, the budget variables and
  two keys, `OPENROUTER_PLAY_KEY` and `OPENROUTER_OFFLINE_KEY`.
- The verify command of ADR-0190 runs the lint rule against `fetch` outside
  the gateway, the schema tests and the disclosure test.
- ADR-0190's verify command runs the automated checks in `replay` mode and
  `verify --live` and `verify --record` in `verify` mode, so no check calls a
  model and no evaluation spends from the play key.
- The budgets in the table above stand in the Baselines table of ADR-0190
  with the judge's 1500 ms timeout, the 10-minute catalogue retry and the
  1 GB ceiling on `llm_log` bodies.

## How I will know it was realised

1. A test sends each request class with an extra field and with each field
   REQ-1604, REQ-2604 and REQ-2640 forbid. The gateway refuses every one
   before any network call.
2. A test with a mocked OpenRouter records every request body of a full
   simulated adventure. Every player-tier request has `zdr: true` and the
   player list, and every request has `data_collection: "deny"`. None of the dynamic
   parts holds a digit, a node id, a topic name or a name the parent set.
3. A test starts the server with a missing model and then with a player-tier
   model that lacks a zero-retention endpoint. It refuses both times and
   names the role. With the catalogue unreachable, it starts with live calls
   off.
4. A test fires 20 concurrent Master calls at a nearly spent adventure
   bucket, and the settled spend stays at or under $1.5.
5. A test replays a month of calls past $60 and a mocked HTTP 402. The
   gateway refuses every later call, appends one `budget_month_spent` event,
   and the game plays on fallbacks.
6. A test sends an `ExplainRequest` without a matching `thread_spent` event,
   and the gateway refuses it.
7. In the first week of play, each day's sum of `llm_log` costs is within 5%
   of the usage `GET /api/v1/key` reports for the play key.
8. A test times out the mocked judge, and the same question with the same
   text reaches `SAFETY_MODEL`.
9. A test in `replay` mode plays a simulated adventure with the network
   blocked, opens no connection, and fails one request whose recording was
   deleted as `recording_missing`.
10. A test in `verify` mode records every call's key and finds the offline
    key on all of them, play roles included, and the play key on none; the
    `tower` service refuses to start in any mode but `play`.
11. A test sends a `StoryRequest` with `readerAge` set and her real name in
    the free text; the age passes, the name arrives as «[имя]», and a digit
    anywhere else is refused.

## What this does not settle

- REQ-2610, that the Master's and the planner's text doesn't discuss the
  heroine's abilities, is a rule on generated text, and ADR-0110 settles it.
- What the Master's order holds, how replies are checked and what the library
  plays when a budget runs out: ADR-0110. It shares REQ-2714 and REQ-2726
  with this decision.
- How explanations are written, checked and cached, and what the template
  says: ADR-0120.
- How the Parent Room shows the bake-off, the pick, the costs and the
  notices: ADR-0180.
- The exact clean-up patterns for phones, addresses and e-mail addresses: the
  specification, from the test set named under Why.
- Whether Seed serves `bytedance-seed/seedream-4.5` under
  `data_collection: "deny"`. RES-2600 leaves it to the first request at stage
  0, and ADR-0170 takes a Google image model if Seed refuses.
- The web push for a serious signal and its keys: ADR-0110 and the stage
  after the MVP.

For the owner: should a refused start under REQ-1644 and REQ-2628 become a
fallback-only start that tells the owner? That would keep the morning's game
when a provider delists an endpoint. The approved requirements say refuse,
and this decision follows them.

A premortem, written as though it had already happened. In the second month
the adventure budget ran out by the third floor every day. Mistral's endpoint
had stopped honouring the explicit cache mark, so every Master call paid for
the whole canon block, about three times the estimate (RES-2700 conclusion
20). The game fell back to the library quietly, as designed. For two weeks
the parent saw only a cost line and the player saw a story, so the cause went
unseen. The report on cache reads in part 6 of the decision now catches this
on the first such adventure.

Amended by ADR-0210, ADR-0220, ADR-0230, ADR-0280, ADR-0340 and ADR-0350, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0430, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0460, approved on 2026-09-29, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended on 2026-10-10: this record no longer addresses 6 requirements that were superseded, because a decision cannot realise a requirement that is no longer in force: REQ-2646 (superseded by REQ-5042, which ADR-0210 addresses); REQ-2636 (superseded by REQ-5044, which ADR-0210 addresses); REQ-2640 (superseded by REQ-5212, which ADR-0230 addresses); REQ-2642 (superseded by REQ-2648, which ADR-0350, ADR-0370 addresses); REQ-2724 (superseded by REQ-2732, which ADR-0350 addresses); REQ-2730 (superseded by REQ-6412, which ADR-0360, ADR-0460 addresses).
