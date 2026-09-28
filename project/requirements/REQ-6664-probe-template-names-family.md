---
id: REQ-6664
artifact: requirement
topic: templates
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4200
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6664

Every probe template MUST name the probe family it belongs to.

The probe's report compares presentations within a family, and `probe_family_created` records each family, so a template outside a named family can't be placed in either.

Written from RES-4200 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
