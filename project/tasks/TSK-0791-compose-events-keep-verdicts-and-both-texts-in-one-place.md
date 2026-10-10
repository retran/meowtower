---
id: TSK-0791
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5232, REQ-5240, REQ-5242]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The five compose events record verdicts and both texts only in their own fields, and mark a corrected riddle

After this task, the log accepts `compose_shown`, `compose_submitted`, `compose_parsed`, `compose_confirmed` and `compose_labelled` with the payloads of ADR-0230, a corrected riddle is marked and keeps both texts, `wrong_structure` on the target's operations with other numbers carries `wrongNumbers: true`, and the verdict field exists in no other attempt's event.

## Acceptance criteria

1. Given a corrected riddle, when its events are read, then `compose_confirmed` has `corrected: true` and the log holds both her first text and her corrected text in `compose_submitted` events of round 1 and round 2 (REQ-5240). Closed by: an integration test.
2. Given a `wrong_structure` from the target's operations on other numbers, when `compose_confirmed` is read, then it has `wrongNumbers: true`, and for any other `wrong_structure` it is false (REQ-5232). Closed by: an integration test with both riddles.
3. Given the registry, when it is searched for a `composeVerdict` field, then it is found only in `compose_confirmed` (with `parseOutcome` in `compose_parsed`) and never in `attempt_submitted` or `verdict`, so the addendum's `unparsed` never meets the checker's `unparsed` of ADR-0040 (REQ-5242). Closed by: a schema search test.
4. Given each of the five types, when a payload is appended, then it validates against the schema ADR-0230 lists and carries owner ADR-0230 (REQ-5242). Closed by: the schema tests and the owner check of the epic realising ADR-0210.
5. Given the Parent Room labels a logged riddle, when the label is read back, then it is a new `compose_labelled` event and the riddle's verdict is unchanged (REQ-5242). Closed by: a Parent Room test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Register the five types in `src/shared/events.ts` with the fields of ADR-0230: `compose_shown` with `riddleId`, `form`, `targetKind`, the target as rendered, template and version, seed, node, tier, `problemType` and for cards the card set with roles; `compose_submitted` with `riddleId`, `round`, her raw text or ordered card ids, the input summary, the masked text, the token mapping, the trigger and judge levels and `dontKnow`; `compose_parsed` with `parseOutcome`, the graph, the paraphrase as shown and the `llm_call` event id; `compose_confirmed` with `answer`, `corrected`, `composeVerdict`, `composeErrorClass`, `wrongNumbers` and `form`; and `compose_labelled` with the parent's verdict by `judgeCompose`'s rules. The verdict goes in a field no other attempt uses.

Keep the token mapping in `compose_submitted` and on the server, and add no field for it to any request class.

## Depends on

- TSK-0788 (blocking): the verdict and class names the payloads hold.

The epic realising ADR-0210 supplies the owner field and the one new version of the attempt events; these five types are new, so they carry version 1.

## Evidence

Not yet.

## Left alone

The projections that read these events, which TSK-0798 holds, and the Parent Room's list, which TSK-0799 holds.
