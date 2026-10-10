---
id: TSK-1029
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6622, REQ-6624]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each measure owns a «мало данных» floor, and a figure below it feeds no finding

After this task, `src/parent/measures.ts` registers every measure of addendum 2's report parts with its floor, a check fails a measure without one, and every consumer of a figure takes it through one function that refuses a figure below its floor.

## Acceptance criteria

1. Given a fixture measure registered with no floor, when group 1 runs, then it fails with `measure_floor_missing` and names the measure (REQ-6622). Closed by: a group 1 check and its fixture.
2. Given a share on 4 observations and a median time on 4 observations of a measure with no floor of its own, when the figure is built, then both read «мало данных» with their count, and given 5 observations, then both show a value and an interval (REQ-6622). Closed by: a unit test.
3. Given each registered measure fed a count one below its floor, when an interpretation line, a quadrant, a profile line and a hypothesis status are built from it, then none is built (REQ-6624). Closed by: a property test over the registry.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/measures.ts` with the default floor of 5, which ADR-0240 and ADR-0300 already use for a cell and which keeps every median interval defined because the order-statistic interval needs at least 4 values. Register the floors the research set: a profile bar under 10 observations or with an interval wider than 30 points (ADR-0390), a transfer figure under 10 eligible observations (ADR-0410), a probe cell under 12 (ADR-0430) and a hypothesis condition under 20 (ADR-0450). The limits and the interest signal keep the floors of ADR-0180 and ADR-0330, because they count sessions and days.

Expose one function, `usable(figure)`, that returns nothing for a figure below its floor, and require every line, quadrant, profile line and status to call it. The property test uses stub consumers of the four kinds until those parts exist.

## Depends on

- TSK-1028 (blocking): the figure type and the count below which it says `too_little_data`.

## Evidence

Not yet.

## Left alone

The consumers themselves: the profile, the quadrants, the probe's report and the hypotheses each register their measures in their own epic and call `usable`.
