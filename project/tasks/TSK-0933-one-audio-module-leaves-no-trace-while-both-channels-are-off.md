---
id: TSK-0933
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6112, REQ-6114, REQ-6116]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One audio module is the only code that can make sound, and it leaves no trace while both channels are off

After this task, `src/client/audio/` is the only code that creates an audio context, it creates nothing and requests no sound file while both channels are off, it starts audio only inside the player's next tap, and it never sets the audio session type.

## Acceptance criteria

1. Given both channels off, when a Playwright test plays a scripted session with an init script that counts audio contexts, `Audio` constructions and media element `play()` calls and a network log of `/sound/`, then every count is zero (REQ-6112). Closed by: the Playwright test.
2. Given `AudioContext` or `webkitAudioContext` in `src` outside `src/client/audio/`, `new Audio(` or a media element's `play()` anywhere in `src`, or any use of `navigator.audioSession`, when the lint verb runs, then it fails and names the file (REQ-6112, REQ-6116). Closed by: the lint verb's output on four fixtures, and a search that finds hits only in `src/client/audio/`.
3. Given both channels off, when the service worker handles a request, then it leaves `/sound/` out of its cache; given a file cached while a channel was on and both channels turned off, then the client deletes every `/sound/` entry from the cache (ADR-0320). Closed by: a service worker test.
4. Given a channel turned on, when the player taps, then the module creates or resumes its context inside that tap's handler and in no other place; given a sound event that fires while the context isn't running, then it is dropped and never queued, and its picture shows as it always does (REQ-6114). Closed by: a client test with a mocked context.
5. Given the module, when its source is read, then it plays every file as an `AudioBuffer` and never sets the audio session type, so Safari keeps its default session (REQ-6116). Closed by: the lint verb's output and a unit test that spies on `navigator`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/client/audio/` with one public call, `playSound(event)`, which decodes each file into an `AudioBuffer` and plays it through the one gain node. Add the three ESLint rules: Web Audio's constructors outside the module, `Audio` construction and `play()` everywhere, and `navigator.audioSession` everywhere. Make the service worker of ADR-0010 skip `/sound/` while both channels are off, because a cache that fetched the files at install would break the rule without the module ever playing anything.

I chose dropping an event over queueing it, as ADR-0320 did, because a sound queued until the next tap would play at a moment that has nothing to do with it, and the picture already carried the event.

## Depends on

- TSK-0932 (blocking): the channels' state and the `settings` message the module reads.

The epic realising ADR-0150 supplies the one gain node with its ramp; until it exists the module owns a stand-in gain node that that epic adopts.

## Evidence

Not yet.

## Left alone

The volume steps, which TSK-0934 sets. The full silent acceptance test on the Awakening and an adventure, which TSK-0944 runs. Whether the real iPad's silent mode silences the game, which only the device shows and TSK-0945 checks.
