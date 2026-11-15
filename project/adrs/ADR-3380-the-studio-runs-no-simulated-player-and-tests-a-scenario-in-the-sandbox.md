---
id: ADR-3380
artifact: adr
status: approved
revised: 2026-11-15
addresses: [REQ-8302]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3380. The studio runs no simulated player, and the parent tests a scenario in the sandbox

## Decision

The studio does not run a simulated player under a persona through a scenario, and it does not report the paths of one. REQ-8294, which required it, is withdrawn by this decision. The parent tests a scenario by playing it in the sandbox: from any encounter, with the state levers and a forced outcome, and with the graph marking the encounters and exits no test has reached (REQ-8286, REQ-8288, REQ-8290, REQ-8296, REQ-8614). The prompt lab of REQ-8302 stays in plan step 8 of ADR-3280 on its own.

The owner instructed on 2026-11-15 that the simulated player is not wanted. No code of it exists, so nothing is removed from the program. The specification of the studio stops stating it, and the plan of ADR-3280 keeps only the prompt lab in step 8.

Once this is accepted, the studio promises no automatic play of a scenario. What still doesn't work: the parent finds the paths of a scenario by playing them, and the unreached marks are her only guide to what is left.

## Why

A simulated player needs a model call at each turn of a run, a persona that someone writes and maintains, and a report that someone reads. The owner judged that effort not worth it beside the sandbox, which already lets the parent start at any encounter and see what each test reached.

## Alternatives

| Option                          | Better at                                   | Why it lost                                                              |
| ------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| Do nothing                      | Keeps a requirement nobody has built        | The owner does not want it, and an open requirement with no plan misleads. |
| Build it as the requirement says | Tests many paths without the parent playing | It costs a model call a turn, and a persona and a report to maintain.     |
| Withdraw it (this)              | Removes a promise the project will not keep | The parent finds paths by hand.                                          |

## What it costs

The parent plays each path she wants to test. A long scenario of 10 to 20 encounters takes her a few minutes a path, and the unreached marks tell her which are left.

## What would reverse it

- A scenario in which the parent cannot reach every encounter by hand in reasonable time, which would make an automatic walk worth its cost.

## Consequences

REQ-8294 is withdrawn. The studio specification no longer states it, and plan step 8 of ADR-3280 names the prompt lab alone.

## How I will know it was realised

1. `paw check` reports no requirement in force that no record states or plans, with REQ-8294 withdrawn.

## What this does not settle

- The prompt lab of REQ-8302, which ADR-3280 plans.
- Whether a simulated player returns later; that would be a new requirement.

## Plan

1. The studio specification no longer states the simulated player, and plan step 8 of ADR-3280 keeps only the prompt lab (REQ-8302). It touches `project/specs/SPC-0460-the-world-calendar-story-series-memory-ontology-and-pipeline.md` and `project/adrs/ADR-3280-the-parent-designs-the-campaign-in-a-studio-of-nested-graphs.md`.
