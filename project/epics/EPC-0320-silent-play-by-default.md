---
id: EPC-0320
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0320
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The game is silent until the parent turns a channel on, every sound goes through one registry the build checks for a picture, an eyes-off exercise ends at the player's tap, and a prepared line answers free text first

Realises exactly ADR-0320: the parent's two channels, the one audio module and its silence, the volume ceiling, the sound registry with its pictures and its checks, the level-up ceremony, tricks and the canon's seen signs, the eyes-off eye exercises, the familiar's wait, the pressed look, the reaction line with its bank, cycle and flag, the silent acceptance test and the iPad rows.

Until the epics realising ADR-0090, ADR-0110, ADR-0140, ADR-0150 and ADR-0180 exist, the tasks run on stand-in scenes and screens. Each task names what it leaves to those epics. No sound file is required: every registry entry's file is optional, so the epic ships and passes every check with none.

## Acceptance criteria

1. The silent acceptance test of group 4 passes on WebKit with default settings, with the Awakening and one adventure reaching their end and every count at zero, and fails when a test build constructs an `Audio` element on a tap outside the audio module's channel gate; run again after the parent turns effects on, plays a sound and turns effects off, it finds every count at zero and no `/sound/` entry in the service worker's cache. Evidence: the group 4 report, from TSK-0944.
2. The iPad checklist at stage 0 records a new install playing nothing, each switch sounding its own channel, and silent mode silencing both. Evidence: the adult's recorded judgement, from TSK-0945.
3. Adding a registry entry with no `visual`, with an empty carrier list, or with the task window as its context turns group 1 red and names the event, and `grep -rn "webkitAudioContext\|new AudioContext\|new Audio(\|\.play()" src` finds hits only in `src/client/audio/`. Evidence: the group 1 report and the grep's output, from TSK-0933 and TSK-0935.
4. A test sends `looks_set` with a sound field and gets 400, a Playwright test of the player's settings screen finds no sound control, a Parent Room test turns effects on at volume 0 and finds one `settings_changed` with volume 1 and the confirmation naming it, and with music playing on the player's client, turning music off in the Parent Room stops it within 1 second. Evidence: the route and Playwright reports, from TSK-0932.
5. The ceiling test maps every step of both channels to a gain at or below -6 dB. Evidence: the group 2 test's report, from TSK-0934.
6. A Playwright test with the clock mocked finds «Готово» inactive at 29 seconds and active at 30 in both eyes-off exercises, no digit on the screen, the exercise open at 60 seconds and an `eye_exercise_ended` with `done` after the tap; with no tap, the adventure pauses at 120 seconds. Evidence: the Playwright report, from TSK-0938.
7. A test sends 200 free texts over 20 simulated adventures and finds each reaction line shown before the Master's reply, no line repeated in an adventure while an unshown one remained, none repeated in a session, and no reaction line before a serious trigger's fixed line, with the 95th percentile from tap to first character at most 1 second on the iPad viewport. Evidence: the simulation test's report, from TSK-0942 and TSK-0943.
8. A Playwright test with effects and music on opens the task window after a level-up is due and finds no effects play call while the window is open and the floor music unchanged. Evidence: the Playwright report, from TSK-0935 and TSK-0936.
9. A Playwright test taps every control kind and finds its style changed within 100 ms, and after a tap on each action button of the task window finds no `getAnimations()` result. Evidence: the Playwright report, from TSK-0940.
10. At stage acceptance the parent signs off, with both channels off, the level-up ceremony, the chest, hatching, evolution, the eye exercise, the rest stop and the soft stop, the waiting animations and the eyes-off lines, and the owner signs off the canon signs. Evidence: the recorded judgements, from TSK-0936, TSK-0937, TSK-0938 and TSK-0939.
11. Every requirement ADR-0320 addresses lands in at least one task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the 95th percentile from tap to first character of the reaction line against the target of 1 second and the limit of 2, which TSK-0942 reports, and the size of the bank against 60, which TSK-0941 reports. ADR-0320 reverses its reaction line if the Master's checked reply reaches a 95th percentile of 2 seconds or less at stage 0.3, and that shows only when the Master is built.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0932 The parent owns two sound channels that start off at volume 0, and the player's settings hold no sound control
      closes: REQ-6100, REQ-6102, REQ-6104, REQ-6108, REQ-6110
      depends: none
- [ ] T-002 TSK-0933 One audio module is the only code that can make sound, and it leaves no trace while both channels are off
      closes: REQ-6112, REQ-6114, REQ-6116
      depends: TSK-0932 - the channels' state and the `settings` message the module reads.
- [ ] T-003 TSK-0934 Every volume step of both channels stays at or below -6 dB, so music and effects together never pass the file's peak
      closes: REQ-6106
      depends: TSK-0933 - the audio module and the gain node the channels sit under.
- [ ] T-004 TSK-0935 Every sound is a registered event, the build fails when an event has no picture, and no task gives information by sound
      closes: REQ-6118, REQ-6120, REQ-6122, REQ-6124
      depends: TSK-0933 - `playSound` and the module the rules fence.
- [ ] T-005 TSK-0936 The MVP's sound events each have a picture that carries the same information with sound off
      closes: REQ-6126, REQ-6164
      depends: TSK-0935 - the registry and its checks.
- [ ] T-006 [P] TSK-0937 A trick changes how a spell looks, and everything the canon defines by what the heroine hears has a sign the player sees
      closes: REQ-6128, REQ-6130
      depends: none
- [ ] T-007 [P] TSK-0938 An eye exercise that takes the eyes off the screen ends at the player's tap, with no number and no countdown
      closes: REQ-6136, REQ-6138
      depends: none
- [ ] T-008 [P] TSK-0939 While the player waits for the Master, the familiar does something funny, nothing shows time passing, and voice stays optional
      closes: REQ-6140, REQ-6146, REQ-6148
      depends: none
- [ ] T-009 [P] TSK-0940 Every tap changes the tapped control's look within 100 ms, and inside the task window the change is instant
      closes: REQ-6142, REQ-6144
      depends: none
- [ ] T-010 [P] TSK-0941 A reaction line enters the bank only after the full checks, and the build fails on a bank that has fewer lines than it needs
      closes: REQ-6152
      depends: none
- [ ] T-011 TSK-0942 After free text, a prepared reaction line shows first within 2 seconds, and the Master's checked reply follows
      closes: REQ-6150
      depends: TSK-0941 - the bank and the neutral lines the server takes the line from.
- [ ] T-012 TSK-0943 No reaction line repeats in an adventure while the bank holds an unshown one, and the parent can flag a line out
      closes: REQ-6154
      depends: TSK-0942 - the path that shows the line and logs `reaction_line_shown`, which the cycle reads.
- [ ] T-013 TSK-0944 The silent acceptance test plays the Awakening and one adventure and counts every audio act
      closes: REQ-6156
      depends: TSK-0933 - the module whose silence the test proves and the service worker's rule.
- [ ] T-014 TSK-0945 A real iPad shows that a new install is silent, that each switch sounds its own channel, and that silent mode wins
      closes: REQ-6158, REQ-6160, REQ-6162
      depends: TSK-0933 - the audio module the page calls.; TSK-0932 - the switches and their stream message.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0932, TSK-0937, TSK-0938, TSK-0939, TSK-0940 and TSK-0941.
- After TSK-0932: TSK-0933.
- After TSK-0933: TSK-0934, TSK-0935, TSK-0944 and TSK-0945.
- After TSK-0935: TSK-0936.
- After TSK-0941: TSK-0942.
- After TSK-0942: TSK-0943.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0932 | REQ-6100, REQ-6102, REQ-6104, REQ-6108, REQ-6110 |
| TSK-0933 | REQ-6112, REQ-6114, REQ-6116 |
| TSK-0934 | REQ-6106 |
| TSK-0935 | REQ-6118, REQ-6120, REQ-6122, REQ-6124 |
| TSK-0936 | REQ-6126, REQ-6164 |
| TSK-0937 | REQ-6128, REQ-6130 |
| TSK-0938 | REQ-6136, REQ-6138 |
| TSK-0939 | REQ-6140, REQ-6146, REQ-6148 |
| TSK-0940 | REQ-6142, REQ-6144 |
| TSK-0941 | REQ-6152 |
| TSK-0942 | REQ-6150 |
| TSK-0943 | REQ-6154 |
| TSK-0944 | REQ-6156 |
| TSK-0945 | REQ-6158, REQ-6160, REQ-6162 |

The smallest set of tasks that would test the decision is TSK-0933, TSK-0935, TSK-0944 and TSK-0942. Together they show whether the game makes no sound until the parent allows it, whether any sound lacks a picture, whether a muted browser run proves silence by counting, and whether the first line really arrives within the budget, which are the failures the decision's premortem names.

## Not covered

- REQ-6132 and REQ-6134, the 30-second minimum and the end at the player's tap of an eyes-off exercise, which ADR-0360 addresses as REQ-6430 and REQ-6432 after it superseded them; ADR-0320 no longer addresses them, and TSK-0938 builds the behaviour they state.
