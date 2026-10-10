---
id: TSK-0763
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5062, REQ-5064, REQ-5074]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every event schema names an approved owner, no code names the school's vendor, and the parent's acts have owned types

After this task, each schema in `src/shared/events.ts` declares `owner: "ADR-NNNN"`, a check fails when a type has no owner or its owner isn't an approved decision in `project/adrs/`, a search fails on the school system's vendor name in `src/`, `content/` and `tools/`, and the parent's mark «тренировали факты» (we trained facts) is written as `facts_trained_marked`.

## Acceptance criteria

1. Given a schema with no `owner`, when the owner check runs, then it fails and names the type; given a schema owned by a draft decision, then it fails the same way (REQ-5062). Closed by: the check's test with two fixture schemas.
2. Given the table of owners in ADR-0210, when the check runs on the tree, then every type already registered has an owner that is an approved decision, and `appendEvents` still refuses a payload with no schema (REQ-5062). Closed by: the check's output and the append test.
3. Given a fixture file in `src/` that names the vendor listed in `verify/scope-guard.json`, when the search runs, then it fails; given the tree, then it passes, and no event type is named after the vendor (REQ-5064). Closed by: the search's fixture test and its output on the tree.
4. Given the parent's four acts, a puzzle approved, a hint rung's framing approved, a template or puzzle turned off, and facts trained, when each is made, then the log records it as `puzzle_approved`, `rung_framing_approved`, `content_disabled` or `facts_trained_marked`, each with its owner declared (REQ-5074). Closed by: a table test on the owner list for the first three, whose schemas arrive with their owners' epics, and an integration test for `facts_trained_marked`.
5. Given the parent marks facts trained, when the event is read back, then it carries `facts`, a list of fact ids from `content/facts.yaml`, `lessonDate` and an optional `note` (REQ-5074). Closed by: the integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `owner` to the schema definition type in `src/shared/events.ts` and fill it for every type already registered from ADR-0020's catalogue. Add a group 1 check that reads each owner and confirms the decision's file under `project/adrs/` is approved. Add the vendor name to `verify/scope-guard.json` and make the scope guard search the three folders for it. The name sits only in that file, which the search skips, because the repository is public and one file is the one place to change when the school's system changes.

Register `facts_trained_marked` with owner ADR-0210. This task adds the parent's route that writes it and a test request that stands in for the control; the Parent Room's screen for it belongs to ADR-0180's epic. The three bridge types are in TSK-0770. The other three acts of REQ-5074 are written once the epics realising ADR-0220, ADR-0280 and ADR-0340 register their types, and the owner check holds them to the same rule.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

The schemas of the types other decisions own, and the `school_snapshot_*` types, which have no schema before ADR-0310's item starts.
