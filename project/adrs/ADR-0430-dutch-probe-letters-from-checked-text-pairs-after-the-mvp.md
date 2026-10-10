---
id: ADR-0430
artifact: adr
status: approved
revised: 2026-10-10
addresses: [REQ-7100, REQ-7102, REQ-7104, REQ-7106, REQ-7108, REQ-7110, REQ-7112, REQ-7114, REQ-7116, REQ-7118, REQ-7120, REQ-7122, REQ-7124, REQ-7126, REQ-7128, REQ-7130, REQ-7132, REQ-7134, REQ-7136, REQ-7138, REQ-7140, REQ-7142, REQ-7144, REQ-7146, REQ-7148, REQ-7150, REQ-7152, REQ-7154, REQ-7156, REQ-7158, REQ-7160, REQ-7162, REQ-7164, REQ-7166, REQ-7168, REQ-7170, REQ-7172, REQ-7174, REQ-7176, REQ-7178, REQ-7180, REQ-7182, REQ-7184, REQ-7186, REQ-7188, REQ-7190, REQ-7194, REQ-7196, REQ-7198, REQ-6656, REQ-6664, REQ-6684]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0430. The Dutch probe ships after the MVP and only once the owner allows Dutch probe text: families of letters on one ordinary template, each text written offline as a Russian and Dutch pair that three different models check and the parent approves, shown one presentation a game day in a balanced order, and read only in the stream `nl_probe`

## Decision

The owner's addendum 2 of 2026-09-28, item 6, becomes one post-MVP module, `src/engine/probe/`, with an offline text run, a Parent Room review screen and a report section. RES-4250 settled the research. ADR-0380 owns what every addendum 2 item shares: the report's counts, 80 % Wilson intervals and interpretations worded as checks, the rule that each measure owns its «мало данных» (too little data) floor, the four states, the owner of each new event type, the new `item_shown` and template fields, build check 5 and the MVP scope, which keeps the probe out of the first version (REQ-6682). I cite ADR-0380 for those and don't restate them. This record owns the probe's event types, its payloads, its presentation values and its floor. Where I chose a default the research and the requirements left open, the sentence says "I chose".

### Nothing Dutch is built before the owner amends the Russian-only rule

No Dutch probe text, prompt, file or screen is built before the owner amends the principle `project_in_english` in `CLAUDE.md`, whose sentence "Text the player sees is in Russian only for now" is the Russian-only rule; ADR-0210 records the bridge's keywords as its one exception (REQ-6684). Only the owner changes that file, and an addendum item doesn't amend it (RES-4250). This record is therefore a condition: its build starts at the first stage after the MVP whose acceptance follows that amendment, and if the owner declines the amendment, this decision is withdrawn and nothing below is built. Until then the scope guard of ADR-0190 fails on the probe's traces: the directory `content/probe/`, the directory `tools/probe/`, a schema for any event type this record owns, and the Parent Room route `/parent/probe`.

### The parent's switch holds the whole probe

The Parent Room's settings gain `probe.enabled`, off by default, written through `PUT /api/parent/settings` as a `settings_changed` event, the way `bridge.enabled` is. While it is off, the Director plans no letter, the server builds no probe view and serves no probe card, and a letter already planned for the day is dropped, so she sees no letter, no Dutch probe text and no probe card anywhere (REQ-7100). The switch can turn on only when at least 4 eligible templates, as the next section defines them, hold an approved pair, because the first phase keeps 4 families open, no two on one template, and a probe that can't fill its families would show a thin, unbalanced first week. Until then the settings row shows the count of eligible templates with an approved pair and stays inactive. Turning the switch off and on again resumes the probe where it stood: the families whose 14 days passed are closed, and the phase counters and balance counts keep their values, because restarting them would throw away observations already counted.

### A family is one ordinary template shown in up to five presentations

Every probe task comes from an ordinary template tied to a node of the skill graph or of the Sources track (REQ-7104). A template takes part when it carries ADR-0380's field `probeFamily`, which names its family key (REQ-6664). The building agent sets it on 1 to 2 templates of each of T1 to T4, P, F, M and the Sources track, as the addendum asks, and the owner approves the list at the stage acceptance, because the choice of constructions is the owner's question to answer. A template with `probeFamily` on a maths track must render a bare form, and a build check fails one that can't, because every maths family needs its `bare` presentation.

A family holds exactly these presentations (REQ-7108):

| Template | Presentations, by their value in `item_shown.probe.presentation` |
| --- | --- |
| A maths template | `bare`, `ru`, `nl`, `nl_after_words`, and `nl_source` when the template draws a table or chart |
| A Sources track template | `ru`, `nl` and `nl_after_words`, each drawn as a source through ADR-0300's `SourceView` |

The value is `nl_source` and never a name holding "Cito" (REQ-7110). A Sources family's three presentations fill the report's Russian, Dutch and Dutch-after-words cells, and the `nl_source` cell holds only the source presentations of maths families, as REQ-7108 sets. ADR-0380 adds the field `probe` to `item_shown` (REQ-6656); this record fixes its content as `{ familyId, presentation, position }`, where `position` is the count of the family's presentations shown before it plus 1.

The engine builds a family at the change of game day and writes `probe_family_created`. An eligible template carries `probeFamily`, and its node already holds at least one graded first attempt of hers. The family's template is the least recently probed eligible template that holds an approved pair and no open family, ties broken by the adventure's seeded stream. I chose that eligibility, because a node she has never met would spend a first encounter that RES-4230's hold keeps for her first exposures, and I chose no gate on the node's state, because a gate at «Понимает» (understands) would keep every maths gap out of the probe, and the owner's falsifiability rule asks the probe to show a maths gap as clearly as a language gap. The family's level is the level ADR-0070 would give an ordinary room task on that node that day, fixed for the whole family, so no letter is a stretch or a warm-up. Each presentation draws its numbers from the template's generator under a seed of its own at that level, and the seeds are drawn at creation from the adventure's seeded stream (REQ-7106). A T1 to T4 family always uses an ordinary subtype, never a surplus or unanswerable one (REQ-7156).

### Every text presentation comes from one approved Russian and Dutch pair

A pair is the unit of probe text. It holds a Russian frame and a Dutch frame that tell the same context with the same quantities and the same question, both with placeholders for every number and name as ADR-0130's frames have. It also holds the words of the Dutch frame marked as likely unfamiliar, at most 8, each with its card text, a Russian gloss. When the template draws a source, the pair also holds the source's Dutch labels and, for a maths template, a Dutch source question. I chose the ceiling of 8 marks, because a frame of at most k+1 sentences of at most 14 words holds about 60 words, and more than 8 unknown words would turn the after-words presentation into a vocabulary lesson.

A family takes one pair for all its text presentations. The `ru` presentation shows the Russian frame, `nl` the Dutch frame, `nl_after_words` the same Dutch frame with new numbers, as the owner's addendum describes it, and `nl_source` the Dutch source question and labels. Names come from placeholders that the renderer fills with one Mainland name from the canon record REQ-7194 requires, the same person in every presentation of the family. Every text presentation then tells one context, and only the language and the numbers differ (REQ-7106). The family takes the least recently used approved pair of its template, never one used in the last 28 game days while another exists, and otherwise the one used longest ago. I chose 28 game days, twice the family's window, so a pair doesn't meet her again while she may still remember its story from the last family.

This settles REQ-7106's open review finding on how the Russian probe text is written and checked. The Russian frame is written in the same request as its Dutch frame, by `PROBE_TEXT_MODEL`, and passes every check an ordinary Russian frame passes in ADR-0130: the code checks of step 3, with the numeral lexicon, the length limit, `frameMetrics` and the forbidden list; the safety check of step 4, as ADR-0350 amended it; and the three blind solves of step 5 by `CHECK_MODEL`. It passes two checks of its own. It holds no Latin-script token, so no bridge keyword can sit in it (REQ-7178), and `PROBE_LANGUAGE_MODEL` confirms that it tells the same context, quantities and question as its Dutch frame. The parent then approves the pair as one, so the Russian text meets REQ-3326's forbidden-list rule and ADR-0130's rule that the parent accepts every model-written frame. The Russian frame stays in the probe's file and never enters the frame library of ordinary tasks. I chose this, because a story she had met in a room would make the Russian presentation familiar and the Dutch one new, which enters the gap beside the language. I rejected translating an accepted library frame into Dutch for the same reason, and because library frames are written for the Tower's floors and characters, not for a letter from the Mainland.

### The offline run writes pairs under two new roles and checks them before the parent sees them

`npm run probe:generate`, in `tools/probe/`, is the only producer of probe text, and it runs outside any session on the offline key (REQ-7114). No code path in the server calls a model for probe text, and a group 1 check fails the build when `src/engine/probe/` or the server's probe routes import the model gateway. The run uses three roles in ADR-0100's gateway:

| Role | Job | Tier and key | Request class | Default model |
| --- | --- | --- | --- | --- |
| `PROBE_TEXT_MODEL`, new | write pairs, mark words, write cards | content tier, offline key | `ContentRequest` | the model `GEN_MODEL` uses, `anthropic/claude-opus-5.5` |
| `CHECK_MODEL`, as it stands | solve each filled frame blind | content tier, offline key | `ContentRequest` | `openai/gpt-5.5` |
| `PROBE_LANGUAGE_MODEL`, new | check grammar, naturalness, genre, the marks and the pair's match | content tier, offline key | `ContentRequest` | the model `LIVE_CHECK_MODEL` uses, `google/gemini-3.8-flash` |

`PLANNER_MODEL` writes no probe text, because the gateway refuses a play role on the offline key (REQ-7116). The run refuses to start, as `probe_run_refused`, when two of the three roles resolve to the same model id (REQ-7124), when the Dutch section of the forbidden list is empty, or when the style guide is missing, because an empty section would let `textGate` pass every Dutch word, and without the guide the writer has no genre to follow. I chose the language role's default because it is the one model the project already uses that differs from both other defaults; the reversal conditions below watch whether it judges Dutch well enough.

The run receives no data about the player (REQ-7126). `tools/probe/` imports nothing that reads the event log or the database, and a group 1 check enforces the import rule as ADR-0130 does for the science module. Its `ContentRequest` holds the template's structural specification from ADR-0130 step 1, the style guide, the Mainland's canon names and the target length, and has no field for an answer, a tap or an opened word. So the words she opened can never steer which words get marked.

The style guide, `content/probe/style-guide.md`, is written by a person, in English with Dutch example phrases of the person's own. It describes the genre of a Dutch primary-school word problem: a short everyday context, its numbers inside sentences and exactly one question (REQ-7112). It also lists Abedi and Lord's features to avoid, such as passive verbs, long noun phrases and conditional clauses (RES-4250). No prompt, style guide, template, data file or logged value quotes or imitates a Cito item or names Cito, and the writer receives no Cito item (REQ-7110). ADR-0290's group 1 word check extends to `content/probe/`, `tools/probe/` and the event schemas.

Each request asks for 5 candidate pairs in a fixed JSON schema, and each candidate passes these steps in order, or is dropped as `probe_text_rejected` with its step:

1. Code checks both frames: every listed placeholder exactly once and no other, no digit, no numeral word from the Russian numeral lexicon or from `content/probe/numerals.json`, the Dutch numeral list a person writes, and the length limit of ADR-0130 step 1. The Russian frame also passes `frameMetrics` and holds no Latin-script token. The marks name words that occur in the Dutch frame, at most 8.
2. `textGate` passes the Russian frame and every card text with `lang: "ru"`, and the Dutch frame, the Dutch labels and every marked word with `lang: "nl"` (REQ-7128).
3. The safety check of ADR-0130 step 4 passes both frames.
4. Code fills each frame, the Russian, the Dutch and any Dutch source question, with three sets of numbers from the template's generator under three seeds, and `CHECK_MODEL` solves each filled text blind, seeing only that text. For a source, it also receives the source's data as a text table, because the model can't see the drawing. Every answer must equal the engine's (REQ-7118).
5. `PROBE_LANGUAGE_MODEL` returns a verdict in a fixed schema on the Dutch frame's grammar and naturalness for a primary-school reader, on the three genre traits, on each mark (needed or not, and any unmarked word a pupil of group 5 to 8 might not know), on whether the Russian frame tells the same context, quantities and question, and on whether the Russian frame reads as natural Russian for a primary-school reader and not as a translation. The candidate passes only when every item passes (REQ-7120, REQ-7196). When the verdict fails only on the marks, the candidate goes back once to `PROBE_TEXT_MODEL` with the verdict's notes, which rewrites the marks and their cards, and the revised candidate reruns steps 1, 2 and 5; a second failure drops it. So every mark and card that reaches the parent has passed the ceiling of 8, the forbidden list and the language check.

Passing candidates go to `data/probe-candidates.json`, outside the repository, because unreviewed text isn't the project's content. The run fills a template's candidates only up to one and a half times its shortfall against a target of 4 approved pairs, with at least 5, and candidates older than 60 days expire, as ADR-0130 does for frames. I chose 4 pairs a template, because the first phase gives each template 2 to 3 families and one more pair keeps the 28-day rule satisfiable.

### The parent approves each pair, its marks and its cards

The Parent Room's screen «Письма: тексты» (Letters: texts), at `/parent/probe`, shows each candidate with its Russian and Dutch frames side by side, each also filled with one set of numbers, the marked words with their cards, the language check's notes and the template and node. It offers «принять / отклонить / поправить» (accept / reject / edit), a way to add or remove a mark and change a card before accepting (REQ-7144), and the box «проверено носителем языка» (checked by a native speaker) (REQ-7102), which the parent sets before deciding, so every decision records whether a native reader made it. An edit reruns steps 1 and 2 at once and shows in words what the edited text failed, and the pair waits for steps 3 to 5 at the next run, as ADR-0130 handles an edited frame. Accepting writes `probe_text_approved` with the pair's full text and a hash over its frames, labels, marks and cards, and rejecting writes `probe_text_declined`; both carry `nativeReviewed` as the box stood. Ticking the box later writes a new `probe_text_approved` for the same hash with `nativeReviewed: true`, and the report reads the latest one, because a native reading vouches for the text whenever it happened.

The server writes the approved pairs to `data/exports/probe.pairs.json` after each change, and the owner commits that copy to `content/probe/pairs.json`. The server serves a pair only while the log holds a `probe_text_approved` event for its current hash and no later `probe_text_removed`, so a pair edited by hand in the file is never shown (REQ-7122).

### The letters take a fixed place on the floor and one per family a game day

Every presentation, bare and Russian included, arrives as a letter from the Mainland: the same short story frame from the line pool opens it, and the letter's task opens in the ordinary task window in the same slot (REQ-7146). Letters are a fixed part of a maths floor, after the Sources track's tasks on a floor that carries them and before the rooms, at most 2 on a floor (REQ-7148). They take no room slot, so the Director's slot sources and the flow corridor stay as ADR-0070 sets them. `planDay` places the day's letters 2 on each maths floor from the first, and a letter not shown when its floor ends moves to the first later maths floor of the same game day that holds fewer than 2 letters, then to the next game day, so no floor ever holds more than 2.

The engine keeps a set number of families open and gives each open family at most one letter a game day, its next presentation in the family's order, so no two presentations of one family fall on one game day (REQ-7134). No two open families share a template, because two families on one construction would put two meetings with it on one game day. In the first phase 4 families stay open, which plans 4 letters a day. ADR-0070 must still plan at least 28 graph first attempts; where it can't with 4 letters, it plans 3, and the family with the most game days left in its window skips the day, so the family nearest its end loses nothing. So a completed day in the first phase shows 3 or 4 letters, inside REQ-7192's 3 to 5, and the plan never builds a fifth. When fewer than 3 eligible templates hold an approved pair, fewer than 3 families can be open, and the day shows fewer letters as `probe_day_short`. The first phase ends when the `ru`, `nl` and `nl_after_words` cells of the overall table each hold 20 graded first attempts, because at 20 the probe resolves a gap of about 28 points and just reaches the owner's 20-point example (RES-4250). It also ends when she has played on 28 game days with the switch on, the upper end of the addendum's 3 to 4 weeks, whichever comes first. From then on 2 families stay open, which gives 2 letters a day, the upper end of the addendum's 1 to 2. I chose 2, because at 1 a day a per-node cell would take months to leave «мало данных». The phase is a projection over the log and is logged nowhere else.

A family's order is fixed at creation. `nl_after_words` always directly follows `nl`, so it falls on a later game day and no presentation sits between them (REQ-7130, REQ-7132). Each of `bare`, `ru` and `nl_source` goes before or after that pair by a balancing rule over the families built so far: when it has gone before the pair more often than after, it goes after; when less often, before; when equally often, a draw from the adventure's seeded stream decides. The order inside the group before the pair and inside the group after it is also a seeded draw. Each balanced presentation then stands before and after the pair equally often, give or take one family, and a replay of the log gives the same order (REQ-7132).

Every presentation of a family falls fewer than 14 game days after its first presentation, counted by `gameDayOf` whether she plays or not (REQ-7136). When the window ends before all its presentations are shown, the family closes with the ones it has, the unshown ones are never planned, and the report counts it as closed short (REQ-7198). A family still inside its window feeds the report with what it has shown. Closing is computed from the log and writes no event.

### A letter keeps one set of controls in every presentation

Every letter takes the template's final-answer input in every presentation, with the keypad, «Не знаю» (I don't know), the thread button and «Готово» (Done). A T1 to T4 letter shows no model choice, plan cards, step fields, «Нельзя узнать» (can't be known) or options for what is missing (REQ-7154), and no letter shows ADR-0240's estimate or inverse check. I chose to drop those two steps from letters of every track, because the bare presentation must carry the same controls as the text ones, and each step adds Russian interface text inside a Dutch presentation. Since a letter is never unanswerable, leaving «Нельзя узнать» out hides nothing that exists (REQ-7158, REQ-7160).

The attempt flow is ADR-0080's, with two changes. After a wrong answer or «Не знаю» she sees the short solution at once and gets no second attempt, whatever hint she saw (REQ-7162, REQ-7164). The review offers no detailed explanation either, because REQ-7162 allows the short solution only. A letter gives the same experience, streak and rewards as an ordinary task of its kind, whatever its presentation and whether she opened cards (REQ-7152).

In the `nl` and `nl_source` presentations each marked word is underlined, and a tap opens its card (REQ-7150). The first open of each word in an attempt writes `probe_card_opened` with `trigger: "tap"`, marks the attempt `assisted: true`, and leaves it in its presentation's count (REQ-7138, REQ-7140). Later openings of the same word in the same attempt write nothing, which bounds the events at 8 an attempt. The `nl_after_words` presentation opens with the cards of every marked word and shows the task only after she closes them (REQ-7142). She can close them at once and reopen any card during the task. Opening them writes one `probe_card_opened` with `trigger: "planned"` and every marked word, and a reopening writes `trigger: "reopen"` once a word. Neither marks the attempt as assisted, because the planned cards are the presentation's condition. A term hint she opens in a `ru` letter also marks the attempt assisted, because a word explained on request is help in either language. A bought hint rung marks every letter assisted, as ADR-0080 already does, and its Russian text inside a Dutch letter is then counted as the help it is.

Letters never carry a bridge keyword: the bridge's renderer never picks a letter (REQ-7178).

### Letters feed only the stream `nl_probe`

A letter's `item_shown` carries `purpose: "nl_probe"` (ADR-0380), `forms: ["nl_probe"]` and the `probe` field, so ADR-0210's rule already keeps its attempt out of «сама» (on her own), since model v1 admits no form (REQ-7168). Every attempt on a letter is recorded in the stream `nl_probe` and in no other (REQ-7166). Every projection other than `nl_probe` skips an attempt whose `forms` holds `nl_probe`: the knowledge model, the Sources track's rows, the language-risk limit (REQ-7170), the bridge's share (REQ-7172), the refusal guard's window and its report observation (REQ-7174, REQ-7176), the bare-task share, the Director's success share and every other limit. The exceptions are the parts of the attempt flow that serve play and not measurement: the thread ledger, rewards and streak, the day's active time and eye count, and the `postFeedback` mark a shown solution sets on later tasks of the node. Retention and transfer, owned by ADR-0400 and ADR-0410, take no observation from a letter under this rule.

### The report answers "language or maths?" with counts, intervals and marks

The post-MVP report gains the section «Язык или математика?» (Language or maths?), whose place in the report ADR-0380 sets. It reads only the `nl_probe` projection. A cell's observations are her graded first attempts on letters of that presentation, less the tasks the parent excluded. Its share counts the `clean` outcomes not marked assisted. Rapid guesses stay in, because a fast guess on a Dutch text she can't read is the very gap the probe measures, and dropping it would shrink that gap. The section shows:

1. Each presentation's share of right answers without help, overall and for each node, with its count and 80 % Wilson interval, and «мало данных» with the count in place of the share in a cell under 12 observations, the floor this measure owns (REQ-7180). RES-4250 set 12, because at 12 and one half right the 80 % interval spans about 33 % to 67 %.
2. The gap from `ru` to `nl` and from `nl` to `nl_after_words`, overall and by node, each with the 80 % interval ADR-0380 sets for a difference, and «мало данных» when either side holds fewer than 12 (REQ-7182).
3. Beside the `nl` share, how many attempts opened a card and how many of those were right (REQ-7188), and the same pair of counts beside `ru` for term hints, so the parent can compare the help she asked for in Russian with the help she asked for in Dutch.
4. Beside each gap, the share of its Dutch observations that came from pairs with `nativeReviewed`, and the mark «тексты не проверены носителем» (texts not checked by a native speaker) when that share is below one half (REQ-7190).
5. The words shown in `nl_after_words` of each family whose `nl` was wrong and whose `nl_after_words` was right (REQ-7184).
6. The practice gain: the pooled share of the `bare`, `ru` and `nl_source` presentations at each position 1 to 5, with «мало данных» under 12 (REQ-7186). The Dutch-to-after-words gap and the word list carry the mark «в том числе практика и разбор решения» (includes practice and the solution review). I chose to pool the three presentations by position, because a cell for each presentation at each position would hold about 4 observations in the first phase and read «мало данных» everywhere.
7. The count of families closed short (REQ-7198).

Every reading the section draws is ADR-0380's language line and maths line, worded as what to check. The probe draws no line of its own.

### The events this record owns

| Event | Payload | Meaning |
| --- | --- | --- |
| `probe_family_created` | `familyId`, `templateId`, `templateVersion`, `nodeId`, `subtype`, `level`, `pairHash`, `order`: a list of `{ presentation, seed }` | the engine built a family and fixed its order and numbers |
| `probe_text_approved` | `pairHash`, the pair's text, marks and cards, `as`: `written` or `edited`, `nativeReviewed` | the parent approved a pair, or recorded a native reading of it |
| `probe_text_declined` | `pairHash`, `nativeReviewed` | the parent rejected a candidate |
| `probe_text_removed` | `pairHash`, `reason`: `parent` or `blocked` | the parent withdrew a pair, and families already built keep it to their end; or the text gate blocked it at show time, and every open family on it closes short at this event |
| `probe_card_opened` | `itemId`, `familyId`, `presentation`, `wordIds`, `trigger`: `tap`, `planned` or `reopen` | she saw word cards on a letter |

The opened words of an attempt are the `probe_card_opened` events of its `itemId`, and `attempt_submitted` carries no copy, by ADR-0210's rule that a fact is logged in one place.

### What works once this is accepted, and what doesn't yet

Once this is accepted, a specification can be written, and nothing is built until the owner amends `CLAUDE.md` and the MVP is accepted. When it is built, the work lands in two increments, each removable on its own. The first is the offline run, the review screen and the pair library, which change nothing she sees. The second is the letters, the families, the stream and the report section, all behind `probe.enabled`; with the switch off, the game plays exactly as before. What doesn't work yet: the profile's dimension «Язык и формат» (language and format), which ADR-0390 reads from this stream; build check 5, which ADR-0380 owns and which runs through this projection; the canon record for the Mainland (REQ-7194); the style guide, the Dutch numeral list and the Dutch forbidden forms, which a person writes; and any native review, which needs a person who reads Dutch natively.

## Why

RES-4250 recorded the research. Its central finding is that every Dutch sentence beyond the bridge's 30 to 50 keywords breaks the Russian-only rule, which only the owner changes, so the probe can only be a post-MVP module behind that amendment. The other rules follow from one aim: the gaps must measure language and format and nothing else.

Practice and carryover are the main threats to that aim. Parallel forms reduce the retest effect and don't remove it (Hausknecht and colleagues, 2007, in RES-4250), so a fixed order would credit practice to one presentation, and a balanced order spreads it evenly. A word card read before the Dutch presentation teaches its words, a carryover that no balancing undoes (Barlow and Hayes, 1979, in RES-4250), so the Dutch pair keeps a fixed order and the other presentations balance around it. One presentation a game day and a 14-day window keep a family inside one state of her skill, as ADR-0060's rule for «Устойчиво» (stable) uses 14 days.

The tap rule departs from the addendum. Moving an attempt to presentation 4 when she taps a card would leave presentation 3 with only the texts she read well and mix two conditions in presentation 4 (RES-4250). Counting the tap as help, like a hint rung, keeps both cells honest, and the report shows how much help she asked for.

The text rules exist because a model's Dutch can make a language gap look larger than it is, and that error runs one way only (RES-4250). ADR-0130's pipeline already gives the probe what it needs: a frame without numbers, filled by the template's generator under new seeds, solved blind on three seeds and accepted by the parent. That gives "new numbers with the same difficulty features" for free. A second checking role for Dutch, three different models and the native-review mark narrow the remaining bias, and the report says how much of each gap rests on unreviewed text. A glossary closes only 11 % to 21 % of a second-language gap and leaves fluent readers unchanged (Kieffer, Rivera and Francis, 2012, in RES-4250), so the cards are a fair accommodation, and a gap that stays after them points to academic Dutch and says nothing yet about the maths.

The letter's single control set follows from the bare presentation, which can carry no model choice, steps, button or options. A text presentation that kept them would differ from the bare one in form as well as language, and Russian options inside a Dutch letter would translate its question (RES-4250). The twin goes for the same reason: any twin is a second presentation of the family on the same day, and it adds practice only to the families she got wrong.

The separate stream keeps the probe from moving any figure it wasn't built for. A letter is a new form: it arrives outside the Director's slots and a T letter drops the Guardian's phases, so its evidence can't be pooled with ordinary tasks, and Dutch letters would swamp the language-risk limit and push the bridge's share out of its band (RES-4250).

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep the bridge and ADR-0290's bare-versus-context split | No Dutch text, no amendment of the root policy, no new stream, no review queue; the split already compares bare sums with Russian word problems on every node | It never shows her a Dutch problem, so it can't separate language from format, and the owner's main practical question stays unanswered |
| The probe as the addendum writes it, in the MVP, texts by `PLANNER_MODEL`, a tap moving the attempt to presentation 4 | An answer before the M7 horizon of 2027-01-15, when the owner most wants it | It breaks the Russian-only rule and the MVP scope without the owner's amendment, the gateway refuses `PLANNER_MODEL` on the offline key, and its tap rule and "Cito style" bias the gap towards a language cause (RES-4250) |
| Dutch texts written only by a native speaker, with no model | Natural Dutch from the start, so the bias from a model's text disappears | About 60 Dutch texts for the first phase is many hours of a tutor's time, and ADR-0130 already chose model drafts under review for that cost; the `nativeReviewed` box keeps a tutor's review as the parent's choice inside this decision |
| Russian presentation from the ordinary frame library, Dutch written separately | No new Russian text; the Russian frames are already accepted | A library frame tells a different story from the Dutch one, and she may have met it in a room, so the gap would carry a story and a familiarity difference beside the language (REQ-7106) |
| Letters as Director slots in the rooms | No new part of the floor; the Director's ranking places them | They would compete with frontier and review for room slots, so 3 to 5 a day isn't guaranteed, and REQ-7148 makes them a fixed part |

## What it costs

The owner pays first: the amendment of `CLAUDE.md`, the review of the template list at stage acceptance, the Dutch section of the forbidden list and the Dutch numeral list, both written by hand because no dictionary tool generates Dutch forms here. I estimate about 150 Dutch forms for the forbidden section, by analogy with the 25 Russian lemmas of REQ-3314 and their forms, and about 40 numeral words.

The parent pays the largest recurring cost. The first phase needs pairs for 8 to 16 templates, and the target of 4 a template means 32 to 64 approved pairs. Each pair is two short texts and up to 8 cards; I estimate 3 minutes a pair, so 1.5 to 3 hours before and during the first phase, then nearly nothing, since the 28-day rule reuses approved pairs. A parent who doesn't read Dutch can check the Russian frame, the cards and the language check's notes, and can't vouch for the Dutch, which is the strongest objection below.

Money: a run writes 5 candidates a request on `PROBE_TEXT_MODEL`, the most expensive default, and each candidate costs 6 blind solves, or 9 when a maths template adds a Dutch source question, and one language check. For 64 pairs at a pass rate I assume near one half, that is about 130 candidates from about 26 writing requests, 800 to 1,200 blind solves and about 130 checks. At my estimates of $0.2 a writing request, $0.004 a solve and $0.005 a check, a run costs about $10. I chose a budget of $20 a run on the offline key, a budget and not an imposed limit, about twice that estimate, so a run that fails halfway can be repeated inside it. The owner raises the offline key's limit by it before a run, as ADR-0210 sets. It stands in ADR-0190's Baselines table.

The player pays about 1.5 minutes a letter, 4.5 to 6 minutes of a 60-minute adventure in the first phase and about 3 afterwards. ADR-0070's floor of 28 graph first attempts holds, because the plan drops to 3 letters where 4 won't fit.

Interruption budget: zero. The design sends no notification. The review screen shows its counts when the parent opens the Parent Room, and the settings row shows why the switch is inactive. If nobody attends to the Parent Room for a month, the probe keeps running on the approved pairs through the reuse rule, a template with no approved pair is skipped, candidates expire after 60 days and can be generated again for a few cents, and no data is lost. No queue grows: the candidates file is capped per template, and the switch can't turn on before the queue has been read far enough to fill 4 families.

Ceilings: 4 open families in the first phase and 2 after, 2 letters a floor, 4 a day; at most 8 marks a pair and 8 tap events an attempt; 4 approved pairs a template as the run's target, so the library holds at most about 64 pairs; the candidates file at one and a half times each template's shortfall, with at least 5, draining after 60 days. The event log grows by about 10 probe events a game day in the first phase, which ADR-0020's log absorbs.

The security boundary protects five things, most likely damage first:

1. The measurement from a biased text: a model's stiff or wrong Dutch reads as a language gap. The language role, the three different models, the parent's review and the native-review mark defend it, and the mark tells the parent where the defence is thin.
2. The player from shaming or frightening Dutch words, defended by the Dutch section of the forbidden list, the safety check and the parent's approval.
3. The player from Dutch text nobody approved, defended by the approval events, the switch, and the scope guard before the owner's amendment.
4. Her data leaving the Mac through the offline run, defended by the import rule and a request class with no field for it.
5. The rule against Cito items, defended by the word check and a style guide a person writes.

The strongest objection: the parent's approval certifies Dutch the parent may not be able to judge. If the parent doesn't read Dutch natively, the approval checks the Russian frame, the cards and the absence of bad words, and the naturalness of the Dutch rests on one model's verdict. The one bias the owner's falsifiability rule fears most, a language gap made by the text, then has only the «тексты не проверены носителем» mark against it, and a mark a parent reads past defends nothing. I accept it for now, because the addendum makes native review desirable and not required, the language role is a real check on grammar and the genre, and the reversal condition below turns native review into a requirement if the first reviewed texts show the model's Dutch failing.

## What would reverse it

- If the owner declines to amend the Russian-only rule, this decision is withdrawn, and the probe stays out of the game.
- If more than 1 in 4 of the decisions with `nativeReviewed: true` are `probe_text_declined` or `probe_text_approved` with `as: edited`, over at least 20 such decisions on pairs the language check passed, the language role's verdict isn't reliable, and native review becomes required before a pair can be approved, through a new record that adds it to REQ-7122.
- If more than half of the `nl` attempts in the first phase open a card, the `nl` cell mostly measures Dutch read with help, and the tap rule is reopened.
- If ADR-0190's 60-minute simulation with 3 letters a day yields fewer than 28 graph first attempts, the probe's volume and ADR-0070's floor conflict, and the owner chooses between them.
- If build check 5 of ADR-0380 fails on this projection, the report's reading of the probe is reopened before the section is shown.
- If the first phase ends with less than half of the Dutch observations of either gap from native-reviewed pairs, the gaps rest mostly on the model's Dutch, and the owner decides whether native review becomes required before the section keeps showing them. This condition fires even when no native reader ever appears, which the condition above can't.
- If the first phase ends by its 28-day limit with any of the three cells under 12, the volume is too low for the report to show a gap, and the owner decides between a longer phase and more open families.

The premortem, written as though it had happened: six weeks into the probe, the report showed a 30-point gap from Russian to Dutch, and the parent arranged Dutch lessons. Two months later a Dutch tutor read the texts and found that the writer had used formal constructions such as "bedraagt" and "gelieve", which no primary lesson uses. Ninety percent of the pairs were unreviewed, and the report had shown «тексты не проверены носителем» beside every gap the whole time. A second failure sat in the Russian frames: written in the same request as the Dutch, they read like translations, so the Russian share fell and the gap looked smaller than it was, and the two biases partly cancelled, which made the number look plausible. The native-review condition above exists for the first, and the language check's pair verdict and the parent's side-by-side reading exist for the second.

## Consequences

- The event catalogue gains `probe_family_created`, `probe_text_approved`, `probe_text_declined`, `probe_text_removed` and `probe_card_opened`, owned here. `settings_changed` gains `probe.enabled`. `item_shown` carries ADR-0380's `probe` field with the content fixed above and `forms: ["nl_probe"]`.
- ADR-0100's gateway gains `PROBE_TEXT_MODEL` and `PROBE_LANGUAGE_MODEL`, and the offline run refuses to start on shared model ids.
- `content/` gains `probe/pairs.json`, `probe/style-guide.md` and `probe/numerals.json`, and the one forbidden list gains its Dutch section; `data/` gains the candidates file and its export.
- The engine gains `src/engine/probe/`: families, order balancing, the phase, the window and the `nl_probe` projection. `planDay` gains the letters' place on the floor.
- The task window gains the letter's control set, underlined marked words, the card overlay and the opening cards of `nl_after_words`.
- The Parent Room gains the review screen, the settings row and the report section.
- The canon gains a record for the Mainland and its letters, which explains why some letters arrive as bare sums or in Russian, and no letter scene is written before it is approved (REQ-7194).
- ADR-0190's verify command gains the checks under "How I will know it was realised", the scope-guard traces above and the Baselines rows below.

Failure states, each with its next step and one audience:

| State | Next step | Audience |
| --- | --- | --- |
| `probe_run_refused` (shared model id, empty Dutch forbidden section, or no style guide) | the run stops before any call and names the reason | the owner, in the run's output |
| `probe_text_rejected` (with its step) | the candidate is dropped | the owner, as a count by step in the run's report |
| `probe_edit_failed` | the edited pair stays a candidate with its failures in words | the parent, on the review screen |
| `probe_switch_unavailable` | the switch stays inactive and shows the count of templates with a pair | the parent, in the settings |
| `probe_texts_short` | a template with no approved pair is skipped when a family is built | the parent, as a count on the review screen |
| `probe_text_blocked` | an approved pair fails `textGate` at show time, after the list grew; the letter isn't shown, the server writes `probe_text_removed` with `reason: "blocked"`, and the family closes short at that event | the parent, on the review screen, which lists blocked pairs; the parent edits one there, and the edit reenters the candidates file as any edit does |
| `probe_day_short` | fewer than 3 eligible templates hold an approved pair, so fewer than 3 families are open and the day shows fewer letters | the parent, as a count on the review screen of the templates that need a pair |
| `probe_letter_moved` | a letter not shown on its floor moves to the next floor or game day | nobody: it is ordinary play, and the family's window bounds it |
| `probe_family_closed_short` | the family closes at 14 days with the presentations it has | the parent, as the count in the report |

The player sees none of these. `probe_texts_short`, `probe_text_blocked` and `probe_letter_moved` are deliberately indistinguishable to her, because each ends in fewer letters and a normal floor.

## Amends

- ADR-0070: "Word problems (T) reach play through the Guardian (RES-3900)" becomes "Word problems (T) reach play through the Guardian, and as Dutch probe letters, which take the final answer only (REQ-7154)".
- ADR-0070: the floor opening, as ADR-0300 amended it, becomes: at most 2 Dutch probe letters follow the track tasks and come before the rooms; the plan never trims letters below 3 a day in the probe's first phase, and plans 3 where 4 would leave fewer than 28 graph first attempts.
- ADR-0080: state 4, as ADR-0220 amended it, becomes: `twin_open` after `alt`, or after any outcome with rung 2 or 3, on every task other than a Dutch probe letter, which gets no twin (REQ-7164).
- ADR-0080: "After every outcome it offers the detailed explanation for 1 guiding thread" becomes: after every outcome on every task other than a Dutch probe letter, whose review shows the short solution only (REQ-7162).
- ADR-0100: the role list gains `PROBE_TEXT_MODEL` and `PROBE_LANGUAGE_MODEL`, content tier, offline key, `ContentRequest`, with the defaults above.
- ADR-0130: "A frame reaches the player only from the frame library ... or from the live queue" becomes: only from those two, or, for a Dutch probe letter, from a probe pair the parent approved under ADR-0430, which passed steps 3 to 5 for each of its frames.
- ADR-0150: the Playwright test that "finds «Нельзя узнать» in every phase of every T1 to T4 problem", as ADR-0250 amended it, becomes: of every T1 to T4 problem other than a Dutch probe letter, and finds it on no letter.
- ADR-0160: "`content/shaming.ru.json` is the one list" becomes: it is the one list and holds a section `nl` of Dutch forms written by a person; `textGate` with `lang: "nl"` splits Latin-script tokens without folding them to Cyrillic and checks them against that section.
- ADR-0160: the string check's allowance of Latin-script words becomes: also the Dutch text of an approved probe pair inside a letter's task content and its cards, while `probe.enabled` is on, once the owner has amended the Russian-only rule.
- ADR-0180: the language-risk limit's "mistakes on tasks with a risk term whose explanation she didn't open" becomes REQ-7170's rule, which leaves out Dutch probe letters.
- ADR-0190: the scope guard's traces gain `content/probe/`, `tools/probe/`, a schema for any event type ADR-0430 owns and the route `/parent/probe`, until the stage that builds the probe after the owner's amendment.
- ADR-0190: the Baselines table gains "Probe text run | $20 a run on the offline key | ADR-0430 | chosen", "Probe letters | 3 to 5 a game day in the first phase, planned as 3 or 4, and 1 to 2 after, planned as 2, at most 2 a floor | ADR-0430 | imposed by REQ-7192 and REQ-7148" and "Probe cell floor | 12 observations | ADR-0430 | chosen by RES-4250".
- ADR-0210: "Every text and task the player sees is in Russian, apart from the Dutch keywords of the word bridge and the Dutch word a term hint shows" gains ", and, once the owner has amended the Russian-only rule, the Dutch text and cards of an approved probe pair inside a letter while `probe.enabled` is on".
- ADR-0210: the bridge's band, as ADR-0360 amended it, becomes REQ-7172's rule, which counts no Dutch probe letter; the bridge's renderer never picks a letter.
- ADR-0210: "Each stream keeps its own projection ... which never changes a node's «сама» state" gains: an attempt whose `forms` holds `nl_probe` feeds no projection but `nl_probe`'s, apart from the thread ledger, rewards and streak, active time and the eye count, and the `postFeedback` mark.
- ADR-0210: the table of event owners gains `probe_family_created`, `probe_text_approved`, `probe_text_declined`, `probe_text_removed` and `probe_card_opened`, owned by ADR-0430.
- ADR-0240: "A subtype carries an estimate when its row in `content/catalogue.yaml` has `estimate: true`" gains: except on a Dutch probe letter, which shows neither the estimate nor the inverse check.
- ADR-0250: "The button shows in every phase of every T1 to T4 problem" and "Four options on every problem" become REQ-7158's and REQ-7160's rules, which leave out Dutch probe letters.
- ADR-0250: the refusal guard's window of "the last 20 first attempts on solvable T1 to T4 problems" becomes REQ-7174's and REQ-7176's window, which counts no Dutch probe letter.
- ADR-0290: the floor order of REQ-5856 becomes REQ-7148's, with at most 2 Dutch probe letters after the Sources track's tasks and before the rooms.
- ADR-0290: the group 1 check that "fails on the words "Cito", "LVS" or "Leerling in beeld" in `src/templates/` or in any player string" also covers `content/probe/`, `tools/probe/` and `src/shared/events.ts`.
- ADR-0300: "as a fixed part of the floor after the warm-up and the 2 mental arithmetic tasks or the Volley, and before the rooms" gains: and before a floor's Dutch probe letters; a track row takes no attempt whose `forms` holds `nl_probe`.
- SPC-0040: «Нельзя узнать» "in every phase" of every T1 to T4 word problem becomes: of every one other than a Dutch probe letter.
- SPC-0070: "Word problems (T) reach play through the Guardian" and the refusal guard's window take the ADR-0070 and ADR-0250 amendments above.
- SPC-0080: the second-attempt trigger of REQ-5130 becomes REQ-7164's, which gives a Dutch probe letter no twin.
- SPC-0160: "`textGate` reads only `content/shaming.<lang>.json` for the `lang` it is given" becomes: reads `content/shaming.ru.json`, and for `lang: "nl"` its section `nl`; the bridge share counts no Dutch probe letter.
- SPC-0180: the language-risk limit and the refusal observation take REQ-7170's and REQ-7174's rules.
- SPC-0190: the scope guard's list gains the probe's traces above.
- SPC-0290: the floor order becomes REQ-7148's.
- SPC-0300: the track task's fixed place comes before a floor's Dutch probe letters, and a track row takes no `nl_probe` attempt.

## How I will know it was realised

1. With `probe.enabled` off, a Playwright walk through a simulated day and a search of every server packet find no letter, no Latin-script word outside the approved bridge keywords and the Dutch words of term hints, and no probe card.
2. `npm run probe:generate` refuses to start with two roles on one model id, with an empty `nl` section in the forbidden list, and with no style guide, and makes no model call in any of the three cases.
3. A recording of every request of a probe run holds no field from the event log, and the import check fails a build in which `tools/probe/` imports the log or the database, or `src/engine/probe/` imports the gateway.
4. The pipeline rejects, each with its step: a frame with `{a}` missing, a Dutch frame holding «twaalf», a Russian frame holding a Latin word, a Dutch frame holding a form from the `nl` section, a pair whose Dutch frame gets a wrong blind answer on one of its three sets, a pair the language check marks as telling another context, a prompt or pair holding "Cito", and a pair with 9 marks.
5. A pair in `content/probe/pairs.json` with no `probe_text_approved` for its current hash is never shown, and editing an approved pair keeps it from play until a new approval holds its new hash.
6. A simulation of 60 game days with the switch on, some days skipped, finds: no two presentations of one family on one game day; every presentation fewer than 14 game days after the family's first; `nl_after_words` always right after `nl`, on a later game day; for each of `bare`, `ru` and `nl_source`, before-counts and after-counts that differ by at most 1; the same orders on a replay; at most 2 letters a floor, after the track tasks and before the rooms; 3 or 4 letters on every completed first-phase day while at least 3 eligible templates hold a pair, and no two open families on one template; and the phase switching at 20 observations in each of the three cells or at 28 game days with play.
7. A property test on random logs changes the answers of `nl_probe` attempts, and every «сама» estimate, track row, limit, bridge share, refusal-guard window and Director success share stays equal.
8. A packet test of every presentation of a T family finds the same `InputSpec`: no model choice, plan, step fields, «Нельзя узнать», options, estimate or inverse check.
9. A state-machine test answers a letter wrong, and the flow shows the short solution with no `twin_open` and no detailed explanation, whatever rung she saw.
10. A test taps a card in `nl`: the attempt is `assisted: true`, stays in the `nl` count and logs one `probe_card_opened` a word; in `nl_after_words` the planned cards open first and the attempt stays unassisted.
11. A reward test finds the same experience and streak effect for a clean letter in each presentation, with cards and without.
12. A report fixture shows «мало данных» with the count for a cell with 11 observations and a share for one with 12, «мало данных» for a gap whose one side holds 11, the mark «тексты не проверены носителем» at a native share of 0.4 and not at 0.5, the word list, the practice gain by position, the card counts and the count of families closed short.
13. ADR-0290's word check fails a build with "Cito" in `content/probe/`, `tools/probe/` or an event schema value.
14. The owner reads the canon record for the Mainland at the stage acceptance, and the line pool holds no letter scene before that record is approved.

## What this does not settle

- The report's interval family, the language and maths lines, the four states and build check 5: ADR-0380.
- How the profile's dimension «Язык и формат» reads the `nl_probe` stream: ADR-0390.
- Whether retention and transfer ever take a letter: ADR-0400 and ADR-0410, which this record's stream rule leaves at none.
- The wording of the owner's amendment to `CLAUDE.md`, which is the owner's alone.
- The canon record's content, the Mainland's names and the letter scene's lines.
- The style guide's text, the Dutch forbidden forms and the Dutch numeral list, which a person writes.
- The English and Dutch interface and the rest of the Dutch layer, which stay deferred.
- Which templates carry `probeFamily`, beyond the rule of 1 to 2 for each group; the owner approves the list at the stage acceptance.

Amended on 2026-10-10: this record no longer addresses 1 requirement that was superseded, because a decision cannot realise a requirement that is no longer in force: REQ-7192 (superseded by REQ-7514, which ADR-0460 addresses).
