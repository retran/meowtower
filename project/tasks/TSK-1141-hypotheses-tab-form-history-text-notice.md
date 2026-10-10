---
id: TSK-1141
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: [REQ-7308, REQ-7310, REQ-7366, REQ-7370, REQ-7372]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The tab «Гипотезы» holds the form, the node links, the history and the text-criteria notice

After this task, the Parent Room has a tab «Гипотезы» where the parent writes a hypothesis with what would confirm it and what would refute it, links it to nodes, edits, closes and reopens it, and reads each earlier version with the date it was replaced, and every hypothesis shows that the report doesn't check its criteria.

## Acceptance criteria

1. Given a hypothesis edited three times, when the parent opens its history, then three earlier versions of the text, criteria and links are listed, each with the date it was replaced (REQ-7308, REQ-7372). Closed by: a Playwright test over three edits.
2. Given the form, when the parent writes a hypothesis or changes its criteria, then the page shows no percentage and no state label, and the form's route returns node names and nothing else about a node: no state, share, count or estimate (REQ-7310). Closed by: a schema test of the route's reply and a Playwright test that searches the form for `%` and for each `parent.hypotheses.*` label.
3. Given the form, when the parent picks nodes, then she can link a hypothesis to 0 to 10 of them and the links show in the list and in the history (REQ-7366). Closed by: a Playwright test.
4. Given a hypothesis whose criteria are text alone, when the tab shows it, then the line «Критерии записаны текстом — отчёт их не проверяет» stands in place of a label, it differs from «мало данных», and it comes from the per-language file (REQ-7370). Closed by: a Playwright test and a test that the string is read from `content/i18n/ru.json`.
5. Given 21 open hypotheses, when the 21st is saved, then the tab shows one notice and refuses nothing, and the notice shows again only after the count falls to 20 or less and rises above 20. Closed by: a Playwright test over 21 saves, a close and a reopen.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the tab to the Parent Room beside its other panels, the form with a text, two criteria fields and a node picker, the list, the history and the close and reopen actions. Read every string from `content/i18n/ru.json` under `parent.hypotheses.*`, because ADR-0180's check of `parent.*` values reads them and a string in a component has to be found and moved before a second language ships. The history lists versions from the log's `hypothesis_recorded` and `hypothesis_updated` events by `seq`, with the replaced version's date taken from the event that replaced it. The node picker reads node names only, from the route TSK-1140 builds.

The form's notice for more than 20 open hypotheses is a choice ADR-0450 made; it shows once on each rise above 20, and the rise is counted from the log so a reload doesn't show it again.

## Depends on

- TSK-1140 (blocking): the form saves through its routes and the history reads its events.

The epic realising ADR-0050 supplies real node names; the picker lists the fixture nodes of the existing tests until then.

## Evidence

Not yet.

## Left alone

Numeric conditions, links to dimensions, presentations and school goals, and every computed label, which TSK-1143 to TSK-1147 add after the MVP.
