---
id: SPC-0430
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-6656, REQ-6664, REQ-6684, REQ-7100, REQ-7102, REQ-7104, REQ-7106, REQ-7108, REQ-7110, REQ-7112, REQ-7114, REQ-7116, REQ-7118, REQ-7120, REQ-7122, REQ-7124, REQ-7126, REQ-7128, REQ-7130, REQ-7132, REQ-7134, REQ-7136, REQ-7138, REQ-7140, REQ-7142, REQ-7144, REQ-7146, REQ-7150, REQ-7152, REQ-7154, REQ-7156, REQ-7162, REQ-7166, REQ-7168, REQ-7178, REQ-7180, REQ-7182, REQ-7184, REQ-7186, REQ-7188, REQ-7190, REQ-7192, REQ-7194, REQ-7196, REQ-7198]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Dutch probe: its families, its letters, its Russian and Dutch text pairs, the stream `nl_probe` and its report section

## Scope

This document covers the Dutch probe from end to end: the parent's switch, the probe families built on ordinary templates, the Russian and Dutch text pairs and the offline run that writes and checks them, the parent's review of each pair, the letters that carry every presentation onto a floor, the letter's controls and word cards, the stream `nl_probe`, and the report section «Язык или математика?» (Language or maths?). It is written at the component level: modules, content files, routes, events, projections, rules and checks. The whole probe comes after the MVP, and SPC-0190 keeps it out of the first version. ADR-0430 holds the reasons for the rules this document states.

Nothing in this document is built until the owner amends the principle `project_in_english` in `CLAUDE.md`, whose sentence "Text the player sees is in Russian only for now" is the Russian-only rule (REQ-6684). No Dutch probe text, prompt, file or screen exists before that amendment, and only the owner changes that file. The probe's build starts at the first stage after the MVP whose acceptance follows the amendment. If the owner declines it, ADR-0430 is withdrawn and nothing here is built. Until the amendment, SPC-0190's scope guard fails on the probe's traces it lists.

It leaves out what other documents state. SPC-0020 states the event log, the shape and payload versions of `item_shown`'s field `probe`, and the owner table of the probe's event types. SPC-0040 states the template contract, the answer kinds and «Нельзя узнать» (can't be known) with its options, which a letter never shows. SPC-0060 states the knowledge model and its admitted forms. SPC-0070 states the Director's slots and the refusal guard's share, SPC-0290 the order of a maths floor with the letters' place in it, and SPC-0090 the game day, `gameDayOf` and `planDay`. SPC-0080 states the attempt flow, the hint ladder and the twin rule, which gives a letter no twin. SPC-0100 states the model gateway, its roles, keys and `ContentRequest`, and SPC-0130 the frame pipeline whose steps a pair passes. SPC-0160 states `textGate`, the one forbidden list and the bridge's share, and SPC-0180 the report, its intervals, its «мало данных» (too little data) registry, the language-risk limit, the refusal observation and the language and maths lines. SPC-0300 states the Sources track and `SourceView`, SPC-0110 the canon and the line pool, and SPC-0140 rewards and the streak. SPC-0190 states the verify command, the scope guard, build check 5 and the probe's baselines. ADR-0390 reads the stream `nl_probe` for the profile's dimension «Язык и формат» (language and format), ADR-0410 counts a letter as a side slot, and ADR-0450 reads the probe's presentation shares as hypothesis measures.

## Boundary

### Modules and files

| Module or file | What it holds |
| --- | --- |
| `src/engine/probe/` | families, the order of presentations, the phase, the family window and the `nl_probe` projection |
| `tools/probe/` | the offline run `npm run probe:generate` |
| `content/probe/pairs.json` | the approved pairs, committed by the owner from the server's export |
| `content/probe/style-guide.md` | the genre of a Dutch primary-school word problem, written by a person in English with Dutch example phrases of the person's own |
| `content/probe/numerals.json` | the Dutch numeral words, written by a person |
| `content/shaming.ru.json` | the one forbidden list, with its section `nl` of Dutch forms written by a person |
| `data/probe-candidates.json` | the candidates that passed the run and wait for review, outside the repository |
| `data/exports/probe.pairs.json` | the server's copy of the approved pairs, rewritten after each change |
| a canon record in `canon/` | the Mainland and its letters |

### Settings and routes

| Surface | What it offers |
| --- | --- |
| `probe.enabled` in the parent settings | off by default; written through `PUT /api/parent/settings` as a `settings_changed` event |
| the settings row for the probe | the switch, which can't turn on while fewer than 4 eligible templates hold an approved pair and then shows that count; it can always turn off |
| `/parent/probe`, the screen «Письма: тексты» (Letters: texts) | each candidate pair with «принять / отклонить / поправить» (accept / reject / edit), the mark editor and the box «проверено носителем языка» (checked by a native speaker) |
| the report section «Язык или математика?» | the probe's shares, gaps, counts and marks |

### Presentations

A family holds exactly these presentations (REQ-7108). Each is a value of `item_shown.probe.presentation`:

| Template | Presentations |
| --- | --- |
| A maths template | `bare`, `ru`, `nl`, `nl_after_words`, and `nl_source` when the template draws a table or chart |
| A Sources track template | `ru`, `nl` and `nl_after_words`, each drawn as a source through `SourceView` |

A Sources family's three presentations fill the report's `ru`, `nl` and `nl_after_words` cells, and the `nl_source` cell holds only the source presentations of maths families (REQ-7108). No presentation value, template field, prompt, data file or logged value holds the name Cito (REQ-7110).

### The field `probe` on `item_shown`

Every `item_shown` of a letter carries `purpose: "nl_probe"`, `forms: ["nl_probe"]` and the field `probe`, `{ familyId, presentation, position }` (REQ-6656). `presentation` is the presentation the engine built at show time, and `position` is the count of the family's presentations shown before it plus 1. The presentation is logged in this field and nowhere else.

### Events this part owns

| Event | Payload | Written when |
| --- | --- | --- |
| `probe_family_created` | `familyId`, `templateId`, `templateVersion`, `nodeId`, `subtype`, `level`, `pairHash`, `order`: a list of `{ presentation, seed }` | the engine builds a family and fixes its order and numbers |
| `probe_text_approved` | `pairHash`, the pair's text, marks and cards, `as`: `written` or `edited`, `nativeReviewed` | the parent approves a pair, or ticks the native-review box on an approved one |
| `probe_text_declined` | `pairHash`, `nativeReviewed` | the parent rejects a candidate |
| `probe_text_removed` | `pairHash`, `reason`: `parent` or `blocked` | the parent withdraws a pair, or `textGate` blocks it at show time |
| `probe_card_opened` | `itemId`, `familyId`, `presentation`, `wordIds`, `trigger`: `tap`, `planned` or `reopen` | she sees word cards on a letter |

`attempt_submitted` carries no copy of the opened words; an attempt's opened words are the `probe_card_opened` events of its `itemId` (REQ-7140).

### Model roles the offline run uses

| Role | Job | Default model |
| --- | --- | --- |
| `PROBE_TEXT_MODEL` | write pairs, mark words, write cards | `anthropic/claude-opus-5.5` |
| `CHECK_MODEL` | solve each filled frame blind | `openai/gpt-5.5` |
| `PROBE_LANGUAGE_MODEL` | check the Dutch frame, the marks and the pair's match | `google/gemini-3.8-flash` |

Each role is content tier, spends from the offline key and sends a `ContentRequest`, as SPC-0100 states for its roles (REQ-7116).

### What this part requires, and the dependencies it may have

- SPC-0040 supplies the templates and their generators, SPC-0130 the frame checks of steps 3 to 5 and `frameMetrics`, SPC-0160 `textGate`, SPC-0100 the gateway and its roles, SPC-0090 `gameDayOf` and `planDay`, SPC-0300 `SourceView`, SPC-0080 the attempt flow, SPC-0140 rewards and the streak, and SPC-0180 the interval family and the registry `src/parent/measures.ts`.
- `src/engine/probe/` and the server's probe routes never import the model gateway. `tools/probe/` never imports code that reads the event log or the database. A group 1 check of SPC-0190 fails the build on either import.
- The client imports only `src/shared/`, as for every other part.

## Behaviour

### The parent's switch holds the whole probe

While `probe.enabled` is off, the Director plans no letter, the server builds no probe view and serves no probe card, and a letter already planned for the day is dropped, so she sees no letter, no Dutch probe text and no word card anywhere (REQ-7100). The switch turns on only when at least 4 eligible templates hold an approved pair; until then the settings row can't turn it on and shows that count. The parent can turn it off at any time. Turning the switch off and on again resumes the probe where it stood: the families whose 14 days passed are closed, and the phase counters and balance counts keep their values.

### A family is one ordinary template in up to five presentations

Every probe task comes from an ordinary template tied to a node of the skill graph or of the Sources track (REQ-7104). A template takes part when it carries the field `probeFamily`, which names its family key, and the template schema refuses a template with `probe: true` and no `probeFamily` (REQ-6664). 1 to 2 templates of each of T1 to T4, P, F, M and the Sources track carry `probeFamily`, on a list the owner approves at the stage acceptance. A build check fails a maths template with `probeFamily` that can't render a bare form.

The engine builds families at the change of game day and writes `probe_family_created`. An eligible template carries `probeFamily`, and its node already holds at least one graded first attempt of hers. The engine takes the least recently probed eligible template that holds an approved pair and no open family, and the adventure's seeded stream decides a tie. No two open families share a template.

The family's level is the level the Director would give an ordinary room task on that node that day, fixed for the whole family. Each presentation draws its numbers from the template's generator under a seed of its own at that level, and the seeds are drawn at creation from the adventure's seeded stream (REQ-7106). A T1 to T4 family always takes an ordinary subtype, never a surplus or unanswerable one (REQ-7156).

### Every text presentation comes from one approved pair

A pair holds a Russian frame and a Dutch frame that tell the same context with the same quantities and the same question, both with a placeholder for every number and name. It also holds up to 8 words of the Dutch frame marked as likely unfamiliar, each with its card text, a Russian gloss. When the template draws a source, the pair also holds the source's Dutch labels and, on a maths template, a Dutch source question.

A family takes one pair for all its text presentations:

| Presentation | Text it shows |
| --- | --- |
| `bare` | the template's bare form, with no frame |
| `ru` | the Russian frame |
| `nl` | the Dutch frame |
| `nl_after_words` | the same Dutch frame as `nl`, with new numbers |
| `nl_source` | the Dutch source question and labels |

The renderer fills every name placeholder with one Mainland name from the canon record, the same person in every presentation of the family. So every text presentation tells one context, and only the language and the numbers differ (REQ-7106). The family takes the least recently used approved pair of its template, never one used in the last 28 game days while another exists, and otherwise the one used longest ago. The Russian frame stays in the probe's file and never enters the frame library of ordinary tasks, and it holds no Latin-script token, so no bridge keyword can sit in it (REQ-7178).

### The offline run writes and checks every pair

`npm run probe:generate` is the only producer of probe text, and it runs outside any session on the offline key; no code path in the server calls a model for probe text (REQ-7114). `PROBE_TEXT_MODEL` writes the pairs, and `PLANNER_MODEL` writes none, because the gateway refuses a play role on the offline key (REQ-7116). The run refuses to start as `probe_run_refused` when two of its three roles resolve to the same model id (REQ-7124), when the section `nl` of the forbidden list is empty, or when `content/probe/style-guide.md` is missing. It makes no model call in any of these cases.

The run receives no data about the player: its `ContentRequest` holds the template's structural specification, the style guide, the Mainland's canon names and the target length, and has no field for an answer, a tap or an opened word (REQ-7126). The style guide describes a Dutch primary-school word problem: a short everyday context, its numbers inside sentences and exactly one question (REQ-7112). It also lists the features to avoid, such as passive verbs, long noun phrases and conditional clauses. No prompt, style guide, template, data file or logged value quotes or imitates a Cito item or names Cito, and the writer receives no Cito item (REQ-7110). SPC-0190's word check covers `content/probe/`, `tools/probe/` and the event schemas.

Each writing request asks for 5 candidate pairs in a fixed JSON schema, and the writer marks the words of each Dutch frame a pupil is likely not to know (REQ-7196). Each candidate passes these steps in order, or the run drops it as `probe_text_rejected` with its step:

1. Code checks both frames: every listed placeholder exactly once and no other, no digit, no numeral word from the Russian numeral lexicon or from `content/probe/numerals.json`, and the length limit of an ordinary frame. The Russian frame also passes `frameMetrics` and holds no Latin-script token. The marks name words that occur in the Dutch frame, at most 8.
2. `textGate` passes the Russian frame and every card text with `lang: "ru"`, and the Dutch frame, any Dutch source question, the Dutch labels and every marked word with `lang: "nl"` (REQ-7128).
3. The safety check of an ordinary frame passes both frames and any Dutch source question and labels.
4. Code fills each frame, the Russian, the Dutch and any Dutch source question, with three sets of numbers from the template's generator under three seeds. `CHECK_MODEL` solves each filled text blind, seeing only that text and, for a source, the source's data as a text table. Every answer must equal the engine's (REQ-7118).
5. `PROBE_LANGUAGE_MODEL` returns a verdict in a fixed schema on the grammar and naturalness of the Dutch frame, any Dutch source question and the Dutch labels for a primary-school reader, on the three genre traits, on each mark and on any unmarked word a pupil of group 5 to 8 might not know. The verdict also covers whether the Russian frame tells the same context, quantities and question and reads as natural Russian, not as a translation. The candidate passes only when every item passes (REQ-7120, REQ-7196).

When the verdict fails only on the marks, the candidate goes back once to `PROBE_TEXT_MODEL` with the verdict's notes, which rewrites the marks and their cards, and the revised candidate reruns steps 1, 2 and 5. A second failure drops it. So every mark and card that reaches the parent has passed the ceiling of 8, the forbidden list and the language check (REQ-7196).

Passing candidates go to `data/probe-candidates.json`. The file holds, for each template, at most the larger of 5 and one and a half times the template's shortfall against a target of 4 approved pairs. A candidate older than 60 days expires.

### The parent approves each pair, its marks and its cards

The screen «Письма: тексты» shows each candidate with its Russian and Dutch frames side by side, each also filled with one set of numbers, the marked words with their cards, the language check's notes, the template and the node. The parent sets the box «проверено носителем языка» before deciding, so every decision records whether a native speaker reviewed the text (REQ-7102). Before accepting, the parent can add or remove a mark and change a card, and the approval covers the marks and cards as they then stand (REQ-7144). An edit of any part of a pair, its frames, source question, labels, marks or cards, reruns steps 1 and 2 at once and shows in words what the edited text failed. The edited pair stays in `data/probe-candidates.json`, and the next run takes it through steps 3 to 5. Until it passes them, the review screen shows it as waiting for its check, with no accept control.

Accepting writes `probe_text_approved` with the pair's full text and a hash over its frames, source question, labels, marks and cards, and rejecting writes `probe_text_declined`; both carry `nativeReviewed` as the box stood. Ticking the box later writes a new `probe_text_approved` for the same hash with `nativeReviewed: true`, and the report reads the latest one. The engine gives a new family only a pair whose current hash has a `probe_text_approved` in the log and no later `probe_text_removed`. A family built before a `probe_text_removed` with `reason: "parent"` keeps its pair to its end. The server serves no pair whose current hash lacks a `probe_text_approved`, so a pair edited by hand in `content/probe/pairs.json` is never shown (REQ-7122).

### Letters take a fixed place and one presentation of a family a game day

Every presentation, bare and Russian included, arrives as a letter from the Mainland: the same short story frame from the line pool opens it, and the letter's task opens in the ordinary task window in the same slot (REQ-7146). A canon record adds the Mainland and its letters and says why some letters arrive as bare sums or in Russian, and the line pool holds no letter scene before the owner approves that record (REQ-7194). SPC-0290 states where letters sit on a maths floor and that a floor holds at most 2. Letters take no room slot. `planDay` places the day's letters 2 on each maths floor from the first. A letter not shown when its floor ends moves to the first later maths floor of the same game day holding fewer than 2 letters, then to the next game day.

The engine gives each open family at most one letter a game day, its next presentation in the family's order, so no two presentations of one family fall on one game day (REQ-7134). The probe runs in two phases (REQ-7192):

| Phase | Open families | Letters planned a game day |
| --- | --- | --- |
| First | 4 | 4, or 3 where 4 would leave the Director fewer than 28 graph first attempts; the family with the most game days left in its window then skips the day |
| After the first | 2 | 2 |

The first phase ends when the `ru`, `nl` and `nl_after_words` cells of the overall table each hold 20 observations, counted as the report counts them, or when she has played on 28 game days with the switch on, whichever comes first (REQ-7192). The phase is a projection over the log and is logged nowhere else. When fewer than 3 eligible templates hold an approved pair, fewer than 3 families are open and the day shows fewer letters.

A family's order is fixed at creation. `nl_after_words` directly follows `nl`, so it falls on a later game day than `nl` and nothing sits between them (REQ-7130, REQ-7132). Each of `bare`, `ru` and `nl_source` goes before or after that pair by a balancing rule over the families built so far (REQ-7132):

- When it has gone before the pair more often than after, it goes after.
- When it has gone before less often than after, it goes before.
- When the two counts are equal, a draw from the adventure's seeded stream decides.

The order inside the group before the pair, and inside the group after it, is also a seeded draw. Each balanced presentation then stands before and after the pair equally often, give or take one family, and a replay of the log gives the same order (REQ-7132).

Every presentation of a family falls fewer than 14 game days after its first presentation, counted by `gameDayOf` whether she plays or not (REQ-7136). When the window ends before all its presentations are shown, the family closes with the ones it has, the unshown ones are never planned, and the report counts it as closed short (REQ-7198). A family still inside its window feeds the report with what it has shown (REQ-7198). A family on a pair that `textGate` blocks at show time also closes short, at the `probe_text_removed` with `reason: "blocked"`, and the report counts it with the others. Closing at the window's end is computed from the log and writes no event.

### A letter keeps one set of controls in every presentation

Every letter takes the template's final-answer input with the keypad, «Не знаю» (I don't know), the thread button and «Готово» (Done), in every presentation. A T1 to T4 letter shows no model choice, plan cards, step fields, «Нельзя узнать» or options for what is missing (REQ-7154). No letter shows the estimate or the inverse check.

The attempt flow is SPC-0080's with two changes. After a wrong answer or «Не знаю» she sees the short solution at once and gets no second attempt, whatever hint she saw, and the review offers no detailed explanation (REQ-7162). A letter gives the same experience, streak and rewards as an ordinary task of its kind, whatever its presentation and whether she opened cards (REQ-7152). The bridge's renderer never picks a letter, so no letter carries a bridge keyword (REQ-7178).

### Word cards

In the `nl` and `nl_source` presentations every marked word the text shows is underlined, and a tap on it opens its card (REQ-7150). The first open of each word in an attempt writes `probe_card_opened` with `trigger: "tap"` and marks the attempt `assisted: true`. The attempt stays in its presentation's count (REQ-7138, REQ-7140). Later openings of the same word in the same attempt write nothing, so an attempt writes at most 8 tap events.

The `nl_after_words` presentation opens with the cards of every marked word and shows the task only after she closes them (REQ-7142). She can close them at once and reopen any card during the task (REQ-7142). Opening them writes one `probe_card_opened` with `trigger: "planned"` and every marked word, and a reopening writes `trigger: "reopen"` once a word (REQ-7140). Neither marks the attempt as assisted. A term hint she opens in a `ru` letter marks the attempt assisted, and a bought hint rung marks any letter assisted, as SPC-0080 states for every task.

### Letters feed only the stream `nl_probe`

Every attempt on a letter, bare and Russian included, is recorded in the stream `nl_probe` and in no other (REQ-7166). Its `forms` holds `nl_probe`, and the knowledge model admits no form, so the attempt never changes the «сама» (on her own) estimate of any node (REQ-7168). Every projection other than `nl_probe`'s skips an attempt whose `forms` holds `nl_probe`: the knowledge model, the Sources track's rows, the limits, the bridge's share, the refusal guard's window and its report observation, the bare-task share and the Director's success share. SPC-0060, SPC-0070, SPC-0160, SPC-0180 and SPC-0300 state each exclusion for their own projections. Four parts that serve play still read a letter: the thread ledger, rewards and the streak, the day's active time and eye count, and the `postFeedback` mark a shown solution sets on later tasks of the node.

### The report section «Язык или математика?»

The section reads only the `nl_probe` projection, and its place in the post-MVP report is SPC-0180's. A cell's observations are her graded first attempts on letters of that presentation, less the tasks the parent excluded. Its share counts the `clean` outcomes not marked assisted, and rapid guesses stay in. Each interval is the 80 % Wilson interval SPC-0180 states, and the cell floor of 12 observations is registered in `src/parent/measures.ts`. The section shows:

1. Each presentation's share of right answers without help, overall and for each node, with its count and interval, and «мало данных» with the count in place of the share in a cell under 12 observations (REQ-7180).
2. The gap from `ru` to `nl` and the gap from `nl` to `nl_after_words`, overall and for each node, each with its interval, and «мало данных» when either side holds fewer than 12 (REQ-7182).
3. Beside the `nl` share, how many attempts opened a card and how many of those were right (REQ-7188), and the same two counts beside `ru` for term hints.
4. Beside each gap, the share of its Dutch observations that came from pairs whose latest `probe_text_approved` has `nativeReviewed: true`, with the mark «тексты не проверены носителем» (texts not checked by a native speaker) when that share is below one half (REQ-7190).
5. The words shown in `nl_after_words` of each family whose `nl` was wrong and whose `nl_after_words` was right (REQ-7184).
6. The practice gain: the pooled share of the `bare`, `ru` and `nl_source` presentations at each position 1 to 5, with «мало данных» in a cell under 12 (REQ-7186). The `nl` to `nl_after_words` gap and the word list carry the mark «в том числе практика и разбор решения» (includes practice and the solution review) (REQ-7186).
7. The count of families closed short (REQ-7198).

Every reading the section draws is the language line or the maths line SPC-0180 states, worded as what to check. The probe draws no line of its own.

## Failure paths

| Condition | What happens |
| --- | --- |
| The owner hasn't amended the Russian-only rule | Nothing here is built, and SPC-0190's scope guard fails a build that holds a probe trace. |
| Two of the run's roles resolve to one model id, the section `nl` is empty, or the style guide is missing | `probe_run_refused`: the run stops before any model call and names the reason in its output, for the owner. |
| A candidate fails a step of the run | `probe_text_rejected`: the run drops it, and its report counts rejections by step, for the owner. |
| A candidate fails the language check on its marks alone | The writer rewrites the marks and cards once; a second failure drops the candidate. |
| The parent's edit fails step 1 or 2 | `probe_edit_failed`: the pair stays a candidate, and the review screen shows its failures in words. |
| Fewer than 4 eligible templates hold an approved pair | `probe_switch_unavailable`: the switch can't turn on, and the settings row shows the count. |
| A template has no approved pair when a family is built | `probe_texts_short`: the engine skips the template, and the review screen counts it. |
| An approved pair fails `textGate` at show time, after the list grew | `probe_text_blocked`: the letter isn't shown, the server writes `probe_text_removed` with `reason: "blocked"`, every open family on that pair closes short at that event, and the review screen lists the pair for the parent to edit. |
| The parent withdraws a pair | The server writes `probe_text_removed` with `reason: "parent"`; families already built keep the pair to their end. |
| A pair in `content/probe/pairs.json` has no `probe_text_approved` for its current hash | The server never serves it. |
| Fewer than 3 eligible templates hold an approved pair | `probe_day_short`: fewer than 3 families are open, the day shows fewer letters, and the review screen counts the templates that need a pair. |
| A letter isn't shown when its floor ends | `probe_letter_moved`: it moves to the next maths floor with space, then to the next game day. |
| A family's 14 days end before all its presentations are shown | `probe_family_closed_short`: the family closes with what it has, and the report counts it. |
| A cell or a gap side holds fewer than 12 observations | The report shows «мало данных» with the count. |

The player sees none of these states: each one ends in fewer letters and a normal floor.

## Open findings

- ADR-0380 has the template schema refuse a template with `probe: true` and no `probeFamily`, and ADR-0430 makes a template take part when it carries `probeFamily`, with no field `probe: true`. This document states both rules as written and doesn't choose whether `probe: true` is a template field of its own.
- ADR-0430 marks words of the Dutch frame and underlines marked words in `nl_source`, which shows the Dutch source question and labels and not the frame. It doesn't say whether words of the source question and labels can be marked. This document underlines the marked words the text shows and doesn't choose.
- ADR-0430 closes a family when its 14-day window ends or when its pair is blocked, and doesn't say whether a family whose presentations have all been shown still counts as open. If it does, it holds a place among the 4 or 2 open families, and the plan can show fewer letters than REQ-7192 requires. This document doesn't choose.
- ADR-0430's list of checks leaves the Dutch source question out of steps 2, 3 and 5 and out of the approval hash, and leaves the labels out of step 3 and step 5. This document applies REQ-7128, REQ-7120 and REQ-7122, which cover every Dutch probe text, to the source question and the labels.
- REQ-7192 requires 3 to 5 letters on each game day of the first phase, and ADR-0430 shows fewer as `probe_day_short` when fewer than 3 eligible templates hold an approved pair. This document states ADR-0430's plan and doesn't choose; the requirement or the decision needs an owner's ruling on that case.

## Open review findings

- Rejected, round 1: name the reason or the ADR-0430 section for the 28-game-day pair reuse, the candidate fill and the 60-day expiry. A specification states what the system does and never why (S8), and the Scope sends the reader to ADR-0430 for every reason.
- Rejected, round 2: state here how `textGate` treats `lang: "nl"`, the bridge's share and the refusal guard's exclusion of letters, the Director's success share, the Sources track's rows and the floor order with the letters' place, adding REQ-7148, REQ-7172 and REQ-7176 to `states:`. ADR-0430's amendments give each of these to SPC-0160, SPC-0070, SPC-0290 and SPC-0300, which are being revised for addendum 2 at the same time, and stating them here would state one rule in two documents. Open until those revisions land: if one of them doesn't state its part, this document's cross-reference is false.
- Open, round 2: when a template already holds 4 approved pairs, its shortfall is 0 and the larger of 5 and 0 still asks for 5 candidates; ADR-0430 doesn't say whether the run skips that template, or how one and a half times an odd shortfall rounds.
- Rejected, round 2: shorten the pair-reuse rule to "the least recently used approved pair". The rule's 28-game-day clause is ADR-0430's wording, and a later change to the reuse order would need it.
- Rejected, round 2: reword the writing-standard comment under the front matter. The template puts that comment in every record, and every other specification keeps it as it stands.
