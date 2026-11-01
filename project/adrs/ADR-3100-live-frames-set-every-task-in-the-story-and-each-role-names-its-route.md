---
id: ADR-3100
artifact: adr
status: done
pr: 70
revised: 2026-10-31
addresses: [REQ-7550, REQ-7570, REQ-7580, REQ-7590, REQ-7600, REQ-7610, REQ-7620, REQ-7630, REQ-7640, REQ-7650, REQ-7660, REQ-7680]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3100. Live frames set every task in the story, written by Claude Haiku 5.5, and each model role names its route, OpenRouter or the direct Anthropic API

## Decision

Task text is live only. A model writes a frame for each task the server is about to show, code checks it, and the engine fills its numbers. The frame library, its acceptance by the parent and its rotation go away. The owner decided this on 2026-10-31, because a text written in advance can't follow the current story.

The live frame path:

1. After the server shows a task, and when a session starts, it prepares frames for the next 2 tasks in the background, so the player never waits.
2. The request is a `ContentRequest` holding the template's text with its placeholders, the role of each number, the language, the setting from `content/frames/prompt.<language>.json` and the length limits. It asks for 5 variants in a fixed schema. It holds no name or text of the player.
3. Code checks each variant in turn: every placeholder of the template appears exactly as often as in the template, no digit and no number word from `content/numerals.<language>.json` appears, the text has at most 3 sentences of at most 22 words, and in Russian the text gate passes. I chose 3 and 22, because a setting needs more room than ADR-0130's k+1 sentences of 14 words on a one-step task.
4. The first variant that passes goes to the safety question on `SAFETY_MODEL`, then to 3 blind solves on `LIVE_CHECK_MODEL`, on the task's own numbers and 2 other draws of the same template. The engine's checker compares each free answer.
5. A frame that passes turns `ready` in the `frames` table. The task takes it when shown, and it turns `used`. Every frame stays in the table with its status.

A task whose answer kind is `choice`, `set`, `order`, `compare`, `pair`, `time` or `line`, or that has a picture, keeps its template text for now, because `present` parses buttons out of the text and a blind solver can't see a picture. A task with no ready frame shows its template text: when the model is slow, the gateway is off, a budget is spent or the day's rejection share passes 30%. `item_shown` carries `frameId` and `frameSource`, `live` or `template`.

The request type holds three places, `arc`, `adventure` and `situation`, typed as `null`. They stay empty until a decision moves `TASK_TEXT_MODEL` to the player tier, because a summary is story material and the content tier must not carry it.

The gateway gains a second route. Each role is one value in `.env`, `<route>:<model>`, with the routes `openrouter` and `anthropic`: `TASK_TEXT_MODEL=anthropic:claude-haiku-5-5` or `LIVE_CHECK_MODEL=openrouter:anthropic/claude-haiku-5.5`. A value with no known route stops the start as `model_config_invalid`. Each request goes by exactly its role's route, with no failover to the other. The tier stays in code. A player-tier role may name `anthropic` only while `ANTHROPIC_ZDR_ATTESTED=true`, the owner's statement that the organisation has zero retention. An image-output role may name only `openrouter`.

`TASK_TEXT_MODEL` is a new role: content tier, play key, adventure bucket, 30 s, 4,000 `max_tokens`, and no default, so an unset role leaves live frames off. Claude Haiku 5.5 enters the play configuration by this record, as `anthropic:claude-haiku-5-5`, or `openrouter:` with OpenRouter's id. `OPENROUTER_PLAY_KEY` and `ANTHROPIC_API_KEY` carry the keys.

Both routes return one normalised result: text, stop reason, tokens and a cost in US dollars. OpenRouter's cost comes from `usage.cost`. A direct call's cost comes from the dated price table in `src/server/gateway/prices.ts`. Reservation, the adventure's $1.5 and the month's $60 count `llm_log` across every route. The $60 key limit on OpenRouter stays as a second ceiling on that route alone.

Every prompt is in the game's language, in `content/frames/prompt.<language>.json`, because the owner asked for it on 2026-10-31. The canon's names take a language of their own there, such as Nevelwade for «Туманный Брод»; I chose the Dutch names and the parent can change them.

`llm_log` keeps each request body as it left and each reply as it came. The Parent Room becomes an admin page: figures of play and spend first, then the frame counts, the game audit task by task and the model audit in full, also as JSON at `/audit/play` and `/audit/llm`. It stays on the Mac's loopback listener. The player's screens fade in over 220 ms, and a wait for the server shows a moving thread; both stop under `prefers-reduced-motion`. A frame is prepared ahead, so the thread marks a slow server and never a wait for the model.

Once this is accepted, a configured server sets numeric word problems in the Tower's world in Russian, English and Dutch. What doesn't work yet: tasks with buttons or pictures, the summaries, the verify and replay modes, a daily reconciliation of the direct route and the egress guard, which this path doesn't need because its requests hold no player material.

## Why

RES-4290 finds that placeholders keep the numbers with the engine, so a story wrapper can't change an answer. It finds that a role-level route fits ADR-0100's rule that configuration changes a model and never a tier, because the code limits the routes a tier allows. Haiku 5.5 at $0.10 and $0.50 per million tokens keeps a frame far below the adventure's $1.5 (RES-4290). The owner chose both routes, one selected per role, and live text only, on 2026-10-31.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: template text | No model call, stable text for measurement | No setting, so the owner's outcome isn't met |
| ADR-0130's offline library in three languages | Every frame read by the parent, no call at play time | About 420 frames to review, and a frame can't know the current story; the owner chose live only |
| Whole task text written by the model | The simplest prompt, every task kind covered | The model handles the numbers, so a slip changes the maths, and no check exists for it |
| One route setting for the whole gateway | One value, fewer combinations | The owner wants each kind of work on its own provider |

## What it costs

The parent no longer reads a frame before the player does, so the checks carry the whole weight of a text aimed at a child. English and Dutch frames pass no forbidden-word list, because ADR-0160 says a person writes each list and none exists; only the safety model reads them. Varying text adds noise to what a task measures, and probes lose their stable text. A frame costs up to 5 calls, about 5 cents an adventure by my estimate. On the direct route the only limit is the gateway's own count, so a bug that bypasses `llm_log` meets no ceiling; the owner should set a workspace limit if Anthropic offers one. If nobody attends, frames stop at the budget and play goes on with template text.

## What would reverse it

- `llm_log` shows more than 30% of frames rejected on 3 game days in any 14.
- A parent or a test finds a live frame that changes what the task asks, or a text unfit for the player.
- A measurement review finds that live text moves the model's estimates against template text.

## Consequences

- ADR-0130's library, acceptance, rotation and frame-move rules no longer hold, and SPC-0130 states the live path. The science bank is unchanged.
- ADR-0100 gains the route; its rejected alternative of a direct provider API stands only for a route per provider without a role-level choice.
- SPC-0100 gains the role, the route value and the second key.
- ADR-0160's gate covers frames in Russian alone until a person writes the other lists.
- A migration adds `llm_log` and `frames`.

## How I will know it was realised

1. A test parses role values and refuses an unknown route, an image role on `anthropic`, and a player-tier role on `anthropic` with no attestation.
2. A test with mocked transports shows each request reaches only its role's route, and both routes write the same `llm_log` shape.
3. A test rejects a frame with a missing or repeated placeholder, a digit and a number word in each language.
4. A test fails one of the 3 blind solves and the frame turns `rejected`, and no solve request holds the answer.
5. A test plays a session with a mocked model: the task shows the frame with the engine's numbers, and its answer checks as before. With the model failing, the task shows its template text with no wait.
6. A test fills the month's limit on one route and the other route is refused.
7. A check of the request type refuses a non-null summary at compile time.

## What this does not settle

- How the summaries are written, and the record that moves the role to the player tier.
- How tasks with buttons or pictures take a frame.
- Forbidden-word lists in English and Dutch.
- The recording and replay of model calls, and the rest of ADR-0100's gateway plan.
- Which model `SAFETY_MODEL` and `LIVE_CHECK_MODEL` use.

## Amends

- ADR-0100: each role's value is `<route>:<model>`; the routes are `openrouter` and `anthropic`; the month's limit counts every route; the role table gains `TASK_TEXT_MODEL`.
- ADR-0130: every task a frame can carry takes a live frame; the frame library, its review screen, its rotation and «В библиотеку» are gone; a task with no ready frame shows its template text; frames exist in all three languages.

Amended by ADR-3200, approved on 2026-10-31, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended on 2026-10-31: this record no longer addresses REQ-7560, which REQ-7890 superseded.

## Plan

1. Role values, routes and prices parse and refuse bad configuration (REQ-7590, REQ-7610, REQ-7630; `src/server/gateway/config.ts`, `src/server/gateway/prices.ts`).
2. Both routes return one result, each call goes through budgets and `llm_log` (REQ-7600, REQ-7620; `src/server/gateway/`, `migrations/0013_gateway.sql`).
3. The frame request, its setting and its summary places (REQ-7570, REQ-7580; `src/server/frames/request.ts`).
4. The code checks, the safety question and the blind solves (`src/server/frames/check.ts`, `content/numerals.*.json`).
5. The queue prepares frames ahead, and a task takes a ready frame or its template text (REQ-7550, REQ-7560; `src/server/frames/queue.ts`, `src/server/play.ts`, `src/server/main.ts`).
6. Prompts live per language (REQ-7640; `content/frames/`).
7. The admin page and the two audits (REQ-7650, REQ-7660, REQ-7670; `src/server/admin.ts`, `src/server/audit.ts`, `src/server/parent.ts`).
8. Motion on the player's screens (REQ-7680; `src/client/style.ts`, `src/client/play.ts`).
