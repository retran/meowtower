---
id: SPC-0390
artifact: spec
status: live
revised: 2026-09-29
checked-at:
states: [REQ-6700, REQ-6702, REQ-6704, REQ-6706, REQ-6708, REQ-6710, REQ-6712, REQ-6714, REQ-6716, REQ-6718, REQ-6720, REQ-6722, REQ-6724, REQ-6726, REQ-6728, REQ-6730, REQ-6732, REQ-6734, REQ-6736, REQ-6738, REQ-6740, REQ-6742, REQ-6744, REQ-6746, REQ-6748, REQ-6750, REQ-6752, REQ-6754, REQ-6756, REQ-6758, REQ-6760, REQ-6762, REQ-6764, REQ-6766, REQ-6768, REQ-6770, REQ-6772, REQ-6774, REQ-6776, REQ-6778, REQ-6780, REQ-6782, REQ-6784, REQ-6786, REQ-6788, REQ-6790, REQ-6792, REQ-6794, REQ-6798]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The ability profile: eight bars, two windows and the change lines

## Scope

This document covers the ability profile, a Parent Room screen «Профиль» (Profile) of eight bars that the pure projection `computeProfile` builds from the event log. It covers the `profile` part of `ReportModel`, the content file that assigns each observation to one dimension, what each bar reads and counts, the two windows of 28 played game days, the change line, the language and format bar, the route that lists a bar's observations, the boundary that keeps the profile with the parent, and the checks the build runs on it. It is written at the component level: the projection, its model, its content file, its route and what the screen shows. The profile is post-MVP work: report v1 keeps the nine screens SPC-0180 states, and SPC-0190 states the MVP scope that leaves the profile out.

It leaves out what other documents state. SPC-0180 states the Parent Room, `report_cache`, the report rebuild and its failure handling, the interval family of addendum 2's report parts (Wilson, Newcombe and the median interval, in `src/parent/intervals.ts`), the registry of «мало данных» (too little data) floors in `src/parent/measures.ts`, the contrasts file `verify/contrasts.json`, the miss-rate line `parent.profile.miss_rate` and the dynamics rule that lets the profile read its own observations. SPC-0060 states the streams, `admittedForms` and the tested node states, SPC-0290 states `fact_states`, SPC-0270 states plans and their labels, and SPC-0280 states the Keepers' puzzles. What a retention observation is and when it is right belongs to ADR-0400, what an eligible first encounter is and when it counts as transferred to ADR-0410, the Dutch probe to ADR-0430, and a hypothesis condition on a dimension to ADR-0450. The layout, spacing and colour values of the bars belong to SPC-0150's design system.

## Boundary

### Routes

Both routes are `/api/parent/*` routes and need the parent session, as SPC-0180 states for every such route.

| Route | What it does |
| --- | --- |
| `GET /api/parent/report` | Carries `profile`, the `ProfileModel`, inside `ReportModel`. |
| `GET /api/parent/profile/:bar/observations?window=current\|previous&page=N` | Lists the observations one bar read in one window, 50 to a page, one row per observation as "The observations list" states, each task drawn from the `shown` view of its `item_shown` as the node card draws it. |

No player route, player packet, Master order, model request or school export carries any part of `ProfileModel` (REQ-6788).

### Code and files

| Surface | What it is |
| --- | --- |
| `src/parent/profile/` | `computeProfile` and its helpers: a pure function over the log and the versions that returns one `ProfileModel`. |
| `ProfileModel` | Two top-level fields and no other: `bars`, an array of exactly eight bar entries in the order of REQ-6704, and `meta`. Its JSON schema rejects any other top-level field. |
| A bar entry | The bar's identifier, one of `basic_facts`, `computational_accuracy`, `conceptual_understanding`, `model_building`, `transfer`, `finding_patterns`, `retention` and `language_format`, which is also the route's `:bar`; its state (`value`, `too_little_data` or `no_data`), and for each of the two windows its count, its right answers, its share, its 80 % interval, its stream lines, its counting line and its played game days; then the change line, the «контент изменён» (content changed) label and the bar's side figures from the table under "What each bar reads". |
| `ProfileModel.meta` | The mapping version of `content/profile.dimensions.json`, beside the model, threshold, graph and content versions of `DerivedMeta` (REQ-6738). |
| `content/profile.dimensions.json` | A versioned content file that assigns each stream and each template to at most one dimension, and marks each dimension `built: true` or `built: false`. |
| `parent.profile.*` | The profile's part of the Russian string file of SPC-0160: the eight bar names, the counting lines, the stream lines, the change-line wordings, «мало данных», «нет данных» (no data), the fixed notes and «запас, а не оценка» (a reserve, not an assessment). |

### Events this part logs

None. The profile reads the fields the MVP's log records and the fields ADR-0400, ADR-0410 and ADR-0430 add, and adds no event and no log field of its own (REQ-6702).

### Failure states

`report_build_failed` and `profile_mapping_invalid`, and the bar states `too_little_data` and `no_data`, set out under Failure paths.

### What this part requires from other parts

- SPC-0020 supplies the log in sequence order and `DerivedMeta`'s versions.
- SPC-0060 supplies the streams and their projections, each attempt's `forms` and the tested node states at a sequence number; SPC-0180 supplies the state history the node card reads.
- SPC-0290 supplies the `fact_states` rule, which `computeProfile` replays to a point in the log under a given threshold version.
- SPC-0080 supplies `estimateRight`, SPC-0230 the riddle verdict, SPC-0040 the unanswerable verdict and the model choice and step input of a Guardian problem, and SPC-0270 the plan and its label on `plan_submitted`.
- SPC-0280 supplies the puzzle events and their themes.
- ADR-0400 supplies the retention observations, the `retention_observations` projection, and their verdict (REQ-6826, REQ-6834). ADR-0410 supplies the eligible first encounters and their transfer verdict (REQ-6946, REQ-6960).
- SPC-0180 supplies `report_cache`, the rebuild, the parent session, the node card's task view, the interval functions, the floor registry and the contrasts file. SPC-0090 supplies the game day.
- SPC-0150's design system supplies one neutral bar colour token and a thin-bar variant for the previous window.
- SPC-0190's verify runs the checks this part names.

### Permitted dependencies

- `computeProfile` reads the log, the projections and the versions, and writes only the `profile` part of `ReportModel`. It appends no event, calls no model and enters no estimate, state, probe or block of the knowledge model.
- Only modules under `src/parent/` import `src/parent/profile/`. A lint rule fails the build on any other importer, which keeps the profile out of `src/engine/`, the Master's order builder and the school export.
- `computeProfile` reads streams outside `admittedForms`; no stream it reads enters the knowledge model through it.
- The profile computes every interval through `src/parent/intervals.ts` and imports no statistics library.

## Behaviour

### The screen

After the MVP, the Parent Room's report has the screen «Профиль», first among its report tabs (REQ-6700). The screen shows exactly eight bars in this fixed order: basic facts, computational accuracy, conceptual understanding, model building, transfer, finding patterns, retention, and language and format (REQ-6704). The bars keep this order whatever their values, carry no rank and no comparison with other children (REQ-6708), and are all drawn in one neutral colour token from the design system (REQ-6710). The screen shows no total, sum or average of the bars (REQ-6706), and `ProfileModel` has no field that could hold one. The profile never reads or shows the home scale's overall θ, which stays on the VWO readiness screen (REQ-6798).

The screen carries two fixed notes. The first says that each bar counts tasks the Director chose at the player's level, that a bar read against its own earlier window says more than two bars read against each other, and that pooled streams and tasks of different difficulty make the stated miss rate approximate (REQ-6786). The second is `parent.profile.miss_rate`, which SPC-0180 states. The finding patterns, transfer and retention bars each carry a fixed note that the bar will read «мало данных» for most of the first months (REQ-6724).

### Each bar is a raw share with its interval

Each bar other than the language and format bar pools the observations of its streams into one count of right answers over one count of observations, and shows the share with its 80 % Wilson interval over those raw counts (REQ-6778). A line under the bar names each of its streams with that stream's own count and share (REQ-6780). For conceptual understanding the streams are `estimate`, `compose`, `surplus` and `missing`; for model building they are the Guardian problems with and without `plan`; for the language and format bar the line is its list of presentation rows; every other bar has one source, and its line names that source with the bar's own count and share. A second line states what the figure counts, such as «верно 42 из 50 голых примеров на освоенных узлах» (42 of 50 bare tasks on mastered nodes right), with no word of judgement (REQ-6782). Each bar links to the list of observations behind it, served by the observations route, so the parent can redo the count by hand (REQ-6784).

A bar other than the language and format bar reads «мало данных» with its count and no value when it rests on fewer than 10 observations or its 80 % interval is wider than 30 percentage points (REQ-6714). This floor is registered for the profile bar in `src/parent/measures.ts`, and a stream line's share, a presentation row and the median fact time take the default floor SPC-0180 states, and a bar below it enters no interpretation line of SPC-0180 (REQ-6624) and no change line. Its stream line and counting line still show their counts, with no share. A bar whose dimension carries `built: false` in the mapping file reads «нет данных» (REQ-6716). `computeProfile` reads that flag and never the absence of events: a dimension with `built: true` and no events reads «мало данных» with a count of 0. Mapping version 1 sets `built: false` on transfer and retention, and the build that adds ADR-0410's or ADR-0400's observations raises the file's version and sets the flag.

### Two windows of 28 played game days

A played game day is a game day of SPC-0090 on which the log holds at least one graded first attempt. Each bar reads the observations of the last 28 played game days (REQ-6726). The window ends at the log's last event, so today counts once it holds a graded first attempt. The previous window is the 28 played game days before the current one, drawn as a second thin bar with its own interval (REQ-6728). With fewer than 56 played game days, the previous window holds the played game days that remain before the current one. With fewer than 29 it holds none and reads «мало данных» with a count of 0.

Both windows are computed under the current mapping version and the current threshold version, the fact threshold included, so a mapping change or a recalibration never shows as a change in the player. The same threshold version drives the replay of fact states at both windows' ends. The profile's dynamics reads the unassisted first attempts its own bars read and the fact states for basic facts, as the dynamics rule in SPC-0180 allows.

### The change line

A bar shows a change line only when both of its windows pass the floor of REQ-6714 (REQ-6722). The line uses Newcombe's hybrid score interval for the difference between the two windows' shares at 97.5 %, z = 2.2414, built from the two windows' Wilson intervals at 97.5 %. It claims a rise or a fall only when that interval excludes zero (REQ-6730). The line reads «возможно, выросло» (possibly rose) or «возможно, снизилось» (possibly fell) when it claims a change, and «без заметного изменения» (no clear change) otherwise (REQ-6732). The change lines are entries of `verify/contrasts.json` approved by ADR-0390, each implemented in `src/parent/contrasts.ts`, which `computeProfile` calls to draw it, as SPC-0180 states for every line. They stay apart from the interpretation lines at 95 % that SPC-0180 states. The language and format bar shows its two windows and no change line (REQ-6720).

A bar's comparison of its two windows carries «контент изменён» when a template the bar reads in both windows carries a version in the current window that it didn't carry in the previous one (REQ-6734). A template that appears in only one window doesn't enter this test. The label sits on the comparison, so it also shows on the language and format bar and on a bar whose change line REQ-6722 hides. The comparison also carries the labels SPC-0180 states for every dynamics view: «без контрольных прогонов: сравнимость ниже» (no control runs: lower comparability) until Ascents exist, and times compared on one device type only.

### Every observation feeds one dimension

Code gives an observation to the first bar in this order whose source it meets (REQ-6740). Steps 1 to 4 assign by code alone, and step 5 by `content/profile.dimensions.json`. At every step the observation feeds the bar only when it also passes that bar's filters in the table below; an observation that a step claims and that fails the bar's filters feeds no bar and doesn't fall through to a later step:

1. basic facts, for an attempt carrying a `factId`;
2. retention, for a retention observation;
3. transfer, for an eligible first encounter;
4. finding patterns, for an attempt on node S6;
5. the bar the mapping file assigns.

Inside the file a stream wins over a template: an attempt whose `item_shown.forms` names a stream feeds that stream's dimension alone. So a Guardian problem whose `forms` names `surplus` or `missing` feeds conceptual understanding and gives no model building observation, and a Guardian problem whose `forms` names `plan` gives one model building observation that covers its plan. So every observation a bar reads feeds exactly one dimension (REQ-6736). The one exception is the language and format bar, whose bare side also reads attempts computational accuracy reads, and that bar carries a note that a change in accuracy on bare tasks moves both bars (REQ-6742).

One attempt can yield two observations of different kinds, each feeding one dimension. An item with an estimate keeps `forms` empty, so its exact answer is an ordinary first attempt that may feed computational accuracy, and its `estimateRight` verdict is a separate observation that feeds conceptual understanding. A Guardian problem's modelling phase is one observation for model building, and its final answer is another, which meets no bar's filters and feeds no bar apart from the context side of the language and format bar when its node has both formats.

Mapping version 1 assigns:

- every template with `format: "bare"` outside node S6 to computational accuracy;
- every T template's modelling phase to model building;
- the streams `estimate`, `compose`, `surplus` and `missing` to conceptual understanding, and `plan` to model building under the plan check below;
- the streams `grouping`, `bridge` and every other stream to no bar; `bridge` attempts reach only the context side of the language and format bar, through that bar's own filter.

The file's schema has no way to assign a Keeper's puzzle event, so no bar reads a puzzle (REQ-6766).

### What each bar reads

| Bar | Observation and success | Beside or under the bar |
| --- | --- | --- |
| Basic facts | One observation per distinct fact shown in the window, a success when the `fact_states` rule, replayed to the window's last event, puts the fact in «автоматизм» (automatic) (REQ-6744). | For each device type in the window, the median time of right fact answers with its 80 % interval and the fact threshold on that device type (REQ-6746). |
| Computational accuracy | An unassisted first attempt without a `factId` and with empty `forms` on a bare task of a node whose tested state was «бегло» (fluent) or «устойчиво» (stable) at the attempt's sequence number (REQ-6748). | |
| Conceptual understanding | An unassisted first attempt in the `estimate`, `compose`, `surplus` or `missing` stream and no other, each right by its own rule: `estimateRight` whatever the exact answer, the riddle verdict and the unanswerable verdict (REQ-6750). | |
| Model building | One observation per Guardian problem with a modelling phase, unassisted during that phase, a success when its model choice, every entered step and, while the plan check holds, a plan labelled `correct` are right (REQ-6752). | How many of the problems it read had each number of steps (REQ-6754); while the plan check fails, the count of plans in the window, outside the bar's figure (REQ-6764). |
| Transfer | An eligible first encounter of REQ-6946, a success when REQ-6960 counts it transferred (REQ-6756). | The note of REQ-6724. |
| Finding patterns | An unassisted first attempt on node S6 (REQ-6758). | The count of puzzles solved in the window in the patterns, working-backwards and enumeration themes, labelled «запас, а не оценка» (REQ-6768); the note of REQ-6724. |
| Retention | A retention observation of REQ-6826, a success when REQ-6834 counts it right (REQ-6760). | The note of REQ-6724. |
| Language and format | See the next section. | The note of REQ-6742. |

The side figures beside and under a bar cover the current window only.

A Guardian problem that opened with no model choice, took no step input and has no plan the bar may read has no modelling phase and doesn't enter model building (REQ-6752).

Plan labels enter model building only while the whole log holds at least 10 `correct` plans and 10 faulty ones, and wrong answers follow `correct` plans less often than faulty ones (REQ-6762). `computeProfile` runs this check at each computation over every `plan_submitted`, so labels leave the bar again if the rates reverse. The label changes no credit, outcome, success share, holding-steps value or skill estimate.

### The language and format bar

The bar shows the share right on bare tasks minus the share right on context presentations, in percentage points, centred on zero, with Newcombe's 80 % hybrid score interval (REQ-6770). The context side pools Russian context tasks and tasks whose `forms` holds `bridge`. Both sides read only unassisted first attempts without a `factId` on nodes that have both a bare and a context template, whatever the node's tested state, and no attempt that the order of REQ-6740 gives to a bar other than computational accuracy (REQ-6772). The bar lists each presentation's share with its own 80 % interval: bare, Russian context and bridge keywords (REQ-6774). It reads «мало данных» when either side fails the floor of REQ-6714 (REQ-6718).

The bar shows no Dutch presentation, and no row or placeholder for one, until the owner amends the rule in `CLAUDE.md` that the player sees text in Russian only (REQ-6776). Once the owner amends it and ADR-0430's probe is built, the Dutch presentations join the list of presentation rows, each with its own share and 80 % interval, and never the pooled context side of REQ-6770. The profile then reads a probe letter's attempt, the one projection besides `nl_probe` that does; ADR-0430 states the stream and its letters. The mapping version that first lists `nl_probe` assigns the stream to the language and format bar.

### The observations list

The observations route lists one row per observation the bar read in the window, and each row shows whether the observation counted as right:

- computational accuracy, conceptual understanding and finding patterns: the task, her answer, the correct answer and, for conceptual understanding, the stream;
- basic facts: the fact, its state at the window's last event, and each task that showed it in the window;
- model building: the Guardian problem with its model choice, its entered steps and, while the plan check holds, its plan and label;
- transfer and retention: the task and the verdict ADR-0410 or ADR-0400 gives it;
- language and format: the task, her answer, the correct answer, and the side and presentation it counted for.

### The profile stays with the parent

The profile reaches the client only through the two `/api/parent/*` routes behind the parent session, and never enters a player packet, a Master order, a model request or the school export (REQ-6788). The import lint under Permitted dependencies keeps `src/parent/profile/` out of `src/engine/`, the Master's order builder and the school export, beside the export's own `school_export_scope` check in SPC-0190. SPC-0190's scan of the player's screens fails when one of her screens shows any string under `parent.profile.*`: the bar names, the stream lines of REQ-6780, the counting lines of REQ-6782, the change-line wordings of REQ-6732 and the notes of REQ-6724, REQ-6742 and REQ-6786 (REQ-6794).

The profile sends no notification and waits for no answer. A change line appears only on the screen the parent opens, and the profile is recomputed from the log whenever the report rebuilds, so a month without the parent loses nothing.

### Reproducible output

`computeProfile` takes the log and the versions as arguments and walks the log in sequence order. It serialises `ProfileModel` as canonical JSON with sorted keys, every share and bound rounded to 6 decimals by one function. Under fixed versions of code and content, recomputing the profile from the log gives byte-identical output (REQ-6790). It runs inside the report rebuild after an adventure, as one pass over the whole log, because the replay of fact states and the plan check read from the log's start; it counts against the rebuild budgets in SPC-0190's Baselines table and adds no row there.

### Checks the build runs

SPC-0190's verify runs these checks on the profile:

| Group | Check | Fails when |
| --- | --- | --- |
| 1 | The validator of `content/profile.dimensions.json` | The file assigns a stream or template twice, names an unknown dimension or template, or assigns a puzzle event. |
| 1 | The import lint on `src/parent/profile/` | A module outside `src/parent/` imports it. |
| 2 | The reproducibility test | Two computations from one fixture log, or one after a full recompute of the projections, differ in any byte (REQ-6790). |
| 2 | The schema test | `ProfileModel` has a top-level field beyond `bars` and `meta`, or other than eight bars in the order of REQ-6704 (REQ-6704, REQ-6712). |
| 2 | The single-dimension property test | Over random logs, one observation feeds two bars, apart from the language and format bar's bare side (REQ-6736). |
| 4 | The Playwright render of the screen from fixture logs | A number appears outside a bar's element, its notes and the screen's two fixed notes, which is where a total, sum or average would show (REQ-6712), or a bar that shows a value lacks its count or its interval (REQ-6792). |
| 4 | The scan of the player's screens | One of her screens shows a string under `parent.profile.*` (REQ-6794). |

### Ceilings

`ProfileModel` holds exactly eight bars, two windows each and at most one row per presentation, so it doesn't grow with the log. A window holds at most 28 played game days. The observations route pages at 50 rows. `report_cache` keeps the two version sets SPC-0180 states. Mapping versions grow by one per change and live in the repository like other content.

## Failure paths

| State | What happens | Audience |
| --- | --- | --- |
| `report_build_failed`: `computeProfile` throws | SPC-0180's handling: the last good `report_cache`, profile included, stays with its date. The profile has no report-time failure state of its own, so a profile failure reads like any other report failure. | owner |
| `profile_mapping_invalid`: the mapping file assigns a stream or template twice, names an unknown dimension or template, or assigns a puzzle event | The group 1 validator fails the build, and the server refuses to start with that version, as it does with other invalid content. | owner |
| `too_little_data`: a bar, a window or a side of the language and format bar below its floor | «мало данных» with its count, no value and no change line. | parent |
| `no_data`: a dimension with `built: false` | «нет данных». | parent |
| The plan check fails | Plan labels stay out of model building, and the count of plans in the window shows under the bar. | parent |
| A device type with no calibration | SPC-0180's `threshold_uncalibrated` beside the basic facts threshold for that device type. | parent |
| A `/api/parent/*` request without a parent session | `401`, as SPC-0180 states. | parent |
| An observations request with an unknown bar, a window other than `current` or `previous`, or a page beyond the last | `400` for an unknown bar or window; an empty page beyond the last. | parent |
| A new mapping version | Both windows are recomputed under it, `meta` records it, and ADR-0450 requires a new `RULES_VERSION` for its hypothesis measures. | owner |

## Choices made in this document

- The observations route answers `400` for an unknown bar or window and an empty page beyond the last. ADR-0390 names the route and its page size but not these answers, so I chose the `400` that SPC-0180's strict query schemas give a malformed `/api/parent/report*` request.
- The bar entry's field list and the state names `value`, `too_little_data` and `no_data` are mine. ADR-0390 fixes what a bar shows, and these names give each shown state one field value.

- The row of each bar in the observations list is mine. ADR-0390 says a bar links to the observations behind it, and a bar whose observation isn't one task needs a row the parent can recount from.
- On a bar below its floor the stream line and the counting line show counts with no share. REQ-6714 shows «мало данных» with its count and no value, and a share in either line would show the value the bar withholds.
- The stream line of a bar without streams names the bar's one source, and model building splits by `plan`. ADR-0390 names streams per bar only for conceptual understanding and the gap bar's presentations.
- The eight bar identifiers are mine, as snake-case forms of the bar names.
- The side figures cover the current window only, because ADR-0390 draws the previous window as a thin bar with its own interval and names no side figure for it.

## Open review findings

- An agent reviewer asked for ADR-0390's reasons beside seven rules: the empty previous window, the gap bar's missing change line, the one-window template, a stream over a template, `grouping`, the missing Dutch placeholder and the 6 decimals. I rejected it, because rule S8 of the spec step keeps reasons in the decision, and ADR-0390 holds each of them.
