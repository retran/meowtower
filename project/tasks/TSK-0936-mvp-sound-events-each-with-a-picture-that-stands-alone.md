---
id: TSK-0936
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6126, REQ-6164]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The MVP's sound events each have a picture that carries the same information with sound off

After this task, the registry holds the MVP's sound events, each tied to the scene or card that shows it, a level-up is a ceremony of light and motion that is complete with both channels off, and the parent has judged each picture with both channels off.

## Acceptance criteria

1. Given the scenes and cards that exist, when the group 1 check reads the registry, then it holds `level_up`, `chest_opened`, `familiar_evolved`, `familiar_hatched`, `eye_exercise_opens`, `eye_exercise_closes`, `rest_stop_offered`, `soft_stop`, `spell_cast`, `floor_music` and `dreamcore_music`, each with its channel and a cue that names an existing scene, card or component (REQ-6164). Closed by: the group 1 check's output.
2. Given default settings, when a level-up fires in a Playwright test, then the ceremony of light and motion runs to its end and its card shows, and given effects on, then `level_up` plays with it and the ceremony is the same (REQ-6126). Closed by: a Playwright test with both settings.
3. Given a build with no sound file at all, when every check runs, then each passes; given a registry file that fails to load, then the event plays nothing, its picture shows, and the client reports once per file in a session as `sound_file_missing` (ADR-0320). Closed by: the verify run on a build with no files and a client test with a missing file.
4. Given both channels off, when the parent watches the level-up, the chest, hatching, evolution, the eye exercise, the rest stop and the soft stop at the acceptance of the stage that brings each, then each picture tells the player what its sound would have told the player (REQ-6126, REQ-6164). Closed by: the parent's judgement with both channels off, because only a person can tell whether a picture carries what a sound carried.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the events of the table in ADR-0320 to the registry: `level_up`, `chest_opened`, `familiar_evolved`, `familiar_hatched`, `eye_exercise_opens`, `eye_exercise_closes`, `rest_stop_offered`, `soft_stop` and `spell_cast` on the effects channel, `floor_music` and `dreamcore_music` on the music channel. An event joins the registry in the change that adds its scene, because the check fails a cue that names a scene that doesn't exist, so the events whose scenes aren't built yet join with the epics that build them.

The level-up ceremony of light and motion is complete with sound off; `level_up` plays with it only when effects are on. No sound event marks the moment «Готово» turns active in an eye exercise, because a cue that exists only with sound on would make the exercise end differently by setting.

## Depends on

- TSK-0935 (blocking): the registry and its checks.

The epics realising ADR-0090, ADR-0140 and ADR-0150 supply the scenes and cards the cues name.

## Evidence

Not yet.

## Left alone

The art of each picture, the ceremony and the waiting animations, which ADR-0170's style and the owner's design set. A sound file for any event, which every registry entry may leave out.
