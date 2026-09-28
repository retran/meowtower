---
id: REQ-7204
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7204

Before a parse request leaves the Mac, the engine MUST replace every fraction word, «половина» (a half), «треть» (a third) and «четверть» (a quarter), and every ordinal from «первый» (first) to «тысячный» (thousandth), in every gender and case, with a token d1 to dk in text order.

A parser that sees «n1 n2 от n3» can't tell a denominator from a count, and the class tells it the word's role without its value. An ordinal used as a position, such as «на третьей полке» (on the third shelf), is masked too, and the graph leaves it unused like irrelevant data, because telling the two uses apart needs the parse that comes after the masking. «Целых» (wholes) stays a word, because it marks a whole part and carries no value. RES-4260 starts the set at «второй»; the requirements step adds «первый», because it ends compound ordinals such as «сто первый» (REQ-7206) and a lone «первый» left unmasked would leave the Mac.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
