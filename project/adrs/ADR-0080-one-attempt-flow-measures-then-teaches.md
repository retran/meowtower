---
id: ADR-0080
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-0106, REQ-0108, REQ-0110, REQ-0112, REQ-0400, REQ-0402, REQ-0404, REQ-0406, REQ-0408, REQ-0410, REQ-0412, REQ-0414, REQ-0416, REQ-0418, REQ-0420, REQ-0422, REQ-0424, REQ-0426, REQ-0428, REQ-0430, REQ-0432, REQ-0500, REQ-0502, REQ-0504, REQ-0506, REQ-0508, REQ-0510, REQ-0512, REQ-0514, REQ-0516, REQ-0518, REQ-0520, REQ-0522, REQ-0524, REQ-0526, REQ-0528, REQ-0530, REQ-0532, REQ-0534, REQ-0536, REQ-0538, REQ-0540, REQ-0542, REQ-0544, REQ-0546, REQ-0548, REQ-0550, REQ-0552]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0080. Every task runs one attempt flow on the server: an unassisted first attempt measures, then a free short solution, one parallel second attempt and hints paid in guiding threads teach

## Decision

Every task the adventure shows, scored or not, runs one attempt flow that the server owns as a state machine per task, because the client must never learn which tasks are scored (REQ-2428) and a flow that differed by task kind would tell her. The flow has these states:

1. `open`: the task window shows the task and its controls. The server has sent no correct answer, solution step or hint text (REQ-0432). Each tap on the thread button buys the next hint rung, and the first bought rung marks the attempt `assisted: true` with its hint level (REQ-0530).
2. `first_answered`: the server checks the answer (ADR-0040) and gives one outcome, `clean`, `partial` or `alt`, with «Не знаю» (I don't know) giving `alt` (RES-0400). Its reply carries the correct answer for the first time (REQ-0430).
3. `review`: the window stays open and shows the correct answer after every outcome. After `clean` it marks the answer accepted with a dry outcome line (REQ-0402) and offers the short solution under «Как легла нить» (How the thread lay) (REQ-0404). After `partial` or `alt` it shows the short solution at once, with no extra tap (REQ-0408). After every outcome it offers the detailed explanation for 1 guiding thread (REQ-0406, REQ-0528). The window titles the review «Схема узла» (The knot's scheme) (REQ-0112).
4. `twin_open`, only after `alt`: the window shows one second attempt on a parallel task that ADR-0040's generator builds with the same template, subtype and difficulty features and new numbers (REQ-0414, REQ-1224). The event log records it `assisted: true` and links it to the original task (REQ-0420, REQ-2206). After `partial` no twin follows (REQ-0418), because the owner's instruction of 2026-09-27 settled it (RES-0400).
5. `twin_review`: the window shows the correct answer. A correct second answer shows «Нить закреплена» (The thread is secured) (REQ-0422) and earns base experience and no bonus (REQ-0424). A wrong second answer or «Не знаю» shows the parallel task's short solution at once. The flow ends here, with no third attempt (REQ-0416).
6. `closed`: the player taps to leave the window, and the scene plays the first attempt's outcome as a spell (ADR-0090, ADR-0140).

The short solution and the hint rungs come from the template's one solution graph (ADR-0040), so every number in them is the number the engine computed (REQ-0410, REQ-0412, REQ-0536), and no language model is called to build a rung (REQ-0534). The ladder has three rungs (REQ-0532): rung 1 says what the task asks and where to start with no numbers (REQ-0538), rung 2 gives the first step with the task's numbers (REQ-0540) and rung 3 gives every step except the last calculation (REQ-0542). No rung contains the correct answer. For a template whose graph has fewer than three steps, the template author writes rung 2 as the operation and its operands without the result, and rung 3 as a method to reach the result. I chose this, because a one-step times-table fact would otherwise put the answer in rung 2, and this way the three texts still differ and none gives the answer. A bought rung stays visible for the rest of the attempt at no further cost.

The flow runs inside the task window, a flat panel separate from System windows (REQ-0106, REQ-0426). The window holds only the task, the answer field or options, the keypad, «Не знаю», the thread button and «Готово» (Done), with no sprite, effect or story text (REQ-0108), and never shows «верно» (correct), «неверно» (incorrect), «ошибка» (mistake), a tick or a cross (REQ-0110). ADR-0150 draws it and ADR-0160's forbidden-word list checks its strings.

The game has no measurement mode apart from this flow (REQ-0400): the API has no route or flag for one. When the player sees a task's short solution, whether it opened by itself or on request, the server writes a `solution_shown` event, and every later task of the same node on the same game day carries `postFeedback: true` (REQ-0428). A bought hint rung or detailed explanation on the node sets the same mark, because ADR-0060's learning transition reads a walkthrough, an explanation or a hint as feedback alike. A game day ends at 04:00 (ADR-0090), so the mark survives «Сохранить и уйти» (Save and leave) and a resume on the same day, and ends with the day.

Guiding threads are a server-side ledger. The stock is a projection of `thread_granted` and `thread_spent` events in the event log (ADR-0020). The client only displays the number each packet carries in two places: the yarn ball on the game screen (REQ-0546) and the thread button in the task window, which is always drawn with the current count (REQ-0548). Grants follow the table in RES-0500:

| Source | Threads | Who decides it fired |
| --- | --- | --- |
| The first server contact of a game day | 3 (REQ-0500) | ADR-0090's game day |
| A completed daily quest | 1 (REQ-0502) | ADR-0140 |
| A clean row, the streak reaching 3 | 1 (REQ-0504) | ADR-0140 |
| A big clean row, each multiple of 5 | 0 (REQ-0506) | ADR-0140 |
| A story find or a chest find of threads | 1 or 2, from content data (REQ-0508) | ADR-0140 |
| The familiar hatching or evolving | 2 (REQ-0510) | ADR-0140 |
| The backpack pocket | 1, at the moment of need, once per room (REQ-0514) | this decision |

The morning grant isn't back-filled for game days she doesn't open the game; I chose this, because a week away would otherwise return her to a full stock of 30 and teach nothing. Each grant fills the stock up to 30 (REQ-0518), and each thread above 30 turns into 2 buttons in the same event (REQ-0520), with no window, sound or line of its own (REQ-0522); the buttons appear in the next packet's count. The shop has no item that grants threads (REQ-0524).

Each hint rung bought before answering and each detailed explanation bought after answering costs exactly 1 thread, on any task, the second attempt included (REQ-0526, REQ-0528). The short solution costs nothing (REQ-0544). The explanation is sold once per attempt. When the player presses the thread button with a stock of 0, the server gives 1 thread from the backpack pocket and spends it on the action she pressed for, if the pocket hasn't given a thread in this room (REQ-0514). Tasks outside any room, the warm-up, mental arithmetic and the Guardian, share one pocket per floor; I chose this, because REQ-0514 names only rooms and these tasks need the same net. When the stock is 0 and the pocket has given its thread, or when the attempt has no action left to buy, the button stays visible and inactive at `disabled-alpha`, with no words about running out (REQ-0550, REQ-0552). The canon states the pocket's limit in CAN-0030 (REQ-0516), and this decision holds the game to the canon's wording.

A typical day of 28 tasks at a clean share near 0.7 yields 8 to 10 threads (REQ-0512), which a balance check this decision adds to the simulation group of ADR-0190's verify measures; ADR-0140's rate of thread finds is the one knob this decision leaves to tune it.

Once this decision is accepted, a task can be answered, reviewed, retried once and helped with paid hints end to end on the server, with the thread stock correct across leaving and resuming. The flow works before ADR-0090 exists, because a task needs only the task window and a place to return to. It doesn't yet give an outcome its spell, streak or rewards (ADR-0140), a detailed explanation its text (ADR-0120, which falls back to template explanations), or a knowledge estimate from the attempts (ADR-0060).

## Why

One mode must both train and measure, because the owner's draft has no separate measurement mode in the MVP and its MVP section outranks the rest (RES-0400). The first attempt is the only moment that shows what she does alone, so everything that teaches comes after it. Feedback after a correct answer helps retention of answers the learner was unsure of (Butler, Karpicke and Roediger 2008, in RES-0400), and elaborated feedback beats a bare verdict (Shute 2008, in RES-0400).

The flow lives on the server, because ADR-0030 makes the server decide everything and the correct answer must not reach the client before the first attempt (REQ-0432, RES-2400 conclusion 22). The same flow for every task follows from REQ-2428: a warm-up or an easy task that skipped the twin after `alt` would tell her it was unscored.

The review sequence per outcome is RES-0400's resolved table: `clean` gets the scheme on request, `partial` gets it at once and no twin, `alt` gets it at once and one twin. The twin exists only after `alt` because a twin costs about a minute of a 60-minute adventure and, after a nearly right answer, retrains a method she already used (RES-0400, the owner's instruction of 2026-09-27).

Hints are paid, because free hints on every task would cost most of the unassisted observations: Aleven, McLaren, Roll and Koedinger (2006) found 72 % of student actions in a Cognitive Tutor data set were unproductive help seeking (RES-0500). They are paid generously, about 8 to 10 threads a day, with a pocket thread once per room, so she never saves threads while stuck (RES-0500). The short solution stays free, because an empty stock must leave her without the hint ladder and the familiar's explanation and never without help (REQ-0544).

Hints come from code and never from a model, because a hint is read before the attempt that measures her, and a model's mistake there would mislead that attempt (REQ-0534). ADR-0040 already builds the short solution from the solution graph, so the rungs from the same graph cost one function per template (RES-1200, `hints(p)`).

The ledger is a projection of events, because ADR-0020 makes the event log the only truth, and a counter kept apart from the log could drift from what the report shows the parent.

The strongest objection is that the price doesn't limit help seeking. She earns about 10 threads a day against 28 to 44 tasks (RES-1000) and can hold 30, so she can buy a rung on a third of the day's tasks and rarely meets an empty stock. Measurement then rests on the `assisted` flag and on REQ-1128's flag to the parent when «Не знаю» and hints pass 30 % of first attempts, and not on the price. I accept this: the flag keeps an assisted attempt out of the estimate of what she does alone (REQ-0922), so a generous price costs observations but never corrupts one, and the draft chose generosity on purpose. The reversal condition below watches for the case where it costs too many.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: show the outcome and move on, with no review, twin or hints | The shortest room and the cleanest measure, since no feedback confounds later tasks of the node | The game would train nothing, which breaks REQ-0400's one mode that trains and measures, and a wrong answer would leave her with no way forward |
| A separate measurement mode, with free help in daily practice | Clean measurement with no `postFeedback` confound, and help with no price | The MVP has no separate mode (RES-0400), and a second mode needs its own sessions in a 60-minute day that already holds 25 to 35 first attempts (RES-0100) |
| Unlimited free hints, the literal reading of the design's «нитей всегда хватает» (there are always enough threads) | No currency to explain, and the button always works | 72 % unproductive help seeking in Aleven and colleagues (2006) would take most unassisted observations (RES-0500) |
| Hints written by a language model from her answer | Natural text that addresses her actual step | A model's error before the answer misleads the measuring attempt (REQ-0534), and a model call adds seconds and cost to a tap she makes while stuck |
| Retry until correct, a mastery loop with a twin after every miss | Every task ends in success, and practice is maximal | Each extra attempt costs about a minute and tells the model little about what she does alone; REQ-0416 and REQ-0418 forbid a third attempt and a twin after `partial` |

## What it costs

The player pays about a minute for each `alt` outcome, for the twin (RES-0400). At a clean share near 0.7 with 28 to 44 scored tasks, at most 8 to 13 first attempts miss, and only the `alt` ones among them bring a twin. RES-1000's session budget already counts that time: "reviews and second attempts take about a fifth of task time".

The template author pays three hint texts per template, a parallel-task sampler and the one- or two-step rule for rungs, and each template's test must pass the rung checks below over many seeds. A template that can't meet them doesn't ship (ADR-0040).

The knowledge model pays a confound: tasks after a review carry `postFeedback: true`, and ADR-0060 must model learning from the walkthrough or read those tasks as weaker evidence.

The parent pays reading two accuracies, before and after the walkthrough (RES-0400 conclusion 12, ADR-0180). The parent is never needed in real time: no step of this flow waits for the parent, and two weeks without the parent lose nothing and queue nothing.

The security boundary protects the measure of what she does alone. These threats come in order of the likelihood of damage:

1. A client or packet bug leaks the answer, a solution step or a rung before the first attempt. REQ-0432 and the packet test below guard it.
2. The player reads packets in the desktop browser's developer tools. Only the server's refusal to send those fields before the first attempt defends it.
3. A replayed request spends threads twice or fetches a different twin. ADR-0030's `clientSeq` idempotency defends it (REQ-2422, REQ-2426, REQ-0214).

The thread stock is written only by the server, so a client can't grant itself threads.

Ceilings: the stock stops at 30, and the surplus drains into buttons automatically. An attempt holds at most 3 rungs and 1 explanation, so a task spends at most 8 threads across both attempts. The pocket gives at most one thread per room and one per floor outside rooms, about 12 on a day of 4 floors with 2 rooms each, and in practice few, since a stock near 30 rarely reaches 0. `postFeedback` marks empty at 04:00.

Failure states, each with its next step and one audience:

- `twin_unavailable`: ADR-0040's generator can't build a parallel task with the same difficulty features within its retry limit. The server skips the twin, closes the review as it does after `partial` and logs the event. Audience: the developer, through the verify step's count of these events.
- `thread_refused`: a spend arrives with a stock of 0 and the room's pocket used, from a client that drew the button before the stock changed. The server charges nothing, reveals nothing and returns the current count, so the button turns inactive. Audience: the player, who sees only the inactive button.
- `offline`: the client has no connection. The hint, explanation and second-attempt controls stay inactive (REQ-2436) and ADR-0030's waiting scene shows. Audience: the player.
- `explanation_fallback`: the explanation model fails or passes 10 seconds. ADR-0120 serves the template explanation, and the thread is spent once. Audience: the owner, in the model call log (ADR-0100), where ADR-0120 records the reason.

A client that loses a reply and resends it gets the same state back, and a resumed review, explanation or twin never charges again (REQ-0214). Two devices can't spend at once, because ADR-0030 gives one device the lease.

## What would reverse it

- If assisted first attempts pass 30 % of first attempts, averaged over 7 adventures, the thread supply is too generous for measurement, and the morning grant or the pocket rule is reopened. The 30 % comes from REQ-1128's flag.
- If the balance simulation shows a typical day yields more than 10 threads with thread finds at their lowest content rate, REQ-0512 and RES-0500's own estimate of 10 to 11 threads a day disagree, and the owner chooses between the range and a source amount.
- If `twin_unavailable` fires on more than 1 % of `alt` outcomes in the simulation, the parallel-task rule is too strict for some templates and ADR-0040 is reopened for them.
- If `alt` outcomes with «Не знаю» on the first attempt rise from week to week while the twin's accuracy stays high, she is using «Не знаю» to reach the walkthrough, and the twin's base experience (REQ-0424) is reopened.

The premortem, written as though it had happened: six months in, the report showed her times-table nodes as fluent while her school marks said otherwise. The cause was rung 2 on one-step templates, which named the operation and the result, so a single bought rung gave the answer, and the attempt was recorded as assisted but the check that no rung holds the answer covered only multi-step templates. A second cause sat in the ledger: the stock stayed at 30 for weeks, so the price meant nothing, and nobody watched the assisted share until the parent's flag fired. The checks below exist for both.

## Consequences

- ADR-0020's event log gains `attempt_submitted` (with `attempt: 1 | 2`, `assisted`, `hintLevel`, `dontKnow`, `postFeedback` and the link to the original task), `hint_shown`, `explanation_bought`, `solution_shown`, `twin_unavailable`, `thread_granted` (with source, amount to stock and buttons from surplus), `thread_spent` and `pocket_thread_given`.
- ADR-0030's API gains a hint route, an explanation route and a second-attempt route, each idempotent by `clientSeq`, and every packet carries the thread count and whether the thread button is active.
- ADR-0040's template interface must provide `hints(p)` with three texts, `solution(p)` and `sampleParallel(p, rng)`, all from one graph.
- ADR-0060 reads only unassisted first attempts for the estimate of what she does alone and must use the `postFeedback` mark.
- ADR-0140 fires the grants in the table and computes the outcome, streak and bonuses from first attempts only (REQ-1702, REQ-1704).
- ADR-0160's forbidden-word list gains the task-window words of REQ-0110 and words about running out of threads (REQ-0552).
- The owner's CAN-0030 must keep stating the pocket's limit; a change to the rule changes the canon in the same commit.

## How I will know it was realised

1. A state-machine test drives each of four cases: `clean`, `partial`, `alt` from a wrong answer and `alt` from «Не знаю». It asserts the states and window contents of the table in RES-0400, with no twin after `clean` or `partial` and no third attempt after any twin.
2. A packet test sends every task kind: warm-up, mental arithmetic, room task, easy task and Guardian. It asserts that no packet before the first answer carries the correct answer, a solution step or a rung the player didn't buy, and that the flow's states are the same for scored and unscored tasks.
3. A template test runs every template over 1,000 seeds. It asserts three distinct rung texts, no digit in rung 1 and no rung containing the correct answer. It asserts that every number in rungs 2 and 3 and in the short solution is among the graph's computed values, and that each seed yields a parallel task with the same difficulty features and different numbers.
4. A ledger property test applies random sequences of grants, spends, pocket draws and resumes. It asserts that the stock never exceeds 30 or falls below 0, each thread above 30 adds exactly 2 buttons, a pocket gives at most one thread per room, and a repeated `clientSeq` never charges twice.
5. A Playwright test on the tablet viewport shows the short solution without a tap after `alt` and `partial`, the thread button with its count in every state, and the button inactive with no text change at stock 0 after the pocket's thread.
6. The balance check in ADR-0190's simulation group, on a typical day of 28 tasks at a clean share near 0.7, reports a thread yield between 8 and 10.
7. A search of the API schemas finds no route or flag for a measurement mode, and a search of the shop's content data finds no item that grants threads.
8. A read of CAN-0030 finds the pocket's limit stated as REQ-0516 words it.

## What this does not settle

- What a first attempt's outcome gives in the game, the spell, streak, clean rows, bonuses and chests: ADR-0140. Whether an assisted first attempt still counts towards the streak and bonuses belongs there too.
- How the estimate uses unassisted, assisted and `postFeedback` attempts, and what counts as a rapid guess: ADR-0060 and ADR-0070.
- How tasks, solution graphs, parallel tasks and answer checking are built: ADR-0040.
- The text and model of the detailed explanation: ADR-0120.
- The task window's look, the yarn ball and the badges: ADR-0150; the strings: ADR-0160.
- How the adventure places tasks, warm-ups and easy tasks, and the System's announcement before a task and outcome line after it: ADR-0090.
- The report's before and after accuracies and the help-seeking flag: ADR-0180 and ADR-0070.
- Tasks that hide the answer, which the draft defers to Ascents after the MVP (RES-0400).

Amended by ADR-0210, ADR-0220, ADR-0230, ADR-0240, ADR-0260, ADR-0270, ADR-0280, ADR-0290, ADR-0300 and ADR-0330, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
