---
id: ADR-3260
artifact: adr
status: approved
revised: 2026-11-01
addresses: [REQ-8166, REQ-8152, REQ-8154, REQ-8156, REQ-8158, REQ-8160, REQ-8164]
supersedes: []
concerns: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3260. The decisions in force state the newest rule in their own text, and seven requirements change to match

## Decision

Text in an approved decision now states the rule in force, because the owner asked on 2026-11-01 that decisions be free of contradictions, and a reader of an older decision shouldn't need its later amendments. Every amendment that quoted its old sentence is applied in place. Newer decisions win: budgets of $5 and $200, live stories with no frame library, three languages, the title of ADR-3210, a storyteller in place of the System, the pipeline of ADR-3240 in place of the planner, and the front page of ADR-3250.

Seven requirements are replaced, because each contradicted a decision: the player's screens may show levels and rank; the story pipeline writes after each adventure; daily budgets sum below $200; the rank comes from node levels; text follows the parent's language; a pause shows the prepared setting; the front page may name a lesson the parent chooses.

The owner decided on 2026-11-01 that every template takes a story, so the half of bare tasks goes, and that jokes are allowed, so the judge's joke question goes. Mental arithmetic, the Volley and control facts take stories too, and ADR-3270 starts their clock when the numbers appear, so thresholds keep their meaning.

Decisions where two rules met are settled this way: a tested level replaces an inferred one with no fall event; 14 days of a rank fall count played days; floors run in both day and night adventures; the judge moves to the player tier with the author; hints stay capped at 2 while a third rung states the answer.

Once accepted, the records agree except for the items under What this does not settle. No code changes.

## Why

Three reviews of the decisions found contradictions and stale text that an `Amended by` line didn't remove. Requirements cannot be reworded, so each is withdrawn and replaced.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing | Keeps each record as approved | A reader gets the old rule from the old record |
| Withdraw the old decisions | Clean index | Most of each record stands |
| Rewrite done decisions too | Complete | Done records are frozen by the method |

## What it costs

Records no longer show their original text, and git history holds it. Automatic replacement of the System's name may read awkwardly in places.

## What would reverse it

- The owner names a different voice for the System's lines: those sentences change.

## Consequences

Older `becomes` lines in `Amends` sections stand as history.

## How I will know it was realised

1. `paw check` reports no new finding.
2. No approved decision states $1.5, $60, «Мяубашня» as the title, or `PLANNER_MODEL`.

## What this does not settle

- Which window echoes a player's choice: REQ-8168, ADR-0330's 3 adventures, or REQ-8168's 7 episodes.
- Requirements and specifications that still name the System, as ADR-3210 deferred.
- Done records, which keep their text.
- About 40 amendments whose old sentences weren't quoted exactly stay as written.
- Whether a model author is named: no approved record names the model of `TASK_TEXT_MODEL`.

## Plan

1. Build the requirements' behaviour in the code that owns each subject (REQ-8152, REQ-8154, REQ-8156, REQ-8158, REQ-8160, REQ-8164).
