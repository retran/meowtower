---
id: ADR-3210
artifact: adr
status: approved
revised: 2026-10-31
addresses: [REQ-7950, REQ-7940, REQ-7930, REQ-7920, REQ-7910, REQ-7900, REQ-7890, REQ-7860, REQ-7750, REQ-7760, REQ-7780, REQ-7800, REQ-7810, REQ-7830, REQ-7840, REQ-7850, REQ-7870, REQ-7880]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3210. A second model scores each story and solves it blind, and the code decides by a weighted formula

## Decision

Live frames use two roles. `TASK_TEXT_MODEL` writes 1 story at low effort, because reasoning took 85% of each reply. `FRAME_JUDGE_MODEL`, Claude Haiku 5.5, solves it from the story alone and scores it in one request, and the engine checks its answer (REQ-7950). A story that fails the solve loses 1 from its score. The owner replaced Jev on 2026-10-31, because Jev passed a story with no solvable conditions. Below a score of 0.1, a low bar from 112 live scores, the author writes again, up to 3 times, and the highest score is shown. The blind solves, `LIVE_CHECK_MODEL` and `SAFETY_MODEL` leave the frame path. The owner decided this on 2026-10-31.

The judge answers eight yes-or-no questions, each with `criteria` that state what yes and no mean. The code scores a variant as 0.3 `fits` + 0.2 `flows` + 0.2 `clear` + 0.2 `sense` + 0.1 `alive` - `changed` - `numbers` - `unsafe`, with 0.15 off for a length fault. The highest score is shown, and a passing variant not chosen turns `unused`. The owner decided on 2026-10-31 that a task always shows its best variant, so quality rejects nothing. Two faults still remove a variant: `unsafe` at 0.7, which I kept because the text reaches a child, and a code fault that breaks the task or the forbidden list. The weights are my choice.

The review screen offers the second attempt ADR-0220 gives, after `alt` or after a first attempt on which she saw rung 2 or 3, and the client now calls the route that was already built. The Parent Room's creepiness level sets the author's tone and what the judge counts as safe, and the list of what never appears holds at every level. The level defaults to 2, by the owner's decision, and the task window follows it. The author and the judge get a task's answer options, so the story's question leads to its buttons.

A variant the judge doesn't answer isn't counted. When the judge fails on every variant, nothing is kept and the task shows its prepared setting (ADR-3270).

The code fills a template once and gives that task to the author on every attempt, and the story carries its real numbers, so placeholders stay with templates. Code checks only the forbidden list and the length. A second attempt by the player is a task of its own, and its text is written when it is requested. It continues the first story and takes the failure into account, as an event of the world, with no reproach. The player's gender, a Parent Room setting that defaults to female, goes to the author too (REQ-7880). The request shows that one fact on the content tier, and no answer, name or time, by the owner's decision (REQ-7870). The gateway logs each call its budget refuses, because live runs stopped with no row to say why.

The game writes a story only when its task is requested, and nothing is prepared ahead. A task waits up to 90 seconds for its story behind a loading animation, then shows its prepared setting (ADR-3270), because a live run showed template text before the frame was ready.

The task screen has no heading, and the answer field reads «Ответ», because beside a story «Приключение» and «Твоё заклинание» only confuse the player.

The title becomes «Туманный Брод», Misty Ford and Nevelwade, the question ADR-0200 left open; every technical name stays Meowtower.

For now the registry's tasks have no end: the game shows no story scene, chest or ending between them, and walks the ladder again with other seeds, because the owner wants to test the tasks alone.

The judge runs in the player tier once ADR-3240 moves the author there, because a frame then carries story material, and in the content tier until then. It takes no test set first, by the owner's decision.

Once this is accepted, a frame costs up to 4 calls, or more when a round has no variant that passes the code checks. Her own text isn't judged here: no code path sends it yet.

## Why

RES-4310 finds that a score alone passed a story with no solvable conditions, so a solve the engine checks has to stand beside it. The engine fixes numbers and answers, and a fixed bar on quality rejected stories on scores that hardly differed, so quality only decides when to write again. Reasoning took 85 to 90% of each reply at high effort, and a player waits for every story, so effort stays low and the author writes one story.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: three separate blind solves and a safety model | The strongest check | Up to 21 calls a story, which the owner judged redundant |
| Jev as the judge | Half a second a story, very cheap | It passed a story that could not be solved |
| Five variants with the best chosen | More to choose from | A player waits for every story, and three in five told nothing new |

## What it costs

One model solves a story while the original task sits beside it, so the solve isn't fully blind. A story that changes the question and fools it reaches the player and measures the wrong thing, and nothing yet shows how far stories move what a task measures. Probabilities also miss what a human would see, so the audit in the Parent Room is the only later check. OpenRouter's guide states no retention policy for Jev, which matters when her text reaches it, not for frames.

## What would reverse it

- The parent or a test finds a frame that asks something other than its task.
- A comparison with template text shows stories moving the share of right answers on the same skills.

## Consequences

- SPC-0100 and SPC-0130 state the two roles.
- `.env` gains `FRAME_JUDGE_MODEL`, and `LIVE_CHECK_MODEL` and `SAFETY_MODEL` stay unset until a caller outside the frame path exists and gains `FRAME_JUDGE_MODEL`.

## How I will know it was realised

1. A test shows one judge request per variant, and the highest score shown.
2. A test shows the best of a weak round, and removes only a plainly unsafe variant.
3. A test shows the prepared setting when the judge fails.

## What this does not settle

- Which model reads her own text.
- ADR-0350's route resolver and `JUDGE_CHECKS`.

## Amends

- The canon: the System is gone and the Tower being alive is a marked secret, by the owner's decision of 2026-10-31. Requirements and specifications that still name the System stay until a later record, because no code uses it yet.

- ADR-0100: the role table loses nothing for later callers, and a frame's checks need no test set.
- ADR-0110: the task window follows the creepiness level, which defaults to 2.
- SPC-0100: a second attempt's story may show on the content tier that the first attempt failed.
- ADR-0130: steps 4 and 5 become the one judge request.
- ADR-3100: the three blind solves are gone.
- ADR-3200: the blind solve showing options is gone.

## Plan

1. The judge request and the choice (REQ-7750, REQ-7760, REQ-7770, REQ-7780; `src/server/frames/`, `src/server/gateway/routes.ts`, `content/frames/`).
