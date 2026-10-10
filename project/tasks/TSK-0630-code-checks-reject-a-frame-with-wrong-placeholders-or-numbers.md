---
id: TSK-0630
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3626, REQ-3628]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Code rejects a frame whose placeholders are wrong or that holds a number of its own

After this task, `checkFrame` in `src/frames/check.ts` runs step 3 of the pipeline and rejects a frame with a missing or repeated placeholder, a digit, a number word, a sentence over the length limit, a failed readability measure or a forbidden word, and says which rule failed.

## Acceptance criteria

1. Given a specification listing `{a}` and `{b}`, when a frame misses `{a}`, holds `{a}` twice or holds `{c}`, then each is rejected with the rule `placeholder` and the name (REQ-3626). Closed by: a unit test with the three frames and one passing frame.
2. Given the frames holding «12», «дюжина», «два», «двух» and «половину», when each is checked, then each is rejected with the rule `number_word` or `digit`, matched by lemma; given «сколько всего» and «вторник», then neither is rejected (REQ-3628). Closed by: a unit test with both groups of fixtures.
3. Given a problem of k = 2 steps, so at most 3 sentences, when a frame holds a sentence of 15 words, holds 4 sentences, or ends on a statement and not on its question, then each is rejected with the rule `length`, and a frame of 3 sentences of 14 words with the question last passes. Closed by: a unit test with the three failing frames and the passing one.
4. Given a frame that fails `frameMetrics` or the forbidden-word gate, when it is checked, then it is rejected with that rule's name and the form. Closed by: a unit test with a stand-in `frameMetrics` and the gate of the epic realising ADR-0160.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Check each variant of a reply on its own and return the first failing rule with its text, so the parent reads in words what an edit failed. Read the numeral lexicon as a list of lemmas through one function, and let the lexicon of ADR-0120 replace the stand-in list of the three examples and their forms. The length limit is "at most k + 1 sentences of at most 14 words, the question its own last sentence", with the numbers read from the specification of TSK-0629.

## Depends on

- TSK-0628 (blocking): the check reads the frame record and its placeholder roles.

The epics realising ADR-0040, ADR-0120 and ADR-0160 supply `frameMetrics`, the numeral lexicon and `textGate`. Until each lands, this task takes a stand-in function with the same signature and the stand-in lexicon above.

## Evidence

Not yet.

## Left alone

The safety check and the blind solves, which are the next two steps, and the real numeral lexicon, which ADR-0120 owns.
