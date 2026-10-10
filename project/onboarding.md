---
id: onboarding
artifact: onboarding
status: approved
revised: 2026-10-10
---

<!-- Written to the writing standard meow-prose ships: lead with what was found, give each figure its source, and state a gap as plainly as a finding. -->

# Onboarding Tower Chronicles

Meowtower (first named Tower Chronicles) was onboarded on 2026-09-27, when it
held only the owner's draft design, a design system and a clickable prototype,
none of them committed. Onboarding moved the draft design into research
records, the world bible into canon records, and the design into five more
research records. It recorded no requirement and no decision, because the
owner asked for research only. The method then ran on that research, and this
report was revised on 2026-10-10 to describe the repository as it is now.

Today the repository holds the TypeScript server, client and engine in `src/`,
its tests in `tests/`, and a record in `project/` of 1 vision, 63 research
records, 1,885 requirements in force (102 more superseded), 46 decisions, 35
specifications, 3 epics and 42 tasks, as `paw count` reports. `draft/` is
deleted. `canon/` and `docs/` hold the world bible and the parent's pages, and
`design/` stays untracked, as `CLAUDE.md` says.

**Amended by the owner's instruction of 2026-10-10**, which asked for this report to match the repository as it is.

## Verbs

All five verbs resolve, as `meow-checks status` reports, each from
`.meowpaw/profile.toml`: format `npx prettier --check .`, lint
`npm run lint`, check `npx tsc --noEmit`, test `npm test` and build
`npm run build && docker compose build`. None has a subset form, so each runs
on the whole repository. RES-2900 records `npm run verify`, the command the
draft planned; ADR-0190 and SPC-0190 now govern it, and it doesn't exist yet.

## Conventions

The history holds 87 commits. Their subjects use four types: `docs` 52,
`feat` 31, `fix` 2 and `test` 2. Subject lengths run up to 153 characters, and
no commit carries a trailer. Only 1 of the 87 subjects has a scope, the
squash of pull request 1. The repository requires a signed commit on `main`,
and the profile declares the types, the record root `project` and the GitHub
tracker. The only code-host history is pull request 1; `meow-github history`
reports no issues, comments or closed pull requests beyond it, so it holds no
requirement or rejected alternative to recover.

The owner has set four rules, which `CLAUDE.md` and `.meowpaw/profile.toml`
record: the project is kept in English; player-facing text is Russian only
for now but must allow English and Dutch and a language switch; `design/` is
never committed; every commit is signed. A fifth, added on 2026-09-28 and
2026-09-29, lets the Dutch bridge's keywords and the Dutch probe show Dutch
text the parent approves.

## Documents

| Document | Outcome | Where, or why |
| --- | --- | --- |
| `draft/khroniki-bashni-specifikaciya.md` | migrated | The draft specification, moved into RES-0010, RES-0100, RES-0200, RES-0300, RES-0400, RES-0500, RES-0600, RES-0700, RES-0720, RES-0800, RES-0900, RES-1000, RES-1100, RES-1200, RES-1300, RES-1400, RES-1500, RES-1600, RES-1700, RES-1800, RES-1900, RES-2000, RES-2100, RES-2200, RES-2300, RES-2400, RES-2500, RES-2550, RES-2600, RES-2700, RES-2800, RES-2900 and RES-3000, indexed by RES-0001 |
| `draft/khroniki-bashni-setting-i-kanon.md` | discarded | Its content now lives in the canon records CAN-0010 to CAN-0130 in `canon/`, a kind meow-method does not resolve |
| `draft/khroniki-bashni-summary.md`, the family summary (its real file name is not kept) | discarded | The summary for the family; the owner said the project doesn't need it, and its facts on scope and goal are also in RES-0010 |
| `narration.md` | cited | The Master's narration style prompt in Russian, added in commit bb27a6a; no record cites it yet, so it stays where it is |
| `CLAUDE.md` | cited | The existing harness, left untouched; the vision cites its language rule and the player's age |
| `canon/README.md` | cited | Defines the project-local canon kind that holds the world bible; placed by onboarding and kept |
| `canon/CAN-0010-logline-and-tone.md` | cited | A chapter of the world bible: Logline and tone; placed by onboarding and kept |
| `canon/CAN-0020-world-outside-the-tower.md` | cited | A chapter of the world bible: The world outside the Tower; placed by onboarding and kept |
| `canon/CAN-0030-the-tower.md` | cited | A chapter of the world bible: The Tower; placed by onboarding and kept |
| `canon/CAN-0040-nine-floors.md` | cited | A chapter of the world bible: The nine floors; placed by onboarding and kept |
| `canon/CAN-0050-tangles.md` | cited | A chapter of the world bible: The Tangles; placed by onboarding and kept |
| `canon/CAN-0060-elements-and-familiars.md` | cited | A chapter of the world bible: Elements and familiars; placed by onboarding and kept |
| `canon/CAN-0070-the-heroine.md` | cited | A chapter of the world bible: The heroine; placed by onboarding and kept |
| `canon/CAN-0080-campaign-year.md` | cited | A chapter of the world bible: The campaign year; placed by onboarding and kept |
| `canon/CAN-0090-keepers-diary.md` | cited | A chapter of the world bible: The Keeper's Diary; placed by onboarding and kept |
| `canon/CAN-0100-items.md` | cited | A chapter of the world bible: Items; placed by onboarding and kept |
| `canon/CAN-0110-rules-for-the-master.md` | cited | A chapter of the world bible: Rules for the AI Master; placed by onboarding and kept |
| `canon/CAN-0120-art-direction.md` | cited | A chapter of the world bible: Art direction; placed by onboarding and kept |
| `canon/CAN-0130-dreamcore-and-underside.md` | cited | A chapter of the world bible: Dreamcore, the dream Underside and mild creepiness; placed by onboarding and kept |
| `design/README.txt` | cited | RES-3100 holds its content; kept with `design/` until its assets move |
| `design/design-system/README.md` | cited | RES-3100 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/AnswerField/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/Button/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/ChoiceGrid/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/ColorRole/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/Counter/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/ElementChip/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/FamiliarCard/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/KnotScheme/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/MathKeypad/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/OutcomeBadge/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/PalettePicker/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/QuestList/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/RankBadge/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/RewardChest/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/SkillState/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/StoryInput/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/StoryLog/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/SystemWindow/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/TaskWindow/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/TermHint/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/TopBar/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/components/XpBar/README.md` | cited | RES-3200 holds its content; kept with `design/` until its assets move |
| `design/design-system/guidelines/10-voice.md` | cited | RES-3300 holds its content; kept with `design/` until its assets move |
| `design/design-system/guidelines/20-art.md` | cited | RES-3400 holds its content; kept with `design/` until its assets move |
| `design/design-system/guidelines/30-screens.md` | cited | RES-3500 holds its content; kept with `design/` until its assets move |
| `design/key-art/README.md` | cited | RES-3400 holds its content; kept with `design/` until its assets move |
| `design/screens/README.md` | cited | RES-3500 holds its content; kept with `design/` until its assets move |
| `docs/README.md` | cited | User documentation for the parent, written by EPC-0020's document step after onboarding and kept |
| `docs/how-to/export-the-game-data.md` | cited | User documentation for the parent, written by EPC-0020's document step after onboarding and kept |
| `docs/how-to/recompute-the-derived-tables.md` | cited | User documentation for the parent, written by EPC-0020's document step after onboarding and kept |
| `docs/reference/parent-notices.md` | cited | User documentation for the parent, written by EPC-0020's document step after onboarding and kept |

Amended by EPC-0020, whose document step added the four `docs/` pages above.

Outside the table: the design system's code in `design/design-system/`
(`tokens.json`, `tokens.css`, `components/bundle.js`, `components/bundle.css`,
`components/index.d.ts`) is described in RES-3100 and RES-3200, which is
research, not a specification. The images, icons, element symbols, screen
sheets and prototype in `design/` are assets the records describe but don't
hold, so `design/` stays until they move to where the game loads them.

## Gaps

The owner answered the first report's 32 gaps on 2026-09-26: design moved
into research (RES-3100 to RES-3500), the adventure and the soft stop are 60
minutes, the one-hour budgets aren't recomputed, and research resolved every
other gap. Each resolution is a finding headed `### Resolved:` in the records
it touches, marked as proposed until the owner approves the record. The
design contradicted the older research in 17 more places, and research
resolved those the same way. On 2026-09-27 the owner answered six more: the player's current school group (kept in `personal/player.md`), and that she
learns everything to the end of group 8; there is no daily maximum; alarms go
to the Parent Room only, with the iPhone push postponed; Jev may evaluate
safety and similar judgements; "Nekopara characters" leaves the negative
prompt; and the ally is «Бантик». The owner then asked research to answer the 13 questions still open, and
research decided each on 2026-09-27, marked as decided on the owner's
instruction. Research answered the last two the same way: the Director fills
a chest from the categories where her stock falls furthest short of its next
goal (RES-2100), and after the MVP Mirra stays one rank above the heroine
until the last chapter (CAN-0080). No question is left for the owner.

Two items wait for work, not for an answer: the 17 nodes that moved to
1F/1S need their subtypes named by level (RES-0800), and the outcome
thresholds need the stage 0.1 simulation (RES-1700). The forge history
holds one merged pull request and nothing to recover (see Conventions).
The two items above were open on 2026-09-27, and the 2026-10-10 revision did
not re-check them.

## Adoption

1. The owner reads the `### Resolved:` findings, found with
   `grep -rn '### Resolved' project/research canon`, and changes any
   decision by adding a finding to the record that holds it. The records
   then hold no choice the owner hasn't seen.
2. The owner approves the research records one topic at a time, starting
   with RES-0010, which rules scope and principles, and RES-3100, which rules
   the design system. Each approved record can then feed the requirements
   step.
3. The owner approves the canon records, starting with CAN-0010. The Master
   and the art pipeline can then rely on them.
4. Once this report is approved, `paw onboarding remove` removes what
   onboarding placed. `draft/` is already deleted, because nothing in
   `project/` or `canon/` refers to it. `design/` stays until its assets move.
