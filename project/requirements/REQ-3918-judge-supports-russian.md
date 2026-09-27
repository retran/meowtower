---
id: REQ-3918
artifact: requirement
topic: judge
class: non-functional
status: approved
revised: 2026-09-27
elaborates: RES-3910
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-3918

A model on the Mac whose model card lists its supported languages without Russian MUST NOT answer a judge check.

The player writes in Russian, and a model not trained on it misreads her text: Llama Guard 4 scores 37.7 on Russian RTP-LX prompts against Qwen3Guard-4B's 90.7. The list is a first filter only: a card that gives a count of languages and no list goes to the Russian test set, which is the real gate, and the hosted judge and the safety model are held to that test set alone.

Written from RES-3910 on the owner's instruction of 2026-09-27.
