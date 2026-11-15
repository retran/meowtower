---
id: ADR-3410
artifact: adr
status: approved
revised: 2026-11-15
addresses: [REQ-8630, REQ-8632]
supersedes: []
concerns: [cost]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3410. The default price of a model call is seven cents, from a live run

## Decision

The studio's estimate of a generation uses 0.07 dollars for one model call where fewer than ten earlier calls are logged. This replaces the 0.05 dollars that ADR-3370 names for the same case, and nothing else in ADR-3370 changes: the range is still the fewest and the most calls of a run times the price of one, each end rounded up to the cent, and the page still says the figure is a default.

Once this is accepted, the default range of a generation is 0.28 to 1.19 dollars, where it was 0.20 to 0.85. What still doesn't work: one run is a small sample, and the price of a call changes with the model and the brief.

## Why

ADR-3370 took 0.05 dollars from a figure that traced to no log. A live run of the scenario writer on 2026-11-15, on a Claude model through the direct route, made 14 calls for 0.9222 dollars, which is 0.066 dollars a call, and it cost 0.92 dollars against the 0.85 the default range gave as its most. A drafting call cost 0.07 to 0.14 dollars and a critique 0.025 to 0.03. Rounded up, 0.07 puts the real run inside the range.

## Alternatives

| Option                 | Better at                              | Why it lost                                                          |
| ---------------------- | -------------------------------------- | -------------------------------------------------------------------- |
| Do nothing (0.05)      | Changes no record                      | The one real run cost more than the most the page promised.           |
| 0.066, the measured mean | Matches the run exactly              | It shows a precision one run cannot support; 0.07 is honest about it. |
| 0.07 (this)            | Covers the measured run, one figure    | It is still a default from a single run.                              |

## What it costs

A constant that someone must revisit when the model changes. The page says the figure is a default until ten calls are measured.

## What would reverse it

- Ten measured calls whose mean differs from 0.07 by a third or more, which would show the default is off.

## Consequences

The constant `DEFAULT_CALL_USD` is 0.07, and the tests and the estimate route follow it. ADR-3370 keeps its wording, and this decision states the number now in force.

## How I will know it was realised

1. The estimate route returns the range 0.28 to 1.19 with the basis default, when fewer than ten calls are logged, in an integration test.

## What this does not settle

- A price by model, or from token rates before any call exists.

## Plan

1. The default price of a call is 0.07 dollars (REQ-8630, REQ-8632). It touches `src/server/studio/generate.ts`.
