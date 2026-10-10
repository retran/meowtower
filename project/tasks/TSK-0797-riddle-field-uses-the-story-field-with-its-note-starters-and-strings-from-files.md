---
id: TSK-0797
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5266, REQ-5268]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The riddle's field is the story's free-text field with its note and three starters, and every string comes from the language files

After this task, the free-text field opens at a riddle as it does at the six other places REQ-5268 lists unless the parent switched it off, it shows the note «Эту историю могут читать мама и папа» (Mum and Dad can read this story), the three starters «У…было…», «Купили…» and «Шли…», the paraphrase templates and the two confirmation buttons, and no string sits in a component.

## Acceptance criteria

1. Given every place REQ-5268 lists, when the free-text field's opening is read, then it opens at entering a floor, before a Guardian, at the campfire on a rest stop, at the session finale, on meeting a new creature, at a riddle and in «Свободное перо» once it has opened, and nowhere else (REQ-5268). Closed by: a state test over the order kinds.
2. Given the parent has switched the field off, when a riddle is offered, then the field doesn't open and the riddle is a card riddle (REQ-5268). Closed by: the state test with the setting off.
3. Given a text riddle, when the window is read, then it holds one field with the note, the three starters, the 600-character and 4-sentence cap, «Не знаю», «Готово» and the inactive thread button (REQ-5268, REQ-5266). Closed by: a Playwright test.
4. Given the field's label, the starters, the paraphrase templates and the two buttons «Да, так» (Yes, that's it) and «Нет, я имела в виду другое» (No, I meant something else), when the build's string check runs, then each comes from `content/i18n/ru.json` and a string hard-coded in a component fails it (REQ-5266). Closed by: the string check's output and a fixture component.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the list of order kinds on which the free-text field opens in ADR-0110 to REQ-5268's list, which adds the riddle and «Свободное перо». The riddle's field is the story's free-text field, so it shows the note REQ-1632 requires, because the parent reads her riddles; I took the requirement's default of one field and not a second one with a copied note.

I took the text cap of 600 characters and 1 to 4 sentences as ADR-0230 chose it, at four sentences of about 150 characters. Put the field's label, the starters, the buttons, the waiting line, the `unparsed` line and the paraphrase templates in `content/i18n/ru.json`, because a string hard-coded in a component has to be found and moved before English or Dutch can ship.

## Depends on

- TSK-0790 (blocking): the states whose windows this task fills.

The epic realising ADR-0110 supplies the field and its order kinds, and the epic realising ADR-0330 «Свободное перо»; this task changes the list in place and treats «Свободное перо» as a name.

## Evidence

Not yet.

## Left alone

The look of the field, which ADR-0150 and the design system own, and the parent's setting that switches the field off, which ADR-0110 keeps.
