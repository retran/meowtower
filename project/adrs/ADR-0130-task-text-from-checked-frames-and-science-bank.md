---
id: ADR-0130
artifact: adr
status: approved
revised: 2026-11-01
addresses: [REQ-3600, REQ-3624, REQ-3642, REQ-3646, REQ-3660, REQ-3650, REQ-3652, REQ-3654, REQ-3656, REQ-3658, REQ-1236, REQ-1238]
supersedes: []
issue: 33
projected: b309fdab92dd
tracked: 6fa05684d628
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0130. Model text reaches a task only as a placeholder frame, and a Diary puzzle only as approved bank text under ADR-0280 that passed the checks, from a library the parent accepted or a live top-up queue, and science questions come only from a bank the parent approves

## Decision

A model writes story frames and nothing else that enters a task's text. Every template takes a live story when its task is requested (ADR-3100, ADR-3200, ADR-3210). The code fills the template once, the author writes 1 story with its real numbers, `FRAME_JUDGE_MODEL` scores and solves it, and a task with no story shows its template text. If more than 30 % of the live frames checked on a game day are rejected, the server writes `live_frames_paused` and shows template text until the game day ends.

The science bank, `content/science.ru.json`, holds natural science questions an agent or a person drafts offline, each a choice from four, for the five topics E1 to E5. Each wrong option names the misconception it tests (REQ-1238), and the verify command (ADR-0190) fails when a topic holds fewer than 40 questions (REQ-1236). The science module in the server imports nothing from the model gateway, and the verify command's import rule fails the build if it does, so no code path can put a question generated during play in front of her (REQ-3660). The owner decided on 2026-09-27 that an agent may draft the bank's questions, each approved by the parent before use; a drafted question enters the bank file like any other and waits for its `science_approved` event. Each question has a content hash. The Parent Room's science review screen shows each question with its correct option and each wrong option beside its misconception, and the parent approves or rejects it. Approval writes a `science_approved` event with the hash, and the server serves a question only when the log holds an approval of its current hash, so editing a question sends it back for approval (REQ-3650).

When the Director gives a science slot a topic (ADR-0070), the question is the least recently shown approved question of that topic, never-shown first. The repeat window is 45 game days before stage 0.5 and 90 from stage 0.5 (REQ-3652, REQ-3654). The bank file declares `repeatWindowDays`, and the verify command fails when the value doesn't match the build's stage. When the topic has no question outside the window, the least recently shown one comes (REQ-3656), and its `item_shown` event carries `repeat: true` (REQ-3658).

Once this is accepted, every word problem and context task gets a frame the parent accepted, and the Observatory gets approved science questions, with no model call at play time. Live frames are an addition on top: with `LIVE_FRAMES` off, the adventure budget spent or OpenRouter unreachable, every task still gets a library frame, so removing the increment leaves play working. What doesn't work yet: frames and questions in English and Dutch, which need `frames.nl.json` and a Dutch bank (RES-2550); the review screens, which wait for ADR-0180's Parent Room; and the first science questions, which wait for 200 of them to be drafted and approved.

## Why

RES-0720 records most of this design from the owner's draft. It asks for one set of checks for every model text and placeholder frames only. It sets a library reviewed by the parent, with 5 frames a structure by stage 0.2 and 20 to 30 by stage 0.4, and no repeat within 14 days. It keeps live frames for topping up to a block, from a queue 2 to 3 rooms ahead, and gives the seven-step pipeline, the 30% threshold and `llm_log`. It keeps science in a hand-made bank, because a blind solve checks arithmetic and can't catch a factual error. RES-1600 and RES-0720 put the safety step on Jev on the placeholder text and keep the blind solves off Jev, because Jev picks from a list and a list would show the checker the answer. RES-0720 and RES-1600 name the models: `anthropic/claude-opus-5.5` for `GEN_MODEL`, `openai/gpt-5.5` for `CHECK_MODEL`, `anthropic/claude-sonnet-5` for `LIVE_GEN_MODEL` and `google/gemini-3.8-flash` for `LIVE_CHECK_MODEL`.

Where the research left a point open, I chose, and each choice has its reason:

- Acceptance and approval live in the log as events holding a hash, because RES-0720 doesn't say how the adult's approval is recorded, and an event can be checked by code at load while a line in a file can be written by anyone who edits the file.
- The least recently shown frame, never-shown first, because that one rule satisfies REQ-3610 and REQ-3612 together, and a random pick would need a second rule for the repeat case.
- The live queue expires at the game day's end, because a frame is written for a floor and its characters, and tomorrow's rooms may differ.
- An agent may draft the science bank offline, because the owner decided so on 2026-09-27 (REQ-3660); the parent's approval of each question's hash stays the guard, because no automatic check tests a fact.
- The candidates file sits in `data/`, outside the repository, because an unreviewed frame isn't the project's content and would put rejected text in a public history.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: each template carries a few fixed sentences of its own, and no model writes task text | No model risk, no cost, no review queue, and the same text every time, which suits measurement | With daily play the same few stories come back every day, which RES-0720's targets of 20 to 30 frames a structure exist to prevent |
| A person writes the whole library, with no model | No model output ever reaches her, and nothing to blind-solve | 140 to 210 frames by stage 0.4 for the seven structures RES-0700 lists is many hours of writing, and the research chose model drafts under the parent's review for exactly that cost |
| Live frames for every word problem, automatic checks only, no library | Endless variety and no review queue for the parent | Probes and the Guardian ladder need stable, reviewed text (REQ-3604); every task would wait on a live call and pay for it; a day over the 30% threshold would leave no frames at all |
| Model-written science questions, checked by a second model | Hundreds of questions without writing them | A second model checks that a question agrees with itself and can't confirm a fact, so RES-0720 excludes generated science for that reason, and REQ-3660 keeps the parent's approval in front of every drafted question |

## What it costs

Money: the offline library costs a few dollars (RES-2700). Live frames and their blind solves cost about $0.05 to $0.15 an adventure inside the $5 adventure budget (RES-2700, REQ-2702). These are research estimates, and ADR-0100's budgets are limits imposed on this decision.

The parent's time is the largest cost. By stage 0.2 the parent accepts at least 35 frames, 5 for each of the seven structures, and by stage 0.4 at least 140; I estimate about a minute a frame, so about two and a half hours in all, spread over the stages. `frames:generate` fills a structure's candidates only up to one and a half times its shortfall against the stage's target, with at least 5, so the queue never holds more than the parent needs to reach the target. Science costs more: about 200 questions before stage 0.5 and 400 from it (RES-0720), each with three misconceptions, for an agent to draft and the parent to approve. At my estimate of 2 minutes a question to read and approve, the first bank is about 7 hours of the parent's time.

If nobody opens the review screens for a month, play goes on: tasks use the frames already accepted, repeats show in the log, and unapproved science questions stay unserved. Candidates older than 60 days expire from the candidates file, because a candidate can be generated again for a few cents, and the log records the expiry. The design sends no notification; the review screens show their counts when the parent opens the Parent Room. Its interruption budget is zero.

Accumulation: the candidates file is capped per structure as above. The `frames` table keeps every live frame by requirement, so it has no drain. At about 5 variants for each of the 2 to 3 top-up slots a room, it grows by tens of rows a day, and it reports once to the owner when it passes 50,000 rows, a ceiling I chose, a few years of play at that rate; the ceiling stands in the Baselines table of ADR-0190.

The strongest objection: the guarantee "the parent accepted every frame" rests on a person reading hundreds of frames and questions, and a queue that long tends to end approved unread. The acceptance event may then certify a click, and the automatic checks carry the whole weight. For science no automatic check tests facts, so a question approved unread has no defence at all.

## What would reverse it

- If `live_frames_paused` fires on more than 3 game days in any 14, live frames cost more than the variety they add, and live generation goes off by default.
- If the median time between a candidate entering the queue and the parent's decision passes 30 days at stage 0.4, the parent isn't reviewing, and the owner decides between a smaller target and a reviewer other than the parent.
- If the parent accepts more than 95% of 100 candidates in a row, each in under 10 seconds by the review screen's timing, acceptance has become a click. The review then changes to sampling, where the parent reads 1 in 5 and the rest are accepted on the automatic checks, which needs a new record replacing REQ-3638 first.

## Consequences

- ADR-0040 must give each word-problem and context template its structure id, placeholder roles, sample seeds for the three number sets and a generator that fills a frame, and its readability measures are step 3's.
- ADR-0070 must place block top-up slots and science topics early enough for the live queue to fill 2 to 3 rooms ahead, and must pick another structure or topic when one has no frame or approved question.
- ADR-0100 carries every call: `GEN_MODEL`, `CHECK_MODEL` and `LIVE_GEN_MODEL` on the content tier, `LIVE_CHECK_MODEL` on the player tier, Jev with `SAFETY_MODEL` as fallback, the adventure budget, the offline key and `llm_log`.
- ADR-0120's check module gains the frame steps: placeholders exactly once, the readability measures and three blind solves.
- ADR-0180's Parent Room gets the frame review screen, the live frame list with «В библиотеку», and the science review screen.
- ADR-0190's verify command gains four checks: at least 5 accepted frames a structure from stage 0.2 and 20 from stage 0.4 in `content/frames.ru.json` (REQ-3606, REQ-3608); every frame in it passing step 3; 40 questions a topic in the science bank; and the import rule for the science module.
- ADR-0020's log gains `frame_accepted`, `frame_removed`, `live_frames_paused` and `science_approved`, and `item_shown` gains the frame and repeat fields.

The failure states, each with its next step and its one audience:

| State | Next step | Audience |
| --- | --- | --- |
| `frame_rejected` (with the failing step) | the variant is dropped; live, it counts towards the day's share | the owner, as a daily count by step in the status report |
| `frame_final_failed` | the task takes a library frame | the owner, in the status report |
| `live_frames_paused` | library frames until the game day ends | the owner, in the status report |
| `live_queue_empty` | the task takes a library frame | the owner, in the status report |
| `frame_repeat` | the frame shown longest ago is used and marked | the owner, as a count by structure, which says where the library is thin |
| `frame_none_for_structure` | the Director takes another structure | the owner, as a verify failure |
| `frame_unaccepted` | the server skips a frame in the file with no acceptance | the owner, reported once at start |
| `frame_edit_failed` | the edit stays a candidate with its failures in words | the parent, on the review screen |
| `frame_candidates_full` | `frames:generate` stops adding to that structure | the owner, reported once a run |
| `science_unapproved` | the question isn't served | the parent, as a count on the science review screen |
| `science_repeat` | the question shown longest ago is used and marked | the parent, on the science review screen, since the bank needs more questions |
| `science_topic_empty` | the Director takes another topic | the parent, on the science review screen |

The player sees none of these states. The first five are deliberately indistinguishable to her, because every one ends in a library frame and a normal task.

The security boundary protects five things, most likely damage first:

1. The player from an unsolvable or misleading problem, defended by the engine's numbers, the numeral check and the blind solves.
2. The player from a wrong fact in science, defended by the parent approving each question, and by no automatic check.
3. The player from unsafe or shaming words, defended by the forbidden list and the safety check.
4. The player from a story that fails its checks, defended by ADR-3210's judge.
5. Her data, which frames never carry, because a frame request holds no name or text of hers.

Premortem, written as though it already happened: at stage 0.4 the verify command failed REQ-3608, because three structures held 9, 11 and 12 accepted frames. The parent had reviewed 40 candidates in the first week and none after, the game had shown the same motion frames every fourth day with `frame_repeat` in the log, and nobody read the count. Separately, a science question on the phases of the moon was approved with a wrong option marked correct, and for a month the science screen told the parent that the player held a misconception she didn't. The first shows in the reversal condition on review time; the second has no automatic defence, which is the strongest objection above.

## How I will know it was realised

8. The verify command fails a build whose science module imports the gateway, whose bank holds 39 questions in a topic, or whose `repeatWindowDays` doesn't match the stage.
9. A test edits an approved science question, and it isn't served until a new `science_approved` event holds its new hash.
10. A simulation of 90 game days of science before stage 0.5 never repeats a question within 45 game days while its topic has a fresh one, and marks each repeat.

## What this does not settle

- The readability thresholds, the item dictionary and the word-problem structures (REQ-0701, REQ-0782, REQ-0796, REQ-0798). ADR-0040 settles these, and step 3 runs them.
- The share of live frames discarded that the development gate allows (REQ-2932). ADR-0190 settles it.
- The adventure budget and its fallback (REQ-2702, REQ-2714), the tiers and the log's fields. ADR-0100 settles these.
- The Master's own text and its safety pipeline. ADR-0110 settles these, and REQ-3600 holds for its text through the same `CheckedText` gate.
- Which science topics E1 to E5 are and their place outside the skill graph (REQ-0802, ADR-0050), and how the report counts only the first answer to a repeated question (REQ-2362, ADR-0180).
- Frames and questions in English and Dutch.

Amended by ADR-0280 and ADR-0350, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0370, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-0410 and ADR-0430, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0460, approved on 2026-09-29, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended on 2026-10-10: this record no longer addresses 1 requirement that was superseded, because a decision cannot realise a requirement that is no longer in force: REQ-3610 (superseded by REQ-6928, which ADR-0410 addresses).

Amended by ADR-3100, approved on 2026-10-31, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds. This record no longer addresses REQ-3604, REQ-3606, REQ-3608, REQ-3612, REQ-3614, REQ-3616, REQ-3620, REQ-3636, REQ-3638, REQ-3644, which are superseded.

Amended by ADR-3200, approved on 2026-10-31, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-3210, approved on 2026-10-31, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.

Amended by ADR-3210, approved on 2026-10-31: this record no longer addresses REQ-3630, REQ-3632, which are superseded.

Amended on 2026-10-31: this record no longer addresses REQ-3626, which REQ-7790 superseded.

Amended on 2026-10-31: this record no longer addresses REQ-3628, which REQ-7820 superseded.

Amended on 2026-10-31: this record no longer addresses REQ-3602, which REQ-7860 superseded.

Amended on 2026-10-31: this record no longer addresses REQ-3618, which REQ-7900 superseded.

Amended on 2026-10-31: this record no longer addresses REQ-3622, which REQ-7940 superseded.

## Plan

The upgrade folded these open tasks in (ADR-3090). Read each one before its step.
1. A frame is placeholder text with a record, and code fills it with the engine's numbers (`archive/tasks/TSK-0628-frame-record-and-code-filled-placeholders.md`)
2. The author request carries the problem's structure and asks for five variants, and a reply outside the schema is discarded whole (`archive/tasks/TSK-0629-author-request-with-structure-and-five-variants.md`)
3. Code rejects a frame whose placeholders are wrong or that holds a number of its own (`archive/tasks/TSK-0630-code-checks-reject-a-frame-with-wrong-placeholders-or-numbers.md`)
4. Model text reaches the player only as `CheckedText`, and the safety question also asks whether the frame holds a joke (`archive/tasks/TSK-0631-safety-check-on-unfilled-text-and-no-joke-in-a-task.md`)
5. A frame passes only when a checking model, solving blind, gets the engine's answer on three sets of numbers (`archive/tasks/TSK-0632-three-blind-solves-must-match-the-engine.md`)
6. `npm run frames:generate` runs the pipeline offline and writes the passing variants to a candidates file (`archive/tasks/TSK-0633-frames-generate-fills-the-candidates-file.md`)
7. The parent accepts, rejects or edits each frame candidate in the Parent Room (`archive/tasks/TSK-0634-parent-accepts-rejects-or-edits-a-frame-candidate.md`)
8. The frame library is the set of frames the log accepted, and the build counts them for each structure (`archive/tasks/TSK-0635-library-is-the-set-of-frames-the-log-accepted.md`)
9. A task takes the least recently shown library frame, and only a top-up slot may take a live one (`archive/tasks/TSK-0636-library-frame-picker-and-live-frames-on-top-up-slots-only.md`)
10. The live queue keeps checked frames two to three rooms ahead and keeps every live frame with its status (`archive/tasks/TSK-0637-live-queue-keeps-checked-frames-two-to-three-rooms-ahead.md`)
11. A live frame passes one more blind solve with the task's own numbers before the player sees it (`archive/tasks/TSK-0638-live-frame-gets-one-more-blind-solve-with-the-tasks-numbers.md`)
12. Live generation stops for the rest of the game day when more than 30 % of checked live frames fail (`archive/tasks/TSK-0639-live-generation-pauses-when-too-many-live-frames-fail.md`)
13. One action moves a live frame into the library (`archive/tasks/TSK-0640-parent-moves-a-live-frame-into-the-library.md`)
14. The science bank is a hand-checked file, each wrong option names its misconception, and no code path writes a question during play (`archive/tasks/TSK-0641-science-bank-file-and-a-module-with-no-model-import.md`)
15. A science question is served only when the log holds the parent's approval of its current hash (`archive/tasks/TSK-0642-science-question-served-only-with-an-approval-of-its-hash.md`)
16. A science question repeats only outside a 45 or 90 day window, and every repeat is marked (`archive/tasks/TSK-0643-science-question-repeat-windows-and-repeat-marks.md`)

