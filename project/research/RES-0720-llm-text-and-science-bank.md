---
id: RES-0720
artifact: research
status: draft
revised: 2026-09-27
---

# The draft proposes that LLM text reaches tasks only as checked number-free frames, and science questions only from a hand-made bank

## Summary

The owner's draft proposes one set of automatic checks for every text an LLM (large language model) writes, and lets only placeholder frames into task text. An approved frame library, generated offline and reviewed by the parent, serves most tasks, with targets of 5 frames per structure by stage 0.2 and 20 to 30 by stage 0.4, and no frame repeated within 14 days. Live frames appear only when topping up to a block, from a queue kept 2 to 3 rooms ahead. Every frame passes a seven-step pipeline: a structural specification, number-free drafts, automatic checks, a blind solve with three sets of numbers, a further blind solve for live frames, parent review for offline frames, and a 30% rejection threshold that switches live generation off for the day. Natural science is the exception: its questions come only from a hand-made bank approved by an adult, because a blind solve can't catch a factual error. This record covers the frame library, live frames, the pipeline, logging and the science bank. It leaves the explanation contract to RES-0600 and word-problem structure to RES-0700.

## The question

How can the game use LLM-written story text in maths tasks without an LLM ever putting a wrong number or a wrong question in front of the player? The draft assumes that keeping numbers out of the LLM's text and solving the filled frame blind catches every error that matters. The draft itself limits that assumption: a blind solve checks arithmetic meaning, not facts, so natural science gets a hand-made bank.

## Method

Read the owner's draft «Хроники Башни — спецификация» ("Tower Chronicles: specification"), section «Конвейер текста LLM» ("LLM text pipeline"), on 2026-09-26.

The draft leaves these points open:

- It doesn't define «добор до блока» ("topping up to a block"), the only case that uses live frames.
- It doesn't say what N is, the number of variants the author model writes per request.
- It doesn't give the length, readability or safety thresholds of the automatic checks in this range.
- It doesn't say over what period the 30% rejection share is measured, or when live generation starts again.
- It doesn't name the models behind `GEN_MODEL`, `CHECK_MODEL` and `LIVE_GEN_MODEL` in this section. The model table in RES-1600 names them, and research checked them on 2026-09-26; see the resolved finding on models below.
- It doesn't name the five natural science topics that 200 questions at 40 per topic imply.
- It doesn't say who writes the science bank or how the adult approval is recorded.

## Findings

### Every LLM text passes the same automatic checks, and only placeholder frames reach task text

Any text from an LLM passes the same automatic checks. Only a frame with placeholders gets into task text.

### An approved frame library serves most tasks and grows by stage

The frame library, `content/frames.ru.json`, holds approved frames. It serves every probe, the Guardian ladder (лестница Стражей) and the fallback cases. It is built offline with `npm run frames:generate`, using `GEN_MODEL` and `CHECK_MODEL`.

| Stage | Target frames per structure |
| --- | --- |
| 0.2 | at least 5 |
| 0.4 | 20 to 30 |

The draft gives the reason for these targets: with daily play, stories mustn't grow stale.

### A frame repeats at most once in 14 days, and a forced repeat is logged

A frame doesn't repeat more often than once in 14 days. If a structure has no fresh frame, the game takes the one used longest ago and marks the repeat in the log.

### Live frames appear only when topping up to a block, from a queue kept ahead

Live frames, from `LIVE_GEN_MODEL`, are used only when topping up to a block. The server keeps a queue of checked frames 2 to 3 rooms ahead.

### Every frame passes a seven-step pipeline

1. Input: the structural specification of the frame. It holds the computation graph, the roles of the numbers (`{a}` is a price, `{b}` a quantity), the floor, the characters in the scene and the limits on length and vocabulary.
2. Author: the model writes N variants of the frame with placeholders and no numbers. The response is strict JSON to a schema.
3. Automatic checks: each placeholder appears exactly once; no other numbers and no numbers in words appear («два» "two", «половина» "half", «дюжина» "dozen"); length; readability; safety.
4. Blind meaning check: the frame is filled with three sets of numbers, and a checking model solves each problem without knowing the answer. The frame is accepted only if all three answers match the engine's answer.
5. For a live frame: one more blind solve with the task's actual numbers before it is shown.
6. Offline frames go to a review queue in the Parent Room with «принять / отклонить / поправить» ("accept / reject / edit"). Accepted frames are written to `content/frames.ru.json` and committed.
7. Threshold: the share of rejected live frames stays at or below 30%. Above that, live generation is switched off for the day and the library is used.

### The database keeps only live frames, and every LLM call is logged

The `frames` table in the database holds only live frames and their statuses. The parent moves a good live frame into the library with one click. Every LLM request and response is written to `llm_log`.

### The draft says explanations use the same pipeline, but their checks differ

The draft says the familiars' explanations (`EXPLAIN_MODEL`) pass «тот же конвейер проверок» ("the same pipeline of checks"), with step placeholders in place of numbers. It then defers the contract, checks, cache and fallback to «Подробные объяснения» ("Detailed explanations"). That section, recorded in RES-0600, lists different checks: an 8-sentence limit, step order and one blind reading of the finished explanation. It has no three-set blind solve and no 30% rejection threshold. So "the same pipeline" holds for the shared checks of placeholders, numbers and safety, and not for every step.

### Resolved: the frame pipeline's models are `anthropic/claude-opus-5.5` for `GEN_MODEL`, `openai/gpt-5.5` for `CHECK_MODEL`, `anthropic/claude-sonnet-5` for `LIVE_GEN_MODEL` and `google/gemini-3.8-flash` for the live blind solve

Proposed by research on 2026-09-26; the owner approves it with this record.

These are the draft's defaults from the model table in RES-1600, and the bake-off can replace `LIVE_GEN_MODEL`. Research read the OpenRouter catalogue on 2026-09-26, and all four identifiers exist. The draft's bake-off list named `google/gemini-3.5-flash`, an older and dearer model of the same class, and `google/gemini-3.8-flash` is the one meant; RES-1600 holds the comparison. Frames hold placeholders and no player text, so `GEN_MODEL`, `CHECK_MODEL` and `LIVE_GEN_MODEL` belong to the content tier in RES-2600, under `data_collection: "deny"` without the zero-retention rule. `LIVE_CHECK_MODEL` also checks explanations, which carry her answer, so all its requests follow the player tier's zero-retention rule, and `google/gemini-3.8-flash` meets it at Google Vertex.

The owner decided on 2026-09-27 that GLM is good enough for stories, and that every model is configurable. RES-1600 moves the Master and the planner to `z-ai/glm-5.3` and keeps `LIVE_GEN_MODEL` on `anthropic/claude-sonnet-5`, because a frame is a task statement whose wording decides whether she can solve it, so the blind solve and the spelling count choose its model. GLM joins the live generation candidates in the bake-off. Each of these four settings changes by configuration with no rebuild (RES-1600).

### Resolved: the safety step of the frame checks may run on Jev, and the blind solves may not

The owner decided on 2026-09-27: Jev can be used to evaluate safety and similar judgements, for example the safety check on free text and sorting free-text choices. Research decided the same day, on the owner's instruction, that Jev runs through OpenRouter's zero-retention route, `typesafe/jev-1.13`, in place of TypeSafe's direct API (RES-2600); an earlier text had it at TypeSafe, outside OpenRouter, with unpublished retention terms. RES-1600 lists the checks it may take as `JUDGE_MODEL`.

For frames this means the safety part of step 3 may ask Jev a yes-or-no question on the frame text with its placeholders, with `SAFETY_MODEL` as the fallback. A frame holds no player text, so this request sends TypeSafe nothing of hers. The blind meaning check in steps 4 and 5 stays on `CHECK_MODEL` and `LIVE_CHECK_MODEL`, because a blind solve has to compute an answer, and Jev only picks from a list, which would show the checker the engine's answer. Proposed by research on 2026-09-27; the owner approves it with this record.

### Natural science questions come only from a hand-made bank approved by an adult

Natural science is an exception. Its questions come only from a hand-made bank, `content/science.ru.json`, and only after an adult approves them. The draft's reason: a blind solve doesn't catch a factual error.

| Stage | Bank size | Per topic | Repeat window |
| --- | --- | --- | --- |
| Before 0.5 | about 200 | 40 | 45 days |
| 0.5 | 400 | not given | 90 days |

The draft checks the 45-day window: about 3.5 questions a day and 10 per Ascent fit into a bank of 200. If a topic has no fresh question, the game takes the one used longest ago. The repeat is marked in the log, and the natural science report counts only the first answer to each question.

## Conclusions

1. Every LLM text must pass the shared automatic checks before use, and only placeholder frames may enter task text.
2. Probes, the Guardian ladder and fallback cases must draw frames from the approved frame library.
3. The frame library must reach at least 5 frames per structure by stage 0.2 and 20 to 30 by stage 0.4.
4. The game must not show the same frame twice within 14 days, and when no fresh frame exists must use the frame used longest ago and log the repeat.
5. Live frames may be used only when topping up to a block, and the server must keep a queue of checked frames 2 to 3 rooms ahead.
6. A frame request must carry a structural specification: the computation graph, number roles, floor, scene characters and length and vocabulary limits.
7. The author model must return N number-free variants as strict JSON to a schema.
8. The game must reject a frame in which any placeholder is missing or repeated, or which contains any other number or number word, or which fails the length, readability or safety check.
9. The game must accept a frame only if a checking model, solving it blind with three sets of numbers, matches the engine's answer all three times.
10. A live frame must pass one more blind solve with the task's actual numbers before it is shown.
11. Offline frames must go through parent review in the Parent Room with accept, reject and edit, and accepted frames must be written to the library file.
12. If more than 30% of live frames are rejected, the game must switch live generation off for the rest of the day and use the library.
13. The database must keep live frames and their statuses, and the parent must be able to move a live frame into the library with one click.
14. Every LLM request and response must be written to `llm_log`.
15. Natural science questions must come only from a hand-made bank, and only after an adult approves each question.
16. A natural science question must not repeat within 45 days with a bank of about 200, or within 90 days with a bank of 400.
17. When a topic has no fresh natural science question, the game must use the one used longest ago, log the repeat and count only the first answer in the natural science report.
18. `GEN_MODEL`, `CHECK_MODEL`, `LIVE_GEN_MODEL` and `LIVE_CHECK_MODEL` must be models that exist in the OpenRouter catalogue, starting with the defaults in RES-1600, and the live blind solve must use `google/gemini-3.8-flash` until the bake-off or a decision changes it.
19. The safety step of the frame checks may use `JUDGE_MODEL`, Jev at TypeSafe, by the owner's decision of 2026-09-27, with `SAFETY_MODEL` as its fallback, and the blind solves must never use Jev.
20. `LIVE_GEN_MODEL` must keep `anthropic/claude-sonnet-5` as its default after the owner's decision of 2026-09-27 that GLM is good enough for stories, with GLM among its bake-off candidates, and each frame pipeline model must change by configuration with no rebuild, as RES-1600 sets out.

## Sources

- The owner's draft «Хроники Башни — спецификация», section «Конвейер текста LLM», read 2026-09-26; not kept in the repository - the frame library, live frames, the frame pipeline, logging, the explanation cross-reference and the natural science bank.
- OpenRouter API, `GET https://openrouter.ai/api/v1/models`, read 2026-09-26 - the four named models exist, with their listing dates and prices.
- The owner's decision of 2026-09-27, relayed that day: Jev can be used to evaluate safety and similar judgements.
- TypeSafe AI, «Models», https://docs.typesafe.ai/models, read 2026-09-27 - Jev answers yes-or-no, choice and score questions and writes no text.
- The owner's decisions of 2026-09-27, relayed that day: "GLM is good enough for stories" and "The model should be configurable".
