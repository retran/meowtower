---
id: TSK-1037
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6648, REQ-6650]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Three states have node labels, the fourth has none, and «на пороге» names one label only

After this task, no node label means "understands beyond the standard format", and a build check fails the Russian string file when «на пороге» appears under any key other than the node label of ADR-0220.

## Acceptance criteria

1. Given the set of node labels, when it is read, then it holds «Пока не освоено», «Понимает, нужна скорость» and «на пороге» for the first three states and no label for the fourth (REQ-6648). Closed by: a unit test over the label list.
2. Given a node that holds that fourth state together with each of the other three, when the report is built, then the node keeps its own label and the state shows only through the profile's transfer and conceptual understanding dimensions and the ceiling above 1S (REQ-6648). Closed by: a report test over a fixture log.
3. Given a fixture string file that holds «на пороге» under a key other than the node label's, when the string check runs, then it fails with `threshold_label_reused` (REQ-6650). Closed by: a group 1 check and its fixture.
4. Given the weekly breakdown's bin for rung 1, when its string is read, then it is «хватило первой ступени» (REQ-6650). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the string check to ADR-0190's group 1, and add the bin's string under `parent.dynamics.bin.rung1` where the file doesn't hold it yet; the key is my choice and the epic realising ADR-0400 reads it. The fourth state can hold beside any other, so a label from one form's rule would let a new stream decide a node's state, which ADR-0210 forbids until activation. One word for an attempt class and a node label would let the parent read "5 on her own, 1 on the threshold" as a node state.

## Depends on

Nothing in this epic.

The epic realising ADR-0220 supplies the node label «на пороге» and its key.

## Evidence

Not yet.

## Left alone

The weekly breakdown's bins themselves, which the epic realising ADR-0400 builds.
