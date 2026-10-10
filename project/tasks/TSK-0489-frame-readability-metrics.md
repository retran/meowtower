---
id: TSK-0489
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-0701, REQ-0790, REQ-0792, REQ-0794, REQ-0796, REQ-0798, REQ-3712]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `frameMetrics` measures a frame against the limits of the readability table

After this task, `frameMetrics(text, k)` in `src/shared/readability.ts` counts the sentences, the longest sentence, the position of the question, the mean sentence length, the share of words outside the frequency list for the player's age and the risk terms, and the limits come from the player's age in `personal/player.md` and no tracked file names it.

## Acceptance criteria

1. Given a frame of k steps, when it has k + 1 sentences, then it passes REQ-0790, and with k + 2 it fails; given a sentence of 14 words it passes REQ-0792, and with 15 it fails. Closed by: one fixture just inside and one just outside each limit.
2. Given a frame whose last sentence is the question, when the question is inside an earlier sentence, then it fails (REQ-0794); given a mean sentence length of 10 words it passes and above 10 it fails (REQ-0796). Closed by: one fixture each side of the limit.
3. Given a frame with 10 % of its words outside the frequency list it passes, and with more it fails (REQ-0798); given 2 risk terms it passes and with 3 it fails (REQ-0701). Closed by: one fixture each side of the limit.
4. Given a repository with no `personal/player.md`, when `frameMetrics` needs the age band, then it reads the band from the file the parent's setting wrote and reports `age_unset` where there is none; the code, the content and the tracked files hold no age (REQ-3712). Closed by: a unit test with a temporary file and a search of the tracked files.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/shared/readability.ts` and a loader for the age band that reads `personal/player.md` on the Mac and the parent's setting once ADR-0180's epic stores it. The frequency list `content/frequency.ru.txt` is assembled by the building agent from a corpus of Russian children's texts, with one list for each primary-school age band and the corpus named in its header. Risk terms are the words with a glossary entry; until ADR-0160's glossary file exists the caller passes the list.

## Depends on

- TSK-0480 (not blocking): it uses `formatQ` to count a number as one word; either task can land first with a stub.

## Evidence

Not yet.

## Left alone

The frame library and the pipeline that runs these metrics, which ADR-0130 owns, and the glossary's content, which ADR-0160 owns.
