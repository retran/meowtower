---
id: RES-4311
artifact: research
status: approved
revised: 2026-10-31
elaborates: RES-1000
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A node's stage can come from its estimate, set difficulty by the groups of its templates and fall safely with two lines and three observations, and the character's rank rolls up from the stages

## Summary

Each node's stage should be a named band over its estimate, with a higher line to rise than to fall and at least three observations in a row below the lower line before a fall. On the game's own model parameters, a player with steady 90 % recall changes stage 17 times in 180 days without that rule and 0.5 times with it, and a real drop in recall still shows within 12 days at a task every two days. Difficulty can follow the stage, because 66 of the 79 nodes hold templates for two or more Dutch groups, and the 221 olympiad templates sit on 78 nodes, so an olympiad stage exists on nearly every node. The literature supports the parts of this design that show progress, give informational feedback and space practice, and it doesn't support a precise target share, a mix of task shares or any claim about how a primary-school child takes a visible fall: no study found tests demotion in a learning game with children. Rewards tied to the fall carry the known risks: tangible rewards undermine children's intrinsic motivation (d = -0.39), and praise for ability makes a setback worse. Four approved records conflict with the owner's decisions and must change: the canon's rank that never falls, the requirement that earned progress never shrinks, the principle that only the parent sees estimates, and the experience count with its level, which the owner removed because every progression value now comes from the nodes. This record covers stages, difficulty, falls, the roll-up and what the child sees. It leaves the stage names, the Director's code and the dashboards to the steps after it.

## The question

The owner decided on 2026-10-31 that a level comes from the state of the knowledge graph and sets task difficulty, so it may fall; that a fall shows as an event with a cause and a way back; that items, titles and opened floors stay; that one error doesn't move a level; that ranks follow Dutch groups (E groups 1 to 3, D 4, C 5, B 6, A 7 and 8) with S for confident olympiad solving; that each node's difficulty comes from that node's own level; that the node's estimate is primary, with the level as its readable form inside the setting; and that the game accumulates no experience, so everything is computed from the levels on the nodes. Holidays stay out for now. Those decisions are constraints. The questions are how a stage comes from the estimate, how it maps to tasks, how it falls, how stages roll up into the rank and what the child sees.

Three assumptions needed a challenge. The first is that a visible fall is safe for a child, which the evidence neither confirms nor refutes. The second is that one target accuracy exists, usually quoted as 85 %, which the source doesn't establish for children's maths. The third is that a stage changes rarely enough to be a landmark: without a rule it changes about every ten days for a player who isn't changing at all, as the measurement below shows.

## Method

Repository read on 2026-10-31 at revision 3394f32: `project/research/RES-0010`, `RES-0800`, `RES-0900`, `RES-1000`; ADR-0060, ADR-0070, ADR-0140, ADR-0400; SPC-0060, SPC-0070, SPC-0140; CAN-0070; `content/graph.yaml`, `content/model.v1.json`; `src/engine/model/bkt.ts`, `params.ts`; `src/templates/index.ts`, `spec.ts`.

Two measurements ran on 2026-10-31 from throwaway scripts, which stay out of the repository:

- A count over the live template registry, importing `templates` from `src/templates/index.ts`: origin, groups and forms per node.
- A simulation of one node and subtype through `applyObservation` from `src/engine/model/bkt.ts` with `content/model.v1.json`: free-input two-step tasks, no feedback step, 180 days, 2000 runs for each case. The stage lines are 0.35, 0.6, 0.8 and 0.92, which I chose for the test and which no source supports. A rule "band b, need n" rises at a line at once and falls after n observations in a row sit below the line minus b.

External sources carry one of three labels in Sources. Read means I read the text. Abstract means I read the abstract or a named passage. Snippet means I saw only a search result's summary of the source, so a claim from it is weaker, and each one is marked in the finding that uses it. The first draft of this study, by a research agent, read two external sources because most fetches failed. I repeated the search by direct search and text extraction from PDF files, and the list under "Could not obtain" is what still failed.

No test ran with the player, so nothing below shows that a stage helps her.

## Findings

### Without a rule a stage changes about every ten days for a player who isn't changing

Simulation, changes of stage in 180 days, on the model's parameters (`pSlipMin` 0.1, `pGuessFree` 0.03, `pLearnPractice` 0.05, half-life from 60 days):

| Rule | Recall 0.90, a task every 2 days | Recall 0.75, every 2 days | Recall 0.90, every 7 days | True drop 0.9 to 0.4 at day 90: days to first fall, every 2 / 7 days |
| --- | --- | --- | --- | --- |
| No rule | 17.0 | 38.6 | 5.0 | 0 / 1 |
| Band 0.1, need 1 | 17.1 | 39.8 | 2.3 | 0 / 8 |
| Band 0.1, need 3 | 0.5 | 3.6 | 0.3 | 12 / 36 |
| Band 0.15, need 3 | 0.4 | 3.0 | 0.3 | 12 / 36 |
| Band 0.15, need 5 | 0.2 | 1.0 | 0.2 | 22 / 50 |

The count of observations does the work and the band adds little: a band alone leaves 17 changes, and three observations in a row cut them to about 0.5. At need 5 and a task every 7 days, a true drop shows in only 60 % of runs. Need 3 finds it in 100 % of runs at 2 days and about 85 % at 7 days, so need 3 is the point that stays calm and still notices. These figures depend on the assumed lines and on a fixed recall, and a real player's recall isn't fixed.

### A stage from the estimate needs its own rule, because the parent's states come from counted checks

The report's states come from explicit rules over counted attempts and never from `pKnow`, so the parent can check each one against its rule (ADR-0060, SPC-0060). The owner's stage reads the estimate. Both can stand if the stage is stored with the identifier of its rule and the parent's states keep their rules, which leaves two readings of one node. They will sometimes disagree, because a state counts timed checks and an estimate counts every answer.

### Difficulty inside a node can follow the Dutch groups of its templates

The registry holds 1851 templates on 79 nodes. Each template names its `groups`. 13 nodes span one group, 20 span two, 27 span three and 19 span four to six, so 66 nodes have a range a stage can move along. On the other 13 only form and step count can vary. A template has a single form in most cases, which makes the count of templates per form no measure of difficulty. Steps are the only per-template difficulty the model already reads, through `pSlip` (`src/engine/model/params.ts`). No record orders a node's templates by difficulty, so an order must be built and checked.

### Olympiad tasks exist on nearly every node and lean to the top groups

221 templates carry `origin: { olympiad }`, on 78 of 79 nodes, and 181 carry `origin: { extension }`. Counting a template once for each group it names, olympiad templates fall on group 8 192 times, on group 7 82 times, on group 6 90 times and on group 5 54 times, and on groups 2 to 4 only 24 times. So a top stage can exist per node, but a rank S that requires olympiad solving has about 3 templates a node, which limits repetition before a player has seen them all.

### The Dutch levels give a real target for the ranks, and they sit at group 8

For primary school the reference levels in arithmetic are 1F, the fundamental minimum, and 1S, the target level (Kamerstukken and SLO, snippet). SLO's 2024 factsheet reports 82 % of pupils at 1F and 33 % at 1S against ambitions of 85 % and 65 % (snippet; the file itself returned 404). The ranks' mapping to groups therefore has an external check for A, but none for D, C or B, where the record has only the groups RES-0800 assigned. The Kangoeroe contest offers wizFUN for groups 3 and 4, wizKID for 5 and 6 and wizSMART for 7 and 8 (W4Kangoeroe documents, snippet, mostly from 2001 to 2008), which is a Dutch reference for an olympiad-level stage by age. I couldn't confirm the current categories.

### Word problems stay part of the skill, and the Dutch evidence doesn't say they measure only reading

Hickendorff gave 685 pupils in group 8 the same sum as a bare sum and as a context problem and found no difference, including for weaker readers and pupils who don't speak Dutch at home (Leiden University page, read). Hickendorff (2013) reports a larger language effect on applied problem solving than on computation (snippet). These pull in different directions, so the record can't say how much of a word problem's result is reading. Word-problem nodes T1 to T4 are graph nodes, so they enter any roll-up, and a room slot never names them because the Guardian alone uses them (SPC-0070). The owner wants reading trained, so a roll-up that skips T would leave the skill the family cares about outside the rank.

### The 85 % figure doesn't carry over to a child's maths

Wilson and colleagues derive an optimal error of 15.87 % for stochastic gradient descent on binary classification with Gaussian noise, and show it in artificial networks and a model of monkey perceptual learning, with no new human experiment (read). The value moves to about 82 % or 75 % under other noise, and the authors leave multi-category tasks open and say not all models have a sweet spot. Wilson told the press the work covered simple right-or-wrong tasks and declined to extend it to grades. So the 85 % doesn't replace the Director's corridor of 70 to 80 % (SPC-0070), and nothing I read gives a better number for it. The corridor stays as a choice of the record.

### A proposed mix of task shares has no evidence and a rival rule in force

The mix of 60 % at level, 25 % review, 10 % stretch and 5 % other that I proposed in discussion has no source. It also names no denominator and competes with the corridor, which already splits slots by the recent success share (SPC-0070). Baumann, Lürig and Engeser found with 93 participants that constant balance was not best: dynamic pacing with short breaks gave more flow and enjoyment (abstract). They studied adults in a computer game, so this supports varying difficulty within a session and no share in particular.

### Practice over time and mixed practice hold, with a smaller effect in maths

Dunlosky and colleagues rate practice testing and distributed practice as the two high-utility techniques of ten (snippet). Cepeda and colleagues, over 839 assessments, find that the gap giving maximal retention grows with the retention interval (abstract). Their account of Moss (1996) says only a third of intellectual-skill studies such as maths computation showed a spacing benefit and half showed none, against over 80 % for verbal and motor tasks (read). Brunmair and Richter find interleaving at g = 0.42 overall and g = 0.34 for mathematical tasks, stronger for material similar between categories and more complex material, with advice of caution for expository texts (abstract). So the review ladder is supported, with a smaller gain than language-learning figures suggest, and a stage that mixes similar kinds of task has some support.

### Mastery learning helps, and the famous figures overstate it

Bloom's 2 sigma rests mostly on two small three-week dissertations, with tests narrow to what was taught and with extra quizzes that von Hippel estimates carry about half the effect (read). Later tutoring meta-analyses give 0.33 to 0.37 standard deviations. Kulik and Fletcher report a median 0.66 for intelligent tutoring across 50 evaluations, and a citing source gives 0.13 on standardized tests (snippet). So a stage model may expect a modest effect on broad tests, and an effect on the game's own tasks proves little.

### Showing progress is supported, and rewards on top of it carry a known cost

Over 128 studies, Deci, Koestner and Ryan find that positive feedback raised free-choice motivation overall (d = 0.33), but for children it was not significant (d = 0.11, 7 studies) against d = 0.43 for college students (read). Tangible rewards hurt children more than students: d = -0.39 across 57 studies against d = -0.27, and engagement-contingent rewards d = -0.46 for children (read). Self-determination theory names autonomy, competence and relatedness as the basic needs (read). A stage that reports competence fits this, and a stage that pays out items for itself falls into the tangible-reward case. Hattie and Timperley's article opens with feedback having strong effects either way, and Kluger and DeNisi find about a third of feedback effects negative (both snippet). So feedback must be designed; it isn't safe by default.

### A setback reads worse when praise named ability

Mueller and Dweck ran six studies with children aged 9 to 12. After failure, those praised for intelligence wanted to persist less (M = 3.25 against 4.53 for effort praise), enjoyed the tasks less (M = 4.11 against 4.89) and did worse, and they attributed failure more to low ability (read). This is the closest evidence to a visible fall. It suggests that a rank saying what she is, and a congratulation naming ability, set up the bad reading of a fall, while a stage describing what the threads have done doesn't. Sisk and colleagues find weak overall effects for mindset interventions, with benefit for low-status or at-risk students (snippet), so this supports a wording choice and no belief-training feature.

### Gamification helps on average, and its long-run and loss evidence is thin

Hamari, Koivisto and Sarsa review 24 empirical studies: most report positive results for some elements, only two for all, and they raise novelty effects and possible harm when gamification is removed, perhaps through loss aversion (read). Hanus and Fox find less motivation and satisfaction over a semester in the gamified course (snippet). Sailer and Homner report g of about 0.49 for cognitive outcomes (snippet, the full text refused). Bottom-of-board students were discouraged in small course studies (snippet). All of these concern older students or adults, and all of them concern competition with others, which this game doesn't have.

### No study found tests a visible fall with children

Searches for demotion, level loss, loss framing and leagues in learning with children found no controlled study, and nothing on Duolingo's leagues. This is a gap in what I found, not evidence that a fall is harmless. Practice in products exists: Khan Academy moves a skill down after a score under 70 %, from Mastered to Familiar in one step in the versions described (snippet; its help page refused), and Duolingo's strength bars decay until the learner practises, a design its author presents as a memory aid and a prompt to practise (read, 2016). League of Legends protects players at the tier boundary with extra games before demotion and a warning icon (snippet of wikis and blogs). These show that a visible fall is common and that a warning before it is a known pattern, and they say nothing of its effect on a child.

### Progress near a goal raises effort, and the story can carry the mechanic

Nunes and Drèze gave half of car-wash customers two free stamps, and 34 % against 19 % completed the card (snippet). Kivetz and colleagues found faster effort near a goal (snippet). Habgood and Ainsworth found children learned more from the version of Zombie Division where the maths was the combat, and played it 7 times longer in free time (snippet). Malone and Lepper name challenge, curiosity, control and fantasy (snippet). So a stage should sit inside the setting's mechanic and show the distance to its next line. Consumer studies carry over to children only as an analogy. A flow model of games leans on player choice of difficulty (Chen), which I couldn't read.

### Four approved records conflict with the owner's decisions

- CAN-0070 says "A rank never goes down", and it ties rank changes to campaign milestones and to a solemn scene. A rank that falls with the graph contradicts this, and S there means the Keeper, with the right to knit new rows of the Tower, which differs from solving olympiad tasks.
- SPC-0140 states an approved requirement that experience, level, rank and other earned progress never shrink after an answer, a mistake or a missed day.
- RES-0010 and its principle state that only the parent sees skill estimates. A visible stage with a named cause shows a coarse estimate to the child.
- "Level" names the experience level `L` of SPC-0140, the referentieniveau field of `content/graph.yaml`, and now the owner's level. A reader assumes one word names one thing.

No rule subtracts items, currencies, friendship or pages (SPC-0140), which already matches the owner's rule that these stay.

## Conclusions

1. Each node holds a stage, a named band over its estimate, stored with its rule's identifier. The parent's states keep their counted rules (ADR-0060), and the stage makes no parent-facing claim beyond its rule.
2. A stage rises when the estimate crosses its line, and falls only after three observations in a row sit at least 0.1 below that line. The lines stay provisional until a replay of the player's own log checks them, because the tested lines were my assumption.
3. Task difficulty inside a node follows the stage through the groups and steps of the node's templates, and the 13 nodes spanning one group use steps alone.
4. The Director keeps the corridor of 70 to 80 % and its slot sources; the stage changes which templates are candidates and not the share of slots. The mix of 60, 25, 10 and 5 isn't adopted.
5. A node's top stage is reached on its olympiad templates, because 78 of 79 nodes hold them.
6. The rank is a roll-up: a rank holds when the weighted nodes of its Dutch groups, word-problem nodes included, reach a stated stage, and rank S adds olympiad stages. The share and the hysteresis of the roll-up are set in the design, using the same rule of a higher line to rise and repeated evidence to fall.
7. The rank falls only as a rare event, and the design must show from a simulation that a steady player sees no fall of rank in a school year.
8. The game shows a fall as a story event in the setting, with what changed in the threads and the way back, before or as it happens. It never names ability, never uses the forbidden words of CAN-0010 and never says what the child is, because ability language worsens a setback.
9. A warning comes before a stage falls, because that is the pattern products use and because it hands the player a chance to act.
10. A fall takes no item, title, opened floor, currency, friendship or page.
11. A stage or rank pays no tangible reward for its own sake, and only a story scene marks it, because tangible rewards undermine children's motivation; the existing rewards for play stay.
12. The game accumulates no experience: the experience count, its level `L` and their `level_up` events go, and every progression value is computed from the node stages, as the owner decided on 2026-10-31. The word "level" then goes to one thing, the character's value computed from the stages, which is the rank, while the graph's field stays the referentieniveau, spelled in full. A node's value is a "stage".
13. The change needs the owner's approved change to CAN-0070, a withdrawal of the never-shrinks requirement for level and rank, a withdrawal of the experience rules of SPC-0140 and ADR-0140 and a revision of the parent-only principle, so a child sees a stage and never a number.
14. Evaluation stays internal: a replay of the log, a count of falls and the first-month review, with the parent watching how she takes the first fall. No claim of a learning effect stands without a control, which one player can't give.
15. If the first falls visibly upset her, the parent can hide falls of rank while stages keep working, because no evidence shows this is safe and the fall is the riskiest part of the design.

## Sources

Read in text or the named passage, 2026-10-31:

- [Wilson, Shenhav, Straccia and Cohen 2019, The Eighty Five Percent Rule for optimal learning, Nature Communications 10, 4646](https://pmc.ncbi.nlm.nih.gov/articles/PMC6831579), read - the 15.87 %, its assumptions and limits. Read 2026-10-31.
- [ScienceDaily on Wilson 2019](https://www.sciencedaily.com/releases/2019/11/191105113457.htm), read - Wilson's own limits on the result. Read 2026-10-31.
- [Deci, Koestner and Ryan 1999, Psychological Bulletin 125(6)](https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf), read in the passages cited - rewards and feedback by age. Read 2026-10-31.
- [Mueller and Dweck 1998, Journal of Personality and Social Psychology 75(1)](https://www.columbia.edu/cu/psychology/courses/3615/Readings/Mueller_Dweck.pdf), read in the passages cited - praise and setbacks, ages 9 to 12. Read 2026-10-31.
- [Cepeda, Pashler, Vul, Wixted and Rohrer 2006, Psychological Bulletin 132(3)](https://www.evullab.org/pdf/CepedaPashlerVulWixtedRohrer-PB-2006.pdf), abstract and its account of Moss 1996 - spacing and maths computation. Read 2026-10-31.
- [Brunmair and Richter 2019, Psychological Bulletin, accepted manuscript](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf), abstract - interleaving effects. Read 2026-10-31.
- [Baumann, Lürig and Engeser 2016, Motivation and Emotion 40](https://www.uni-trier.de/fileadmin/fb1/prof/PSY/PGA/unterlagen/BaumannL%C3%BCrigEngeser_Flow_MOEM_2016.pdf), abstract and participants - constant balance against dynamic pacing. Read 2026-10-31.
- [Hamari, Koivisto and Sarsa 2014, HICSS 47](https://www.lescahiersdelinnovation.com/wp-content/uploads/2019/06/2014-hamari_et_al-does_gamification_work.pdf), read in the passages cited - 24 studies, novelty and removal. Read 2026-10-31.
- [Hickendorff, De ontkrachting van mythes rondom het rekenonderwijs, Leiden University, undated](https://www.universiteitleiden.nl/wetenschapsdossiers/optimaal-onderwijs/mythes-rondom-het-rekenonderwijs), read - context problems in group 8. Read 2026-10-31.
- [von Hippel 2024, Two-Sigma Tutoring, Education Next 24(2)](https://www.educationnext.org/two-sigma-tutoring-separating-science-fiction-from-science-fact/), read - what Bloom's figure rested on, and later tutoring effects. Read 2026-10-31.
- [Settles, How we learn how you learn, Duolingo, 2016-12-14](https://blog.duolingo.com/how-we-learn-how-you-learn), read - strength meters. Read 2026-10-31.
- [Self-Determination Theory, Theory page](https://selfdeterminationtheory.org/theory/), read - the three needs. Read 2026-10-31.
- [Nemeth and colleagues 2019, Corrigendum, Frontiers in Psychology](https://www.frontiersin.org/articles/10.3389/fpsyg.2019.02296/pdf), read - that conference versions of Brunmair and Richter showed no maths effect and the published version a small one. Read 2026-10-31.

Seen only through a search result's summary, 2026-10-31:

- [Dunlosky and colleagues 2013, Psychological Science in the Public Interest 14(1)](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html) - utility ratings. Read 2026-10-31.
- [Kulik and Fletcher 2016, Review of Educational Research 86(1)](https://journals.sagepub.com/doi/abs/10.3102/0034654315581420) - median 0.66; [a later meta-analysis citing it](https://arxiv.org/pdf/2511.04997) - 0.13 on standardized tests. Read 2026-10-31.
- [Sailer and Homner 2020, Educational Psychology Review 32](https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/index/index/docId/109056) - gamification effects. Read 2026-10-31.
- [Huang, Ritzhaupt and colleagues 2020, Educational Technology Research and Development 68](https://springerlink.bibliotecabuap.elogim.com/content/pdf/10.1007/s11423-020-09807-z.pdf) - g = 0.464, not used in a conclusion. Read 2026-10-31.
- [Hanus and Fox 2015, Computers and Education](https://doi.org/10.1016/j.compedu.2014.08.019) - decline over a semester. Read 2026-10-31.
- [Sisk and colleagues 2018, Psychological Science](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf) - weak mindset effects; [Yeager and colleagues 2019, Nature](https://www.hks.harvard.edu/publications/national-experiment-reveals-where-growth-mindset-improves-achievement) - gains among lower achievers, not used in a conclusion. Read 2026-10-31.
- [Hattie and Timperley 2007, Review of Educational Research 77(1)](https://doi.org/10.3102/003465430298487) - feedback either way; [Kluger and DeNisi 1996 through a summary](https://researchschool.org.uk/sandringham/news/effective-feedback-the-research-evidence) - a third of effects negative. Read 2026-10-31.
- [Bjork and Bjork 2011](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf) and [Soderstrom and Bjork 2015, through Firth](https://firth.substack.com/p/jonathan-firth-s-memory-metacognition-updates-9-desirable-difficulties-1206398) - desirable difficulty and practice results as a poor index of learning, not used in a conclusion. Read 2026-10-31.
- [Hickendorff 2013, Applied Measurement in Education 26(4)](https://informahealthcare.com/doi/abs/10.1080/08957347.2013.824451) - language effect on applied problems. Read 2026-10-31.
- [Nunes and Drèze 2006, Journal of Consumer Research](https://msbfile03.usc.edu/digitalmeasures/jnunes/intellcont/Endowed%20Progress%20Effect-1.pdf) - endowed progress; Kivetz, Urminsky and Zheng 2006 - goal gradient, through the same search. Read 2026-10-31.
- [Habgood and Ainsworth 2011, Journal of the Learning Sciences, through a repository entry](https://nottingham-repository.worktribe.com/output/23577510) - intrinsic integration; [Malone and Lepper 1987, through a summary](https://pressbooks.pub/learningenvironmentsdesign/?p=80) - four motivations. Read 2026-10-31.
- [Khan Academy, How do mastery levels work?](https://support.khanacademy.org/hc/bg/articles/5548760867853) and [its 2018 mastery update](https://support.khanacademy.org/hc/de/community/posts/360023249611/comments/360003245051) - levels and how they fall; the rules may have changed. Read 2026-10-31.
- [League of Legends tier-loss protection, through a wiki and blogs](https://leagueoflegends.fandom.com/wiki/File:Season_2022_-_Iron.png) and [Valorant rank shields](https://wecoach.gg/blog/article/how-do-valorant-rank-shields-work) - protection patterns, no evidence of effect. Read 2026-10-31.
- [Rapport Peil Taal en rekenen 2021-2022](https://www.onderwijsinspectie.nl/binaries/onderwijsinspectie/documenten/rapporten/2023/05/10/peil-taal-en-rekenen-2021-2022/Rapport+Peil+Taal+en+rekenen+2021-2022.pdf), [SLO startnotitie](https://elbd.sites.uu.nl/wp-content/uploads/sites/108/2022/02/startnotitie_kerndoelen_rekenen_en_wiskunde.pdf) and [SLO factsheet 2024](https://www.slo.nl/publish/pages/21551/factsheet-basisvaardigheden-rekenen-en-wiskunde-2024.pdf) - 1F and 1S and the shares; the same search's Kamerstukken state the two levels for the end of primary school. Read 2026-10-31.
- [W4Kangoeroe documents](https://w4kangoeroe.nl/kangoeroe/index.php/download_file/view/393/405) - Kangoeroe categories by group. Read 2026-10-31.
- Studies of leaderboards that discourage low-ranked students: [a relative leaderboard study](https://hub.hku.hk/bitstream/10722/368255/1/content.pdf) and [a thesis](https://research.usq.edu.au/download/7c0465609f76e20d1b49e9e63c481a1fedb32f72b0c84ad2074576702c719e64/5091829/Full%20thesis%20Philpott%20Final.pdf). Read 2026-10-31.
- [Marsh and colleagues on the big-fish-little-pond effect, a 2008 review](https://link.springer.com/doi/10.1007/s10648-008-9075-6) - social comparison, not used because the game has no peers. Read 2026-10-31.
- [Walden dissertation on Prodigy](https://scholarworks.waldenu.edu/dissertations/13230) and [Prodigy's own reports](https://prodigygame.com/research) - no significant effect in the independent study, vendor correlations otherwise, not used in a conclusion. Read 2026-10-31.

Repository, revision 3394f32: the files under Method. Carried from those records and unread by me: Corbett and Anderson 1995, van de Sande 2013, Pardos and Heffernan 2010, Aleven and colleagues 2006, Xiong and Beck.

### Could not obtain

Tried on 2026-10-31 without a readable text:

- Bloom 1984, Educational Researcher: HTTP 403; known here through von Hippel. Tried 2026-10-31.
- Roediger and Karpicke 2006: HTTP 403. Tried 2026-10-31.
- Cerasoli and colleagues 2014: a cookie page. Tried 2026-10-31.
- Sailer and Homner full text: connection refused. Tried 2026-10-31.
- Hattie and Timperley 2007 full text: certificate error. Tried 2026-10-31.
- Chen 2007, Flow in Games: certificate rejected. Tried 2026-10-31.
- Habgood and Ainsworth full text: access denied. Tried 2026-10-31.
- SLO factsheet 2024: HTTP 404. Tried 2026-10-31.
- Khan Academy help page: HTTP 403. Tried 2026-10-31.
- Corbett and Anderson 1995: connection refused. Tried 2026-10-31.
- Kangoeroe's current site: connection refused. Tried 2026-10-31.

Searched and not found: Rohrer and Taylor's fourth-grade study (citations only, so it isn't used), Kulik, Kulik and Bangert-Drowns 1990, Koster's learning loop, Csikszentmihalyi at first hand, Schell, Vygotsky, Duolingo's leagues and crowns, DragonBox and Khan Academy evaluations, Ryan, Rigby and Przybylski 2006, Fryer 2012, Levitt 2016, and any controlled study of a fall or demotion with children.
