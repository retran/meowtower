---
id: ADR-3210
artifact: adr
status: approved
revised: 2026-10-31
addresses: [REQ-7750, REQ-7760, REQ-7770, REQ-7780]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3210. A frame takes two model calls: the author writes variants, and Jev checks them all and chooses the best in one request

## Decision

Live frames use two roles. `TASK_TEXT_MODEL` writes 5 variants. `FRAME_JUDGE_MODEL`, `openrouter:typesafe/jev-1.14`, reads every variant that passed the code checks in one request, with the template's text beside them. For each variant it answers whether it is unsafe, holds a joke or changes the task. It then chooses the best. The blind solves, `LIVE_CHECK_MODEL` and `SAFETY_MODEL` leave the frame path. The owner decided this on 2026-10-31.

A variant passes when `unsafe` and `changed` are under 0.2 and `joke` under 0.5, figures I chose, so doubt counts as a no. The judge's choice stands when its variant passed; otherwise the likeliest variant that passed takes its place. A passing variant not chosen turns `unused`. When the judge errs, times out or answers outside the expected form, nothing is kept and the task shows its template text.

The judge runs in the content tier, because a frame holds no player material. It takes no test set first, by the owner's decision.

Once this is accepted, a frame costs 2 calls. Her own text isn't judged here: no code path sends it yet.

## Why

RES-4310 finds both question kinds fit one request on OpenRouter. The engine fixes numbers and answers, and code checks placeholders, so the owner judged three solves per variant redundant.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: blind solves and the safety model | Solving tests the task itself | Up to 21 calls a frame, which the owner judged redundant |
| Jev for safety with solves kept | The strongest check | The owner chose Jev alone |
| A direct TypeSafe route | No OpenRouter | OpenRouter already serves Jev and bills on one account |

## What it costs

Nothing now solves a framed task before the player does. A frame that changes the question and fools Jev reaches her and measures the wrong thing. TypeSafe says English is Jev's best language, and no test set shows how it reads Russian or Dutch. Probabilities also miss what a human would see, so the audit in the Parent Room is the only later check. OpenRouter's guide states no retention policy for Jev, which matters when her text reaches it, not for frames.

## What would reverse it

- The parent or a test finds a frame that asks something other than its task.
- The bake-off shows Jev below a reference model on frames.

## Consequences

- SPC-0100 and SPC-0130 state the two roles.
- `.env` drops `LIVE_CHECK_MODEL` and `SAFETY_MODEL` and gains `FRAME_JUDGE_MODEL`.

## How I will know it was realised

1. A test shows 2 calls for a frame, with every variant and the template in one judge request.
2. A test rejects doubt on each question, and keeps a passing variant when the choice fell on a rejected one.
3. A test leaves template text when the judge fails.

## What this does not settle

- Whether Jev takes any check of her own text.
- ADR-0350's route resolver and `JUDGE_CHECKS`.

## Amends

- ADR-0100: the role table loses nothing for later callers, and a frame's checks need no test set.
- ADR-0130: steps 4 and 5 become the one judge request.
- ADR-3100: a frame takes 2 calls; the three blind solves are gone.
- ADR-3200: the blind solve showing options is gone.

## Plan

1. The judge request and the choice (REQ-7750, REQ-7760, REQ-7770, REQ-7780; `src/server/frames/`, `src/server/gateway/routes.ts`, `content/frames/`).
