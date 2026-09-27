---
id: TSK-0210
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-2204, REQ-2206, REQ-2208, REQ-2212, REQ-3804]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Schemas, upcasters and the start-up schema check, with the task and attempt events

After this task, `src/shared/events.ts` holds a zod schema per event type and payload version, `appendEvents` refuses a payload that fails its schema, projections can read an old payload through its upcasters, and `meowtower` refuses to start on a log holding a type or version with no schema. The first schemas are the task and attempt events, each requiring every fact REQ-2204, REQ-2206, REQ-2208, REQ-2212 and REQ-3804 name.

## Acceptance criteria

1. Given the schema of `item_shown`, when a test appends one without any single fact of SPC-0020's `item_shown` rows (full rendered view with its `locale`, template, template version, seed, parameters, node, subtype, purpose, attempt number, correct answer, short solution), then `appendEvents` writes nothing and names the missing field. Closed by: `tests/unit/event-schemas.test.ts`, one case per fact.
2. Given a second attempt, when its `item_shown` lacks `parentItemId` pointing to the first attempt's `itemId`, then `appendEvents` refuses it. Closed by: the same test.
3. Given the schemas of `attempt_submitted`, `verdict`, `hint_shown`, `thread_spent`, `solution_shown` and `explanation_shown`, when a test omits any fact SPC-0020's attempt rows name, the input summary's six parts included, then `appendEvents` refuses the event; and `explanation_shown` refuses a field holding the explanation's text. Closed by: the same test.
4. Given the schema of `glossary_opened`, when the event lacks the term or the `itemId`, then `appendEvents` refuses it. Closed by: the same test.
5. Given a type with versions 1 and 2 and an upcaster between them, when a projection reads a stored version-1 event, then it receives the version-2 shape, and the stored row is unchanged. Closed by: `tests/unit/upcasters.test.ts`.
6. Given a log holding an event whose type or version has no schema, when `meowtower` starts, then it exits non-zero with `event_schema_unknown`, naming the type and version. Closed by: a start-up test.
7. Given every schema, when `fields.csv` is generated, then every field has a description. Closed by: a unit test, so TSK-0290's field dictionary has no blank row.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the schema registry and the upcaster chain in `src/shared/events.ts`, wire validation into `appendEvents` inside its transaction, and add the start-up check to `openDatabase`. Write version 1 of `item_shown`, `attempt_submitted`, `verdict`, `hint_shown`, `thread_spent`, `solution_shown`, `explanation_shown` and `glossary_opened` with the facts SPC-0020's table names as required fields, each with a zod description. `item_shown`'s parameters use the language-free types TSK-0230 checks. Give the stage-0 event of TSK-0200 its schema.

These payloads belong to ADR-0040, ADR-0080, ADR-0120 and ADR-0150 in ADR-0020's catalogue. Write only the fields the requirements name, so each owning epic adds its own fields as a new version with an upcaster, or, while no live event of the type exists, to version 1. Which of the two the owning epics use is an open question for the owner; it blocks none of this task.

## Depends on

TSK-0200, because validation runs inside `appendEvents` and the start-up check reads `events`.

## Evidence

Not yet.

## Left alone

Every producer of these events: the routes are ADR-0030's and the task generation ADR-0040's. The story, economy, break, parent and safety types, which TSK-0220 adds.
