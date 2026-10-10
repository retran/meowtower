---
id: TSK-0771
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5088]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The fact stage offers one set of fact tasks a game day on the stage 0.1 templates, with no model call

After this task, a build at stage 0.15 offers the player one set of fact tasks a game day with the hint ladder, a bare interface in Russian, rungs as the template's plain text and no model call, and she can play it as soon as a person accepts the stage.

## Acceptance criteria

1. Given a first set finished on a game day, when a second set is asked for the same game day, then the server sends none; given the next game day, then it sends a first set (REQ-5088). Closed by: a fact-stage integration test over two game days.
2. Given a day of fact-stage play, when the gateway's request log and the egress log are read, then they hold no model call and nothing left the Mac (REQ-5088). Closed by: the same test, reading both logs.
3. Given every screen of the stage, when the screen check of ADR-0090 runs, then it passes with no clock, countdown or minute count, and every event the stage logs counts in the "on her own" estimate like any stage 0.1 attempt (REQ-5088). Closed by: the screen check's output and a model test.
4. Given a person playing one set on the iPad, when the stage 0.1 checklist is run and verify groups 1 to 5 and 9 are green, then the person accepts the stage so she can play it before stage 0.3 (REQ-5088). Closed by: the person's judgement at the stage's acceptance, because only a person can say that a bare drill is ready to put in front of a child.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the stage's gate to the stage table of ADR-0190 as 0.15: the facts of item 8 and the hint ladder of item 1 on the stage 0.1 templates, with the bare interface in Russian. The set is one a game day, as the adventure is. ADR-0290 sizes the set from her pace so that it ends before 15 minutes of active time; I chose 15 minutes in ADR-0210 because the stage has no eye exercise yet and 15 stays below ADR-0090's 20-minute eye interval with slack. This task serves a fixed set of fact tasks from fixture templates with the size as a setting.

Refuse a second set on the same game day by the game-day index of TSK-0756.

## Depends on

- TSK-0756 (blocking): the game-day index that limits the set.

The epic realising ADR-0290 supplies the facts, the set's size and its pace rule, and the epic realising ADR-0220 the hint ladder; this task runs on fixture fact templates and a fixed ladder, and leaves their content to those epics. The fact stage's own epic is the one ADR-0210 asks to pass `paw ready` after stage 0.1's acceptance and before stage 0.2's; it is written by the epic step that follows ADR-0290.

## Evidence

Not yet.

Criterion 4 rests on judgement: the acceptance is a person playing one set on the iPad.

## Left alone

The facts' content, the volley and the Parent Room's dates, which ADR-0290 owns, and every model feature, which the stage doesn't use.
