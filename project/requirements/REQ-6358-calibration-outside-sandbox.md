---
id: REQ-6358
artifact: requirement
topic: screens
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6358

The adult's calibration of a device type's fluency threshold MUST run in the Parent Room and never in the sandbox.

Calibration exists to write to the player's log, where it sets her thresholds, and nothing the sandbox writes reaches that log except the confirmed actions, of which calibration is not one.

Written from RES-4130 on the owner's instruction of 2026-09-28.
