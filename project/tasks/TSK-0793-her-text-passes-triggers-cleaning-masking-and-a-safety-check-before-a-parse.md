---
id: TSK-0793
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5200, REQ-5212, REQ-5220, REQ-5222]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Her composed text passes the local triggers, the cleaning, the masking and the judge's safety check before any parse request leaves the Mac

After this task, a text riddle's text runs five steps in order before a parse request is made: the local triggers on the raw text, the egress guard's cleaning of the parent's names, the masker, the judge's safety check on the cleaned and masked text, and a `ParseRequest` that holds the fixed prompt and the masked text and nothing else.

## Acceptance criteria

1. Given a text that trips a serious trigger, when it is submitted, then the riddle takes ADR-0110's serious path with the fixed line, the pause and the notice, ends with an empty verdict, and nothing is sent (REQ-5220, REQ-5222). Closed by: an integration test with a fixture text.
2. Given a text with a name the parent set and a number word, when it reaches the judge, then the judge's request holds the cleaned text with every number masked, and no story memory, outcome events, times, estimates, other answers or other maths result (REQ-5212). Closed by: a gateway test that reads the judge's request.
3. Given a judge result that is serious, when it arrives, then the riddle takes the serious path as in step 1; given neither judge model answering, then nothing is sent to the parser and the riddle ends as `unparsed` with the cause `safety_unchecked` (REQ-5220, REQ-5222). Closed by: two integration tests.
4. Given a text that passes every step, when the request is built, then it holds the fixed parse prompt and the masked text and no target expression, node id, topic name, problem type, verdict or other answer (REQ-5200). Closed by: a gateway test with a request body check.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the pipeline between the compose flow's `compose_checking` state and the parse call. The judge's safety check reads the cleaned and masked text through ADR-0100's judge route, `JUDGE_MODEL` and then `SAFETY_MODEL`, charged to the adventure bucket like every judge call. `JudgeRequest` "with one cleaned text" then means, for a composed riddle, its masked text.

The riddle's field is the story's free-text field, so every guarantee of the story field holds. The Master can't read a composed riddle, which TSK-0800 checks.

## Depends on

- TSK-0792 (blocking): the masker.

The epics realising ADR-0100, ADR-0110 and ADR-0210 supply the judge route, the local triggers and the `ParseRequest` class; this task runs on stand-ins for the three and leaves their behaviour to them.

## Evidence

Not yet.

## Left alone

The parse call itself and its reply, which TSK-0794 and TSK-0795 hold, and the serious path's wording, which ADR-0110 owns.
