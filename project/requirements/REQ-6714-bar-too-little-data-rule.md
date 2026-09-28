---
id: REQ-6714
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4210
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6714

When a bar other than the language and format bar rests on fewer than 10 observations or its 80 % interval is wider than 30 percentage points, the bar MUST show «мало данных» (too little data) with its count and no value.

This is the profile's own floor, and REQ-6718 applies it to the gap bar's two shares. At 80 % the Wilson interval narrows under 30 points at about 20 observations near a share of 0.5 and at about 10 near the ends, and below 10 one answer moves a share by more than 10 points.

Written from RES-4210 on the owner's instruction of 2026-09-28 to process addendum 2.
