---
id: EPC-0130
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0130
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Model text reaches a task only as a checked placeholder frame the parent accepted, and science questions come only from an approved bank

Realises exactly ADR-0130: the frame record and its code-filled placeholders, the author request and its reply schema, the code checks, the safety check, the three blind solves, the offline generation into a candidates file, the parent's review, the library the log defines, the frame picker, the live queue with its final solve, its pause and its move into the library, and the science bank with its approval and its repeat windows.

Until the epics realising ADR-0040, ADR-0070, ADR-0100, ADR-0120 and ADR-0160 exist, the tasks run on stand-ins: fixture templates and a fixture item dictionary, a slot kind passed as an argument, a stub gateway that records every call, a stand-in numeral list and a stand-in forbidden-word function. Each task names what it leaves to those epics.

## Acceptance criteria

1. A test gives the checks a frame with `{a}` missing, one with `{a}` twice, one holding «дюжина», one holding a digit, and a reply outside the schema, and each is rejected with its step, the reply as a whole. Evidence: the unit tests' reports, from TSK-0629 and TSK-0630.
2. A test replaces the checking model with one that returns the engine's answer for two sets and a different answer for the third, and the frame is rejected; a recording of every blind-solve request finds no answer and no list of options. Evidence: the unit test's report, from TSK-0632.
3. A test puts a frame in `content/frames.ru.json` with no `frame_accepted` event, and no task shows it. Evidence: the integration test's report, from TSK-0635.
4. A simulation of 60 game days on a structure with 5 frames never shows a frame within 14 game days while an unshown one exists, marks every repeat in `item_shown` and picks the frame shown longest ago each time. Evidence: the simulation's report, from TSK-0636.
5. A simulation with `LIVE_FRAMES` on shows live frames only on block top-up tasks, never on a probe, a Guardian ladder step or a warm-up, and every live frame shown has a passing final solve in `llm_log`. Evidence: the simulations' reports, from TSK-0636 and TSK-0638.
6. A test rejects 4 of the first 10 live frames of a game day, and the server writes `live_frames_paused` and takes library frames until 04:00. Evidence: the integration test's report, from TSK-0639.
7. After a simulated day, every live frame the server asked for is in `frames` with a status, and «В библиотеку» on one adds a `frame_accepted` event and serves it from the library. Evidence: the integration tests' reports, from TSK-0637 and TSK-0640.
8. The verify command fails a build whose science module imports the gateway, whose bank holds 39 questions in a topic, or whose `repeatWindowDays` doesn't match the stage. Evidence: the import rule's, the bank check's and the window check's test reports, from TSK-0641 and TSK-0643.
9. A test edits an approved science question, and it isn't served until a new `science_approved` event holds its new hash. Evidence: the integration test's report, from TSK-0642.
10. A simulation of 90 game days of science before stage 0.5 never repeats a question within 45 game days while its topic has a fresh one, and marks each repeat. Evidence: the simulation's report, from TSK-0643.
11. At stage 0.2 acceptance, the count of accepted frames per structure is at least 5, and the parent reads 20 accepted frames and confirms each reads as a problem the player can solve. Evidence: the library check's report and the parent's judgement, from TSK-0635.
12. Every requirement ADR-0130 addresses lands in a closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the number of blind-solve mismatches per 100 offline variants, which TSK-0633's run summary reports by step, and the days between a candidate's entry and the parent's decision, which the decision events of TSK-0634 carry in `candidateSince`. ADR-0130 reverses its live frames when `live_frames_paused` fires on more than 3 game days in 14, and TSK-0639's status line is where that shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0628 A frame is placeholder text with a record, and code fills it with the engine's numbers
      closes: REQ-3602
      depends: none
- [ ] T-002 [P] TSK-0629 The author request carries the problem's structure and asks for five variants, and a reply outside the schema is discarded whole
      closes: REQ-3620, REQ-3622, REQ-3624
      depends: TSK-0628 - the roles of the number placeholders come from the frame record.
- [ ] T-003 [P] TSK-0630 Code rejects a frame whose placeholders are wrong or that holds a number of its own
      closes: REQ-3626, REQ-3628
      depends: TSK-0628 - the check reads the frame record.
- [ ] T-004 [P] TSK-0631 Model text reaches the player only as `CheckedText`, and the safety question also asks whether the frame holds a joke
      closes: REQ-3600, REQ-1546
      depends: TSK-0628 - the check reads the frame record.
- [ ] T-005 [P] TSK-0632 A frame passes only when a checking model, solving blind, gets the engine's answer on three sets of numbers
      closes: REQ-3630, REQ-3634
      depends: TSK-0628 - the three problems are filled with `fillFrame`.
- [ ] T-006 TSK-0633 `npm run frames:generate` runs the pipeline offline and writes the passing variants to a candidates file
      closes: REQ-3646
      depends: TSK-0629 - the request and the parser.; TSK-0630 - step 3.; TSK-0631 - step 4.; TSK-0632 - step 5.
- [ ] T-007 TSK-0634 The parent accepts, rejects or edits each frame candidate in the Parent Room
      closes: REQ-3636
      depends: TSK-0633 - the candidates file and its record.
- [ ] T-008 TSK-0635 The frame library is the set of frames the log accepted, and the build counts them for each structure
      closes: REQ-3638, REQ-3606, REQ-3608
      depends: TSK-0634 - the acceptance event and its shape.
- [ ] T-009 [P] TSK-0636 A task takes the least recently shown library frame, and only a top-up slot may take a live one
      closes: REQ-3604, REQ-3612, REQ-3614, REQ-3616
      depends: TSK-0635 - the picker reads the library the log defines.
- [ ] T-010 [P] TSK-0637 The live queue keeps checked frames two to three rooms ahead and keeps every live frame with its status
      closes: REQ-3618, REQ-3642
      depends: TSK-0629 - the live request.; TSK-0630 - step 3.; TSK-0631 - step 4.; TSK-0632 - step 5.
- [ ] T-011 TSK-0638 A live frame passes one more blind solve with the task's own numbers before the player sees it
      closes: REQ-3632
      depends: TSK-0637 - the table and its statuses.; TSK-0636 - the fallback to a library frame.; TSK-0632 - the blind solve it reuses.
- [ ] T-012 [P] TSK-0639 Live generation stops for the rest of the game day when more than 30 % of checked live frames fail
      closes: REQ-3640
      depends: TSK-0637 - the table whose rows are counted.
- [ ] T-013 [P] TSK-0640 One action moves a live frame into the library
      closes: REQ-3644
      depends: TSK-0637 - the table and its statuses.; TSK-0635 - the library the moved frame joins.
- [ ] T-014 [P] TSK-0641 The science bank is a hand-checked file, each wrong option names its misconception, and no code path writes a question during play
      closes: REQ-1236, REQ-1238, REQ-3660
      depends: none
- [ ] T-015 TSK-0642 A science question is served only when the log holds the parent's approval of its current hash
      closes: REQ-3650
      depends: TSK-0641 - the bank file, its schema and its hash.
- [ ] T-016 TSK-0643 A science question repeats only outside a 45 or 90 day window, and every repeat is marked
      closes: REQ-3652, REQ-3654, REQ-3656, REQ-3658
      depends: TSK-0642 - the pick takes only approved questions.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0628 and TSK-0641.
- After TSK-0628: TSK-0629, TSK-0630, TSK-0631 and TSK-0632.
- After TSK-0629, TSK-0630, TSK-0631 and TSK-0632: TSK-0633 and TSK-0637.
- After TSK-0635: TSK-0636.
- After TSK-0637: TSK-0639, and TSK-0640 once TSK-0635 is done as well.
- After TSK-0636 and TSK-0637: TSK-0638.
- After TSK-0641: TSK-0642, then TSK-0643.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0628 | REQ-3602 |
| TSK-0629 | REQ-3620, REQ-3622, REQ-3624 |
| TSK-0630 | REQ-3626, REQ-3628 |
| TSK-0631 | REQ-3600, REQ-1546 |
| TSK-0632 | REQ-3630, REQ-3634 |
| TSK-0633 | REQ-3646 |
| TSK-0634 | REQ-3636 |
| TSK-0635 | REQ-3638, REQ-3606, REQ-3608 |
| TSK-0636 | REQ-3604, REQ-3612, REQ-3614, REQ-3616 |
| TSK-0637 | REQ-3618, REQ-3642 |
| TSK-0638 | REQ-3632 |
| TSK-0639 | REQ-3640 |
| TSK-0640 | REQ-3644 |
| TSK-0641 | REQ-1236, REQ-1238, REQ-3660 |
| TSK-0642 | REQ-3650 |
| TSK-0643 | REQ-3652, REQ-3654, REQ-3656, REQ-3658 |

The smallest set of tasks that would test the decision is TSK-0630, TSK-0632, TSK-0635 and TSK-0636. Together they show whether a frame with a stray number or a wrong placeholder is stopped, whether the engine's answer is what a blind solver reaches, whether only accepted frames are served, and whether stories rotate, which are the failures the decision's premortem names.

## Not covered

None of the 32 requirements is deferred. The epic leaves out what no program can bring about:

- The content itself: at least 35 accepted frames by stage 0.2, at least 140 by stage 0.4, and about 200 approved science questions before stage 0.5. The parent's and the agent's time produces them, and TSK-0635 and TSK-0641 check the counts.
- The context tag on a frame and the four-step picker of ADR-0410, which the epic realising ADR-0410 adds on top of TSK-0636's pick function.
- Frames and questions in English and Dutch, which need `frames.nl.json` and a Dutch bank.
- The review screens' place in the Parent Room's navigation, which the epic realising ADR-0180 owns; TSK-0634 and TSK-0642 add the pages to the shell that exists.
