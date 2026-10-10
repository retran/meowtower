---
id: TSK-1011
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-2820, REQ-3420, REQ-6124, REQ-6150, REQ-6418]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Twenty neutral reaction lines answer first, a puzzle gives no sound information, rejected art variants score 1 and the heroine shows as a placeholder

After this task, the first reaction line after free text comes from at least 20 hand-written neutral lines until the bank holds 60 approved lines, a puzzle's play screen counts among the places where no sound gives information, a variant a program check rejects scores 1 with the failed check named, the game shows a placeholder for the heroine until the family chooses a sheet, and a source with over 5 % of its lines blocked shows `text_blocked_high` once a day.

## Acceptance criteria

1. Given a bank of fewer than 60 approved reaction lines, when free text is sent, then the first line is one of at least 20 neutral lines from ADR-0160's Russian string file, each passing the group 1 text checks, and its first character shows within 2 seconds at the 95th percentile over 100 replayed sends (REQ-6150). Closed by: a content check and a latency test over a recorded gateway.
2. Given a task, template, hint, puzzle or answer form, when the static check runs, then none gives information by sound, and a puzzle's play screen is on the silent contexts' list (REQ-6124). Closed by: a static check with one failing fixture.
3. Given a generated art variant that a program check rejects, when scoring runs, then it scores 1 with the failed check named and isn't sent to the judge, and every variant has a score from 1 to 10 (REQ-2820). Closed by: a pipeline test over one rejected and one passing variant.
4. Given the family hasn't chosen a character sheet, when any screen with the heroine renders, then a placeholder shows and no picture of her; after the choice every picture shows her as a catgirl matching the sheet, and none shows a grey mouse in her backpack; the parent judges both at the art review, because a picture's likeness is a visual call (REQ-6418, REQ-3420). Closed by: a component test for the placeholder and the parent's judgement.
5. Given a source with 6 % of a game day's lines blocked in play and another at 4 %, when the day changes, then `./meowtower status` shows `text_blocked_high` once for the first and not for the second, and verify's summary reports its own share (ADR-0360 entry 41, no requirement of its own). Closed by: a status test over two sources.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0360 entries 41 to 43 and 77 to 79. The twenty lines are the owner's content: this task adds the file's slots and the check, and the lines themselves stay a content item that blocks only criterion 1's last clause.

## Depends on

Nothing in this epic. The epics realising ADR-0160, ADR-0170 and ADR-0320 supply the string file, the art pipeline and the silent-play rules; until they exist, the tests run on a fixture string file and a fixture variant list, and the real art is left to those epics.

## Evidence

Not yet.

## Left alone

The bank of 60 approved reaction lines, the art itself and the character sheet's choice, which the owner and the family make.
