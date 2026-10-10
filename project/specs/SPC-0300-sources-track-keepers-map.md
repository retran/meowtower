---
id: SPC-0300
artifact: spec
status: live
revised: 2026-09-29
states: [REQ-5900, REQ-5902, REQ-5904, REQ-5906, REQ-5908, REQ-5910, REQ-5912, REQ-5914, REQ-5916, REQ-5918, REQ-5920, REQ-5922, REQ-5924, REQ-5926, REQ-5928, REQ-5930, REQ-5932, REQ-5934, REQ-5936, REQ-5938, REQ-5940, REQ-5942, REQ-5944, REQ-5946, REQ-5948, REQ-5950, REQ-5952, REQ-5954, REQ-5956, REQ-5958, REQ-5960, REQ-5962, REQ-5964, REQ-5966, REQ-6428, REQ-5970, REQ-5972, REQ-5974, REQ-5976, REQ-5978, REQ-5980, REQ-5982, REQ-5984, REQ-5986, REQ-5988, REQ-5990, REQ-5992, REQ-6504, REQ-5996]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Sources track «Карта Смотрителя»: its nodes and states, its tasks on host floors, the drawn source and its report screen

## Scope

This document covers the Sources track «Карта Смотрителя» (the Keeper's Map) from end to end: the `tracks` part of the graph file, the track rows of the knowledge model, the Director's placement of track tasks on host floors and its track window, the `source` templates with their generators, checks and reading traps, the `region` answer kind, the `SourceView` component in the task window, the report screen «Работа с источниками» (Working with sources), and the simulation, acceptance and checklist items that test the track. It is written at the component level: modules, content files, events, projections, rules and checks. The first version of the game holds the whole track, its five nodes, its component and its screen (REQ-5990), and the track belongs to stage 0.2, whose acceptance SPC-0190 states. ADR-0300 and ADR-0460 hold the reasons for the rules this document states.

It leaves out what other documents state. SPC-0050 states the rest of the graph file and its validator, SPC-0060 the knowledge model's estimates, blocks and state rules, SPC-0070 the Director's slot sources, domain window and trim order, SPC-0040 the template contract, the answer kinds and the trap test, SPC-0080 the attempt flow, the hint ladder and the task window's list of controls, SPC-0150 the design system and its text-size check, SPC-0180 the report's other screens and its list of nine, SPC-0290 the order of a maths floor, SPC-0090 the game day and the clock check's `data-task-content` exclusion, and SPC-0190 the verify command, its stages and its baselines. ADR-0400 owns the retention check and its hold, ADR-0430 owns the Dutch probe letters, and ADR-0410 owns the check `source_in_track`. ADR-0210 owns the Dutch bridge's words in track tasks and whether a task that carries them counts toward its node.

## Boundary

### Modules and files

| Module or file | What it holds |
| --- | --- |
| `content/graph.yaml` | `tracks.sources`, the nodes I1 to I5 |
| `src/engine/graph.ts` | track nodes, exposed apart from maths nodes |
| `src/engine/model/`, `src/engine/states/` | the track rows and their states |
| `src/engine/director/` | the track window, the track node rule and the host-floor placement |
| `content/director.v1.json` | the host domains S, M, G and P, as data |
| `src/templates/sources/` | the track templates |
| `src/render/source/` | the SVG renderer for tables, charts, timetables and maps, which the server alone runs |
| `src/shared/answer.ts` | the `region` answer kind |
| `src/shared/` | the `SourceReader` interface through which `solve()` reads a source |
| `content/catalogue.yaml` | the seven trap identifiers and each track template's fluency thresholds per device type |
| `frames.ru.json` | the question frames under `source.<node>.<level>` |
| `content/i18n/ru.json` | the labels under `source.label.*` and the screen's strings |
| `src/ui/source/SourceView.tsx` | the drawn source in the task window, with its gestures |
| the Parent Room | the screen «Работа с источниками» |
| `tools/simulate.ts` | the track's time model and the count `trackFirstAttempts` |
| `docs/ipad-checklist.md` | the three track items |

### The graph file's track

`content/graph.yaml` has four parts, `nodes`, `topics`, `sloGoals` and `tracks`. `tracks` holds one track, `sources`, with five nodes outside the 79 maths nodes and outside the nine domains (REQ-5900):

| Node | Subject |
| --- | --- |
| I1 | tables |
| I2 | charts |
| I3 | timetables |
| I4 | maps |
| I5 | two sources together |

A track node has an `id`, a name key into the string file, `citoBlock: null` (REQ-5902) and four subtypes, one per question level: `find`, `compare`, `calculate` and `combine` (REQ-5992), each with the weight 0.25. It has no `level`, no `domain` and no prerequisite field, so the schema can't express an edge between a track node and a maths node. The validator keeps its count of 79 maths nodes in nine domains and fails the file unless `tracks.sources` holds exactly I1 to I5, each with exactly the four subtypes at 0.25.

### Answer kind

`region` is one tap on a cell, a bar or a map square of the drawn source (REQ-5950). A point of a line chart is never a region: a question on a line chart asks for the value as a number or a time. The client receives the regions as indices in reading order, left to right and top to bottom; the server maps each index to its region and its trap. `attempt_submitted` admits a `region` index as its raw answer in a new payload version.

### Events

This part adds no event type. It uses two payload versions that other parts own:

| Event | Owner | What this part adds |
| --- | --- | --- |
| `item_shown` | ADR-0040 | `track: "sources"` and `questionLevel`, in a new payload version |
| `attempt_submitted` | ADR-0080 | a `region` index as the raw answer, in a new payload version |

### Statuses and error names

| Name | Audience | Meaning |
| --- | --- | --- |
| `track_window_missed` | the owner, in the log and the verify report | 3 adventure days passed with no completed floor carrying a track task |
| `source_render_failed` | the building agent, through verify's count | `src/render` threw on a source's parameters |
| `region_tap_missed` | the player | a tap landed on a label or a gap between regions |
| `zoom_unavailable` | the player | the device gives no two-pointer input |
| `too_little_data` | the parent | a figure on the screen rests on fewer than 5 first attempts in 30 days |

### What this part requires from other parts

- SPC-0050 supplies the graph file's loader and validator, which this part extends with the track rule.
- SPC-0060 supplies `node_estimates`, the BKT estimate, fluency and "with help" estimates, the block rule over 7 days, the state rules `block-low` to `stable`, `open` and `none`, the exclusions of rapid guesses, excluded and ungraded tasks, and the rule that admits a new form to «сама» (on her own).
- SPC-0070 supplies `planDay`, `planFloor`, the domain window, the three room slot sources and the trim order.
- SPC-0040 supplies the template contract, `item_shown`, the seed rebuild, the static check on language-free parameters, the option builder and the property test at 10,000 seeds.
- SPC-0130 supplies the frame library into which the parent accepts the track's frames.
- SPC-0150 supplies the `task` type token, the text-size check and the stage review list.
- SPC-0180 supplies the Parent Room, the node card, the misconceptions screen, the error-type limit and the VWO block.
- SPC-0160 supplies `t()` and the per-language string file.
- ADR-0400 supplies, after the MVP, the retention check's hold and its due checks, which the Director reads when it picks a track node.
- ADR-0430 supplies, after the MVP, the Dutch probe letters, which follow the track tasks on a floor, and the form `nl_probe`, which a track row skips.
- ADR-0410 supplies the build check `source_in_track`, which fails a template with the input class `source` whose subtype belongs to a maths node.

The permitted dependencies run one way. Track templates in `src/templates/sources/` import `src/shared/` and the template contract, and nothing in `src/ui/`. `src/render/source/` imports only the template's parameter types and `src/shared/`. `src/ui/source/` imports `src/shared/` and the design system, and nothing in `src/engine/`, `src/server/` or `src/render/source/`; the view the server sends holds the source's SVG. The knowledge model and the Director read track nodes only through `src/engine/graph.ts`, and no module outside `src/engine/` reads `node_estimates` rows of the track directly.

## Behaviour

### Track rows and their states

The knowledge model keeps a row in `node_estimates` for each track node and each of its subtypes, with the same estimate, fluency, "with help" estimate and state rules as a maths node (REQ-5904). A track row takes as observations only the graded, unassisted first attempts on track tasks of its node, under every exclusion SPC-0060 applies (REQ-5906). After the MVP, a track row also takes no attempt whose `forms` holds `nl_probe`, the Dutch probe letter's form (ADR-0430). A track attempt updates no graph node's estimate, and a graph attempt updates no track row (REQ-5908). Track rows are a stream of their own, so during the MVP no track attempt enters the «сама» estimate of the graph (REQ-5910).

A track row differs from a maths row in three rules:

- Every subtype of a track node takes the 1S prior of the active group row, 0.25 or 0.40.
- `pGuess` for a region answer is 1 over the number of tappable regions in the source.
- A track node takes no probes, no inference and no obligation rows, so its state comes from full blocks alone and is never inferred.

Each track template declares its fluency threshold per device type in `content/catalogue.yaml`: 60 s for `find` and `compare` and 90 s for `calculate` and `combine`, until ADR-0180's adult calibration sets them.

### Where track tasks sit

A track task appears only on a floor of the S, M, G or P domain, the host domains `content/director.v1.json` lists (REQ-5918). It is a fixed part of the floor, after the warm-up and the 2 mental arithmetic tasks or the Volley, before the floor's Dutch probe letters and before the rooms, and it never takes a room slot (REQ-5922). The Dutch probe letters exist only after the MVP, and only once the owner has amended the Russian-only rule in `CLAUDE.md` (ADR-0430); until then a floor holds none. When `planDay` builds a route that holds at least one host floor, it plans 2 track tasks on the first host floor of the route (REQ-5912). If that floor ends before both its track tasks are shown, the next host floor of the same game day carries the ones not yet shown. When no host floor is left that game day, the unshown track tasks lapse, and the track window counts the day as it counts any other. When an adventure runs into a new game day and the rest of its plan is recomputed, the recompute is planning a new adventure day: it plans 2 track tasks on the first remaining host floor, and the track window's rule below runs in it too. A game day shows at most 2 track tasks, counted across sessions.

### The track window

The Director keeps a track window beside the domain window, so that in any 3 consecutive adventure days the player completes at least one floor carrying a track task (REQ-5914). Only a completed floor counts. When the last 2 adventure days held no completed floor with a track task, `planDay` puts a host floor first on the route, choosing the host domain whose last completed floor is oldest. When the domain window also has domains due, the route takes a due domain that is also a host domain if one exists; otherwise the host floor goes first and the due domains follow. When 3 adventure days pass with no such floor, the Director logs `track_window_missed`.

### Choosing the node and the subtype

The Director picks the node for the day's 2 track tasks by the first rule that yields one:

1. A track node with an open block, 1 to 4 graded observations in the last 7 days, gets both tasks until its block completes. When two track nodes have open blocks, the one whose block's first observation is older gets them, ties broken by identifier.
2. Otherwise a node in «не проверено» (not checked), in the order I1, I2, I3, I4, then I5 once the I5 gate admits it.
3. Otherwise the node whose `nextReview` is earliest, ties broken by identifier.

Every rule skips a track node with no built template, and such a node shows «не проверено» on the report screen. The Director never offers a task on I5 until at least two of I1 to I4 hold a tested state of «понимает» (understands) or above (REQ-5920); while the gate is shut, every rule skips I5. After the MVP, every rule also skips a track node held for a retention check, and a due retention check on a track node takes the first of the day's 2 track tasks, on its node (ADR-0400). Within the node, it takes the subtype asked longest ago. When every track node is skipped, the Director plans no track tasks for the day.

### Track attempts and the day's counts

A first attempt on a track task doesn't count toward the minimum of 28 scored first attempts in an adventure (REQ-5926), toward the minimum of 25 at 1.5 times the threshold, or toward the plan target of 30 to 40. Track attempts stay out of the flow corridor's success share, which reads the last 10 graded first attempts on graph tasks. The trim order never trims a track task.

### Track templates

A track template follows the template contract with the input class `source`. Every track task asks at one of four question levels, `find`, `compare`, `calculate` or `combine` (REQ-5992); no template asks the player to choose a suitable source or to read a schema or flow chart.

Every track task is set in a story context (REQ-5930). Its question text comes from frames in `frames.ru.json` under `source.<node>.<level>`, written offline and accepted by the parent into the frame library, and never from the live queue. Every `source.*` frame sets the question in a story scene, and the parent accepts a track frame into the library only when it does; a rejected frame stays out of the library. A build check fails a track template with no accepted frame for a level it asks.

The template draws the source's whole data set into its parameters, and `src/render/source/` draws the table, chart, timetable or map as SVG from them (REQ-5934). The same template, template version and seed rebuild the same source with every value it holds (REQ-5932), because the source is part of the parameters `item_shown` stores. The parameters hold an enum identifier for every label, such as a stop, a fish kind or a compass letter, and hold no text in any language; the source reads each label through `t()` from `source.label.*` (REQ-5936).

A generated source stays within these ceilings: a table at most 6 rows by 6 columns with headers, a timetable at most 6 rows by 5 columns, a chart at most 8 bars or 8 points on each of at most 2 lines, and a map at most 8 by 6 squares.

### Unused data and neighbours

Every generated source holds data the task's solution doesn't use (REQ-5938). Every value the solution reads has at least one adjacent cell of a table or timetable, bar or point of a chart, or square of a map that holds a different value the solution doesn't use (REQ-5940). The two values differ by at least 5 minutes for times, and for numbers by at least 10 % of the read value and never less than 2. The generator rejects a candidate that breaks either rule, as it rejects an indistinct trap.

### The property test

The parameter schema splits into `question` and `source`, and `solve()` reads the source only through the `SourceReader` interface in `src/shared/`. The property test runs each track template on 10,000 seeds and fails it on any seed where:

- the task has more or fewer than one correct answer or one correct region (REQ-5942);
- the rendered question text holds a number equal to the answer or to any intermediate step result of the solution graph, while the inputs the question itself states stay allowed unless one equals the answer (REQ-5944);
- `solve()` with an empty `SourceReader` returns anything but `no_answer` (REQ-5946);
- the source holds no unused data, a read value has no different unused neighbour, or a neighbour sits closer than the minimum gap.

### Answers

Every task takes free input, except the input classes SPC-0040 lists for choice and the `source` class, which may also take a `choice` of at least 4 options or a `region` (REQ-5948). A track template asks for `choice` only where the answer is a label of the source, in a `compare` or `combine` question. A region answer earns credit 1 for the correct region and 0 for any other region (REQ-5952). A tap selects a region, a tap on another region moves the selection, and «Готово» (Done) submits. When the task asks for a duration, the player types it as an `integer` in minutes in the field beside its unit label (REQ-5954). Numbers and times use the existing answer kinds.

The server sends no correct region before the first attempt. The renderer strips every SVG `id` and `class` that names the correct region, a trap or the template, and a payload test fails a track task sent with one.

### Reading traps

Track templates name every reading mistake they detect by one of seven traps (REQ-5956):

| Trap | Kind |
| --- | --- |
| `axis_scale` | `conceptual` (REQ-5960) |
| `scale_conversion` | `conceptual` (REQ-5960) |
| `time_across_hour` | `conceptual` (REQ-5960) |
| `misread_cell` | `procedural` (REQ-5962) |
| `legend_misread` | `procedural` (REQ-5962) |
| `wrong_source_part` | `procedural` (REQ-5962) |
| `ignored_condition` | `procedural` (REQ-5962) |

The error-type limit takes each trap's kind with no change to its mapping. The S1 catalogue trap "neighbouring row or column" carries the identifier `misread_cell`, and the M2 trap "an hour = 100 minutes" carries `time_across_hour`, so the misconceptions screen shows one row for each pair (REQ-5958).

`misread_cell`'s `apply()` returns the set of answers the adjacent values give, and the distinctness test compares each member with the correct answer and with every other trap's answer. For a region answer, a tap on a region adjacent to the correct one is `misread_cell`, and the template maps every other wrong region to a trap or to `unclassified`.

### The source component

`SourceView` in `src/ui/source/` shows the source inside the task window's `data-task-content` subtree, so the clock check skips a timetable's printed times. The parent reviews it at stage acceptance, from its entry in the stage review list.

- Every tappable region has a touch zone of at least 56 CSS px in both directions on the tablet at zoom 1 (REQ-5974).
- Source text takes its size from the `task` type token through a CSS class, so it is at least 24 CSS px, or at least 28 CSS px with large text (REQ-5976). A lint rule in `src/render` rejects a `font-size` attribute on SVG text, and the renderer draws the source at a scale of 1 at zoom 1.
- The automated text-size check measures SVG text inside sources as well as page text, at the `task` size or above (REQ-5978).
- A pinch inside the source zooms it, over a range of 1 to 3 (REQ-5980). The container sets `touch-action: none`, reads two pointers and writes a CSS transform on the inner SVG on each pointer move, with no transition, so the zoom follows the fingers and `getAnimations()` stays empty (REQ-5982). The container has a fixed size, so the zoom moves no other part of the task window (REQ-5984).
- One finger pans the source while it is zoomed. A one-finger contact that moves less than 10 CSS px from its start before it lifts is a tap, and any longer move is a pan. On a computer, a trackpad pinch arrives as a wheel event with `ctrlKey` and zooms the same way. The zoom returns to 1 when the task changes.
- On a computer, the regions take focus in reading order and Enter selects one.
- A tapped region changes its look within 100 ms, with no transition.

### The report screen

The screen «Работа с источниками» sits in report v1 apart from the graph screens (REQ-5964). It shows (REQ-5966):

- I1 to I5, each with its state and the rule behind it, as the node card shows a maths node;
- first-attempt accuracy over the last 30 days by question level across all track nodes, four figures, and by node, five figures, each showing «мало данных» (too little data) below 5 first attempts;
- the reading traps that fired in the last 30 days, each with up to 3 examples drawn from `item_shown`, so the parent sees the source the player saw.

The screen shows «находит, но не считает» (finds but doesn't calculate) when at least 3 wrong first attempts in the last 30 days on track tasks that ask for a calculation matched no reading trap, and «считает, но ошибается в чтении» (calculates but misreads) when at least 3 wrong first attempts on track tasks in the same window matched one (REQ-6428). A track task asks for a calculation when it takes a number or time answer at the `calculate` or `combine` level; a wrong region tap or choice with no trap counts toward neither line and appears as unclassified on the misconceptions screen. Each line shows while its condition holds, and the screen sends no notification to the parent or the owner. After the MVP, every figure and line on the screen leaves out an attempt whose `forms` holds `nl_probe`, as the track rows do (ADR-0430).

No track node counts in the VWO readiness block's coverage, margin, ceiling or ladder (REQ-5970), and none appears in the report's gap list (REQ-5972). Both read `nodes` only, and a unit test with every track node «пока не освоено» (not mastered yet) changes no figure in either.

Text the game writes into the report and the Parent Room never names a Studievaardigheden test (REQ-6504) or claims that the player's school gives one (REQ-5924). A school document the parent imports under ADR-0310 shows as the school wrote it, whatever test it names. The Parent Room asks the parent nothing about which tests the school gives (REQ-5996). A build check searches every string file and the Parent Room's schemas for the word Studievaardigheden and fails on a match, and a search of the settings schema finds no field for the school's tests.

### Simulation, acceptance and the checklist

`tools/simulate.ts` plays each day's track tasks with a time model of the same kind as other tasks and reports `trackFirstAttempts` apart from `graphFirstAttempts` (REQ-5916). A simulated 60-minute adventure with its track tasks in must yield at least 28 graph first attempts at 1.0 times the fluency threshold (REQ-5928). Acceptance test 15 snapshots a track task with its drawn source in WebKit at the iPad viewport and in Chromium (REQ-5986). `docs/ipad-checklist.md` holds a track task answered by a tap, a pinch zoom inside the source and a page pinch outside it, which the adult judges on a real iPad (REQ-5988).

## Failure paths

| Condition | What happens |
| --- | --- |
| `tracks.sources` lacks a node of I1 to I5, holds another, or a node lacks a subtype or has a weight other than 0.25 | The graph validator fails and the file doesn't load. |
| The parent rejects a track frame because it sets no story scene | The frame stays out of the library. |
| A track template has no accepted frame for a level it asks | The build fails and the template doesn't ship. |
| A candidate source breaks the unused-data rule, the neighbour rule or the minimum gap | The generator rejects it and draws the next candidate. |
| The property test finds a violation on any of 10,000 seeds | The test fails and the template doesn't ship. |
| `src/render` throws on a source's parameters | `source_render_failed`: the server draws the next seed and logs the failure, and verify counts it. |
| SVG text in `src/render` carries a `font-size` attribute | The lint rule fails. |
| A payload sent before the first attempt holds an SVG `id` or `class` naming the correct region, a trap or the template | The payload test fails. |
| A tap lands on a label or a gap between regions | `region_tap_missed`: nothing is selected and nothing changes. |
| The device gives no two-pointer input | `zoom_unavailable`: the source stays at zoom 1, where its text is at the `task` size. |
| The first host floor ends before both its track tasks are shown | The next host floor of the same game day carries the ones not yet shown. |
| A host floor ends before both its track tasks are shown and no host floor is left that game day | The unshown track tasks lapse, and the track window counts the day as it counts any other. |
| A track node has no built template | Every node rule skips it, and the report screen shows it as «не проверено». |
| 3 adventure days pass with no completed floor carrying a track task | `track_window_missed` is logged, and the next route puts a host floor first. |
| No node of the `sources` track has a built template | The Director plans no track tasks, and the screen shows every node as «не проверено». |
| A figure on the screen rests on fewer than 5 first attempts in 30 days | `too_little_data`: the figure shows «мало данных». |
| The build's search finds Studievaardigheden in a string file or a Parent Room schema | The build fails. |
