---
id: RES-4313
artifact: research
status: approved
revised: 2026-11-01
elaborates: RES-2300
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Parent Room needs one front page that answers what changed and what to do this week, with the full report one click below

## Summary

The Parent Room shows everything and answers little: it opens on play and spend figures for the owner, and its nine report screens need reading. The parent needs one front page answering five questions: how is she, what changed since I last looked, what should I do this week, where does she stand against the Dutch goals, and where is she in the story. The evidence favours this: information to parents works when it leads to an action, and parents' help works when it supports autonomy, praises effort and stays warm; frequent homework help from an anxious parent harms. So the page proposes at most 3 actions, each a conversation or a lesson and never a drill, and it compares her only with her own past and the Dutch goals. Intervals appear in words and ranges, because lay readers misread error bars. No study found tests a parent dashboard for primary pupils at home, so every layout choice here is a proposal. This record leaves the report's screens as they are and adds the page above them.

## The question

What should a parent see first, now that the game has ability levels, rank, falls, gates, arcs and episodes, and how must that page change the Parent Room? The owner asked on 2026-10-31 for a parent dashboard to be designed now, with records updated.

The assumption to challenge is that more information helps a parent. The report already refuses to hide anything, and it holds nine screens. A parent who has to read them to learn that one thing changed won't read them weekly, and a parent shown a falling number may press the child.

## Method

Repository read on 2026-11-01 at revision bbd5629: SPC-0180, ADR-0180, ADR-0390, RES-2300's title, ADR-3220 to ADR-3240, SPC-0460, `src/server/admin.ts` and `src/server/parent-room.ts` by outline.

External sources carry labels. Read means I read the text or a page reporting it directly. Snippet means I saw only a search result's summary. No test ran with the parent.

## Findings

### The Parent Room has an owner's front page and a deep report

[Read] SPC-0180: the room opens on figures of play and model spend above the frame counts, then the game audit and the model audit. The report has nine screens, with a Summary at the front holding the estimate matrix, counts by state, the frontier, a line per limit and more. It offers no setting that hides a node, a dimension or a figure from the parent. So what's missing isn't data. Nothing states what changed, nothing proposes an action, and levels, rank, gates and the story have no place yet except the list of falls.

### Information helps a parent when it leads to an action

[Read] Bergman and Chan: 1,137 parents in 22 schools got automated alerts on missed work, absences and low averages. Failed classes fell by 27 % and attendance rose by 12 %, with no effect on standardized tests. These were older pupils in a low-income district, and each message named a concrete lapse. [Snippet] Jivet argues that a dashboard must help people decide and act, and that awareness isn't enough; a review found that the hoped-for gains in performance didn't appear from display alone. [Inference] A number with no suggested next step does little, and a list of lapses suits teenagers better than a child who plays daily, so the page should point to what to do.

### How a parent helps matters more than how much

[Snippet] Pomerantz, Moorman and Litwack: involvement helps when it supports autonomy, focuses on effort, carries positive affect and conveys positive beliefs about ability, and the reverse pulls achievement down. [Snippet] Grolnick and Pomerantz agree. [Snippet] Wilder's synthesis of nine meta-analyses finds expectations most strongly linked to achievement and homework help most weakly. [Read] Maloney and colleagues: 438 children in first and second grade; children of maths-anxious parents learned less and grew more anxious, only when those parents often helped with homework. The authors call for better ways to help, and for books, games and apps that let parents engage positively. [Read, RES-4311] Praise for ability worsens a setback.

[Inference] The page's actions should be talk, play and lessons the parent chose, not drill. Its words must keep a fall from turning into pressure.

### Only her own past and the goals are fair comparisons

[Snippet] Reviews of learner dashboards report that peer comparison isn't perceived positively by all and can give misguided frames of reference. [Read] The profile already may not rank or compare her with other children. [Read, RES-4311] 1F and 1S and the groups give an external goal.

### Lay readers misread intervals

[Read] Hullman, Resnick and Adar: with 288 participants, error bars gave mean absolute errors of at least 36 percentage points in judging which of two quantities is higher. [Snippet] Lay and expert readers both misread intervals, and readers treat forecasts as fixed values. [Inference] The front page should state certainty in words, and show a range only as a plain band, with the exact interval on the node card, where it is now.

### A dashboard is one screen for monitoring, with detail behind it

[Snippet] Few defines a dashboard as a single screen of the most important information, for monitoring at a glance and not for exploration. Others dispute the one-screen rule on phones. [Snippet] Commercial learning products show parents progress, time and weekly reports; a few send them weekly by email. These show practice and no effect. [Inference] The page answers the questions first, and each answer links to the screen that proves it, so nothing is hidden and nothing competes.

### No study fits this case

[Snippet] The searches found reviews of learner and advisor dashboards and none on parents of primary pupils at home. Valle and colleagues note that affect and motivation are largely overlooked in dashboard research. This is a gap.

### The page has five questions and one for the owner

[Proposal] Layout, top to bottom on one screen:

| Block | Question | Content | Link |
| --- | --- | --- | --- |
| This week | How is she? | Days played, active time, long days, and signals: tiredness, «Мне страшно», refusal, raised mode, in words | Summary, limits |
| Since you last looked | What changed? | Up to 7 lines: rises, falls, rank, gates, new traps, retention results, ordered by weight | Node card, list of falls |
| Do this week | What should I do? | Up to 3 actions from fixed rules, each with why and how | The screen it rests on |
| Against the goals | Where does she stand? | Rank, 1F and 1S coverage, VWO readiness, change against 4 weeks ago, with certainty in words | VWO readiness, graph map |
| Abilities | What is strong or weak? | 79 abilities as a map by floor, colour by level, a mark on falls and unknowns | Node card |
| In the story | Where is she? | Season, world date, arc, last episode in 3 lines, next hook, with episode marks | Story book |
| Owner's line | Does the game work? | Spend, generation failures, alarms, one line | Audit tab |

Rules: lines come from fixed templates over data, with no model, so a claim always traces to a rule. An unread change stays until seen, which needs a seen marker per parent. Where a level and a state disagree, the card shows both and says why in one line. A fall reads as what happened and what helps, with no alarm colour unless a limit fired.

Actions, each from a rule: talk about something she enjoyed; plan a lesson on a node at the frontier with «на пороге»; a recheck after a lesson; play a maths game offline on a domain; notice effort on a mended ability; rest after long days; talk to her if she pressed «Мне страшно». None asks the parent to drill or to tell her of a level she can see herself. Each carries a line on how to say it, in the words of the memo the Parent Room already holds.

[Proposal] The owner and the parent are one person now, so the owner's line stays small. The audit moves to a tab.

## Conclusions

1. The Parent Room opens on one front page, and the audits move to their own tab.
2. The page states how she is this week, what changed since last seen, what to do, where she stands against the goals, her abilities by floor and her place in the story.
3. Each line on the page comes from a stated rule over the log, with no model, and links to the screen that proves it.
4. The page proposes at most 3 actions a week, and none asks for drill.
5. The page compares her only with her own past and the Dutch goals.
6. The page states certainty in words on the front page and leaves intervals to the node card.
7. A fall on the page says what happened and what helps, and shows no alarm unless a limit fired.
8. A change stays on the page until the parent has seen it.
9. Where a level and a state disagree, the card shows both and why.
10. The report's screens stay, and nothing the report shows is hidden.
11. The first month tests whether the parent acts on the page.

## Sources

Read:

- [Bergman and Chan, J-PAL summary](https://www.povertyactionlab.org/node/2353) - alerts and their effects. Read 2026-11-01.
- [Maloney and colleagues 2015, through ScienceDaily](https://sciencedaily.com/releases/2015/08/150810091859.htm) - anxiety and homework help. Read 2026-11-01.
- [Hullman, Resnick and Adar 2015, PLOS ONE](https://pmc.ncbi.nlm.nih.gov/articles/PMC4646698) - error bars. Read 2026-11-01.
- Repository at bbd5629, the files under Method.

Snippet:

- [Pomerantz, Moorman and Litwack 2007](https://www.scribd.com/document/553381816/Pomerantz-2007) - how parents help. Read 2026-11-01.
- [Grolnick and Pomerantz 2022](https://selfdeterminationtheory.org/wp-content/uploads/2025/09/2022_GrolnickPomerantz_ShouldParents.pdf) - autonomy support. Read 2026-11-01.
- [Wilder 2014](https://informahealthcare.com/doi/abs/10.1080/00131911.2013.780009) - nine meta-analyses. Read 2026-11-01.
- [Jivet and colleagues, Awareness is not enough](https://core.ac.uk/download/199946213.pdf) and [a practitioner article](https://www.solaresearch.org/?p=8136) - dashboards and action. Read 2026-11-01.
- [Bodily and colleagues 2018](https://dx.doi.org/10.1145/3170358.3170421) - open learner models. Read 2026-11-01.
- [Review on peer comparison](https://link.springer.com/10.1007/s10758-022-09613-x) - reference frames. Read 2026-11-01.
- [Schwendimann and colleagues 2017](https://infoscience.epfl.ch/record/220672) and [Valle and colleagues](https://bohrium.dp.tech/paper/arxiv/c3d882a9ce92ea5411e8c2a9fea0d3fca381cb3daf6f5e3e3a57bd61c9e87262) - reviews and gaps. Read 2026-11-01.
- [Few, through a book review](https://uxmatters.com/mt/archives/2007/04/book-review-information-dashboard-design.php) and [a commentary on the rule](https://www.juiceanalytics.com/writing/breaking-free-one-page-dashboard-rule) - dashboards. Read 2026-11-01.
- [Hullman and colleagues on uncertainty](https://ar5iv.arxiv.org/html/2007.14516) - lay misreadings. Read 2026-11-01.
- [Mathletics weekly reports](https://support.mathletics.com/support/solutions/articles/266025-weekly-progress-reports), [Tassomai](https://tassomai.com/strategy-parent-reports) and [Khan Academy's parent page](https://khanacademypakistan.org/?p=6172) - product practice. Read 2026-11-01.

### Could not obtain

The full texts of Pomerantz, Wilder and Few, and any study of parents reading a dashboard for a primary pupil at home. Tried 2026-11-01.
