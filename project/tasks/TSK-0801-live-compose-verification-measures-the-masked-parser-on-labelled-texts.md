---
id: TSK-0801
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5274, REQ-5280, REQ-5282, REQ-5284, REQ-5286]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `verify --live --compose` runs the parser on masked reference texts and reports agreement, the match bound, the confusion and the request check

After this task, `verify --live --compose` runs the configured `PARSE_MODEL` on the masked texts of `tests/reference/compose.ru.json` on the offline key in the gateway's `verify` mode, reports agreement with the parent's labels, the confusion between labelled and judged verdicts and the share of `match` texts judged otherwise, checks every logged request body, plants a distinctive target and writes the record the composing flag reads.

## Acceptance criteria

1. Given a fixture reference set with recorded model answers, when the run is replayed, then it reports the agreement, fails below 95 %, and fails when more than 2 % of the texts labelled `match` are judged otherwise (REQ-5282). Closed by: a harness test with two fixture sets.
2. Given a run, when its report is read, then it holds how often each labelled verdict was judged as each verdict (REQ-5280). Closed by: the harness test.
3. Given a run, when `llm_log` is read, then every parse request body hashes to the fixed prompt plus that text's masked form, and a body with any other content fails the run (REQ-5284). Closed by: the harness test with a fixture request that carries an extra field.
4. Given the planted target «7 · 13 − 29» in a fixture, when the run's logged requests are searched, then it is found in none, and a request that holds it fails the run (REQ-5286). Closed by: the harness test with both cases.
5. Given a run on the offline key in `verify` mode, when its spending is read, then it is charged to the offline key and not the play key, within the run's budget of $4 (REQ-5274). Closed by: the harness test's gateway log.
6. Given a passing run, when it ends, then `verify/parser-eval.json` holds a record for the configured model and prompt hash, and every run writes its record as ADR-0460 amends it (REQ-5274). Closed by: the harness test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the command beside ADR-0190's `verify --live`. It runs on masked text and the configured model, as the text will reach the parser in play. The run's budget is $4, a figure ADR-0230 chose at 200 worst-case parses of about $0.017 each plus their judge checks; ADR-0440 raises it to $9 for its larger set, so the budget is a setting.

The file `tests/reference/compose.ru.json` holds the 200 texts with the parent's labels, set before any parser runs on them, so the labels can't follow the parser's output. The texts themselves, with child-like spelling errors, dictated text, number words, problems with no question, irrelevant data, every verdict, every compose error class and correct problems in each allowed order of operands, are the parent's and the content author's work, and the harness runs on the fixture set until that file holds them.

## Depends on

- TSK-0788 (blocking): the verdict rules the labels use.
- TSK-0792 (blocking): the masker whose output the run sends.
- TSK-0795 (blocking): the reply check the run judges with.

The epic realising ADR-0210 supplies `verify/parser-eval.json`'s reader and the `COMPOSE_FREE` start-up rule; this task writes the file.

## Evidence

Not yet.

## Left alone

The 200 labelled texts, the parent's and the content author's work, the owner's judgement under REQ-5292 when the masked parse can't pass, and the owner's act of running the test after each change of `PARSE_MODEL`.
