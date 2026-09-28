---
id: REQ-5202
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5202

Before a parse request leaves the Mac, the engine MUST replace every number in the player's composed text, digit runs and Russian number words alike, with a token n1 to nm in text order.

The Russian number words are every cardinal numeral, compound ones such as «сорок восемь» (forty-eight) included, every collective numeral from «двое» (two) to «десятеро» (ten), and «полтора» (one and a half), «десяток» (ten), «дюжина» (a dozen) and «сотня» (a hundred), each in every case form, so «шестью» and «пятеро» are masked; a word of that set left unmasked fails the requirement. Default chosen by the requirements step: the set of words, because the record didn't fix one.

Her digits are part of her answer and stay on the Mac, and a model that never sees a number can't compute one. REQ-5292 says what happens if the masked parse can't pass its acceptance test.

Written from RES-4020 on the owner's instruction of 2026-09-28.
