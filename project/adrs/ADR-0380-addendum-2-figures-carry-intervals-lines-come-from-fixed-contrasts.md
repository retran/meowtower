---
id: ADR-0380
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-6600, REQ-6602, REQ-6604, REQ-6606, REQ-6608, REQ-6610, REQ-6612, REQ-6614, REQ-6616, REQ-6618, REQ-6620, REQ-6622, REQ-6624, REQ-6626, REQ-6628, REQ-6630, REQ-6632, REQ-6634, REQ-6636, REQ-6638, REQ-6640, REQ-6642, REQ-6644, REQ-6646, REQ-6648, REQ-6650, REQ-6652, REQ-6654, REQ-6656, REQ-6658, REQ-6660, REQ-6664, REQ-6666, REQ-6668, REQ-6670, REQ-6672, REQ-6674, REQ-6676, REQ-6682, REQ-6684, REQ-6686, REQ-6688, REQ-6690]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0380. Every figure addendum 2 adds shows its count and 80 % Wilson interval, the report draws its own lines only from contrasts fixed before her data exists, at 95 %, check 5 counts both lines on one seed against a rate the report's own code measures, and only the parts that shape the log join the MVP

## Decision

This decision carries the rules of the owner's addendum 2 of 2026-09-28 that hold for every item, as RES-4200 settled them. It owns six things: the report's falsifiability rules, the four states the school mixes, the owner of every new event type and of the new `item_shown` and template fields, the report's exclusion trail, build check 5, and addendum 2's MVP scope. Each of the addendum's items 2 to 8 gets a decision of its own, ADR-0390 from RES-4210 through ADR-0450 from RES-4270, one number for each. Those decisions cite this one for the rules below and never restate them. This record is written for the owner, who evaluates it, and for the building agent, who works under it. Where I chose a default the research left open, the sentence says "I chose".

The report still answers the question the vision asks, what she holds firmly, where the frontier runs and what stops her. After the MVP it also breaks her maths results into parts and shows where the boundary of what she does on her own runs (REQ-6600), and the parent judges whether it does. The VWO (pre-university track) ladder of ADR-0180 stays. Rewording `project/vision.md` is the owner's edit, and this record asks for it under Consequences.

### Every figure carries its count and an interval the parent can recompute

Every share in the report parts addendum 2 adds shows its right answers, its attempts and its 80 % Wilson interval over the raw, unweighted counts of the window it names (REQ-6616). The parts are the profile, the trajectories, retention, transfer, the home-and-school quadrants, the probe and the hypotheses. A difference between two shares shows Newcombe's hybrid score interval at 80 %, built from the two Wilson intervals the screen already shows (REQ-6618). A median time shows its distribution-free 80 % interval from order statistics: the values at ranks j and n + 1 - j, with j the largest rank for which a binomial count of n at one half falls below j with chance 0.10 or less (REQ-6620). ADR-0060's entropy uncertainty stays for the Director and for report v1's node card.

One module, `src/parent/intervals.ts`, holds the only functions that compute these intervals, and no other module in `src/parent/` imports a statistics library. I chose one module because two screens that compute one figure two ways can disagree, and the parent would then check the wrong one. A group 2 test compares the module with `tests/reference/intervals.json`, a table computed once in Python with `scipy.stats`, and fails on any difference above 0.0005. The table holds the Wilson interval at every count from 0 of 1 to 1,000 of 1,000, the median interval's ranks for 4 to 1,000 values, and Newcombe's interval for every pair of counts at totals of 5, 10, 12, 20, 40, 100 and 1,000 on each side. I chose 1,000 because a 28-game-day window at about 30 graded tasks a day holds about 840 attempts, and 0.0005 because it is half the smallest step of a share printed to three decimals, below any rounding the report shows. SciPy has no Newcombe function, so the table builds it from the two Wilson limits by Newcombe's formula: the difference minus the square root of (p1 - l1)^2 + (u2 - p2)^2 for the lower limit, and the difference plus the square root of (u1 - p1)^2 + (p2 - l2)^2 for the upper.

### Each measure owns its «мало данных» floor

Every measure in the addendum 2 parts declares its «мало данных» (too little data) floor in one registry, `src/parent/measures.ts`, and a group 1 check fails a measure registered without one. The floors are the ones the research set: a profile bar under 10 observations or with an interval wider than 30 points (ADR-0390), a transfer figure under 10 eligible observations (ADR-0410), a probe cell under 12 (ADR-0430), and a hypothesis condition under 20 (ADR-0450). Any other share or median time uses 5 (REQ-6622), the floor ADR-0240 and ADR-0300 already use for a cell, and 5 also keeps every median interval defined, because the order-statistic interval needs at least 4 values. The floors for limits and the interest signal stay as ADR-0180 and ADR-0330 set them, because they count sessions and days.

A figure below its floor shows «мало данных» with its count in place of its value. It enters no interpretation line, quadrant, profile line or hypothesis status (REQ-6624), and a difference with either share below its floor shows «мало данных» too (REQ-6618). A property test feeds each registered measure a count one below its floor and finds no line, quadrant, profile line or status built from it.

### The report draws its own lines only from contrasts fixed before her data exists

The report draws an interpretation line of its own only from the contrasts `verify/contrasts.json` lists, which `src/parent/contrasts.ts` implements (REQ-6630). Two of them come from this record, the language line and the maths line, and ADR-0390 adds the profile's change lines under REQ-6730's stricter level. `verify/contrasts.json` names each entry with the decision that approved it, and a group 1 check fails when the code's list and the file differ, so a new contrast needs a decision before it can draw a line. A per-node figure shows its 80 % interval and draws no line (REQ-6640), because across 40 node comparisons about 8 would clear an 80 % interval by chance (RES-4200).

Both lines read every graded first attempt on the probe's presentations since the probe was switched on (REQ-6632, REQ-6634). ADR-0430 defines one first phase and then keeps 2 families open with no end, so I chose to read the phase REQ-6632 names as the probe's whole run: resetting the cells when the first phase closes would throw away the only data the lines have. I chose to compute the lines only at three checkpoints, when the `bare`, `ru`, `nl` and `nl_after_words` cells first all hold 20, 40 and 80 graded first attempts, and to show the last checkpoint's result between them. A line recomputed at every rebuild would get a new chance to clear 95 % after each adventure, and over months the chance line would no longer be rare. At three looks a student with no gap sees a false line at most about 3 x 1.5 %, 4.5 %, by the union bound.

- The language line compares Russian with Dutch, and Dutch with Dutch after the words are explained, and never bare with Dutch. It appears when the 95 % Newcombe interval of at least one of the two differences lies wholly above zero with the Dutch share the lower one. That rule departs from REQ-6636, and the next section gives the reason and the replacement text.
- The maths line compares with 0.8 the pooled share of right answers on the bare and Russian presentations. It appears only when the upper limit of that share's 95 % Wilson interval lies below 0.8 (REQ-6644). 0.8 is ADR-0060's block score of 4 in 5 for «Бегло» (fluent).

When a contrast's 95 % interval still holds zero or its threshold, the report shows «пока не ясно» (not clear yet) in its place (REQ-6638). Every state of the language contrast short of a line reads «пока не ясно», a Dutch share clearly above Russian included, because the contrast looks for a language gap and a third reading would be a new contrast that needs its own decision. A maths share whose 95 % interval lies wholly above 0.8 shows no line and no «пока не ясно», because the data then says there is no maths gap. The 95 % trigger cuts the chance line per contrast from about 20 % to about 5 %, while the 80 % interval stays the one the parent reads (RES-4200). The lines sit in the probe's section, which ADR-0430 places.

Every line reads «что проверить» (what to check) and names one check the game or the parent can run: a probe phase, a retention check, the sandbox or a question to the teacher (REQ-6626). No line proposes a lesson, a date for one or an exercise (REQ-6628). The lines' texts live in the Russian string file under `parent.check.*`, and ADR-0180's label check gains a rule of this record's own that fails a `parent.check.*` value containing «урок» (lesson), the stem «заняти» (session, in every form), «упражнени» (exercise) or a date. No figure, label or line is worded as a diagnosis (REQ-6604), and the parent judges the wording at the acceptance of the stage that builds each part.

The profile screen states in one line, `parent.profile.miss_rate`, that about 1 in 5 of the 80 % intervals it shows misses its true value (REQ-6642). ADR-0390 places the line on the screen.

### The language line needs either difference, which REQ-6636 must be replaced to allow

I chose the rule the research simulated: the language line appears when either difference clears its 95 % interval. REQ-6636 asks for both. Its default says RES-4200's rates fit a rule that needs both, and my rerun of RES-4200's simulation shows the opposite. I ran it on 2026-09-28 in Python with `numpy` and `scipy.stats`, 1 million draws a student from `numpy.random.default_rng` with seeds 3, 7 and 11, 20 observations on each of the Russian, Dutch and after-the-words presentations and 20 on bare. The two rules give these rates:

| Student | Language line, both differences | Language line, either difference | Maths line |
| --- | --- | --- | --- |
| Maths gap, every presentation at 55 % | 0.4 % | 4.1 % | 96.2 % |
| Language gap, bare and Russian 90 %, Dutch 45 %, after the words 85 % | 75.5 % | 94.6 % | 0.0 % |
| No gap, every presentation at 90 % | 0.2 % | 1.5 % | 0.0 % |
| Both gaps, bare and Russian 55 %, Dutch 15 %, after the words 50 % | 61.0 % | 87.8 % | 96.1 % |

RES-4200's figures, about 95 %, 1.5 %, 4 % and 88 %, are the rates of the either rule. Under the both rule a working report passes REQ-6670's bar for the language student on 64 % of seed sets, and REQ-6672's on 10 %, so check 5 would stay red on a correct build. The both rule also finds a maths gap on 96 % of seeds and a language gap on 75 %, and REQ-6602 asks for a weak side to show as clearly on either side. Under the either rule the two lines find their gaps at 95 % and 96 %.

The either rule costs a false language line on 4.1 % of seeds for a pure maths gap, where the both rule costs 0.4 %. Check 5's bar of at most 4 of 20 still passes 99.9 % of seed sets at 4.1 %. A drop on one side alone is still a language effect: Dutch below Russian means the same sums fall in the other language, and Dutch below Dutch after the words means explaining the words raised the share.

This decision can't be approved over REQ-6636 as it stands. The orchestrator writes the replacement for the owner, in this text: "The language line MUST appear only when the 95 % Newcombe hybrid score interval of at least one of its two differences excludes zero with the Dutch share the lower one: Dutch below Russian, or Dutch below Dutch after the words." If the owner keeps REQ-6636 instead, check 5's bars become 11 of 20 for the language student's own line and 8 of 20 for the both-gaps student. Those are the highest counts a working report passes on at least 97 % of seed sets at 75.5 % and 58.3 %. REQ-6670 and REQ-6672 are then the requirements to replace.

### Check 5 counts both lines on one seed's report, against a rate the report's own functions measure

Check 5 joins ADR-0190's group 3 and is required from the backlog stage that builds the Dutch probe, so REQ-6682 keeps it out of the MVP. It runs four synthetic students over 20 seeds each (REQ-6668). Their accuracy varies by presentation (REQ-6666), which none of ADR-0190's ten profiles does, so they are new students in `tests/simulation/probe-students.ts`. The students, their rates and the 20 observations on each of the Russian, Dutch and Dutch-after-words presentations are REQ-6668's. Each seed runs the Director, the engine and the report over simulated game days, with the student playing every game day and answering each probe letter at its presentation's rate. I chose seeds 1 to 20 per student, fixed in the check's code, and a change of seeds counts as a change of the check that needs a decision. With fixed seeds a build passes or fails the same way every time, and seeds changed until the check passes would make it a test of the seeds.

This is how check 5 measures a line on a seed, which settles REQ-6672's open finding. It reads the report `report_cache` holds at the first checkpoint, the first rebuild at which the `bare`, `ru`, `nl` and `nl_after_words` cells each hold at least 20 graded first attempts. The run goes on past the first phase's close when it has to, because ADR-0430 closes that phase on the three text cells alone, and a family that puts `bare` after the `nl` pair may not have shown it yet. REQ-6668 lets bare follow the probe's own schedule, and it still does: the check only waits for it. It counts the language line when the language contrast shows a line there and the maths line likewise. A seed counts for the both-gaps bar only when both lines stand on that one report. The report the parent would read at that moment is the report the check reads, so the joint count carries whatever correlation the shared Russian share creates. In my simulation that correlation is small and negative: 84.0 % of seeds show both lines, against 84.5 % if the two lines were independent.

The bars:

| Student | Passes when | Pass chance for a working report on a fixed set of 20 seeds |
| --- | --- | --- |
| Maths gap | maths line on at least 15, language line on at most 4 | 99.9 % |
| Language gap | language line on at least 15, maths line on at most 4 | 99.95 % |
| No gap | at most 4 seeds showing any line | above 99.99 % |
| Both gaps | both lines on the same seed on at least 14 | 97.1 % |

The whole check passes a working report on 96.9 % of seed sets, from 100,000 simulated sets. I chose 14 for the both-gaps bar, where REQ-6672 says 15, because at a joint rate of 0.840 the bar of 15 passes only 91.4 % of seed sets, and REQ-6672's own finding asks for the count that passes 97 %. The replacement text for REQ-6672 is: "Build check 5 MUST pass only when the student with both gaps gets both the language line and the maths line on the same seed on at least 14 of 20 seeds." A both-gaps count of 14 still separates that student from the single-gap ones, which show both lines on at most 3.5 % of seeds.

The bars need bare at 20 as well, because the maths line pools bare with Russian. At 10 bare observations the maths line falls to 86.5 % and the joint rate to 74.6 %, and the bar of 14 would pass only 77 % of seed sets. A seed on which the 28-game-day limit closes the first phase goes on at ADR-0430's 2 families until the four cells hold 20. I estimate the first phase at about 20 to 28 game days at ADR-0430's 3 to 5 letters a day, so some seeds will reach the limit, and check 5 reports each seed's game days so the share is measured. Check 5 fails a seed as `check5_phase_short` only when the four cells still don't hold 20 after 120 simulated game days, which I chose because at ADR-0430's 2 letters a day after the first phase, 120 game days leave room for about 180 letters beyond the phase's limit, far more than the 80 a seed needs.

The rate itself is measured by the report's code, not taken from this record. `npm run verify -- --check5-rates` takes the counts of shown letters each of check 5's 80 seeds reached at its read, draws 500 fresh answer sets at each seed's counts, 10,000 for each student over its 20 seeds, calls the same line functions the report calls, and writes each student's own, other, both and either rates with their 95 % Wilson intervals to `artifacts/check5-rates.json`. It runs without the Director, so it takes seconds, and it runs at the probe stage's acceptance and after any change to `src/parent/contrasts.ts` or `src/parent/intervals.ts`. I chose 95 % as the floor for a working report on a fixed seed set, below the 97 % the bar was chosen for, because a measured rate carries its own sampling error and a floor at 97 % would sit on this record's own estimate of 0.840. The bar of 14 passes 95.3 % at a joint rate of 0.825, so the bar holds while the measured joint rate for the both-gaps student, the point estimate over its 10,000 draws, is at least 0.825. At 10,000 draws that estimate's standard error is about 0.004.

A green check 5 shows that the report can tell apart what the generator encodes. It can't show what her gap is, because the same agent writes the students and the code, as ADR-0190's strongest objection says.

### The four states map onto three node labels and one reading of the profile

The four states the addendum says the school mixes map as follows:

| Addendum's state | Carrier in the report |
| --- | --- |
| doesn't know | «Пока не освоено» (not mastered yet) on a node that isn't «на пороге» |
| knows, not automatic | «Понимает, нужна скорость» (understands, needs speed), and for a fact, ADR-0290's fact state |
| knows with a little help | ADR-0220's node label «на пороге» (on the threshold) |
| understands beyond the standard format | no node label; the profile's transfer and conceptual-understanding dimensions and ADR-0180's ceiling above 1S |

The fourth state gets no node label (REQ-6648), because it can hold together with any of the other three, and a label from one form's rule would let a new stream decide a node's state, which ADR-0210 forbids until activation. «На пороге» names the node label alone and never a class of attempts (REQ-6650). The weekly breakdown calls its rung-1 bin «хватило первой ступени» (rung 1 was enough), and its other bins keep RES-4220's names. A group 1 check fails when the Russian string file holds «на пороге» under any key other than ADR-0220's node label.

### The report can't be curated, and every exclusion shows its right and wrong split

The report offers no setting, filter or mode that hides a node, a dimension or a figure (REQ-6606). The query schemas of the `/api/parent/report*` routes are strict and accept only ADR-0180's `at=` and a page number, so a route test that sends any other parameter gets 400. A Playwright test counts the nodes on the graph map and finds every node of the graph.

After the MVP the summary shows how many attempts the parent excluded, with how many were right and how many wrong (REQ-6610). The node card lists each excluded attempt struck through, with its source, the Parent Room or the sandbox (REQ-6612). Both read the projection `excluded_attempts`, which joins every `item_excluded` event, version 2 with its `source`, to the attempts it removed. A sandbox exclusion by template version and parameter hash removes each of her attempts on that task, so each one counts. Exclusion is the one path by which an approved rule removes evidence, and the split shows a one-sided exclusion without taking away the parent's right to exclude an ambiguous task.

When the PDF snapshot of ADR-0180 comes, it prints every report screen and every node's card, or it prints nothing (REQ-6608). The print stylesheet has no per-screen switch, and a test counts the printed sections against the screens and nodes. The export for the school stays as ADR-0310 builds it, holding school data only.

After the MVP, beside the nodes whose errors all carry «возможна языковая причина» (possibly a language cause), the summary lists under «ошибки есть и без трудных слов» (errors also without hard words) each node with an error on a bare task, or after she opened the term's explanation (REQ-6614). I chose ADR-0290's `format: "bare"` as the test for a bare task, and the same attempts the language-cause list reads, so the two lists sit side by side over one set of attempts.

### Every new event type and field has one owner

The addendum's four event types each get one owning decision, the one whose item writes them, because ADR-0210's group 1 check fails a type with no approved owner:

| Event type | Owner | From |
| --- | --- | --- |
| `retention_check_planned` | ADR-0400 | the release that brings retention checks (REQ-6646) |
| `probe_family_created` | ADR-0430 | the release that brings the Dutch probe (REQ-6690) |
| `hypothesis_recorded`, `hypothesis_updated` | ADR-0450 | the first version (REQ-6652) |

The item decisions add their own further types under the same rule, such as ADR-0400's `retention_check_cancelled`, and own their payloads.

`item_shown`'s `purpose` stays the string `src/shared/events.ts` already types, and the Director writes `retention_check` for a retention check (ADR-0400) and `nl_probe` for a probe letter (ADR-0430) (REQ-6654). A new value in a string field needs no payload version. `item_shown` gains the field `probe`, the presentation the engine built, whose values ADR-0430 defines (REQ-6656). The presentation is chosen at show time and exists nowhere else. The days since the last exposure are never stored on `item_shown`; the retention projection computes them from two logged dates (REQ-6658). `firstExposure` is likewise the projection `first_exposures` of ADR-0410, since ADR-0210 logs each fact in one place.

`probe` joins `item_shown` in the release that brings the probe. When that code lands, the log will already hold version 2 events from the MVP, so `probe` arrives as version 3 with an upcaster from version 2 that leaves it absent (REQ-6660). If no version 2 event is stored by then, it joins version 2 as an optional field in place. A replay test runs stored version 1 and version 2 events through the upcasters and finds every projection unchanged.

Templates gain `contexts`, owned by ADR-0410, and a probe template gains `probeFamily`, owned by ADR-0430. The template schema refuses a template with `probe: true` and no `probeFamily` (REQ-6664). Templates gain no `formats` list, because ADR-0290's `format` already holds the format, as RES-4230 decided. `solution_shown` and `hint_shown` already carry `itemId` in version 1 of `src/shared/events.ts`, which I read on 2026-09-28, and ADR-0400 keeps it in `hint_shown` version 2.

### The MVP gains only the parts that shape the log

The first version holds REQ-5076's list and adds addendum 2's parts that shape the log (REQ-6676):

- `hypothesis_recorded`, `hypothesis_updated` and the Parent Room form that records a hypothesis and what would confirm and refute it, as text with no status (ADR-0450);
- the context tag on every accepted frame, `contexts` on templates, the Director's hold on first encounters and the projection `first_exposures` (ADR-0410);
- `itemId` on `solution_shown` and `hint_shown` (ADR-0400);
- the optional `categories` field on the Cito result form (ADR-0420).

Each keeps a fact a later report can't rebuild. A hypothesis written during the MVP keeps its date and written prediction, and gets a computed status only once its criteria are rewritten as conditions, which opens its judging window then. Report v1 keeps its eight screens as ADR-0180 approved them.

The first version holds nothing else of addendum 2 (REQ-6682): the profile, the weekly breakdown and trajectories, retention checks and their Director rules, the transfer report, the quadrants, the Dutch probe, the extension of «Сплети загадку» (Weave a riddle), hypothesis statuses and build checks 1 to 5. The scope guard of ADR-0190 gains the traces those parts leave. This record adds five: a schema for `retention_check_planned`, a schema for `probe_family_created`, a template with `probeFamily`, and the strings `retention_check` and `nl_probe` in `src/engine/`, each a trace of its own. Each item decision adds the traces of its own screens and stores in its own record, such as ADR-0390's `/api/parent/profile` routes, ADR-0420's `/api/parent/report/home-and-school` and ADR-0450's store of hypothesis labels, because only the item's decision names them.

No Dutch probe text is built before the owner amends the rule in `CLAUDE.md` that player text is Russian only (REQ-6684). Only the owner changes that file, and its one exception is the bridge's 30 to 50 keywords. The scope guard already fails on `content/i18n/nl.json` and any `*.nl.*` file, and the probe's Dutch texts are that kind of file, so the guard's Dutch trace leaves `verify/scope-guard.json` only in the change that follows the owner's amendment. The probe's texts are written under ADR-0430's offline role on the offline key with a `ContentRequest`, which has no field for any of her data (REQ-6688).

Nothing addendum 2 adds leaves the Mac (REQ-6686). The profile, the probe results and every other figure stay in the Parent Room. They aren't among the five kinds of data ADR-0210's list lets out, and no request class has a field for them. ADR-0450 keeps the hypotheses at home.

### What works once this is accepted, and what doesn't yet

Once this is accepted, the building agent can build the MVP's log-shaping parts as soon as ADR-0410, ADR-0420 and ADR-0450 are approved. The owner check knows the four new types, and the scope guard fails on any deferred part of addendum 2. The interval module, the floor registry and the contrast list can exist before any screen that uses them, and report v1 behaves exactly as today.

The addendum's report parts don't work yet: each waits for its own decision, ADR-0390 to ADR-0450, and for the backlog stage that builds it. The language and maths lines have no data until the probe exists, and the probe waits for the owner's amendment to `CLAUDE.md`. Check 5 waits for the probe, and for REQ-6636 and REQ-6672 to be replaced as set out above. Removing this decision's increment leaves the approved game as it was, apart from addendum 2, which then has no carrier.

## Why

The owner made falsifiability a required property of the report, and RES-4200 found four ways the approved record breaks it. An exclusion can remove wrong answers with no trace. The summary looks for a language cause and never for evidence against one. The uncertainty is an entropy number the parent can't recompute. And eight 80 % intervals shown side by side miss at least once about 83 % of the time (RES-4200). The count and the Wilson interval let the parent recompute each figure from the attempts the node card lists. Wilson is one of the two intervals Brown, Cai and DasGupta recommend at small counts, and its closed form gives the same number on every recompute.

The fixed list of contrasts and the 95 % trigger exist because an analysis chosen after the data is seen can explain any pattern, which is Gelman and Loken's forking paths (RES-4200). A report that turned every interval clearing a threshold into a line would manufacture strengths and weaknesses at a known rate. Wording each line as a check keeps it a question the next data can answer.

The four-state mapping follows RES-4200's finding that the states aren't one scale: three exclude each other on a node, and the fourth holds beside any of them. One owner per event type comes from ADR-0210's rule and its group 1 check. The MVP takes only the log-shaping parts because a hypothesis written after the MVP can't be judged on the MVP's data, and a first encounter spent in training can't be recovered. Every other part derives from events the MVP logs (RES-4200).

Check 5 exists because a report that sees a gap everywhere passes the addendum's two students, and only a student with no gap tests that no gap gives no finding (RES-4200). I set how it counts both lines because REQ-6672's finding showed that the joint rate decides the bar, and RES-4200 reported the two rates apart. Rerunning the simulation to get the joint rate showed that REQ-6636's rule and RES-4200's rates don't match, which is why this record asks for REQ-6636 to be replaced.

The strongest objection is that the report will say «пока не ясно» on almost every gap the parent cares about. At 20 observations a presentation, the 95 % trigger finds a 45-point gap reliably, and a 35-point gap on only about 81 % of seeds (RES-4200). The addendum's own example is a 20-point gap, which the first phase can't resolve at 95 %. A parent who wants to know "language or maths" may read months of «пока не ясно» and decide the tool can't answer. I keep the rule, because an 80 % trigger would show a chance line on about one contrast in five, and the addendum's falsifiability exists to prevent exactly those findings. The parent can still read every 80 % interval, and her own hypotheses carry a verdict once their conditions are met. The reversal condition below watches for the case where the silence costs the report its reader.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep report v1 and its entropy uncertainty for the new parts | no rework; the Director's uncertainty and the report's stay one number | the parent can't check the figure, the language search stays one-sided, exclusions stay invisible, and the owner made falsifiability required |
| Intervals everywhere, as the addendum writes, with a line wherever an 80 % interval clears a threshold | the fullest display; every figure speaks | across eight dimensions and dozens of nodes, chance alone draws a line on about one comparison in five, so the report still manufactures findings (RES-4200) |
| A fully Bayesian model of the profile, with posterior intervals from one joint fit | uses all the evidence at once and shrinks thin cells | the parent can't recompute it, one child's data may not identify it, and ADR-0180 prefers rules she can check |
| Keep REQ-6636's both-differences rule and lower check 5's bars to 11 and 8 of 20 | a language line that needs both a drop and a recovery, with a 0.4 % false line on a maths gap | it finds a language gap on 75 % of seeds and a maths gap on 96 %, so the weak side doesn't show as clearly on both sides (REQ-6602), and a both-gaps bar of 8 of 20 tests little |
| Keep the both-gaps bar at 15 of 20 under the either rule | the bar REQ-6672 wrote | a working report fails it on 8.6 % of seed sets, and with fixed seeds such a failure repeats on every build |
| Add the whole addendum to the MVP | the profile and the probe from the first day | the probe needs Dutch text the owner hasn't allowed, the quadrants need school snapshots, and the MVP already holds addendum 1's eleven items |

## What it costs

The building agent pays an interval module with its reference table, a floor registry, a contrast list with its file and check, and a string rule. It also pays the exclusion projection, the counter-list in the summary, check 5's students and the rate mode. None of it is in the MVP apart from the registry checks and the scope-guard traces, which are small.

The parent pays in patience. The lines read «пока не ясно» for weeks at the probe's volumes, and the strongest objection under Why weighs that. The parent also pays in false language lines: the either rule shows one on 4.1 % of phases for a pure maths gap, where the both rule shows 0.4 %, and on 1.5 % with no gap, where the both rule shows 0.2 %. The parent gains no new notice, queue or approval from this record. The hypothesis form is optional and asks nothing.

The owner pays two things. The owner approves two replacement requirements before check 5 can be built, and rewords the vision's goal. The owner also amends `CLAUDE.md` before the probe, if the owner wants the probe at all.

The interruption budget for the parent is zero new notices: no line, lesson, floor or check here pushes anything to the parent or the phone. The parent is never needed in real time. Over two weeks without the parent, play goes on and nothing is lost. An unwritten hypothesis only means no verdict later, and nothing piles up.

The ceilings on what accumulates:

- the contrast list holds exactly the entries `verify/contrasts.json` names, and the build fails on one more;
- the excluded-attempt list on a node card pages at ADR-0180's 50 rows;
- the interval reference table is fixed at counts up to 60 and grows only with a decision;
- `artifacts/check5-rates.json` is one file overwritten on each run, inside ADR-0190's retention of the last 20 reports;
- event types with no approved owner stay at zero, and the build fails on the first.

The security boundary protects her results and the parent's hypotheses. The threats, most likely first:

1. A later change adds a report figure or a probe result to a model request. No request class has a field for one, and a test searches every request schema for a field that could hold a share, a count or a hypothesis.
2. The probe's text job receives her data. The job uses `ContentRequest`, whose strict schema refuses any field for her, and ADR-0430's test sends one.
3. A PDF snapshot leaves the Mac with the report. The export stays Mac-only under ADR-0180, and the snapshot adds no route.

Failure states, each with its next step and one audience:

| State | Next step | Audience |
| --- | --- | --- |
| `too_little_data`: a figure below its measure's floor | shows «мало данных» with the count; feeds nothing | the parent, on the screen |
| `not_clear_yet`: a contrast's 95 % interval holds zero or its threshold | shows «пока не ясно» | the parent, on the screen |
| `measure_floor_missing`, `contrast_not_declared`, `interval_reference_mismatch`, `threshold_label_reused`, `check_text_names_lesson` | the build fails and names the case | the building agent |
| `check5_bar_missed`: a bar fails on the fixed seeds | the build fails; the agent runs `--check5-rates` and writes the measured rates into the stage's review record, and when they are at or above this record's, the owner approves a new seed set in a decision | the building agent, then the owner |
| `check5_phase_short`: a seed's four cells don't hold 20 after 120 simulated game days | the build fails and names the seed and presentation | the building agent |
| `check5_rate_low`: the measured joint rate for the both-gaps student falls below 0.825 | the bar reopens with the owner | the owner, in the stage's review record |
| `event_type_unowned`, `scope_guard_hit` | ADR-0210's and ADR-0190's states | the building agent |

`check5_bar_missed` with rates at or above this record's and `check5_bar_missed` from a broken report look the same to the build on purpose: the build can't tell them apart, and only the measured rates can. The player sees none of these states.

## What would reverse it

- If the measured joint rate of the both-gaps student falls below 0.825, the bar of 14 passes fewer than 95 % of seed sets and is reopened.
- If the owner keeps REQ-6636, the language line needs both differences, and check 5's bars become 11 and 8 of 20 as set out under Decision.
- If, 60 game days after the probe's first phase ends, every contrast still reads «пока не ясно» and the parent has written no hypothesis, the report has lost its reader to the 95 % trigger. The trigger level and the phase volume are then reopened with the owner.
- If the parent excludes more than 10 % of a month's attempts and the excluded ones are right more often than the rest by a margin whose 95 % Newcombe interval excludes zero, exclusion is removing good evidence, and the exclusion rule is reopened. I chose 10 % because at about 30 graded tasks a day it is about 90 exclusions a month, while ADR-0130 checks every frame before she sees it, so an ambiguous task should be rare. I chose the Newcombe test so that the condition uses the report's own interval.
- If the owner says the Dutch probe won't happen, the language line has no data, and the fixed list is reopened for a Russian-only contrast.

The premortem, written as though it had happened. At the first probe stage check 5 went red on every build. The agent had built the language line from REQ-6636 as approved while the replacement waited in the owner's queue, and the both-gaps student showed both lines on 11 of 20 seeds. Two weeks later a reviewer found `probe` stored in `item_shown` version 2 alongside MVP events without it, so the replay test passed only because nobody had written a version 3. On the same day the parent's summary showed 40 exclusions, 38 of them right answers, from a sandbox exclusion by template version that had swept up a week of her work on one template. The replacement text in this record, the version 3 rule and the right and wrong split exist for these three.

## Consequences

- ADR-0180's summary and node card gain the exclusion trail and the counter-list after the MVP, and its label check gains the `parent.check.*` rule.
- ADR-0190's group 1 gains the floor registry check, the contrast list check, the «на пороге» string check and the scope guard's new traces. Group 2 gains the interval reference test, and group 3 gains check 5 from the probe's stage.
- ADR-0210's owner table gains the four types.
- `src/parent/intervals.ts`, `src/parent/measures.ts`, `src/parent/contrasts.ts`, `verify/contrasts.json`, `tests/reference/intervals.json` and `tests/simulation/probe-students.ts` are created, the last with the probe's stage.
- Each item decision, ADR-0390 to ADR-0450, cites this record for intervals, floors, lines, owners and scope, and declares its measures in the registry.
- The owner rewords the goal in `project/vision.md` to breaking her maths results into their parts and finding the boundary of her independent work, with the VWO target kept, as RES-4200 conclusion 1 asks.
- The orchestrator writes the replacement requirements for REQ-6636 and REQ-6672 in the texts this record gives, for the owner to approve with it.

## Amends

- ADR-0020: the `item_shown` catalogue row "ADR-0070 adds `purpose`, `flowSlot` and `why`" gains "and the purposes `retention_check` (ADR-0400) and `nl_probe` (ADR-0430), and ADR-0430 adds `probe` in payload version 3".
- ADR-0180: the Summary row gains, after the MVP, "the count of excluded attempts with how many were right and how many wrong; the nodes under «ошибки есть и без трудных слов»".
- ADR-0180: the Node card row gains, after the MVP, "each excluded attempt struck through with its source".
- ADR-0180: "a PDF snapshot made through the browser's print from a print stylesheet of the report screens" becomes "a PDF snapshot of every report screen and every node's card, or none, made through the browser's print".
- ADR-0180: "The report builds no lesson plan: no screen orders topics or proposes dates or exercises" gains "and every line the report draws on its own comes from ADR-0380's fixed list and reads «что проверить»".
- ADR-0190: the group 3 row gains "ADR-0380's check 5, required from the stage that builds the Dutch probe".
- ADR-0190: the MVP contents list gains REQ-6676's parts, the deferred list gains REQ-6682's, and the scope guard's traces gain those ADR-0380 names.
- ADR-0210: the owner table gains "`retention_check_planned` | ADR-0400", "`probe_family_created` | ADR-0430" and "`hypothesis_recorded`, `hypothesis_updated` | ADR-0450".
- SPC-0020: "`item_shown`, `attempt_submitted` and `verdict` each have one payload version 2" gains "and `item_shown` gains version 3 with `probe` (ADR-0430), whose upcaster from version 2 leaves it absent".
- SPC-0180: "a PDF snapshot of the report, made through the browser's print from a print stylesheet of the report screens" becomes "a PDF snapshot of every report screen and every node's card, or none".
- SPC-0190: the first-version list, the deferred list and the scope guard's traces change as the ADR-0190 lines above say, and group 3 gains check 5.

## How I will know it was realised

1. The interval test matches `tests/reference/intervals.json` at every count from 0 of 1 to 60 of 60 within 0.0005, and a search finds no other statistics import in `src/parent/`.
2. The floor check fails on a fixture measure registered with no floor, and a property test finds no line, quadrant, profile line or status from any measure one count below its floor.
3. The contrast check fails when a fixture adds a contrast to `src/parent/contrasts.ts` without a line in `verify/contrasts.json`.
4. A report test on fixed counts shows the language line at Russian 18 of 20 against Dutch 9 of 20 with Dutch after the words at 11 of 20, and «пока не ясно» with Russian and Dutch after the words at 15 of 20 and Dutch at 12 of 20. It shows the language line at Russian 13 of 20, Dutch 9 of 20 and Dutch after the words 18 of 20, where only the second difference clears. It shows the maths line at 22 of 40, «пока не ясно» at 30 of 40, and neither line nor «пока не ясно» at 38 of 40.
5. The string check fails on a fixture `parent.check.*` value holding «урок», «занятия» or a date, and on «на пороге» under a key other than ADR-0220's node label.
6. A route test sends a filter or hide parameter to each `/api/parent/report*` route and gets 400, and the graph map shows every node of the graph.
7. After the MVP, a report test on a log with 6 excluded attempts, 4 right and 2 wrong, shows "6, 4 right, 2 wrong" in the summary and the 6 struck through on their node cards, sandbox ones marked as such.
8. The printed PDF holds one section for each report screen and each node, and a test fails the print when one is missing.
9. A schema test finds `retention_check_planned`, `probe_family_created`, `hypothesis_recorded` and `hypothesis_updated` owned as the table above says, and the owner check fails while their owner is a draft.
10. A replay of stored `item_shown` version 1 and version 2 events through the upcasters gives the same projections before and after version 3 exists, and a strict-schema test refuses `daysSinceLastExposure` and `firstExposure` on `item_shown`.
11. At stage 0.3 the scope guard passes on the MVP tree and fails on each of the five fixture traces this record names.
12. At the probe's stage, check 5 passes on its fixed seeds, records 20 or more observations on all four presentations for every seed with its game days, and `--check5-rates` reports a both-gaps joint rate at or above 0.825.
13. A test searches every model request schema and finds no field that can carry a report figure, a probe result or a hypothesis.

## What this does not settle

- The profile, its dimensions, windows and change lines: ADR-0390.
- The weekly breakdown, the trajectory and the retention checks: ADR-0400.
- Transfer, the context tags and the hold on first encounters: ADR-0410.
- The quadrants and the Cito form's `categories`: ADR-0420.
- The probe's presentations, schedule, letters, text roles and the values of `probe`: ADR-0430.
- The riddle extension: ADR-0440.
- Hypotheses, their conditions, labels, holds and the numeric conditions REQ-7362 asks for: ADR-0450.
- The wording of every line and label the parent reads, which the parent judges at each stage's acceptance.
- Whether the owner allows Dutch probe text at all: the owner's amendment to `CLAUDE.md`.

## Open review findings

One agent review ran on 2026-09-28. I fixed nine of its ten findings: the phase check 5 reads, the phase the lines read, the 0.825 floor, the Newcombe reference, the «заняти» stem, the contrast list's wording, the parent's cost of false lines, the reason for the exclusion condition and the missing «пока не ясно» fixture. One finding I kept open: the reviewer asked for the rerun of RES-4200's simulation to live in a research record, or an addendum to RES-4200, with its script. I wrote this decision alone and left research records untouched, so the rerun's date, library, seeds and draw counts sit in the decision where it uses them. The replacement requirements for REQ-6636 and REQ-6672 then need a research record to elaborate, and the orchestrator decides whether RES-4200 gains an addendum or a new record carries the rerun. The fixes haven't had a second review.

A second agent review ran on 2026-09-28. I fixed its findings on repeated looks, with the three checkpoints; the draw count and the value compared with 0.825; the next step after `check5_bar_missed` on unlucky seeds; the language contrast's states short of a line; the fixture for the second difference; the reference table's range and tolerance; the 120-day cap's reason; and the no-gap bar's wording. These fixes haven't been reviewed, as the method's bound of two rounds sets. Four findings stay open. The rerun of RES-4200's simulation still needs a research record or an addendum to RES-4200 with its script, as the first round also asked. The 60-game-day wait in the reversal condition is my judgement of two school months, with no source. The replacement text for REQ-6668, if the orchestrator writes one, should say that bare also reaches 20 before check 5 reads. The Alternatives table has no row for keeping 95 % and raising the probe's volume, which the reversal condition already names as the response.

Amended by ADR-0460, approved on 2026-09-29, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
