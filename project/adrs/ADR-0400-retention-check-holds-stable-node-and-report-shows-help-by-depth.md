---
id: ADR-0400
artifact: adr
status: approved
revised: 2026-10-10
addresses: [REQ-6796, REQ-6800, REQ-6802, REQ-6804, REQ-6806, REQ-6808, REQ-6810, REQ-6812, REQ-6814, REQ-6816, REQ-6820, REQ-6822, REQ-6824, REQ-6826, REQ-6828, REQ-6830, REQ-6832, REQ-6834, REQ-6836, REQ-6838, REQ-6840, REQ-6842, REQ-6844, REQ-6846, REQ-6848, REQ-6850, REQ-6852, REQ-6854, REQ-6856, REQ-6858, REQ-6860, REQ-6862, REQ-6864, REQ-6866, REQ-6868, REQ-6870, REQ-6872, REQ-6874, REQ-6876, REQ-6878, REQ-6880, REQ-6882, REQ-6884, REQ-6886, REQ-6888, REQ-6890, REQ-6892, REQ-6894, REQ-6896, REQ-6898]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0400. A holdable node that first reaches «устойчиво» gets a logged retention check 28 to 35 game days on, held back from every path until then, a series of 2 of 2 or 3 of 4 decides its retention, and the post-MVP report shows each node's weeks by depth of help; the MVP gains only the task on `solution_shown` and `hint_shown`

## Decision

The owner's addendum 2 of 2026-09-28, item 3, enters the game in three increments, each working without the next. The MVP gains one field. The post-MVP dynamics screen gains the weekly breakdown, the trajectory and the retention list, all computed from the log. The Director then gains the planned check, the hold and the series. ADR-0380 owns what cuts across addendum 2: the 80 % Wilson interval on every share, each measure owning its «мало данных» (too little data) floor, interpretations worded as checks, the owner of each new event type, the new `item_shown` fields and the MVP scope. This decision cites those rules and doesn't restate them.

### Increment 1, in the MVP: every walkthrough names its task

`solution_shown` and `hint_shown` carry the `itemId` of their task as a required field from their first payload version (REQ-6890, REQ-6892). No code writes either event yet, so the field needs no upcaster. If an event without it has been stored by the time this lands, the field goes into a new payload version with an upcaster that leaves it absent, and a reader marks the node of such an event unknown. `explanation_shown` already reaches its task through `explanation_bought` (SPC-0120), so it gains nothing. Nothing else in item 3 enters the MVP, which keeps report v1's nine screens unchanged (REQ-6682, ADR-0380).

### Increment 2, after the MVP: the breakdown and the trajectory

Both views read one set of first attempts, the counted first attempts: graded first attempts shown with the purpose block, probe, review, recheck or `retention_check`, whose `forms` list is empty and which ADR-0060 doesn't drop (REQ-6810). That leaves out rapid guesses, excluded tasks, second attempts, mental arithmetic, control facts and Volley rows. A week runs Monday to Sunday by ADR-0090's game day (REQ-6812). This is the dynamics rule of REQ-6796, which replaces REQ-1414's list: assisted first attempts enter only a figure labelled as help, and every «сама» (on her own) share reads unassisted first attempts alone. The profile's own dynamics and the fact states are ADR-0390's.

The weekly breakdown puts each counted first attempt in exactly one bin, from `attempt_submitted`'s outcome, `hintLevel` and `hintMaxLevel` (REQ-6800):

| Bin | Rule | Requirement |
| --- | --- | --- |
| «сама» (on her own) | `clean`, no hint | REQ-6802 |
| «хватило первой ступени» (rung 1 was enough) | `clean`, deepest rung 1, `hintMaxLevel` 2 or more | REQ-6804 |
| «с опорой» (with support) | `clean` after rung 2 or 3, or after rung 1 with `hintMaxLevel` 1 | REQ-6806 |
| «требует обучения» (needs teaching) | `partial` or `alt`, «Не знаю» (I don't know) included, at any depth | REQ-6808 |

The dynamics screen shows each node's counts per week, such as "5 сама, 1 хватило первой ступени, 2 требует обучения". The node card shows the same counts split by subtype (REQ-6814). A count needs no floor, because it is exact at any size.

The trajectory draws one point per node for each week with at least one counted first attempt (REQ-6816). Each point carries three figures:

- The share «сама» is the unassisted first attempts that ended `clean` over all unassisted first attempts (REQ-6824). When the week holds fewer than 5 unassisted first attempts, the share pools it with the weeks just before it until the count reaches 5, over a span of at most 4 weeks, and names the weeks it pooled (REQ-6818). I read "up to 4" as 4 weeks in all, the point's week included, because the requirement's reason says four weeks is the span the owner's profile uses and that four weeks under 5 show «мало данных»; Open review findings records the other reading for the person approving. Below 5 over those 4 weeks, the point shows «мало данных» with its count. Otherwise it shows the count and ADR-0380's 80 % Wilson interval.
- The mean depth of help is the mean, over the week's counted first attempts, of 0 for `clean` with no hint, the deepest rung from 1 to 3 for `clean` after hints, and 4 for `partial` or `alt` (REQ-6820). It shows one decimal and its count, with no floor, as ADR-0220's 30-day mean depth does.
- The marks at their dates are each `solution_shown` or `explanation_shown` on the node, each lesson mark on the node, each «тренировали факты» (we practised facts) mark whose facts `content/facts.yaml` maps to the node, each review task of the node and each retention observation with its result (REQ-6822).

### Increment 2, continued: the retention observation

A retention observation is a counted first attempt that is unassisted, on a task shown at least 21 game days after the node's latest meeting before that show (REQ-6826). A meeting is any `item_shown` or `compose_shown` naming the node, in any subtype, purpose or form, second attempts, mental arithmetic, control facts and Volley rows included (REQ-6828). The attempt isn't an observation when, between that meeting and the show, the node had a `parent_tag_added` or a matching `facts_trained_marked` (REQ-6830). Nor is it one when a direct prerequisite of the node, under the graph version active at the attempt, had a `solution_shown`, `explanation_shown` or `hint_shown` in that span (REQ-6832). Only `clean` counts as right (REQ-6834). The one exception to "unassisted" is a retention check on which she opened the hint ladder: it counts as a wrong observation (REQ-6874).

The projection `retention_observations` computes each gap from the log whenever it runs, and no reader uses a gap stored at show time (REQ-6836). An answer queued offline on another device can land after a show and change which meeting was latest, and a recompute then gives the right gap. `daysSinceLastExposure` is therefore a field of this projection and not of `item_shown`, as ADR-0380 decides under the one-record rule of ADR-0210. RES-4220 conclusion 14 asked for the field stored as an audit of the Director. I record the audit in the check's `why` field, which names the plan's `seriesId` and `checkNumber`, because the gap is a difference of two logged dates and a stored copy could disagree with it.

The report lists every retention observation of each node with its date and result, including the ones on exempt nodes and those outside any series (REQ-6884). With increment 2 alone no series exists, so the list shows natural observations only.

### Increment 3, after the MVP: the planned check, the hold and the series

A node is holdable unless it is exempt (REQ-6848). A node is exempt when `content/facts.yaml` names it as a fact's node, when the control-fact set draws from it, or when it is T1, T2, T3 or T4. A program computes the set from the content files, so a paragraph can't drift from the data. For each exempt node the report shows «удержание не измеряется» (retention not measured) with its reason: fixed control facts, the Guardian's step ladder or automaticity measured by frequent showing (REQ-6850).

The Director writes `retention_check_planned` when a holdable node with no open series and no confirmed series first reaches «устойчиво» (stable) (REQ-6838). After a series ends or is cancelled, the restart rules below say when it gets the next one. It writes the plan at its next call after the per-node update of ADR-0060 that produced the state, so the hold starts in the same session. The payload is:

| Field | Meaning |
| --- | --- |
| `nodeId` | the node |
| `seriesId` | new for check number 1, repeated on every later plan of the series |
| `checkNumber` | 1 to 4, the series' observation count plus 1 when the plan is written |
| `anchorDate` | the game day the node reached «устойчиво» under the versions active at the plan |
| `countFrom` | `latest_meeting` or `plan_day` |
| `fromDays`, `toDays` | 28 and 35, or 0 and 7 for the fallback window of REQ-6894 |
| `holdStarts` | `now`, or `after_review` after a wrong observation |

The projection `retention_series` turns these into dates. The due window runs from `fromDays` to `toDays` game days after its start point: the node's latest meeting before the hold starts, or the plan's game day. I store the rule and not the dates, because the start point of a plan written with `holdStarts: after_review` doesn't exist yet when the plan is written.

The hold means the Director never shows the node until the plan's check is shown (REQ-6840, REQ-6842, REQ-6844, REQ-6846). Every candidate list the Director builds leaves held nodes out. That covers the frontier, review, stale-node priority, island checks, mental arithmetic, riddles, the Volley, the Sources track, grouping slots, warm-ups and easy tasks. A program enforces this in one place: the Director's reject predicate, which ADR-0040's generator already asks, refuses every task that names a held node, as its node or as any node a riddle or multi-node task names, whose purpose isn't `retention_check`. A refusal sends the caller back to its next candidate. The parent's lesson recheck needs no exception, because a lesson mark cancels the plan first. While a node is held, ADR-0060's `nextReview` and `stale` still compute as before, and the Director doesn't act on them. The check itself is the review after a gap the ladder asks for, and the ladder resumes from its result (REQ-6842).

A due check goes into the first room slot of the node's domain floor from the first day of its due window, `fromDays` after the window's start point, and a check still unplaced after the window's end goes there too (REQ-6856). For a Sources track node the slot is the first of the day's two track tasks on its host floor, a default I chose because a track node has no domain floor. When two checks are due on one floor, the earlier due window takes the first slot and the next takes the slot after it, because the earlier window ends first and so is nearer to late. The check takes whatever slot type the corridor gives, review or frontier, and records it in `flowSlot` as usual. The Director places at most 3 checks an adventure day (REQ-6860) and none after a fatigue signal in that session (REQ-6862). A check that can't be placed waits for the next floor of its domain, which ADR-0070's three-day window brings within 3 adventure days. The due date alone chooses the check, so ADR-0070's honesty rule holds: no success share decides whether a check comes.

The check's subtype is a seeded draw, weighted by the graph's subtype weights, among the node's subtypes of weight 0.2 or more (REQ-6858). When no subtype reaches 0.2, the draw runs over the subtypes she has already been shown, which REQ-6954 asks of a retention check anyway. The task comes from a free-input template where the subtype has one, with an empty `forms` list and a frame whose context she has already seen (REQ-6956, ADR-0410). The check runs ADR-0080's ordinary attempt flow, and no response carries its `purpose` (ADR-0070's schema test). Its attempt feeds "on her own", fluency and the state rules as a review task does, and writes no new stream (REQ-6888).

A series starts at the plan with check number 1 and counts every retention observation of the node from that plan on, natural ones included (REQ-6866). `retention_series` reads the observations in log order and ends the series (REQ-6868):

| Observations so far | Result |
| --- | --- |
| 2 right of 2, or 3 right of 4 | «удержание подтверждено» (retention confirmed) |
| 0 of 2, 1 of 3 or 2 of 4 | «удержание не подтвердилось» (retention not confirmed) |
| anything else | pending |

The Director reacts to the series at each run:

- Pending after a right observation: it writes the next plan with the same `seriesId`, `countFrom: latest_meeting` and `holdStarts: now` (REQ-6870).
- Pending after a wrong observation: it writes the next plan with `holdStarts: after_review`, and first gives the node its next-day review (REQ-6876). That review is chosen by date: it takes the first room slot of the node's domain floor after any due checks, on the next game day with that floor, whatever the node's expected chance of success. The hold starts once the review is shown, and the window counts from it.
- A check attempt with no observation, because it was a rapid guess, an excluded task, spoiled by a walkthrough on a direct prerequisite or shown under 21 days after a meeting that landed late: the Director writes a plan with the same `checkNumber`, `countFrom: latest_meeting` and `holdStarts: now`, so the window counts from that attempt (REQ-6872).
- Confirmed: the Director plans nothing more for the node (REQ-6878). Later natural observations stay in the list and don't change the result.
- Not confirmed: the node returns to ordinary scheduling. `retention_series` records a block owed, which ADR-0070's `escalation` term raises until a full block forms (REQ-6880). When that block leaves the node «устойчиво», a new series starts. Otherwise a new series starts when the node next reaches «устойчиво» (REQ-6882).

A lesson mark, or a «тренировали факты» mark on one of the node's facts, a clause kept for REQ-6852's wording, since the exemption above leaves no holdable node with facts, ends any hold and cancels the open plan with `retention_check_cancelled`, reason `lesson_mark` (REQ-6852). The payload is `nodeId`, `seriesId`, `reason` and the causing event's sequence number. The cancelled series keeps its observations in the list and gets no result. A new series starts at check number 1 when the lesson's second recheck leaves the node «устойчиво». If the second recheck leaves it below, or its window closes with no block, the new series starts when the node is next «устойчиво» at a Director run after that window (REQ-6854).

When the check ships, and after a recompute under a new threshold, rules or model version, every holdable node that is «устойчиво» with no open and no confirmed series, and no restart rule still waiting, gets a plan at the Director's next run (REQ-6894). Its window counts 28 to 35 game days from the node's latest meeting. When that window has already passed, it runs from the plan's game day to 7 game days after it, with `countFrom: plan_day`. A recompute never overrides the restart rules after a failed or cancelled series, because each waits for evidence, a block, a recheck or a drop below «устойчиво», that no version change produces. A recompute never cancels a plan or a hold, even when it moves a held node out of «устойчиво» (REQ-6896). The report then shows the node's current state beside its series.

The report lists, per node, «проверка запланирована» (check planned) with its due window, and «удержание подтверждено» and «удержание не подтвердилось» with the date of the deciding observation (REQ-6884). Each carries its count of right observations out of the total. A check placed after its window's end is marked «с опозданием» (late) (REQ-6864). The list states beside itself that 2 right of 2 can't reliably tell a child who is right 90 % of the time from one right 70 % of the time (REQ-6886). A cancelled series shows «проверка отменена» (check cancelled) with its date and reason, so a planned check never vanishes from the list unexplained. All these strings live in the per-language string file of ADR-0160.

### What works once this is accepted, and what doesn't yet

Once accepted, the MVP logs the task of every short solution and hint rung, and nothing she sees changes. After the MVP, the dynamics screen shows each node's weekly bins, its trajectory with marks and its natural retention observations, all rebuilt from the MVP's log. The Director's check, hold and series come last, and removing them leaves the screen working with natural observations only. Retention can't be measured for the exempt nodes in any increment. The first result can appear about 8 weeks after increment 3 ships, since a series needs two observations at least 28 game days apart.

## Why

A check after a gap measures what a run of successes doesn't. In ASSISTments, pupils who had mastered a skill by three right answers in a row still failed about a fifth of retention tests (Xiong and Beck, through RES-4220). Performance during practice is an unreliable index of learning (Soderstrom and Bjork, through RES-4220). A gap forms only if the Director holds the node from every path that shows it: the approved Director meets a stable node weekly through mental arithmetic, and review picks the node unchecked longest (RES-4220). That is why the hold covers every path, and why one reject predicate enforces it, since a list of paths in prose misses the next path someone adds.

The exempt nodes can't be held without breaking approved rules: control facts come at fixed points of every adventure, the Guardian's ladder needs T_k, and basic facts measure automaticity by showing often (RES-4220). The plan is an event because the stable state is recomputed under four versions, and an anchor derived from the state would move and change which observations a series counts (RES-4220, ADR-0060). The observation reads only facts no version changes, so a recompute leaves every series as it was.

The breakdown and trajectory need nothing the log doesn't hold, except the task of a short solution or a rung. A report built after the MVP can't recover that task from event order across resumes and devices, so the field goes into the MVP and everything else waits (RES-4220, ADR-0380).

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep ADR-0060's forgetting and review ladder, and show no retention status | changes no rule; the 30-day review already tests a node after a gap | weekly mental arithmetic, rechecks and review keep the gap short, nothing marks which review followed a real gap, and the report can't say whether a skill lasted (RES-4220) |
| Retention observations from the log alone, with no hold or plan | breaks none of the four Director rules; a pure projection | natural 21-day gaps come mostly on nodes the Director neglects, so the status would rest on the nodes least looked after (RES-4220); it survives here as increment 2 |
| The owner's check with a hold on every path, the chosen option | one clean observation for every holdable stable node, at a gap the owner set | costs review a node would get, and reaches no exempt node |
| An adaptive gap, sooner for nodes that took many attempts to reach «устойчиво» | follows the one predictor of retention Xiong and Beck found | their data show a predictor, not a gap rule; one child gives too few nodes to fit one; and it overrides the owner's 28 to 35 days |
| ARRS's schedule at 7, 14, 28 and 56 days | tested on 672 pupils in a maths tutor | a 7-day check barely differs from a 1-day one in their data, the owner fixed 21 days, and four checks a node take slots the frontier needs |
| Hold only the frontier and review, as the item words it | three fewer rule changes | mental arithmetic alone shows a stable node up to four times in 28 days, so no check would ever clear 21 days |

## What it costs

The player pays up to 3 slots an adventure day for checks, out of about 30 first attempts, and a held node leaves review for 28 to 35 days. A node that reaches «устойчиво» at its 4th success gets its check from day 28 in place of a review on day 14. Cepeda and colleagues place the best review gap below 35 days for every delay they tried, so the hold spends some of the spacing benefit (RES-4220). A series that needs four observations takes about 3 to 4 months.

The parent pays reading one more list and its warning. «Удержание подтверждено» at 2 of 2 confirms a child right 70 % of the time about 70 % of the time (RES-4220), and the warning line exists because the label sounds stronger than that.

The developer pays for building and keeping one more projection, `retention_series`, a check in the reject predicate and two placement rules. `nextTask` stays inside its 100 ms budget at the 95th percentile in ADR-0190's Baselines table, because the hold is a set lookup and the projection updates per event. The report's views stay inside the 5 s rebuild in the same table.

When the check ships, every stable holdable node gets a plan at once. With 30 such nodes and a cap of 3 a day, the first checks drain over about 10 adventure days and some arrive late, which the late mark shows. The server's backlog warning below is expected in that burst, and the late-share reversal condition leaves out plans written at ship time or after a recompute (REQ-6894), because the burst says nothing about the steady cap.

Ceilings, each with its drain:

- Each node has at most one open plan, since `retention_series` keys plans by node and the Director refuses a second. Held nodes can't outnumber holdable nodes.
- Due checks drain at 3 an adventure day, earliest window first. When more than 9 checks are past their window's end at once, 3 adventure days' worth, the server writes one warning to its operational log for the owner, and writes it again only after the count has fallen to 9 or below and risen past it.
- A series allows at most 3 void checks in a row. The third cancels it with reason `void_limit`. A new series starts at the first Director run at least 35 game days after the cancel at which the node is «устойчиво», so a node that stays stable is measured again after one full window's rest. I chose 3, because three voids spend about 3 months of windows with no observation, as long as a whole series should take. A walkthrough on a prerequisite during every hold would otherwise repeat a void check without end.
- A series holds at most 4 observations, by its end rule.

The interruption budget is zero for both people. The player sees no new screen, line or sound, and a check looks like any task. The parent gets no notice: every retention figure waits in the report until the parent opens it. Nothing waits on the parent. Two weeks without the parent lose no data and leave no queue, since lesson marks are optional and the Director plans, holds and places checks alone.

The boundary this protects is the measurement. The likeliest damage is a packet that carries `purpose` and tells her which task is a check, which ADR-0070's schema test guards. Next comes a path added later that shows a held node, which the reject predicate stops. Nothing here leaves the Mac, as ADR-0380 states for addendum 2.

Failure states, each with its next step and one audience:

- `held_node_refused`: the reject predicate refused a task of a held node. The caller takes its next candidate, and the verify simulation counts the refusals. Audience: the developer, because a refusal means a candidate list forgot the hold.
- `retention_check_late`: a check was placed after its window's end. The observation still counts, and the list marks it «с опозданием». Audience: the parent.
- `retention_check_void`: a check attempt gave no observation. The Director plans the same check number again. Audience: the owner, through the void share the reversal conditions watch.
- `retention_void_limit`: a third void check in a row cancelled the series. The list shows «проверка отменена». Audience: the parent.
- `retention_plan_unconfirmed`: the full recompute at an adventure's end, under the same versions, doesn't give «устойчиво» for a node the per-node update planned. The Director cancels with reason `state_not_confirmed`, and a new series starts when a full recompute next gives the node «устойчиво». Audience: the developer, since ADR-0060 requires the two runs to agree and this is a bug.
- `retention_backlog`: more than 9 checks are past their windows. The server logs one warning. Audience: the owner.

## What would reverse it

- If, over the first 20 first checks, fewer than 60 % are right, and the natural retention observations of the same nodes over the same months are right more often, the hold itself is losing skills that review would have kept. Research then reopens the window, which only the owner can move. I chose 60 %, because it sits below the 76 % ASSISTments pupils kept after 14 days (RES-4220), and 20 checks, because at 20 an 80 % Wilson interval around 60 % stays under about 15 points wide on each side, narrow enough to tell 60 % from 76 %.
- If `no_review_candidate` fills more than 25 % of review slots over 14 adventure days while at least one node is held, the holds are starving review, and the ship-time planning or the window is reopened. I chose 25 %, because ADR-0070 keeps review at 30 % to 40 % of in-corridor slots, and losing a quarter of those review slots leaves about 22 % to 30 %, below the band's floor.
- If more than a third of checks over 30 days are late, leaving out the plans written at ship time or after a recompute, the cap of 3 a day or the first-slot rule can't carry the load. I chose a third, because the three-day window alone can delay a check by up to 2 adventure days inside an 8-day window, so some lateness is ordinary, and a third late means the delay has become the rule.
- If void checks exceed 20 % of check attempts over 30 days, the rule that every walkthrough on a direct prerequisite spoils an observation is too broad, and RES-4220's decision on it is reopened. I chose 20 %, one check in five, because at that rate a series of 4 observations expects about one void repeat, which adds a whole 28 to 35 day window to a series already 3 to 4 months long.
- If the owner changes the window, the 2 of 2 or 3 of 4 rule or the exempt set, the numbers here follow the owner.

The premortem, written as though it had happened: four months after the check shipped, the retention list showed almost every node «удержание подтверждено», and the parent read it as proof. Two things had gone wrong. The ship-time planning had put 40 nodes on hold at once, review had run out of candidates, and the corridor filled review slots with the frontier's easiest nodes, so the corridor's success share rose and the checks came after easy runs. The second was the warning line: it sat below the list in small type, and 2 of 2 read as certainty. The reversal condition on `no_review_candidate` exists for the first, and check 8 below reads the warning's place for the second.

## Amends

- ADR-0020: the event catalogue gains `retention_check_planned` and `retention_check_cancelled`, owner ADR-0400, with the cancel reasons `lesson_mark`, `void_limit` and `state_not_confirmed`, and `solution_shown` and `hint_shown` gain a required `itemId` from their first payload version, or from a new payload version with an upcaster when events without it are already stored.
- SPC-0020: the facts row "Whether and for how long the short solution and the detailed explanation were shown" gains "and, for `solution_shown`, the `itemId` of its task", and the `hint_shown` row gains "with the `itemId` of its task".
- ADR-0060: "`nextReview` is `lastSeen` plus 1, 3, 7, 14 or 30 days after the 1st to 5th unassisted success in a row" gains "except that a retention check stands in for any review falling while the node is held, and the ladder resumes from the check's result" (REQ-6842).
- ADR-0060: "Review tasks are ordinary observations" becomes "Review tasks and retention checks are ordinary observations, and a retention check writes no new stream" (REQ-6888).
- ADR-0070: "a node in «Устойчиво» (stable) enters it no more than once in any 7 consecutive days (REQ-0832)" gains "and a node held for a retention check never enters it".
- ADR-0070: "Among eligible nodes the Director takes the one unchecked for longest" becomes "Among eligible nodes, none of them held for a retention check, the Director takes the one unchecked for longest" (REQ-6846).
- ADR-0070: "A stale node ... joins the candidate set whatever its frontier status, and among equal values it goes first" gains "unless it is held for a retention check" (REQ-6844).
- ADR-0070: "each a probe of a node drawn at random from those in 'fluent (inferred)' or cut off (REQ-0972)" gains "and not held for a retention check".
- ADR-0070: the reject predicate "refuses a template and parameter hash shown within the window" gains "and refuses every task of a node held for a retention check whose purpose isn't `retention_check`".
- ADR-0070: the room slot rule gains "a due retention check, or the review owed after a wrong retention observation, takes the first room slot of its node's domain floor in whatever slot type the corridor gives, at most 3 checks an adventure day and none after a fatigue signal in the session".
- ADR-0070: "The `escalation` term is 1 for every obligation row of ADR-0060 that asks for evidence on the node" gains "and for a block owed after a retention series ended not confirmed" (REQ-6880).
- ADR-0180: "They use only unassisted first attempts from blocks, probes and review (REQ-1414)" becomes REQ-6796's rule: first attempts from blocks, probes, review, lesson rechecks and retention checks, assisted ones only in figures labelled as help, every «сама» share from unassisted first attempts alone.
- ADR-0180: the Summary's list of nodes not checked for more than 30 days shows a held node with «проверка запланирована» and its window, so the parent reads the gap as planned.
- SPC-0180: the Dynamics views passage "They use only unassisted first attempts from blocks, probes and review (REQ-1414)" becomes the same rule of REQ-6796.
- ADR-0230: a riddle's node choice gains "never a node held for a retention check".
- ADR-0300: "The Director picks the node for the day's 2 track tasks in this order" gains "skipping a node held for a retention check, and a due check on a track node takes the first track task".

## Consequences

- `src/shared/events.ts` gains the schemas of `retention_check_planned` and `retention_check_cancelled`, each with `owner: "ADR-0400"`, when the check's stage lands, and `itemId` on `solution_shown` and `hint_shown` in the MVP.
- New projections: `retention_observations`, read also by the profile's retention bar (REQ-6740, ADR-0390), and `retention_series`, read by the Director and the report.
- The Director's `nextTask` and `planFloor` read `retention_series` for holds, due checks and owed reviews and blocks.
- The report gains the weekly breakdown, the trajectory and the retention list on the post-MVP dynamics screen, and the subtype split and the node's series on the node card.
- `ru.json` gains the bin names, «удержание подтверждено», «удержание не подтвердилось», «проверка запланирована», «удержание не измеряется» with three reasons, «проверка отменена», «с опозданием» and the 2 of 2 warning. This decision adds no text the player sees, so the Russian-only rule of `CLAUDE.md` isn't touched.
- `tools/simulate.ts` gains retention runs for checks 5 and 6 below.

## How I will know it was realised

1. A schema test finds `itemId` required on `solution_shown` and `hint_shown` from the payload version that landed with it, the first one unless events without it were stored, and a log built by the MVP's attempt flow has it on every such event.
2. A report test over fixture logs puts each first attempt in exactly one bin, including `clean` after rung 1 with `hintMaxLevel` 1 in «с опорой», «Не знаю» after a hint in «требует обучения», and leaves out a rapid guess, an excluded task, a second attempt, a mental arithmetic task, a control fact, a Volley row and a task with a new form.
3. A trajectory test builds a node with 2, 1 and 3 unassisted first attempts in three weeks and asserts that the third week's share pools all three weeks and names them, that 4 attempts over 4 weeks show «мало данных», and that the mean depth scores a wrong first attempt 4.
4. Acceptance test 1 passes as REQ-6898 sets it: the plan due 28 to 35 game days after the latest meeting at the first «устойчиво», no held node on any covered path before its check, no observation after a lesson mark inside the interval, a lesson mark cancelling the plan, series observations unchanged by a recompute under a new threshold version, and fixtures ending at 2 of 2, 0 of 2, 1 of 3, 2 of 4 and 3 of 4 each reaching their result.
5. A simulation over 90 simulated days asserts that no `item_shown` or `compose_shown` names a held node before its check, on every path, and that `held_node_refused` never fires.
6. The same simulation asserts at most 3 checks an adventure day, none after a fatigue signal, each check in the first room slot of its domain floor, and no plan ever for an exempt node.
7. Fixture tests cover what REQ-6898 leaves out: a void check replanned under the same number, a hinted check counted wrong, the next-day review shown before the next hold, a third void cancelling with `void_limit`, a plan at ship time with the 7-day fallback window, and the replan after a lesson's second recheck.
8. The parent reads the dynamics screen with a planned, a confirmed, a failed and a cancelled series, and confirms that the 2 of 2 warning sits beside the list at the size of the list's own text.

## What this does not settle

- The Wilson interval, the floors, the owners of event types and the MVP scope: ADR-0380.
- The profile's retention bar and its dynamics: ADR-0390.
- The layout of the dynamics screen and the node card: ADR-0150's design system and the screens' specification.
- Whether a node reached fast and a node reached slowly should get different windows, which Xiong and Beck's data suggest and the owner's fixed window rules out for now.
- Retention of the exempt nodes, which the fact states of ADR-0290 cover for basic facts and nothing covers for T1 to T4.

Amended on 2026-10-10: this record no longer addresses 1 requirement that was superseded, because a decision cannot realise a requirement that is no longer in force: REQ-6818 (superseded by REQ-7502, which ADR-0460 addresses).
