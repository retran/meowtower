---
id: TSK-1049
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6744, REQ-6746]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The basic facts bar counts each fact once and shows the time and threshold behind it

After this task, the basic facts bar counts one observation for each distinct fact shown in its window, a success when the fact ends the window in «автоматизм», and shows beside it the median fact time and the fact threshold for each device type.

## Acceptance criteria

1. Given a fact shown five times in the window that ends it in «автоматизм» and a fact shown once that ends it short of that, when the bar is built, then it counts 2 observations and 1 success, so a fact the Volley shows often doesn't outweigh the rest (REQ-6744). Closed by: a fixture log.
2. Given a window holding right fact answers on an iPad and on the computer, when the bar is built, then it shows for each device type the median time of right fact answers with its distribution-free 80 % interval and the fact threshold of that device type (REQ-6746). Closed by: a fixture log with two device types.
3. Given a fact threshold change between the two windows, when both windows are computed, then both replay fact states under the new threshold version, and the change line equals the one computed with the new threshold from the start (REQ-6744). Closed by: a fixture log with a `fact_threshold_set` event.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/profile/basic-facts.ts`. Replay ADR-0290's `fact_states` rule to each window's last event under the given threshold version, and take the success from that state. Read the median time and its interval through `src/parent/intervals.ts`. The side figures cover the current window only, a choice I made because ADR-0390 draws the previous window as a thin bar and names no side figure for it.

## Depends on

- TSK-1045 (blocking): an attempt carrying a `factId` is routed to this bar first.
- TSK-1046 (blocking): the windows.
- TSK-1047 (blocking): the bar builder.

The epic realising ADR-0290 supplies `fact_states` and the threshold versions; a fixture of fact events and a threshold stand in until it exists, and the replay function is then the only code to swap.

## Evidence

Not yet.

## Left alone

The `threshold_uncalibrated` notice beside the threshold, which ADR-0180 states.
