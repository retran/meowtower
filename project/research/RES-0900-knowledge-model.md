---
id: RES-0900
artifact: research
status: approved
revised: 2026-09-27
---

# The draft proposes a knowledge model that tracks each node with BKT and derives report states from explicit rules

## Summary

The owner's draft proposes a knowledge model that is a derived view of the event log, recomputed after every adventure. Its unit is a node and subtype pair, and the node aggregates its subtypes by weight. The "on her own" estimate uses Bayesian knowledge tracing (BKT) with forgetting, fed only by unassisted first attempts. Separate beta estimates track fluency and assisted attempts, and the assisted estimate never enters the "on her own" estimate. States for the parent's report come from explicit rules over probes and full blocks, so the parent can check them. Inference rules spread a result to ancestors or cut off descendants, and island checks catch gaps the graph order hides. This record carries the model v1 parameters, the node estimate, the node states, the probe and block rules, the inference rules and the recompute. Task selection, the daily budget, the Ascent, fatigue and measurement protection belong to other records, and the skill graph is in RES-0800.

## The question

How does the game turn a stream of answers into a map of what the player knows, one the parent can trust and check? The draft assumes that a hidden two-state model, "knows" or "doesn't know", fits each node and subtype. A child's knowledge is partial and depends on the form of a task, which is why the draft keeps a separate fluency estimate, counts partial answers as 0,5, and lets explicit rules, not the model, decide what the parent sees. The draft also assumes hand-set parameters are good enough until 4 to 6 weeks of play allow a refit.

## Method

I read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles, specification), the opening context and the sections «Модель знаний v1» (knowledge model v1), «Модель оценки и алгоритм» (estimation model and algorithm), «Оценка узла» (node estimate), «Состояния узла» (node states), «Зонд, блок, эскалация» (probe, block, escalation), «Правила вывода» (inference rules) and «Пересчёт» (recompute), on 2026-09-26.

The draft leaves these open:

- the numeric values of `pInit` by level and group (proposed below; the owner decided the player's current school group on 2026-09-27, and the value is kept in `personal/player.md`), `pLearnFeedback` and `pLearnPractice` (proposed below, see the resolved finding on BKT values);
- how the node aggregates its subtypes, beyond "with weights";
- the formula behind `uncertainty` ("entropy of `pKnow` corrected for the number of observations") (proposed below);
- how `nextReview` is computed (proposed below);
- the fluency threshold `fluencyMs` for each template, which the draft refers to but doesn't list here (proposed below: the catalogue in RES-1200 sets it by node);
- what the Director does with the "on her own" estimate when it picks tasks, which other records carry.

## Findings

### The knowledge model is a derived view of the event log

The model is a derived view of the event log. Every snapshot stores the model version, and the v1 parameters live in `content/model.v1.json`. The estimate is stored in `node_estimates` as a cache with the model version, and it can be rebuilt from the log at any time. The unit is the pair of node and subtype, and the node aggregates its subtypes with the weights of the templates.

The diagnosis is continuous. Every node and subtype has an estimate of mastery with its uncertainty and its age. Each adventure spends tasks where they carry the most information. The report states are recomputed from the event log after every adventure.

### The "on her own" estimate uses BKT with forgetting

The "on her own" estimate is Bayesian knowledge tracing (BKT): a hidden state "knows" or "doesn't know" with these parameters:

| Parameter | Meaning | v1 value |
| --- | --- | --- |
| `pInit` | prior probability of knowing | group 7: 1F 0.55, 1S 0.25, stretch 0.05; group 8: 1F 0.70, 1S 0.40, stretch 0.10 (the draft said only "1F higher, 1S lower, stretch lower still, and by school group") |
| `pLearnFeedback` | chance of moving from "doesn't know" to "knows" after a walkthrough, explanation or hint | 0.15 (the draft said only "higher of the two") |
| `pLearnPractice` | the same chance after an attempt without them | 0.05 (the draft said only "lower of the two") |
| `pGuess` | chance of a right answer by guessing, by answer form | free input about 0,02 to 0,05; choice among k options about 1/k |
| `pSlip` | chance of a wrong answer while knowing | `max(0.10, 1 - 0.95^steps)`: 0.10 up to 2 steps, 0.14 at 3, 0.19 at 4 (the draft said "about 0,1, higher in multi-step templates") |
| forgetting | fall of the probability of knowing between opportunities, with half-life `H` | `H` starts at 60 days; after a successful review at least 3 days after the last, `H` grows 1,5 times, capped at 365 days; after a failure it returns to 60 days |

### Only unassisted first attempts feed the "on her own" estimate

Observations are unassisted first attempts only. Rapid guesses and tasks the parent excluded don't count. A partially correct answer counts with weight 0,5 as correct and 0,5 as wrong. Answers after a fatigue signal count with weight 0,5. Tasks without a grade don't count.

A rapid guess (`rapidGuess`) is an answer given sooner than the template's `minMs` after the task appears. It enters neither the estimate, nor the full block, nor the probe, and the Director later adds a task of the same node in its place. A right quick answer in a small space (table facts, addition to 20, control facts) is automatic recall, not a guess, so `minMs` is lower there. RES-1100 carries the `minMs` rule, which research on 2026-09-26 revised to `max(1500 ms, min(0.15 * fluencyMs, 10 000 ms))` plus the motor correction.

Control facts (`purpose: control`) update the estimate of their node (A3) but enter neither the full block nor the probe. The A3 block comes only from rooms and mental arithmetic. Control facts serve mainly stamina, base speed and the heat map of the multiplication table.

### A walkthrough in a session is an opportunity to learn

A walkthrough, explanation or hint shown in a session is an opportunity to learn. Before the next observation of the same node, the model applies `pLearnFeedback`. So right answers after a walkthrough raise the estimate more cautiously than the same answers before it.

### Assisted attempts feed a separate estimate that never enters "on her own"

The "with help" estimate is a separate beta estimate over assisted attempts: second attempts after a walkthrough and attempts after a hint. It forgets with a fixed half-life of 30 days, as fluency does; the draft said only "in the same way". It gives the report metric «решает с подсказкой» (solves with a hint). It never enters the "on her own" estimate.

### Fluency is a separate beta estimate with a 30-day half-life

Fluency is a separate beta estimate, with parameters `αf` and `βf`, of the event "right, unassisted and no slower than the fluency threshold". It starts at `αf = βf = 1` and forgets with a half-life of 30 days.

### Resolved: the "with help" estimate forgets with a fixed 30-day half-life, as fluency does

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft gave two readings. The model v1 section says the "with help" estimate uses «то же забывание» (the same forgetting) and places it after the BKT forgetting, whose half-life `H` starts at 60 days and adapts. The node estimate section lists it right after fluency, whose half-life is a fixed 30 days, again with «тем же забыванием».

The options were the adaptive `H` of BKT or the fixed 30 days of fluency. The adaptive `H` would let a skill she has long solved with help fade more slowly. It fits assisted attempts badly, though. `H` grows only after a successful review at least 3 days after the last one, and returns to 60 days after a failure. An assisted attempt almost always follows a failed first attempt on the same node in the same session, so `H` would sit at 60 days and never adapt. The fixed 30 days wins for three reasons:

- it treats the two beta estimates, fluency and "with help", with one decay rule;
- it keeps «решает с подсказкой» (solves with a hint) about the last month of play, the same window as the "not tested for a long time" mark;
- it needs no review history for assisted attempts.

### Resolved: the graph holds each subtype's weight, and the node aggregates its subtypes with the graph's weights

Proposed by research on 2026-09-26; the owner approves it with this record.

The model v1 and node estimate sections say the node aggregates subtypes «с весами шаблонов» and «с весами из шаблонов» (with the weights of the templates). The skill graph section (RES-0800) puts `subtypes` with weights in `graph.yaml`. The options were the graph or the templates. The graph wins, because it is versioned data that changes without code, while a template is TypeScript, and one home means the two copies can't disagree. RES-0800 gives the full reason. A template reads its subtype's weight and level from the graph, and "the weights of the templates" in the draft now means the graph's subtype weights.

### The node estimate has a fixed shape

The draft gives this TypeScript shape:

```typescript
interface NodeEstimate {
  node: NodeId;
  subtype?: string;              // undefined: the aggregate over the node
  pKnow: number;                 // BKT: probability of "knows", 0..1 ("on her own")
  fluentMean: number;            // estimate of the share "right, unassisted and fast"
  assistedMean?: number;         // "with help"; undefined when no assisted attempts
  uncertainty: number;           // entropy of pKnow corrected for the number of observations
  lastSeen?: string;             // ISO date of the last unassisted first attempt
  nextReview?: string;           // date of the next review by interval
  evidence: {                    // number of first attempts by source
    block: number; probe: number; review: number; postFeedback: number; assisted: number;
    inferred: boolean;           // whether there is inference from neighbours
  };
  state: NodeState;              // see node states
  confidence: "high" | "medium" | "low";
  cutBy?: NodeId;                // "not tested, cut off by node X"
  modelVersion: string; thresholdVersion: string; lastEventSeq: number;
}
```

The Director needs the estimate to choose tasks. The report states come from the explicit rules below, so the parent can check them.

### Report states come from explicit rules over unassisted first attempts

The report states count unassisted first attempts only. A block might include tasks after a walkthrough, and that only makes "not mastered" harder to reach.

| State | Russian label | Criterion |
| --- | --- | --- |
| Not mastered | «Не освоен» | full block only: a score below 3 (0 to 2,5) |
| Understands | «Понимает» | full block: a score of 3 or 3,5; or a score of 4 to 5 with the median time of right answers above the threshold |
| Fluent | «Бегло» | full block: a score of 4 to 5 and the median time of right answers at or below the threshold; or probe: both tasks right and each no slower than the threshold |
| Stable | «Устойчиво» | "fluent" in two checks at least 14 days apart, at least one of them a full block, and no later check worse than "fluent" |
| Being clarified | «Уточняется» | the node has tasks, but too few for a state (an open probe, an escalation to a block) |
| Fluent (inferred) | «Бегло (выведено)» | not tested for 30 days, but a tested descendant is "fluent" |
| Not tested, cut off by node X | «Не проверялся, отрезан узлом X» | prerequisite X got "not mastered" by a block; this isn't a gap |
| Stretch: not tested | «Stretch: не проверялся» | the stretch node isn't admitted to testing yet |

The labels «Не освоен» and «Понимает» are the draft's; the resolved finding below gives the labels the parent sees.

### Resolved: the rules keep their states, and the report adds «Не проверено» and draws every state with one of the design's five chip fills

Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's design (RES-3200) has a `SkillState` chip with five states: `untested` «Не проверено» (Not checked), `emerging` «Пока не освоено» (Not mastered yet), `understands` «Понимает, нужна скорость» (Understands, needs speed), `fluent` «Бегло» and `stable` «Устойчиво», with inference drawn as hatching on any state. The table above has eight states, no plain untested state, and different labels. Two options were weighed:

- Five states, as the design draws them. The chip set stays small. But "being clarified" and "cut off by node X" would fold into "not checked", and the report needs them apart: a cut-off node is by rule not a gap (inference rule 2), the VWO ladder counts it as not covered (RES-2300), and «почти готово» (nearly ready) accepts "being clarified" but not "not checked" (RES-2300). The measurement would lose facts the parent is told to act on.
- The rule states, drawn with the design's fills. Every state the rules produce keeps its own label, and the design supplies the colour, hatching and frontier ring. The design adds one thing the table lacks: a node with no unassisted first attempt yet has no state here, and at the start most of the 79 nodes are in that case.

The rule states win, because the report's value is that the parent can check each state against its rule, and the design's own `children` prop already lets a chip carry any label. The report uses these labels:

| Rule state | Chip `state` | Label the parent sees |
| --- | --- | --- |
| no unassisted first attempt yet (new) | `untested` | «Не проверено» (Not checked) |
| being clarified | `untested` | «Уточняется» (Being clarified) |
| not tested, cut off by node X | `untested` | «Не проверялся, отрезан узлом X» (Not tested, cut off by node X) |
| stretch: not tested | `untested` | «Stretch: не проверялся» |
| not mastered | `emerging` | «Пока не освоено» (Not mastered yet) |
| understands, from a block score of 3 or 3,5 | `understands` | «Понимает» (Understands) |
| understands, from a score of 4 to 5 with slow right answers | `understands` | «Понимает, нужна скорость» (Understands, needs speed) |
| fluent | `fluent` | «Бегло» |
| fluent (inferred) | `fluent`, `inferred` | «Бегло», hatched, with the tooltip «Выведено, не проверено напрямую» (Inferred, not checked directly) |
| stable | `stable` | «Устойчиво» |

The label «Понимает, нужна скорость» is kept only for the slow case, because after a score of 3 the missing part is accuracy, not speed, and a label must say what the rule found. «Пока не освоено» replaces the draft's «Не освоен», because the design, RES-2300 and RES-3300 all use it as the non-judgemental form. RES-3200 records the proposed change to the design: `understands` defaults to «Понимает», and the game passes the other labels through `children`.

### A block scores the sum of five tasks

- Block score: the sum of `c` over five tasks, where a partially correct answer is 0,5. Below 3 is "not mastered". From 3 up to but not including 4 is "understands". 4 or more is "understands" or "fluent" by time.
- Fatigue guard: if the block holds tasks after a fatigue signal and the result without them would be higher, the block can't give "not mastered". The node stays "being clarified" and gets more tasks on another day.
- Full block: the last 5 graded tasks of the node within at most 7 days, covering every subtype with weight 0,2 or more. A block can span several sessions, but it doesn't cross a lesson mark for that node: tasks before the mark don't enter a block after it.
- Check, for "stable": a full block or, later, an anchor form of the Ascent in which both tasks are right and no slower than the threshold. A probe isn't a check. The stretch gate in RES-0800 asks for a tested result, where a probe counts, and no longer uses the word "check".
- Block and probe tasks are unassisted first attempts only. Second attempts and attempts after a hint don't enter the states, and the report shows them as "solves with a hint". Unassisted first attempts after a walkthrough on the same day (`postFeedback`) do enter the block, which only makes "not mastered" harder to reach.

### Resolved: the block score rule decides, so 2,5 is "not mastered" and 3,5 is "understands"

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft's state table said «Не освоен»: «верно 2 из 5 или меньше» (2 right out of 5 or fewer) and "understands" at "3 out of 5". Its block score says «меньше 3 — «не освоен»» (below 3 is "not mastered"), and "understands" from 3 up to but not including 4. With partial answers counted as 0,5, the table left 2,5 and 3,5 without a state.

The options were the score rule, which puts 2,5 at "not mastered" and 3,5 at "understands", or reading the table's counts as whole right answers, which would lift 2,5 to "understands". The lenient reading would cut off fewer descendants on a borderline block, since "not mastered" cuts descendants (inference rule 2). The score rule wins, because it is the one rule that covers every score from 0 to 5 in steps of 0,5, and it treats a partial answer as the half-right answer the rest of the model says it is. The lenient reading's worry is already covered: the fatigue guard, `postFeedback` tasks and the retest of X after a cut-off all make a false "not mastered" harder to reach or quicker to undo. The state table above now states scores, not counts.

### Confidence falls with the age and kind of evidence

- High: a block (and later an Ascent) within the last 14 days.
- Medium: a probe, or a check 15 to 30 days ago.
- Low: inferred, or older than 30 days.

A node older than 30 days gets the mark «давно не проверялся» (not tested for a long time) and gets priority.

### A probe escalates to a full block on any result short of fluent

- Probe: 2 tasks of different subtypes from the approved library of frames. Both right and each no slower than `fluencyMs` gives "fluent (probe)". Any other result escalates to a full block.
- 0 out of 2 in a probe is an alarm but not a diagnosis. The node gets tasks up to a block in the same session, or first thing tomorrow if time ran out.
- A probe made only of choice tasks (shapes, nets, "explain why") has 3 tasks, each with at least 4 options. It gives "fluent (probe)" only if all 3 are right and none is a rapid guess, and the model draws no inference to ancestors from it. The distractors are checked for distinctness.
- The tasks that complete a block can use live LLM frames, as the draft's LLM text pipeline describes.
- A partially correct answer, for example an unsimplified fraction where a simplified one is needed, counts as 0,5.

### Six inference rules spread or limit a result across the graph

1. Fluent to ancestors. A tested "fluent" node gives its ancestors "fluent (inferred)" if they haven't been tested for 30 days. For subtypes with their own prerequisites, inference goes only to the prerequisites of the tested subtypes.
2. Not mastered (block) to descendants. Descendants get "not tested, cut off by node X" and the Director doesn't choose them until X is tested again. The report doesn't count them as gaps.
3. Understands to direct descendants. Each direct descendant gets one probe, because the child might solve by her own method.
4. Island checks. Each day 1 to 2 probes go to random nodes in the state "fluent (inferred)" or "cut off". A failed probe means a non-monotonic gap, where she can do the higher skill but has a hole below. The node and its prerequisites join the queue.
5. Inferred results never add up with tested ones: not in estimates, not in coverage percentages, not in trends.
6. Exclusions. Tasks the parent marked as ambiguous drop out on recompute.

### The model recomputes everything from the event log after each adventure

- After every adventure, all estimates and states are recomputed from the event log (`events`) with the current versions of the model, the thresholds and the rules. `node_estimates`, `node_snapshots`, `limits` and the report cache are derived tables.
- Each day a `node_snapshots` snapshot is saved for trend charts. Each snapshot holds `modelVersion`, the threshold version and the number of the last event it counts.
- When the model, thresholds or rules change, the whole history is recomputed. Snapshots of the earlier version stay for comparison. The derived tables can be deleted, because they rebuild from the log.

### The draft chooses hand-set parameters now and an offline refit later

Model v1 uses hand-set values. After 4 to 6 weeks of play, the parameters are refit offline on the collected log by `tools/fit-model.ts`, using EM or grid search, with parameters shared by groups of nodes and hierarchical smoothing. A new version is accepted only if it better predicts the next unassisted first attempt on held-out days, measured by log-loss and calibration. An accepted version gets a new number, and the whole history is recomputed. Deferred until after the MVP by the draft.

### Ascent checks on anchor forms come later

The draft defers control Ascents on anchor forms. Where the rules name the Ascent, as a check for "stable" and a source of high confidence, it applies once the Ascent exists. Deferred until after the MVP by the draft.

### Resolved: BKT v1 starts from pInit by level and school group, pLearnPractice 0.05, pLearnFeedback 0.15 and a slip that grows with the number of steps

Proposed by research on 2026-09-26; the owner approves it with this record.

No published fit transfers to this game, because BKT parameters are fitted per skill and per tutor, and the draft already plans a refit after 4 to 6 weeks. So the v1 values need only three properties: they stay inside the ranges where the algorithm behaves sensibly, they put the prior near what Dutch pupils of her age know, and they don't let a walkthrough make the estimate jump.

The prior. The Dutch ministry's figures for 2024-2025 say 93 % of group-8 pupils reach at least 1F in arithmetic and 43 % reach 1S. Those figures are for a whole level at the end of the year, not for each node, so I set the priors below them and nearer 0.5, where the first answers move the estimate most:

| School group | 1F | 1S | stretch |
| --- | --- | --- | --- |
| group 7 | 0.55 | 0.25 | 0.05 |
| group 8 | 0.70 | 0.40 | 0.10 |

I compared this with one flat prior of 0.5 for every node. A flat prior is simpler and has no source to defend, but it makes the Director spend its cold-start probes on 1F nodes she almost surely knows. Pardos and Heffernan (2010) found that a prior per student predicted the next answer better than one shared prior, which supports a prior that reflects who she is. The player's school group was a fact only the owner knew, and the draft of this finding assumed a group until the owner stated it. The owner decided her current school group on 2026-09-27 (the value is kept in `personal/player.md`), so the values for that group now apply as decided; the finding below on her school group holds the rule.

The learning rates. Tutorial examples of BKT use a learning rate near 0.1 for tutored practice with a hint on every step. This game teaches less than a tutor: the parent explains new topics outside the game, and a plain attempt shows only the correct answer. So `pLearnPractice` is 0.05, half the tutored value, and `pLearnFeedback` is 0.15 for an attempt that shows a walkthrough, explanation or hint. A higher feedback rate, such as 0.3, would let one walkthrough and one lucky right answer lift a node to "fluent" territory, which is the inflation the single mode exists to avoid.

The slip. Corbett and Anderson (1995) kept slip below 0.1 for one tutored step. A multi-step task gives more chances to slip, so `pSlip = max(0.10, 1 - 0.95^steps)`: a 5 % slip per step, and never below the draft's 0.1. The guess rates stay as the draft gives them; a choice of four gives 0.25, under the 0.3 bound.

The check. Van de Sande (2013) shows the algorithm stays sensible only while `pGuess + pSlip < 1` and `pLearn < 1 - pSlip / (1 - pGuess)`. The worst case here, a choice of four with 4 steps, gives 0.25 + 0.19 = 0.44 and a bound on `pLearn` of 0.75, well above 0.15. Baker, Corbett and Aleven (2008) call a model that breaks this "empirically degenerate", where a right answer lowers the estimate.

### Resolved: uncertainty is the entropy of pKnow shrunk by the weighted count of fresh observations, and nextReview follows the spaced-review ladder

Proposed by research on 2026-09-26; the owner approves it with this record.

`uncertainty = H(pKnow) * 3 / (3 + nEff)`, where `H` is the binary entropy in bits and runs from 0 to 1. `nEff` is the sum of the weights of the node's observations (1, or 0.5 after a fatigue signal), each multiplied by `2^(-age / H)` with the node's current forgetting half-life `H`. The entropy alone would call a node certain whenever its prior is far from 0.5, even with no answers at all; the count factor fixes that. With the constant 3, three fresh observations halve the uncertainty and a full block of five cuts it to 3/8 of the entropy. I compared this with the variance of a beta estimate over first attempts: the variance ignores what BKT believes, so it could call a node certain while `pKnow` sits at 0.5. The draft names entropy corrected by the count, so the chosen formula follows its wording.

`nextReview` is the date of the node's last unassisted first attempt plus the interval of the spaced-review ladder in RES-1000: 1, 3, 7, 14 and 30 days after the 1st to 5th unassisted success in a row, then 30 days again after each further success, and 1 day after a failure. I compared this with a date computed from the model, the day the forgotten `pKnow` falls below 0.85, the flow rule's review bar. The model date depends on `pInit` and `pLearn`, which are guesses until the refit, while the ladder is fixed and the parent can check it. The ladder wins until the refit shows the model date predicts better.

### Resolved: every template takes its node's catalogue fluency threshold, and a subtype differs only through a new threshold version

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft refers to `fluencyMs` per template but lists it per node, in the catalogue that RES-1200 carries. The rule: each template of a node starts with the node's catalogue value, and T1 to T4 take 30, 60, 90 and 120 seconds by their number of steps. A template gets its own value only when a person changes it, as a new version in the `thresholds` table (RES-1300). I compared this with a value per subtype scaled by the subtype's steps or digits. Scaling would give finer thresholds, but it would be a formula nobody has checked against children, while the catalogue values match published norms: RES-1300 holds that comparison. Science nodes E1 to E5 have no fluency threshold; a probe of them counts as "fluent (probe)" by correctness and the absence of rapid guesses alone, as the choice-probe rule above says.

### Resolved: model v1 uses the priors for the player's current school group, and the graph still covers everything to the end of group 8

The owner decided the player's current school group on 2026-09-27 (the value is kept in `personal/player.md`), and that she learns the full material including group 8. The row of `pInit` for that group is therefore a decision, not an assumption. The scope doesn't shrink to her current group: the graph in RES-0800 keeps every node up to the end of group 8, level 1S, and the stretch nodes above it. Low priors on 1S nodes she hasn't met at school yet are the intended result, because the Director then probes them before it trusts them.

The row for any other group stays in `content/model.v1.json`, and the game uses it only through a new model version, for example at a refit when she moves up a group. Proposed by research on 2026-09-27: a switch by date alone would change the estimates without a version change, and the model recomputes the whole history whenever its version changes, so a version is the one place such a switch belongs.

## Conclusions

1. The knowledge model is a derived view of the event log, and the game can delete every derived table and rebuild it from the log.
2. After every adventure, the game recomputes every estimate and state from the event log with the current versions of the model, the thresholds and the rules.
3. When the model, thresholds or rules change, the game recomputes the whole history and keeps the snapshots of the earlier version for comparison.
4. Each day the game saves a snapshot of node estimates that records the model version, the threshold version and the last event counted.
5. The unit of estimation is the pair of node and subtype, and a node aggregates its subtypes by weight.
6. A node aggregates its subtypes with the weights in the skill graph, which is the one source of subtype weights.
7. The "on her own" estimate uses BKT with forgetting and the v1 parameters in this record, stored as versioned data.
8. Only unassisted first attempts feed the "on her own" estimate; rapid guesses and parent-excluded tasks never do.
9. A partially correct answer counts as half right, and an answer after a fatigue signal counts with weight 0,5.
10. A walkthrough, explanation or hint shown before the next observation of the same node applies the feedback learning rate.
11. Assisted attempts feed a separate "with help" estimate that never enters the "on her own" estimate.
12. The "with help" estimate forgets with a fixed half-life of 30 days, the same rule as fluency.
13. Fluency is a separate beta estimate that starts at one and one and forgets with a half-life of 30 days.
14. Control facts update the estimate of their node but never enter a full block or a probe.
15. The report states come from the explicit rules in this record, not from the model's probabilities, so the parent can check them.
16. A block score of 2,5 or less gives "not mastered", and a score of 3 or 3,5 gives "understands".
17. A full block is the last 5 graded tasks of a node within 7 days, covering every subtype of weight 0,2 or more, and never crossing a lesson mark for that node.
18. A block that holds tasks after a fatigue signal never gives "not mastered" when the result without them would be higher.
19. A probe is 2 tasks of different subtypes, or 3 choice tasks with at least 4 options each, and any result short of "fluent (probe)" escalates to a full block.
20. A probe scoring 0 out of 2 completes to a block in the same session or first thing on the next day.
21. A choice-only probe never supports inference to ancestors.
22. The game applies the six inference rules in this record, and inferred results never add up with tested ones.
23. Each day 1 to 2 probes check random nodes in the state "fluent (inferred)" or "cut off".
24. A node not checked for more than 30 days is marked as not tested for a long time and gets priority.
25. A new model version replaces the old one only if it better predicts the next unassisted first attempt on held-out days, by log-loss and calibration.
26. Model v1 starts with `pInit` by level and school group (group 7: 1F 0.55, 1S 0.25, stretch 0.05; group 8: 1F 0.70, 1S 0.40, stretch 0.10), `pLearnPractice` 0.05, `pLearnFeedback` 0.15 and `pSlip = max(0.10, 1 - 0.95^steps)`, and uses the values for the player's current school group (kept in `personal/player.md`), because the owner decided that group on 2026-09-27 (the draft of this conclusion assumed a group only until the owner stated hers).
27. Every parameter set keeps `pGuess + pSlip < 1` and `pLearn < 1 - pSlip / (1 - pGuess)`, and a test checks both for every template.
28. `uncertainty` is `H(pKnow) * 3 / (3 + nEff)`, with `nEff` the forgetting-weighted count of the node's observations.
29. `nextReview` is the last unassisted first attempt plus 1, 3, 7, 14 or 30 days by the run of unassisted successes, 30 days after that, and 1 day after a failure.
30. Each template's starting `fluencyMs` is its node's catalogue value in RES-1200, and only a person gives a template its own value, as a new threshold version.
31. A check, the evidence for "stable", is a full block or later an Ascent anchor form, never a probe; the stretch gate asks for a tested result, where a probe counts.
32. The report shows every rule state with its own label, plus «Не проверено» for a node with no unassisted first attempt, drawn with the design's five chip fills and hatching as the mapping in this record sets out.
33. The report uses «Пока не освоено» for "not mastered", and «Понимает, нужна скорость» only when a block score of 4 or more fails on time.
34. Model v1 uses the priors for the player's current school group (kept in `personal/player.md`), as the owner decided on 2026-09-27, and the priors for another group take effect only through a new model version.
35. The model covers every node up to the end of group 8, level 1S, and the stretch nodes, whatever the player's current school group.

## Sources

- The owner's draft «Хроники Башни — спецификация», opening and sections «Модель знаний v1», «Модель оценки и алгоритм», «Оценка узла», «Состояния узла», «Зонд, блок, эскалация», «Правила вывода» and «Пересчёт», read 2026-09-26; not kept in the repository - the model v1 parameters, the node estimate, the node states, the probe and block rules, the inference rules and the recompute.
- OCW in cijfers, «Taal- en rekenvaardigheid aan het einde van de basisschool» (Dutch Ministry of Education), https://www.ocwincijfers.nl/indicatoren-funderend-onderwijs/behaalde-referentieniveaus-lezen-taalverzorging-en-rekenen-eind-po, read 2026-09-26 - in 2024-2025, 93 % of group-8 pupils reached at least 1F in arithmetic and 43 % reached 1S; the base for `pInit`.
- Z. A. Pardos and N. T. Heffernan, "Modeling Individualization in a Bayesian Networks Implementation of Knowledge Tracing", UMAP 2010, https://people.csail.mit.edu/zp/papers/UMAP_final.pdf, read 2026-09-26 - a prior per student predicts better than one shared prior.
- A. T. Corbett and J. R. Anderson, "Knowledge tracing: Modeling the acquisition of procedural knowledge", User Modeling and User-Adapted Interaction 4 (1995), 253-278, read through Y. Liu, "Module 1: Bayesian Knowledge Tracing", https://yilinliu.quarto.pub/module-1-bkt/, on 2026-09-26 - the bounds guess below 0.3 and slip below 0.1, and the tutorial learning rate of 0.1; I didn't read the original paper.
- B. van de Sande, "Properties of the Bayesian Knowledge Tracing Model", Journal of Educational Data Mining 5(2), 2013, https://files.eric.ed.gov/fulltext/EJ1115329.pdf, read 2026-09-26 - the constraints `pGuess + pSlip < 1` and `pLearn < 1 - pSlip / (1 - pGuess)`, and its account of R. Baker, A. Corbett and V. Aleven (2008) on empirically degenerate models.
