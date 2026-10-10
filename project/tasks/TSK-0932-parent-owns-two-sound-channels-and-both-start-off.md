---
id: TSK-0932
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6100, REQ-6102, REQ-6104, REQ-6108, REQ-6110]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent owns two sound channels that start off at volume 0, and the player's settings hold no sound control

After this task, the Parent Room's settings panel has a music channel and an effects channel, each with its own switch and a volume of 0 to 5, a new install has both off, the change is a `settings_changed` event and the client learns it on the player's stream.

## Acceptance criteria

1. Given a new install or a reset, when the two channels are read, then both are off at volume 0 and the client treats both as off until the `settings` message its stream opens with arrives (REQ-6100, REQ-6102). Closed by: a settings test and a client test that reads the state before and after the message.
2. Given the Parent Room, when the parent turns music on and effects off, then each channel has its own switch and volume, and `PUT /api/parent/settings` with `sound.music` as `{ on: true, volume: 3 }` leaves `sound.effects` unchanged (REQ-6104). Closed by: a route test and a Parent Room test.
3. Given a channel turned on while its volume is 0, when the panel confirms, then the volume is step 1 and the confirmation reads «Эффекты включены, громкость 1 из 5»; given the channel turned off and on again, then the earlier volume returns (REQ-6104). Closed by: a Parent Room test.
4. Given a change of either channel, when the event log is read, then it holds one `settings_changed` with the key `sound.music` or `sound.effects` and the value `{ on, volume }`, and no `looks_set` (REQ-6110). Closed by: a route test that reads the log.
5. Given the player's settings screen and a `looks_set` request that carries a sound field, when each is checked, then the screen holds no sound control and the request gets `400` and logs nothing (REQ-6108). Closed by: a Playwright test of the screen and a route test.
6. Given music playing on the player's client, when the parent turns music off, then the server pushes `settings` on the player's stream in the same step that logs the event and the client stops it within 1 second (ADR-0320). Closed by: a Playwright test with two contexts.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the keys `sound.music` and `sound.effects` to `PUT /api/parent/settings`, the settings panel's two channels behind the PIN, and the SSE message `settings` with the current `{ on, volume }` of both channels, sent when the stream opens and in the step that logs `settings_changed`. Remove sound from the player's settings screen and from the schema of `looks_set`, which then records only a change of theme, palette or text size. I chose the push, as ADR-0320 did, because a stream with no other traffic would otherwise leave floor music playing after the parent turned it off.

I chose to move the volume to step 1 when a channel goes on at volume 0, because a switch that is on and plays nothing would look broken.

## Depends on

Nothing. The epic realising ADR-0030 is done and supplies the settings route, the stream and `clientSeq`; the epic realising ADR-0180 supplies the Parent Room's settings panel and ADR-0150 the player's settings screen.

## Evidence

Not yet.

## Left alone

What the client does with a channel once it is on, which TSK-0933 builds, and the volume's ceiling, which TSK-0934 sets.
