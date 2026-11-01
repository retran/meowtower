---
id: EPC-0300
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0300
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Sources track runs beside the skill graph as five nodes with states of their own, two fixed tasks on a host floor, a drawn source and a screen of its own

Realises exactly ADR-0300: the track in the graph file, the rows and states from track first attempts alone, the placement of 2 track tasks on the first host floor with the track window and the node rule, the counts kept apart from graph attempts, the source template contract with its generator rules and property test, the drawn source and its payload, the region answer, the seven reading traps, the `SourceView` component with its zoom, the report screen, the snapshots and the real-iPad checklist, and the templates for I1 to I5.

Until the epics realising ADR-0040, ADR-0050, ADR-0060, ADR-0070, ADR-0130, ADR-0150, ADR-0180 and ADR-0190 exist, the tasks run on fixture graphs, fixture templates and stand-in screens. Each task names what it leaves to those epics. The epic realising ADR-0290 places the Volley before the track tasks, and the epic realising ADR-0430 places the Dutch probe letters after them, so this epic plans a floor with neither.

## Acceptance criteria

1. `./meowtower graph check` reports 79 maths nodes in nine domains and a `sources` track of I1 to I5, each with `citoBlock: null` and no domain or level. Evidence: the command's output, from TSK-0900.
2. A property test on random logs changes the answers of track attempts and every maths node's estimate and state stays equal, and changing maths attempts leaves every track row equal. Evidence: the property test's report, from TSK-0901.
3. A golden fixture log gives I1 and I2 «понимает» by full blocks, and only then does the Director offer an I5 task. Evidence: the Director test's report, from TSK-0903 and TSK-0915.
4. A 30-day simulation shows, on every adventure day with a host floor, exactly 2 track tasks on the first host floor or on the next host floor of the same game day, never on a floor outside S, M, G and P, never in a room slot, and at least one completed floor with a track task in any 3 consecutive adventure days for every profile that completes a floor a day, with `track_window_missed` logged for each missed window of a profile that abandons its first floor. Evidence: the simulation's report, from TSK-0902 and TSK-0903.
5. The 60-minute simulation reports graph and track first attempts apart, with at least 28 graph first attempts at 1.0 times the threshold. Evidence: the simulation's report, from TSK-0904.
6. The property test on 10,000 seeds for each track template finds zero tasks with two correct answers or regions, zero question texts that hold the answer or an intermediate step result, zero `solve()` results with an empty reader, zero sources without unused data and zero read values without a different unused neighbour at the minimum gap. Evidence: the property test's report, from TSK-0906, TSK-0914 and TSK-0915.
7. A rebuild test regenerates 1,000 logged track tasks from template, version and seed and finds every source value equal, and a static check finds no string in any track template's parameter schema. Evidence: the rebuild test's report and the check's output, from TSK-0905.
8. A checker test gives a region answer 1 for the correct region and 0 for its neighbour, classed as `misread_cell`, and a fixture of all seven traps lands in the error-type limit as three conceptual and four procedural. Evidence: the checker and limit tests' reports, from TSK-0908 and TSK-0909.
9. The misconceptions screen shows one row for `misread_cell` fired on S1 and on I1. Evidence: the report test's report, from TSK-0909.
10. A Playwright test at the iPad viewport finds every source region at least 56 by 56 px, every SVG text in a source at least 24 px, or 28 px with large text, no `getAnimations()` result during a scripted pinch, and every element of the task window outside the source at the same place before and after it. Evidence: the Playwright report, from TSK-0910 and TSK-0911.
11. Acceptance test 15 stores snapshots of a track task in WebKit at the iPad viewport and in Chromium, and the stage's checklist records a tap answer, a pinch inside the source and a page pinch outside it on a real iPad. Evidence: the stored snapshots and the adult's recorded judgement, from TSK-0913.
12. The report has nine screens, the Sources screen shows states, accuracy by level, fired traps and each gap line at its threshold of 3 in 30 days, and a fixture with no track attempts shows «не проверено» on every node. Evidence: the report test's report, from TSK-0912.
13. Unit tests of the VWO block and the gap list with every track node «пока не освоено» change no figure. Evidence: the unit tests' reports, from TSK-0912.
14. The build's search finds no Studievaardigheden in any string file, and a search of the Parent Room's settings schema finds no field for the school's tests. Evidence: the build check's output, from TSK-0912.
15. The payload test finds no SVG `id` or `class` naming a region's correctness, a trap or a template in any track task sent before its first attempt. Evidence: the payload test's report, from TSK-0907.
16. Every requirement ADR-0300 addresses lands in at least one task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the count of graph first attempts in the 60-minute simulation against 28, which TSK-0904 reports, and the number of days in a 30-day simulation on which a profile that leaves its first floor early shows `track_window_missed`, which TSK-0903 reports. ADR-0300 reverses to a `source` format on the six graph nodes if a track node is still «не проверено» or «уточняется» after 6 weeks of play, and the real log tells that only after the stage is played.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0900 The graph file holds the Sources track as five nodes outside the 79 maths nodes
      closes: REQ-5900, REQ-5902
      depends: none
- [ ] T-002 TSK-0901 Track nodes keep an estimate and a state from unassisted first attempts on track tasks alone
      closes: REQ-5904, REQ-5906, REQ-5908, REQ-5910
      depends: TSK-0900 - the track nodes and subtypes the rows belong to.
- [ ] T-003 [P] TSK-0905 A source template keeps its whole source in its parameters, holds no text and asks at one of four levels
      closes: REQ-5932, REQ-5936, REQ-5992
      depends: none
- [ ] T-004 TSK-0902 A host floor carries 2 track tasks as a fixed part of the floor and never as a room slot
      closes: REQ-5912, REQ-5918, REQ-5922
      depends: TSK-0900 - the track nodes the plan names.; TSK-0905 (not blocking) - the template contract that builds the task; the test uses a fixture track template until it lands.
- [ ] T-005 TSK-0903 The track window brings a host floor forward, the Director picks the node by rule, and I5 waits for two nodes at «понимает»
      closes: REQ-5914, REQ-5920
      depends: TSK-0901 - the states the picks and the gate read.; TSK-0902 - the placement of the 2 tasks the window and the node choice work on.
- [ ] T-006 TSK-0904 Track first attempts are counted apart, and a 60-minute adventure with track tasks still yields 28 graph first attempts
      closes: REQ-5916, REQ-5926, REQ-5928
      depends: TSK-0902 - the track tasks the simulated day holds.; TSK-0903 - the window and node choice that decide which days carry them.; TSK-0905 (not blocking) - the template contract; the time model uses a fixture track template until it lands.
- [ ] T-007 [P] TSK-0906 Every generated source holds unused data and a different neighbour, and the property test holds on 10,000 seeds
      closes: REQ-5938, REQ-5940, REQ-5942, REQ-5944, REQ-5946
      depends: TSK-0905 - the `source` and `question` split and the `SourceReader` the rules and the test read.
- [ ] T-008 [P] TSK-0907 The server draws every table, chart, timetable and map as SVG from the task's parameters, and the payload names no correct region
      closes: REQ-5934
      depends: TSK-0905 - the parameter types the renderer reads.
- [ ] T-009 [P] TSK-0908 A track task takes a tap on one region, a choice of labels or a duration in minutes
      closes: REQ-5948, REQ-5950, REQ-5952, REQ-5954
      depends: none
- [ ] T-010 TSK-0909 Seven reading traps name every reading mistake, and the error-type limit classes each as conceptual or procedural
      closes: REQ-5956, REQ-5958, REQ-5960, REQ-5962
      depends: TSK-0905 - the template contract the trap's `apply()` sits in.; TSK-0908 - the region answer a trap classifies.
- [ ] T-011 TSK-0910 SourceView shows the drawn source in the task window with 56 px touch zones and text at the task size
      closes: REQ-5120, REQ-5974, REQ-5976, REQ-5978
      depends: TSK-0907 - the SVG the component shows.; TSK-0908 - the region answer the component sends.
- [ ] T-012 TSK-0911 A pinch inside the source zooms it with no animation and moves nothing else in the task window
      closes: REQ-5980, REQ-5982, REQ-5984
      depends: TSK-0910 - the component and its regions.
- [ ] T-013 TSK-0912 The report's ninth screen «Работа с источниками» shows states, accuracy by level and the traps that fired
      closes: REQ-5964, REQ-5966, REQ-5970, REQ-5972, REQ-5924, REQ-5996, REQ-6064
      depends: TSK-0901 - the states the screen shows.; TSK-0909 - the traps it counts and names.
- [ ] T-014 TSK-0913 A track task is snapshotted in WebKit and Chromium, and the adult tests it on a real iPad
      closes: REQ-5986, REQ-5988
      depends: TSK-0907 - the drawn source the snapshots show.; TSK-0911 - the pinch the checklist item tests.
- [ ] T-015 TSK-0914 Templates for I1 to I4 ask at four levels, each in a story scene with a frame the parent accepted
      closes: REQ-5930
      depends: TSK-0905 - the contract the templates follow.; TSK-0906 - the rules and the property test they must pass.; TSK-0907 - the renderer that draws each kind.; TSK-0908 - the answer kinds a template asks for.; TSK-0909 - the traps a template names.
- [ ] T-016 TSK-0915 Templates for I5 combine two sources, and the first version holds the whole track
      closes: REQ-5990
      depends: TSK-0914 - the source builders and frames the I5 templates combine.; TSK-0903 - the I5 gate and the node choice its criteria read.; TSK-0912 (not blocking) - the report screen the owner's judgement covers; a template can be built before it.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0900, TSK-0905 and TSK-0908.
- After TSK-0900: TSK-0901 and TSK-0902.
- After TSK-0905: TSK-0906 and TSK-0907.
- After TSK-0901 and TSK-0902: TSK-0903.
- After TSK-0905 and TSK-0908: TSK-0909.
- After TSK-0907 and TSK-0908: TSK-0910.
- After TSK-0901 and TSK-0909: TSK-0912.
- After TSK-0907 and TSK-0911: TSK-0913.
- After TSK-0902 and TSK-0903: TSK-0904.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0900 | REQ-5900, REQ-5902 |
| TSK-0901 | REQ-5904, REQ-5906, REQ-5908, REQ-5910 |
| TSK-0902 | REQ-5912, REQ-5918, REQ-5922 |
| TSK-0903 | REQ-5914, REQ-5920 |
| TSK-0904 | REQ-5916, REQ-5926, REQ-5928 |
| TSK-0905 | REQ-5932, REQ-5936, REQ-5992 |
| TSK-0906 | REQ-5938, REQ-5940, REQ-5942, REQ-5944, REQ-5946 |
| TSK-0907 | REQ-5934 |
| TSK-0908 | REQ-5948, REQ-5950, REQ-5952, REQ-5954 |
| TSK-0909 | REQ-5956, REQ-5958, REQ-5960, REQ-5962 |
| TSK-0910 | REQ-5120, REQ-5974, REQ-5976, REQ-5978 |
| TSK-0911 | REQ-5980, REQ-5982, REQ-5984 |
| TSK-0912 | REQ-5964, REQ-5966, REQ-5970, REQ-5972, REQ-5924, REQ-5996, REQ-6064 |
| TSK-0913 | REQ-5986, REQ-5988 |
| TSK-0914 | REQ-5930 |
| TSK-0915 | REQ-5990 |

The smallest set of tasks that would test the decision is TSK-0901, TSK-0903, TSK-0906 and TSK-0914. Together they show whether track states stay apart from maths states, whether the Director really places 2 tasks a host day within the 3-day window, whether a source can hide the answer from the question, and whether a track task reads as a story to the parent, which are the failures the decision's premortem and its reversal conditions name.

## Not covered

- REQ-5968, the two gap lines, which ADR-0360 addresses as REQ-6428 after it superseded REQ-5968; ADR-0300 no longer addresses it, and TSK-0912 shows the lines as ADR-0300's twelfth criterion asks.
- REQ-5994, the ban on naming a Studievaardigheden test, which ADR-0370 addresses as REQ-6504; TSK-0912 builds the search for the game's own text, which both records need.
- REQ-5856, the order of a maths floor, which ADR-0430 and ADR-0460 address as REQ-7148; TSK-0902 places the track tasks inside that order.
