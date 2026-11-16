---
id: REQ-7692
artifact: requirement
topic: parent-room
class: functional
status: approved
revised: 2026-11-16
elaborates: RES-4322
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7692

The Parent Room MUST show a light and a dark theme, following the device's light or dark setting until the parent picks one and keeping the parent's pick on the server.

The owner asked for both themes on 2026-11-16. The pick lives on the server because the game keeps no data in the browser's storage, and it reaches every device the parent opens the room on.
