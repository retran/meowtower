---
id: TSK-0954
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6204, REQ-6266]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every adventure plays a scene without tasks and brings in a character she has met

After this task, every adventure plan holds one `interlude` order that is neither a trial's lead-in nor a transition, the order names the member of the canon's recurring cast whom she met least recently, and a library interlude plays when the Master's reply fails.

## Acceptance criteria

1. Given 60 plans of 1 to 4 floors, when each is read, then each holds exactly one `interlude` order with no task, placed after the second floor's chest on a plan of 3 or more floors and after the first floor's chest on a plan of 1 or 2, before the next entry or the finale (REQ-6204). Closed by: a plan test over the 60 plans.
2. Given an adventure resumed before and after the interlude, when it resumes, then the interlude plays once if it hasn't played, and never twice (REQ-6204). Closed by: a resume test.
3. Given a canon with recurring cast members she has met at different times, when the interlude's order is built, then it names the one she met least recently by the speakers of `scene_shown`, never a familiar or the System; and given none met, then the interlude plays without one and the owner gets one report (`known_character_none`) (REQ-6266). Closed by: a unit test over a fixture canon.
4. Given the Master's interlude reply fails twice, when the scene is due, then a library interlude plays (`interlude_fallback`); given the library holds none, then the plan goes on without the interlude and the owner gets one report and a red simulation check (`interlude_missing`). Closed by: a test with a gateway stub and an empty library.
5. Given plans with and without the interlude, when the time plan is read, then the planned graded slots are equal and the interlude's 90 seconds sit inside the 10 minutes of story (REQ-6204). Closed by: a day-plan test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the order kind `interlude` to the day plan and a library of hand-written interludes dealt like the decks of TSK-0957. The cast is the canon's sections tagged `cast: recurring`. Choices I made: the build counts interludes and reports a finding, not a failure, while the library holds fewer than the 20 ADR-0330 requires, because the owner writes them and a failing build would stop every other change until then; and the position on a plan of 1 or 2 floors follows SPC-0330, which states ADR-0360 entry 87's rule that every adventure holds one whatever its length.

## Depends on

- TSK-0957 (not blocking): both deal cards without replacement from a seeded deck, and the interlude's library can use the deal function once it lands; until then this task deals from a plain shuffled list by the adventure seed.

The epic realising ADR-0090 supplies the day plan and the 10 minutes of story; the epic realising ADR-0110 supplies the order and library machinery. Until they exist the task runs on a fixture plan and three fixture interludes. The owner writes the 20 interludes, the `cast` tags and the cast member of Session 0's first scene; until then the part plays nothing and `interlude_missing` records it.

## Evidence

Not yet.

## Left alone

What the interlude says, which is the owner's content and the parent's judgement.
