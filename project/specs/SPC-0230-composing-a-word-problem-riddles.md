---
id: SPC-0230
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-5200, REQ-5202, REQ-5204, REQ-5206, REQ-5208, REQ-5210, REQ-5212, REQ-5214, REQ-5216, REQ-6420, REQ-5220, REQ-5222, REQ-5224, REQ-5226, REQ-5228, REQ-5230, REQ-5232, REQ-5234, REQ-5236, REQ-5238, REQ-5240, REQ-5242, REQ-5244, REQ-5246, REQ-5248, REQ-5250, REQ-5252, REQ-5254, REQ-5256, REQ-5258, REQ-5260, REQ-5262, REQ-5264, REQ-5266, REQ-5268, REQ-5270, REQ-5272, REQ-5274, REQ-5276, REQ-5278, REQ-5280, REQ-5282, REQ-5284, REQ-5286, REQ-5288, REQ-5290, REQ-5292, REQ-5294, REQ-5296, REQ-5298]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Composing a word problem: sentence cards, the masked parse and the riddle verdict

## Scope

This document covers «Сплети загадку» (Weave a riddle), the task in which the player composes a word problem for a target the game shows. It covers where the Director places a riddle, the compose flow and its states, the two forms of a riddle, the path her text takes before a model reads it, the parse request and its reply, the paraphrase, the verdict `judgeCompose` gives, the riddle's events, the composing stream, what the report, the Parent Room and the Diary show of riddles, acceptance test 3 and the composing flag. It is written at the level of engine functions, request classes, events and flow states, and names no screen layout.

It leaves the rest to other specifications. SPC-0040 states the task generator, the answer checks and the rule that cards replace free composition until the parser passes. SPC-0100 states the gateway, its roles and tiers, the egress guard's general rules, the play key's buckets and what leaves the Mac. SPC-0110 states the story's free-text field, its note and its waiting times. SPC-0060 states the knowledge model and the streams of the addendum's new forms, SPC-0020 the log and its projections, SPC-0080 the task window's controls and SPC-0190 the build order. The rewards for each verdict other than `unparsed` belong to ADR-0140.

## Boundary

### Surfaces

| Surface | What it is |
| --- | --- |
| `judgeCompose(target, graph)` | A pure function in `src/shared/compose.ts` that returns `composeVerdict`, `composeErrorClass` and `wrongNumbers` for a target and a graph. The card builder lives in the same module. |
| `ParseRequest` | The gateway's request class for a parse: a strict zod schema holding the fixed parse prompt by its hash, the masked text, the token list and the schema version, and no other field. The token list and the schema version stay on the server to check the reply, and the body the gateway sends is exactly the fixed parse prompt and the masked text. |
| `PARSE_MODEL` | The gateway role that parses a riddle: player tier, `zdr: true`, the player-tier provider list, the play key, a 10-second timeout and `max_tokens` 4,000. Its model id defaults to the one `LIVE_CHECK_MODEL` is configured with. |
| Parse reply | Strict JSON: the quantities, each with its token and the span of her text that names it; the question with its span; a graph of operations over the tokens; and, for each division, whether it shares into parts or groups by a size. |
| `COMPOSE_FREE` | The composing flag. With it off, only card riddles play. |
| `PARSE_BUDGET_USD_PER_DAY` | The parse bucket, $0.1 a game day on the play key. |
| `content/numerals.ru.json` | The Russian number words the masker reads. |
| `content/i18n/ru.json` | The riddle's field label, starters, buttons, waiting line, unparsed line and paraphrase templates. |
| Frame files | The card frames and the paraphrase key set of each word-problem template. |
| `verify --live --compose` | Acceptance test 3, run on the offline key with the gateway in its `verify` mode. |
| `tests/reference/compose.ru.json` | The reference set of acceptance test 3. |
| `verify/parser-eval.json` | The record of each passing test 3, keyed by parse model. |

### Events this part owns

The verdicts and error classes of a riddle appear only in `compose_parsed` and `compose_confirmed`, in the field `composeVerdict` and its companions, which no other attempt uses (REQ-5242). The checker's `unparsed` of SPC-0040, an entry such as «3,,5» that is never submitted, lives in the ordinary verdict field and never in `composeVerdict`.

| Event, v1 | Payload |
| --- | --- |
| `compose_shown` | `riddleId`, `form` (`cards` or `text`), `targetKind` (`expression`, `diagram` or `note`), the target as rendered, template and version, seed, node, tier, `problemType`, and for cards the card set with each card's role |
| `compose_submitted` | `riddleId`, `round` (1, or 2 after a correction), her raw text or her ordered card ids, the input summary SPC-0020 defines, the masked text, the token mapping, the trigger and judge levels, and `dontKnow` |
| `compose_parsed` | `riddleId`, `round`, `parseOutcome` (`ok`, `parse_timeout`, `parse_invalid`, `parse_no_question`, `safety_unchecked`, `mask_incomplete` or `wait_exceeded`), the graph, the paraphrase as shown and the `llm_call` event id |
| `compose_confirmed` | `riddleId`, `answer` (`yes`, `no`, or `none` for cards and for a riddle closed without an answer to a paraphrase), `corrected`, `composeVerdict`, `composeErrorClass`, `wrongNumbers` and `form` |
| `compose_labelled` | `riddleId` and the verdict the parent assigns by `judgeCompose`'s rules |

The flow appends exactly one `compose_confirmed` for each riddle it closes, whatever ends it. A riddle closed by «Не знаю» or the serious path carries an empty `composeVerdict`, and one closed by a parse failure, `safety_unchecked` or `wait_exceeded` carries `unparsed`. A text riddle stopped by `mask_incomplete` turns into a card riddle for the same target, and that card riddle closes with one `compose_confirmed` of `form: cards`. Her answer to the first paraphrase is «Нет» exactly when `corrected` is true. `answer` holds her answer to the paraphrase of the closing round, and `none` when that round showed no paraphrase.

### Statuses and error names

| Name | Audience | Meaning |
| --- | --- | --- |
| `parse_timeout`, `parse_invalid`, `parse_no_question` | the owner, in `llm_log` | the parse failed, and the riddle ends as `unparsed` |
| `safety_unchecked` | the owner, in `llm_log` | no judge on the safety check's route answered |
| `mask_incomplete` | the owner | the egress guard found a digit or a number word in a `ParseRequest` |
| `wait_exceeded` | the owner, in `llm_log` | 12 seconds, the story's fallback moment SPC-0110 states, passed from «Готово» (Done) without a paraphrase |
| `parse_budget_short` | the parent, in the day's cost line | the parse bucket can't reserve two worst-case parses |
| `compose_flag_off` | the owner, in `./meowtower status`, once per model change | no passing test 3 for the configured `PARSE_MODEL` |
| `compose_test_failed` | the owner, in the verify report | test 3 missed 95% agreement or the 2% bound |
| `card_frames_missing` | the developer | a word-problem template has no card frames |

### What this part requires from other parts

- SPC-0040 supplies the word-problem templates, the target built with the purpose `compose` and the rule for when cards replace free composition.
- SPC-0100 supplies the gateway, the egress guard, the judge route, the play key's buckets, `llm_log` and the start-up check of player-tier roles.
- SPC-0110 supplies the local triggers, the serious path, the free-text field and the guard that cleans the names the parent set.
- SPC-0020 supplies `appendEvents` and the projections' rebuild.
- SPC-0060 supplies the node states the Director reads and the activation rule that keeps the composing stream out of every estimate.

The permitted dependencies run one way. `src/shared/compose.ts` imports only `src/shared/` and makes no network call, so client and server run the same verdict. Only the gateway sends a `ParseRequest`, and only the compose flow on the server builds one. The token mapping lives in the riddle's server state and the log, and no request class has a field for it. The Master's request builder and its story memory read nothing from `compose_submitted` or `compose_parsed`. Projections read riddles only from the five events above.

## Behaviour

### Offering a riddle

The Director offers a riddle as a story scene outside the room slots, set by a Tangle or a Guardian, so a riddle adds nothing to a room's length (REQ-5264). `planFloor` places at most one riddle on a floor, and only on a floor that holds word problems (REQ-6420). The Director offers at most 2 riddles a game day, of either form (REQ-5258).

The target is a word-problem template of that floor, of a problem type whose tier node is at least at "understands" (REQ-5256). The generator builds the target as an expression, a bar diagram or a short note, with the purpose `compose`.

The Director offers a text riddle only when the composing flag is on, the gateway's live calls are on for the adventure, the parse bucket can still reserve two worst-case parses and the parent hasn't switched off the free-text field (REQ-6420). When any of these fails, the Director offers a card riddle for the same target, as SPC-0040 states for the card form.

### The compose flow

The server owns the compose flow as a state machine per riddle, and every riddle it shows runs this flow whether or not the composing stream counts it (REQ-5260). This subsection is at the level of flow states. The attempt flow of SPC-0040 and SPC-0080 doesn't apply to a riddle.

1. `compose_open`: the task window shows the target. For a text riddle it shows the story's free-text field, with its note «Эту историю могут читать мама и папа» (Mum and Dad can read this story) and the three starters «У…было…» (…had…), «Купили…» (They bought…) and «Шли…» (They walked…) (REQ-5268, REQ-5266). The field takes 1 to 4 sentences and at most 600 characters. For a card riddle it shows the cards and a strip to order them in. The window also holds «Не знаю» (I don't know), «Готово» and the thread button, which stays visible and inactive.
2. `compose_checking`, text riddles only: the server runs the steps under "Her text before a model reads it", and the familiar shows the waiting line from the content files.
3. `compose_paraphrase`, text riddles only: the familiar shows the paraphrase with «Да, так» (Yes, that's it) and «Нет, я имела в виду другое» (No, I meant something else) (REQ-5266).
4. `compose_correcting`, reached once, after her first «Нет»: the field opens again holding her first text, and she edits it and presses «Готово». The attempt stays unassisted (REQ-5238). The log marks the attempt corrected and keeps both texts (REQ-5240). The corrected text passes steps 2 and 3 again.
5. `compose_review`: `judgeCompose` gives the verdict, and the window shows the short review. For `match` the review opens on a tap.
6. `compose_closed`: she taps to leave, and the story goes on.

A card riddle goes from `compose_open` to `compose_review` with no paraphrase and `answer: none`. Each card carries the role the engine gave it, and a card set holds the frame's sentences and 2 distractors: one with the other relation, such as «на» (by) for «в» (times), and one question for a different unknown. «Не знаю» in either form closes the riddle with the short review, an empty verdict and no count in the stream.

The short review is one example riddle the engine builds from the target's template frame and the target's numbers, in the familiar's voice, with no word of error. No riddle has a twin, and a riddle that gets `wrong_structure` ends with the short review (REQ-5262).

The riddle ends as `unparsed`, with base experience and no observation, when she rejects the paraphrase of her corrected text or her corrected text fails to parse (REQ-5236). The player sees one fixed familiar's line for every `unparsed` riddle, saying the familiar couldn't untangle it.

### Her text before a model reads it

A text riddle's text passes these steps in order before any parse request leaves the Mac (REQ-5220):

1. The local triggers of SPC-0110 run on her raw text. A serious trigger takes the story's serious path: the fixed line, the pause and the notice (REQ-5222). The riddle then ends with an empty verdict, and nothing is sent.
2. The egress guard cleans the names the parent set, as for her story text.
3. The masker replaces every number in the cleaned text with `n1` to `nm` in text order (REQ-5202). A number is a digit run or a Russian number word from `content/numerals.ru.json`: every cardinal numeral, compound ones such as «сорок восемь» (forty-eight) included, every collective numeral from «двое» (two) to «десятеро» (ten), and «полтора» (one and a half), «десяток» (ten), «дюжина» (a dozen) and «сотня» (a hundred), each in every case form. The mapping from tokens back to her numbers stays in the riddle's server state and in `compose_submitted`, on the Mac (REQ-5204).
4. The judge's safety check reads the cleaned, masked text through the judge route SPC-0100 states, whose route for each check ADR-0350 resolves to a local judge, `JUDGE_MODEL` or `SAFETY_MODEL`. A hosted call is charged to the adventure bucket, and a local call costs nothing. The request carries that text alone, with no story memory, outcome events, times, estimates, other answers or other maths result (REQ-5212). A serious result takes the serious path as in step 1 (REQ-5222).
5. The gateway sends a `ParseRequest` holding the fixed parse prompt and the cleaned, masked text, and no target expression, node id, topic name, problem type, verdict or other answer (REQ-5200).

The egress guard refuses a `ParseRequest` whose text still holds a digit or a number word of that set, as `mask_incomplete`. Nothing is sent, and the riddle turns into a card riddle for the same target.

### The parse

`PARSE_MODEL` sends only to a zero-retention endpoint at a provider on the player-tier list (REQ-5208). The server refuses to start when `PARSE_MODEL` has no such endpoint (REQ-5210). The gateway writes a row to `llm_log` for every parse call (REQ-5214).

Every parse call spends from the parse bucket of $0.1 a game day on the play key, and from no other bucket (REQ-5216). Before a call the gateway reserves the worst case: 3,100 input tokens at $0.75 a million and 4,000 output tokens at $3.75 a million, about $0.017. It settles the reservation at the call's real cost, about $0.004 for a typical 400-token reply. The flow makes at most 2 parse calls a riddle.

The engine refuses the reply as invalid when the JSON fails the schema, when the graph names a number or a token other than `n1` to `nm` of the masked text it sent (REQ-5206), or when a span isn't found word for word in the masked text. A timeout after 10 seconds, an invalid reply or a graph with no question gives the riddle the verdict `unparsed`, with base experience and no observation (REQ-5288). On a valid reply the engine puts her own number forms back into the spans from the mapping.

### The paraphrase

The paraphrase holds only template strings from the per-language content files, one set per problem type and operation, and the spans the engine found word for word in her text (REQ-5234). It retells the story and the question in words, with no expression, sign or value. The riddle's field label, its three starters, the paraphrase templates and the two confirmation buttons each come from `content/i18n/ru.json`, and a second language adds its own file (REQ-5266).

### The verdict

`judgeCompose(target, graph)` takes the target and the graph she confirmed, or the graph her ordered cards form, and returns the same verdict for the same pair every time; no model supplies it (REQ-5224). It normalises both graphs with `+` and `·` commutative and associative and `−` and `:` in fixed order, then decides:

| Verdict | When | Requirement |
| --- | --- | --- |
| `match` | the same operations on the same numbers, so «6 · 4 + 6» matches «6 + 4 · 6» | REQ-5226 |
| `match_other_structure` | other operations with the target's value, such as «6 · 5» for «6 · 4 + 6» | REQ-5228 |
| `wrong_structure` with `wrongNumbers: true` | the target's operations on other numbers | REQ-5230, REQ-5232 |
| `wrong_structure` | any other value, a reversed `−` or `:` such as «6 : 48» for «48 : 6» included | REQ-5298 |
| `unparsed` | a parse failure, a rejected correction or a failed correction parse | REQ-5288, REQ-5236 |

The function also returns an error class, which the error-type limit places in the conceptual class (REQ-5244):

- `compose_on_vs_times` when a `+` or `−` stands where the target has a `·` or `:` on the same numbers, or the reverse.
- `compose_order` when the operations and numbers match and their order doesn't.
- `compose_partition_vs_quotition` when a division matches and its kind, sharing or grouping, differs from the kind the target's template declares. That graph keeps `match`, and the class sits beside it.

### The composing stream and what it stays out of

A riddle, of either form, is no observation for the "on her own", "with help" or fluency estimates, a block, a probe, a node state or the success share the Director reads before a room slot, until the activation rule SPC-0060 states admits the composing stream (REQ-5246). A riddle doesn't count towards any step of the holding-steps limit (REQ-5248). A riddle counts in neither part of the step-input share of compound word problems, and it doesn't advance the item builder's counter of first-shown compound problems (REQ-5250).

The composing stream is a projection of `compose_confirmed`. It keeps, per tier, problem type and form, the count of each verdict other than `unparsed` and the count of each error class (REQ-5252).

### The report, the Parent Room and the Diary

The report shows the line «Может составить задачу» (Can compose a problem) beside the matrix of type by steps, as the composing stream's counts and no state (REQ-5254).

The Parent Room lists every riddle with its composed text, both texts of a corrected riddle, the paraphrase, her answer to it and the verdict (REQ-5294). The list has a control to label a logged riddle by `judgeCompose`'s rules, which appends `compose_labelled` and changes no verdict. The Parent Room also shows the share of paraphrases she rejected over the last 30 days (REQ-5296). The share counts as shown each `compose_parsed` with `parseOutcome: ok`, and as rejected each `compose_confirmed` with `corrected: true` plus each with `answer: no`.

The server renders the Diary pages «Загадки героини» (The heroine's riddles) on demand from `compose_submitted` and `compose_confirmed`. They show each riddle with `match` or `match_other_structure` in her text as the log holds it, leave out any riddle with a trigger or signal above none, and store nothing; no model writes any part of the pages (REQ-5270). No composed text enters a `StoryRequest` or the Master's story memory (REQ-5272).

### Acceptance test 3 and the composing flag

`verify --live --compose` runs the configured `PARSE_MODEL` on masked text, in the live verification run, on the offline key (REQ-5274). It spends at most $4 a run.

The reference set `tests/reference/compose.ru.json` holds 200 texts (REQ-5278). Among them are child-like spelling errors, dictated text, number words, problems with no question, irrelevant data, every verdict, every compose error class and correct problems in each allowed order of operands. The parent labels every text by `judgeCompose`'s rules before any parser runs on it (REQ-5276).

The test reports how often each labelled verdict was judged as each verdict, beside the overall agreement (REQ-5280). It passes when agreement is at least 95% and fails when more than 2% of the texts labelled `match` are judged other than `match` (REQ-5282). It checks from `llm_log` that every parse request body is exactly the fixed parse prompt and the masked text of its riddle (REQ-5284). It plants the distinctive target «7 · 13 − 29» in a fixture and finds it in no logged parse request (REQ-5286).

A passing run writes a record to `verify/parser-eval.json` for the parse model it ran on. The composing flag stays off unless that file holds a passing test 3 for the configured `PARSE_MODEL`, so a change of parse model turns text riddles off until test 3 passes on the new model (REQ-5290). With `COMPOSE_FREE` on and no such record, the server starts with the flag off, offers card riddles only and shows `compose_flag_off` in `./meowtower status`.

If the owner judges that the masked parse can't pass test 3, the card form is the only form: the engine builds and judges sentence cards with no model, and no unmasked parse request exists (REQ-5292).

## Failure paths

| Condition | What happens |
| --- | --- |
| A serious trigger or a serious judge result on her composed text | The story's serious path runs; the riddle ends with an empty verdict and nothing is sent to the parser (REQ-5222). |
| No judge on the safety check's route answers | Nothing is sent to the parser; the riddle ends as `unparsed` with the fixed line, cause `safety_unchecked`. |
| The egress guard finds a digit or a number word in a `ParseRequest` | Nothing is sent; `mask_incomplete` is reported once per cause, and the riddle turns into a card riddle for the same target. |
| The parse times out after 10 seconds, returns invalid JSON or returns a graph with no question | The riddle ends as `unparsed`, with base experience, no observation and the fixed line (REQ-5288). |
| The graph names a number or token outside `n1` to `nm`, or a span isn't found word for word in the masked text | The engine refuses the reply as invalid, and the riddle ends as `unparsed` (REQ-5206, REQ-5288). |
| 12 seconds pass from «Готово» without a paraphrase | The riddle ends as `unparsed` with the fixed line (`wait_exceeded`), and a late reply is dropped. |
| She rejects the paraphrase of her corrected text, or the corrected text fails to parse | The riddle ends as `unparsed`, with base experience and no observation (REQ-5236). |
| The parse bucket can't reserve two worst-case parses | The Director offers a card riddle (`parse_budget_short`) (REQ-6420). |
| The composing flag is off, live calls are off or the parent switched off the free-text field | The Director offers a card riddle (REQ-6420). |
| `COMPOSE_FREE` is on and `verify/parser-eval.json` holds no pass for the configured `PARSE_MODEL` | The server starts with the flag off, offers card riddles only, and `./meowtower status` shows `compose_flag_off` once per model change (REQ-5290). |
| `PARSE_MODEL` has no zero-retention endpoint at a player-tier provider | The server refuses to start (REQ-5210). |
| Test 3 misses 95% agreement or the 2% bound | The flag stays off (`compose_test_failed`); the owner judges whether a retry or the cards-only form follows (REQ-5282, REQ-5292). |
| A word-problem template has no card frames | The Director skips that template for riddles, and the content test fails the build (`card_frames_missing`). |
| The day already holds 2 riddles, or the floor has no word problems | The Director places no riddle (REQ-5258, REQ-6420). |

## Open review findings

- The first agent review asked to give reasons for the 600-character cap, the inactive thread button, the 2 distractors, «Не знаю» adding no count, the 12-second wait, the split of counts by form and the $4 run budget, or a sentence pointing to ADR-0230 for them. Rejected: a specification states what the system does and never why, and those reasons stand in ADR-0230. The 12 seconds are now tied to the story's fallback moment in SPC-0110, which is a fact about the system and no reason.
- The second agent review asked to drop either the Director's skip of a template with no card frames or the build failure (`card_frames_missing`). Rejected: ADR-0230's failure table states both, and a spec doesn't choose between guards a decision in force sets.
