---
id: TSK-1148
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: [REQ-7350, REQ-7352]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Static checks keep a hypothesis off the gateway and the model off the label

After this task, group 1 fails when a module under the gateway or a request-class builder imports a hypothesis schema, the `hypothesis_days` projection or `src/parent/hypotheses/`, so a hypothesis can't reach a model call or leave the Mac through a path nobody tested.

## Acceptance criteria

1. Given a fixture module under the gateway of ADR-0100 that imports a hypothesis event schema, when group 1 runs, then `hypothesis_to_gateway` fails and names the module (REQ-7350). Closed by: a fixture test of the check.
2. Given a fixture request-class builder that imports `hypothesis_days` or a module of `src/parent/hypotheses/`, when group 1 runs, then the check fails the same way, and given the judge of ADR-0350 in the same position, then it fails too (REQ-7352). Closed by: two fixture tests of the check.
3. Given the repository as it stands, when group 1 runs, then `hypothesis_to_gateway` finds no import. Closed by: the lint verb's output.
4. Given `school_export_scope` of ADR-0310, when a fixture export is built from a log that holds a hypothesis, then the export holds none of its text, criteria, links, states or label (REQ-7350). Closed by: an export test over a log with a canary hypothesis.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `hypothesis_to_gateway` to `tools/static-checks.ts`: it reads the import graph of each module under the gateway and each request-class builder, and fails on an import path that reaches the hypothesis schemas in `src/shared/events.ts` by name, the `hypothesis_days` projection or `src/parent/hypotheses/`. A test catches only the paths it runs, which is why the check reads imports.

## Depends on

- TSK-1140 (blocking): it names the schemas the check forbids.
- TSK-1145 (not blocking): the check also names `hypothesis_days`; a fixture file with that name stands in until the projection exists.

The epic realising ADR-0100 supplies the gateway and its request classes, and the epic realising ADR-0310 supplies `school_export_scope`; the fixtures stand in for both until then.

## Evidence

Not yet.

## Left alone

The whole-log export, which carries hypotheses on the Mac only, as ADR-0450 states.
