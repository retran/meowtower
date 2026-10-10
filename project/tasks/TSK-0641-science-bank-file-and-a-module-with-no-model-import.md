---
id: TSK-0641
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-1236, REQ-1238, REQ-3660]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The science bank is a hand-checked file, each wrong option names its misconception, and no code path writes a question during play

After this task, `content/science.ru.json` has a schema that makes each wrong option name a misconception, the verify command fails when a topic holds fewer than 40 questions, and the science module imports nothing from the model gateway.

## Acceptance criteria

1. Given a question with a topic from E1 to E5, four options, one correct and three wrong, when the schema reads it, then each wrong option must carry a non-empty `misconception` and the question gets a content hash; a question with a wrong option without a misconception fails the schema with the question's id (REQ-1238). Closed by: a unit test with one valid and one invalid question.
2. Given a bank with 40 questions in each topic, when `scienceBankCheck` runs, then it passes; given 39 in one topic, then it fails naming the topic and the count (REQ-1236). Closed by: a unit test with both banks.
3. Given the science module in `src/server/`, when the verify command's import rule runs, then it passes, and a fixture module that imports the gateway makes the build fail with the import chain (REQ-3660). Closed by: the lint verb's output and the import rule's fixture test.
4. Given the whole server, when a request for a science question is traced, then the only source of a question is the bank file's loader, and no route accepts question text from a model reply (REQ-3660). Closed by: an integration test that stubs the gateway to throw on any call and plays an Observatory visit.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/server/science.ts` with the loader and the schema, and the import rule to `tools/static-checks.ts`. The bank file declares `repeatWindowDays` and a question's `topic`, `options`, `correct`, `misconception` per wrong option and `hash`. I split the check from the stage: `scienceBankCheck` fails below 40 whenever it is called, and which stages call it is the stage table of the epic realising ADR-0190. An empty bank in the repository at the start is therefore not a failure of this task, because the bank holds 200 questions only after the parent approves them.

An agent may draft questions offline, as the owner decided on 2026-09-27; a drafted question enters the file like any other and waits for its approval, which TSK-0642 builds.

## Depends on

Nothing. The model gateway module the import rule names exists from the epic realising ADR-0100; until then the rule matches the path `src/server/gateway`, and a fixture module proves it.

## Evidence

Not yet.

## Left alone

The first 200 questions, which an agent drafts and the parent approves, and the topics' place in the skill graph, which the epic realising ADR-0050 settles.
