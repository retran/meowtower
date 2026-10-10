---
id: TSK-0601
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1808, REQ-1816, REQ-1822, REQ-1824, REQ-1826, REQ-1832, REQ-1834, REQ-1836]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Hand-written triggers read her text on the Mac first, a serious signal pauses the game and no model lowers the level they found

After this task, the triggers in `content/safety.ru.json` run on her raw text before any model reads it, a serious trigger pauses the game with the fixed line and writes a notice for the parent, a direct question whether the narrator is a human or an AI gets the fixed System line, and the final level is the higher of the trigger's and the judge's.

## Acceptance criteria

1. Given the fixed trigger phrases and the labelled serious lines, when each goes through the text path, then each pauses the game with «Это звучит серьёзно. Об этом лучше рассказать маме или папе — они помогут» and a «Вернуться в историю» button, writes one `safety_event`, and none of its text reaches a mocked model (REQ-1822, REQ-1824, REQ-1834). Closed by: an integration test with a gateway stub that records its requests.
2. Given a `safety_event`, when the parent opens the Parent Room, then a notice stands at the top until the parent opens it (REQ-1826). Closed by: a Playwright test on the Parent Room's stand-in page.
3. Given a direct «ты человек?» or «ты ИИ?», when it is sent, then the fixed System line of REQ-1808 shows and no model is called (REQ-1808). Closed by: an integration test with the same stub.
4. Given the judge answering a lower level than the triggers found, when the final level is computed, then the trigger's level holds; given a judge probability for serious at or above the stage 0 threshold, then the level is serious (REQ-1832, REQ-1836). Closed by: a unit test with each case.
5. Given the triggers, when a content test runs them over the canon, the pool and 200 ordinary story phrases, then none fires, and a fixture phrase «секрет» in the canon makes the test fail. Closed by: the content test and its fixture.
6. Given the trigger lists and fixed lines, when the owner reads them, then the owner judges that a person wrote each (REQ-1816). Closed by: the owner's judgement, because authorship can't be read from a file.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the trigger runner, the serious path, the narrator trigger and the final-level rule. When neither the judge nor `SAFETY_MODEL` answers, the trigger's level stands and her text doesn't go to the Master; the scene goes on from the pool, marked unchecked in the book, which ADR-0110 chose over a pause because a network fault isn't doubt about her. The judge's `signal` gains `scared` as ADR-0370 amends it.

## Depends on

- TSK-0597 (blocking): the judge's signal runs beside the order that task defines.

The epic realising ADR-0100 supplies the judge route and its fall back; the epic realising ADR-0180 draws the notice in the Parent Room.

## Evidence

Not yet.

## Left alone

The web push after the MVP, REQ-1828 and REQ-1830, which stay under Not covered in the epic.
