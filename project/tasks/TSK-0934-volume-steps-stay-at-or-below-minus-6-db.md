---
id: TSK-0934
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6106]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every volume step of both channels stays at or below -6 dB, so music and effects together never pass the file's peak

After this task, each channel has its own gain under the one gain node, step 5 is -6 dB, each step below takes 6 dB more off and step 0 plays nothing, and a test fails when any step maps above -6 dB.

## Acceptance criteria

1. Given the steps 0 to 5 of each channel, when a group 2 test maps each to its gain, then step 5 is -6 dB, step 4 is -12 dB, step 1 is -30 dB, step 0 plays nothing and no step is above -6 dB (REQ-6106). Closed by: the group 2 test.
2. Given the constant in `src/client/audio/levels.ts` and the value in `verify/baselines.json`, when verify runs, then the two are equal, and a fixture that raises the constant to -3 dB fails (REQ-6106). Closed by: the verify check's test with a failing fixture.
3. Given two test files each normalised to -3 dBTP, when an offline render mixes one on each channel at step 5, then the sum peaks at or below -3 dBTP (REQ-6106). Closed by: an offline render test that measures the peak.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the steps and the ceiling as a constant in `src/client/audio/levels.ts`, one gain for each channel under ADR-0150's gain node, and the row «Volume per channel: at most -6 dB gain, chosen» to the Baselines table. The ceiling is a budget I chose, as ADR-0320 did: two files at -3 dBTP summed at unity gain can reach +3 dB, and 6 dB less on each keeps the sum at -3.

## Depends on

- TSK-0933 (blocking): the audio module and the gain node the channels sit under.

## Evidence

Not yet.

## Left alone

The loudness normalisation of each sound file, which ADR-0150 states, and the choice of which files ship, which this decision leaves open.
