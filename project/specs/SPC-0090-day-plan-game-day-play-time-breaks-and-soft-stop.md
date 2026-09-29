---
id: SPC-0090
artifact: spec
status: live
revised: 2026-09-29
checked-at:
states: [REQ-0100, REQ-0114, REQ-0116, REQ-0118, REQ-0120, REQ-0122, REQ-0124, REQ-0126, REQ-0128, REQ-0130, REQ-0132, REQ-0134, REQ-0136, REQ-0138, REQ-0140, REQ-0142, REQ-0144, REQ-0146, REQ-0148, REQ-0300, REQ-0302, REQ-0304, REQ-0308, REQ-0312, REQ-0314, REQ-0316, REQ-0318, REQ-0320, REQ-0322, REQ-0324, REQ-0326, REQ-0328, REQ-0330, REQ-0332, REQ-0340, REQ-0342, REQ-0344, REQ-0346, REQ-0348, REQ-0350, REQ-0352, REQ-0354, REQ-0356, REQ-0358, REQ-0360, REQ-0362, REQ-0364, REQ-5000, REQ-5002, REQ-5004, REQ-5006, REQ-5008, REQ-5010, REQ-5012, REQ-5014, REQ-5016, REQ-5022, REQ-5056]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The day's adventure plan, the game day, play time, eye exercises, rest stops, the soft stop and the screens without tasks

## Scope

This document covers how the server sizes and orders the adventure of the day, the tasks the plan inserts, the scene around a task, Session 0, the game day and its daily jobs, the three time values the server projects from the log, the boundaries at which timed events play, eye exercises, rest stops, the soft stop and its extensions, «Закончить на сегодня» (Finish for today), the anxiety and avoidance signals, the screens without tasks, and the rule that her screens show no time. It is written at the level of the server's projections, the packets the client draws, the events this part logs and the checks that hold it; it has no diagram.

It leaves out what other documents state. The routes, packets, the lease, pauses, the resume point and the three-day rule are SPC-0030's. The event table and `appendEvents` are SPC-0020's. The choice of floors, rooms and every task, the forecast's trim order, the story budget and the fatigue signal are SPC-0070's. The task window and its review are SPC-0080's. The floor's inner order with its Volley and Sources tasks is ADR-0290's, and the route choice, the interlude, the schedule of new systems and «Свободное перо» (Free Pen) as a feature are ADR-0330's. The Diary puzzles, their soft stop after the finale and their eye count are ADR-0280's. The eye exercise's length and how an eyes-off exercise ends are ADR-0320's. The Parent Room's pages, its PIN, the long-day mark and the monthly motor check are ADR-0180's. The adventure's model budget is ADR-0100's, and daily quests and rewards are ADR-0140's.

## Boundary

### Parts and what each offers

| Part | What it offers |
| --- | --- |
| `src/engine/day/` | `gameDayOf(ts, zone)`, the only function that turns a time into a game day index. |
| The planner, ADR-0070's `planDay` | The seeded plan of the adventure: its floors, each room's drawn length, the random easy tasks and the transition cycle, logged as `plan_built`. |
| The time projections | The day's active time, the eye count and the soft-stop point, each folded from the event log. |
| The boundary scheduler | At each boundary, the one due timed event the next packet carries. |
| The client | Draws the packets, the «Привал» (Rest stop) button and the entries to the screens without tasks, and sends the device's IANA time zone name when a session starts. |

### What the packets carry

Every packet of `GET /api/session/:id/next` carries whether «Привал» is active and never a time value, a minute count or the hour at which the game day ends (REQ-0300, REQ-5002). An eye exercise and an offered rest stop arrive as the `break` packet with their kind. The soft stop arrives as `stop_offer`, whose `canExtend` is true when the day's active time brought it and false after `finish_today` (REQ-0326, REQ-0364). The gentle sequence after an anxiety signal arrives as a `room` packet with an easy task and then a `scene` packet.

### Events this part logs

`day_opened`, `plan_built`, `floor_entered`, `room_opened`, `eye_exercise` with its kind, `rest_stop_offered`, `rest_stop_started`, `rest_stop_ended`, `soft_stop`, `extension`, `save_accepted`, `finish_today`, `avoidance_signal`, `anxiety_signal` with its kind, `zone_changed` and `clock_jump`, all through `appendEvents`. Every event of Session 0 carries `session0: true`.

| Event | Payload beyond the envelope |
| --- | --- |
| `room_opened` | the room's drawn length |
| `eye_exercise` | the exercise: `far`, `blink`, `figure_eight` or `palms` |
| `rest_stop_ended` | the reason: `tap`, `timeout`, `puzzle_opened` or `screen_opened`, and with `screen_opened` the screen's name; SPC-0020's upcaster reads a version 1 event as `unrecorded`, a reason this part never writes |
| `save_accepted` | the reason: `adventure` or `puzzle` |
| `anxiety_signal` | the kind: `alt_run`, `rapid_guess_rise`, `erase_hesitation` or `free_text` |
| `zone_changed` | the old and the new IANA zone name |

The values of `eye_exercise` and `anxiety_signal` are names the spec step chose for the kinds the decisions describe in words.

### Settings and content

The parent settings hold the eye-exercise skip switch, off by default (REQ-0316), and hold no field for a daily maximum of play time (REQ-0324). The per-language content file holds the line pools for the knot's announcement, the outcome lines, the transitions, each timed event, the end of the row, the day-turn line under the key `story.day_turn` and the Parent Room memo.

### Constants

| Constant | Value |
| --- | --- |
| The adventure's target | about 60 minutes of active time |
| The pace window | the median over the last 5 adventure days |
| The pace default with no history | 75 seconds per first attempt with its review |
| A room's length | 3 to 5 tasks, at most 3 when SPC-0070 trims new rooms |
| A random easy task | probability 1/12 at each boundary between tasks, at most one in any 5 tasks |
| The eye interval | 20 minutes of the eye count |
| A long pause | longer than 5 minutes |
| The soft-stop point | 60 minutes of the day's active time |
| An extension | 20 minutes from the moment she chose it |
| A rest stop | a campfire scene of 2 to 5 minutes |
| The «Привал» wait | 10 minutes of wall-clock time after a rest stop ends |
| The frontier cap after a second anxiety signal | at most 40 % of room slots |
| The game day's end | 04:00 in the device's time zone |

### What this part requires from other parts

- SPC-0020 supplies `appendEvents`, the event schemas and the projection registry.
- SPC-0030 supplies the packets, the pause events with the instant of her last activity, the `break`, `extend`, `save` and `finish-today` routes, the resume point and the three-day rule.
- SPC-0070 supplies the floors, the rooms, every task and the easy task's node, recomputes the forecast before each floor, and applies the frontier cap.
- SPC-0080 supplies the task window's states, from `open` to `closed`.
- ADR-0140 supplies the spell, the outcome, the chest and the growth amounts.
- ADR-0110 and ADR-0160 supply the scene lines and the check on every player-facing string.
- ADR-0180 draws the eye-skip switch, «Закончить на сегодня» and the memo behind the PIN.

### Permitted dependencies

The dependencies run one way. `src/engine/day/` imports nothing from `src/server/` or the client. A lint rule refuses `getHours`, `getUTCHours`, `Intl.DateTimeFormat` with an `hour` option and `Temporal` hour fields in the engine, the server's job code and the player's client code, outside `src/engine/day/` and ADR-0040's task renderer; the Parent Room's code is outside the rule. The planner and the time projections read only the event log, through SPC-0020's projections. The client imports only `src/shared/`, holds no timer for play time, and keeps `performance.now()` only for answer timings. The planner and the Director read no `puzzle_*` event.

## Behaviour

### The day plan

When a game day opens with no adventure in progress, the planner builds a seeded plan sized to about 60 minutes of her active time (REQ-0100). The forecast uses her pace, the median over her last 5 adventure days of three durations: a first attempt with its review, a second attempt, and a scene. It adds the story and the expected eye exercises, 3 an hour at the median of her logged exercise lengths, or 35 seconds each before any are logged. A fourth floor joins the plan only when the forecast with it stays within 60 minutes. With fewer than 5 adventure days, the median covers the days there are, and with none the forecast takes 75 seconds per first attempt with its review.

An adventure that stops at the soft stop continues on the next game day from the same slot, with the rest of the plan recomputed from her pace. The planner starts a new adventure only after the previous finale.

### Tasks the plan inserts

The first task after a floor's entry scene is an unscored warm-up (REQ-0114). After a pause longer than 5 minutes, the next new task is an unscored warm-up, and a task left open still comes first (REQ-0116); a pause of 5 minutes or less brings no warm-up.

The planner draws the random easy tasks when it builds the plan, so their places are the same whatever she answers (REQ-0120). At each boundary between tasks it places an easy unscored task with probability 1/12 from the session seed, and at most one in any 5 tasks. After three first attempts in a row end in `alt`, the next task is one easy unscored task (REQ-0118); when a random easy task already stands there, one easy task shows. Inside a room an easy task takes one of the room's slots and leaves the room's length unchanged (REQ-0122). Outside a room, between the warm-up, the mental arithmetic and the Guardian, an easy task adds a place to the plan.

A room draws its length, 3 to 5 tasks, from the room seed when it opens, logs it in `room_opened`, and keeps it until the room ends (REQ-0124).

### The scene around a task

Before each task the System announces the knot in a System window (REQ-0144). After each first attempt the System speaks the outcome line (REQ-0146). The task opens between the two in the task window.

A change of node or floor shows as the next transition from a cycle of four, a hidden hatch, a portal, a braided staircase and a door, shuffled by the adventure seed. The cycle never reads which node the Director chose, so a step down to a prerequisite and a step up show the same sequence (REQ-0130).

The battle model holds no health for the heroine: no field, event or line damages her, whatever she answers (REQ-0126). A Tangle's lines come from content that ADR-0110's frames and ADR-0160's forbidden-word list check, and an agent reads every battle line and scene where a Tangle acts and judges that none attacks or mocks her (REQ-0128).

The end of the row names in words the growth she made in the adventure: experience, level, familiars, quests, star-steel shards and star yarn (REQ-0148). It shows no score, no percentage and no comparison with past days.

### Session 0

The first time the game runs, Session 0 takes the place of an adventure and runs its eight steps in order (REQ-0136):

| Step | Budget |
| --- | --- |
| The transparency talk | 2 minutes |
| Creating the heroine | 2 minutes |
| Choosing the starting familiar | 2 minutes |
| The first chest | 1 minute |
| Training the answer field and «Не знаю» (I don't know) on trivial numbers, with no thread, hint or explanation | 4 minutes |
| Motor calibration of 10 plain-input tasks | 3 minutes |
| The vocabulary probe | 5 minutes |
| The campaign's first scene with the end of the row | 3 minutes |

The budgets sum to 22 minutes, inside the 20 to 25 minutes Session 0 lasts (REQ-0132). Creating the heroine lets her choose the name, the cloak colour and the focus (REQ-0138) and offers no choice of look (REQ-0140). Every event of Session 0 carries `session0: true`, and the knowledge projection skips those events, so Session 0 updates no skill estimate (REQ-0134). Its outputs are the input-speed correction and the list of risky terms. Session 0 counts as that game day's adventure.

### The game day

A game day ends at 04:00 in the time zone of the device she plays on (REQ-5000). `gameDayOf(ts, zone)` in `src/engine/day/` computes the game day index from the server's clock and the zone the client sent at the session's start. A change of zone logs `zone_changed` and takes effect at the next 04:00 of the old zone.

No screen, line, number or string she can reach names that hour (REQ-5002). The story tells the change of day with the line «Башня перевязалась за ночь» (The Tower re-knitted itself overnight), under the key `story.day_turn` (REQ-5006). The line opens «В прошлый раз…» (Last time…), the opening scene ADR-0110 orders from the planner's latest session summary, on the first adventure of every game day except her first, and the parent judges its wording at stage acceptance.

The server starts at most one new adventure in a game day (REQ-5004): `appendEvents` refuses `adventure_planned` when the log already holds one for the same game day, with Session 0 counted as one. The next adventure is planned at the first server contact of the next game day, which logs `day_opened`.

At the change of game day the server runs each daily job (REQ-5008): the morning's guiding threads, the daily quests and daily rewards, the shop's new slots, the reset of the explanation budget, the end of a pause of live frames, the count of adventure days for the three-day rule, the end of «Закончить на сегодня», the end of the frontier cap after a second anxiety signal, the end of the lowered creepiness level and the soft stop's daily reset. Each job reads the game day index and never an hour, and each keeps the owner that defines it. No screen, form or feature opens or closes because of the time of day (REQ-5010). The lint rule under Permitted dependencies fails the build on code in the engine, the server's job code and the player's client that reads an hour; the Parent Room's code is outside that rule by ADR-0210, and no daily job runs there.

### How the server counts time

The server counts time from the event log alone, with its own clock. An active interval runs from a session start or resume to the next pause or session end, and ends at the instant of her last activity that the pause event carries. An eye exercise or a rest stop leaves play running. The server projects three values from those intervals:

| Value | What it counts | What it leaves out | Resets |
| --- | --- | --- | --- |
| The day's active time | every active interval of the game day, eye exercises and rest stops included (REQ-0318), and time on the screens without tasks | paused time | at the change of game day |
| The eye count | active time since the last eye exercise, time on the screens without tasks included whenever she spends it, and a puzzle opened at a rest stop included (REQ-5016) | eye exercises and the rest stop's campfire scene | at each eye exercise, and after a pause longer than 5 minutes (REQ-0312) |
| The soft-stop point | 60 minutes of the day's active time, moved to the moment of each «Ещё один ряд» (One more row) plus 20 minutes of active time | nothing | at the change of game day |

Both the day's active time and the eye count take each eye exercise's length from `eye_exercise_ended`. When the server's clock or the device's zone moves by more than a minute during a session, the server logs `clock_jump` and counts intervals from the log's order, never across the jump: an active interval that spans the jump closes at the last event before it, a new one opens at the first event after it, and the gap between the two counts as no active time.

### Boundaries and the order of timed events

A boundary is the moment after an answer with its review closes, or after a scene ends. The scheduler checks for due events only at a boundary, so no timed event starts while a task window is open. When several are due at one boundary, the first of these plays and the rest wait for the next boundary, which the first one's own scene ends at:

1. the soft stop;
2. the eye exercise;
3. the rest stop offered by the fatigue signal;
4. the gentle sequence after an anxiety signal.

The rest stop offered after three «Не знаю» isn't a timed event of its own: it plays inside the gentle sequence, as the scene after its easy task.

A due event is a flag: each condition fires once, and a long task never piles up two of one kind.

### Eye exercises

When the eye count reaches 20 minutes, an eye exercise plays at the next boundary, never in the middle of a task (REQ-0304). The four exercises take turns, looking far out of the window, blinking, tracing a figure eight with the eyes and covering the eyes with the palms, and the log's last `eye_exercise` sets the next (REQ-0308). The exercise shows no way to skip it unless the parent has switched on «Пропустить» (Skip) in the Parent Room (REQ-0314), and that switch is off until the parent changes it (REQ-0316). ADR-0320 states how long each exercise lasts and how it ends.

### The soft stop and extensions

When the day's active time reaches 60 minutes on an unfinished adventure, the soft stop plays at the next boundary as a story scene that offers to save the adventure and continue tomorrow (REQ-0320), and logs `soft_stop`. Each time the soft stop comes because the day's active time ran out, it offers «Ещё один ряд» beside the offer to save (REQ-0326).

When she chooses «Ещё один ряд», the server logs `extension` and the adventure continues with tasks (REQ-0328). Each extension moves the soft-stop point to 20 minutes of active time after the moment she chose it (REQ-0330). When those 20 minutes run out on an unfinished adventure, the soft stop comes again at the next boundary (REQ-0332).

The client accepts the offer to save through `POST /api/session/:id/save` with `{ reason: "adventure" | "puzzle", clientSeq }`, and the server logs `save_accepted` with that reason. With the reason `adventure`, the server returns the closing scene and ends the day's play through that story scene straight away, since the soft stop already stands at a boundary (REQ-0340). With the reason `puzzle`, the server closes that one puzzle and returns the puzzle branch; it returns no closing scene and ends no play. The resume point of SPC-0030 keeps the open task, scene and rewards. When she comes back on the same game day, the adventure reopens and the soft stop plays at its entry scene, offering «Ещё один ряд» beside the offer to save.

The game ends no play and withholds no task because the day's total active time has reached any value (REQ-0322). The Parent Room offers no setting for a daily maximum, and the settings schema has no field that could hold one (REQ-0324).

### Finish for today

The Parent Room offers «Закончить на сегодня» behind the PIN (REQ-0360). Using it logs `finish_today`, and at the next boundary, after an answer with its review or after a scene, the soft stop plays (REQ-0362) with `canExtend: false`, so it offers no «Ещё один ряд» (REQ-0364). For the rest of that game day the adventure stays closed, and the change of game day ends the rule. The puzzle branch stays reachable, and the server never refuses `open` on a puzzle after `finish_today`.

### Rest stops

The «Привал» button is on screen throughout play (REQ-0342). A tap on it starts a rest stop, a campfire scene with the familiars whose content runs 2 to 5 minutes, and logs `rest_stop_started`. The rest stop ends at her tap at any moment, before 2 minutes included, by itself after 5 minutes, or when she opens a screen without tasks from it. It logs `rest_stop_ended` with the reason `tap`, `timeout`, `puzzle_opened` for a puzzle, or `screen_opened` with the screen's name for any other screen without tasks. For 10 minutes of wall-clock time after a rest stop ends, the button stays inactive and shows no countdown (REQ-0344). An offered rest stop she declines starts no wait.

When she answers «Не знаю» three times with no other answer between them, the game offers her a rest stop through her familiar and logs `rest_stop_offered` (REQ-0346). The offer comes on every such run, whether the button is active or waiting, and it plays as the campfire scene of the gentle sequence, after its easy task. «Нельзя узнать» (Can't know) is another answer and breaks the run. The same run logs `avoidance_signal`, and she loses nothing for it (REQ-0348). SPC-0070's fatigue signal also offers a rest stop, at most once in 10 minutes counted from the last offer, taken or declined.

### Anxiety signals

The server detects four anxiety signals:

- three `alt` outcomes in a row;
- a rising share of rapid guesses, tested from the session's 20th first attempt on: among the session's last 10 first attempts at least 20 %, and at least 15 percentage points above the share among its first 10;
- erasing with hesitation: on 2 of the last 3 tasks, 3 or more erasures and a time over twice the template's `fluencyMs`;
- «мне страшно» (I'm scared) or «не хочу» (I don't want to) in her free text, found by ADR-0110's hand-written triggers.

On a signal the next task is an easy one, and a campfire scene or a funny scene follows it (REQ-0350). The easy task after three `alt` outcomes is that same easy task, never a second one. When the three were all «Не знаю», the familiar's offer of a rest stop follows the easy task as the campfire scene. After every other signal, a funny scene from the library follows it. The server logs every signal as `anxiety_signal` with its kind, which the report shows under «Ограничения» (Limits) (REQ-0354). At a second signal in one session, the frontier share falls to at most 40 % of room slots for the rest of the game day (REQ-0352).

### The screens without tasks

Whenever the task window is closed, during an adventure included, the client offers the heroine's room, the Diary, the forge, the shop, the familiars, the puzzle branch «Петельки Смотрителя» (the Keeper's Loops) and «Свободное перо» (REQ-5012). The task window is open from the moment a task is shown until she taps to leave its review, and the entries are hidden in that span. Leaving to one of these screens during an adventure holds the adventure at its current slot, and her way back puts her in the scene or task she left. After the day's finale the server sends no task until the next game day, and she stays on these screens for as long as she likes.

The server writes `puzzle_offered` only after the game day's `adventure_completed`, so a new puzzle appears only after the day's finale (REQ-5014). A puzzle she already has opens at any moment the task window is closed, at a rest stop included, and after «Закончить на сегодня» or «Отложить головоломку» (Put the puzzle away) the server still never refuses `open`. «Отложить головоломку» closes that one puzzle, and the puzzle branch stays reachable.

Every moment on these screens is a boundary, except on a puzzle, where a boundary is a moment outside a widget move. A due eye exercise plays at once on every screen without tasks apart from a puzzle, and on a puzzle at the first moment outside a widget move. On every screen without tasks apart from a puzzle, a due soft stop waits until she returns to the adventure. On a puzzle she opened at a rest stop during an unfinished adventure, a due soft stop plays at the puzzle's next boundary with the offer to save the adventure, and accepting it closes the puzzle and saves the adventure. A puzzle she opens from the Diary before the day's finale, after a `save_accepted` on the same game day, brings the soft stop at its first boundary with the offer to save the adventure and «Ещё один ряд» beside it (REQ-0326); accepting closes the puzzle, saves the adventure and logs `save_accepted` with the reason `adventure`. A puzzle she opens after «Отложить головоломку» or after `finish_today` brings the soft stop at its first boundary with «Отложить головоломку», which logs `save_accepted` with the reason `puzzle`, and with «Ещё один ряд» only when no `finish_today` came that game day. «Свободное перо» spends from the current adventure's model budget. When that budget runs out while the pen is open, the server closes the pen through a story scene from the library, and she sees no budget and no error (REQ-5056). ADR-0330 states how the pen closes when the soft-stop point passes inside it.

### What she never sees

Her screens show no timer, countdown, clock or time bar (REQ-0300). A Playwright test on the tablet and desktop viewports walks every player screen and fails on any text matching a clock, a countdown or a minute count outside the subtree the task renderer marks `data-task-content`. The check fails on every display of her own current or elapsed time and on nothing printed inside a task (REQ-5022). A second case renders one timetable task and one clock-reading task, and asserts that the check passes on them and fails on the same text placed outside the subtree.

A line that announces an eye exercise, a rest stop, the soft stop or an extension holds no minutes, numbers or hint of a countdown (REQ-0302). ADR-0160's check refuses a digit or a word from the time-word list in that line pool, and the parent judges the pool at stage acceptance.

The sand in the «Мера» (Measure) hourglass symbol is drawn once and never animated (REQ-0356). No hourglass appears in the task window, on a timed event's screen or as a sign of waiting; the game waits with SPC-0030's waiting scene, and no style sets the pointer to `wait` or `progress` (REQ-0358).

### The Parent Room memo

The Parent Room holds the memo on how to talk with the child about the game, from the per-language content file: don't discuss node estimates with her, share her joy at triumphs while praising effort and courage and never «ум» (cleverness), don't question her about «хитрые обходы» (clever detours) or turn them into reproach, and don't use the game as a reward or a punishment (REQ-0142).

## Failure paths

| Condition | What happens | Audience |
| --- | --- | --- |
| The adventure doesn't reach its finale before she accepts the soft stop (`plan_overrun`) | It continues on the next game day, and SPC-0030's three-day rule wraps it up after three adventure days. | the parent |
| A second `adventure_planned` in one game day | `appendEvents` refuses it; `next` returns `end`, and the client offers the screens without tasks. | the developer |
| The server's clock or the device's zone moves by more than a minute in a session (`clock_jump`) | The server logs it, closes the active interval at the last event before the jump, opens a new one at the first event after it, and counts the gap as no active time. | the developer |
| The device reports a new zone | The server logs `zone_changed`, and the new zone takes effect at the next 04:00 of the old zone. | the developer |
| The client loses the server (`connection_gap`) | SPC-0030's lease lapses, play pauses at her last activity, and the gap counts as no active time. | the developer |
| A timed-event line holds a digit or a time word (`line_refused`) | The verify step fails the content. | the developer |
| She leaves during Session 0 (`session0_interrupted`) | Session 0 resumes at the same step. | the player |
| Two timed events are due at one boundary | The first in the stated order plays, and the other waits for the next boundary. | none |
| A timed event falls due while a task window is open | It waits for the boundary after the answer's review. | none |
| The fatigue signal falls due within 10 minutes of the last offer of a rest stop | The server makes no offer. | none |
| `extend` after `finish_today` on the same game day | `409 day_finished`, as SPC-0030 states. | the player |
| Code outside `src/engine/day/` and the task renderer reads an hour | The lint rule fails the build. | the developer |
| A clock, a countdown or a minute count shows outside `data-task-content` | The screen check fails. | the developer |
| The adventure's budget runs out while «Свободное перо» is open | The pen closes through a story scene from the library. | the player |

## Open review findings

- The agent reviewer asked for the reasons behind the zone-change rule, the wall-clock «Привал» wait, the adventure staying closed after «Закончить на сегодня», the planner reading no `puzzle_*` event and the order of timed events. Rejected: a specification states what the part does and never why, and ADR-0090, ADR-0210 and ADR-0280 hold those reasons; ADR-0090 gives none for the order, so this document can't supply one.
