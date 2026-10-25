---
id: EPC-0480
artifact: epic
status: approved
revised: 2026-10-24
realises: ADR-0490
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every maths node has templates for each of its subtypes and answer kinds

Realises exactly ADR-0490. It starts after the knowledge model (EPC-0060, done) and the player's strings (EPC-0160) are done, and it unblocks EPC-0470, whose checks read these templates. One task writes the templates of one domain, so each pull request reviewer reads one area of the maths.

## Acceptance criteria

1. Every maths node has at least ten templates for each subtype and answer kind, and `./meowtower graph check` lists no subtype as not_generatable or as having fewer than ten templates. Evidence: the command's output, from TSK-1201.
2. Every template of a domain passes `npm run verify:templates`: no invalid parameters, no disagreement with the reference solver, no equal traps and no text that breaks the text rules. Evidence: the verification run's report for each domain, from TSK-1192 to TSK-1200.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

## Tasks

- [x] T-001 [P] TSK-1192 The 8 nodes of domain N have templates for every subtype and answer kind
      closes: REQ-1232
      depends: TSK-0676 (blocking) - the typed string function that task text and keys go through.
- [ ] T-002 [P] TSK-1193 The 17 nodes of domain A have templates for every subtype and answer kind
      closes: REQ-1232
      depends: TSK-0676 (blocking) - the typed string function that task text and keys go through.; TSK-1192 (not blocking) - the first domain settles the template conventions the others copy.
- [ ] T-003 [P] TSK-1194 The 8 nodes of domain F have templates for every subtype and answer kind
      closes: REQ-1232
      depends: TSK-0676 (blocking) - the typed string function that task text and keys go through.; TSK-1192 (not blocking) - the first domain settles the template conventions the others copy.
- [ ] T-004 [P] TSK-1195 The 7 nodes of domain D have templates for every subtype and answer kind
      closes: REQ-1232
      depends: TSK-0676 (blocking) - the typed string function that task text and keys go through.; TSK-1192 (not blocking) - the first domain settles the template conventions the others copy.
- [ ] T-005 [P] TSK-1196 The 7 nodes of domain P have templates for every subtype and answer kind
      closes: REQ-1232
      depends: TSK-0676 (blocking) - the typed string function that task text and keys go through.; TSK-1192 (not blocking) - the first domain settles the template conventions the others copy.
- [ ] T-006 [P] TSK-1197 The 14 nodes of domain M have templates for every subtype and answer kind
      closes: REQ-1232
      depends: TSK-0676 (blocking) - the typed string function that task text and keys go through.; TSK-1192 (not blocking) - the first domain settles the template conventions the others copy.
- [ ] T-007 [P] TSK-1198 The 7 nodes of domain G have templates for every subtype and answer kind
      closes: REQ-1232
      depends: TSK-0676 (blocking) - the typed string function that task text and keys go through.; TSK-1192 (not blocking) - the first domain settles the template conventions the others copy.
- [ ] T-008 [P] TSK-1199 The 7 nodes of domain S have templates for every subtype and answer kind
      closes: REQ-1232
      depends: TSK-0676 (blocking) - the typed string function that task text and keys go through.; TSK-1192 (not blocking) - the first domain settles the template conventions the others copy.
- [ ] T-009 [P] TSK-1200 The 4 nodes of domain T have templates for every subtype and answer kind
      closes: REQ-1232
      depends: TSK-0676 (blocking) - the typed string function that task text and keys go through.; TSK-1192 (not blocking) - the first domain settles the template conventions the others copy.
- [ ] T-010 TSK-1201 No subtype of the graph is listed as not_generatable
      closes: REQ-1232
      depends: TSK-1192 (blocking) - domain N's templates; TSK-1193 (blocking) - domain A's templates; TSK-1194 (blocking) - domain F's templates; TSK-1195 (blocking) - domain D's templates; TSK-1196 (blocking) - domain P's templates; TSK-1197 (blocking) - domain M's templates; TSK-1198 (blocking) - domain G's templates; TSK-1199 (blocking) - domain S's templates; TSK-1200 (blocking) - domain T's templates.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1192 | REQ-1232 |
| TSK-1193 | REQ-1232 |
| TSK-1194 | REQ-1232 |
| TSK-1195 | REQ-1232 |
| TSK-1196 | REQ-1232 |
| TSK-1197 | REQ-1232 |
| TSK-1198 | REQ-1232 |
| TSK-1199 | REQ-1232 |
| TSK-1200 | REQ-1232 |
| TSK-1201 | REQ-1232 |

The smallest set of tasks that would test the decision is TSK-1192 and TSK-1201. The first domain shows whether the template conventions hold against the real strings and states, and the last shows whether every subtype of the graph is generatable.

## Not covered

- The order in which the nodes get templates, which ADR-0490 leaves open: the domains run in parallel after the first.
- The checks that read these templates (the method rule of the measurement subtypes and the build checks that tie templates to the graph): EPC-0470.
