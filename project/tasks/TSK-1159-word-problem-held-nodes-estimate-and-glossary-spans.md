---
id: TSK-1159
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-0784, REQ-0840, REQ-5300, REQ-5414]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A word problem draws no step from a held node, an unanswerable problem asks for its estimate like a solvable one, and a frame's glossary words get spans

After this task, the generator refuses a held node before it draws, an unanswerable T2 to T4 problem carries an estimate by the same rule as a solvable one with no tell in what the server sends, and each glossary word a story frame adds is marked in the task view. This settles entries 5, 6, 18 and 28 of ADR-0460.

## Acceptance criteria

1. Given a word problem, when its step numbers are drawn, then the node set leaves out every node held for a retention check, and every step's node is fluent (REQ-0784). Closed by: a generator test over a held and a fluent node.
2. Given a task on a held node after the MVP, when the generator runs, then it asks the reject predicate about the task's nodes before candidate 0, draws nothing, takes no fallback entry and returns `held_node_refused`. Closed by: a generator test with a held node.
3. Given an unanswerable T2 to T4 problem whose result is 1000 or more, when it is built, then it carries an estimate by the same rule as a solvable one, applied to the result of its complete problem, its four options come from that hidden result, and «Нельзя узнать» pressed in the step records no pick and no estimate (REQ-5300). Closed by: a unit test over the two kinds and the pressed button.
4. Given 1,000 seeds of an unanswerable and of a solvable problem of the same tier and answer form, when the packets and replies before the answer are compared, then the fields each kind sends are identical in name, count and type (REQ-5414). Closed by: a payload test over 1,000 seeds of each kind.
5. Given a frame that adds 2 glossary words, when the task view is built, then each word has a term span as a word the template lists has (REQ-0840). Closed by: a view test over a frame with 2 added words.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Make the node set that supplies a word problem's step numbers leave out held nodes, as ADR-0400's hold covers every path that shows a node. Make the generator call the predicate once, before candidate 0, because a refusal per candidate would end in the fallback entry that names the same held node. Build the estimate step from the complete problem's result for the unanswerable kind. Add the span to every glossary word a frame adds, at most 2.

## Depends on

Nothing. The epics realising ADR-0040, ADR-0240 and ADR-0400 supply the generator, the estimate step and the hold; this task runs on their fixtures and stand-ins.

## Evidence

Not yet.

## Left alone

The share of tasks that ask for an estimate, which ADR-0240 sets, and the glossary file's contents, which ADR-0160 owns.
