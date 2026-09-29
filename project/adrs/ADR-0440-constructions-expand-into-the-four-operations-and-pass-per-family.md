---
id: ADR-0440
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-7200, REQ-7202, REQ-7204, REQ-7206, REQ-7208, REQ-7210, REQ-7212, REQ-7214, REQ-7216, REQ-7218, REQ-7220, REQ-7222, REQ-7224, REQ-7226, REQ-7228, REQ-7230, REQ-7232, REQ-7234, REQ-7236, REQ-7238, REQ-7240, REQ-7242, REQ-7244, REQ-7246, REQ-7248, REQ-7250, REQ-7252, REQ-7254, REQ-7256, REQ-7258, REQ-7260, REQ-7262, REQ-7264, REQ-7266, REQ-7268, REQ-7270, REQ-7272, REQ-7274, REQ-7276, REQ-7278, REQ-7280, REQ-7282]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0440. «Сплети загадку» takes the seven constructions by expanding each named operation into the four operations the verdict already judges, masking fraction words as tokens of their own, gating each construction on its nodes and letting each new number family play in text only after its own 50-text test

## Decision

«Сплети загадку» (Weave a riddle) can take its target from seven constructions besides the word-problem types of T1 to T4: equal groups, the two meanings of division, a fraction of a number, decimals, percentages, ratios and multi-step expressions (REQ-7200). The parser names what she writes, such as «три четверти от двадцати» (three quarters of twenty), and `judgeCompose` expands each named operation into `+`, `−`, `·` and `:` before it applies ADR-0230's verdict table word for word, so no verdict rule changes. The masker learns decimals, slash fractions, mixed numbers, fraction words, ordinals and multiplicative words, so her numbers still stay on the Mac. Each construction plays only when its nodes are at "understands" or above, and each family that writes a new operation plays in text only after its own 50 labelled texts pass. This record is written for the owner, who evaluates it, and for the building agent. It builds on ADR-0230 as ADR-0360 and ADR-0370 amend it, and on ADR-0380, which owns addendum 2's shared rules: the counts and 80 % Wilson intervals of every report figure, the «мало данных» (too little data) floors, the four states, the owner of each new event type and field, synthetic-student check 5 and the MVP scope. This record cites ADR-0380 for those rules and doesn't restate them.

### Where the item sits

The whole item is one post-MVP backlog item, because REQ-6682 keeps the extension of «Сплети загадку» out of the first version (ADR-0380), and every family depends on the same masker, expansion and gate, which must be built and tested once before any family plays (RES-4260, decided 9). It starts only after the MVP is accepted and in the order the family chooses at the stage 0.3 review, as ADR-0190 sets for every backlog item. It adds no event type and no event field. The construction of a riddle is read back from the template and version that `compose_shown` already records, the named graph lives in `compose_parsed`'s existing `graph` field, and `composeErrorClass` gains three values. The two template fields below belong to this decision under ADR-0380's rule that each item decision owns its own fields.

### Offering a construction riddle

A construction template is a word-problem template with the purpose `compose` that declares two fields: `construction`, one of `equal_groups`, `division_meanings`, `fraction_of`, `decimal`, `percent`, `ratio` and `multi_step`, and, for `division_meanings` alone, `divisionMeaning`, `share` (into a number of parts) or `group` (by a size) (REQ-7236). A `:` inside another construction's target, such as `(120 − 30) : 3`, declares no meaning, so `compose_partition_vs_quotition` doesn't fire on it (REQ-7236). A ratio template names a total or a known part, so its target has one value (REQ-7234). The content test refuses a division template without a meaning and a ratio template without a total or a known part, so the rule holds every time and needs no reviewer.

Code computes each template's families from its target, and the template doesn't declare them, because a declared family can disagree with the numbers the target holds. The four new families are fractions (a slash fraction, a fraction word, a mixed number or a fraction of a number), decimals, percentages and ratios. A target that holds none of them is whole-number, which covers equal groups, both meanings of division and a multi-step expression on whole numbers. A multi-step target that holds, say, a decimal and a percentage belongs to both families and needs both passes (REQ-7270), a default I chose because the parse of such a story has to handle both.

The Director offers a construction riddle only when every node the construction needs is at "understands" or above: A3 for equal groups, A4 for the two meanings of division, F2 for a fraction of a number, D4 for decimals, P2 for a percentage of a number or P3 for a discount, P4 for a ratio, and A11 with the node of each operation for a multi-step expression, as REQ-7238 lists them with its default nodes per operation. Code tells a discount from a percentage of a number by the target's shape, N − p % of N being a discount and every other percentage target reading P2, so no template field can disagree with the target. A node passes when its `testedState` is "understands", "fluent" or "stable", or its `inferredState` is "fluent (inferred)" (ADR-0060). The gate reads the state at the moment the Director plans the floor, so a node that falls below "understands" closes its constructions from the next floor on.

ADR-0230's floor rule stays as REQ-6420 words it: at most one riddle on a floor that holds word problems, and at most 2 riddles a game day. On such a floor the target can come from any construction whose nodes pass the gate, whether or not the floor's rooms train those nodes, because a riddle plays as a story scene outside the room slots (REQ-7240, REQ-5264). The Director picks among the eligible sources, the problem types of ADR-0230 and the constructions of this record, the one with the fewest confirmed riddles over the last 28 game days, and breaks a tie by the riddle's seed. I chose that rule so the riddles spread over what she can compose, and I took the window of 28 game days from RES-4210's profile, so both readings of the composing stream cover the same span.

For the two meanings of division, the Director asks for the meaning with fewer riddles that got `match` with no `compose_partition_vs_quotition`, counted per requested meaning, and asks for grouping by a size on a tie (REQ-7242). It counts card riddles and text riddles together, a default I chose because a card story carries its meaning in the roles of its cards as a text story does in its words. The target carries a note from the content files that names the meaning in words, such as «раздели поровну на части» (share equally into parts), so she knows which meaning was asked (REQ-7244).

A construction riddle plays in text form only when ADR-0230's four conditions of REQ-6420 hold and `verify/parser-eval.json` records a pass for every family of its target on the configured parse model and prompt (REQ-7264). A whole-number construction needs only the pass on the 200 texts, as they stand after REQ-7268's counts are met and on the new prompt (REQ-7270). Otherwise the riddle plays as sentence cards for the same target (REQ-7266).

### Cards for the constructions

A construction's card set follows ADR-0230: the cards the target needs, each with its role, and two distractors. Equal groups and both division meanings use the three roles of Yamamoto et al. (2014, in RES-4260), the size of a group, the number of groups and the total, and the unknown's role decides the operation. I chose the distractor with the other relation from the construction's named error: a `·` card where the target divides, or the reverse; for a percentage, a card that uses the percentage as a plain number; for a ratio from a known part, a card that adds the difference. The second distractor asks for a different unknown, as in ADR-0230. So the card form offers the errors the studies name, and it still shows only two distractors, the number ADR-0230 chose to keep the hint small.

### The masker and the parse

A text riddle's text passes ADR-0230's five steps before a parse request leaves the Mac, and step 3, the masker, widens:

1. It masks digit forms first and the longest form first: a mixed number such as «2 1/2», then a slash fraction such as «3/4», then a decimal with a comma or a point such as «2,5», each as one `n` token (REQ-7202). I chose longest first, because a mixed number read as a whole and a fraction would give two tokens and a graph that can't join them.
2. It masks a round cardinal of tens or hundreds followed by an ordinal of a lower order, such as «двадцать пятых» (twenty-fifths), as one `d` token whose value is the whole denominator (REQ-7206). With no count before it, the engine reads such a run as 1/25 (REQ-7224), and the paraphrase shows her that reading.
3. It masks every fraction word and every ordinal from «первый» (first) to «тысячный» (thousandth) as a `d` token, `d1` to `dk` in text order (REQ-7204). An ordinal used as a position, such as «на третьей полке» (on the third shelf), is masked too, and the graph leaves it unused like irrelevant data, because only the parse can tell a position from a denominator, and an ordinal left unmasked would fail the guard as `mask_incomplete`.
4. It masks each multiplicative word as an `n` token with its preposition kept, so «вдвое» (twice) becomes «в n1 раза» (n1 times), and «пополам» (in half) becomes «на n1 части» (into n1 parts) with n1 = 2 (REQ-7208). The preposition stays, because it tells the parser that «в n1 раза» multiplies or divides by n1 and «на n1 части» shares into n1 parts, the same forms it reads when she writes a digit.
5. It masks the cardinals and the other words of REQ-7202's set, «пара» (a pair, value 2) among them, as `n` tokens.

«Целых» (wholes) stays a word, because it marks a whole part and carries no value (REQ-7204). The masker reads every word from `content/numerals.ru.json`, which gains a class per entry, `n` or `d`, and the forms above in every gender and case. The mapping from `n` and `d` tokens to her words and to their values in `Q` stays in the riddle's server state and the log, and no request class has a field for it (REQ-7212). The egress guard refuses a `ParseRequest` whose text still holds any word the masker masks as `mask_incomplete`, so a missed form fails closed and the riddle turns into a card riddle for the same target, as ADR-0360 entry 46 sets (REQ-7214). The masking test generates the case forms of every added word and of cardinal-plus-ordinal runs from the OpenCorpora dictionary, which the numerals file wasn't written from (REQ-7216).

The parse reply keeps ADR-0230's schema and gains two things. A quantity's token can be an `n` or a `d` token, and the graph can use six named operations over tokens: a fraction a/b, a mixed number, a fraction of a number, a percentage of a number, a share of a ratio from its total and a part of a ratio from a known part (REQ-7218). The engine refuses as invalid a graph that names a number other than an `n` or `d` token of the text it sent (REQ-7210). The constant 100 of a percentage, the sum of a ratio's parts and the numerator 1 of a fraction word with no count come from the operation's definition in code, so the graph never names them. The fixed parse prompt also says that an ordinal followed by «часть» or «доля» (part, share), such as «третья часть» (the third part), names a fraction with the ordinal's `d` token as its denominator and a = 1, or a = the count when one stands before it, a default I chose because a child writes «третья часть» for «треть» and the parser would otherwise read a position. The prompt gains the rule of REQ-7220 too: a colon between two tokens is a division unless «в отношении» (in the ratio) or «на … приходится» (for … there are) marks a ratio. The prompt changes, so its hash changes, and acceptance test 3 runs again before any text riddle plays on it, as the section on the test says.

A story that needs a unit conversion, such as «2 кг 500 г» (2 kg 500 g), ends as `unparsed` (REQ-7232). The parser can't join the two quantities without 1000, which is no token, so its graph either names a number the engine refuses (`parse_invalid`) or leaves the second quantity out and asks a question it can't reach (`parse_no_question`). The engine doesn't tell this case apart from other parse failures on purpose, because both end the same way for her, and telling them apart would need the unit table this record refuses.

### The verdict

`judgeCompose(target, graph)` in `src/shared/compose.ts` stays one pure function of the target and the graph she confirmed or her cards form. It first expands every named operation in both over `Q`, by these fixed rules (REQ-7222, REQ-7224, REQ-7226):

| Named operation | Expands to |
| --- | --- |
| a/b of N | N : b · a |
| p % of N | N : 100 · p |
| first part of T in the ratio a : b | T : (a + b) · a |
| second part of T in the ratio a : b | T : (a + b) · b |
| the other part from a known part K of a : b | K : a · b, with a the term that matches K and b the term asked for, wherever each stands in her text |
| a fraction a/b as a number, in one token or as a count and a fraction word | a : b, with a = 1 when no count stands before the fraction word |
| a mixed number | its whole part + a : b |

The table shows that «разделили 20 на 4 части и взяли 3» (divided 20 into 4 parts and took 3) and «три четверти от 20» (three quarters of 20) give the same expanded graph and `match`. It then normalises and decides exactly as ADR-0230's verdict table says, with no verdict and no match rule of its own (REQ-7228). A story «четверть от 80» (a quarter of 80) for the target `25 % от 80` has other operations and the same value, so it gets `match_other_structure`.

The function gives three more error classes, each in the conceptual class of the error-type limit (REQ-7252), and each beside the verdict the value comparison gives, which for these patterns is `wrong_structure` unless the values happen to be equal:

- `compose_times_vs_divide` when the expanded graph has `·` where the expanded target has `:` on the same numbers, or the reverse (REQ-7246).
- `compose_percent_as_number` when the graph uses a percentage's token as a plain operand where the target's expansion holds it inside a percentage, as in 80 − 20 for `80 − 20 % от 80` (REQ-7248). This class reads the named target and the named graph, because the expansion hides where the percentage stood.
- `compose_ratio_additive` when the target is a part K : a · b from a known part and the graph's structure is K + b − a, whatever its value (REQ-7250).

A riddle keeps one `composeErrorClass`, as ADR-0230 logs it. Where two classes fit, I chose this order, the narrower pattern first: `compose_percent_as_number`, `compose_ratio_additive`, `compose_times_vs_divide`, `compose_on_vs_times`, `compose_partition_vs_quotition`, `compose_order`. A narrow class names the idea she missed, and a wide one would hide it.

`compose_parsed` holds the graph as the parser named it, before the expansion (REQ-7230), so a later report can count operator stories apart from divide-then-multiply stories. The expanded graph isn't logged, because it is a pure function of the named one and a replay rebuilds it.

### The composing stream and the report line

The composing stream keeps, for each construction and each form, the count of each verdict other than `unparsed` and of each error class (REQ-7254). For the two meanings of division it also keeps each verdict's count per requested meaning and per the division kind the parse gave (REQ-7256). These counters have fixed keys, 7 constructions by 2 forms by 4 verdicts plus the 2 by 2 meaning split, so they don't grow with play. ADR-0180's line «Может составить задачу» (Can compose a problem) shows these counts beside the matrix of type by steps, as counts and with no state (REQ-7258). The line shows no share, so ADR-0380's rule that every share carries its count and 80 % interval has nothing to apply to here; a share added to the line later takes that rule. A construction riddle stays out of every estimate, state, probe, block, success share, holding-steps count and step-input share, as ADR-0230 keeps every riddle out (RES-4260, conclusion 13). The profile's conceptual-understanding bar reads the composing stream under REQ-6750, and ADR-0390, still a draft, counts a riddle right by ADR-0230's riddle rule, which reaches construction riddles unchanged.

### Acceptance test 3 by family

`tests/reference/compose.ru.json` gains, apart from its 200 texts, a subset of 50 labelled texts for each of fractions, decimals, percentages and ratios (REQ-7260). The subsets include decimal operators below 1, percentages used as plain numbers and additive ratios, with no minimum count per named error, because the 50 texts also have to cover every verdict of the family (REQ-7262). The fraction subset also holds stories that write a fraction as an ordinal with «часть», so test 3 finds a parser that reads them as positions. The 200 texts hold, within their 200, at least 20 texts each of equal groups, the two meanings of division and multi-step expressions with brackets, and at least 10 of each meaning (REQ-7268). Beside the subsets, the set holds at most 20 stories that need a unit conversion, labelled `unparsed`, reported apart and left out of each family's count (REQ-7272). I chose 20, because at ADR-0230's rate of about 20 texts in 15 minutes they cost the parent one sitting, and the report still shows how the parser handles them.

One run of `verify --live --compose` runs the 200 texts, the four subsets and the unit stories on the offline key, on the configured `PARSE_MODEL` and the fixed prompt. It reports the whole set by ADR-0230's rule, each subset's agreement against 48 of 50, the count RES-4260 decided as the nearest whole count at or above ADR-0230's 95 %, the unit stories apart, and, for each meaning of division, how often the parsed kind agrees with the labelled kind, with no pass floor for that agreement (REQ-7274), because 10 texts a meaning give no useful bound and the parsed kind only steers which meaning the Director asks for next, never a verdict. A run writes to `verify/parser-eval.json` one record per parse model and prompt hash, holding the whole set's pass and each family's pass. A subset passes on agreement alone, a default I chose because ADR-0230's second condition, at most 2 % of texts labelled `match` judged otherwise, is one text in 50 and would fail a family on a single slip the subset can't tell from a pattern; the whole set keeps both conditions. A family's text form plays only when both the whole set and its subset passed on the configured model and prompt (REQ-7264), so a change of either returns every family to cards until a new run passes.

A run spends at most $9 on the offline key. I chose it at 420 worst-case parses of about $0.017 each, about $7.14, plus their judge checks at ADR-0230's rate of about $0.003 a text, about $1.26, which is $8.40 with the rest as slack. RES-4260's $8 covered 400 texts and not the unit stories. The run stays inside ADR-0190's $10 a live run.

### Strings

The card frames, paraphrase templates and meaning notes of every construction come from the per-language content files (REQ-7276), pass the checks every frame file passes before they ship, so a frame can't carry a number or name the operation (REQ-7278), and are written offline, never by a model while she plays (REQ-7282). Every player-facing string this record adds is in Russian (REQ-7280). A Dutch string for a construction, beyond addendum 1's bridge keywords, waits on the owner amending the Russian-only rule in `CLAUDE.md`; until that happens this record adds none, and when it happens ADR-0160's rule for a second language covers the numerals file and the templates.

### What works once this is accepted

Once accepted, nothing changes in play until the backlog item is built, because the item is post-MVP. Once built, the Director offers card riddles for every construction whose nodes pass the gate, the engine judges them through the expansion, and the stream and the report line count them. Whole-number constructions play as text as soon as test 3 passes again on the new prompt and the revised 200 texts. Each of the four families plays as text only after the parent has labelled its 50 texts and its subset has passed live; until then it plays as cards. Removing the item leaves ADR-0230's riddles working as they were. The wider masker can stay even then, because masking more words only sends less off the Mac.

## Why

The expansion follows RES-4260's comparison. ADR-0040 already computes every answer in `Q` on `bigint`, so 2,5 · 4 and 3/4 of 20 are exact values, and every new operation is a fixed product and quotient of numbers the story names. Expanding keeps ADR-0230's verdict table and match rule word for word, which the approved requirements REQ-5226, REQ-5228 and REQ-5298 need, and the parser still gets names for what a child writes. Native operations would move the difference between "three quarters of 20" and "20 : 4 · 3" into the verdict, but I found no evidence to set the equivalence rules that would take, such as whether a quarter matches 25 % (RES-4260).

The masker is where the item was blocked. ADR-0230's word set leaves «три четверти» with a word the graph needs and can't use, and ADR-0210 already calls a decimal and a fraction one number, so the approved requirement had drifted from the decision (RES-4260). A separate `d` class tells the parser a word's role without its value, because «n1 n2 от n3» can't say which token is the denominator.

The gate reads nodes, because a construction has no problem type and ADR-0060 keeps states per node (RES-4260). It accepts an inferred "fluent", because ADR-0060's inference exists so a fluent descendant spares a prerequisite a new test.

Each family gets its own test, because one test over 200 texts can pass while a family of 50 inside it fails. The studies RES-4260 read put the errors of meaning exactly in those families: decimal operators and the two division models change the operation pupils choose (Fischbein et al. 1985, Greer 1987), adults apply whole-number arithmetic to percentages (Jacobs Danan and Gelman 2018), and the additive strategy is the most reported error in ratio tasks (Misailidou and Williams 2003). Those three findings are also the source of the three new classes.

The strongest objection is that the expansion erases the very thing the addendum asks to see. The owner's addendum 2 wants composing to show "fraction as an operator" where a school algorithm is easy to learn without meaning, and after the expansion a story that divides and multiplies gets the same `match` as one that says «три четверти от». So the verdict can't show whether she has the operator idea. I keep the expansion for three reasons. The verdict has to be fair before it is fine-grained, and every new rule needed for native operations would be a guess. `compose_parsed` keeps the named graph, so the distinction survives in the log, and a later record can count operator stories from it without a new field. And the stream feeds no estimate, so the lost distinction misleads no state.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: riddles stay on the word-problem types of T1 to T4 | no change to the masker, the parse, the gate or the test set, and nothing new for the parent to label | it drops the owner's instruction and leaves fractions, percentages and ratios, where the studies place the errors of meaning, with no composing measure |
| Cards only for the constructions, never parsed | no masker change and no parse test, a verdict in milliseconds, and Monsakun already covers multiplication and division with three roles | card words can pull her towards an operation, as the "cut" cards did in Yamamoto et al. (2014); she never writes her own story, which ADR-0230 keeps as the aim; it stays in this record as the fallback for each family until it passes |
| Named operations in the parse, expanded into `+`, `−`, `·` and `:` before the verdict (chosen) | ADR-0230's verdict table stays word for word, one normaliser, exact values from `Q`, and the named graph still in the log | the verdict can't tell an operator story from divide-then-multiply, and the masker and the gate still change |
| Native operations with their own equivalence rules in `judgeCompose` | the verdict itself tells "3/4 of 20" from "20 : 4 · 3", closer to the addendum's "graph operations" | a new match rule per operation, each a requirement change; equivalences such as 25 % and a quarter need rules nobody has written; a second verdict path to test |
| One backlog item per family, fractions first | each family ships and is accepted on its own, with a smaller first change | every family needs the same masker, expansion and gate, which would be built inside the first item and assumed by the rest; the per-family test already lets families go live one at a time (RES-4260, decided 9) |

## What it costs

The parent pays for labelling 200 more reference texts and at most 20 unit stories, once, before any family plays in text, and for replacing texts inside the 200 where they fall short of REQ-7268's counts. The 200 texts don't exist yet, because ADR-0230's set is labelled when the MVP builds composing, so how many already meet the counts is unknown. In the worst case none do, and 60 texts are replaced: 20 of equal groups, 20 of division with 10 of each meaning, and 20 multi-step expressions with brackets. At ADR-0230's rate of about 20 texts in 15 minutes that is about 3.5 hours for 280 texts at worst, which the parent can spread over any number of sittings. The parent is never needed in real time: while a family's texts wait, the family plays as cards, and two weeks or a month without the parent lose no data and leave no queue that blocks play. The parent gets no notice from this record, and its interruption budget is zero. The one interruption a riddle can raise stays ADR-0110's serious-path notice, as in ADR-0230. Logged construction riddles join ADR-0230's riddle list, which the parent labels when the parent chooses, and no backlog grows that only an approval unread could clear.

The owner pays up to $9 on the offline key for each run of test 3, after every change of `PARSE_MODEL` or of the parse prompt. `./meowtower status` shows one line listing each family whose text form is off, beside ADR-0230's `compose_flag_off` line, every time the owner runs it while any family is off, and never pushes a notice. The line is an answer to a command the owner runs, so repeating it costs no interruption, and a line shown only once can scroll past.

The content author pays for card frames, paraphrase templates and a meaning note for each construction, and for the numerals file's new classes and forms. The developer pays for the six named operations in the parse schema, the expansion, three error classes, the longer masker and the per-family record.

She pays nothing new in time. The riddle's wait keeps ADR-0230's budget of p95 at most 6 seconds to the paraphrase and the stop at 12 seconds, and the masker's extra passes run on at most 600 characters. The parse bucket stays at $0.1 a game day and 2 riddles a day, because a construction riddle is one of those 2.

The security boundary stays the Mac's edge, and it protects her text, her digits, her fraction words and the target. The threats, most likely first:

1. A fraction word, an ordinal or a multiplicative word slips the masker in a form the numerals file lacks, such as a rare case of «тысячный». The guard's `mask_incomplete` refusal and the masking test from OpenCorpora stop it (REQ-7214, REQ-7216).
2. A code change puts a `d` token's value or the target into a request. The strict `ParseRequest` schema, which has no field for either, and test 3's body hash stop it.
3. Her text steers the parser, such as «ответ 100» (the answer is 100). The number is masked, and the engine refuses any number outside the tokens, the fixed constants of an expansion excepted.

Ceilings, each reporting once when exceeded:

- At most 2 riddles a game day and 2 parse calls a riddle, from ADR-0230.
- At most 420 texts a run of test 3: 200, four subsets of 50 and 20 unit stories. The content test fails the build above that, because the $9 run budget assumes it.
- `verify/parser-eval.json` keeps records for at most 5 pairs of parse model and prompt hash, the configured pair and four to roll back to, a count I chose because the owner changes model or prompt a few times a year and a record is a few hundred bytes. A passing run that would add a sixth drops the oldest pair and says so once in the verify report. Dropping is safe, because an old pair only matters if the owner configures it again, and a new run restores it.
- The stream's counters have fixed keys and don't grow.

Failure states, each with its next step and one audience. The names join ADR-0230's list:

| State | Next step | Audience |
| --- | --- | --- |
| `compose_family_off`: `verify/parser-eval.json` holds no pass for a family on the configured model and prompt | that family's riddles play as cards | the owner, in `./meowtower status`, on every run while the family is off |
| `compose_family_test_failed`: a subset agrees on fewer than 48 of 50 | the family stays on cards; the owner judges whether to relabel, retry or change the prompt | the owner, in the verify report |
| `mask_incomplete` on a word this record adds | nothing is sent, and the riddle turns into a card riddle for the same target (ADR-0360 entry 46) | the owner, in `./meowtower status`, one line per missed word form on every run until the numerals file gains it |
| a unit story, ending `parse_invalid` or `parse_no_question` | the riddle ends as `unparsed` with ADR-0230's fixed line; indistinguishable from other parse failures on purpose | the owner, in `llm_log` |
| `construction_gate_closed`: no construction's nodes pass the gate | the Director draws from ADR-0230's problem types alone, or offers no riddle if none passes there either | the parent, in the report line, which shows «ещё не предлагалась» (not offered yet) for a construction with no riddles |
| `construction_template_invalid`: a division template without a meaning, a ratio template without a total or a known part, or a construction without card frames, paraphrase templates or a meaning note | the Director skips that construction; the content test fails the build | the developer |

## What would reverse it

- If, among the last 30 logged text riddles of one family that the parent labelled, at least 5 were judged other than labelled, that family goes back to cards and its subset is reopened. This condition needs the parent's labels, and a parent who labels fewer than 30 riddles of a family leaves it off; the next condition needs none. I chose 5 of 30, about 17 %, because it lies well above the 4 % miss rate the subset showed at 48 of 50, which reaches 5 of 30 about 0.5 % of the time, so a family that crosses it has drifted from its test.
- If, over 60 days, more than a quarter of at least 20 fraction-family text riddles got `match` or `match_other_structure` with a `d` token the named graph leaves unused, the prompt rule on an ordinal with «часть» is reopened, because a fraction read as a position shows as exactly that, with no label needed.
- If a family's text riddles end as `unparsed` in more than a quarter of at least 20 over 60 days, the masker's word set or the named operations are reopened, because the parser then fails on the way she writes, which the reference set didn't catch. Before reopening either, the owner reads those riddles' graphs in `llm_log` for a number 1000 or a quantity left out, because unit stories end the same way on purpose.
- If the parsed division kind agrees with the labelled kind on fewer than 80 % of either meaning's labelled texts in two runs in a row, REQ-7242's choice by requested meaning is reopened, because the counts by parsed kind it reads are then mostly the parser's noise.
- If a later research record finds a study that sets equivalence rules for a fraction as an operator against divide-then-multiply, native operations are reopened, because the missing evidence is what made them lose.
- If a later record finds a study that validates composing as a measure of one child, the exclusion from every estimate is reopened through REQ-5026's activation rule, as ADR-0230 already provides.
- If the owner amends the Russian-only rule in `CLAUDE.md` to allow Dutch player text, the construction strings may gain Dutch forms under ADR-0160, and this record's Russian-only rule for them lapses.

The premortem, written as though it had happened. Three months after the item shipped, the report line showed many `match` riddles for fractions and almost none for percentages, and the parent read it as progress with fractions. The riddle list told another story. The new parse prompt had passed test 3 on the 200 texts, but the fraction subset had been labelled from stories the parent wrote, and she wrote «треть» as «третья часть», an ordinal with «часть», which the parser read as a position and left unused, so her fraction stories became plain divisions that matched by value. The percentage family had never passed and played as cards, whose distractor with the percentage as a plain number she picked almost every time, and the counts showed that as `wrong_structure` without anyone connecting it to the card. Meanwhile the owner had changed `PARSE_MODEL` once, and the one status line listing the families off scrolled past. The checks above exist for all three: the prompt rule and the fraction subset's texts on an ordinal with «часть», with the reversal condition on labelled riddles per family behind them; the error class beside every card verdict in the stream; and the status line shown on every run while a family is off.

## Consequences

- ADR-0040's generator gains construction templates with the purpose `compose` and the fields `construction` and `divisionMeaning`, and code that computes a template's families from its target.
- `src/shared/compose.ts` gains the expansion, the three error classes and the class order; the card builder gains construction card sets with three roles and the named-error distractor.
- The parse reply schema gains `d` tokens and six named operations, and the fixed parse prompt gains them and the colon rule, which gives it a new hash.
- `content/numerals.ru.json` gains a class per entry and every form of REQ-7202, REQ-7204, REQ-7206 and REQ-7208; `content/i18n/ru.json` gains the paraphrase templates, the meaning notes and the report's «ещё не предлагалась»; the frame files gain the constructions' card frames.
- ADR-0100's egress guard refuses a `ParseRequest` holding any word this record masks.
- The composing stream gains the construction key and the meaning split; ADR-0180's report line shows them.
- `tests/reference/compose.ru.json` gains four subsets of 50 and at most 20 unit stories, and its 200 texts gain REQ-7268's counts; `verify/parser-eval.json` keys records by parse model and prompt hash with a pass per family.
- ADR-0190's backlog gains one item, the extension of «Сплети загадку», and its Baselines table changes the test 3 run budget.

## Amends

- ADR-0230: "The target is a word-problem template of that floor, of a problem type whose tier node is at least at 'understands'" becomes "The target is a word-problem template of that floor whose tier node is at 'understands' or above, or a construction template from any floor whose nodes pass ADR-0440's gate (REQ-7238, REQ-7240), the Director picking the eligible source with the fewest confirmed riddles over the last 28 game days".
- ADR-0230: the masker's step 3, "digit runs and the Russian number words of REQ-5202 alike, with `n1` to `nm`", becomes "decimals, slash fractions and mixed numbers as one token each and the words of REQ-7202 as `n1` to `nm`, and fraction words, ordinals and cardinal-plus-ordinal runs as `d1` to `dk`, as ADR-0440 orders them".
- ADR-0230: the parse is refused when "the graph names a number or a token that isn't one of `n1` to `nm`" becomes "when the graph names a number other than an `n` or `d` token of the text it was sent, the fixed constants of a named operation's expansion excepted (REQ-7210)".
- ADR-0230: `judgeCompose` "normalises both graphs" becomes "expands each named operation of both graphs by ADR-0440's table, then normalises both".
- ADR-0230: the error classes gain `compose_times_vs_divide`, `compose_percent_as_number` and `compose_ratio_additive` in the conceptual class, and a riddle fitting two classes takes the first in ADR-0440's order.
- ADR-0230: the paraphrase's "one set per problem type and operation" becomes "one set per problem type or construction and per operation, named operations included".
- ADR-0230: the composing stream's key "per tier, problem type and form" becomes "per tier, problem type and form for a word-problem riddle, and per construction and form, with the meaning split of REQ-7256, for a construction riddle".
- ADR-0230: "`verify/parser-eval.json` records a passing test 3 for the configured `PARSE_MODEL`" becomes "records, per parse model and prompt hash, the pass of the 200 texts and the pass of each family subset, and a family's text form needs both".
- ADR-0230: the reference set "holds 200 texts" becomes "holds 200 texts with REQ-7268's counts, four family subsets of 50 and at most 20 unit stories reported apart".
- ADR-0230: "A run spends at most $4" becomes "A run spends at most $9".
- ADR-0230: the item under What this does not settle on "Number words outside REQ-5202's set, such as «вдвое», «втрое», «половина», «пополам», «пара» and ordinals" becomes "Number words outside the sets of REQ-7202, REQ-7204, REQ-7206 and REQ-7208".
- ADR-0210: "A number is a digit run, a decimal or a fraction, or a Russian numeral word from the lexicon's numeral list" becomes "A number is a digit run, a decimal, a slash fraction or a mixed number in digits, each one token, or a word of REQ-7202's set, masked as `n1` to `nm`; fraction words and ordinals are masked as `d1` to `dk` (REQ-7204), and every token's value stays on the Mac".
- ADR-0190: the Baselines row "`verify --live --compose` | $4 a run on the offline key | ADR-0230 | chosen" becomes "`verify --live --compose` | $9 a run on the offline key | ADR-0230, ADR-0440 | chosen | 420 worst-case parses and their judge checks".

## How I will know it was realised

1. A property test runs `judgeCompose` over generated pairs and asserts that «три четверти от 20» and «разделили 20 на 4 части и взяли 3» give the same expanded graph and `match`, that «четверть от 80» for `25 % от 80` gives `match_other_structure`, and that every verdict on a pair without named operations equals the verdict before this record.
2. Fixtures give `compose_times_vs_divide` to `2,5 : 4` for the target `2,5 · 4`, `compose_percent_as_number` to `80 − 20` for `80 − 20 % от 80`, and `compose_ratio_additive` to `6 + 2 − 3` for the part from K = 6 in the ratio 3 : 2, each beside `wrong_structure`.
3. A masking test generates every case and gender form of the added words and of cardinal-plus-ordinal runs from OpenCorpora, runs them through the masker, finds no number word left, and finds «2 1/2», «3/4» and «2,5» each as one token and «двадцать пятых» as one `d` token.
4. A gateway test sends a `ParseRequest` holding an unmasked «четверть», «вдвое» and «пятая», and the guard refuses each as `mask_incomplete` before any network call, and the riddle turns into cards.
5. A replayed test gives `parse_invalid` to a graph that names 1000 for «2 кг 500 г», and accepts the 100 of a percentage and the sum of a ratio's parts from the expansion.
6. A Director test with a synthetic log opens and closes each construction's gate by its node states, an inferred "fluent" included, and asks for grouping on a tie and then for the meaning with fewer clean `match` riddles.
7. A content test refuses a division template without `divisionMeaning`, a ratio template naming no total or known part and a construction without card frames, paraphrase templates or a meaning note.
8. `verify --live --compose` reports the 200 texts, each subset against 48 of 50, the unit stories apart and the division-kind agreement per meaning within $9, and writes one record per model and prompt hash; a start-up test with a changed prompt hash offers only cards for every family.
9. A projection test replays a log with construction riddles and asserts the stream's counts per construction, form and meaning, and no change to any estimate, state, probe, block, success share, holding-steps count or step-input share when they are removed.

## What this does not settle

- How the profile's conceptual-understanding bar counts a construction riddle: ADR-0390 under REQ-6750.
- A report of operator stories against divide-then-multiply stories from the named graph: a later record, which needs no new field.
- The rewards for construction riddles, which follow ADR-0230 and ADR-0140.
- A composing state, and whether the stream ever enters an estimate: a later record under REQ-5026.
- The parse prompt's wording, the card frames' and meaning notes' texts, and which texts fill each subset: the specification and the content.
- Unit conversions in the graph: refused here, and a requirement change if ever wanted.
- An error class for an inverted fraction, or an additive class for a share of a total: no study RES-4260 read names either.
- Dutch or English strings for the constructions: the owner's amendment of `CLAUDE.md` for Dutch, and ADR-0160 for any second language.
- Which backlog item comes first after the MVP: the family's choice at the stage 0.3 review (ADR-0190).

Amended by ADR-0460, approved on 2026-09-29, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
