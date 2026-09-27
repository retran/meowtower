---
id: ADR-0060
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-0900, REQ-0902, REQ-0904, REQ-0906, REQ-0908, REQ-0910, REQ-0912, REQ-0914, REQ-0916, REQ-0918, REQ-0920, REQ-0922, REQ-0924, REQ-0926, REQ-0928, REQ-0930, REQ-0932, REQ-0934, REQ-0936, REQ-0938, REQ-0940, REQ-0942, REQ-0944, REQ-0946, REQ-0950, REQ-0952, REQ-0954, REQ-0960, REQ-0962, REQ-0964, REQ-0968, REQ-0976, REQ-0980, REQ-0982, REQ-0984, REQ-0986, REQ-0988, REQ-0990, REQ-0992, REQ-0994, REQ-3712]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0060. The knowledge model is BKT with forgetting plus two beta estimates, with report states from explicit rules, versioned and recomputed from the event log

## Decision

The knowledge model is a pure TypeScript function in `src/engine/model/` and `src/engine/states/`. It takes the event log (ADR-0020), the skill graph (ADR-0050), the model parameters in `content/model.vN.json`, the threshold version and the rules version, and returns the projections `node_estimates` and `node_snapshots` and a list of obligations for the Director. It does no input or output of its own, so the same log and the same versions always give byte-identical projections. The model has three parts: a Bayesian knowledge tracing (BKT) estimate "on her own" per node and subtype, two beta estimates for fluency and "with help", and a rule engine that gives each node the state the parent sees. The parent reads the states; the Director (ADR-0070) reads the estimates. The owner is the person who runs the server and the repository; the parent is the reader of the report. They may be one person, but the failure states below name one role each.

### When it runs

The server runs the model at three moments:

1. After each graded first attempt, it recomputes the estimates and states of the attempted node and its graph neighbours from that node's events, so the Director sees an open probe, an escalation or a cut-off within the same session.
2. When an adventure ends, it runs a full recompute over the whole log with the active versions (REQ-0900). The full recompute replaces every per-node result, so a per-node shortcut can never leave a lasting difference.
3. At server start, it compares the model, threshold, rules and graph versions recorded in `node_estimates` with the active ones, and runs a full recompute over the whole history when any differs (REQ-0902).

The model evaluates forgetting and decay at a fixed "now": the server time of the event that triggered the run. A recompute of the same log at a later hour therefore gives the same projection, which the rebuild check in ADR-0020 needs.

### Versions

Four versions govern a result, and every row of `node_estimates` and `node_snapshots` records all four with the last event sequence number it counted:

| Version | Where it lives | What changes it |
| --- | --- | --- |
| model | `content/model.vN.json` plus the prior row in use | `./tower model activate`, which writes a `model_activated` event |
| rules | the constant `RULES_VERSION` in `src/engine/states/version.ts` | a code change to the state or inference rules |
| thresholds | the `thresholds` projection (ADR-0180) | a person's threshold change or a monthly motor recalibration |
| graph | `content/graph.yaml` (ADR-0050) | a graph edit |

The model file holds the prior rows for groups 7 and 8 (RES-0900). Which row applies is the player's current school group, which the parent sets in the Parent Room (ADR-0180) and the log records as a `settings_changed` event in the untracked database, so no tracked file names it (REQ-3712). The model version is the file version plus that row, so a change of the school-group setting is a new model version and a full recompute (REQ-0982, REQ-0984). A switch by date alone is impossible, because the code reads the row only from the latest school-group setting in the log.

A program checks the rules version, because a paragraph would be forgotten: a golden test runs fixed fixture logs through the rule engine and compares the states with stored results. When the states change and `RULES_VERSION` didn't, the test fails and names the fixture. A new rules version triggers the full recompute at the next server start.

### What counts as an observation

The "on her own" estimate takes an attempt as an observation only when the attempt is a graded, unassisted first attempt (REQ-0914). The model drops an attempt from every estimate, state, probe and block when any of these holds:

- it is a rapid guess, marked by ADR-0070;
- the parent excluded its task as ambiguous with an `item_excluded` event, and no later event re-included it (REQ-0916);
- it is ungraded: a warm-up, an easy task, a Session 0 task.

ADR-0030 flags three cases. An attempt with `interrupted: true` or `crossDevice: true` counts for accuracy, but its time counts in no measure: it can't make an attempt `fast` for fluency, and ADR-0070 doesn't test it for a rapid guess. An `attempt_late` event is never an observation.

Each observation carries a score `c` and a weight `w`. The score is 1 for right, 0,5 for partially right and 0 for wrong or «Не знаю» (I don't know) (REQ-0918). The weight is 1, or 0,5 when ADR-0070 marks the attempt as after a fatigue signal. Control facts are observations of their node (REQ-0930). Review tasks are ordinary observations. Second attempts and attempts after a hint go only to the "with help" estimate (REQ-0922).

### The "on her own" estimate

Each pair of node and subtype keeps its own BKT estimate `pKnow` (REQ-0908), with the v1 values RES-0900 recorded:

| Parameter | v1 value | Source |
| --- | --- | --- |
| `pInit` by the subtype's level | group 7 row: 1F 0.55, 1S 0.25, stretch 0.05; group 8 row: 1F 0.70, 1S 0.40, stretch 0.10 | RES-0900 |
| `pLearnPractice` | 0.05 | RES-0900 |
| `pLearnFeedback` | 0.15 | RES-0900 |
| `pGuess` | free input 0.03; choice among k options 1/k | RES-0900 gives 0.02 to 0.05; I chose the middle |
| `pSlip` | `max(0.10, 1 - 0.95^steps)` | RES-0900 |
| forgetting half-life `H` | starts at 60 days; times 1.5 after a right answer at least 3 days after the pair's previous observation, capped at 365 days; back to 60 days after a wrong answer | RES-0900 |

A subtype takes the prior of its own level from the graph, so a 1F/1S node starts its 1F subtypes higher than its 1S subtypes. For each observation at time `t`, the model applies four steps in this order:

1. Forgetting: `p = p * 2^(-days since the pair's last observation / H)`. I chose decay towards zero, the plain reading of a half-life, because it makes the estimate fall for any starting value while no evidence arrives (REQ-0912). A decay towards the prior would raise an estimate that sits below it.
2. Feedback: when a walkthrough, explanation or hint on the node was shown since the pair's last observation, `p = p + (1 - p) * pLearnFeedback` (REQ-0920). The log marks such tasks as `postFeedback` (REQ-0428).
3. Evidence: `p_right = p(1 - s) / (p(1 - s) + (1 - p)g)` and `p_wrong = p s / (p s + (1 - p)(1 - g))`; then `p_obs = c * p_right + (1 - c) * p_wrong` and `p = p + w * (p_obs - p)`. A partial answer therefore moves the estimate half way between a right and a wrong one.
4. Practice: `p = p + (1 - p) * pLearnPractice`.

A right answer can never lower `p`, because step 3 gives `p_right >= p` whenever `g + s <= 1`, and steps 2 and 4 only raise it (REQ-0986). The model enforces the bounds by a program. It loads a parameter file only after a validator confirms `pGuess + pSlip < 1` and `pLearn < 1 - pSlip / (1 - pGuess)`. The validator checks both bounds for every answer form and number of steps in the catalogue, with both learning rates. A property test in Vitest with fast-check feeds random parameter sets that pass the validator and every catalogue template, and fails if a right answer lowers `p`.

A node's estimate is the mean of its subtypes' estimates weighted by the subtype weights in the graph (REQ-0910). A subtype with no observation contributes its prior. The Director reads each estimate forgotten to the current time.

### Fluency and "with help"

Two beta estimates sit beside BKT, and neither ever feeds `pKnow`:

- Fluency starts at `αf = βf = 1`. Each observation adds `w * c * fast * 2^(-age / 30 days)` to `αf` and the rest of its weight, `w * (1 - c * fast) * 2^(-age / 30 days)`, to `βf` (REQ-0926, REQ-0928). Here `fast` is 1 when the attempt took no longer than the template's fluency threshold for the device type. The threshold comes from the active threshold version.
- "With help" does the same over assisted attempts only, counting a right assisted attempt as a success, also with a 30-day half-life (REQ-0922, REQ-0924). It gives the report metric «решает с подсказкой» (solves with a hint).

### Uncertainty, age and the next review

Each estimate carries these derived fields, with the formulas RES-0900 resolved:

- `uncertainty = H(pKnow) * 3 / (3 + nEff)`, where `H` is the binary entropy in bits and `nEff` is the sum of the node's observation weights, each times `2^(-age / H)` with the node's current forgetting half-life (REQ-0988). Three fresh observations halve the uncertainty, and a node with none keeps its full entropy.
- `lastSeen` is the date of the last unassisted first attempt, and `stale` is true when that date is more than 30 days old.
- `nextReview` is `lastSeen` plus 1, 3, 7, 14 or 30 days after the 1st to 5th unassisted success in a row, then 30 days after each further success (REQ-0990), and `lastSeen` plus 1 day after an unassisted failure (REQ-0992). A success here is an observation with `c = 1`; a partial answer ends the run and counts as a failure, because the ladder asks whether she still solves the node cleanly. I chose that reading.
- `confidence` is high for a block within 14 days, medium for a probe or a check 15 to 30 days old, and low for an inferred state or evidence older than 30 days (RES-0900).

### States from explicit rules

The rule engine gives each node a state by the rules in RES-0900, applied to the node's observations only, never to `pKnow` (REQ-0934). Every state row stores the identifier of the rule that produced it and the item identifiers it used, so the parent can open a node and check the state against its rule. Each rule has an identifier the report shows:

| Rule | Condition | State |
| --- | --- | --- |
| `block-low` | a full block scores 2,5 or less | not mastered (REQ-0936) |
| `block-mid` | a full block scores 3 or 3,5 | understands (REQ-0938) |
| `block-slow` | a full block scores 4 or more, median time of its right answers above the threshold | understands, needs speed (REQ-0940) |
| `block-fast` | a full block scores 4 or more, median time of its right answers at or below the threshold | fluent (REQ-0942) |
| `probe-fast` | both tasks of a probe right, each no slower than the threshold; for a choice-only probe, all 3 right | fluent (probe) (REQ-0942) |
| `stable` | "fluent" in two checks at least 14 days apart, at least one a full block, no later check worse than "fluent"; a probe is never a check | stable (REQ-0944) |
| `open` | tasks exist but no block or probe is complete, or a probe escalated | being clarified |
| `none` | no unassisted first attempt | not checked |

The block and probe definitions are these:

- A full block is the node's last 5 graded observations within 7 days, covering every subtype of weight 0,2 or more (REQ-0950). It never spans a `parent_tag_added` event (a lesson mark, ADR-0180) for the node: observations before the mark don't enter a block after it (REQ-0952). Control facts never enter a block or a probe (REQ-0932).
- A probe is 2 observations of different subtypes with `purpose: probe`, or, for a node the graph tests only by choice tasks, 3 choice observations with at least 4 options each (REQ-0954).
- A block that holds observations after a fatigue signal never gives "not mastered" when the score without them would be higher; the node stays "being clarified" (REQ-1110, settled with ADR-0070).

The state carries a label key and a chip fill by the mapping RES-0900 resolved: "not mastered" has the key `state.not_mastered`, whose Russian string is «Пока не освоено» (Not mastered yet) (REQ-0946). The strings live in the per-language content file ADR-0160 sets up.

### Inference

The engine applies the six inference rules of RES-0900 after the tested states:

1. A node tested "fluent" gives each ancestor not tested for 30 days the inferred state "fluent (inferred)"; for a subtype with its own prerequisite, only that prerequisite gets it (REQ-0962). A choice-only probe gives no inference (REQ-0960).
2. A full block that gives "not mastered" gives each descendant "not tested, cut off by node X", storing X in `cutBy` (REQ-0964). The row sets `isGap = false`, and the report counts gaps only from rows where `isGap` is true (REQ-0968).
3. A node in "understands" puts one probe for each direct descendant on the obligation list.
4. A failed island check puts the node and its prerequisites on the obligation list.
5. The row keeps an inferred state in its own field `inferredState` beside `testedState`, and an inferred state never enters `pKnow`, the beta estimates, `nEff` or any count of tested nodes (REQ-0976). A consumer that wants a sum has to read two fields, so a mixed sum can't happen by accident.
6. A parent's exclusion drops the task from everything at the next recompute (REQ-0916).

### Obligations for the Director

Each run also writes the projection `node_obligations`: open escalations, blocks owed after a probe scoring 0 out of 2, probes owed to direct descendants of an "understands" node, nodes queued after a failed island check, cut-off nodes with their `cutBy`, stale nodes and due reviews. ADR-0070 decides what the Director does with each row. The list is a set keyed by node and kind, so it can never hold more rows than the graph has nodes times six kinds.

### Snapshots

The full recompute at the end of an adventure writes one snapshot of every node estimate and state for the game day of that adventure, keyed by the game day and the four versions (REQ-0906). A later adventure on the same game day overwrites that day's row. A game day without play gets no row. The game day is ADR-0090's.

When a version changes, the full recompute writes new rows for every past play day under the new versions and leaves every row of the earlier versions in place (REQ-0904). The recompute deletes only rows of the active versions before it rewrites them.

### Scope and priors

The model keeps a row for every node of the graph up to the end of group 8, level 1S, and for every stretch node, whatever the player's current school group (REQ-0994). A node with no evidence has a row with its prior, the state "not checked" or "stretch: not checked" and full uncertainty.

### Accepting a new model version

A new model version replaces the active one only through `./tower model activate`, which runs `tools/eval-model.ts` first (REQ-0980). The tool replays the log with the candidate and with the active version, and predicts each unassisted first attempt of the held-out days from the events before it. The held-out days are the last 20 % of play days, a share I chose. It computes log-loss and expected calibration error over 10 equal-width bins, and refuses the activation unless the candidate is lower on both. Model v1 is exempt, because it has no predecessor to beat. The refit itself, `tools/fit-model.ts`, is deferred until after the MVP by the draft (RES-0900).

### What works once this is accepted, and what doesn't yet

Once accepted, the server turns any event log into per-node estimates, states with their evidence, inferred states, cut-offs, snapshots and an obligation list, and rebuilds all of them after a version change. A test harness can feed it a hand-written log and read the report states.

It works without the later decisions: without ADR-0070 every weight is 1 and no attempt is a rapid guess, and without ADR-0180 no task is excluded, no lesson mark exists and the thresholds are the catalogue values of RES-1200. Until the later decisions land, the estimates choose no tasks (ADR-0070), the report draws no states (ADR-0180) and the parameters stay at their v1 values until the refit after the MVP.

## Why

The approved research settles almost every choice here, so this decision records how the pieces fit together and where each runs. RES-0900 chose BKT with forgetting for the Director and explicit rules for the parent, because the parent must be able to check each state against its rule, and a probability can't be checked. RES-2200 and RES-2550 make the log the only truth and every estimate a projection, so the model has to be a pure function of the log that a full recompute reproduces.

The priors come from the Dutch ministry's figures for 2024-2025 (93 % of group-8 pupils reach 1F, 43 % reach 1S), set lower and nearer 0.5 so the first answers move the estimate most (RES-0900). The learning rates are half and one and a half times the tutorial value of 0.1, because this game teaches less than a tutor. A feedback rate of 0.3 would let one walkthrough and one lucky answer lift a node to "fluent" (RES-0900). The bounds `pGuess + pSlip < 1` and `pLearn < 1 - pSlip / (1 - pGuess)` come from van de Sande (2013) through RES-0900. A validator enforces them, because a paragraph can't stop a bad parameter file from loading.

I split the run into a per-node update during play and a full recompute after it, because the Director needs a probe's result within the same session (REQ-0958, settled by ADR-0070). REQ-0900 asks for all events under the current versions only after each adventure. The full recompute is the only one whose result lasts, so a bug in the shortcut can't survive past the end of the adventure.

The prior row comes from the parent's school-group setting in the log, because the owner decided on 2026-09-27 that the Parent Room holds it (REQ-3710, REQ-3712), CLAUDE.md keeps it out of every tracked file, and REQ-0984 needs the row bound to a model version.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: the report shows raw accuracy per node from the log | No parameters to defend; every number is a count the parent can redo by hand | No forgetting, no uncertainty and no inference, so the Director has nothing to rank by and REQ-0908 to REQ-0994 go unmet; a node answered right once a year ago reads as mastered |
| Elo rating per node and item, as the Dutch Rekentuin (Math Garden) uses | Handles item difficulty and continuous ability, and updates in one line | Item ratings need many learners to converge; one child can't calibrate them, and the draft and RES-0900 chose BKT, whose parameters stay readable |
| Deep knowledge tracing with a recurrent network | Best published prediction on large data sets | Needs thousands of learners to train, can't show the parent why, and would need a Python or ML runtime beside the TypeScript server (ADR-0010) |
| BKT mastery thresholds as the report states, such as `pKnow > 0.95` is "fluent" | One model in place of two, so the states never disagree with the estimate | The parent can't check a probability; REQ-0934 forbids it, and hand-set parameters would make every state a guess until the refit |
| Incremental update only, never a full recompute | Less work per adventure | A version change, an exclusion or a fixed bug would leave old results in place; REQ-0900 and REQ-0902 ask for the full history under current versions |

## What it costs

The owner pays for the model's upkeep. The refit after 4 to 6 weeks, the acceptance run and any activation are the owner's work, from the command line. If the owner attends to nothing for a month, or for two weeks as D22 asks, v1 keeps running unchanged and nothing queues up: the model has no approval step, no queue and no alert that needs an answer.

The parent reads more. Each state shows its rule and its tasks, so the report is longer than a list of colours, and ADR-0180 has to keep that evidence one tap away. The parent's exclusions are optional and never required.

The server spends time on every adventure end. I chose these budgets; no outside limit imposes them. They hold on the family Mac of ADR-0010:

- The per-node update takes at most 50 ms at the 95th percentile, because it runs while the player waits for the next task.
- The full recompute over one year of play takes at most 10 s. At about 50 first attempts a day, a year is about 18,000 attempts and fewer than 200,000 events, so a linear replay has room to spare. The player never waits for it: the report shows the time of its last recompute.

Both numbers, and the snapshot ceiling below, stand in the Baselines table of ADR-0190, the repository's one list of budgets (D18). The 10 s recompute is stricter than the 60 s ADR-0020 sets for every projection, because the knowledge projections are a part of that rebuild.

Snapshots accumulate, because the rows of earlier versions are kept on purpose. A day holds about 250 rows (79 nodes plus their subtypes). A year of daily play under one version set is about 90,000 rows, and ten version changes would make about a million. The model reports once, to the owner in `./tower status`, when `node_snapshots` exceeds 2 million rows, a ceiling I chose. The model drains nothing automatically, because deleting earlier-version rows destroys the comparison REQ-0904 keeps them for.

Earlier-version snapshots are the one derived data the log can't rebuild alone. Rebuilding them needs the earlier code and parameter files. The model files are never deleted, and version control keeps the code. A deleted `node_snapshots` table therefore rebuilds the active version at once and an earlier version only from an old checkout. The database snapshots of ADR-0010 hold `node_snapshots` with every other table, which covers the loss.

## What would reverse it

- After the refit, a per-node beta estimate of recent accuracy predicts the next unassisted first attempt on held-out days as well as BKT by log-loss. BKT then adds parameters without adding accuracy, and the beta estimate should replace it.
- The 30-day simulation (REQ-1056, run by ADR-0070) classifies fewer than 90 % of nodes correctly, and the misclassified nodes trace to the state rules after two rounds of rule changes, with the Director's choices ruled out.
- The full recompute over one year of the real log takes more than 60 s on the family Mac. Recomputing from a checkpoint would then replace the full replay for the unchanged-version case.
- The parent finds a state the rule evidence doesn't explain more than once in the first month. The evidence display or the rules would then be wrong.

## Consequences

- ADR-0020 has to provide the events this model reads: `model_activated`, `item_excluded` and its reversal, `parent_tag_added`, and the `postFeedback` flag on shown tasks.
- ADR-0050's graph has to give every subtype a level and a weight, and every node a typical group and its prerequisites per subtype, because the priors, the aggregate and inference read them.
- ADR-0070 has to write the rapid-guess mark and the fatigue weight on each attempt, and read `node_obligations`.
- ADR-0180 draws the states from `testedState`, `inferredState`, `cutBy`, `isGap` and the label key, and computes coverage and trends from tested rows only.
- ADR-0190's verify command runs the golden rule test, the property test and the rebuild check.
- `content/model.v1.json`, `src/engine/model/`, `src/engine/states/`, `tools/eval-model.ts` and the `./tower model activate` command are new work.

The failure states the model can reach, each with its next step and its one audience:

| Failure state | What happens next | Audience |
| --- | --- | --- |
| `model_params_invalid` | The validator refuses the file; the server keeps the active version; the command exits non-zero naming the template and the bound it breaks | the owner |
| `model_candidate_rejected` | `./tower model activate` refuses and prints both log-loss and calibration figures | the owner |
| `recompute_failed` | The previous projections stay; the report shows «Отчёт обновлён <date>» (Report updated <date>) with the last good time; the server retries at the next adventure end and start | the parent |
| `recompute_slow` | The recompute finishes; the server logs the duration once per version set in `./tower status` | the owner |
| `snapshot_ceiling` | Reported once in `./tower status` | the owner |
| `node_update_failed` | The Director keeps the node's last estimate for the rest of the adventure, and the full recompute at the end replaces it | the owner, in the server log |

The player never sees a model failure, because play continues on the last estimates.

The security boundary protects the diagnostic data, which is a child's learning record. In order of likelihood:

1. A parent's mistaken exclusion or a threshold edit distorts the report. Both are events that can be reversed, and every earlier version keeps its snapshots.
2. The data leaves the Mac. The model makes no network call, and ADR-0100 keeps every estimate, state and history out of model requests (RES-2600).
3. The player's device alters the record. The device only submits answers through ADR-0030; the server computes every estimate, and no endpoint accepts one.

## How I will know it was realised

1. Deleting `node_estimates` and the active-version rows of `node_snapshots` and running a full recompute gives tables whose hash equals the hash before deletion.
2. The property test finds no parameter set that passes the validator and no catalogue template for which a right answer lowers `pKnow`, over at least 10,000 generated cases.
3. A parameter file with `pGuess + pSlip >= 1` for one template fails to load, and the error names the template.
4. Fixture logs give "not mastered" at block scores 2 and 2,5 and "understands" at 3 and 3,5. At 4 they give "understands, needs speed" with slow right answers and "fluent" with fast ones, and "stable" comes only after two fluent checks 14 days apart with one of them a block.
5. A block with a lesson mark for its node between its third and fourth tasks isn't complete until five tasks follow the mark.
6. With no new evidence, a pair's `pKnow` after 60 days is half its value at the last observation when `H` is 60 days.
7. An assisted attempt changes the "with help" estimate and leaves `pKnow` and the fluency estimate of its node unchanged.
8. Three fresh observations halve `uncertainty` against the prior's entropy; a node with none keeps its full entropy.
9. After five unassisted successes in a row the next review is 30 days after the last one; after a failure it is 1 day after it.
10. Changing `RULES_VERSION` makes the next server start run a full recompute, and the count of earlier-version rows in `node_snapshots` is the same before and after it.
11. Changing the school-group setting in the Parent Room writes a new model version and a full recompute; no date or clock change alters the priors, and no tracked file holds the group.
12. The full recompute over a synthetic log of 365 play days finishes within 10 s on the family Mac, and the per-node update within 50 ms at the 95th percentile.
13. `./tower model activate` refuses a candidate that is worse on held-out log-loss or calibration, and accepts one that is better on both.

## What this does not settle

- How the Director uses the estimates and obligations: escalation to a block (REQ-0956), finishing the block after a probe of 0 out of 2 (REQ-0958), keeping cut-off nodes out of selection (REQ-0966), probing the descendants of an "understands" node (REQ-0970), daily island checks (REQ-0972), queueing after a failed island check (REQ-0974) and priority for stale nodes (REQ-0978). ADR-0070 settles all seven.
- What marks an attempt as a rapid guess or as after a fatigue signal, and when the signal fires: ADR-0070.
- How the report draws states, coverage, trends and the evidence behind a state, and how the parent marks lessons and excludes tasks: ADR-0180.
- The fluency thresholds, their versions per device type and the motor correction: ADR-0180, which owns the limits.
- The event schema and the table storage: ADR-0020. The graph's content: ADR-0050. The game day: ADR-0090.
- The refit of the parameters, which the draft defers until after the MVP, and the Ascent, whose anchor forms would count as checks for "stable" once they exist.
- The simulation's classification accuracy on synthetic profiles (REQ-2908, REQ-2910, REQ-2922): ADR-0190.

The strongest objection is that one child gives too little data for BKT. With 9 to 14 frontier tasks a day (RES-1000) spread over 69 mandatory nodes and their subtypes, a pair of node and subtype sees an observation every few weeks. Its `pKnow` then stays close to a prior nobody fitted, and a refit on one learner's 4 to 6 weeks might not identify four parameters per group of nodes. I keep the decision because BKT only steers the Director: the parent's states come from rules over counted attempts, so a poor BKT costs measurement efficiency and never a false state in the report. The first reversal condition catches the case where BKT adds nothing.

A premortem, written as though the model had failed. The parent saw many nodes stuck at "being clarified" for weeks, because a block of 5 tasks within 7 days, covering every subtype of weight 0,2 or more, rarely completed. The Director had spread 9 to 14 frontier tasks across three domains a day. Forgetting towards zero made a node she had not seen for four months look lower than a node she had never seen, and the Director spent probes re-checking old nodes she knew. The per-node update during play diverged from the full recompute on inference across domains, so a descendant cut off mid-adventure reappeared after the end-of-adventure recompute, and the owner found it only through a puzzled parent. Earlier-version snapshots disappeared when the owner deleted `node_snapshots` to fix a bug, because the old code was never checked out to rebuild them. Each of these has a check above except the first, which only the 30-day simulation of ADR-0070 can show; if it appears there, the block window or the subtype coverage rule is the place to look.
