---
id: REQ-5664
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4060
verification: behavioural
---

# REQ-5664

The report MUST show a planning error in a word problem, a plan scored anything other than `correct`, apart from a modelling error and a calculation error.

The model choice and the answer can't tell "doesn't know what to find" from a modelling or calculation error, and the plan can. Counting every label other than `correct` is the default chosen by the requirements step; the logged label lets the report split the four faults later.

Written from RES-4060 on the owner's instruction of 2026-09-28.
