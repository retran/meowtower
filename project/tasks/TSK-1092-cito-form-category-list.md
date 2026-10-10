---
id: TSK-1092
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7058, REQ-7060, REQ-7062, REQ-7074]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The MVP's Cito form takes an optional list of category entries, and no model call reads it

After this task, the Parent Room's Cito result form takes an optional list of up to 16 category entries, each with a category, a signal and a deviation, the list waits in the log for the post-MVP screen, and a lint check keeps the Director, the model and the gateway from reading it.

## Acceptance criteria

1. Given the form, when the parent saves a result with 16 category entries, then it saves; given 17 entries or a typed field of 81 characters, then it refuses with `category_list_too_long`, names the limit it met and keeps what was typed (REQ-7058). Closed by: a Playwright test on the form and a schema test.
2. Given a category entry, when the parent picks its category, then the form offers the eight listed categories, `lib:getallen`, `lib:verhoudingen`, `lib:meten-en-meetkunde`, `lib:verbanden`, `lovs:getallen`, `lovs:optellen-aftrekken`, `lovs:vermenigvuldigen-delen` and `lovs:meten-tijd-geld`, each labelled with its system, «Leerling in beeld» or «LOVS», or lets the parent type the printout's words (REQ-7060). Closed by: a Playwright test.
3. Given a signal, when the parent picks it, then the form offers below and notable, below and very notable, not notable, above and notable, above and very notable, or `other` with the printout's own words, and takes a deviation as an integer from -100 to 100 or no value (REQ-7062, REQ-7058). Closed by: a Playwright test and a schema test.
4. Given an `external_test_recorded` written before the field existed, when the schema parses it, then it parses unchanged under the same schema version, and a correction replaces the whole list. Closed by: a schema test with a stored fixture event.
5. Given a 30-day simulated log with and without `categories` on its Cito events, when the property test computes `node_estimates`, `node_snapshots`, the Director's values and every gateway request body, then they are byte-identical; given a read of `categories` in `src/engine/director/`, then `cito_categories_scope` fails and names the file (REQ-7074). Closed by: the property test and the lint rule's fixture test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the optional `categories` field to ADR-0290's results form and to the payload of `external_test_recorded`. In the MVP nothing reads the list except the whole-log export, so the field waits in the log. The form's labels are strings in `ru.json`. Add the lint check `cito_categories_scope`: it fails when a file outside `src/parent/school/`, the event's schema module and ADR-0290's results form module reads the `categories` field. ADR-0290's projection of Cito results, which the Director reads for horizons, folds named fields and never `categories`.
## Depends on

Nothing within this epic. The epic realising ADR-0290 supplies the results form, the event and the projection this task extends; the task runs against its fixtures until it exists.

## Evidence

Not yet.

## Left alone

The fold of categories and the screen that reads them, which TSK-1096 and the later tasks build after the MVP, and the Dutch memo's new lines, which TSK-1103 adds.
