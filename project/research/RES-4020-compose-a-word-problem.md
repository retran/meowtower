---
id: RES-4020
artifact: research
status: approved
revised: 2026-09-28
elaborates: RES-0800
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A blind parser and the engine can judge the player's composed word problems, but the approved record keeps her answers and her text's digits on the Mac, so the privacy rules, the gateway, the checker and the knowledge model must change first

## Summary

The owner's addendum of 2026-09-28 adds «Сплети загадку»: the player writes a
word problem for a given expression or diagram, a hosted model parses it
without seeing the target, the engine compares the parse with the target by
structure and value, and a familiar paraphrases the parse for her to confirm.
The published evidence I read supports the idea with small studies:
first-graders posing problems from sentence cards got the objects and numbers
right far more often than the story type and the calculation, and 30 of 66
problems young pupils posed in another study were unsolvable, the study's
example being one with no question. No study I read
validates composing as an individual measure, which fits the addendum's rule
that keeps composing out of the "on her own" estimate. The approved record
blocks the form as written in several places. The approved requirement on
what leaves the Mac keeps her answers there, and a composed problem is an
answer. The gateway of ADR-0100 has no
request class, role or budget for a parse, and it refuses digits in her text.
The player-tier rules name only story material and explanations, so a parse
request would today fall to the content tier. ADR-0040's checker, ADR-0060's
observation filter, ADR-0080's attempt flow, the task window and the free-text
points all assume otherwise. I lead with a hosted parse that receives her
cleaned text with every number replaced by a token, so no digit leaves the
Mac and the model can't compute a number, and I compare it with four other
options, doing nothing among them. If the masked parse fails acceptance test
3, the form must fall back to sentence cards, and her digits never leave. The
$0.1 daily parse budget on the play key covers about five worst-case parses a
day by my arithmetic, and it keeps the month's caps under the $60 limit. The
four questions this record left open were decided on 2026-09-28. This record covers section 2 of the addendum and its
acceptance test 3, and no other section.

## The question

What must be true of the game and the approved record so the player can
compose a word problem for a given expression or diagram, and the game can
judge it fairly, keep her text as private as her other answers and stay
inside its budgets? The addendum fixes the input (an expression, a bar
diagram or a short note built from a word-problem template), the answer
(1 to 4 sentences, typed or dictated), the five steps of the check, the five
verdicts, three new error classes, a separate composing stream, at most 2
riddles a day on floors with word problems, the role `PARSE_MODEL` defaulting
to `LIVE_CHECK_MODEL`, a 10-second timeout, the budget
`PARSE_BUDGET_USD_PER_DAY = 0.1` and acceptance test 3.

The question assumes that a language model is needed to judge a composed
problem. That holds only for free text. The sentence-card format of the
Monsakun studies judges a posed problem with no language model at all,
because the child assembles it from cards the software already understands.
It also assumes that composing measures understanding better than solving,
as the addendum says. The studies I read show that children's posed problems
expose structural errors, but none of them tests composing against solving
as a measure for one child, so the assumption holds for the report's
descriptive line and not for any estimate. The addendum already keeps
composing out of the "on her own" estimate, and this record keeps it out of
every other count as well.

The question also assumes that the parse is the privacy-sensitive step. The
safety check runs first on the same text, and so does the judge, whose rules
currently forbid it to carry an answer. Both steps need the same amendment.

## Method

On 2026-09-28 I read section 2 of the owner's addendum 1 to the
specification, its general rules, its event list, its model table, its
acceptance test 3 and its order of work. I searched the record with
`paw find` for "free text parse", "privacy tier", "compose problem" and
related words, and grepped `project/` and `canon/` for problem posing and
«составлени». I read ADR-0100 in full, and the passages of ADR-0040 on the
checker, ADR-0060 on observations and states, ADR-0070 on room slots,
ADR-0080 on the attempt flow, ADR-0110 on her text before a model reads it,
ADR-0130 and ADR-0160 on text reaching the player, and ADR-0190 on
`verify --live`. I read the summaries and the relevant findings of RES-0720,
RES-0800, RES-1200, RES-1600, RES-2600, RES-2700 and RES-3910, and the
approved requirements the findings below name. In the code at commit 47c0a7b
I read the verdict schema in `src/shared/events.ts` and the stand-in checker
in `src/server/standin.ts`.

On the web on 2026-09-28 I read, in full or in part: Hasanah, Hayashi and
Hirashima (2017) in full through Europe PMC; Bevan and Capraro (2021) in
full; the abstract of Patel, Bhattamishra and Goyal (2021); the number
mapping section of Wang, Liu and Shi (2017); the abstract of Fritzley and Lee
(2003) through OpenAlex; and one lesson plan in Bantova and Beltyukova
(1984). A helper search also found Silver and Cai (1996), Christou et al.
(2005), Cai et al. (2013, 2015), Ma (1999), Ball (1990) and a paper on scoring
handwritten problem posing with a language model. I could open none of them
beyond a title or a search engine's summary, so I record no claim from them.

I ran no model and built no test set. Every cost figure below is my
arithmetic on RES-2700's prices and on token counts I assumed, and every
statement about parse quality is a gap until acceptance test 3 runs.

## Findings

### The addendum makes composing a live form with a blind parser, a separate stream and its own budget

Section 2 of the addendum sends her cleaned text to `PARSE_MODEL`, which
returns strict JSON with the quantities and numbers from her text, the
question, a solution as a graph of operations and the problem type, without
seeing the target expression. The engine computes the graph and compares it
with the target by structure and by value. The familiar paraphrases the graph
in one template line, and she answers «Да, так» or «Нет, я имела в виду
другое», with one correction allowed after "no". An invalid parse, a missing
question or a timeout of 10 seconds gives `unparsed`, base experience and no
estimate. Observations go to a composing stream by problem type and stay out
of the "on her own" estimate, and the report gains a line «Может составить
задачу». The Director offers at most 2 riddles a day, only on floors with
word problems, and only for types she solves at least at "understands". The
order of work turns the form off by a flag until the parser passes acceptance
test 3.

### Primary-school methodology in the Russian tradition sets composing a problem for an expression from grade 1

Bantova and Beltyukova's methodology textbook of 1984 lists «Составление
задач по выражению: 8—5» in a sample grade 1 lesson plan on oral calculation
within 20. The addendum names the same tradition as its source.

### First-graders posing problems from cards got objects and numbers right and structure wrong

Hasanah, Hayashi and Hirashima (2017) analysed the logs of 39 Japanese
first-graders who posed one-step addition and subtraction problems by
choosing and ordering sentence cards in Monsakun. Of the frequent wrong
combinations, 96.3% met the object constraint and 85.2% the number
constraint, while only 40.7% met the story-type constraint and 33.3% the
calculation constraint. The authors read the errors as meaningful: the
children tried to satisfy as many constraints as they could. So a posing
error tells the parent about structure, which is the report line the
addendum wants, and it tells little about numbers.

### Automatic judging of posed problems exists without any language parsing

Monsakun assesses each posed problem and gives feedback automatically,
because the child assembles it from cards whose roles the software knows
(Hasanah et al. 2017). The authors name the time a teacher needs to assess
posed problems as the barrier that software removes. Cards trade the child's
own wording for a judge that can't misread her.

### Young pupils' posed problems are often unsolvable and carry spelling errors

Bevan and Capraro (2021) coded 66 problems posed by 11 pupils in grades 2 and
4 (ages 7 to 9): 36 were solvable and 30 were not. Their example of an
unsolvable problem lists animals with numbers and asks nothing, and their
examples carry spelling errors such as "Thirets" and "know" for "now". Of
the solvable problems, 88% aligned with a correct equation. Two researchers
coded the problems and discussed disagreements until they reached 100%
agreement, so the study reports no independent agreement figure. The paper
also notes, citing Winograd (1991), that children put classmates' and
teachers' names into problems they pose. The sample is small, and the
children wrote in English, so the proportions are no forecast for the player.

### I found no study that validates composing as an individual measure against solving

The studies I could read describe what children pose; none compares one
child's posing with her solving over time or reports a reliability for
posing as an individual score. The helper search named studies that might,
Silver and Cai (1996) and Cai et al. (2013) among them, and I couldn't open
them. This gap supports keeping composing out of every estimate and showing
it to the parent as counts.

### Word-problem solvers were shown to pass benchmarks on shallow cues

Patel, Bhattamishra and Goyal (2021) found that solvers for English
grade 4 and lower word problems "rely on shallow heuristics": models that
never saw the question still solved a large fraction of problems, and
bag-of-words models scored high. Their SVAMP set, built by varying the
question, adding irrelevant data and changing structure, cut the best
accuracy sharply. The study tested pre-2021 solvers, not today's large
models, so it shows which variations a parse test set needs rather than how
`PARSE_MODEL` will fare.

### Replacing numbers with tokens before predicting the structure is a standard move in word-problem solvers

Wang, Liu and Shi (2017) map each number in a problem to a token n1 to nm in
text order, predict an equation template over the tokens, and apply the
mapping back to get the equation. So a parser can return structure over
tokens, and code can hold the numbers. That paper trained its own model; I
found no measurement of whether masking numbers helps or hurts a prompted
large model on Russian text.

### Older children answer comprehensible yes-or-no questions without a yes bias

Fritzley and Lee (2003) found a consistent yes bias in 2-year-olds, no bias
in 4- and 5-year-olds for comprehensible questions and a nay-saying bias for
incomprehensible ones. So the confirmation step can catch a misparse only if
the paraphrase is plain enough for her to understand. The study asked
preschoolers about objects, not a child about her own story, so it bounds the
risk and doesn't measure it.

### The approved rule on what leaves the Mac keeps her answers there, and a composed problem is an answer

The approved requirement on data leaving the Mac, imposed by the owner on
2026-09-27, lets four kinds of data leave
the Mac: content made without the player, her story material ("her cleaned
free text, invented names, story memory and summary outcome events"), the
age the parent set and the one-task explanation request. It says answers
stay on the Mac. A composed problem is the answer to a task, so the approved
record forbids sending it, and "cleaned free text" doesn't clearly cover it:
RES-2600 defines story material as text from her play in the story. The two
approved requirements on the Parent Room's disclosure tell the parent what
leaves and where each check on her text runs, and neither names a composed
problem.

### The player-tier rules don't reach a parse request, so today it would fall to the content tier

Two approved requirements hold requests that carry story material or an
explanation request to zero-retention endpoints at player-tier providers,
and the start-up requirement defines a player-tier model as one that
receives those two kinds. A parse request carries neither, so the
requirement for "every other request" would
let it go to a content-tier provider that may keep it. ADR-0100 fixes each
role's tier in code, so the gap closes only when `PARSE_MODEL` is written
into the player tier.

### ADR-0100 has no role, request class, guard rule or bucket for a parse

ADR-0100 lists fifteen roles without `PARSE_MODEL` and accepts five request
classes: `StoryRequest`, `ExplainRequest`, `BlindCheckRequest`,
`JudgeRequest` and `ContentRequest`. Its egress guard replaces digit runs in
her free text with «[число]» and refuses a `StoryRequest` holding a digit, a
node id or a topic name, because the approved requirements on the Master's requests forbid them. A parse
of her problem with its digits removed that way loses the numbers the
structure is built from. The budget table has buckets for the adventure,
explanations, the month, art runs, the bake-off and live art, and none for a
parse.

### The judge's rules forbid it to carry an answer

The approved requirement on the judge's input lets a request to it carry "only the cleaned text its
question needs, and no story memory, outcome events, answers, times,
estimates or other maths result". The addendum's first step runs the same
safety filter on the composed problem as on story text, which in ADR-0110
means the local triggers on her raw text, then a Choice from `JUDGE_MODEL`,
or from `SAFETY_MODEL` when the judge fails. That check sends her answer to
the judge. Where RES-3910's local judge takes the check, the text stays on
the Mac, but the fallback still sends it out.

### The approved record lets no language model touch a number or an answer

An approved requirement from RES-1200 says a language model must not compute
any number, answer or picture in a task. ADR-0040 checks every answer with one pure function per
answer kind that both client and server run, and says a language model never
touches a number or an answer. In the addendum the parse decides which
operations her problem needs, which the verdict rests on, although the engine
computes every value. A parse over number tokens keeps the model from
supplying any number, and a pure comparison of a confirmed graph with the
target keeps the verdict in the engine.

### `unparsed` already means something else in the checker and the code

In ADR-0040, `unparsed` is an entry the checker can't parse, such as «3,,5»:
the client never submits it, no attempt is written and the clock keeps
running. The code at 47c0a7b has `unparsed` in the verdict enum
of `src/shared/events.ts` and in `src/server/standin.ts` with that meaning.
The addendum's `unparsed` is a composed problem the parser failed on, which
is a written attempt with base experience. One word for two things in one
field would let a projection count one as the other.

### ADR-0060 and two approved requirements would count a riddle as a word-problem attempt

ADR-0060 takes every graded, unassisted first attempt as an observation of
its node and subtype, and drops only rapid guesses, excluded tasks and
ungraded purposes. It keeps states per node, T1 to T4, and has no state per
problem type. The approved requirements drawn from RES-1300 and RES-0700 count every
unassisted first attempt on a k-step word problem towards the holding-steps
limit, and hold 40% to 60% of compound word problems to step input. A riddle on a T2 type would enter
all three unless the form is named as excluded. The addendum's rule that the
Director offers only types she solves "at least at understands" needs a
state per type that ADR-0060 doesn't have.

### ADR-0080's single flow and the task window's fixed contents don't fit the riddle

ADR-0080 runs every task through one flow: after `alt` a parallel twin
follows, after `partial` none, and no third attempt exists. It keeps one flow
because the client must never learn which tasks are scored. The addendum
lets her correct the same text once after rejecting the paraphrase, and lets
the familiar ask her to add a missing question on the same riddle, which
ADR-0080 has no state for, and says nothing about a twin after
`wrong_structure`. The approved requirement on the task window lets it hold only the task, the
answer field or options, the keypad, «Не знаю», the thread button and
«Готово», with no story text. The riddle needs a text field, three starter
buttons, a paraphrase in the familiar's voice and two confirmation buttons.
The approved requirement on free-text points opens the field at five story
points only, and the riddle
adds a sixth.

### The Director fills every room slot from three sources, and a riddle is none of them

ADR-0070 and the approved requirement it implements fill each room slot from the frontier, spaced review
or the parent's lesson topics, and record the source in `flowSlot`. The
addendum frames the riddle as a Tangle or a Guardian asking a question
backwards, and doesn't say whether it takes a room slot.

### The Master may not read a composed problem

ADR-0100's guard refuses a `StoryRequest` that holds a digit or a topic name,
and the approved requirement on the Master's requests gives its order no
field for an answer or a single-task outcome. So the best riddles the addendum puts into the Diary as
«Загадки героини» pages can't pass through the Master's story memory; the
server has to render those pages itself from the log.

### The parse bucket fits the monthly limit, and a parse costs about $0.004 by my arithmetic

`LIVE_CHECK_MODEL` defaults to `google/gemini-3.8-flash` at Google Vertex on
the player tier (RES-1600, RES-0720). RES-2700 lists it, as read on
2026-09-27, at $0.75 a million input tokens, $3.75 a million output tokens
and $0.075 for cached input. I assume a fixed prompt of about 3,000 tokens,
her text at about 100 and a reply at about 400. A parse then costs about
$0.0023 + $0.0015, near $0.004. With `max_tokens` at 4,000, a worst-case
reservation is about $0.017, so the $0.1 bucket reserves about five parses a
day, enough for 2 riddles with one correction each. RES-2700 set the $60
monthly limit above the $55.80 the daily caps allow in a 31-day month; the
parse bucket adds $3.10, giving $58.90. RES-4130, a draft, finds that the
addendum's $1.0 sandbox budget would break that arithmetic; the decision of
2026-09-28 moves the sandbox's model spending to the offline key, so the play
key's daily caps stay at $58.90, below the $60 limit.

### Acceptance test 3 at 95% on 200 texts proves about 91%

The addendum passes the parser when its verdicts match the labels on at
least 95% of 200 reference texts. At exactly 190 of 200, the 95% Wilson
interval runs from about 91.0% to 97.3% by my arithmetic, so a pass shows
the true agreement is likely above 91%. The one figure also hides which
errors occur. A correct problem judged `wrong_structure` blames her for the
parser's error, which is the harm the confirmation step is meant to stop,
while a wrong problem judged `match` only misses one observation.

### Five options answer the question, and each is better at something

| Option | What its advocate would say it is better at | Case against it |
| --- | --- | --- |
| Do nothing: no composing form; the modelling choice of RES-0800 stays the structure measure | no new model role, no text leaves the Mac, nothing to build; the modelling choice already separates "didn't understand" from "miscalculated" | a choice among four notes tests recognition and not production; it drops the owner's instruction and the story use she'd enjoy |
| Sentence cards, as in Monsakun: she assembles the problem from cards the engine generates, and the engine judges it | a judge that can't misread her, no model and no privacy change, a verdict in milliseconds, studied with first-graders | she doesn't write her own story, which the addendum values; card sets per template are content to write and check; distractor cards can hint at the structure |
| Hosted parse of her cleaned text with its digits, as the addendum reads | the parser sees everything she wrote, magnitudes included, and the addendum describes it | her digits and her answer leave the Mac, against the guard's rule for her text, and the model reads the numbers it could compute with |
| Hosted parse of her cleaned text with every number replaced by a token n1 to nm, the engine keeping the numbers | no digit leaves the Mac; the model can't supply or compute a number, so the rule against model-made numbers holds by construction; a standard input form in word-problem solvers | her words still leave the Mac; masking costs the parser magnitude cues such as "more than" next to a larger number, unmeasured on a prompted model; number words need a local Russian numeral reader |
| A model on the Mac as the parser, beside RES-3910's local judge | her text stays home; no per-call cost | RES-3910 measured no Mac model on Russian text and chose models for fixed-answer checks, not for writing a graph; a cold 3,000-token prompt took about 3.4 to 4.2 seconds on its estimate, and a parse writes several hundred tokens more |

I lead with the masked hosted parse, because it is the only option that
meets every clause of section 2 while no digit and no computed number leaves
or enters the Mac. The case against it is its row: masking may lower parse
accuracy, and nobody has measured by how much, so acceptance test 3 has to
run on masked text before the flag turns on. If the masked parse fails the
test, the form falls back to sentence cards even if the unmasked parse
passes, because accuracy doesn't buy a privacy rule: her digits never leave
the Mac. Sentence cards are the fallback because they are the form the
evidence I read actually studied with young children, and they need no
model. The unmasked parse and the Mac parser are rejected.

## Conclusions

1. A composed problem must leave the Mac only in a new request class, a
   parse request, holding the fixed parse prompt and her cleaned text, with
   no target expression, node id, topic name, problem type, verdict or other
   answer.
2. Before a parse request leaves, the engine must replace every number in her
   text, digit runs and the Russian number words it recognises alike, with a
   token n1 to nm in text order, and keep the mapping on the Mac.
3. Every number in the parser's graph must be one of those tokens, and the
   engine must reject a parse that names any other number, so no language
   model supplies a number to a verdict.
4. `PARSE_MODEL` must be a player-tier role fixed in code: zero-retention
   endpoints at providers on the player-tier list, checked at start-up like
   every other player-tier model.
5. The gateway must record every parse call in `llm_log`, charge it to a
   parse bucket of $0.1 a game day on the play key, and count it inside the
   monthly limit.
6. The Director must offer a riddle only when the parse bucket can reserve
   two worst-case parses, the gateway's live calls are on, and the composing
   flag is on, so a spent budget or a failed start-up check means no riddle
   rather than an `unparsed` one.
7. Her composed text must pass the same local triggers as story free text on
   the raw text, then the judge's safety check on the cleaned text, before
   any parse request leaves; a serious trigger or signal must take the same
   serious path as in the story.
8. The parse's verdict must come from a pure engine function that takes the
   target and a confirmed graph and returns the verdict, with `+` and `·`
   commutative and associative, `−` and `:` in fixed order, `match` for the
   same operations on the same numbers, `match_other_structure` for a
   different graph with the same value, and `wrong_structure` for the same
   operations on numbers other than the expression's, with the log marking
   that case so a later record can count it apart.
9. The paraphrase must be built from per-language template strings (ADR-0160)
   and verbatim spans of her own text, with every span checked by the engine
   as a substring of her text, so no word a model wrote reaches the player.
10. When she rejects the paraphrase of her corrected text, or the corrected
    text fails to parse, the riddle must end as `unparsed` with base
    experience and no observation, because the addendum forbids a parse
    error becoming her error.
11. A text she corrects after rejecting the paraphrase must still count as
    unassisted, because the paraphrase says nothing about the target, and the
    log must mark the attempt as corrected and keep both texts.
12. The compose verdicts and error classes must live in the `compose_parsed`
    and `compose_confirmed` events with their own verdict field, so the
    addendum's `unparsed` never shares a field with the checker's `unparsed`.
13. `compose_on_vs_times`, `compose_partition_vs_quotition` and
    `compose_order` must each sit in the conceptual class of the error-type limit RES-1300 set.
14. A riddle attempt must not be an observation, during the MVP and after
    it until ADR-0060's activation rule admits the composing stream, for the
    "on her own", "with help" or fluency estimates, a block, a probe, a node state, the success
    share of ADR-0070, the holding-steps ladder or the step-input share of
    compound word problems.
15. The composing stream must keep, per tier and problem type, the count of
    each verdict other than `unparsed`, and the report line «Может составить
    задачу» must show those counts beside the matrix of type by steps and draw no
    state from them until a later record defines one.
16. The rule for "a type she solves at least at understands" must be defined
    before the Director uses it, because ADR-0060 keeps states per node, not
    per type; until then the Director must read the state of the tier's node.
17. Every riddle the game shows must run the same compose flow, scored or
    not, so the flow tells the client nothing about scoring. After
    `wrong_structure` the riddle must end with the short review and no twin,
    leaving any second riddle of the day to the Director. A riddle must play
    as a story scene outside the room slots and must not count towards the
    room's length.
18. The field, the starter buttons, the paraphrase line and the confirmation
    buttons must each be a player-facing string in the per-language content
    files, and the field must show the story field's note «Эту историю могут читать мама
    и папа», because the parent
    reads her riddles.
19. Diary pages of her riddles must be rendered by the server from the log,
    and no composed text may enter a `StoryRequest` or the Master's story
    memory.
20. Acceptance test 3 must run the parser on masked text in `verify --live`
    on the offline key, with 200 reference texts the parent labels by the
    engine's rules before the parser runs. The set must hold child-like
    spelling errors, dictated text, number words, problems with no question,
    irrelevant data, every verdict, every compose error class and correct
    problems in each allowed order.
21. Acceptance test 3 must report the confusion between verdicts as well as
    the 95% agreement. It must report separately the share of correct
    problems judged other than `match`, against a threshold the requirements
    step sets, because that error blames her for the parser's.
22. Acceptance test 3 must check blindness from `llm_log`. Every parse
    request body must hash to the fixed prompt plus her masked text, and a
    fixture must plant a distinctive target expression and find it in no
    request.
23. A timeout of 10 seconds, invalid JSON or a graph with no question must
    each give `unparsed` in a replayed test.
24. The composing flag must stay off until acceptance test 3 passes on masked
    text on the configured `PARSE_MODEL`, and must turn off again when that
    model changes until the test passes on the new one. If the masked parse
    can't pass, the form must be built as sentence cards the engine judges,
    and no unmasked parse request may be added.
25. The parent must be able to read every composed text, its paraphrase, her
    answer to it and the verdict in the Parent Room, because the
    confirmation step is the only check on a misparse that she sees. The
    owner must see the share of rejected paraphrases, because a share near
    zero while the test set shows misparses means the check isn't working.
26. These approved records must be amended, each by the change named:
    - The requirement on data leaving the Mac: a fifth kind of data that
      leaves, her composed problem with numbers masked, or composed problems
      named as story material.
    - The two requirements on the Parent Room's disclosure: the page names
      the composed problem, the
      parser's company and the judge's check on it.
    - The two requirements on where story material goes and the start-up
      requirement on player-tier models: parse requests join story material and
      explanation requests on the player tier.
    - The requirement on the judge's input: the judge may carry her composed problem as the cleaned text
      its question needs.
    - ADR-0100: the role, the parse request class, the masking rule in the
      egress guard, the parse bucket and the tier.
    - ADR-0040: the composed answer kind and the pure comparison.
    - ADR-0060: the composing stream and its exclusion from every estimate.
    - ADR-0070: a riddle plays as a story scene outside the room slots, so
      the requirement on room-slot sources stays as it is.
    - ADR-0080: the compose flow with one correction.
    - The requirements on the task window's contents and on free-text
      points: the riddle's window and its text field.
    - The requirements on the holding-steps ladder and the step-input share:
      riddles excluded from both counts.
    - ADR-0190: the parse budget, the 10-second timeout and acceptance test 3
      in `verify --live`.

    RES-2600 and RES-2700 are approved research and stay as they are; this
    record adds the parse request to what leaves the Mac and the $3.10 to
    the monthly arithmetic.

### Decided on 2026-09-28

1. If acceptance test 3 fails on masked text, the form falls back to sentence
   cards and her digits never leave the Mac, even if an unmasked parse would
   pass, because the privacy rule on her answers outranks parse accuracy and
   cards are the form the evidence studied. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.
2. A problem with the right operations on numbers other than the
   expression's is `wrong_structure`, with the log marking the case, because
   the task gives the numbers and the five verdicts have no slot for this one;
   the mark lets a later record count it apart. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.
3. After `wrong_structure` the riddle ends with the short review and no twin,
   leaving any second riddle of the day to the Director, because a twin would
   spend the day's cap of 2 riddles on one target. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.
4. A riddle plays as a story scene outside the room slots and doesn't count
   towards the room's length, because that leaves the approved requirement on
   room-slot sources unchanged and matches the addendum's framing of the
   riddle as a Tangle or a Guardian's question. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28 - section 2, the general rules, the event list, the model table, acceptance test 3 and the order of work.
- [Hasanah, Hayashi and Hirashima, "An analysis of learner outputs in problem posing as sentence-integration in arithmetic word problems", Research and Practice in Technology Enhanced Learning 12, 2017](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6302996/), read in full through the Europe PMC full-text service on 2026-09-28 - the 39 first-graders, the constraint percentages, meaningful errors and automatic assessment by cards.
- [Bevan and Capraro, "Posing Creative Problems: A Study of Elementary Students' Mathematics Understanding", International Electronic Journal of Mathematics Education 16(3), 2021](https://files.eric.ed.gov/fulltext/EJ1327329.pdf), read 2026-09-28 - 36 of 66 posed problems solvable, the missing question, spelling errors, 88% aligned, coding to agreement and names of people the children know.
- [Patel, Bhattamishra and Goyal, "Are NLP Models really able to Solve Simple Math Word Problems?", NAACL 2021](https://aclanthology.org/2021.naacl-main.168/), abstract read 2026-09-28 - shallow heuristics and the SVAMP variations.
- [Wang, Liu and Shi, "Deep Neural Solver for Math Word Problems", EMNLP 2017](https://aclanthology.org/D17-1088.pdf), section 3 read 2026-09-28 - number mapping to tokens and equation templates.
- [Fritzley and Lee, "Do Young Children Always Say Yes to Yes-No Questions? A Metadevelopmental Study of the Affirmation Bias", Child Development 74(5), 2003](https://doi.org/10.1111/1467-8624.00608), abstract read through OpenAlex on 2026-09-28 - the yes bias by age and comprehensibility.
- [Bantova and Beltyukova, «Методика преподавания математики в начальных классах», 1984](https://sheba.spb.ru/shkola/metod-matemat-1984.htm), read 2026-09-28 - composing a problem for an expression in a grade 1 lesson plan.
- ADR-0100, read 2026-09-28 - the roles, request classes, egress guard, tiers, buckets, judge route and failure states.
- ADR-0040, ADR-0060, ADR-0070, ADR-0080, ADR-0110, ADR-0130, ADR-0160 and ADR-0190, read in part on 2026-09-28 - the checker, observations and states, room slots, the attempt flow, her text before a model reads it, text reaching the player and `verify --live`.
- The approved requirements on data leaving the Mac, the player and content tiers, the judge's input, the Master's requests, the Parent Room's disclosure, model-made numbers, unparsed entries, the task window, free-text points, room-slot sources, the holding-steps ladder, the step-input share and error types, read 2026-09-28 - the rules each finding above names.
- RES-0720, RES-0800, RES-1600, RES-2600, RES-2700 and RES-3910, read in part on 2026-09-28 - the `LIVE_CHECK_MODEL` default and tier, word-problem types and modelling apart from calculation, what leaves the Mac, prices and the $55.80 arithmetic, and the local judge's latency.
- RES-4130, a draft, read 2026-09-28 - the sandbox budget and the monthly limit.
- `src/shared/events.ts` and `src/server/standin.ts`, repository at 47c0a7b, read 2026-09-28 - the verdict enum and the stand-in checker's `unparsed`.
