---
id: TSK-0769
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5078, REQ-5080]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The scope guard fails on deferred items and Dutch files, and the string check lets in only the Dutch the parent approved

After this task, the scope guard fails on a `school_snapshot_*` schema, a Parent Room route for a school snapshot, the school system's vendor name, `content/i18n/nl.json` and any `*.nl.*` file, and the string check refuses a Latin-script word on a player screen unless it is an approved Dutch field of the lexicon or sits inside a task's content as a bridge keyword.

## Acceptance criteria

1. Given a fixture `school_snapshot_imported` schema, when the scope guard runs, then it fails, and given a fixture Parent Room route for a school snapshot, then it fails the same way (REQ-5078). Closed by: the scope guard's test with two fixtures.
2. Given a fixture `content/i18n/nl.json` and a fixture `*.nl.*` file, when the scope guard runs, then it fails on both, and passes on the tree (REQ-5078, REQ-5080). Closed by: the scope guard's test.
3. Given a Latin-script word on a player screen that is neither an approved Dutch field of `lexicon.ru.json` nor a bridge keyword inside `data-task-content`, when the string check runs, then it fails; given an approved Dutch field, then it passes (REQ-5080). Closed by: the string check's test with three fixtures.
4. Given the deferred items REQ-5078 lists, when the scope guard's trace list is read, then each item has a trace, including the two new ones for the school system's snapshots (REQ-5078). Closed by: a test that compares the list with the requirement's items.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add two traces to `verify/scope-guard.json` for the snapshots of the school's learning system, a schema for a `school_snapshot_*` type and a Parent Room route for a school snapshot, beside the vendor's name it already lists (TSK-0763 adds the name). Keep the guard's failure on `content/i18n/nl.json` and on any `*.nl.*` file, because the Dutch layer stays out of the MVP and a locale file suggests a Dutch interface the MVP doesn't have. The parent's Dutch memo is allowed, because it is parent-facing.

Extend ADR-0160's string check: a Latin-script word on a player screen passes only where it is an approved Dutch field of the lexicon, or inside a task's content as a bridge keyword. The bridge's own entries and their approval are in TSK-0770.

ADR-0210 amends ADR-0190's text for the MVP list and the deferred list; the same wording holds in the guard's messages.

## Depends on

- TSK-0760 (blocking): the `data-task-content` mark that the string check reads.

The epic realising ADR-0160 supplies the string check and the lexicon; this task extends the check in place.

## Evidence

Not yet.

## Left alone

Whether each part of the MVP list is built, which the owner judges at the stage 0.3 acceptance (REQ-5076), and the Dutch layer itself.
