---
id: TSK-0631
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3600, REQ-1546]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Model text reaches the player only as `CheckedText`, and the safety question also asks whether the frame holds a joke

After this task, a frame passes a safety check on its unfilled text before it is a candidate, the check asks whether the text holds a joke, and the server's player-facing messages accept only text that passed.

## Acceptance criteria

1. Given a frame, when step 4 runs, then the question goes to the judge model with the placeholders unfilled and asks yes or no for safety and for a joke, and a "no" to either rejects the frame with the rule `safety` or `joke` (REQ-3600, REQ-1546). Closed by: a unit test with a recording stub model.
2. Given the judge errs or times out, when step 4 runs, then the same question goes to `SAFETY_MODEL` and its answer decides, and given both fail, then the frame is rejected as `safety_unavailable` and is never accepted (REQ-3600). Closed by: a unit test with a stub that errs and one that times out.
3. Given a server message for the player that carries model text, when it is built from a plain string, then `npx tsc --noEmit` fails, and when it is built from a `CheckedText`, then it compiles (REQ-3600). Closed by: a type test with one failing and one passing fixture.
4. Given the fixed text of every task template, when the parent reads it at stage acceptance, then it holds no joke (REQ-1546). Closed by: the parent's judgement, because whether a sentence is a joke is a matter of taste that no check settles, and the person who judges is the parent.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the safety step to the check module that ADR-0120 defines, in `src/server/check/`, and export `CheckedText`, the only model text type that a player-facing message accepts. The module name and the type belong to the epic realising ADR-0120; where that epic hasn't landed, create the module with the type and the frame step only, and that epic adds its explanation steps beside it. The judge is the model the epic realising ADR-0350 routes the check to, with `JUDGE_MODEL` as the default until then. The prompt is yes or no, never a list of choices.

## Depends on

- TSK-0628 (blocking): the check reads the frame record.

The epic realising ADR-0100 supplies the gateway and the judge tiers. Until it lands, the step takes a model function as an argument and tests pass a stub.

## Evidence

Not yet.

## Left alone

The Master's text, which the epic realising ADR-0110 puts through the same type, and explanations, which the epic realising ADR-0120 puts through it. The parent's judgement of each frame at acceptance for a joke is a part of TSK-0634's review.
