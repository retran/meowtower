---
id: SPC-0320
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-6100, REQ-6102, REQ-6104, REQ-6106, REQ-6108, REQ-6110, REQ-6112, REQ-6114, REQ-6116, REQ-6118, REQ-6120, REQ-6122, REQ-6124, REQ-6126, REQ-6128, REQ-6130, REQ-6430, REQ-6432, REQ-6136, REQ-6138, REQ-6140, REQ-6142, REQ-6144, REQ-6146, REQ-6148, REQ-6150, REQ-6152, REQ-6154, REQ-6156, REQ-6158, REQ-6160, REQ-6162, REQ-6164]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer and show the failing case. -->

# Sound and silent play: the sound registry, the parent's channels, a picture for every sound event, the eyes-off eye exercise and the prepared reaction line

## Scope

This document covers how the game plays with no sound and how it plays sound when the parent allows it: the parent's two channels, the audio module that is the only code allowed to make sound, the volume ceiling, the registry of sound events and the picture each one must have, the ban on sound inside tasks, the pictures that replace what a level-up, a trick and the canon's heard things used to sound like, the eye exercises that take her eyes off the screen, the prepared reaction line that answers her free text first, the familiar's waiting animation, the pressed look of a tapped control, and the tests and iPad checks that prove silence. It is written at the level of modules, routes, events and the checks the build runs.

It leaves out what other specifications state. SPC-0090 states when an eye exercise is due, the order of the four exercises and the parent's «Пропустить» (Skip) switch. SPC-0030 states the routes' shared contract, pauses and the idle clock. SPC-0110 states the Master's reply path, its checks, its 6-second budget and the line pool with its shuffled cycles and approvals. SPC-0150 states the design-system ports, the motion tokens and the loudness normalisation of each sound file. SPC-0140 states when a level-up, a chest, hatching and evolution fire. SPC-0160 states the forbidden-word list and the time-word check. SPC-0190 states the verify groups and the stage order. Which sound files the game ships, and whether the MVP ships any, is left open: every registry file is optional.

## Boundary

### Modules and files

| Module or file | What it holds |
| --- | --- |
| `src/client/audio/` | The audio module: the only code that creates an `AudioContext` or `webkitAudioContext`. It decodes every sound file into an `AudioBuffer` and plays it through the gain node, and constructs no `Audio` element and calls no media element's `play()`. Its one public call is `playSound(event)`. |
| `src/client/audio/levels.ts` | The volume steps and the ceiling constant, -6 dB. |
| `src/shared/sound-events.ts` | The typed registry of sound events and the `VisualCue` type. |
| `src/ui/ds/corrections.css` | `transition: none` on `.tw-btn` inside the task window; `divergences.json` lists the departure with RES-4110 as its finding. |
| `content/lines.ru.json` | The `reaction` category and the familiar's lines for the eyes-off exercises. |
| `content/i18n/ru.json` | At least 20 hand-written neutral reaction lines, the string file ADR-0160 states. |
| `content/familiars.yaml` | Each familiar's waiting animations. |
| The canon data | A `heard` tag and a `seenSign` on every creature, place or clue the canon defines by what the heroine hears. |
| `verify/baselines.json` | The -6 dB ceiling, the 100 ms tap budget, the 2 s first-line budget with its 1 s target, the 60-line reaction bank and the 20 neutral reaction lines. |
| `docs/ipad-checklist.md` | The three stage 0 rows on sound. |

### The registry entry

Each entry of `src/shared/sound-events.ts` names the event, its channel, `music` or `effects`, an optional sound file under `/sound/`, its context, and its `visual`, a `VisualCue`. A `VisualCue` names the scene, card or component state that shows the event and lists its carriers from `shape`, `word` and `motion`. The type requires `visual`.

### Routes and messages

| Route or message | What it carries |
| --- | --- |
| `PUT /api/parent/settings` | The keys `sound.music` and `sound.effects`, each `{ on, volume }` with `volume` a step from 0 to 5. |
| `POST /api/session/:id/scene/input` | For free text, the reply carries the reaction line when the server picks one. |
| SSE message `settings` | The current `{ on, volume }` of both channels, sent on her stream when it opens and in the step that logs `settings_changed`. |

The schema of `looks_set` and every other route of the player has no sound field.

### Events this part logs

| Event, v1 | Payload |
| --- | --- |
| `settings_changed` | the key `sound.music` or `sound.effects` and the value `{ on, volume }` |
| `eye_exercise_ended` | `kind`, `endedBy` (`timer`, `done` or `skip`) and `activeMs`, the time the exercise was open while the adventure wasn't paused |
| `reaction_line_shown` | `lineId`, `adventureId` and the id of the `free_text` event it answers |
| `reaction_line_flagged` | `lineId` |

### Failure names

| Name | Audience | Meaning |
| --- | --- | --- |
| `audio_blocked` | the developer | a channel is on and Safari refuses to start or resume the audio context in a tap |
| `sound_file_missing` | the developer | a registry file fails to load |
| `visual_equivalent_missing` | the developer | a sound event has no `VisualCue`, its cue names nothing that exists or lists no carrier, or its context is the task window or a puzzle's play screen |
| `reaction_bank_short` | the developer | fewer than 60 approved unflagged reaction lines at the stage 0.3 gate, fewer than 20 neutral reaction lines at any time, or at any time a line whose stored judge result doesn't match its text |
| `reaction_bank_low` | the parent | after stage 0.3, flags took the bank below 60 lines |
| `reaction_late` | the developer | no reaction line reached the client within 2 seconds of her tap |
| `eye_exercise_abandoned` | the player | she didn't tap «Готово» (Done) in an eyes-off exercise before the idle pause |

### What this part requires from other parts

- SPC-0030 supplies `PUT /api/parent/settings`, the SSE stream, `clientSeq` and the idle clock.
- SPC-0180 supplies the Parent Room's settings panel behind the PIN, the approval screen, the dialogue book and the notice list.
- SPC-0110 supplies the free-text path with its local triggers, the check module, `line_approved` and the pool's shuffled cycles.
- ADR-0350 supplies the judge route each model-based check runs on.
- SPC-0150 supplies the one Web Audio gain node with its ramp, the ports, the scene layer and the flash limit.
- SPC-0090 supplies when an eye exercise is due and which one comes next.
- SPC-0190 supplies the verify groups and the Baselines table.

The permitted dependencies run one way. Only `src/client/audio/` imports the Web Audio API, no module constructs an `Audio` element or calls a media element's `play()`, and no module uses `navigator.audioSession`; an ESLint rule rejects the Web Audio API outside `src/client/audio/` and the other two everywhere, the audio module included. Screens and the scene layer reach sound only through `playSound`, and `playSound` reads the registry in `src/shared/`. `src/server/tasks/`, the task window's components and the components of a puzzle's play screen never import the audio module, and the lint step rejects the import. `src/shared/sound-events.ts` imports only `src/shared/`.

## Behaviour

### The parent owns sound

The game plays no sound until the parent turns music or effects on in the Parent Room (REQ-6100). A new install and a reset set both channels to off and volume 0 (REQ-6102). The Parent Room's settings panel holds two channels, music and effects, each with its own switch and its own volume of 0 to 5 steps (REQ-6104).

When the parent turns a channel on while its volume is 0, the panel moves the volume to step 1, and its confirmation names the new step, for example «Эффекты включены, громкость 1 из 5» (Effects on, volume 1 of 5). Turning a channel off keeps its volume, so turning it on again restores the step.

A change goes through `PUT /api/parent/settings` and is logged as `settings_changed` with the key `sound.music` or `sound.effects`, never as `looks_set` (REQ-6110). The player's settings screen holds no sound control, and a `looks_set` request with a sound field gets `400` and logs nothing (REQ-6108).

### Silence leaves no trace

While both channels are off, the client creates no audio context, starts no media element and requests no sound file (REQ-6112). The service worker leaves `/sound/` out of its cache while both channels are off. When both channels go off, the client deletes every `/sound/` entry from the service worker's cache, so a file cached while a channel was on can't play later.

The client treats both channels as off until the `settings` message its stream opens with arrives. When the parent changes a channel, the server pushes `settings` on her stream in the same step that logs `settings_changed`. While her stream is up, the client stops a channel turned off within 1 second of the parent's change, and closes the audio context when both are off.

### Audio starts only on a tap

Once a channel is on, the audio module creates or resumes its audio context only inside the handler of her next tap (REQ-6114). A sound event that fires while the context isn't running is dropped, never queued, and its picture shows as it always does.

The audio module plays every file as an `AudioBuffer` through Web Audio and never sets the audio session type, so Safari keeps its default session and the iPad's silent mode silences both channels (REQ-6116).

### The volume ceiling

Every sound plays through the one gain node SPC-0150 states, with one gain per channel under it. Step 5 of either channel is a gain of -6 dB, and each step below takes another 6 dB off, so step 1 is -30 dB, and step 0 plays nothing (REQ-6106). The ceiling is the constant in `src/client/audio/levels.ts`, and `verify/baselines.json` holds the same value. A group 2 test maps every step of both channels to its gain and fails when one lies above -6 dB.

### Every sound names its event, and every event has a picture

`playSound(event)` is the only way to play a sound, so every place that plays one names its registry event and no code plays a file by path (REQ-6118). The build fails when an event has no visual equivalent: `tsc` fails on an entry with no `visual`, and a group 1 check fails when a `VisualCue` names no existing scene, card or component (REQ-6120). The same check fails a cue whose carrier list is empty, so no picture carries its meaning by colour alone (REQ-6122). The parent judges at stage acceptance whether the carriers read.

The MVP registry holds these events. Each picture conveys on its own, with both channels off, the information its sound carries, and the parent judges each one with both channels off at the acceptance of the stage that brings it (REQ-6164).

| Sound event | Channel | Picture |
| --- | --- | --- |
| `level_up` | effects | the ceremony of light and motion with its card |
| `chest_opened` | effects | the chest's opening scene and the card of what it held |
| `familiar_evolved`, `familiar_hatched` | effects | the evolution or hatching scene and the familiar's card |
| `eye_exercise_opens`, `eye_exercise_closes` | effects | the familiar at the window with the exercise's card, and the card closing |
| `rest_stop_offered`, `soft_stop` | effects | the scene with the System line and its card |
| `spell_cast` | effects | the spell's animation, a trick's included |
| `floor_music`, `dreamcore_music` | music | the floor's background, or the dreamcore scene layer |

A registry file is optional, and a missing file plays nothing, so a build with no sound files passes every check. The group 4 tests and the stage 0 iPad rows use one test file per channel, served under `/sound/` in the test build.

### No sound inside a task

No task, template, hint, puzzle or answer form gives information by sound (REQ-6124). Each registry entry declares its context, and the group 1 check fails an entry whose context is the task window or a puzzle's play screen. `playSound` drops every effects event that fires while the task window or a puzzle's play screen is open. The template interface has no sound field. Floor music keeps playing under an open task window, because it starts at a floor's entry and changes only with the floor or the dreamcore layer.

### Rewards and the canon show what they sound like

A level-up shows a ceremony of light and motion that is complete with both channels off, and `level_up` plays with it only when effects are on (REQ-6126). SPC-0140 states when a level-up fires.

A trick changes how a spell looks and leaves its power and everything else but its look and sound unchanged (REQ-6128). A trick's catalogue entry names an animation preset that differs from its base spell's, and it may name a sound event. The content check fails a trick whose preset equals its base spell's, and the entry has no field any other rule reads.

Every creature, place or clue the canon defines by what the heroine hears carries a `heard` tag and a `seenSign` in the canon data, and a content check fails the build on a `heard` entry with no `seenSign` (REQ-6130). Until the owner writes the canon's own signs, the data holds these defaults:

| Canon entry | Seen sign |
| --- | --- |
| Whisperkin | leaves her name in drifting paper dust round the corner |
| The Music Box | sends crooked drawn notes that float closer |
| The humming lamps and the carousel of the dreamcore floors | glow in slow rings that widen and fade |

Each ring or drift has a period of at least 334 ms. Story text can still describe a whisper, and the owner judges the signs.

### The eye exercise

An eye exercise nobody skips lasts at least 30 seconds, and at most 40 seconds when it keeps her eyes on the screen (REQ-6430). Blinking and tracing a figure eight keep her eyes on the screen: each lasts 35 seconds, ends by itself, and shows the card closing as its end.

Looking far out of the window and covering the eyes with the palms take her eyes off the screen, and each ends only when she taps «Готово» (Done) or the «Пропустить» (Skip) button the parent switched on (REQ-6432). The button stays inactive for the first 30 seconds, shows no countdown, and then turns active as an instant change of state (REQ-6136). No sound event marks the moment the button turns active.

The familiar's line for an eyes-off exercise tells her how long to do it in a measure she keeps herself, with no number, minutes or seconds, for example «Закрой глаза ладошками и дыши медленно-медленно, как спящий кот» (Cover your eyes with your palms and breathe slowly, slowly, like a sleeping cat) (REQ-6138). The check SPC-0160 states refuses a digit or a time word in that pool, and the parent judges the lines at stage acceptance.

The parent's «Пропустить», when switched on, ends any exercise, eyes-on or eyes-off, from the first second, as SPC-0090 states, and the exercise logs `endedBy: skip`. Every exercise logs `eye_exercise_ended` when it ends, and SPC-0090's eye count and the day's active time read the exercise's length from `activeMs`.

During an eyes-off exercise, the client starts SPC-0030's 90-second idle clock only when «Готово» turns active, so an exercise she doesn't end pauses the adventure 120 seconds after it began. The idle pause suspends the exercise and logs no `eye_exercise_ended`: the exercise stays open, a resume returns her to it with «Готово» active, and it ends only at her tap on «Готово» or on «Пропустить» (REQ-6432).

### The first line after her free text

After she sends free text, the server runs SPC-0110's local triggers on her raw text. If neither a serious nor a narrator trigger fires, the server takes the next line of the `reaction` category, logs `reaction_line_shown`, and returns the line in its reply to the free-text request. The client shows the line's first character on receipt. The 95th percentile of the time from her tap to that first character is at most 2 seconds, with a target of 1 second in the Baselines table (REQ-6150). The reaction line waits for neither the judge nor the Master, and the Master's reply still shows only after all of it passes SPC-0110's checks.

A serious or narrator trigger takes SPC-0110's fixed path, and the server sends no reaction line before it. A resent free-text request with the same `clientSeq` gets the same reaction line back and logs nothing new.

Every reaction line comes from a bank of lines that passed the checks before play (REQ-6152). A line enters the bank only through `line_approved`. At approval, the server runs SPC-0110's check module over it in full, with schema, length, speaker, numerals, the forbidden-word list of SPC-0160, and the safety and creepiness checks on the judge route ADR-0350 states, and stores the result against a hash of the line's text. A group 1 content check reruns the checks that need no model on every reaction line, and fails a line whose stored judge result is missing or belongs to another hash. Every reaction line carries creepiness levels 0 to 2, so one bank serves every scene.

A reaction line doesn't judge what she wrote, doesn't promise an answer and doesn't mention waiting or time. The approval screen shows that rule as a checklist item beside each candidate, and the parent judges it when approving a line. The dialogue book shows each reaction line with its scene, and the parent's flag logs `reaction_line_flagged` and takes the line out of the cycle.

The `reaction` category plays as a shuffled cycle across sessions and adventures. When a cycle ends, the lines already shown in the current session or the current adventure go to the end of the new shuffle, so no line shows again in an adventure while the bank holds one not yet shown there (REQ-6154). Once every line has shown in the adventure, a line may repeat, so the 2-second budget still holds.

The stage 0.3 gate requires at least 60 approved unflagged reaction lines, and a group 1 content test fails the build below that at the gate. After stage 0.3, the check reports a smaller bank and doesn't stop the build, the server keeps cycling the lines it has, and the Parent Room shows one `reaction_bank_low` notice until approvals bring the bank back to 60. Free text exists from stage 0.3. Before the bank first holds 60 approved lines, the server takes the reaction line from the neutral lines in `content/i18n/ru.json`, as a shuffled cycle with the same repeat rule (REQ-6150). The neutral lines pass the same group 1 checks as the bank, and a group 1 content test fails the build when fewer than 20 exist.

### While she waits for the Master

From the moment she sends free text until the Master's reply begins to show, the familiar plays one of its waiting animations in the scene column, chosen as a shuffled cycle per familiar (REQ-6146). Where the scene doesn't draw the familiar, the client draws it for the wait. The waiting animations are funny actions, such as chasing its tail or juggling a thread, with no filling, counting or circling shape. The parent judges them at stage acceptance.

No spinner, progress bar, element with `role="progressbar"`, hourglass or «Система обрабатывает…» (The System is processing...) line shows during the wait (REQ-6148).

Every story choice is possible by tapping one of the three suggestions or «Дальше» (Next), or by typing, and voice input stays beside the text field as an option (REQ-6140).

### The pressed look

Every tap changes the tapped control's look within 100 ms (REQ-6142). The pressed look is a CSS `:active` state, so it never waits for script, and the client registers one passive `touchstart` listener on the document, because Safari on iOS applies `:active` only when one exists.

Inside the task window the pressed look is an instant change of state with no transition (REQ-6144). `src/ui/ds/corrections.css` sets `transition: none` on `.tw-btn` there, overriding the 90 ms press transition of the owner's `bundle.css`.

### Proving silence

The silent acceptance test is a group 4 test of SPC-0190 (REQ-6156). It plays the Awakening and one adventure of the day on WebKit at the iPad viewport with default settings, the gateway in `replay` mode, and only taps. An init script counts every `AudioContext` and `webkitAudioContext` construction, every `Audio` construction and every `HTMLMediaElement.prototype.play` call, and the network log counts requests under `/sound/` and responses with an `audio/` type. The test passes only when both flows reach their end and every count is zero. It runs once more after effects were turned on, a sound played and effects were turned off, and then also finds no `/sound/` entry in the service worker's cache.

Group 4 holds these tests besides:

- A `looks_set` request with a sound field gets `400`, and her settings screen shows no sound control. Turning effects on at volume 0 in the Parent Room logs one `settings_changed` with volume 1, and the confirmation names it. With music playing on her client, turning music off stops it within 1 second.
- With the clock mocked, «Готово» is inactive at 29 seconds and active at 30 in both eyes-off exercises, the screen shows no digit, the exercise is still open at 60 seconds, and a tap logs `eye_exercise_ended` with `done`; with no tap, the adventure pauses at 120 seconds, no `eye_exercise_ended` is logged, and after the resume the exercise is still open and a tap on «Готово» logs `done`. With «Пропустить» switched on, a tap on it at 1 second ends each of the four exercises with `skip`.
- 200 free texts over 20 simulated adventures show each reaction line before the Master's reply, repeat no line in an adventure while an unshown one remains or in a session, and send no reaction line before a serious trigger's fixed line; the p95 from tap to first character at the iPad viewport fails the test above 2 seconds and is reported against the 1-second target.
- With effects and music on, opening the task window when a level-up is due makes no effects play call while the window is open and leaves the floor music unchanged.
- A tap on every control kind changes its style within 100 ms, and a tap on each action button of the task window leaves no result from `getAnimations()`.

The lint step fails a build in which `AudioContext` or `webkitAudioContext` appears in `src` outside `src/client/audio/`, or in which `new Audio(` or a call to `HTMLMediaElement`'s `play()` appears anywhere in `src`.

The stage 0 spike's iPad checklist holds three rows on sound: on a real iPad, a new install plays no sound (REQ-6158), each parent switch makes its own channel sound (REQ-6160), and with silent mode on neither channel sounds (REQ-6162).

## Failure paths

| Condition | What happens |
| --- | --- |
| A channel is on and Safari refuses to start or resume the audio context in a tap | `audio_blocked`: the event is dropped, its picture shows, the next tap tries again, and the client reports once a session. |
| A sound event fires while the audio context isn't running | The event is dropped, never queued, and its picture shows. |
| A registry file fails to load | `sound_file_missing`: the event plays nothing, its picture shows, and the client reports once per file a session. |
| A registry entry has no `visual` | `tsc` fails the build. |
| A `VisualCue` names nothing that exists, lists no carrier, or its entry's context is the task window or a puzzle's play screen | `visual_equivalent_missing`: the build stops and names the event. |
| An effects event fires while the task window or a puzzle's play screen is open | `playSound` drops it. |
| A `looks_set` request carries a sound field | `400`; nothing is logged. |
| The parent turns a channel on at volume 0 | The volume moves to step 1, and the confirmation names it. |
| The parent turns a channel off while it plays | The `settings` message stops it at once; a client whose stream dropped plays it at most until its next message or packet. |
| A trick's preset equals its base spell's | The content check fails the build. |
| A `heard` canon entry has no `seenSign` | The content check fails the build. |
| She doesn't tap «Готово» in an eyes-off exercise | `eye_exercise_abandoned`: the idle pause comes 120 seconds after the exercise began and suspends the exercise, which stays open; after the resume it ends at her tap on «Готово» or «Пропустить». |
| At the stage 0.3 gate the bank holds fewer than 60 approved unflagged lines, fewer than 20 neutral lines exist, or a line's stored judge result doesn't match its text | `reaction_bank_short`: the build stops and names the count or the line. |
| After stage 0.3, flags take the bank below 60 lines | `reaction_bank_low`: one Parent Room notice until approvals restore 60; the server keeps cycling the lines it has. |
| No reaction line reaches the client within 2 seconds of her tap | `reaction_late`: the waiting animation goes on and the Master's reply follows; the client sends its measured time from tap to first character in a client report after each free text, and the p95 of those reports shows the miss. |
| The server can't be reached when she sends free text | The request can't leave, and SPC-0030's waiting scene shows. |
| A free-text request is resent with the same `clientSeq` | The same reaction line returns, and nothing new is logged. |

## Open review findings

- Round 1 asked to carry ADR-0320's reasons into eight rules (the `/sound/` cache, dropping events, the 334 ms period, no sound when «Готово» turns active, the idle clock, no reaction line before a trigger, the no-judging rule, the waiting shapes). Rejected: a specification states what the system does, and the reasons stay in ADR-0320.
- Round 2 asked to add the reason beside the no-judging rule for reaction lines and the ban on filling, counting or circling waiting shapes, or to cite ADR-0320 beside the five mechanical rules. Rejected: a specification states what the system does, and ADR-0320, which this document follows, holds the reasons.
