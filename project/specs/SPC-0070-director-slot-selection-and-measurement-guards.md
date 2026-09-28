---
id: SPC-0070
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-0820, REQ-6404, REQ-0832, REQ-0956, REQ-6406, REQ-0966, REQ-0970, REQ-0972, REQ-0974, REQ-6844, REQ-1002, REQ-1004, REQ-1006, REQ-1008, REQ-1010, REQ-1012, REQ-6846, REQ-1016, REQ-1018, REQ-1020, REQ-1022, REQ-1024, REQ-6400, REQ-1028, REQ-1030, REQ-1032, REQ-1034, REQ-1036, REQ-1038, REQ-1040, REQ-1042, REQ-1044, REQ-1046, REQ-1048, REQ-1050, REQ-1052, REQ-1054, REQ-1056, REQ-1102, REQ-1104, REQ-1106, REQ-1108, REQ-1110, REQ-6402, REQ-1114, REQ-1118, REQ-1120, REQ-1122, REQ-1124, REQ-1126, REQ-1128, REQ-1130, REQ-1132, REQ-5304, REQ-5434, REQ-5438, REQ-5440, REQ-5446, REQ-5448, REQ-7176]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director's slot selection and its guards on the measurement

## Scope

The Director plans each adventure's route and floors, fills every slot with a node, a subtype and a purpose, and guards the measurement against fatigue and rapid guesses. This specification covers the day plan and the three-day domain window, the floor's opening and closing parts, the flow corridor that splits room slots between frontier and review, the value ranking of frontier nodes, the stretch gate, the knowledge model's obligations as the Director acts on them, the Guardian's ladder, cold start, the draw of word-problem forms and of the estimate step, trimming and extensions, the fatigue signal, rapid guesses, the help share, raised mode and the simulation that tests the Director. It also covers where the Director meets three parts of addendum 2: the retention hold and the place of a due retention check, the transfer hold's mark in `why` and the choice of a side slot's subtype, and the place of Dutch probe letters on a floor and in the plan's counts. The retention hold and the letters come after the MVP, and each passage that states them says so. It is written at the level of the Director's functions, the projections they read and the fields and events their choices produce.

It leaves out what other specifications state. SPC-0060 states the knowledge model, its estimates, states and obligations. SPC-0030 states the play API and what the client never receives. ADR-0080 states the attempt flow, the estimate step and where an estimate may appear. ADR-0090 states the game day, the soft stop, rest stops and the anxiety signal. ADR-0180 states the report and how it draws the flags and counts. ADR-0260 states the grouping slot, ADR-0230 the riddles' placement, ADR-0290 the Cito blocks, the Volley, the basic facts' minimum time and the repeat window, ADR-0300 the Sources track and its window, ADR-0330 the two routes, and SPC-0040 the word-problem templates, checker and verdicts. ADR-0400 states the retention check, its plan, its series and which nodes it holds, ADR-0410 the transfer holds, side slots and the frame picker, and ADR-0430 the Dutch probe, its families, letters and phases.

## Boundary

### Functions

The Director is a set of pure TypeScript functions in `src/engine/director/`, which the server's adventure loop calls.

| Function | Called | Returns |
| --- | --- | --- |
| `planDay` | when an adventure starts | routes A and B of 3 or 4 maths floors each, with the day's island checks and the Observatory visit when due |
| `planFloor` | before each floor | the floor's opening, its rooms and their lengths, from the recomputed forecast |
| `nextTask` | before each slot | the node, the subtype, `purpose`, `flowSlot`, `why` and whether the item carries an estimate; for a side slot, a subtype already shown to the player whenever one fits the slot (ADR-0410) |
| the rapid-guess test | on each verdict | `rapidGuess: true` or nothing |
| the fatigue test | at each control-fact point | whether the fatigue signal fires |

Where a rule asks for chance, the function draws from a seed made of the adventure identifier and the slot number, or from the named stream `hash(baseSeed, "<name>")`, so a replay of the log gives the same choice.

### Inputs

- The projections of SPC-0060: estimates, states and `node_obligations`, read-only.
- The skill graph through `src/engine/graph.ts`: levels, subtypes, weights, `stretchGate`, the subtype field `requires: { atLeast }` and descent targets.
- Session facts computed from the log: the success share, story time, pace, rapid guesses, help presses, `floor_outcome` events and `refusal_guard_changed`.
- Parameters in `content/director.v1.json`, the value weights in `content/director.v2.json`, and the form shares and guard counts in `content/thresholds.json`.
- The anxiety signal's cap on the frontier share, from ADR-0090.

### Outputs

Every choice goes into the `item_shown` event with its `purpose`, its `flowSlot` and a `why` field that lists the value terms or the fallback that decided it. While ADR-0410's format hold or context hold is active on a subtype, `why` on every `item_shown` of that subtype includes `transfer_hold`. After the MVP, `purpose` also takes `retention_check` for a retention check (ADR-0400) and `nl_probe` for a Dutch probe letter (ADR-0430). The server writes `rapidGuess: true` on the `verdict` event of a rapid guess, a weight of 0,5 on each first attempt after the fatigue signal, `rapid_guess_flag` on a session, `help_share_flag` on an adventure, and the rest-stop offer to the story. The projection `subtype_exposure` holds the exposure counts.

The API never sends `purpose`, `flowSlot` or `why` to the client (SPC-0030).

### Failure states

| State | Audience |
| --- | --- |
| `no_review_candidate` | the owner, through the log and the simulation |
| `no_island_candidate` | the owner |
| `domain_window_missed` | the owner |
| `graded_minimum_missed` | the owner |
| `rapid_guess_flag`, `help_share_flag` | the parent, in the report |

### What this part requires from other parts

- SPC-0060 supplies the estimates, the states, `node_obligations`, and applies the `rapidGuess` mark and the 0,5 weight.
- ADR-0090 supplies the soft stop at 60 minutes of active time, the volume forecast from the median pace of the last 5 adventure days, and turns the rest-stop offer and the scene budget into story.
- The scene library supplies a shortest form for every scene; ADR-0140 supplies `floor_outcome`; ADR-0180 supplies lesson marks, recheck windows and the motor calibration versions of Session 0.
- ADR-0190's Baselines table holds the budgets: `nextTask` within 100 ms at the 95th percentile on the family Mac, `planDay` and `planFloor` within 1 s.

### Permitted dependencies

The dependencies run one way. `src/engine/director/` imports `src/engine/graph.ts`, the model's projections and `src/shared/`, and nothing in `src/server/` or the client. It never reads `content/graph.yaml` directly, which ESLint `no-restricted-imports` enforces. It performs no input or output and never writes the log: the server's adventure loop writes each choice through `appendEvents`. The client imports nothing from `src/engine/`. `tools/simulate.ts` imports the Director and the knowledge model and nothing from `src/server/`.

## Behaviour

### The day plan and the domain window

A maths domain is one of the 8 domains with a floor of their own: N, A, F, D, P, M, G and S. Word problems (T) reach play through the Guardian and, after the MVP, as Dutch probe letters, which take the final answer only (ADR-0430). The letters, and every Dutch text in them, wait until the owner amends the Russian-only rule of the principle `project_in_english` in `CLAUDE.md`; until then the game shows no letter. `planDay` builds routes A and B of 3 floors, or 4 when the forecast leaves time, and the one the player picks is the one the window counts; ADR-0330 states how route B differs from route A.

The route first takes each domain that has had no completed floor for 2 adventure days in a row, before any other floor except a host floor that the Sources track's window brings to the first place (REQ-6400). When that window is due, a host floor goes first, a due domain that is also a host domain preferred, and the due domains follow (ADR-0300). The route fills its remaining places with the domains whose last completed floor is oldest, a domain never completed counting as oldest, and each domain's total node value, due reviews and parent topics included, breaks ties. The window counts only floors the player completed, read from `floor_outcome` (REQ-1054), and counts adventure days, the game days on which an adventure ran. When each adventure day completes 3 floors, these rules give each of the 8 domains its floor in any 3 consecutive adventure days (REQ-1024).

The floor order alternates heavy domains, A, F, D and P, with light ones, N, M, G and S, and changes from day to day; the list is data in `content/director.v1.json`. The route gives the Observatory a short visit, a scene and 2 to 3 science questions, at least once in any 3 consecutive adventure days, each science slot taking the topic from E1 to E5 asked longest ago.

### The floor's opening and the control facts

Each floor opens with its scene, an ungraded warm-up and either 2 mental arithmetic tasks or one Volley, by the share ADR-0290 states, then the Sources track's tasks on a floor that carries them (ADR-0300), then its rooms of 3 to 5 tasks. The share's deficit rule counts only floors on which a Volley could run, those from the day the Volley opened while blocks 1 and 2 hold a fact that isn't automatic, and never gives a Volley on more than 2 of any 3 consecutive maths floors (ADR-0290). Mental arithmetic picks nodes by value among the mental subtypes near the floor's domain, and a node in «Устойчиво» (stable) enters it no more than once in any 7 consecutive days (REQ-0832). After the MVP, a node held for a retention check never enters it (ADR-0400).

After the MVP, a floor's Dutch probe letters take the place ADR-0290's floor order gives them, after the track tasks and before the rooms. A letter takes no room slot, so the slot sources and the flow corridor below stay as they are.

Each adventure holds 2 control facts at its start and 2 at its end (REQ-1038), and each extension adds 2 more. A Guardian task comes on about one floor in three.

### The flow corridor

Every room slot comes from one of the sources recorded in `flowSlot`: frontier, review, parent topic or grouping; ADR-0260 states the grouping slot. Before each slot, `nextTask` computes the success share over the last 10 graded first attempts on graph tasks, across adventure boundaries, counting `clean` as 1, `partial` as 0,5 and `alt` as 0. Mental arithmetic and control facts count, and a Volley counts as one entry scored by its share of hits. Riddles, grouping-task attempts, track tasks and Dutch probe letters don't count. With fewer than 10 such attempts in the whole log the share uses what exists, and with none it counts as inside the corridor.

| Share | Slot | Requirement |
| --- | --- | --- |
| below 0,70 | review | REQ-1006 |
| above 0,80 | frontier | REQ-1008 |
| 0,70 to 0,80 | review when the adventure's review count among such slots is below `0.30 * (n + 1)`, rounded up, and frontier otherwise, where `n` is the number of such slots so far | REQ-1010 |

The deficit rule keeps review between 30 % and 40 % of the adventure's in-corridor slots once it has 8 or more of them (REQ-1010). A grouping slot is no slot `n` of the rule.

After the MVP, a due retention check, and the review owed after a wrong retention observation, take the first room slots of the node's domain floor, or for a Sources track node the first track task, in whatever slot type the corridor gives, and `flowSlot` records that type. ADR-0400 states which slot each takes, the order of two checks due on one floor, the check of a Sources track node, and the limits of 3 checks an adventure day and none after a fatigue signal in the session. The owed review skips the review eligibility test below.

### Review

A review task comes from a node whose tested state, from a probe or a full block, is «Бегло» (fluent) or «Устойчиво» (stable), and whose expected chance of success is at least 0,85 (REQ-1012). The expected chance is `pKnow * (1 - pSlip) + (1 - pKnow) * pGuess` for the subtype the task will use, with forgetting applied up to now. Among eligible nodes, none of them held for a retention check, the Director takes the one unchecked for longest, by `lastSeen`, ties broken by node identifier (REQ-6846). Before the retention check ships after the MVP, no node is held. A review whose domain is off today's route waits for its floor.

A review task has `purpose: review`, is graded, and counts in the estimates and states like any other observation (REQ-1018). It uses the same room, frame, screen and packet as any other task, and the client never learns its purpose, so it looks to the player like any other graded task (REQ-1016).

When no node is eligible, the slot takes a cold-start review node, then the frontier candidate with the highest expected chance of success, and `why` records `no_review_candidate`.

### The frontier

A frontier slot takes the candidate node of highest value (REQ-1002), by the formula whose weights live in `content/director.v2.json`:

```text
value(v) = 2.0 * uncertainty(v) + 1.5 * staleness(v) + 1.5 * frontier(v)
         + 1.5 * escalation(v) + 1.0 * stretch(v) + 1.5 * spaced_review(v)
         + 1.5 * block_priority(v)
         + max(2.0 * recheck(v), 1.5 * parent_topic(v), 1.0 * school_goal(v))
         - 1.0 * recent_shows(v)
```

`staleness` is the days since `lastSeen` divided by 7 for a frontier node and by 14 for every other node, capped at 1. `escalation` is 1 for every obligation row that asks for evidence on the node: an open escalation, an owed probe or a queued island failure, and after the MVP a full block owed after a retention series ended not confirmed (ADR-0400). `recheck` rises with a due lesson recheck and `parent_topic` with a fresh lesson mark, and a node scores the largest of the three terms in the `max`, never more than one. `recent_shows` counts the node's shows in the last 3 days (REQ-1002). `block_priority` reads the node's own `citoBlock`, and ADR-0290 states its values and `school_goal`.

The candidate set holds the frontier nodes, the uncertain nodes, the nodes with obligations, the admitted stretch nodes and every stale node. It leaves out every node cut off by a node X until X is tested again, except for an island check probe (REQ-0966). A parent-topic slot takes a node with a fresh lesson mark, at most 4 such tasks a day for the first `parentTopicDays` days after the mark, a whole number from 1 to 3 in `content/director.v1.json`, and a recheck block arrives through `recheck` as frontier tasks with `purpose: recheck`, outside that cap.

The Director keeps a chosen node for 2 to 5 tasks, the probe or block it owes, and may alternate those tasks with a neighbouring node's. While a node's bare scored tasks of the last 30 days number no more than its scored tasks in context, `nextTask` chooses among the node's subtypes that have a bare template, when any has one (ADR-0290).

### The retention hold

After the MVP, every candidate list the Director builds leaves out a node held for a retention check: the frontier, review, stale-node priority, island checks, mental arithmetic, riddles, the Volley, the Sources track, grouping slots, warm-ups and easy tasks. The Director's reject predicate, which the generator asks, refuses every task that names a held node, as its node or as any node a riddle or a multi-node task names, whose purpose isn't `retention_check`, and the caller takes its next candidate. ADR-0400 states when a hold starts and ends.

### Honest difficulty

The flow share decides only whether a slot is frontier or review, and never which frontier node is picked, and no term of the value formula rises as the expected chance of success falls. The Director therefore never chooses a task to make the player fail (REQ-1020), and never gives a task it knows is too hard in order to balance the success share (REQ-1022).

### Stretch nodes

A stretch node joins the candidate set only when each of its prerequisites and each node in its `stretchGate` is «Бегло» (fluent) or «Устойчиво» (stable) by a tested result, a probe or a full block, and never by an inferred state (REQ-0820). The stretch subtypes `G6.blocks` and `S3.missing` carry `requires: { atLeast: fluent }`, so the Director never chooses them until the ordinary subtypes of the same node are fluent or stable (REQ-5448).

Stretch nodes get at most 2 tasks in an adventure day, counted across all sessions of that day (REQ-1004). When a stretch node's probe leaves its state open, the node takes both stretch tasks of each adventure day until its full block of 5 forms, so the block completes within the 3 adventure days after the probe's day (REQ-6404). The Director opens no second stretch block while one is open.

### The knowledge model's obligations

The Director acts on each kind of row in `node_obligations`:

- An escalation after a probe short of "fluent (probe)" raises the node through `escalation` until a full block forms (REQ-0956).
- After a probe scoring 0 out of 2, the node's block is the first frontier choice of every following slot of the session until it completes; the Director adds a room to the current floor when needed and never trims it. When the session ends first, or the node is a stretch node whose 2 tasks for the day are spent, the block takes the first frontier slots of each following session until it completes (REQ-6406).
- When a node gets the state "understands", each of its direct descendants is owed one probe, raised through `escalation` (REQ-0970).
- Each adventure day holds 1 or 2 island checks, the count drawn from the seed, each a probe of a node drawn at random from those in "fluent (inferred)" or cut off by a prerequisite, and not held for a retention check (REQ-0972). The draw takes a node whose domain is on the route first; when none is, the probe goes into a room of the day's first floor.
- A failed island check queues the node and its prerequisites for testing, and `escalation` raises them (REQ-0974).
- A node whose last unassisted first attempt is more than 30 days old joins the candidate set whatever its frontier status, its `staleness` is at the cap of 1, and among equal values it goes first, oldest first, unless it is held for a retention check (REQ-6844).

### The Guardian's ladder

Let k be the largest number for which T_k is «Бегло» (fluent) or «Устойчиво» (stable), inferred states included. The day's first Guardian task has k + 1 steps (REQ-1028). After a `clean` outcome the next Guardian task that day has k + 2 steps, at most 4, and after any other outcome k steps, at least 1 (REQ-1030). When no T node is fluent or stable, and throughout cold start, the day's first Guardian task has 1 step (REQ-1032).

### Word-problem forms

For every slot that names a T1 to T4 node, a Guardian's or a room's, a second draw from `hash(baseSeed, "form")` gives `u` in [0, 1). With `p = 0.05`, a T1 to T3 slot is unanswerable when `u < p`, surplus when `u < p + 0.10`, and ordinary otherwise; a T4 slot is unanswerable when `u < p` and ordinary otherwise. About 10 % of the T1 to T3 problems are then surplus (REQ-5434) and about 5 % of the T1 to T4 problems unanswerable (REQ-5438). The draw reads nothing from her history, so the kinds follow no cadence (REQ-5440).

The draw applies only when the node's ordinary subtype is «понимает» (understands) or above, inferred states included: the new subtypes carry `requires: { atLeast: understands }`, and below that state the slot is ordinary (REQ-5446). A Dutch probe letter is no Guardian or room slot, so the draw never runs for it, and a T1 to T4 letter always uses an ordinary subtype (ADR-0430).

The refusal guard reads the last 20 first attempts on solvable T1 to T4 problems, assisted or not, leaving out second attempts, tasks the parent excluded and Dutch probe letters. When that window holds 3 or more answers of «Нельзя узнать» (can't be known), the server writes `refusal_guard_changed` with `state: "raised"`, and the Director sets `p` to 0.025, halving it once and never again. The guard clears when the 20 solvable first attempts after the raise, letters left out as before, hold 2 or fewer such answers; otherwise a new window of 20 starts and nothing is written. On clearing, the server writes `state: "cleared"` and `p` returns to 0.05 (REQ-7176). ADR-0180 states the report's observation of the raise.

### The estimate draw

`nextTask` decides whether an eligible item carries an estimate by a draw from the adventure's seeded stream with probability `q = min(0.5, 0.15 / (1 - b))`, where `b` is the share of the subtype's last 200 eligible items that couldn't carry one. The draw reads neither `purpose` nor the scored flag, so unscored tasks of those subtypes, warm-ups and easy tasks included, carry an estimate at the rate scored tasks do (REQ-5304). A room's estimate stays open until an item carries one, and the tasks outside any room share one per floor. ADR-0080 states which subtypes are eligible and the one-per-room limit. A Dutch probe letter never carries an estimate (ADR-0430).

### Cold start

Cold start lasts from the first adventure until fewer than half of the 1F and 1S nodes remain unchecked or the 10th adventure ends, whichever comes first. During it the Director probes each domain's prerequisite chain from a node whose typical group in the graph is 7 or 8, going lower only after a probe escalates, by a binary search to the middle of the chain below (REQ-1034). The nodes N1 to N3, A1 to A4 and F1 serve as review tasks (REQ-1036). After cold start the value formula alone ranks the frontier.

### Volume, trimming and extensions

Before each floor, `planFloor` recomputes the forecast of the adventure's volume from the player's actual pace (REQ-1048). When the forecast shows the adventure won't fit before the soft stop, the Director trims first the number of rooms on a floor, down to one, then the length of new rooms, down to 3 tasks, and only then moves the route's fourth floor to the next day (REQ-1050). It never trims below 25 planned graded first attempts, and an adventure that still doesn't fit plays to the soft stop and resumes the next game day. It never trims mental arithmetic, a Volley, track tasks, control facts, or the last room on a floor with an open probe or escalation (REQ-1052).

The plan aims at 30 graded first attempts on graph tasks and never plans fewer than 28, or 25 once rooms are trimmed for a slow pace (REQ-1040). A Volley counts as 2 graded first attempts towards these counts, the 2 mental arithmetic tasks it replaces, as it counts for buttons (REQ-1040, ADR-0290). Grouping-task, riddle, track and Dutch probe letter attempts count towards none of them. After the MVP, in the probe's first phase, the plan never trims letters below 3 a day, and it plans 3 letters where 4 would leave fewer than 28 graded first attempts on graph tasks (ADR-0430). An adventure that stops before its plan is done, at the soft stop or by «Закончить на сегодня» (Finish for today), isn't complete and resumes the next game day from the same place.

Story takes at most 10 minutes of the adventure's active time (REQ-1042). The Director measures story time from the scene events in the log and gives each scene order a duration budget from what remains after it reserves the shortest forms of the scenes still planned. Once only that reserve is left, every remaining scene takes its shortest form.

Each extension adds only rooms chosen by value, on floors already on the route (REQ-1044), and never opens a new floor (REQ-1046).

### Subtype exposure

The projection `subtype_exposure` counts, for each subtype, the tasks of that subtype shown to the player and the accuracy of her unassisted first attempts before and after she first saw a walkthrough on it. The report draws the count beside that accuracy (REQ-1102).

### The fatigue signal

The fatigue signal fires when, and only when, the median answer time at a control-fact point exceeds 1.5 times the median at the adventure's opening point, whatever the accuracy at either point (REQ-1104). The points are the opening pair, the closing pair and each extension's pair, and the times leave out background, pause, eye-exercise and rest-stop time. When the signal fires, the Director sends the story a rest-stop offer (REQ-1106).

Every later first attempt of that session carries weight 0,5 in the node estimates, until the session ends (REQ-1108). A block holding such attempts never gives «не освоен» (not mastered) when it would score higher without them; the node stays "being clarified" (REQ-1110).

### Rapid guesses

An answer is a rapid guess when it arrives faster than its template's minimum time, measured on the client from the task's appearance to «Готово» (Done), without pauses and without `checkMs`, unless the attempt is flagged `interrupted` or `crossDevice` or is on an item that carries an estimate; such an attempt is never tested for a rapid guess (REQ-6402).

For a template outside the small spaces, the minimum time is `max(1500 ms, min(0.15 * fluencyMs, 10000 ms))` plus the motor correction (REQ-1114). ADR-0290 states the minimum time of basic facts and control facts. The motor correction is the player's median time per key press in the pure-input tasks of Session 0 on the device type in use, from the latest calibration version, times the key presses of the correct answer, «Готово» included (REQ-1118). On a device type with no Session 0 yet it is 0 (REQ-1120).

A rapid guess stays out of every node estimate and every block (REQ-1122), earns no bonus, and the Director adds one task of the same node later in the session in its place.

### Raised mode and the flags

When rapid guesses exceed 15 % of a session's answers, the Director enters raised mode for the rest of that session and for the next session (REQ-1124), and the session gets `rapid_guess_flag`, which the report shows the parent (REQ-1126).

The help-share test counts «Не знаю» (I don't know) and hints before the answer, and no «Нельзя узнать», against the adventure's first attempts. When they exceed 30 % of them and exceed their mean share over up to 7 earlier adventures by at least 10 percentage points, the adventure gets `help_share_flag`, which the report shows the parent (REQ-1128), and the next adventure runs in raised mode (REQ-1130). In the player's first adventure the 30 % test alone applies.

Raised mode replaces the in-corridor rule with review when the adventure's review count among such slots is below the larger of `0.30 * (n + 1)`, rounded up, and `0.40 * (n + 1)`, rounded down. Raised mode therefore never gives less review than the ordinary rule, gives the same count below 10 in-corridor slots, one more review task at 10, two more at 20 and three more at 30, and from 8 in-corridor slots never more than 40 %. Raised mode also makes the item builder choose a free-input template wherever a subtype has one (REQ-1124, REQ-1130). Below the corridor every room slot is review already, and above it every room slot stays frontier.

### The simulation

`tools/simulate.ts` plays synthetic profiles through the Director and the knowledge model with a simulated clock, and ADR-0190's verify command runs it. Its 30-day run of daily play under the planned frontier budget classifies at least 90 % of the simulated nodes into their true state (REQ-1056). Its "guesses" profile and its "rushes for bonuses" profile, which answers faster than the minimum time in 30 % of tasks, each raise node estimates by no more than 5 percentage points over the same profile without guessing (REQ-1132).

## Failure paths

| Condition | What happens |
| --- | --- |
| No node is eligible for review, or every eligible node is held for a retention check | The slot takes a cold-start review node, then the likeliest frontier candidate, and `why` records `no_review_candidate`. |
| A retention check can't be placed on its day, because 3 are placed or a fatigue signal fired | The check waits for the next floor of its domain. |
| No node is in "fluent (inferred)" or cut off, or every such node is held for a retention check | The day has no island check, and the first room's `why` records `no_island_candidate`. |
| A domain goes 3 adventure days without a completed floor | The server logs `domain_window_missed`, and the next route takes the domain first, after the host floor when the Sources track's window is due. |
| A completed adventure holds fewer graded first attempts than its minimum, 28 or 25 when trimmed | The log records `graded_minimum_missed`, and the simulation counts it. |
| The log holds fewer than 10 graded first attempts on graph tasks | The share uses what exists; with none, the slot counts as inside the corridor. |
| The adventure has fewer than 8 in-corridor slots | The deficit rule still runs, and whole slots can fall outside the 30 % to 40 % band, such as 3 of 7. |
| The session ends before a 0-out-of-2 block completes | The block takes the first frontier slots of the next session. |
| k is 0 after a non-clean Guardian outcome | The next Guardian task has 1 step. |
| A T node's ordinary subtype is below «понимает» | The form draw doesn't run, and the slot is ordinary. |
| Only the reserve for the shortest forms of the planned scenes is left of the story's 10 minutes | Every remaining scene takes its shortest form. |
| The forecast shows the adventure won't fit before the soft stop | The Director trims in the fixed order, keeping the protected parts and at least 25 planned graded first attempts; what still doesn't fit plays to the soft stop and resumes the next game day. |
| A device type has no Session 0 | The motor correction is 0, and minimum times are lower. |
| An attempt is `interrupted`, `crossDevice` or carries an estimate | It is never a rapid guess, and its time counts in no measure. |
| An answer is a rapid guess | It stays out of every estimate and block, and a task of the same node follows later in the session. |
| Rapid guesses pass 15 % of a session, or the help share passes its test | Raised mode runs, and the report shows the flag once. |

## Open findings

- ADR-0070 keeps at least 25 planned graded first attempts on graph tasks once rooms are trimmed for a slow pace, and never trims below that. ADR-0430 never trims Dutch probe letters below 3 a day in the probe's first phase. At a pace slow enough, both can't hold on one adventure, and neither decision says which yields. ADR-0430's reversal conditions give that choice to the owner, and this document doesn't make it.

## Open review findings

- Round 1 asked for a reason beside four rules: a Guardian task on about one floor in three, a node kept for 2 to 5 tasks, cold start's end at half the 1F and 1S nodes or the 10th adventure, and the replacement task after a rapid guess. Rejected: a specification states what the system does and never why (spec rule S8), and ADR-0070 holds the reasons. Round 2 repeated this as a preference, asking for a pointer to ADR-0070 in Scope; rejected for the same rule, because the requirements each statement cites lead to ADR-0070.
- Addendum 2 revision, round 1, asked that the Scope say whether a room slot can name a T node, since the day plan says word problems reach play through the Guardian while the form draw runs on "a Guardian's or a room's" slot. Rejected here: addendum 2 changed neither sentence, ADR-0250 and ADR-0070 as amended word them this way, and settling the room case is a decision for ADR-0070, not for this revision.
- Addendum 2 revision, round 1, asked again for reasons beside the new limits: 2 letters a floor, 3 checks a day, no check after a fatigue signal and the 3-letter floor. Rejected under spec rule S8, as in the earlier rounds; ADR-0400 and ADR-0430 hold the reasons.
