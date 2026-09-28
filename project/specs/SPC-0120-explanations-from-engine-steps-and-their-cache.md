---
id: SPC-0120
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-0600, REQ-0602, REQ-0604, REQ-0606, REQ-6500, REQ-0610, REQ-0612, REQ-0614, REQ-0616, REQ-0618, REQ-0620, REQ-0622, REQ-0624, REQ-6502, REQ-0628, REQ-0630, REQ-0632, REQ-0634, REQ-0636, REQ-0638]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer and show the failing case. -->

# Detailed explanations from the engine's steps, their checks and their cache

## Scope

This document covers the detailed explanation the player gets after she spends a guiding thread on it: how the server chooses between a stored variant, a new variant from `EXPLAIN_MODEL` and the engine's template explanation, the placeholders the model writes in place of numbers, the seven checks a variant passes, the cache `explain_cache` and its groups, the offline command that fills it, the parent's hide control, and the events and failure states the part logs. It states ADR-0120 as ADR-0350 and ADR-0370 amend it, and the reasons for its rules and values live there. It is written at the component level: the explanation service in the server, its check pipeline, its cache table, the command and the Parent Room controls it needs. A reader who needs routes and packets reads SPC-0030, and one who needs code reads the epics that build this part.

It leaves out what other parts define. The thread economy, when she may spend a thread and the short solution belong to ADR-0080 as ADR-0220 amends it; a Volley fact and Session 0 offer no detailed explanation (ADR-0290, ADR-0330). The solution graph, its step results, traps and the template explanation `explain` belong to ADR-0040, and the kinds of answer to SPC-0040. The verify command and its stages belong to ADR-0190, which runs the template checks this document defines. The gateway, its tiers, the explanation budget, the daily generation count, what the request may carry off the Mac and what the blind solver may see belong to ADR-0100, and SPC-0100 states them. Which judge answers the safety check belongs to ADR-0350. The forbidden list and its lemma checker belong to ADR-0160, and ADR-0160 states them. How a familiar's line looks on screen belongs to ADR-0150, and the Parent Room's layout to ADR-0180. Model text in a task statement belongs to ADR-0130, which extends the check module this document defines.

## Boundary

### Surfaces

| Surface | What it is |
| --- | --- |
| `POST /api/item/:itemId/explain` and the SSE message `explanation_ready` | The route that buys the explanation and the message that brings its text, as SPC-0030 states. This part produces the text the message carries. |
| `ExplainRequest` | The request to `EXPLAIN_MODEL` through the gateway: the task text as shown, the solution graph and the engine's answer, the player's answer, the matched trap with the engine's calculation for it, the error class, and the familiar's kind, the name she gave it, its traits and its sample lines. |
| The model's reply | Strict JSON: an array of familiar lines, with no speaker field. |
| The safety request | The explanation's lines with every placeholder unfilled, as one yes-or-no question to the judge ADR-0350 routes the check to. |
| The blind-solve request | To `LIVE_CHECK_MODEL`: the task text and the filled explanation, and nothing else. |
| `explain_cache` | The cache table of ADR-0020: groups and variants, each variant with its status `visible`, `hidden` or `retired`, its prompt version, its check results and its reuse failure count. |
| `content/numerals.ru.json` | The number-word lexicon for Russian: cardinals, ordinals, fraction words such as «половина» (half) and «треть» (third), and collective words such as «пара» (pair) and «дюжина» (dozen). ADR-0130 uses the same file for frames. |
| `CheckedText` | The output type of the check module. Only passing the checks builds one, and the server's player-facing message types accept model text only as `CheckedText`. |
| `npm run explain:generate` | The command that fills the cache outside any session. |
| The Parent Room's variant list | Stored variants by group, each with its familiar, its reuse failure count and a hide control. |

### Placeholders

The model writes a placeholder wherever a number belongs:

| Placeholder | Filled with |
| --- | --- |
| `{sN.a}`, `{sN.b}` | the operands of step N of the solution graph |
| `{sN.value}` | the result of step N |
| `{answer}` | the engine's answer |
| `{given}` | the player's answer, or nothing after `dont_know` and `insufficient` |
| `{trap.value}` | the matched trap's result |

### The group key

A task's group is its template id, template version, trap id or `none`, graph shape, familiar id, the kind of answer she gave (`correct`, `partial`, `wrong`, `dont_know` or `insufficient`) and locale. The graph shape is the solution graph with its numbers removed, written as one canonical string of operations and argument references, such as `mul(in,in);sub(in,s1)`, and hashed with SHA-256 to 16 hex characters.

### Events this part logs

| Event | Payload |
| --- | --- |
| `explanation_shown` | the id of the `explanation_bought` event, the source `variant`, `template` or `solution`, and the variant id or the failure reason |

The event never carries the explanation's text. `explanation_bought` and `thread_spent` belong to the thread spend that ADR-0080 logs.

### Failure states

| State | Next step | Audience |
| --- | --- | --- |
| `explanation_fallback` with reason `check_failed` and the failing check | show the template explanation | the owner, in `llm_log`, as a daily count by check |
| `explanation_fallback` with reason `timeout` | show the template explanation | the owner, in `llm_log` |
| `explanation_fallback` with reason `provider_failed` | show the template explanation | the owner, in `llm_log` |
| `budget_explain_spent` | take a stored variant, else the template explanation | the parent, in the day's cost line |
| `explanation_fallback` with reason `reuse_failed` | show the template explanation and count the failure on the variant | the parent, beside the variant |
| `explanation_template_rejected` | show the short solution framed by the familiar | the owner, as a verify failure |
| `explain_cache_ceiling` | report once and keep serving | the owner, in the status report |

### Permitted dependencies

The explanation service reads the solution graph, the traps and `explain` from the engine (ADR-0040) and calls a model only through the gateway (ADR-0100). It writes to the log only through `appendEvents` and to the cache only through `explain_cache`. The check module depends on the lemma checker ADR-0160 owns and on the lexicon file, and on nothing in the story. The Master's and the planner's context builders (ADR-0110) read story events only, and never `explain_cache`, `explanation_shown` or the check module's output. The client imports nothing from this part and gets its text only through SPC-0030's message.

## Behaviour

### Choosing the source

After the thread spend, the server computes the task's group and takes the first source that applies:

1. If the group holds fewer than 3 visible variants of the current prompt version, and the gateway reports explanation budget left, at least $0.03 of the day's budget and live generations left under ADR-0100's daily cap, the server asks `EXPLAIN_MODEL` for a new variant.
2. Otherwise, if the group holds a visible variant, the server takes the next one in turn. The group keeps a counter, and its variants come in the order they were stored, round and round (REQ-0628).
3. Otherwise the server shows the template explanation.

A group therefore holds at most 3 visible texts of the current prompt version at any one time, and the server shows no other variant (REQ-6502). The server shows only variants of the current prompt version: a new prompt version starts every group empty, and the old variants turn `retired`. Over time she can meet more than 3 texts in one group: up to 3 new ones after each prompt-version change, and one new one after each variant the parent hides.

### The request and the voice

`ExplainRequest` carries the player's answer and any matched trap with the engine's calculation for it, so the text can address the answer she gave (REQ-0604) and the trap it matched (REQ-0606). It carries the familiar's kind, name, traits and sample lines, and the reply is an array of that familiar's lines with no speaker field, so every line reaches her in her familiar's voice (REQ-0602) and no other speaker can enter. The client draws every explanation line under the familiar's portrait (ADR-0150). No player-facing content string and no stored variant holds «Объяснитель» (Explainer) or "Explainer", and the Explainer has no place in the world (REQ-0636).

The text names nobody: the familiar says «ты» (you). The model writes no number, only placeholders, and code fills every placeholder from the engine's numbers after the checks, so every number she reads is one the engine computed or the answer she entered, and none is written by the model (REQ-6500).

### The checks

A new variant passes seven checks in this order, and the first failure stops the pipeline:

1. The reply matches the JSON schema, and every placeholder names a step, an operand or a value the graph holds (REQ-0612). In a group of kind `dont_know` or `insufficient`, a reply that uses `{given}` fails.
2. The text holds at most 8 sentences, counted by a sentence splitter over all its lines together (REQ-0610).
3. The text holds no digit and no word from the lexicon, matched by lemma (REQ-6500).
4. Each step's `{sN.value}` appears, their first appearances follow the graph's order, and `{answer}` comes last (REQ-0600, REQ-0614). Checks 1, 4 and 7 enforce REQ-0600 for the numbers and their order only: no check reads the words that name an operation, so a text that says «сложим» (let's add) where the engine multiplied passes all seven. The parent's reading of 50 visible variants at stage 0.2 acceptance and the hide control cover the operation words.
5. The text holds no form of a word on the forbidden list, matched by lemma with ADR-0160's checker (REQ-0620).
6. The safety check passes on the text with its placeholders unfilled, so it sees no number and, with `{given}` still a placeholder, no answer of hers (REQ-0618, REQ-0638). The check runs on the judge ADR-0350 routes it to, and on `SAFETY_MODEL` when that judge errs or times out.
7. Code fills the placeholders. `LIVE_CHECK_MODEL` reads the task text and the filled explanation, states a final answer in free form, and the engine's answer checker compares that answer with the engine's, the way it compares hers (REQ-0616). The solver sees no answer and no list of options.

Checks 1 to 5 run in code on the Mac. A variant that passes all seven enters `explain_cache` as `visible`, and the server shows it at once as `CheckedText`.

Before the server shows a stored variant, it fills the variant with the current task's numbers and runs check 7 again (REQ-0616), and shows the variant only if that solve passes. The same 10 seconds from the spend bound the reuse. If the solver reaches another answer, the variant stays stored, its reuse failure count grows by one, and the server shows the template explanation with reason `reuse_failed`. If the solve can't run, because the gateway reports the budget spent, can't reach `LIVE_CHECK_MODEL` or passes the 10 seconds, the server shows the template explanation, and the variant's reuse failure count stays as it was. A spent budget logs ADR-0100's state `budget_explain_spent`; an unreachable solver logs `explanation_fallback` with reason `provider_failed`, and the 10 seconds passing logs it with reason `timeout`.

### The template explanation and the fallback

The server shows the template explanation, framed by the same familiar, in six cases: a new variant fails a check, the reply hasn't passed every check within 10 seconds of the spend, the gateway can't reach a model, the budget has run out and the group holds no variant (REQ-0622), a stored variant's blind solve reaches another answer, or a stored variant's blind solve can't run. Inside the 10 seconds, the model's reply must arrive within 7, and the safety check and the blind solve get the rest. The template explanation also passes checks 2 and 5 at run time; if it fails either, the server shows the engine's short solution framed by the same familiar line pool.

The verify command (ADR-0190) runs checks 6 and 7 on each template's explanation and on its short solution, filled with numbers from the template's sample seeds, and fails a template whose text fails either with `explanation_template_rejected` (REQ-0616, REQ-0618).

The thread spent pays for whatever she sees. The server keys the explanation to its `explanation_bought` event, so a fallback logs no second debit and no refund (REQ-0624). A repeated `POST /api/item/:itemId/explain` on an item already charged spends nothing: the server produces the text again by the order above and sends it as `explanation_ready`, as SPC-0030 states.

### What the log and the story hold

The server logs `explanation_shown` for each explanation she sees. The text stays in `explain_cache` and on the stream, and never enters a story event or the Master's or the planner's context (REQ-0634).

### Offline variants

`npm run explain:generate` runs with no session open and fills groups that have a trap (REQ-0630). For such a group the engine computes the value she would have given and the kind of answer that value earns, so `{given}` takes the trap's value and the request needs no answer of hers. The command runs checks 1 to 7 with numbers from the template's sample seeds and stops at 3 visible variants a group. The game serves these variants the way it serves live ones.

### The parent's hide control

The Parent Room lists stored variants by group, each with its familiar and its reuse failure count, and a hide control on each (REQ-0632). Hiding turns a variant `hidden`: the server never shows it and never deletes it, and it no longer counts towards the group's 3 visible variants, so the group can fill again.

### The cache's size

Live generation adds at most ADR-0100's daily generation cap of rows a day, and `npm run explain:generate` adds at most 3 visible rows for each trap group of each prompt version. At 10,000 rows it reports `explain_cache_ceiling` once to the owner and keeps serving. Retired rows older than 30 days drain on their own. Emptying the cache loses no fact about play, because `explanation_shown` records which source and variant she saw.

### Language

Explanations exist in Russian only. The prompt, the forbidden list and the numeral lexicon are per language, and `content/numerals.ru.json` is the only lexicon.

## Failure paths

| Condition | What happens |
| --- | --- |
| The reply is outside the schema, cites a step the graph lacks, or uses `{given}` after `dont_know` or `insufficient` | Check 1 fails; the template explanation shows, and `explanation_fallback` logs `check_failed` with check 1. |
| The text holds 9 or more sentences | Check 2 fails; the template explanation shows. |
| The text holds a digit or a number word, such as «половина» | Check 3 fails; the template explanation shows. |
| A step's result is missing, or the results come out of the graph's order | Check 4 fails; the template explanation shows. |
| The text holds a form of a forbidden word | Check 5 fails; the template explanation shows. |
| The safety check says no | Check 6 fails; the template explanation shows. |
| The routed judge errs, times out or gives an answer SPC-0100 counts as a fallback on the safety check | The gateway asks `SAFETY_MODEL` the same question, as SPC-0100 states. |
| `SAFETY_MODEL` also errs or times out | The template explanation shows with reason `provider_failed`. |
| The blind solver reaches another answer | Check 7 fails; the template explanation shows. |
| The reply hasn't passed every check 10 seconds after the spend | The template explanation shows with reason `timeout`, keyed to the same `explanation_bought`, with no second debit and no refund. |
| The gateway can't reach a model | The template explanation shows with reason `provider_failed`. |
| The explanation budget or the day's live generations are spent | A stored variant shows if the group has one and its blind solve can run and pass, else the template explanation. |
| A stored variant's blind solve can't run, from a spent budget, an unreachable `LIVE_CHECK_MODEL` or the 10 seconds passing | The template explanation shows, with `budget_explain_spent`, or `explanation_fallback` with reason `provider_failed` or `timeout`; the variant's reuse failure count stays as it was. |
| The blind solver reaches another answer from a stored variant filled with the current numbers | The template explanation shows with reason `reuse_failed`; the variant stays stored and its reuse failure count grows by one. |
| The template explanation fails check 2 or 5 | The short solution shows, framed by the familiar; `explanation_template_rejected` fails the verify command. |
| A template's explanation or short solution fails the safety check or the blind solve with the sample seeds | The verify command fails with `explanation_template_rejected`. |
| The client reconnects or retries after the spend | The server spends nothing, produces the text again by the same order and sends it as `explanation_ready`. |
| `EXPLAIN_MODEL` is unset | Every explanation comes from a stored variant or the template. |
| The parent hides a variant | The server never shows it, and the group may take a new variant in its place. |
| `explain_cache` reaches 10,000 rows | `explain_cache_ceiling` reports once; serving goes on. |

## Open review findings

- Rejected: give each rule its reason (the $0.03 reserve, «ты», the order of the checks, the solve on every reuse, the 7-second split, the short-solution fallback, "never deletes", the 10,000-row ceiling and the 30-day drain). A specification states what the system does and never why (S8); ADR-0120 holds these reasons.
