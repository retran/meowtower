---
id: TSK-0570
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0314, REQ-0316, REQ-0324, REQ-0142]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Parent Room holds the eye-skip switch, no field for a daily maximum and the memo on how to talk about the game

After this task, the parent settings hold `eyeSkip`, off by default, the eye exercise shows «Пропустить» only when it is on, the settings schema has no field that could hold a daily maximum, and the Parent Room holds the memo from the per-language content file.

## Acceptance criteria

1. Given a fresh database, when the parent settings are read, then `eyeSkip` is false, and the eye exercise's packet carries no skip control (REQ-0314, REQ-0316). Closed by: an integration test.
2. Given the parent switches `eyeSkip` on behind the PIN, when the next eye exercise is read, then its packet carries the skip control, and a switch back removes it (REQ-0316). Closed by: an integration test with the parent session.
3. Given the settings schema and the Parent Room's routes, when they are searched for a field, route or control about a maximum of play time, then none exists, and a fixture that adds one fails the schema test (REQ-0324). Closed by: a schema test with its failing fixture.
4. Given the Parent Room, when the memo is opened, then its four points are present and come from the per-language file: don't discuss node estimates with her, praise effort and courage and never «ум», don't question her about «хитрые обходы», and don't use the game as a reward or a punishment (REQ-0142). Closed by: an integration test reading the memo's keys and a person's judgement of the Russian wording, because only the parent can say it reads as advice and not as a rule.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `eyeSkip` to the settings that `PUT /api/parent/settings` writes, with a `settings_changed` event as the existing key does, and read it when the scheduler of TSK-0569 builds an exercise's packet. Put the memo's text under one key in `content/i18n/ru.json` and show it on the Parent Room's stand-in page.

## Depends on

- TSK-0569 (blocking): the skip control sits on the exercise's packet that task builds.

The epic realising ADR-0180 draws the Parent Room's page and the PIN screen; this task uses the stand-in page and the existing parent session.

## Evidence

Not yet.

## Left alone

The long-day mark and the report, which ADR-0180's epic owns, and the memo's final wording, which the parent approves at stage acceptance.
