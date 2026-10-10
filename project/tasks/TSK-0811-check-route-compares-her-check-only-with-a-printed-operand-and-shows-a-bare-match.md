---
id: TSK-0811
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5338, REQ-5340, REQ-5342, REQ-5344, REQ-5346, REQ-5348]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The check route compares her check only with the printed operand, costs nothing, and the field shows a match or a mismatch with no verdict

After this task, `POST /api/item/:itemId/check` takes `{ preliminaryRaw, checkRaw, clientSeq }`, compares the parsed `checkRaw` in `Q` with the operand the task prints and nothing else, replies `{ match, checksLeft }`, and the button «Проверить нить» (Check the thread) opens a field that shows «Сходится» (It matches) or «Не сходится» (It doesn't match) and never the correct answer.

## Acceptance criteria

1. Given 345 - 178 with her entry 167 and a check of 345, when the route is called, then it replies `match: true`, and with 344 `match: false`, and it never computes the correct answer, never computes her answer plus 178 and never judges her preliminary answer (REQ-5342). Closed by: an integration test and a code search for a call to the checker on this route.
2. Given a packet test over every task kind, when the `Room` packet and every reply before the first attempt are read, then they carry `check: { op, operand }` with both printed in the task and no correct answer, no result her check should give and no verdict on the preliminary answer (REQ-5344). Closed by: a packet test.
3. Given a check sent after the first attempt, when it arrives, then the server refuses it with `409 check_late` and logs nothing; given a fourth check, then `409 check_limit_reached` with no event and the button inactive at `disabled-alpha` with no words (REQ-5338). Closed by: an integration test and a state-machine test.
4. Given a `checkRaw` the server can't parse, when it arrives, then the reply is `422 check_unparsed` and no check is used up (REQ-5342). Closed by: an integration test.
5. Given the check used, when the ledger is read, then no guiding thread and no other currency was spent (REQ-5340). Closed by: a ledger test.
6. Given the field's two strings, when ADR-0160's forbidden-word list runs over `ru.json`, then neither holds a tick, a cross or «верно», «неверно» or «ошибка», and the field never shows the correct answer (REQ-5346, REQ-5348). Closed by: the string check's output and a Playwright test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the route to SPC-0030's table, idempotent by `clientSeq`. The button shows in `open` once her answer field holds a parseable entry and never after the first attempt. It opens a field under the prompt «Проверь обратным действием: 167 + 178 = ?», where the prompt follows the table in ADR-0240: `a + b` her answer - `b` for the target `a`, `a - b` her answer + `b`, `a · b` her answer : `b`, `a : b` her answer · `b`. The server logs `self_check_used` (TSK-0813) and replies; a task allows at most 3 checks, an unmeasured default that covers a first check, a recheck after a correction and one spare. A request sent twice with one `clientSeq` gets the reply rebuilt from the first request's events.

The check needs the server, so with no connection the button stays inactive and the pick waits in ADR-0030's answer queue with its answer. ADR-0370 sets the codes above.

## Depends on

- TSK-0810 (blocking): the flag that says which templates offer the check.
- TSK-0813 (blocking): the `self_check_used` type the route writes.

The epic realising ADR-0030 supplies the route table and the answer queue; this task adds one route to it.

## Evidence

Not yet.

## Left alone

The check field's pixel layout, which ADR-0150 owns, and what makes an attempt assisted, which TSK-0812 holds.
