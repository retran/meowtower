---
id: SPC-0130
artifact: spec
status: live
revised: 2026-09-29
states: [REQ-1236, REQ-1238, REQ-1546, REQ-3600, REQ-3602, REQ-3604, REQ-3606, REQ-3608, REQ-3612, REQ-3614, REQ-3616, REQ-3618, REQ-3620, REQ-3622, REQ-3624, REQ-3626, REQ-3628, REQ-3630, REQ-3632, REQ-3634, REQ-3636, REQ-3638, REQ-3640, REQ-3642, REQ-3644, REQ-3646, REQ-3650, REQ-3652, REQ-3654, REQ-3656, REQ-3658, REQ-3660, REQ-6928]
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
| `npm run frames:generate` | Offline, outside any session, with `GEN_MODEL` and `CHECK_MODEL`: writes passing variants to the candidates file in `data/`, and runs the blind solves of edited candidates. |
| `data/exports/frames.ru.json` | The library as the log holds it, written after each change. |
| `content/frames.ru.json` | The committed copy of the library. |
| The `frames` table | Every live frame with its status. |
| `content/science.ru.json` | The science bank: questions for the topics E1 to E5, each a choice from four, each wrong option with the misconception it tests, each question with a content hash; the file declares `repeatWindowDays`. |
| The frame review screen | Each candidate with its structure, floor and context, the context's change control and «нет подходящего сюжета» (no fitting setting) of ADR-0410, and «принять / отклонить / поправить» (accept / reject / edit); an edited candidate still waiting for its check shows as waiting, with no accept control. |
| The live frame list | Each live frame with its status, and «В библиотеку» (To the library). |
| The science review screen | Each question with its correct option and each wrong option beside its misconception, with approve and reject. |

### Events

| Event | Payload |
| --- | --- |
| `frame_accepted` | the frame's text, hash and `context`, `as_written` or `as_edited`, and `candidateSince` |
| `frame_candidate_rejected` | the candidate's hash and `candidateSince` |
| `frame_candidate_expired` | the candidate's hash and `candidateSince` |
| `frame_removed` | the frame's hash |
| `live_frames_paused` | the game day |
| `science_approved` | the question's hash and `candidateSince` |
| `science_rejected` | the question's hash and `candidateSince` |
| `item_shown`, fields this part adds | `frameId`, `frameSource` (`library` or `live`), `frameRepeat: true` on a frame shown within 14 game days, and `repeat: true` on a science question shown within its window |

### Live frame statuses

`ready`, `rejected` with the failing step, `used`, `final_failed`, `expired` at the end of the game day it was made for, and `moved`.

### Failure states

| State | Next step | Audience |
| --- | --- | --- |
| `frame_rejected` with the failing step | the variant is dropped; a live one counts towards the day's share | the owner, as a daily count by step in the status report |
| `frame_final_failed` | the task takes a library frame; the frame counts towards the day's share | the owner, in the status report |
| `live_frames_paused` | library frames until the game day ends | the owner, in the status report |
| `live_queue_empty` | the task takes a library frame | the owner, in the status report |
| `frame_repeat` | the frame shown longest ago among those the frame picker doesn't leave out is used and marked | the owner, as a count by structure |
| `frame_none_for_structure` | the Director takes another structure | the owner, as a verify failure |
| `frame_unaccepted` | the server skips a frame in the file that has no acceptance | the owner, reported once at start |
| `frame_edit_failed` | the edit stays a candidate with its failures in words | the parent, on the review screen |
| `frame_candidates_full` | `frames:generate` adds no more to that structure | the owner, reported once a run |
| `science_unapproved` | the question isn't served | the parent, as a count on the science review screen |
| `science_repeat` | the question shown longest ago is used and marked | the parent, on the science review screen |
| `science_topic_empty` | the Director takes another topic | the parent, on the science review screen |
| `frames_acceptance_unchecked` | the verify command counts every frame in `content/frames.ru.json` | the owner, as a verify warning |

The player sees none of these states.

### Permitted dependencies

The frame service calls models only through the gateway (ADR-0100) and runs its checks only through the shared check module. The science module imports nothing from the gateway, and the verify command's import rule fails the build if it does. Both write to the log only through `appendEvents`. The verify command reads acceptance only from the newest snapshot in `data/snapshots/`, never from the live database. The library in play is read from the log's events together with `content/frames.ru.json`, and a file alone never adds a frame or a question. The Parent Room's screens write the parent's events, behind the PIN.

## Behaviour

### A frame carries the only model text in a task

A model writes story frames and nothing else that enters a task's text, and a Diary puzzle's text comes only from ADR-0280's approved bank. The engine fixes the task's steps, numbers and answer first, then picks a frame for the task's structure, and code fills the placeholders (REQ-3602). The filler puts names in as SPC-0110 states.

### The pipeline

Every frame passes these steps, offline and live alike:

1. The request gives the author model the problem's steps, the role of each number placeholder, such as `{a}` a price and `{b}` a quantity, the floor, the characters in the scene, the context the frame is to be set in, which ADR-0410 chooses, and the limits on length and vocabulary (REQ-3620). The length limit is at most k+1 sentences of at most 14 words for a k-step problem, with the question as its own last sentence; the vocabulary limits are ADR-0040's readability measures. The request holds no name she chose and no text of hers.
2. The request asks for 5 variants (REQ-3622). A reply that doesn't match the schema is discarded whole (REQ-3624).
3. Code checks each variant. Every placeholder the request lists appears exactly once, and no other placeholder appears (REQ-3626). The text holds no digit and no number word from `content/numerals.ru.json`, such as «два» (two), «половина» (half) or «дюжина» (dozen), matched by lemma (REQ-3628). The length limit, the readability measures `frameMetrics` and the forbidden-word check pass.
4. The safety check passes on the text with its placeholders unfilled. The check module sends it as a `JudgeRequest` to the gateway, which asks the judge ADR-0350 routes the check to and, when that judge errs or times out, `SAFETY_MODEL`, as SPC-0100 states.
5. Code fills the frame with three sets of numbers from the template's generator under three seeds, and the name placeholders with fixed stand-in names. A checking model solves each filled problem blind, stating an answer in free form, and the engine's answer checker compares it with the engine's answer for that set. The frame passes only when all three match (REQ-3630). The solver sees the problem's text and nothing else: no answer and no list of candidate answers (REQ-3634). Offline the solver is `CHECK_MODEL`, and live it is `LIVE_CHECK_MODEL`.

A task statement carries no joke (REQ-1546). The request asks for plain text with no joke, the safety question in step 4 also asks whether the frame holds one, and the parent judges every library frame for it at acceptance and every template's fixed text at stage acceptance.

### Every model text passes the safety check

Every text a language model writes reaches the player only as `CheckedText`, and only the check module builds one after its safety check passes (REQ-3600). Frames pass it in step 4, explanations as SPC-0120 states, and the Master's text as SPC-0110 states.

### Every request is recorded

Every request to a model goes through the gateway, which records the request and its response in `llm_log` (REQ-3646). `npm run frames:generate` calls the same gateway module on the offline key, and a sandbox call is recorded in the sandbox's own file (ADR-0340).

### The frame library

The library holds only frames the parent accepted, as written or as edited (REQ-3638). `npm run frames:generate` puts each variant that passed steps 1 to 5 into the candidates file. It holds at most the larger of 5 and one and a half times the structure's shortfall against the stage's target, 5 frames from stage 0.2 and 20 from stage 0.4, as candidates for a structure, counting the candidates already waiting, and reports `frame_candidates_full` when it stops. Each candidate records `candidateSince`, the day it first entered the candidates file, and keeps it through every edit. At the first change of game day after a candidate turns 60 days old, the server writes `frame_candidate_expired` and the candidate leaves the file. A candidate waiting for the check of its edit doesn't expire until the first `frames:generate` after the edit has run steps 4 and 5 on it.

The frame review screen offers accept, reject and edit on each candidate (REQ-3636). Rejection writes `frame_candidate_rejected`. An edit reruns step 3 at once and shows the parent in words what the edited text failed. An edit that passes step 3 shows as waiting for its check, with no accept control, until the next `frames:generate` runs steps 4 and 5, the safety check and the three blind solves, on it. When they pass, the screen offers accept on the edited candidate again; when they fail, it shows the failure in words and the edit stays a candidate. The Parent Room writes every acceptance: `frame_accepted` with the frame's text, hash and `context`, marked `as_written` or `as_edited`, and the candidate's `candidateSince`. The review time of any decision on a candidate is the day of its event minus its `candidateSince`.

The library in play is the set of frames whose hash the log holds in a `frame_accepted` event and in no later `frame_removed` event. The server writes it to `data/exports/frames.ru.json` after each change, and the owner commits that copy to `content/frames.ru.json`. The server serves a frame from the committed file only when the log holds its acceptance.

Probes, the Guardian ladder (лестница Стражей) and every fallback case take their frames only from the library (REQ-3604). A frame reaches the player only from the library or the live queue, with one exception after the MVP: a Dutch probe letter takes its frames from a probe pair the parent approved under ADR-0430, whose frames each passed the checks ADR-0430 states in place of steps 3 to 5. A Dutch probe letter isn't one of the probes REQ-3604 names, and its text exists only once the owner amends the Russian-only rule of `CLAUDE.md`, as ADR-0430 states.

The verify command counts a frame of `content/frames.ru.json` only when the newest snapshot in `data/snapshots/` holds its `frame_accepted` and no later `frame_removed`. With no snapshot, it counts every frame in the file and reports `frames_acceptance_unchecked`. It fails a build whose counted frames number fewer than 5 for any word-problem structure from stage 0.2 (REQ-3606), or fewer than 20 from stage 0.4 (REQ-3608), and one whose file holds a frame that fails step 3. When a snapshot exists, verify doesn't count a frame added to the file by hand, and the server skips that frame at start as `frame_unaccepted`.

### Choosing a frame

The frame for a library task comes from the accepted frames of its structure and locale. The picker first leaves out the frames ADR-0410's context hold and side-slot rule leave out, then takes a never-shown frame first and otherwise the least recently shown frame, with ties broken by the task's seed. The game never shows a frame it showed in the last 14 game days while the structure has a frame it hasn't shown, unless every frame it hasn't shown is set in a context the context hold keeps back or the side-slot rule keeps out of the slot (REQ-6928). When every frame not left out was shown within 14 game days, the picker takes the one shown longest ago (REQ-3612), which ADR-0410 extends to a structure whose unshown frames are all left out. A game day runs from 04:00 to 04:00, as `gameDayOf` computes it. When the frame was shown within 14 game days, its `item_shown` carries `frameRepeat: true` (REQ-3614).

### Live frames

A live frame serves only a task the Director adds to complete a node's full block after a probe escalates (REQ-3616). Live generation runs while `LIVE_FRAMES` is on, the adventure budget has money left and the day's rejection share is under its limit.

While it runs, the server looks at the block top-up slots the Director has placed in the next 2 to 3 rooms. For each slot's structure it asks `LIVE_GEN_MODEL` for 5 variants set in a context already shown on the slot's subtype, puts them through steps 1 to 5, and keeps each passing one in the `frames` table as `ready`, ahead of the player's arrival in those rooms (REQ-3618). A `ready` frame turns `expired` at the end of the game day it was made for. When the slot's subtype has no shown context, the server makes no live frame for it, and the task takes a library frame (ADR-0410).

When the server builds the task for a top-up slot, it fills the oldest `ready` frame of the structure whose context has been shown on the slot's subtype with the task's own numbers, and `LIVE_CHECK_MODEL` solves that exact problem blind once more (REQ-3632). If the solve passes, the frame turns `used` and the task shows it. If the solve fails, the frame turns `final_failed`, and the task takes a library frame, as it does when the queue holds no ready frame. The server builds each task, its final solve included, before the player enters the room. A top-up task that takes a library frame is no side slot under ADR-0410's side-slot rule.

The `frames` table keeps every live frame with its status and never deletes one (REQ-3642). At 50,000 rows it reports once to the owner. On the live frame list, «В библиотеку» is offered only on a live frame in `ready`, `used` or `expired`. It writes the frame's `frame_accepted` event as written, with the context its request named and `candidateSince` set to the game day on which the frame was made, which its `frames` row holds, and marks the frame `moved`, in one action (REQ-3644).

A live frame counts as checked when it has finished the pipeline or failed a step, the final solve included, and as rejected when it failed a step, so a `final_failed` frame counts as both. A reply discarded whole at step 2 counts as 5 checked live frames, all rejected. From the tenth checked live frame of a game day, when more than 30% of that day's checked live frames are rejected, the server writes `live_frames_paused` and takes every frame from the library until the game day ends; generation starts again the next game day (REQ-3640).

### The science bank

Natural science questions come only from `content/science.ru.json`, never from text generated during play (REQ-3660). An agent or a person drafts the questions offline into the file. Each wrong option names the misconception it tests (REQ-1238), and the parent judges each option on the science review screen. The verify command fails a build whose bank holds fewer than 40 questions in any topic (REQ-1236).

A question reaches the player only when the log holds a `science_approved` event for its current hash, written when the parent approves it on the science review screen (REQ-3650). Rejecting a question there writes `science_rejected`. Both events carry `candidateSince`, the day the question entered `content/science.ru.json`. An edited question has a new hash, keeps its first `candidateSince` and waits for a new approval.

When the Director gives a science slot a topic, the question is the least recently shown approved question of that topic, never-shown first, with ties broken by the day's seed. The window is 45 game days before stage 0.5 (REQ-3652) and 90 game days from stage 0.5 (REQ-3654), and the verify command fails a build whose `repeatWindowDays` doesn't match its stage. When the topic has no approved question outside the window, the question shown longest ago comes (REQ-3656), and its `item_shown` carries `repeat: true` (REQ-3658).

### Language

Frames and science questions exist in Russian only: `content/frames.ru.json`, `content/science.ru.json` and `content/numerals.ru.json`. A frame's context carries no language, so a frame in another language can carry the same tag. The Dutch probe pairs of ADR-0430 come after the MVP and only once the owner amends the Russian-only rule of `CLAUDE.md`.

## Failure paths

| Condition | What happens |
| --- | --- |
| The author model's reply is outside the schema | The server discards the whole reply; a live one counts as 5 checked live frames, all rejected. |
| A placeholder is missing or appears twice | Step 3 rejects the variant with `frame_rejected`. |
| A variant holds a digit or a number word such as «дюжина» | Step 3 rejects it. |
| A variant breaks the length, readability or forbidden-word limits | Step 3 rejects it. |
| The safety check says no, or finds a joke | Step 4 rejects the variant. |
| The routed judge errs or times out on the safety check | The gateway asks `SAFETY_MODEL` the same question. |
| The blind solver misses the engine's answer on any of the three sets | Step 5 rejects the variant. |
| The final blind solve of a live frame fails | The frame turns `final_failed`, and the task takes a library frame. |
| No `ready` frame waits for a top-up slot | `live_queue_empty`; the task takes a library frame. |
| More than 30% of a game day's checked live frames are rejected, from the tenth on | `live_frames_paused`; library frames until 04:00. |
| `LIVE_FRAMES` is off, the adventure budget is spent or no model is reachable | Every task takes a library frame. |
| A structure has no frame unshown for 14 game days, or every unshown frame is held back or kept out of the slot | The frame shown longest ago among those not left out is used, and `item_shown` carries `frameRepeat: true`. |
| A library frame's acceptance lacks `context` | `frame_untagged`; the server never serves it and reports it once at start (ADR-0410). |
| The parent marks a candidate «нет подходящего сюжета» | `frame_context_missing`; the candidate stays unaccepted until a list version holds a fitting context, or expires at 60 days (ADR-0410). |
| The context hold leaves no frame for a template | `transfer_hold_no_frame`; the item builder takes another template or a bare one, or the Director another subtype (ADR-0410). |
| A block top-up slot's subtype has no shown context | The task takes a library frame. |
| A structure has no accepted frame | `frame_none_for_structure`; the Director takes another structure. The verify command fails when its counted frames for the structure number fewer than 5 from stage 0.2, or fewer than 20 from stage 0.4. |
| `content/frames.ru.json` holds a frame with no `frame_accepted` in the log | `frame_unaccepted`; the server never serves it and reports it once at start. |
| An edited frame fails step 3 | `frame_edit_failed`; it stays a candidate, and the screen shows its failures in words. |
| A structure's candidates reach the larger of 5 and one and a half times its shortfall | `frame_candidates_full`; `frames:generate` adds no more to it. |
| A candidate turns 60 days old | At the next change of game day the server writes `frame_candidate_expired`, and the candidate leaves the file, unless it waits for the check of its edit, which it keeps until the first `frames:generate` after the edit has run steps 4 and 5 on it. |
| The live frame is `rejected` or `final_failed` | The live frame list offers no «В библиотеку» on it. |
| An edited candidate hasn't yet passed steps 4 and 5 | The review screen shows it as waiting for its check, with no accept control. |
| The verify command finds no snapshot in `data/snapshots/` | `frames_acceptance_unchecked`; it counts every frame in the file. |
| `content/frames.ru.json` holds a frame the newest snapshot has no acceptance for | The verify command doesn't count it. |
| A science question has no approval of its current hash | `science_unapproved`; it isn't served. |
| A topic has no approved question outside its window | `science_repeat`; the question shown longest ago is served with `repeat: true`. |
| A topic has no approved question at all | `science_topic_empty`; the Director takes another topic. |
| The science module imports the gateway | The verify command fails the build. |
| A topic holds fewer than 40 questions, or `repeatWindowDays` doesn't match the stage | The verify command fails the build. |
| The `frames` table passes 50,000 rows | It reports once to the owner and keeps every row. |
