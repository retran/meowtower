---
id: TSK-1038
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6646, REQ-6652, REQ-6690]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The four new event types each have one owning decision, and the owner check fails while it is a draft

After this task, the event-owner table names ADR-0400 for `retention_check_planned`, ADR-0430 for `probe_family_created` and ADR-0450 for `hypothesis_recorded` and `hypothesis_updated`, and the owner check fails a type whose owner isn't approved.

## Acceptance criteria

1. Given the owner table, when a schema test reads it, then it names the four types with the owners above, each type's schema carries the same owner when it exists, and the types appear from the releases ADR-0380 names: retention checks (REQ-6646), the probe (REQ-6690) and the first version for the hypotheses (REQ-6652). Closed by: a schema test.
2. Given a fixture where the owner of a type is a draft decision, when group 1 runs, then the owner check fails with `event_type_unowned` and names the type (REQ-6646, REQ-6652, REQ-6690). Closed by: a group 1 check and its fixture.
3. Given a fixture event type with no owner in the table, when group 1 runs, then the check fails the same way (REQ-6652). Closed by: the same check.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the four entries to the owner table of ADR-0210. Where that epic hasn't built the table when this task starts, add `verify/event-owners.json` as a map from event type to owning decision, which is my choice of shape, and a group 1 check over it; the epic realising ADR-0210 then moves the entries. The event types' schemas and payloads belong to the owners: the epic realising ADR-0400 adds `retention_check_planned`, and the epics realising ADR-0430 and ADR-0450 add theirs. Each owner adds its further types under the same rule, such as ADR-0400's `retention_check_cancelled`.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The payloads of the four types, which their owning decisions define, and the scope guard's traces for the two deferred schemas, which TSK-1040 builds.
