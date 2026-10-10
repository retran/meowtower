---
id: TSK-1007
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-5528, REQ-5562, REQ-5566, REQ-5570]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A grouping task's ladder follows its graph, every drawn set reaches the log in order, and the short loop plays a placeholder spell until its art ships

After this task, a grouping template's hint ladder follows its computation graph in written order and the optimal plans reach the client only after the first attempt ends, every set she draws is kept in order through the answer queue, an empty submission logs a `grouping_submitted` with `none`, and the short loop plays a spell drawn in code.

## Acceptance criteria

1. Given a grouping task before its first attempt ends, when every reply and packet is read, then none holds an optimal plan or a link score, and the ladder's rungs follow the graph's steps in written order (REQ-5562). Closed by: a packet test over the fixture grouping templates.
2. Given an offline session in which she draws and removes 40 links, when the device reconnects, then the log holds every set in order and the queue dropped none up to `grouping_link_cap` (REQ-5566). Closed by: a replay test over a recorded offline session.
3. Given an attempt submitted with nothing drawn, when the log is read, then a `grouping_submitted` with an empty set and the score `none` sits in the attempt's transaction, and a submitted attempt's event carries the links and their grouping score (REQ-5570). Closed by: a route test and a replay test that recomputes the stream from the log.
4. Given the player earns the short loop and `spell.short_loop` has no art, when the window closes, then a placeholder animation drawn in code from the design tokens plays with the System line «Обнаружен короткий путь. Длинный путь обиделся», never the clean spell (REQ-5528). Closed by: a component test and a Playwright test that finds the line and the animation's marker.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0360 entries 52 to 55: the ladder source, the queue's rule of keeping every set, the empty submission's event and the placeholder spell as the amended ADR-0260 lines say.

## Depends on

Nothing in this epic. The epics realising ADR-0260, ADR-0030 and ADR-0170 supply the grouping task, the persisted answer queue and the code-drawn art fallback; until they exist, the tests run on a fixture grouping template and a fake queue, and the real task's scoring is left to those epics.

## Evidence

Not yet.

## Left alone

The scoring of links and the grouping stream's estimate, which ADR-0260 owns.
