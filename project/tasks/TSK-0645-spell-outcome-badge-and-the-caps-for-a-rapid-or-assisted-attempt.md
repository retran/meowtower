---
id: TSK-0645
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-1702, REQ-1704, REQ-1706, REQ-1712, REQ-1714, REQ-1742, REQ-1760, REQ-1762]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A spell has three outcomes judged on the unassisted first attempt, and the answer reply carries its outcome and badge

After this task, `src/game/outcome.ts` maps a verdict to `clean`, `partial` or `alt`, caps a rapid guess and an assisted first attempt at 0.5, maps the outcome to the badge, and the answer route returns the outcome and the badge the module computed.

## Acceptance criteria

1. Given a correct, a partial, a wrong and a «Не знаю» verdict, when each is mapped, then they give `clean`, `partial`, `alt` and `alt` (REQ-1742). Closed by: a unit test with one row for each verdict.
2. Given a first attempt and any second attempt with any verdict, when the outcome and the shares are computed, then the second attempt changes nothing in the outcome, the room share or the floor share (REQ-1702, REQ-1704). Closed by: a property test over 1,000 generated attempts.
3. Given a rapid guess or an assisted first attempt, when its value is computed, then it is 0.5 when correct and 0 when wrong, and an assisted attempt counts the smaller of its value and 0.5 (REQ-1712). Closed by: a unit test with both flags and both verdicts.
4. Given each of the five badge cases, when the badge is computed, then `crit` is a `clean` outcome that closes a clean row, `clean` is any other `clean`, `partial` is `partial`, `soft` is `alt` after a wrong answer and `unknown` is `alt` after «Не знаю», and the labels of `soft` and `unknown` are the keys that read «Узел ослаблен» and «Принято» (REQ-1760, REQ-1762). Closed by: a unit test with one row for each case and a test that reads the two labels from the language file.
5. Given a rapid guess and an ordinary answer with the same verdict, when the answer route replies, then the two replies carry the same outcome and badge and no field that tells them apart, and every reply, wrong answers and «Не знаю» included, carries the next step of the story (REQ-1714, REQ-1706). Closed by: an integration test that compares the two replies.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the function to `src/game/` as pure code that reads no clock and no random source. Judge the outcome on the unassisted first attempt only. An assisted first attempt is one answered after a paid hint, which RES-0400 left open and ADR-0140 resolves: it gets its outcome and badge from its verdict and counts at most 0.5, and I read REQ-1702 as keeping the bonuses for the unassisted attempt. Return the outcome and the badge in the answer reply of `src/server/play.ts`; the client computes none of it.

## Depends on

Nothing in this epic. The epic realising ADR-0070 supplies the rapid-guess flag, and the epic realising ADR-0250 adds `insufficient_correct`, `insufficient_partial` and `false_insufficient` to the verdict kinds and maps them as it amends ADR-0140. Until the flag lands, it is a field of the attempt that tests set.

## Evidence

Not yet.

## Left alone

The streak, the clean row and the room and floor states, which the next tasks build on this function, and the screens that draw the badge, which the epic realising ADR-0150 owns.
