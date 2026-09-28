---
id: RES-4080
artifact: research
status: approved
revised: 2026-09-28
elaborates: RES-0010
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Cito confirms ten of the addendum's twelve claims about the M7 and E7 tests and advises against drilling, so the game builds the tested skills toward parent-set dates and fourteen approved records change

## Summary

Cito's own documentation, read on 2026-09-28, confirms ten of the twelve claims the owner's addendum 1 makes about the Leerling in beeld tests M7 and E7. The confirmed claims are the advised windows, the expected school advice built at E7, the adaptive second part, the ability score, the missing time limit, the skill test with items above the curriculum, the half of the items that are bare sums, and tests at another level. Two claims stay unconfirmed: that Cito and the Dutch school write `×` for multiplication, and that the parent can get the bare-versus-context split. Cito calls practising for the test "geen goed idee" but welcomes practice that builds real skill, so the game must build the tested skills and never copy the test. Section 8 of the addendum stays on that side of the line, and the owner's instructions of 2026-09-28 stand. They change seven approved decisions, ADR-0050, ADR-0060, ADR-0070, ADR-0140, ADR-0160, ADR-0180 and ADR-0190, and seven approved research records, RES-0010, RES-0800, RES-1100, RES-1200, RES-2100, RES-2300 and RES-3900, each of which a new record must correct. The five open questions are decided: school goals and lesson marks don't stack, the fact threshold moves only as a versioned change, bridge words share the glossary's file and approval, the printable fact list is a view of the heat map, and the Cito check only reports changed pages. This record covers section 8 of the addendum and its acceptance tests 9 to 14 and 16. It leaves out the other sections, the sources track of section 9 and the rule on time-of-day windows.

## The question

What must the game do so that it prepares the player for the Cito M7 and E7 tests of the 2026-2027 school year, and which approved records does the owner's section 8 change? The owner's constraints are the no-clock rule, the first attempt that measures, a model that never sees the maths, a Russian game with a small Dutch bridge, and dates that the parent sets.

The question assumes that preparing for a Cito test is something a home game should do at all. Cito challenges this assumption itself. Its FAQ says the Leerling in beeld tests are "vaardigheidstoetsen, geen beheersingstoetsen", that "Oefenen voor een toets of toetsstof opnemen in het aanbod is geen goed idee", and that training on test items gives a distorted picture and unnecessary stress. The approved record agrees: RES-0010 principle 11 says the game "doesn't drill for a test", and RES-0010 excludes "A standardised assessment for the school" from its scope. The assumption survives only in a narrower form, which Cito also states: "Als een leerling door te oefenen nieuwe vaardigheden leert, zal de score waarschijnlijk hoger uitvallen. Dat is juist gewenst." So this record asks how the game builds the skills the tests measure, on a schedule the test dates inform. It must do so without copying test items or formats, and without a clock. Every option below is judged by that line.

The question also assumes the addendum's facts about Cito are current. They're a summary the owner gathered on 2026-09-28, and the addendum itself asks for each one to be checked at Cito's documentation, so that check is the main part of this record.

## Method

On 2026-09-28 I read these Cito pages at cito.nl, downloading each page with `curl` and searching its text so that every quotation below is copied verbatim:

- the Leerling in beeld FAQ;
- the general Cito FAQ;
- the page on the annual calendar, and its 2026-2027 calendar PDF;
- the page on the expected test advice;
- the page on tests at another level and digital adaptive testing;
- the pages on Rekenen-Wiskunde, Rekenen-Basisbewerkingen and the reports;
- the two reading guides for parents;
- the technical manual "Wetenschappelijke verantwoording Rekenen-Wiskunde 3.0 voor groep 7".

The manual describes LVS 3.0, the predecessor of Leerling in beeld. The Leerling in beeld FAQ says its tests mostly rest on the LVS 3.0 manuals, so I treat the manual as primary for the psychometric model but not for the current test's layout.

I couldn't obtain three things. The Leerling in beeld test items themselves are closed, so I couldn't see how a digital item writes multiplication. The expert report and the teacher's group report sit behind a school login. The Leerling in beeld manual for the current tests is sent only on request.

In the repository I searched with `paw find` for "cito" and "dutch" and by `grep` for cito, toets, doorstroom, M7 and E7 across `project/`. I read, at revision `47c0a7b`, ADR-0050, ADR-0060, ADR-0070, ADR-0090, ADR-0100, ADR-0140, ADR-0160, ADR-0180 and ADR-0190, the research records RES-0010, RES-0800, RES-0900, RES-1000, RES-1100, RES-1300, RES-2100, RES-2300, RES-3000, RES-3300 and RES-3900, and the requirements built on them. A helper agent read part of these records for me and returned quotations with line numbers, and I checked the quotations each conflict rests on against the files myself.

## Findings

### Cito's claims, checked at the source

The table lists each claim the addendum makes about Cito, with the verdict of Cito's own documentation as read on 2026-09-28. The findings after it give the evidence for each row.

| # | The addendum's claim | Verdict at the source, 2026-09-28 |
| --- | --- | --- |
| 1 | M7 runs from about mid-January to mid-February 2027 and E7 from about mid-May to mid-June 2027, and the school picks the day | Confirmed, as Cito's advised periods |
| 2 | Leerling in beeld builds the expected test advice from Rekenen-Wiskunde, Begrijpend lezen and Taalverzorging at E7, from tests at level E6, M7, E7 or B8 | Confirmed, with a condition the addendum leaves out |
| 3 | The digital test is adaptive: the second part is the same difficulty, easier or harder, chosen by the first | Confirmed |
| 4 | The score is a vaardigheidsscore that weighs which items were solved, not how many | Confirmed, for digital tests and paper tests entered item by item |
| 5 | The test has no time limit | Confirmed |
| 6 | It is a vaardigheidstoets, not a beheersingstoets, and items above the curriculum are normal | Confirmed |
| 7 | The maths test holds many kale sommen, and Cito analyses bare and context items apart | Confirmed: half the items are bare |
| 8 | Toetsen op maat let the school give a test of another level, such as M6 in place of M7 | Confirmed |
| 9 | A test at another level shows in the expert report | Confirmed, in the expert version of the group report |
| 10 | The results form holds afnamemoment, the test taken, vaardigheidsscore, functioneringsniveau, referentieniveau and niveau I to V | Confirmed, with A to E as a second scale the addendum leaves out |
| 11 | The parent can obtain the split between bare and context items | Unconfirmed |
| 12 | `×` is the multiplication sign of the Dutch school and of Cito | Unconfirmed |

### The advised windows are mid-January to mid-February and mid-May to mid-June, and the school picks its own dates

Cito's calendar page lists "De vaste adviesperiodes voor Leerling in beeld: B-moment: oktober; M-moment: half januari t/m half februari; E-moment: half mei t/m half juni", and it opens with "Jij bepaalt zelf je afnamemomenten". The 2026-2027 calendar PDF runs the norm period "M-afname" from December 2026 to March 2027 and "E-afname" from April to July 2027, and marks "Adviesperiode M-afname" at 2027-01-14 and 2027-02-10 and "Adviesperiode E-afname" at 2027-05-20 and 2027-06-08. The PDF doesn't say in words that the two marks bound the period, so I read them as start and end only because the calendar page gives the same span. The addendum's default horizons, 2027-01-15 and 2027-05-15, sit at or just before the start of each advised period. That makes them safe defaults: a horizon early by a few weeks costs a little priority, and one late by a few weeks misses the test. A school testing outside the advised periods is followed "op functioneringsniveau en/of referentieniveau", the Rekenen-Wiskunde page says.

### The expected test advice comes from E7, needs all three Taalverzorging parts at one level, and the school decides whether parents see it

The expected-advice page says Leerling in beeld builds the advice when the school gives group 7 "tijdens het E-moment de toetsen Begrijpend lezen, Rekenen-Wiskunde en Taalverzorging", and that the pupils must take at Taalverzorging "de drie onderdelen spelling niet-werkwoorden, spelling werkwoorden én leestekens ... én dat moet op hetzelfde niveau zijn". The Leerling in beeld FAQ names the levels: "op minimaal niveau E6, M7, E7 of B8". It adds a weighting: "Rekenen-Wiskunde en Begrijpend lezen tellen zwaarder mee dan Taalverzorging". It also says "er is geen vaste tijdsperiode (zoals mei/juni) vereist", so the advice depends on the E7 moment and not on the calendar month, and "Je bepaalt als school zelf of je het advies zichtbaar maakt voor ouders". The advice is "in principe een dubbeladvies, behalve voor het vwo-advies". So the addendum's claim holds. It leaves out two facts the game needs: maths is one of the two heavier parts, and the parent might never see the advice, so a form field for it has to accept an empty value.

### The digital test adapts its second part in three ways, one test moment up or down

The page on tests at another level says the digital Begrijpend lezen, Rekenen-Wiskunde and Taalverzorging tests are "digitaal-adaptief", so that "na het maken van de eerste taak van de toets, de volgende taak automatisch wordt afgestemd op hoe goed een leerling die eerste taak heeft gemaakt". The pupil then gets "opgaven die qua moeilijkheidsgraad vergelijkbaar, makkelijker of moeilijker zijn". The range is one moment each way: "Makkelijker betekent dat de opgaven te vergelijken zijn met opgaven van de toets van het vorige afnamemoment. De moeilijkere opgaven zijn vergelijkbaar met die van de toets van het volgende afnamemoment." For M7, the easier part therefore compares with E6 items and the harder part with E7 items. The addendum asked for this range to be checked, and the answer is one test moment either way.

### Two pupils with the same number of errors can get different ability scores

The Leerling in beeld FAQ answers "Hoe kan het dat leerlingen hetzelfde aantal fouten hebben, maar een ander vaardigheidsniveau?" with "Als je digitaal toetst of op opgaveniveau de foute antwoorden invoert, dan kan Leerling in beeld rekening houden met het gewicht van de opgave ... Beide leerlingen kunnen dan hetzelfde aantal fouten hebben, maar hebben toch een andere vaardigheidsscore." The claim holds under that condition: a paper test entered only as a total score doesn't carry the item weights. The LVS 3.0 manual names the model: "Voor Rekenen-Wiskunde 3.0 wordt OPLM gebruikt", because "Veel van de items blijken dan ook niet te kunnen worden beschreven met het Raschmodel". So Cito's own scale is a one-parameter logistic model with a fixed discrimination index per item, and a home Rasch scale can't reproduce it. By my reading of the model, and not in Cito's words, a slip on an easy item costs a pupil more than a miss on a hard one. The easy item is the one an able pupil is expected to get right, so missing it pulls the estimate down further.

### The maths test has no time limit

The Rekenen-Wiskunde page says "Afname duurt 30-45 minuten per taak" and "Er is geen tijdslimiet". The general FAQ says the same of the group 8 doorstroomtoets: "De doorstroomtoets kent geen tijdslimiet en het is mogelijk om pauzes te nemen." The LVS 3.0 manual gives E7 as "3 taken van elk 32 opgaven", taken "bij voorkeur ... op verschillende dagdelen". The claim holds. The 30 to 45 minutes are Cito's estimate of how long a task takes, and the page doesn't enforce them.

### The tests measure skill, include items above the curriculum, and Cito advises against practising for them

The Leerling in beeld FAQ says "onze LVS-toetsen zijn vaardigheidstoetsen, geen beheersingstoetsen. De toets meet hoe vaardig een leerling is ... niet of de aangeboden lesstof is beheerst." The general FAQ says "In een LVS-toets is leerstof opgenomen die wel en nog niet aan bod is geweest. Dat laatste is omdat je ook de bovengemiddelde leerlingen een kans wilt geven te laten zien wat ze kunnen." The claim holds.

The same pages advise against preparing for the test itself. The Leerling in beeld FAQ says "Oefenen voor een toets of toetsstof opnemen in het aanbod is geen goed idee. Je maakt onze vaardigheidstoetsen daarmee tot beheersingstoetsen", and the general FAQ adds "extra toetsopgaven trainen om een zo hoog mogelijk toetsresultaat te behalen, raden we af" and "kan trainen zorgen voor onnodige spanning en onrust". It also says that practice that builds skill may raise the score, and that Cito wants this: "Als een leerling door te oefenen nieuwe vaardigheden leert, zal de score waarschijnlijk hoger uitvallen. Dat is juist gewenst". So the addendum's strategy of fact automaticity, accuracy on easy items and working ahead fits Cito's own line, while any copy of Cito's item formats or a timed mock test would cross it.

### Half the maths items are bare sums, and Cito reports formal and functional items apart

The Rekenen-Wiskunde page lists "50% formele opgaven (kale sommen) en 50% functionele opgaven (verhaaltjessommen)" and "detailanalyses op de domeinen en het onderscheid formeel/functioneel", and quotes a teacher: "Handig dat ik kan zien hoe een leerling scoort bij kale sommen in vergelijking tot opgaven in context." The LVS 3.0 manual says the M7 and E7 items "bestaan voor een deel uit opgaven met een context en voor een deel uit opgaven zonder context". The claim holds, and the figure is exact: half. The addendum's rule that at least half of the scored tasks in nodes with both formats are bare matches it. Cito also sells a separate bare-sum test, Rekenen-Basisbewerkingen, to find "bij welke leerling extra aandacht nodig is voor het automatiseren van hoofdrekenen", with "alleen kale sommen over optellen, aftrekken, vermenigvuldigen (vanaf M5) en delen (vanaf E5)". Cito therefore treats fact automaticity as a skill of its own, as the addendum does.

### A school may give a test of another level, and the expert version of the group report shows it

The same page defines "toetsen op maat: je kiest bewust een toets van een lager of hoger niveau omdat de leerling een eigen leerlijn volgt", with the example "een leerling in groep 7 bijvoorbeeld rekenonderwijs volgen op het niveau van groep 6", and says it works "zowel met de papieren toetsen als met de digitale adaptieve toetsen". A pupil ahead of the group may also get a higher level: "Ook het omgekeerde is mogelijk". The general FAQ says of the group report "Modus I-V: je ziet de normering op het afnamemoment (bijv. V op M7). Expertversie: je ziet ook het niveau van de specifieke toets die de leerling maakte (bijv. III op M6)." Both claims hold. The expert version is a teacher's view, so the parent learns which test was taken only by asking the school.

### The parent's report shows the functioning level or a I to V or A to E level, as the school chose

The parents' reading guide says the report shows "het functioneringsniveau (M3 t/m E8) of vaardigheidsniveau (I t/m V of A t/m E) van je kind, afhankelijk van wat de school ingesteld heeft", and that "Het vaardigheidsniveau vergelijkt de score van je kind met die van andere kinderen". The pupil-profile guide adds that reference levels show from E6 onwards, that a functioning level can read "< of >", and that the profile carries a vaardigheidsscore and a growth symbol. The reports page promises "functioneringsniveaus, vaardigheidsscores, referentieniveaus". So each field of the addendum's form exists in Cito's reports. But a school may report A to E in place of I to V, and a functioning level may be only "<" or ">". The growth symbol is missing from the form.

### The bare-versus-context split for one pupil is unconfirmed as something a parent receives

Cito describes the formal and functional split as a detailed analysis for the teacher, on the Rekenen-Wiskunde page. Neither parents' guide shows it. I found no Cito page saying the parent can get it, so the form's split field stays optional and unconfirmed.

### `×` as the multiplication sign of the Dutch school and of Cito is unconfirmed

The LVS 3.0 manual writes "49 x 198,95 is ongeveer 50 x 200", with a letter x and a decimal comma, in a description of an item. I couldn't see a Leerling in beeld item, and no Cito page states a notation rule. So the decimal comma is confirmed, and the sign Cito's digital items print isn't. Whether the player's school writes `×` is a fact about the player's school that only the parent can check.

### The addendum's names M7 and E7 collide with graph identifiers

RES-0800 line 185 names node M7 "Volume of a cuboid, litres", and the science topics carry the identifiers E1 to E5. A report line such as "M7: 80 % ready" would read as the volume node. The records need one unambiguous name for the test moments, such as `cito:M7`, before the report and the graph share a screen.

### ADR-0070's value formula has no term for a test horizon or for the school's goals

ADR-0070 line 51 fixes `value(v) = 2.0 * uncertainty(v) + 1.5 * staleness(v) + 1.5 * frontier(v) + 2.0 * recheck(v) + 1.5 * escalation(v) + 1.0 * stretch(v) + 1.5 * spaced_review(v) + 1.5 * parent_topic(v) - 1.0 * recent_shows(v)`, read from `content/director.v1.json`. The addendum adds `+ 1.5 * block_priority(v)`, with priority `(7 - citoBlock) / 6` until the block is ready, and `+ 1.0 * school_goal(v)` for confirmed school goals. ADR-0070 must change. Two rules of ADR-0070 still bind the new terms. The flow share decides only between frontier and review, and "never which frontier node is picked", which the addendum keeps by saying priority isn't a queue. The honest-difficulty property test, "no term of the value formula rises as the expected chance of success falls", holds too: both new terms depend on the block and the goal, not on the chance of success. The three-day window of RES-1000 and the stretch cap of 2 tasks a day (RES-3900) are unchanged by the addendum's own rule, and its acceptance test 10 checks them over 60 simulated days.

ADR-0070 also rejected "The parent plans each day's topics" at line 145. A school-goal term isn't a daily plan, because the goal only adds value and the Director still picks, but the term and `parent_topic` can reach one node together, as `recheck` and `parent_topic` can. ADR-0070 line 56 lets a lesson-marked node score "the larger of `recheck` and `parent_topic`, never both", and nothing yet says whether `school_goal` stacks with them.

### ADR-0060 tracks nodes and subtypes, not single facts, and RES-1300 forbids a parent-set threshold

ADR-0060 keeps its estimates per node and subtype, and single facts appear only in the report's heat map (RES-2300 line 119, "the 8x8 heat map as a table"). The addendum adds about 300 facts, each with its `factId`, its own three states and its own review schedule, so ADR-0060 must gain a fact projection. The fact states don't conflict with the node states, because the addendum keeps them in a separate list and a block counts them only for readiness.

The threshold does conflict. The addendum's default of 3 s plus the motor correction matches the catalogue threshold of 3 s that RES-1200 gives A1 and A3. But the addendum lets the parent change it, and RES-1300 conclusion 7 says "The fluency threshold must be an external age standard adjusted only for device input speed", while RES-1300 conclusion 3 says "Only a person changes the catalogue thresholds ... with a new version and a decision record in `project/adrs/` that the owner approves". A parent control that moves the fact threshold therefore needs RES-1300 superseded, or a rule that the change is versioned and logged as RES-1300 asks. RES-1200 also lists the table facts as "a, b ∈ 2..9; all 36 facts" for node A3, a smaller set than the addendum's 1 to 10 with multiplication and division counted apart.

### The small-space rules of RES-1100 cover tables and addition to 20, but not multiplying by 10, 100 and 1000

RES-1100 conclusion 7 gives small spaces, "times-table facts, addition to 20, control facts", a minimum time of "the motor correction plus 600 ms", and exempt these small spaces from the 30-day repeat window, "because they measure automaticity". The addendum's fact list also holds multiplying and dividing by 10, 100 and 1000. Under the general rule of RES-1100, `max(1500 ms, min(0.15 * fluencyMs, 10 000 ms))` plus the motor correction, those facts would get a floor of at least 1,500 ms plus the motor correction. That floor is half the 3 s threshold, so a quick, real answer would count as a rapid guess. They also fall under the repeat window, which blocks the drill the addendum asks for. The small-space list in RES-1100 must grow to every fact in `content/facts.yaml`.

### A Volley in place of the mental arithmetic tasks changes the floor order RES-3900 fixed

ADR-0070 line 30 opens each floor with "an ungraded warm-up and 2 mental arithmetic tasks", which RES-3900 fixed because the session budget in RES-1000 counts 2. The addendum replaces the chain with a Volley of 8 to 10 facts on 2 floors in 3 before the M7 test. At the 3 s threshold, ten facts take about half a minute of answer time plus reading, so the budget changes little. ADR-0070 and RES-3900's conclusion 1 must still say the Volley may stand in the chain's place.

### The Volley keeps the no-clock rule of ADR-0090 and ADR-0140 but adds a new yarn source to RES-2100

RES-0300 says "The child never sees timers, countdowns, clocks or time bars", ADR-0140 line 93 says "No grant reads a time field, so speed earns nothing", and RES-2100 conclusion 2 says "No reward must depend on answering speed". The Volley shows no time and rewards by accuracy only. Its rapid-guess exclusion reads time only to refuse a reward, which ADR-0070 already does. So no conflict arises with ADR-0090 or the no-clock rule.

The reward does conflict. RES-2100 conclusion 17 lists every source of star yarn, "Each finished Guardian problem must give 3 star yarn in any ending, each clean row and each big clean row 1 yarn, and an optional pattern row 2", and the Volley's yarn isn't on the list. ADR-0140 grants rewards from that table, so RES-2100's economy and ADR-0140's grant table both change. The addendum's rule that a record never falls matches RES-2100's ban on "resetting what was earned".

### The Volley's lines already fall under RES-3300's forbidden words, which also ban the word the addendum uses for bare sums

The addendum bans «ошибка», «неправильно» and «промах» in the Volley's replies. RES-3300 lines 112 to 115 already ban those words and more, including «неверно», and also the school words «задача», «пример» and «урок» in every text the player sees. The addendum's Russian name for bare sums, «голые примеры», is fine in the Parent Room, which RES-3300 conclusion 6 leaves outside the list, but it can't reach the player.

### No approved record contains a skill scale, and RES-0900 defers the offline refit past the MVP

The approved records never considered IRT, Rasch or a theta scale: ADR-0060 rejected Elo, deep knowledge tracing and BKT thresholds, and a search finds Rasch only as a citation in RES-1700. The addendum's scale is a derived view of the log, so it adds a projection and changes no estimate. RES-0900 line 209 says the model's parameters "are refit offline ... Deferred until after the MVP by the draft", while the addendum refits the scale's item difficulties after 4 to 6 weeks, inside the MVP.

The following is my reasoning, not a source. With one player, a Rasch model can't separate an item's difficulty from a change in her ability over the same weeks, because every response to the item comes from one person at shifting levels. A refit of `b` from her log alone will absorb her growth into the items, and the line will look flat. Acceptance test 13 checks convergence on simulated pupils, and that test would catch this only if the simulated pupils grow during the simulation.

### ADR-0180 has no external result, no school goal and no horizon, and forbids a lesson plan

ADR-0180's eight report screens hold no entry for an outside test and no school goal, and the parent's inputs are lesson marks, settings, glossary approval, task exclusion and «Закончить на сегодня». ADR-0180 must gain the horizon dates, the Cito results form, the school goals, the fact report and the block readiness. RES-2300 says "The game builds no plan of lessons", and ADR-0180 line 38 adds "no screen orders topics or proposes dates or exercises". A printable list of facts that aren't yet automatic sits on that line. It names what to practise, so it proposes exercises, but it doesn't order topics or set dates, and RES-2300 already shows the parent the table heat map. RES-2300 line 119 draws the heat map as 8x8, while the addendum asks for 10 x 10 with a second map for division.

### The Dutch bridge puts Dutch words in task text, which RES-0010 and RES-0800 forbid in the MVP

RES-0010 conclusion 6 says "Every player-facing text and task in the first version must be in Russian, and the Dutch layer must stay out of it", and RES-0800 allows Dutch only as the glossary word in a term hint. RES-0800 line 398 says "The layer means Dutch task text, Dutch formats, templates with `curriculum: "nl"`, a graph overlay and a practice test". ADR-0160 ships the set `["ru"]`, and ADR-0190's scope guard fails on "a Dutch locale string file". The addendum's mixed task texts in about 20 % of word problems put Dutch words into the task itself, so the bridge is Dutch task text in the sense RES-0800 defines. RES-0010 conclusion 6, RES-0800's rule and ADR-0190's rule that every task the player sees is in Russian must admit the bridge as a named exception. The owner's addendum 1 of 2026-09-28 is the owner's instruction that amends the Russian-only rule for this one exception, and the Dutch layer stays out of the MVP.

The bridge also overlaps the glossary the MVP already ships. The glossary's Dutch words live in `content/lexicon.nl.json`, the game logs `glossaryOpened`, and RES-1300 says "the parent reviews each entry in the Parent Room before it shows". A separate `content/bridge.nl.json` would be a second Dutch word list with a second tap-to-open card, so the bridge words join the glossary's file instead. ADR-0190's scope guard already allows the glossary's Dutch words, so the guard needs no change.

### RES-1200 fixes `·` in Russian task text, and the notation belongs to the locale, not to a parent setting

RES-1200 says "Russian notation applies: a decimal comma, «·» for multiplication, «:» for division", and ADR-0160 line 18 puts "the notation profile" in the locale. The addendum makes the sign a parent setting with `×` as the default. So RES-1200 conclusion 11, which states the same rule, must be superseded. RES-1200 already breaks its own rule in the catalogue rows for M5 and M7, which write "l × b × h".

### ADR-0100 has no GOALS_MODEL role, and the school's goal list can carry the school's name

ADR-0100 lists fifteen model roles, and `GOALS_MODEL` isn't one of them. The addendum sends "only the text of the goals", which is no player data, but a pasted goal overview can carry the school's name or the class, which ADR-0100's egress guard replaces as "school". The decisions of 2026-09-28 therefore keep the goal list on the Mac: an offline catalogue maps goals to nodes, the parent confirms each link, and no `GOALS_MODEL` role is added, so ADR-0100 doesn't change. RES-2600 conclusion 1 keeps "the log, answers, times, estimates, node states, scratchpads, lesson tags and reports" on the Mac, and the Cito results the parent enters are reports of the same kind.

### Working ahead of the school stays inside ADR-0190's scope, since the game still teaches no new topic

The addendum opens 1S nodes up to the end of group 8 when their prerequisites are ready, and stretch nodes under their gate, and reports what is mastered beyond the school's current work. ADR-0190 says "The game offers no lesson that teaches a new topic", and the priors in ADR-0060 already give the 1S and stretch nodes a probability above zero. Opening a node ahead of the school means the game measures it and consolidates it after the parent's lesson, as it does now, so no approved record changes. It does mean a player who meets a new topic first in a task gets only the short solution, because the game teaches no lesson.

### Options compared

The question admits three options, and doing nothing is one of them.

| Option | What its advocate says it is better at | The case against it |
| --- | --- | --- |
| A. Do nothing: the approved graph, model and Director already cover the tested content | It follows Cito's advice against practising for the test and RES-0010's "doesn't drill for a test" exactly, adds no new state, and changes no approved record | It doesn't know the test dates, so a gap in facts or in a block can stay open past M7. It tracks no single fact, so it can't show which of the table facts is slow, though Cito sells a separate bare-sum test to find exactly that |
| B. Section 8 as the owner wrote it: horizons, block priority, fact automaticity with the Volley, bare sums, a home scale, results and school goals, the Dutch bridge and the notation setting | It aims practice at the tested skills before the dates the parent enters, keeps the clock off the screen, and turns the parent's Cito results into data | It changes fourteen approved records and adds a projection whose item difficulties can't be separated from the player's growth. It also puts Dutch words into task text before the Dutch layer |
| C. The skill part only: fact automaticity, bare sums, working ahead and the results form, with no block priority, no school goals and no bridge | It gets most of the gain at a third of the change: facts and bare sums are what Cito's own analysis splits out | It still ignores the dates, and it leaves out the Dutch words the owner wants met before the M7 test, where the player reads every task in Dutch |

Option B leads, because it is the owner's instruction of 2026-09-28 and Cito's pages support each of its skill parts. The strongest case against B is that it can slide into drilling for the test, which Cito and RES-0010 both advise against. Three of its own rules keep it on the right side of that line. It copies no Cito item or format, and it shows the player no date and no word "test". Its only time-bound part, the horizon, changes the order of practice and never the tasks. Option B is chosen, because the owner's instruction of 2026-09-28 asks for it and the three rules above keep it clear of drilling. Option C stays as the fallback if the owner later withdraws the block priority or the bridge.

### Decided on 2026-09-28

The school-goal term doesn't stack with the lesson mark: where a confirmed school goal and a fresh lesson mark reach one node, the node scores the larger of `school_goal` and `parent_topic`, never both. This follows the rule ADR-0070 already sets for `recheck` and `parent_topic`, and it stops a school-and-lesson node from gaining 2.5 of extra value and crowding out the three-day window's reserve. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The parent may move the fact threshold only as a versioned, logged change, which keeps the intent of RES-1300 conclusions 3 and 7. This option changes no approved record, while a free parent control would supersede RES-1300 and a fixed threshold would amend the addendum. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The bridge's words live in `content/lexicon.nl.json` beside the glossary and pass the parent's approval through the glossary's queue, as RES-1300 sets for glossary words. One file gives one approval queue and one card, and each bridge word carries a mark of its own, so the parent's switch still hides every bridge word at once, as acceptance test 16 requires. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The printable list of facts that aren't yet automatic is allowed as a view of the heat map, not as a lesson plan. It orders no topics and sets no dates, and RES-2300 already shows the parent the same facts in the heat map, so the rule against a lesson plan needs no exception. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The Cito check button and `./tower cito-check` only report which Cito pages changed and which quotations no longer appear, and mark the affected rules "unconfirmed". A person judges whether a changed page changes a rule, because no approved model role does it and this keeps ADR-0100 unchanged. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Conclusions

1. Each statement about Cito that the game's logic or report text depends on must be stored in `content/cito.rules.json` as its own entry. The entry must hold the statement, the URL of the Cito page, a verbatim quotation and the date it was checked. An entry with no URL, or whose quotation no longer appears on its page, must carry the mark "unconfirmed", and the report must show that mark. The Parent Room's check button and `./tower cito-check` must only re-read each page, report the pages that changed and set this mark, and a person must judge whether a changed page changes a rule.
2. The first entries of `content/cito.rules.json` must be the ten claims this record confirms, with the quotations and the date 2026-09-28 given in the findings. The two unconfirmed claims, the parent's access to the bare-versus-context split and Cito's multiplication sign, must be stored as "unconfirmed" until a source confirms them.
3. The game must build the skills the M7 and E7 tests measure. It must not copy Cito items, reproduce Cito's item layout, run a mock test or show the player a test date or the word "test". No part of section 8 may show the player a time or reward speed.
4. The Parent Room must let the parent set a date for each horizon, defaulting to 2027-01-15 for M7 and 2027-05-15 for E7. After the parent enters a result for a horizon, the Director must work toward the next one.
5. Every record and screen that names a Cito test moment must use an identifier that can't be read as a graph node or a science topic, such as `cito:M7`.
6. Each node and subtype in `graph.yaml` must carry `citoBlock: 1..6` or `null`, with S and stretch nodes `null`, and ADR-0050 must be amended by a new record to add the field.
7. ADR-0070's value formula must gain `1.5 * block_priority(v)`, where priority is `(7 - citoBlock) / 6` until the block is ready and 0 after, and `1.0 * school_goal(v)` for goals the parent confirmed. A node that carries both a school goal and a lesson mark must score the larger of `school_goal` and `parent_topic`, never both. Both new terms must keep the flow corridor, the three-day window, the stretch cap and the honest-difficulty property, over a 60-day simulation.
8. A block must count as ready when at least 80 % of its nodes and subtypes are fluent or stable, and, for blocks 1 and 2, at least 90 % of their facts are automatic.
9. The knowledge model must track each basic fact in `content/facts.yaml` by its own `factId`, about 300 of them, in the states "doesn't know", "computes" and "automatic". A fact is automatic when it was right and no slower than the threshold on 2 of its last 3 shows, the last within 14 days. ADR-0060 must be amended by a new record to add this fact projection.
10. The fact threshold must default to 3 s from show to submit plus the motor correction. A change to it must be versioned and logged as RES-1300 requires, and the parent has no other control over it.
11. Every fact in `content/facts.yaml`, multiplying and dividing by 10, 100 and 1000 included, must take the small-space minimum time of the motor correction plus 600 ms and be exempt from the repeat window. RES-1100's small-space list must be superseded by a new record to match.
12. The Volley must show no time, reward only by accuracy, count an answer faster than its minimum time in neither "on target" nor the day's record, and keep a record that never falls. Its reply to a wrong answer must avoid every word in RES-3300's forbidden list, and must never be about the player.
13. The Volley must hold 8 to 10 facts in one window with one keyboard, about 1 in 3 of them not yet automatic. Before the M7 horizon it must replace the mental arithmetic tasks on 2 floors in 3 where blocks 1 and 2 hold facts that aren't automatic, and on fewer floors after it. ADR-0070 and RES-3900's conclusion 1 must be amended by new records to allow this.
14. RES-2100's list of star-yarn sources and ADR-0140's grant table must be amended by a new record to add the Volley's reward.
15. A fact must return one day after a wrong or slow answer, and otherwise at growing intervals.
16. Every template must declare `format: "bare" | "context"`. In nodes with both formats at least half of the scored tasks must be bare, and the report must show accuracy and fluency for each format apart. The Russian name for a bare sum must stay out of every text the player sees, as RES-3300 requires.
17. The report must show, by week and by error class, the share of first attempts that are wrong on nodes and facts that are fluent, stable or automatic. A week above 10 % must raise the observation of careless errors on familiar material.
18. Nodes at 1S up to the end of group 8 must open when their prerequisites are ready, and stretch nodes under their gate. The report must show what the player has mastered beyond the school's current work, and the game must still teach no lesson.
19. The home skill scale must be a projection of the log that changes no estimate, must be labelled in the report as not a Cito score. Its refit of item difficulties must pass acceptance test 13 on simulated pupils whose ability grows during the simulation.
20. The Parent Room must hold a form for Cito results. The form holds the moment, the test taken and its level, vaardigheidsscore, functioneringsniveau (including "<" and ">"), referentieniveau, the level on either the I to V or the A to E scale, the subject, an optional bare-versus-context split, an optional expected test advice and a note. The form must accept an empty value in every field the school might not share. The Parent Room must also carry a memo in Dutch listing what the parent can ask the school for, because the expert version and the bare-versus-context split sit on the teacher's side.
21. ADR-0180 must be amended by a new record to add the horizons, the results form, the school goals, the fact report with a 10 x 10 multiplication map and a division map, and the block readiness. RES-2300's 8x8 map must be superseded by a new record to allow 10 x 10.
22. The school's goal list must stay on the Mac. An offline catalogue on the Mac must map each goal to nodes, the parent must confirm each link, and a goal must change the Director only after that confirmation. No `GOALS_MODEL` role is added, so ADR-0100 doesn't change, and the entered Cito results must stay on the Mac as RES-2600 requires of reports.
23. The Dutch bridge must hold 30 to 50 key words, show them only in nodes the player already solves at "understands" or better without Dutch. Its mixed tasks must form a stream of their own that stays out of the "on her own" estimate through the MVP, and the bridge must disappear completely when the parent turns it off. RES-0800's definition of the Dutch layer, RES-0010 conclusion 6 and ADR-0190's rule that every task is in Russian must be superseded to name the bridge as the one exception, and the Dutch layer must stay out of the MVP.
24. Bridge words must live in `content/lexicon.nl.json` with a bridge mark, and each must pass the parent's approval through the glossary's queue before the player sees it, as RES-1300 requires of a glossary word.
25. The multiplication sign must be a parent setting with `×` as the default and `·` as the choice, with `:` for division and the decimal comma unchanged. RES-1200 conclusion 11 must be superseded by a new record to allow it, and ADR-0160 must be amended so that this one setting overrides the locale's notation profile.
26. The report must offer a printable list of the facts that aren't yet automatic, as a view of the heat map that orders no topics and sets no dates.
27. Each approved record this record names as changed must be corrected by a new record that names what it replaces, because approved records are frozen. The requirements built on a changed research conclusion must be replaced with it.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28 - section 8 and acceptance tests 9 to 14 and 16.
- [Veelgestelde vragen, Leerling in beeld - leerlingvolgsysteem](https://cito.nl/onderwijs/primair-onderwijs/leerling-in-beeld-leerlingvolgsysteem/veelgestelde-vragen/), read 2026-09-28 - the ability score, the skill test, practising, the expected advice's conditions, weighting and visibility.
- [Veelgestelde vragen, Cito](https://cito.nl/veelgestelde-vragen/), read 2026-09-28 - the group report's expert version, items not yet taught, practising and training, no time limit for the doorstroomtoets.
- [Jaarkalender, Leerling in beeld](https://cito.nl/onderwijs/primair-onderwijs/leerling-in-beeld-leerlingvolgsysteem/dit-volg-je/jaarkalender/), read 2026-09-28 - the advised periods and the school's choice of dates.
- [Jaarkalender Leerling in beeld 2026-2027 (PDF)](https://cito.nl/media/lh0ahvh4/lib-jaarkalender_2026-2027.pdf), read 2026-09-28 - the norm periods and the marks of the advised periods for 2026-2027.
- [Verwacht toetsadvies](https://cito.nl/onderwijs/primair-onderwijs/leerling-in-beeld-leerlingvolgsysteem/rapportages/verwacht-toetsadvies/), read 2026-09-28 - the three tests at E7, the Taalverzorging parts, the double advice.
- [Toetsen op maat en digitaal adaptief toetsen, hoe zit dat?](https://cito.nl/onderwijs/primair-onderwijs/toetsen-op-maat/), read 2026-09-28 - the adaptive second part and its range, tests at another level.
- [Rekenen-wiskunde, Leerling in beeld](https://cito.nl/onderwijs/primair-onderwijs/leerling-in-beeld-leerlingvolgsysteem/dit-volg-je/rekenen-wiskunde/), read 2026-09-28 - half the items bare, the formal and functional analysis, no time limit, testing outside the advised periods.
- [Rekenen-Basisbewerkingen](https://cito.nl/onderwijs/primair-onderwijs/leerling-in-beeld-leerlingvolgsysteem/dit-volg-je/rekenen-basisbewerkingen/), read 2026-09-28 - Cito's separate bare-sum test for automaticity.
- [Rapportages, Leerling in beeld](https://cito.nl/onderwijs/primair-onderwijs/leerling-in-beeld-leerlingvolgsysteem/rapportages/), read 2026-09-28 - the report's fields.
- [De groei van je kind in beeld, leeswijzer rapportage voor ouders (PDF)](https://cito.nl/media/1kylbcyc/de-groei-van-je-kind-in-beeld-leeswijzer-rapportage-voor-ouders-leerling-in-beeld-def.pdf), read 2026-09-28 - the functioning level and the I to V or A to E level the parent sees.
- [Leeswijzer leerlingprofiel voor ouders (PDF)](https://cito.nl/media/yknofnp2/leeswijzer-leerlingprofiel-voor-ouders-leerling-in-beeld.pdf), read 2026-09-28 - reference levels from E6, "<" and ">", the ability score and growth in the pupil profile.
- [Wetenschappelijke verantwoording Rekenen-Wiskunde 3.0 voor groep 7 (PDF)](https://cito.nl/media/ehxhkvmw/6-cito-lvs-rekwisk-3-0-gr7-wet-verantwoording.pdf), Hop, Janssen and Engelen, read 2026-09-28 - OPLM in place of Rasch, the context and bare items of M7 and E7, the tasks of E7, the notation of one item description.
- ADR-0050, ADR-0060, ADR-0070, ADR-0090, ADR-0100, ADR-0140, ADR-0160, ADR-0180 and ADR-0190, at revision `47c0a7b`, read 2026-09-28 - the fields, formula, estimates, rewards, roles, locale and scope each finding above names.
- RES-0010, RES-0300, RES-0800, RES-0900, RES-1000, RES-1100, RES-1200, RES-1300, RES-2100, RES-2300, RES-2600, RES-3300 and RES-3900, at revision `47c0a7b`, read 2026-09-28 - the principles, the Dutch layer, the thresholds, the small spaces, the yarn sources, the heat map and the forbidden words.
