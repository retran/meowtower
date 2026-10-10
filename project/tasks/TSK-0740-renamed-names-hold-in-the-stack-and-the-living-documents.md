---
id: TSK-0740
artifact: task
status: approved
revised: 2026-10-10
realises: ADR-0200
closes: [REQ-3714]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every technical name carries Meowtower in the repository, the running stack and the living documents

After this task, no living document, source file or test still holds an old name from ADR-0200's table, the running stack uses the new names, and the repository answers to `retran/meowtower`, so a reader of a log line, a container list or a specification finds one name.

## Acceptance criteria

1. Given the repository on GitHub, when `gh repo view retran/meowtower` runs, then it answers with the repository, and `gh repo view retran/tower` resolves to the same one. Closed by: both commands' output.
2. Given a Mac with Docker, when `./meowtower up` runs, then `docker compose ls` lists the project `meowtower`, `docker compose ps` lists the services `meowtower` and `proxy`, and `docker volume ls` lists `meowtower-db` and no `tower_tower-db` (REQ-3714). Closed by: the output of the three commands.
3. Given the specifications and CLAUDE.md, when `grep -rnE '\./tower\b|\btower-db' project/specs CLAUDE.md` runs, then it prints nothing (REQ-3714). Closed by: the command's output.
4. Given the source, tests and operator files, when `grep -rnI 'meowmeowtower' src tests tools compose.yaml meowtower` runs, then it prints nothing, because a double prefix is a name no row of the table gives (REQ-3714). Closed by: the command's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

TSK-0010 shipped the new names for the stack, and the repository has already moved to `retran/meowtower`. Four things are left, found on 2026-10-10. `./tower` still appears five times in SPC-0050 (3), SPC-0110 (1) and SPC-0280 (1), where the command is now `./meowtower`. `tests/unit/health.test.ts` writes `meowmeowtower.sqlite` twice, the result of a rename applied to a name that already held the prefix. Replace each, because the specifications are living documents and ADR-0200 says they use the new names.

Choice this task makes: the ADR's third criterion searches `tower-db`, which also matches `meowtower-db` and so can never pass. Criterion 3 here anchors the old name with `\b`, so `meowtower-db` no longer matches.

Approved records that still say "tower", among them ADRs, tasks, epics and `project/onboarding.md`, keep their text, as ADR-0200 states, and the table in ADR-0200 translates them.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

The Tower («Башня») the heroine climbs, which is a place in the story and keeps its name, and whether «Мяубашня» is the final Russian title, which the owner may still correct.
