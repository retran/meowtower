---
id: TSK-1039
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6654, REQ-6656, REQ-6658, REQ-6660]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `item_shown` records two new purposes and the probe's presentation, and stored events stay readable

After this task, `item_shown` accepts the purposes `retention_check` and `nl_probe` with no version change, carries the field `probe` in a new payload version whose upcaster leaves it absent, and refuses any field for days since the last exposure.

## Acceptance criteria

1. Given an `item_shown` payload with purpose `retention_check` and one with `nl_probe`, when the schema validates each, then both pass in the payload version that was current before this task (REQ-6654). Closed by: a schema test.
2. Given a probe task shown with the presentation `ru`, when the event is written, then `probe` holds `ru`, and given a stored event of the earlier version, then the upcaster reads it with `probe` absent (REQ-6656). Closed by: a schema test and an upcaster test.
3. Given stored `item_shown` events of every earlier version, when the log is replayed through the upcasters before and after the new version exists, then every projection gives the same output (REQ-6660). Closed by: a replay test over a fixture log with events of each version.
4. Given an `item_shown` payload with `daysSinceLastExposure` or `firstExposure`, when the strict schema validates it, then it refuses it (REQ-6658). Closed by: a strict-schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `probe` as the next payload version of `item_shown` after the latest one `src/shared/events.ts` holds when the task starts. ADR-0380 calls it version 3 on the assumption that version 2 exists and holds MVP events; if no event of the version before it is stored by then, add `probe` there as an optional field in place. I chose a non-empty string for the field's type; the epic realising ADR-0430 narrows it to its presentations. The days since the last exposure is a difference of two logged dates, so a projection computes it. `firstExposure` is the projection `first_exposures` of ADR-0410.

This task lands in the release that brings the probe. Before it, ADR-0380's scope guard fails on the `nl_probe` string in `src/engine/` (TSK-1040).

## Depends on

Nothing in this epic.

The epic realising ADR-0430 writes the events; this task fixes their shape.

## Evidence

Not yet.

## Left alone

The values of `probe`, which ADR-0430 defines, and the `purpose` values' use by the Director, which the epics realising ADR-0400 and ADR-0430 build.
