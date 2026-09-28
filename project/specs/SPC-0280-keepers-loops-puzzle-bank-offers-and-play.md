---
id: SPC-0280
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-5700, REQ-5702, REQ-5704, REQ-5706, REQ-5708, REQ-5710, REQ-5712, REQ-5714, REQ-5716, REQ-5718, REQ-5720, REQ-5722, REQ-5724, REQ-5725, REQ-5726, REQ-5728, REQ-5730, REQ-5731, REQ-5732, REQ-5734, REQ-5736, REQ-5738, REQ-5740, REQ-5742, REQ-5744, REQ-5746, REQ-5748, REQ-5750, REQ-5752, REQ-5754, REQ-5756, REQ-5758, REQ-5760, REQ-5762, REQ-5764, REQ-5766, REQ-5768, REQ-5770, REQ-5772, REQ-5774, REQ-5776, REQ-5778, REQ-5780, REQ-5782, REQ-5784, REQ-5786, REQ-5788, REQ-5790, REQ-5792, REQ-5794, REQ-5795, REQ-5796, REQ-5798]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Keeper's puzzles «Петельки Смотрителя»: the approved bank, the offers, the puzzle's flow and its rewards

## Scope

This document covers the Diary's puzzle branch «Петельки Смотрителя» (the Keeper's loops): the puzzle bank in `content/puzzles/`, its offline preparation run, the parent's approval by hash, the Director of puzzles that offers a new puzzle, the puzzle's own flow on the server with its hint ladder, the box and the free thread, the rewards of a solved puzzle, how puzzle time counts for the eyes and the soft stop, the puzzle event types, and the section «Нестандартное мышление» (non-standard thinking) in the parent's report. It is written at the level of files, commands, routes, events and states.

It leaves out what other parts define. The game day, the taskless screens and the schedule of new systems belong to ADR-0210 and ADR-0330, and the adventure's attempt flow, its second attempt and the task hint ladder to ADR-0080 and ADR-0220. The model gateway, its keys and roles belong to ADR-0100, the forbidden list and `textGate` to ADR-0160, the event log to ADR-0020 (SPC-0020 states the log), the forge, the shop and the economy's other rewards to ADR-0140, how the widgets and pages are drawn to ADR-0150, and the Parent Room's other screens to ADR-0180 (SPC-0180 states the report's screens). The sandbox, where the parent tries a puzzle and turns one off, belongs to ADR-0340.

## Boundary

### Files and commands

| Surface | What it is |
| --- | --- |
| `content/puzzles/<id>.json` | The puzzle's language-free data: kind, theme (one of 11), difficulty 1 to 4, `week` flag, parameters, rules, reference solution, widget and starting state where it has one, an optional running clue with its earliest checkpoint, and the source of its idea as author, title and edition. |
| `content/puzzles/<id>.ru.json` | The Russian text: statement, three hint rungs, full solution and title, with a placeholder such as `{a}` for every number, `dataHash`, the SHA-256 of the data file the text was drafted or edited against, and `editedByParent`, true when the review screen saved the text. |
| `content/puzzles/queue.json` | The run's record: each queued candidate with its id, its hash and the moment the run queued it, and each puzzle stopped at `puzzle_reference_failed` or `puzzle_blind_solve_failed` with its id, its hash and the state. |
| `content/puzzles/name-guard.ru.json` | The words no branch name or puzzle title may hold. |
| `src/shared/puzzles/checks/` | One check function for each kind: puzzle data and an answer in, `accepted` or `not accepted` out. |
| `src/shared/puzzles/widgets/` | One pure rules module for each of the five widgets, run by the client and the server. |
| `src/engine/puzzles/` | The Director of puzzles and the puzzle flow. |
| `npm run puzzles:prepare` | The offline preparation run. |

The five answer formats are a number, a set of numbers, an arrangement, a set of grid cells and a sequence of moves. The five widgets are «Весы Базара» (the Bazaar's scales), «Кувшины» (Jugs), «Таблица рыцарей и лжецов» (the table of knights and liars), «Клетчатое поле» (the grid) and «Спички» (Matchsticks).

### Routes

The puzzle routes follow SPC-0030's contract: each needs the paired device's token and the lease, and each state-changing request carries `clientSeq` and is idempotent by it. The paths are this document's choice, because ADR-0280 names the actions and not the paths.

| Route | What it does |
| --- | --- |
| `POST /api/puzzle/:puzzleId/open` | `{ from: "diary" \| "rest_stop", clientSeq }`. Opens an open puzzle and returns its page: the filled statement, the figure's data, the widget's state and the rungs already taken. For a solved puzzle it returns the solution page. It refuses a puzzle in the box with `409 in_box` and a puzzle never offered with `404 not_offered`. |
| `POST /api/puzzle/:puzzleId/move` | A widget move. Replies with the server's widget state. |
| `POST /api/puzzle/:puzzleId/answer` | An answer in the puzzle's format. Replies `accepted` or `not_accepted`, a line from the familiar, and on `accepted` the solution page and the grants. |
| `POST /api/puzzle/:puzzleId/hint` | Takes the next rung. Replies with its text and the thread stock. |
| `POST /api/puzzle/:puzzleId/free-thread` | Takes the familiar's free thread and replies with the next rung. |
| `POST /api/puzzle/:puzzleId/shelve` | «Отложить в коробку» (Put in the box). |
| `POST /api/puzzle/:puzzleId/unshelve` | Takes the puzzle out of the box. |
| `POST /api/puzzle/:puzzleId/close` | Leaves the puzzle, to the Diary or back to the adventure. |

The Parent Room's review screen accepts, rejects or edits the puzzle it shows, through ADR-0180's routes and PIN.

### Events this part logs

Every puzzle event carries the puzzle's id and hash.

| Event | Payload beyond the id and hash |
| --- | --- |
| `puzzle_offered` | theme, difficulty, `week`, the clue or none |
| `puzzle_opened` | `from`: `diary` or `rest_stop` |
| `puzzle_move` | the widget, the move, `refused` when the server's replay refused it, `capped` on moves past the ceiling |
| `puzzle_attempt` | the answer, the result `accepted`, `not_accepted` or `not_judged`, the attempt's number on the puzzle |
| `puzzle_hint` | the rung, `ladderOpenedBy`: `thread` or `free_step` |
| `puzzle_solved` | attempts, the highest rung taken, game days since the offer |
| `puzzle_shelved` | none |
| `puzzle_unshelved` | none |
| `puzzle_closed` | `to`: `diary` or `adventure` |
| `puzzle_approved` | locale, `as_written` or `as_edited`, source `parent_room` or `sandbox`, the moment the run queued it, the seconds the review screen showed it |
| `puzzle_rejected` | locale, source, the moment the run queued it, the seconds the review screen showed it |

This part also logs, on its routes, types other parts own: `thread_spent` with the reason `hint_ladder` and the puzzle's id, and `rest_stop_ended` with the reason `puzzle_opened`. The soft stop's put-away on a puzzle logs `save_accepted` with the reason `puzzle` through SPC-0090's `POST /api/session/:id/save`. A puzzle's rung is logged as `puzzle_hint` alone and never as `hint_shown`.

### States and their audience

| State | Audience |
| --- | --- |
| `puzzle_reference_failed` | the owner, in the run's report |
| `puzzle_draft_rejected` | the owner, in the run's report |
| `puzzle_blind_solve_failed` | the owner, in the run's report |
| `budget_puzzle_run_spent` | the owner, in the run's report |
| `puzzle_unapproved_hash` | the parent, in the review queue |
| `puzzle_bank_exhausted` | the parent, in the report's section |
| `puzzle_move_refused` | the developer, through the count of `refused` moves in the verify report |
| `puzzle_check_error` | the owner, in `./tower status` |

### What this part requires from other parts

- ADR-0020 supplies `appendEvents` and the event schemas, and ADR-0030 (SPC-0030) the lease, the answer queue, the offline state and idempotency by `clientSeq`.
- ADR-0100 supplies the offline key, the roles `PUZZLE_MODEL`, `CHECK_MODEL`, `JUDGE_MODEL` and `SAFETY_MODEL` under `ContentRequest`, and the puzzle run's budget bucket.
- ADR-0160 supplies `textGate` and the forbidden list, and ADR-0120 the numeral lexicon.
- ADR-0090 (SPC-0090) supplies the game's active time, the eye count, the rest stop, the soft stop, «Закончить на сегодня» and `POST /api/session/:id/save` with `{ reason: "adventure" | "puzzle", clientSeq }`; ADR-0210 the game day and the taskless screens; ADR-0210 and ADR-0330 the schedule that unlocks the branch.
- ADR-0140 supplies `content/economy.json`, the star yarn, the titles and the thread stock.
- ADR-0340 supplies the `disabled_content` projection.
- CAN-0080 supplies the campaign's checkpoints and running clues, and CAN-0090 the Diary's voice.

The permitted dependencies run one way. The client imports `src/shared/puzzles/` and nothing in `src/engine/` or `src/server/`. `src/shared/puzzles/checks/` and `src/shared/puzzles/widgets/` import only `src/shared/`, and hold no reference to a display language. `src/engine/puzzles/` imports nothing from ADR-0070's Director. The knowledge projection of ADR-0060, ADR-0070's Director and ADR-0090's planner register no `puzzle_*` input type, and ADR-0140's rules read only `puzzle_solved` among the puzzle events. Only `npm run puzzles:prepare` calls `PUZZLE_MODEL`, and no puzzle route calls any model.

## Behaviour

### The branch and its names

The puzzles live on pages of the Keeper's Diary, and she enters them only by her own choice; no step of the adventure, a quest or the story waits on a puzzle (REQ-5700). Every Russian text the player or the parent sees calls the branch «Петельки Смотрителя» and one puzzle «головоломка» (REQ-5710). The name guard fails a title or the branch name that holds any form of «узелок» or «узел», «Ирма» or «Муфта», or a word for a cat from `content/puzzles/name-guard.ru.json` (REQ-5712).

A puzzle page is signed «И.» when its data names the signature as its running clue, and «С.» otherwise, and a group 1 check fails a puzzle text that writes either signature by hand (REQ-5714).

### The bank

Every number in a statement, a rung or a solution comes from the data file, which a person wrote or approved: the text holds a placeholder, and code fills it from the data at play (REQ-5738). The numbers, the rules and the check live in the data file and `src/shared/puzzles/`, so they are the same in every display language (REQ-5764). A rebus is written in digits or shapes, and a group 1 check fails a rebus whose data holds a letter (REQ-5766). A figure is drawn by code from the data.

Every data file names the source of its idea (REQ-5768). A person or the building agent writes the data file from an idea read in a source, and no model receives the source's text, so the statement, story, figure and solution are written anew; the parent judges this at approval (REQ-5770).

A check tests an answer against the puzzle's rules and never compares it with the reference solution, so every answer that meets the rules is accepted (REQ-5740).

### Preparation, offline

`npm run puzzles:prepare` runs outside any session and calls models only in offline roles on the offline key through ADR-0100's gateway (REQ-5748). It takes up a puzzle whose pair of files has a hash, as Approval defines it, that no `puzzle_approved`, no `puzzle_rejected` and no entry of `content/puzzles/queue.json`, queued or failed, holds. A failed puzzle therefore waits until a person changes its data or its text. When the Russian text is missing or its `dataHash` differs from the data file's current hash, the data changed, and the run drafts anew through all the steps below. Otherwise only the text changed, by the parent's edit or by hand, and the run skips step 2 and runs steps 1 and 3 to 5 on the words as they are. The steps run in order, and a puzzle that fails a step stops there:

1. Code runs the reference solution through the puzzle's check before any model call. A failure is `puzzle_reference_failed`, and the puzzle never reaches the review queue (REQ-5742).
2. `PUZZLE_MODEL` receives a `ContentRequest` with the idea note, the placeholders and their roles, the rules in words, the Diary's voice from CAN-0090 filtered to the current checkpoint, and the length limits, and returns 3 variants of the statement, the three rungs, the solution and the title as JSON.
3. Code checks each variant: every placeholder appears where its role needs it; no digit or numeral from ADR-0120's lexicon appears outside a placeholder (REQ-5738); rung 1 holds no placeholder; the text passes `textGate` in every word form (REQ-5762); the title passes the name guard (REQ-5712); the statement holds at most 90 words, each rung at most 30 and the solution at most 150.
4. `JUDGE_MODEL` asks the safety question of the unfilled text, with `SAFETY_MODEL` as its fallback.
5. Code fills the statement with the data's numbers, and `CHECK_MODEL` solves it blind. The request carries the filled statement and the answer format's notation, such as one pour per line as «из A в B» (from A to B) for jugs, and no answer and no candidate answers (REQ-5744). Code parses the free-form reply in that notation, and the variant passes when the puzzle's check accepts the parsed answer (REQ-5746). A puzzle gets at most 2 solves in a run across its variants, taken in order, and a variant passes on its first accepted solve.

The first variant that passes every step enters the parent's review queue: the run writes its text with the data file's current `dataHash` and `editedByParent` false, and adds the candidate to `content/puzzles/queue.json` with its hash and the moment. A text with `editedByParent` true returns to the queue marked `as_edited`, and any other text marked `as_written`. A puzzle that stops at `puzzle_reference_failed` or `puzzle_blind_solve_failed` is added to `content/puzzles/queue.json` as failed with its hash; one that stops at `puzzle_draft_rejected` isn't, so the next run drafts it again.

The run spends from a budget of its own, $20 a run on the offline key, apart from every other budget, and before the run the owner sets the key's limit so that what remains of it equals the run's budget, and after the run back to the sandbox's $20 a month (REQ-5750). A run that reaches the budget stops, keeps what passed and reports `budget_puzzle_run_spent`. The run adds candidates only while the queue holds fewer than 60.

### Approval

The review screen shows one puzzle at a time: the filled statement with its figure, the three rungs, the full solution, the check's result on the reference solution, the source of the idea, the theme and the difficulty (REQ-5756). It offers «принять / отклонить / поправить» (accept / reject / edit). The parent judges there the solution page as a lesson, the clue's pace and whether the text is new (REQ-5736, REQ-5716, REQ-5770).

Acceptance logs `puzzle_approved` with the hash, SHA-256 over the canonical JSON of the data file and the locale's text file together (REQ-5754). Rejection logs `puzzle_rejected`. An edit reruns step 3's code checks at once. An edit that passes them is written to the text file with its `dataHash` unchanged and `editedByParent` true, and the puzzle leaves `content/puzzles/queue.json` until step 5 passes in the next run. Acceptance and rejection also remove the candidate from `content/puzzles/queue.json`. An edit that fails them isn't saved: the screen names the failing check, keeps the parent's words in the editor, and the puzzle stays in the queue as it was.

The server serves a puzzle only when the log holds a `puzzle_approved` for its current hash and `disabled_content` doesn't list it (REQ-5752). A puzzle edited after approval is `puzzle_unapproved_hash` and isn't served until a new approval holds its new hash, and a file added to `content/` by hand is never served. The three rungs she sees are the fixed text approved with the puzzle (REQ-5760), and they reach her with no model call during play (REQ-5758).

### Offers

A new puzzle comes only as a new Diary page at the day's finale, after the day's `adventure_completed` (REQ-5718). The Director of puzzles offers one when all of these hold:

- the adventure that just reached its finale is at least her second, not counting Session 0 (REQ-5720);
- no puzzle was offered this game day (REQ-5702);
- fewer than 3 puzzles are open, where an open puzzle is offered, unsolved and not in the box (REQ-5704);
- the schedule of new systems has unlocked the branch.

The Director chooses the theme only among the themes that have an approved puzzle left to offer (REQ-5795). Among those, it takes a theme after which at least 4 other themes have been offered since it last came, and when no theme meets that rule, the theme offered longest ago (REQ-5794). A theme never offered meets the rule and counts as offered longest ago. When several themes qualify, it takes the one offered longest ago, and among themes never offered, the day's seed decides. Within the theme it offers the lowest-difficulty puzzle not yet offered, with ties broken by the day's seed. An ordinary offer never takes a puzzle with `week: true`.

A puzzle with a running clue is eligible only when the campaign has reached the clue's earliest checkpoint and no puzzle with a clue was offered in the last 5 adventure days, which are game days on which she played an adventure, as ADR-0090 counts them (REQ-5716). The Director passes over an ineligible puzzle for the next puzzle of its theme, and a theme with no eligible puzzle for the next theme. When the conditions hold and no puzzle qualifies, no page appears and the state is `puzzle_bank_exhausted`.

The Director offers a puzzle of the week, one with `week: true`, in place of an ordinary puzzle when no puzzle of the week was offered in the last 7 game days and no puzzle of the week is open. It chooses it by the same theme, difficulty and clue rules, applied to the puzzles with `week: true` only, and when none of them qualifies, it offers an ordinary puzzle. A puzzle of the week is that day's one new puzzle and one of the three open puzzles (REQ-5790).

The new page shows one quiet mark on the Diary's icon until she opens the Diary, and nothing else announces it (REQ-5700).

### A puzzle's flow

She reaches the branch from the Diary whenever the task window is closed, under ADR-0210, and also after «Закончить на сегодня» and after «Отложить головоломку»: `open` is never refused for either. A puzzle takes no slot in the adventure and no place in ADR-0070's flow limit, the domain coverage rule or ADR-0090's day plan (REQ-5706).

At a rest stop she can open an open puzzle and work on it there (REQ-5722). Opening it ends the campfire scene with `rest_stop_ended` and the reason `puzzle_opened` (REQ-5724), and ADR-0090's 10-minute wait starts then. Closing it logs `puzzle_closed` with `to: "adventure"` and returns her to the adventure's next step after the rest stop (REQ-5725).

The server owns the flow:

- No reply before `puzzle_solved` carries the reference solution, the full solution or a rung she hasn't taken.
- A widget applies each move at once through its shared rules module. The move then goes through SPC-0030's queue as `puzzle_move`. When the server's replay refuses a move, the server logs it with `refused`, returns its own state, and the widget redraws it.
- She answers as many times as she likes (REQ-5784). Each answer is a `puzzle_attempt`. A not-accepted answer brings a line from a content pool that passes the forbidden list in every word form (REQ-5762), and the puzzle stays open. An accepted answer solves it.
- «Отложить в коробку» moves a puzzle to «Коробка головоломок» (the box of puzzles), where it doesn't count as open. She takes it back out at any time while fewer than 3 are open (REQ-5704).

The adventure's attempt flow, with its one parallel second attempt, runs on adventure tasks only, and the game gives no third attempt on an adventure task (REQ-5788); no rule of that flow runs on a puzzle.

Widget moves are logged one by one up to 300 for each puzzle in a game day. Past that, the server stops replaying single moves and writes the widget's whole state in one `puzzle_move` with `capped: true`, at most once a minute and with every answer and close.

### The hint ladder and the free thread

The ladder has the puzzle's three approved rungs. It opens for one guiding thread from her stock, logged as `thread_spent` with the reason `hint_ladder` and the puzzle's id, and rungs 2 and 3 then cost nothing. Each rung shown is a `puzzle_hint` with `ladderOpenedBy` `thread` for the first and `free_step` for the later ones. The backpack pocket of ADR-0080 doesn't serve puzzles.

After her second not-accepted answer on a puzzle, the familiar offers one free thread for that puzzle's ladder, once for each puzzle (REQ-5786). Taking it opens the ladder with no spend and logs the rung as `free_step`; when the ladder is already open, the offer shows the next rung. The offer stays open, across closing the puzzle and across game days, until she takes it, solves the puzzle or has seen rung 3, and it isn't made when rung 3 is already shown. The free thread never enters her stock.

### Rewards

A solved puzzle gives a Diary page with its full solution in the Keeper's hand and a mark in the collection for its theme (REQ-5772). It gives 2 star yarn, and a solved puzzle of the week 3 (REQ-5774). Every fifth puzzle solved in one theme, the 5th, the 10th and so on, gives a new cosmetic title from `content/economy.json` (REQ-5776). The reward is the same whether or not she took a rung (REQ-5778).

A puzzle rewards her only with its solution page, its mark, star yarn, a title and the free thread of the ladder (REQ-5780). The solution page is the one lesson in the game that teaches a maths idea outside the skill graph, such as parity or the pigeonhole principle, and the game offers no other lesson on a new topic (REQ-5736).

An unsolved or boxed puzzle takes away and withholds nothing: no experience, star yarn, star-steel shards, buttons, guiding threads, quest progress, streak or title (REQ-5708). ADR-0140's rules read no puzzle event other than `puzzle_solved`, and that one only grants.

The economy's balance simulation of ADR-0190's group 3 includes the star yarn puzzles give and the threads their ladders spend (REQ-5782).

### Time, the eye count and the soft stop

Time on a puzzle counts in the day's active time that brings the soft stop, wherever the puzzle is open (REQ-5728). The 20-minute count towards the next eye exercise excludes the eye exercises and the rest stop's campfire scene and no other active time, so the minutes of a puzzle opened at a rest stop count towards the next eye exercise (REQ-5726).

A due eye exercise on a puzzle plays at the first moment outside a widget move.

A boundary on a puzzle is the moment after the server's reply to an answer or a hint, and never the middle of a widget move. When the day's active time reaches the soft-stop point while she is on a puzzle, the soft stop plays at the puzzle's next boundary (REQ-5730):

- Before the day's finale, on a puzzle she opened at a rest stop, the soft stop offers to save the adventure. Accepting closes the puzzle, saves the adventure and logs `save_accepted` with the reason `adventure`.
- After the day's finale, the soft stop offers «Отложить головоломку» (Put the puzzle away) beside «Ещё один ряд» (One more row) (REQ-5731). «Ещё один ряд» moves the soft-stop point 20 minutes on. «Отложить головоломку» closes that one puzzle without moving it to the box and logs `save_accepted` with the reason `puzzle`, and the branch stays reachable.
- A puzzle she opens once the soft-stop point has passed, after a put-away or after «Закончить на сегодня», brings the soft stop again at its first boundary with «Отложить головоломку», and with «Ещё один ряд» only when no `finish_today` came that game day.

### Events and the knowledge model

Every step of her play with a puzzle is logged under one of the puzzle event types, and no puzzle action is ever logged as `attempt_submitted` (REQ-5734). The knowledge model reads no puzzle event: ADR-0060's projection reads `attempt_submitted`, and a group 1 check fails the build when the knowledge projection or ADR-0070's Director registers any `puzzle_*` input type (REQ-5732).

### The parent's report

Report v1 shows the section «Нестандартное мышление» on the VWO readiness screen beside the ceiling above 1S, labelled «запас, а не оценка» (a reserve, not an assessment); the section adds no screen (REQ-5796). It shows the puzzles solved in each theme, the mean of the highest rung taken on solved puzzles, the puzzles she came back to by herself, which are those she opened on a later game day than their offer, the puzzles solved with no rung on the second or third game day after the offer, and the counts of puzzles offered, opened and shelved (REQ-5798). When the box passes 20 puzzles, the section shows one line saying so, once. In `puzzle_bank_exhausted`, the section shows the count of approved puzzles left.

### Build verification

ADR-0190's verification fails on any puzzle whose reference solution fails its check (REQ-5742), whose text or familiar's line fails the forbidden list (REQ-5762), whose numbers, rules or check depend on the display language (REQ-5764), whose rebus holds a letter (REQ-5766) or which names no source of its idea (REQ-5768). It never fails on the count of puzzles in a theme (REQ-5792).

## Failure paths

| Condition | What happens |
| --- | --- |
| The reference solution fails the puzzle's check | `puzzle_reference_failed`: the puzzle stops before any model call, and the run's report names it. |
| No variant passes the code checks or the safety question | `puzzle_draft_rejected`: the run's report names the failing check, and the next run drafts again. |
| No variant's parsed answer passes the check in 2 blind solves | `puzzle_blind_solve_failed`: the run's report names the puzzle; its statement is rewritten by hand or its data fixed. |
| The run reaches its $20 budget | `budget_puzzle_run_spent`: the run stops and keeps what passed. |
| A puzzle file's hash differs from every approved hash | `puzzle_unapproved_hash`: the puzzle isn't served, and it returns to the review queue once a preparation run passes its blind solve. |
| The sandbox has turned a puzzle off | The puzzle isn't served until `disabled_content` no longer lists it. |
| No theme has an approved puzzle the offer rules allow | `puzzle_bank_exhausted`: no page appears, and the section shows the count of approved puzzles left. |
| The server's replay refuses a move the client applied | `puzzle_move_refused`: the server logs the move with `refused`, returns its state, and the widget redraws it. |
| A check throws on an answer | `puzzle_check_error`: the answer is logged `not_judged`, the familiar says a neutral line, the puzzle stays open, and the answer counts neither towards the second miss of REQ-5786 nor in `puzzle_solved`'s attempts. |
| A move or answer arrives twice with one `clientSeq` | The server appends nothing and returns the first result. |
| The connection drops past 300 moves in a game day | A reconnect restores the board from the last `capped` state, at most a minute of moves behind. |
| The client has no connection | SPC-0030's offline state: the hint and free-thread controls are inactive and the waiting scene shows. |
| Another device holds the lease | `409 lease_moved`, as SPC-0030 states. |
| She asks to open the ladder with no thread in her stock and no free thread offered | `409 no_threads`, and the puzzle stays open. |
| A puzzle is taken out of the box while 3 are open | `409 open_limit`, and the puzzle stays in the box. |
| A boxed puzzle is opened without being taken out of the box | `409 in_box`, and the puzzle stays in the box. |
| The parent's edit fails step 3's code checks | The edit isn't saved, the review screen names the failing check, and the puzzle stays in the queue as it was. |

## Open review findings

- Round 1 asked for a reason beside each value, such as the word limits, $20, the queue of 60, 5 adventure days, 7 game days, 300 moves and the box line at 20, or a sentence pointing to ADR-0280 for them. Rejected: a specification states what the system does and never why (S8), and ADR-0280 holds each reason. Round 2 noted the same point and didn't reopen it.
- Round 2: the report's mean of the highest rung taken doesn't say whether a puzzle solved with no rung counts as 0 or is left out, and the line when the box passes 20 doesn't say whether "once" means once ever or once each time the box passes 20. Open: ADR-0280 settles neither, and the review limit of two rounds ends here.
