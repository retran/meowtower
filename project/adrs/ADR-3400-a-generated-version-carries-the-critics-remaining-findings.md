---
id: ADR-3400
artifact: adr
status: approved
revised: 2026-11-15
addresses: [REQ-8642]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3400. A generated version carries the critic's remaining findings, and the page shows them beside the comparison

## Decision

When the scenario writer returns, the studio stores what the critic still found with the waiting version: the number of revisions, the major faults it could not resolve and the minor ones. The body of the version holds them under `review`. The page shows the major faults and the count of minor ones in the comparison block of a waiting version, so the parent reads what the writer could not fix before she keeps the version.

Once this is accepted, a generation that stops at its ceiling no longer looks as clean as one that passed the critic. What still doesn't work: the page does not say how to fix a fault, and a kept version carries its review in the body for ever.

## Why

A live run on 2026-11-15 wrote a scenario of 18 encounters that stopped at six revisions with four major faults, and `startGeneration` kept the scenario and dropped the rest. A parent who keeps such a version without reading the findings plays a scenario the critic had marked as broken.

## Alternatives

| Option                          | Better at                          | Why it lost                                                               |
| ------------------------------- | ---------------------------------- | ------------------------------------------------------------------------- |
| Do nothing                      | No new field                       | The parent cannot tell a clean version from one the critic rejected.      |
| Refuse a version with faults    | Nothing flawed reaches the parent  | A flawed version is still a starting point to edit, and a run costs about a dollar. |
| Show the findings (this)        | The parent decides with the facts  | She must read them.                                                       |

## What it costs

A field in the body of a generated version, and a few lines in the comparison. Reading the findings is the parent's work.

## What would reverse it

- Findings that the parent never reads in a month of use, which would call for a stricter rule, such as refusing a version with major faults.

## Consequences

The body of a generated version gains `review`. The studio specification states it.

## How I will know it was realised

1. A generation whose writer reports unresolved faults stores them in the waiting version, in an integration test.
2. The comparison of a waiting version lists the major faults, in a browser test.

## What this does not settle

- A fix for a fault, or a run that continues past the ceiling.

## Plan

1. The waiting version carries the critic's findings, and the comparison shows them (REQ-8642). It touches `src/server/studio/generate.ts`, `src/client/studio-form.ts` and `content/i18n/ru.json`, `en.json` and `nl.json`.
