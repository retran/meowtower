# Decisions

<!-- meow-flow index -->

20 decisions in all: 20 approved.

| Identifier | What it concluded | Status |
| --- | --- | --- |
| [ADR-0010](ADR-0010-one-typescript-server-on-the-mac.md) | One TypeScript server in Docker on the family Mac serves the game as a web app to an iPad home-screen app and a desktop browser over HTTPS on the home network | approved |
| [ADR-0020](ADR-0020-append-only-event-log-is-the-only-truth.md) | An append-only event log in SQLite is the only truth, and every other table is a projection rebuilt from it | approved |
| [ADR-0030](ADR-0030-server-decides-through-http-and-sse.md) | The server decides everything through an HTTP and SSE API, with one active device per adventure and a client queue that loses no answer | approved |
| [ADR-0040](ADR-0040-tasks-from-templates-seeds-exact-arithmetic.md) | Code generates every task from a versioned template, a seed and exact arithmetic, and one solution graph drives checking, hints and solutions | approved |
| [ADR-0050](ADR-0050-skill-graph-one-versioned-data-file.md) | The skill graph is one versioned data file, the single source of nodes, levels, prerequisites, subtypes and weights | approved |
| [ADR-0060](ADR-0060-knowledge-model.md) | The knowledge model is BKT with forgetting plus two beta estimates, with report states from explicit rules, versioned and recomputed from the event log | approved |
| [ADR-0070](ADR-0070-director-selection-and-measurement.md) | The Director fills each slot by information value inside a flow corridor, a three-day domain window and spaced review, and guards the measurement against repeats, fatigue and rapid guesses | approved |
| [ADR-0080](ADR-0080-one-attempt-flow-measures-then-teaches.md) | Every task runs one attempt flow on the server: an unassisted first attempt measures, then a free short solution, one parallel second attempt and hints paid in guiding threads teach | approved |
| [ADR-0090](ADR-0090-day-planned-from-pace-with-invisible-time.md) | The server plans each day's adventure from her pace, counts time only from the event log, and brings eye exercises, rest stops and a soft stop as story at task boundaries, with no clock on her screens | approved |
| [ADR-0100](ADR-0100-model-gateway-tiers-budgets.md) | Every model call goes through one server gateway to OpenRouter, with per-role configured models, two privacy tiers fixed by role, budgets reserved before each call and a full log | approved |
| [ADR-0110](ADR-0110-master-narrates-director-events.md) | The Master narrates only from the Director's story events, inside checked scene orders, a hand-written canon with story memory and a safety pipeline that runs before any text shows | approved |
| [ADR-0120](ADR-0120-explanations-from-engine-steps.md) | A model writes each explanation from the engine's steps with placeholders, code checks it and a blind solver reads it, the cache keeps three variants a group, and the template explanation covers every failure | approved |
| [ADR-0130](ADR-0130-task-text-from-checked-frames-and-science-bank.md) | Model text reaches a task only as a placeholder frame that passed the checks, from a library the parent accepted or a live top-up queue, and science questions come only from a bank the parent approves | approved |
| [ADR-0140](ADR-0140-deterministic-game-rules-over-versioned-content.md) | Outcomes, progression, rewards and familiars run as deterministic server rules over versioned content data | approved |
| [ADR-0150](ADR-0150-interface-preact-design-system.md) | The interface is Preact components ported from the owner's design system, styled by its token and component sheets, with PixiJS drawing only the scene | approved |
| [ADR-0160](ADR-0160-strings-per-language-files.md) | Every player-facing string lives in a per-language content file read through one typed function, and one forbidden-word list in one text gate checks every line before the player sees it | approved |
| [ADR-0170](ADR-0170-offline-art-in-one-style-chosen-by-a-person.md) | Game art is generated offline in one style, scored by a judge model, chosen by a person and animated as whole sprites | approved |
| [ADR-0180](ADR-0180-parent-room-report-limits-lessons.md) | The Parent Room and its report are projections of the event log behind a PIN, with twelve limits, lesson rechecks and labels, and an export on the Mac only | approved |
| [ADR-0190](ADR-0190-verify-command-stages-and-mvp-scope.md) | One verify command, simulations and a person's acceptance gate every stage, and the MVP holds exactly the approved scope | approved |
| [ADR-0200](ADR-0200-name-the-game-meowtower.md) | The game is named Meowtower, and every technical name follows it | approved |
<!-- /meow-flow index -->
