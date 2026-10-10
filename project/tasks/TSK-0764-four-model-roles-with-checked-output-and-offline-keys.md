---
id: TSK-0764
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5030, REQ-5032, REQ-5034]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `PARSE_MODEL`, `FRAMING_MODEL`, `PUZZLE_MODEL` and `FREE_PEN_MODEL` run as roles of their own, and the gateway checks each output before the game uses it

After this task, the model gateway holds the four roles of ADR-0210's table with their tier, key, request class and default model, hands a role's output to the game only after it passes the role's output schema and data rules, and refuses the two offline roles on the play key.

## Acceptance criteria

1. Given each of the four roles, when the gateway's role table is read, then each has the tier, key, request class and default model of ADR-0210's table, and no `GOALS_MODEL` role exists (REQ-5030). Closed by: a static test over the role table.
2. Given `FRAMING_MODEL` and `PUZZLE_MODEL` called in play mode, when the gateway routes the call, then it refuses both on the play key before any network call, and in an offline run it sends both on the offline key (REQ-5034). Closed by: a gateway test in each mode.
3. Given an output of each of `FRAMING_MODEL`, `PUZZLE_MODEL` and `FREE_PEN_MODEL` that fails its schema, when the gateway returns it, then the caller gets the plain rung text, the puzzle bank's own text and a library scene that closes the book (REQ-5032). Closed by: a gateway test with three failing outputs.
4. Given a `PARSE_MODEL` output that names a number token the request didn't carry or an operation outside the schema, when the gateway checks it, then the output fails and the riddle gets the verdict `unparsed` with base experience and no observation (REQ-5032). Closed by: a gateway test with a replayed output.
5. Given a framed rung or a retold puzzle that fails the content checks ADR-0130 runs on frames, when the gateway checks it, then it fails like a schema failure (REQ-5032). Closed by: a gateway test with a fixture rung that holds a digit.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add four roles to ADR-0100's gateway. `PARSE_MODEL` is on the player tier with zero retention on the play key, takes the new `ParseRequest` class and defaults to the model `LIVE_CHECK_MODEL` uses. `FRAMING_MODEL` and `PUZZLE_MODEL` are on the content tier on the offline key, take `ContentRequest` and default to the model `PLANNER_MODEL` uses. `FREE_PEN_MODEL` is on the player tier with zero retention on the play key, takes `StoryRequest` with every rule the Master's has and defaults to the adventure's Master model, so `llm_log` shows its spend apart from the story's (ADR-0210). The blind check of puzzles keeps `CHECK_MODEL`.

Add the gateway's output check: the output passes the zod schema of the role's declared output and the data rules that bind the role, or the caller gets the role's fallback. The fallbacks are the plain rung text from the template for framing, the puzzle bank's own text for retelling, a library scene that closes the book for «Свободное перо» (Free Pen), and `unparsed` with base experience for a parse. The parse timeout is 10 seconds, which ADR-0230 sets.

The four roles' callers belong to other epics. This task runs each role under a stand-in caller in the gateway's tests.

## Depends on

Nothing.

The epic realising ADR-0100 supplies the gateway, and the epics realising ADR-0220, ADR-0230, ADR-0280 and ADR-0330 supply the callers; this task adds the roles to the gateway as it stands and leaves the callers' prompts and content to those epics.

## Evidence

Not yet.

## Left alone

The prompts of each role and the library scenes' texts, which the callers' epics write.
