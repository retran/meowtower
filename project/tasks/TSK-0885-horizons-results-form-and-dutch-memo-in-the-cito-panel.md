---
id: TSK-0885
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5814, REQ-5816, REQ-5818, REQ-5884, REQ-5886]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent sets horizons and enters Cito results, and a result moves the active horizon

After this task, the Cito panel holds the horizons with their dates, the results form and the Dutch memo, and the `horizons` projection names the active horizon from the defaults, the parent's `horizon_set` events and the entered results.

## Acceptance criteria

1. Given a log with no event, when `horizons` is read, then it holds `cito:M7` on 2027-01-15 and `cito:E7` on 2027-05-15 and names `cito:M7` active; given a `horizon_set` that changes a date, adds `cito:M8` or sets a date of `null` on `cito:E7`, then the projection shows the change (REQ-5814). Closed by: a projection test, and a route test that finds `401` for `PUT /api/parent/cito/horizons/:horizon` without the parent session.
2. Given a result entered for `cito:M7` in the subject reading, when `horizons` is read, then `cito:E7` is active; given a later result for `cito:E7` and no horizon after it, then no horizon is active (REQ-5816). Closed by: a projection test.
3. Given a horizon date that passed with no result, when `horizons` is read, then the horizon stays active, and 45 days after the date the notice list holds one line asking for the result or a new date, once for that horizon (REQ-5816). Closed by: a projection test with a mocked clock.
4. Given a record, data file or string that names a moment as `M7` alone, when group 1 runs, then the moment-identifier check fails and names it; given every moment written as `cito:M7` or through the formatter that prints «Cito M7», then it passes (REQ-5818). Closed by: the check's test with one failing and one passing fixture.
5. Given the results form, when it saves a result with every field empty except the moment and the subject, then it is saved; given a result with every field, `<` in the functioneringsniveau and a level on the A to E scale, then it is saved with them; given a correction, then a new event names the result it replaces (REQ-5884). Closed by: a form test and a route test of `POST /api/parent/cito/results`.
6. Given the Cito panel, when it opens, then `parent.cito.memo` shows in Dutch with a Russian gloss and names the level of the test taken, the expert view of the group report and the split between bare and context items (REQ-5886). Closed by: a panel test that reads the three names.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `content/cito.horizons.json` with the two defaults, the `horizons` projection, the events `horizon_set` and `external_test_recorded` with their schemas, and the routes `PUT /api/parent/cito/horizons/:horizon` and `POST /api/parent/cito/results` on the panel TSK-0884 opens. The active horizon is the earliest horizon with no entered result, and a result in any subject ends it, as ADR-0290 chose. A date that passes does nothing until the 45th day, when the notice appears once.

The result's fields are the moment, the test taken and its level, the vaardigheidsscore, the functioneringsniveau with `<` and `>` allowed, the referentieniveau, the level with its scale of I to V or A to E, the subject, an optional split between bare and context items, an optional expected test advice and a note. A correction is a new event with `replaces`, because the log is append-only.

The moment identifier matches `^cito:[BME][3-8]$`. Add the check to group 1 of the verify command and a formatter that prints «Cito M7» for parent text.

The memo is a fixed string under `parent.cito.memo` in `content/i18n/ru.json`. Write the Dutch text and its Russian gloss from the three items REQ-5886 names.

## Depends on

- TSK-0884 (blocking): it opens the Cito panel and its route that this task adds sections to.

## Evidence

Not yet.

## Left alone

The list of category entries on the results form, which ADR-0420's epic adds to the same event. What the Director does with the active horizon, which TSK-0888 builds. The goal list and its import, which come after the MVP with ADR-0310.
