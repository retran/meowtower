---
id: TSK-0722
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-3710, REQ-3712, REQ-0846]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent sets the player's three details in the Parent Room, and a Dutch word shows only after approval

After this task, the Parent Room's settings panel sets the player's real name, age and school group, each change writes `settings_changed` to the local log and no tracked file, first setup asks for all three before Session 0, and the glossary panel approves each Dutch word before a term hint shows it.

## Acceptance criteria

1. Given the settings panel, when the parent sets the real name, the age and the school group and later changes each, then one `settings_changed` event is written for each change, and a reader of the setting returns the latest value (REQ-3710). Closed by: an integration test and a Playwright test.
2. Given the three values set, when a search runs over every tracked file, then it finds none of them, and every rule that needs one reads the latest setting through one function; a fixture rule that holds a value in code, content or a file fails the check (REQ-3712). Closed by: a unit test and a static check test with the failing fixture.
3. Given no value set, when a session is asked to start Session 0, then it refuses and the Parent Room asks for all three; given all three set, then it starts. Closed by: an integration test.
4. Given a change of the school group, when the event is written, then the full recompute starts under the other prior row of ADR-0060, and given a change of the age, then the next read of the setting returns the new age for the readability band and the Master's writing level. Closed by: an integration test that reads the recompute's version and the setting.
5. Given a glossary entry with a drafted Dutch word, when the parent hasn't approved it, then the term hint shows no Dutch word; given she approves it, then `glossary_entry_approved` is written and the hint shows it; given the entry's text changes after approval, then the hint shows no Dutch word until she approves the new text (REQ-0846). Closed by: an integration test and a Playwright test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the three settings to the settings panel and the glossary panel, with `GET` and `PUT /api/parent/settings` extending the route that already holds `threeDayLimit`. The values stay in the local database and never in the repository, because the repository is public. The owner decided on 2026-09-27 that these values live in the Parent Room.

The real name and the school group never leave the Mac, which ADR-0100's egress guard enforces; the guard reads the name from the same setting to clean it. First setup asks for all three before Session 0, a choice ADR-0180 made because the priors, the readability limits and the Master's writing level need them from the first task.

The epics realising ADR-0040, ADR-0060, ADR-0100 and ADR-0110 read the setting through the function this task builds. Until they exist, the test reads it directly.

## Depends on

- TSK-0708 (blocking): the panels sit in the Parent Room the report builds on.

## Evidence

Not yet.

## Left alone

The panels this record only places, such as the switch «Закончить на сегодня» and the music and effects channels, the glossary's Dutch words and approval wording, and the test mode's separate database, which ADR-0340 owns.
