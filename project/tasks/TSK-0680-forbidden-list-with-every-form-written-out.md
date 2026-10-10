---
id: TSK-0680
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0160
closes: [REQ-3314, REQ-3320, REQ-3324]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One forbidden list holds every inflected form, every phrase and the knot's wrong word

After this task, `content/shaming.ru.json` holds the verdict and shame words of REQ-3314 with every inflected form written out, the phrases, the shortage phrases of REQ-3324, the rejected labels and the forms of «узелок», and its fixtures say which forms must match and which must pass.

## Acceptance criteria

1. Given each lemma of REQ-3314, when the list is read, then every inflected form of it is an entry, diminutives such as «задачка» and «ошибочка» are included, and the owner has reviewed the generated forms (REQ-3314). Closed by: the owner's judgement of the expanded file, because the owner decides which forms belong, and a unit test that every lemma has at least its base form and its diminutive.
2. Given the fixtures, when each fixture is matched against the list by token, then «ошибкой» and «задачку» match and «примерно», «примерить» and «мимоза» don't (REQ-3314). Closed by: a unit test with both groups.
3. Given the phrases «нити закончились», «нитей не осталось» and «нет нитей» in each of their forms, when each is matched as a run of tokens, then each matches (REQ-3324). Closed by: a unit test with one fixture for each phrase and form.
4. Given the knot's keys `ui.task.*`, `ui.outcome.*`, `ui.scheme.*` and `system.knot.*`, when the build check reads their values, then a form of «узелок» fails the build with the key, and the same form in a key of another group doesn't (REQ-3320). Closed by: a unit test with one fixture in a knot key and one in another key.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write `tools/forms.ts`, which reads a copy of the OpenCorpora dictionary from a path given on the command line and writes the forms of each lemma into `content/shaming.ru.json`. Keep the dictionary itself out of the repository and commit only the expanded list, so the run-time check needs no morphology library. Group the file into the forms, the phrases, the rejected labels of REQ-3312 and the knot's forms, each entry with the lemma it came from, so the owner reviews by lemma. The list holds about 25 lemmas and about a thousand forms by the estimate in ADR-0160.

The phrases «не получилось», «ты не поняла», «это же просто», «ты умная» and «ты самая умная» are matched as runs of tokens. The guilt and attachment phrases of RES-3300's group 4 have no fixed wording, so they aren't in the list; ADR-0110's safety check measures them.

## Depends on

Nothing. The gate that matches a text against the list lands later in this epic, and this task's tests match through a small token function of their own until then.

## Evidence

Not yet.

## Left alone

The Dutch section of the list, which ADR-0430 adds after the MVP, and the rule for «узелок» in generated text, where the word can mean a familiar and where ADR-0110 and ADR-0120 hold it.
