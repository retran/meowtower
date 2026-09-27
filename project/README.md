# The record

The record of Meowtower: the vision in `vision.md`, the onboarding report in `onboarding.md`, decisions in `adrs/`, specifications in `specs/`, epics in `epics/` and tasks in `tasks/`.

## Specifications

<!-- meow-flow index -->

3 specifications in all: 3 live.

| Identifier | What it concluded | Status |
| --- | --- | --- |
| [SPC-0010](specs/SPC-0010-home-server-deployment-and-clients.md) | The home server on the Mac, its deployment, its clients and its network boundary | live |
| [SPC-0020](specs/SPC-0020-event-log-and-projections.md) | The event log, its projections, the blob store and the export | live |
| [SPC-0030](specs/SPC-0030-play-api-lifecycle-lease-and-answer-queue.md) | The play API, the adventure and session lifecycle, the device lease and the offline answer queue | live |
<!-- /meow-flow index -->

## Epics

<!-- meow-flow index -->

3 epics in all: 3 draft.

| Identifier | What it concluded | Status |
| --- | --- | --- |
| [EPC-0010](epics/EPC-0010-home-server-on-the-mac.md) | The home server on the Mac serves the game shell to a paired iPad and computer over HTTPS | draft |
| [EPC-0020](epics/EPC-0020-event-log-and-projections.md) | The append-only event log is the only truth, and every projection rebuilds from it | draft |
| [EPC-0030](epics/EPC-0030-play-api-lease-and-answer-queue.md) | The server decides play through HTTP and SSE, one device holds an adventure, and the client queue loses no answer | draft |
<!-- /meow-flow index -->
