---
id: TSK-0916
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6084, REQ-6086]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Six school snapshot event types have schemas and names that don't name the school's vendor

After this task, the event catalogue holds `school_snapshot_imported`, `school_snapshot_parsed`, `school_snapshot_corrected`, `school_snapshot_withdrawn`, `school_snapshot_goal_linked` and `school_snapshot_goal_unlinked` with zod schemas, a module computes a goal's key, and a check fails on any name that points to the vendor. This task belongs to the stage after the MVP, because ADR-0210's scope guard keeps the six schemas out of the tree until the MVP ends.

## Acceptance criteria

1. Given each of the six types, when a fixture payload with one required field missing is validated, then the schema refuses it, and a fixture payload with every field validates; the payloads are the ones ADR-0310 lists, with `goals` at most 400 entries and `nodes` one to five identifiers (REQ-6084). Closed by: a schema test for each type.
2. Given a log that holds a `school_snapshot_*` event and a server build with no schema for it, when the server starts, then it refuses to start, as it does for any type without a schema (REQ-6084). Closed by: a start-up test.
3. Given a goal's wording and subdomain, when `src/engine/school/keys.ts` computes the key, then it is `w:` followed by the first 16 hex digits of a SHA-256 over the wording and the subdomain, lower-cased with runs of spaces collapsed; the same words with other spacing and letter case give the same key, a changed word gives another, and a goal code never enters the key (ADR-0310). Closed by: a unit test with golden values.
4. Given the tracked files under `src/`, `tools/`, `content/`, `migrations/` and `test/`, when the check searches them for the vendor's name, then it finds no event name, schema field, module path or string key that holds it, and a fixture file that holds it fails the check (REQ-6086). Closed by: the check's test with a failing fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the six schemas to `src/shared/events.ts` with the payloads of ADR-0310, version 1, and the goal-key function in `src/engine/school/keys.ts`, shared with the goals the parent enters. Keep the school's code under `src/engine/school/` and `src/parent/school/`. I chose one basis for every goal's key, wording and subdomain, as ADR-0310 did, because goal codes are unconfirmed and a key that switched to the code whenever the parser caught it would give the same goal a new key, and lose its link, each time one snapshot showed the code and the next didn't.

The check's list holds the vendor's name as RES-4100 records it. Don't write the name in any file this task adds, the check's own fixture included; build the fixture's string from the list at run time.

## Depends on

Nothing. The epic realising ADR-0020 supplies the event catalogue and `appendEvents`, and the epic realising ADR-0190 the group 1 runner; until they exist the check runs as a lint rule.

## Evidence

Not yet.

## Left alone

What each event does, which the tasks after this one build. ADR-0210's table of owners, which gains the last two types by ADR-0310's amendment and which that decision's epic edits.
