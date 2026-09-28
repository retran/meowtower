---
id: ADR-0280
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-5700, REQ-5702, REQ-5704, REQ-5706, REQ-5708, REQ-5710, REQ-5712, REQ-5714, REQ-5716, REQ-5718, REQ-5720, REQ-5722, REQ-5724, REQ-5725, REQ-5726, REQ-5728, REQ-5730, REQ-5731, REQ-5732, REQ-5734, REQ-5736, REQ-5738, REQ-5740, REQ-5742, REQ-5744, REQ-5746, REQ-5748, REQ-5750, REQ-5752, REQ-5754, REQ-5756, REQ-5758, REQ-5760, REQ-5762, REQ-5764, REQ-5766, REQ-5768, REQ-5770, REQ-5772, REQ-5774, REQ-5776, REQ-5778, REQ-5780, REQ-5782, REQ-5784, REQ-5786, REQ-5788, REQ-5790, REQ-5792, REQ-5794, REQ-5795, REQ-5796, REQ-5798, REQ-6064]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0280. The Diary's puzzles «Петельки Смотрителя» come only from a bank the parent approved by hash, with every number and check in language-free data and code, one new puzzle a day after the finale, and their own event types that the knowledge model never reads

## Decision

A Diary puzzle is not an adventure task. It runs its own small flow on the server, draws on a bank of puzzles whose every number, rule and reference solution sits in data a person approved, and writes its own event types. The knowledge model, the adventure's Director and the day's plan read none of them. The game names the branch «Петельки Смотрителя» (the Keeper's loops) and one puzzle «головоломка» (puzzle) in every Russian text the player or the parent sees (REQ-5710). This decision builds on ADR-0210, which owns the game day at 04:00, the taskless screens that open whenever the task window is closed, the MVP scope and the owning decision for each new event type, and it doesn't restate them.

### The bank

Each puzzle is two files, so the numbers can't depend on the display language (REQ-5764):

- `content/puzzles/<id>.json` holds the language-free data: the puzzle's kind, its theme (one of the addendum's 11), its difficulty from 1 to 4, a `week` flag, its parameters, its rules, its reference solution, the widget and its starting state where it has one, an optional running clue with its earliest checkpoint, and the source of its idea as author, title and edition (REQ-5768).
- `content/puzzles/<id>.ru.json` holds the Russian text: the statement, the three hint rungs, the full solution and the title, each with a placeholder such as `{a}` for every number, filled by code from the data.

A person or the building agent writes the data file from an idea read in a source, and a model never sees the source's text, so every statement, story and solution is written anew (REQ-5770). I chose to let the building agent draft data files, as the owner let an agent draft the science bank on 2026-09-27 (ADR-0130), because the parent's approval of the whole puzzle is the guard in both cases. A rebus uses digits or shapes, never letters (REQ-5766), and a group 1 check fails a rebus whose data holds a letter. A figure is drawn by code from the data: the grid, the scales, the jugs, the table of knights and liars and the matchsticks. I chose this over drawn art, because a figure drawn from the data can't disagree with the numbers and needs no art run.

Each kind has one check function in `src/shared/puzzles/checks/`, which takes the puzzle's data and an answer and returns accepted or not accepted. A check tests the answer against the puzzle's rules and never compares it with the stored reference solution, so every right cutting, arrangement or sequence of moves passes (REQ-5740). The answer formats are the addendum's five: a number, a set of numbers, an arrangement, a set of grid cells and a sequence of moves. The five widgets, «Весы Базара» (the Bazaar's scales), «Кувшины» (Jugs), «Таблица рыцарей и лжецов» (the table of knights and liars), «Клетчатое поле» (the grid) and «Спички» (Matchsticks), each have a pure rules module in `src/shared/puzzles/widgets/` that the client and the server both run.

### Preparation, offline

`npm run puzzles:prepare` runs outside any session, on the offline key, through ADR-0100's gateway (REQ-5748). For each data file whose Russian text is missing or whose data file changed, it runs these steps in order, and a puzzle that fails a step stops there. A text the parent edited in the Parent Room skips step 2, runs steps 3 to 5 on the parent's words as they are, and returns to the queue marked `as_edited`, so no run redrafts over a parent's edit:

1. The reference solution must pass the puzzle's check before any model is called (REQ-5742). A failure here is `puzzle_reference_failed`.
2. `PUZZLE_MODEL`, a new offline role on the offline key and the content tier with the planner's model as its default, receives a `ContentRequest` with the idea note from the data file, the placeholders and their roles, the rules in words, the Diary's voice from CAN-0090 filtered to the current checkpoint, and the length limits. It returns 3 variants of the statement, the three rungs, the solution and the title as JSON. The addendum names `PLANNER_MODEL`, but ADR-0100 refuses a play role on the offline key, and RES-4000 conclusions 9 and 10 give every new model job a role of its own, with the planner's model as the default for this one, as ADR-0220 does for `FRAMING_MODEL`.
3. Code checks each variant: every placeholder appears where its role needs it, and no digit or numeral from ADR-0120's lexicon appears outside a placeholder, so every number comes from the data (REQ-5738). Rung 1 holds no placeholder, because the addendum's first rung points at the idea, such as parity, and not at the numbers. The text passes ADR-0160's `textGate` in every word form (REQ-5762), and the title passes the name guard below. The statement holds at most 90 words, each rung at most 30 and the solution at most 150; I chose these limits so a statement and its figure fit one Diary page on the iPad at the default text size.
4. `JUDGE_MODEL` asks the safety question of the unfilled text, with `SAFETY_MODEL` as its fallback, as ADR-0130's step 4 does for frames.
5. Code fills the statement with the data's numbers, and `CHECK_MODEL` solves it blind. The request carries the filled statement and the answer format's notation (for jugs, one pour per line as «из A в B»), and no answer and no candidate answers (REQ-5744). Code parses the free-form reply in that notation, and the variant passes when the puzzle's check accepts the parsed answer (REQ-5746). A puzzle gets at most 2 solves in a run across all its variants, taken on the variants in order, and a variant passes on its first accepted solve. I chose one accepted solve over two, as a preference nobody has measured: an ambiguous statement the model guesses right once can pass, and the parent's review and the fourth reversal condition below are what catch it.

The first variant that passes every step enters the parent's review queue. The run's budget is its own bucket on the offline key, $20 a run, and the owner sets the key's limit to it before the run (REQ-5750, REQ-2730). I chose $20 from about $0.26 a puzzle at OpenRouter's listed prices on 2026-09-28: one drafting call to the planner's model, `z-ai/glm-5.3`, of about 4,000 tokens in and 4,500 out costs under $0.01, and up to 2 blind solves by `CHECK_MODEL`, `openai/gpt-5.5`, of about 1,000 in and 4,000 out cost about $0.25. That makes about $13 for 50 puzzles, and the rest is slack for redrafts. A run that reaches its budget stops, keeps what passed and reports the rest as `budget_puzzle_run_spent`. The run adds candidates only while the queue holds fewer than 60, which is 1.2 times the addendum's 50, so the queue never holds more than the parent needs.

### Approval

The Parent Room's puzzle review screen shows one puzzle at a time: the filled statement with its figure, the three rungs, the full solution, the check's result on the reference solution, the source of the idea, the theme and the difficulty (REQ-5756). It offers «принять / отклонить / поправить» (accept / reject / edit), as ADR-0130's frame screen does. An edit reruns step 3's code checks at once, and the edited puzzle then leaves the queue until step 5 passes at the next run and brings it back, so no edit can be approved before a blind solve (REQ-5746). Acceptance writes `puzzle_approved` with the puzzle's id, the locale, the hash, `as_written` or `as_edited`, the source, which is `parent_room` or `sandbox` (REQ-5754), the moment the run queued it and how long the screen showed it. Rejection writes `puzzle_rejected` with the same fields except `as_written` or `as_edited`, so the log can show how fast the parent reads. The hash is SHA-256 over the canonical JSON of the data file and the locale's text file together.

The game serves a puzzle only when the log holds a `puzzle_approved` event for its current hash and the sandbox hasn't turned it off (REQ-5752). A puzzle edited after approval therefore disappears from play until the parent approves it again, and a puzzle added to `content/` by hand never reaches her. The sandbox's disabling and restoring belong to ADR-0340, and this decision only reads them. Every rung the player sees is fixed text from the approved bank, with no model call during play (REQ-5758, REQ-5760).

### Offers

A new puzzle comes only as a new page in the Diary at the day's finale. The Director of puzzles, a module in `src/engine/puzzles/` that imports nothing from ADR-0070's Director, offers one when all of these hold:

- the adventure that just reached its finale is at least her second, not counting Session 0 (REQ-5720);
- no puzzle was offered this game day (REQ-5702) and no new puzzle is offered before the finale (REQ-5718);
- fewer than 3 puzzles are open (REQ-5704), where an open puzzle is offered, unsolved and not in the box;
- the schedule of new systems that ADR-0210 and ADR-0330 own has unlocked the branch.

The theme is one that has an approved puzzle left to offer (REQ-5795) and that has seen at least 4 other themes offered since it last came (REQ-5794). When no theme meets that rule, the Director takes the one offered longest ago. Within a theme it offers the lowest-difficulty puzzle not yet offered, with ties broken by the day's seed, so each theme climbs from 1 to 4. A puzzle whose running clue isn't eligible yet, by the rule below, is passed over for the next puzzle of its theme, and a theme with no eligible puzzle is passed over for the next theme. When the conditions hold and no puzzle in any theme qualifies, no page appears and the state is `puzzle_bank_exhausted`.

The puzzle of the week is a puzzle with `week: true`. It comes as that day's one new puzzle and counts as one of the three open ones (REQ-5790). The Director offers it in place of an ordinary puzzle when no puzzle of the week was offered in the last 7 game days and none is open, so two big puzzles never hold two of her three places at once. I chose game days over a calendar week, because a calendar week would put a weekday on the game's logic and ADR-0210 keeps the day's boundary unseen.

A puzzle with a running clue is offered only when the campaign has reached the clue's earliest checkpoint and no puzzle with a clue was offered in the last 5 adventure days, which are game days on which she played an adventure, as ADR-0090 counts them (REQ-5716). I chose 5 as my reading of CAN-0080's "once every several sessions". The page's signature comes from the data: «И.» when the clue is the signature, «С.» otherwise (REQ-5714). A group 1 check fails a puzzle text that writes either signature by hand. The name guard fails a title or the branch name that holds any form of «узелок» or «узел», «Ирма» or «Муфта», or a word for a cat, from a list in `content/puzzles/name-guard.ru.json` (REQ-5712).

The new page shows one quiet mark on the Diary's icon until she opens the Diary. Nothing else announces it, because the branch is play she enters only by her own choice (REQ-5700), and no step of the adventure, a quest or the story waits on a puzzle.

### Play

She reaches the branch from the Diary at any moment the task window is closed, as ADR-0210 sets for taskless screens. A puzzle takes no slot in the adventure and no place in ADR-0070's flow limit, its three-day domain window or ADR-0090's plan (REQ-5706), because the Director and the planner read no puzzle event. At a rest stop she can open an open puzzle and work on it (REQ-5722). Opening it ends the campfire scene with a `rest_stop_ended` event whose reason is `puzzle_opened` (REQ-5724), and closing it returns her to the adventure's next step after the rest stop (REQ-5725). The rest stop's 10-minute wait starts when the campfire scene ends, as ADR-0090 sets.

The server owns the flow, because ADR-0030 makes the server decide everything:

- The client never receives the reference solution, the full solution or a rung she hasn't taken before the puzzle is solved.
- A widget applies each move at once through its shared rules module, so the screen answers within ADR-0150's 100 ms. The move then goes through ADR-0030's queue as `puzzle_move`, idempotent by `clientSeq`. When the server's replay refuses a move, it returns its own state, and the widget redraws it.
- She can answer as often as she likes (REQ-5784). Each answer is a `puzzle_attempt`. A not-accepted answer brings a dry line from a content pool that passes the forbidden list, and the puzzle stays open. An accepted answer solves it.
- The hint ladder has the three approved rungs. It opens for one guiding thread, as ADR-0220 prices a ladder, and rungs 2 and 3 then cost nothing. The spend is a `thread_spent` with the reason `hint_ladder` and the puzzle's id, and each rung shown is a `puzzle_hint` whose `ladderOpenedBy` is `thread` or `free_step`, as REQ-5152 and ADR-0220 name them. The backpack pocket of ADR-0080 doesn't serve puzzles, because it belongs to rooms and floors.
- After her second not-accepted answer on a puzzle, the familiar offers one free thread for that puzzle's ladder, once for each puzzle (REQ-5786). Taking it opens the ladder with no spend, and the rung is a `free_step`. When the ladder is already open, the offer shows the next rung, which costs nothing anyway. The thread never enters her stock, so it can't reach the adventure.
- «Отложить в коробку» (Put in the box) moves a puzzle to «Коробка головоломок» (the box of puzzles), where it doesn't count as open, and she can take it back out at any time when fewer than 3 are open (REQ-5704).

ADR-0080's attempt flow, its one parallel second attempt and its rule of no third attempt bind adventure tasks, and no rule of that flow runs on a puzzle (REQ-5788).

A solved puzzle gives the Diary page with the full solution in the Keeper's hand and a mark in the collection for its theme (REQ-5772). It also gives 2 star yarn, or 3 for a puzzle of the week (REQ-5774), and for every fifth puzzle solved in one theme, a new cosmetic title from `content/economy.json` (REQ-5776). The reward is the same after a hint (REQ-5778), and a puzzle gives nothing else (REQ-5780). An unsolved or boxed puzzle takes and withholds nothing (REQ-5708): no rule of ADR-0140 reads a puzzle event other than `puzzle_solved`, and that one only grants. The solution page is the one lesson the game offers that teaches an idea outside the skill graph, such as parity or the pigeonhole principle (REQ-5736), and the parent judges it with the puzzle.

### Time, the eye count and the soft stop

Puzzle time is active time, wherever the puzzle is open (REQ-5728). The eye count excludes only eye exercises and the rest stop's campfire scene (REQ-5726), so the minutes of a puzzle opened from a rest stop count towards the next eye exercise. On a puzzle, every moment outside a widget move is a boundary for the eye exercise, because the exercise lasts 35 seconds and returns her to the same board, while the soft stop below can end her play and so waits for a reply that has saved her last step.

Before the finale, a puzzle opened at a rest stop is inside an unfinished adventure, and ADR-0090's soft stop covers it: it plays at the puzzle's boundary defined below and makes ADR-0090's offer to save the adventure beside «Ещё один ряд», and accepting closes the puzzle and saves the adventure. After the finale, when the day's active time reaches the soft-stop point while she is on a puzzle, the soft stop plays at the next boundary (REQ-5730). A boundary on a puzzle is the moment after the server's reply to an answer or a hint, never in the middle of a move, as REQ-5730 chose. The soft stop offers «Отложить головоломку» (Put the puzzle away) beside «Ещё один ряд» (One more row) (REQ-5731). «Ещё один ряд» moves the soft-stop point 20 minutes on, as ADR-0090 sets. Putting the puzzle away closes it without moving it to the box, writes `save_accepted` with the reason `puzzle`, and keeps the puzzles closed until the next game day, as `save_accepted` keeps the adventure closed. Her other taskless screens stay open, so the game still has no daily maximum. When the parent uses «Закончить на сегодня» (Finish for today), the puzzles close with the adventure until the next game day, because a parent who ends the day expects it to stay ended (ADR-0090).

### Events and the knowledge model

This decision owns these event types, whose payloads carry the puzzle's id and hash:

| Event | Payload beyond the id and hash |
| --- | --- |
| `puzzle_offered` | theme, difficulty, `week`, clue or none |
| `puzzle_opened` | where from: `diary` or `rest_stop` |
| `puzzle_move` | the widget, the move, `refused` when the server's replay refused it, `capped` on the first move past the ceiling |
| `puzzle_attempt` | the answer, the result `accepted`, `not_accepted` or `not_judged`, the attempt's number on the puzzle |
| `puzzle_hint` | the rung, `ladderOpenedBy`: `thread` or `free_step` |
| `puzzle_solved` | attempts, the highest rung taken, game days since the offer |
| `puzzle_shelved` | none |
| `puzzle_unshelved` | none |
| `puzzle_closed` | where to: `diary` or `adventure` |
| `puzzle_approved` | locale, `as_written` or `as_edited`, source, the moment it was queued, the seconds the review screen showed it |
| `puzzle_rejected` | locale, source, the moment it was queued, the seconds the review screen showed it |

`puzzle_unshelved`, `puzzle_closed` and `puzzle_rejected` are mine beyond the addendum's list, the last so the review's pace can be measured, because REQ-5704 lets her take a puzzle out of the box and REQ-5725 returns her to the adventure when she closes it. `puzzle_approved` is the approval REQ-5074 asks the log to hold. No puzzle action is ever written as `attempt_submitted` (REQ-5734). ADR-0060's model reads only `attempt_submitted`, and a group 1 check fails the build when the knowledge projection's registered input types include any `puzzle_*` type (REQ-5732).

### The parent's report

Report v1 shows «Нестандартное мышление» (Non-standard thinking) on the VWO readiness screen, beside the ceiling above 1S, labelled «запас, а не оценка» (a reserve, not an assessment) (REQ-5796, REQ-6064). It shows the puzzles solved in each theme, the mean of the highest rung taken on solved puzzles, the puzzles she opened on a later game day than their offer, the puzzles solved with no rung on the second or third game day after the offer, and the counts of puzzles offered, opened and shelved (REQ-5798). The section adds no screen, so REQ-6064's screens hold. The last three counts are the data the owner reads when growing the branch by her interest.

### What works once accepted

Once this is accepted and built on ADR-0210, ADR-0090, ADR-0100, ADR-0130's review pattern and ADR-0180's Parent Room, the parent can prepare, review and approve puzzles. She meets one new puzzle after a finale, works on it in the Diary or at a rest stop, takes rungs, boxes it, solves it and earns yarn and titles, and the parent reads the section. With no approved puzzle, or with the branch not yet unlocked, the Diary shows no puzzle page and the rest of the game plays as before, so removing the increment leaves the MVP working. What doesn't work yet: puzzles in English and Dutch, which need their own text files and approvals; difficulty 5; any rule that grows the branch from the section's counts; and a count of running clues across puzzles and the Master's scenes together, since ADR-0110 logs no clue event.

## Why

RES-4070 records the owner's addendum 1 of 2026-09-28, which puts the branch in the MVP with fixed limits, and its conclusions and decisions of 2026-09-28 set the rules this decision builds. The owner rules out generating puzzles during play, because a faulty statement is especially destructive (RES-4070), so the bank is curated and prepared offline.

The numbers sit in data and the words in the model's draft, because RES-1200 keeps a model from computing a task's numbers, and in a pouring or a weighing puzzle the numbers are the idea: jugs of 3 and 5 litres measure 4, while jugs of 2 and 4 measure no odd amount (RES-4070 conclusion 10). The placeholder rule and the numeral check are ADR-0130's frame checks applied to a new text, so one mechanism guards both.

The check accepts any answer that meets the rules, because cuttings, arrangements and sequences of moves often have several right answers, and ADR-0130's comparison with one engine answer would fail a right one (RES-4070 conclusions 11 and 12). The blind solve shows the statement only, because an answer or a list of candidates would let the solver copy and prove nothing (ADR-0130, REQ-3634).

Approval by hash in the log follows ADR-0130's `frame_accepted` and `science_approved`, because the log is the only truth (ADR-0020) and a flag in a file can be set by anyone who edits the file. The review screen shows everything to judge on one screen, because RES-4070 finds the addendum budgets about 1.8 minutes a puzzle for five texts, and ADR-0130 found that a long queue tends to end approved unread.

Puzzle events are types of their own, because RES-1500 keeps Diary play out of the map of what she knows and ADR-0110 already does it for ciphers by event type. A puzzle is maths, so only a type the model's projection doesn't read keeps it out for sure; a flag on `attempt_submitted` would depend on every reader remembering the flag.

The soft stop and the eye count follow RES-4070's decisions of 2026-09-28. After the finale ADR-0090 has no soft stop, because the adventure is finished, so without this rule a puzzle session after the finale would have no bound but the eye exercise. A puzzle opened at a rest stop is close work on a grid or a table, so its minutes count for the eyes, and ending the campfire scene when she opens it is what lets the exclusion stay on the scene alone.

The yarn amounts are the nearest existing rewards, the optional pattern row and the Guardian problem (RES-2100), which the owner approved with RES-4070. Star yarn buys forge tricks that change a spell's look and never its power, and ADR-0140 fails the build on a trick field any rule reads, so puzzle yarn gives no advantage in the adventure.

The strongest objection is that the whole branch rests on a guard this record already knows is weak. Three requirements, the clue pace (REQ-5716), the new text (REQ-5770) and the solution page as the one allowed lesson (REQ-5736), are verified only by the parent's judgement at approval, and the addendum asks for 50 puzzles of five texts each before her first day with the branch. If the parent approves a batch unread, a copied solution, a clue too early or a page that teaches badly reaches her with an approval event that certifies a click. The automatic checks catch a wrong number, a forbidden word, an unsolvable puzzle and a banned name, and nothing else. A second objection is the build: five widgets with checks and notations, a pipeline, a review screen and a report section, finished before any evidence that she likes puzzles, which RES-3000 had made the signal to build them. I accept both, because the owner's addendum puts all five widgets and all themes in the MVP, and the reversal conditions below watch for an unread queue and for no interest.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep the Diary's riddles deferred until she shows she likes puzzles, as RES-3000 set | No bank, no widgets, no review hours and no new events; every build hour goes to the measured core | The owner's addendum puts the branch in the MVP (REQ-5076, REQ-5700), and a game with no puzzle can't show whether she likes puzzles |
| Puzzles as adventure tasks, each a template run through ADR-0080's flow | Reuses the flow, the hint ledger, the packet tests and the task window; nothing new to build for play | Its `attempt_submitted` events would reach the knowledge model (REQ-5732), it gives one second attempt where a puzzle needs unlimited answers (REQ-5784), and a task takes a slot in the plan (REQ-5706) |
| An approved bank of data only, with the model retelling the words each time she opens a puzzle | Fresh wording each time and no text to review | A model call during play would write a rung before her answer (REQ-5758), text nobody approved would reach her (REQ-5752, REQ-5760), and it would spend from the play key |
| Every text written by hand, by the owner or the parent, with no model pipeline | No model cost, no blind solve, and the Diary's voice from a person | At my estimate of 20 minutes to write each puzzle's five texts, 50 puzzles cost about 17 hours of a person's time before her first puzzle, against about 1.5 hours of review; the addendum sets the offline pipeline |
| Approval as a flag in the puzzle's JSON file, committed by the owner | No event type and no hash; the file alone says what is served | Anyone who edits the file approves it, and the log could no longer show which content the parent approved, which REQ-5754 requires |

## What it costs

The building agent pays for five widgets, each with a pure rules module, a text notation for the blind solve, a parser and a check; the other formats need a check each. It also pays for the preparation run, the review screen, the Director of puzzles, the report section and the tests below. This is the largest single feature of the addendum's MVP after the hint ladder, and it's built before any evidence she wants it.

The parent pays about 1.5 hours to approve the first 50 puzzles, at the addendum's estimate of about 1.8 minutes each, and a few minutes for each later puzzle. The parent is never needed in real time. Two weeks without the parent lose nothing: approved puzzles keep coming, unapproved ones wait in a queue capped at 60, and when the approved ones run out no page appears and nothing else changes. The queue is a pull list in the Parent Room, with no notification.

The owner pays up to $20 of the offline key for each preparation run, set as the key's limit before the run, and never a cent from the play key's $60 a month.

The player pays nothing she doesn't choose. The interruption budget for the player is one quiet mark on the Diary's icon on a day a puzzle is offered, at most one a day, and one offer of a free thread for each puzzle; the soft stop keeps ADR-0090's budget. The interruption budget for the parent is zero: no alert, and one ceiling line in the report described below.

Accumulating data has these ceilings. Open puzzles stop at 3, and new offers stop while 3 are open. The box grows by at most one puzzle a day, and when it passes 20, about three weeks of offers, the report's section shows one line saying so, once, because a box that size means offers she isn't opening; it needs no drain, because a boxed puzzle costs nothing and can come back. Widget moves are logged one by one up to 300 for each puzzle in a game day, which is about 15 minutes of moves at one every 3 seconds. Past that, the server stops replaying single moves and trusts the client's board: it writes the widget's whole state in one `puzzle_move` with `capped: true` at most once a minute and with every answer and close, so a reconnect loses at most a minute of moves, and her answer still carries the whole sequence. The review queue stops at 60 candidates.

The security boundary protects two things, most likely damage first:

1. The puzzle she sees, against a faulty or unapproved text reaching her. The reference-solution check, the blind solve, the numeral and forbidden-word checks and the hash in the log defend it, and a hand-edited file isn't served.
2. The solution, against the player reading packets in the desktop browser's developer tools. The server sends no reference solution, full solution or rung before she earns it. This matters less than for tasks, because a puzzle measures nothing.

Each failure state has its next step and one audience:

| State | Next step | Audience |
| --- | --- | --- |
| `puzzle_reference_failed`: the stored reference solution fails the check | the puzzle stops before any model call, and the run's report names it | the owner, in the run's report |
| `puzzle_draft_rejected`: no variant passes the code checks or the safety question | the run's report names the failing check; the next run drafts again | the owner, in the run's report |
| `puzzle_blind_solve_failed`: no variant's parsed answer passes the check in 2 solves | the run's report names the puzzle; its statement is rewritten by hand or its data fixed | the owner, in the run's report |
| `budget_puzzle_run_spent`: the run reaches its budget | the run stops and keeps what passed | the owner, in the run's report |
| `puzzle_unapproved_hash`: the file's hash differs from every approved hash | the puzzle isn't served, and it returns to the review queue once the next preparation run passes its blind solve | the parent, in the queue |
| `puzzle_bank_exhausted`: no theme has an approved puzzle left that the offer rules allow | no page appears; the section shows the count of approved puzzles left | the parent, in the report's section |
| `puzzle_move_refused`: the server's replay refuses a move the client applied | the server returns its state and the widget redraws it | the developer, through the count of `refused` moves in the verify report |
| `puzzle_check_error`: a check throws on an answer | the answer is logged `not_judged`, the familiar says a neutral line, the puzzle stays open, and the answer counts neither towards REQ-5786's second miss nor in `puzzle_solved`'s attempts | the owner, in `./tower status` |

Her offline state is ADR-0030's: the controls stay inactive and the waiting scene shows. A resent move or answer returns the same result, because every route is idempotent by `clientSeq`, and ADR-0030's single active device covers the puzzle routes.

## What would reverse it

- If, over the first 4 weeks of stage 0.3 play, she opens fewer than 1 in 4 offered puzzles, the branch's MVP size is reopened: no widget is added or extended and difficulty 5 isn't built, as RES-3000's signal would have said.
- If the parent approves puzzles at a median of under 30 seconds each, or the median time from a candidate entering the queue to the parent's decision passes 30 days, the queue is being approved unread or not read, and the owner chooses between a smaller bank and a second reviewer.
- If more than 30 % of the blind solves in a run, on puzzles whose reference solution passes, are not accepted, the notation or the solver is at fault rather than the statements, and the blind-solve step is reopened.
- If a person finds an approved puzzle unsolvable, ambiguous or with a wrong solution after it reached her, the pipeline let it through, and the step that should have caught it is reopened before the next run.
- If, on 3 game days, she spends more than 20 minutes on puzzles after the soft-stop point without reaching a boundary, REQ-5730's boundary misses a player who thinks without answering, and the boundary on a puzzle is reopened.
- If, while she keeps playing adventures, 3 puzzles sit open with no `puzzle_opened` for 14 game days, offers have stopped without her choosing it, and the rule that no new puzzle comes while 3 are open is reopened; the condition above can't see this, because its ratio freezes when offers stop.
- If the balance simulation shows the puzzle ladder's spend takes the typical adventure day's net thread supply below 8, the bottom of the 8 to 10 threads a day that REQ-0512 and ADR-0080 set for adventure tasks, the free thread or the ladder's price for puzzles is reopened.

The premortem, written as though it had happened: three months in, the parent found that she had stopped opening the Diary. The first puzzles had come in logic and grids at difficulty 1 and she had solved them with pleasure, but the rotation then brought pourings and weighings at difficulty 3. Their widgets were fiddly on the iPad, and the blind solve had passed puzzles a model could solve in text that took her twenty minutes of dragging. Three sat open, so no new puzzle came, and the section showed «offered» stuck while «opened» fell to zero; nobody read it, because it reported no failure. A second failure sat in the queue: the parent approved the last 30 puzzles in one evening, and one of them retold a figure from a source almost line for line. The checks below exist for the parts a program can see, and the reversal conditions for the rest.

## Consequences

- ADR-0020's event table gains the eleven event types above, owned by this decision.
- ADR-0030's API gains puzzle routes to open, move, answer, take a rung, take the free thread, box, unbox and close, each idempotent by `clientSeq`.
- ADR-0100 gains the role `PUZZLE_MODEL`, its `ContentRequest` gains the puzzle draft and the puzzle blind solve, and its budget table gains the puzzle run.
- ADR-0140's `content/economy.json` gains the puzzle yarn amounts and the titles for each theme's series, and its rewards read `puzzle_solved`.
- ADR-0150 draws the five widgets, the Diary's puzzle pages, the box and the Parent Room's review screen, with every string from ADR-0160's files.
- ADR-0180's VWO readiness screen gains the section.
- ADR-0190's group 1 gains the static checks below, group 2 the check and widget tests, and group 3's simulation the puzzle spend and yield (REQ-5782). Its verification fails on any puzzle that breaks REQ-5742, REQ-5762, REQ-5764, REQ-5766 or REQ-5768, and never on a count of puzzles in a theme (REQ-5792), unlike the science bank's 40 a topic.
- CAN-0090 needs a section on puzzle pages that says they are signed «С.» and carry a running clue only at CAN-0080's pace; the owner writes it, because the canon is the owner's.
- The widgets give no information by sound, as the silent-play requirement REQ-6124 sets for every puzzle.

## Amends

- ADR-0020: the event type table gains `puzzle_offered`, `puzzle_opened`, `puzzle_move`, `puzzle_attempt`, `puzzle_hint`, `puzzle_solved`, `puzzle_shelved`, `puzzle_unshelved`, `puzzle_closed`, `puzzle_approved` and `puzzle_rejected`, each owned by ADR-0280.
- ADR-0020: `thread_spent`, as ADR-0210 words it, "a thread was spent on opening a task's hint ladder or on an explanation", becomes "a thread was spent on opening a task's or a Diary puzzle's hint ladder or on an explanation", carrying the puzzle's id where the spend is for a puzzle.
- ADR-0090: `rest_stop_ended` gains a reason, `tap`, `timeout` or `puzzle_opened`, and `save_accepted` gains a reason, `adventure` or `puzzle`.
- ADR-0080: "Every task the adventure shows, scored or not, runs one attempt flow" and its rules of one second attempt, no third attempt and rungs from the template's graph become rules for adventure tasks only; a Diary puzzle runs ADR-0280's flow, with rungs from the approved puzzle bank.
- ADR-0090: "When the day's active time reaches the soft-stop point on an unfinished adventure, the soft stop plays at the next boundary" becomes "on an unfinished adventure, or after the finale while she is on a puzzle, where it offers to put the puzzle away beside «Ещё один ряд»".
- ADR-0090: the eye count's exclusions, "eye exercises and rest stops (REQ-0310)", become "eye exercises and the rest stop's campfire scene, which ends when she opens a puzzle".
- ADR-0090: "For the rest of that game day the adventure stays closed" after «Закончить на сегодня» becomes "the adventure and the puzzles stay closed".
- ADR-0100: the role list gains `PUZZLE_MODEL`, an offline role on the offline key and the content tier with the planner's model as default, called only by `npm run puzzles:prepare`, and `CHECK_MODEL` gains the puzzle blind solve, both under `ContentRequest`; the budget table gains the row "Puzzle run, $20 a run, puzzle preparation on the offline key; the run stops and reports what passed".
- ADR-0110: "a cipher answer is a `diary_cipher` event, which the input filter of the knowledge model (ADR-0060) excludes" becomes "a cipher answer is a `diary_cipher` event and every puzzle action a `puzzle_*` event of ADR-0280, which the input filter of the knowledge model (ADR-0060) excludes".
- ADR-0130: "Model text reaches a task only as a placeholder frame" becomes "Model text reaches a task only as a placeholder frame, and a Diary puzzle only as approved bank text under ADR-0280".
- ADR-0140: the rewards table gains the rows "Puzzle solved: 2 yarn", "Puzzle of the week solved: 3 yarn" and "Every fifth puzzle solved in one theme: one cosmetic title".
- ADR-0180: the VWO readiness screen's contents gain the section «Нестандартное мышление», labelled as a reserve, with the contents of REQ-5798.
- ADR-0190: "The game offers no lesson that teaches a new topic: every task comes from a template tied to a node" becomes "The game offers no lesson that teaches a new topic, apart from a puzzle's solution page in the Diary: every task comes from a template tied to a node".
- ADR-0190: the Baselines table gains "Puzzle run, $20 a run on the offline key, ADR-0280, chosen, about $0.26 a puzzle for 50 puzzles with slack for redrafts".

## How I will know it was realised

1. A group 2 test runs every approved puzzle's reference solution through its check and passes, and a mutation test that changes one parameter in each pouring and weighing puzzle finds at least one where the reference then fails.
2. A property test for each widget generates random legal move sequences and asserts that the client's and the server's rules modules reach the same state, and that every sequence the check accepts ends in the goal state.
3. A test gives each cutting and arrangement puzzle a second right answer written by hand, different from the reference, and the check accepts it.
4. A group 1 check fails a puzzle whose text holds a digit or a numeral outside a placeholder, a rung 1 with a placeholder, a forbidden form, a banned name, a hand-written signature, a rebus with a letter, a missing source of the idea, or a placeholder the data file doesn't define. It never fails on a theme's count.
5. A replayed run of `puzzles:prepare` asserts from the recorded requests that every call went on the offline key under `PUZZLE_MODEL`, `CHECK_MODEL`, `JUDGE_MODEL` or `SAFETY_MODEL`, that no blind-solve request holds the answer or a candidate, and that the run stops at its budget.
6. A test edits an approved puzzle, and the server doesn't serve it until a new `puzzle_approved` holds its new hash; a puzzle added to `content/` with no approval is never served.
7. A 60-day simulation with puzzle play asserts at most one offer a game day, none before the finale or before the second adventure, never more than 3 open, the rotation rule, the week puzzle within both limits, clue puzzles at least 5 adventure days apart, and no change to any slot, plan or estimate compared with the same seeds without puzzles.
8. A static check fails the build when the knowledge projection or ADR-0070's Director registers any `puzzle_*` input type.
9. Time-projection tests assert that puzzle time counts in the day's active time and in the eye count, that the campfire scene ends when a puzzle opens, that before the finale the soft stop on a puzzle opened at a rest stop plays at the first reply after the soft-stop point with the offer to save the adventure, and that after the finale it plays there with «Отложить головоломку» and «Ещё один ряд». A move test asserts that past 300 moves a reconnect restores the board to within a minute of moves.
10. A packet test asserts that no reply before `puzzle_solved` carries the reference solution, the full solution or an untaken rung.
11. A rewards test asserts 2 yarn for a solved puzzle and 3 for a puzzle of the week, the same after a rung, a title at the 5th and 10th solve in one theme, and no grant or loss on boxing or leaving a puzzle.
12. A report test on a fixture log shows the section on the VWO readiness screen with each count of REQ-5798, and the screen count stays as REQ-6064 sets.

## What this does not settle

- The price and flow of the hint ladder for adventure tasks, and the twin after rung 2 or 3: ADR-0220.
- The game day, the taskless screens, the MVP scope and the schedule of new systems: ADR-0210 and ADR-0330.
- The sandbox, where the parent tries puzzles and widgets before approving them, and how it turns a puzzle off: ADR-0340.
- The exact Russian lines of the familiar after a not-accepted answer, the soft stop's offer and the titles: content, checked by ADR-0160's gate.
- The owner's rule for growing the branch by her interest, and difficulty 5: after the MVP, reading the section's counts.
- Puzzles in English and Dutch, which need their own text files, approvals and a check that each locale's text fits the same data.
- A shared count of running clues across the Master's scenes and the puzzles; until ADR-0110 logs clues, the parent judges the pace at approval.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
