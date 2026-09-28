---
id: REQ-6112
artifact: requirement
topic: sound
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6112

While music and effects are both off, the client MUST NOT create an audio context, start playback of any media element or request any sound file.

A browser test runs muted by default, so a test can prove silence only by counting these three acts and finding none. An audio context that is created but suspended plays nothing, and it still counts, because the test can't tell it from one that plays.

Written from RES-4110 on the owner's instruction of 2026-09-28.
