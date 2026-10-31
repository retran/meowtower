---
id: TSK-1205
artifact: task
status: approved
revised: 2026-10-31
epic: EPC-0480
closes: [REQ-7528]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The key hints are checked on Windows

After this task the hints of the answer field are right on Windows, where the layouts were read from the macOS layout Russian - PC and never seen on a Windows machine.

## Acceptance criteria

1. Given a Windows machine with the Russian and the English layout, when the player types a decimal, a fraction, a pair and a time, then each hint names the key that types its symbol. Closed by: a run on that machine.

## What to do

Run the answer field on Windows with each layout, compare each hint with the key that types its symbol, and correct the language file where they differ.

## Depends on

- TSK-1204 (blocking): the hints this task checks.

## Evidence

Not yet.

## Left alone

macOS and the iPad, which TSK-1204 covers.
