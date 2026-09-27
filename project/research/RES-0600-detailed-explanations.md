---
id: RES-0600
artifact: research
status: approved
revised: 2026-09-27
---

# The draft proposes LLM-written explanations in the familiar's voice that carry no numbers of their own

## Summary

The owner's draft proposes that an LLM (large language model) writes the detailed explanation in the familiar's voice, working only from the engine's step-by-step solution. The request carries the task text, the engine's computation graph and answer, the player's answer, any matching trap and error class, and the familiar's profile, with no node identifiers, estimates, history, timing or personal data. The LLM returns strict JSON with placeholders in place of every number, and code substitutes the numbers. Before display, checks cover the schema, length, placeholders, the absence of digits, step order, a blind solve by a second model, and safety. If a check fails or the model takes over 10 seconds, the engine's template explanation appears instead, so the thread still buys an explanation. Placeholder texts are cached by task features, and live generation is capped at USD 0.30 and 20 generations a day. This record covers the explanation contract, checks, fallback, cache, budget and the separate Explainer role. It leaves the thread economy to RES-0500 and the shared LLM text pipeline to RES-0720.

## The question

How can an LLM explain a maths step in a familiar's voice without ever stating a wrong number? The draft assumes that keeping every number out of the LLM's text, and checking the rest automatically, makes the explanation safe to show a child without a person reading it first. That assumption doesn't cover a correct-looking explanation that reasons wrongly between correct numbers, which is why the draft adds a blind solve by a second model and a parent review queue for cached variants.

## Method

Read the owner's draft «Хроники Башни — спецификация» ("Tower Chronicles: specification"), section «Подробные объяснения» ("Detailed explanations"), on 2026-09-26.

The draft leaves these points open:

- It doesn't list the words on the shame stop list («стоп-лист стыда») (resolved below: RES-3300 sets one forbidden list).
- It doesn't say what happens when a computation graph has more steps than an 8-sentence explanation can name in order.
- It doesn't say how the blind check tells anything when the explanation must name every step's result, the last one included, so the blind reader can copy the answer. Nor does it say how the blind answer is compared for fractions and other non-integer forms.
- It doesn't say how «форма графа» ("graph shape") is encoded for the cache key.
- It doesn't name the models behind `EXPLAIN_MODEL`, `LIVE_CHECK_MODEL` or `SAFETY_MODEL` in this section. The model table in RES-1600 names them, and research checked them on 2026-09-26; see the resolved finding on models below.

## Findings

### An LLM writes the explanation in the familiar's voice, only from the engine's solution

The detailed explanation is written by an LLM in the voice of the familiar, and only from the engine's step-by-step solution.

### The request carries the task, the engine's solution and the familiar, and nothing personal

The request, `ExplainRequest`, holds:

- the task text as the player saw it;
- the engine's solution: the computation graph (steps, each with an operation, arguments and a result) and the answer;
- her answer, and, where it matched a trap, the misconception with the engine's calculation for it;
- the error class the engine found;
- the familiar: species, the name the player gave it, its traits and sample lines.

The request holds no node identifiers, estimates, history, timing or personal data.

### The LLM returns strict JSON with step placeholders and no numbers

The output is strict JSON of familiar lines. The LLM's text contains no numbers. It uses step placeholders in their place: `{s1.a}`, `{s1.b}`, `{s1.value}`, `{answer}`, `{trap.value}`. Code substitutes the numbers.

### Five checks run before an explanation is shown

1. The schema is valid, the length is at most 8 sentences, and every placeholder refers to an existing step.
2. The LLM's text contains no digits and no numbers written as words. So after substitution every number in the explanation comes from the engine's steps, and no new number appears.
3. The explanation names the result of every step in graph order.
4. A second model, `LIVE_CHECK_MODEL`, reads the task and the finished explanation blind and states the final answer. That answer must match the engine's answer.
5. A safety check passes, by `JUDGE_MODEL` (Jev) on the text with placeholders or by `SAFETY_MODEL` as its fallback, and the text holds no word from the forbidden list RES-3300 sets, in any form. The draft named the shame stop list, praise of intelligence and «задача» ("problem"), «пример» ("sum") and «урок» ("lesson"); the one list holds all of these and adds «школа» and «оценка».

### A failed check or a 10-second timeout falls back to the engine's template explanation

If a check fails, or no answer arrives within 10 seconds, the game shows the engine's template explanation (`explain` in the template), framed by the same familiar. The thread still buys an explanation.

### The cache stores number-free texts under a key of task features

A text with placeholders doesn't depend on the numbers, so the game caches it. The cache key combines the template, its version, the trap (or its absence), the graph shape, the familiar and the prompt version. Each key holds up to 3 variants, shown in turn. The cache can be filled offline with `npm run explain:generate`. The parent can hide any variant in the review queue.

### Live generation is capped at USD 0.30 and 20 generations a day

`EXPLAIN_BUDGET_USD_PER_DAY = 0.3`, and at most 20 live generations run a day. Above either limit, the game uses the cache or the template explanation.

### The Explainer is a separate role, and the Master never sees the maths

The master storyteller still doesn't see the maths. Explanations come from a separate role, the Explainer («Объяснитель», `EXPLAIN_MODEL`). Its texts go into neither the story nor the Master's memory.

### Resolved: in the world the familiar explains in its own voice, and outside the world the Explainer writes that text

Proposed by research on 2026-09-26; the owner approves it with this record.

CAN-0030 said the familiar walks the knot «своим голосом» (in its own voice). CAN-0060 and CAN-0110 named a "familiar-Explainer" as a separate voice, and this record gives the text to the Explainer role. Two options were weighed:

- Put the Explainer into the canon, as a voice or a being the world knows. This states the mechanism openly, but it adds a character the player never meets, and it splits one familiar into two speakers.
- Keep the Explainer out of the world. The player and the canon see only the familiar, explaining in its own voice along the guiding thread. The Explainer is a production role, like the Director: it writes the familiar's lines for an explanation from the engine's steps, and the world never names it. Lester and others (1997) found that a lifelike character in a learning program raises how pupils rate its help, even when the character adds nothing to the content, which argues for one familiar the player trusts over a second, unseen voice.

The second option wins, because both sides already agree on the mechanism and differ only in what the world knows, and the world gains nothing from a character nobody can meet. The canon now says the familiar explains in its own voice, and a note for the author says the text comes from the Explainer role, from the steps the code computed, without the Master.

### Resolved: the explanation's models are `anthropic/claude-sonnet-5` for `EXPLAIN_MODEL` and `google/gemini-3.8-flash` for `LIVE_CHECK_MODEL` and `SAFETY_MODEL`, all on zero-retention endpoints

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's model table (RES-1600) gives these defaults, and its bake-off list named `google/gemini-3.5-flash` in place of `google/gemini-3.8-flash`. Research read the OpenRouter catalogue on 2026-09-26: both models exist, and `google/gemini-3.8-flash` is newer and costs about half as much, so it is the one meant; RES-1600 holds the comparison. An explanation request carries one of the player's answers, so all three roles route only to zero-retention endpoints (RES-2600): Claude Sonnet 5 at Google Vertex or Amazon Bedrock, Gemini 3.8 Flash at Google Vertex. The bake-off can still replace `EXPLAIN_MODEL`, within the same rule.

The owner's decision of 2026-09-27 changed the safety part of this finding: check 5 may run on Jev as `JUDGE_MODEL`, with `SAFETY_MODEL` as the fallback. Research decided the same day, on the owner's instruction, that Jev runs through OpenRouter's zero-retention route, so the zero-retention rule above holds for Jev too; an earlier text placed Jev at TypeSafe outside that rule. The next finding holds it.

The owner decided on 2026-09-27 that GLM is good enough for stories and that every model is configurable. `EXPLAIN_MODEL` keeps `anthropic/claude-sonnet-5`, because an explanation teaches maths and isn't story text; RES-1600 moves only the Master and the planner to GLM. `EXPLAIN_MODEL`, `LIVE_CHECK_MODEL` and `SAFETY_MODEL` each change by configuration with no rebuild (RES-1600).

### Resolved: the explanation's safety check may run on Jev, on the text before numbers are filled in

The owner decided on 2026-09-27: Jev can be used to evaluate safety and similar judgements, for example the safety check on free text and sorting free-text choices. The decision assumed Jev's direct API at TypeSafe, outside OpenRouter, with unpublished retention terms, which couldn't meet the zero-retention rule above. Research decided on 2026-09-27, on the owner's instruction, that Jev runs through OpenRouter's zero-retention route, `typesafe/jev-1.13`, which meets it (RES-2600). RES-1600 lists the checks Jev may take, and RES-2600 the rules for its requests.

An explanation request carries her answer, and that answer must not reach TypeSafe. The LLM's text holds placeholders in place of every number (check 2), so check 5 sends Jev that placeholder text before code fills in the numbers. Jev then sees the familiar's words and no maths result. The blind check in step 4 stays on `LIVE_CHECK_MODEL`, because it states a final answer, which Jev can't compute. Proposed by research on 2026-09-27; the owner approves it with this record.

### Resolved: the explanation's word check uses the one forbidden list for every text the heroine sees

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft checked explanations against the shame stop list, praise of intelligence and three school words, and CAN-0060 gave familiar explanations a list of its own. The owner's design bans one list in every text the heroine sees. RES-3300 compares the options and holds the reason for one list everywhere, matched in every form by lemma. For the Explainer this means check 5 runs the same list as every other text, and a familiar's explanation can never say «школа» or «оценка» either.

## Conclusions

1. The detailed explanation must be generated only from the engine's step-by-step solution, in the familiar's voice.
2. The explanation request must carry the task text as shown, the computation graph and answer, the player's answer, any matched trap with its engine calculation, the error class and the familiar's species, name, traits and sample lines.
3. The explanation request must carry no node identifier, estimate, history, timing or personal data.
4. The LLM's output must be strict JSON whose text contains no digits and no numbers in words, with step placeholders that code fills with the engine's numbers.
5. Before display, the game must reject an explanation whose schema is invalid, which is longer than 8 sentences or which cites a step that doesn't exist.
6. Before display, the game must reject an explanation that doesn't name every step's result in graph order.
7. Before display, a second model must state the final answer blind from the task and the explanation, and the game must reject the explanation if that answer differs from the engine's.
8. Before display, the game must reject an explanation that fails the safety check or holds any word of the forbidden list RES-3300 sets, in any form. The draft record named the shame stop list, praise of intelligence and three school words.
9. If any check fails or no answer arrives within 10 seconds, the game must show the engine's template explanation framed by the same familiar, and the thread spent must still buy that explanation.
10. The game must cache placeholder texts by template, template version, trap, graph shape, familiar and prompt version, with up to 3 variants a key shown in turn.
11. The explanation cache must be fillable offline, and the parent must be able to hide any cached variant.
12. Live explanation generation must stop for the day at USD 0.30 or 20 generations, whichever comes first, and fall back to the cache or the template explanation.
13. The Explainer must run as a role separate from the Master, and its texts must never enter the story or the Master's memory.
14. The Explainer must never appear in the world or in player-facing text: the player must see every explanation as the familiar speaking in its own voice.
15. `EXPLAIN_MODEL`, `LIVE_CHECK_MODEL` and `SAFETY_MODEL` must be models that exist in the OpenRouter catalogue and have a zero-retention endpoint at an allowed provider, starting with `anthropic/claude-sonnet-5` and `google/gemini-3.8-flash`.
16. The safety check of an explanation may use `JUDGE_MODEL`, Jev through OpenRouter's zero-retention route, by the owner's decision of 2026-09-27, and must then send Jev only the text with placeholders, before any number or the player's answer is filled in.
17. `EXPLAIN_MODEL` must keep `anthropic/claude-sonnet-5` as its default after the owner's decision of 2026-09-27 that GLM is good enough for stories, and the explanation's models must change by configuration with no rebuild, as RES-1600 sets out.

## Sources

- The owner's draft «Хроники Башни — спецификация», section «Подробные объяснения», read 2026-09-26; not kept in the repository - the explanation request and output, the checks, the fallback, the cache, the budget and the Explainer role.
- OpenRouter API, `GET https://openrouter.ai/api/v1/models` and `GET https://openrouter.ai/api/v1/endpoints/zdr`, read 2026-09-26 - the named models exist, their prices, and their zero-retention endpoints.
- J. C. Lester and others, "The persona effect: affective impact of animated pedagogical agents", CHI '97, pages 359-366, https://dl.acm.org/doi/10.1145/258549.258797, read 2026-09-26 - a lifelike character in a learning program raises how pupils rate its help.
- The owner's decision of 2026-09-27, relayed that day: Jev can be used to evaluate safety and similar judgements.
- TypeSafe AI, «Models», https://docs.typesafe.ai/models, read 2026-09-27 - Jev answers yes-or-no, choice and score questions, reads text only and writes no text.
- The owner's decisions of 2026-09-27, relayed that day: "GLM is good enough for stories" and "The model should be configurable".
