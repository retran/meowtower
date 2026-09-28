---
id: ADR-0030
artifact: adr
status: approved
revised: 2026-09-27
addresses: [REQ-0200, REQ-0202, REQ-0204, REQ-0206, REQ-0208, REQ-0210, REQ-0212, REQ-0214, REQ-0216, REQ-0218, REQ-0220, REQ-0222, REQ-0224, REQ-0226, REQ-0228, REQ-0230, REQ-0232, REQ-0234, REQ-0236, REQ-2400, REQ-2402, REQ-2404, REQ-2406, REQ-2408, REQ-2410, REQ-2412, REQ-2414, REQ-2416, REQ-2418, REQ-2420, REQ-2422, REQ-2424, REQ-2426, REQ-2428, REQ-2430, REQ-2432, REQ-2434, REQ-2436, REQ-2438, REQ-2440, REQ-2442, REQ-2444]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0030. The server decides everything through an HTTP and SSE API, with one active device per adventure and a client queue that loses no answer

## Decision

The server decides every verdict, outcome, estimate and next packet, and the client only draws packets and sends input (REQ-2400). They talk through JSON over HTTP, with server-sent events (SSE) for what the server pushes. One device holds an adventure at a time through a lease, and the client keeps each answer in a persistent queue until the server has logged it. This record builds on ADR-0010, which serves the API, and ADR-0020, which logs every event the API produces.

### The contract

- Hono routes under `/api` take and return bodies defined by zod schemas in `src/shared/api.ts`, which client and server both import. The route list is the one in RES-2400, without push routes and without the modes `checkpoint` and `free`.
- Every outgoing packet is parsed by a `.strict()` schema before it leaves the server, so a field outside the schema fails the request in tests instead of reaching the client. The `Room` packet carries an opaque random 128-bit `itemId`, the view, the input spec, the slot, the room length, the attempt number, the threads and the hint levels already shown. It never carries the node, template, seed, parameters, purpose, scored flag, frame identifier or correct answer (REQ-2428, REQ-2420). A warm-up and a scored task arrive in one shape and get one shape of reply, so the client has nothing to draw them differently by (REQ-2430).
- The client checks only the input format against `InputSpec`, such as digits, one decimal comma or a filled denominator (REQ-2402). It sends `raw` with its own `parsed` as a hint, and the server parses `raw` again and ignores the client's parse.
- `AnswerIn` carries `dontKnow`, and the server logs the verdict `dont_know` from it, apart from `wrong` and from an empty `raw` (REQ-2442). This follows RES-2400's resolved finding.
- `AnswerOut` carries the game outcome for a first attempt, the streak, the grants, the threads, `feedback.correctAnswer` formatted for display after every attempt, and the short solution (REQ-2416, REQ-2418). It has no verdict field. Its only text, `battleLine`, comes from a line pool keyed by outcome, and a static test checks every string that pool and the reply's string keys can produce for the whole words `верно` and `неверно` (REQ-2414).
- `POST /api/item/:itemId/explain` logs `thread_spent` and `explanation_bought`, which ADR-0080 defines, and replies `pending` at once (REQ-2424). The text arrives as the SSE event `explanation_ready`, or as a template explanation after 10 seconds (RES-2400). ADR-0120 writes the text.
- `GET /api/session/:id/events` is the SSE stream for scene ready, explanation ready, lease moved and safety pause. `GET /api/session/:id/poll?after=<seq>` returns the same events for a client whose stream dropped.

### Repeated requests

- Every request that changes state carries `clientSeq`, which rises by one per device. The server logs its events with `idem_key` set to `<route>:<deviceId>:<clientSeq>`, using ADR-0020's unique column. A repeat finds the key, appends nothing, and returns the reply rebuilt from the events the first request logged (REQ-2432, REQ-2422).
- Charges have a second key that doesn't depend on `clientSeq`. A thread for a hint is charged at most once per item and hint level, an explanation at most once per item, and a second attempt is created at most once per item. So a hint repeated after a resume, with a new `clientSeq`, charges nothing (REQ-0214), and a repeated second-attempt request returns the same parallel task (REQ-2426).

### Lifecycle

- An adventure moves through `planned`, `active`, `paused`, `complete` and `wrapped_up`, and a session through `active` and `ended` (RES-2400). The `adventures` projection holds the state, and `appendEvents` refuses an event that would move an adventure out of `complete` or `wrapped_up` (REQ-2404).
- The client sends `POST /api/session/:id/pause` with `leave` from «Сохранить и уйти», with `background` when `visibilitychange` reports hidden (REQ-2406), and with `idle` after 90 seconds without input outside the task window (REQ-2408) or 5 minutes with a task open (REQ-2410). The figures come from RES-2400. It sends `background` with `fetch` and `keepalive`, so the request survives the page being hidden.
- A rest stop or an eye exercise logs its own events, which ADR-0090 names, and leaves the session `active` and the adventure unpaused (REQ-2412).
- Leaving saves nothing extra, because every action is already in the log when the server replies to it. «Сохранить и уйти» only logs the pause, so the player can leave at any moment, mid-task or mid-review (REQ-0200). A closed app, a flat battery or a device change sends nothing. The lease then expires, and the server logs the same pause with the reason `lease_expired`, so the state equals the one «Сохранить и уйти» leaves (REQ-0202).

### One device at a time

- `POST /api/adventure/resume` takes the lease for the calling device and logs `device_lease_taken`. The holder sends a heartbeat every 15 seconds (RES-0200). With no heartbeat for 45 seconds, three missed beats and a figure I chose, the lease expires and the server ends the session.
- Only the holder's state-changing requests are accepted, and any other device gets `409 lease_moved` (REQ-0220). The server also sends `lease_moved` on the old device's SSE stream, and that device turns view-only and shows «Приключение продолжено в другом месте» (REQ-0222). A device takes the lease only when the player taps to continue on it, never on opening, so two open devices don't take it back and forth.
- A queued answer from a device that lost the lease is still logged, because REQ-2434 forbids losing it. If the item has no attempt yet, the server records it as that attempt, and the new holder receives the outcome with its next packet. If the item already has one, the server logs `attempt_late` with the raw answer, and it gets no verdict, no grants and no weight in the estimate.

### Resume

- `resume_snapshot` is a projection from ADR-0020, updated in the same transaction as the event that changes it. `POST /api/adventure/resume` returns it as `ResumeOut`: the same floor, room, slot, `itemId` and view, attempt step, scene line and rewards not yet delivered (REQ-0204).
- Everything the snapshot holds is in the log (REQ-0208), and I add three event types under ADR-0020's rule to make that true. `scene_prepared` holds the scene lines and branches as they passed the safety checks, so a resumed scene continues without a new request to the Master (REQ-0216). `text_draft_saved` holds a free-text draft, sent at most once every 10 seconds while she types, a figure I chose. `rewards_delivered` records the client's acknowledgement that it showed a grant or ceremony, so what is pending is exact. The parent's `finish_today`, which ADR-0090 defines, is described below. The chest's three options are already in `chest_offered`, so a chest reopens with the same three (REQ-0218), and the random generator's state follows from the adventure seed and the draws logged.
- A task left unanswered comes back as the same first attempt (REQ-0210). When a pause lies between the task's `item_shown` and its `attempt_submitted`, the server sets `interrupted: true` on the attempt, so its accuracy counts and its time counts in no measure (REQ-0212).
- Each paired device has a kind, `tablet` or `computer`, from the pointer test at pairing (ADR-0010). When an attempt is submitted on a device of another kind than the one that showed its task, the server sets `crossDevice: true`, and the time counts in no measure (REQ-0224). ADR-0060 reads both flags.

### Adventures across days

- `POST /api/session/start` with `daily` continues the open adventure if there is one, and plans a new one only when none is `planned`, `active` or `paused` (REQ-0226).
- A game day runs from 04:00 to 04:00 in the time zone of the device she plays on, as ADR-0090 sets it (REQ-0334). An adventure day is a game day with active time in that adventure, so a day she doesn't play doesn't count (REQ-0236).
- The limit is the parent setting `threeDayLimit`, 3 by default, which can also be off. `PUT /api/parent/settings` changes it, and the change is logged as `settings_changed` (REQ-0234).
- When the first session of a new game day starts on an adventure that already has that many adventure days, `ResumeOut.wrapUp` is true. The server lets the open task and room finish, plays a short ending from the library and logs `adventure_wrapped_up` with the secrets she didn't open (REQ-0228). `reward_queue` takes those secrets, and ADR-0140 decides when they return (REQ-0232). Nothing earned is taken back, because the wrap-up logs no reversing grant and no event is removed (REQ-0230).

### Offline and the queue

- The client writes each answer to its IndexedDB queue and waits for that write to commit before sending, so a closed app or a restart can't lose it (REQ-2434). Retries back off from 1 second, doubling to at most 30 seconds, a figure I chose. On launch the client flushes the queue before it asks to resume.
- While there is no connection, the hint, explanation and second-attempt controls are inactive (REQ-2436). After an answer goes into the queue with no connection, the client shows the waiting scene «Туман над тропой, фамильяр ищет дорогу» and no new task until the server answers (REQ-2438). The outcome and grants then arrive together, as RES-2400 describes.
- The queue holds at most one answer per device, because no new task comes without the server. An answer that has stayed unsent for 24 hours, a figure I chose, shows as `queue_stuck` in that device's settings.

### The parent's session and the end of the day

- `POST /api/parent/login` with the PIN opens a parent session with its own `HttpOnly` cookie, apart from the device token. The session expires after 30 minutes without a request (REQ-2440), and every parent route also needs a paired device.
- `POST /api/parent/finish-today` logs `finish_today`. At the next boundary, after an answer with its review or after a scene, the server sends `stop_offer` with `canExtend: false`. For the rest of that game day it offers no «Ещё один ряд» and refuses `extend` with `409 day_finished` (REQ-2444, RES-3900).

What works once this is accepted, with ADR-0010 and ADR-0020: a paired device starts a session, receives packets, answers, repeats requests safely, leaves, resumes at the exact step on another device, loses no answer offline, and the three-day rule closes an adventure. Until ADR-0040 and ADR-0070 arrive, the packets come from a fixed sequence of hand-written test tasks. What doesn't work yet: real task generation, the Director's choice, grant amounts (ADR-0140), scene text (ADR-0110), explanation text (ADR-0120), and the soft stop at 60 minutes (ADR-0090). Until ADR-0090, `stop_offer` comes only from «Закончить на сегодня».

## Why

RES-2400 records the owner's draft of this API, and RES-0200 the draft of leaving and resuming. This record follows both and settles the four points RES-2400 leaves open that the requirements force.

The server decides because the measurement needs a client that knows nothing. REQ-2428 exists so the player can't tell a scored task from a warm-up, and on the computer she can open the browser's developer tools. A client that held the correct answer or the task's purpose would show it to anyone who looked.

Plain HTTP requests plus SSE fit a device that sleeps. Each request can be retried and logged on its own, and `idem_key` makes a retry harmless. An SSE stream that iPadOS drops in the background costs nothing, because the poll route and the resume packet cover what it missed.

The lease needs an explicit tap, because RES-2400 leaves open what happens when two devices both think they play. Taking the lease on open would let a forgotten iPad on the sofa take the game from the computer she is using.

The late-answer rule settles RES-2400's open question on two devices with queued answers. REQ-2434 says no answer may be lost, and the measurement needs one first attempt per task, so the first answer to arrive is the attempt and any later one is kept but unscored.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: client-side game logic, where the client checks answers and advances the room | plays through any network drop, and the server stays small | the client would hold correct answers and task design, against REQ-2400, REQ-2420 and REQ-2428, and could show outcomes the log never received |
| One WebSocket for everything | one connection, lower latency, and pushes and requests on one channel | iPadOS suspends sockets in the background, so every return needs a reconnect protocol; per-request retry, idempotency and logging all have to be rebuilt on top of the socket |
| Client prefetches the next tasks for offline play, the challenge RES-2400 raises | keeps her playing through a short Wi-Fi drop | the Director chooses the next task from the last answer (RES-1000), so a prefetched one is a guess; REQ-2438 forbids a new task offline, and prefetching would put a queue of tasks on the device against REQ-2542 |
| No lease: any device writes, and the last write wins | no heartbeat and no view-only screen | two devices could answer the same task twice and split one room's time between two device kinds, against REQ-0220 and REQ-0224 |
| tRPC or GraphQL in place of plain routes | typed calls end to end and fewer hand-written routes | zod schemas shared through `src/shared/api.ts` already type both ends; another layer adds a dependency and hides the plain routes the tests and the Parent Room call |

## What it costs

The strongest objection is that a Wi-Fi drop stops play after one answer. She sees the waiting scene where a client with prefetched tasks would keep going, and in a game built on flow, frequent drops will read as the game breaking. I accept it because the alternative gives up the measurement, and the waiting scene is part of the story, not an error screen. It becomes a reversal below if the drops turn out frequent.

The lease costs one tap when she changes device, and a view-only screen on the device she left.

The client costs more to build: an IndexedDB queue, a retry loop, a `keepalive` pause and an offline state for three controls. Tests have to cover a dropped connection at every step.

The server keeps a per-device `clientSeq` and three kinds of charge key, and the reply to a repeat has to be rebuilt from the log. A developer adding a state-changing route has to give it both.

For a month with nobody attending: the queue holds at most one answer per device, and nothing else waits on a person. The three-day rule closes stale adventures by itself.

## What would reverse it

- The log of the first two weeks of play in stage 0.3 (RES-3000) shows the waiting scene more than twice a day on average. Then the offline-prefetch alternative returns, limited to unscored warm-ups whose outcome carries no measurement.
- A real iPad drops a queued answer in a test that force-quits the home-screen app 50 times at random points after the tap. Then the queue moves to the service worker with Background Sync, or the client keeps the answer on screen until the server confirms it.
- The player uses two devices at once often enough that the lease screen shows more than once a week. Then the lease rule becomes "the last device she tapped on wins, with no view-only screen", which REQ-0222 would have to allow.

## Consequences

- The security boundary treats the client as untrusted. The likeliest threat is the player herself on the computer with developer tools, and the server answers it by re-parsing every answer, sending no measurement data and scoping every idempotency key to one device. Next comes a runaway retry loop from a bug, capped at 20 state-changing requests a second per device, a figure I chose, above which the server replies 429. Last comes a paired device used by someone else, which revocation in ADR-0010 answers.
- These failure states, with one audience each, join the names in ADR-0010 and ADR-0020:
  - `server_unreachable`: the player; the waiting scene, as in ADR-0010.
  - `lease_moved`: the player, on the device she left; the view-only screen with its one sentence and a button to continue here.
  - `day_finished`: the player; the story's stop offer without «Ещё один ряд».
  - `parent_session_expired`: the parent; the PIN screen again, with the page they were on kept.
  - `attempt_late`: the parent; the node card lists the late answer as unscored.
  - `queue_stuck`: the parent; the device's settings show the answer's time and a retry button.
- Budgets: the server must reply to an answer within 300 ms at the 95th percentile, measured from request received to reply sent in the server log, a budget I chose for a path where she waits. The answer path makes no model call, so the model's latency can't enter it. The heartbeat of 15 seconds, the idle limits of 90 seconds and 5 minutes, the 10-second explanation fallback and the 30-minute parent session are imposed by the requirements and RES-2400. The reply budget, the rate cap and the 10-second fallback stand in the Baselines table of ADR-0190.
- Work created: the shared schemas, the routes, the SSE stream and poll route, the lease, the lifecycle guard in `appendEvents`, the three new event types, the resume projection, the client queue, the offline state, the three-day rule, the parent session and the finish-today route.
- Premortem, written as though it already happened: in the first week an answer she gave on the iPad vanished. The client had started the `fetch` before the IndexedDB write committed, and iPadOS killed the page in between. A week later the computer and the iPad were both open in the evening, and each time she looked at one it took the lease, so the log filled with `device_lease_taken` and her session times broke into pieces. The rules above, write-then-send and a lease only on a tap, came from these two failures, and the tests below check both.

## How I will know it was realised

1. A test records every packet the server sends in a simulated 30-day run and finds no field named `node`, `templateId`, `seed`, `params`, `purpose`, `scored`, `frameId`, `flowSlot` or `why`, and no correct answer in any packet sent before that task's first attempt.
2. The static test finds neither `верно` nor `неверно` as a whole word in any string the answer reply can carry.
3. Sending the same answer, hint, explanation and second-attempt request twice with the same `clientSeq` appends events once, charges one thread for each paid action, and returns equal replies; a hint repeated after a resume with a new `clientSeq` charges nothing.
4. After every event in the 30-day simulation, the stored `resume_snapshot` equals the one derived from the log alone.
5. A Playwright test leaves at each attempt state RES-2550 lists, from `shown` to `second_attempt_shown`, resumes on a second browser context, and finds the same `itemId`, view, step, scene line and chest options, with no new model request logged.
6. With two browser contexts, the second one's tap to continue makes the first show the view-only sentence within 5 seconds, and the first one's next answer gets `409 lease_moved`.
7. A test cuts the network after an answer, closes and reopens the client, restores the network, and finds that answer in the log exactly once, with the waiting scene shown and the three help controls inactive while the network was down.
8. An adventure played on three separate game days, with game days without play between them, is wrapped up on the first session of the fourth day it is played; it keeps every grant, and its unopened secrets appear in `reward_queue`.
9. After `POST /api/parent/finish-today`, the next boundary sends `stop_offer` with `canExtend: false`, and `extend` gets `409 day_finished` until 04:00.
10. A parent request 31 minutes after the last one gets `401 parent_session_expired`.
11. An attempt paused mid-task carries `interrupted: true`, and one finished on another device kind carries `crossDevice: true`.
12. The parent plays scored and unscored tasks side by side and can't tell them apart (REQ-2430).

## What this does not settle

- Which task comes next, and why (ADR-0070); what a task contains and how it is checked (ADR-0040).
- The attempt flow, hints and threads as game rules (ADR-0080); this record only makes their requests safe to repeat.
- The soft stop at 60 minutes, extensions of 20 minutes, eye exercises and rest stops as story (ADR-0090).
- Grants, chests, secrets and when queued secrets return (ADR-0140).
- Scene text, the library's short ending and the waiting scene's wording (ADR-0110 and ADR-0160).
- The explanation's text and its fallback template (ADR-0120).
- How the knowledge model uses `interrupted`, `crossDevice` and `attempt_late` (ADR-0060).
- The Parent Room's screens and report (ADR-0180), and the PIN's storage and lockout (ADR-0010).

Amended by ADR-0250 and ADR-0260, approved on 2026-09-28, whose `## Amends` sections change parts of this record; where they differ from the text above, they hold.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
