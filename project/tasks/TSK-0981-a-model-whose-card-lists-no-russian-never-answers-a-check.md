---
id: TSK-0981
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0350
closes: [REQ-3918]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A model whose card lists its languages without Russian never answers a judge check

After this task, `tools/judge-candidates.json` lists each local candidate with the languages its model card gives, a group 1 check of `verify` fails an entry that lists languages without Russian and passes one that gives only a count, and the route never gives a check to a judge serving such a file.

## Acceptance criteria

1. Given three entries, one whose card lists languages without Russian, one whose card lists Russian and one whose card gives only a count such as "35+ languages", when group 1 runs, then the first fails the build and the other two pass (REQ-3918). Closed by: a static check with its three fixtures.
2. Given a `LOCAL_JUDGES` entry that serves the file of the failing candidate, or a file with no entry in the list, when `./meowtower up` runs and when the bake-off starts, then both refuse it with `model_config_invalid`, and the route table never names it for any check (REQ-3918). Closed by: a shell test and a route test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Create `tools/judge-candidates.json` with, for each candidate, its name, file, parameter count, the repository it was downloaded from, the card's languages as a list or a count, and `checks`, the checks it may take. The stage 0 candidates are Qwen3.5-9B, Qwen3.5-4B, Gemma 4 12B and Gemma 4 E4B for every check, and Shieldstral 1.0 3B for `safety`, `shaming` and `placeholder_safety` only.

The language list is a first filter. A card that gives only a count passes it and goes to the Russian test set, which is the real gate, so the check must not read a passing entry as a judged one. The hosted judge and `SAFETY_MODEL` meet the test set alone and the check doesn't read them.

## Depends on

Nothing in this epic. The epic realising ADR-0190 supplies group 1 of `verify`; until it exists the check runs as a script that the group 1 runner calls later.

## Evidence

Not yet.

## Left alone

Which candidate wins which check, which the local bake-off of TSK-0984 decides, and the downloads of the model files, which the owner does by hand.
