---
id: EPC-0470
artifact: epic
status: approved
revised: 2026-10-11
realises: ADR-0480
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The checks that read templates run once the real templates exist

Realises exactly ADR-0480 and waits for ADR-0490, the decision that writes the real templates: the method checks of the measurement subtypes against the templates' ranges, and the build checks that tie templates to the graph.

## Acceptance criteria

1. The measurement subtypes of M4, M5 and M7 meet their method rule against the real templates' ranges, and a template whose range breaks the rule fails the build.
2. A template that names a missing subtype or a missing node fails the build, and a template that carries a level or a weight is refused by its schema, with the real templates in place.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

## Tasks

- [ ] T-001 TSK-0506 The measurement subtypes' method rule checked against the real templates' parameter ranges (waits for the real templates)
      closes: REQ-0816, REQ-0818
      depends: none - the rule is already in the validator; the reviewing agent reads the templates
- [x] T-002 TSK-0509 The build fails on a template that names a subtype or node the graph lacks, and refuses a level or a weight in any content file (done: pull request 19)
      closes: REQ-0852, REQ-1244
      depends: none - the checks are in src/engine/catalogue.ts and tools/graph-check.ts

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0506 | REQ-0816, REQ-0818 |
| TSK-0509 | REQ-0852, REQ-1244 |

## Not covered

- The real templates themselves: they come with the epics that realise the maths nodes' templates (ADR-0040 and ADR-0050).
