---
id: TSK-0937
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6128, REQ-6130]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A trick changes how a spell looks, and everything the canon defines by what the heroine hears has a sign the player sees

After this task, a trick's catalogue entry names an animation preset that differs from its base spell's, the canon data carries a `seenSign` for every `heard` entry, and the content checks fail the build on a trick or an entry that breaks either rule.

## Acceptance criteria

1. Given a trick whose animation preset equals its base spell's, when the content check runs, then it fails and names the trick; given a trick with another preset, then it passes (REQ-6128). Closed by: the content check's test with both fixtures.
2. Given a trick and its base spell on the same fixture state, when each resolves, then power and every other outcome are equal and only the look, and a sound event if named, differ (REQ-6128). Closed by: a rules test.
3. Given a canon entry tagged `heard` with no `seenSign`, when the content check runs, then it fails and names the entry; given the canon data after this task, then Whisperkin, the Music Box and the humming lamps and carousel each carry one (REQ-6130). Closed by: the content check's test and its output.
4. Given each default sign, when the flash check of ADR-0150 reads the ring or drift's period, then it is at least 334 ms (ADR-0320). Closed by: the flash check's output over the three signs.
5. Given the canon's three signs, when the owner reads them, then each is a sign the heroine's player can see for what the canon defines by hearing (REQ-6130). Closed by: the owner's judgement, because the canon is the owner's.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `heard` tag and the `seenSign` field to the canon data and the content check, and the preset rule to ADR-0140's content check for tricks. A trick's entry has no field any other rule reads. Until the owner's canon amendment carries the signs, the data holds the defaults I chose as ADR-0320 did: Whisperkin leaves her name in drifting paper dust round the corner; the Music Box sends crooked drawn notes that float closer; the humming lamps and the carousel glow in slow rings that widen and fade. Story text may still describe a whisper, because the player reads it.

## Depends on

Nothing. The epic realising ADR-0140 supplies the trick catalogue, and the canon data lives with the epic realising ADR-0110.

## Evidence

Not yet.

## Left alone

The canon's own wording of the four signs, which the owner writes and which replaces the defaults without a change to this decision.
