---
id: RES-2600
artifact: research
status: draft
revised: 2026-09-27
---

# The draft proposes that the player's maths results never leave the home, with one exception for an explanation she asks for

## Summary

The owner's draft keeps the player's results at home: the log, answers, times,
estimates, scratchpads and reports live only in SQLite on the parent's Mac.
The one exception for maths results is a detailed explanation of one task,
sent to OpenRouter only when the player spends a guiding thread on it. Story
material leaves the Mac by design: the canon, her cleaned free text, the names
she invents and summary outcome events. The Master and the planner receive
outcome events that carry no numbers, answers, node ids, topic names,
times or estimates. Before anything leaves, the server replaces real family
names, the school, the street, the city, phone numbers, addresses and e-mail
addresses with neutral labels. Every request asks OpenRouter's providers not to
collect data. The owner decided on 2026-09-27 that Jev, TypeSafe AI's decision
model, may take the safety check and similar judgements. Research decided the
same day, on the owner's instruction, that Jev runs through OpenRouter's
zero-retention route, so her cleaned text reaches TypeSafe only inside the
player tier. The player tier keeps zero-retention endpoints in any region,
with no EU-only rule. The owner decided on 2026-09-27 that GLM is good enough
for stories, so research adds Mistral, which serves `z-ai/glm-5.3` with zero
retention, to the player tier for GLM requests, pending the owner's approval. This record covers what leaves the Mac, what never does and the
residual risk the draft admits. The cost of these requests and the tests that
check them are in the daily cost and autonomous development records.

## The question

Which of the player's data may leave the parent's Mac, and in what form? The
draft assumes that a child's maths results are the sensitive part and that
story text, invented names and outcome events are safe to send. That
assumption is weaker than it looks: the player's free text can hold anything
she types, and the draft itself admits that outcome events coarsely reveal how
a day went in one domain.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles -
specification), the opening paragraph and the subsection «Приватность»
(privacy), on 2026-09-26. No alternatives were compared, because the record
carries the owner's proposal for later requirements to cite.

The draft leaves these open:

- The list of allowed OpenRouter providers, which the draft names as an open
  question. Research on 2026-09-26 proposes one; see the resolved finding on
  providers.
- Which patterns count as phone numbers, addresses and e-mail addresses in the
  local clean-up.
- Whether the local clean-up also covers the player's own real name, since the
  draft says only that the heroine is always called by her in-game nickname.
- Whether the player tier is kept to EU endpoints. Closed on 2026-09-27:
  research decided, on the owner's instruction, that it isn't (the resolved
  finding on providers below).
- What TypeSafe keeps from a Jev request, which route Jev takes, and whether
  TypeSafe accepts a child's text. Closed on 2026-09-27: research decided, on
  the owner's instruction, that Jev runs through OpenRouter's zero-retention
  route (the resolved finding on Jev below).
- Whether the owner accepts Mistral as a fifth player-tier provider for GLM
  requests. The owner decided on 2026-09-27 to add Mistral (the resolved
  finding on Mistral below).

## Findings

### The draft keeps the player's results on the parent's Mac

The log, answers, times, estimates, scratchpads and reports are stored only in
SQLite on the Mac. The only exception for these is the request for a detailed
explanation of one task.

### The draft lists what goes to OpenRouter

These leave the Mac: the canon, the story memory, scene orders, summary
outcome events (room branches, clean-row events, floor states; not the
outcomes of single tasks), the player's free text and the names she invents,
frame and picture specifications, and the bake-off prompts.

### The draft sends one task to OpenRouter only when the player spends a thread on it

An explanation request goes out only when the player spends a guiding thread.
It holds the text of one task, the engine's solution steps, her answer to that
task, the misconception if her answer matched one, and the kind and name of
her familiar. It holds no name of hers, no time, no estimates, no node ids and
no history of other tasks. The draft calls this a deliberate exception,
because a personal explanation is impossible without it. The blind check
receives only the task and the finished explanation.

### The draft keeps maths results out of outcome events

Outcome events hold no numbers, answers, node ids, topic names, times or
estimates. The Master doesn't know which skill stood behind a challenge.

### The draft admits a residual risk in outcome events

Each floor belongs to a domain, so room branches and the floor state coarsely
reflect how the day went in that domain, as a share of successes and not as
single answers. The draft reduces the risk in two ways. The flow limit holds
the success share at about 70 to 80 % on every floor, so floor states say
little about skill. The Master and the planner are forbidden to discuss the
heroine's "abilities". Node estimates and the report stay on the Mac.

### Resolved: three kinds of data leave the Mac, and the explanation request is the only exception for maths results

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's opening claim read: «Единственное исключение — запрос подробного
объяснения к одному заданию» (the only exception is the request for a
detailed explanation of one task). The same subsection then sent the player's
free text, her invented names and outcome events that coarsely reflect her
success in a domain.

I compared three options:

| Option | Better at | Why it loses or wins |
| --- | --- | --- |
| Narrow the claim to maths results, and list what else leaves | keeps the Master's free-text play (RES-1600) and tells the parent the truth | wins |
| Make the claim true: send no free text and no invented names | nothing the player writes leaves the Mac | loses: the scene cycle in RES-1600 lets her write her heroine's actions, and the Master can't react to text it never sees |
| Run a local model on the Mac for free text | free text stays home | loses: the draft picks text models for their Russian by a bake-off (RES-1600), and a model small enough for the Mac is not in that bake-off |

What leaves the Mac, in three kinds:

1. Content made without the player: the canon, scene orders, frame and
   picture specifications, the offline library prompts and the bake-off
   prompts.
2. Story material from her play, after the local clean-up: her free text, the
   names she invents, story memory and summary outcome events (room branches,
   clean rows, floor states). This is the Master's and the planner's input.
3. The maths exception: one task, its solution steps and her answer, inside an
   explanation request she paid a thread for.

Everything else stays on the Mac: the log, answers, times, estimates, node
states, scratchpads, lesson tags and reports. Kinds 2 and 3 carry what she
produced, so they go only to the stricter providers in the finding on
providers below. The parent is told the three kinds, as conclusion 11 already
asks for the residual risk.

### The draft cleans personal data locally before sending

The parent sets the real names of family members, the school, the street and
the city in the settings. The server replaces them, together with patterns of
phone numbers, addresses and e-mail addresses, with neutral labels. The
heroine is always called by her in-game nickname.

### The draft builds pictures from JSON cards only

Pictures are generated only from JSON cards. The player's text never goes
into a picture prompt directly.

### The draft asks providers not to collect data

Every request carries `provider: { data_collection: "deny" }`, and the account
forbids storage and training. The draft left the list of allowed providers
open; the next finding proposes one.

### Resolved: requests that carry the player's material go only to zero-retention endpoints at Google Vertex, Amazon Bedrock, Azure and xAI, and other requests to a wider allowlist under `data_collection: "deny"`

Proposed by research on 2026-09-26; the owner approves it with this record.

OpenRouter's routing documentation, read 2026-09-26, gives these controls.
`data_collection: "deny"` routes only to providers that don't store data to
train on it. `zdr: true` routes only to endpoints with zero data retention,
which OpenRouter defines as a provider storing the data for no time at all;
in-memory prompt caching is still allowed under it. `only` names the provider
slugs a request may use, and an account-wide allowlist in the privacy
settings is a ceiling that `only` narrows further; if no provider meets both,
the request fails with 404. The account can also enforce zero retention for
each model group. OpenRouter itself keeps request metadata, such as token
counts and latency, and keeps no prompt or response unless the account opts
in to logging.

I compared three options:

| Option | Better at | Why it loses or wins |
| --- | --- | --- |
| `data_collection: "deny"` alone, as the draft has it | the most endpoints, so the most fallbacks and the lowest price | loses: "deny" excludes training, and a provider still keeps prompts under its own retention policy, often for compliance reasons |
| `zdr: true` on every request | the strictest single rule | loses: the draft's background art model `bytedance-seed/seedream-4.5` has one endpoint, Seed, and it isn't zero-retention, while those prompts hold only canon JSON cards |
| Two tiers by what the request carries | zero retention where the player's material goes, and the wider catalogue for content made without her | wins |

The two tiers, using kinds 2 and 3 from the finding above:

- Player tier: the Master, the planner, the Explainer and every check that
  reads their input or output (`MASTER_MODEL`, `PLANNER_MODEL`,
  `EXPLAIN_MODEL`, `LIVE_CHECK_MODEL`, `SAFETY_MODEL`). Each request carries
  `provider: { zdr: true, data_collection: "deny", only: ["google-vertex",
  "amazon-bedrock", "azure", "xai"] }`, and fallbacks stay inside that list.
  A request on a GLM model names `only: ["mistral", "amazon-bedrock"]`
  instead, since 2026-09-27 (the resolved finding on Mistral below). The
  lists are the setting `PLAYER_TIER_PROVIDERS`.
- Content tier: offline art, the frame and line library, `LIVE_GEN_MODEL`
  frames, which hold placeholders and no player text, and the bake-off. Each
  request carries `data_collection: "deny"`, and the account-wide allowlist
  adds `anthropic`, `openai`, `google-ai-studio` and `seed` to the providers
  above; the list is the setting `CONTENT_TIER_PROVIDERS`.

The zero-retention endpoint list from `GET
https://openrouter.ai/api/v1/endpoints/zdr`, read 2026-09-26, covers every
player-tier model the draft names:

| Model | Zero-retention endpoints |
| --- | --- |
| `anthropic/claude-sonnet-5` | Google Vertex (us, europe, global), Amazon Bedrock (eu-west-1, us-east-1, global) |
| `anthropic/claude-opus-5.5` | Google Vertex (us, europe, global), Amazon Bedrock (eu-west-1, us-east-1, global) |
| `google/gemini-3.8-flash` | Google Vertex (global) |
| `openai/gpt-5.5` | Azure (us, eu, global) |
| `x-ai/grok-4.7` | xAI (its `zdr` endpoints) |

The owner's story candidates of 2026-09-27, from the same list read that day:

| Model | Zero-retention endpoints at the allowed providers |
| --- | --- |
| `z-ai/glm-5.3` (the Master's and the planner's default) | Mistral (`mistral/zdr`) only; none at Google Vertex, Amazon Bedrock, Azure or xAI |
| `z-ai/glm-5` (the Master's fallback) | Amazon Bedrock |
| `z-ai/glm-4.7` | Google Vertex |
| `anthropic/claude-haiku-4.5` | Google Vertex (global, us-east5, europe), Amazon Bedrock (global, us, eu-west-1) |
| `openai/gpt-6-luna` | Azure (global, us, eu) |
| `openai/gpt-5.4-mini` | Azure (global, us) |

Anthropic's and OpenAI's own endpoints and Google AI Studio are not on that
list for these models, which is why they sit in the content tier only.
Zero-retention endpoints change as models change, so the server checks the
list at start-up, beside the model check in RES-1600, and refuses to start
when a player-tier model has no zero-retention endpoint in the allowlist.

The owner's decision of 2026-09-27 changed this finding: checks with a fixed set of answers may go to Jev at TypeSafe. Research decided the same day, on the owner's instruction, that Jev runs through OpenRouter's zero-retention route, so Jev requests join the player tier with `typesafe` added to their `only` list. The resolved finding on Jev below holds it.

Two points stayed open in the draft of this finding, and the first still does. Whether Seed serves `bytedance-seed/seedream-4.5` under
`data_collection: "deny"` shows only on the first request at stage 0; if it
refuses, the art tool takes a Google image model in its place. Whether the
family wants the player tier kept to EU endpoints is a choice only the owner
can make: Claude and GPT have EU endpoints, while `google/gemini-3.8-flash`
has only a global one.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The player tier has no EU-only restriction: it keeps zero-retention endpoints wherever they are. Zero retention protects her text better than a region does, because an endpoint that keeps nothing leaves nothing to reach, while an EU endpoint that retains prompts still holds them. An EU-only rule would also drop `google/gemini-3.8-flash`, the `SAFETY_MODEL`, whose only zero-retention endpoint is global. This is a reversible choice: if the family later wants the EU only, the `only` list and a region filter change in configuration, and the safety check then needs a model with an EU zero-retention endpoint, such as Claude on Vertex or Bedrock in Europe.

### Resolved: Jev's requests form a third tier, carrying cleaned text and no maths results to TypeSafe outside OpenRouter

The next finding replaced this one on 2026-09-27: Jev runs through OpenRouter's zero-retention route and joins the player tier. This finding stays as the record of the direct route and why it lost.

The owner decided on 2026-09-27: Jev can be used to evaluate safety and similar judgements, for example the safety check on free text and sorting free-text choices. Jev receives the child's cleaned text at TypeSafe, a service outside OpenRouter with unpublished retention terms. RES-1600 lists the checks Jev may take.

What research read on 2026-09-27 about a direct request to `POST https://api.typesafe.ai/v1/systemone`:

| Point | What TypeSafe publishes |
| --- | --- |
| Training | its Privacy Policy and model page say it won't train or fine-tune on inputs |
| Retention | the Privacy Policy keeps personal data "as long as reasonably necessary"; the Data Processing Agreement names no period |
| Zero retention | offered to enterprise customers only, by contract |
| Region | hosted in the United States, on the US West Coast by Flavio Copes's account; transfers from the EU under Standard Contractual Clauses |
| Children | the Privacy Policy says TypeSafe doesn't knowingly collect personal data from children under 18 |

So the direct route fits neither existing tier: it is not zero-retention, so it can't join the player tier, and it carries her text, so the content tier's rules are too loose. It becomes a third tier, the judgement tier, with these rules:

- A request carries only the cleaned text the question needs, after the local clean-up in this record: her free text, one Master reply, or an explanation or frame with placeholders before numbers are filled in. It never carries story memory, outcome events, answers, times, estimates or any maths result.
- A request names no one: the heroine by her nickname only, as conclusion 10 already requires.
- The parent is told that a second service besides OpenRouter, TypeSafe in the United States, reads her cleaned text for checks, and that its retention terms are unpublished.

Research found an alternative the decision didn't assume. On 2026-09-27 OpenRouter's zero-retention endpoint list includes `typesafe/jev-1.13`, served by TypeSafe. Through OpenRouter under `zdr: true`, with `typesafe` added to the player tier's `only` list, Jev would join the player tier. That route is better at retention and keeps one key and one spending limit. The direct route is better at interface stability: OpenRouter serves Jev through a Decisions API at an `alpha` path, while TypeSafe's own API and SDKs are its main surface.

Three questions stay open for the owner, because the web can't settle them:

1. What TypeSafe keeps from a direct request, and for how long. Only an enterprise contract or a written answer from TypeSafe settles it.
2. Whether Jev goes through OpenRouter's zero-retention endpoint in place of the direct API.
3. Whether TypeSafe accepts a child's cleaned text on a parent's account, given its statement about children under 18.

The next finding answers all three.

### Resolved: Jev runs through OpenRouter's zero-retention route (`typesafe/jev-1.13`), not TypeSafe's direct API, and joins the player tier

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record.

The two routes were compared in the finding above. The direct API is better at interface stability, because it is TypeSafe's main surface. The OpenRouter route is better at everything this record guards: OpenRouter lists `typesafe/jev-1.13` as a zero-retention endpoint, so TypeSafe keeps nothing from the request, and the request stays on one key and one spending limit. The OpenRouter route wins, because retention is the question the direct route couldn't answer without an enterprise contract, and an alpha interface is a cost the build can test at stage 0.

What the choice settles:

1. Retention: through the zero-retention route TypeSafe keeps no prompt or response, by OpenRouter's definition of zero retention. The question of what TypeSafe keeps from a direct request no longer applies, because the game sends none.
2. Route: every Jev request goes to OpenRouter with `provider: { zdr: true, data_collection: "deny", only: ["typesafe"] }`. The account allowlist adds `typesafe`, and Jev joins the player tier, so the third tier above is no longer needed.
3. Children: only cleaned text with no personal data reaches Jev, after the local clean-up, with the heroine named by her nickname, on the parent's OpenRouter account. The game gives TypeSafe no data that identifies a child.

The gate changes. Jev reads her text in play only once it matches the fallback safety model, `google/gemini-3.8-flash` as `SAFETY_MODEL`, on the Russian test set at the stage 0 bake-off, run through the OpenRouter route. Until it passes, the fallback takes every check Jev would take (RES-1600). The earlier gate, that the owner settles TypeSafe's retention, the route and its stance on children before Jev reads her text, is replaced.

### Resolved: Mistral joins the player tier's allowlist for GLM requests only, because it serves `z-ai/glm-5.3` with zero retention

The owner decided on 2026-09-27: "GLM is good enough for stories." RES-1600 makes `z-ai/glm-5.3` the default for the Master and the planner, and both roles carry her story material, so they sit in the player tier. On `GET https://openrouter.ai/api/v1/endpoints/zdr`, read 2026-09-27, `z-ai/glm-5.3` has zero-retention endpoints at 26 providers, and none of them is Google Vertex, Amazon Bedrock, Azure or xAI. A zero-retention GLM does exist at those four, but only older models: `z-ai/glm-5` at Amazon Bedrock and `z-ai/glm-4.7` at Google Vertex.

I compared three options:

| Option | Better at | Worse at |
| --- | --- | --- |
| Keep the four providers and run `z-ai/glm-5` at Amazon Bedrock | no change to this record's allowlist | an older GLM, and no cache price listed at that endpoint, so each Master call costs about three times a cached `z-ai/glm-5.3` call (RES-2700) |
| Add Z.AI, the model's maker, whose own endpoint is zero-retention | the maker's own serving | headquarters and data centre in Singapore by OpenRouter's provider list, outside the jurisdictions of the four; widens trust to a second company for one model |
| Add Mistral, whose `mistral/zdr` endpoint serves `z-ai/glm-5.3` | zero retention, the rule this tier exists for; an EU company (France) under the GDPR with a public status page; a cache read at $0.14 a million tokens | a fifth provider; 4-bit precision (`nvfp4`), which the bake-off must test on that endpoint |

Adding Mistral wins, because zero retention is what the tier guards and Mistral offers it, and the owner's choice then costs less than the draft's default. Mistral is added for GLM requests only: a Master or planner request on a GLM model names `only: ["mistral", "amazon-bedrock"]`, so `z-ai/glm-5.3` goes to Mistral and its fallback `z-ai/glm-5` to Bedrock. Every other player-tier request keeps the four. The content tier adds `mistral` too, so the bake-off and a GLM live generation candidate can reach it. The server's start-up check confirms the `mistral/zdr` endpoint beside the others and refuses to start without it, as conclusion 15 says.

This choice widens the allowlist the owner approved on 2026-09-26. The owner decided on 2026-09-27: add Mistral to the player tier. If the owner declines Mistral, the Master and the planner run `z-ai/glm-5` at Amazon Bedrock and the player tier keeps its four providers; only `PLAYER_TIER_PROVIDERS` and `MASTER_MODEL` change, with no rebuild (RES-1600). Proposed by research on 2026-09-27; the owner approves it with this record.

### The draft never sends maths results

Times, estimates and node states, lesson tags and the answer history never go
to OpenRouter. An answer to one task leaves only inside an explanation request
the player made herself.

## Conclusions

1. The event log, answers, times, estimates, node states, scratchpads, lesson
   tags and reports must stay on the parent's Mac and never go to OpenRouter.
2. An explanation request must go out only when the player spends a guiding
   thread, and must hold only the task text, the engine's solution steps, her
   answer, the matched misconception and her familiar's kind and name.
3. An explanation request must hold no name of the player, no time, no
   estimate, no node id and no history of other tasks.
4. The blind check of an explanation must receive only the task and the
   finished explanation.
5. Outcome events sent to the Master and the planner must hold no numbers,
   answers, node ids, topic names, times or estimates.
6. The Master and the planner must not discuss the heroine's abilities.
7. Before any request leaves the Mac, the server must replace the family names,
   school, street and city the parent sets, and every phone number, address
   and e-mail address, with neutral labels.
8. Every request to OpenRouter must carry `provider: { data_collection:
   "deny" }`, and the OpenRouter account must forbid storage and training.
9. Picture prompts must be built from JSON cards and must never contain the
   player's text directly.
10. The heroine must be named by her in-game nickname in every request.
11. The record of what leaves the Mac must state that outcome events coarsely
    reflect success in a domain, so the parent knows the residual risk.
12. Only three kinds of data may leave the Mac: content made without the
    player, her cleaned story material (free text, invented names, story
    memory and summary outcome events), and the one-task explanation request;
    the parent must be told all three.
13. Every OpenRouter request carrying the player's story material or an
    explanation request must set `zdr: true` and `data_collection: "deny"`
    and must route only to Google Vertex, Amazon Bedrock, Azure or xAI, or,
    for a GLM model, to Mistral or Amazon Bedrock; a Jev request sets the
    same two fields and routes only to TypeSafe, as conclusion 19 says. (An
    earlier text sent Jev requests outside OpenRouter; the draft of this
    conclusion had no Mistral.)
14. Every other request must set `data_collection: "deny"`, and the account
    must allow no provider beyond Google Vertex, Amazon Bedrock, Azure, xAI,
    Mistral, TypeSafe (for Jev only), Anthropic, OpenAI, Google AI Studio and
    Seed. (The draft of this conclusion had no Mistral.)
15. The server must refuse to start when a player-tier model has no
    zero-retention endpoint among its allowed providers.
16. A request to Jev at TypeSafe must carry only the cleaned text its
    question needs, and never story memory, outcome events, answers, times,
    estimates or any other maths result.
17. The parent must be told that TypeSafe, in the United States, reads her
    cleaned text for checks through OpenRouter's zero-retention route and
    keeps none of it. (An earlier text told of a direct route under
    unpublished retention terms.)
18. The questions of what TypeSafe keeps, which route Jev takes and whether
    TypeSafe accepts a child's text are closed by conclusion 19, as research
    decided on 2026-09-27 on the owner's instruction. (An earlier text left
    them to the owner.)
19. Every Jev request must go through OpenRouter to `typesafe/jev-1.13` with
    `zdr: true`, `data_collection: "deny"` and `only: ["typesafe"]`, never to
    TypeSafe's direct API, and must carry only cleaned text with no personal
    data, on the parent's account.
20. Jev must not read her text in play until it matches `SAFETY_MODEL` on the
    Russian test set at the stage 0 bake-off, run through the OpenRouter
    route; until then `SAFETY_MODEL` takes its checks.
21. The player tier must have no EU-only restriction and must keep
    zero-retention endpoints in any region, as research decided on
    2026-09-27 on the owner's instruction; this is a reversible choice.
22. The Master and the planner on a GLM model must send her story material
    only to Mistral's zero-retention endpoint for `z-ai/glm-5.3` or Amazon
    Bedrock's for `z-ai/glm-5`, under `zdr: true` and `data_collection:
    "deny"`, following the owner's decision of 2026-09-27 that GLM is good
    enough for stories and the owner's decision of the same day to add
    Mistral.
23. The provider lists of both tiers must be settings,
    `PLAYER_TIER_PROVIDERS` and `CONTENT_TIER_PROVIDERS`, that change without
    a code change or a rebuild, by the owner's decision of 2026-09-27 that
    models are configurable.
24. A model the parent picks for the Master in the Parent Room must have a
    zero-retention endpoint at a player-tier provider, checked before the
    adventure starts.

## Sources

- The owner's draft «Хроники Башни — спецификация», the opening paragraph and the subsection «Приватность», read 2026-09-26; not kept in the repository - supports every finding above.
- OpenRouter, "Provider selection" (https://openrouter.ai/docs/guides/routing/provider-selection), read 2026-09-26 - the `provider` fields `data_collection`, `zdr`, `only`, `ignore` and `allow_fallbacks`, and how the account allowlist narrows a request.
- OpenRouter, "Zero Data Retention" (https://openrouter.ai/docs/guides/features/zdr), read 2026-09-26 - the meaning of zero retention, account enforcement by model group and in-memory prompt caching under it.
- OpenRouter, "Data collection" and "Provider logging" (https://openrouter.ai/docs/guides/privacy/data-collection, https://openrouter.ai/docs/guides/privacy/provider-logging), read 2026-09-26 - OpenRouter keeps metadata and no prompts unless the account opts in; providers keep their own retention policies.
- OpenRouter API, `GET https://openrouter.ai/api/v1/endpoints/zdr`, `GET https://openrouter.ai/api/v1/models/<id>/endpoints` and `GET https://openrouter.ai/api/v1/providers`, read 2026-09-26 - which endpoints of each named model are zero-retention, and each provider's slug.
- The owner's decision of 2026-09-27, relayed that day: Jev can be used to evaluate safety and similar judgements, sending the child's cleaned text to a service outside OpenRouter.
- TypeSafe AI, «Privacy Policy», https://typesafe.ai/legal/privacy-policy, read 2026-09-27 - no training on inputs, hosting in the United States, retention "as long as reasonably necessary", no knowing collection of data from children under 18.
- TypeSafe AI, «Data Processing Addendum», https://typesafe.ai/legal/data-processing, read 2026-09-27 - no fixed retention period, EU Standard Contractual Clauses, subprocessors at trust.typesafe.ai.
- TypeSafe AI, «Legal» and «Models», https://docs.typesafe.ai/legal and https://docs.typesafe.ai/models, read 2026-09-27 - zero retention for enterprise customers only; Jev not trained on customer requests.
- Flavio Copes, «A deep dive into Jev, TypeSafe's System One model», https://flaviocopes.com/jev/, read 2026-09-27 - the direct endpoint and US West Coast hosting.
- OpenRouter API, `GET https://openrouter.ai/api/v1/endpoints/zdr`, read 2026-09-27, and OpenRouter, «Jev» guide, https://openrouter.ai/docs/guides/community/jev, read 2026-09-27 - `typesafe/jev-1.13` listed as zero-retention, served through an `alpha` Decisions API.
- The owner's decisions of 2026-09-27, relayed that day: "GLM is good enough for stories"; the story candidates GLM, Claude Haiku, a Gemini Flash model and a small GPT model; "The model should be configurable".
- OpenRouter API, `GET https://openrouter.ai/api/v1/endpoints/zdr`, `GET https://openrouter.ai/api/v1/models/<id>/endpoints` for the GLM models and the story candidates, and `GET https://openrouter.ai/api/v1/providers`, read 2026-09-27 - the zero-retention endpoints of every GLM model and candidate, Mistral's `mistral/zdr` endpoint and its precision, and the headquarters of Mistral (France) and Z.AI (Singapore).
