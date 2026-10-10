---
id: TSK-0597
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1604, REQ-1606, REQ-1610, REQ-1518, REQ-1840]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The scene order and the Master's reply are strict schemas, and the whole reply is discarded when one rule fails

After this task, `src/shared/master.ts` holds the strict order and reply schemas, the order carries no maths field, names the creepiness level and the checkpoint by words and carries `readerAge` from the Parent Room setting, and the service discards a whole reply that breaks the schema.

## Acceptance criteria

1. Given an order with a number, an answer, a verdict, a single-task outcome, a node id or state, an estimate, a response time or a lesson tag, when it is built, then the schema refuses it (REQ-1604). Closed by: a schema test with one case for each field.
2. Given a reply with an unknown speaker, an extra field, an effect outside the closed set, or no branch or ending its kind requires, when the service reads it, then it discards the whole reply (REQ-1606, REQ-1610). Closed by: a unit test with one reply for each fault.
3. Given each order, when its body is read, then it carries the creepiness level in force by its name, «Уютно», «Чуть жутковато» or «Загадочно», and no digit appears in it except `readerAge` (REQ-1518). Closed by: a unit test over orders at each level.
4. Given the Parent Room's age setting changed, when the next order is built, then `readerAge` holds the new value with no code change, and no tracked file, the canon included, holds the age (REQ-1840). Closed by: an integration test and the search of the staged text that CLAUDE.md requires before a commit.
5. Given a week of generated scenes, when the parent reads them, then the parent judges that the writing level fits the age the parent set (REQ-1840). Closed by: the parent's judgement, because fit to an age is a reading and no test can measure it.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Make the RES-1600 schemas strict, with the four changes ADR-0110 lists: no `heroStats` in the MVP, the level and checkpoint by name and key, her current names for the things she named, and `readerAge`. The reply's options are `starters`, three strings of 3 to 5 words, and `choices` only on `route_choice` and `name_suggest`, as ADR-0330 amends it. The orders add `echoes`, `doNotUse`, `deckCards`, `trialFixed` and an optional `hiddenDetailId`, and the kinds `route_choice`, `interlude` and `free_pen`.

## Depends on

The epic realising ADR-0100 supplies the gateway's `StoryRequest` class and its egress guard, which refuse the same fields a second time; this task builds the schemas and tests them against a fixture caller.

## Evidence

Not yet.

## Left alone

The prompt's text and the canon's sections, which TSK-0598 and TSK-0610 build, and the checks that run on a valid reply, which TSK-0599 builds.
