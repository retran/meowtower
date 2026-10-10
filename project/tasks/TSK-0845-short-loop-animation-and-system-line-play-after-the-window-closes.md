---
id: TSK-0845
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5528, REQ-5530]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The scene plays the short loop's spell and the System line «Обнаружен короткий путь» after the task window closes

After this task, a `reward_granted` with source `short_loop` makes the scene play `spell.short_loop` in place of the clean spell and the System window show `system.short_loop` after the window closes, both chosen from content and never from the Master.

## Acceptance criteria

1. Given a granted short loop, when the window closes, then the scene plays `spell.short_loop` and the System window shows «Обнаружен короткий путь. Длинный путь обиделся» from the key `system.short_loop` (REQ-5528). Closed by: a Playwright test.
2. Given the animation art isn't shipped, when the short loop plays, then a placeholder animation drawn in code plays, per ADR-0360. Closed by: the same Playwright test with the art absent.
3. Given a short loop, when the Master's request is built, then it holds no part of the effect, the line or the outcome of the task (REQ-5530). Closed by: a unit test over the Master's input for a fixture day.
4. Given the task window is open, when the grant is written, then nothing plays until the window closes. Closed by: a Playwright test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `spell.short_loop` to the scene's effect data and `system.short_loop` to the Russian string file, and make the scene's effect step read the grant. The animation comes from the scene's effect data of ADR-0150 and the line from ADR-0160's string file.

## Depends on

- TSK-0844 (blocking): the grant is what starts the effect.

The epics realising ADR-0150 and ADR-0170 supply the scene layer and the art pipeline; the placeholder stands in until the art ships.

## Evidence

Not yet.

## Left alone

The art of `spell.short_loop`, which ADR-0170 owns, and the wording of the line beyond its key, which ADR-0160 owns.
