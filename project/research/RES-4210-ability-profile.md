---
id: RES-4210
artifact: research
status: approved
revised: 2026-09-28
elaborates: RES-2300
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The ability profile fits the approved report as a screen after the MVP, built from eight task families with Wilson intervals over 28 game days, and its bars describe her against herself more reliably than against each other

## Summary

The owner's addendum 2 of 2026-09-28 makes an ability profile the first section of the parent's report: eight dimensions, each computed from its own observation streams with a count and an 80 % interval, never summed into one number, drawn as horizontal bars with the dynamics over 4 weeks, and never shown to the player. The approved record already logs almost everything the profile reads, so the profile adds no field to the MVP log. It waits until after the MVP, because the approved report v1 has exactly nine screens and defers every dynamics screen.

The addendum assumes each bar measures an ability. Each bar measures the share of right answers on the tasks the Director chose for her, and the Director keeps her success near 70 to 80 %. So two bars can differ because their tasks differ in difficulty, not because she does. The profile is therefore honest about change over time and weaker as a comparison between bars. The published work on subscores warns the same way: a subscore is worth reporting only when it is reliable and holds information the other scores don't. With one child the usual test for that can't be computed at all.

The profile conflicts with the approved record in five places. Every dynamics view may use only unassisted first attempts from blocks, probes and review. Plan labels feed no measure (ADR-0270). A Keeper's puzzle measures nothing and reads as a reserve, not an assessment (ADR-0280). The approved uncertainty is an entropy, not an interval (ADR-0060). And the home scale gives one overall number (ADR-0290).

Research decided twelve questions on 2026-09-28: the scope, the screen, the interval method, the «мало данных» (too little data) rule, the window and its dynamics, one dimension for each observation, the plan labels, the puzzles, pooling inside a dimension, the sparse bars, the language bar and the wording. I cover addendum 2 item 2 and its build check 3. Retention (item 3), transfer (item 4), the Dutch probe (item 6) and the falsifiability rules of item 1 belong to their own records; this one only reads what they produce.

## The question

What must the game, its log and the approved record hold so that the parent reads eight separate dimensions of her maths, each with its evidence and its uncertainty, and the player never sees them? The owner's addendum 2 is the instruction, and it outranks the approved record where they disagree.

The assumption behind the question is that a share of right answers in a family of tasks measures an ability, so that eight families give eight abilities that can be set side by side. Two facts in the approved record challenge it. First, the Director picks tasks at her level: it holds each session's success share between 0.65 and 0.85, and the Guardian's ladder sets most word problems at k or k + 1 steps (ADR-0070, RES-4040). A share over tasks chosen that way drifts towards the corridor whatever her level, so a low bar can mean the Director set that family's tasks harder, and not that she is weaker in it. Second, the eight families don't share a scale: a fact at 3 seconds and a four-step word problem aren't points on one ruler. Both facts hold for every option below, so the question becomes what the bars can honestly claim, and not only how to compute them.

## Method

On 2026-09-28 I read the owner's addendum 2 in Russian: its list of items, item 1 on the goal and falsifiability, item 2 in full, items 3, 4, 6 and 7 where the profile names them as sources, the event list, the report list and the build checks.

At commit 89d15d6 I ran `paw find` for "parent report", "profile", "interval", "credible interval", "on her own", "label", "four weeks", "dimension", "automaticity", "clock", "sequence", "home scale", "dynamics" and "nine screens". I read RES-2300 whole, ADR-0180 whole and SPC-0180's sections on how the report is computed, its screens, the summary and node card, the matrix and the dynamics views. I read ADR-0060's sections on the two beta estimates and on uncertainty, and SPC-0060's section on the streams of new forms. I searched ADR-0230, ADR-0240, ADR-0270, ADR-0280, ADR-0290 and ADR-0300 for what each stream feeds and what the report shows, and read the matching passages: the composing stream, the `estimate` stream, the plan label, the puzzles' report section, the fact states, careless errors, the bare and context split, the home scale and the Sources screen. I searched ADR-0070 for the Guardian's ladder, ADR-0190 for the player-screen scan and ADR-0310 for the school export, and read the matching passages. I read RES-4070's list of puzzle themes, RES-0800's row for node S6, RES-4040 as the house style and for the word-problem counts, and ADR-0100's list of what never leaves the Mac. I name approved requirements below by what they say, because a research record cites no requirement.

On the web, on 2026-09-28, I searched for interval estimation for a binomial proportion, for the difference of two proportions and for the added value of subscores. I read the abstract of Brown, Cai and DasGupta (2001) on Project Euclid; the Wharton copy of the full paper refused the connection. I read Feinberg and Wainer (2014) in full. The Wiley page of Newcombe (1998) returned 403, so I read the formula of his hybrid score interval in the arXiv paper 2207.04372, which reproduces it, and record the 1998 paper's own findings only from the search result's summary. I didn't obtain Sinharay (2010) or Haberman (2008); I record their findings only as Feinberg and Wainer report them. I found no study of an ability profile for a single child over time, so the window and the data rule rest on my arithmetic below.

## Findings

### The addendum fixes eight dimensions, their sources, the bars and the rule that the player never sees them

The owner's addendum 2, item 2, read 2026-09-28, replaces "counts well or badly" and a single rating with eight dimensions. Each is computed from its own observation streams with a count and an interval, and they are never reduced to one number. The sources it names are these.

| Dimension | Sources the addendum names |
| --- | --- |
| Basic facts | share of facts in «автоматизм» (automatic), median time, dynamics |
| Computational accuracy | unassisted first attempts on bare tasks of mastered nodes; «промахи на освоенном» (slips on mastered material) |
| Conceptual understanding | «Сплети загадку» (composing), the estimate whatever the exact answer, «Нельзя узнать» (can't be known) and surplus data |
| Building a model | the model choice, the plan, step input, composing |
| Transfer | first meetings with something new (item 4) |
| Finding patterns | the puzzle themes patterns, working backwards and enumeration; sequence subtypes |
| Retention | confirmed retention after an interval (item 3) |
| Language and format | the gap across bare tasks, Russian word problems, Dutch context problems, the same after the words are explained, and Cito-format sources (item 6) |

The bars run horizontally with their intervals and no total, with the dynamics over 4 weeks beside them. Under each bar sit one line "what this means" and a link to the tasks it was computed from. The profile isn't shown to the player and doesn't become a label. Item 1 adds that every indicator shows its count and an 80 % interval, and one on little data is marked «мало данных» and takes no part in conclusions. Build check 3 reads: each dimension recomputes reproducibly from the log, each has a count and an interval, and no total exists.

### The approved report v1 has nine screens and no dynamics screen until the MVP ends

An approved requirement fixes report v1 at nine screens: the summary, VWO readiness, the graph map, the node card, misconceptions, limits, science, the story book and «Работа с источниками» (Working with sources) (SPC-0180, ADR-0300, read 2026-09-28). SPC-0180 adds that v1 holds no dynamics screen, "home and school" screen or timeline, and RES-2300 moves the dynamics screen after the MVP because two weeks of play would leave it nearly empty. The requirement's own name says it holds until the MVP ends. A profile screen in the MVP breaks the nine-screen rule, and a profile with dynamics is a dynamics view the MVP defers.

### Every dynamics view may read only unassisted first attempts from blocks, probes and review

Three approved rules govern dynamics views (ADR-0180, SPC-0180, read 2026-09-28). Every dynamics view uses only unassisted first attempts from blocks, probes and review; it never shows inferred states; and until Ascents exist it carries «без контрольных прогонов: сравнимость ниже» (no control runs: lower comparability). A time comparison uses one device type, and a comparison across template versions carries «контент изменён» (content changed). The profile's dimensions read Volley facts, which never enter a block or a probe (ADR-0290), and riddles, estimates, plans and retention checks, which aren't block tasks. The first rule, as written, forbids the 4-week dynamics of five of the eight dimensions.

### The approved uncertainty is an entropy scaled by evidence, not an interval

ADR-0060 gives each node estimate `uncertainty = H(pKnow) * 3 / (3 + nEff)`, the binary entropy shrunk by the weighted, forgotten count of observations, and the node card shows it beside the «сама» (on her own) estimate (read 2026-09-28). It has no coverage: nothing says the true value lies inside any range with a stated chance. The two beta estimates for fluency and "with help" start at `α = β = 1` and could give an interval, but the report shows neither as one. The addendum's 80 % interval is therefore new to the record, and it applies to shares over task families, not to BKT node estimates.

### The report already shows most of the profile's parts, scattered over five screens

The approved report already computes, for the MVP (ADR-0180, ADR-0230, ADR-0240, ADR-0270, ADR-0290, SPC-0180, read 2026-09-28):

- the fact states «автоматизм», «вычисляет» (computes) and «не знает» (doesn't know) for 308 facts, with heat maps on the graph map;
- «небрежные ошибки на знакомом» (careless errors on familiar material), the weekly share of wrong first attempts on nodes fluent or stable and on facts automatic at that moment;
- accuracy and fluency by format, bare or context, on the VWO readiness screen;
- the estimate matrix, the line «Может составить задачу» (Can compose a problem), the four counts beside the word-problem matrix, the model and plan crosses, and «Нестандартное мышление» (Non-standard thinking);
- the Sources screen and the bridge stream.

Each part answers its own question on its own screen. None carries an interval, and none sits beside the others. The profile is mainly a new view over projections the MVP already builds, and the parts it can't read yet are those of items 3, 4 and 6.

### Every input the profile reads is already logged or belongs to items 3, 4 and 6

The log records, for each attempt, the template and its version, `item_shown.forms`, the answer, the verdict, the class, the help used, the device type and the times (ADR-0060, ADR-0180, SPC-0060, read 2026-09-28). The model choice and the step rows are logged as RES-4040 records, and `plan_submitted`, `compose_confirmed`, the `estimate` field and `factId` by ADR-0270, ADR-0230, ADR-0240 and ADR-0290. A template declares `format: "bare"` or `"context"` (ADR-0290), and a node's state at any moment is a replay of the log. So a report written after the MVP can rebuild six of the eight dimensions from the MVP's log alone, and the language bar without its Dutch presentations. Transfer needs `firstExposure`, retention needs the retention check and the Dutch presentations need the probe's fields. Those are items 4, 3 and 6, whose records decide which of their fields join the MVP.

### The Director keeps her success near 70 to 80 %, so a bar's share partly measures the Director

The approved selection holds each session's success share between 0.65 and 0.85 and their mean between 0.70 and 0.80 on mixed profiles, as the approved requirements `paw find` returned for "profile" say. The Guardian's ladder sets its first problem of a day at k + 1 steps, where k is the largest T node fluent or stable, and moves between k and k + 2 after that (ADR-0070, RES-4040, read 2026-09-28). A dimension whose tasks come mostly from the frontier, such as model building on Guardian problems, then reads near the corridor whether she holds two steps or four. Dimensions read on mastered material, computational accuracy and basic facts, escape this, because their tasks are review of what she already holds. So the bars are not on one scale: a 90 % fact bar beside a 70 % model bar can mean easier tasks, not a stronger ability. The same bar, read against itself 28 days earlier, compares like with like only as long as the Director's difficulty for that family stays the same, which the step count and the fact threshold let the parent check.

### A subscore is worth reporting only if it is reliable and holds information the others don't

Feinberg and Wainer state two conditions for a subscore: it "must be reliable enough so that those who use it are not chasing noise", and it "must contain information that is not available from the rest of the test" (Educational Measurement: Issues and Practice, 2014, read 2026-09-28). They build on Haberman's (2008) proportional reduction in mean squared error and report that Sinharay (2010) found no subscore with added value in the data he studied; I didn't read either paper, so that finding is unverified here. Both conditions are estimated over a population of test takers. With one child neither reliability nor correlation between dimensions can be estimated, so the profile can't pass or fail Haberman's test. What remains is to show each bar's own uncertainty and to keep one observation from feeding two bars, because a shared observation makes two bars move together and fakes the second condition.

### The Wilson and the equal-tailed Jeffreys intervals are the recommended intervals for a proportion on small counts

Brown, Cai and DasGupta find the standard Wald interval's coverage problems "far more persistent than is appreciated" and recommend "the Wilson interval or the equal-tailed Jeffreys prior interval for small n" (Statistical Science 16(2), 2001, abstract read 2026-09-28). The Wilson interval is closed-form. Jeffreys needs the inverse of the incomplete beta function, which a pure TypeScript function can compute but which the repository has no other use for.

At the addendum's 80 % (z = 1.2816) my calculation of the Wilson interval gives these widths. At 5 right of 10 it runs from 0.31 to 0.69, a width of 0.38. At 10 of 20 it runs from 0.36 to 0.64, a width of 0.28, and at 9 of 10 from 0.72 to 0.97, a width of 0.25. So a count of about 20 near the middle, or about 10 near the ends, is the least that gives a range narrower than 30 percentage points.

### Newcombe's hybrid score interval gives the gap between two shares from their two Wilson intervals

Newcombe (1998) compared eleven methods for the difference between independent proportions and found that a method "combining Wilson score intervals for the two proportions ... performs well, and is readily implemented irrespective of sample size" (search summary of Statistics in Medicine 17(8), read 2026-09-28; the paper's page returned 403). The arXiv paper 2207.04372 gives its bounds. The lower bound is `(p1 - p2) - sqrt((p1 - l1)^2 + (u2 - p2)^2)` and the upper bound `(p1 - p2) + sqrt((u1 - p1)^2 + (p2 - l2)^2)`, where `l` and `u` are each share's Wilson bounds (read 2026-09-28). With the addendum's example, 47 of 50 bare tasks right against 19 of 30 Dutch context problems, the gap is 31 points with an 80 % interval of 19 to 43 points by my calculation. At 18 of 20 against 15 of 20 the interval runs from -1 to 30 points, so the report must not call that gap a finding. An interval at 80 % excludes zero about one time in five when nothing changed, so eight change lines at 80 % show at least one false change in about 83 % of reports, 1 - 0.8^8 with the bars taken as independent; at 97.5 % each, the Bonferroni bound keeps that chance at most 20 %, by my calculation.

### Some dimensions will read «мало данных» for months at the approved counts

The approved record gives about 30 graded tasks a day (ADR-0180) and about 1 to 1.3 word problems a day, all through the Guardian (RES-4040). Over 28 game days of daily play that is about 840 first attempts and 28 to 36 word problems. The arithmetic below is mine, from those counts.

- Basic facts count one observation per distinct fact shown in the window, a success when the fact ends the window in «автоматизм»; the Volley shows dozens of facts a week, so the count runs from dozens up to the 308 facts and fills from the first weeks.
- Computational accuracy, conceptual understanding through the estimate, and the bare side of language and format count one observation per first attempt and get hundreds.
- Model building counts one observation per Guardian problem, about 28 to 36, enough for an interval of about 25 points; a weekly window would hold 7 to 9 and fail the 30-point rule.
- Finding patterns gets S6, one node of 79; spread evenly that is about 11 first attempts in 28 days. At 8 of 11 the 80 % Wilson interval is 33 points wide, already past a 30-point limit. The Director also picks mostly frontier nodes, so S6 comes in a burst while it is on the frontier and returns only as review once mastered, which leaves most windows with fewer.
- Transfer and retention get a few a month by the designs of items 3 and 4.

The surplus and unanswerable streams alone give about 4 in 28 days, so inside conceptual understanding they are swamped by the estimate's counts.

### Plan labels and Keeper's puzzles are approved as measuring nothing

ADR-0270 lets the plan's label reach the log and the report but no credit, outcome or estimate, "because no study RES-4060 found uses card ordering as a measurement". It records that a child can reach `correct` by matching card text to problem text. It reopens the plan cross if `correct` plans are followed by wrong answers no less often than faulty plans once each group holds 10 (read 2026-09-28). ADR-0280 keeps the puzzles in event types the knowledge model never reads. It states that "a puzzle measures nothing", and it places «Нестандартное мышление» beside the ceiling labelled «запас, а не оценка» (a reserve, not an assessment). A puzzle is voluntary, she opens the ones she likes, and she may solve it over days with rungs (ADR-0280, RES-4070, read 2026-09-28). The patterns, working-backwards and enumeration themes the addendum names are three of RES-4070's eleven. Node S6 «Закономерности: числовые, фигурные, точечные; следующий и n-й элемент» (patterns: number, shape and dot patterns; the next and the nth element) is the graph's measured pattern node (RES-0800).

### The home scale gives an overall number, which the profile's rule of no total doesn't reach

ADR-0290's home scale is a Rasch model that "estimates θ for each domain and overall", labelled «домашняя шкала — не балл Cito» (home scale, not a Cito score) and feeding no estimate (read 2026-09-28). Its overall θ is the single rating the addendum wants the profile to replace. The addendum doesn't mention the scale, and the scale answers a different question: how the home picture compares with an entered Cito result. The same scale's item difficulties are the one approved tool that corrects a share for task difficulty, and an approved requirement asks its refit to recover item difficulties within 0.3 logits on simulated pupils before anyone trusts it.

### The approved record already keeps the report from the player and from every model

The player's routes carry schemas with no field for a node state, an estimate, a percentage or a topic name, and ADR-0190's end-to-end scan checks her screens for them, as ADR-0180 records. Every `/api/parent/*` route answers 401 without the PIN's session (ADR-0180, read 2026-09-28). The model gateway never sends reports (ADR-0100), and the school export's code reads only the school values and the Cito results, which a lint check holds (ADR-0310, read 2026-09-28). Every parent label comes from the Russian string file, with «плохо» (bad), «отстаёт» (falls behind) and «невнимательная» (careless) rejected by a check (ADR-0180). A profile built as one more parent projection inherits all of it; a profile that reached a player packet, a Master order or a school export would break it.

### Four ways to build the profile, and each wins at something

| Option | Better at | Case against |
| --- | --- | --- |
| Do nothing: the parent reads the parts the report already shows on five screens | no new screen, rule or check; every part has an approved owner | the parts carry no interval and sit apart, so the parent can't see "facts slow, understanding high" at a glance, which is what the owner asked for |
| Raw shares per dimension with 80 % Wilson intervals, one observation to one dimension, over 28 game days | every figure is a count the parent can redo by hand; closed-form; fits the approved rule that report figures come from checkable rules | the bars aren't on one scale, because the Director sets each family's difficulty, so comparing bars says less than it seems to |
| A Rasch θ per dimension from the home scale's item difficulties, with an interval from its standard error | corrects for difficulty, so bars become comparable and the Director's choices drop out | the difficulties come from an unfitted feature formula until the refit passes; riddles, plans, estimates and gaps aren't scored items; one child's θ isn't checkable by hand |
| Full BKT estimates per dimension, like the node estimates | reuses ADR-0060's machinery, forgetting included | adds a model with parameters nobody fitted for eight families; its entropy gives no interval; a stream outside `admittedForms` can't enter an estimate during the MVP |

Research leads with raw shares and Wilson intervals, because they are the only option whose every number the parent can check against the task list the addendum links under each bar. The case against it is the difficulty confound: a bar can sit low because the Director set that family near her frontier. The profile answers it three ways. It labels each bar with what it counts, not with an ability. It shows the difficulty behind the bars that come from the frontier: the step count for model building, and the fact threshold and device type for facts. And it draws the dynamics as the same family against itself. The Rasch option stays as the upgrade once the home scale's refit passes its accuracy requirement, and the finding above says what would decide it. The evidence gives no reason to abandon the profile: the parts are already built, and an interval on each is cheap and honest.

### Decided on 2026-09-28

The profile is post-MVP work, and item 2 adds no field to the MVP log. The addendum names no stage for the profile, so the nine-screen rule and the addendum don't conflict. The reason is data: MVP acceptance reads about two weeks of play, and the profile needs two windows of 28 game days, so it couldn't fill even one bar's window during the MVP. Every input it reads is already logged or belongs to items 3, 4 and 6, whose records decide their own MVP fields. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

After the MVP the profile is a screen of its own, «Профиль» (Profile), first in the Parent Room's report tabs, and the summary stays as approved. The addendum asks for the profile as the report's first section, and a screen of its own keeps the summary's approved contents whole. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

Each bar's interval is the 80 % Wilson score interval, and a gap between two shares uses Newcombe's hybrid score interval built from the two Wilson intervals. Brown, Cai and DasGupta recommend Wilson for small counts, it is closed-form, and Newcombe's gap interval is made of it, so one family of intervals covers every bar. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

A bar reads «мало данных» when it rests on fewer than 10 observations or its 80 % interval is wider than 30 percentage points, and such a bar shows its count and no value. At 80 % the Wilson interval narrows under 30 points at about 20 observations near a share of 0.5 and at about 10 near the ends. Below 10, one answer moves a share by more than 10 points. A dimension with no stream yet, such as transfer before item 4 is built, reads «нет данных» (no data), so the parent can tell a part not yet built from a part with too few answers. The language gap bar reads «мало данных» when either of its two shares fails this rule and shows its two windows with no change line, since a change in a gap is a difference of two differences that Newcombe's interval doesn't cover. Any other bar's change line appears only when both windows pass the rule, because the addendum keeps a figure on little data out of every conclusion. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

A bar reads the last 28 game days, and its dynamics compares it with the 28 game days before, drawn as a second thin bar with its interval. The change line uses Newcombe's interval at 97.5 %, that is 1 - 0.2 / 8, and not at 80 %. At 80 % a bar with no real change shows a false rise or fall about one time in five, and across eight bars about 83 % of reports would show at least one, by my calculation of 1 - 0.8^8 with the bars taken as independent; at 97.5 % each the chance of any false change across the eight stays at most 20 %. The line says «возможно, выросло» (possibly rose) or «возможно, снизилось» (possibly fell), worded as something to check, when that interval excludes zero, and «без заметного изменения» (no clear change) otherwise. The game day and the dynamics labels stay as approved: «без контрольных прогонов: сравнимость ниже», one device type for a time comparison and «контент изменён» across template versions. The addendum asks for the dynamics over 4 weeks, and a shorter window fails the data rule on model building, which holds 7 to 9 problems a week. A window counted in game days reads no clock on her screens. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

Each observation feeds exactly one dimension, and a versioned content file assigns each stream and template to its dimension. Composing goes to conceptual understanding, where the addendum lists it first and where item 7 places it; model building takes the model choice, the step rows and the plan. Every attempt with a `factId` goes to basic facts alone, so computational accuracy reads bare tasks without one. The language gap bar is the one exception: it is a contrast between two shares, not a share. Both its sides read unassisted first attempts without a `factId` on the nodes that have both formats, in any tested state, so the two sides share nodes and difficulty; on those nodes' fluent or stable moments its bare side reads the same attempts as computational accuracy. A separate bare sample would halve both counts, and the note under the gap bar says that a change in bare accuracy moves both bars. Feinberg and Wainer's second condition fails by construction when one answer moves two bars. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

Plan labels enter the model-building bar only once ADR-0270's own check holds: at least 10 `correct` plans and 10 faulty ones, with wrong answers less often after `correct` plans. Until then the plan count shows under the bar, outside it. ADR-0270 approved the label as measuring nothing until that check, and the profile is a measure. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

The patterns bar reads unassisted first attempts on node S6 alone. Puzzles solved in the patterns, working-backwards and enumeration themes show as a count line under it, labelled «запас, а не оценка» and outside the bar. Puzzles are voluntary, self-selected and solved over days with rungs, and ADR-0280 approved them as measuring nothing. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

Inside a dimension the bar pools the counts of its streams, and the line under it names each stream with its own count and share. Pooling gives one count and one interval as the addendum asks. Naming the streams shows the parent when one stream, such as the estimate in conceptual understanding, supplies most of the count. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

The patterns, transfer and retention bars keep the 28-day window and the data rule, and are expected to read «мало данных» for most of the first months. A fixed note beside them says so, as the approved note beside the unanswerable streams does. A longer window for three bars would give the parent two time scales on one screen, and a bar that fills slowly is the honest reading of few observations. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

The language and format bar is a gap bar centred on zero: the share right on bare tasks minus the share on context presentations, in points with Newcombe's 80 % interval. Each presentation's share is listed with its own interval. In the MVP's data the presentations are bare tasks, Russian context tasks and tasks carrying bridge keywords; the Dutch presentations of item 6 join when that item's record builds them. A share on context problems alone mixes maths with language, and only the gap separates them. The Dutch text beyond the bridge's 30 to 50 keywords conflicts with the rule in `CLAUDE.md` that the player sees Russian only, which only the owner changes, so the bar's Dutch rows wait for that amendment. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

Bars keep the addendum's fixed order and one neutral colour. They carry no word of judgement, no ranking and no comparison with other children. The line under each bar is a string-file template that states what the figure counts, such as «верно 42 из 50 голых примеров на освоенных узлах» (42 of 50 bare tasks on mastered nodes right). A reading of a gap is worded as something to check, as item 1 asks. The approved rule bans judgemental labels, the report has no population data, and a sorted or coloured bar invites the ability label the addendum forbids. Decided on 2026-09-28 by research, on the owner's instruction to process addendum 2 through to the specifications.

## Conclusions

1. The profile must be built after the MVP, as a screen «Профиль» first among the Parent Room's report tabs, because it needs two windows of 28 game days and MVP acceptance reads about two weeks; report v1 keeps its nine screens.
2. Item 2 must add no field to the MVP log. The profile must read only fields the MVP already logs, and the fields of items 3, 4 and 6 as those records decide them.
3. The profile must show exactly eight bars in the addendum's order, with no total, no average of bars, no ranking and no ordering by value.
4. Each bar must show its count and its 80 % Wilson interval. The gap in the language and format bar must use Newcombe's hybrid score interval at 80 %, and each bar's change line must use it at 97.5 %, as conclusion 6 sets.
5. A bar resting on fewer than 10 observations, or whose interval is wider than 30 percentage points, must show «мало данных» with its count and no value. A dimension with no stream yet, such as transfer before item 4 exists, must show «нет данных» (no data). The gap bar must show «мало данных» when either of its shares fails this rule, and must show its two windows with no change line; every other change line must appear only when both windows pass the rule. The patterns, transfer and retention bars must carry a fixed note that they will read «мало данных» for most of the first months.
6. A bar must read the last 28 game days. Its dynamics must show the 28 game days before as a second bar with its interval. The change line must use Newcombe's interval at 97.5 %, so that the chance of any false change across the eight bars stays at most 20 %. It must word a change as something to check, «возможно, выросло» or «возможно, снизилось», and claim one only when that interval excludes zero.
7. The profile's dynamics must carry «без контрольных прогонов: сравнимость ниже» until Ascents exist, compare times on one device type only and carry «контент изменён» when the template versions behind a bar differ between the two windows.
8. Every observation must feed exactly one dimension, through a versioned content file that maps each stream and template to its dimension, and the file's version must be recorded with every computed profile. Every attempt with a `factId` must feed basic facts alone. The language gap bar is the one exception, as a contrast whose bare side can read attempts computational accuracy also reads, and its note must say that a change in bare accuracy moves both bars.
9. The dimensions must read these sources:
   - basic facts: one observation per distinct fact shown in the window, a success when the fact ends the window in «автоматизм», with the median fact time and its device type beside it;
   - computational accuracy: unassisted first attempts without a `factId` on bare tasks of nodes fluent or stable at that moment;
   - conceptual understanding: the estimate whatever the exact answer, composing, and the surplus and unanswerable streams;
   - model building: one observation per Guardian problem, a success when its modelling phase is right: the model choice right, every entered step a correct step, or, once conclusion 10 allows, the plan `correct`; the step count of the problems shows beside the bar;
   - transfer: the first meetings of item 4;
   - finding patterns: node S6;
   - retention: the retention observations of item 3;
   - language and format: the presentations of conclusion 12.
10. Plan labels must stay out of the model-building bar until at least 10 `correct` and 10 faulty plans exist and wrong answers follow `correct` plans less often. Until then the plan count must show under the bar.
11. Keeper's puzzles must stay out of every bar. The count of puzzles solved in the patterns, working-backwards and enumeration themes must show under the patterns bar, labelled «запас, а не оценка».
12. The language and format bar must show the share right on bare tasks minus the share on context presentations, centred on zero, both sides read from unassisted first attempts without a `factId` on the nodes that have both formats, in any tested state, and list each presentation's share with its own interval. The Dutch presentations of item 6 must wait for the owner's amendment of the Russian-only rule in `CLAUDE.md`.
13. Inside a dimension the bar must pool its streams' counts, and the line under it must name each stream with its own count and share.
14. Each bar must carry one line from the Russian string file stating what the figure counts, with no word of judgement. It must link to the list of tasks it was computed from, each shown as the node card shows it. A gap must be worded as something to check.
15. The profile must carry a fixed note that each bar counts tasks the Director chose at her level. The note must say that a bar read against its own earlier window says more than two bars read against each other. It must also say that the interval shows how much a count can say, not a guaranteed 80 % coverage, because pooled streams and tasks at different difficulties break the interval's assumption of one success chance.
16. The profile must be a pure projection over the log, served only through `/api/parent/*` behind the PIN's session. It must never enter a player packet, a Master order, a model request or the school export. ADR-0190's scan of the player's screens must also look for the profile's labels.
17. Build check 3 must recompute the profile from the log under fixed versions and get byte-identical output. It must also find a count and an interval on every bar that shows a value, and find no total anywhere on the screen.
18. The approved rule that every dynamics view uses only unassisted first attempts from blocks, probes and review must be amended through a decision, so that the profile's dynamics reads the unassisted first attempts of its own dimension streams.
19. The profile must not show the home scale's overall θ. A Rasch θ per dimension may replace the raw shares only after the home scale's refit meets its accuracy requirement on simulated pupils, through a new decision.
20. Each approved record below must be corrected by a new record that names what it replaces, because approved records are frozen:
    - ADR-0180 and SPC-0180, on the profile screen after the MVP and the dynamics rule of conclusion 18;
    - ADR-0190, on the scan of conclusion 16;
    - ADR-0270, on plan labels entering a report measure under conclusion 10;
    - ADR-0280, on the puzzle count under the patterns bar under conclusion 11;
    - ADR-0060 and SPC-0060, on the profile as a parent projection outside the knowledge model that reads streams outside `admittedForms` without entering any estimate.

## Sources

- The owner's addendum 2 to the specification, 2026-09-28, read 2026-09-28 - item 1 on falsifiability and the 80 % interval, item 2 in full, items 3, 4, 6 and 7 as the profile's sources, the report list and build check 3.
- `project/research/RES-2300-parent-report.md`, `RES-0800-skill-graph.md`, `RES-4040-surplus-and-missing-data.md`, `RES-4070-keepers-knots-puzzles.md`, read 2026-09-28 at commit 89d15d6 - the report's screens and deferral of dynamics, node S6, the word-problem counts and the puzzle themes.
- `project/adrs/ADR-0060`, `ADR-0070`, `ADR-0100`, `ADR-0180`, `ADR-0190`, `ADR-0310`, `ADR-0230`, `ADR-0240`, `ADR-0270`, `ADR-0280`, `ADR-0290`, `ADR-0300`, read 2026-09-28 at commit 89d15d6 - the uncertainty formula and beta estimates, the Guardian's ladder, what never leaves the Mac, the player-screen scan, the school export's scope, the report and its dynamics rules, the composing and estimate streams, the plan label, the puzzles as a reserve, facts, careless errors, format and the home scale, and the nine screens.
- `project/specs/SPC-0060-knowledge-model-estimates-states-and-streams.md` and `SPC-0180-parent-room-report-limits-and-lessons.md`, read 2026-09-28 at commit 89d15d6 - the streams of new forms, the nine screens, the dynamics views and the report's counts.
- [Brown, Cai and DasGupta, "Interval Estimation for a Binomial Proportion", Statistical Science 16(2), 2001](https://projecteuclid.org/journals/statistical-science/volume-16/issue-2/Interval-Estimation-for-a-Binomial-Proportion/10.1214/ss/1009213286.full), abstract read 2026-09-28 - the Wald interval's poor coverage and the recommendation of Wilson or equal-tailed Jeffreys for small n.
- [Feinberg and Wainer, "A Simple Equation to Predict a Subscore's Value", Educational Measurement: Issues and Practice 33(3), 2014](https://ncme.org/wp-content/uploads/2025/10/Module-38-Subscores-III-Predicting-Subscore-Value.pdf), read in full 2026-09-28 - the two conditions for reporting a subscore, and their report of Haberman (2008) and Sinharay (2010).
- [Newcombe, "Interval estimation for the difference between independent proportions: comparison of eleven methods", Statistics in Medicine 17(8), 1998](https://onlinelibrary.wiley.com/doi/abs/10.1002/%28SICI%291097-0258%2819980430%2917%3A8%3C873%3A%3AAID-SIM779%3E3.0.CO%3B2-I), page returned 403 on 2026-09-28 - its finding recorded from the search summary only.
- [Analysis of two Binomial Proportions in Non-inferiority Confirmatory Trials, arXiv 2207.04372](https://arxiv.org/pdf/2207.04372), read 2026-09-28 - the bounds of Newcombe's hybrid score interval.
