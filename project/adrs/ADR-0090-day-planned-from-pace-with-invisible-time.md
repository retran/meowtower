---
id: ADR-0090
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-0100, REQ-0102, REQ-0104, REQ-0114, REQ-0116, REQ-0118, REQ-0120, REQ-0122, REQ-0124, REQ-0126, REQ-0128, REQ-0130, REQ-0132, REQ-0134, REQ-0136, REQ-0138, REQ-0140, REQ-0142, REQ-0144, REQ-0146, REQ-0148, REQ-0300, REQ-0302, REQ-0304, REQ-0306, REQ-0308, REQ-0310, REQ-0312, REQ-0314, REQ-0316, REQ-0318, REQ-0320, REQ-0322, REQ-0324, REQ-0326, REQ-0328, REQ-0330, REQ-0332, REQ-0334, REQ-0336, REQ-0338, REQ-0340, REQ-0342, REQ-0344, REQ-0346, REQ-0348, REQ-0350, REQ-0352, REQ-0354, REQ-0356, REQ-0358, REQ-0360, REQ-0362, REQ-0364]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0090. The server plans each day's adventure from her pace, counts time only from the event log, and brings eye exercises, rest stops and a soft stop as story at task boundaries, with no clock on her screens

## Decision

The server builds the adventure of the day as a seeded plan and sizes it from her recent pace to about 60 minutes of active time. It counts every clock the game needs as a projection of the event log, and decides every timed event at a boundary between tasks or scenes. The player never sees a number of minutes. The parts follow.

### The day plan

When a game day opens with no adventure in progress, the server builds a plan from the adventure's seed, in the order REQ-0102 fixes: «В прошлый раз…» (Last time…) with the daily quests, 3 maths floors, or 4 when the forecast fits, and a finale that ends on a cliffhanger. Each floor runs as REQ-0104 fixes: an entry scene, an unscored warm-up, 2 mental arithmetic tasks, 1 or 2 rooms of trials, sometimes a Guardian, then the floor chest. ADR-0070 chooses the floors, the rooms per floor and every task in them.

The forecast sizes the plan to about 60 minutes of active time (REQ-0100, imposed by the owner's decision of 2026-09-26). It uses her pace, the median over her last 5 adventure days (RES-0100 conclusion 1) of three durations: a first attempt with its review, a second attempt, and a scene. The forecast adds story, at most 10 minutes (REQ-1042), and the expected eye exercises, 3 of 35 seconds in an hour. A fourth floor joins the plan only when the forecast with it stays within 60 minutes. With fewer than 5 adventure days of history, the median covers the days there are, and with none it assumes 75 seconds per first attempt with its review; I chose 75 seconds, because 50 minutes of task time over the draft's 36 to 44 tasks with a first attempt comes to about that (RES-1000). ADR-0070 recomputes the forecast before each floor and trims in its fixed order (REQ-1048, REQ-1050).

A room draws its length, 3 to 5 tasks, from the room seed when it opens, and keeps it until it ends (REQ-0124), so the number of spells and chests depends on time played and never on correctness (RES-0100). When ADR-0070 trims new rooms to 3 tasks, the draw is capped at 3.

An adventure that doesn't finish before she accepts the soft stop continues the next game day from the same slot, with the remainder of the plan recomputed from her pace. A new adventure starts only after the previous finale (RES-0200 conclusion 12).

### Tasks the plan inserts

The first task after a floor's entry scene is an unscored warm-up (REQ-0114). After a pause longer than 5 minutes, the next new task is an unscored warm-up, while a task left open stays first (REQ-0116); a shorter pause brings none, as RES-3900 settled.

The plan draws the random easy tasks when it is built: at each boundary between tasks, an easy unscored task with probability 1/12 from the session seed, and at most one in any 5 tasks (REQ-0120). Drawing them in advance makes their places independent of her answers, so one easy task can't tell her she got something wrong (RES-0100). After three first attempts in a row end in `alt`, the next task is one easy unscored task (REQ-0118). When that falls where a random easy task already stands, one easy task shows. Inside a room an easy task takes one of the room's slots (REQ-0122). Outside a room, among the warm-up, mental arithmetic and the Guardian, it is added, because ADR-0070 never trims mental arithmetic (REQ-1050) and those segments have no slots to give; I chose this. ADR-0070 picks the easy task's node from nodes she holds fluently.

When ADR-0180's projection marks the monthly motor check due on the device she plays on (REQ-1354), the plan places Session 0's 10 pure-input tasks straight after «В прошлый раз…». One story line frames them as limbering up before the climb, and the forecast counts 3 minutes for them. They update no skill estimate, only the motor correction. I chose that place, because the check needs a rested hand, and the start of the day is the one point every adventure has.

### The scene around a task

Before each task the System announces the knot in a System window (REQ-0144), and after each first attempt it speaks the outcome line (REQ-0146); the task itself opens between the two in the task window, which ADR-0080 governs. A change of node or floor shows as the next story transition from a cycle shuffled by the adventure seed: a hidden hatch, a portal, a braided staircase or a door. The cycle never reads which node ADR-0070 chose, so a step down and a step up look the same (REQ-0130).

The battle model has no health for the heroine: no field, event or line can damage her, whatever she answers (REQ-0126). A Tangle's lines come from content that ADR-0110's frames and ADR-0160's forbidden-word list check, and an agent reads every battle line and scene where a Tangle acts to judge that none attacks or mocks her (REQ-0128).

The end of the row names in words the growth she made in the adventure: experience, level, familiars, quests, star-steel shards and star yarn (REQ-0148). It shows no score, no percentage and no comparison with past days (RES-0100 conclusion 5). ADR-0140 supplies the amounts.

### Session 0

The first time the game runs, Session 0 takes the place of an adventure and runs its eight steps in order (REQ-0136). I chose a budget for each step so the whole fits 20 to 25 minutes (REQ-0132). The transparency talk takes 2 minutes, creating the heroine 2, the starting familiar 2, the first chest 1, training on trivial numbers 4, motor calibration of 10 plain-input tasks 3, the vocabulary probe 5 (RES-0100) and the first scene with the end of the row 3, which sums to 22. Creating the heroine lets her choose the name, the cloak colour and the focus (REQ-0138) and offers no choice of look, because the family picks the look from four character sheets before art is made (REQ-0140).

Every event of Session 0 carries `session0: true`, and ADR-0060's projection skips those events, so Session 0 updates no skill estimate (REQ-0134). Its outputs are the input-speed correction for ADR-0070's rapid-guess threshold and the list of risky terms. Session 0 counts as that game day's adventure, so after it only screens without tasks open until 04:00; I chose this, because a first day of Session 0 and then a full adventure would pass 80 minutes.

### How the server counts time

The server counts time from the event log alone (ADR-0020), with its own clock. An active interval runs from a session start or resume to the next pause or session end, and the pause event carries the instant of her last activity, so no heartbeat needs logging. ADR-0030 decides when play pauses (REQ-2406, REQ-2408, REQ-2410); an eye exercise or a rest stop never pauses it (REQ-2412). From those intervals the server projects three values:

| Value | What it counts | What it leaves out | Resets |
| --- | --- | --- | --- |
| The day's active time | every active interval of the game day, eye exercises and rest stops included (REQ-0318) | paused time | at 04:00 |
| The eye count | active time since the last eye exercise, the screens without tasks after the finale included (REQ-0338) | eye exercises and rest stops (REQ-0310) | at each eye exercise, and after a pause longer than 5 minutes (REQ-0312) |
| The soft-stop point | 60 minutes of the day's active time, moved to the moment of each «Ещё один ряд» (One more row) plus 20 minutes (REQ-0330) | nothing | at 04:00 |

A game day ends at 04:00 in the time zone of the device she plays on (REQ-0334, a default the requirements step chose). The client sends its IANA time zone name when a session starts. A change of zone takes effect at the next 04:00 of the old zone; I chose this, because a zone changed in the iPad's settings would otherwise open a new game day early, with a new morning's threads.

### Boundaries and the order of timed events

A boundary is the moment after an answer with its review closes, or after a scene ends (RES-0300). The server checks for due events only at a boundary, so no timed event ever interrupts a task. When several are due at one boundary, the first in this order plays and the rest wait for the next boundary, which the first one's own scene ends at:

1. the soft stop;
2. the eye exercise;
3. the offered rest stop;
4. the gentle sequence after an anxiety signal.

Each condition fires once. A due event is a flag, not a queue, so a long task can't pile up several of one kind.

### Eye exercises

When the eye count reaches 20 minutes, an eye exercise plays at the next boundary (REQ-0304). It lasts 35 seconds, which I chose inside REQ-0306's 30 to 40, and ends by itself. The four exercises take turns, looking far out of the window, blinking, tracing a figure eight and covering the eyes with the palms, and the log's last exercise sets the next (REQ-0308). The exercise has no skip unless the parent switched on «Пропустить» (Skip) in the Parent Room, where the setting is off by default (REQ-0314, REQ-0316). On the screens without tasks after the finale every moment is a boundary, so a due exercise plays at once there.

### The soft stop and extensions

When the day's active time reaches the soft-stop point on an unfinished adventure, the soft stop plays at the next boundary as a story scene that offers to save the adventure and continue tomorrow (REQ-0320), beside «Ещё один ряд», each time it comes (REQ-0326). Choosing «Ещё один ряд» continues the adventure with tasks (REQ-0328) and moves the soft-stop point 20 minutes on (REQ-0330); when those run out on an unfinished adventure, the soft stop comes again at the next boundary (REQ-0332). Accepting the offer ends the day's play through a story scene straight away, since the soft stop already stands at a boundary (REQ-0340), and ADR-0030's resume snapshot keeps the open task, scene and rewards. If she comes back on the same game day, the adventure reopens and the soft stop plays at the first boundary, the entry scene, with «Ещё один ряд» offered again.

The game has no daily maximum (REQ-0322, imposed by the owner's decision of 2026-09-27): no rule ends play or withholds a task because of the day's total, and the Parent Room has no setting for one (REQ-0324). The parent settings schema has no field that could hold one.

The Parent Room offers «Закончить на сегодня» (Finish for today) (REQ-0360), behind the PIN of ADR-0180. It writes a `finish_today` event, and the soft stop plays at the next boundary with no «Ещё один ряд» (REQ-0362, REQ-0364). For the rest of that game day the adventure stays closed and only screens without tasks open, which meets REQ-2444 and goes one step further; I chose this, because a parent who ends the day expects it to stay ended.

After the day's finale, and until 04:00, the server sends no task and opens only screens without tasks: the room, the Diary, the forge, the shop and the familiars (REQ-0336).

### Rest stops

The «Привал» (Rest stop) button is on screen throughout play (REQ-0342). A rest stop is a campfire scene with the familiars of 2 to 5 minutes (RES-0300); it ends when she taps on, or by itself after 5 minutes. For 10 minutes of wall-clock time after a rest stop ends, the button stays inactive, with no countdown (REQ-0344); I chose wall-clock time, because a button still grey after an hour away would look broken.

When she answers «Не знаю» (I don't know) three times in a row, the game offers a rest stop through her familiar (REQ-0346) and logs an avoidance signal, with no penalty (REQ-0348). ADR-0070's fatigue signal also offers one (REQ-1106). An offer respects the button's 10-minute wait, which caps offers at one in 10 minutes.

### Anxiety signals

The server detects four anxiety signals (REQ-0350):

- three `alt` outcomes in a row;
- a rising share of rapid guesses: among the session's last 10 first attempts at least 20 %, and at least 15 percentage points above the share among its first 10, which I chose;
- erasing with hesitation: on 2 of the last 3 tasks, 3 or more erasures and a time over twice the template's `fluencyMs`, which I chose;
- «мне страшно» (I'm scared) or «не хочу» (I don't want to) in her free text, which ADR-0110's hand-written triggers find.

On a signal the next task is easy, and a campfire scene or a funny scene follows it (REQ-0350), and the log records the signal for the report's «Ограничения» (Limits) (REQ-0354). The easy task after three `alt` outcomes (REQ-0118) is that same easy task, never a second one. When the three were all «Не знаю», the offered rest stop is the campfire scene. At a second signal in one session, the frontier share falls for the rest of the game day (REQ-0352): I chose at most 40 % of room slots for frontier tasks, against the usual 60 to 70 % (RES-1000), and ADR-0070's selection applies the cap.

### What she never sees

Her screens show no timer, countdown, clock or time bar (REQ-0300). A line that announces an eye exercise, a rest stop, the soft stop or an extension contains no minutes, numbers or hint of a countdown (REQ-0302); ADR-0160's check refuses a digit or a word from a time-word list in that line pool, and the parent judges the pool at ADR-0190's stage acceptance. The sand in the «Мера» (Measure) hourglass symbol is drawn once and never animated (REQ-0356). No hourglass appears in the task window, on a timed event's screen or as a waiting sign; the game waits with ADR-0030's story waiting scene, and no style sets the pointer to `wait` or `progress`, which some systems draw as an hourglass (REQ-0358).

The Parent Room holds the memo on how to talk with the child about the game, as REQ-0142 words it, from the per-language content file (ADR-0160), and ADR-0180 draws it.

### What works once this is accepted

Once this is accepted, a day runs from «В прошлый раз…» to the finale or the soft stop, sized to her pace, with warm-ups, easy tasks, transitions, eye exercises, rest stops, extensions and «Закончить на сегодня», and Session 0 runs on the first day. It works on ADR-0080's attempt flow and ADR-0070's selection. It doesn't yet give story text beyond content lines, since ADR-0110 brings the Master, or rewards and outcomes beyond placeholders, since ADR-0140 brings them. Without ADR-0110 every scene plays its content line from the library.

## Why

The owner decided on 2026-09-26 that the adventure targets 60 minutes of active time and the soft stop comes at 60 minutes (RES-0100, RES-0300), and on 2026-09-27 that the game has no daily maximum (RES-0300). Those decisions fix the soft stop, the extension of 20 minutes and the absence of a cap; this decision says how to meet them.

The plan comes from her pace, because a fixed plan would end at 35 minutes on a fast day and never finish on a slow one, and the draft names the median over 5 days (RES-0100). The room length is fixed at opening and the random easy tasks are drawn in advance, both from seeds, because anything that reacted to her answers would tell her how she did (RES-0100). Transitions ignore the chosen node for the same reason (REQ-0130).

Time counts only on the server and only from the log, because ADR-0030 makes the server decide everything and ADR-0020 makes the log the only truth; a counter on the iPad would reset on a reload and disagree between two devices. Timed events wait for a boundary, because an interruption mid-task spoils the attempt that measures her and its timing (RES-0300).

Nothing on her screens shows time, because the game counts her time for breaks and the soft stop and she must never play against the clock (REQ-0300). The draft's challenge in RES-0300 still holds: story framing hides the number and not the rhythm, so the design removes every number and every moving hourglass, and accepts that she may learn roughly when the eyes come.

The strongest objection is that no rule in the game bounds a day. A child who picks «Ещё один ряд» every time plays 2 or 3 hours, and the design only marks the day for the parent afterwards, at 120 minutes (REQ-2378). Screen-time guidance for children aged 5 to 17 recommends no more than 2 hours of recreational screen time a day (the Canadian 24-Hour Movement Guidelines, in RES-0300). I keep the design, because the owner removed the maximum on 2026-09-27 and a decision can't overrule the owner. What remains bounds a day in practice: her own choice every 20 minutes, an eye exercise every 20 minutes, one new adventure a day, «Закончить на сегодня» for the parent, and iPadOS Screen Time, which the parent can set outside the game.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: a fixed set of tasks a day with no time tracking, and the parent watches the clock | The simplest build, with no hidden timers that could leak | REQ-0100 and REQ-0320 need the game to count active time, and eye exercises every 20 minutes need a counter |
| A visible timer or a progress bar for the session | Predictability: she can plan her time and sees the end coming | She would play against the clock, which REQ-0300 forbids, and a bar grows anxiety on a hard day |
| A hard daily cap, set by the parent or taken from iPadOS Screen Time | A firm bound on the day's screen time | The owner removed the daily maximum on 2026-09-27 (REQ-0322, REQ-0324), and a hard end cuts a task or a scene mid-way; iPadOS Screen Time stays available to the parent outside the game |
| Timers on the device, from `performance.now()` in the client | Precise, and they work offline | They reset on a reload, disagree across two devices and put decisions on the client, against ADR-0030; the device keeps `performance.now()` only for answer timings (RES-0300) |
| A fixed plan, always 3 floors of 2 rooms of 4 tasks | Predictable content and the simplest planner | A slow day never reaches the finale and a fast one ends at about 35 minutes, missing REQ-0100 |

## What it costs

The player pays about 1 minute 45 seconds an hour in eye exercises and one decision every 20 minutes past the first hour. The interruption budget for one hour of play is 3 eye exercises, 1 soft stop, 1 more soft stop for every extension, and at most one offered rest stop in any 10 minutes; nothing else interrupts her, and each condition fires once.

The developer pays a pace model, a seeded plan with precomputed easy tasks and transitions, and three time projections, each with tests. The content author pays line pools for every timed event, checked for numbers and time words.

The parent pays nothing in real time. The game needs the parent for no step: the eye skip is off by default, «Закончить на сегодня» is optional, and a long day shows in the report without anyone acting. Two weeks without the parent lose no data and leave no queue. The cost is that a long day is seen only afterwards.

The security boundary protects two things, ordered by likelihood of damage. First, the parent's settings, «Пропустить» for the eye exercise and «Закончить на сегодня», against the player, which the Parent Room's PIN (ADR-0180) defends. Second, the game day, against the player changing the iPad's time zone or clock to open a new day early, with its morning threads and a new adventure; the server's own clock and the delayed change of zone defend it.

Ceilings: the day's active time has no cap by the owner's decision, and the report marks a day once it passes 120 minutes (REQ-2378, ADR-0180), which is the one report this pile gets. A due timed event is a flag and never a queue. The frontier cap after a second anxiety signal applies once and ends at 04:00. Extensions in a day are unbounded, each by her choice, and each is logged (REQ-2218).

Failure states, each with its next step and one audience:

- `plan_overrun`: the adventure doesn't reach its finale before she accepts the soft stop. It continues the next day, and ADR-0030's three-day rule wraps it up after three adventure days. Audience: the parent, who sees in the report how many days the adventure took.
- `clock_jump`: the server's clock or the device's zone moves by more than a minute during a session. The server logs it and counts intervals from the log's order, never across the jump. Audience: the developer.
- `connection_gap`: the client loses the server. ADR-0030's lease lapses, play pauses at her last activity, and the gap counts as no active time. Audience: the developer, since a gap under-counts screen time.
- `line_refused`: a timed-event line holds a digit or a time word. The verify step fails the content. Audience: the developer.
- `session0_interrupted`: she leaves during Session 0. It resumes at the same step (ADR-0030). Audience: the player.

## What would reverse it

- If the stage 0.2 adult session (REQ-3010) or two weeks of real play show adventures regularly ending before 50 minutes or passing 70 minutes with no extension, the pace model is wrong, and the forecast is reopened.
- If the report marks more than one day a week past 120 minutes over a month, the owner's decision on the daily maximum has a cost the owner should see again; this decision would then carry whatever the owner chooses.
- If she says aloud when an eye exercise or the soft stop is coming, the rhythm leaks time, and the eye interval or the boundary rule is reopened with the owner.
- If the second anxiety signal comes in more than one session a week, 40 % frontier is too high a floor, and the cap is reopened with ADR-0070.

The premortem, written as though it had happened: two months in, the parent found in the weekly report that she had played past two hours on most days. The soft stop came on time, and she tapped «Ещё один ряд» each time, because the story around it was more exciting than the offer to save. The parent hadn't used «Закончить на сегодня», which sat three screens deep in the Parent Room, and the long-day mark reached the parent a week late. A second failure sat in the plan: after a week of illness her 5-day median came from two short sick days, the planner filled 4 floors, and three adventures in a row ran into the next day. The reversal conditions above watch for both.

## Consequences

- ADR-0020's event log gains `day_opened`, `plan_built`, `eye_exercise` (with its kind), `rest_stop_started`, `rest_stop_ended`, `rest_stop_offered`, `soft_stop`, `extension`, `save_accepted`, `finish_today`, `avoidance_signal`, `anxiety_signal` (with its kind), `zone_changed` and `clock_jump`, and every Session 0 event carries `session0: true`.
- ADR-0030's packets carry, at each boundary, the next scene or timed event and whether «Привал» is active, and never a time value.
- ADR-0070 gains the plan to fill, the easy-task schedule, the forecast inputs and the frontier cap after a second anxiety signal.
- ADR-0110 and ADR-0160 must provide the line pools for the knot's announcement, outcome lines, transitions, each timed event, the end of the row and the Parent Room memo.
- ADR-0140 supplies the spell, the growth amounts and the chest for each plan item.
- ADR-0180 draws «Закончить на сегодня», the eye-skip setting and the memo, and marks long days.
- The iPad's own status bar may show its clock in a home-screen web app, which the game can't draw over; the owner hears of it before stage acceptance.

## How I will know it was realised

1. A plan test over 1,000 seeds asserts the adventure's order and every floor's order (REQ-0102, REQ-0104), a warm-up after every entry scene, and room lengths between 3 and 5 that never change after opening.
2. A forecast test feeds synthetic pace histories and asserts a forecast within 60 minutes, a fourth floor only when it fits, and the 75-second default with no history.
3. An easy-task test runs one seed with two different answer sequences and asserts the same random easy tasks at the same places. Over 10,000 seeds it asserts a rate within 1/12 plus or minus 0.01, never two random easy tasks within 5 tasks, one easy task after three `alt` outcomes, and room lengths unchanged.
4. A transition test runs one seed with different node choices and asserts the same sequence of transitions.
5. Time-projection tests replay synthetic logs. They assert that the day's active time includes breaks, and that the eye count excludes them, counts the screens after the finale and resets after a pause longer than 5 minutes. They assert that the soft stop plays at the first boundary at or after the soft-stop point, each extension adds 20 minutes from the moment she chose it, and after `finish_today` no extension is offered and the adventure stays closed until 04:00.
6. A boundary test asserts that no timed event starts while a task is open and that two due events play at two boundaries in the stated order.
7. A Playwright test on the tablet and desktop viewports walks every player screen. It finds no text matching a clock, a countdown or a minute count, no hourglass asset in the task window or on a timed event's screen, and no animation on the «Мера» symbol; a search of the styles finds no `cursor: wait` or `cursor: progress`.
8. ADR-0160's check passes on the timed-event line pool with no digit and no time word, and the parent approves the pool at stage acceptance.
9. A Session 0 test asserts the eight steps in order, the name, cloak colour and focus choices and no look choice, and a knowledge projection identical with and without Session 0's events; the stage 0.2 run times Session 0 at 20 to 25 minutes.
10. A schema test finds no daily-maximum field in the parent settings and the eye skip off by default.
11. Anxiety tests drive each of the four signals and assert an easy task, then a campfire or funny scene, a logged signal, and after a second signal at most 40 % frontier room slots until 04:00.
12. The stage 0.2 adult session plays an adventure of about 60 minutes (REQ-3010).

## What this does not settle

- The task window, its contents and its review: ADR-0080 settles REQ-0106, REQ-0108, REQ-0110 and REQ-0112, because the review and the second attempt live in it.
- When play pauses, the lease, the resume snapshot and the three-day rule: ADR-0030.
- Which floors, rooms and tasks fill the plan, how the forecast trims, the fatigue signal and the rapid-guess threshold: ADR-0070.
- The spell, outcomes, rewards and the amounts at the end of the row: ADR-0140.
- The Master's text and the checks on story lines: ADR-0110; every player-facing string and the forbidden-word list: ADR-0160.
- The Parent Room, its PIN and the report, the long-day mark included: ADR-0180.
- The free mode and Ascents, which the draft defers until after the MVP (RES-0100).
- Whether the iPad's status bar clock can be hidden in a home-screen web app. I haven't verified it for the current iPadOS, and the game can't draw over it; the owner decides whether it matters.

Amended by ADR-0210, ADR-0250, ADR-0280, ADR-0290, ADR-0320 and ADR-0330, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.
