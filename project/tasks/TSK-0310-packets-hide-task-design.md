---
id: TSK-0310
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-2414, REQ-2420, REQ-2428]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# No packet carries the task's design or its answer early, and no reply says «верно» or «неверно»

After this task, every body the server sends is parsed by a `.strict()` schema before it leaves, a recorder proves no packet carries the task's design or an early answer, and a static test proves no answer reply can say «верно» or «неверно».

## Acceptance criteria

1. Given a reply body with a field outside its schema, when the server sends it, then the request fails with `500` and the body never reaches the client. Closed by: a unit test that adds a field to a stand-in reply.
2. Given a simulated 30-day run over the stand-in adventure, when the recorder reads every packet, then no packet has a field named `node`, `templateId`, `seed`, `params`, `purpose`, `scored`, `frameId`, `flowSlot` or `why` at any depth (REQ-2428), and no packet sent before a task's first attempt carries that task's correct answer in any field or string (REQ-2420). Closed by: the recorder's report, which counts packets and finds 0 of each.
3. Given every string the `battleLine` pool and the reply's string keys can produce, when the static test reads them, then none contains `верно` or `неверно` as a whole word (REQ-2414). Closed by: the lint verb's output; the test fails a fixture line holding «Верно!».

## What to do

Make every reply schema in `src/shared/api.ts` `.strict()` and parse each outgoing body with it in one place in `src/server/`. Extend the response recorder in `tests/e2e/fixtures.ts` so it also checks the forbidden field names and the correct answer before the first attempt, and add a driver that plays the stand-in adventure for 30 simulated days through the API. Add the verdict-word check to `tools/static-checks.ts`, matching whole words case-insensitively in the `ru` language file's pool and in the reply's string keys.

The 30-day driver stands in for ADR-0190's simulation; the recorder runs again over that simulation once it exists. ADR-0190's definition of done applies.

## Depends on

TSK-0300, because it checks the packets and replies that task sends.

## Evidence

Not yet.

## Left alone

How the client draws a packet (TSK-0340), and the words in real scene and pool texts, which ADR-0110 and ADR-0160 write and this check will cover as they land.
