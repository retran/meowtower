---
id: REQ-2522
artifact: requirement
topic: platform
class: non-functional
status: approved
revised: 2026-09-27
elaborates: RES-2500
verification: behavioural
---

# REQ-2522

After 5 wrong attempts at a pairing code or at the PIN, the server MUST refuse further attempts of that kind for 15 minutes.

Default chosen by the requirements step: the server counts wrong attempts in a row, separately for pairing codes and for the PIN, and a correct entry resets the count.
