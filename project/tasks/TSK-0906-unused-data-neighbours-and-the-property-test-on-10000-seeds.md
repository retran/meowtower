---
id: TSK-0906
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5938, REQ-5940, REQ-5942, REQ-5944, REQ-5946]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every generated source holds unused data and a different neighbour, and the property test holds on 10,000 seeds

After this task, the generator rejects a source that has no data the solution leaves unused or a read value without a clearly different neighbour, and a property test runs each source template on 10,000 seeds against four rules.

## Acceptance criteria

1. Given a candidate source in which the solution reads every value, when the generator checks it, then it rejects the candidate and draws the next one, and an accepted source holds at least one value the solution doesn't use (REQ-5938). Closed by: a generator test with a fixture candidate.
2. Given a read value, when the generator checks its adjacent cell, bar or square, then the neighbour holds a different value that the solution doesn't use, at least 5 minutes away for times and at least 10 % of the read value and never less than 2 away for numbers; a candidate that breaks either bound is rejected (REQ-5940). Closed by: a generator test at each bound, one value inside and one outside.
3. Given each source template and 10,000 seeds, when the property test runs, then every task has exactly one correct answer or one correct region (REQ-5942). Closed by: the property test's report.
4. Given the same seeds, when the rendered question text is read, then no number in it equals the answer or any intermediate step result of the solution graph, while an input the question itself states stays allowed unless it equals the answer (REQ-5944). Closed by: the property test's report.
5. Given the same seeds, when `solve()` runs with an empty `SourceReader`, then it returns `no_answer` every time (REQ-5946). Closed by: the property test's report.
6. Given the ceilings, when a source is generated, then a table has at most 6 rows by 6 columns with headers, a timetable at most 6 by 5, a chart at most 8 bars or 8 points on each of at most 2 lines, and a map at most 8 by 6 squares (ADR-0300). Closed by: a generator test at each ceiling.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two rules to the generator as candidate rejections, the way the generator already rejects an indistinct trap, and the minimum gap as a constant for each of times and numbers. I chose the gaps, as ADR-0300 did, so a misread gives a clearly different answer and not a near miss of the eye.

Add the property test to the template verification run of ADR-0040 and run it on the fixture templates of the track's four source kinds. The test then covers every template that later tasks add, with no change. I chose the ceilings on source size so that at zoom 1 every region keeps its 56 px zone and the source fits the task window at 1180 by 820.

## Depends on

- TSK-0905 (blocking): the `source` and `question` split and the `SourceReader` the rules and the test read.

## Evidence

Not yet.

## Left alone

The real templates for I1 to I5, which TSK-0914 and TSK-0915 write and which this test then covers. Fitting a source at its ceiling in the task window, which the snapshots of TSK-0913 check.
