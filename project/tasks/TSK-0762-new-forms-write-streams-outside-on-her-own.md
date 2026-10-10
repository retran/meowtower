---
id: TSK-0762
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5024, REQ-5026, REQ-5028]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every new form writes a stream of its own, and no stream enters "on her own" until a model version admits it

After this task, the engine routes each attempt whose task's `forms` list is not empty to a stream of its own, drops that attempt from every estimate, state, probe and block while the active model version doesn't admit the form, and keeps `admittedForms` empty in model v1.

## Acceptance criteria

1. Given attempts whose `forms` hold `compose`, `plan`, `grouping`, `bridge`, `surplus` or `missing`, when the "on her own" estimate and every state, probe and block are computed, then each equals the one computed without those attempts, and each stream's projection holds them (REQ-5024, REQ-5026). Closed by: a model test over a fixed log.
2. Given the stream names `compose`, `estimate`, `grouping`, `plan`, `bridge`, `surplus` and `missing`, when the projections are listed, then each has its own projection that the recompute rebuilds like any other, and none changes a node's "on her own" state (REQ-5024). Closed by: a recompute test.
3. Given a word problem of the surplus or missing subtype, when it is shown, then its `forms` hold `surplus` or `missing`, and its attempt feeds that stream and stays out of its node's "on her own" estimate (REQ-5028). Closed by: a model test with a fixture subtype.
4. Given a model version whose `admittedForms` holds a form, when ADR-0060's activation rule runs without held-out log-loss and calibration evidence that beats the active version, then the version isn't activated and the form stays out (REQ-5026). Closed by: the activation rule's test with a fixture version.
5. Given an item with an estimate, when its attempt is read, then its `forms` are empty and the exact answer counts in "on her own", and the `estimate` stream reads the `estimate` field and never `forms` (REQ-5024). Closed by: the model test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add to ADR-0060's observation rule one more reason to drop an attempt from every estimate, state, probe and block, as ADR-0360 amends ADR-0210: its task's `forms` holds a form the active model version doesn't admit. Add `admittedForms` to the model's parameter file, empty in model v1. A form enters that list only through ADR-0060's activation rule, so this task adds no refit and no way to put a form in the list by hand. The refit tool waits until after the MVP.

Add a projection for each stream name above, each fed by the attempts whose `forms` holds its name. Each stream keeps its own counts, which the report may read and the Director may read for placement, and which never change a node's "on her own" state. The answer after a solution plan still counts, as REQ-5646 requires, and `plan` keeps only the plan choice out. The `estimate` stream reads `attempt_submitted`'s `estimate` field, as ADR-0240 sets, so this task registers its name and ADR-0240's epic fills it.

## Depends on

- TSK-0761 (blocking): the `forms` field on `item_shown`.

The epics realising ADR-0220, ADR-0230, ADR-0240, ADR-0260, ADR-0270 and ADR-0310 supply the forms; this task runs on fixture attempts with each name in `forms` and leaves their templates and screens to those epics.

## Evidence

Not yet.

## Left alone

Each stream's own statistics beyond a count, and the refit tool, which ADR-0060 defers until after the MVP.
