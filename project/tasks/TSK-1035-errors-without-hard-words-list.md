---
id: TSK-1035
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6614]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The summary lists nodes with errors that carry no hard word, beside the language-cause list

After this task, the full report's summary lists, under «ошибки есть и без трудных слов», each node with an error on a bare task or after she opened the term's explanation, next to the nodes whose errors all carry «возможна языковая причина».

## Acceptance criteria

1. Given a node with an error on a task of `format: "bare"`, and a node with an error after she opened the term's explanation, when the summary is built, then both are listed under «ошибки есть и без трудных слов» (REQ-6614). Closed by: a report test over a fixture log.
2. Given a node whose errors are all on context tasks and none came after an opened explanation, when the summary is built, then it is not on that list (REQ-6614). Closed by: the same report test.
3. Given one log, when both lists are built, then they read the same set of attempts (REQ-6614). Closed by: a unit test that both functions take one attempt set as their input.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the list to the summary after the MVP. I chose ADR-0290's `format: "bare"` as the test for a bare task, and the same attempts the language-cause list reads, so the two lists are two cuts of one set. The list is the evidence against REQ-2372's language-only proposal.

## Depends on

Nothing in this epic.

The epic realising ADR-0180 supplies the summary and the language-cause list; ADR-0290's epic supplies `format`.

## Evidence

Not yet.

## Left alone

The wording of the heading beyond the Russian string `parent.*` rules of TSK-1032.
