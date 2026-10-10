---
id: TSK-1136
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7260, REQ-7262, REQ-7268, REQ-7272, REQ-7274]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Acceptance test 3 holds a subset of 50 texts for each family and reports the unit stories and the division kinds apart

After this task, `tests/reference/compose.ru.json` holds the counts the decision requires, `verify --live --compose` reports the whole set and each family's subset against 48 of 50, the unit stories and the division kinds apart, within $9, and writes one record per parse model and prompt hash.

## Acceptance criteria

1. Given the reference file, when the content test runs, then it holds, apart from the 200 texts, a subset of 50 labelled texts for each of fractions, decimals, percentages and ratios, and the subsets include decimal operators below 1, percentages used as plain numbers, additive ratios, and fraction stories written as an ordinal with «часть» (REQ-7260, REQ-7262). Closed by: the content test's counts and fixture tags.
2. Given the 200 texts, then they hold at least 20 texts each of equal groups, the two meanings of division and multi-step expressions with brackets, at least 10 of each meaning, and at least one text of each compose error class, and the build fails above 420 texts a run (REQ-7268). Closed by: the content test.
3. Given stories that need a unit conversion, then the set holds at most 20, labelled `unparsed`, reported apart and left out of each family's count of 48 of 50 (REQ-7272). Closed by: a report test over a fixture run with a stand-in parse.
4. Given a run, when it finishes, then it reports for each meaning of division how often the parsed kind agrees with the labelled kind, with no pass floor (REQ-7274). Closed by: the same report test.
5. Given a run, when it finishes, then it writes to `verify/parser-eval.json` one record per parse model and prompt hash holding the whole set's pass and each family's pass, a passing or failing run alike, and keeps at most 5 pairs, dropping the oldest pair that isn't the configured one and saying so once in the verify report. Closed by: a file test with six fixture pairs.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the subsets, the counts and the unit stories to the reference file and the run to `verify --live --compose`: the 200 texts, four subsets of 50 and 20 unit stories, on the offline key, on the configured `PARSE_MODEL` and the fixed prompt, within $9 on the offline key, which is 420 worst-case parses of about $0.017 each plus their judge checks at about $0.003 a text. A subset passes on agreement alone at 48 of 50, because ADR-0230's second condition, at most 2 % of texts labelled `match` judged otherwise, is one text in 50 and would fail a family on a single slip; the whole set keeps both conditions. The parent labels the texts and the owner runs the live run; until they do, the task runs on a stand-in parse and fixture labels, and the live pass is that person's act.

## Depends on

- TSK-1126 (blocking): the run goes through the guard.
- TSK-1127 (blocking): it parses with the new reply and prompt.
- TSK-1128 (blocking): it judges through the expansion.

The epic realising ADR-0230 supplies the 200 texts, the labelling tool and the run's harness.

## Evidence

Not yet.

## Left alone

The parent's labelling of the subsets and the replacement of texts that fall short of the counts, which is a person's work, and what plays in text after a pass, which TSK-1134 decides.
