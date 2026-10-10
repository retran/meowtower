---
id: TSK-0935
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6118, REQ-6120, REQ-6122, REQ-6124]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every sound is a registered event, the build fails when an event has no picture, and no task gives information by sound

After this task, `src/shared/sound-events.ts` holds a typed registry in which every sound event names its channel, its optional file, its context and a visual cue with carriers, the checks fail on an event without a picture, and no task code can play a sound.

## Acceptance criteria

1. Given the code, when a search finds every place that plays a sound, then each calls `playSound(event)` with a registry event, no code plays a file by path, and a fixture that does fails the lint (REQ-6118). Closed by: the lint verb's output on a fixture and a search of `src`.
2. Given a registry entry with no `visual`, when `tsc` runs, then it fails; given a `VisualCue` that names a scene, card or component that doesn't exist, when group 1 runs, then it fails with `visual_equivalent_missing` and names the event (REQ-6120). Closed by: the compile check's output and the group 1 check's test with both fixtures.
3. Given a cue whose carrier list is empty, when group 1 runs, then it fails, so no cue rests on colour alone (REQ-6122). Closed by: the check's test with a fixture.
4. Given a cue that lists carriers from `shape`, `word` and `motion`, when the parent reviews the pictures at stage acceptance, then each carrier reads on its own (REQ-6122). Closed by: the parent's judgement, because no check tells whether a shape, a word or a motion reads to the player.
5. Given an entry whose context is the task window or a puzzle's play screen, when group 1 runs, then it fails; given an effects event fired while either is open, then `playSound` drops it; given `src/server/tasks/`, the task window's components or a puzzle's play screen importing the audio module, then the lint step fails; and the template interface has no sound field (REQ-6124). Closed by: the check's tests and a client test of the drop.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the registry with the `VisualCue` type, which lists its carriers from `shape`, `word` and `motion`, and the group 1 check that resolves a cue to a scene, card or component. Make `visual` a required field of the type, so `tsc` is the first line of defence. Each entry declares its context. Floor music keeps playing under an open task window, because it starts at a floor's entry and changes only with the floor or the dreamcore layer, never with a task, so it carries nothing about the task.

Add the lint rule that keeps the task code from importing the audio module. ADR-0360 added the puzzle's play screen to the forbidden contexts.

## Depends on

- TSK-0933 (blocking): `playSound` and the module the rules fence.

## Evidence

Not yet.

## Left alone

The registry's events and their pictures, which TSK-0936 adds, and the content of each picture, which ADR-0170's style and the owner's design set.
