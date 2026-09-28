---
id: SPC-0060
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-0900, REQ-0902, REQ-0904, REQ-0906, REQ-0908, REQ-0910, REQ-0912, REQ-0914, REQ-0916, REQ-0918, REQ-0920, REQ-0922, REQ-0924, REQ-0926, REQ-0928, REQ-0930, REQ-0932, REQ-0934, REQ-0936, REQ-0938, REQ-0940, REQ-0942, REQ-0944, REQ-0946, REQ-0950, REQ-0952, REQ-0954, REQ-0960, REQ-0962, REQ-0964, REQ-0968, REQ-0976, REQ-0980, REQ-0982, REQ-0984, REQ-0986, REQ-0988, REQ-0990, REQ-0992, REQ-0994, REQ-5024, REQ-5026, REQ-5028, REQ-5136, REQ-5138, REQ-5140, REQ-5142, REQ-5144, REQ-5318, REQ-5320, REQ-5322, REQ-5354, REQ-5424, REQ-5452]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The knowledge model: estimates, states, inference, versions and the streams of new forms

## Scope

This document covers the knowledge model: the pure function that turns the event log into per-node estimates, report states, inferred states, obligations for the Director and daily snapshots, the versions that govern those results, the gate a new model version passes, and the separate streams that keep the new forms of the owner's addendum 1 out of the "on her own" estimate. It is written at the level of the model's inputs, projections, parameters and rules; it names no screen and no table layout.

It leaves out what other specifications state. The event schemas and the projection storage and rebuild belong to SPC-0020. The skill graph's nodes, subtypes, levels and weights belong to SPC-0050. What the Director does with the estimates and obligations, the rapid-guess mark, the fatigue weight and the fatigue rule for blocks belong to ADR-0070. The attempt flow, the hint ladder, the estimate step and the inverse check as the player meets them belong to ADR-0080. How the report draws states, coverage, trends, the depth figures and «на пороге» (on the threshold) belongs to ADR-0180. The composing stream's counts belong to ADR-0230, the grouping stream's rows to ADR-0260, the plan phase and its labels to ADR-0270, the fact states and the Volley to ADR-0290, the Sources track's rows to ADR-0300, and the exclusion of school snapshots to ADR-0310.

## Boundary

### Inputs

| Input | What the model reads from it |
| --- | --- |
| The event log | Every event except the `school_snapshot_*`, `puzzle_*` and `diary_cipher` events. |
| `content/graph.yaml` | Nodes, subtypes with their level, weight and `form`, prerequisites per subtype. |
| `content/model.vN.json` | The parameters, the prior rows for groups 7 and 8, and `admittedForms`. |
| The `thresholds` projection and `content/versions.json` | The fluency threshold per template and device type, under the active threshold version. |
| `RULES_VERSION` in `src/engine/states/version.ts` | The version of the state and inference rules. |

### Projections it writes

| Projection | Rows | Read by |
| --- | --- | --- |
| `node_estimates` | One per node and one per node and subtype: `pKnow`, the fluency and "with help" beta estimates, the four shares by depth of help, `uncertainty`, `lastSeen`, `stale`, `nextReview`, `confidence`, `testedState`, `inferredState`, `cutBy`, `isGap`, the rule identifier, the item identifiers the rule used, the label key, the four versions and the last `seq` counted | the Director, the report |
| `node_snapshots` | One per node, game day of play and set of four versions | the report |
| `node_obligations` | A set keyed by node and kind | the Director |
| `estimate_stream` | The number-sense stream: one BKT estimate per node and subtype | the export, the refit |
| One projection per other stream: `compose`, `grouping`, `plan`, `bridge`, `surplus`, `missing` | The observations of that form | the report, the Director for placement |

### Commands and tools

| Command | What it does |
| --- | --- |
| `./tower model activate` | Runs `tools/eval-model.ts` on a candidate model version, writes `model_activated` when the candidate passes, and refuses it otherwise. |
| `./tower status` | Shows `recompute_slow` and `snapshot_ceiling` to the owner. |

The refit tool `tools/fit-model.ts` doesn't exist during the MVP.

### Failure states

| Name | Audience |
| --- | --- |
| `model_params_invalid` | the owner |
| `model_candidate_rejected` | the owner |
| `recompute_failed` | the parent |
| `recompute_slow` | the owner |
| `snapshot_ceiling` | the owner |
| `node_update_failed` | the owner, in the server log |

### Permitted dependencies

The model lives in `src/engine/model/` and `src/engine/states/`. Code there does no input or output and makes no network call: it takes the log, the graph, the parameter file and the versions as arguments and returns projections, so one log under one set of versions always gives byte-identical projections. It reads no `school_snapshot_*` event, and the lint check `school_events_in_model` fails the build when it does. No route accepts an estimate or a state from a client, and only the server writes these projections. The Director and the report read the projections and never write them. No stream projection feeds `pKnow`, the fluency estimate or the "with help" estimate, and only an activated model version can change that, through `admittedForms`.

## Behaviour

### When the model runs

The server runs the model at three moments. After each graded first attempt, it recomputes the estimates and states of the attempted node and its graph neighbours from that node's events. When an adventure ends, it runs a full recompute over the whole log with the active versions of the model, the thresholds and the rules, and the result replaces every per-node result (REQ-0900). At server start, it compares the versions recorded in `node_estimates` with the active ones and runs a full recompute over the whole history when any differs (REQ-0902).

Every run evaluates forgetting and decay at the server time of the event that triggered it, and a run that no event triggers, the one at server start included, evaluates them at the server time of the newest event in the log, so a recompute of the same log at a later hour gives the same projections (REQ-0912). The per-node update takes at most 50 ms at the 95th percentile, and the full recompute over one year of play at most 10 s on the family Mac.

### Versions

Four versions govern every result, and every row of `node_estimates` and `node_snapshots` records all four:

| Version | Where it lives | What changes it |
| --- | --- | --- |
| model | `content/model.vN.json` plus the prior row in use | `./tower model activate`, which writes `model_activated`, or a change of the school-group setting, which logs `settings_changed` |
| rules | `RULES_VERSION` | a code change to the state or inference rules |
| thresholds | the version in `content/versions.json` joined by `+` with the `seq` of the latest `fact_threshold_set`, or with `0` when the log holds none, such as `3+0` or `3+18204` | a threshold file change, a threshold change by a person or the monthly motor recalibration |
| graph | `content/graph.yaml` | a graph edit |

The prior row follows the latest school-group setting in the log, and SPC-0040 states where that setting lives. The model version is the file version plus the row, so a change of school group is a new model version and a full recompute, and the starting estimates of another group take effect only that way (REQ-0984). A change of school group passes no held-out gate and writes no `model_activated`. No date or clock value selects a row.

A golden test runs fixed fixture logs through the rule engine and compares the states with stored results, and it fails, naming the fixture, when the states change and `RULES_VERSION` didn't. A new rules version triggers the full recompute at the next server start (REQ-0902).

### Observations

The "on her own" estimate takes an attempt as an observation only when it is a graded, unassisted first attempt (REQ-0914). The model drops an attempt from every estimate, state, probe and block when any of these holds:

- it carries the rapid-guess mark ADR-0070 states;
- the parent excluded its task with `item_excluded` and no later event re-included it, which takes effect at the next recompute (REQ-0916);
- it is ungraded: a warm-up, an easy task or a Session 0 task;
- it is a riddle, of either form;
- its `item_shown.forms` holds a form that the active model version doesn't list in `admittedForms`, which also keeps it out of the fluency estimate, the "with help" estimate and the shares by depth of help, while it still feeds its stream (REQ-5026).

An `attempt_late` event is never an observation. An attempt with `interrupted: true` or `crossDevice: true`, or on an item that carries an estimate, counts for accuracy, and its time counts in no measure: it stays out of the fluency estimate, and its time enters no block's median (REQ-0926). Every other attempt's time excludes `checkMs`.

Each observation carries a score `c` and a weight `w`. The score is 1 for right, 0.5 for partially right and 0 for wrong or «Не знаю» (I don't know), so a partially right answer counts as half right and half wrong (REQ-0918). The verdict `insufficient_correct` scores 1, `insufficient_partial` 0.5 and `false_insufficient` 0 (REQ-5424). The weight is 1, or 0.5 when ADR-0070's fatigue signal marks the attempt.

A control fact is an observation of its node and updates its estimate (REQ-0930). A review task is an ordinary observation. A second attempt and a first attempt on which she opened the hint ladder are assisted, and they feed only the "with help" estimate and its shares by depth (REQ-0922). An inverse check makes no attempt assisted, so an unassisted first attempt made after a check feeds the "on her own" estimate from the first day, like any other first attempt of its subtype (REQ-5354).

### Streams of new forms

Every form of task the owner's addendum 1 adds writes its observations to a stream of its own (REQ-5024). The streams are `compose`, `estimate`, `grouping`, `plan`, `bridge`, `surplus` and `missing`. `item_shown.forms` lists the new forms a shown task uses, filled by the engine from the template and the Director's choices, so the log alone says which streams an attempt feeds. An ordinary task has an empty list, and a surplus task with Dutch keywords has `["surplus", "bridge"]`. The list never holds `plan`.

A stream's observations enter no estimate, state, probe or block other than the stream's own, the fluency and "with help" estimates included, until a model version that admits the stream predicts held-out unassisted first attempts with lower log-loss and lower calibration error than the active version (REQ-5026). The parameter file's `admittedForms` lists the admitted forms, and it is empty in model v1. No refit tool runs during the MVP.

Each stream reads its own events:

| Stream | What feeds it |
| --- | --- |
| `estimate` | the `estimate` field of `attempt_submitted` |
| `surplus` | first attempts on `T1.surplus` to `T3.surplus` |
| `missing` | first attempts on `T1.insufficient` to `T4.insufficient` |
| `grouping` | attempts whose `item_shown.forms` holds `grouping` |
| `compose` | `compose_confirmed` |
| `plan` | `plan_submitted` alone |
| `bridge` | `bridge_check_answered`, and attempts whose `item_shown.forms` holds `bridge` |

The answer to a problem that opened with a plan counts in "on her own", in the blocks, the probes and the states as the answer to a problem that opened with no phase does (REQ-5024).

The `estimate` stream is the number-sense stream: one BKT estimate per pair of node and subtype, with the forgetting and priors of the "on her own" estimate, `pSlip` 0.10 and each `attempt_submitted` with an `estimate` field as one observation (REQ-5318). It treats an estimate as a choice of four, with `pGuess` 0.25 (REQ-5320). During the MVP an estimate feeds neither the "on her own" estimate, the fluency estimate nor the estimate of node N4 (REQ-5322). An item with an estimate keeps `forms` empty, so its exact answer still feeds the "on her own" estimate as an ordinary first attempt.

The word-problem subtypes with a surplus or a missing number are new forms: `T1.surplus` to `T3.surplus` write `surplus`, `T1.insufficient` to `T4.insufficient` write `missing`, and ordinary T4 writes neither (REQ-5028). Each keeps its own estimate, and the unanswerable subtypes take `pGuess` 0.06. These subtypes carry `form: new` and weight 0.1 in the graph. The node aggregate ignores a `form: new` subtype until its stream is in `admittedForms`, so its observations stay out of the estimates of nodes T1 to T4 and out of "on her own" until a model version that uses them passes the held-out comparison and is activated (REQ-5452). From activation its weight counts, and the ordinary subtypes' weights are scaled by 1 minus the admitted new weights, so the weights still sum to 1.

### The "on her own" estimate

Each pair of node and subtype keeps its own BKT estimate `pKnow` (REQ-0908), with these v1 parameters:

| Parameter | v1 value |
| --- | --- |
| `pInit` by the subtype's level | group 7 row: 1F 0.55, 1S 0.25, stretch 0.05; group 8 row: 1F 0.70, 1S 0.40, stretch 0.10 |
| `pLearnPractice` | 0.05 |
| `pLearnFeedback` | 0.15 |
| `pGuess` | free input 0.03; a choice among `k` options 1/`k` |
| `pSlip` | `max(0.10, 1 - 0.95^steps)`, with `steps` the template's number of steps |
| forgetting half-life `H` | starts at 60 days; times 1.5 after a right answer at least 3 days after the pair's previous observation, at most 365 days; back to 60 days after a wrong answer; unchanged after a partially right answer (REQ-0918) |

A subtype takes the prior of its own level from the active row, highest at 1F, lower at 1S and lowest at stretch, so a node with 1F and 1S subtypes starts its 1F subtypes higher (REQ-0982).

For each observation at time `t`, the model applies four steps in this order:

1. Forgetting: `p = p * 2^(-days since the pair's last observation / H)`, a decay towards zero, so the estimate falls while no new evidence arrives (REQ-0912).
2. Feedback: when a walkthrough, explanation or hint on the node was shown since the pair's last observation, which the log marks as `postFeedback`, `p = p + (1 - p) * pLearnFeedback` (REQ-0920).
3. Evidence: `p_right = p(1 - s) / (p(1 - s) + (1 - p)g)` and `p_wrong = p s / (p s + (1 - p)(1 - g))`; then `p_obs = c * p_right + (1 - c) * p_wrong` and `p = p + w * (p_obs - p)`.
4. Practice: `p = p + (1 - p) * pLearnPractice`.

An unassisted right answer never lowers `pKnow`, for any parameter set and any template (REQ-0986): the feedback, evidence and practice steps never lower `p` below its value after the forgetting step at `t`. The model loads a parameter file only after a validator confirms `pGuess + pSlip < 1` and `pLearn < 1 - pSlip / (1 - pGuess)` for every answer form and number of steps in the catalogue, with both learning rates. A property test feeds random parameter sets that pass the validator and every catalogue template, and fails when a right answer lowers `p`.

A node's estimate is the mean of its subtypes' estimates weighted by the subtype weights in the graph, over its ordinary subtypes and its admitted new subtypes (REQ-0910). A subtype with no observation contributes its prior. The Director reads each estimate forgotten to the current time.

### Fluency, "with help" and the shares by depth of help

Two beta estimates sit beside BKT per node and subtype, and neither feeds `pKnow`. Fluency takes the observations of the "on her own" estimate, graded unassisted first attempts, except an attempt whose time counts in no measure, and "with help" takes assisted attempts:

- Fluency starts at `αf = βf = 1`. Each observation adds `w * c * fast * 2^(-age / 30 days)` to `αf` and `w * (1 - c * fast) * 2^(-age / 30 days)` to `βf`, so it estimates the share of first attempts that are right, unassisted and no slower than the fluency threshold (REQ-0926), and an attempt 30 days old has half its weight (REQ-0928). `fast` is 1 when the attempt took no longer than the template's threshold for the device type under the active threshold version.
- "With help" does the same over assisted attempts only, counting a right assisted attempt as a success, with the same 30-day half-life (REQ-0922, REQ-0924). It is pooled over every depth of help (REQ-5140).

Beside the pooled "with help" estimate, each node and subtype keeps four shares of right answers as separate figures: after rung 1, after rung 2, after rung 3 and on the second attempt (REQ-5136). A first attempt counts in the share of its deepest rung, `hintLevel`, and a second attempt counts in the fourth share whatever rung it used. Each share is a beta estimate from `α = β = 1` with the pooled estimate's score and weight, and weights an assisted attempt by `2^(-age in days / 30)` (REQ-5138), so the four shares' observations add up to the pooled estimate's.

Model v1 reads the depth of help in no estimate other than these shares, and the report alone reads the shares (REQ-5142). A model version that reads the depth elsewhere replaces v1 only when it predicts the next unassisted first attempt on held-out days with lower log-loss and lower calibration error (REQ-5144).

### Uncertainty, age and the next review

Each estimate carries these derived fields:

- `uncertainty = entropy(pKnow) * 3 / (3 + nEff)`, where `entropy` is the binary entropy in bits and `nEff` is the sum of the node's observation weights, each times `2^(-age / H)` with the pair's current half-life. It falls as fresh observations accumulate, three fresh observations halve it, and a node with none keeps its full entropy (REQ-0988).
- `lastSeen` is the date of the last unassisted first attempt, and `stale` is true when that date is more than 30 days old.
- `nextReview` is `lastSeen` plus 1, 3, 7, 14 or 30 days after the 1st to 5th unassisted success in a row, and plus 30 days after each further success (REQ-0990). After an unassisted failure it is `lastSeen` plus 1 day (REQ-0992). A success is an observation with `c = 1`, and a partially right answer ends the run and counts as a failure.
- `confidence` is high for a full block within 14 days, medium for a full block 15 to 30 days old and for a probe or an island check within 30 days, and low for an inferred state or evidence older than 30 days.

### States from explicit rules

The rule engine gives each node a state by explicit rules applied to the listed observations of the node's ordinary subtypes, and never to `pKnow` or another probability (REQ-0934). Every state row stores the identifier of the rule that produced it and the item identifiers it used.

| Rule | Condition | State |
| --- | --- | --- |
| `block-low` | a full block scores 2.5 or less | not mastered (REQ-0936) |
| `block-mid` | a full block scores 3 or 3.5 | understands (REQ-0938) |
| `block-slow` | a full block scores 4 or more, and the median time of its right answers is above the fluency threshold | understands, labelled «Понимает, нужна скорость» (understands, needs speed) (REQ-0940) |
| `block-fast` | a full block scores 4 or more, and the median time of its right answers is at or below the threshold | fluent (REQ-0942) |
| `probe-fast` | both tasks of a probe right and each no slower than the threshold; for a choice-only probe, all 3 right | fluent (REQ-0942) |
| `stable` | "fluent" in two checks at least 14 days apart, at least one of them a full block, and no later check worse than "fluent" | stable (REQ-0944) |
| `open` | tasks exist but no block or probe is complete, or the newest complete check is a probe that isn't `probe-fast` and no full block has formed after it | being clarified |
| `none` | no unassisted first attempt | not checked, or "stretch: not checked" on a stretch node |

When several complete checks match, the newest by the `seq` of its last observation sets the tested state, and `stable` reads the whole history (REQ-0934). A complete probe that isn't `probe-fast` escalates as ADR-0070 states. A block's score counts a partially right answer as 0.5. A check for `stable` is a full block, or an Ascent anchor form once Ascents exist, and never a probe (REQ-0944).

A full block is the node's last 5 graded observations, unassisted first attempts only, within 7 days, covering every subtype of weight 0.2 or more (REQ-0950). It never spans a lesson mark for its node, a `parent_tag_added` event: observations before the mark don't enter a block after it (REQ-0952). A mark the parent removes, `parent_tag_removed`, counts as never set from the recompute the removal triggers. A control fact never enters a full block or a probe (REQ-0932), and ADR-0290 states the same for a Volley fact. A probe is 2 observations of different subtypes with `purpose: probe`, or, for a node the graph tests only by choice tasks, 3 choice observations with at least 4 options each (REQ-0954).

The state carries a label key whose string lives in the per-language file. The state "not mastered" has the key `state.not_mastered`, whose Russian string is «Пока не освоено» (not mastered yet) (REQ-0946).

### Inference

The engine applies the inference rules after the tested states:

1. A node tested "fluent" gives each ancestor not tested for 30 days the inferred state "fluent (inferred)"; for a subtype with a prerequisite of its own, only that prerequisite gets it (REQ-0962). A probe made only of choice tasks gives no inference (REQ-0960).
2. A full block that gives "not mastered" gives each descendant the state "not tested, cut off by node X", with X stored in `cutBy` (REQ-0964). The row sets `isGap = false`, and the report counts gaps only from rows where `isGap` is true, so a cut-off node is never a gap (REQ-0968).
3. A node in "understands" puts one probe for each direct descendant on the obligation list.
4. A failed island check puts the node and its prerequisites on the obligation list.
5. A row keeps an inferred state in `inferredState`, apart from `testedState`, and an inferred state never enters `pKnow`, the beta estimates, `nEff` or any count of tested nodes, so inferred and tested results never add up in an estimate, a coverage percentage or a trend (REQ-0976).

### Obligations for the Director

Each run writes `node_obligations`, which holds seven kinds: open escalations, blocks owed after a probe scoring 0 out of 2, probes owed to the direct descendants of an "understands" node, nodes queued after a failed island check, cut-off nodes with their `cutBy`, stale nodes and due reviews. The list is a set keyed by node and kind, so it holds at most one row per node and kind. ADR-0070 states what the Director does with each row.

### Snapshots

The full recompute at the end of an adventure writes one snapshot of every node estimate and state for the game day of that adventure, keyed by the game day and the four versions (REQ-0906). A later adventure on the same game day overwrites that day's row, and a game day without play gets no row.

When a version changes, the full recompute writes new rows for every past play day under the new versions and keeps every row of the earlier versions for comparison (REQ-0904). It deletes only rows of the active versions before it rewrites them. When `node_snapshots` exceeds 2 million rows, the model reports `snapshot_ceiling` once in `./tower status` and deletes nothing.

### Scope of the model and its priors

The model keeps a row for every node of the graph up to the end of group 8, level 1S, and for every stretch node, whatever the player's current school group (REQ-0994). It also keeps a row for every node of the Sources track, whose rules ADR-0300 states. A node with no evidence has a row with its prior, the state "not checked" or "stretch: not checked" and full uncertainty.

### Accepting a new model version

A new model version replaces the active one only through `./tower model activate`, which runs `tools/eval-model.ts` first (REQ-0980). The tool replays the log with the candidate and with the active version and predicts each unassisted first attempt of the held-out days, the last 20 % of play days, from the events before it. It computes log-loss and expected calibration error over 10 equal-width bins, and refuses the activation unless the candidate is lower on both. Model v1 is exempt, because it has no predecessor. The gate tests a parameter file with all its prior rows, and a change of the school-group setting runs no gate. The same gate admits a form into `admittedForms` (REQ-5026) and a version that reads the depth of help (REQ-5144), and a new prior row reaches the estimates only as a new model version (REQ-0984).

## Failure paths

| Condition | What happens |
| --- | --- |
| A parameter file breaks `pGuess + pSlip < 1` or the learning-rate bound for one template | `model_params_invalid`: the validator refuses the file, the server keeps the active version, and the command exits non-zero naming the template and the bound. |
| A candidate is not lower than the active version on both held-out log-loss and calibration | `model_candidate_rejected`: `./tower model activate` refuses and prints both figures. |
| The full recompute fails | `recompute_failed`: the previous projections stay, the report shows «Отчёт обновлён <date>» (Report updated <date>) with the last good time, and the server retries at the next adventure end and at the next start. |
| The full recompute takes longer than its budget | `recompute_slow`: the recompute finishes, and the server logs the duration once per version set in `./tower status`. |
| `node_snapshots` exceeds 2 million rows | `snapshot_ceiling`, reported once in `./tower status`; no row is deleted. |
| The per-node update fails during play | `node_update_failed`: the Director keeps the node's last estimate for the rest of the adventure, and the full recompute at its end replaces it. |
| The rule engine's states change and `RULES_VERSION` didn't | The golden test fails and names the fixture. |
| Code under `src/engine/model/` or `src/engine/states/` reads a `school_snapshot_*` event | The lint check `school_events_in_model` fails the build. |
| An attempt's `forms` holds a form outside `admittedForms` | The attempt stays out of every estimate, state, probe and block, the fluency and "with help" estimates included, and feeds its stream. |
| A lesson mark falls inside a run of 5 observations | No block forms across it; the block completes only after 5 graded observations follow the mark. |
| The `node_snapshots` table is deleted | A full recompute rebuilds the active versions' rows; earlier versions' rows come back only from the database snapshots or an old checkout. |
| Any model failure during play | The player sees nothing, and play continues on the last estimates. |

## Open review findings

The reasons behind the values and rules here, such as the fatigue weight, the `pGuess` of 0.06, the 30-day stale cut, the budgets and the snapshot ceiling, stay in ADR-0060, ADR-0070, ADR-0210 and ADR-0250, because a specification states what the system does.
