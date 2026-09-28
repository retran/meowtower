---
id: REQ-7202
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
supersedes: [REQ-5202]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7202

Before a parse request leaves the Mac, the engine MUST replace every number in the player's composed text with a token n1 to nm in text order, treating a decimal written with a comma or a point, a fraction written with a slash and a mixed number written in digits each as one number, and masking every Russian number word of the set below.

The set holds every cardinal numeral, compound ones such as «сорок восемь» (forty-eight) included, every collective numeral from «двое» (two) to «десятеро» (ten), «полтора» (one and a half), «десяток» (ten), «дюжина» (a dozen), «сотня» (a hundred), «пара» (a pair, value 2) and the multiplicative words from «вдвое» (twice) to «вдесятеро» (ten times), each in every case form. So «2,5» and «3/4» each become one token, and a word of the set left unmasked fails the requirement. A digit run split at a comma would give the parser two tokens, and it can't join them because it may name no number. REQ-7204 masks fraction words and ordinals as a class of their own. Her digits are part of her answer and stay on the Mac, and a model that never sees a number can't compute one. REQ-5292 says what happens if the masked parse can't pass its acceptance test. Default chosen by the requirements step: a mixed number in digits is a whole number, a space and a slash fraction, such as «2 1/2».

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
