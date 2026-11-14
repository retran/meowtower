---
id: ADR-3370
artifact: adr
status: approved
revised: 2026-11-14
addresses: [REQ-8630, REQ-8632]
supersedes: []
concerns: [cost]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3370. The studio shows a generation's cost in dollars and says what the figure rests on

## Decision

Before a generation runs, the studio shows its cost as a range in US dollars. The range is the fewest and the most model calls a run makes, from `GENERATION_CALLS`, times a price for one call. The price is the mean cost of the last 50 calls of the showrunner role in the gateway's log when at least 10 exist, and the page says the figure is measured over those calls. Where fewer exist, the price is a default of 0.05 USD a call, and the page says the figure is a rough default with no earlier calls to measure. Each end of the range rounds up to the next cent. The page keeps showing the month's spend so far beside it.

This replaces the rule of REQ-8608, which this decision withdraws, and the sentence in ADR-3360 that a dollar estimate waits for measured runs: the owner instructed on 2026-11-14 that the estimate is always in dollars, so the page shows one from the first run and says what it rests on.

Once this is accepted, a parent sees a dollar range before every generation, with the basis named. What still doesn't work: the default is my choice and traces to no log, and the estimate covers the model calls of one run and not the retries a provider makes.

## Why

RES-4320 found that the one-run figure of 0.361 USD in earlier records appears in no log or test, so a figure from it would read as a promise. A range from the gateway's own log has no such problem, and a default that the page names as a default doesn't pretend to be more. The default of 0.05 USD a call comes from dividing that unverified figure by about seven calls, so it is a rough guess, and the page says so.

## Alternatives

| Option                                    | Better at                                   | Why it lost                                                                                                |
| ----------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Do nothing                                | Keeps the rule of REQ-8608                  | The owner instructed that the estimate is always in dollars.                                               |
| A fixed dollar figure from the old record | One number, no code to read the log         | It traces to no log, and it never improves as real calls are measured.                                     |
| Price from the model's token rates        | Needs no earlier calls                      | It needs the size of the prompt and reply before the run, which only earlier calls tell; deferred.        |
| Mean of earlier calls with a stated default (this) | Improves by itself, names its basis | The default is a guess until 10 calls exist.                                                               |

## What it costs

A query of the gateway's log on each estimate, and a constant that someone must keep honest. A wrong default misleads for the first ten calls, which is why the page names it.

The strongest objection: a measured mean over calls of different sizes hides that a draft call costs more than a critique. The range from the fewest to the most calls spreads the error, and no better measure exists before a run.

## What would reverse it

- Ten runs whose real cost falls outside the range shown before them more than twice, which would show that the mean per call is the wrong basis.

## Consequences

REQ-8608 is withdrawn and REQ-8630 and REQ-8632 replace it. The studio specification states the new rule in place of the old one. The route `GET /nodes/:id/generate/estimate` gains the range and its basis, and the page words them in three languages.

## How I will know it was realised

1. The estimate route returns a dollar range and a basis, and the basis is the default with fewer than 10 earlier calls and measured with 10 or more, in an integration test.
2. The generator panel shows the range and names its basis before a run, in a browser test.

## What this does not settle

- A price from token rates before any call exists.
- The estimate for a run that retries.

## Plan

1. The estimate shows a dollar range and its basis before a generation (REQ-8630, REQ-8632). It touches `src/server/studio/generate.ts`, the estimate route, `src/client/studio-generate.ts`, `content/i18n/ru.json`, `en.json` and `nl.json`.
