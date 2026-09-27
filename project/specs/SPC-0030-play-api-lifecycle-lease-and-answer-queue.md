---
id: SPC-0030
artifact: spec
status: live
revised: 2026-09-27
checked-at:
states: [REQ-0200, REQ-0202, REQ-0204, REQ-0206, REQ-0208, REQ-0210, REQ-0212, REQ-0214, REQ-0216, REQ-0218, REQ-0220, REQ-0222, REQ-0224, REQ-0226, REQ-0228, REQ-0230, REQ-0232, REQ-0234, REQ-0236, REQ-2400, REQ-2402, REQ-2404, REQ-2406, REQ-2408, REQ-2410, REQ-2412, REQ-2414, REQ-2416, REQ-2418, REQ-2420, REQ-2422, REQ-2424, REQ-2426, REQ-2428, REQ-2430, REQ-2432, REQ-2434, REQ-2436, REQ-2438, REQ-2440, REQ-2442, REQ-2444]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The play API, the adventure and session lifecycle, the device lease and the offline answer queue

## Scope

This document covers the contract between the game client and the `meowtower` server: the routes under `/api`, the packets and replies they carry, the server-sent events (SSE) stream and its poll route, the lifecycle of an adventure and a session, the lease that lets one device play at a time, the resume point, the three-day rule, the parent session and the finish-today route, and the client's answer queue and offline state. It is written at the API level: routes, packets, messages, states and the events each request logs. A reader who needs how the server is deployed or paired reads SPC-0010, and one who needs a screen's layout reads the specification of the interface.

It leaves out what other decisions define. The `events` table, `appendEvents` and the projections' storage and rebuild belong to ADR-0020. What a task contains and how an answer is checked belong to ADR-0040, which task comes next to ADR-0070, the attempt flow, hints and threads as game rules to ADR-0080, and the game day, the soft stop, extensions, eye exercises and rest stops as story to ADR-0090. Scene text and the waiting scene's wording belong to ADR-0110 and ADR-0160, the explanation's text to ADR-0120, grants, chests and secrets to ADR-0140, and the Parent Room's pages to ADR-0180. How the knowledge model reads `interrupted`, `crossDevice` and `attempt_late` belongs to ADR-0060.

## Boundary

The contract lives in `src/shared/api.ts`: one zod schema per request body, reply and packet, which the client and the server both import. Every reply schema is `.strict()`.

### Routes

Every route needs a paired device's token, as SPC-0010 states. Every request that changes state carries `clientSeq`.

| Route | What it does |
| --- | --- |
| `POST /api/session/start` | `{ mode: "zero" \| "daily", clientSeq }`. Opens a session and takes the lease for the calling device. `daily` continues the open adventure or plans a new one; a Session 0 (`zero`) belongs to no adventure. |
| `GET /api/adventure/current` | The open adventure, `planned`, `active` or `paused`, with where play stopped (floor, room, slot), or `null` when none is open. |
| `POST /api/adventure/resume` | Takes the lease for the calling device and returns `ResumeOut`. |
| `POST /api/session/:id/resume` | The same as `POST /api/adventure/resume`, for the current session. |
| `POST /api/session/:id/heartbeat` | The lease holder's heartbeat. |
| `GET /api/session/:id/next` | The next packet: `room`, `scene`, `chest`, `break`, `stop_offer` or `end`. |
| `POST /api/session/:id/answer` | `AnswerIn` for a first or second attempt; replies `AnswerOut`. |
| `POST /api/item/:itemId/hint` | `HintIn`: buys the hint level the request names, which is the next one or one already paid for; replies `HintOut`. |
| `POST /api/item/:itemId/explain` | Buys a detailed explanation; replies `ExplainOut` with `status: "pending"`. |
| `POST /api/item/:itemId/second-attempt` | `{ clientSeq }`, after the first attempt's verdict. Returns the parallel task for the second attempt as a `room` packet. |
| `POST /api/session/:id/chest` | `{ chestId, rewardId }`: her pick of one of the chest's three options. |
| `POST /api/session/:id/scene/input` | A scene choice, her free text, or a free-text draft. |
| `POST /api/session/:id/rewards/delivered` | The client's acknowledgement that it showed a grant or a ceremony. |
| `POST /api/session/:id/pause` | `{ reason: "leave" \| "background" \| "idle", clientSeq }`; replies `{ status: "paused" }`. |
| `POST /api/session/:id/break` | The rest-stop button: `{ action: "start" \| "end", clientSeq }`; replies `{ status: "resting" \| "playing" }`. |
| `POST /api/session/:id/extend` | «Ещё один ряд» after a `stop_offer`. |
| `GET /api/session/:id/events` | The SSE stream. |
| `GET /api/session/:id/poll?after=<seq>` | The stream's messages after `seq`, for a client whose stream dropped. |
| `POST /api/parent/login` | The PIN; opens a parent session. |
| `GET` and `PUT /api/parent/settings` | The parent settings, among them `threeDayLimit`. |
| `POST /api/parent/finish-today` | «Закончить на сегодня». |

`POST /api/game/forge`, `POST /api/game/shop/buy` and the other `/api/parent/*` routes follow the same contract, and their contents belong to ADR-0140 and ADR-0180. The API has no push route and no session mode `checkpoint` or `free`.

### Packets and replies

| Schema | What it carries |
| --- | --- |
| `Room` | An opaque random 128-bit `itemId`, the rendered `view`, the `InputSpec`, the slot, the room length, the attempt number, the thread stock and the hint levels already shown. |
| `AnswerIn` | `itemId`, `raw`, the client's `parsed` as a hint, `dontKnow`, the input timings and method, and `clientSeq`. |
| `AnswerOut` | For a first attempt the game outcome `clean`, `partial` or `alt`; for every attempt the streak, the grants, the thread stock, `feedback.correctAnswer` formatted for display, the short solution and `battleLine`, a line from the pool keyed by outcome. It has no verdict field. |
| `HintIn` | `level`, 1 to 3, and `clientSeq`. |
| `HintOut` | The hint level, its text and the thread stock. |
| `ExplainOut` | `status: "pending"` and the thread stock. |
| `ResumeOut` | `adventureId`, the packet to continue on, the rewards not yet delivered, and `wrapUp`. |
| `stop_offer` | `canExtend`. |
| `end` | `{ kind: "end" }`: the adventure has reached its finale or its short ending; a new session plans the next one. |
| `PollOut` | `messages`: the stream's messages after the `seq` asked for. |

### SSE messages

The stream `GET /api/session/:id/events` carries four messages, each with the `seq` of the log event it reports: `scene_ready`, `explanation_ready`, `lease_moved` and `safety_pause`. This part sends `explanation_ready` and `lease_moved`; the parts ADR-0110 defines send `scene_ready` and `safety_pause`. `explanation_ready` carries the `seq` of `explanation_bought`, the `itemId`, the source, `model` or `template`, and the text. The server keeps each session's messages in memory for the poll route, because the explanation's text never enters the log; after a restart the resume packet brings a client back.

### Events this part logs

`adventure_planned`, `adventure_started`, `adventure_paused` with the reason `leave`, `background`, `idle` or `lease_expired`, `adventure_resumed`, `adventure_completed`, `adventure_wrapped_up`, `session_started`, `session_ended`, `device_lease_taken`, `settings_changed`, `scene_prepared`, `text_draft_saved`, `rewards_delivered`, `attempt_late` and `item_focus`, all through `appendEvents`. It also logs, on the routes it serves, the types other decisions own: `attempt_submitted`, `verdict`, `hint_shown`, `thread_spent`, `explanation_bought` and `finish_today`. Every event of a daily session carries the adventure in its envelope.

| Event, v1 | Payload |
| --- | --- |
| `adventure_planned`, `adventure_started`, `adventure_completed` | `adventureId` |
| `adventure_wrapped_up` | `adventureId` and `unopenedSecrets` |
| `session_ended` | `sessionId` and the pause reason |
| `explanation_bought` | `itemId` and `attemptNo` |

### Statuses and error names

| Status or name | Audience | Meaning |
| --- | --- | --- |
| `409 lease_moved` | the player, on the device she left | another device holds the lease |
| `409 day_finished` | the player | `extend` after `finish_today`, until 04:00 |
| `401 parent_session_expired` | the parent | a parent request 30 minutes after the last one |
| `409 adventure_closed` | the developer | an event would move an adventure out of `complete` or `wrapped_up` |
| `409 session_ended` | the developer | `next`, `pause` or `break` on a session that has ended |
| `409 attempt_open` | the developer | a second attempt asked for before the first attempt's verdict |
| `409 not_a_first_attempt` | the developer | a second attempt asked for on a second attempt |
| `409 no_threads` | the player | a hint or an explanation with no thread left |
| `400 hint_level_skipped` | the developer | a hint level beyond the next one |
| `429 rate_limited` | the developer | more than 20 state-changing requests in a second from one device |
| `500` | the developer | an outgoing body failed its `.strict()` schema |
| `server_unreachable` | the player | the client can't reach the server and shows the waiting scene |
| `attempt_late` | the parent | an answer arrived for a task that already had its attempt |
| `queue_stuck` | the parent | an answer has stayed unsent on a device for 24 hours |

### What this part requires from other parts

- ADR-0020 supplies `appendEvents`, the unique `idem_key` column, the projections `adventures`, `sessions`, `reward_queue` and `resume_snapshot`, and the event schemas in `src/shared/events.ts`.
- SPC-0010 supplies the device token, the device's kind, `tablet` or `computer`, set at pairing and switched in the settings, the PIN check and its lockout, and the durable commit before a reply.
- ADR-0040 and ADR-0070 supply the tasks, the answer check and the next packet; ADR-0080 the threads, hints and second attempts; ADR-0090 the game day, the breaks and the soft stop; ADR-0110 the scenes, the short ending and the waiting scene; ADR-0120 the explanation text; ADR-0140 the grants, chests and secrets.
- ADR-0190 holds this part's budgets in its Baselines table.

The permitted dependencies run one way. The client imports only `src/shared/`, and nothing in `src/server/` or `src/engine/`. Route code writes to the log only through `appendEvents`. `src/shared/api.ts` imports only zod and `src/shared/`.

## Behaviour

### The server decides

The server decides every verdict, game outcome, estimate and next packet, and the client draws packets and sends input, with or without a connection (REQ-2400). The client checks an answer only against its `InputSpec`, such as digits, one decimal comma or a filled denominator (REQ-2402). The server parses `raw` again and ignores `parsed`.

Before any body leaves the server, the server parses it with its `.strict()` schema. A `Room` packet never carries the task's node, template, seed, parameters, purpose, scored flag, frame identifier, `flowSlot` or `why` (REQ-2428), and no packet sent before a task's first attempt carries its correct answer (REQ-2420). A warm-up and a scored task arrive in one packet shape and get one reply shape, and the client draws both the same way (REQ-2430).

### The answer

`POST /api/session/:id/answer` logs the attempt and its verdict through `appendEvents`, commits the transaction, and only then replies. With `dontKnow: true`, the server logs the verdict `dont_know`, apart from `wrong` and from an empty `raw` (REQ-2442). `AnswerOut` carries the streak, the grants and the short solution, and for a first attempt the game outcome (REQ-2416), and after every attempt `feedback.correctAnswer` formatted for display (REQ-2418). No string the reply can carry, from the `battleLine` pool or from its string keys, contains `верно` or `неверно` as a whole word (REQ-2414). The answer path makes no model call, and the server replies to an answer within 300 ms at the 95th percentile, from request received to reply sent.

### Repeated requests and charges

The server logs the events of every state-changing request under the key `<route>:<deviceId>:<clientSeq>`: the first event's `idem_key` is the key, and each later event's the key with `#1`, `#2` and so on, since `idem_key` is unique per event. A request whose key is already in the log appends nothing and gets the reply rebuilt from the events the first request logged, so an answer sent twice is recorded once (REQ-2432) and a hint sent twice spends one thread (REQ-2422).

A charge also has a key of its own that ignores `clientSeq`: a hint is charged at most once per item and hint level, an explanation at most once per item, and a second attempt is created at most once per item. The server finds a charge in the log, reading and appending with no other request between. A repeated second-attempt request returns the same parallel task (REQ-2426), and a hint, explanation or second attempt requested again after a resume, with a new `clientSeq`, charges no thread already paid (REQ-0214).

`POST /api/item/:itemId/explain` logs `thread_spent` and `explanation_bought` and replies `pending` at once (REQ-2424). The text arrives as `explanation_ready` on the stream, or as a template explanation after 10 seconds.

The server answers `429` to a device's 21st state-changing request within one second.

### Adventure and session lifecycle

An adventure is `planned`, `active`, `paused`, `complete` or `wrapped_up`, and a session `active` or `ended`; the `adventures` and `sessions` projections hold the state. `appendEvents` refuses an event that would move an adventure out of `complete` or `wrapped_up` (REQ-2404). A session's tasks count across the adventure's sessions, so a task left open is shown again in the next session.

`POST /api/session/start` with `daily` continues the adventure that is `planned`, `active` or `paused`, and plans a new one only when there is none (REQ-0226). The first `next` of a planned adventure logs `adventure_started`, and the first `next` of a paused one logs `adventure_resumed`. The `next` after the finale logs `adventure_completed` and returns `end`.

The client sends `POST /api/session/:id/pause` with `leave` from «Сохранить и уйти», which logs `adventure_paused` and `session_ended` and nothing else; every earlier action is already in the log, so she can leave at any moment, mid-task or mid-review (REQ-0200). On a finished adventure a leave logs `session_ended` alone. `background` and `idle` log the same pair as a leave, and on a finished adventure they get `409 adventure_closed`. The client sends `background`, with `fetch` and `keepalive`, when `visibilitychange` reports the page hidden (REQ-2406). It sends `idle` after 90 seconds without input outside the task window (REQ-2408), and after 5 minutes without input with a task open (REQ-2410). A rest stop or an eye exercise logs its own events and leaves the session `active` and the adventure unpaused (REQ-2412): `break` with `start` logs `rest_stop_started` and with `end` logs `rest_stop_ended`.

### One device at a time

`POST /api/session/start` and `POST /api/adventure/resume` take the lease for the calling device and log `device_lease_taken`. The client calls them only when the player taps to play or to continue, never when it opens. The holder sends a heartbeat every 15 seconds. After 45 seconds without one, the server logs `adventure_paused` with the reason `lease_expired` and `session_ended`, as device `server`, or `session_ended` alone on a finished adventure, and the state equals the one «Сохранить и уйти» leaves, so a closed app, a flat battery or a change of device keeps the same state (REQ-0202).

The server accepts state-changing requests only from the lease holder and answers any other device `409 lease_moved` (REQ-0220). When the lease moves, the server sends `lease_moved` on the old device's stream, and that device turns view-only and shows «Приключение продолжено в другом месте» with a button to continue there (REQ-0222).

An answer from a device that lost the lease is still logged, and its reply is `409 lease_moved`. When the item has no attempt yet, the server records the answer as that attempt, and the new holder gets the outcome with its next packet. When the item has one, the server logs `attempt_late` with the raw answer, and it gets no verdict, no grants and no weight in the estimate.

### Resume

The `resume_snapshot` projection updates in the same transaction as the event that changes it, and after every adventure event it equals the resume point derived from the log alone (REQ-0206). `POST /api/adventure/resume` returns it as `ResumeOut`: the same floor, room, slot, `itemId` and view, attempt step, scene line and rewards not yet delivered (REQ-0204).

Everything the snapshot holds is in the log (REQ-0208). `scene_prepared` holds the scene lines and branches as they passed the safety checks. `text_draft_saved` holds her free-text draft, sent at most once every 10 seconds while she types. `rewards_delivered` records each grant or ceremony the client showed. A resumed scene continues from `scene_prepared` with no new request to the Master (REQ-0216). A chest reopens with the three options its `chest_offered` holds (REQ-0218), and the random generator's state follows from the adventure seed and the draws logged.

A task left unanswered comes back as the same first attempt, and its answer counts towards accuracy (REQ-0210). When a pause lies between a task's `item_shown` and its `attempt_submitted`, the server sets `interrupted: true` on the attempt, and its time counts in no measure (REQ-0212). When an attempt is submitted on a device of another kind than the one that showed its task, the server sets `crossDevice: true`, and its time counts in no measure (REQ-0224).

### Adventures across days

An adventure day is a game day, from 04:00 to 04:00, with active time in that adventure; a game day without play in it doesn't count (REQ-0236). `threeDayLimit` is 3 by default and can be switched off, and `PUT /api/parent/settings` changes it and logs `settings_changed` (REQ-0234).

When the first session of a new game day starts on an adventure that already has `threeDayLimit` adventure days, `ResumeOut.wrapUp` is true. The server lets the open task and room finish, plays the short ending from the scene library and logs `adventure_wrapped_up` with the secrets she didn't open (REQ-0228). `reward_queue` takes those secrets (REQ-0232). The wrap-up logs no reversing grant and removes no event, so she keeps everything she earned (REQ-0230).

### The answer queue and the offline state

The client writes each answer to its IndexedDB queue and waits for the write to commit before it sends the answer. It retries from 1 second, doubling to at most 30 seconds, and on launch it flushes the queue before it asks to resume, so every answer reaches the log through a dropped connection, a closed app or a restart (REQ-2434). The queue holds at most one answer per device. An answer unsent for 24 hours shows as `queue_stuck` in that device's settings, with the answer's time and a retry button.

While the client has no connection, the hint, explanation and second-attempt controls are inactive (REQ-2436). After an answer goes into the queue with no connection, the client shows the waiting scene «Туман над тропой, фамильяр ищет дорогу» and no new task until the server answers; the outcome and the grants then arrive together (REQ-2438).

### The parent's session and the end of the day

`POST /api/parent/login` with the PIN opens a parent session with its own `HttpOnly` cookie, apart from the device token. Every parent route needs both the parent session and a paired device. The parent session expires 30 minutes after its last request (REQ-2440).

`POST /api/parent/finish-today` logs `finish_today`. At the next boundary, after an answer with its review or after a scene, `GET /api/session/:id/next` returns `stop_offer` with `canExtend: false`. For the rest of that game day the client offers no «Ещё один ряд», and the server answers `extend` with `409 day_finished` (REQ-2444).

## Failure paths

| Condition | What happens |
| --- | --- |
| The same request arrives twice with one `clientSeq` | The server appends nothing and returns the reply rebuilt from the first request's events. |
| A hint, explanation or second attempt is requested again with a new `clientSeq` | The charge key finds the earlier charge; no thread is spent and the same result returns. |
| A device sends a state-changing request without the lease | `409 lease_moved`; an answer in it is still logged as the attempt or as `attempt_late`. |
| The holder's heartbeat stops for 45 seconds | The server logs the pause with `lease_expired` and ends the session. |
| Two devices are open and neither is tapped | Neither takes the lease. |
| An event would reopen a complete or wrapped-up adventure | `appendEvents` refuses it, the transaction rolls back, and the request gets `409 adventure_closed`. |
| An outgoing body carries a field outside its schema | The request fails with `500`, and the body never reaches the client. |
| A device sends more than 20 state-changing requests in a second | `429 rate_limited` until the second passes; a refused request doesn't count. |
| The SSE stream drops, for example when iPadOS suspends the page | The client reads what it missed from the poll route and the resume packet. |
| The explanation text isn't ready after 10 seconds | The client receives a template explanation. |
| The server can't be reached | The client keeps the answer in its queue, shows the waiting scene (`server_unreachable`), keeps the three help controls inactive and shows no new task. |
| The page is killed after the tap and before the send | The answer is already in IndexedDB, and the next launch sends it before resuming. |
| An answer stays unsent for 24 hours | `queue_stuck` shows in the device's settings with the answer's time and a retry button. |
| The log write fails | The server replies `503` (`log_write_failed`, ADR-0020), and the client keeps the answer in its queue. |
| A parent request comes 30 minutes after the last one | `401 parent_session_expired`; the client shows the PIN screen again and keeps the page. |
| `extend` after `finish_today` on the same game day | `409 day_finished` until 04:00. |
| The answer reply takes longer than 300 ms at the 95th percentile | The verify report shows the measure against ADR-0190's Baselines table. |
