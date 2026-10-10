---
id: TSK-1047
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6714, REQ-6716, REQ-6778, REQ-6780]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A bar is one raw share with its 80 % Wilson interval, or «мало данных», or «нет данных»

After this task, one builder turns a window's counts into a bar entry with the pooled count of right answers, the count of observations, the share and its 80 % Wilson interval, or into the state `too_little_data` or `no_data`, so every bar the later tasks add shows its count and interval or says why not.

## Acceptance criteria

1. Given a bar with 9 observations and one with 20 observations at a share of 0.5 whose interval is 28 points wide, when the builder runs, then the first reads «мало данных» with its count 9 and no value, and the second shows its value (REQ-6714). Closed by: a unit test; a bar with 20 observations at an interval wider than 30 points also reads «мало данных».
2. Given a dimension with `built: false` and the same log under `built: true` with no events, when the builder runs, then the first reads «нет данных» and the second reads «мало данных» with a count of 0 (REQ-6716). Closed by: two fixtures of the mapping file.
3. Given a bar with two streams at 12 of 20 and 5 of 10, when the builder runs, then the bar shows one count of 17 of 30 and one interval over those pooled raw counts, and a line names each stream with its own count and share; below the floor the lines show counts and no share (REQ-6778, REQ-6780). Closed by: a unit test.
4. Given 5 right of 10, when the interval is built at 80 %, z = 1.2816, then it runs from 0.31 to 0.69 (REQ-6778). Closed by: a unit test through `src/parent/intervals.ts`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/profile/bar.ts`. The floor is the profile bar's own, 10 observations or an interval wider than 30 percentage points, and it is registered in `src/parent/measures.ts` where that registry exists. The stream line of a bar with one source names that source with the bar's own count and share. The builder reads `built` from the mapping file and never infers it from the absence of events, because a built stream with no events yet must read «мало данных» with a count of 0, and a log without such events can't tell the two apart.

Compute the interval through `src/parent/intervals.ts`, which the epic realising ADR-0380 builds. Where that file doesn't exist when this task starts, add it with `wilson(right, n, z)` and `newcombe(a, b, z)` and leave its reference table and the one-module lint rule to that epic.

## Depends on

- TSK-1044 (blocking): the bar entry is part of the model.

## Evidence

Not yet.

## Left alone

The windows a bar is built over, which TSK-1046 builds, and the strings under `parent.profile.*`, which TSK-1054 owns.
