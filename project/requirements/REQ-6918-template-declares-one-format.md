---
id: REQ-6918
artifact: requirement
topic: templates
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4230
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6918

A template MUST declare its format only as the single value bare or context, never as a list of formats.

The owner's addendum 2 asks for a `formats` list on templates. REQ-5862 already has each template declare one format, which the half-bare rule and the report read, and a list beside it would declare one fact twice.

Written from RES-4230 on the owner's instruction of 2026-09-28 to process addendum 2.

## Open review findings

The first agent review found that this requirement contradicted a draft from RES-4200 asking every template to declare its contexts and its formats. That draft was removed from the record on 2026-09-28 before this step ended, so the conflict no longer holds, and the fix was left to its author.
