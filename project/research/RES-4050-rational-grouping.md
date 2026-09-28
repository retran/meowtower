---
id: RES-4050
artifact: research
status: approved
revised: 2026-09-28
elaborates: RES-0800
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A tap-to-link step makes a calculation shortcut visible as she marks it when invited, and its evidence stays in a stream outside the knowledge model

## Summary

The owner's addendum 1 of 2026-09-28 adds «Короткая петля» (the short loop): a task shows an expression with a convenient grouping, such as `25 * 37 * 4`, the player links the convenient numbers with taps, then enters the answer. The engine scores the grouping apart from the answer as `optimal`, `valid` or `none`, never as an error, and an optimal grouping with a right answer earns 1 star yarn and a special spell animation. The form can be built without a language model and without a time measure, and it gives the parent evidence a plain answer can't give. The published research sets its limit: children use shortcuts far more often when a task invites them to than on their own, so a linking tool measures what she notices when the task invites her, and the report must say so. Approved records have to change in six places: the task window's list of controls (RES-0100 conclusion 6), what counts as an observation (ADR-0060), the room slot sources and how mental arithmetic picks its nodes (RES-1000 conclusion 1, ADR-0070), the yarn sources (ADR-0140, RES-2100), the attempt event (RES-2200 conclusion 4, SPC-0020) and the MVP scope (RES-0010 conclusion 2, ADR-0190). The minimum of 28 graded first attempts in ADR-0070 and the A13 node of RES-0800 are strained without being contradicted. Four choices are decided on 2026-09-28: the task sits in a room slot, only expressions where every link is admissible enter the form, the forge recipes stay until the weekly yarn is measured, and `optimal` means one full optimal plan. This record covers section 5 of the addendum and its acceptance test 6. It doesn't cover the other twelve sections, apart from where the hint ladder of section 1 or the volley of section 8 touches this form.

## The question

What must hold for the game to show whether the player used a calculation shortcut, score that apart from her answer, reward it without rewarding speed, and keep the knowledge map honest? The owner's addendum 1 of 2026-09-28 sets the form, its scoring, its reward, its stream and its frequency, and where it disagrees with the approved record the addendum holds.

The addendum assumes that a link she taps is the method she calculated with. That assumption is weaker than it looks. A tap records what she marked on the screen, and she can mark `25` and `4` and still multiply `25 * 37` first in her head. The tool also invites the shortcut by being there. Published studies that told children to look for a shortcut raised how often they used one, so a stream fed by an inviting tool counts invited noticing, which is a different thing from what she does unprompted. The findings below keep that distinction, and the conclusions name the measure by what it observes.

## Method

On 2026-09-28 I read section 5 of the addendum, its general rules, its hint ladder in section 1, its fact automaticity and volley in section 8, its list of events and its acceptance test 6. I searched the record with `paw find` for rational, grouping, mental arithmetic, fluency, speed, strategy, keypad, star yarn, first attempt, assisted, outcome and animation, and read the matches. I read these records whole or in the sections named: ADR-0060 (the decision and its observation rules), ADR-0070 (the day plan and room slots), ADR-0140 (the reward table), ADR-0080 (the packet guard), RES-0800 (node A13 and the method paragraph on mental arithmetic), RES-1200 (the A13 template row), RES-2100 (the yarn amounts and weekly totals), RES-3900 (mental arithmetic count and the touch zone), the conclusions of RES-0010, RES-0100, RES-0200, RES-0900, RES-1000, RES-1200, RES-1300, RES-1600, RES-1700, RES-2200, RES-2300 and RES-3100 that the findings name, the requirements that elaborate them, and the attempt row of SPC-0020. I name each obligation by its research conclusion or decision, because a research record cites no requirement.

On the web I read, on 2026-09-28, Verschaffel's 2023 review of strategy flexibility in full (the accepted manuscript), the full text of Hickendorff (2022) and of Goettfried and Zamarian (2025) through a fetch tool that summarises a page and quotes from it, the abstracts of Hickendorff (2018), Hickendorff and van Zanten (2024) and Threlfall (2009), and the publisher's summary of Torbeyns, De Smedt, Ghesquière and Verschaffel (2009). I couldn't obtain the full text of Threlfall (2009), Torbeyns et al. (2009) or Hickendorff (2018), so every claim from them rests on the abstract or on Verschaffel's account of them. I couldn't read Kirk and Ashcraft (2001) on verbal reports, because PubMed returned a captcha, so this record makes no claim from it. No study I read tested a tap-to-link interface, so the findings on this form's validity are inferences from studies of written work, verbal reports and instructions.

## Findings

### The addendum's form has two steps, three grouping values and one reward, and it builds on the existing mental arithmetic

Section 5 of the addendum gives the examples `25 * 37 * 4`, `38 + 47 + 62 + 53`, `125 * 8 * 13`, `998 + 347` and `99 * 6`. In step 1 the player taps two numbers to draw a knitted loop between them, or picks a number to round (`998` to `1000 - 2`). In step 2 she enters the answer. She may skip step 1 at no cost. The grouping is scored `rational_grouping: "optimal" | "valid" | "none"`; any admissible grouping is `valid`, and no grouping is `none`, never an error. An optimal loop with a right answer gives «Короткая петля»: a special spell animation, 1 star yarn, and the System line «Обнаружен короткий путь. Длинный путь обиделся» (A short path was found. The long path took offence). The stream «рациональный счёт» (rational calculation) is kept by technique: commutative and associative laws, rounding with a correction, the distributive law, and convenient pairs (25 and 4, 125 and 8, 50 and 2). The game offers at most 1 such task a floor, in mental arithmetic or in a room, only on nodes whose "on her own" state is at least «Понимает» (understands), and the report shows «видит удобные приёмы» (sees convenient methods) by technique. Acceptance test 6 reads: an admissible grouping is `valid`, and skipping the grouping doesn't lower the outcome. The addendum's build order says item 5 is input by loops with no language model. Source: the owner's addendum 1, read 2026-09-28.

### The general rules of the addendum keep new forms out of the "on her own" estimate until a refit shows they help

The addendum's general rules say each new form writes its observations to a separate stream, and that these stay out of the "on her own" estimate of computational subtypes until an offline refit shows they improve prediction. They also keep the no-clock rule: no new mechanic rewards speed or shows time. The first rule matches the acceptance test the approved model already has: RES-0900 conclusion 25 and ADR-0060 let a new model version replace the current one only when it predicts the next unassisted first attempt better on held-out days. Source: the addendum, read 2026-09-28; RES-0900 conclusion 25 and ADR-0060 "Accepting a new model version", read 2026-09-28.

### ADR-0060 counts every graded unassisted first attempt as an observation, so a grouping task's answer would enter the estimates unless ADR-0060 changes

ADR-0060 drops an attempt from every estimate, state, probe and block only when it is a rapid guess, excluded by the parent, or ungraded. A grouping task has an outcome and so is graded, which makes its answer an observation of "on her own", of fluency and of blocks under ADR-0060 as approved. The addendum's rule keeps it out, so ADR-0060's list of dropped attempts must gain grouping-form attempts. Source: ADR-0060, section "What counts as an observation", read 2026-09-28.

### The tap step lengthens the attempt, so its time can't be compared with a fluency threshold

ADR-0060 counts an attempt as `fast` when it takes no longer than the template's fluency threshold, and RES-1300 conclusion 8 corrects that threshold by the player's motor time times the number of key presses in the answer. Taps that draw loops are extra presses the correction doesn't count, and a player who links before answering takes longer than one who answers straight away. A grouping attempt in the fluency estimate would therefore count the shortcut as slowness. Keeping the form out of the estimates, as the previous finding requires, also keeps it out of fluency. Source: ADR-0060, section "Fluency and with help", and RES-1300 conclusion 8, read 2026-09-28.

### Mental arithmetic is the floor's fluency measure, and every slot where the form could sit is fixed by an approved record

RES-0800 calls the opening mental arithmetic "a ritual and a fluency measurement", and RES-3900 fixed it at 2 tasks a floor, never 3. ADR-0070 picks mental arithmetic nodes by value among the mental subtypes near the floor's domain. RES-1000 conclusion 1 fills every room slot from one of three sources: the frontier, spaced review or the parent's lesson topics. A grouping task in mental arithmetic replaces one of the two fluency observations of that floor and isn't picked by value. A grouping task in a room is a fourth slot source. Either placement contradicts ADR-0070, and the room placement also contradicts RES-1000 conclusion 1. The addendum's section 8 lets the volley replace the mental arithmetic chain on 2 floors of 3 before the M7 test, so on those floors a room is the only place left. Source: RES-0800 method paragraph, RES-3900 first finding, ADR-0070 "The day plan" and "Filling a room slot", RES-1000 conclusion 1, read 2026-09-28; the addendum section 8, read 2026-09-28.

### A grouping task outside the estimates reduces the evidence the day's minimum counts

ADR-0070 plans each adventure for at least 28 graded first attempts, or 25 after trimming for a slow pace, as the owner decided on 2026-09-26, and RES-2100 bases a typical day on 28 scored attempts. At 1 grouping task a floor and 3 or 4 floors a day, up to 4 of those slots stop feeding the model. The minimum isn't contradicted if the Director counts only attempts that feed the model and places a grouping task only when the forecast still leaves the minimum. Source: ADR-0070 "The day plan" on volume, RES-2100 finding on amounts, read 2026-09-28.

### The task window allows only listed controls, and a tappable expression isn't on the list

RES-0100 conclusion 6 limits the task window to the task, the answer field or options, the keypad, «Не знаю», the thread button and «Готово», with no sprite, effect or story text. Tappable numbers and the loops they draw are a new control, so the obligation must name them. The spell animation is an effect, so it can't play inside the task window. RES-0100 conclusion 8 forbids the words for correct and incorrect and a tick or a cross in the window, which the grouping score must also obey. RES-3100 conclusion 15, confirmed by RES-3900 conclusion 9, sets a 56 px minimum touch zone, and RES-3100 conclusion 13 sets task text at 24 px, so each tappable number needs a touch zone larger than its glyphs. Source: RES-0100 conclusions 6 and 8, RES-3100 conclusions 13 and 15, RES-3900 conclusion 9, read 2026-09-28.

### The reward pays for the act and never for time, but it adds a yarn source RES-2100 didn't count

RES-2100 conclusion 2 makes every reward independent of speed, and ADR-0140 states that no grant reads a time field. The short-loop reward reads the grouping score and the verdict, so it keeps both. It is still a new row in ADR-0140's reward table, and RES-2100 conclusion 17 lists the yarn sources: Guardian 3, clean row 1, big clean row 1, pattern row 2, chest 2 to 4. RES-2100 estimates a typical week at about 50 yarn and a weak week at about 28. At most 1 task a floor, over 7 days of play, gives at most 21 extra yarn a week at 3 floors a day and 28 at 4 floors a day, or about half of that if she finds the optimal grouping half the time. The ceiling is 42 % to 56 % of the typical week, and more than an outfit's 20 yarn. ADR-0140 also keeps accuracy bonuses for the unassisted first attempt, which bars the reward after a hint. Source: ADR-0140 "Rewards", RES-2100 conclusions 2, 17 and 21 and the finding on amounts, read 2026-09-28; the arithmetic is mine.

### The short loop is a reward on a clean outcome, not a fourth outcome

RES-1700 conclusion 13 gives a spell exactly three outcomes, `clean`, `partial` and `alt`, from the verdict. Acceptance test 6 says skipping the grouping doesn't lower the outcome, so the grouping can't enter the outcome at all, and the short loop can only decorate a `clean` one. RES-1600 conclusion 2 forbids single-task outcomes in requests to the Master, so the engine has to pick the animation and the System line from content, without the Master. Source: RES-1700 conclusion 13, RES-1600 conclusion 2, read 2026-09-28; the addendum acceptance test 6.

### A grouping chosen before leaving must survive a resume, and the addendum names it in two places

RES-0200 conclusion 2 restores the attempt step on resume, and its conclusion 4 requires every item of the resume snapshot to be recoverable from the event log. Links drawn before she leaves are part of that step. The addendum lists both a new event `grouping_submitted` and a new field `grouping?` on `AttemptSubmitted`, and RES-2200 conclusion 4 with the `attempt_submitted` row of SPC-0020 lists the fields an attempt records, without a grouping. Source: RES-0200 conclusions 2 and 4, RES-2200 conclusion 4, SPC-0020, read 2026-09-28; the addendum section "События".

### A hint or a second attempt makes an attempt assisted, and the hint ladder has no row for this form

ADR-0060 sends second attempts and attempts after a hint only to the "with help" estimate and never to "on her own". The addendum's section 1 keeps that rule for its hint ladder, and its table of rungs by task form has no row for a grouping task; it says a template with fewer than three meaningful rungs gets a shorter ladder. A rung that names the convenient pair would hand her the grouping, so a grouping after a rung is no evidence of what she noticed. Source: ADR-0060 "What counts as an observation", read 2026-09-28; the addendum section 1, «Ступени по формам заданий» and «Ступень в модели и отчёте», read 2026-09-28.

### The server must not reveal the optimal grouping before the answer

RES-1200 conclusion 9 keeps the short solution off the client before the first attempt, and ADR-0080 names a packet leak and a player reading packets in developer tools as its failure modes. An optimal grouping plan sent to the client would show her the shortcut through the same route, and a client that checks links locally would give her a verdict before she answers. Source: RES-1200 conclusions 8 and 9, ADR-0080 premortem and packet test, read 2026-09-28.

### Node A13 already holds efficient calculation, scored by the answer, with prerequisites above some of the addendum's examples

RES-0800 defines A13 as «Рациональный счёт: компенсация, удвоение и деление пополам, группировка; свойства действий» with prerequisites A7 and A11, at 1F/1S. RES-1200 gives A13 the items `99 * 7`, `25 * 36`, `398 + 256` and `5 * 48 * 2` and a "properties of operations" subtype, answered as an integer or a choice, with traps such as compensation the wrong way. The addendum's `38 + 47 + 62 + 53` needs only addition to 100, below A7. So grouping tasks can't be A13 templates without bending A13's prerequisites, and the addendum's gate "only on nodes she already calculates correctly" reads naturally as the node of the plain calculation. Source: RES-0800 node table, RES-1200 A13 row, read 2026-09-28.

### The addendum adds this form to the MVP, which RES-0010 and ADR-0190 close

RES-0010 conclusion 2 makes the MVP contents list govern the first version, and ADR-0190 states that stage 0.3 holds exactly that list. The addendum's build order puts items 1 to 9 and 11 to 13 in the MVP, item 5 among them. Source: RES-0010 conclusion 2, ADR-0190 "The MVP holds exactly the approved scope", read 2026-09-28; the addendum section «Порядок внедрения».

### Researchers disagree on what flexible strategy use is, and most measure it against a norm set by the numbers in the task

Verschaffel's 2023 review describes definitions from strategy variety alone to choosing the most appropriate strategy, and notes that problem-based definitions, where the numbers decide which strategy is appropriate, are the most common. He cites Star and Newton (2009): flexibility is "(a) knowledge of multiple strategies as well as (b) the ability and tendency to selectively choose the most appropriate ones". The addendum's `optimal` is this problem-based norm: the template's numbers decide the best grouping. Source: Verschaffel, "Strategy flexibility in mathematics", ZDM 2023, accepted manuscript, sections 2 and 3, read 2026-09-28.

### A strategy may be noticed in the numbers more than chosen from a list

Threlfall argues that "the model of strategic choice is not able to give an adequate account of strategic flexibility in all aspects of mental calculation, and an alternative is proposed". Verschaffel summarises the alternative: learners "arrive at a strategy based on their knowledge of numbers and their relations each time they encounter a problem, instead of selecting one from their strategy repertoire". A loop drawn between `25` and `4` records exactly such noticing, which fits the addendum's report label «видит» (sees). Source: Threlfall (2009), abstract; Verschaffel (2023), section 2, read 2026-09-28.

### Telling which strategy a child used is hard, and researchers combine data sources to do it

Verschaffel writes that researchers "are always confronted with the problem of how to gather reliable and valid information about the strategy that was actually used", which is "far from a trivial issue, especially when the problems evoke quick and automatic responses or when they are administered to young learners", and that they combine verbal reports with reaction times or eye movements. Hickendorff (2018) classified strategies from children's written work. A 2025 review of eye-tracking in arithmetic says eye movements capture approaches "often difficult to capture through verbal report alone", but the studies it reviews don't detect shortcut or grouping strategies. The game has no written work, no eye tracker and no spoken report, so an explicit action on the screen is the one observable trace it can collect. Source: Verschaffel (2023), section 3; Hickendorff (2018), abstract; Goettfried and Zamarian (2025), abstract and review, read 2026-09-28.

### Children rarely use shortcuts on their own, and an invitation raises how often they do

Hickendorff (2018) found that 648 Dutch sixth graders used shortcut strategies on 6 to 21 % of problems designed for them, and that "an explicit instruction to look for a shortcut strategy increased the frequency of these strategies in the addition and multiplication problems, but not in the subtraction and division problems". Hickendorff (2022) found with 147 Dutch third graders that "when prompted, students knew more strategies than they used spontaneously". Torbeyns et al. (2009), in the publisher's summary, report that 195 second to fourth graders "hardly applied the compensation and indirect addition strategy". The addendum's techniques are addition and multiplication groupings, exactly where an invitation raised use, so the linking tool will raise the rate it measures. Source: Hickendorff (2018) abstract; Hickendorff (2022) abstract and results; Torbeyns et al. (2009) summary on the publisher's page, read 2026-09-28.

### Using a shortcut doesn't reliably make children more accurate

Hickendorff (2018) reports that "the use of shortcut strategies did not yield higher performance than using standard strategies". Verschaffel's review calls the evidence on flexibility and task performance mixed: Hickendorff (2018) and Torbeyns et al. (2017) found no gain, and Van Der Auwera et al. (2022) and Star et al. (2022) found one. A `none` grouping with a right answer is therefore no sign of weaker calculation, which the addendum already says by not calling it an error. Source: Hickendorff (2018) abstract; Verschaffel (2023), section 4, read 2026-09-28.

### Comparing strategies raises flexibility, and Dutch textbooks offer little of it

Verschaffel reviews interventions in which comparing and contrasting solution methods led to "greater gains in the adaptive use of strategies than isolated teaching of single methods". Hickendorff and van Zanten (2024) analysed four common Dutch primary textbooks and found that "opportunities to compare and choose between different subtraction strategies are very rare". The textbook finding covers subtraction only, so it says nothing directly about the addendum's addition and multiplication techniques; the game's short solution is still a place to show a shortcut beside the direct route, on Verschaffel's evidence about comparing methods. Source: Verschaffel (2023), section 7; Hickendorff and van Zanten (2024), abstract, read 2026-09-28.

### Four options answer the question, and the addendum decides between them

| Option | What it is better at | The case against it |
| --- | --- | --- |
| Do nothing: keep A13's answer-scored templates | no build cost, no new control, no invitation that shifts the measure, no change to the economy | the answer can't show a shortcut, as the addendum says and Verschaffel's review confirms for quick responses, so the parent learns nothing about method |
| Infer shortcuts from answers and times on plain items built to elicit them | observes unprompted use, needs no new control | the game has no written work to code, as Hickendorff (2018) used; time alone is the source Verschaffel says needs triangulating; and a time-based measure sits badly beside the no-clock rule |
| A tap-to-link step in a separate stream, as the addendum sets | a trace per item without a time measure, a reward tied to an act, no language model, no change to the knowledge model until a refit accepts it | the tool invites the shortcut, so it measures noticing on invitation; a link is what she marked, which may differ from how she calculated; and it needs a new control, a slot rule and a yarn source |
| The same step as an answer form of A13, feeding A13's estimates | one place on the map, the existing states and report rows | it breaks the addendum's rule on new forms, puts tap time into A13's fluency, and puts sum items below A13's prerequisites |

The addendum decides for the third option, and research has no finding that overturns it: the invitation effect is a limit on what the stream means, which a label can state, and not a reason to drop the form. The case against the third option stays true after the choice, which is why the conclusions name the measure "sees when invited" and keep it out of the model. The fourth option returns if a refit later shows grouping evidence predicts A13 or its host nodes, through the held-out comparison of RES-0900 conclusion 25.

### Decided on 2026-09-28

The grouping task sits in a room slot, recorded as a fourth slot source beside the three of RES-1000 conclusion 1, and never in mental arithmetic, because that leaves mental arithmetic's two fluency observations a floor and the volley's replacement of them untouched; its cost is a slot source the Director and its simulation must learn. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

Grouping templates admit only expressions in which every link is admissible: all additions, all multiplications, or one number to round. In `2 + 3 * 4` a loop between `2` and `3` is mathematically wrong and none of `optimal`, `valid` and `none` fits it, so admitting such expressions would need a fourth grouping value that changes the addendum's score; the cost is that the form can't show whether she respects precedence and that the distributive law has no item of its own, since `99 * 6` is also rounding with a correction. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The forge recipe amounts stay as RES-2100 set them, and the weekly yarn is measured during stage 0.3, because up to 21 extra yarn a week is a ceiling, not a forecast, and keeping the amounts changes no approved record. A week above 60 yarn two weeks in a row, about a fifth above RES-2100's typical week, opens a new record that resizes the recipes. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The score `optimal` means the submitted links equal one full optimal plan; in `38 + 47 + 62 + 53`, `38 + 62` linked alone is `valid`. The reason is that with one pair linked she still adds the other two numbers the long way, and the report's figure should mean she saw the whole shortcut; the subset reading would count partial noticing as optimal and raise the figure. Its cost is that a player who sees one of two pairs looks the same as one who links an unhelpful pair. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Conclusions

1. A grouping task must show an expression with a convenient grouping, let the player link numbers by taps or mark one number to round, and then take her answer; she must be able to skip the links and answer straight away at no cost.
2. The engine must score the grouping as `optimal`, `valid` or `none`, apart from the answer, with no language model, from the links she submitted with her answer; it must never report a grouping as an error, and it must never let the grouping change the task's outcome.
3. Each grouping template must declare its host node, its one technique, its admissible links and its optimal plans. The host node must be the node of the RES-0800 node table that holds the plain calculation, and A13 may host only items whose calculation meets its prerequisites A7 and A11. The technique must be one of the four the addendum lists: the commutative and associative laws, taken as one technique because the addendum lists them together, rounding with a correction, the distributive law, and convenient pairs. A product with one factor to round, such as `99 * 6`, must declare rounding with a correction, and the report must leave out the distributive law, because it has no item of its own.
4. `optimal` must mean the submitted links equal one full optimal plan, and any other admissible set of links must be `valid`; a mark on a number to round counts as a submitted link.
5. Grouping templates must use only expressions in which every link is admissible: all additions, all multiplications, or one number to round.
6. The short loop, 1 star yarn with the special spell animation and the System line, must go to a `clean` unassisted first attempt with an `optimal` grouping and to no other attempt. The animation and the System line must appear outside the task window, and the engine must choose them from content, never the Master.
7. No part of the short loop may read a time field.
8. ADR-0140's reward table and RES-2100's list of yarn sources must be amended by a new record to add the short-loop yarn. The weekly yarn must be measured during stage 0.3, the recipe amounts must stay as RES-2100 set them, and a week above 60 yarn two weeks in a row must open a new record that resizes them.
9. A grouping-form attempt must stay out of the "on her own" estimate, the fluency estimate, blocks, probes and node states until a model version that uses it passes the held-out comparison RES-0900 conclusion 25 sets and ADR-0060's activation rule admits it, and it must not join during the MVP; ADR-0060's list of attempts dropped from the estimates must be amended by a new record to say so.
10. The server must keep a separate "rational calculation" stream per technique, recomputed from the event log like every projection, holding each grouping score with its host node and whether it was assisted.
11. The Director must offer at most 1 grouping task a floor, only when the host node's tested state is at least «Понимает» (understands), and only when the forecast still leaves the adventure the minimum of graded first attempts ADR-0070 plans for without counting the grouping task.
12. The grouping task must sit in a room slot, recorded in `flowSlot` as its own source, and never in mental arithmetic; ADR-0070 and the obligation of RES-1000 conclusion 1 must be amended by a new record to add that slot source and its gate.
13. The obligation of RES-0100 conclusion 6 must be amended by a new record to allow tappable numbers and the loops they draw in the task window, and each tappable number must have a touch zone of at least 56 px in both directions.
14. Before the first attempt ends, the server must send the client neither the optimal plans nor any score of the links, and a packet test must assert it; at no point may the task window mark the links as optimal, valid or wrong.
15. The event log must record the links as the player draws them, so that a resume restores them from the log as RES-0200 conclusion 4 asks. The attempt event must carry the submitted links and their score, the obligation of RES-2200 conclusion 4 and SPC-0020 must be amended to name these fields, and the addendum's `grouping_submitted` and `grouping?` must be reduced to one owner per fact.
16. When the player buys a hint rung on a grouping task, or answers its second attempt, the grouping must be recorded as assisted, stay out of the stream's unassisted figures and earn no short loop.
17. The short solution of a grouping task must show the template's optimal plan beside the direct calculation, whatever grouping she chose.
18. The report must show «видит удобные приёмы» (sees convenient methods) per technique as the share of `optimal` groupings among unassisted first attempts on grouping tasks, with skipped links counted as `none` and the count beside it, and must show assisted groupings apart in the «с помощью» (with help) figures. It must describe the figure to the parent as what she marks when the task invites her to link numbers, because the invitation itself raises the rate.
19. The report must treat `none` as a neutral result under the wording rule of RES-2300 conclusion 3 and must never set it against a norm.
20. The MVP contents list that RES-0010 conclusion 2 makes govern, and ADR-0190, must be amended by a new record to add the short loop to the MVP contents list.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28, read 2026-09-28 - section 5, the general rules, section 1 on the hint ladder, section 8 on the volley, the event list, acceptance test 6 and the build order.
- ADR-0060, read 2026-09-28 - what counts as an observation, the fluency estimate.
- ADR-0070, read 2026-09-28 - mental arithmetic picked by value, room slot sources.
- ADR-0080, read 2026-09-28 - the packet leak failure modes and the packet test.
- ADR-0140, read 2026-09-28 - the reward table, no grant reads time, bonuses only for the unassisted attempt.
- ADR-0190, read 2026-09-28 - the MVP holds exactly the approved contents list.
- RES-0800, read 2026-09-28 - node A13, its prerequisites, mental arithmetic as the fluency measure.
- RES-1200, read 2026-09-28 - the A13 template row.
- RES-2100, read 2026-09-28 - conclusions 17 and 21, weekly yarn estimates.
- RES-3900, read 2026-09-28 - 2 mental arithmetic tasks a floor, the 56 px touch zone.
- RES-0010, read 2026-09-28 - conclusion 2, the MVP contents list governs.
- RES-0100, read 2026-09-28 - conclusions 6 and 8, the task window.
- RES-0200, read 2026-09-28 - conclusions 2 and 4, resume and the log.
- RES-0900, read 2026-09-28 - conclusions 13 and 25, fluency and accepting a model version.
- RES-1000, read 2026-09-28 - conclusions 1 and 8, slot sources and mental arithmetic.
- RES-1300, read 2026-09-28 - conclusion 8, the motor correction.
- RES-1600, read 2026-09-28 - conclusion 2, what the Master never receives.
- RES-1700, read 2026-09-28 - conclusion 13, three outcomes of a spell.
- RES-2200, read 2026-09-28 - conclusion 4, what an attempt records.
- RES-2300, read 2026-09-28 - conclusion 3, non-judgemental labels.
- RES-3100, read 2026-09-28 - conclusions 13 and 15, text size and touch targets.
- SPC-0020, read 2026-09-28 - the fields of `attempt_submitted`.
- [Verschaffel, L. (2023). Strategy flexibility in mathematics. ZDM - Mathematics Education, accepted manuscript, DOI 10.1007/s11858-023-01491-6](https://lirias.kuleuven.be/retrieve/424f7ed4-9e78-4e02-b0a4-b59d441a1e12), read 2026-09-28 - definitions, the difficulty of observing strategies, mixed evidence on performance, comparison interventions, and its accounts of Threlfall (2009) and Torbeyns et al. (2009).
- [Threlfall, J. (2009). Strategies and flexibility in mental calculation. ZDM 41, 541-555](https://link.springer.com/article/10.1007/s11858-009-0195-3), abstract read 2026-09-28 - strategic choice doesn't account for all flexibility.
- [Hickendorff, M. (2018). Dutch sixth graders' use of shortcut strategies in solving multidigit arithmetic problems. European Journal of Psychology of Education 33(4), 577-594](https://scholarlypublications.universiteitleiden.nl/handle/1887/66727), abstract read 2026-09-28 - 6 to 21 % shortcut use, the instruction effect in addition and multiplication, no accuracy gain, coding from written work.
- [Hickendorff, M. (2022). Flexibility and adaptivity in arithmetic strategy use: what children know and what they show. Journal of Numerical Cognition 8(3), 367-381](https://jnc.psychopen.eu/index.php/jnc/article/download/7277/7277.html?inline=1), read 2026-09-28 - prompted knowledge exceeds spontaneous use.
- [Torbeyns, J., De Smedt, B., Ghesquière, P. and Verschaffel, L. (2009). Acquisition and use of shortcut strategies by traditionally schooled children. Educational Studies in Mathematics 71, 1-17](https://link.springer.com/article/10.1007/s10649-008-9155-z), publisher's summary read 2026-09-28 - children hardly applied compensation.
- [Hickendorff, M. and van Zanten, M. (2024). Opportunity to learn flexible and adaptive strategy use in current and past Dutch mathematics textbooks. Mathematical Thinking and Learning](https://doi.org/10.1080/10986065.2024.2435827), abstract read 2026-09-28 through the Semantic Scholar record - comparison of strategies is very rare in Dutch textbooks.
- [Goettfried, E. and Zamarian, L. (2025). Looking into the calculating mind: evidence about arithmetic from eye-tracking studies. Behavioral Sciences](https://pmc.ncbi.nlm.nih.gov/articles/PMC12729500/), read 2026-09-28 - eye tracking reveals approaches verbal reports miss, and its reviewed studies don't detect shortcut strategies.
