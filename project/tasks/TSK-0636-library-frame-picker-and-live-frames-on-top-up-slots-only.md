---
id: TSK-0636
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3604, REQ-3612, REQ-3614, REQ-3616]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A task takes the least recently shown library frame, and only a top-up slot may take a live one

After this task, `pickFrame` returns the library frame of a task's structure and locale that was shown longest ago, with never-shown frames first, marks a repeat within 14 game days in `item_shown`, and refuses a live frame for every slot but a top-up.

## Acceptance criteria

1. Given a structure with 5 frames and a simulation of 60 game days with one task a day, when each pick is read, then no frame is shown within 14 game days of its last showing while a frame not shown in that time exists, and the order matches a model that picks the least recently shown (REQ-3612). Closed by: a simulation test over 60 game days.
2. Given a structure whose every frame was shown within the last 14 game days, when a task asks, then the frame shown longest ago is used, and its `item_shown` event carries `frameRepeat: true`; given a frame outside the window, the event carries no repeat mark; every event carries `frameId` and `frameSource` (REQ-3614). Closed by: the same simulation, which reads the log.
3. Given probe, Guardian ladder, warm-up and fallback slots with `LIVE_FRAMES` on and `ready` live frames in the queue, when each slot's frame is picked, then each takes a library frame, and a top-up slot is the only slot that may take a live frame (REQ-3604, REQ-3616). Closed by: a unit test with one fixture for each slot kind.
4. Given a library with no frame of a task's structure, when a task asks for one, then the picker returns `frame_none_for_structure` and the slot's caller takes another structure (REQ-3604). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write `src/frames/pick.ts`. Break ties by the task's seed, so the same state gives the same pick. A game day ends at 04:00, as `src/shared/game-day.ts` has it, and the 14 days count game days. Keep the pick behind one function, because ADR-0410 replaces the rule with its four-step picker and keeps the fallback to the frame shown longest ago. Add `frameId`, `frameSource` (`library` or `live`) and `frameRepeat` to the next version of `item_shown` with the upcast ADR-0020 requires.

## Depends on

- TSK-0635 (blocking): the picker reads the library the log defines.
- TSK-0637 (not blocking): a live frame is only a second source; this task tests live frames with stand-in rows and the picker never calls the live queue directly.

The epic realising ADR-0070 supplies the slot kinds, probe, ladder, warm-up and top-up. Until it lands, the slot kind is an argument and tests pass each value.

## Evidence

Not yet.

## Left alone

The live queue and its final solve, which TSK-0637 and TSK-0638 build, and the context tag and the four-step pick of ADR-0410, which its epic adds.
