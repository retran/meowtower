---
id: ADR-3200
artifact: adr
status: approved
revised: 2026-10-31
addresses: [REQ-7690, REQ-7700, REQ-7710, REQ-7730, REQ-7740]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3200. Every template takes a live frame, each language has its forbidden list, an adventure may spend $5 and a month $200, and the model log keeps everything

## Decision

A frame replaces only a task's question. Buttons, input and answer come from the template, so all 1851 templates take a frame. The judge of ADR-3210 reads the options, unmarked, and a picture as its SVG source. A frame should keep every number its template writes and add none, and the judge's `numbers` answer takes 1 from the score of a frame that doesn't. It may add up to 3 sentences to the template's own, each no longer than 22 words or the template's longest sentence. A second attempt takes a new story that continues the first (ADR-3210).

`content/shaming.en.json` and `content/shaming.nl.json` join the Russian list, and the gate reads the list of the game's language for frames and for every line that leaves the server.

The adventure budget is $5 and the month's limit $200, by the game's count across routes. The owner sets the key limit on OpenRouter to $200.

`llm_log` keeps every body for good, because the owner decided on 2026-10-31 that nothing is deleted from the logs.

The gateway gains `GATEWAY_MODE`: `verify` spends from the offline key and records, `replay` answers from `tests/recordings/` and fails as `recording_missing`, and the server refuses to start in any mode but `play`. `npm run verify:live` runs real frames on its own budget. The egress guard cleans names and contact details from every request. `llm_call`, `budget_month_spent` and `live_frames_paused` join the log.

Once this is accepted, every template in all three languages takes a frame. What doesn't work yet: the rest of ADR-0100's plan needs callers that don't exist, listed below.

## Why

RES-4300 finds the buttons and the words can come apart, and that the budgets hold their 31-day rule at $167.40. The owner set the figures and the rule on logs on 2026-10-31.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep 1042 of 1851 templates | Fewer checks on picture tasks | The owner asked for all templates |
| Let the model write the options too | One text for all | The model would handle numbers and answers, and buttons depend on exact values |
| Render pictures to images for the solver | The solver sees what the player sees | A rasteriser adds a dependency to the server; the source is enough to try first |

## What it costs

A log kept for good grows without bound: each row repeats its prompt, so `llm_log` adds several kilobytes a call. At $200 a month the worst case is 20 times the daily spend the earlier figures planned. Picture tasks may fail their blind solve often, because reading SVG is harder than reading text; such a task shows its prepared setting (ADR-3270) and counts as rejected, which can trip the 30% pause. An agent wrote the two new lists, so they are thinner than the Russian one, which holds every word form.

## What would reverse it

- Picture tasks push the day's rejection share past 30% on 3 game days in any 14.
- `llm_log` fills the disk.

## Consequences

- SPC-0100, SPC-0130 and SPC-0160 state the new rules.
- ADR-0160's rule that a person writes each list changes: an agent drafts, and the owner approves by merging.

## How I will know it was realised

1. A test frames all templates in three languages and their buttons, input and answer stay equal.
2. A test shows a solver a picture task's options and SVG with no answer marked.
3. A test finds each language's fixtures matched by its list, and every fixed string passes.
4. A test stops an adventure at $5 and a month at $200, across routes.
5. A test replays a recording and fails a request with none.

## What this does not settle

- ADR-0100's plan steps 2, 7 and 12 to 16: explanations, the judge, the Master's fallback and pick, the bake-off and the page on what leaves the Mac, because none of their callers exists. Also `content/providers.json` and the zero-retention listing at start, whose response I could not read.

## Amends

- ADR-0100: the adventure's limit is $5 and the month's $200; the nightly deletion of bodies and the 1 GB report on them go away.
- ADR-0160: an agent may draft a forbidden list; the gate reads the game's language.
- ADR-3100: tasks with buttons and pictures take frames; `live_frames_paused` is an event; the blind solve shows options.

Amended by ADR-3210, approved on 2026-10-31: this record no longer addresses REQ-7720, which are superseded.

## Plan

1. Frames on every template (`src/templates/spec.ts`, `src/server/task-source.ts`, `src/server/frames/`).
2. Lists per language (REQ-7730; `content/shaming.*.json`, `src/shared/voice/gate.ts`).
3. Budgets (REQ-7690, REQ-7700, REQ-7710; `src/server/gateway/gateway.ts`).
4. Modes, recordings and events (`src/server/gateway/recording.ts`, `tools/verify-live.ts`).
5. The log keeps everything (REQ-7740).
