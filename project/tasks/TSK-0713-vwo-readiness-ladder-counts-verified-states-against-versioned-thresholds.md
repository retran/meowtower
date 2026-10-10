---
id: TSK-0713
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-0824, REQ-0826, REQ-0828, REQ-2330, REQ-2332, REQ-2334, REQ-2336, REQ-2338, REQ-2340, REQ-2342, REQ-2344, REQ-2346, REQ-2348, REQ-2350]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The VWO readiness block counts verified states against thresholds kept as versioned data

After this task, the VWO readiness block shows 1F coverage, the 1S margin and the ceiling as three figures, a four-step ladder over verified states only, the inferred figure beside it, the gap list and the ceiling list, its disclaimer and the MVP mark, and its thresholds live in `content/thresholds.json` under `vwo` with a version.

## Acceptance criteria

1. Given fixtures at 89 % and 90 % of 1F and 1S nodes verified at «понимает» or above, at 79 % and 80 % of 1S nodes in «бегло» or «устойчиво», and at 2 and 3 stretch nodes in those states, when the ladder is built, then each gives the step REQ-2338 to REQ-2344 name, and a node unverified or cut off counts as not covered (REQ-2338, REQ-2340, REQ-2342, REQ-2344, REQ-2332, REQ-2336). Closed by: unit tests at each boundary.
2. Given a fixture with inferred states, when the block is built, then the inferred figure shows beside the ladder, changes no step, and the three measures show 1F coverage as the share of verified 1F nodes at «понимает» or above, the 1S margin as the share in «бегло» or «устойчиво», and the ceiling as the count of stretch nodes mastered (REQ-2330, REQ-2334). Closed by: a unit test.
3. Given coverage of 1F, of 1S and of stretch, when the block is built, then they show as three separate figures (REQ-0828); given every stretch node «Пока не освоено», then none is listed among the gaps (REQ-0824); given 2 stretch nodes in «бегло», then both are listed as the ceiling above 1S (REQ-0826). Closed by: three unit tests.
4. Given `content/thresholds.json` with its `version` under `vwo` and its content hash in `content/thresholds.lock`, when a value changes and the version doesn't, then a static check in verify fails and the server refuses to start on that content (REQ-2346). Closed by: a unit test with the changed fixture and a start-up test.
5. Given the block at any state of the data, when it renders, then it shows «Ориентировочный домашний инструмент. Не официальный совет школы и не стандартизированный тест», and in the MVP the mark «предварительно: без контрольных прогонов» (REQ-2348, REQ-2350). Closed by: a Playwright test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the VWO part to `src/parent/`, `content/thresholds.json` with the `vwo` section and its `version`, `content/thresholds.lock` with the section's content hash, and the static check. The ladder gives the highest step whose conditions hold. The steps follow RES-2300: 90 % of 1F and 90 % of 1S verified at «понимает» or above with no 1F node in «Пока не освоено»; 80 % of 1S nodes in «бегло» or «устойчиво»; 3 stretch nodes in those states. No node of the Sources track enters any measure.

The ladder counts verified states only, because a rule the parent can check beats a probability she can't. The epic realising ADR-0060 supplies the states and which are verified, inferred or cut off. The static check is the first user of `thresholds.lock`; TSK-0719 extends it to the catalogue.

## Depends on

- TSK-0708 (blocking): the part joins the report model and its cache.

## Evidence

Not yet.

## Left alone

The sections that other decisions add to this block, among them non-standard thinking and the Cito preparation, and the catalogue of fluency thresholds, which TSK-0718 and TSK-0719 build.
