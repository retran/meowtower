---
id: TSK-1010
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-5058, REQ-6048, REQ-5950, REQ-6428]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every route that touches the school's goal list answers on the loopback listener alone, a region is one tap, and the sources screen counts only calculation tasks

After this task, each route that reads or writes the school's goal list or its wording is served on the loopback listener only, `school_goal_mapped` is keyed by `goalKey`, a Sources task that asks for a region takes one tap on a cell, a bar or a map square, and «находит, но не считает» counts only wrong first attempts on tasks that ask for a calculation.

## Acceptance criteria

1. Given a request from a paired device on the home network, when it reaches any route that reads or writes the goal list or its wording, the Cito panel's goal list included, then the answer is 404 and the same request on the loopback listener works (REQ-5058, REQ-6048). Closed by: a route test over every such route found by a route-table search.
2. Given an import that renames a goal, when `school_goal_mapped` is read, then its `goalKey` from `src/engine/school/keys.ts` still matches, where an `importId` would not (ADR-0360 entry 76, no requirement of its own). Closed by: a projection test over two imports.
3. Given a Sources task that asks for a region, when it renders, then the answer is one tap on a cell, a bar or a map square, and a line chart asks for a value (REQ-5950). Closed by: a component test over the four source kinds.
4. Given at least 3 wrong first attempts in 30 days on tasks that ask for a calculation that matched no reading trap, and 3 on track tasks that matched one, when the screen is built, then it shows «находит, но не считает» and «считает, но ошибается в чтении» respectively, and a wrong tap on a region adds to neither count of calculations (REQ-6428). Closed by: a projection test over four fixture sets.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0360 entries 72 to 76: the loopback fence on every goal-list route, the key of the mapping event, the region answer form and the reading-gap counts as the amended ADR-0300 and ADR-0310 lines say.

## Depends on

Nothing in this epic. The epics realising ADR-0290, ADR-0300 and ADR-0310 supply the Cito panel, the Sources tasks and the goal-list routes; until they exist, the tests run on a fixture route table and fixture track attempts, and the real routes are left to those epics.

## Evidence

Not yet.

## Left alone

The goal-list parser and the snapshot screens, which ADR-0310 owns.
