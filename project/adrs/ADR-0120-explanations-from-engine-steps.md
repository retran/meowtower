---
id: ADR-0120
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-0600, REQ-0602, REQ-0604, REQ-0606, REQ-0608, REQ-0610, REQ-0612, REQ-0614, REQ-0616, REQ-0618, REQ-0620, REQ-0622, REQ-0624, REQ-0626, REQ-0628, REQ-0630, REQ-0632, REQ-0634, REQ-0636, REQ-0638, REQ-2604, REQ-2606, REQ-2716]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0120. A model writes each explanation from the engine's steps with placeholders, code checks it and a blind solver reads it, the cache keeps three variants a group, and the template explanation covers every failure

## Decision

When the player spends a guiding thread on a detailed explanation, the server builds the explanation from the engine's solution graph (ADR-0040) in one of three ways, and the player always sees it as her familiar speaking. The reader of this record is evaluating the design, so the rules come first and the mechanics after them.

The server serves a stored variant, asks `EXPLAIN_MODEL` for a new one, or shows the engine's template explanation, in this order:

1. The server computes the group of the task: template id, template version, trap id or `none`, graph shape, familiar id and locale. The graph shape is the solution graph with its numbers removed, written as one canonical string of operations and argument references (for example `mul(in,in);sub(in,s1)`) and hashed with SHA-256 to 16 hex characters. I chose this encoding because RES-0600 leaves it open and a string of operations is the part of the graph that the explanation's words depend on.
2. If the group holds fewer than 3 visible variants of the current prompt version and the gateway (ADR-0100) reports explanation budget left, the server asks `EXPLAIN_MODEL` for a new variant.
3. Otherwise, if the group holds a visible variant, the server takes the next one in turn: the group keeps a counter, and variants come in the order they were stored, round and round.
4. Otherwise the server shows the template explanation, the engine's `explain` for the task and trap (ADR-0040).

The request to `EXPLAIN_MODEL`, `ExplainRequest`, holds exactly the list RES-0600 gives and RES-3900 conclusion 7 confirms. It carries the task text as shown, the solution graph and answer, the player's answer, any matched trap with the engine's calculation for it, the error class, and the familiar's kind, the name she gave it, its traits and sample lines. It holds no node id, estimate, history, time or name of the player (REQ-2604). The model replies in strict JSON, an array of familiar lines with no speaker field, so the reply can't introduce a second voice (REQ-0636).

The model's text carries no number. It writes placeholders in their place: `{sN.a}`, `{sN.b}` and `{sN.value}` for step N, `{answer}` for the engine's answer, `{given}` for the player's answer and `{trap.value}` for the trap's result. The text names nobody: the familiar says «ты» (you) and never needs a name, which keeps declension out of the cache. Code fills every placeholder from the engine's numbers after the checks below, so every number she reads is one the engine computed (REQ-0608).

A new variant passes these checks in this order before it is shown, and the first failure stops the pipeline:

1. The reply matches the JSON schema, and every placeholder names a step, operand or value the graph holds (REQ-0612).
2. The text holds at most 8 sentences, counted by a sentence splitter over all lines together (REQ-0610).
3. The text holds no digit and no number word. The number words are a per-language lexicon, `content/numerals.ru.json` now, matched by lemma: cardinals, ordinals, fraction words such as «половина» (half) and «треть» (third), and collective words such as «пара» (pair) and «дюжина» (dozen). ADR-0130 uses the same lexicon for frames.
4. Each step's `{sN.value}` appears, and their first appearances follow the graph's order, with `{answer}` last (REQ-0600, REQ-0614).
5. The text holds no form of a word on the forbidden list, matched by lemma with the checker ADR-0160 owns (REQ-0620).
6. The safety check passes on the text with its placeholders unfilled, which also holds no player's answer, because `{given}` is still a placeholder (REQ-0618, REQ-0638). It runs on `JUDGE_MODEL` (Jev) as a yes-or-no question, and on `SAFETY_MODEL` when Jev errs or times out (RES-0600, RES-1600).
7. Code fills the placeholders. `LIVE_CHECK_MODEL` then gets only the task text and the filled explanation (REQ-2606), states a final answer in free form, and the engine's own answer checker compares it with the engine's answer, so fractions and other forms compare the way her answers do (REQ-0616). The solver sees no answer and no list of options.

Checks 1 to 5 run in code on the Mac. Only a variant that passes all seven enters `explain_cache` with status `visible`, and the server shows it at once.

A stored variant is shown only after one more blind solve with the current task's numbers, check 7 again, because a text that read correctly with one set of numbers can mislead with another, and REQ-0616 holds for every explanation shown. That solve costs about $0.002 (RES-2700). If it fails, the variant stays stored, the server records the failure against it, and the template explanation is shown.

The server shows the template explanation in four cases (REQ-0622, REQ-2716):

- a new variant fails a check;
- the model's reply hasn't passed every check within 10 seconds of the spend;
- the gateway can't reach a model;
- the budget has run out and the group holds no variant.

The template explanation also passes checks 2 and 5 at run time. If it fails either, the server shows the engine's short solution (ADR-0080) framed by the same familiar line pool, so a failure after a failure still gives her an explanation.

The guiding thread pays once. ADR-0080 debits the thread when she spends it and writes an `explanation_bought` event; the server keys the explanation to that event, so a retry, a reconnect or a fallback returns the same explanation and never debits or refunds (REQ-0624). The log records `explanation_shown` with the id of the `explanation_bought` event, the source (`variant`, `template` or `solution`) and the variant id or failure reason, and never the text, so explanation text never enters a story event or the Master's context (REQ-0634).

`npm run explain:generate` fills the cache outside any session (REQ-0630). It covers only groups with a trap, because for those the engine computes the value she would have given, so the request needs no player's answer. It runs checks 1 to 7 with numbers from the template's own sample seeds, and it stops at the same 3 visible variants a group.

The Parent Room lists stored variants by group, each with its familiar, and a hide control on each (REQ-0632). A hidden variant is never shown and never deleted, so the parent's choice holds. It no longer counts towards the 3 visible variants, so the group can fill again.

The prompt has a version. The server shows only variants of the current prompt version, so a new version starts every group empty, and the old variants move to status `retired`. I read REQ-0626 as at most 3 texts a group at any one time; across a prompt-version change she can meet up to 3 new texts.

Once this is accepted, a spent thread yields an explanation in her familiar's voice within 10 seconds, or the template explanation, on top of ADR-0010 to ADR-0110. If `EXPLAIN_MODEL` is unset, OpenRouter is unreachable or the budget is spent, every explanation still arrives, from the template, so removing this increment leaves the thread economy working. Three things don't work yet. Explanations in English and Dutch need a prompt, a forbidden list and a numeral lexicon per language. The Parent Room screen waits for ADR-0180. A group without a trap has no stored variant before she first meets it, because offline generation can't fill it.

## Why

The research fixes most of this. RES-0600 records the owner's draft: the model writes only from the engine's solution, returns placeholders in place of numbers, passes five checks, falls back to the template within 10 seconds, and is cached by task features with up to 3 variants. RES-0600 also resolves that the familiar speaks and the Explainer stays out of the world, because a character she never meets adds nothing (Lester and others, 1997, cited there). RES-1600 and RES-0600 put the safety check on Jev only on text with its placeholders unfilled, which keeps her answer away from TypeSafe.

Where the research left a point open, I chose, and each choice has its reason:

- The group key and the graph-shape encoding, because RES-0600 names the features but not their encoding.
- The blind solve on every show of a stored variant. RES-0600 asks for one blind reading of the finished explanation, and a stored text meets new numbers each time, so one reading at creation checks a different explanation from the one she sees.
- No names in the text, because RES-1600 records that names don't always decline reliably, and a cached text holding a name breaks when she renames her familiar.
- Offline generation for trap groups only, because a group without a trap depends on an answer only she can give.
- The short solution after a rejected template explanation, because RES-0600 names no step after the template, and D7 of the method asks what happens after a failure after a failure.

The checks that code can run come first because they cost nothing and remove most bad replies before a paid call. The safety check comes before the fill because REQ-0638 forbids it to see numbers or her answer. The blind solve comes last because it needs the filled text.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: the template explanation only | Costs nothing, answers at once, sends nothing off the Mac, and can't state a wrong step | RES-0600 and REQ-0602 ask for her familiar's own voice and REQ-0604 for an explanation that addresses her answer, and a fixed template per trap does neither for an answer no trap predicts |
| The model writes numbers, and code extracts and checks them | Natural Russian numerals in context («трёх зелий», of three potions) and a simpler prompt | REQ-0608 forbids any number the model writes, and an extractor that misses one number word shows her an unchecked number |
| Offline only: every variant written ahead and read by the parent before use | A person reads every text before she does, and she never waits | Groups without a trap need her answer, so offline can't cover them; the groups multiply by familiars and template versions, so the parent's queue would end approved unread (D22); REQ-0630 asks for offline variants in addition to live ones |
| One blind solve at creation, none on reuse | Half the calls and no network needed for a stored variant | A stored text meets new numbers on every show, and REQ-0616 holds for the text she actually sees |

## What it costs

Money: a new variant costs about $0.01 to $0.02 plus a blind solve of about $0.002, and a reuse about $0.002; at the 4 to 8 explanations a day RES-2700 expects, most from the cache, that is about $0.03 to $0.15 a day. `EXPLAIN_BUDGET_USD_PER_DAY = 0.3` and 20 live generations a day cap it (RES-0600, RES-2700; ADR-0100 enforces both). These caps were imposed by the research, and I add one choice inside them: the server stops asking for new variants when less than $0.03 of the day's budget is left, so reuse solves can still run.

Time: she waits up to 10 seconds, a limit RES-0600 imposes. I chose an internal split with slack: the model's reply must arrive within 7 seconds, and the Jev call and blind solve get the rest. Jev answers in 70 to 500 ms (Copes, cited in RES-1600). A reuse waits only for one blind solve, about 1 to 2 seconds by my estimate, which the stage 0.2 measurement below checks. The 10 seconds, the 7-second split, the $0.03 reserve and the 10,000-row cache ceiling stand in the Baselines table of ADR-0190.

Honesty of the check: the blind solver can copy the final result, because REQ-0614 makes the explanation name every step's result, `{answer}` included. So the blind solve catches an explanation whose wording leads to a different answer, but it can't catch wrong words between correct numbers, such as «сложим» (let's add) where the engine multiplied. The numbers and their order come from the engine, which narrows the error to the words about an operation, and the parent's hide control is the only remedy this decision has for it. I state it as the strongest objection below.

Work: the parent does no required work. Reading variants and hiding one is optional, and if nobody opens that screen for a month, explanations keep working and nothing piles up. The building agent maintains the prompt, the numeral lexicon and the sentence splitter, and the owner reads the failure counts in `llm_log` and the status report. The design sends no notification to anyone, so its interruption budget is zero.

The strongest objection: a variant that names correct numbers in the right order but calls the wrong operation passes all seven checks. The rotation then shows it on about one in three tasks of that group until the parent finds it and hides it, so the familiar teaches the very misconception the thread was spent to fix.

## What would reverse it

- If the template explanation is shown for more than 30% of spends over any 14 days after stage 0.2, because the model misses the 10 seconds or fails the checks that often, generation costs money and adds little, and the template-only option wins. (A threshold I chose.)
- If the parent, reading a sample of 50 visible variants at stage 0.2 acceptance, finds one that names a wrong operation, the design adds a step audit: a second `LIVE_CHECK_MODEL` question asking whether each stated result follows from the stated operation.
- If, after 8 weeks of play, the same trap recurs on her next task of the same node as often after a generated explanation as after a template explanation, the familiar's voice buys nothing measurable, and the template-only option wins.
- If the reuse blind solve takes more than 3 seconds at the 90th percentile in `llm_log` at stage 0.2, stored variants are checked once a group with three number sets in place of once a show, as ADR-0130 does for frames.

## Consequences

- ADR-0040's solution graph must expose each step's operation, operands and result, the trap's calculation, and a sample seed per trap, and every template's `explain` output must pass checks 2 and 5; the verify command (ADR-0190) runs both over the sample seeds of every template.
- ADR-0080 must give each thread spend an id and must keep the short solution available after an attempt.
- ADR-0100's gateway carries every call here: `EXPLAIN_MODEL` and `LIVE_CHECK_MODEL` on the player tier with zero retention, `JUDGE_MODEL` with `SAFETY_MODEL` as its fallback, the explanation budget and the 20-generation count, and a record of every request and response in `llm_log`.
- ADR-0110 must build the Master's and the planner's context from story events only, and `explanation_shown` is not one.
- ADR-0150 must render every explanation line under the familiar's portrait, with no other speaker.
- ADR-0160 owns the forbidden list and the lemma checker; this decision adds the numeral lexicon beside it as a per-language content file.
- ADR-0180's Parent Room gets the variant list with its hide control.
- `explain_cache` (ADR-0020's cache table, RES-2550) holds groups and variants with status `visible`, `hidden` or `retired`, the prompt version, the check results and the reuse failure count. Emptying it loses no fact about play, because the log holds which variant or source she saw.
- The shared check module this decision defines, with the schema, sentence, placeholder, numeral, forbidden-word, safety and blind-solve steps, is the one ADR-0130 extends for frames. Its output type, `CheckedText`, can only be built by passing the checks, and the server's player-facing message types accept only `CheckedText` for model text, so a program, and not a reviewer, stops an unchecked model text reaching her.
- `explain_cache` grows by at most 20 rows a day, the live generation cap. It has a ceiling of 10,000 rows, a value I chose, that reports once to the owner in the status report, and retired rows older than 30 days drain automatically, which is safe because a retired variant is never shown.

The failure states, each with its next step and its one audience:

`explanation_fallback` is the state ADR-0080 names; this decision gives it a reason, so the log and `llm_log` tell the causes apart:

| State | Next step | Audience |
| --- | --- | --- |
| `explanation_fallback` with reason `check_failed` and the failing check | show the template explanation | the owner, in `llm_log`, as a daily count by check |
| `explanation_fallback` with reason `timeout` | show the template explanation | the owner, in `llm_log` |
| `explanation_fallback` with reason `provider_failed` (ADR-0100's state) | show the template explanation | the owner, in `llm_log` |
| `budget_explain_spent` (ADR-0100's state) | take a stored variant, else the template explanation | the parent, in the day's cost line |
| `explanation_fallback` with reason `reuse_failed` | show the template explanation, count the failure on the variant | the parent, who sees the count beside the variant and may hide it |
| `explanation_template_rejected` | show the short solution framed by the familiar | the owner, as a verify failure (ADR-0190) |
| `explain_cache_ceiling` | report once, keep serving | the owner, in the status report |

The player sees the same familiar and an explanation in every state, and every state but the last two is deliberately indistinguishable to her, because the reason a text came from the template tells her nothing she can use.

The security boundary protects three things, most likely damage first:

1. The player from a wrong explanation, defended by the engine's numbers, the order check and the blind solve.
2. The player from shaming or unsafe words, defended by the forbidden list and the safety check.
3. Her answer from leaving the Mac beyond the one request she triggered, defended by the player tier's zero retention and REQ-2602.

Her answer is a number from the maths keypad, so the request carries no free text of hers that could steer the model.

Premortem, written as though it already happened: by March 2027 she had stopped spending threads on explanations. `llm_log` showed that `EXPLAIN_MODEL` replies on Vertex took 8 to 12 seconds at busy hours, so 40% of spends fell back to the template, and she learned that the familiar's detailed explanation sounded like a textbook. Separately, a variant for a chain problem said «сложим» where the engine multiplied; the blind solver copied `{answer}` and passed it, and it ran for three weeks before the parent read it. Both failures show in the reversal conditions above, which is why they are written as numbers.

## How I will know it was realised

1. A test feeds six bad model replies: one holding a digit, one holding «половина», one with 9 sentences, one citing a step the graph lacks, one naming step results out of order, and one holding a forbidden word. Each shows the template explanation and logs `explanation_fallback` with reason `check_failed` and the right check.
2. A test replaces the model with one that answers after 11 seconds, and the template explanation appears at 10 seconds with the same thread spend id and no second debit or refund in the log.
3. A test records every request to `JUDGE_MODEL` and `SAFETY_MODEL` for explanations and finds no digit, no number word and no value of her answer in any of them.
4. A test records every request to `LIVE_CHECK_MODEL` for explanations and finds only the task text and the explanation, with no answer and no list of options.
5. Over a simulated 30 days, no group shows more than 3 distinct texts of one prompt version, and each group's texts appear in round-robin order.
6. A test over `llm_log` for a simulated adventure finds no Master or planner request holding any 20-character run of a shown explanation.
7. A static check finds no player-facing content string and no stored variant holding «Объяснитель» or "Explainer".
8. `npm run explain:generate` run with no session open fills trap groups, and the game then shows those variants.
9. After the parent hides a variant in the Parent Room, a simulated month never shows it.
10. At stage 0.2 acceptance, the parent reads 50 visible variants and judges the familiar's voice (REQ-0602), whether each addresses the given answer (REQ-0604) and the trap (REQ-0606), and whether any names a wrong operation. `llm_log` gives the 90th percentile of the time from spend to shown explanation, which must be under 10 seconds.

## What this does not settle

- The thread economy: what a thread costs, when she earns one, and when she may spend it on an explanation. ADR-0080 settles these.
- Enforcing the explanation budget and the daily generation count (REQ-2704, REQ-2706), the provider lists and the rule that the request leaves the Mac only on a spend (REQ-2602). ADR-0100 settles these.
- The forbidden list itself, its lemma matching and the rule that every line from every source passes it (REQ-3326, REQ-3328). ADR-0160 settles these.
- The template explanation's content and the solution graph (ADR-0040), and how the familiar's lines look on screen (ADR-0150).
- Keeping `explain_cache` through a recompute and emptying it without losing a fact (REQ-2242, REQ-3816). ADR-0020 settles these.
- Which model the bake-off picks for `EXPLAIN_MODEL`; the defaults stay `anthropic/claude-sonnet-5` and `google/gemini-3.8-flash` (RES-0600) until ADR-0100's bake-off record changes them.
- Explanations in English and Dutch.
