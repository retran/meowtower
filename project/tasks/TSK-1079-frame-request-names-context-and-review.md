---
id: TSK-1079
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6906, REQ-6908]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A frame request names the least used context, and the review screen lets the parent change it or park the frame

After this task, `npm run frames:generate` asks for the listed context with the fewest accepted frames of a structure, and the frame review screen shows each candidate's context and lets the parent keep it, change it or park the frame as fitting no context.

## Acceptance criteria

1. Given a structure whose accepted frames hold 3 in context `a` and 1 in context `b`, and templates that list both, when `frames:generate` builds the request, then the request names `b`; given a tie, then it names the context first in list order (REQ-6908). Closed by: a unit test over fixture libraries.
2. Given a candidate, when the review screen shows it, then the context appears by its Russian label from `parent.contexts.<id>`, and the parent can keep it or change it to another listed context before accepting (REQ-6906). Closed by: a Playwright test on the review screen.
3. Given a candidate the parent marks «нет подходящего сюжета» (no fitting setting), when the screen saves, then the candidate stays unaccepted with `frame_context_missing`, the screen shows the count of such candidates and offers the candidate again once a list version holds a new context (REQ-6906). Closed by: a Playwright test that adds a context to a fixture list and reloads.
4. Given a parked candidate nobody touches, when 60 days pass, then ADR-0130's expiry removes it like any other candidate and the candidate cap is not exceeded (REQ-6906). Closed by: a test with a fixed clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the context to the structural specification of ADR-0130's step 1, chosen as the listed context with the fewest accepted frames of the structure among those the structure's templates list. Add the context line, the change control and the «нет подходящего сюжета» button to the review screen, with every string in `ru.json`. The parent judges the fit, because the parent already accepts every library frame. A parked candidate counts towards ADR-0130's per-structure candidate cap and drains by its 60-day expiry.

## Depends on

- TSK-1078 (blocking): acceptance writes the context the screen shows.

The epic realising ADR-0130 supplies the review screen, the request and the candidate expiry; this task changes them.

## Evidence

Not yet.

## Left alone

The picker's use of a frame's context, which TSK-1080 sets, and the parent's one reading of the first list, which is a judgement at the stage acceptance.
