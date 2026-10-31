---
id: TSK-0220
artifact: task
status: done
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-2214, REQ-2216, REQ-2218, REQ-2220, REQ-2222]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Schemas for the story, economy, break, parent, safety and model-call events

After this task, the registry holds version 1 of every event type SPC-0020 names for REQ-2214, REQ-2216, REQ-2218, REQ-2220 and REQ-2222, each requiring the facts those requirements name, so the log can record every story event, economy event, pause and break, parent action, safety event and model call once its producer exists.

## Acceptance criteria

1. Given each type SPC-0020's table lists for REQ-2214, REQ-2216, REQ-2218, REQ-2220 and REQ-2222, when a test appends a valid example of it, then `appendEvents` stores it, and when the test omits any required fact, then `appendEvents` refuses it and names the field. Closed by: `tests/unit/event-schemas.test.ts`, one valid and one invalid case per type.
2. Given `free_text`, when its payload holds the text before cleaning in place of the cleaned form, then the schema has no field to receive it. Closed by: the same test, which checks the schema's keys.
3. Given `llm_call`, when its payload lacks the `llm_log` row's identifier, then `appendEvents` refuses it. Closed by: the same test.
4. Given a parent action outside a session, when `item_flagged`, `item_excluded`, `parent_tag_added`, `parent_tag_removed` or `settings_changed` is appended with no `session_id` or `adventure_id`, then `appendEvents` stores it with the device identifier and both times. Closed by: the same test.
5. Given the catalogue in ADR-0020, when a check compares the registry's type names with it, then every name the registry holds is in the catalogue. Closed by: a unit test reading a list of the catalogue's names kept in `src/shared/events.ts`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add version 1 of the schemas for `scene_shown`, `choice_made`, `free_text`, `name_given`; `reward_granted`, `chest_offered`, `chest_chosen`, `forge_crafted`, `shop_purchase`, `level_up`, `quest_progress`, `familiar_friendship`, `familiar_hatched`, `familiar_evolved`, `thread_granted`; `adventure_paused`, `adventure_resumed`, `device_lease_taken`, `eye_exercise`, `rest_stop_offered`, `rest_stop_started`, `rest_stop_ended`, `soft_stop`, `extension`; `parent_tag_added`, `parent_tag_removed`, `item_flagged`, `item_excluded`, `settings_changed`; `safety_event` and `llm_call`, each field with a zod description. `thread_spent` is TSK-0210's. ADR-0020 owns only `item_flagged`; the rest belong to ADR-0030, ADR-0080, ADR-0090, ADR-0100, ADR-0110, ADR-0140 and ADR-0180, whose epics add their own fields under the versioning rule TSK-0210 makes.

## Depends on

TSK-0210, because these types enter the registry and follow the versioning rule that task makes.

## Evidence

Collected on 2026-09-27 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0; 17 test files, 229 Vitest tests and 2 Playwright tests passed. `npx vitest run tests/crash --silent=false` printed `crash test: 100 of 100 writes kept, 0 lost`.
- Seen failing first: with the 31 valid payloads added to `tests/unit/event-schemas.test.ts` before any schema existed, 93 cases failed with `event_schema_unknown`.
- Criterion 1, REQ-2214, REQ-2216, REQ-2218, REQ-2220, REQ-2222: for each of the 31 types, a valid example is stored and every payload with one required fact dropped is refused, naming the field.
- Criterion 2, REQ-2214: `free_text` refuses a `raw` field beside `cleaned`; its strict schema has no field for the text before cleaning.
- Criterion 3, REQ-2222: `llm_call` without `llmLogId` is refused, naming `llmLogId`.
- Criterion 4, REQ-2220: `item_flagged`, `item_excluded`, `parent_tag_added`, `parent_tag_removed` and `settings_changed`, appended from a device with no session or adventure, are stored with `device_id`, `client_ms` and the server's `ts`, and null session and adventure.
- Criterion 5: every type in `EVENT_DEFS` is in `EVENT_CATALOGUE`, the 81 names of ADR-0020's Event catalogue kept in `src/shared/events.ts`.
- Choices made where the requirements name a fact but not its form, for the owning epics to extend through a new version: a pause's reason is `background`, `idle` or `leave`; a name's target is `heroine`, `familiar`, `floor`, `tangle`, `room` or `item`; a safety signal's level is `none`, `everyday` or `serious`; a chest offers exactly three options.

## Left alone

The producers of these events and every type not named here, such as `plan_built` or `frame_accepted`, which no requirement of ADR-0020 names; their owning epics add them with their schemas.
