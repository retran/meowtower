---
id: REQ-3910
artifact: requirement
topic: judge
class: non-functional
status: approved
revised: 2026-09-27
elaborates: RES-3910
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-3910

A judge model running on the parent's Mac MUST give no model answer to a request from any device other than that Mac.

Every check has to pass through the server's model gateway, and a judge open to the home network lets the iPad or any other device skip it. A request from the server's container on the Mac counts as coming from the Mac; a reply that carries no model answer, such as a refusal or a health status, meets this.

Written from RES-3910 on the owner's instruction of 2026-09-27.
