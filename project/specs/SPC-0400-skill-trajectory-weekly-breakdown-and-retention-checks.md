---
id: SPC-0400
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-6800, REQ-6802, REQ-6804, REQ-6806, REQ-6808, REQ-6810, REQ-6812, REQ-6814, REQ-6816, REQ-6818, REQ-6820, REQ-6822, REQ-6824, REQ-6826, REQ-6828, REQ-6830, REQ-6832, REQ-6834, REQ-6836, REQ-6838, REQ-6840, REQ-6848, REQ-6850, REQ-6852, REQ-6854, REQ-6856, REQ-6858, REQ-6860, REQ-6862, REQ-6864, REQ-6866, REQ-6868, REQ-6870, REQ-6872, REQ-6874, REQ-6876, REQ-6878, REQ-6880, REQ-6882, REQ-6884, REQ-6886, REQ-6888, REQ-6890, REQ-6892, REQ-6894, REQ-6896, REQ-6898]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The skill trajectory, the weekly breakdown and retention checks

## Scope

This document covers how the report shows each node's help by depth week by week, how the log yields a retention observation, and how the Director plans, holds, places and counts a retention check. It covers the task that `solution_shown` and `hint_shown` name, the weekly breakdown, the trajectory, the projections `retention_observations` and `retention_series`, the exempt nodes, the plan, the hold, the check's placement and task, the series and its end rule, the cancellations, the planning at ship time and after a recompute, and the retention list in the report. It is written at the level of events, projections, Director rules and report figures. ADR-0400 holds the reason for each rule here.

The parts enter in three increments, each working without the next:

| Increment | When | What it adds |
| --- | --- | --- |
| 1 | in the MVP | the `itemId` of its task on `solution_shown` and `hint_shown` |
| 2 | after the MVP | the weekly breakdown, the trajectory and the natural retention observations on the dynamics screen, all computed from the log |
| 3 | after the MVP | the planned check, the hold, the series, the cancellations and the retention list's series labels |

It leaves out what other records state. The 80 % Wilson interval on every share, the rule that each measure owns its «мало данных» (too little data) floor, the owner of each new event type, the `item_shown` purpose values and the MVP scope are ADR-0380's. The profile's retention bar is ADR-0390's, and it reads the observations this document defines. The node states, the review ladder, `stale` and the full block are SPC-0060's; the Director's corridor, candidate sets, reject predicate, fatigue signal and rapid guesses are SPC-0070's; the game day is SPC-0090's; the report's screens, lesson marks and rechecks are SPC-0180's; the string files are SPC-0160's. The side-slot rule that picks a shown subtype and a shown frame context is ADR-0410's, and the scope guard's traces are SPC-0190's. The layout of the dynamics screen and the node card belongs to ADR-0150's design system.

## Boundary

### Events

| Event | Payload | Increment |
| --- | --- | --- |
| `solution_shown` | `itemId` of its task, required in every payload version, beside `attemptNo` and `dwellMs` (REQ-6890) | 1 |
| `hint_shown` | `itemId` of its task, required in every payload version, beside `attemptNo` and the rung (REQ-6892) | 1 |
| `retention_check_planned` | `nodeId`, `seriesId`, `checkNumber` (1 to 4), `anchorDate`, `countFrom` (`latest_meeting` or `plan_day`), `fromDays`, `toDays`, `holdStarts` (`now` or `after_review`) (REQ-6838) | 3 |
| `retention_check_cancelled` | `nodeId`, `seriesId`, `reason` (`lesson_mark`, `void_limit` or `state_not_confirmed`) and the `seq` of the event that caused it (REQ-6852) | 3 |

`src/shared/events.ts` holds the schemas. `retention_check_planned` and `retention_check_cancelled` carry `owner: "ADR-0400"`. A retention check's `item_shown` carries `purpose: "retention_check"`, and no packet sent to the client carries `purpose` (SPC-0030, SPC-0070).

### Projections

| Projection | What it holds | Readers |
| --- | --- | --- |
| `retention_observations` | every retention observation per node, with its date, its result, its gap in game days as `daysSinceLastExposure`, and whether it fell inside a series | the report, the profile's retention bar (ADR-0390) |
| `retention_series` | per node, its plans keyed by node, its open series with its observations, its result, the due window as dates, the hold, a block owed and the restart rule waiting | the Director's `nextTask` and `planFloor`, the report |

### Report parts

The weekly breakdown, the trajectory and the retention list sit on the dynamics screen, and the node card shows the breakdown split by subtype and the node's series. Both screens come after the MVP; report v1's nine screens don't change (SPC-0180).

### Strings

The Russian string file `content/i18n/ru.json` holds, under `parent.*`, the four bin names, «мало данных», «удержание подтверждено» (retention confirmed), «удержание не подтвердилось» (retention not confirmed), «проверка запланирована» (check planned), «проверка отменена» (check cancelled), «с опозданием» (late), «удержание не измеряется» (retention not measured) with its three reasons, the three cancellation reasons shown beside «проверка отменена», the label naming the weeks a share pooled, and the warning of REQ-6886. The player sees no new string.

### Failure states

`held_node_refused`, `retention_check_late`, `retention_check_void`, `retention_void_limit`, `retention_plan_unconfirmed` and `retention_backlog`, set out under Failure paths.

### What this part requires from other parts

- SPC-0020 supplies the log, `appendEvents`, the projections' rebuild and the full recompute.
- SPC-0060 supplies the node states, «устойчиво» (stable) among them, the per-node update and the full recompute at an adventure's end, the review ladder, the full block and the dropped observations.
- SPC-0070 supplies the reject predicate the generator asks, the corridor's slot types, the `escalation` term, the fatigue signal, rapid guesses and the three-day domain window.
- SPC-0080 supplies the hint ladder, `hintLevel`, `hintMaxLevel` and the outcomes `clean`, `partial` and `alt`.
- SPC-0090 supplies the game day, from 04:00 to 04:00, and the adventure day.
- SPC-0180 supplies lesson marks, `parent_tag_added`, the «тренировали факты» (we practised facts) mark as `facts_trained_marked`, and the lesson's rechecks.
- SPC-0050 supplies the graph version, each node's direct prerequisites and each subtype's weight; `content/facts.yaml` maps facts to nodes.

### Permitted dependencies

- `retention_observations` reads only the log and the graph version active at each attempt. It reads no node state, so no model, threshold or rules version changes an observation.
- `retention_series` reads the log and `retention_observations`, and writes nothing to the log. The Director alone appends `retention_check_planned` and `retention_check_cancelled`.
- The report functions in `src/parent/` read both projections and append no event. No module in `src/engine/` imports `src/parent/`.
- No player route, packet or screen reads either projection.

## Behaviour

### Increment 1: every walkthrough names its task

`solution_shown` carries the `itemId` of its task as a required field from its first payload version (REQ-6890), and so does `hint_shown` (REQ-6892). Version 1 of both schemas in `src/shared/events.ts` has it, and every later version keeps it. Nothing else in this document enters the MVP. `explanation_shown` reaches its task through `explanation_bought`, as SPC-0120 states.

### Counted first attempts

The weekly breakdown and the trajectory read one set, the counted first attempts: graded first attempts on a task shown for a block, a probe (`probe`), review (`review`), a lesson recheck (`recheck`) or a retention check (`retention_check`), whose `forms` list is empty and which SPC-0060 doesn't drop (REQ-6810). The set leaves out rapid guesses, excluded tasks, second attempts, mental arithmetic, control facts, Volley rows and every task with a non-empty `forms`, a Dutch probe letter included. A week runs from Monday to Sunday by the game day (REQ-6812).

### The weekly breakdown

The dynamics screen splits each node's counted first attempts of each week into four bins and shows the count in each, such as "5 сама, 1 хватило первой ступени, 2 требует обучения" (REQ-6800). Each attempt lands in exactly one bin, read from `attempt_submitted`'s outcome, `hintLevel` and `hintMaxLevel`:

| Bin | Rule |
| --- | --- |
| «сама» (on her own) | `clean` with no hint shown (REQ-6802) |
| «хватило первой ступени» (rung 1 was enough) | `clean`, deepest rung 1, `hintMaxLevel` 2 or more (REQ-6804) |
| «с опорой» (with support) | `clean` after rung 2 or 3, or after rung 1 with `hintMaxLevel` 1 (REQ-6806) |
| «требует обучения» (needs teaching) | `partial` or `alt`, «Не знаю» (I don't know) included, at any depth of help (REQ-6808) |

A count has no floor. The node card shows the same counts split by subtype (REQ-6814).

### The trajectory

The trajectory draws one point per node for each week that holds at least one counted first attempt (REQ-6816). Each point carries three figures.

The share «сама» is the unassisted counted first attempts that end `clean` over all unassisted counted first attempts (REQ-6824). When the week holds fewer than 5 unassisted counted first attempts, the share pools the week with the calendar weeks just before it, empty ones included, until the count reaches 5, over at most 4 weeks with the point's own week included, and names the weeks it pooled (REQ-6818). When those 4 weeks hold fewer than 5, the point shows «мало данных» with its count and no share. Otherwise it shows the count and ADR-0380's 80 % Wilson interval.

The mean depth of help is the mean over the week's counted first attempts of a score per attempt: 0 for `clean` with no hint, the deepest rung from 1 to 3 for `clean` after hints, and 4 for `partial` or `alt` (REQ-6820). A `clean` answer after rung 1 on a one-rung ladder scores 1. The point shows the mean to one decimal with its count, and no floor.

The marks sit at their dates on the node's line: each `solution_shown` or `explanation_shown` on the node, each lesson mark on the node, each «тренировали факты» mark whose facts `content/facts.yaml` maps to the node, each review task of the node, and each retention observation of the node with its result (REQ-6822).

### Retention observations

A meeting with a node is any `item_shown` or `compose_shown` that names the node, in any subtype, purpose or form, second attempts, mental arithmetic, control facts and Volley rows included (REQ-6828).

A retention observation is a counted first attempt that is unassisted, on a task shown at least 21 game days after the node's latest meeting before that show (REQ-6826). Two things void it. A `parent_tag_added` on the node, or a `facts_trained_marked` on one of its facts, between that meeting and the show voids it (REQ-6830). So does a `solution_shown`, `explanation_shown` or `hint_shown` in that span on a direct prerequisite of the node, under the graph version active at the attempt (REQ-6832). Practice inside a larger task that uses the node voids nothing. An observation is right only when its outcome is `clean` (REQ-6834).

A retention check on which she opened the hint ladder is the one assisted attempt that counts: when it meets every other condition above, it is a wrong observation (REQ-6874). When it misses one, such as the 21-day gap, it gives no observation.

`retention_observations` computes each gap from the log whenever it runs, and no reader uses a gap stored at show time (REQ-6836). An answer queued offline on another device that lands after a show can change which meeting was latest, and the next run gives the new gap. `item_shown` carries no gap. The check's `why` field names its plan's `seriesId` and `checkNumber`.

### Exempt nodes

A node is holdable unless it is exempt. A node is exempt when `content/facts.yaml` names it as a fact's node, when the control-fact set draws from it, or when it is T1, T2, T3 or T4. The Director never holds such a node and never plans its check (REQ-6848). A program computes the exempt set from the content files. The report shows each exempt node «удержание не измеряется» with its reason: fixed control facts, the Guardian's step ladder, or automaticity measured by frequent showing (REQ-6850). Its natural observations still appear in the retention list.

### The plan

When a holdable node with no open series and no confirmed series first reaches «устойчиво», the Director logs `retention_check_planned` at its next call after the per-node update that produced the state, so the hold starts in the same session (REQ-6838). The plan names the node, a new `seriesId`, `checkNumber` 1, the game day the node reached «устойчиво» under the versions active at the plan as `anchorDate`, `countFrom: latest_meeting`, `fromDays` 28, `toDays` 35 and `holdStarts: now`.

`retention_series` turns a plan into dates. Its due window runs from `fromDays` to `toDays` game days after its start point: the node's latest meeting before the hold starts for `latest_meeting`, or the plan's game day for `plan_day`. Each node has at most one open plan, and the Director refuses a second.

### The hold

From the plan's logging, or from the next-day review where `holdStarts` is `after_review`, the Director never shows a held node until the plan's check is shown (REQ-6840). Every candidate list the Director builds leaves out every task that names a held node, as its node or as any node a riddle or a multi-node task names: the frontier, review, stale-node priority, island checks, mental arithmetic, riddles, the Volley, the Sources track, grouping slots, warm-ups and easy tasks. As a backstop, the reject predicate the generator asks refuses every task that names a held node, as its node or as any node a riddle or a multi-node task names, whose purpose isn't `retention_check`, and the caller takes its next candidate. While a node is held, SPC-0060's `nextReview` and `stale` still compute, and the Director doesn't act on them. SPC-0060 states that the check stands in for any review falling during the hold and that the review ladder resumes from its result, and SPC-0070 states that stale-node priority and review order skip a held node.

### Placing the check

From the first day of its due window, a due check takes the first room slot of its node's domain floor, and a check still unplaced after its window's end takes it too (REQ-6856). When two checks are due on one floor, the one whose window started earlier takes the first slot and the next takes the slot after it. For a Sources track node, the check takes the first of the day's two track tasks on its host floor. The check takes the slot type the corridor gives, review or frontier, and records it in `flowSlot`.

The Director places at most 3 checks in an adventure day (REQ-6860), and none after a fatigue signal in the same session (REQ-6862). A check it can't place waits for the next floor of its domain. The due date alone chooses the check, and no success share decides whether a check comes.

### The check's task

The check's subtype is a draw by the seed, weighted by the graph's subtype weights, among the node's subtypes of weight 0.2 or more, or among all its subtypes when none reaches 0.2 (REQ-6858). Under ADR-0410's side-slot rule the draw takes only subtypes she has already been shown whenever one fits, and the frame picker takes a frame whose context she has already seen on that subtype. The task comes from a free-input template where the subtype has one, with an empty `forms` list. The check runs the ordinary attempt flow of SPC-0080. Its attempt feeds "on her own", the fluency estimate and the state rules as a review task's attempt does, and writes no new observation stream (REQ-6888).

### The series

A series starts at its first plan, with `checkNumber` 1, and counts every retention observation of the node from that plan on, natural ones included (REQ-6866). `retention_series` reads the observations in log order and ends the series by this rule (REQ-6868):

| Observations so far | Result |
| --- | --- |
| 2 right of 2, or 3 right of 4 | «удержание подтверждено» |
| 0 right of 2, 1 right of 3, or 2 right of 4 | «удержание не подтвердилось» |
| anything else | pending |

At each run the Director acts on the series:

- Pending after a right observation: it logs the next plan with the same `seriesId`, the next `checkNumber`, `countFrom: latest_meeting` and `holdStarts: now` (REQ-6870).
- Pending after a wrong observation: it first gives the node its next-day review, then holds it (REQ-6876). It logs the next plan with `holdStarts: after_review` (REQ-6870). The review takes the first room slot of the node's domain floor after any due checks, on the next game day with that floor, whatever the node's expected chance of success. The hold starts once the review is shown, and the window counts from it.
- A check attempt that gives no observation, for example a rapid guess, an excluded task, a walkthrough on a direct prerequisite, or a meeting logged late that leaves the gap under 21 game days: it logs a plan with the same `seriesId` and `checkNumber`, `countFrom: latest_meeting` and `holdStarts: now`, so the window counts 28 to 35 game days from that attempt (REQ-6872). A lesson mark doesn't take this path, because it cancels the plan.
- Confirmed: it plans no further check for the node (REQ-6878). Later natural observations enter the list and leave the result as it is.
- Not confirmed: the node returns to ordinary scheduling, and `retention_series` records a full block owed on the node, which SPC-0070's `escalation` term raises until the block forms (REQ-6880). When that block leaves the node «устойчиво», a new series starts; when the node drops below, a new series starts when it next reaches «устойчиво» (REQ-6882).

### Cancelling a plan

A lesson mark on the node, or a «тренировали факты» mark on one of its facts, ends any hold and cancels the open plan: the Director logs `retention_check_cancelled` with the reason `lesson_mark` (REQ-6852). This holds for a plan whose hold hasn't started, such as one waiting for its next-day review. Every node `content/facts.yaml` names is exempt, so no planned node has facts and the «тренировали факты» clause never fires. The cancelled series keeps its observations in the list and gets no result. A new series starts at `checkNumber` 1 when the lesson's second recheck leaves the node «устойчиво». When that recheck leaves it below, or its window closes with no block, the new series starts at the first Director run after that window at which the node is «устойчиво» (REQ-6854).

A third void check in a row in one series cancels it with the reason `void_limit`. A new series then starts at the first Director run at least 35 game days after the cancel at which the node is «устойчиво».

When the full recompute at an adventure's end, under the same versions, doesn't give «устойчиво» for a node the per-node update planned, the Director cancels the plan with the reason `state_not_confirmed`. A new series starts when a full recompute next gives the node «устойчиво».

### Planning at ship time and after a recompute

When the check ships, and after a recompute under a new threshold, rules or model version, every holdable node that is «устойчиво» with no open series, no confirmed series and no restart rule still waiting gets a plan at the Director's next run, and its hold starts at that plan's logging (REQ-6894). Its window counts 28 to 35 game days from the node's latest meeting. When that window has already passed, the plan carries `countFrom: plan_day`, `fromDays` 0 and `toDays` 7. A recompute never overrides a restart rule after a failed or cancelled series.

A recompute never cancels a plan or ends a hold, even when it moves a held node out of «устойчиво» (REQ-6896). The report then shows the node's current state beside its series. A recompute leaves every series' observations unchanged, because `retention_observations` reads no version.

### The retention list

The report lists per node «проверка запланирована» with its due window, and «удержание подтверждено» and «удержание не подтвердилось» with the date of the deciding observation, each with its count of right observations out of the total (REQ-6884). The list holds every retention observation of the node with its date and result, including those outside any series, on exempt nodes and after a confirmed series. A cancelled series shows «проверка отменена» with its date and reason. A check placed after its window's end, `toDays` game days after its start point, carries «с опозданием» (REQ-6864), and still counts in its series.

Beside the list, at the size of the list's own text, the report states that 2 right of 2 can't reliably tell a child who is right 90 % of the time from one who is right 70 % of the time (REQ-6886).

The Summary's list of nodes not checked for more than 30 days shows a held node with «проверка запланирована» and its window.

### Ceilings

- A node has at most one open plan, so held nodes never outnumber holdable nodes.
- Due checks drain at 3 an adventure day, earliest window first. When more than 9 checks are past their window's end at once, the server writes one `retention_backlog` warning to its operational log, and writes it again only after the count has fallen to 9 or below and risen past it.
- A series holds at most 3 void checks in a row and at most 4 observations.

### Acceptance test 1

Acceptance test 1 shows each of these on fixture logs (REQ-6898):

- the check is planned due 28 to 35 game days after the node's latest meeting when the node first reaches «устойчиво»;
- no held node appears on any path the hold covers before its check;
- an observation after a lesson mark inside the interval doesn't count, and the lesson mark cancels the plan;
- a recompute under a new threshold version leaves each series' observations unchanged;
- fixtures ending at 2 of 2, 0 of 2, 1 of 3, 2 of 4 and 3 of 4 each reach their result.

A simulation over 90 simulated days in `tools/simulate.ts` asserts that no `item_shown` or `compose_shown` names a held node before its check, that `held_node_refused` never fires, that no adventure day holds more than 3 checks, that no check follows a fatigue signal, that each check takes the first room slot of its domain floor not already taken by a check whose window started earlier, or the first of the day's track tasks for a Sources track node, and that no exempt node is ever planned.

## Failure paths

| Condition | What happens | Audience |
| --- | --- | --- |
| `held_node_refused`: the reject predicate refuses a task of a held node | The caller takes its next candidate, and the verify simulation counts the refusal. | developer |
| `retention_check_late`: a check is placed after its window's end | The observation counts in its series, and the list marks it «с опозданием». | parent |
| `retention_check_void`: a check attempt gives no observation | The Director plans the same `checkNumber` again, its window counting from that attempt. | owner |
| `retention_void_limit`: a third void check in a row | The Director cancels the series with `void_limit`, and the list shows «проверка отменена». | parent |
| `retention_plan_unconfirmed`: the full recompute under the same versions doesn't give «устойчиво» for a planned node | The Director cancels with `state_not_confirmed`. | developer |
| `retention_backlog`: more than 9 checks are past their windows | The server writes one warning to its operational log. | owner |
| A meeting logged late, such as an answer queued offline on another device, shortens a check's gap below 21 game days | `retention_observations` recomputes the gap, the attempt gives no observation, and the Director replans the same `checkNumber`. | owner |
| She opens the hint ladder on a retention check | The attempt counts as a wrong observation. | parent |
| No floor of the check's domain comes on a day inside its window | The check waits for the next floor of its domain and is marked late when placed after the window's end. | parent |
| A fatigue signal fires before a due check is placed | The check waits for a later session. | parent |
| A week holds fewer than 5 unassisted counted first attempts over its 4-week span | The point shows «мало данных» with its count. | parent |
| A lesson mark arrives while a plan waits for its next-day review | The Director cancels the plan with `lesson_mark`, and no hold starts. | parent |
| A recompute moves a held node out of «устойчиво» | The plan and the hold stand, and the report shows the current state beside the series. | parent |
| `solution_shown` or `hint_shown` arrives without `itemId` | The schema refuses it and `appendEvents` writes nothing. | developer |

## Choices made in this document

- The weeks pooled for the share «сама» number at most 4 with the point's own week included, as ADR-0400 reads REQ-6818, and they are calendar weeks, empty ones included, since ADR-0400 speaks of a span of weeks.
- When no subtype reaches weight 0.2, the check's draw runs over all the node's subtypes as REQ-6858 states, narrowed by ADR-0410's side-slot rule to subtypes she has been shown whenever one fits. ADR-0400 states the fallback as the shown subtypes alone; the two readings give the same draw, because a node reaches «устойчиво» only after she has been shown some of its subtypes.
- A check is late when placed after its window's end, `toDays` game days after its start point. For a `latest_meeting` window that is more than 35 game days after the meeting, as REQ-6864 states. REQ-6864 doesn't cover a `plan_day` window, and ADR-0400 extends the late mark to its end, 7 game days after the plan.

## Open findings

- REQ-6818 says "as many earlier weeks, up to 4", which reads as up to 4 earlier weeks, 5 in all, while its reason speaks of a four-week span. ADR-0400 chose 4 in all and records the question for the person approving; this document follows ADR-0400 and leaves the question open.
- ADR-0400 increment 1 says no code writes `solution_shown` or `hint_shown` yet, while `src/shared/events.ts` already holds both in version 1 with a required `itemId`, as ADR-0380 records. The obligation is met either way; the decision's sentence is out of date.

## Open review findings

- Round 1, adding REQ-6842, REQ-6844 and REQ-6846 to `states:`: rejected. The addendum 2 spec map gives REQ-6842 to SPC-0060 and REQ-6844 and REQ-6846 to SPC-0070, and this document cites those specs under The hold in place of stating the requirements twice.
- Round 1, reasons for the recompute and restart rules, the `void_limit` count and its 35-day rest, the order of two checks on one floor and the Sources track slot: rejected, because a specification states what the system does and never why (S8); ADR-0400 holds the reasons.
- Round 2, the header comment's promise of a reason beside each rule: kept as the template ships it, since every spec in `project/specs/` carries it; Scope now names ADR-0400 as the holder of the reasons (S8).
