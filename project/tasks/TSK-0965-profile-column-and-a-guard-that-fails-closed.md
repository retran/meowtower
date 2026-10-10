---
id: TSK-0965
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6312, REQ-6314, REQ-6316]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The player's file refuses a sandbox event over any connection, and the server won't start without that refusal

After this task, the `events` table has a `profile` column and an `events_profile_guard` trigger, so the player's file refuses any event marked `sandbox` whatever code sends it, a sandbox file refuses a `main` event, and a file with no `db_role` row refuses every insert.

## Acceptance criteria

1. Given the player's file, when a raw `INSERT` of an event with `profile = 'sandbox'` goes through a second connection, then it fails with `event profile does not match database`; the same insert of a `main` event into a sandbox file fails the same way (REQ-6312). Closed by: an integration test.
2. Given a file with no `db_role` row, when any event is inserted, then the insert fails (REQ-6312). Closed by: an integration test.
3. Given a copy of her file with `events_profile_guard` dropped, when the server starts on it, then it exits with `log_guard_missing` naming the trigger, and the same holds for each of the two `db_role` triggers (REQ-6314). Closed by: one integration test for each of the three triggers.
4. Given a test migration that drops or replaces `events_profile_guard`, when the runner is asked to apply it, then it refuses before applying anything and the file's schema is unchanged (REQ-6316). Closed by: an integration test that compares the schema before and after.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add a migration that runs `ALTER TABLE events ADD COLUMN profile TEXT NOT NULL DEFAULT 'main' CHECK (profile IN ('main', 'sandbox'))`, which rewrites no stored row and fires no `UPDATE` trigger, and creates `events_profile_guard` as `BEFORE INSERT ... WHEN NEW.profile IS NOT (SELECT role FROM db_role WHERE id = 1)` raising `event profile does not match database`. Add the guard and the two `db_role` triggers to `GUARDED_TRIGGERS`, make `checkGuard` match each trigger against its own expected message, and make the migration runner refuse a migration that drops or replaces any guarded trigger. The envelope's `profile` field joins SPC-0020's event schema as ADR-0340 amends it.

## Depends on

- TSK-0964 (blocking): the guard compares the event's profile with the `db_role` row that task creates.

The epic realising ADR-0020 owns `GUARDED_TRIGGERS`, `checkGuard` and the runner; this task extends them and adds nothing outside them.

## Evidence

Not yet.

## Left alone

The check in `appendEvents` that refuses an event before the `INSERT`, which TSK-0966 adds as the first line and this trigger backs as the second.
