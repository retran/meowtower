---
id: TSK-1128
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7222, REQ-7224, REQ-7226, REQ-7228, REQ-7230]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `judgeCompose` expands each named operation before it applies the verdict table, and the log keeps the named graph

After this task, `judgeCompose(target, graph)` expands every named operation in both the target and the graph into `+`, `−`, `·` and `:` over exact rationals, then gives its verdict by ADR-0230's table word for word, and `compose_parsed` holds the graph as the parser named it.

## Acceptance criteria

1. Given «три четверти от 20» and «разделили 20 на 4 части и взяли 3», when `judgeCompose` runs, then both give the same expanded graph and `match` (REQ-7222, REQ-7228). Closed by: a property test over generated pairs.
2. Given the expansion table, then a/b of N is N : b · a, p % of N is N : 100 · p, the first part of T in the ratio a : b is T : (a + b) · a, the second T : (a + b) · b, and the other part from a known part K is K : a · b with a the term that matches K and b the term asked for, wherever each stands in her text (REQ-7222). Closed by: a unit test, five fixtures with the terms in both orders.
3. Given a fraction written as one token, a/b, and a count followed by a fraction word, then both expand through the numerator a and the denominator b; given a fraction word with no count, such as «четверть от 80», then a = 1 (REQ-7224). Closed by: a unit test, three fixtures.
4. Given a mixed number in digits and a mixed number in words such as «два с половиной», then both expand as the whole part plus a/b and get one verdict (REQ-7226). Closed by: a unit test, two fixtures.
5. Given «четверть от 80» for the target `25 % от 80`, then the verdict is `match_other_structure`, and every verdict on a pair with no named operation equals the verdict before this epic; and given a confirmed riddle, then `compose_parsed` holds the graph with its operations as named, before the expansion, and no expanded graph is logged (REQ-7228, REQ-7230). Closed by: the property test and a log test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the expansion to `src/shared/compose.ts` as the first step of `judgeCompose`, before ADR-0230's normalisation, so the verdict table and the match rule keep their words and REQ-5226, REQ-5228 and REQ-5298 hold unchanged. All values are exact in `Q`. The expanded graph is a pure function of the named one, so a replay rebuilds it. The expansion merges "three quarters of 20" with "divide by 4, then multiply by 3", which is the distinction the addendum wants to see; the named graph in the log lets a later report count operator stories without a new field.

## Depends on

- TSK-1127 (blocking): the named operations are the parse reply's.

The epic realising ADR-0040 supplies `Q` and the epic realising ADR-0230 the verdict table and the normaliser.

## Evidence

Not yet.

## Left alone

The three new error classes, which TSK-1129 adds beside the verdict, and the stream's counts, which TSK-1135 keeps.
