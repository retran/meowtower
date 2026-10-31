---
id: RES-4290
artifact: research
status: approved
revised: 2026-10-31
elaborates: RES-0720
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Live frames can set every task in the story while the engine keeps the numbers, and a gateway can hold two routes when each role names one

## Summary

A model can dress each task in the story without touching the maths: it writes a frame with the template's own placeholders, code checks it, and the engine fills the numbers. Direct Anthropic and OpenRouter can sit behind one gateway when each role names its route and model, because the tier stays in code and limits which routes a role may name. Direct Anthropic serves text only, so image roles stay on OpenRouter. This record updates RES-0720 for Claude Haiku 5.5, for three languages and for the owner's constraints of 2026-10-31. It doesn't cover the Master's order or the summaries' own content.

## The question

The owner wants task texts set in the game's world in Russian, English and Dutch, written live by Haiku 5.5 and built into the current story. The prompt holds the setting and the instruction to wrap the task for now, with room for summaries of the story arc, the adventure and the game situation. The owner also wants both OpenRouter and the direct Anthropic API, one selected at a time, and each kind of model work configurable with its own model and provider.

The assumption behind the question is that a task needs a model call of its own. The first draft of this record challenged it: an offline library meets "in the setting" with no call at play time. The challenge fails on the owner's outcome, because a text written in advance can't know the current game situation, and the owner decided on 2026-10-31 that task text is live only.

## Method

I read the approved records RES-0720, RES-0700, RES-1600, RES-2550, RES-2600, RES-2700, RES-4230, ADR-0100, ADR-0130, ADR-0160, ADR-0410, SPC-0100 and SPC-0130, the code in `src/server/` and `src/templates/`, and the task content files, on 2026-10-31. The researcher agent read the Anthropic and OpenRouter pages under Sources. `https://openrouter.ai/api/v1/models` returned an unrelated shape on two reads, so OpenRouter's id, prices and endpoints for Haiku 5.5 are not obtained. The feature table of Anthropic's retention page was cut off, so prompt caching under zero retention is unverified. Nothing was measured.

## Findings

### What the earlier research still settles

RES-0720 settles the shape: placeholder frames, a fixed reply schema, code checks, a safety check and blind solves. RES-2600 settles what may leave the Mac. RES-2700's budget figures stand. RES-1600's statement that Haiku 4.5 is the only Haiku is stale, because Anthropic released Haiku 5.5 on 2026-10-07. RES-0720's Russian-only frames are stale, because the code ships `ru`, `en` and `nl` in `src/shared/i18n.ts`.

### The engine fixes the numbers, and template text is a neutral blank

`src/templates/spec.ts` fills `{a}`, `{=a+b-10}` and `{a|one|few|many}` from the seeded draw, and its header says a model writes the story frame around the same numbers. `content/tasks-a.ru.json` holds text such as «Найди разность {a} − {b}.». So a frame that keeps these placeholders can't change a number or an answer.

### Some tasks can't take a free frame today

`present` in `src/server/task-source.ts` parses options out of the text of `choice`, `set` and `order` tasks, so a reworded text breaks their buttons. A task with a picture can't be solved blind, because the solver reads text only. Those tasks need other handling before a frame fits them.

### Nothing in the code calls a model yet

`src/server/gateway/`, a `frames` table, `content/numerals.*.json` and `llm_log` don't exist. `content/shaming.ru.json` and `src/shared/voice/gate.ts` cover Russian only.

### Haiku 5.5 suits the role on price and output

On the Claude API the id is `claude-haiku-5-5`, at $0.10 input and $0.50 output per million tokens for prompts up to 100,000 tokens. Structured output through `output_config.format` is supported and constrained to the schema, but length constraints in the schema aren't. Adaptive thinking is on by default at effort `medium`, and sampling parameters must be left out (Anthropic pages read 2026-10-31).

### Direct Anthropic has no key limit, no cost field and no per-request retention setting

The response gives token usage and no cost. Zero retention is granted per organisation by contract, can't be read through an API, and a flagged session may be kept up to 2 years even under it. OpenRouter gives `usage.cost`, a key limit and `zdr: true` per request; enforcing zero retention there removes Anthropic's first-party endpoint and leaves Bedrock and Vertex.

### Direct Anthropic serves no image output

Anthropic's overview says all current Claude models take text and image input and give text output, so image-output roles have no direct route. A role that reads a picture and scores it could use one.

### The story summaries change the tier

An arc, adventure or situation summary is story material, which may travel only in the player tier. The first prompt holds only the setting, which is content made without the player, so the author role can start in the content tier. Moving it to the player tier is a code change.

### The options for task text

| Option | Better at | Case against |
| --- | --- | --- |
| Do nothing: template text | No model call, stable text, nothing to check | No setting at all, so the outcome isn't met |
| Offline frames in three languages, each accepted by the parent | Keeps every measurement guard, and no call at play time | About 420 frames to review by stage 0.4, and a frame can't know the current story |
| Live rewrite of whole task text by the model | The simplest prompt | The model handles the numbers, so a slip changes the maths; no check exists for it |
| Live frame with placeholders, checked before the player arrives | Fits the current story, and the numbers stay with the engine | A call per task, a text no adult read before the player does, and stable text is lost where measurement wants it |

The owner's decision of 2026-10-31 settles this comparison on the live frame. The case against it stands: the parent no longer reads each frame first, so the checks carry the whole weight, and varying text adds noise to what a task measures.

## Conclusions

1. A live frame must keep every template placeholder and hold no number of its own, so the engine alone decides the numbers and the answer.
2. A live frame must pass the code checks, the safety check and three blind solves before the player sees it.
3. A task with no checked frame ready must show its template text with no wait, because a slow model must not stop the game.
4. Each language must have its own number-word list before frames in that language are checked.
5. The request must leave defined places for the arc, adventure and situation summaries, empty until a record moves the role to the player tier.
6. Each role must name its route and its model in one configured value, and each request must use exactly that route.
7. The tier must stay fixed in code and limit the routes a role may name, and a player-tier role must not use the direct route until the owner states that zero retention holds.
8. Every route must return the same normalised result, and the gateway must compute a direct call's cost from token usage and a dated price table.
9. The month's limit must count every route, because no key limit protects the direct route.
10. Image-output roles must stay on OpenRouter.

## Sources

- `project/research/RES-0720-llm-text-and-science-bank.md`, read 2026-10-31 - the frame design.
- `project/adrs/ADR-0100-model-gateway-tiers-budgets.md` and `project/specs/SPC-0100-model-gateway-roles-tiers-budgets-and-egress.md`, read 2026-10-31 - the gateway.
- `project/adrs/ADR-0130-task-text-from-checked-frames-and-science-bank.md` and `project/specs/SPC-0130-task-text-from-checked-frames-and-the-science-bank.md`, read 2026-10-31 - the pipeline.
- `src/templates/spec.ts`, `src/server/task-source.ts`, `src/shared/i18n.ts` and `src/shared/voice/gate.ts`, read 2026-10-31 at commit 7f13d5a - how task text is built.
- [Haiku 5.5 overview](https://platform.claude.com/docs/en/models/haiku-5-5/overview), read 2026-10-31 - id, thinking, effort.
- [Pricing](https://platform.claude.com/docs/en/about-claude/pricing), read 2026-10-31 - prices.
- [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), read 2026-10-31 - the output format.
- [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention), read 2026-10-31 - zero retention.
- [OpenRouter provider selection](https://openrouter.ai/docs/guides/routing/provider-selection), read 2026-10-31 - routing fields.
- [OpenRouter zero data retention](https://openrouter.ai/docs/guides/features/zdr), read 2026-10-31 - endpoints.
