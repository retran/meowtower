---
id: ADR-0490
artifact: adr
status: approved
revised: 2026-10-11
addresses: [REQ-1232]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0490. The templates for the real maths nodes are written after the knowledge model and the strings, in their own epic

## Decision

Every maths node in the graph gets templates for each of its subtypes and answer kinds, written in a later epic that starts after the Architecture Decision Record (ADR) 0060, the knowledge model, and ADR-0160, the player's strings, are realised. Until then the stand-in and fixture templates stand in, and the checks that read templates (EPC-0470) wait.

## Why

EPC-0040 leaves these templates out on purpose: they need the graph (done, ADR-0050), the knowledge model's states and the language file (not built). Writing them earlier would put strings and states into templates that still change. No epic takes them on, so the record has to name the decision that does.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Write them now, against the fixture strings | Templates exist sooner | Strings and states would change under them |
| Put them in ADR-0060's epic | One epic for states and templates | Makes the knowledge model's epic too big |
| A separate later epic (this) | Templates follow the strings and states they need | Chosen |

## What it costs

The checks that read real templates stay unrun until the later epic, and the play uses only the fixture templates in the meantime.

## What would reverse it

- ADR-0060 and ADR-0160 are realised before the templates are needed for play. Then the templates can start earlier.

## Consequences

- EPC-0470 (checks that read real templates) depends on this decision.
- The later epic writes the templates for all 79 maths nodes, with their subtypes and answer kinds.

## How I will know it was realised

1. Every maths node has templates for each subtype, and `graph check` lists no subtype as not_generatable.

## What this does not settle

- The order in which the nodes get templates.
