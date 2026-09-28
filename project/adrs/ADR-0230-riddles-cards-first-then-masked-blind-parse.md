---
id: ADR-0230
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-5036, REQ-5038, REQ-5040, REQ-5046, REQ-5096, REQ-5200, REQ-5202, REQ-5204, REQ-5206, REQ-5208, REQ-5210, REQ-5212, REQ-5214, REQ-5216, REQ-5218, REQ-5220, REQ-5222, REQ-5224, REQ-5226, REQ-5228, REQ-5230, REQ-5232, REQ-5234, REQ-5236, REQ-5238, REQ-5240, REQ-5242, REQ-5244, REQ-5246, REQ-5248, REQ-5250, REQ-5252, REQ-5254, REQ-5256, REQ-5258, REQ-5260, REQ-5262, REQ-5264, REQ-5266, REQ-5268, REQ-5270, REQ-5272, REQ-5274, REQ-5276, REQ-5278, REQ-5280, REQ-5282, REQ-5284, REQ-5286, REQ-5288, REQ-5290, REQ-5292, REQ-5294, REQ-5296, REQ-5298]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0230. «Сплети загадку» plays as sentence cards the engine judges until a blind parser that reads only her masked text passes acceptance test 3, and one pure engine function gives every riddle its verdict outside every estimate

## Decision

«Сплети загадку» (Weave a riddle) has two forms, and one pure engine
function judges both. A card riddle has her build the problem from sentence
cards the engine made, so no model takes part. A text riddle has her write
the problem, and a parse model that never sees the target or a digit turns
it into a graph. The card form ships first and is the only form until the
masked parser passes acceptance test 3, because REQ-5096 requires cards
until then and REQ-5090 builds composing last. This decision builds on
ADR-0210, which owns the game day, what leaves the Mac, the separate streams
of the addendum's new forms, the play key's $60 limit and the stage order,
and cites it without restating it.

### Offering a riddle

The Director (ADR-0070) offers a riddle as a story scene outside the room
slots, set by a Tangle or a Guardian, because the addendum frames the
riddle as a question one of them asks backwards, so it adds nothing to a room's length
and leaves REQ-1000's three slot sources as they are (REQ-5264). `planFloor`
places at most one riddle on a floor that holds word problems, and at most
2 riddles a game day of either form (REQ-5258, REQ-5218). The target is a
word-problem template of that floor, of a problem type whose tier node is at
least at "understands", because ADR-0060 keeps states per node and no record
yet defines a state per type (REQ-5256). ADR-0040's generator builds the
target as an expression, a bar diagram or a short note, with the purpose
`compose`, a new value of the purpose field that ADR-0060 and ADR-0070
never read as an observation.

The Director offers a text riddle only when all of these hold: the
composing flag is on, the gateway's live calls are on for this adventure,
the parse bucket can reserve two worst-case parses and the parent hasn't
switched off the free-text field (REQ-5218). When any of them fails, the
Director offers a card riddle in its place.

REQ-5218 and REQ-5096 conflict as written. REQ-5218 allows a riddle only
when the four conditions hold, while REQ-5096 requires «Сплети загадку» to
offer sentence cards while the flag is off and when the parse budget has run
out. I read REQ-5218's conditions as gating the text form only, and REQ-5096
wins for the card form, because REQ-5218's own reasons, a parse that can't
run and a field she can't write in, don't apply to cards, which need neither.
Where no requirement speaks, I chose cards too: when live calls are off,
because a card riddle calls no model, and when the parent has switched off
the free-text field, because a card riddle writes no text. REQ-5218 goes back
to the requirements step so that its wording names the text form.

### The compose flow

Every riddle runs the same compose flow, owned by the server as a state
machine per riddle, whether the stream counts it or not, so the flow tells
the client nothing about scoring (REQ-5260). ADR-0080's attempt flow doesn't
apply to a riddle. The states:

1. `compose_open`: the task window shows the target and, for a text riddle,
   the story's free-text field with the note «Эту историю могут читать мама
   и папа» (Mum and Dad can read this story) and the three starters «У…было…»
   (…had…), «Купили…» (They bought…) and «Шли…» (They walked…) (REQ-5266,
   REQ-5268). For a card riddle it shows the cards and a strip to order them
   in. The field takes 1 to 4 sentences and at most 600 characters, a cap I
   chose at four sentences of about 150 characters. The window also holds
   «Не знаю» (I don't know), «Готово» (Done) and the thread button, which
   stays visible and inactive, because a riddle has no hint rung to buy
   (ADR-0080, REQ-6250).
2. `compose_checking`, text riddles only: the server runs the steps under
   Her text before a model reads it below, and the familiar shows a waiting
   line from the content files.
3. `compose_paraphrase`, text riddles only: the familiar shows the
   paraphrase with «Да, так» (Yes, that's it) and «Нет, я имела в виду
   другое» (No, I meant something else) (REQ-5266).
4. `compose_correcting`, reached once, after her first «Нет»: the field
   opens again holding her first text, and she edits it and presses
   «Готово». The attempt stays unassisted, because the paraphrase says what
   the parser read and nothing about the target (REQ-5238). The log marks it
   corrected and keeps both texts (REQ-5240).
5. `compose_review`: the engine gives the verdict, and the window shows the
   short review. No riddle has a twin riddle; REQ-5262 makes this explicit
   for `wrong_structure`. For `match` the review opens on a tap, as after
   `clean` in ADR-0080.
6. `compose_closed`: she taps to leave, and the story goes on.

A card riddle goes from `compose_open` to `compose_review` with no
paraphrase, because each card already has the role the engine gave it, so
nothing can be misread. «Не знаю» in either form closes the riddle with the
short review, an empty verdict and no count in the stream, which I chose
because it is her answer and not a parser's failure.

The short review is one example riddle the engine builds from the target's
template frame and the target's numbers, in the familiar's voice, with no
word of error, because ADR-0080's review shows the correct form after every
outcome and a riddle's correct form is a problem, not a number.

### Her text before a model reads it

A text riddle's text passes these steps in order before any parse request
leaves the Mac (REQ-5220):

1. ADR-0110's local triggers run on her raw text. A serious trigger takes
   ADR-0110's serious path, the fixed line, the pause and the notice, and
   the riddle ends with an empty verdict and nothing sent (REQ-5222).
2. The egress guard cleans the names the parent set, as for her story text.
3. The masker replaces every number in the cleaned text, digit runs and the
   Russian number words of REQ-5202 alike, with `n1` to `nm` in text order.
   It reads the word forms from `content/numerals.ru.json`, which ADR-0110's
   numeral check already reads and which gains the collective numerals from
   «двое» to «десятеро», «полтора», «десяток», «дюжина» and «сотня» in every
   case form. A second language adds its own numerals file (ADR-0160). The
   mapping from tokens to numbers stays in the riddle's server state and in
   the log, and no request class has a field for it (REQ-5204).
4. The judge's safety check reads the cleaned, masked text through ADR-0100's
   judge route, `JUDGE_MODEL` and then `SAFETY_MODEL`, charged to the
   adventure bucket like every judge call (REQ-5212). A serious result takes
   the serious path as in step 1. When neither model answers, the text isn't
   sent to the parser, and the riddle ends as `unparsed` with the cause
   `safety_unchecked`, as ADR-0110 keeps her unchecked text from the Master.
5. The gateway sends a `ParseRequest` holding the fixed parse prompt and the
   cleaned, masked text, and no target expression, node id, topic name,
   problem type, verdict or other answer (REQ-5200, REQ-5036, REQ-5038).

`ParseRequest` is the request class ADR-0210 adds to ADR-0100, a strict zod
schema holding the fixed prompt by its hash, the masked text, the token list
and the schema version. The egress guard refuses a `ParseRequest` whose text
still holds a digit or a numeral word as `mask_incomplete` (ADR-0210), so a
masking bug fails closed. `PARSE_MODEL` is a sixteenth role, fixed in code on the
player tier with `zdr: true` and the player-tier provider list, checked at
start-up like every player-tier model, with its model id defaulting to the
one `LIVE_CHECK_MODEL` is configured with (REQ-5208, REQ-5210, REQ-5040),
as the addendum sets, because that model already sits on the player tier
with a zero-retention endpoint (RES-1600, RES-0720). Its timeout is
10 seconds and its `max_tokens` 4,000, a cap I chose at ten times the reply
of about 400 tokens RES-4020 assumed. The worst-case reservation follows
from it: 3,100 input tokens at $0.75 a million and 4,000 output tokens at
$3.75 a million come to about $0.017, and a typical parse with a
400-token reply to about $0.004 (RES-4020, on RES-2700's prices), so a
change to `max_tokens` or the prices changes the bucket's arithmetic. Every parse call writes a
row to `llm_log` (REQ-5214) and spends from the parse bucket of $0.1 a game
day on the play key and from no other bucket (REQ-5216, REQ-5046).

The parser returns strict JSON: a list of quantities, each with its token
and the span of her text that names it, the question with its span, a graph
of operations over the tokens and, for each division, whether it shares
into parts or groups by a size. The engine refuses the reply as invalid when
the JSON fails the schema, when the graph names a number or a token that
isn't one of `n1` to `nm` of the text it was sent (REQ-5206), or when a span
isn't found word for word in the masked text. A timeout, an invalid reply or
a graph with no question gives `unparsed` (REQ-5288). The engine then puts
her own number forms back into the spans from the mapping.

The paraphrase holds only template strings from the per-language content
files, one set per problem type and operation, and the spans the engine
checked, so no word a model wrote reaches her (REQ-5234, REQ-5266). It
retells the story and the question in words, with no expression, sign or
value, so she compares meanings and not a number with the target.

### The verdict

`judgeCompose(target, graph)` in `src/shared/compose.ts` is a pure function
of the target and the graph she confirmed, or the graph her cards form, and
returns the same verdict for the same pair every time (REQ-5224). It
normalises both graphs with `+` and `·` commutative and associative and `−`
and `:` in fixed order, then decides:

| Verdict | When | Requirement |
| --- | --- | --- |
| `match` | the same operations on the same numbers | REQ-5226 |
| `match_other_structure` | other operations, the target's value | REQ-5228 |
| `wrong_structure`, marked `wrongNumbers: true` | the target's operations on other numbers | REQ-5230, REQ-5232 |
| `wrong_structure` | any other value, a reversed `−` or `:` included | REQ-5298 |
| `unparsed` | a parse failure, a rejected correction or a failed correction parse | REQ-5236, REQ-5288 |

The function also gives an error class in the conceptual class of the
error-type limit (REQ-5244). It gives `compose_on_vs_times` when a `+` or `−`
stands where the target has a `·` or `:` on the same numbers, or the reverse.
It gives `compose_order` when the operations and numbers match and the order
doesn't. It gives `compose_partition_vs_quotition` when a division matches
and its kind differs from the kind the target's template declares. A graph
with that last class still gets `match`, because REQ-5226 decides by
operations and numbers alone, and the class records the difference beside
it. I chose that reading, and the stream counts the class apart.

### Events

The verdicts and classes live only in these event types, which this
decision owns, in a field no other attempt uses, so the addendum's `unparsed`
never meets the checker's `unparsed` of ADR-0040 (REQ-5242):

- `compose_shown`: `riddleId`, `form` (`cards` or `text`), `targetKind`
  (`expression`, `diagram` or `note`), the target as rendered, template and
  version, seed, node, tier, `problemType`, and for cards the card set with
  each card's role.
- `compose_submitted`: `riddleId`, `round` (1, or 2 after a correction),
  her raw text or her ordered card ids, the input summary of REQ-2208, the
  masked text, the token mapping, the trigger and judge levels, and
  `dontKnow`.
- `compose_parsed`: `riddleId`, `round`, `parseOutcome` (`ok`,
  `parse_timeout`, `parse_invalid`, `parse_no_question`, `safety_unchecked`,
  `mask_incomplete` or `wait_exceeded`, the failure states below), the
  graph, the paraphrase
  as shown and the `llm_call` event id.
- `compose_confirmed`: `riddleId`, `answer` (`yes`, `no` or `none` for
  cards), `corrected`, `composeVerdict`, `composeErrorClass`, `wrongNumbers`
  and `form`.
- `compose_labelled`: `riddleId` and the verdict the parent assigns by
  `judgeCompose`'s rules, which the second reversal condition reads and no
  projection of her knowledge reads.

### The composing stream and the report

A riddle is never an observation for the "on her own", "with help" or
fluency estimates, a block, a probe, a node state, ADR-0070's success share,
the holding-steps ladder or the step-input share (REQ-5246, REQ-5248,
REQ-5250), until ADR-0060's activation rule admits the stream (REQ-5026).
The composing stream is a projection of `compose_confirmed` that keeps, per
tier, problem type and form, the count of each verdict other than
`unparsed` and the count of each error class (REQ-5252). I split the counts
by form, because a card riddle is chosen from given sentences and a text
riddle is written, and the two shouldn't blur in one count.

ADR-0180's report shows «Может составить задачу» (Can compose a problem)
beside the matrix of type by steps, as those counts and no state
(REQ-5254). The Parent Room lists every riddle with its first and corrected
texts, the paraphrase, her answer and the verdict (REQ-5294), and the share
of paraphrases she rejected over the last 30 days (REQ-5296). The Diary's
«Загадки героини» (The heroine's riddles) pages are rendered by the server
from `compose_submitted` and `compose_confirmed`, showing each riddle with
`match` or `match_other_structure` as the log holds it, and leaving out any
riddle with a trigger or signal above none (REQ-5270). No composed text
enters a `StoryRequest` or the Master's story memory (REQ-5272).

### Acceptance test 3 and the flag

Acceptance test 3 runs as `verify --live --compose` on the offline key, with
the gateway in its `verify` mode, on masked text and the configured
`PARSE_MODEL` (REQ-5274). Its reference set, `tests/reference/compose.ru.json`,
holds 200 texts the parent labels by `judgeCompose`'s rules before any
parser runs on them (REQ-5276), with every case REQ-5278 lists. The test
passes when agreement is at least 95% and at most 2% of the texts labelled
`match` are judged otherwise (REQ-5282). It reports the confusion between
labelled and judged verdicts (REQ-5280). It checks from `llm_log` that every
request body hashes to the fixed prompt plus that text's masked form
(REQ-5284), and it plants the distinctive target «7 · 13 − 29» in a fixture
and finds it in no logged request (REQ-5286). A run spends at most $4, a
budget I chose at 200 worst-case parses of about $0.017 each plus their
judge checks.

The composing flag is ADR-0210's setting `COMPOSE_FREE`. The server refuses
to start with it on unless `verify/parser-eval.json` records a passing test 3
for the configured `PARSE_MODEL`, so a change of model turns text riddles
off until the test passes on the new one (REQ-5290). `verify --live
--compose` writes that record. If the owner judges that the masked parse can't pass, card
riddles stay the only form and no unmasked parse request is ever added
(REQ-5292).

### What works once this is accepted

Once accepted, the card form works end to end with no model: the Director
offers card riddles, the engine judges them, the log, the stream, the report
line, the Parent Room list and the Diary pages exist, and nothing leaves the
Mac. The text form's code can be built and replayed, but no text riddle
reaches her until the parent has labelled the 200 texts and acceptance
test 3 has passed live. Removing the text form leaves the card form working,
and removing both leaves the game as it was, because no estimate reads a
riddle.

## Why

Cards first follows from three facts. REQ-5096 requires cards until the
masked parser passes, REQ-5090 builds composing last, and the evidence
RES-4020 read on posing studied cards with first-graders, who got objects
and numbers right far more often than story type and calculation (Hasanah,
Hayashi and Hirashima 2017, in RES-4020). A form built on cards also gives
the engine function, the events, the stream and the report a working path
before any parse exists, so the text form adds one input to a tested whole.

The masked blind parse follows RES-4020's comparison and the owner's
decision of 2026-09-28. It is the only text form in which no digit, no word
of REQ-5202's set and no computed number crosses the Mac's edge in either
direction: the parser can't
see a number to compute with, and the engine refuses any number it didn't
send. The paraphrase from templates and checked spans keeps REQ-1216's rule
that no model makes a number, answer or text the player sees.

The verdict lives in `judgeCompose` and not in the parse, because ADR-0040
checks every answer with one pure function that client and server share, and
a riddle's verdict should be replayable from the log like every other.

The compose flow is its own state machine and not a branch of ADR-0080's,
because a riddle has no correct answer to reveal, no hint rungs and no twin,
while ADR-0080's states exist for those three things. Keeping one flow for
every riddle keeps REQ-2428's reason for one flow: the client can't tell a
counted riddle from another.

The strongest objection is that «Нет, я имела в виду другое» lets her escape
any verdict she fears. If she reads the paraphrase, suspects it misses the
target, and says no twice, a `wrong_structure` becomes `unparsed`, so the
stream counts only the riddles she was sure of and overstates her `match`
share. I keep the step because the addendum and REQ-5236 make it the only
check against a parser's error, and a parser's error blamed on her is the
worse harm. Three things limit the escape. The paraphrase shows no value and
no sign, so she can't compare a number with the target. The stream feeds no
estimate, so an inflated share misleads only the report line. And REQ-5296
shows the parent the rejected share, which the reversal condition below
watches.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: no composing form; RES-0800's model choice stays the structure measure | no new role, no text leaves the Mac, nothing to build | REQ-5076 puts composing in the MVP, and a choice among notes tests recognition, not production |
| Cards only, never a parser | a judge that can't misread her, no model, no privacy change and a verdict in milliseconds | she never writes her own story, which the addendum values, and REQ-5096 makes cards the form only until the parser passes |
| Hosted parse of her cleaned text with its digits | the parser sees magnitudes such as "more than" next to a larger number | her digits leave the Mac and the model reads numbers it could compute with; REQ-5202 and REQ-5292 forbid it |
| A parser on the Mac beside a local judge | her text stays home and a parse costs nothing per call | test 3 would gate either parser, so they differ in time and work: RES-4020 puts a cold 3,000-token prompt at 3.4 to 4.2 seconds before any output, which leaves under 2 seconds of the 6-second budget to write a graph of several hundred tokens, and the owner would install, update and serve a local model on the Mac; I record the local parser as the option to try if the hosted one fails test 3, before REQ-5292's cards-only path |
| Text riddles only, with no card form while the flag is off | one form to build and test | «Сплети загадку» would not exist until the parent labels 200 texts and a live run passes, against REQ-5096 |

## What it costs

The content author pays for two sets of text per word-problem template: the
card frames with their distractors and the paraphrase templates per problem
type and operation. Distractor cards can hint at the structure, which is the
card form's known weakness (RES-4020). I chose 2 distractors a riddle, one
with the other relation («на» for «в», by for times) and one question for a
different unknown, to keep the hint small.

The parent pays for labelling 200 reference texts once, before the text form
can exist, and again for texts added when a class of error appears. Once
the text form plays, the parent also labels logged riddles from the Parent
Room's list, about 20 a month in about 15 minutes, until 60 labels feed the
second reversal condition; a month without labels delays that condition and
blocks nothing. The parent is never needed in real time: while the labels wait, card riddles
play, and two weeks without the parent lose no data and leave no queue. The
parent gets no notice for riddles. The one interruption is ADR-0110's
serious-path notice, which a riddle can raise like a story line.

The owner pays for running acceptance test 3 at up to $4 on the offline key
after every change of `PARSE_MODEL`. The owner gets one line in
`./tower status` when the flag turns off because the model changed, and no
line again until the model changes once more.

The play key pays up to $0.1 a game day, about $0.004 a parse by RES-4020's
arithmetic, with a worst-case reservation of about $0.017, so the bucket
reserves about five parses: 2 riddles with one correction each take four,
and the fifth is headroom for a reservation not yet settled. The daily
caps' sum stays inside the $60 limit as ADR-0210 keeps it (REQ-5048).

She pays a wait. After «Готово» on a text riddle she waits for the safety
check and the parse. I chose a budget of p95 at most 6 seconds from
«Готово» to the paraphrase, the story's wait under REQ-1622, because she
perceives both as the same pause. The parse's 10-second timeout is imposed
(REQ-5288), and the whole wait stops at 12 seconds, the story's fallback
moment under REQ-1624, after which the riddle ends as `unparsed`.

The security boundary is the Mac's edge. It protects her composed text, her
digits and the target. The threats, most likely first:

1. A code change adds the target, a type or a digit to a parse request. The
   strict `ParseRequest` schema, the guard's digit refusal and test 3's body
   hash and planted target stop it.
2. A number word slips the masker, such as a case form missing from the
   numerals file. A test compares the file with every case form of
   REQ-5202's words generated from the OpenCorpora dictionary, a source
   independent of the file, and the reference set's number words catch the
   rest before the flag turns on.
3. Her text steers the parser, such as «ответ 100». The number is masked,
   the engine refuses any number outside the tokens, and only checked spans
   reach her.
4. A provider keeps her text. The player tier, `zdr: true` and the start-up
   check stop it (ADR-0100).

Ceilings: at most 2 riddles a game day, 2 parse calls a riddle and $0.1 of
parse spend a game day; 600 characters a text; 200 reference texts per run.
The parse rows join `llm_log`, whose bodies drain after 90 days under
ADR-0100. The Diary pages are rendered on demand and store nothing, so they
don't pile up.

Failure states, each with its next step and one audience:

| State | Next step | Audience |
| --- | --- | --- |
| `parse_timeout`, `parse_invalid`, `parse_no_question` | the riddle ends as `unparsed` with base experience and the familiar's fixed line that she couldn't untangle the riddle | the owner, in `llm_log`; the player sees one line for all three, on purpose, because the cause is never hers |
| `safety_unchecked`: neither judge answered | nothing is sent, and the riddle ends as `unparsed` with the same line | the owner, in `llm_log` |
| `mask_incomplete`: the guard found a digit or a numeral word in a `ParseRequest` (ADR-0210) | nothing is sent, and the riddle turns into a card riddle for the same target, as ADR-0210 sets; reported once per cause | the owner |
| `wait_exceeded`: 12 seconds passed from «Готово» before a paraphrase, the safety check having used part of them | the riddle ends as `unparsed` with the same line, and a late reply is dropped | the owner, in `llm_log` |
| `parse_budget_short`: the bucket can't reserve two parses | the Director offers a card riddle | the parent, in the day's cost line |
| `compose_flag_off`: no passing test 3 for the configured model | card riddles only | the owner, in `./tower status`, once per model change |
| `compose_test_failed`: test 3 misses 95% or the 2% bound | the flag stays off; the owner judges whether a retry or REQ-5292's cards-only path follows | the owner, in the verify report |
| `card_frames_missing`: a template has no card frames | the Director skips that template for riddles; the content test fails the build | the developer |

## What would reverse it

- If the share of rejected paraphrases over 30 days is above 40% with at
  least 10 text riddles, a count I chose so that one or two rejections can't
  cross the line alone, she is using «Нет» as an escape, and the paraphrase
  or the correction rule is reopened. I chose 40%, because a parser that
  passed test 3 misreads at most about 9% of texts by its 91% lower bound,
  so a share over four times that comes from her and not from the parser.
- If that share is under 2% while at least 3 of the last 60 logged riddles
  the parent labelled `match` were judged other than `match`, the
  confirmation step isn't catching misparses, and the paraphrase templates
  are reopened. The Parent Room's riddle list lets the parent label any
  logged riddle by `judgeCompose`'s rules. I chose a window of 60 labels,
  because at 20 one disagreement is already 5% and can't be told from one
  mislabel, and 3 in 60 is the smallest count that separates a pattern from
  a slip.
- If acceptance test 3 fails on masked text on two different parse models,
  the owner judges under REQ-5292: the local parser of the Alternatives is
  tried first, and card riddles become the only form if it fails too.
- If the parse spend settled in `llm_log` averages above $0.008 a parse over
  30 days, twice RES-4020's estimate, the bucket and the reservation are
  reopened, because five parses a day no longer fit.
- If a later research record finds a study that validates composing as a
  measure of one child, the exclusion from every estimate is reopened through
  REQ-5026's activation rule.

The premortem, written as though it had happened. Two months after the text
form turned on, the report line showed nine of ten riddles as `match`, and
the parent trusted it. The Parent Room list told another story: most
`wrong_structure` riddles had become `unparsed` after two «Нет», and the
paraphrase for division had retold every problem as sharing, so she said no
whenever she had meant grouping. Test 3 had passed, because the reference
set held few grouping problems written as a child writes them. A number word,
«пятью», had also slipped the masker in a dictated text, and the guard caught
no digit, so it left the Mac. The checks above exist for all three: the
rejected share, the confusion by class and the comparison of the numerals
file with a dictionary it wasn't written from.

## Consequences

- ADR-0210's table of event owners gains `compose_shown` and
  `compose_labelled`, owned here beside the three types it already assigns
  to RES-4020's decision.
- ADR-0020's log gains `compose_shown`, `compose_submitted`,
  `compose_parsed`, `compose_confirmed` and `compose_labelled`, with the payloads above, owned
  here.
- ADR-0040's generator gains the purpose `compose` and, per word-problem
  template, card frames and a paraphrase key set; `src/shared/compose.ts`
  holds `judgeCompose` and the card builder.
- ADR-0100's gateway gains `PARSE_MODEL`, `ParseRequest`, the digit refusal
  for it and the parse bucket; `.env` gains `PARSE_MODEL` and
  `PARSE_BUDGET_USD_PER_DAY`.
- `content/numerals.ru.json` gains the collective numerals and the words of
  REQ-5202 in every case form; `content/i18n/ru.json` gains the field label,
  the starters, the buttons, the waiting line, the unparsed line and the
  paraphrase templates; the frame files gain card frames.
- ADR-0180's report and Parent Room gain the report line, the riddle list
  with a control to label a logged riddle,
  the rejected share and the Diary pages.
- ADR-0190's verify gains `verify --live --compose`, the content test over
  the numerals file and the reference set in `tests/reference/`.

## Amends

- ADR-0040: "A language model never touches a number, an answer or a picture" becomes "A language model never supplies a number, an answer, a verdict or a picture; the parse model of ADR-0230 reads a composed riddle with its numbers masked and returns a graph over tokens, which `judgeCompose` judges".
- ADR-0040: "checks every answer with one pure function per answer kind" becomes "checks every answer with one pure function per answer kind, the composed riddle's kind being `judgeCompose(target, graph)`".
- ADR-0060: "What counts as an observation" gains the rule "a riddle, of either form, is dropped from every estimate, state, probe and block, and feeds only the composing stream of ADR-0230".
- ADR-0070: "the success share over the last 10 graded first attempts" becomes "the success share over the last 10 graded first attempts, riddles excluded", and `planFloor` gains the riddle placement of ADR-0230.
- ADR-0080: "Every task the adventure shows, scored or not, runs one attempt flow" becomes "Every task the adventure shows except a riddle, scored or not, runs one attempt flow; every riddle runs ADR-0230's compose flow".
- ADR-0100: the list of fifteen roles becomes sixteen with `PARSE_MODEL` on the player tier, its model defaulting to `LIVE_CHECK_MODEL`'s, with a 10-second timeout.
- ADR-0100: "the gateway accepts these five" request classes becomes six, adding `ParseRequest` as ADR-0210 defines it.
- ADR-0100: the egress guard gains the rule "refuse a `ParseRequest` whose text holds a digit".
- ADR-0100: `JudgeRequest` "with one cleaned text" becomes "with one cleaned text, which for a composed riddle is its masked text (REQ-5212)".
- ADR-0100: the budget table gains the row "Parse | $0.1 a game day on the play key (REQ-5216) | `PARSE_MODEL` | the Director offers card riddles".
- ADR-0110: "The free-text field opens only on the order kinds `floor_enter`, `guardian`, `camp`, `session_end` and `new_creature`" becomes the list of REQ-5268, which adds the riddle and «Свободное перо» (Free Pen).
- ADR-0110: "Her text, before a model reads it" applies to a composed riddle as ADR-0230's five steps, with the judge reading the masked text and a failed check sending nothing.
- ADR-0180: the holding-steps row's "Every unassisted first attempt on a k-step problem from a Guardian or a room counts" becomes REQ-5248's rule, which leaves out riddles and problems with a missing number.
- ADR-0180: the graph map's word-problem matrix gains the line «Может составить задачу» with the composing stream's counts and no state.
- ADR-0190: the Baselines table gains "Parse spend | $0.1 a game day | ADR-0230 | imposed by REQ-5216", "Parse timeout | 10 s | ADR-0230 | imposed by REQ-5288", "Wait from «Готово» to the paraphrase | p95 at most 6 s, stop at 12 s | ADR-0230 | chosen" and "`verify --live --compose` | $4 a run on the offline key | ADR-0230 | chosen".

## How I will know it was realised

1. A property test runs `judgeCompose` over generated pairs of target and
   graph and asserts one verdict per pair, the same verdict on repeat,
   `match` for every reordering of `+` and `·`, and `wrong_structure` for
   «6 : 48» against «48 : 6»; fixtures give «6 · 4 + 6» and «6 · 5»
   `match_other_structure` and the target's operations on other numbers
   `wrong_structure` with `wrongNumbers: true`.
2. A schema test sends a `ParseRequest` with each forbidden field and with a
   digit in its text, and the gateway refuses each before any network call.
3. A masking test generates every case form of REQ-5202's words from the
   OpenCorpora dictionary, finds each in `content/numerals.ru.json`, runs them
   and the reference set's number words through the masker, and finds no
   number left.
4. Replayed tests give `unparsed` for a 10-second timeout, invalid JSON, a
   graph with no question, a graph naming `n9` for a text with 3 tokens and a
   span not in her text.
5. A state-machine test drives a text riddle through yes, no then yes, no
   then no, and a failed correction parse, and a card riddle through each
   verdict, and asserts the states above, one correction at most, no twin
   and the same states whatever the riddle's purpose.
6. A projection test replays a log with riddles and asserts that no
   estimate, block, probe, node state, success share, holding-steps count or
   step-input share changes when the riddles are removed.
7. A code search finds no path from `compose_submitted` text to a
   `StoryRequest` or story memory.
8. `verify --live --compose` reports agreement, the 2% bound, the confusion
   table, the body-hash check and the planted target, within $4.
9. A Parent Room test labels a logged riddle, reads the label back from the
   log as a new event, and finds the riddle's verdict unchanged.
10. A start-up test with `COMPOSE_FREE` on and no passing record in
    `verify/parser-eval.json` for the configured `PARSE_MODEL` refuses to
    start, and with it off only card riddles are offered.

## What this does not settle

- The wording of REQ-5218, which should name the text form only; the
  requirements step revises it, and this decision reads it that way until
  then.
- The rewards for `match`, `match_other_structure` and `wrong_structure`;
  this decision sets only base experience for `unparsed`: ADR-0140.
- Number words outside REQ-5202's set, such as «вдвое», «втрое»,
  «половина», «пополам», «пара» and ordinals: they leave the Mac unmasked as
  ordinary words, and a graph that needs one as a number names no token, so
  the engine refuses it and the riddle ends as `unparsed`. Widening the set
  is a requirement change.
- When the player solves a problem type "at understands" by a rule of its
  own; until a record defines it, the Director reads the tier's node.
- A state for composing, and whether the stream ever enters an estimate:
  a later record under REQ-5026.
- A fifth verdict for a problem with no question or an unsolvable one:
  REQ-5288 sends a graph with no question to `unparsed`, and REQ-5226's
  review rejected a fifth verdict.
- The Parent Room's page on what leaves the Mac and its wording of the
  parse: ADR-0210 under REQ-5044.
- The task window's list of controls across every new form: the decision
  that owns REQ-5120.
- The parse prompt's wording and the card frames' texts: the specification
  and the content.
- English and Dutch numerals and paraphrase templates, which ADR-0160's rule
  for a second language covers when that language ships.

## Open review findings

- The second agent review asked to move the event payloads, the schema's fields, the file paths and the function's name into the specification. Rejected: the approved decisions of this repository, ADR-0080 and ADR-0100 among them, name their events, schemas and modules, and the brief for this step makes the decision that needs an event type own it with its payload fields.
- Consistency with ADR-0210, found after the second review and not reviewed again: ADR-0210 names the tokens `[N1]`, `[N2]` and so on, while REQ-5202 names them `n1` to `nm`, which this decision follows; and ADR-0210's rule that a parse output failing its schema falls back to sentence cards differs from REQ-5288, which gives such a riddle `unparsed`, and this decision follows REQ-5288. The owner settles both when approving ADR-0210 and this decision together.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
