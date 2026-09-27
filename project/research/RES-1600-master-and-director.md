---
id: RES-1600
artifact: research
status: draft
revised: 2026-09-27
---

# The draft proposes that code, the Director, decides what happens and an LLM, the Master, only tells it, inside a year-long campaign

## Summary

The owner's draft proposes a campaign that runs a school year, where each daily session is a new adventure told by one LLM narrator, the Master. The Director, which is code, decides what happens: which node to test, how many tasks, every outcome, rest stops and rewards. The Master decides how it looks, and never sees numbers, answers, verdicts, node identifiers or response times. The Master answers each scene order in strict JSON, every reply is checked before it shows, and the Director applies only a closed set of effects. A blind bake-off at stage 0 picks the text models, with the parent scoring anonymised answers. The draft defers items and creatures made on the fly until after the MVP, and lets the player name her creatures and familiars. This record covers the Director and the Master, the campaign structure, the models and the bake-off, the scene cycle, how a trial is introduced, how replies show, memory, free-text effects, generated items and naming. It leaves trial outcome rules to RES-1700, safety to RES-1800, the world and tone to RES-1500 and the world bible to the canon records.

## The question

How can an LLM tell a rich, reactive story around a maths diagnostic without corrupting the measurement or the child's experience? The draft assumes the split is clean: the Director knows everything and writes nothing, the Master writes everything and knows nothing about the maths. That split holds only while nothing leaks through the order, the plan or free text, and the draft's many checks show how much work keeping it takes. The draft also assumes an LLM's Russian is good enough for a primary-school reader, which is why it adds a blind bake-off.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles: specification), sections «Кампания и ИИ-Мастер» (Campaign and the AI Master), «Директор и Мастер», «Кампания, сезоны, сессии», «Модели», «Бейк-офф моделей (этап 0)», «Цикл сцены», «Как Мастер вводит испытание», «Показ ответов Мастера», «Память и канон», «Следствия свободного текста», «Предметы и существа, созданные на ходу» and «Имена придумывает игрок», on 2026-09-26, with its opening paragraph and «Текущий объём (MVP)» (Current scope, MVP) summary for context.

The draft leaves these points open:

- the model identifiers, which the draft calls intent and not checked strings; research checked them against the OpenRouter catalogue on 2026-09-26 (see the resolved finding on model identifiers);
- the limit on cosmetic titles the Master may grant;
- the contents of the fallback pool shown after 12 seconds without a reply;
- how `heroStats` are derived from the heroine's characteristics;
- who writes the second-year canon, named only as "a person", and the value of `LIVE_ART_BUDGET_USD`;
- whether the owner accepts a GLM route for the Master and the planner at Mistral, outside the four providers the player tier first allowed; open since 2026-09-27 (the resolved finding on GLM);
- which small GPT model the owner meant by "gpt moon": the owner confirmed on 2026-09-27 that it is `openai/gpt-6-luna`;
- how the Director decides "it is time for a reward".

## Findings

### The draft splits the work: the Director decides what, the Master decides how

| | Director (code) | Master (LLM) |
| --- | --- | --- |
| Decides | what happens: which node and subtype to test, how many tasks, each trial's outcome and the room branch, the floor state, when to rest, the eye exercise, the offer to stop, which rewards | how it looks: places, characters, dialogue, reactions to the player's actions, lead-ins to trials, both branches (success and other path), descriptions of new items and creatures |
| Sees | everything: node estimates, answers, time | the canon, story memory, the session plan, the scene order, summary outcome events (room branch `success` / `alt`, the clean-row event, floor state), the creepiness level |
| Cannot | write story text | write task statements; see numbers, answers, verdicts and outcomes of single tasks, node identifiers, domains as maths topics, response times or node states; grant rewards beyond the order; change the canon |
| Link | sends the Master scene "orders" | answers in strict JSON; the Director applies only allowed effects |

The player writes or dictates her heroine's actions, as she is used to writing stories in a chat with an AI. Diagnostics sit inside the adventure as trials; their outcomes change the story, but the Master knows nothing about maths.

### The draft structures the campaign as a school year of four seasons, chapters and daily adventures

- Campaign: the school year, September to August. It holds the canon, the main mystery with a set answer and 10 checkpoints, and the arcs of Guardians and allies.
- Season: four canon seasons of three months each: Autumn «Узел» (Knot), Winter «Ревизия» (Audit), Spring «Изнанка» (the Underside), Summer «Последний ряд» (Last row). Each has its own season figure and finale. The Director gives the Master a checkpoint when its month arrives, by the campaign calendar with a start date the parent sets. Secrets of later checkpoints never enter the Master's prompt.
- Chapter: about two weeks, one riddle within a season. Its finale is an Ascent (a check run): in the story the Tower re-knits entirely, and the heroine climbs through all floors to the Observatory. The chapter finale gives a title and a special reward, not a rank.
- Adventure: usually a day; if unfinished it continues the next day from the same place. It brings a new goal, new places inside floors and a new opponent.

Ascents: deferred until after the MVP by the draft. In the MVP a chapter ends with a story finale inside an ordinary adventure, which gives the chapter title and its main reward.

### The draft gives the chapter finale a triumph variant chosen by floor states

The chapter finale has a triumph variant with a special title, for example «Та, Что Распутала Главу Начисто» (She Who Untangled the Chapter Cleanly) and similar ones from the canon. It is chosen by the story states of floors over the chapter's daily sessions, not by the Ascent's anchor tasks. Starting thresholds: at least half of floor-days in triumph or victory, and at least 0.3 in triumph; simulation calibrates them. The draft had a third in triumph; RES-1700 holds why research lowered it on 2026-09-26. The ordinary finale is as festive and gives the same main reward.

### Resolved: the chapter finale takes its triumph variant when at least half of floor-days are triumph or victory and at least 0.3 are triumph

Proposed by research on 2026-09-26; the owner approves it with this record. A simulation of the draft's own assumptions gave the triumph variant in about a third of chapters at a third in triumph, and about half at 0.3, against the draft's target of about half. The share swings widely as her level moves, so the first-month review checks it first. RES-1700 holds the simulation and the reasons.

### The draft continues play after the year's finale without new checkpoints

Diagnostics run to the end of group 8, longer than one campaign. After checkpoint 10 the game goes on: daily adventures, Ascents, familiars, levels and quests continue in the world of the chosen ending. `PLANNER_MODEL` writes the chapters, with no new checkpoints or ranks: rank S stays, and titles and the collection grow. A person writes the second-year canon (`content/canon.y2.ru.md`) before September. The engine keeps `campaignId` in `progress` and `story`, and changing the campaign leaves the diagnostic tables alone.

### The draft gives each adventure a fixed arc

«В прошлый раз…» (Last time...) -> the morning System window about the night's re-knitting -> a hook -> the path through the day's route floors (3-4 in the MVP) with scenes and trials -> rest stops -> a climax -> «Сегодняшний ряд связан» (Today's row is knitted) with a cliffhanger and the floors' story results (triumphs, victories, cunning bypasses, in words, without numbers).

### The draft has a planner model write a summary and the next plan after each session

After a session `PLANNER_MODEL` writes a short summary of what was played and a plan for the next adventure: 5-7 story beats, an opponent, arc development and choice points. The Master improvises within the plan and leaves it if the player leads the story elsewhere.

- Planner inputs: the canon without secrets of future checkpoints; story memory (past session summaries, facts, relationships, running jokes); the session's outcome events (room branches, streaks, floor states triumph / victory / cunning bypass, secrets opened and missed); the player's cleaned free text and her choices; the current checkpoint and the calendar; the creepiness level.
- Never given to the planner: node states and estimates, node identifiers, numbers, answers, response times, lesson tags.
- What the plan reflects: a floor with a triumph gets a follow-up (the Guardian remembers, the next secret opens); a floor with a cunning bypass gets its own funny thread («Страж до сих пор не понимает, как она прошла», The Guardian still doesn't understand how she got through); missed secrets are queued and return elsewhere within 7 sessions.

### The draft keeps one model table, swappable in `.env` and checked at start-up

One model table serves the whole system, and models change in `.env` without code edits. The identifiers are intent, not checked strings. At stage 0 an agent checks each against `GET https://openrouter.ai/api/v1/models`; when one is missing it takes the nearest model of the same class and records the substitute as a draft decision record in `project/adrs/` (the draft named `docs/decisions.md`; RES-2900 holds the reason for the change). At start-up the server checks that every model in `.env` exists and stops with a clear error. Since 2026-09-27 the check also covers `MASTER_FALLBACK_MODEL` and every model in `MASTER_MODEL_CHOICES`, and confirms that `z-ai/glm-5.3` has its zero-retention endpoint at Mistral and `z-ai/glm-5` at Amazon Bedrock (the resolved finding on GLM below). `MASTER_MODEL`, `PLANNER_MODEL` and `LIVE_GEN_MODEL` are defaults until the bake-off, which makes the final choice.

| Variable | Model | Purpose |
| --- | --- | --- |
| `MASTER_MODEL` | `z-ai/glm-5.3` through Mistral's zero-retention endpoint (the draft had `anthropic/claude-sonnet-5`; changed by the owner's decision of 2026-09-27 that GLM is good enough for stories) | the Master's story, reactions to free text, lead-ins |
| `MASTER_FALLBACK_MODEL` | `z-ai/glm-5` through Amazon Bedrock's zero-retention endpoint (added on 2026-09-27; the draft had no such row) | the Master's second model when the first route fails, sent in the same request |
| `PLANNER_MODEL` | `z-ai/glm-5.3` through Mistral's zero-retention endpoint (the draft had `anthropic/claude-opus-5.5`; changed on 2026-09-27 under the same decision) | session summary, next plan, chapter and season finales |
| `LIVE_GEN_MODEL` | `anthropic/claude-sonnet-5` | live word-problem frames (with placeholders) |
| `LIVE_CHECK_MODEL` | `google/gemini-3.8-flash` | blind solving of live frames and blind checking of explanations |
| `EXPLAIN_MODEL` | `anthropic/claude-sonnet-5` | detailed explanations in a familiar's voice from the engine's steps (placeholders in place of numbers) |
| `SAFETY_MODEL` | `google/gemini-3.8-flash` | content checks and alarm signals; since the owner's decision of 2026-09-27, the fallback for `JUDGE_MODEL` and the checks Jev doesn't pass |
| `JUDGE_MODEL` | `typesafe/jev-1.13` through OpenRouter's zero-retention route (an earlier text had `jev-1.13.0` on TypeSafe's direct API) | checks with a fixed set of answers: safety, shaming, creepiness level, signal level, sorting free text into a scene's options (added by the owner's decision of 2026-09-27; the draft had no such row) |
| `LIVE_ART_MODEL` | `google/gemini-3.1-flash-image` | pictures of new items and familiars during play (later) |
| `ART_JUDGE_MODEL` | `google/gemini-3.8-flash` | scoring pictures against a checklist |
| `GEN_MODEL` | `anthropic/claude-opus-5.5` | offline: frame library, line pool |
| `CHECK_MODEL` | `openai/gpt-5.5` | offline: blind check of the library |
| `ART_MODEL_CHAR` | `google/gemini-3.1-flash-image` | offline: characters, outfits, items from a reference |
| `ART_MODEL_KEY` | `google/gemini-3-pro-image` | offline: key scenes, Diary pages with lettering |
| `ART_MODEL_BG` | `bytedance-seed/seedream-4.5` | offline: floor backgrounds in volume |

Research checked every identifier in this table against the OpenRouter catalogue on 2026-09-26, and each one exists; the resolved finding below gives the details. The GLM identifiers were checked on 2026-09-27; the resolved finding on GLM below gives their endpoints and prices. `JUDGE_MODEL` reaches TypeSafe through OpenRouter's zero-retention route, as research decided on 2026-09-27, so the start-up check finds it in the OpenRouter catalogue and in the zero-retention endpoint list like every other player-tier model. An earlier text sent it to TypeSafe's direct API and checked it through TypeSafe's `GET /v1/models`.

### The draft picks text models by a blind bake-off on the game's own prompts at stage 0

Russian text quality matters most for enjoying the story, so text models are chosen by blind comparison on the game's own tasks, not by reputation.

- Script: `tools/bakeoff.ts` (`docker compose run --rm tools bakeoff`) runs the same 12 prompts (`content/bakeoff/prompts.ru.json`, with the canon in the system prompt) through every candidate:
  - 3 Master scenes of different tone: a cosy floor scene, a funny scene with a Guardian, a dreamcore scene at creepiness level 1;
  - 3 System lines: clean untangling, clean row, other path after «Не знаю» (I don't know);
  - 3 familiar dialogues at the campfire, one for each starting familiar;
  - 3 word-problem frames with placeholders (a chain, "price x quantity -> change", motion).
- Candidates, each checked against `GET https://openrouter.ai/api/v1/models`, a missing one skipped and its nearest same-class substitute recorded as a draft decision record in `project/adrs/`: the owner's four story candidates of 2026-09-27, `z-ai/glm-5.3` (the default), `anthropic/claude-haiku-4.5`, `google/gemini-3.8-flash` and `openai/gpt-6-luna`, plus `z-ai/glm-5` (the fallback), then the draft's list: `anthropic/claude-opus-5.5`, `anthropic/claude-sonnet-5`, `anthropic/claude-fable-5.1` (expensive, a `PLANNER_MODEL` candidate), `openai/gpt-5.5`, `google/gemini-3.8-flash` (the draft wrote `google/gemini-3.5-flash`; see the resolved finding below) and a Gemini Pro class model if in the catalogue, `x-ai/grok-4.7`, plus 1-2 open models strong in Russian (for example the Qwen or DeepSeek families) if in the catalogue.
- Automatic checks on every answer: spelling and grammar by a Russian spellchecker (LanguageTool with Russian rules in a separate container `languagetool` in the `tools` profile; fallback hunspell-ru), as hits per 100 words; the numeral check (except frames, which hold only placeholders); canon names; the shame stop list; `SAFETY_MODEL`; for frames, blind solving by `LIVE_CHECK_MODEL` on three number sets; latency (time to first token and total, p50/p95 over 3 repeats) and cost from the OpenRouter response.
- Blind human scoring: answers are anonymised (random letters, shuffled order, the same formatting) and appear in the Parent Room on a «Бейк-офф» (Bake-off) screen. The parent scores each 1-5 on five criteria: literacy, natural Russian, humour, fit to the canon, safety. Optionally the player marks scenes and dialogues on the iPad as «нравится / не очень» (like / not really); frames are never shown to her. The anonymisation key is revealed only after all scores are saved.

### The draft sets a selection rule per text model and excludes any safety failure

The report is `artifacts/bakeoff-report.html`.

| Variable | Rule |
| --- | --- |
| `MASTER_MODEL` | best mean parent score over scenes, System lines and dialogues, among models with p95 time to first token <= 2 s and a full scene <= 6 s |
| `PLANNER_MODEL` | best score over scenes and canon fit, with no latency limit; cost breaks ties |
| `LIVE_GEN_MODEL` | best on frames among models that passed every blind solve, with the fewest spelling hits |

A model with any safety failure is excluded. The choice and the result table go into a decision record in `project/adrs/`, which the owner approves, and into `.env` (the draft named `docs/decisions.md`; RES-2900 holds the reason for the change). The parent may rerun the bake-off, for example when new models come out.

Each candidate runs through the route play would use: a player-tier role's candidate under `zdr: true` and the player tier's `only` list (RES-2600). One model can differ between endpoints, for example Mistral serves `z-ai/glm-5.3` at 4-bit precision (`nvfp4`), so a score measured on another endpoint says little about the one she would read.

### Resolved: GLM writes the story by default, `z-ai/glm-5.3` through Mistral's zero-retention endpoint for the Master and the planner, until the bake-off confirms or overturns it

The owner decided on 2026-09-27: "GLM is good enough for stories." GLM is the model family of Zhipu AI, trading as Z.ai. The owner also decided on 2026-09-27 that the story candidates to try, beside GLM, are Claude Haiku, a Gemini Flash model and a small GPT model. The owner wrote "gpt moon". I read it as `openai/gpt-6-luna`, because «луна» and Latin "luna" mean moon, and GPT Luna is the name of OpenAI's small, fast tier in the catalogue ("positioned below GPT-6 Sol"). The message that relayed the decision read it as the current GPT mini, whose newest member is `openai/gpt-5.4-mini`. Only the owner can say which was meant, so the bake-off runs both, at a cost of cents.

The GLM models OpenRouter serves, from `GET https://openrouter.ai/api/v1/models` read on 2026-09-27, filtered to ids starting `z-ai/`, with the price a million tokens at the endpoint the game would use:

| Model | Listed | Context, tokens | Zero-retention endpoints on 2026-09-27 | Price, input and output |
| --- | --- | --- | --- | --- |
| `z-ai/glm-5.3` | 2026-08-18 | 1,310,720 | 26 providers, among them Mistral (`mistral/zdr`), Z.AI, Together, Fireworks and BaseTen; none at Google Vertex, Amazon Bedrock, Azure or xAI | $1.40 and $4.40 at Mistral, cache read $0.14 |
| `z-ai/glm-5.3-prime` | 2026-09-23 | 1,000,000 | none (one endpoint, Alibaba) | $2.80 and $8.80 |
| `z-ai/glm-5.3-flash`, `z-ai/glm-5.3-flashx` | 2026-08-26 and 2026-09-18 | about 1,000,000 | many, none at the four allowed providers | $0.15 and $0.50 at most |
| `z-ai/glm-5.2` | 2026-06-16 | 1,048,576 | 16 providers, Mistral among them; none at the four | $1.40 and $4.40 at Mistral |
| `z-ai/glm-5.1`, `z-ai/glm-5-turbo` | 2026-04-07 and 2026-03-15 | about 200,000 | several, none at the four | $1.05 to $1.40 and $3.50 to $4.40 |
| `z-ai/glm-5` | 2026-02-11 | 204,800 | Amazon Bedrock, Z.AI, Novita, SiliconFlow, Venice | $1.00 and $3.20 at Bedrock, no cache price listed |
| `z-ai/glm-4.7` | 2025-12-22 | 204,800 | Google Vertex, Z.AI, DeepInfra, Novita, Venice | $0.60 and $2.20 at Vertex, no cache price listed |
| `z-ai/glm-4.6`, `-4.6v`, `-4.5`, `-4.5v`, `-4.5-air`, `-4.7-flash`, `-5v-turbo` | 2025 to 2026 | 65,536 to 204,800 | Z.AI and smaller hosts, none at the four | $0.06 to $1.20 input |

So a zero-retention GLM endpoint exists at an allowed provider, but only for older models: `z-ai/glm-5` at Amazon Bedrock and `z-ai/glm-4.7` at Google Vertex. The newest GLM, `z-ai/glm-5.3`, has zero retention only at providers outside the allowlist.

I found no published evaluation of GLM's Russian prose. Z.ai's model card for GLM-5 tags Chinese and English only. MERA, the Russian benchmark, lists GLM-5.1 only on its code tasks (overall 0.525, submitted 2026-04-17). On EQ-Bench Creative Writing v3, which is in English, GLM-5.2 has the best open-weight Elo, 1745.8, fifteenth overall, and GLM-5.3 isn't measured yet (Featherless, 2026-09-17). A Russian review on Pikabu (2026-07-10) repeats the vendor's claim that GLM-5.1 improved in languages other than English and gives no Russian test. So the evidence says GLM writes strong English stories and says nothing tested about Russian, which is what the blind bake-off measures.

The story candidates the owner named, with their zero-retention status on 2026-09-27 and the price a million tokens at an allowed zero-retention endpoint:

| Candidate | Listed | Zero-retention at an allowed provider | Price, input and output | Cache read |
| --- | --- | --- | --- | --- |
| `z-ai/glm-5.3` | 2026-08-18 | no; yes at Mistral, which this finding adds (RES-2600) | $1.40 and $4.40 | $0.14 |
| `z-ai/glm-5` | 2026-02-11 | yes, Amazon Bedrock | $1.00 and $3.20 | none listed |
| `anthropic/claude-haiku-4.5`, the only Haiku in the catalogue | 2025-10-15 | yes, Google Vertex and Amazon Bedrock (global, US, Europe) | $1.00 and $5.00 | $0.10 |
| `google/gemini-3.8-flash` | 2026-09-02 | yes, Google Vertex (global) | $0.75 and $3.75 | $0.075 |
| `openai/gpt-6-luna` | 2026-09-22 | yes, Azure (global, US, EU) | $0.10 and $0.50 | $0.01 |
| `openai/gpt-5.4-mini`, the other reading, dropped after the owner confirmed GPT Luna on 2026-09-27 | 2026-03-17 | yes, Azure (global, US) | $0.75 and $4.50 | $0.075 |

I compared three GLM routes for the Master:

| Route | Better at | Worse at |
| --- | --- | --- |
| `z-ai/glm-4.7` at Google Vertex | fits the allowlist as it stands; the cheapest GLM at an allowed provider | the oldest GLM here, two generations behind; no cache price listed, so every call pays for the whole canon block |
| `z-ai/glm-5` at Amazon Bedrock | fits the allowlist as it stands | no cache price listed, so each call pays about 33,000 input tokens in full, about $0.035 a call, dearer than `anthropic/claude-sonnet-5` with its cache (RES-2700); OpenRouter showed no uptime figure for the endpoint on 2026-09-27 |
| `z-ai/glm-5.3` at Mistral's zero-retention endpoint | the newest GLM, from the line with the best open-weight English creative-writing score; a cache read at $0.14, so a call costs about $0.012; Mistral is an EU company (France) with a status page and a 1-day uptime of 99.8% on 2026-09-27 | needs `mistral` added to the player tier's allowlist; one provider, served at 4-bit precision |

The third route wins, because it is the only one that gives the owner the newest GLM at a lower cost than the draft's default, and Mistral offers zero retention, the rule the player tier exists to keep. The second route becomes `MASTER_FALLBACK_MODEL`: the request names both models in OpenRouter's `models` list, so when Mistral fails, the same request goes to `z-ai/glm-5` at Bedrock, and only when both fail does the scene take a library fallback. The planner takes the same route, because its chapter and season finales are story text the owner's decision covers, it has no latency limit, and the change saves about $0.2 an adventure (RES-2700). `anthropic/claude-opus-5.5` and `anthropic/claude-fable-5.1` stay its candidates.

`LIVE_GEN_MODEL` stays `anthropic/claude-sonnet-5`, and GLM joins its candidates. A frame is a task statement, and its wording and its maths decide whether she can solve it, so its rule stays the blind solve and the spelling count, not the owner's view on stories. `EXPLAIN_MODEL` stays `anthropic/claude-sonnet-5` for the same reason: an explanation teaches maths.

The bake-off still runs. GLM is the default the bake-off confirms or overturns on the blind Russian test: if another candidate wins the Master's rule, the decision record says so and `MASTER_MODEL` changes in `.env`. One conflict stays open for the owner: whether to accept a GLM route outside the four providers the player tier first allowed. If the owner declines Mistral, the Master falls back to `z-ai/glm-5` at Bedrock, which keeps the original allowlist at a higher cost a call. Proposed by research on 2026-09-27; the owner approves it with this record.

### Resolved: every model role is set by configuration, and switching a role's model needs no rebuild; the parent may switch the Master's model in the Parent Room among the bake-off's approved models

The owner decided on 2026-09-27: "The model should be configurable." Every model role is set by configuration without a code change, and switching a role's model needs no rebuild. The model table above already keeps models in `.env`; this finding makes it a rule and names each role's setting:

| Role | Setting |
| --- | --- |
| Master | `MASTER_MODEL`, `MASTER_FALLBACK_MODEL` |
| Planner | `PLANNER_MODEL` |
| Explainer | `EXPLAIN_MODEL` |
| Live generation | `LIVE_GEN_MODEL` |
| Checks | `LIVE_CHECK_MODEL`, `SAFETY_MODEL`, `CHECK_MODEL` (offline) |
| Judges | `JUDGE_MODEL`, `ART_JUDGE_MODEL` |
| Offline text | `GEN_MODEL` |
| Art | `LIVE_ART_MODEL`, `ART_MODEL_CHAR`, `ART_MODEL_KEY`, `ART_MODEL_BG` |
| Provider routes | `PLAYER_TIER_PROVIDERS` and `CONTENT_TIER_PROVIDERS`, the `only` lists of RES-2600 |

The server reads these settings when it starts, so a change takes a restart of the server container (`docker compose up -d`) and no image rebuild; the tools read them on each run. Each start runs the start-up check of this record on the new values.

Whether the parent can switch the Master's model in the Parent Room is research's proposal: yes, among the bake-off's approved models only. The decision record that approves the bake-off's result lists every model that passed the Master's rule with no safety failure, and `.env` carries that list as `MASTER_MODEL_CHOICES`. The Parent Room shows the list with each model's cost an adventure from `llm_log`, stores the parent's pick in the database, and the pick takes effect at the next adventure, so one adventure keeps one voice and one cache. The server checks the pick against the catalogue and the zero-retention list before the adventure starts, and on a failure it uses `MASTER_MODEL` and tells the parent. I compared this with a free text field for any model id. The field is better at trying a model the day it comes out, but it lets a model that never passed the blind Russian test and the safety checks write to the child, so the approved list wins; a new model reaches the list by a rerun of the bake-off. Proposed by research on 2026-09-27; the owner approves it with this record.

### Resolved: `google/gemini-3.8-flash` is the Gemini Flash model meant everywhere, and every other identifier in the model table exists in the OpenRouter catalogue

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's model table used `google/gemini-3.8-flash` for `LIVE_CHECK_MODEL`, `SAFETY_MODEL` and `ART_JUDGE_MODEL`, while its bake-off candidate list named `google/gemini-3.5-flash`, and it didn't say whether the gap was deliberate.

I read `GET https://openrouter.ai/api/v1/models` and `GET https://openrouter.ai/api/v1/models?output_modalities=image` on 2026-09-26. Both Flash models are listed:

| Model | Listed since | Price a million tokens, input and output |
| --- | --- | --- |
| `google/gemini-3.8-flash` | 2026-09-02 | $0.75 and $3.75 |
| `google/gemini-3.5-flash` | 2026-05-19 | $1.50 and $9.00 |

`google/gemini-3.8-flash` wins: it is the newer model of the same class, it costs half as much on input and less than half on output, the draft uses it in three roles, and it has a zero-retention endpoint at Google Vertex (RES-2600). `google/gemini-3.5-flash` is better only at having a longer track record, and the bake-off can still add it as a second Flash candidate. The bake-off list therefore names `google/gemini-3.8-flash`.

Every other identifier the draft names exists on 2026-09-26: `anthropic/claude-sonnet-5`, `anthropic/claude-opus-5.5`, `anthropic/claude-fable-5.1`, `openai/gpt-5.5`, `x-ai/grok-4.7`, `google/gemini-3.1-flash-image`, `google/gemini-3-pro-image` and `bytedance-seed/seedream-4.5`. The last appears only in the image-output listing, not in the default one, so the start-up check must query both listings, or it stops the server over a model that exists. For "a Gemini Pro class model if in the catalogue", the catalogue has only `google/gemini-3.1-pro-preview`, a preview. For the open models strong in Russian, the Qwen and DeepSeek families are both present, for example `qwen/qwen3.8-max-0902` and `deepseek/deepseek-v4-pro`; the bake-off picks among them. The catalogue changes as models are added and retired, so these facts hold for 2026-09-26 only, and the stage 0 check repeats them.

### Resolved: the player's cleaned free text, invented names and summary outcome events leave the Mac by design, and only to zero-retention endpoints

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's privacy section called the explanation request the only thing that leaves the Mac, while this section sends the Master her free text, her names and outcome events. The privacy claim now covers maths results only, and RES-2600 lists the three kinds of data that leave, with the options compared. Keeping free text at home would have ended the scene cycle above, because the Master can't react to an action it never reads. Because the Master's and the planner's requests carry her material, they go only to zero-retention endpoints, and conclusion 22 ties the model choice to that.

The owner's decision of 2026-09-27 changed part of this finding: her cleaned free text also goes to Jev at TypeSafe. Research decided the same day, on the owner's instruction, that Jev runs through OpenRouter's zero-retention route, so that text also goes only to a zero-retention endpoint. The resolved finding on Jev below and RES-2600 hold it.

### Resolved: Jev at TypeSafe takes the checks that have a fixed set of answers as `JUDGE_MODEL`, with `SAFETY_MODEL` on `google/gemini-3.8-flash` as its fallback

The owner decided on 2026-09-27: Jev can be used to evaluate safety and similar judgements, for example the safety check on free text and sorting free-text choices. The decision assumed Jev's direct API at TypeSafe, outside OpenRouter, with unpublished retention terms; the last paragraph of this finding moves Jev to OpenRouter's zero-retention route. RES-3000 holds what research read about Jev on 2026-09-27, and RES-2600 how its requests fit the privacy tiers.

Jev answers a typed question with a probability and writes no text: Noul for yes or no, Choice for one of a list, Score for a place on an ordered scale. That shape decides which checks it may take.

| Check | Question to Jev | Jev may take it |
| --- | --- | --- |
| Safety of her cleaned free text and of each Master reply against the forbidden list in RES-1800 | Noul per item, or one Choice | yes |
| Judging or shaming the heroine («оценивает или стыдит героиню?», does it judge or shame the heroine?) | Noul | yes |
| Creepiness against the order's level | Score on the levels 0, 1 and 2 | yes |
| Level of a real-life signal in her text (RES-1800) | Choice: none, everyday, serious | yes, beside the hand-written triggers |
| Sorting her free text into the three options a scene offers, for example where to go tomorrow at the session finale | Choice among the options and «none» | yes; below a threshold, or on «none», the Master reads the text as a free action |
| Safety step of the explanation checks (RES-0600) and the frame checks (RES-0720) | Noul | yes, on the text with placeholders, before numbers are filled in |
| The Master, the planner, live frames, explanations | - | no: these write text |
| Blind solves by `LIVE_CHECK_MODEL` and `CHECK_MODEL` | - | no: a blind solve computes an answer, and a Choice among candidates would show the checker the engine's answer |
| `ART_JUDGE_MODEL` | - | no: Jev reads text only |

I compared two ways to give Jev these checks. Replacing `SAFETY_MODEL` with Jev outright is the simplest table, with one model a check. Adding `JUDGE_MODEL` and keeping `SAFETY_MODEL` as its fallback costs one more row but covers two gaps: TypeSafe says Jev is most accurate in English and less certain in other languages, and Jev was released on 2026-09-15, so an outage or a changed rate limit has no track record behind it. The second way wins. So each check goes to Jev only after Jev matches `google/gemini-3.8-flash` on a labelled Russian test set of that check at the stage 0 bake-off, and a check Jev fails stays on `SAFETY_MODEL`. When Jev errs or passes its timeout, the same check runs on `SAFETY_MODEL`. `JUDGE_MODEL` pins `jev-1.13.0` and never `jev-latest`, because each check's threshold is set on one version. The rule that doubt means the serious level becomes testable: a signal counts as serious when Jev's probability for «serious» passes a threshold the test set sets. Proposed by research on 2026-09-27; the owner approves it with this record.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. Jev runs through OpenRouter's zero-data-retention route, `typesafe/jev-1.13`, not TypeSafe's direct API. OpenRouter lists that endpoint as zero-retention, which answers the question of what TypeSafe keeps, and it keeps Jev inside the player tier on one key and one limit. Only cleaned text with no personal data reaches Jev, on the parent's account. The gate becomes: Jev reads her text in play once it matches the fallback safety model, `SAFETY_MODEL`, on the Russian test set at the stage 0 bake-off, run through that route. The pin moves from `jev-1.13.0` to `typesafe/jev-1.13`, and the stage 0 check confirms which Jev build OpenRouter serves under it, because each threshold is set on one version. RES-2600 compares the two routes.

### The draft runs each scene as a four-step cycle

1. The Master describes the situation in 2-4 short paragraphs, with character sprites showing emotions beside it.
2. The player writes or dictates an action («я прячусь за шкафом и бросаю носок в другую сторону», I hide behind the cupboard and throw a sock the other way) or picks one of 3 options. One option is always strange and funny. A «Дальше» (Next) button is always there, so writing is optional.
3. The Master resolves the action within the world's rules and the heroine's characteristics. Bold ideas work more often; a failure is funny and opens a twist, never a punishment.
4. When the Director orders a trial, the Master writes a lead-in («на двери вспыхивает печать», a seal flares on the door). The task opens in the task window, a plain panel separate from System windows (RES-0100 holds the reason; the draft said "the System window"). After the answer the story shows the consequence by outcome: a correct answer is a strong spell and the success branch; a wrong answer or «Не знаю» loosens the knot and the story takes another path. Every answer is a spell, and the story always goes on. The Master writes both room branches in advance while the player solves tasks, and reactions to single answers are assembled from the battle-line pool by outcome, so the consequence shows at once, with no LLM request and no waiting.

### The draft opens the free-text field at fixed points only, about 15-25 live calls a session

Every scene ends with three options and «Дальше». The free-text field opens on entering a floor, before a Guardian, at the campfire on rest stops, at the session finale (choosing where to go tomorrow) and on meeting a new creature. Under the field is the note «Эту историю могут читать мама и папа» (Mum and Dad may read this story). The Master is called live only at these points and on transitions between floors: about 15-25 calls a session.

### The draft keeps task statements and numbers away from the Master when it introduces a trial

1. The Director picks the node, subtype and template and sends the Master an order `{ structure, floor, sceneCharacters, rewardsOnSuccess }`: only the kind of story situation («торг», «погоня», «делёж»: bargaining, chase, sharing out), the floor, who is in the scene, and what the success branch opens (a secret, a Diary page, a shortcut to the Guardian, a chance to meet a rare familiar, a special item).
2. The Master writes a lead-in of 1-3 sentences without numbers, and both room branches `success` and `alt` in advance.
3. The statement comes from a frame: from the approved library (`content/frames.ru.json`) or from the queue of live `LIVE_GEN_MODEL` frames that already passed a blind check. A frame holds only placeholders.
4. The engine fills in numbers, names and declensions.
5. `LIVE_CHECK_MODEL` solves the live frame with its concrete numbers blind once more.
6. After the answer the Director computes the outcome and shows the pool reaction at once; after the room, the pre-written branch. For later scenes the Master gets only summary events: `room_outcome` (`success` / `alt`) at the end of a room, `combo` (`clean_row` / `big_clean_row`) on a clean row, `floor_outcome` (`triumph` / `victory` / `cunning`) at the end of a floor. It never gets single-task outcomes.

Live frames fill only the top-up to a full block. Probes and the Guardians' ladder use only the approved library.

### The draft checks every Master reply in full before a typewriter animation shows it

- Checks: JSON schema; length; speakers exist in the canon or the entity list; no digits or numerals; the safety check by `JUDGE_MODEL`, or `SAFETY_MODEL` as its fallback, and the content prohibitions; no judging phrases about schoolwork; no word from the shame stop list (`content/shaming.ru.json`) and no praise of the heroine's intelligence («ты умная», «гений»: you're clever, genius); creepiness no higher than the order's level (a `JUDGE_MODEL` Score, or a `SAFETY_MODEL` classifier as its fallback, against the level checklist and the dreamcore prohibitions).
- Latency: after free text the p95 wait is at most 6 seconds. While the reply comes, the screen shows «Система обрабатывает…» (The System is processing...) with no time indicator. After 12 seconds without a reply a line from the fallback pool shows and the scene goes on.
- Scenes between trials are generated in advance while the player solves tasks. The queue holds 2-3 scenes ahead; both branches (`success` and `alt`) of the current room are ready. When a branch is late or fails the check, a fallback branch of the same shape comes from `content/branches.ru.json`: 20+ `success` / `alt` pairs and 10+ Guardian ending triples per floor by stage 0.4; before stage 0.4, at least 3 pairs and 3 triples per floor.
- A reply that fails the check gets one retry, then a fallback scene from the library.

### The draft keeps a hand-written canon and a story memory the game updates

- Canon (`content/canon.ru.md`) is written by hand and never changed by the game: the world, characters with voice samples, the mystery with checkpoints, humour rules, prohibitions. The canon is cached in OpenRouter (prompt caching).
- Story memory (tables `story` and `scenes`): summaries of past sessions, facts the heroine knows, relationships with characters, running jokes and how often each was used.
- The story reacts to floors passed, creatures met and named, focuses and outfits forged, pages deciphered, the player's free-text decisions, outcome events (room branches, clean rows, floor states, secrets opened and returned), the chapter title after a chapter finale (and its triumph variant), and, once ranks ship, a new rank at a season finale. The draft named the chapter title "after an Ascent"; the resolved finding below gives the MVP reading.
- The story does not react to numbers, answers, node identifiers, speed, node states and estimates, weak topics or lesson tags. The Master never receives them. Outcome events are story signals with no link to skills: the Master doesn't know which node stood behind a trial and can't discuss the heroine's "abilities".

### Resolved: the MVP runs the whole campaign calendar, with a story finale in place of each Ascent, titles in place of rank changes and pages the Diary develops in place of ciphers

Proposed by research on 2026-09-26; the owner approves it with this record.

The canon's campaign (CAN-0080) closes every chapter with an Ascent, raises the rank at season finales, opens places by rank (CAN-0070) and hides two autumn pages in ciphers (CAN-0090). The MVP defers Ascents, ciphers and rank changes and keeps rank E (RES-0010). The draft's memory section also lists «титул главы после Восхождения» (the chapter title after an Ascent) among what the story reacts to, which the MVP can't produce. Three options were weighed:

- The MVP plays Session 0 and the first autumn chapter only, and the calendar waits until the deferred parts ship. Nothing runs half-built, and it covers the two weeks of acceptance play (RES-3000). But the player keeps playing daily while later stages are built, in an order chosen after watching her play, so a stopped calendar would stall the mystery and every checkpoint after the first.
- The MVP ships Ascents, ciphers and ranks after all. The canon runs as written. But Ascents need anchor forms and control runs, a large diagnostic part, and this contradicts the draft's rule that the MVP section wins and the resolution that ranks give no reward in the MVP (RES-2000).
- The MVP runs the whole calendar and puts a stand-in in each place a deferred part would act. The story never stalls whatever order the later stages come in, and each stand-in gives way to its part without a change to the canon's story.

The third option wins. Its stand-ins:

1. A chapter ends with a story finale inside the chapter's last daily adventure, in its end-of-session scene: the Tower lights its windows, the Guardians greet the heroine, and the System awards the chapter title and main reward. The triumph variant follows the same floor-state thresholds. The heroine doesn't climb every floor, and the System's evening line about a coming Ascent isn't shown. When Ascents ship, the finale moves into the Ascent unchanged.
2. The rank badge stays at E. A season finale plays in full and, like every chapter finale, awards the chapter title and main reward; where the canon raises the rank, the rank doesn't change. A rank opening that is part of the MVP, such as the floors' secret places at rank D, opens on the date its rank would have arrived, because the Director reads the rank calendar, not the badge. An opening outside the MVP, such as ciphers, paths and big forge recipes, stays closed. When ranks ship, one ceremony awards the rank the calendar has reached.
3. A Diary page the canon enciphers arrives already developed: the Diary develops the whole page before the heroine opens it, the same way it develops one letter for a stuck player (CAN-0090). The lore, hints and names on the page still reach her. When ciphers ship, pages found after that arrive enciphered.
4. The ten checkpoints run on the calendar unchanged, because Diary pages are in the MVP.

The MVP has no stats either (RES-2000), so its scene order carries no `heroStats`, the field the draft's `SceneOrder` makes required.

The story reacts to the chapter title after the chapter finale, and in the MVP it receives no rank event. The draft's memory section named "the chapter title after an Ascent".

### The draft limits free-text effects to a closed set the Director applies

The Master's reply is JSON: the scene (lines, speakers, emotions) plus a list of effects from a closed set:

- remember a fact in story memory;
- change a character's attitude to the heroine;
- add a running joke;
- open a predefined Diary page;
- suggest a story reason for a reward (the Director decides whether to give it);
- grant a cosmetic title («Та, кто угостила Стража пирогом», She who treated the Guardian to pie) within a limit.

The model can't grant currency, a focus or a familiar directly, change the canon, or skip a floor or tasks. If the player writes «я просто улетаю на вершину» (I just fly off to the top), the story plays it with humour and returns her to the path. The draft gives no number for the title limit.

### The draft defines the order and reply schemas in TypeScript

The draft places these in `src/shared/master.ts`, with zod schemas of the same fields:

```typescript
type TrialOutcome = "clean" | "partial" | "alt";          // one task
type RoomOutcome = "success" | "alt";                      // room
type FloorOutcome = "triumph" | "victory" | "cunning";     // floor
type SuccessReward = "secret" | "diary_page" | "guardian_shortcut" | "rare_familiar_chance" | "special_item";

interface OutcomeEvent {                         // all the Master knows about trials
  type: "room_outcome" | "combo" | "floor_outcome" | "reward_reopened"; // single-task outcomes (TrialOutcome) are not sent
  floor: FloorId;
  combo?: "clean_row" | "big_clean_row";
  room?: RoomOutcome; floorState?: FloorOutcome;
  reopened?: SuccessReward[];                    // missed rewards returned from the queue
}                                                // no numbers, answers, node ids, time

interface SceneOrder {
  kind: "floor_enter" | "lead_in" | "guardian" | "camp" | "free_input" | "new_creature"
      | "session_end" | "dreamcore_drift";
  floor: FloorId; structure?: string;            // "bargaining", "sharing out"... no numbers
  sceneCharacters: string[];                     // ids from the canon and entities
  planBeat?: string; checkpoint?: number;        // current checkpoint only
  playerInput?: string;                          // the player's cleaned text
  heroStats: Record<"str" | "agi" | "wis" | "cha" | "luck", "low" | "mid" | "high">;
  rewardsOnSuccess?: SuccessReward[];            // for lead_in: what the success branch opens
  recentOutcomes?: OutcomeEvent[];               // events since the last order
  floorState?: FloorOutcome;                     // session_end only; guardian gets endings for all three states
  spookiness: 0 | 1 | 2; dreamcore: boolean;     // the parent's creepiness level; floor's dreamcore variant
}
interface Line { speaker: string; emotion: "neutral" | "happy" | "surprised" | "sad" | "proud" | "sleepy";
                 text: string }                  // no digits or numerals
interface MasterReply {
  lines: Line[];                                 // 1-12 lines
  branches?: { success: Line[]; alt: Line[] };   // for lead_in: both room branches in advance, 2-8 lines each
  floorEndings?: Record<FloorOutcome, Line[]>;   // for guardian: three floor endings in advance, 2-6 lines each
  choices: [string, string, string];            // the third is strange and funny
  effects: (
    | { type: "remember"; fact: string }
    | { type: "relation"; character: string; delta: -1 | 1 }
    | { type: "running_joke"; joke: string }
    | { type: "diary_page"; pageId: string }     // from a predefined list only
    | { type: "reward_hint"; reason: string }    // the Director decides whether to give it
    | { type: "title"; title: string }
  )[];
}
```

The comments are translated from the draft's Russian; the code is unchanged.

### The draft names the returned-reward event two ways

The schema's `OutcomeEvent.type` uses `reward_reopened`. The draft's outcomes section calls the same event `reopened`. The draft does not say whether these are one event.

### The draft discards a whole reply that breaks the schema, and checks `alt` and `cunning` more strictly

A reply with an unknown `speaker`, extra fields or an effect outside the list is discarded whole. A `lead_in` reply without both branches, or a `guardian` reply without all three endings, is discarded too. The `alt` branch and the `cunning` ending are checked more strictly: no shame stop-list words, no harm to the heroine, no dead end (the branch must end by moving on), and no familiar sad "because of her".

### The draft defers items and creatures made on the fly until after the MVP

Deferred until after the MVP by the draft («Позже, по итогам игры (не в MVP)», later, after seeing the player play, not in the MVP). Beyond the starting catalogue the game invents new things as the story goes: focuses, outfits, accessories, decor, curios, familiars and new Tangles, by the rules of canon sections 5, 6 and 10. They tie to the player's story («Плащ Стража, которого ты угостила пирогом», the Cloak of the Guardian you treated to pie).

1. When: the Director decides it is time for a reward and sets the type and rarity by the economy rules, including as the "special item" of a success branch. The Master may suggest a reason; the Director sets the limits.
2. What is generated: a JSON card with type, rarity, a placeholder name and a funny description; for a familiar, its element, character, manner of speech, 3 sample lines and 2-3 moves; a visual description for the artist; an effect from a closed list (strike animation, story ability, characteristic bonus). No effects on tasks.
3. Check: schema, limits, canon, safety, no likeness to others' characters, no repeat of an existing thing.
4. Picture: `LIVE_ART_MODEL` draws asynchronously on a flat coloured background; a judge checks it; the background is removed by chroma key. The 10-30 seconds are hidden in play: an egg cracks, the forge hammers. If late, a silhouette with a question mark shows, and the picture loads later.
5. Name: the player gives it.
6. Limits: at most 3 new entities a session, at most one new AI-made familiar a week, and `LIVE_ART_BUDGET_USD` for pictures. Every made thing shows in the Parent Room; the parent can hide or redraw any of them.

### The draft lets the player name the heroine, familiars, focuses, floors, new Tangles and her room

Names in the game are hers; the starting names in the canon are placeholders.

- What she can name: the heroine, each familiar, a forged focus, an opened floor, a new Tangle in the Diary (the discoverer's right), her room. The resolved finding below widens the focus to every forged item and the new Tangle to every Tangle she meets.
- How: a System window «Существо ждёт имени» (A creature awaits a name), a field with the system keyboard and dictation, and a «Подскажи» (Suggest) button, where the Master offers 3 options in the world's tone. After naming, the creature reacts in character.
- Traits: for a familiar she picks 1-2 traits from a list (grumbler, dramatic, secretly writes poems, afraid of pigeons and so on) or writes her own.
- Renaming is allowed at any time. Names pass the content check, with a length of at most 24 characters.
- In tasks, frames use her familiars' names («Сэр Пухляш купил 3 зелья…», Sir Fluffington bought 3 potions...). For declension an LLM builds a case table once (`name_forms`); if a name doesn't decline reliably, the frame uses it only in the nominative.

### Resolved: the placeholders are the names of familiars, floors and Tangles; the player also names the heroine, her room and every forged item; every other canon name is fixed

Proposed by research on 2026-09-26; the owner approves it with this record.

The records named the placeholders four ways. CAN-0010 said every familiar name and «некоторые названия мест» ("some place names"). The draft's settled list (RES-3000) said the names of familiars, Guardians and floors. This record's naming list above names the heroine, familiars, a forged focus, an opened floor, a new Tangle and her room, and no Guardian. CAN-0100 lets her name every item she forges. Three options were weighed:

| Option | Better at | Worse at |
| --- | --- | --- |
| Every canon name is a placeholder, Guardians and the town included | the most co-authorship | a Guardian or the mayor introduces herself by name, so renaming her breaks the scene; the Master's memory, art prompts and item names such as «Плащ Стража, Которого Угостили» lean on fixed names for a whole year |
| The settled list: familiars, Guardians and floors | follows the draft's own summary | leaves out the Tangles and forged items the naming section gives her, and keeps the Guardian problem above |
| What she discovers or makes: familiars, floors and Tangles as placeholders, plus the heroine, her room and forged items; everything else fixed | every name she gives has a reason in the world, the discoverer's right or the maker's; characters keep the names they introduce themselves with | the Master has to use her name for every Tangle she has met, which the name data behind stable identifiers already carries (RES-1500) |

The third option wins, because it gives her a name to choose at every first meeting and every making, including in the MVP, where the daily quest «Назови новое существо» ("Name a new creature", RES-2000) needs a creature to name and AI-made creatures don't exist yet. The rule:

- Placeholders she replaces at the first meeting: each familiar at hatching, each floor when she first opens it, and each Tangle, from the canon's tables or invented later, when she first meets it. The canon's name is one of the three «Подскажи» (Suggest) options, so she can keep it.
- Names she gives with no canon placeholder: the heroine in Session 0, her room, and every item she forges, not only a focus, as CAN-0100 says.
- Fixed names: the town and the forest (CAN-0020), the Tower, the System, «Дневник Смотрителя» (the Keeper's Diary), the Guardians and every other character, the dreamcore places (CAN-0130), the evolution stage names (RES-1900) and the shop's items.

The draft of this finding left an open question for the owner: the settled list named the Guardians among the placeholders, and this finding drops them.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. The Guardians keep fixed names, because each introduces itself by name in its arc (CAN-0040), and a renamed Guardian would contradict its own introduction for the rest of the year.

### The draft keeps names that contain a number out of task statements

If a name, from the canon or from the player, contains a digit or a word from the numeral list, including «один» (one) and «первый» (first), which the Master may use, the engine never puts it into a task statement. Examples: «Поварята Пополам» (the Half-and-Half Cooks), «Дюжин» (Dozen), «Кошка Первой Петли» (the Cat of the First Loop), «Семёрка» (Seven). The engine takes another character of the scene or the neutral `{hero}`. In the story such a name lives as usual.

## Conclusions

1. The Director alone must decide what happens in the game, and the Master alone must write story text.
2. The Master and the planner must never receive numbers, answers, verdicts, single-task outcomes, node identifiers, node states or estimates, response times or lesson tags.
3. The Master must answer every scene order in strict JSON, and the Director must apply only effects from the closed set.
4. A reply with an unknown speaker, an extra field, an effect outside the set, or missing branches or endings its order requires must be discarded whole.
5. The Master must never write a task statement; statements must come from approved or blind-checked frames that hold only placeholders.
6. The game must show the consequence of an answer at once, from the pool and pre-written branches, without an LLM call.
7. Every Master reply must pass the schema, length, speaker, numeral, safety, shame-word, intelligence-praise and creepiness-level checks before it shows.
8. A reply that fails its check must get one retry and then fall back to a library scene, and the library must hold fallback branches and Guardian endings for every floor.
9. After free text the p95 wait for the Master must be at most 6 seconds, and after 12 seconds without a reply the scene must continue with a fallback line.
10. The player must never have to type: every scene must offer three options, one strange and funny, and a «Дальше» button.
11. The free-text field must open only at the listed points, with a visible note that parents may read the story.
12. The canon must be written by hand and never changed by the game, and secrets of later checkpoints must never enter the Master's prompt.
13. After each session the planner must write a summary and the next plan from story signals alone.
14. Models must be configured outside the code, and the server must refuse to start when a configured model does not exist.
15. Text models must be chosen by a blind bake-off on the game's own prompts, scored by the parent on anonymised answers, and any model with a safety failure must be excluded.
16. Changing the campaign must leave the diagnostic tables untouched.
17. The player must be able to name and rename her heroine, familiars, forged items, opened floors, every Tangle she has met and her room, with names checked and at most 24 characters long.
18. The engine must never put a name containing a digit or a listed numeral into a task statement.
19. When generated items and creatures arrive after the MVP, the Director must set their type, rarity and limits, and the parent must be able to hide or redraw each one.
20. Every role that needs a Gemini Flash model, and the bake-off candidate list, must use `google/gemini-3.8-flash`.
21. The start-up model check must query both the default model listing and the image-output listing of the OpenRouter catalogue.
22. Every model on OpenRouter that the Master, the planner, the Explainer and their checks use must have a zero-retention endpoint at an allowed provider, as RES-2600 sets out, because those requests carry the player's story material; `JUDGE_MODEL`, Jev, follows the same rule through OpenRouter's zero-retention route, as research decided on 2026-09-27. (The draft of this conclusion covered every model; an earlier text made Jev at TypeSafe an exception.)
23. The bake-off's choice and every substitute model must be recorded as a decision record in `project/adrs/` and approved by the owner before it goes into `.env` for play.
24. The MVP must run the whole campaign calendar: each chapter must end with a story finale inside a daily adventure that awards the chapter title and main reward, a season finale must award its chapter title and main reward with no rank change, an MVP rank opening must open on its rank's calendar date while the badge stays E, and an enciphered Diary page must arrive already developed.
25. The chapter finale must take its triumph variant when at least half of the chapter's floor-days are triumph or victory and at least 0.3 are triumph, as starting values that the stage 0.1 simulation and the first-month review adjust.
26. Familiars, floors and Tangles must carry canon names only as placeholders that the player replaces at the first meeting, with the canon name among the three suggestions; the heroine, her room and every forged item must get the name she gives; every other canon name, the Guardians included, must stay fixed.
27. `JUDGE_MODEL` must be Jev, `typesafe/jev-1.13` through OpenRouter's zero-retention route, pinned to that version (an earlier text named `jev-1.13.0` on TypeSafe's direct API), and may take only the checks with a fixed set of answers that the resolved finding on Jev lists; it must never write text, solve a task or judge a picture.
28. A check must move to `JUDGE_MODEL` only after Jev matches `google/gemini-3.8-flash` on a labelled Russian test set of that check at the stage 0 bake-off, and when Jev errs or times out, the check must run on `SAFETY_MODEL`.
29. The start-up model check must confirm `JUDGE_MODEL` in the OpenRouter catalogue and its zero-retention endpoint list, like every player-tier model. (An earlier text checked it through TypeSafe's `GET /v1/models`, when Jev sat outside OpenRouter.)
30. The Guardians must keep fixed names that the player can't replace, because each introduces itself by name in its arc, as research decided on 2026-09-27 on the owner's instruction.
31. Every Jev request must go through OpenRouter to `typesafe/jev-1.13` under `zdr: true`, carrying only cleaned text with no personal data, on the parent's account, and Jev must read her text in play only after it matches `SAFETY_MODEL` on the Russian test set at the stage 0 bake-off through that route, as research decided on 2026-09-27 on the owner's instruction.
32. `MASTER_MODEL` and `PLANNER_MODEL` must default to `z-ai/glm-5.3` through Mistral's zero-retention endpoint, by the owner's decision of 2026-09-27 that GLM is good enough for stories, until the bake-off confirms or overturns it on the blind Russian test. (The draft's defaults were `anthropic/claude-sonnet-5` and `anthropic/claude-opus-5.5`.)
33. Every Master request must name `MASTER_FALLBACK_MODEL`, `z-ai/glm-5` through Amazon Bedrock's zero-retention endpoint, as the second model in OpenRouter's `models` list, and the scene must take a library fallback only when both fail.
34. The Master's bake-off must include `z-ai/glm-5.3`, `z-ai/glm-5`, `anthropic/claude-haiku-4.5`, `google/gemini-3.8-flash` and `openai/gpt-6-luna`, by the owner's decision of 2026-09-27 ("gpt moon" is GPT Luna, as the owner confirmed on 2026-09-27), and each candidate must run through the route and endpoint play would use.
35. `LIVE_GEN_MODEL` and `EXPLAIN_MODEL` must keep `anthropic/claude-sonnet-5` as their default, with GLM among the live generation candidates.
36. Every model role must be set by configuration, in the settings the resolved finding on configuration names, and switching a role's model must need no code change and no rebuild, by the owner's decision of 2026-09-27; the start-up check must run on every new value.
37. The parent must be able to switch the Master's model in the Parent Room among the bake-off's approved models (`MASTER_MODEL_CHOICES`) only, taking effect at the next adventure, as research proposed on 2026-09-27.

## Sources

- The owner's draft «Хроники Башни — спецификация», sections «Кампания и ИИ-Мастер», «Директор и Мастер», «Кампания, сезоны, сессии», «Модели», «Бейк-офф моделей (этап 0)», «Цикл сцены», «Как Мастер вводит испытание», «Показ ответов Мастера», «Память и канон», «Следствия свободного текста», «Предметы и существа, созданные на ходу» and «Имена придумывает игрок», with the opening, «Текущий объём (MVP)» and «Исходы испытаний и ветки сюжета» for context, read 2026-09-26; not kept in the repository - every finding above.
- OpenRouter API, `GET https://openrouter.ai/api/v1/models` (458 models) and `GET https://openrouter.ai/api/v1/models?output_modalities=image`, read 2026-09-26 - which model identifiers exist, when each was listed and its price.
- OpenRouter API, `GET https://openrouter.ai/api/v1/endpoints/zdr`, read 2026-09-26 - which of the named models have zero-retention endpoints.
- The owner's decision of 2026-09-27, relayed that day: Jev can be used to evaluate safety and similar judgements.
- TypeSafe AI, «Models», https://docs.typesafe.ai/models, read 2026-09-27 - `jev-1.13.0`, `GET /v1/models`, the Noul, Choice and Score questions, text input only, English as the main language and variable accuracy in others.
- Flavio Copes, «A deep dive into Jev, TypeSafe's System One model», https://flaviocopes.com/jev/, read 2026-09-27 - `POST https://api.typesafe.ai/v1/systemone`, release on 2026-09-15, latency of 70 to 500 ms, rate limits.
- The owner's decisions of 2026-09-27, relayed that day: "GLM is good enough for stories"; the story candidates are GLM, Claude Haiku, a Gemini Flash model and "gpt moon"; "The model should be configurable".
- OpenRouter API, `GET https://openrouter.ai/api/v1/models` (458 models), `GET https://openrouter.ai/api/v1/endpoints/zdr`, `GET https://openrouter.ai/api/v1/models/<id>/endpoints` for `z-ai/glm-5.3`, `z-ai/glm-5.3-prime`, `z-ai/glm-5.2`, `z-ai/glm-5`, `z-ai/glm-4.7`, `anthropic/claude-haiku-4.5`, `openai/gpt-6-luna` and `google/gemini-3.8-flash`, and `GET https://openrouter.ai/api/v1/providers`, read 2026-09-27 - the GLM models, their context, listing dates, prices, endpoints, precision, uptime and zero-retention status, and Mistral's headquarters.
- Z.ai, GLM-5 model card, https://huggingface.co/zai-org/GLM-5, read 2026-09-27 - language tags Chinese and English only; no Russian or creative-writing results.
- MERA, GLM-5.1 submission, https://mera.a-ai.ru/en/code/submits/273, read 2026-09-27 - GLM-5.1 on MERA's Russian code tasks only, overall 0.525, submitted 2026-04-17.
- Featherless, «Best AI for creative writing: 7 open models», https://featherless.ai/blog/best-ai-for-creative-writing-2026, published 2026-09-17, read 2026-09-27 - GLM-5.2 at Elo 1745.8 on EQ-Bench Creative Writing v3, the best open-weight score; GLM-5.3 not yet measured.
- Pikabu, «GLM: самый полный обзор, тесты, сравнения…», https://pikabu.ru/story/glm_samyiy_polnyiy_obzor_testyi_sravneniya_15_promptov_v_podarok_i_dostup_bez_vpn_14138263, published 2026-07-10, read 2026-09-27 - the vendor's claim that GLM-5.1 improved in languages other than English; no Russian test.
