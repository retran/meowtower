---
id: RES-4110
artifact: research
status: approved
revised: 2026-09-28
elaborates: RES-2500
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The game can run with no sound if sound stays off until the parent turns it on and every sound event has its own picture, and a prepared line from a pre-checked bank meets the Master's 2-second budget while the generated reply still shows only after the whole of it is checked

## Summary

The owner's addendum of 2026-09-28 makes silence the normal state of the game: sound is off by default, music and effects are turned on only in the parent's settings, and every sound event has a visual equivalent that works alone. The approved record mostly treats sound as decoration, so most of it survives. No task or template uses a sound cue, the timed events are already scenes with lines, and dictation is already optional beside typing and the suggestion chips. The approved record breaks in five places. The player's own settings hold the sound switch, and sound starts on the first touch. The level-up ceremony and tricks are defined partly by sound, and so are two of the MVP's three eerie Tangles. The eye exercises that take her eyes off the screen have no end signal she can see. The largest conflict comes from the addendum's responsiveness budget: the first character of the Master's text within 2 seconds at the 95th percentile. ADR-0110 checks the whole reply before any of it shows and keeps a 6-second budget. The record decides to meet 2 seconds with a prepared reaction line from a pre-checked bank, shown at once, while the Master's generated reply still shows only after the whole of it is checked, because that keeps every approved check. It also decides that an eye exercise with her eyes off the screen ends when she taps «Готово». The record also finds that a Playwright run with muted audio proves little by itself, because Playwright already mutes Chromium by default, so the acceptance test has to detect every attempt to play a sound. It doesn't choose sound files or design the visual equivalents one by one.

The reader is evaluating the design: the owner, and the requirements and design steps that follow.

## The question

What must change in the approved record so that the game works fully with no sound, as the owner's addendum of 2026-09-28 requires, and what does the addendum's "responsiveness without sound" budget ask of the parts that already exist? The player can't rely on sound while playing, so every piece of information the game gives has to reach her through the screen.

The question assumes the fix is to add a picture to each sound. That assumption holds for an event she watches, such as a level-up. It fails for an event that happens while she isn't looking at the screen: an eye exercise asks her to cover her eyes with her palms or look far out of a window, and no picture reaches closed eyes. For those moments the right equivalent is no signal at all: she ends the moment herself. So the question is wider than "which picture for which sound". It also asks which moments must stop depending on any signal the game sends.

The question also assumes that sound was the thing carrying responsiveness. It wasn't: the approved record has no sound on a tap or a verdict. The addendum's risk 6 is about latency and waiting, and silence only makes a slow screen easier to notice, because no sound fills the gap.

## Method

On 2026-09-28 I read the owner's addendum 1 to the specification, section 11 and the risk 6 line of section 12, with the general rules at its top and the acceptance tests at its end.

In the repository, at commit 47c0a7b, I ran `paw find sound` and searched `project/` and `canon/` for sound, audio, music, melody, chime, volume, autoplay, mute, haptic, dictation, microphone, first touch, silent mode, whisper and hum, and `project/` for latency budgets in milliseconds, p95, spinner and typing. I read the hits in RES-0300, RES-1500, RES-1600, RES-2000, RES-2100, RES-2500, RES-3000, RES-3100, RES-3200 and RES-3500. I read ADR-0020, ADR-0030, ADR-0110, ADR-0140, ADR-0150 and ADR-0190 where they touch sound, settings or budgets, and the approved requirements that name sound, voice input, the eye exercises and the Master's wait. In the canon I read CAN-0030, CAN-0050, CAN-0100 and CAN-0130 where they describe sound.

I also read the owner's untracked design files on 2026-09-28: `design/design-system/README.md`, `components/bundle.css`, the `Button` and `TaskWindow` functions in `components/bundle.js` and the prototype screens `31-Settings` and `32-TestMode`.

On the web, on 2026-09-28, I read WCAG 2.2's Understanding pages for success criteria 1.1.1, 1.3.3, 1.4.1 and 1.4.2, the W3C Web Audio API 1.1 draft and the Audio Session API draft, WebKit's 2016 post on media policies for iOS, WebKit bug 237322, MDN's pages on autoplay, `AudioContext.resume()` and `Element.getAnimations()`, caniuse's Vibration API table, Playwright's `BrowserType` page and Playwright issue 19534, and Jakob Nielsen's article on response times.

I measured nothing. I ran no model, so I have no figure for how long any approved Master model takes to produce its first line. I didn't test Safari on an iPad, so what I say about iPadOS audio comes from WebKit's own statements. I found no Apple or WebKit document that states iPadOS's autoplay rule for the Web Audio API directly, only the Web Audio draft's general rule and WebKit's statements on video and on the ringer switch. I found no WCAG criterion aimed at children or at a player who can't use sound for a reason other than a hearing loss.

## Findings

### The addendum makes silence the default and asks for a picture for every sound event

Section 11 says the player can't use sound, and the game must work fully without it. Sound is off by default. Music and effects turn on only in the parent's settings, each separately, with a volume limit, and this replaces the approved rule that sound starts at the first touch. Every sound event has a self-sufficient visual equivalent. The addendum names the level-up, the chest, evolution and hatching, and the signals of the eye exercise, the rest stop and the soft stop, each shown as a scene and a card. No task or puzzle gives a sound hint. Dictation stays optional. The acceptance test plays the Awakening (Session 0) and the adventure of the day in Playwright with audio off. It also searches the code for a visual equivalent at every place that plays a sound and checks that the default volume is 0. The addendum overrides the specification where they disagree (owner's addendum, 2026-09-28).

### The addendum asks for five things that keep the game responsive without sound

Risk 6 in section 12 asks for a response to a touch within 100 ms, a verdict that never waits for a language model, the first character of the Master's text within 2 s at the 95th percentile, a familiar doing something funny while the player waits in place of a spinner, and visual feedback (owner's addendum, 2026-09-28).

### RES-2500 starts sound on the first touch, which the addendum replaces

RES-2500's iPad client says "Sound starts on the first touch and respects silent mode; music and effects are separate" (RES-2500, read 2026-09-28). Separate music and effects survive. Starting on the first touch doesn't, because sound now starts only after the parent turns it on.

### Four approved records put the sound switch in the player's own settings

An approved requirement built on RES-3500 lets the player turn sound on or off in her own settings at any time. RES-3500 describes the settings screen with music and sound at «Тихо», «Средне» and «Громче» (quiet, medium, louder), and its conclusion 16 lets her choose sound at any time. ADR-0150, part 3, puts "sound on or off" on her settings screen, and ADR-0020 records the change as `looks_set`, "she changed her theme, palette, text size or sound" (all read 2026-09-28). Under the addendum the switch belongs to the parent, so a parent's change becomes a `settings_changed` event, the event ADR-0020 already defines for the parent's settings.

### The owner's settings prototype has no "off" and starts at medium

The prototype screen `31-Settings` offers «Тихо», «Средне» and «Громче» with no off position, and its initial state is `sound: 1`, the middle one (design file, read 2026-09-28). The prototype `32-TestMode` already has sound «в проверке по умолчанию выключен» (off by default in test mode). The design files aren't committed, so the design step has to carry this change into them by hand.

### The level-up ceremony and tricks are defined partly by sound

RES-2000 and ADR-0140 make a level-up in the MVP "a ceremony of light and sound", and an approved requirement repeats the words. RES-2100 and ADR-0140 let a trick change "only animation and sound, never power", and CAN-0100 gives a focus "the animation and sound of a blow" (all read 2026-09-28). With sound off, the ceremony is light alone, which already carries it. A trick whose only change is its sound would show her nothing, so every trick must change what she sees.

### Two of the three MVP eerie Tangles are defined by what she hears

CAN-0050 describes Whisperkin as a moth that "quietly whispers the heroine's name from round a corner" and the Music Box as a place where "a slightly off-key tune plays, closer and closer". CAN-0130 lists humming lamps and a humming carousel on the dreamcore floors, and RES-1500 lets a floor's dreamcore variant change the music (all read 2026-09-28). The MVP's three level-1 Tangles are Whisperkin, the Music Box and the Portrait Lady (RES-1500). Story text can still describe a whisper, because she reads it. What must change is any clue she can only hear, so the canon has to give each of these creatures a sign she sees.

### The eye exercises that take her eyes off the screen have no end signal she can see

RES-0300 and the approved requirements built on it rotate four exercises: looking far out of the window, blinking, tracing a figure eight and covering the eyes with the palms. They fix 30 to 40 seconds and allow no skip unless the parent switches it on (read 2026-09-28). RES-0300 says the familiar "shows" each exercise and says nothing about how she learns it has ended. For looking far away and for palming, her eyes are off the screen, so a visual end signal reaches her only when she looks back. The design step has three ways to end such an exercise:

| Option | Better at | Against it |
| --- | --- | --- |
| Do nothing: the scene ends itself after 30 to 40 seconds | no new control; the approved length holds exactly | she learns of the end only by looking back, so she either peeks early or keeps her eyes covered after the scene has gone |
| A self-paced end: the familiar tells her how long to do it in her own terms, such as ten slow breaths, and a «Готово» (Done) button becomes active after 30 seconds | nothing depends on a signal she can't perceive; she decides when she has finished | the button that turns active is a pattern that leaks time, as RES-0300 already accepts for the rest-stop button; she could press it without doing the exercise |
| Drop the two exercises that need her eyes off the screen | every exercise stays on the screen, so a visual end always works | looking far away is the main point of an eye break, so this removes the most useful exercise |

The self-paced end leads, because it is the only option where the end of the exercise never depends on the game reaching her. The case against it is that she can tap «Готово» at once after 30 seconds without looking away, which the scene can't detect. RES-0300's rest-stop button is inactive for 10 minutes with no countdown, so the approved record already accepts an inactive button that turns active without showing time. The self-paced end is chosen, for the reason above.

### Every other timed event already reaches her as a scene with lines

RES-0300's table shows each timed event as a story moment: the familiar at the window with a System line for the eye exercise, the familiar yawning and the Tower dimming its lamps for fatigue, System lines for the soft stop and for an extension (read 2026-09-28). None of these names a sound, so the addendum's "a scene and a card" adds a card to scenes that already work silently. RES-1700 and the approved requirement built on it already forbid announcing a broken streak "by word or by sound".

### No approved task, template or puzzle uses a sound cue

A search of `project/` for sound, audio, music, listen and hear found no task template, answer form or hint that plays or refers to a sound; the hits in RES-1200, RES-0800 and RES-1000 were about volume as a measure (read 2026-09-28). The rule "no sound hints in tasks" therefore changes nothing in the approved record. It binds the new task forms of the addendum and every template written later.

### Dictation is already optional, and every story choice works without it

RES-3200 puts voice input beside the story's text field. ADR-0150, part 7, starts Safari's speech recognition where it exists and otherwise focuses the field for the keyboard's own dictation key. ADR-0110 always draws three suggestions and «Дальше» (Next), "so she never has to type" (read 2026-09-28). Voice input is one of three ways to act, so keeping it optional needs no change.

### The approved loudness rules cap how loud a sound can be, and none sets a default volume or a parent's limit

ADR-0150, part 7, plays every sound through one Web Audio gain node that ramps up over at least 50 ms and normalises each file to -20 LUFS and -3 dBTP, so no sound starts loud. ADR-0190's Baselines table holds those figures. ADR-0150 also says "Where the sound files come from. This decision only caps their loudness" (read 2026-09-28). No record sets a default volume or lets the parent limit volume per channel, which the addendum adds.

### The stage 0 spike checks that sound works, and nothing checks that it stays off

RES-3000 makes the spike show on a real iPad that "sound, dictation and the home-screen icon work", and ADR-0190's stage 0 checklist lists sound (read 2026-09-28). Under the addendum the spike also has to show that a new install plays nothing until the parent turns sound on.

### WCAG treats a sound that carries meaning as content that needs a text or visual alternative

WCAG 2.2 success criterion 1.1.1 (level A) requires a text alternative for non-text content. Its Understanding page gives the example of an e-learning application whose chime means a right answer and whose beep means a wrong one. The page says "A text description is also included so that people who can't hear or understand the sound understand whether the answer is correct or incorrect". Criterion 1.3.3 (level A) says instructions must not "rely solely on sensory characteristics of components such as shape, color, size, visual location, orientation, or sound" (W3C, read 2026-09-28). These criteria describe the addendum's rule for any sound that carries meaning.

### WCAG warns that a visual equivalent must not rest on colour alone

Criterion 1.4.1 (level A) says colour must not be "the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element" (W3C, read 2026-09-28). A visual equivalent that replaces a sound is a new visual means, so it has to carry its meaning through a shape, a word or a motion as well as colour. The player can change her palette freely (ADR-0150), which makes colour a weaker carrier here than on a fixed design.

### WCAG prefers a sound that the user starts over one the user has to stop

Criterion 1.4.2 (level A) requires a way to pause or control audio that plays automatically for more than 3 seconds. Its Understanding page encourages "that the sound be *started* by an action initiated by the user after they reach the page, rather than requiring that the sound be *stopped*" (W3C, read 2026-09-28). The addendum's default goes further: the parent starts it, and the player never has to stop it.

### The Web Audio draft lets a browser hold audio until a user gesture, and the iPad's ringer switch mutes Web Audio unless the page claims playback

The W3C Web Audio API 1.1 draft of 2026-09-22 says a user agent "may disallow this initial transition", from suspended to running, "and to allow it only when the `AudioContext`'s relevant global object has sticky activation" (read 2026-09-28). WebKit's 2016 post on iOS media policies lets video autoplay without a gesture only when it has no audio track or is muted, and pauses it if it gains sound "without a user gesture". WebKit bug 237322, "webaudio api is muted when the iOS ringer is muted", was resolved in September 2024. A WebKit engineer noted that since iOS 17 a page can set `navigator.audioSession.type = "playback"` so that audio "will not be suspended" (read 2026-09-28). So the game has to start audio inside a tap even after the parent turns sound on, because the draft lets Safari refuse it at any other moment. It keeps RES-2500's "respects silent mode" only while it leaves the audio session type at its default.

### iPadOS Safari offers no vibration, so the screen is the only channel besides sound

caniuse lists the Vibration API as not supported in Safari on iOS in any version up to 27.2 (read 2026-09-28). A web game on the iPad has no haptic channel to fall back on, so every equivalent has to be visual.

### A Playwright run with muted audio proves nothing by itself, because Playwright already mutes Chromium by default

Playwright's `BrowserType` page says "You can use ignoreDefaultArgs to filter out `--mute-audio` from default arguments", so Chromium runs muted in every Playwright test. Issue 19534, opened on 2022-12-16 and closed, asks for a mute option because the user couldn't silence WebKit (read 2026-09-28). A test that only runs with audio off would pass even if the game played a sound on every tap. The test has to observe the audio APIs: count `AudioContext` constructions and `HTMLMediaElement.play()` calls with an init script and check the network log for sound files.

### The approved budgets already give a verdict with no model call, and none measures the touch response itself

ADR-0030 replies to an answer within 300 ms at the 95th percentile, on a path that "makes no model call", so the verdict already never waits for a language model. ADR-0190's Baselines table holds "Screen change on the iPad: at most 100 ms", chosen by ADR-0150 "so a tap feels immediate" (read 2026-09-28). A screen change isn't the first visible response to a tap: after «Готово» the next screen waits for the 300 ms reply. Nielsen gives 0.1 second as "the limit for having the user feel that the system is reacting instantaneously" (Nielsen, 1993, read 2026-09-28). So the addendum's 100 ms touch response is a new budget, met by the pressed state of the control, and the 300 ms reply can follow it.

### The design's button press is a 90 ms transition, which the approved task-window test would count as an animation

`bundle.css` gives `.tw-btn` "transition: transform var(--dur-press) ... box-shadow var(--dur-press)", with `dur-press` at 90 ms, while `.tw-key:active` changes its transform with no transition. `TaskWindow` in `bundle.js` renders «Не знаю», the thread button and «Готово» as `Button`, that is `.tw-btn` (design files, read 2026-09-28). ADR-0150's Playwright test expects "no `getAnimations()` result inside the task window", to enforce RES-3500's rule that nothing animates in the task window, and MDN says `getAnimations()` includes CSS transitions (read 2026-09-28). So a tap on an action button inside the task window would fail that test. The keypad's instant pressed state meets both the addendum's visual feedback and the no-motion rule.

### The approved record checks the whole Master reply before it shows and budgets 6 seconds, and the addendum asks for the first character within 2

RES-1600 checks every Master reply in full before it shows and sets the p95 wait after free text at 6 seconds, and approved requirements repeat both rules. ADR-0110 splits that wait into 100 ms local, 4,400 ms Master, 1,000 ms checks and 500 ms slack. It rejected streaming because the checks must pass before a reply shows, "and a child can't unread a line". ADR-0190 holds the same figures, RES-1600 shows «Система обрабатывает…» (The System is processing...) during the wait, and RES-3000's conclusion 7 sets 6 seconds for the MVP stage (all read 2026-09-28). A check that waits for the whole reply meets the addendum's 2 seconds only if the Master answers in about a third of its current budget. I have no measurement that says it can. The wait sign also changes: the addendum puts the familiar doing something funny where RES-1600 has a line of System text. No approved record makes the familiar a waiting sign, and RES-0300 already forbids an hourglass as one.

### Four ways answer the 2-second budget, and the prepared bridge keeps every approved check

| Option | Better at | Against it |
| --- | --- | --- |
| Do nothing: keep the 6-second whole-reply check, and show the familiar's funny wait | every line she reads was checked with the whole reply; no new failure mode | the first character comes at up to 6 s at p95, three times the addendum's budget |
| Line-by-line: the Master returns one line at a time, and each line passes the per-line checks before it shows | the text she reads is the Master's own, and nothing unchecked shows | the checks that need the whole reply, such as the schema and a branch's shape, run after the first lines already show; a later line that fails leaves shown lines with no ending, so the scene needs a fallback continuation; I have no figure for time to the first checked line |
| A prepared bridge: within 100 ms of sending, the familiar or the System reacts to her text with a line from a pool the library checked in advance, and the Master's reply follows under today's rule | meets any first-response budget at no model cost; keeps every approved check | the bridge line wasn't written for her text, so it is not the Master's answer to her; a pool line can repeat, which the addendum's risk 4 counts against |
| A bridge and line-by-line together | the fastest first line, and the Master's own text soon after it | carries the costs of both |

The prepared bridge is chosen, because it is the only option that meets 2 seconds without showing a line before the whole reply is checked, and a child can't unread a line. Line-by-line would let a reply start before all of it is checked, and I have no figure for its time to a first checked line. The cost of the bridge is that its first characters are not the Master's answer to her text, and the bank has to be large enough that its lines don't repeat often.

### The records that must change

This finding lists every approved record the addendum changes, so the requirements and design steps can supersede or amend each one.

| Record | What it says now | What the addendum needs |
| --- | --- | --- |
| RES-2500 | sound starts on the first touch | sound starts only after the parent turns it on, and then on the next tap |
| RES-3500's requirement on her sound switch | the player turns sound on or off | the parent turns music and effects on or off, separately |
| RES-3500, screen 31 and conclusion 16 | the player chooses sound at any time | sound leaves her settings |
| ADR-0150, parts 3 and 7 | sound on her settings screen; loudness only | sound in the Parent Room; default volume 0; a volume limit per channel |
| ADR-0020 | `looks_set` includes sound | sound changes arrive as `settings_changed` |
| RES-2000, ADR-0140 | a ceremony of light and sound | a ceremony whose light carries it alone, with sound only where the parent turned it on |
| RES-2100, ADR-0140 | a trick changes animation and sound | a trick always changes what she sees |
| CAN-0050, CAN-0130, CAN-0100 | creatures and places defined by what she hears | each has a sign she sees |
| RES-0300 | four exercises of 30 to 40 seconds, with no end signal named | an end she reaches by herself when her eyes are off the screen |
| RES-3000, ADR-0190 stage 0 | the spike shows that sound works | the spike also shows that sound stays off by default |
| ADR-0110, ADR-0190, RES-1600, RES-3000 | the whole reply is checked; 6 s at p95; a System line while waiting | a prepared line from a pre-checked bank within 2 s at p95, the whole reply still checked before it shows; the familiar as the waiting sign |
| ADR-0150, task-window test, and the design's `.tw-btn` | a 90 ms press transition on buttons inside the task window | an instant pressed state inside the task window |

### Decided on 2026-09-28

The first character of the Master's text within 2 seconds at the 95th percentile is a prepared reaction line from a pre-checked bank, shown at once when she sends her text, and the Master's generated reply still shows only after the whole of it is checked. This meets the budget with no model cost and keeps the approved rule that nothing unchecked shows, because a child can't unread a line. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

An eye exercise that takes her eyes off the screen ends when she taps «Готово», which becomes active after 30 seconds with no countdown, and the familiar tells her the length in her own terms, such as ten slow breaths. This is the only option where the end never depends on a signal she can't perceive, and RES-0300 already accepts an inactive button that turns active without showing time. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

The canon changes this record needs, a sign she sees for Whisperkin, the Music Box, the humming lamps and the humming carousel, are approved with this record, and the canon records must be amended to carry them. The canon is the owner's, so the owner's approval of this record is the approval the canon change needs. Decided on 2026-09-28 by research, on the owner's instruction to decide the open questions; the owner approves it with this record.

## Conclusions

1. The game must play no sound until the parent turns music or effects on in the Parent Room, and a new install and a reset must start with both off and at volume 0.
2. The parent's settings must hold music and effects as two separate switches, each with its own volume. No volume may exceed a ceiling the design step sets on top of the approved loudness budget.
3. The player's own settings must hold no sound control, and a parent's change to sound must be logged as a parent's settings change.
4. While sound is off, the client must create no audio context, play no media element and fetch no sound file, so that a test can prove silence by counting.
5. Once the parent turns sound on, the client must start audio only inside a tap and must leave the audio session at its default type, so the iPad's silent mode still silences it.
6. Every place in the code that plays a sound must name a sound event, and every sound event must map to a visual equivalent that conveys the same information on its own. A static check must fail the build when an event has none.
7. No visual equivalent may carry its meaning by colour alone, because the player can choose any palette.
8. No task, hint, puzzle or answer form may give information by sound, and every template written later must hold to the same rule.
9. The level-up ceremony must be complete as light and motion, and a trick must always change what she sees.
10. Every creature, place or clue that the canon defines by what she hears must also have a sign she sees, starting with Whisperkin, the Music Box and the humming lamps of the dreamcore floors.
11. An eye exercise that takes her eyes off the screen must end by her own action after its minimum length, never by a signal the game sends while she isn't looking.
12. Voice input must stay optional, and every story choice must remain possible by tapping a suggestion or typing.
13. Every tap must change the tapped control's look within 100 ms, and inside the task window that change must be an instant state change with no transition.
14. The verdict must keep coming from a path that makes no model call.
15. While she waits for the Master, the familiar must do something funny in the scene column, and no spinner, hourglass or time indicator may show.
16. The acceptance test must play the Awakening and one adventure of the day in Playwright on WebKit with default settings. It must pass only when the flow reaches its end and the counts in conclusion 4 are zero.
17. The stage 0 spike on a real iPad must show that a new install plays nothing, that the parent's switch turns music and effects on separately, and that silent mode still silences them.
18. Every approved record that the finding "The records that must change" lists must be superseded or amended before the MVP is built on it, the canon records included.
19. When she sends free text, a prepared reaction line from a pre-checked bank must show within 2 seconds at the 95th percentile, and the Master's generated reply must still show only after the whole of it is checked, within the approved 6-second budget.

## Sources

- The owner's addendum 1 to the specification, 2026-09-28 - section 11 on play without sound, the risk 6 line of section 12, the general rules and the acceptance tests.
- `project/research/RES-0300-clocks-breaks-soft-stop.md`, `RES-1500-world-style-tone.md`, `RES-1600-master-and-director.md`, `RES-1700-trial-outcomes-branches.md`, `RES-2000-progression.md`, `RES-2100-rewards-economy.md`, `RES-2500-platform-and-stack.md`, `RES-3000-stages-open-questions.md`, `RES-3100-design-system-tokens-themes.md`, `RES-3500-design-screens-and-prototype.md`, read 2026-09-28 at commit 47c0a7b - the timed events as scenes, the eerie Tangles, the Master's wait and checks, the level-up and tricks, sound on the first touch, the spike, motion and loudness, the settings screen.
- `project/adrs/ADR-0020`, `ADR-0030`, `ADR-0110`, `ADR-0140`, `ADR-0150`, `ADR-0190`, read 2026-09-28 at commit 47c0a7b - `looks_set` and `settings_changed`, the 300 ms answer path with no model call, the rejected streaming option and the 6-second split, the ceremony and tricks, the settings screen, loudness, voice input and the task-window animation test, the Baselines table.
- `project/requirements/`, the approved requirements that name sound, voice input, the eye exercises, the task window's motion and the Master's wait, read 2026-09-28 at commit 47c0a7b - the rules the addendum confirms or changes; the requirements step traces them from the research records this record names.
- `canon/CAN-0030-the-tower.md`, `CAN-0050-tangles.md`, `CAN-0100-items.md`, `CAN-0130-dreamcore-and-underside.md`, read 2026-09-28 at commit 47c0a7b - creatures, places and items defined by sound.
- The owner's design files `design/design-system/README.md`, `components/bundle.css`, `components/bundle.js` and the prototype screens `31-Settings` and `32-TestMode`, read 2026-09-28; not kept in the repository - the settings without an off position, test mode's silent default, the 90 ms button transition and the task window's buttons.
- [WCAG 2.2 Understanding SC 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html), read 2026-09-28 - sound effects that mark right and wrong answers need a text alternative.
- [WCAG 2.2 Understanding SC 1.3.3 Sensory Characteristics](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html), read 2026-09-28 - instructions must not rely on sound alone.
- [WCAG 2.2 Understanding SC 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), read 2026-09-28 - colour must not be the only visual means.
- [WCAG 2.2 Understanding SC 1.4.2 Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html), read 2026-09-28 - sound started by the user is preferred to sound the user must stop.
- [W3C Web Audio API 1.1, Working Draft 2026-09-22](https://www.w3.org/TR/webaudio/), read 2026-09-28 - an audio context may stay suspended until the page has sticky activation.
- [W3C Audio Session API, Working Draft 2024-11-13](https://www.w3.org/TR/audio-session/), read 2026-09-28 - the session types, `playback` among them.
- [WebKit, New video policies for iOS, 2016-07-25](https://webkit.org/blog/6784/new-video-policies-for-ios/), read 2026-09-28 - media with sound needs a user gesture to play.
- [WebKit bug 237322](https://bugs.webkit.org/show_bug.cgi?id=237322), read 2026-09-28 - the ringer switch mutes Web Audio; `navigator.audioSession.type = "playback"` since iOS 17 stops that.
- [MDN, Autoplay guide for media and Web Audio APIs](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), read 2026-09-28 - starting Web Audio outside a user input event is subject to autoplay rules.
- [MDN, Element.getAnimations()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations), read 2026-09-28 - the result includes CSS transitions.
- [caniuse, Vibration API](https://caniuse.com/vibration), read 2026-09-28 - not supported in Safari on iOS.
- [Playwright, BrowserType](https://playwright.dev/docs/api/class-browsertype), read 2026-09-28 - `--mute-audio` is a default argument.
- [Playwright issue 19534](https://github.com/microsoft/playwright/issues/19534), read 2026-09-28 - no built-in mute option for WebKit.
- [Jakob Nielsen, Response Times: The 3 Important Limits, 1993](https://www.nngroup.com/articles/response-times-3-important-limits/), read 2026-09-28 - 0.1 second as the limit for feeling instantaneous.
