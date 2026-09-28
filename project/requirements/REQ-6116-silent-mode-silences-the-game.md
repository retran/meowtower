---
id: REQ-6116
artifact: requirement
topic: sound
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6116

While the iPad's silent mode is on, the game MUST play no sound, even when the parent has turned music or effects on.

Safari lets silent mode silence a page's audio only while the page leaves its audio session at the default type; the `playback` type overrides the switch. A browser test can't set the silent switch, so the device run of REQ-6162 is this requirement's check.

Written from RES-4110 on the owner's instruction of 2026-09-28.
