---
id: TSK-0973
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6350, REQ-6352, REQ-6364]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A confirmed action applies after a second press and enters the player's log as exactly one event

After this task, `POST /api/parent/sandbox-actions/prepare` returns a single-use token and an echo and writes nothing, and `POST /api/parent/sandbox-actions/confirm` appends one event of the action's own type with `source: "sandbox"` to her file and a `sandbox_action_applied` pointer to the sandbox's file, from a module that is the only holder of the main handle besides `main.ts`.

## Acceptance criteria

1. Given a prepare for each of the four actions, when the response is read, then it holds a token and an echo, and neither file has a new event (REQ-6350). Closed by: an integration test that hashes both files' tables.
2. Given one token, when confirm is posted twice, then both answer 200 with the same event and her log holds one event; given a retried request after a failed append (`503 log_write_failed`), then the same token succeeds and one event results (REQ-6352). Closed by: an integration test with the append stubbed to fail once.
3. Given a disable, a restore and a disable of the same template with three tokens, when each is confirmed, then her log holds three events with `source: "sandbox"`, `profile = 'main'` and `idem_key = 'sandbox-action:<token>'` (REQ-6352). Closed by: an integration test.
4. Given the loopback listener, when prepare or confirm is posted to it, then it answers 404; and a command-line sandbox run exposes no route that applies an action (REQ-6364). Closed by: an integration test on the loopback listener.
5. Given a token older than 5 minutes, a token of a closed session, or the oldest of 21 prepares, when it is confirmed, then it answers `410 sandbox_action_expired`; and when the server restarted between the two appends, then start-up writes the missing pointer (REQ-6352). Closed by: integration tests with a fake clock and a restart.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the confirmed-action module that `main.ts` constructs with her read-write handle and a function returning the sandbox module's current handle, called on each confirm and not kept between confirms. Hold tokens in memory: 5 minutes each, at most 20 for a session, ending with the session; a token is used only once its append commits. Return the original event with 200 for a used token and `409 sandbox_resetting` while a reset runs. After the main append, append `sandbox_action_applied` to the sandbox file; when only that append fails, answer `503 log_write_failed` and let the retry write the pointer. At start-up, write the missing pointer for every event in her file with `source: "sandbox"` that no pointer names. The echo warns of `node_all_disabled` before a press that would leave a node with no enabled template. The four actions and their events are those of ADR-0340's table; `item_excluded` v2, `content_disabled` and `content_restored` come from TSK-0974.

## Depends on

- TSK-0966 (blocking): the pointer is written to the sandbox's file under the mark and flag rules that task sets, and the module must not set the flag.
- TSK-0969 (not blocking): the reset's `409 sandbox_resetting` is tested on the confirm route once the reset exists; until then the test stubs the state.
- TSK-0971 (blocking): both routes sit under the parent session that task mounts.
- TSK-0974 (blocking): the module appends the event types that task defines.

The decision that owns `puzzle_approved` supplies that event's payload and its `source`; until its epic exists the module uses a stand-in event type of the same name in a test fixture and leaves the real payload to that epic.

## Evidence

Not yet.

## Left alone

The confirmed actions for rung framings or explanation variants, which ADR-0210 lists no crossing for.
