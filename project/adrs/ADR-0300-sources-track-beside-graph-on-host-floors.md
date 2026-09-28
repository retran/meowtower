---
id: ADR-0300
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-5900, REQ-5902, REQ-5904, REQ-5906, REQ-5908, REQ-5910, REQ-5912, REQ-5914, REQ-5916, REQ-5918, REQ-5920, REQ-5922, REQ-5924, REQ-5926, REQ-5928, REQ-5930, REQ-5932, REQ-5934, REQ-5936, REQ-5938, REQ-5940, REQ-5942, REQ-5944, REQ-5946, REQ-5948, REQ-5950, REQ-5952, REQ-5954, REQ-5956, REQ-5958, REQ-5960, REQ-5962, REQ-5964, REQ-5966, REQ-5968, REQ-5970, REQ-5972, REQ-5974, REQ-5976, REQ-5978, REQ-5980, REQ-5982, REQ-5984, REQ-5986, REQ-5988, REQ-5990, REQ-5992, REQ-5994, REQ-5996, REQ-6064, REQ-5856, REQ-5120]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0300. The Sources track runs beside the skill graph as five nodes with states of their own, two fixed tasks on the day's first S, M, G or P floor, a drawn source component and a report screen of its own

## Decision

The Sources track «Карта Смотрителя» (the Keeper's Map) is a second track of five nodes, I1 to I5, kept apart from the 79 maths nodes in the graph file, the knowledge model, the Director and the report. Its tasks are generated from templates and seeds like every other task, draw their source as SVG from their parameters, and come as a fixed part of a host floor. This record builds on ADR-0210, which owns the game day, the separate streams outside «сама» (on her own), what leaves the Mac, the event catalogue's owners, the MVP scope, the Dutch bridge and the stage order; I cite it for those and don't restate them.

### The graph file

`content/graph.yaml` gains a fourth part, `tracks`, beside `nodes`, `topics` and `sloGoals` (REQ-5900). It holds one track, `sources`, with the nodes I1 to I5 in this order: tables, charts, timetables, maps, and two sources together. A track node has an id, a name key into the string file, `citoBlock: null` (REQ-5902), the field the decision on section 8 of the addendum adds to maths nodes, and four subtypes, one per question level: `find`, `compare`, `calculate` and `combine` (REQ-5992). I chose all four on every node, I5 included, because a combine question can join two parts of one table and a find question can point into one of two sources, so no level is empty on any node. A track node has no `level`, no `domain` and no prerequisite field, so the schema can't express an edge between a track node and a maths node, as `topics` already can't. I chose equal subtype weights of 0.25, because RES-4090 gives no reason to weigh one question level above another, and at 0.25 each level is one a full block must cover (ADR-0060). The validator keeps its count of 79 maths nodes in nine domains and adds one rule: the `sources` track holds exactly I1 to I5, each with exactly the four subtypes at 0.25.

### States from track first attempts alone

The knowledge model keeps a row in `node_estimates` for each track node and each of its subtypes, with the same BKT estimate, fluency and "with help" estimates and state rules as a maths node (REQ-5904). Each track template declares its fluency threshold per device type in `content/catalogue.yaml`, as every template does, and ADR-0180's adult calibration sets it. I chose starting values of 60 s for find and compare and 90 s for calculate and combine, because reading a source adds about a minute to a task, and a maths threshold would label every good block «понимает, нужна скорость» (understands, needs speed). A track row takes as observations only the graded, unassisted first attempts on track tasks of that node (REQ-5906), under every exclusion ADR-0060 already applies: rapid guesses, excluded tasks and ungraded tasks. A track attempt updates no maths node, and a maths attempt updates no track node (REQ-5908). Track rows are a stream of their own under ADR-0210's rule on new forms, so none joins «сама» during the MVP (REQ-5910).

Three choices differ from a maths row, each mine:

- A track subtype takes the 1S prior of the active group row, 0.25 or 0.40, because a track node has no SLO level to read one from, and the calculate and combine levels sit at the 1S end of RES-0800's Verbanden goals. I give the find and compare levels the same prior, because a busy source makes even a find question harder than S1's clean 4 by 4 table, and one prior per node keeps the node's estimate from starting as a mix of two guesses.
- `pGuess` for a region answer is 1 over the number of tappable regions in the source, the same reading ADR-0060 gives a choice among k options.
- Track nodes take no probes, no inference and no obligation rows. Their states come from full blocks alone, because a track node has no prerequisites to infer through, and a probe of 2 tasks would spend a whole day's track tasks on evidence a block gives anyway.

A track node's state therefore follows ADR-0060's rules `block-low` to `stable`, `open` and `none`, and the report shows it with the same labels.

### Where track tasks sit and how the Director picks them

A track task appears only on a floor of the S, M, G or P domain (REQ-5918), as a fixed part of the floor after the warm-up and the 2 mental arithmetic tasks or the Volley, and before the rooms (REQ-5856, REQ-5922). It never takes a room slot, so the three slot sources of ADR-0070 stay as they are. When `planDay` builds a route that holds at least one host floor, it plans 2 track tasks on the first host floor of the route (REQ-5912). If that floor ends before its track tasks are shown, the next host floor of the same game day carries them. I chose this, because the ceiling below counts tasks shown, and a floor she left after the warm-up gave her no source to read.

The track has a window beside the domain window and the Observatory's (REQ-5914). When the last 2 adventure days held no completed floor with a track task, `planDay` puts a host floor first on the route, choosing the host domain whose last completed floor is oldest. When the domain window also has domains due, the route takes a due domain that is also a host domain if one exists; otherwise the host floor goes first and the due domains follow. I chose to let the track window win the first place, because the domain window already recovers through `domain_window_missed` on the next route, while a missed track window costs the only reading evidence the game collects. Only a completed floor counts, as REQ-5914 says.

The Director picks the node for the day's 2 track tasks in this order, a rule I chose so a block of 5 forms within ADR-0060's 7 days:

1. A track node with an open block, 1 to 4 graded observations in the last 7 days, gets both tasks until its block completes. At 2 tasks a host day, a block needs 3 host days, so it forms within 7 days when she plays 3 host days in a week. When she plays fewer, observations older than 7 days drop out of the window as ADR-0060's block rule already says, the node keeps the open block, in the state «уточняется» (being clarified), and stays first, and the first reversal condition catches a node that never forms one.
2. Otherwise a node in «не проверено» (not checked), in the order I1, I2, I3, I4, then I5 once its gate opens (REQ-5920).
3. Otherwise the node whose `nextReview` is earliest, ties by identifier.

Within the node, the Director takes the subtype asked longest ago, so a block covers all four question levels. I5 is never a candidate until at least two of I1 to I4 hold a tested state of «понимает» (understands) or above (REQ-5920). A track node has no inferred state, so the gate can't open by inference.

Track attempts don't count toward the minimum of 28 scored first attempts (REQ-5926), and I extend that to the minimum of 25 at 1.5 times the threshold and to ADR-0070's plan target of 30, because the owner set all three on maths fluency. Track attempts also stay out of ADR-0070's success share, a choice of mine, because a misread timetable would otherwise push the next room slot towards review for a mistake no maths node made. The trim order never trims track tasks, as it never trims mental arithmetic, because a trimmed track task breaks the track window on a short day.

### Track templates and the source

A track template follows ADR-0040's contract with an input class of its own, `source`, and these rules:

- Every track task is set in a story context (REQ-5930). Its question text comes from frames in `frames.ru.json` under the structure `source.<node>.<level>`, written offline and accepted by the parent into ADR-0130's library. A track frame never comes from the live queue, because ADR-0130's blind solve reads only text and can't see a drawn source. A build check fails a track template with no frame for a level it asks.
- The template draws the source's whole data set into its parameters, and `src/render` draws the table, chart, timetable or map as SVG from them (REQ-5934). The same template, version and seed rebuild the same source with every value (REQ-5932), because the source is part of the parameters ADR-0040 already stores in `item_shown`.
- The parameters hold enum identifiers for every label, such as a stop, a fish kind or a compass letter, and the source reads each label through `t()` from keys under `source.label.*` in ADR-0160's string file (REQ-5936). ADR-0020's static check on language-free parameters covers track templates unchanged.
- Every source holds data the solution doesn't use (REQ-5938), and every value the solution reads has at least one adjacent cell, bar, point or square that holds a different value the solution doesn't use (REQ-5940). I chose a minimum gap between them: at least 5 minutes for times and at least 10 % of the read value, and never less than 2, for numbers, so a misread gives a clearly different answer and not a near miss of the eye. The generator rejects a candidate that breaks either rule, the same way it rejects an indistinct trap.
- The parameter schema splits into `question` and `source`, and `solve()` reads the source only through a `SourceView`. The property test checks each rule on 10,000 seeds per template, the bar of ADR-0040 (REQ-5942, REQ-5944, REQ-5946): exactly one correct answer or one correct region; no number in the rendered question text equal to the answer or to any intermediate step result of the solution graph, while the inputs the question itself states stay allowed; and `solve()` with an empty `SourceView` returns `no_answer`.
- Every task asks at one of the four question levels (REQ-5992). Choosing a suitable source and reading a schema or flow chart are left out.

I chose ceilings on the size of a generated source, so that at zoom 1 every region keeps its 56 px zone and the source fits the task window at the iPad's 1180 by 820: a table at most 6 rows by 6 columns with headers, a timetable at most 6 rows by 5 columns, a chart at most 8 bars or 8 points on each of at most 2 lines, and a map at most 8 by 6 squares. Acceptance test 15's snapshots confirm the fit.

### Answers

A `source` template may ask for free input, for a `choice` of at least 4 options, or for a new answer kind, `region` (REQ-5948). A template asks for `choice` only where the answer is a label of the source, such as a stop, a fish kind or a direction, in a compare or combine question like "which of these stops", because the keypad types numbers and times and has no way to type a label. A region answer is one tap on a cell, a bar, a point or a map square of the drawn source (REQ-5950). It earns credit 1 for the correct region and 0 for any other (REQ-5952). A tap selects a region and a second tap on another region moves the selection, and «Готово» (Done) submits, as a choice does, so a slipped finger doesn't cost the answer. Number and time answers use the existing kinds, and a duration is answered as an `integer` in minutes beside its unit label, which ADR-0150 draws (REQ-5954).

The client receives the regions as indices in reading order, left to right and top to bottom, and the server maps each index to its region and its trap, as the option builder maps option indices. The renderer strips every SVG `id` and `class` that names the correct region, a trap or the template, as ADR-0040 already requires for nodes and templates.

### Reading traps and error classes

Track templates name every reading mistake by one of seven trap identifiers: `misread_cell`, `axis_scale`, `legend_misread`, `scale_conversion`, `time_across_hour`, `wrong_source_part` and `ignored_condition` (REQ-5956). The S1 catalogue trap "neighbouring row or column" takes the identifier `misread_cell`, and the M2 trap "an hour = 100 minutes" takes `time_across_hour`, so the misconceptions screen shows one row for each pair (REQ-5958). `axis_scale`, `scale_conversion` and `time_across_hour` carry the trap kind `conceptual` (REQ-5960). `misread_cell`, `legend_misread`, `wrong_source_part` and `ignored_condition` carry `procedural` (REQ-5962). ADR-0180's mapping then places each in the error-type limit with no change to it.

`misread_cell` has more than one wrong answer, one for each adjacent value, so its `apply()` returns the set of those answers, and the distinctness test compares each member with the correct answer and with every other trap's answer. For a region answer, a tap on an adjacent region is `misread_cell`, and the template maps every other wrong region to a trap or to `unclassified`.

### The source component

The task window shows the source through one component, `SourceView` in `src/ui/source/`, which has no owner component in the design system, so the parent reviews it at stage acceptance as ADR-0150 does for the scratchpad. REQ-5120 already lets the task window hold "a drawn source with its tappable regions".

- Every tappable region has a touch zone of at least 56 CSS px in both directions on the tablet at zoom 1 (REQ-5974). That meets the addendum's 44 by 44 pt, because one CSS pixel is one point on iPad Safari.
- Source text takes its size from the `task` type token through a CSS class, never from a `font-size` attribute, so it is 24 px, or 28 px with large text (REQ-5976). A lint rule in `src/render` rejects a `font-size` attribute on SVG text, and the renderer draws the source at a scale of 1 at zoom 1, so a CSS pixel in the SVG is a CSS pixel on screen.
- A pinch inside the source zooms it (REQ-5980). The container sets `touch-action: none`, reads two pointers, and writes a CSS transform on the inner SVG on each pointer move, with no transition, so the zoom follows the fingers and `getAnimations()` stays empty (REQ-5982). The container has a fixed size, so the zoom moves nothing else in the task window (REQ-5984). I chose a zoom range of 1 to 3, because at 3 a 56 px cell is 168 px and larger zoom shows less than one row. One finger pans the source while it is zoomed, so every part of a zoomed source stays reachable. On a computer, a trackpad pinch arrives as a wheel event with `ctrlKey` and zooms the same way. The zoom returns to 1 when the task changes, so each source opens whole.
- On a computer, the regions take focus in reading order and Enter selects one, so a region answer works with a keyboard.
- The source sits inside the `data-task-content` subtree that ADR-0210's clock check skips (REQ-5022), so a timetable's printed times don't fail it.

### The report screen

Report v1 has nine screens, the eight of ADR-0180 and «Работа с источниками» (Working with sources), apart from the graph screens (REQ-5964, REQ-6064). The screen answers one question the parent asks: where does her reading of a source break, and is it the reading or the sum. It shows:

- I1 to I5 with their states and the rule behind each, as the node card does (REQ-5966);
- first-attempt accuracy over the last 30 days by question level across all track nodes, four figures, and by node, five figures, with «мало данных» (too little data) for any figure with fewer than 5 first attempts, a floor I chose, because below 5 one answer moves the figure by 20 points or more. I chose two short rows over a node by level table, because 2 tasks a host day give about 40 to 60 first attempts in 30 days, too few to fill 20 cells;
- the reading traps that fired in the last 30 days, with up to 3 examples each, drawn from `item_shown` so the parent sees the source the player saw;
- «находит, но не считает» (finds but doesn't calculate) when at least 3 wrong first attempts on track tasks in the last 30 days matched no reading trap, and «считает, но ошибается в чтении» (calculates but misreads) when at least 3 matched one (REQ-5968). I count toward the first line only number and time answers at the `calculate` and `combine` levels, because REQ-5968 reads an untrapped wrong answer as a calculation on data found correctly, and a wrong region tap or choice involves no calculation. Such an answer counts toward neither line and appears as unclassified on the misconceptions screen.

No track node enters the VWO block's coverage, margin, ceiling or ladder (REQ-5970) or the gap list (REQ-5972). Both read `nodes` only, and the track lives in `tracks`, so the exclusion holds by the file's shape; a test holds it too. Neither the report nor the Parent Room names a Studievaardigheden test or says the school gives one (REQ-5924, REQ-5994), and the Parent Room asks nothing about the school's tests (REQ-5996). A build check searches every string file and the Parent Room's schemas for the word Studievaardigheden, so a program keeps the rule; ADR-0160's text gate can't, because it skips `parent.*` keys.

### Checks and scope

`tools/simulate.ts` plays each day's track tasks with a time model of the same kind as other tasks and reports `graphFirstAttempts` and `trackFirstAttempts` apart (REQ-5916). The 60-minute adventure at 1.0 times the fluency threshold must still yield at least 28 graph first attempts with the track tasks in it (REQ-5928), against the baseline ADR-0190 keeps. Acceptance test 15 snapshots a track task with its source in WebKit at the iPad viewport and in Chromium, on ADR-0190's matrix (REQ-5986). `docs/ipad-checklist.md` gains a track task answered by a tap, a pinch inside the source and a page pinch outside it, which the adult judges (REQ-5988). The first version holds the track with its five nodes, its component and its screen (REQ-5990), in the stage ADR-0210's stage order gives item 9.

No new event type is needed. `item_shown`, which ADR-0040 owns, gains `track: "sources"` and `questionLevel` in a new payload version, and `attempt_submitted`, which ADR-0080 owns, admits a `region` index as its raw answer in a new payload version. The log therefore holds everything the screen and the states read.

Once this is accepted and built on ADR-0040 to ADR-0190 and ADR-0210, the game shows 2 source tasks on most adventure days, keeps five track states the parent reads on their own screen, and names each reading mistake. The graph, its estimates and the VWO block don't change. What doesn't work yet: the track window holds only when she completes a floor that carried track tasks, because a floor she left stays unfinished until the adventure resumes the next game day (ADR-0070), and on a day she leaves the first host floor early `track_window_missed` can fire; the Dutch bridge's words in track tasks, which ADR-0210 adds through the label keys; a zoom event in the log; and states for I5 until two other track nodes reach «понимает». If the `sources` track holds no node with a built template, the Director plans no track tasks and the screen shows every node as «не проверено», so the increment comes out by removing the templates.

## Why

The owner's addendum 1 of 2026-09-28 makes the track part of the MVP and sets it outside the 79 nodes, with `citoBlock: null`, about 2 tasks a day and at least one in any 3 adventure days (RES-4090). A track beside the graph is the only option that counts a reading mistake without lowering a maths estimate, because a misread row on a graph node would read as a calculation gap (RES-4090, the options table). The science topics set the precedent for a part of the graph file outside the count (ADR-0050).

States need rows, because the I5 gate asks for «понимает» and ADR-0060 computes states only for rows it keeps (RES-4090). The block rules stay the same, so the parent reads one set of labels on both screens.

A fixed part of the floor beats a fourth slot source, because it guarantees 2 tasks without competing with the frontier and review for room slots, and the research decided it on 2026-09-28 (RES-4090, "Decided"). Host floors are S, M, G and P, because the track's content sits in those domains, and a timetable on a fractions floor has no story to explain it (RES-4090, conclusion 3). The domain window brings a host floor within 3 days only while each day completes 3 floors (ADR-0070), which is why the track keeps its own window.

The generator and the renderer already build and draw every task picture from parameters (ADR-0040), so a source is one more picture, and the log rebuilds it for the node card. The unused-data rules are what the track measures: a source holding only the values the question needs makes a child who can't find the row look fluent (RES-4090, conclusion 6).

A region tap is needed, because neither `point` nor `grid` is one tap on a drawn source (RES-4090). Choice is allowed in the track only where the answer is a label, because the keypad can't type one, and ADR-0040's rule that a typed answer can't be guessed still holds for every answer that is a number or a time.

The trap kinds follow the test RES-4090 conclusion 9 sets: conceptual when the child misunderstands how the source encodes a quantity, procedural when she takes the wrong part. One kind for all seven would hide whether a scale or a row is the trouble.

Source text sizes and the zoom follow RES-4090 conclusions 12 and 13. The text-size check can't see SVG attributes, so the size comes from the token by a class, which both the stylelint rule and the Playwright check reach. Zoom lives inside the component because page zoom on the iPad is untested against the task window's fixed layout, and the checklist tests it (RES-4090, conclusion 14).

The strongest objection is that the track spends about 2 graph tasks' worth of time a day to estimate content six graph nodes, S1, S2, S5, M2, P5 and G7, already estimate, for a skill Cito's current tests don't report on its own. The parent can then read I3 «пока не освоено» (not mastered yet) beside M2 «бегло» (fluent) for the same timetables. A `source` format on those six nodes would reuse everything and add no estimate. I keep the track, for three reasons. The owner instructs it. The reading step is invisible in a graph task with a small clean source, so the format option measures something the graph already sees. And the disagreement between I3 and M2 is the finding the parent needs, which «считает, но ошибается в чтении» names on the screen. The reversal condition on thin states below says when the format option should take over.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep S1, S2, S5, M2, P5 and G7 as they are | no new node, state, window, component or screen; the graph already covers the SLO goals for tables, charts, timetables and maps | a small clean source makes a child who can't find the row look fluent, the seven reading mistakes are never counted, two sources together have no home, and the owner asked for the track |
| A `source` format on the six graph nodes | reuses the graph, the model, the window and the report's split by format | I5 has no node to live on, the reading traps scatter over six nodes, 2 a day can't be guaranteed without a track rule, and a reading mistake lowers a maths estimate |
| A tenth domain I inside the graph | the model, the Director, the graph map and the report take it with no new path | breaks the 79-node count and the nine-domain schema, puts nodes with no SLO level on the VWO ladder, and a ninth floor domain needs more floors than a short day holds; the owner ruled it out |
| The track beside the graph, with its tasks taking room slots as a fourth slot source | no new part of the floor; the value formula ranks track nodes with the rest | track tasks compete with frontier and review for 9 to 14 frontier tasks a day, so 2 a day isn't guaranteed, and REQ-5922 requires a fixed part |
| A Keeper's Map visit of its own, like the Observatory, once in 3 days | one place in the story for every source; no host floor needed | the owner asks for about 2 tasks a day, and a visit every third day bunches 6 in one scene and leaves two days without a source; REQ-5922 makes the track a fixed part of a floor |
| The track beside the graph on host floors, as decided | keeps reading apart from maths, keeps the 79 nodes and the ladder intact, guarantees 2 tasks a host day | a second estimate for overlapping content, a new graph part, rows, a window, an answer kind, a component and a screen |

## What it costs

The player pays about 2 tasks' time on most adventure days. I estimate 1 to 2 minutes a track task, because she reads a source before she answers; the simulation measures it, and REQ-5928 holds the graph attempts at 28.

The building agent writes templates for five nodes at up to four levels each, with generators that meet the unused-data rules, a reference solver, frames, the renderer for four kinds of source, `SourceView` with its gestures, the ninth screen and the checks below. The parent accepts the track's frames once into the library, about 60 frames by my estimate at 3 a level, and reviews `SourceView` at stage acceptance, about 15 minutes. Neither is a recurring queue: nothing in the track asks the parent for anything after the stage is accepted, so two weeks without the parent or the owner lose no data and leave nothing waiting.

The interruption budget of this decision is zero notifications to the parent and zero to the owner. The screen is read when the parent opens it, and each gap line shows while its condition holds and adds nothing to any notice. `track_window_missed` reaches the owner only in the log and the verify report.

Ceilings: at most 2 track tasks a game day, counted across sessions; the source size ceilings and the zoom range above; up to 3 examples a trap row, as ADR-0180 caps; two gap lines. `node_snapshots` gains about 25 rows a play day for the track's nodes and subtypes, inside ADR-0060's notice at 2 million rows. Nothing else accumulates.

The security boundary protects the measurement of the reading step. The threats, most likely first:

1. The drawn source gives the answer away: an SVG `id` or `class` naming the correct region, a highlight, or region indices ordered by correctness. The reading-order indices, the renderer's stripping and a payload test defend it.
2. The question text holds the answer or an intermediate value, so she skips the reading. The property test on 10,000 seeds defends it.
3. The player reads packets in a desktop browser's developer tools. The server sends no correct region before the first attempt, as ADR-0080 already requires.

No personal data enters the track: labels are fictional keys, and nothing asks about her school.

Failure states, each with its next step and one audience:

| State | What happened | Next step | Audience |
| --- | --- | --- | --- |
| `track_window_missed` | 3 adventure days passed with no completed floor carrying a track task, because she stopped early | the next route puts a host floor first | the owner, in the log and the simulation |
| `source_render_failed` | `src/render` throws on a source's parameters | the server draws the next seed, as ADR-0160's fallback does, and logs the failure | the building agent, through verify's count |
| `region_tap_missed` | a tap lands on a label or a gap between regions | nothing is selected and nothing changes | the player |
| `zoom_unavailable` | the device gives no two-pointer input, such as a mouse without a trackpad | the source stays at zoom 1, where its text is 24 px | the player |
| `too_little_data` | a node and level have fewer than 5 first attempts in 30 days | the cell shows «мало данных» | the parent |

`region_tap_missed` and `zoom_unavailable` look the same to the player, a source that doesn't change, on purpose, because neither needs her to act.

Non-functional numbers stay where ADR-0190 keeps them: generation within ADR-0040's 50 ms p95 per template, with the source's parameters included, and a tapped region changing its look within ADR-0150's 100 ms, with no transition inside the task window.

## What would reverse it

- If a track node is still «не проверено» or «уточняется» after 6 weeks of play, the track's states are too thin at 2 tasks a host day, and the owner decides whether the `source` format on the six graph nodes replaces the track's states, as RES-4090 names that fallback.
- If the simulation can't reach 28 graph first attempts in 60 minutes at 1.0 times the threshold with 2 track tasks in, the owner chooses between 1 track task a host day and the minimum.
- If acceptance test 15 shows a source at its size ceilings that doesn't fit the task window at zoom 1 with 56 px zones, the ceilings come down, and the templates that need more data move to zoom.
- If the real-iPad checklist shows Safari zooming the page on a pinch inside the source, `SourceView` is reopened, because REQ-5984 then fails on the device.
- If Cito's current system lists a Studievaardigheden test again, REQ-5994 and REQ-5996 are reopened, because their reason is that no current test exists.

The premortem, written as though it had happened: by the third month the parent read I3 «пока не освоено» for weeks beside M2 «бегло» and stopped trusting either. The cause was the neighbour rule: every timetable put a departure one minute from the one she needed, so a misread row and a slip of the eye gave nearly the same answer, and `misread_cell` fired on nearly every I3 task. A second cause sat in the Director: short days kept the first host floor at the end of the route, so the track tasks fell on the floor she didn't finish, and the window fired `track_window_missed` twice a week without anyone reading the log. The generator now keeps adjacent values apart, and the Director puts the host floor first when the window is due, and the first reversal condition catches thin states.

## Consequences

- `content/graph.yaml` gains `tracks.sources`; the validator gains the track rule; `src/engine/graph.ts` exposes track nodes apart from maths nodes.
- `src/engine/model/` and `src/engine/states/` keep track rows, and a golden fixture adds a track log, so `RULES_VERSION` moves with the change.
- `src/engine/director/` gains the track window, the track node rule and the host-floor placement, and `content/director.v1.json` lists the host domains S, M, G and P as data.
- `src/templates/sources/` holds the track templates; `src/render/source/` draws the four kinds; `src/shared/answer.ts` gains `region`; `content/catalogue.yaml` names the seven trap identifiers and renames the S1 and M2 traps.
- `frames.ru.json` gains `source.*` frames, and `content/i18n/ru.json` gains `source.label.*` keys and the screen's strings.
- `src/ui/source/SourceView.tsx` exists, with its entry in the stage review list.
- The Parent Room gains the ninth screen, and the build gains the search for the test's name.
- `tools/simulate.ts` reports graph and track first attempts apart; `docs/ipad-checklist.md` gains the three track items.

## Amends

- ADR-0040: "A template declares an `inputClass`, one of `free`, `shape`, `net`, `symmetry`, `explain_why`, `science` or `model`" becomes: the list adds `source`, in which a template may ask for `choice` of at least 4 options or for `region`.
- ADR-0040: the answer-kind table becomes one row longer: `region`, credit 1 for the correct region, 0 for any other region.
- ADR-0040: a trap's `apply()` "returns the wrong answer the misconception gives" becomes: it returns one wrong answer, or for `misread_cell` the set of answers the adjacent values give, and the distinctness test compares every member.
- ADR-0040: `item_shown` gains `track` and `questionLevel` in a new payload version.
- ADR-0050: the file "in three parts, `nodes`, `topics` and `sloGoals`" becomes four parts, with `tracks` holding the Sources track I1 to I5, and the validator checks it apart from the count of 79 maths nodes in nine domains.
- ADR-0060: "a row for every node of the graph up to the end of group 8, level 1S, and for every stretch node" becomes: and for every track node, whose rows take only track first attempts, the 1S prior, no probes, no inference and no obligations.
- ADR-0070: "Each floor opens with its scene, an ungraded warm-up and 2 mental arithmetic tasks, then its rooms" becomes: on the day's first host floor, 2 track tasks follow the mental arithmetic or the Volley and come before the rooms.
- ADR-0070: "The route first takes each domain that has had no completed floor for 2 adventure days in a row" becomes: when the track window is due, a host floor goes first, a due domain that is a host domain preferred, and the due domains follow.
- ADR-0070: the success share "over the last 10 graded first attempts" becomes: over the last 10 graded first attempts on graph tasks.
- ADR-0070: "It never trims mental arithmetic, control facts, or the last room" becomes: it never trims mental arithmetic, track tasks, control facts, or the last room.
- ADR-0070: "The plan aims at 30 graded first attempts and never plans fewer than 28, or 25" becomes: those counts hold for graph first attempts only.
- ADR-0080: `attempt_submitted` admits a `region` index as its raw answer in a new payload version.
- ADR-0150: the text-size check "at least 13 px everywhere, story 20 px and task 24 px" becomes: it also measures SVG text inside sources, at the `task` size or above.
- ADR-0180: "It has the eight screens of report v1" becomes nine screens, with «Работа с источниками» as the ninth.
- ADR-0190: "a 60-minute adventure yields at least 28 scored first attempts at 1.0 times the fluency threshold and at least 25 at 1.5 times" becomes: those counts are of graph first attempts, and the simulation reports track first attempts apart.

## How I will know it was realised

1. `./tower graph check` reports 79 maths nodes in nine domains and a `sources` track of I1 to I5, each with `citoBlock: null` and no domain or level.
2. A property test on random logs changes the answers of track attempts, and every maths node's estimate and state stays equal; changing maths attempts leaves every track row equal.
3. A golden fixture log gives I1 and I2 «понимает» by full blocks, and only then does the Director offer an I5 task.
4. A 30-day simulation shows, on every adventure day with a host floor, exactly 2 track tasks on the first host floor, or on the next host floor of the same game day when the first ends before they are shown, never on a floor outside S, M, G and P, never in a room slot, and at least one completed floor with a track task in any 3 consecutive adventure days for every profile that completes at least one floor a day, and `track_window_missed` logged for each window a profile that abandons its first floor misses.
5. The 60-minute simulation reports graph and track first attempts apart, with at least 28 graph first attempts at 1.0 times the threshold.
6. The property test on 10,000 seeds per track template finds zero tasks with two correct answers or regions, zero question texts holding the answer or an intermediate step result, zero `solve()` results with an empty `SourceView`, zero sources without unused data, and zero read values without a different unused neighbour, and zero neighbours closer than the minimum gap.
7. A rebuild test regenerates 1,000 logged track tasks from template, version and seed and finds every source value equal; a static check finds no string in any track template's parameter schema.
8. A checker test gives a region answer 1 for the correct region and 0 for its neighbour, classed as `misread_cell`, and a fixture of all seven traps lands in the error-type limit as three conceptual and four procedural.
9. The misconceptions screen shows one row for `misread_cell` fired on S1 and on I1.
10. A Playwright test at the iPad viewport finds every source region at least 56 by 56 px, every SVG text in a source at least 24 px, or 28 px with large text, no `getAnimations()` result during a scripted pinch, and every element of the task window outside the source at the same place before and after it.
11. Acceptance test 15 stores snapshots of a track task in WebKit at the iPad viewport and in Chromium, and the stage's checklist records a tap answer, a pinch inside the source and a page pinch outside it on a real iPad.
12. The Parent Room shows nine screens; the Sources screen shows states, accuracy by level, fired traps and each gap line at its threshold of 3 in 30 days, and a fixture with no track attempts shows «не проверено» on every node.
13. Unit tests of the VWO block and the gap list with every track node «пока не освоено» change no figure.
14. The build's search finds no Studievaardigheden in any string file, and a search of the Parent Room's settings schema finds no field for the school's tests.
15. The payload test finds no SVG `id` or `class` naming a region's correctness, a trap or a template in any track task sent before its first attempt.

## What this does not settle

- The Dutch bridge's keywords in about a fifth of track tasks, the separate streams rule, the game day, what leaves the Mac, the MVP list and the stage order: ADR-0210.
- The clock check's exclusion of task content: ADR-0210, through REQ-5022.
- Whether a track task carrying bridge keywords counts toward its track node's state: ADR-0210's rule for bridge tasks governs it, and this record treats such a task as a track task in everything else.
- Whether P5's "units lost" and `scale_conversion`, or G7's "west and east swapped" and `legend_misread`, are one misconception each. RES-4090 compared only the S1 and M2 pairs, so this record merges only those.
- The hint rungs' text for track tasks: the decision on the hint ladder, since a track template supplies `hints(p)` like any other.
- Choosing a suitable source and reading schemas and flow charts, which the track leaves out (REQ-5992).
- A zoom event in the log, and any report of how often she zooms.
- Whether «сама» ever admits track attempts, which needs the refit after the MVP (ADR-0060).

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
