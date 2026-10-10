---
id: TSK-0987
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0350
closes: [REQ-2648]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Parent Room tells, for each check on her text, where it runs and which company reads it

After this task, the Parent Room's page on what leaves the Mac lists each check on her text with where it runs now and, for each company that can read the text, the fallback included, its name, its country and whether it keeps any of it, built from the route table when the parent opens the page.

## Acceptance criteria

1. Given three configurations, no local judge, one judge taking some checks and a judge that is `down`, when the page is built for each, then every row equals the route table and the judges' states (REQ-2648). Closed by: a disclosure test that compares the rows.
2. Given a check whose route is local while its judge isn't `up`, when the page is built, then the row shows its standby route and the line «Сейчас проверка идёт через интернет» (right now the check goes over the internet), whose string sits in the language file (REQ-2648). Closed by: a component test and a string-file check.
3. Given a company's row in `content/providers.json`, when the page lists it, then its name, country and retention come from that row, and opening the page appends no event and sends no notice (REQ-2648). Closed by: a unit test over two provider rows.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Build the page's list from `resolveJudgeRoute` and the judges' states at the moment the parent opens it, so it matches the configuration the gateway runs. A check that stays hosted or falls back still sends her text to a company, and the answer changes as checks move after the bake-off, so the page is never cached. The Master's reading of her story material is a separate page under REQ-2636 and stays out of this list.

## Depends on

- TSK-0985 (blocking): the page reads the route table that task builds.

The epic realising ADR-0180 supplies the Parent Room and its page on what leaves the Mac; until it exists, the task runs on a stand-in page route under `/api/parent/`, and the page's place among the Parent Room's screens stays with that epic. The epic realising ADR-0160 supplies the language file.

## Evidence

Not yet.

## Left alone

The company, country and retention facts themselves, which the gateway's start-up check of `content/providers.json` owns.
