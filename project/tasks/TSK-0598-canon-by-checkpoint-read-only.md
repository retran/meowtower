---
id: TSK-0598
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1634, REQ-1636, REQ-1638]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The prompt takes only the canon sections up to the current checkpoint, and nothing in the game writes the canon

After this task, `content/canon.ru.md` carries a checkpoint tag on each section, the prompt builder takes only the sections up to the current checkpoint, the server mounts `content/` read-only, and no tool in the repository writes to the canon.

## Acceptance criteria

1. Given the prompt built at each checkpoint, when its text is searched, then it holds no sentence of a later checkpoint's section (REQ-1638). Closed by: a unit test at every checkpoint over the canon fixture.
2. Given the server container, when it tries to write under `content/`, then the write fails, and `compose.yaml` mounts the directory read-only (REQ-1636). Closed by: a smoke test in `tests/smoke/compose.test.ts`.
3. Given the repository's tools, when they are searched for a write to `content/canon.ru.md`, then none exists, and a fixture tool that writes to it fails the check (REQ-1634). Closed by: a static check test.
4. Given the canon, when the owner reads it, then the owner judges that every text was written by a person (REQ-1634). Closed by: the owner's judgement, because authorship can't be read from a file.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the checkpoint tags to the canon's sections, the prompt builder's filter, the read-only mount and the static check. The system prompt holds the canon's rules for the Master (CAN-0110), the age as a number, the bans on asking for personal data, on schoolwork and grades and on discussing the heroine's abilities, and the rule to tell every outcome as an event in the world. Story memory sends the last 7 session summaries, one summary for each earlier chapter and at most 200 facts, which ADR-0110 chose to keep the dynamic part near 3,000 tokens.

## Depends on

- TSK-0597 (blocking): the builder fills the order that task defines.

The canon's text is written by the owner; this task uses a fixture canon with three checkpoints.

## Evidence

Not yet.

## Left alone

The canon's wording and the campaign calendar, which TSK-0607 reads.
