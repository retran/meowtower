---
id: SPC-0230
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-5200, REQ-7202, REQ-5204, REQ-7210, REQ-5208, REQ-5210, REQ-5212, REQ-5214, REQ-5216, REQ-6420, REQ-5220, REQ-5222, REQ-5224, REQ-5226, REQ-5228, REQ-5230, REQ-5232, REQ-5234, REQ-5236, REQ-5238, REQ-5240, REQ-5242, REQ-5244, REQ-5246, REQ-5248, REQ-5250, REQ-5252, REQ-5254, REQ-5256, REQ-5258, REQ-5260, REQ-5262, REQ-5264, REQ-5266, REQ-5268, REQ-5270, REQ-5272, REQ-5274, REQ-5276, REQ-5278, REQ-5280, REQ-5282, REQ-5284, REQ-5286, REQ-5288, REQ-5290, REQ-5292, REQ-5294, REQ-5296, REQ-5298, REQ-7200, REQ-7204, REQ-7206, REQ-7208, REQ-7212, REQ-7214, REQ-7216, REQ-7218, REQ-7220, REQ-7222, REQ-7224, REQ-7226, REQ-7228, REQ-7230, REQ-7232, REQ-7234, REQ-7236, REQ-7238, REQ-7240, REQ-7242, REQ-7244, REQ-7246, REQ-7248, REQ-7250, REQ-7252, REQ-7254, REQ-7256, REQ-7258, REQ-7260, REQ-7262, REQ-7264, REQ-7266, REQ-7268, REQ-7270, REQ-7272, REQ-7274, REQ-7276, REQ-7278, REQ-7280, REQ-7282]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Composing a word problem: sentence cards, the masked parse and the riddle verdict

## Scope

This document covers «Сплети загадку» (Weave a riddle), the task in which the player composes a word problem for a target the game shows. It covers where the Director places a riddle and which target it draws, the compose flow and its states, the two forms of a riddle, the path her text takes before a model reads it, the parse request and its reply, the paraphrase, the verdict `judgeCompose` gives, the riddle's events, the composing stream, what the report, the Parent Room and the Diary show of riddles, acceptance test 3 and the composing flag. It also covers the construction riddles, whose targets come from seven constructions besides the word-problem types (REQ-7200). The construction riddles are one backlog item after the MVP, which REQ-6682 keeps out of the first version and ADR-0380 and ADR-0440 place after it. Every passage below that states them says so, except the masker and the reply check, whose time the first open finding names. It is written at the level of engine functions, request classes, events and flow states, and names no screen layout.

It leaves the rest to other specifications. SPC-0040 states the task generator, the answer checks and the rule that cards replace free composition until the parser passes. SPC-0100 states the gateway, its roles and tiers, the egress guard's general rules, the play key's buckets and what leaves the Mac. SPC-0110 states the story's free-text field, its note and its waiting times. SPC-0060 states the knowledge model, its node states and the streams of the addendum's new forms, SPC-0020 the log and its projections, SPC-0080 the task window's controls and SPC-0190 the build order and the MVP scope guard. The rewards for each verdict other than `unparsed` belong to ADR-0140, for construction riddles too. The retention-check hold that keeps a node out of every riddle belongs to ADR-0400, and the shared rules of addendum 2's report figures to ADR-0380.

## Boundary

### Surfaces

| Surface | What it is |
| --- | --- |
| `judgeCompose(target, graph)` | A pure function in `src/shared/compose.ts` that returns `composeVerdict`, `composeErrorClass` and `wrongNumbers` for a target and a graph. The card builder and, after the MVP, the expansion of named operations live in the same module. |
| `ParseRequest` | The gateway's request class for a parse: a strict zod schema holding the fixed parse prompt by its hash, the masked text, the token list and the schema version, and no other field. The token list and the schema version stay on the server to check the reply, and the body the gateway sends is exactly the fixed parse prompt and the masked text. |
| `PARSE_MODEL` | The gateway role that parses a riddle: player tier, `zdr: true`, the player-tier provider list, the play key, a 10-second timeout and `max_tokens` 4,000. Its model id defaults to the one `LIVE_CHECK_MODEL` is configured with. |
| Parse reply | Strict JSON: the quantities, each with its `n` or `d` token and the span of her text that names it; the question with its span; a graph of operations over the tokens; and, for each division, whether it shares into parts or groups by a size. After the MVP the graph can also use the six named operations of REQ-7218. |
| `COMPOSE_FREE` | The composing flag. With it off, only card riddles play. |
| `PARSE_BUDGET_USD_PER_DAY` | The parse bucket, $0.1 a game day on the play key. |
| `content/numerals.ru.json` | The Russian number words the masker reads, each entry with its class, `n` or `d`, and every gender and case form. |
| `content/i18n/ru.json` | The riddle's field label, starters, buttons, waiting line, unparsed line and paraphrase templates, and after the MVP the constructions' paraphrase templates, meaning notes and the report's «ещё не предлагалась» (not offered yet). |
| Frame files | The card frames and the paraphrase key set of each word-problem template and, after the MVP, of each construction. |
| Construction template fields, after the MVP | A word-problem template with the purpose `compose` becomes a construction template by declaring `construction`, one of `equal_groups`, `division_meanings`, `fraction_of`, `decimal`, `percent`, `ratio` and `multi_step`, and, for `division_meanings` alone, `divisionMeaning`, `share` or `group`. |
| `verify --live --compose` | Acceptance test 3, run on the offline key with the gateway in its `verify` mode. |
| `tests/reference/compose.ru.json` | The reference set of acceptance test 3. |
| `verify/parser-eval.json` | The record of each run of test 3, keyed by parse model and parse prompt hash, holding the pass of the 200 texts and, after the MVP, the pass of each family subset. |

### Events this part owns

The verdicts and error classes of a riddle appear only in `compose_parsed` and `compose_confirmed`, in the field `composeVerdict` and its companions, which no other attempt uses (REQ-5242). The checker's `unparsed` of SPC-0040, an entry such as «3,,5» that is never submitted, lives in the ordinary verdict field and never in `composeVerdict`.

| Event, v1 | Payload |
| --- | --- |
| `compose_shown` | `riddleId`, `form` (`cards` or `text`), `targetKind` (`expression`, `diagram` or `note`), the target as rendered, template and version, seed, node, tier, `problemType`, and for cards the card set with each card's role |
| `compose_submitted` | `riddleId`, `round` (1, or 2 after a correction), her raw text or her ordered card ids, the input summary SPC-0020 defines, the masked text, the token mapping, the trigger and judge levels, and `dontKnow` |
| `compose_parsed` | `riddleId`, `round`, `parseOutcome` (`ok`, `parse_timeout`, `parse_invalid`, `parse_no_question`, `safety_unchecked`, `mask_incomplete` or `wait_exceeded`), the graph with its operations as the parser named them, the paraphrase as shown and the `llm_call` event id |
| `compose_confirmed` | `riddleId`, `answer` (`yes`, `no`, or `none` for cards and for a riddle closed without an answer to a paraphrase), `corrected`, `composeVerdict`, `composeErrorClass`, `wrongNumbers` and `form` |
| `compose_labelled` | `riddleId` and the verdict the parent assigns by `judgeCompose`'s rules |

The flow appends exactly one `compose_confirmed` for each riddle it closes, whatever ends it. A riddle closed by «Не знаю» or the serious path carries an empty `composeVerdict`, and one closed by a parse failure, `safety_unchecked`, `wait_exceeded` or her «Нет» to the paraphrase of her corrected text carries `unparsed`. A text riddle stopped by `mask_incomplete` turns into a card riddle for the same target, and that card riddle closes with one `compose_confirmed` of `form: cards`. Her answer to the first paraphrase is «Нет» exactly when `corrected` is true. `answer` holds her answer to the paraphrase of the closing round, and `none` when that round showed no paraphrase.

After the MVP, a construction riddle adds no event type and no event field. Its construction is read back from the template and version in `compose_shown`, `compose_parsed.graph` holds the graph before the expansion and no event holds the expanded graph (REQ-7230), and `composeErrorClass` gains three values.

### Statuses and error names

| Name | Audience | Meaning |
| --- | --- | --- |
| `parse_timeout`, `parse_invalid`, `parse_no_question` | the owner, in `llm_log` | the parse failed, and the riddle ends as `unparsed` |
| `safety_unchecked` | the owner, in `llm_log` | no judge on the safety check's route answered |
| `mask_incomplete` | the owner, in `./meowtower status` | the egress guard found a word the masker masks, or a digit, in a `ParseRequest` |
| `wait_exceeded` | the owner, in `llm_log` | 12 seconds, the story's fallback moment SPC-0110 states, passed from «Готово» (Done) without a paraphrase |
| `parse_budget_short` | the parent, in the day's cost line | the parse bucket can't reserve two worst-case parses |
| `compose_flag_off` | the owner, in `./meowtower status`, once per change of model or prompt | no passing test 3 on the 200 texts for the configured `PARSE_MODEL` and prompt hash |
| `compose_test_failed` | the owner, in the verify report | test 3 missed 95% agreement or the 2% bound on the 200 texts |
| `card_frames_missing` | the developer | a word-problem template has no card frames |
| `compose_family_off`, after the MVP | the owner, in `./meowtower status`, one line listing every such family on each run while any family is off | `verify/parser-eval.json` holds no pass for a family on the configured model and prompt hash |
| `compose_family_test_failed`, after the MVP | the owner, in the verify report | a family subset agreed on fewer than 48 of 50 texts |
| `construction_gate_closed`, after the MVP | the parent, in the report line, which shows «ещё не предлагалась» (not offered yet) for a construction with no riddles | no construction's nodes pass the gate |
| `construction_template_invalid`, after the MVP | the developer | a division template without `divisionMeaning`, a ratio template naming no total or known part, or a construction without card frames, paraphrase templates or a meaning note |

### What this part requires from other parts

- SPC-0040 supplies the word-problem templates, the target built with the purpose `compose`, exact rational values and the rule for when cards replace free composition.
- SPC-0100 supplies the gateway, the egress guard, the judge route, the play key's buckets, `llm_log` and the start-up check of player-tier roles.
- SPC-0110 supplies the local triggers, the serious path, the free-text field and the guard that cleans the names the parent set.
- SPC-0020 supplies `appendEvents` and the projections' rebuild.
- SPC-0060 supplies the node states the Director reads, `testedState` and `inferredState` included, and the activation rule that keeps the composing stream out of every estimate.
- SPC-0160 supplies the per-language content files and the text gate every frame file passes.
- ADR-0400 supplies the Director's reject predicate, which refuses a riddle that names a node held for a retention check.

The permitted dependencies run one way. `src/shared/compose.ts` imports only `src/shared/` and makes no network call, so client and server run the same verdict. Only the gateway sends a `ParseRequest`, and only the compose flow on the server builds one. The token mapping and every token's value live in the riddle's server state and the log, and no request class has a field for them. The Master's request builder and its story memory read nothing from `compose_submitted` or `compose_parsed`. Projections read riddles only from the five events above. No model writes a card frame or a paraphrase template while the player plays, nor, after the MVP, a construction's meaning note (REQ-7282).

## Behaviour

### Offering a riddle

The Director offers a riddle as a story scene outside the room slots, set by a Tangle or a Guardian, so a riddle adds nothing to a room's length (REQ-5264). `planFloor` places at most one riddle on a floor, and only on a floor that holds word problems (REQ-6420). The Director offers at most 2 riddles a game day, of either form and of any source (REQ-5258). The Director never offers a riddle that names a node held for a retention check, as ADR-0400 states.

A word-problem riddle's target is a word-problem template of that floor, of a problem type whose tier node is at "understands" or above (REQ-5256). The generator builds the target as an expression, a bar diagram or a short note, with the purpose `compose`.

After the MVP, a riddle's target can also come from a construction template (REQ-7200): equal groups such as `7 · 8`, the two meanings of division such as `120 : 6`, a fraction of a number such as `3/4 от 20` (3/4 of 20), decimals such as `2,5 · 4`, percentages such as `25 % от 80` or the discount `80 − 20 % от 80`, ratios such as a division of 30 in the ratio 3 : 2, and multi-step expressions such as `(120 − 30) : 3`. A construction template can come from any floor, whether or not the floor's rooms train its nodes (REQ-7240). Among the eligible sources, the problem types that pass REQ-5256 and the constructions that pass the gate below, the Director picks the one with the fewest confirmed riddles over the last 28 game days and breaks a tie by the riddle's seed. When no construction passes the gate, the Director draws from the problem types alone, and offers no riddle when none of those passes either.

After the MVP, the Director offers a construction riddle only when every node the construction needs is at "understands" or above (REQ-7238). A node passes when its `testedState` is "understands", "fluent" or "stable", or its `inferredState` is "fluent (inferred)". The gate reads the states at the moment the Director plans the floor, so a node that falls below "understands" closes its constructions from the next floor on. The nodes are:

| Construction | Nodes |
| --- | --- |
| Equal groups | A3 |
| The two meanings of division | A4 |
| A fraction of a number | F2 |
| Decimals | D4 |
| Percentages | P2 for a percentage of a number, P3 for a discount |
| Ratios | P4 |
| Multi-step expressions | A11 and the node of each operation it uses |

After the MVP, for a multi-step expression on whole-number operands, `+` and `−` need A2 within 100 and A5 above it, `·` needs A3 within the multiplication table and A6 above it, and `:` needs A4 within the table and A9 above it. An expression that holds a decimal, a fraction, a percentage or a ratio also needs that family's node: D4, F2, P2 or P3, or P4. Code tells a discount from a percentage of a number by the target's shape: N − p % of N is a discount, and every other percentage target reads P2.

After the MVP, a ratio target names a total or a known part, so it has one value to compare (REQ-7234). A target of the two meanings of division declares its meaning in `divisionMeaning`, sharing into a number of parts or grouping by a size (REQ-7236). A `:` inside another construction's target, such as `(120 − 30) : 3`, declares no meaning. The content test refuses a division template without a meaning and a ratio template without a total or a known part.

After the MVP, for the two meanings of division, the Director asks for the meaning with fewer riddles that got `match` with no `compose_partition_vs_quotition`, counted per requested meaning over card and text riddles together, and asks for grouping by a size on a tie (REQ-7242). The target carries a meaning note from the content files that names the requested meaning in words, such as «раздели поровну на части» (share equally into parts) (REQ-7244).

### Which form a riddle plays in

The Director offers a text riddle only when the composing flag is on, the gateway's live calls are on for the adventure, the parse bucket can still reserve two worst-case parses and the parent hasn't switched off the free-text field (REQ-6420). When any of these fails, the Director offers a card riddle for the same target, as SPC-0040 states for the card form.

After the MVP, code computes each construction target's families from the numbers the target holds, and the template declares none. The four new families are fractions (a slash fraction, a fraction word, a mixed number or a fraction of a number), decimals, percentages and ratios. A target that holds none of them is whole-number, which covers equal groups, both meanings of division and a multi-step expression on whole numbers. A whole-number construction plays as text on the same four conditions, with no subset test of its own (REQ-7270). A construction of a new family plays as text only when, besides the four conditions, `verify/parser-eval.json` records on the configured parse model and prompt hash both the pass of the 200 texts and the pass of its family's subset (REQ-7264). A target that holds two families, such as a decimal and a percentage, needs the pass of each. Otherwise the construction riddle plays as sentence cards for the same target (REQ-7266).

### The compose flow

The server owns the compose flow as a state machine per riddle, and every riddle it shows runs this flow whether or not the composing stream counts it (REQ-5260). This subsection is at the level of flow states. The attempt flow of SPC-0040 and SPC-0080 doesn't apply to a riddle.

1. `compose_open`: the task window shows the target, and after the MVP, for a division construction, its meaning note. For a text riddle it shows the story's free-text field, with its note «Эту историю могут читать мама и папа» (Mum and Dad can read this story) and the three starters «У…было…» (…had…), «Купили…» (They bought…) and «Шли…» (They walked…) (REQ-5268, REQ-5266). The field takes 1 to 4 sentences and at most 600 characters. For a card riddle it shows the cards and a strip to order them in. The window also holds «Не знаю» (I don't know), «Готово» and the thread button, which stays visible and inactive.
2. `compose_checking`, text riddles only: the server runs the steps under "Her text before a model reads it", and the familiar shows the waiting line from the content files.
3. `compose_paraphrase`, text riddles only: the familiar shows the paraphrase with «Да, так» (Yes, that's it) and «Нет, я имела в виду другое» (No, I meant something else) (REQ-5266).
4. `compose_correcting`, reached once, after her first «Нет»: the field opens again holding her first text, and she edits it and presses «Готово». The attempt stays unassisted (REQ-5238). The log marks the attempt corrected and keeps both texts (REQ-5240). The corrected text passes steps 2 and 3 again.
5. `compose_review`: `judgeCompose` gives the verdict, and the window shows the short review. For `match` the review opens on a tap.
6. `compose_closed`: she taps to leave, and the story goes on.

A card riddle goes from `compose_open` to `compose_review` with no paraphrase and `answer: none`. Each card carries the role the engine gave it, and a card set holds the frame's sentences and 2 distractors: one with the other relation, such as «на» (by) for «в» (times), and one question for a different unknown. «Не знаю» in either form closes the riddle with the short review, an empty verdict and no count in the stream.

After the MVP, a construction's card set holds the cards its target needs, each with its role, and the same 2 distractors. Equal groups and both meanings of division use three roles, the size of a group, the number of groups and the total, and the unknown's role sets the operation. The distractor with the other relation carries the construction's named error: a `·` card where the target divides, or the reverse; for a percentage, a card that uses the percentage as a plain number; for a ratio from a known part, a card that adds the difference.

The short review is one example riddle the engine builds from the target's template frame and the target's numbers, in the familiar's voice, with no word of error. No riddle has a twin, and a riddle that gets `wrong_structure` ends with the short review (REQ-5262).

The riddle ends as `unparsed`, with base experience and no observation, when she rejects the paraphrase of her corrected text or her corrected text fails to parse (REQ-5236). The player sees one fixed familiar's line for every `unparsed` riddle, saying the familiar couldn't untangle it.

### Her text before a model reads it

A text riddle's text passes these steps in order before any parse request leaves the Mac (REQ-5220):

1. The local triggers of SPC-0110 run on her raw text. A serious trigger takes the story's serious path: the fixed line, the pause and the notice (REQ-5222). The riddle then ends with an empty verdict, and nothing is sent.
2. The egress guard cleans the names the parent set, as for her story text.
3. The masker replaces every number in the cleaned text with a token, in the order the next subsection gives. The mapping from tokens back to her words and their values stays in the riddle's server state and in `compose_submitted`, on the Mac (REQ-5204, REQ-7212).
4. The judge's safety check reads the cleaned, masked text through the judge route SPC-0100 states, whose route for each check ADR-0350 resolves to a local judge, `JUDGE_MODEL` or `SAFETY_MODEL`. A hosted call is charged to the adventure bucket, and a local call costs nothing. The request carries that text alone, with no story memory, outcome events, times, estimates, other answers or other maths result (REQ-5212). A serious result takes the serious path as in step 1 (REQ-5222).
5. The gateway sends a `ParseRequest` holding the fixed parse prompt and the cleaned, masked text, and no target expression, node id, topic name, problem type, construction, verdict or other answer (REQ-5200).

### The masker

The masker reads every word from `content/numerals.ru.json` and masks in this order, the digit forms first and the longest form first:

1. A mixed number in digits, a whole number, a space and a slash fraction such as «2 1/2», then a slash fraction such as «3/4», then a decimal with a comma or a point such as «2,5», each become one `n` token (REQ-7202).
2. A round cardinal of tens or hundreds followed by an ordinal of a lower order, such as «двадцать пятых» (twenty-fifths) or «сто первый» (hundred and first), becomes one `d` token whose value is the whole compound denominator (REQ-7206). A run that forms no compound ordinal, such as «двадцать одна пятая» (twenty-one fifths), keeps its cardinals as `n` tokens and its ordinal as a `d` token.
3. Every fraction word, «половина» (a half), «треть» (a third) and «четверть» (a quarter), and every ordinal from «первый» (first) to «тысячный» (thousandth), in every gender and case, becomes a `d` token, `d1` to `dk` in text order (REQ-7204). An ordinal used as a position, such as «на третьей полке» (on the third shelf), is masked too, and the graph leaves it unused like irrelevant data.
4. Each multiplicative word from «вдвое» (twice) to «вдесятеро» (ten times) becomes an `n` token with its preposition kept, so «вдвое» becomes «в n1 раза» (n1 times), and «пополам» (in half) becomes «на n1 части» (into n1 parts) with n1 = 2 (REQ-7208).
5. Every other digit run and every other word of REQ-7202's set becomes an `n` token: every cardinal numeral, compound ones such as «сорок восемь» (forty-eight) included, every collective numeral from «двое» (two) to «десятеро» (ten), «полтора» (one and a half), «десяток» (ten), «дюжина» (a dozen), «сотня» (a hundred) and «пара» (a pair, value 2), each in every case form (REQ-7202).

The `n` tokens run `n1` to `nm` in text order. «Целых» (wholes) stays a word. The egress guard refuses a `ParseRequest` whose text still holds a digit, a word of REQ-7202's set, a fraction word, an ordinal, a multiplicative word, «пара», «пополам» or a word of a cardinal-plus-ordinal run, as `mask_incomplete` (REQ-7214). Nothing is sent, and the riddle turns into a card riddle for the same target.

The masking test generates every case and gender form of each word REQ-7202, REQ-7204 and REQ-7208 add, and of cardinal-plus-ordinal runs such as «двадцать пятых», from the OpenCorpora dictionary, which `content/numerals.ru.json` wasn't written from (REQ-7216). It runs them through the masker and finds no number word left, «2 1/2», «3/4» and «2,5» each as one token and «двадцать пятых» as one `d` token.

### The parse

`PARSE_MODEL` sends only to a zero-retention endpoint at a provider on the player-tier list (REQ-5208). The server refuses to start when `PARSE_MODEL` has no such endpoint (REQ-5210). The gateway writes a row to `llm_log` for every parse call (REQ-5214).

Every parse call spends from the parse bucket of $0.1 a game day on the play key, and from no other bucket (REQ-5216). Before a call the gateway reserves the worst case: 3,100 input tokens at $0.75 a million and 4,000 output tokens at $3.75 a million, about $0.017. It settles the reservation at the call's real cost, about $0.004 for a typical 400-token reply. The flow makes at most 2 parse calls a riddle.

After the MVP, the fixed parse prompt reads a colon between two tokens as a division, unless «в отношении» (in the ratio) or «на … приходится» (for … there are) marks a ratio (REQ-7220). The reply's graph can then use six named operations over tokens: a fraction a/b, a mixed number, a fraction of a number, a percentage of a number, a share of a ratio from its total and a part of a ratio from a known part (REQ-7218). The prompt reads an ordinal followed by «часть» or «доля» (part, share), such as «третья часть» (the third part), as a fraction with the ordinal's `d` token as its denominator, and a = the count before it or a = 1 when none stands there. A change to the prompt changes its hash.

The engine refuses the reply as invalid when the JSON fails the schema, when a span isn't found word for word in the masked text, or when the graph names a number other than an `n` or `d` token of the masked text it sent (REQ-7210). The constant 100 of a percentage, the sum of a ratio's parts and the numerator 1 of a fraction word with no count come from the named operation's fixed definition in code, and the graph never names them. A timeout after 10 seconds, an invalid reply or a graph with no question gives the riddle the verdict `unparsed`, with base experience and no observation (REQ-5288). On a valid reply the engine puts her own number forms back into the spans from the mapping.

After the MVP, a story that needs a unit conversion to join its quantities, such as «2 кг 500 г» (2 kg 500 g), ends as `unparsed` (REQ-7232). Its graph either names the conversion factor, which is no token, and fails as `parse_invalid`, or leaves a quantity out and fails as `parse_no_question`. The engine gives it the same outcome and the same fixed line as any other parse failure.

### The paraphrase

The paraphrase holds only template strings from the per-language content files, one set per problem type and per operation, and after the MVP also per construction and per named operation, and the spans the engine found word for word in her text (REQ-5234). It retells the story and the question in words, with no expression, sign or value. The riddle's field label, its three starters, the paraphrase templates and the two confirmation buttons each come from `content/i18n/ru.json`, and a second language adds its own file (REQ-5266). After the MVP, a construction's card frames, paraphrase templates and meaning note also come from the per-language content files (REQ-7276).

### The verdict

`judgeCompose(target, graph)` takes the target and the graph she confirmed, or the graph her ordered cards form, and returns the same verdict for the same pair every time; no model supplies it (REQ-5224). After the MVP it first expands every named operation in both over exact rationals by this table (REQ-7222, REQ-7224, REQ-7226):

| Named operation | Expands to |
| --- | --- |
| a/b of N | N : b · a |
| p % of N | N : 100 · p |
| the first part of T in the ratio a : b | T : (a + b) · a |
| the second part of T in the ratio a : b | T : (a + b) · b |
| the other part from a known part K of a : b | K : a · b, with a the term that matches K and b the term asked for, wherever each stands in her text |
| a fraction a/b as a number, in one token or as a count and a fraction word | a : b, with a = 1 when no count stands before the fraction word |
| a mixed number, in digits or in words such as «два с половиной» (two and a half) | its whole part + a : b |

For a fraction or a mixed number masked as one `n` token, the engine reads the whole part, a and b from that token's value in the mapping, which the riddle's server state holds as an exact rational. So «разделили 20 на 4 части и взяли 3» (divided 20 into 4 parts and took 3) and «три четверти от 20» (three quarters of 20) give the same expanded graph and `match`. A graph with no named operation passes the expansion unchanged.

The function then normalises both graphs with `+` and `·` commutative and associative and `−` and `:` in fixed order, and decides by the table below. After the MVP, a construction riddle gets its verdict by the same table applied to the expanded graphs, with no verdict or match rule of its own (REQ-7228), so «четверть от 80» (a quarter of 80) for the target `25 % от 80` gets `match_other_structure`.

| Verdict | When | Requirement |
| --- | --- | --- |
| `match` | the same operations on the same numbers, so «6 · 4 + 6» matches «6 + 4 · 6» | REQ-5226 |
| `match_other_structure` | other operations with the target's value, such as «6 · 5» for «6 · 4 + 6» | REQ-5228 |
| `wrong_structure` with `wrongNumbers: true` | the target's operations on other numbers | REQ-5230, REQ-5232 |
| `wrong_structure` | any other value, a reversed `−` or `:` such as «6 : 48» for «48 : 6» included | REQ-5298 |
| `unparsed` | a parse failure, a rejected correction or a failed correction parse | REQ-5288, REQ-5236 |

The function also returns one error class, which the error-type limit places in the conceptual class (REQ-5244, REQ-7252). Each class sits beside the verdict the table gives:

- `compose_percent_as_number`, after the MVP, when the named graph uses a percentage's token as a plain operand where the named target holds it inside a percentage, as in 80 − 20 for `80 − 20 % от 80` (REQ-7248).
- `compose_ratio_additive`, after the MVP, when the target is the part K : a · b from a known part K and the graph's structure is K + b − a, whatever its value (REQ-7250).
- `compose_times_vs_divide`, after the MVP, when the expanded graph has `·` where the expanded target has `:` on the same numbers, or the reverse (REQ-7246).
- `compose_on_vs_times` when a `+` or `−` stands where the target has a `·` or `:` on the same numbers, or the reverse.
- `compose_partition_vs_quotition` when a division matches and its kind, sharing or grouping, differs from the kind the target declares. That graph keeps `match`. A `:` whose target declares no meaning gets no such class.
- `compose_order` when the operations and numbers match and their order doesn't.

Where two classes fit, the riddle takes the first in the order of this list.

### The composing stream and what it stays out of

A riddle, of either form and any source, is no observation for the "on her own", "with help" or fluency estimates, a block, a probe, a node state or the success share the Director reads before a room slot, until the activation rule SPC-0060 states admits the composing stream (REQ-5246). A riddle doesn't count towards any step of the holding-steps limit (REQ-5248). A riddle counts in neither part of the step-input share of compound word problems, and it doesn't advance the item builder's counter of first-shown compound problems (REQ-5250).

The composing stream is a projection of `compose_confirmed`. For a word-problem riddle it keeps, per tier, problem type and form, the count of each verdict other than `unparsed` and the count of each error class (REQ-5252). After the MVP, for a construction riddle it keeps, per construction and form, text or cards, the count of each verdict other than `unparsed` and of each error class (REQ-7254). For the two meanings of division it also keeps each verdict's count per requested meaning and per the division kind the graph gives (REQ-7256). These counters have fixed keys and don't grow with play.

### The report, the Parent Room and the Diary

The report shows the line «Может составить задачу» (Can compose a problem) beside the matrix of type by steps, as the composing stream's counts and no state (REQ-5254). After the MVP the line also shows the counts per construction and form and the division counts per meaning, as counts with no state drawn from them (REQ-7258), and shows «ещё не предлагалась» for a construction with no riddles.

The Parent Room lists every riddle, construction riddles included after the MVP, with its composed text, both texts of a corrected riddle, the paraphrase, her answer to it and the verdict (REQ-5294). The list has a control to label a logged riddle by `judgeCompose`'s rules, which appends `compose_labelled` and changes no verdict. The Parent Room also shows the share of paraphrases she rejected over the last 30 days (REQ-5296). The share counts as shown each `compose_parsed` with `parseOutcome: ok`, and as rejected each `compose_confirmed` with `corrected: true` plus each with `answer: no`.

The server renders the Diary pages «Загадки героини» (The heroine's riddles) on demand from `compose_submitted` and `compose_confirmed`. They show each riddle with `match` or `match_other_structure` in her text as the log holds it, leave out any riddle with a trigger or signal above none, and store nothing; no model writes any part of the pages (REQ-5270). No composed text enters a `StoryRequest` or the Master's story memory (REQ-5272).

### Acceptance test 3 and the composing flag

`verify --live --compose` runs the configured `PARSE_MODEL` with the fixed parse prompt on masked text, in the live verification run, on the offline key (REQ-5274). It spends at most $4 a run in the MVP and at most $9 a run once the construction item is built.

The reference set `tests/reference/compose.ru.json` holds 200 texts (REQ-5278). Among them are child-like spelling errors, dictated text, number words, problems with no question, irrelevant data, every verdict, every compose error class and correct problems in each allowed order of operands. After the MVP the 200 texts hold at least 20 texts each of equal groups, the two meanings of division and multi-step expressions with brackets, and at least 10 of each meaning of division (REQ-7268). The parent labels every text by `judgeCompose`'s rules before any parser runs on it (REQ-5276).

After the MVP, the reference set also holds, apart from its 200 texts, a subset of 50 labelled texts for each of fractions, decimals, percentages and ratios (REQ-7260). The subsets include decimal operators below 1, percentages used as plain numbers and additive ratios, with no minimum count per named error (REQ-7262). The fraction subset holds stories that write a fraction as an ordinal with «часть». Beside the subsets the set holds at most 20 stories that need a unit conversion, labelled `unparsed`. The set holds at most 420 texts, and the content test fails the build above that.

The test reports how often each labelled verdict was judged as each verdict, beside the overall agreement (REQ-5280). The 200 texts pass when agreement is at least 95% and fail when more than 2% of the texts labelled `match` are judged other than `match` (REQ-5282). The test checks from `llm_log` that every parse request body is exactly the fixed parse prompt and the masked text of its riddle (REQ-5284). It plants the distinctive target «7 · 13 − 29» in a fixture and finds it in no logged parse request (REQ-5286).

After the MVP, the same run reports each family subset's agreement, and a subset passes when it agrees with the labelled verdicts on at least 48 of 50 texts. It reports the unit stories apart and leaves them out of each family's 48 of 50 (REQ-7272). For each meaning of division it reports how often the division kind the parse gave agrees with the labelled kind, with no pass floor (REQ-7274).

A run writes to `verify/parser-eval.json` one record per parse model and prompt hash, holding the pass of the 200 texts and each family's pass. The file keeps at most 5 such pairs; a passing run that would add a sixth drops the oldest pair and says so once in the verify report. The composing flag stays off unless that file holds a pass on the 200 texts for the configured `PARSE_MODEL` and prompt hash, so a change of parse model or prompt turns text riddles off until test 3 passes again (REQ-5290). With `COMPOSE_FREE` on and no such record, the server starts with the flag off, offers card riddles only and shows `compose_flag_off` in `./meowtower status`.

If the owner judges that the masked parse can't pass test 3, the card form is the only form: the engine builds and judges sentence cards with no model, and no unmasked parse request exists (REQ-5292).

### Strings

After the MVP, every player-facing string the construction riddles add is in Russian (REQ-7280). A Dutch form of a construction string depends on the owner amending the Russian-only rule in `CLAUDE.md`; until then none exists. A construction's card frames, paraphrase templates and meaning note pass the checks every frame file passes before they ship, so none carries a number or names the operation (REQ-7278), and all are written offline (REQ-7282).

## Failure paths

| Condition | What happens |
| --- | --- |
| A serious trigger or a serious judge result on her composed text | The story's serious path runs; the riddle ends with an empty verdict and nothing is sent to the parser (REQ-5222). |
| No judge on the safety check's route answers | Nothing is sent to the parser; the riddle ends as `unparsed` with the fixed line, cause `safety_unchecked`. |
| The egress guard finds a digit or a word the masker masks in a `ParseRequest` | Nothing is sent, and the riddle turns into a card riddle for the same target (REQ-7214). `mask_incomplete` is reported once per cause; for a word form of REQ-7204, REQ-7206 or REQ-7208 or a form REQ-7202 adds, `./meowtower status` shows one line per missed form on every run until the numerals file gains it. |
| The parse times out after 10 seconds, returns invalid JSON or returns a graph with no question | The riddle ends as `unparsed`, with base experience, no observation and the fixed line (REQ-5288). |
| The graph names a number other than an `n` or `d` token of the text sent, or a span isn't found word for word in the masked text | The engine refuses the reply as invalid, and the riddle ends as `unparsed` (REQ-7210, REQ-5288). |
| A story needs a unit conversion | The riddle ends as `unparsed` through `parse_invalid` or `parse_no_question`, with the fixed line (REQ-7232). |
| 12 seconds pass from «Готово» without a paraphrase | The riddle ends as `unparsed` with the fixed line (`wait_exceeded`), and a late reply is dropped. |
| She rejects the paraphrase of her corrected text, or the corrected text fails to parse | The riddle ends as `unparsed`, with base experience and no observation (REQ-5236). |
| The parse bucket can't reserve two worst-case parses | The Director offers a card riddle (`parse_budget_short`) (REQ-6420). |
| The composing flag is off, live calls are off or the parent switched off the free-text field | The Director offers a card riddle (REQ-6420). |
| `COMPOSE_FREE` is on and `verify/parser-eval.json` holds no pass on the 200 texts for the configured `PARSE_MODEL` and prompt hash | The server starts with the flag off, offers card riddles only, and `./meowtower status` shows `compose_flag_off` once per change of model or prompt (REQ-5290). |
| After the MVP, the file holds no pass for a construction's family on the configured model and prompt hash | That family's construction riddles play as cards (`compose_family_off`) (REQ-7264, REQ-7266). |
| After the MVP, a family subset agrees on fewer than 48 of 50 texts | The family stays on cards (`compose_family_test_failed`); the owner judges whether to relabel, retry or change the prompt. |
| `PARSE_MODEL` has no zero-retention endpoint at a player-tier provider | The server refuses to start (REQ-5210). |
| Test 3 misses 95% agreement or the 2% bound on the 200 texts | The flag stays off (`compose_test_failed`); the owner judges whether a retry or the cards-only form follows (REQ-5282, REQ-5292). |
| A word-problem template has no card frames | The Director skips that template for riddles, and the content test fails the build (`card_frames_missing`). |
| After the MVP, a division template has no `divisionMeaning`, a ratio template names no total or known part, or a construction has no card frames, paraphrase templates or meaning note | The Director skips that construction, and the content test fails the build (`construction_template_invalid`). |
| After the MVP, no construction's nodes pass the gate | The Director draws from the problem types alone, or offers no riddle when none passes there either (`construction_gate_closed`). |
| The reference set holds more than 420 texts | The content test fails the build. |
| The day already holds 2 riddles, or the floor has no word problems | The Director places no riddle (REQ-5258, REQ-6420). |

## Open findings

- REQ-7202 supersedes REQ-5202, and ADR-0440's amendments rewrite ADR-0230's and ADR-0210's masker to the wider word set with no mark of time, while ADR-0440 and ADR-0380 place the whole riddle extension, "the same masker, expansion and gate", after the MVP under REQ-6682. The decisions don't say whether the MVP masker masks REQ-7202's set with decimals, slash fractions, mixed numbers, «пара» and the multiplicative words, and REQ-7204's `d` tokens, or only the set REQ-5202 named. The same holds for REQ-7210, which supersedes REQ-5206 and lets the reply name `d` tokens and the fixed constants of a named operation. This document states the masker and the reply check in force without a mark of time and leaves the choice to a decision.
- ADR-0440 says what a passing run does when `verify/parser-eval.json` already holds 5 pairs of parse model and prompt hash, and not what a failing run with a new pair does then: whether it writes a record, and which pair it drops. This document leaves the choice to a decision.
- REQ-5278 asks the 200 texts to hold every compose error class, and after the MVP `compose_percent_as_number` and `compose_ratio_additive` need percentage and ratio texts, which ADR-0440 puts in their own 50-text subsets beside the 200. The decisions don't say whether the 200 texts must hold those two classes and `compose_times_vs_divide`, or whether the subsets cover them. This document leaves the choice to a decision.

## Open review findings

- The first agent review of an earlier revision asked to give reasons for the 600-character cap, the inactive thread button, the 2 distractors, «Не знаю» adding no count, the 12-second wait, the split of counts by form and the $4 run budget, or a sentence pointing to ADR-0230 for them. Rejected: a specification states what the system does and never why, and those reasons stand in ADR-0230. The 12 seconds are tied to the story's fallback moment in SPC-0110, which is a fact about the system and no reason.
- The second agent review of an earlier revision asked to drop either the Director's skip of a template with no card frames or the build failure (`card_frames_missing`). Rejected: ADR-0230's failure table states both, and a spec doesn't choose between guards a decision in force sets.
- The agent review of this revision asked to name whether "the fewest confirmed riddles" counts every `compose_confirmed`, closes by «Не знаю» and the serious path included, or only riddles with a verdict. Left open: ADR-0440 uses the same words and doesn't settle it, and a specification doesn't choose where the decision is silent.
- The agent review of this revision asked for reasons, or a pointer to ADR-0440, beside the post-MVP rules such as the 28-game-day window, the 5 pairs, the 420-text cap and the class order, and noted that the header comment names a standard that gives each rule its reason. Rejected: a specification states what the system does and never why, and ADR-0440 holds each reason. The header comment is the one every record carries from the template.
- The agent review of this revision asked to move this section to the commit message or the review thread. Rejected: the method keeps each rejected or open review finding in the record, where the person approving it reads it.
- The second agent review of this revision asked to run the egress guard's `mask_incomplete` check before the safety check, so a hosted judge call isn't spent on a riddle that then turns into cards. Rejected: ADR-0230 sets the order of the five steps and puts the guard on the `ParseRequest`, and a specification doesn't reorder what a decision in force sets. The safety check's text is already masked by step 3.
