---
id: ADR-0070
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-0820, REQ-0822, REQ-0832, REQ-0956, REQ-0958, REQ-0966, REQ-0970, REQ-0972, REQ-0974, REQ-0978, REQ-1000, REQ-1002, REQ-1004, REQ-1006, REQ-1008, REQ-1010, REQ-1012, REQ-1014, REQ-1016, REQ-1018, REQ-1020, REQ-1022, REQ-1024, REQ-1026, REQ-1028, REQ-1030, REQ-1032, REQ-1034, REQ-1036, REQ-1038, REQ-1040, REQ-1042, REQ-1044, REQ-1046, REQ-1048, REQ-1050, REQ-1052, REQ-1054, REQ-1056, REQ-1100, REQ-1102, REQ-1104, REQ-1106, REQ-1108, REQ-1110, REQ-1112, REQ-1114, REQ-1116, REQ-1118, REQ-1120, REQ-1122, REQ-1124, REQ-1126, REQ-1128, REQ-1130, REQ-1132]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0070. The Director fills each slot by information value inside a flow corridor, a three-day domain window and spaced review, and guards the measurement against repeats, fatigue and rapid guesses

## Decision

The Director is a set of pure TypeScript functions in `src/engine/director/`, which the server's adventure loop (ADR-0030) calls at three moments: `planDay` when an adventure starts, `planFloor` before each floor and `nextTask` before each slot. Each function reads the projections of ADR-0060 (estimates, states and `node_obligations`), the skill graph of ADR-0050, the session facts it computes from the log, and its own parameters in `content/director.v1.json`. Where a rule asks for chance, the function draws from a seed made of the adventure identifier and the slot number, so a replay of the log gives the same choice. Every choice goes into the `item_shown` event with its `purpose`, its `flowSlot` and a `why` field listing the value terms that decided it, so the owner can audit any choice and the simulation can replay it.

The same module guards the measurement: it marks rapid guesses, raises the fatigue signal, keeps generated tasks from repeating and computes the flags the parent sees. ADR-0060 applies the marks to the estimates, and ADR-0180 draws the flags.

### The day plan

`planDay` builds a route of 3 maths floors, or 4 when the forecast leaves time, by the three-day window (RES-1000, RES-3900):

- A domain is one of the 8 maths domains with a floor: N, A, F, D, P, M, G and S. Word problems (T) reach play through the Guardian (RES-3900).
- The route first takes each domain that has had no completed floor for 2 adventure days in a row (REQ-1026). It then fills the remaining places by the total value of each domain's nodes, due reviews and parent topics included.
- The window counts only floors the player completed, read from the `floor_outcome` events of ADR-0140, and counts adventure days, the game days on which an adventure ran (REQ-1054). With these two rules and 3 floors a day, every domain gets its floor in any 3 consecutive adventure days (REQ-1024), as long as each day completes 3 floors.
- The floor order alternates heavy and light domains and changes from day to day. I chose A, F, D and P as heavy, the four domains of written calculation, and N, M, G and S as light; the list is data in `content/director.v1.json`.
- The route gives the Observatory a short visit, a scene and 2 to 3 science questions, at least once in any 3 consecutive adventure days, as RES-1000 and RES-0100 set; no requirement fixes this, so I carry the research's rule. `planDay` gives each science slot the topic from E1 to E5 asked longest ago, and ADR-0130 picks the question.

Each floor opens with its scene, an ungraded warm-up and 2 mental arithmetic tasks, then its rooms of 3 to 5 tasks (RES-1000, RES-3900). Mental arithmetic picks its nodes by value among the mental subtypes near the floor's domain, and a node in «Устойчиво» (stable) enters it no more than once in any 7 consecutive days (REQ-0832). The adventure holds 2 control facts at its start and 2 at its end (REQ-1038); each extension adds 2 more (RES-1300). A Guardian task comes on about one floor in three.

### Filling a room slot

Every room slot comes from one of three sources, frontier, review or parent topic, recorded in `flowSlot` (REQ-1000). Before each slot, `nextTask` computes the success share over the last 10 graded first attempts, across adventure boundaries, counting `clean` as 1, `partial` as 0,5 and `alt` as 0. Mental arithmetic and control facts count. With fewer than 10 in the whole log, the share uses what exists, and with none it counts as inside the corridor, a default I chose.

| Share | Slot | Requirement |
| --- | --- | --- |
| below 0,70 | review | REQ-1006 |
| above 0,80 | frontier | REQ-1008 |
| 0,70 to 0,80 | review when the adventure's review count among such slots is below `0.35 * (n + 1)` rounded half up, else frontier, where `n` is the number of such slots so far | REQ-1010 |

The deficit rule keeps the review share of in-corridor slots between 30 % and 40 % once an adventure has 8 or more of them; with fewer, whole slots can't always land in the band (at 7 the rule gives 2 of 7, 29 %), and I read REQ-1010 as a share over the adventure.

A review task comes from a node whose tested state is «Бегло» (fluent) or «Устойчиво» (stable) and whose expected chance of success is at least 0,85 (REQ-1012). An inferred state doesn't qualify, because the island checks already test inferred nodes. The expected chance is `pKnow * (1 - pSlip) + (1 - pKnow) * pGuess` for the subtype the task will use, forgotten to now, which gives the correction for the subtype RES-1000 left open. Among eligible nodes the Director takes the one unchecked for longest, by `lastSeen`, ties by node identifier (REQ-1014). A review whose domain is off today's route waits for its floor, which the window keeps to at most 2 days. The review task has `purpose: review`, is graded, and ADR-0060 counts it like any other observation (REQ-1018). The API never sends `purpose`, `flowSlot` or `why` to the client, and a review task uses the same room, frame and screen as any other task, so it looks ordinary to the player (REQ-1016). A schema test in ADR-0030's API checks that no response carries those fields.

When no node is eligible for review, the Director takes, in this order, a cold-start review node (below), then the frontier candidate with the highest expected chance of success, and writes `no_review_candidate` in the `why` field.

A frontier slot takes the candidate node of highest value (REQ-1002), with the formula and weights of RES-1000 in `content/director.v1.json`:

```text
value(v) = 2.0 * uncertainty(v) + 1.5 * staleness(v) + 1.5 * frontier(v)
         + 2.0 * recheck(v) + 1.5 * escalation(v) + 1.0 * stretch(v)
         + 1.5 * spaced_review(v) + 1.5 * parent_topic(v) - 1.0 * recent_shows(v)
```

I fixed the three points RES-1000 left open. Staleness divides the days since `lastSeen` by 7 for a frontier node and by 14 for every other node, capped at 1. I extended the 14 of fluent nodes to the rest, because a node neither on the frontier nor fluent is waiting for evidence as long as a fluent one. A node with a lesson mark scores the larger of `recheck` and `parent_topic`, never both, because both come from one mark and a double count of 3.5 would outrank an open escalation. The `escalation` term is 1 for every obligation row of ADR-0060 that asks for evidence on the node: an open escalation, an owed probe or a queued island failure.

The candidate set holds the frontier nodes as RES-1000 defines them, the uncertain nodes, the nodes with obligations, admitted stretch nodes and every stale node. It leaves out every node cut off by a node X until X is tested again, except for an island check (REQ-0966). A stretch node joins the candidate set only when each of its prerequisites and each node in its gate, read from ADR-0050's `stretchGate`, is fluent or stable by a tested result, a probe or a full block, never by inference (REQ-0820). It takes no more than 2 tasks in an adventure day, counted across sessions of that day (REQ-1004). When its probe leaves its state open, the node takes both stretch tasks of each adventure day until its full block forms, so the block of 5 needs 3 adventure days and completes within 7 days of the probe whenever she plays on 3 of them (REQ-0822).

A parent-topic slot takes a node with a fresh lesson mark, capped at 4 such tasks a day for the first 1 to 3 days after the mark (RES-1000, RES-1400). The recheck blocks of ADR-0180, a full block in each recheck window, come through the `recheck` term as frontier tasks with `purpose: recheck` and sit outside that cap. ADR-0180 asked whether a recheck block may exceed the cap: with a block of 5 tasks and a cap of 4, a recheck couldn't finish in one day otherwise, so I decided that it does.

The Director keeps a chosen node for 2 to 5 tasks, the probe or block it owes, and may alternate them with tasks of a neighbouring node so fatigue doesn't fall on one node (RES-1000).

### Honest difficulty

The Director never chooses a task to make the player fail, and never gives a task it knows is too hard to balance the success share (REQ-1020, REQ-1022). The code keeps both rules by construction, because the flow share decides only whether the slot is frontier or review, and never which frontier node is picked. A property test checks it: for any fixed state, `nextTask` picks the same frontier node whatever the success share, and no term of the value formula rises as the expected chance of success falls.

### The Director's obligations from the knowledge model

The Director acts on each kind of row in `node_obligations`:

- An escalation after a probe short of "fluent (probe)" raises the node through the `escalation` term until a full block forms (REQ-0956).
- A probe scoring 0 out of 2 makes the node's block the first frontier choice of every following slot of the session until it completes (REQ-0958). The Director adds a room to the current floor if needed and never trims it. If the session ends first, the block takes the first frontier slots of the next session.
- An "understands" state gives each direct descendant one owed probe, raised by the `escalation` term (REQ-0970).
- Each adventure day holds 1 or 2 island checks, a count drawn from the seed, each a probe of a node drawn at random from those in "fluent (inferred)" or cut off (REQ-0972). The Director draws first from nodes whose domain is on the route; when none is, it places the probe in a room of the day's first floor. When the whole graph has no such node, the day has no island check and the `why` field of the first room records `no_island_candidate`.
- A failed island check queues the node and its prerequisites, which the `escalation` term then raises (REQ-0974).
- A stale node, one whose last unassisted first attempt is more than 30 days old, joins the candidate set whatever its frontier status, and among equal values it goes first, oldest first (REQ-0978). Its staleness term is already at its cap of 1.

### The Guardian's ladder of the day

The Guardian's first task of a day has k + 1 steps, where k is the largest number for which T_k is fluent or stable, inferred states included (REQ-1028). After a `clean` outcome the next Guardian task that day has k + 2 steps, at most 4, and k steps after any other outcome (REQ-1030). When no T node is fluent or stable, and throughout cold start, the first Guardian task of the day has 1 step (REQ-1032). A k of 0 after a non-clean outcome gives 1 step, because a task has at least one.

### Cold start

Cold start lasts from the first adventure until fewer than half of the 1F and 1S nodes remain unchecked or the 10th adventure ends, whichever comes first. During it the Director probes each domain's prerequisite chain from a node whose typical group in the graph is 7 or 8 downwards, going lower only after a probe escalates, by a binary search to the middle of the chain below (REQ-1034). The nodes N1 to N3, A1 to A4 and F1 serve as review tasks while estimates are few (REQ-1036). After cold start the value formula alone ranks the frontier.

### Volume, trimming and extensions

The Director reads the volume forecast of ADR-0090, built from the median pace of the last 5 adventure days, and recomputes it from the actual pace before each floor (REQ-1048). When the forecast shows the adventure won't fit before the soft stop at 60 minutes of active time, it trims in a fixed order (REQ-1050). It first cuts the number of rooms on a floor, down to one, then the length of new rooms, down to 3 tasks, and only then moves the route's fourth floor to the next day. It never trims mental arithmetic, control facts, or the last room on a floor with an open probe or escalation (REQ-1052).

The plan aims at 30 graded first attempts and never plans fewer than 28, or 25 once rooms are trimmed for a slow pace (REQ-1040). An adventure that stops before its plan is done, at the soft stop or by the parent's «Закончить на сегодня» (Finish for today), isn't complete, and resumes the next game day from the same place (RES-1000, ADR-0090). The timed simulation of stage 0.1 checks the minimums at 1.0 and 1.5 times the fluency threshold on a 60-minute adventure (RES-3000).

Story takes at most 10 minutes of the adventure's active time (REQ-1042). The Director measures story time from the scene events of the log and gives each scene order a duration budget from what remains; once the 10 minutes are spent, every remaining scene takes its shortest form, which ADR-0110 supplies.

An extension adds only rooms chosen by value on floors already on the route, and never opens a new floor (REQ-1044, REQ-1046).

### Guards on the measurement

The generator of ADR-0040 asks the Director's reject predicate before it accepts parameters. The predicate refuses a template and parameter hash shown within the window, which ends at whichever comes first: 30 days, or the next shows of the subtype numbering 20 % of the subtype's parameter space (REQ-1100). Times-table facts, addition to 20 and control facts are exempt, because repeats there measure automaticity. Each template has to declare its parameter space size per subtype for the predicate to work. When ADR-0040's generator exhausts its 1,000 candidates, it takes its fallback, and the Director logs `repeat_forced`.

The projection `subtype_exposure` counts, for each subtype, the tasks shown and the accuracy of unassisted first attempts before and after the player first saw a walkthrough on that subtype. ADR-0180 draws it beside the subtype's accuracy (REQ-1102).

The fatigue signal fires when, and only when, the median answer time at a control-fact point exceeds 1.5 times the median at the adventure's opening point, whatever the accuracy (REQ-1104). The points are the opening pair, the closing pair and each extension's pair, and the times exclude background, pause, eye exercise and rest stop time (RES-1300). When the signal fires, the Director sends the story a rest-stop offer, which ADR-0090 turns into a scene (REQ-1106). Every later first attempt of that session carries weight 0,5 (REQ-1108), and ADR-0060 keeps a block holding such attempts from giving "not mastered" when the block would score higher without them (REQ-1110). The weight lasts until the session ends, the default the requirements step chose.

An answer is a rapid guess when it arrives faster than its template's minimum time, measured on the client from the task's appearance to «Готово» (Done), without pauses (REQ-1112). An attempt ADR-0030 flags `interrupted` or `crossDevice` has no usable time and is never a rapid guess. The minimum time is:

- `max(1500 ms, min(0.15 * fluencyMs, 10,000 ms))` plus the motor correction, for a template outside the small spaces (REQ-1114);
- the motor correction plus 600 ms for a times-table fact, an addition fact to 20 or a control fact (REQ-1116).

The motor correction is the player's median time per key press in the pure-input tasks of Session 0 on the device type in use, from the latest calibration version of ADR-0180, times the key presses of the correct answer, «Готово» included (REQ-1118). It is 0 on a device type with no Session 0 yet (REQ-1120). The server writes `rapidGuess: true` on the verdict event, ADR-0060 keeps the attempt out of every estimate and block (REQ-1122), ADR-0140 pays it no bonus, and the Director adds one task of the same node later in the session in its place.

When rapid guesses exceed 15 % of a session's answers, the Director enters raised mode for the rest of the session and for the next session (REQ-1124), and the session gets a `rapid_guess_flag` for the report (REQ-1126). The help-share test compares «Не знаю» (I don't know) and hints before the answer with the adventure's first attempts. When they exceed 30 % of them and exceed their mean share over up to 7 earlier adventures by at least 10 percentage points, the adventure gets a `help_share_flag` (REQ-1128) and the next adventure runs in raised mode (REQ-1130). In the first adventure the 30 % test alone applies.

Raised mode sets the review target inside the corridor to 40 %, the top of the REQ-1010 band, in place of 35 %, and makes the item builder choose a free-input template wherever a subtype has one. Below the corridor every slot is review already, and above it every slot is frontier, so raised mode can't add review there without breaking REQ-1006 and REQ-1008.

### The simulation

`tools/simulate.ts` plays synthetic profiles through the Director and the model of ADR-0060 with a simulated clock. Its 30-day run under the planned frontier budget must classify at least 90 % of the simulated nodes into their true state (REQ-1056, RES-3900). Its "guesses" profile and its "rushes for bonuses" profile, which answers faster than the minimum time in 30 % of tasks, must each raise node estimates by no more than 5 percentage points over the same profile without guessing (REQ-1132). ADR-0190's verify command runs both.

### Budgets

I chose these budgets; no outside limit imposes them, and they stand in the Baselines table of ADR-0190. `nextTask` answers within 100 ms at the 95th percentile on the family Mac, because the player waits for it between tasks, and RES-1000 budgets 4 seconds of transition a task. `planDay` and `planFloor` answer within 1 s, behind the floor's entry scene.

### What works once this is accepted, and what doesn't yet

Once accepted, the server can plan an adventure of the day, fill every slot, mark rapid guesses, raise the fatigue signal and compute the flags, and the simulation can play 30 days on synthetic profiles and report classification accuracy. It works with ADR-0060 alone below it: without ADR-0180 the log holds no lesson marks, so the recheck and parent-topic terms stay 0, and the motor correction is 0. Without ADR-0090 the rest-stop offer and the scene budget go to a stub that logs them, and without ADR-0110 a scene has no shortest form, so the story cap is logged but not enforced.

## Why

RES-1000 recorded this Director almost whole: the three sources, the value formula, the flow corridor, the three-day window, the Guardian's ladder, cold start, the trim order and the budget. RES-1100 recorded the guards: the repeat window, the fatigue signal from time alone and the rapid-guess threshold. I fix here what the research left open and place each rule in code the simulation can replay.

The flow corridor exists because one session has to measure and keep the player succeeding. RES-1000 chose to let the share change only the proportion of review, so a frontier choice is always made for its information, and that is what lets a test check the honesty rules.

The rapid-guess threshold follows the normative-threshold method of Wise and Ma (2012) through RES-1100: 0.15 of the fluency threshold is about 10 % of her expected time, capped at 10 s, with a floor of 1500 ms for reading the task. The fatigue signal uses time alone so that a hard task or a run of `alt` outcomes, which the anxiety signal watches, doesn't look like fatigue (RES-1100).

I made the Director pure and seeded because ADR-0020 makes the log the only truth: a choice that can't be replayed from the log can't be audited, simulated or tested.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: a fixed order through the graph, one domain a day | Predictable, and the parent can see tomorrow's topic | Measures nodes she knows as often as nodes she doesn't, has no spaced review, and can't meet the 90 % classification of REQ-1056 in 30 days with 9 to 14 frontier tasks a day |
| Computerised adaptive testing by maximum information, with no flow corridor | Classifies nodes in the fewest tasks | Tasks aimed at the edge of her knowledge succeed about half the time; RES-1000 keeps the share near 70-80 % so the game stays a game |
| A learned policy, such as a multi-armed bandit over expected learning gain | Adapts its own weights to her without hand tuning | One child gives too few rewards to learn from, the parent can't read why a task was chosen, and a policy that learns from success could learn to engineer failure, which REQ-1020 forbids |
| The parent plans each day's topics | The parent decides and can match the school week | Needs the parent every day; D22 asks the design to survive two weeks without them, and lesson marks already give the parent a voice |
| A fatigue signal from falling accuracy, or rapid guesses by fixed 3 to 10 s thresholds (Wise and Kong 2005) | Needs no control facts, or no timing data | RES-1100 rejected both: accuracy confuses fatigue with a hard task, and fixed thresholds ignore that a four-step word problem needs more thought than its length shows |

## What it costs

The frontier gets 9 to 14 tasks a day (RES-1000), because review takes about a third of room slots and reviews of mistakes about a fifth of task time. Cold start therefore takes 7 to 10 adventures, and a block often spreads over 2 to 3 days. The player pays in diagnosis speed; the parent waits longer for a full map.

The owner pays in tuning. `content/director.v1.json` holds about 20 numbers the research set by judgement, and the simulation is the only way to test them before she plays. If the owner attends to nothing for a month, or for two weeks as D22 asks, the Director keeps running on v1 and nothing queues: it has no approval step and raises no alert a person must answer. The flags wait in the report until the parent opens it.

The parent reads two flags that may fire on an ordinary bad day. Each flag fires once per session or adventure and says what the Director did about it, so the parent reads what already happened and has no step to take (D15).

Templates pay one more declaration each: the size of their parameter space per subtype, for the repeat window, which ADR-0040 asks for as `spaceSize`.

What accumulates stays bounded. The obligation list is a set keyed by node and kind (ADR-0060). The repeat window reads the last 30 days of the `items_view` projection, which ADR-0020 rebuilds from the log, so it holds no store of its own. The `why` field adds about 200 bytes to each `item_shown` event, about 10 KB a day.

## What would reverse it

- The 30-day simulation classifies fewer than 90 % of nodes correctly on any profile after two rounds of weight tuning. The flow corridor or the frontier budget would then have to give way, and the owner would decide which.
- In the first month of real play, the session success share leaves 0,65 to 0,85 on more than a quarter of sessions after cold start (RES-2900's range, which ADR-0190 checks). The corridor then isn't holding, and the value formula needs a success term.
- The fatigue signal fires on more than half of the extensions she plays, or on none of 20. Its 1.5 ratio would then be measuring something other than fatigue.
- Rapid guesses exceed 15 % of a session in more than a quarter of sessions after Session 0. The minimum times would then be too high for her, and the owner would revise them from her data.

## Consequences

- ADR-0030's adventure loop calls `planDay`, `planFloor` and `nextTask`, sends none of `purpose`, `flowSlot` or `why`, and records the client's answer time for the rapid-guess test.
- ADR-0040's templates declare their parameter space size per subtype, and the generator takes the Director's reject predicate, which ADR-0040 already provides for.
- ADR-0060 applies the `rapidGuess` mark and the 0,5 weight, and writes `node_obligations`.
- ADR-0090 turns the rest-stop offer and the scene budget into story, owns the soft stop and the game day, and sets the anxiety signal's cap on the frontier share (REQ-0352), which `nextTask` takes as an input.
- ADR-0110 gives every scene a shortest form for the story cap.
- ADR-0140 records floor completion and pays nothing for a rapid guess.
- ADR-0180 draws `subtype_exposure`, `rapid_guess_flag` and `help_share_flag`, and supplies the lesson windows and the motor calibration versions.
- ADR-0190's verify command runs the simulation, the honesty property test and the API schema test.
- `src/engine/director/`, `content/director.v1.json` and `tools/simulate.ts` are new work.

The failure states the Director can reach, each with its next step and its one audience:

| Failure state | What happens next | Audience |
| --- | --- | --- |
| `no_review_candidate` | The slot falls back to a cold-start review node, then to the likeliest frontier candidate; the `why` field records it | the owner, through the simulation and the log |
| `no_island_candidate` | The day runs without an island check; the `why` field records it | the owner |
| `domain_window_missed` | A domain went 3 adventure days without a completed floor, because she stopped early; the next route takes it first | the owner |
| `repeat_forced` | The generator took its fallback parameters and a repeat may show | the owner |
| `graded_minimum_missed` | An adventure closed with fewer graded first attempts than its minimum; the log records it and the simulation counts it | the owner |
| `rapid_guess_flag`, `help_share_flag` | Raised mode runs; the report shows the flag once | the parent |

The player never sees a failure state: each one leaves her a task to answer. The fatigue signal reaches her only as a rest stop in the story.

The security boundary protects the measurement from the player's side and the diagnosis from leaving the server. In order of likelihood:

1. The player learns which tasks don't count. The client never receives `purpose`, `flowSlot` or `why`, and a review task looks like any other.
2. The player learns to game the timing, answering slightly above the minimum time. The rapid-guess rule can't stop a slow guess, and ADR-0140 records it as the strongest objection to bonuses; the simulation's bonus profile measures the damage.
3. A modified client reports false times. The server trusts the client's times, because they exclude network delay and pauses; I don't defend against a child rewriting the web app, the least likely case.

## How I will know it was realised

1. Replaying the log of any simulated adventure through `planDay`, `planFloor` and `nextTask` gives the same node, subtype and purpose for every slot.
2. A property test over random states finds no case where the success share changes which frontier node `nextTask` picks.
3. In a simulated adventure with a success share held below 0,70, every room slot is review, and above 0,80 every one is frontier. Inside the corridor, 30 % to 40 % of those slots are review once the adventure has 8 or more of them.
4. In a 90-day simulation every 3 consecutive adventure days with 3 completed floors each give all 8 domains a floor, and a domain missing for 2 days opens the next route.
5. Every simulated day gives a stretch node at most 2 tasks and a cut-off node tasks only in an island check, and every day with a candidate holds 1 or 2 island checks.
6. After a probe of 0 out of 2, the node's full block completes in the same session in every simulated case where 5 or more slots remain.
7. The Guardian's step counts follow k + 1, k + 2 capped at 4, and k, with 1 step throughout cold start.
8. The 30-day simulation classifies at least 90 % of nodes into their true state on every profile, and the guessing and bonus-rushing profiles raise estimates by no more than 5 percentage points.
9. The timed simulation gives at least 28 graded first attempts at 1.0 times the threshold and at least 25 at 1.5 times, and story never exceeds 10 minutes.
10. An answer 1 ms faster than its minimum time is a rapid guess and one 1 ms slower isn't, for a sample of templates on each device type, with and without Session 0.
11. The fatigue signal fires on a fixture where the closing pair's median is 1.51 times the opening's and not at 1.49, whatever the accuracy of either pair.
12. In a 90-day simulation, a generated task outside the small spaces repeats within its window only where the log shows `repeat_forced`.
13. The schema test finds `purpose`, `flowSlot` and `why` in none of the API's responses.
14. `nextTask` answers within 100 ms at the 95th percentile on the family Mac with a year of log.

## What this does not settle

- The knowledge model, the states and the obligations the Director reads: ADR-0060.
- The adventure's time, the soft stop, rest stops, the game day, eye exercises and the anxiety signal (REQ-0352): ADR-0090. Leaving and resuming: ADR-0030.
- The lesson marks, their recheck windows, the thresholds, the motor calibration versions and how the report draws the flags and exposure counts: ADR-0180.
- The spell outcomes, rewards and floor completion: ADR-0140. The scene texts and their shortest forms: ADR-0110. Which science question fills a slot: ADR-0130.
- The simulation's other targets, such as the success share range and model versions not scoring lower (REQ-2908 to REQ-2922): ADR-0190.
- The Ascent, its anchor forms and their stop list, which the draft defers until after the MVP (RES-1100).

Raised mode can add only 5 points of review inside the corridor, because REQ-1010 caps the in-corridor share at 40 %. If the owner wants a stronger response to guessing and help-seeking, REQ-1010 needs an exception for raised mode, and that is the owner's call.

The strongest objection is that the frontier can't carry its load. Blocks of 5 tasks, owed probes, island checks, escalations, lesson rechecks, stale nodes and cold start all compete for 9 to 14 frontier tasks a day across 69 mandatory nodes. A child whose true frontier accuracy is 60 % pushes the corridor to review on most slots, starving the frontier further. The 90 % classification target might then be out of reach in 30 days. I keep the decision because RES-1000 accepted that price on purpose, and the simulation measures it before she plays; the first reversal condition says what happens if it fails.

A premortem, written as though it had failed. Mental arithmetic and control facts succeeded so often that the success share sat above 0,80 and the corridor gave nearly every room slot to the frontier. The player met hard task after hard task and began pressing «Не знаю», which raised the help-share flag every day. The island checks kept landing on the first floor in a domain foreign to its story. The stretch cap counted tasks per session, and a second session on the same day gave two more. The repeat window read the parameter space size from templates that declared a guess, so small spaces outside the three exempt ones repeated after a week. The fixes are in the checks above except the first: if the share skews high, the share should count room tasks only, and the simulation's success-share check in ADR-0190 is where it would show.

Amended by ADR-0230, ADR-0240, ADR-0250, ADR-0260, ADR-0290, ADR-0300, ADR-0330 and ADR-0340, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.
