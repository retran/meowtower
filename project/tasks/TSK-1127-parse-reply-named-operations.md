---
id: TSK-1127
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7210, REQ-7218, REQ-7220, REQ-7232]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parse reply names six operations over tokens, refuses any other number, and ends a unit story as `unparsed`

After this task, the parse reply can name a fraction, a mixed number, a fraction of a number, a percentage of a number and the two parts of a ratio over `n` and `d` tokens only, the engine refuses any graph that names another number, and a story that needs a unit conversion ends as `unparsed`.

## Acceptance criteria

1. Given a reply that names a fraction a/b, a mixed number, a fraction of a number, a percentage of a number, a share of a ratio from its total and a part of a ratio from a known part, each over tokens, when the engine validates it, then it accepts each (REQ-7218). Closed by: a schema test, six fixtures.
2. Given a graph that names a number other than an `n` or `d` token of the text it was sent, such as 1000, when the engine validates it, then it rejects it as invalid; given the 100 of a percentage, the sum of a ratio's parts and the numerator 1 of a fraction word with no count, then they come from the operation's definition and the graph doesn't name them (REQ-7210). Closed by: a replayed test with both graphs.
3. Given «2 кг 500 г», when the parse replays, then the graph either names 1000 and ends as `parse_invalid`, or leaves a quantity out and ends as `parse_no_question`, and the riddle ends as `unparsed` with ADR-0230's fixed line (REQ-7232). Closed by: a replayed test with both replies.
4. Given a colon between two tokens, when the fixed parse prompt is read, then it says to read it as a division unless «в отношении» or «на … приходится» marks a ratio, and it says an ordinal followed by «часть» or «доля» names a fraction with the ordinal's `d` token as its denominator (REQ-7220). Closed by: the prompt's snapshot test and a stand-in parse fixture for each rule.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend the parse reply schema of ADR-0230 with `d` tokens and the six named operations, and the reply check with the rule above. Add the two rules to the fixed parse prompt, which gives it a new hash, so acceptance test 3 runs again before any text riddle plays on it. The engine doesn't tell a unit story apart from another parse failure on purpose, because both end the same way for her and telling them apart would need a unit table the record refuses. A child writes «третья часть» for «треть», and the parser would otherwise read a position; that rule is a default ADR-0440 chose. ADR-0460 settles that the reply check of REQ-7210 binds from the MVP.

## Depends on

- TSK-1125 (blocking): the graph's tokens include the `d` tokens.

The epic realising ADR-0230 supplies the parse reply schema, its reply check and the fixed prompt.

## Evidence

Not yet.

## Left alone

The expansion of the named operations, which TSK-1128 does, and the live agreement of the new prompt on the reference texts, which TSK-1136 reports.
