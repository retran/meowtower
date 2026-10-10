---
id: TSK-0628
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3602]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A frame is placeholder text with a record, and code fills it with the engine's numbers

After this task, `src/frames/frame.ts` holds the frame record and `fillFrame`, the one function that turns a frame into task text, so model text enters a task only as placeholders that code replaces.

## Acceptance criteria

1. Given the frame «{hero} купила на Ярмарке Весов {a} {item:gen} по {b} монет...» and a task whose engine fixed `a` = 3 and `b` = 12, when `fillFrame` runs, then every placeholder is replaced, the numbers come from `formatQ`, the item takes its genitive form from the item dictionary, and the result holds no `{` (REQ-3602). Closed by: a unit test with one fixture for each placeholder kind.
2. Given a frame record, when it is created, then it holds its structure, locale, floor, characters and the role of each number placeholder, and its content hash is the same for the same text and differs after a one-letter edit (REQ-3602). Closed by: a unit test.
3. Given a player-given name that carries the numeral flag of ADR-0110, when `fillFrame` fills `{familiar}`, then the canon name of that familiar's kind stands in its place and no name the player gave reaches the task text (REQ-3602). Closed by: a unit test with the flag set and unset.
4. Given the rendering path of every word-problem and context template, when the static check looks for a string that reaches a task view from a model reply, then none does except through `fillFrame` (REQ-3602). Closed by: a type test, because the task text type accepts only the output of `fillFrame`, and a fixture that assigns a raw string and fails to compile.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Define `Frame` with the fields ADR-0130 lists and a `FrameText` type that only `fillFrame` produces. Take the hash as SHA-256 over the NFC text; I chose it because the log already holds hashes of that form. Placeholders are `{hero}`, `{familiar}`, `{a}`-style number slots, `{item:case}` for a counted noun and a name slot; a slot names its grammatical case after a colon and `fillFrame` asks the item dictionary for the form.

## Depends on

The epic realising ADR-0040 supplies `generate`, `formatQ` and the item dictionary with its case forms. Until it lands, this task runs on the fixture dictionary and the numbers the fixture templates give. The numeral flag comes from the epic realising ADR-0110; until then the flag is a boolean argument of the function.

## Evidence

Not yet.

## Left alone

Which frame a task gets, which TSK-0636 decides, and the checks a frame passes before it is accepted, which TSK-0629 to TSK-0632 build.
