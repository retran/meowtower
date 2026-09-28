---
id: RES-4280
artifact: research
status: approved
revised: 2026-09-28
elaborates: [RES-4200, RES-4240, RES-4270]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The language line holds check 5's bars only when either difference suffices, the two small Cito domains read only on a scaled floor with a one-node guard, and no hold up to 56 play days keeps the hypothesis label under 10 % false labels

## Summary

I reran the three simulations that the draft decisions ADR-0380, ADR-0420 and ADR-0450 used to show that three approved rules can't hold as written, and all three results stand. The language line that needs both of its differences finds a language gap on 75.5 % of seeds, so check 5's approved bars pass a working report on 6.2 % of seed sets; the rule that needs either difference gives the rates RES-4200 reported and passes the approved single-gap bars, and a both-gaps bar of 14 of 20 passes 97.0 %. The flat floor of 10 tested nodes never lets Verhoudingen (8 mapped nodes) or Verbanden (7) read. The scaled floor, 6 for both, lets them read, and its one-node guard cuts a chance reading at 6 tested nodes from about 34 % to about 5 %. The hypothesis label's hold gives false labels on 48 % of hypotheses at 7 play days, 28 % at 28 and 16 % at 56, against a bar of 10 %, so the label can't ship under the approved rules and stays off until research finds a guard that passes. I decide the first two below, and for the third only that the label stays off while a later record chooses its replacement guard. This record covers these three simulations only. It changes no rule that the simulations don't force, and it doesn't revisit the one-deviation margin of the Cito rows, though its second simulation measures that margin's chance rate.

## The question

Do the three rules that the draft decisions found broken fail as those decisions say, and what replaces each? The first rule is the language line's trigger, which approved text words as needing both differences while RES-4200's rates, and check 5's bars built on them, came from a simulation. The second is the Cito category floor of 10 tested nodes from RES-4240's decided point 4. The third is the hypothesis label's hold, which RES-4270 set at 7 play days and which approved text lets grow in steps of 7 up to 56 until synthetic logs show at most 10 % false labels.

The decisions share one assumption, that a sketch run once by the author of the decision is enough to reopen an approved rule. I challenge it by rerunning each simulation from its stated parameters with a fresh script and fresh seeds, and by computing the language line exactly from the binomial as well as by drawing. Where my figures agree with the decision's to within the sampling error, the decision's case rests on a measurement two people could repeat; where they differ, the difference is itself a finding.

Each question also carries an assumption of its own. The language question assumes the two rules differ only in how often they fire; they also differ in what a single drop can mean, and I state that case against the rule I lead with. The floor question assumes a small category reads less reliably than a large one; the simulation shows that a small category reads less often, and that the approved margin gives a chance reading at about the same rate at every size. The hold question assumes that lengthening the hold brings the false-label rate down to 10 % within the cap; the simulation tests that directly and finds that it doesn't.

## Method

On 2026-09-28 I read the draft decisions ADR-0380, ADR-0420 and ADR-0450 in the working tree, untracked, with close reading of ADR-0380's sections on the language line and check 5, ADR-0420's section on small categories and its alternatives, and ADR-0450's sections on the hold and the example. I read RES-4200's finding on interval widths and its decided rules for the lines and check 5, RES-4240's finding on block size and decided point 4, RES-4270's finding on the probe's volume and conclusions 6, 7 and 15, and ADR-0430's rules for families, letters a day and the first phase's end. I read the approved requirements on the language line, the maths line, check 5's students and bars, the Cito margin, the Cito floor, the domain mapping, the condition states, the label rule and the hold. I ran `paw find` for "hold false label", "language line either difference" and "category floor scaled", and each matched nothing. The record was read on 2026-09-28.

I wrote three scripts in Python 3.14.7 with `numpy` 2.5.2 and `scipy` 1.18.1. They stay outside the repository, because the repository holds no code yet, so the parameters below are written out in full: a reader can rebuild each figure from them without the scripts.

- `/private/tmp/claude-501/-Users-retran-workspace-tower/bd85ce7b-c737-4748-b553-c9e83f665cd8/scratchpad/sim/a_language_line.py`, seed 4280 for `numpy.random.default_rng`. It computes each student's line rates exactly, by enumerating all 21^4 count combinations of 20 observations on bare, Russian, Dutch and Dutch after the words, and checks them with 1,000,000 draws a student. It then gives each bar's pass rate on a fixed set of 20 seeds exactly from the binomial, and the whole check's pass rate from 100,000 simulated seed sets, in which each seed draws its pair of lines from the exact joint rates, so the two lines of one seed stay correlated. The lines follow RES-4200: Newcombe's hybrid score interval at 95 % on Russian minus Dutch and on Dutch after the words minus Dutch, and the 95 % Wilson upper limit of the pooled bare and Russian share against 0.8.
- `/private/tmp/claude-501/-Users-retran-workspace-tower/bd85ce7b-c737-4748-b553-c9e83f665cd8/scratchpad/sim/b_category_floor.py`, seed 4281, 400,000 draws for each category, player and coverage. It draws the tested nodes inside and outside a category, each node tested in the 30 days before a test with probability 0.5, 0.75 or 0.9, from a graph of 70 nodes: 66 mapped domain nodes, G4 counted once though it maps to two domains, plus T1 to T4. A tested node sits at a block score of 4 or more with the binomial chance of 4 or 5 right in 5 at the player's accuracy: 0.337 at 0.6, 0.737 at 0.8 and 0.919 at 0.9. It applies the approved one-deviation margin, and for the guard it moves one inside node one class toward the outside share and recomputes.
- `/private/tmp/claude-501/-Users-retran-workspace-tower/bd85ce7b-c737-4748-b553-c9e83f665cd8/scratchpad/sim/c_hypothesis_hold.py`, seed 4282, 10,000 hypotheses of each of ADR-0450's two kinds under each of two probe schedules, over 180 play days, and 2,000 resampled sets of 200 hypotheses for the spread of a 200-hypothesis measurement. Half the hypotheses compare Russian minus Dutch with 20 points at true shares of 75 % and 55 %, and half compare bare with 70 % at a true share of 70 %, each with one condition a side at the same number, so any label other than «мало данных» (too little data) is false. A condition is met at 20 or more observations when its 80 % interval, Wilson's for a share and Newcombe's hybrid score interval for a difference, lies wholly beyond the number, refutation outranks confirmation, and the shown label moves only after one computed label has held on each of the last H play days. Schedule A is ADR-0430's: 4 families, so 4 letters a day, until Russian, Dutch and Dutch after the words hold 20 each or 28 game days pass, then 2; each family shows its 5 presentations on 5 game days in a random order that keeps Dutch after the words directly after Dutch. Schedule B is ADR-0450's sketch: 3 to 5 letters a day to the same end, then 1 to 2, each letter independently bare, Russian, Dutch or Dutch after the words at 21 % and the source presentation at 16 %.

The outputs sit beside each script as `a_output.txt`, `b_output.txt` and `c_output.txt`. The scripts carry choices I made, and I name each where a finding rests on it: the coverage values, the graph of 70 nodes, the players' accuracies, the second schedule's shares and my simplification that schedule A closes its third and fourth families on the day the first phase ends. Every simulation treats attempts as independent at a fixed true rate, so none of them models learning, fatigue or a repeat meeting with the same construction. I couldn't obtain the scripts behind ADR-0380's and ADR-0450's figures, which their author kept outside the repository, so I compare with their published figures only.

## Findings

### Under the both-differences rule the language line finds a 45-point language gap on 75.5 % of seeds, and under the either-difference rule on 94.6 %

The exact rates at 20 observations on each presentation are these, with the Monte Carlo check within 0.001 of each:

| Student | Language line, both differences | Language line, either difference | Maths line | Both lines on one seed, either rule |
| --- | --- | --- | --- | --- |
| Maths gap, every presentation at 55 % | 0.37 % | 4.05 % | 96.14 % | 3.39 % |
| Language gap, bare and Russian 90 %, Dutch 45 %, after the words 85 % | 75.54 % | 94.63 % | 0.01 % | 0.01 % |
| No gap, every presentation at 90 % | 0.23 % | 1.45 % | 0.01 % | 0.00 % |
| Both gaps, bare and Russian 55 %, Dutch 15 %, after the words 50 % | 60.99 % | 87.83 % | 96.14 % | 84.03 % |

The both-differences rule finds the language gap about 20 points less often than the maths line finds the maths gap, so it shows a weak side in language less clearly than one in maths. The joint rate of the both-gaps student, 84.03 %, sits 0.4 points below the 84.4 % that independent lines would give, because the two lines share the Russian share. These figures match ADR-0380's to within 0.1 point. Source: `a_language_line.py`, run 2026-09-28; ADR-0380, read 2026-09-28.

### RES-4200's reported rates are the either-difference rule's

RES-4200 reports about 95 % for the language gap, 1.5 % for no gap, 4 % for the language line on the maths gap and 88 % for the language line on both gaps. The either-difference column above gives 94.6 %, 1.45 %, 4.05 % and 87.8 %; the both-differences column gives 75.5 %, 0.23 %, 0.37 % and 61.0 %. So check 5's approved bars were set on the either rule's rates, while the approved wording of the line needs both differences. Source: RES-4200, the finding on interval widths, read 2026-09-28; `a_language_line.py`, run 2026-09-28.

### Under the both-differences rule a working report passes check 5's approved bars on 6.2 % of seed sets

At the both rule's rates a working report gets the language student's own line on 15 or more of 20 seeds on 63.9 % of fixed seed sets, and both lines on the same seed for the both-gaps student on 15 or more on 9.7 %. The whole check passes on 6.2 % of 100,000 simulated seed sets. Check 5 fixes its seeds, so a working build would fail the same way on every run. Lowering the bars to 11 of 20 for the language student's own line and 8 of 20 for the both-gaps student brings the pass rates to 98.9 % and 97.0 %, and the whole check to 95.9 %. Source: `a_language_line.py`, run 2026-09-28.

### Under the either-difference rule the approved single-gap and no-gap bars hold, and the both-gaps bar passes at 14 of 20 and not at 15

At the either rule's rates the language student gets its own line on 15 or more seeds on 99.95 % of seed sets and the maths student on 99.99 %. The maths student's language line stays at 4 or fewer on 99.90 %, and the no-gap student's lines at 4 or fewer on 99.999 %. The both-gaps bar of 15 of 20 passes on 91.4 %, so a working build would fail check 5 on about one seed set in twelve for that bar alone. A bar of 14 passes on 97.0 %, and the whole check then passes on 96.8 %, against 91.2 % with the bar at 15. A both-gaps count of 14 still tells that student from the single-gap ones, whose joint rates are 3.39 % and 0.01 %. Source: `a_language_line.py`, run 2026-09-28.

### The either-difference rule costs about ten times as many false language lines as the both-differences rule

On the maths-gap student the either rule shows a false language line on 4.05 % of seeds, where the both rule shows one on 0.37 %; on the no-gap student 1.45 % against 0.23 %. Check 5's bar of at most 4 of 20 absorbs 4.05 % on 99.90 % of seed sets. A second cost has no number in these simulations: Dutch after the words directly follows Dutch in each family (ADR-0430), so a rise from Dutch to Dutch after the words can also come from meeting the same construction a second time on the next game day, and a line fired by that difference alone carries that cause as well as language. Source: `a_language_line.py`, run 2026-09-28; ADR-0430, the family order, read 2026-09-28.

### The flat floor of 10 never lets Verhoudingen or Verbanden read, and reaches Meten en meetkunde only when most of its nodes are tested

Verhoudingen maps 8 nodes and Verbanden 7, so neither category can hold 10 tested nodes at any coverage, and their rows land in no quadrant for as long as the mapping stands. Meten en meetkunde, with 18 mapped nodes, reaches 10 tested nodes on 40.7 % of test moments at a coverage of 0.5, 98.1 % at 0.75 and all at 0.9. Getallen, with 34, reaches 10 on 99.5 % or more at every coverage. Source: `b_category_floor.py`, run 2026-09-28; the approved domain mapping and RES-4240's decided point 4, read 2026-09-28.

### The scaled floor is 6 for the two small domains and 10 for the two large ones, and the small ones reach it on 6 % to 96 % of test moments

The floor min(10, max(5, ceil(0.75 x mapped nodes))) gives 6 for Verbanden (ceil 5.25) and Verhoudingen (ceil 6), and 10 for Meten en meetkunde (ceil 13.5) and Getallen (ceil 25.5). The large domains' floor stays the flat 10, so every reading they give is unchanged. Verbanden reaches 6 tested nodes on 6.3 % of test moments at a coverage of 0.5, 44.5 % at 0.75 and 85.0 % at 0.9; Verhoudingen on 14.5 %, 67.8 % and 96.2 %. Source: `b_category_floor.py`, run 2026-09-28.

### Without a guard, a category at 6 tested nodes reads by chance as often as one at 10, and the one-node guard cuts that to about 5 %

For a player with no real difference at an accuracy of 0.8, the home side reads a strength or a weakness on about 34 % of test moments at 6 tested nodes inside, and on about 33 % at 10 inside nodes in Meten en meetkunde at coverages of 0.5 and 0.75. The margin grows as the inside count falls, so the chance rate stays near what one standard deviation gives on both sides. The one-node guard, which moves one inside node one class toward the outside share and recomputes the margin, cuts the chance rate at 6 inside nodes to 4.7 % to 5.7 % across coverages, and to 2.7 % to 3.1 % at an accuracy of 0.9. It removes 79 % to 88 % of chance readings. With no floor at all the chance rate is 33 % to 36 % at an accuracy of 0.8, and the category then reads on its thinnest samples too. Source: `b_category_floor.py`, run 2026-09-28.

### The guard costs about a quarter of true readings in a small category

For a player whose small-category accuracy is 0.6 against 0.8 outside, a gap of 40 points in block share (0.337 against 0.737), the home side reads the weakness on about 84 % of test moments at 6 inside nodes without the guard and 58 % to 60 % with it. Over all test moments at a coverage of 0.75, the scaled floor with the guard reads the weakness in Verbanden on 27.1 % and in Verhoudingen on 43.1 %, against 37.6 % and 57.9 % without the guard and none under the flat floor. At 10 or more inside nodes in a large category the same gap reads on 87 % to 99 %. The guard removes 22 % to 30 % of true readings, against 79 % to 88 % of chance ones. In Getallen the same gap reads on 97.8 % of test moments at a coverage of 0.75. Source: `b_category_floor.py`, run 2026-09-28.

### The one-deviation margin gives a chance home reading on about a third of test moments in the large categories

For a player with no real difference, Getallen's home side reads a strength or a weakness on 32.4 % to 37.1 % of test moments, and Meten en meetkunde's on 32.2 % to 36.1 % at coverages of 0.75 and 0.9, where it almost always reaches its floor. One standard deviation on both sides gives about 32 % under a normal model, so the simulation shows the approved margin working as defined. A row lands in a quadrant only when the Cito side is also marked, so the quadrant's chance rate is lower than the home side's, and the simulation doesn't model the Cito side. RES-4240 already has the owner revisit the one-deviation rule once a year of real home data exists. Source: `b_category_floor.py`, run 2026-09-28; RES-4240's decided point 4, read 2026-09-28.

### The hold gives false labels on 48 % of hypotheses at 7 play days, 28 % at 28 and 16 % at 56

Pooled over the two kinds of hypothesis, half and half, the false-label rate is:

| Hold, play days | 7 | 14 | 21 | 28 | 35 | 42 | 49 | 56 | 84 | 112 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Schedule A, ADR-0430 | 47.9 % | 38.9 % | 32.3 % | 27.6 % | 23.8 % | 20.6 % | 17.9 % | 15.5 % | 9.3 % | 5.4 % |
| Schedule B, ADR-0450's sketch | 45.6 % | 37.6 % | 32.0 % | 27.6 % | 24.2 % | 21.3 % | 18.8 % | 16.7 % | 10.3 % | 6.6 % |

Each kind of hypothesis gives rates within 1.2 points of the pooled figure. A single look on play day 180 gives a false label on 20.7 % under each schedule, the rate two sides of an 80 % interval give, and some day within 180 shows a non-«мало данных» computed label on 57 % to 62 % of hypotheses. These figures match ADR-0450's sketch, about 50 %, 29 % and 16 %, to within 3 points. Source: `c_hypothesis_hold.py`, run 2026-09-28; ADR-0450, read 2026-09-28.

### No hold up to the cap of 56 play days passes the 10 % bar, and a measurement on 200 hypotheses passes reliably only at 112

At a hold of 56, a set of 200 hypotheses shows a false-label rate between 11.5 % and 20.0 % in 90 % of sets under schedule A, and at or below 10 % in 1.8 % of sets; under schedule B in 0.4 %. At 84 the pooled rate sits at the bar, 9.3 % and 10.3 %, and a 200-hypothesis measurement passes in 69.6 % and 50.2 % of sets, so whether it passes depends on the draw. At 112 it passes in 99.8 % and 98.0 % of sets. So no hold from 7 to 56 play days passes, and the first hold that a 200-hypothesis measurement passes reliably is twice the cap. A hold of 112 play days inside a 180-day log leaves 68 play days in which a label can first appear, and the simulation doesn't measure how often a real effect then gets its label. Source: `c_hypothesis_hold.py`, run 2026-09-28.

### Four ways to set the language line's trigger, compared

| Option | Better at | Case against |
| --- | --- | --- |
| Do nothing: the both-differences rule with check 5's approved bars | the fewest false language lines, 0.37 % on a maths gap; a line needs a drop and a recovery, the full signature of a language gap | a working report passes check 5 on 6.2 % of seed sets, so the check fails every build of a correct report |
| The both-differences rule with the bars lowered to 11 and 8 of 20 | keeps the strict line and makes check 5 pass, 95.9 % of seed sets | finds a language gap on 75.5 % of seeds against 96.1 % for a maths gap, so the report shows a weak side in language less clearly than in maths; a both-gaps bar of 8 of 20 tests little |
| The either-difference rule with the approved bars, both-gaps at 15 of 20 | the bars RES-4200 set, unchanged | a working report fails the both-gaps bar on 8.6 % of seed sets, and fixed seeds repeat that failure on every build |
| The either-difference rule with the both-gaps bar at 14 of 20 | finds the language gap on 94.6 %, as clearly as the maths gap; every bar passes a working report on at least 97 % of seed sets | about ten times as many false language lines, 4.05 % on a maths gap; one difference alone can come from a repeat meeting with the construction |

I lead with the fourth. Its case is real: a parent reading a language line on a player whose gap is maths alone will look for a language cause about one phase in twenty-five, and the second difference alone mixes language with a second meeting of the same construction. I keep it because the line reads «что проверить» (what to check) and names a check, so a false line costs one probe or one question, while the both rule misses one real language gap in four and makes the report lopsided between its two sides. The repeat-meeting cause affects the second difference only; the first, Russian against Dutch, has no such confound, because ADR-0430's balancing rule puts Russian before and after the Dutch pair equally often.

### Four ways to set the Cito category floor, compared

| Option | Better at | Case against |
| --- | --- | --- |
| Do nothing: the flat floor of 10 | the strictest guard; no requirement changes | Verhoudingen and Verbanden never read, two of four domains, for the life of the game |
| No floor: the margin alone decides | one rule; every category can read | a chance reading on 33 % to 36 % of test moments at an accuracy of 0.8, at any inside count, and at 3 inside nodes one block moves the share by 33 points |
| The scaled floor without a guard | the two small domains read, and a true 40-point gap reads on 84 % at 6 inside nodes | a chance reading at 6 inside nodes on about 34 %, and at 6 nodes one node moves the share by 16.7 points, so one block that changes class with no change in the player can make or undo a reading |
| The scaled floor with the one-node guard below 10 tested nodes | the two small domains read; a chance reading at 6 inside nodes drops to about 5 %; the large domains keep every reading they had | the guard removes about a quarter of true readings in a small category; three quarters is a preference; a second rule for the parent to follow |

I lead with the fourth. Its case is that the guard makes a small category stricter than a large one: 5 % chance readings at 6 inside nodes against 33 % at 10, so a true gap in Verbanden reads on 27 % of test moments where the same gap in Getallen reads on 97.8 %. I keep it because a block changes class about one time in four with no change in the player (RES-4240), and at 6 nodes that single block can make a reading; the guard is what separates a reading from one block's chance.

### Four ways to answer a hold that can't meet its bar, compared

| Option | Better at | Case against |
| --- | --- | --- |
| Do nothing: the approved rule, under which the label doesn't ship when no hold up to 56 passes | changes no requirement; the events, the text form and the history ship as approved, and no false label reaches the parent | the parent writes numeric conditions that the report never judges, until research finds another guard |
| Raise the cap to 84 or 112 play days | the hold is the approved mechanism, and 112 passes a 200-hypothesis measurement on 98 % or more | a label waits 16 weeks of play after the data turns; at 84 the measurement passes only on 50 % to 70 % of draws; the example check's pass rate at these holds is unmeasured |
| Loosen the bar to the 16 % that 56 play days reaches | ships the label at the approved cap | a label wrong on one hypothesis in six at the threshold, which RES-4270 set 10 % to prevent, and a bar moved to fit the result |
| Replace the hold with another guard: a wider interval for the label, a fixed schedule of looks, or a bar counted on one side | attacks the repeated looks directly, where the hold only delays them | each changes approved rules on the interval, the hold or the bar, and none has been simulated; a choice now would be made without a measurement |

I lead with the first and defer the choice between the second and the fourth. The case against the first is that it leaves the numeric conditions without a verdict for as long as research takes. I keep it because the approved rule already says what happens when no hold passes, so the result forces no change to it, and choosing a longer cap or another guard without simulating the example check at that setting would repeat the error this record corrects.

### Decided on 2026-09-28

1. The language line appears when the 95 % Newcombe hybrid score interval of at least one of its two differences excludes zero with the Dutch share the lower one, because only that rule finds a language gap as clearly as the maths line finds a maths gap, 94.6 % against 96.1 %, and it gives the rates check 5's bars were set on. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.
2. Check 5's both-gaps bar is both lines on the same seed on at least 14 of 20 seeds, and its single-gap and no-gap bars stay as approved, because at the joint rate of 84.0 % the bar of 15 fails a working report on 8.6 % of seed sets and the bar of 14 on 3.0 %. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.
3. A Cito row reads on the floor min(10, max(5, ceil(0.75 x mapped nodes))), and a row read on fewer than 10 tested nodes must also survive one inside node moving one class toward the outside share, because the flat 10 shuts out two of four domains and the guard brings a small category's chance reading from about 34 % to about 5 %. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.
4. The hypothesis label stays off, as the approved rule on the hold already requires when no hold up to 56 play days passes, and the choice between a longer cap and another guard waits for a record that simulates the chosen guard together with the example check. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

## Conclusions

1. The language line must appear when at least one of its two differences, Dutch below Russian or Dutch below Dutch after the words, has a 95 % Newcombe hybrid score interval that excludes zero, because a rule that needs both finds a 45-point language gap on 75.5 % of seeds where the maths line finds a maths gap on 96.1 %.
2. Build check 5 must pass the student with both gaps only when both the language line and the maths line stand on the same seed's report on at least 14 of 20 seeds, because at a joint rate of 84.0 % a bar of 15 fails a working report on 8.6 % of fixed seed sets.
3. Build check 5's bars for the single-gap students, their own line on at least 15 of 20 seeds and the other on at most 4, and for the no-gap student, any line on at most 4, must stay as they are, because under the either-difference rule each passes a working report on 99.9 % or more of seed sets.
4. The "home and school" screen must place a Cito row in no quadrant when its category has fewer tested nodes than min(10, max(5, ceil(0.75 x mapped nodes))), which is 6 for Verhoudingen and Verbanden and 10 for Meten en meetkunde and Getallen, because a category that maps fewer than 10 nodes can never reach a flat floor of 10, and three quarters of the mapped nodes keeps every category that maps 14 or more at 10.
5. Below 10 tested nodes, the screen must also place a Cito row in no quadrant when its difference falls short of the margin, recomputed, once one inside node moves one class toward the outside share, because without that guard a category at 6 tested nodes reads by chance on about 34 % of test moments and with it on about 5 %.
6. The computed hypothesis label must not ship until a simulation on synthetic logs at the probe's planned volume, on enough hypotheses that the upper limit of the 95 % Wilson interval of its false-label rate lies at or below 10 %, finds such a setting, because the hold gives 48 % at 7 play days, 28 % at 28 and 16 % at 56, and no hold up to the cap passes.
7. A later research record must simulate each candidate guard for the label, a cap above 56 play days, a wider interval for the label, a fixed schedule of looks or a bar counted on one side, together with the example hypothesis's check on the maths-gap and language-gap players, before any of them replaces the hold, because a hold of 112 play days passes the 10 % bar and its effect on the example check is unmeasured, and because at 84 play days a measurement on 200 hypotheses passes on 50 % to 70 % of draws while the rate sits at the bar.

## Open review findings

One agent review ran on 2026-09-28, and I fixed four of its five findings: the interval named in the third script's method, the reason for the scaled floor in conclusion 4, the 97.8 % figure behind the comparison with Getallen with "about a quarter" for the guard's cost, and a conclusion on the owner's yearly review of the margin, which I dropped because no simulation here forces it; the chance rate stays a finding. I fixed the fifth in part. The reviewer asked for the three scripts to be kept where they outlast the session, for example beside this record. I kept them outside the repository, because the owner's brief for this step placed them there and the repository holds no code yet, and wrote the Method so that every figure can be rebuilt from its parameters alone. The approved build measurement of the hold on at least 200 hypotheses would pass a setting whose true rate is 10.3 % about half the time; conclusion 6 asks the later record for an interval on the rate, and the build's own bar stays as approved until that record weighs it. The fixes haven't had a second review.

## Sources

- ADR-0380, `project/adrs/ADR-0380-addendum-2-figures-carry-intervals-lines-come-from-fixed-contrasts.md`, draft, untracked in the working tree, read 2026-09-28 - the rerun that found the both-differences rule behind the reported rates, the joint rate, the bar of 14 and the replacement texts.
- ADR-0420, `project/adrs/ADR-0420-quadrants-cut-each-side-on-its-own-measure.md`, draft, untracked in the working tree, read 2026-09-28 - the scaled floor, the one-node guard, the worked example at 6 inside nodes and the replacement text.
- ADR-0450, `project/adrs/ADR-0450-hypotheses-logged-from-mvp-labelled-later-on-later-data.md`, draft, untracked in the working tree, read 2026-09-28 - the generator's hypotheses, the sketch's schedule and its false-label rates.
- ADR-0430, `project/adrs/ADR-0430-dutch-probe-letters-from-checked-text-pairs-after-the-mvp.md`, draft, untracked in the working tree, read 2026-09-28 - the families, the letters a day, the first phase's end and the order of Dutch and Dutch after the words.
- RES-4200, `project/research/RES-4200-goal-falsifiability-and-addendum-2-cross-cutting-rules.md`, read 2026-09-28 - the reported line rates, the lines' triggers and check 5's students and bars.
- RES-4240, `project/research/RES-4240-home-and-school-quadrants.md`, read 2026-09-28 - the margin, the floor of 10 and the block that changes class about one time in four.
- RES-4270, `project/research/RES-4270-parent-hypotheses.md`, read 2026-09-28 - the probe's volume, the condition rule, the hold and the 10 % bar.
- The approved requirements on the language line, the maths line, check 5, the Cito margin, the Cito floor, the domain mapping, the condition states, the label and the hold, `project/requirements/`, read 2026-09-28.
- The three scripts under `/private/tmp/claude-501/-Users-retran-workspace-tower/bd85ce7b-c737-4748-b553-c9e83f665cd8/scratchpad/sim/`, run 2026-09-28 with Python 3.14.7, `numpy` 2.5.2 and `scipy` 1.18.1 - every rate, pass rate and chance reading above.
