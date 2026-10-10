---
id: TSK-0665
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3508, REQ-3146, REQ-3148]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Nothing moves in the task window, nothing flashes more than three times a second, and no sound starts loud

After this task, an open task window holds no running animation and the scene's ticker is stopped, a check rejects an animation that repeats faster than three times a second, and every sound plays through one gain node that ramps up and comes from a file normalised to -20 LUFS.

## Acceptance criteria

1. Given an open task window, when `document.getAnimations()` is read inside it and the PixiJS ticker is queried, then the first is empty and the ticker is stopped, and the ticker runs again after the window closes (REQ-3508). Closed by: a Playwright test on the iPad viewport.
2. Given the style sheets and the component code, when the animation check runs, then a repeating animation whose period is under 334 ms fails with the rule's file and period, and the committed styles pass (REQ-3146). Closed by: the lint verb's output and a fixture with a 300 ms loop.
3. Given a sound played by the game, when its path is traced, then it goes through one Web Audio gain node that ramps from silence over at least 50 ms (REQ-3148). Closed by: a unit test over a fake audio context that reads the gain's schedule.
4. Given every sound file in the build, when the build normalises it, then its integrated loudness is -20 LUFS and its true peak is at most -3 dBTP, and a fixture file at -10 LUFS is brought to that level (REQ-3148). Closed by: a build test that measures the output files.
5. Given the sounds at stage 0.3, when the parent listens to every sound, then none startles (REQ-3148). Closed by: the parent's judgement at stage acceptance, because loudness a person finds sudden isn't a number the build can fix, and the person who judges is the parent.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Stop the PixiJS ticker when the task window opens and start it when it closes, and keep the task window's popover and every layer inside it free of animations. Use only the duration and easing tokens for every animation. Add the loudness step to the build with a normaliser that reports its measure; the -20 LUFS and -3 dBTP figures are budgets ADR-0150 chose. Sound files come from elsewhere, so the test uses a fixture file.

## Depends on

- TSK-0660 (blocking): the task window and the layers are ported components.

The epic realising ADR-0320 sets one gain per channel under the node, each at most -6 dB, and `playSound`; it builds on the node this task adds.

## Evidence

Not yet.

## Left alone

Which sounds exist and where they come from, and the sound settings of ADR-0320.
