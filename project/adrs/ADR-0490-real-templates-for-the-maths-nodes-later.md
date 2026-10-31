---
id: ADR-0490
artifact: adr
status: approved
revised: 2026-10-31
addresses: [REQ-1232, REQ-7520, REQ-7522, REQ-7530, REQ-7532, REQ-7534, REQ-7542, REQ-7516, REQ-7518, REQ-7524, REQ-7526, REQ-7528, REQ-7536, REQ-7538, REQ-7540, REQ-7546]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0490. The templates for the real maths nodes are written after the knowledge model and the strings, in their own epic

## Decision

The owner decided on 2026-10-24 that each subtype and answer kind gets at least ten templates, and twenty or more where the subtype has that many distinct task forms: each with its own task form, parameter shape and wording, and each yielding thousands of seeded variants. The templates conform to the Dutch programme first, and the Russian programme, with its olympiad tasks, supplies extensions that are marked as such. A domain's templates are written only after a research record names the passages of both programmes they rest on. Every maths node in the graph gets templates for each of its subtypes and answer kinds, written in a later epic that starts after the Architecture Decision Record (ADR) 0060, the knowledge model, and ADR-0160, the player's strings, are realised. Until then the stand-in and fixture templates stand in, and the checks that read templates (EPC-0470) wait.

The owner added on 2026-10-31: a template may carry a picture drawn by code, every task of geometry, area, volume and the circle has one, and its letters come from `content/pictures.<language>.json`. A string may compute a value with `{=expression}` and agree a noun with `{name|one|few|many}`, so a solution shows its intermediate results and a noun its right form without code in the template. The game walks the registry as a ladder from group 1 to group 8 until the Director chooses from the model of what the player knows.

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

1. Every maths node has at least ten templates for each subtype and answer kind, and `graph check` lists no subtype as not_generatable or as having fewer than ten.

## What this does not settle

- The order in which the nodes get templates.
- What makes two templates different forms of one subtype; the epic fixes it with the first domain.
