---
id: TSK-0998
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-5066, REQ-5068, REQ-5072, REQ-5156, REQ-5414, REQ-5106, REQ-5112, REQ-6408, REQ-6410]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A hint rung gives one real step and names quantities on every word problem, and each estimate and plan choice has one record

After this task, a hint rung gives real step k of the template's computation graph without its result, every T1 to T4 word problem's rung names each given by its quantity and prints no given's value, and `planChoice`, estimates and hint-ladder length each live in one event only.

## Acceptance criteria

1. Given a template with one, two and three real steps, when the ladder is built, then it has one rung for each real step up to three, rung k holds step k without its result, no rung holds the last calculation's result, and rung 1 holds no number unless it is a basic fact's strategy rung (REQ-5106, REQ-5112, REQ-6408, REQ-6410). Closed by: a ladder test over the fixture templates, and the parent's judgement at the stage 0.3 review that each rung is a real step, because no program tells a real step from a padded one.
2. Given 1,000 seeds for each tier T1 to T4, when the task packet and every hint reply are built for a solvable and an unanswerable problem of the same tier and answer form, then the field shapes are identical and no rung prints a given's value (REQ-5414). Closed by: a packet test over 1,000 seeds per tier.
3. Given an `AnswerIn` that carries `insufficient` on an item with an estimate, when it is sent without an estimate pick, then the server accepts it and records no estimate, while any other answer without a pick gets `estimate_missing` (REQ-5414). Closed by: a route test for both cases.
4. Given a stored version 1 `attempt_submitted`, when it is read, then the upcaster sets `hintMaxLevel` to 3, and a new attempt records its ladder's length beside the deepest rung seen (REQ-5066, REQ-5156). Closed by: a replay test over version 1 attempts and a schema test.
5. Given an attempt that follows a plan and a hint rung on a puzzle, when the log is read, then `planChoice` is in `plan_submitted` alone, `attempt_submitted` holds `openingPhase` and no `planChoice`, `hint_shown` holds task rungs only and a puzzle's rung writes `puzzle_hint` (REQ-5068, REQ-5072). Closed by: a schema test that fails on a second copy of any of the three facts.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0360 entries 4 to 8 and 21: move `planChoice` into `plan_submitted`, fold every field the addendum adds into the one version 2 of each payload, set the upcaster's `hintMaxLevel` to 3, and change the ladder builder and the word-problem rung text as the amended ADR-0080 and ADR-0250 lines say. The Russian rung wording for quantities is the owner's content under ADR-0160; use placeholders that name the quantity until it exists, such as «сколько конфет в первой коробке» from the entry's example.

## Depends on

Nothing in this epic. The epics realising ADR-0020, ADR-0080, ADR-0220, ADR-0240 and ADR-0250 supply the event types, the ladder, the estimate step and the unanswerable problems; until they exist, the tests run on fixture templates and fixture payload schemas, and the real types are left to those epics.

## Evidence

Not yet.

## Left alone

The plan route and the `plan_draft` event, which TSK-1008 builds, and the hint ladder's Russian strings, which ADR-0160 and the parent own.
