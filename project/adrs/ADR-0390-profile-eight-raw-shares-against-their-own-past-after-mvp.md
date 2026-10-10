---
id: ADR-0390
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-6700, REQ-6702, REQ-6704, REQ-6706, REQ-6708, REQ-6710, REQ-6712, REQ-6714, REQ-6716, REQ-6718, REQ-6720, REQ-6722, REQ-6724, REQ-6726, REQ-6728, REQ-6730, REQ-6732, REQ-6734, REQ-6736, REQ-6738, REQ-6740, REQ-6742, REQ-6744, REQ-6746, REQ-6748, REQ-6750, REQ-6752, REQ-6754, REQ-6756, REQ-6758, REQ-6760, REQ-6762, REQ-6764, REQ-6766, REQ-6768, REQ-6770, REQ-6772, REQ-6774, REQ-6776, REQ-6778, REQ-6780, REQ-6782, REQ-6784, REQ-6786, REQ-6788, REQ-6790, REQ-6792, REQ-6794, REQ-6796, REQ-6798]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0390. After the MVP, the profile is a Parent Room screen of eight raw shares, each over one dimension's own observations with an 80 % Wilson interval for the last 28 played game days, read against its own previous window and never summed or ranked

## Decision

The ability profile is a pure parent projection, `computeProfile`, in `src/parent/profile/`. It reads the event log and the projections the MVP already builds, and writes one `ProfileModel` into the `profile` part of ADR-0180's `ReportModel` in `report_cache`. The Parent Room shows it on a screen «Профиль» (Profile), first among the report tabs (REQ-6700). It is post-MVP work, as REQ-6682 and ADR-0380 set, so report v1 keeps the nine screens of REQ-6064. The profile adds no field to the log (REQ-6702). This record builds on ADR-0380, which owns the interval rules, the floors each measure keeps, the wording of interpretations as checks and addendum 2's MVP scope, and doesn't restate them.

### Eight bars in a fixed order, with no total

The screen shows exactly eight bars in this order: basic facts, computational accuracy, conceptual understanding, model building, transfer, finding patterns, retention, and language and format (REQ-6704). `ProfileModel` holds `bars`, an array of exactly eight entries keyed by these identifiers in this order, and a `meta` block, and its JSON schema allows no other top-level field. So the model has no place for a total, a sum or an average (REQ-6706), and the client has no number to add up beyond the bars it draws. Bars keep the fixed order whatever their values, carry no rank and no comparison with other children (REQ-6708), and are drawn in one neutral colour token that ADR-0150's design system picks (REQ-6710). The profile never reads or shows the home scale's overall θ, which stays on the VWO readiness screen as ADR-0290 placed it (REQ-6798).

### Each bar is a raw share with an 80 % Wilson interval

Each bar other than the language and format bar pools the observations of its streams into one count of right answers over one count of observations, and shows the share with its 80 % Wilson score interval, z = 1.2816, over those raw counts (REQ-6778, ADR-0380). A line under the bar names each stream with its own count and share (REQ-6780). A second line, from the `parent.profile.*` part of ADR-0160's Russian string file, states what the figure counts, such as «верно 42 из 50 голых примеров на освоенных узлах» (42 of 50 bare tasks on mastered nodes right), with no word of judgement (REQ-6782). Each bar links to the list of observations behind it, each task drawn from its `item_shown` shown view as the node card draws it (REQ-6784).

A bar reads «мало данных» (too little data) with its count and no value when it rests on fewer than 10 observations or its interval is wider than 30 percentage points (REQ-6714). This is the profile bar's own floor under ADR-0380's rule that each measure owns its floor, and a bar below it enters no line, as REQ-6624 says. A bar whose stream isn't built yet reads «нет данных» (no data) (REQ-6716): in the first post-MVP build that is transfer until ADR-0410's first encounters exist and retention until ADR-0400's retention observations exist. The mapping file below says which: each dimension carries `built: true` or `false`, and `computeProfile` reads that flag and never the absence of events. I chose a flag in content, because a built stream with no events yet must read «мало данных» with a count of 0, and a log without such events can't tell the two apart. Version 1 sets `built: false` on transfer and retention, and the build that adds ADR-0410's or ADR-0400's observations raises the file's version and sets the flag. The patterns, transfer and retention bars carry a fixed note that they will read «мало данных» for most of the first months (REQ-6724). The screen carries two fixed notes. The first says that each bar counts tasks the Director chose at her level, that a bar read against its own earlier window says more than two bars read against each other, and that pooled streams and tasks of different difficulty make the stated miss rate approximate (REQ-6786). The second says that about 1 in 5 of the 80 % intervals shown misses its true value (REQ-6642, owned by ADR-0380).

### Two windows of 28 played game days, and a change line at 97.5 %

A bar reads the last 28 played game days (REQ-6726). A played game day is a game day of ADR-0090 on which the log holds at least one graded first attempt. I chose this, because a window counted in calendar days would fill with days she didn't play, and REQ-6726 asks the window to skip them. The window ends at the log's last event, so today counts once it holds a graded first attempt. The previous window is the 28 played game days before it, drawn as a second thin bar with its own interval (REQ-6728). With fewer than 56 played game days, the previous window holds whatever days remain before the current one, and with fewer than 29 it holds none and reads «мало данных» with a count of 0. I chose this, because an empty window is a window with too little data, and «нет данных» means a part not yet built (REQ-6716).

A change line appears only when both windows pass the floor (REQ-6722). It uses Newcombe's hybrid score interval for the difference between the two windows' shares at 97.5 %, z = 2.2414, built from the two windows' Wilson intervals at the same level (REQ-6730). I chose the Wilson bounds at 97.5 % inside that interval, because Newcombe's method takes each share's bounds at the level of the difference. The line reads «возможно, выросло» (possibly rose) or «возможно, снизилось» (possibly fell) when that interval excludes zero, and «без заметного изменения» (no clear change) otherwise (REQ-6732). The language and format bar shows its two windows and no change line (REQ-6720), because a change in a gap is a difference of two differences, which Newcombe's interval doesn't cover, and at these counts its interval would span most of the scale. A Dutch row joining the bar doesn't change that reason. ADR-0380's interpretation lines at 95 % stay apart from these change lines, as REQ-6730 says.

The dynamics carry the approved labels: «без контрольных прогонов: сравнимость ниже» (no control runs: lower comparability) until Ascents exist (REQ-1418), and time comparisons on one device type only (REQ-1420). A bar's comparison of its two windows carries «контент изменён» (content changed) when a template it reads in both windows carries a version in the current window that it didn't carry in the previous one (REQ-6734). I chose to leave a template that appears in only one window out of that test, because a new template is new content and not changed content, and REQ-1424 labels a change. The label sits on the comparison, so it also shows on the gap bar and on a bar whose change line REQ-6722 hides.

The profile's dynamics reads the unassisted first attempts its own bars read, and the fact states for basic facts, as REQ-6796 allows. Both windows are computed under the current version of the dimension mapping and the current threshold version, fact threshold included, so neither a mapping change nor a recalibration shows as a change in her. The same threshold version drives the replay of fact states at both windows' ends.

### Every observation feeds one dimension, in a fixed order

`content/profile.dimensions.json` is a versioned content file that assigns each stream of ADR-0210 and each template to at most one dimension, and marks each dimension built or not. The file decides which bar an observation may feed; the conditions in the table under "What each bar reads" are code filters applied after it, so an observation feeds a bar only when the file assigns it there and it passes that bar's filters, and otherwise it feeds no bar. `ProfileModel.meta` records its version beside the model, threshold, graph and content versions of `DerivedMeta` (REQ-6738). Code applies REQ-6740's precedence before the file: an attempt carrying a `factId` feeds basic facts alone, then a retention observation feeds retention, an eligible first encounter feeds transfer and an attempt on node S6 feeds finding patterns, and only then does the file's assignment apply (REQ-6736, REQ-6740). Inside the file a stream wins over a template: an attempt whose `item_shown.forms` names a stream feeds that stream's dimension alone. I chose this, because a Guardian problem with a surplus or a missing number would otherwise meet both model building and conceptual understanding, and the surplus and missing streams give only about 4 observations in 28 days (RES-4210).

One attempt can yield two observations of different kinds, and each still feeds one dimension. An item with an estimate keeps `forms` empty (ADR-0210), so its exact answer is an ordinary first attempt that may feed computational accuracy, and its `estimateRight` verdict is a separate observation that feeds conceptual understanding. A Guardian problem's modelling phase is one observation for model building and its final answer another. The language and format bar is the one exception to one dimension per observation: its bare side reads attempts computational accuracy also reads (REQ-6736), and the bar carries a note that a change in bare accuracy moves both bars (REQ-6742).

Mapping version 1 assigns every template with `format: "bare"` outside node S6 to computational accuracy, and every T template's modelling phase to model building. A Guardian problem's final answer, a context task without a stream, meets no bar's filters and feeds no bar apart from the context side of the gap bar when its node has both formats. Version 1 assigns the streams this way: `estimate`, `compose`, `surplus` and `missing` to conceptual understanding (REQ-6750), and `plan` to model building under the rule below. `grouping` and `bridge` go to no bar of their own: the addendum names grouping under no dimension, REQ-6750's list for conceptual understanding is closed, and `bridge` feeds only the context side of the gap bar. I chose to leave `grouping` out of every bar, because a bar that read it would claim a dimension the addendum never gave it.

### What each bar reads

| Bar | Observation and success | Beside or under the bar |
| --- | --- | --- |
| Basic facts | one per distinct fact shown in the window, a success when ADR-0290's `fact_states` rule, replayed to the window's last event, puts the fact in «автоматизм» (automatic) (REQ-6744) | for each device type in the window, the median time of right fact answers with its distribution-free 80 % interval and the fact threshold on that device type (REQ-6746, REQ-6620) |
| Computational accuracy | an unassisted first attempt without a `factId` and with empty `forms` on a bare task of a node whose tested state was «бегло» (fluent) or «устойчиво» (stable) at the attempt's sequence number, in ADR-0060's state history (REQ-6748) | |
| Conceptual understanding | an unassisted first attempt in the `estimate`, `compose`, `surplus` or `missing` stream, each right by its own approved rule: `estimateRight` of ADR-0240, the riddle rule of ADR-0230 and the unanswerable verdict of ADR-0250 (REQ-6750) | |
| Model building | one per Guardian problem with a modelling phase, unassisted during that phase, a success when its model choice, every entered step and, while the plan check holds, a plan labelled `correct` are right (REQ-6752) | how many problems had each number of steps (REQ-6754); the count of plans in the window while the plan check fails (REQ-6764) |
| Transfer | an eligible first encounter of REQ-6946, a success when REQ-6960 counts it transferred (REQ-6756) | the slow-bar note |
| Finding patterns | an unassisted first attempt on node S6 (REQ-6758) | the count of puzzles solved in the window in the patterns, working-backwards and enumeration themes, labelled «запас, а не оценка» (a reserve, not an assessment) (REQ-6768); the slow-bar note |
| Retention | a retention observation of REQ-6826, a success when REQ-6834 counts it right (REQ-6760) | the slow-bar note |
| Language and format | see the next section | the note of REQ-6742 |

A Guardian problem that opened with no model choice, took no step input and has no plan the bar may read has no modelling phase and doesn't enter the bar (REQ-6752). No bar reads a Keeper's puzzle (REQ-6766): the puzzle events of ADR-0280 appear in the mapping file's schema as a kind it can't assign.

Plan labels enter model building only while the whole log holds at least 10 `correct` plans and 10 faulty ones and wrong answers follow `correct` plans less often than faulty ones (REQ-6762). `computeProfile` runs this check at each computation over every `plan_submitted`, so labels leave the bar again if the rates reverse. The label still changes no credit, outcome, success share, holding-steps value or skill estimate (REQ-5644).

### The language and format bar is a gap centred on zero

The bar shows the share right on bare tasks minus the share right on context presentations, in percentage points, centred on zero, with Newcombe's 80 % hybrid score interval (REQ-6770). The context side pools Russian context tasks and tasks whose `forms` holds `bridge`. Both sides read only unassisted first attempts without a `factId` on nodes that have both a bare and a context template, in any tested state, and no attempt that REQ-6740 gives to a bar other than computational accuracy (REQ-6772). The bar lists each presentation's share with its own 80 % interval: bare, Russian context and bridge keywords (REQ-6774). It reads «мало данных» when either side fails the floor of REQ-6714 (REQ-6718), and REQ-6618 already puts «мало данных» in place of the difference then. The Dutch presentations of ADR-0430's probe join the list only after the owner amends the rule in `CLAUDE.md` that the player sees Russian only (REQ-6776); until then the bar has no Dutch row and no placeholder for one, because an empty Dutch row would read as a missing ability and not as a part not yet built.

### The profile stays with the parent

The profile reaches the client only through `/api/parent/*` behind the PIN's session: `GET /api/parent/report` carries `profile`, and `GET /api/parent/profile/:bar/observations?window=current|previous&page=N` lists a bar's observations, 50 to a page as the node card pages its log. It never enters a player packet, a Master order, a model request or the school export (REQ-6788, REQ-6686). A lint rule fails the build when a module outside `src/parent/` imports `src/parent/profile/`, which keeps it out of `src/engine/`, the Master's order builder of ADR-0110 and ADR-0310's school export, beside that export's own `school_export_scope` check. ADR-0190's end-to-end scan of the player's screens fails when one of her screens shows any string of `parent.profile.*` (REQ-6794).

### Reproducible and checked by the build

`computeProfile` is pure. It takes the log and the versions as arguments, walks the log in sequence order, and serialises `ProfileModel` as canonical JSON with sorted keys and every share and bound rounded to 6 decimals by one function. Under fixed versions of code and content it gives byte-identical output (REQ-6790). I chose 6 decimals, because they hold every percentage point the screen shows and absorb no difference a replay could produce.

Build check 3 of the addendum becomes three checks in ADR-0190's verify. A group 2 test recomputes the profile twice from each fixture log and compares the bytes (REQ-6790). A group 2 schema test rejects a `ProfileModel` with any top-level field beyond `bars` and `meta`, and a group 4 Playwright test renders the screen from fixture logs and fails when a number appears outside a bar's element and its notes (REQ-6712). The same tests fail when a bar that shows a value lacks its count or its interval (REQ-6792).

### What works once this is accepted, and what doesn't yet

Once this is accepted and built after the MVP, the parent opens «Профиль» and reads five bars filled from the MVP's own log: basic facts, computational accuracy, conceptual understanding, model building, and language and format without Dutch rows, each with its count, interval, previous window and change line. Finding patterns also reads the MVP's log, but node S6 gives about 11 first attempts in 28 days, so it shows its count and mostly «мало данных» for the first months (REQ-6724). Transfer and retention read «нет данных» until ADR-0410 and ADR-0400 are built, and then fill with no change here, because their sources are defined by those records. Plan labels wait for their check. Dutch rows wait for the owner's amendment of `CLAUDE.md` and ADR-0430's probe. A Rasch θ per dimension doesn't exist. Removing this increment deletes one tab, one `ReportModel` part, one content file and one route, and report v1 and play run unchanged.

## Why

The owner's addendum 2 of 2026-09-28 asks for eight dimensions, each from its own observations with a count and an 80 % interval, never summed, with the dynamics over 4 weeks, and never shown to the player (RES-4210). Raw shares with Wilson intervals are the one option whose every figure the parent can redo by hand from the task list under the bar, which is what the link under each bar is for. Brown, Cai and DasGupta (2001) recommend the Wilson interval for small counts, it is closed-form, and Newcombe's (1998) interval for a difference is made of it, so one family of intervals covers bars, gaps and change lines (RES-4210).

The profile waits until after the MVP, because it needs two windows of 28 played game days and MVP acceptance reads about two weeks (RES-4210, REQ-6700). Every input it reads is already logged or belongs to items 3, 4 and 6, whose records decide their own fields, so it needs no log field (RES-4210 conclusion 2).

The change line uses 97.5 %, because eight change lines at 80 % would show at least one false change in about 83 % of reports, and at 1 - 0.2 / 8 the chance of any false change across the eight stays at most 20 % (RES-4210). The gap bar draws no change line, so seven lines can fire, and the level REQ-6730 fixes is slightly conservative for seven. One observation feeds one dimension, because an answer that moves two bars makes them move together and fakes Feinberg and Wainer's (2014) condition that each subscore holds information the others don't (RES-4210). With one child that condition can't be tested at all, so the profile keeps what it can: each bar's own uncertainty and no shared observations.

The bars are labelled with what they count, and the dynamics compares a bar with itself, because the Director keeps each session's success between 0.65 and 0.85 (REQ-2916) and sets each family's difficulty, so two bars aren't on one scale (RES-4210). The step counts beside model building and the thresholds beside basic facts show the difficulty behind the two bars most exposed to that pull.

Plan labels and puzzles stay out of the bars, because ADR-0270 and ADR-0280 approved both as measuring nothing, and a profile is a measure (RES-4210). The profile is a parent projection with a mapping in content, because ADR-0180 builds every report figure from checkable rules over the log and ADR-0020 makes the log the only truth.

The strongest objection is that the screen will be read as eight abilities whatever its labels say. The owner asked for abilities, the bars look like abilities, and a parent who sees basic facts at 90 % beside model building at 65 % will conclude that modelling is the weak side. Yet the Director sets Guardian problems at k to k + 2 steps, near her frontier, and draws facts from review, so the gap may be the Director's doing. A second objection follows from the first: at 28 to 36 Guardian problems a window, the 97.5 % change line needs a change of about 25 to 32 points to fire, by my calculation, so model building will read «без заметного изменения» for months and the parent may take that as stagnation. I accept both. The notes, the counting labels, the step counts and the thresholds put the confound on the screen where the parent reads the bars, and no option removes it cheaply: the Rasch correction needs item difficulties that the home scale's refit hasn't yet recovered to REQ-5880's accuracy. A change line that seldom fires is the honest reading of few observations, and the second thin bar with its interval still shows the parent both windows. The first reversal condition below watches for the day the correction becomes possible.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: the parent reads the parts the report already shows on five screens | No new screen, rule or check, and every part has an approved owner | The parts carry no interval and sit apart, so the parent can't see "facts slow, understanding high" at a glance, which is what the owner's addendum asks for (RES-4210) |
| Raw shares with 80 % Wilson intervals, one observation to one dimension, over 28 played game days (chosen) | Every figure is a count the parent can redo by hand; closed-form; fits ADR-0180's checkable rules | Chosen; its cost is the difficulty confound, which the notes and the counting labels expose and don't remove |
| A Rasch θ per dimension from the home scale's item difficulties | Corrects for difficulty, so bars become comparable and the Director's choices drop out | The difficulties come from an unfitted feature formula until the refit passes REQ-5880; riddles, plans, estimates and gaps aren't scored items; one child's θ can't be checked by hand |
| A BKT estimate per dimension, like the node estimates | Reuses ADR-0060's machinery, forgetting included | Adds a model with parameters nobody fitted for eight families; its entropy gives no interval; a stream outside `admittedForms` can't enter an estimate |
| The profile in the MVP, on the summary screen | The parent sees it from the first week | Breaks REQ-6064's nine screens and REQ-6682's scope, and two weeks of play can't fill one window of 28 played game days |

## What it costs

The building agent pays for `src/parent/profile/` with its Wilson and Newcombe functions, the mapping file and its validator, the replay of fact states and node states at a point in the log, the screen, the observation route, the lint rule, the strings under `parent.profile.*` and the checks below. Each is a pure function or a view over existing projections, and no new model, event or queue.

The server pays in rebuild time. The bars read two windows, about 1,700 first attempts at about 30 graded tasks a day (ADR-0180), but the replay of fact states and the plan check read from the start of the log, so `computeProfile` is one pass over the whole log, about 150,000 events after a year by ADR-0180's estimate. It runs inside the report rebuild after an adventure, so it counts against the 5 s budget and the 60 s full recompute in ADR-0190's Baselines table, and adds no row there. I assume one linear pass of that size fits inside both, since the knowledge model's own full recompute over a year has a budget of 10 s; the fourth reversal condition covers the case where it doesn't.

The parent pays in reading: eight bars, their lines and three kinds of note. Reading is optional, as ADR-0180 says of the whole report. The interruption budget for the parent is zero: the profile sends no notification, fires no alert and waits for no answer, and a change line appears only on the screen the parent opens. The profile never needs the parent in real time, and two weeks or a month without her lose no data and leave no queue, because the profile is recomputed from the log whenever the report rebuilds.

The owner pays for the mapping file's first version and for any change to it, and for the one amendment to `CLAUDE.md` that the Dutch rows wait on.

Ceilings: `ProfileModel` holds exactly eight bars, two windows each and at most one presentation row per presentation, so it doesn't grow with the log. A window holds at most 28 played game days. The observation list pages at 50 rows. `report_cache` keeps ADR-0180's two version sets. Mapping versions grow by one per change and live in the repository like other content. Nothing here accumulates beyond these, so nothing needs a drain.

The security boundary protects the profile from becoming a label the player sees or hears. In order of the likelihood of damage, it defends against:

1. the player reading the profile on a shared iPad or the family computer, through the PIN, the parent session and player routes whose schemas have no profile field, with ADR-0190's scan of her screens for `parent.profile.*`;
2. a bar reaching the Master's story or a model prompt, so that the story names a weak side, through the lint rule on imports and ADR-0100's gateway, which never sends report data;
3. a bar reaching the school export, through the same lint rule and ADR-0310's `school_export_scope` check.

Failure states, each with its next step and one audience:

| State | Next step | Audience |
| --- | --- | --- |
| `report_build_failed`, when `computeProfile` throws | ADR-0180's handling: the last good `report_cache`, profile included, stays with its date; `computeProfile` has no failure state of its own, so a profile failure and any other report failure are deliberately indistinguishable | the owner |
| `profile_mapping_invalid`: the mapping file assigns a stream or template twice, names an unknown dimension or template, or assigns a puzzle event | ADR-0190's group 1 validator fails the build, and the server refuses to start with that version, as it does with other invalid content | the owner |
| A bar under its floor | «мало данных» with its count, no value and no change line | the parent |
| A bar with no stream built | «нет данных» | the parent |
| Plan labels withheld by their check | the plan count under model building | the parent |
| A device type with no calibration | ADR-0180's `threshold_uncalibrated` beside the basic facts threshold for that device | the parent |

## What would reverse it

- If a refit of the home scale passes REQ-5880 on simulated pupils who grow, a Rasch θ per dimension becomes possible, and a new decision weighs it against the raw shares (REQ-6798).
- If, in the simulation below, a synthetic student whose true accuracy in every family stays constant gets a change line claiming a change on more than 20 % of profiles over 1,000 seeds, one profile per seed computed at played game day 56, the 97.5 % level doesn't hold the family-wise rate it was chosen for, and the level is reopened.
- If, after the first 56 played game days after the MVP, computational accuracy, conceptual understanding or model building reads «мало данных» on more than half of played game days 57 to 112, the bars research expected to fill don't, and the window or that bar's sources are reopened.
- If the report rebuild after an adventure passes ADR-0190's 5 s baseline with the profile and stays within it without the profile, the profile moves to an incremental projection that keeps fact states and plan counts at each window boundary.
- If the acceptance notes of the profile's backlog item, or the owner's notes 3 and 6 months after the profile ships, record that the parent read two bars against each other as abilities despite the notes, the labels and the notes are reopened. I chose the two later points, because a misreading grows with months of bars, as the premortem below shows, and acceptance comes after one week of play.

The premortem, written as though it had happened: four months after the MVP the parent told the owner that modelling was the player's weak side, from a model building bar at 62 % beside basic facts at 91 %, and a tutor was booked. The Guardian had been setting four- and five-step problems for weeks, because her T nodes had turned stable, and the step counts beside the bar said so in a line nobody read. A second cause sat in the mapping: version 2 had moved the estimate stream from conceptual understanding to computational accuracy, and the change line on computational accuracy said «возможно, снизилось» when nothing in her had changed, because the previous window had been computed under version 1. The first cause is why the Director note and the step counts sit on the screen and why the fifth reversal condition exists. The second is why both windows are computed under one mapping version and why the version is recorded with every profile.

## Consequences

- ADR-0180's `ReportModel` gains `profile`, and `DerivedMeta` gains the mapping version; `GET /api/parent/profile/:bar/observations` joins the `/api/parent/*` routes.
- `content/profile.dimensions.json` is created at version 1 with the assignments above, and ADR-0190's group 1 gains its validator and the import lint on `src/parent/profile/`.
- ADR-0160's Russian string file gains `parent.profile.*`: the eight bar names, the counting lines, the stream lines, the change-line wordings, «нет данных», the notes of REQ-6724, REQ-6742 and REQ-6786, and «запас, а не оценка» beside the puzzle count. ADR-0180's check rejecting «плохо», «отстаёт» and «невнимательная» covers them.
- ADR-0190's group 4 scan of the player's screens gains every `parent.profile.*` string, and groups 2 and 4 gain the tests of build check 3.
- ADR-0150's design system provides one neutral bar colour token and a thin-bar variant for the previous window.
- ADR-0400 and ADR-0410 own the retention and transfer observations; this record reads them through REQ-6826, REQ-6834, REQ-6946 and REQ-6960 and adds nothing to their payloads.
- The post-MVP backlog gains the profile as one item, which ADR-0380 orders among addendum 2's parts.

## Amends

- ADR-0180: "They use only unassisted first attempts from blocks, probes and review (REQ-1414)" becomes: they read first attempts as REQ-6796 sets, and the profile's dynamics reads the unassisted first attempts its own bars read and the fact states for basic facts.
- ADR-0180: the report's screens, after the MVP, gain «Профиль» first among the Parent Room's report tabs, computed as the `profile` part of `ReportModel` in `src/parent/profile/`; report v1 keeps its nine screens.
- SPC-0180: the section "Dynamics views" changes as the first line above for ADR-0180, and the post-MVP screen list gains «Профиль» first.
- ADR-0190: group 4's scan of the player's screens also fails on any string under `parent.profile.*`, and group 1 gains the validator of `content/profile.dimensions.json` and the lint rule that only `src/parent/` imports `src/parent/profile/`.
- ADR-0270: "the label reaches the log and the report but no credit, outcome or estimate" becomes: the label reaches the log and the report, and the profile's model building bar only while REQ-6762's check holds, and no credit, outcome or estimate.
- ADR-0280: the report's puzzle counts gain one more place: the count of puzzles solved in the patterns, working-backwards and enumeration themes shows under the profile's finding patterns bar, labelled «запас, а не оценка», and no puzzle feeds a bar.
- ADR-0060 and SPC-0060: "No stream projection feeds `pKnow`, the fluency estimate or the "with help" estimate" gains: the profile, a parent projection outside the knowledge model, reads streams outside `admittedForms` and enters no estimate, state, probe or block.

## How I will know it was realised

1. A group 2 test recomputes the profile from each fixture log twice, and again after a full recompute of the projections, and the three outputs are byte-identical.
2. A group 2 schema test finds exactly eight bars in the order of REQ-6704 and rejects a `ProfileModel` fixture with a field `total`, `sum` or `average` at any level outside a bar.
3. A group 4 Playwright test renders the screen from a fixture of 60 played game days and finds every bar that shows a value with its count and its interval, no number outside a bar's element and its notes, and one fill colour on all eight bars.
4. A fixture with 9 observations in a bar, and one with 20 observations at a share of 0.5 whose 80 % Wilson interval is 28 points wide, show «мало данных» and a value respectively. A fixture mapping with `built: false` on transfer shows «нет данных», and the same log under a mapping with `built: true` and no transfer events shows «мало данных» with a count of 0.
5. A fixture log with a fact threshold change between the two windows computes both windows' fact states under the new threshold version, and the basic facts change line equals the one computed with the new threshold from the start.
6. A unit test on the Wilson and Newcombe functions reproduces RES-4210's figures: 5 of 10 gives 0.31 to 0.69 at 80 %, and 47 of 50 against 19 of 30 gives a gap of 31 points with an 80 % interval of 19 to 43.
7. A simulation of 1,000 seeds with a synthetic student whose true accuracy in every family stays constant, one profile per seed computed at played game day 56, shows a change line claiming a change on at most 20 % of profiles. I chose 1,000 seeds, because 20 seeds can't tell a true rate of 15 % from one above 20 %, and `computeProfile` is pure, so the seeds are cheap.
8. A fixture log where one attempt carries a `factId` and sits on node S6 counts it under basic facts only, and a Guardian problem with a surplus number counts under conceptual understanding only; a property test over random logs finds no observation in two bars apart from the gap bar's bare side.
9. A fixture with 9 `correct` plans, 1 of them followed by a wrong answer, and 12 faulty plans, 6 of them followed by a wrong answer, shows the plan count under model building and no plan in the bar; adding a tenth `correct` plan followed by a right answer brings the labels into the bar.
10. A fixture with puzzles solved in the patterns theme shows their count under the finding patterns bar and leaves the bar's count unchanged.
11. ADR-0190's scan of the player's screens, run on a simulated adventure, finds no string under `parent.profile.*`, and the lint rule fails on a fixture module in `src/engine/` that imports `src/parent/profile/`.
12. A read of the language and format bar on a fixture with Russian and bridge presentations lists three presentation rows and no Dutch row.

## What this does not settle

- The report's interval family, the «мало данных» floors of other measures, the interpretation lines at 95 %, the four states and addendum 2's MVP scope: ADR-0380.
- What a retention observation is and when it is right: ADR-0400. What a first encounter is and when it counts as transferred: ADR-0410.
- The Dutch probe, its presentations and its texts: ADR-0430, after the owner amends the Russian-only rule in `CLAUDE.md`.
- A Rasch θ per dimension, which waits for a new decision once the home scale's refit passes REQ-5880.
- The layout, spacing and exact colour of the bars: ADR-0150's design system.
- A profile at a past date: the profile has no `?at=`. I chose this, because the previous window already shows the last change, and a past profile can be rebuilt from the log later.
- Whether the grouping stream should feed a dimension: mapping version 1 assigns it none, and a later version may, through a change to the content file that records its version.
