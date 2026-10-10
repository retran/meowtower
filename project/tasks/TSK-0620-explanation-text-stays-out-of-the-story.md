---
id: TSK-0620
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0120
closes: [REQ-0634]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An explanation's text never enters a story event or the Master's memory

After this task, the log records `explanation_shown` with the id of its `explanation_bought` event, the source and the variant id or failure reason and never the text, and no Master or planner request holds a run of a shown explanation.

## Acceptance criteria

1. Given a shown explanation, when `explanation_shown` is read, then it holds the `explanation_bought` id, the source and the variant id or reason, and no text field exists in its schema (REQ-0634). Closed by: a schema test.
2. Given a simulated adventure with explanations, when every Master and planner request in `llm_log` is searched, then none holds a 20-character run of any shown explanation (REQ-0634). Closed by: a test over the recorded requests.
3. Given the Director's story events and story memory, when they are searched for the explanation's text, then none holds it, and `explanation_shown` is not a story event the Master's context reads. Closed by: a test over the order builder's inputs.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the event's schema if EPC-0020's lack it, keep the explanation text only in `explain_cache`, and add the search to the test suite. ADR-0110's order builder reads story events only, and this task adds the test that `explanation_shown` isn't among them.

## Depends on

- TSK-0615 (blocking): the event is written where that task shows an explanation.

The epic realising ADR-0110 builds the order and the planner's context; until it exists the test reads the builder's input list from a fixture.

## Evidence

Not yet.

## Left alone

The cache's content, which TSK-0616 owns, and an emptied cache, which loses no fact about play because the log holds which variant or source she saw.
