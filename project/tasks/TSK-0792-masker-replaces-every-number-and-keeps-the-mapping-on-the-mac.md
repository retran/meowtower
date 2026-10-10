---
id: TSK-0792
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5204]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The masker replaces every number in her cleaned text with a token, and the map from tokens to numbers never leaves the Mac

After this task, a masker replaces each digit run and each Russian number word of the numeral file in her cleaned text with `n1` to `nm` in text order, a content test shows that the numeral file holds every case form of the words generated from the OpenCorpora dictionary, and the mapping stays in the riddle's server state and the log.

## Acceptance criteria

1. Given every case form of the number words generated from the OpenCorpora dictionary, a source the file wasn't written from, when each is looked up in `content/numerals.ru.json`, then each is found (REQ-5204). Closed by: the content test over the dictionary's forms.
2. Given the dictionary's forms and the reference set's number words, when the masker runs on texts that hold them, then no digit and no numeral word is left in the output (REQ-5204). Closed by: a masking test.
3. Given the collective numerals from «двое» to «десятеро», «полтора», «десяток», «дюжина» and «сотня» in every case form, when they are in the text, then they are masked like any number (REQ-5204). Closed by: the masking test.
4. Given a masked text, when every request class's schema is read, then none has a field that can hold the mapping from tokens to numbers, and the mapping is in `compose_submitted` and the server state alone (REQ-5204). Closed by: a schema test and a code search.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the masker as step 3 of her text's path (TSK-0793). It reads the word forms from `content/numerals.ru.json`, which ADR-0110's numeral check already reads and which gains the collective numerals above in every case form. A second language adds its own numerals file, as ADR-0160 requires.

The words ADR-0230 leaves unmasked, such as «вдвое», «втрое», «половина», «пополам», «пара» and ordinals, pass as ordinary words; a graph that needs one as a number names no token, so the engine refuses it and the riddle ends `unparsed`. ADR-0440 widens the masked set with `d1` to `dk` tokens, and its epic extends this masker.

## Depends on

Nothing.

The epic realising ADR-0110 supplies the numeral file and its check; this task adds forms to the file as it stands.

## Evidence

Not yet.

## Left alone

The `ParseRequest` class and its guard, which the epic realising ADR-0210 builds, and the safety path, which TSK-0793 holds.
