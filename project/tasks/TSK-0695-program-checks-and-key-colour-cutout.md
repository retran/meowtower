---
id: TSK-0695
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0170
closes: [REQ-2808, REQ-3402]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A transparent asset is cut from its key colour, and two program checks reject pure black and a key-colour fringe

After this task, the tool cuts a transparent asset out of its flat key colour with sharp, writes WebP with alpha and a preview, and rejects any variant with a pure-black pixel or a trace of the key colour before the judge sees it.

## Acceptance criteria

1. Given a variant with one opaque pixel whose three channels are all at or below 16 out of 255, when the pure-black check runs, then the variant is rejected with the score 1 and the failed check named, and the judge is never called; given a variant whose darkest opaque pixel is the warm brown line `#6B4540`, then it passes (REQ-3402). Closed by: two unit tests on generated fixture images.
2. Given a transparent asset generated on magenta `#FF00FF`, when it is cut out, then the written WebP has an alpha channel, no semi-transparent edge pixel and no opaque pixel whose hue lies within 20 degrees of the key colour's hue, and a preview file sits beside it (REQ-2808). Closed by: a unit test that scans every pixel of a fixture cut-out.
3. Given a fixture whose edge pixels keep the key colour's spill, when the fringe check runs, then the variant is rejected with the score 1 and the check named (REQ-2808). Closed by: a unit test.
4. Given a pink or lilac asset, when the request is built, then its key colour is green `#00FF00`, and every other transparent asset's is magenta, and the key colour used is recorded on the variant's row. Closed by: a unit test over three palettes.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the cut-out step with sharp 0.35.4, which cuts out the key colour, removes its spill from the edge pixels and writes the WebP and the preview. Add the two program checks. Both run on every variant before the judge and each rejects on its own; a variant a check rejects gets the score 1 with the failed check named, so every variant has a score from 1 to 10 (REQ-2820 is TSK-0696's).

The pure-black threshold of 16 out of 255 and the fringe's 20 degrees are values ADR-0170 and SPC-0170 chose. The key colour is outside the asset's palette, and a pink or lilac asset takes green because magenta lies too near either.

## Depends on

- TSK-0693 (blocking): the check results and the key colour go on the variant's row it creates.

## Evidence

Not yet.

## Left alone

The checks on colour tokens in code, which TSK-0703 builds, and the judge, which TSK-0696 builds.
