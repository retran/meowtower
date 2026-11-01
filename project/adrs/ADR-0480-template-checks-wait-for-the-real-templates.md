---
id: ADR-0480
artifact: adr
status: approved
revised: 2026-10-11
addresses: [REQ-0816, REQ-0818, REQ-0852, REQ-1244]
supersedes: []
issue: 67
projected: 21fa53c205b5
tracked: 718d52e322ee
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0480. The checks that read templates wait for the real templates, in their own epic

## Decision

The method checks of the measurement subtypes against the templates' ranges (REQ-0816, REQ-0818) and the build checks that read templates against the graph (REQ-0852, REQ-1244) leave EPC-0050. They move to EPC-0470, which runs when the real templates exist. Working now: the graph's own rules, the counts, the method values in the file, the strict schemas, and the not_generatable list. Still not working: a check of a template's numbers or of a template's declaration until a real template exists.

## Why

Both tasks read templates, and no real template exists yet: the stand-in templates name no real subtype. EPC-0050 can't close while they are open, and its acceptance is about the graph file, which is complete without them.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Keep the tasks in EPC-0050 | One epic for the graph | EPC-0050 stays open for work that doesn't yet exist |
| Drop the tasks | No open work | Their requirements would be left without a closing task |
| Move them to EPC-0470 (this) | EPC-0050 can close; the tasks wait with a named reason | Chosen |

## What it costs

Two tasks wait for the real templates, and the record carries one more epic until they land.

## What would reverse it

- The real templates for the measurement and maths nodes exist before EPC-0050 closes. Then the tasks go back into EPC-0050.

## Consequences

- TSK-0506 and TSK-0509 are moved to EPC-0470.
- EPC-0050 marks them dropped with this reason.

## How I will know it was realised

1. EPC-0470 closes once both tasks pass their checks against the real templates.

## What this does not settle

- Whether the real templates arrive in the order the epics realising ADR-0040 set.

## Plan

The upgrade folded these open tasks in (ADR-3090). Read each one before its step.
1. Area and volume by formula sit at 1S, and the perimeter node M4 splits as the requirement says (`archive/tasks/TSK-0506-graph-measurement-subtypes.md`)

