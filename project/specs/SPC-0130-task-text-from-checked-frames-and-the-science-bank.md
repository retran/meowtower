---
id: SPC-0130
artifact: spec
status: live
revised: 2026-10-31
states: [REQ-7760, REQ-7770, REQ-7780, REQ-7640, REQ-1236, REQ-1238, REQ-1546, REQ-3600, REQ-3602, REQ-3618, REQ-3622, REQ-3624, REQ-3626, REQ-3628, REQ-3640, REQ-3642, REQ-3646, REQ-3650, REQ-3652, REQ-3654, REQ-3656, REQ-3658, REQ-3660, REQ-7550, REQ-7560, REQ-7570, REQ-7580]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Task text from checked story frames and the science question bank

## Scope

This document covers the text of a task that a language model helps write, and the natural science questions: the story frame and its placeholders, the pipeline every frame passes, the frame library the parent accepts, the live queue that tops up a block, the rotation that keeps frames and questions from repeating, the science bank and its approval, and the events, commands and verify checks this part owns. It is written at the component level: the frame service and the science module in the server, the check module they share, the `frames` table, the content files, the two review screens and the commands. A reader who needs routes and packets reads SPC-0030.

It leaves out what other parts define. The task's steps, numbers, answer, word-problem structures and readability measures belong to ADR-0040, and SPC-0040 states them. Which slot gets a block top-up or a science topic belongs to ADR-0070, and the topics E1 to E5 to ADR-0050. The gateway, its roles, tiers, keys and budgets belong to ADR-0100, and SPC-0100 states them; which judge answers a safety check belongs to ADR-0350. The Master's text and how a name she gave enters a frame belong to ADR-0110, and SPC-0110 states them. The forbidden list belongs to ADR-0160. A Diary puzzle's text comes from the approved puzzle bank of ADR-0280, and ADR-0280 states it. The detailed explanation and the base of the check module belong to SPC-0120. The list of contexts, the context a frame carries, the format and context holds, the side-slot rule and the frame picker's first steps belong to ADR-0410. The Dutch probe's text pairs, after the MVP, belong to ADR-0430.

## Boundary

### Surfaces

| Surface | What it is |
| --- | --- |
| A frame | Text with a placeholder for every number, name and counted noun, such as «{hero} купила на Ярмарке Весов {a} {item:gen} по {b} монет…» ("{hero} bought {a} {item} at the Fair of Scales for {b} coins each…"), with its structure, locale, floor, characters, the role of each number placeholder, one context from `content/contexts.yaml` (ADR-0410) and a content hash. |
| `FrameRequest` | The request to the author model: the solution graph's steps, the role of each number placeholder, the floor, the characters as canon names or `{hero}` and `{familiar}`, the context it asks for (ADR-0410), the length and vocabulary limits, and a request for 5 variants of plain text with no joke. |
| The frame reply | Strict JSON: an array of 5 frame objects. |
| `CheckedText` | The check module's output type, which SPC-0120 defines; this part adds the frame checks to it. |
| The `frames` table | Every live frame with its status. |
| `content/science.ru.json` | The science bank: questions for the topics E1 to E5, each a choice from four, each wrong option with the misconception it tests, each question with a content hash; the file declares `repeatWindowDays`. |
| The science review screen | Each question with its correct option and each wrong option beside its misconception, with approve and reject. |

### Events

| Event | Payload |
| --- | --- |
| `live_frames_paused` | the game day |
| `science_approved` | the question's hash and `candidateSince` |
| `science_rejected` | the question's hash and `candidateSince` |
| `item_shown`, fields this part adds | `frameId`, `frameSource` (`live` or `template`), `frameRepeat: true` on a frame shown within 14 game days, and `repeat: true` on a science question shown within its window |

### Live frame statuses

`ready`, `rejected` with the failing step, `unused`, `used` and `expired` at the end of the game day it was made for.

### Failure states

| State | Next step | Audience |
| --- | --- | --- |
| `frame_rejected` with the failing step | the variant is dropped; a live one counts towards the day's share | the owner, as a daily count by step in the status report |
| `live_frames_paused` | template text until the game day ends | the owner, in the status report |
| `science_unapproved` | the question isn't served | the parent, as a count on the science review screen |
| `science_repeat` | the question shown longest ago is used and marked | the parent, on the science review screen |
| `science_topic_empty` | the Director takes another topic | the parent, on the science review screen |

The player sees none of these states.

### Permitted dependencies

The frame service calls models only through the gateway (ADR-0100) and runs its checks only through the shared check module. The science module imports nothing from the gateway, and the verify command's import rule fails the build if it does. Both write to the log only through `appendEvents`. The verify command reads acceptance only from the newest snapshot in `data/snapshots/`, never from the live database. The library in play is read from the log's events together with `content/frames.ru.json`, and a file alone never adds a frame or a question. The Parent Room's screens write the parent's events, behind the PIN.

## Behaviour

### A frame carries the only model text in a task

A model writes story frames and nothing else that enters a task's text, and a Diary puzzle's text comes only from ADR-0280's approved bank. The engine fixes the task's steps, numbers and answer first, then picks a frame for the task's structure, and code fills the placeholders (REQ-3602). The filler puts names in as SPC-0110 states.

### The pipeline

Every frame passes these steps, offline and live alike:

1. The request gives the author model the template's text with its placeholders, the role of each number placeholder, the language, the setting from `content/frames/prompt.<language>.json` and the limits on length: up to 3 sentences more than the template, each at most 22 words or as long as the template's longest sentence (REQ-7570). The request holds no name she chose and no text of hers.
2. The request asks for 5 variants (REQ-3622). A reply that doesn't match the schema is discarded whole (REQ-3624).
3. Code checks each variant. Every placeholder the request lists appears exactly once, and no other placeholder appears (REQ-3626). The text holds no digit or number word beyond those its template writes, from `content/numerals.<language>.json`, such as «два» (two), «половина» (half) or «дюжина» (dozen) (REQ-3628). The length limit and the forbidden-word check of the language pass.
4. One request to `FRAME_JUDGE_MODEL` reads every variant that passed step 3 with the template's text beside them. It answers per variant whether the text is unsafe, holds a joke or changes the task (REQ-3600, REQ-7750, REQ-7760). A variant passes when `unsafe` and `changed` are under 0.2 and `joke` under 0.5.
5. The same request chooses the best variant (REQ-7770). The choice stands when its variant passed; otherwise the likeliest variant that passed takes its place. A passing variant not chosen turns `unused`.

When the judge errs, times out or answers outside the expected form, nothing is kept and the task shows its template text (REQ-7780).

A task statement carries no joke (REQ-1546). The request asks for plain text with no joke, the safety question in step 4 also asks whether the frame holds one, and the parent judges every template's fixed text at stage acceptance.

### Every model text passes the safety check

Every text a language model writes reaches the player only as `CheckedText`, and only the check module builds one after its safety check passes (REQ-3600). Frames pass it in step 4, explanations as SPC-0120 states, and the Master's text as SPC-0110 states.

### Every request is recorded

Every request to a model goes through the gateway, which records the request and its response in `llm_log` (REQ-3646). A sandbox call is recorded in the sandbox's own file (ADR-0340).

### Task text is live

Every task a frame can carry takes a live frame, and no frame library exists (REQ-7550). The owner decided this on 2026-10-31, because a text written in advance can't follow the current story.

A frame replaces only a task's question, so every template takes one, and buttons, input and answer come from the template. A second attempt keeps the first attempt's frame with its own numbers. After the server shows a task, and when a session starts, the frame queue prepares frames for the next 2 tasks in the background (REQ-3618), running steps 1 to 5. The chosen variant turns `ready`. When the server shows a task, it takes that task's `ready` frame, which turns `used`, and fills it with the engine's numbers.

A task with no `ready` frame shows its template text with no wait (REQ-7560). The `item_shown` event carries `frameSource`, `live` or `template`, and `frameId` on a live one.

The `frames` table keeps every live frame with its status and never deletes one (REQ-3642). At 50,000 rows it reports once to the owner. A frame counts as checked when it has finished the pipeline or failed a step, and as rejected when it failed a step. A reply discarded whole at step 2 counts as 5 checked frames, all rejected. From the tenth checked frame of a game day, when more than 30% of that day's checked frames are rejected, the server writes `live_frames_paused` and shows template text until the game day ends (REQ-3640).

The request holds the places `arc`, `adventure` and `situation` for the summaries of the story arc, the adventure and the current game situation. They stay empty until a decision moves `TASK_TEXT_MODEL` to the player tier (REQ-7580).

### The science bank

Natural science questions come only from `content/science.ru.json`, never from text generated during play (REQ-3660). An agent or a person drafts the questions offline into the file. Each wrong option names the misconception it tests (REQ-1238), and the parent judges each option on the science review screen. The verify command fails a build whose bank holds fewer than 40 questions in any topic (REQ-1236).

A question reaches the player only when the log holds a `science_approved` event for its current hash, written when the parent approves it on the science review screen (REQ-3650). Rejecting a question there writes `science_rejected`. Both events carry `candidateSince`, the day the question entered `content/science.ru.json`. An edited question has a new hash, keeps its first `candidateSince` and waits for a new approval.

When the Director gives a science slot a topic, the question is the least recently shown approved question of that topic, never-shown first, with ties broken by the day's seed. The window is 45 game days before stage 0.5 (REQ-3652) and 90 game days from stage 0.5 (REQ-3654), and the verify command fails a build whose `repeatWindowDays` doesn't match its stage. When the topic has no approved question outside the window, the question shown longest ago comes (REQ-3656), and its `item_shown` carries `repeat: true` (REQ-3658).

### Language

Frames follow the parent's language: Russian, English or Dutch, each with its own `content/numerals.<language>.json`. Science questions exist in Russian only, in `content/science.ru.json`.

## Failure paths

| Condition | What happens |
| --- | --- |
| The author model's reply is outside the schema | The server discards the whole reply; a live one counts as 5 checked live frames, all rejected. |
| A placeholder is missing or appears twice | Step 3 rejects the variant with `frame_rejected`. |
| A variant holds a digit or a number word such as «дюжина» | Step 3 rejects it. |
| A variant breaks the length, readability or forbidden-word limits | Step 3 rejects it. |
| The judge finds a variant unsafe, joking or changed | Step 4 rejects the variant. |
| The judge errs or times out | The task shows its template text. |
| More than 30% of a game day's checked live frames are rejected, from the tenth on | `live_frames_paused`; template text until 04:00. |
| `TASK_TEXT_MODEL` is unset, the adventure budget is spent, no model is reachable or no `ready` frame waits | The task shows its template text. |
| A science question has no approval of its current hash | `science_unapproved`; it isn't served. |
| A topic has no approved question outside its window | `science_repeat`; the question shown longest ago is served with `repeat: true`. |
| A topic has no approved question at all | `science_topic_empty`; the Director takes another topic. |
| The science module imports the gateway | The verify command fails the build. |
| A topic holds fewer than 40 questions, or `repeatWindowDays` doesn't match the stage | The verify command fails the build. |
| The `frames` table passes 50,000 rows | It reports once to the owner and keeps every row. |
