---
id: TSK-1041
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6686, REQ-6688]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# No model request can carry a report figure, a probe result or a hypothesis

After this task, every model request schema refuses a field that could hold a report figure, a probe result or a hypothesis, and the content request that writes the probe's texts has no field for any of her data.

## Acceptance criteria

1. Given every model request schema, when a fixture payload adds a share, a count, a probe result or a hypothesis, then the strict schema refuses it for each schema (REQ-6686). Closed by: a test that walks the schema list.
2. Given the content request, when a fixture payload adds any field of the player's, then it refuses it (REQ-6688). Closed by: a schema test.
3. Given the routes before and after addendum 2's report parts, when the route list is compared, then the PDF snapshot and the profile add no route that a model request or the export can reach (REQ-6686). Closed by: a route-list test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the schema walk to the gateway's tests. The figures aren't among the five kinds of data ADR-0210's list lets out, and no request class has a field for them. The probe's texts are written under ADR-0430's offline role with a `ContentRequest`, which has no field for her data, because a model outside the Mac writes them and nothing of hers may leave it.

## Depends on

Nothing in this epic.

The epic realising ADR-0100 supplies the request schemas; the test holds whichever exist when it runs and fails on a schema that is added with a loose field.

## Evidence

Not yet.

## Left alone

The probe's offline run itself, which the epic realising ADR-0430 builds.
