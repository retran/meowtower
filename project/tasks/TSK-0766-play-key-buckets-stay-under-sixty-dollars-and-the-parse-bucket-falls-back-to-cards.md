---
id: TSK-0766
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5046, REQ-5048, REQ-5054, REQ-5056, REQ-5096]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The play key's daily buckets sum below $60, the parse bucket falls back to sentence cards, and «Свободное перо» spends from the adventure's bucket

After this task, a parse bucket of $0.1 a game day exists on the play key and a check fails when the daily buckets reach the monthly limit, «Сплети загадку» (Weave a riddle) offers sentence cards whenever that bucket is spent or no passing parser run is recorded, and «Свободное перо» (Free Pen) spends from the current adventure's bucket and closes through a library scene when it runs out.

## Acceptance criteria

1. Given `verify/baselines.json` with the adventure's $1.5, the explanations' $0.3 and the parse bucket's $0.1, when the budget-sum check multiplies the daily buckets by 31, then it passes at $58.90; given a fixture that adds a $0.1 daily bucket, then it fails (REQ-5046, REQ-5048). Closed by: the budget-sum check's test with the fixture.
2. Given a game day whose parse bucket is spent, when «Сплети загадку» is offered, then it offers sentence cards for the rest of the game day and no parse request is made (REQ-5046, REQ-5096). Closed by: a gateway test with the bucket at zero.
3. Given `COMPOSE_FREE` on and no passing run in `verify/parser-eval.json` for the configured `PARSE_MODEL`, when the server starts, then text riddles are off, sentence cards play and `./meowtower status` shows `compose_flag_off`; given a passing record, then free composition is offered (REQ-5096). Closed by: a start-up test.
4. Given a simulated day in which «Свободное перо» runs until the current adventure's bucket is spent, when `llm_log` is read, then every call is charged to that bucket, the book closes through a library scene with no budget or error shown, and `verify/baselines.json` holds no bucket of its own for it (REQ-5054, REQ-5056). Closed by: a simulated-day test.
5. Given «Свободное перо» after the finale, when it calls the model, then the call is charged to the bucket of the adventure that finished that game day (REQ-5054). Closed by: the simulated-day test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the parse bucket to the gateway's budget table and to the Baselines table of ADR-0190. Add a group 1 check in verify that reads every play-key bucket from `verify/baselines.json`, multiplies the daily ones by 31 and fails when the sum reaches the monthly limit, so a new daily bucket can't push the limit into ordinary spending without a red build.

Make the server read `verify/parser-eval.json` when `COMPOSE_FREE` is on and keep free composition off unless it records a passing run for the configured model; the same guard serves ADR-0230's flag. ADR-0360 changes ADR-0210's "refuse to start" to this, so a changed parser model turns the text form off and never stops the game. Make the Director offer sentence cards while the parse bucket can't reserve a parse. The record's writer, `verify --live --compose`, belongs to ADR-0230's epic, so a fixture record stands in.

Charge `FREE_PEN_MODEL` calls to the current adventure's bucket, which is the open one or, after the finale, the one that finished that game day. When it is spent, the gateway returns the library scene that closes the book; the scene's text belongs to ADR-0330.

## Depends on

- TSK-0764 (blocking): the roles whose calls the buckets charge.

The epic realising ADR-0230 writes `verify/parser-eval.json`, and the epic realising ADR-0330 supplies «Свободное перо» and the library scene; this task runs on a fixture record, a stand-in caller and a fixture scene.

## Evidence

Not yet.

## Left alone

The adventure's and the explanations' own budgets, which ADR-0100 keeps, and the parse's reservation of two worst-case parses, which ADR-0230 sets.
