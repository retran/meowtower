---
id: RES-2400
artifact: research
status: draft
revised: 2026-09-27
---

# The draft proposes a server-authoritative HTTP API with an adventure and session lifecycle, a device lease and an offline answer queue

## Summary

The owner's draft specification proposes that the server is the only source of truth: the event log, the Director, graph traversal, verdicts and estimates all live on the server. The client receives "rooms", draws them and sends answers back, and zod schemas in `src/shared/api.ts` are shared by client and server. An adventure is a unit of story and plan that can span several days, and a session is one continuous stretch of play on one device, which is what time is counted by. The draft gives a state machine for both, the transitions with their triggers, a device lease with a 15-second heartbeat, and the rules for the time counters. It lists more than 30 endpoints for play, game economy, pausing, events and the Parent Room, and a fragment of the TypeScript types. The client never learns a task's node, template, purpose or whether it is scored, queues every answer in IndexedDB, and never computes an outcome itself. This record covers the lifecycle, the endpoints, the types and the client's connection rules; the event log is in RES-2200 and the report content in RES-2300.

## The question

How do the client and the server divide the work, and how does an adventure survive pauses, device changes and a lost connection? The draft assumes the client must be thin and blind to the measurement design, so that the child can't tell a scored task from warm-up. That keeps the measurement clean, but it makes every hint, explanation and new task depend on the server being reachable, and the draft accepts that trade without weighing a client that can serve a pre-fetched task offline.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles: specification), sections «Текущий объём (MVP)» (Current scope, the MVP) introduction and «API и жизненный цикл» (API and lifecycle) with its subsections «Жизненный цикл приключения и сессии» (Lifecycle of adventure and session), «Конечные точки» (Endpoints) and «Клиент и связь» (Client and connection), on 2026-09-26. The draft is a draft, so every finding below is what the draft proposes, not what was decided.

The draft leaves these points open:

- the types `ItemViewOut`, `InputSpec` and `SolutionView`, which the fragment uses but doesn't define;
- the shape of `scene.lines`, `end.summary` and `ResumeOut.pendingRewards`, all typed `z.unknown()`;
- how long a device token from `POST /api/pair` lives, and how the child's device authenticates after pairing;
- what happens when two devices both hold queued answers after the lease moves from one to the other;
- the default daily maximum and the default period of the three-day rule, both parent settings (the resolved finding below sets the period at three adventure days; the owner removed the daily maximum on 2026-09-27);
- the payloads of the review queues and the bakeoff under `/api/parent/review/*` and `/api/parent/bakeoff`;
- whether `POST /api/parent/recompute` can choose a graph version, which RES-2200 says each snapshot records.

## Findings

### The draft makes the server the only source of truth and the client a renderer

The event log, the Director, graph traversal, verdicts and estimates live on the server. The client gets rooms, draws them and sends answers. All request and response schemas are zod schemas in `src/shared/api.ts`, shared by client and server.

### An adventure can span days, and a session is one continuous stretch on one device

An adventure is a unit of story and plan and can last several days. A session is one continuous stretch of play on a device, and time is counted by sessions. The draft gives these state machines:

```text
adventure: planned → active ⇄ paused → complete
                                  ↘ wrapped_up   (three-day rule)
session:   active → ended
```

### The draft lists each lifecycle transition and its trigger

| Transition | When |
| --- | --- |
| planned → active | the first `next` request after the adventure of the day starts |
| active → paused | the button «Сохранить и уйти» (Save and leave); the app goes to the background; no action for 90 seconds outside the task window, or for 5 minutes with a task open (thinking long about a task is normal); the draft also paused at the daily maximum, which the owner removed on 2026-09-27 |
| active → active (break) | the button «Привал» (Rest stop) or an eye exercise: a `break` packet, and the adventure is not paused |
| paused → active | `resume` from any paired device; the server returns the exact point from `ResumeSnapshot` |
| active → active (soft stop) | at 60 minutes of active time, if the adventure isn't finished: a story offer to save (the draft said about 45 minutes) |
| active → active (extension) | `extend`: +20 minutes, after which the soft stop returns on an unfinished adventure (the draft said +15, capped by the daily maximum) |
| active → complete | the finale of the adventure |
| paused → wrapped_up | on return on a new game day, if the adventure already has three adventure days (the draft said «started three or more days ago»): the open task and room are finished, then a short wrap-up (the draft refers to its section on leaving at any moment and resuming from the same place) |

### The draft's soft stop at about 45 minutes predates the owner's one-hour target

This range puts the soft stop at about 45 minutes. The draft's opening paragraph gives the adventure as «около 30–45 минут» (about 30-45 minutes), while its MVP summary says «около 60 минут» (about 60 minutes), so the draft contradicts itself on length. The owner has since settled the target length of the adventure of the day at one hour, 60 minutes of active time. A soft stop at 45 minutes would come a quarter of an hour before that target.

### Resolved: The soft stop comes at 60 minutes, `extend` adds 20 minutes, and the parent settings default to 100 minutes and three adventure days

The owner decided on 2026-09-26: the adventure lasts 60 minutes, and the soft stop comes at 60 minutes of active time. Research on the same day set the rest, and RES-0300 and RES-0200 hold the comparisons:

- `extend` adds 20 minutes, the MVP section's figure, over the 15 minutes this range gives, because the 15 comes from the sections that also put the soft stop at 45;
- the daily maximum in `PUT /api/parent/settings` defaults to 100 minutes, because a default of 60 would put the hard end on the soft stop and let no extension run, and 100 lets two extensions run under the 2-hour daily guideline for recreational screen time (the owner's decision of 2026-09-27 replaced this item, see «Resolved: the API has no daily maximum» below);
- the period of the three-day rule is counted in adventure days, the game days ending at 04:00 on which she played the open adventure, and defaults to three, so a day she doesn't play never brings the wrap-up closer.

Proposed by research on 2026-09-26; the owner approves it with this record.

### Resolved: the API has no daily maximum, and `extend` can repeat each time the soft stop returns

The owner decided on 2026-09-27: there is no daily maximum. `PUT /api/parent/settings` has no daily-maximum field and no 100-minute default, and no transition pauses the adventure at a daily maximum. The soft stop still comes at 60 minutes of active time as a `stop_offer` packet. Each `extend` adds 20 minutes, and when they run out on an unfinished adventure the server sends `stop_offer` again. RES-0300 lists what still limits play: the returning soft stop, the eye exercise every 20 minutes and one new adventure a day. The draft of this finding had no endpoint for the parent to end a session from the Parent Room, left that to the owner, and said `canExtend` would then always be true.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. No daily maximum returns. The API gains `POST /api/parent/finish-today`, the «Закончить на сегодня» (Finish for today) control in the Parent Room. It marks the current game day as finished by the parent. At the next boundary, after an answer with its review or after a scene, the server sends `stop_offer` with `canExtend: false`, so the client shows no «Ещё один ряд», and the adventure saves as it does when she accepts the offer. `canExtend` therefore keeps a use: it is false only after this call. `GET /api/parent/report` marks each day whose active time passed 120 minutes (RES-2300). The screens after the finale send no task packets, and their time counts towards the eye exercise counter, so the server still sends a `break` packet every 20 minutes there. RES-0300 holds the reason.

### One device holds the adventure at a time, through a lease

An adventure is not tied to a device. Only one device is active at a time: it holds a lease with a heartbeat every 15 seconds. Signing in on another device takes the lease, and the first device switches to view-only mode.

### Estimates cover unfinished adventures, because every answer is already logged

Every answer is in the event log as soon as it arrives, so estimates are recomputed for unfinished adventures too.

### Time counters run only in an active session, and breaks count differently per counter

Time counters run only in an active session. The soft stop counts all active time of the day, including breaks (`break`: eye exercises and rest stops). The 20-minute eye counter excludes breaks. Task times exclude breaks.

### The draft lists the endpoints

| Method and path | Purpose |
| --- | --- |
| `POST /api/pair` | exchanges a pairing code for a device token |
| `POST /api/session/start` | `{ mode: "zero" \| "daily" }` → a session (modes `checkpoint` and `free` come later); for `daily` the server continues the open adventure or starts a new one |
| `GET /api/adventure/current` | the open adventure: status, where play stopped (floor, room, slot), whether it started three or more days ago |
| `POST /api/adventure/resume` | takes the lease on this device and returns the exact packet from `ResumeSnapshot` (the same task, the same attempt step, the same scene line, rewards not yet given) |
| `GET /api/session/:id/next` | the next packet: `room`, `scene`, `chest`, `break`, `stop_offer`, `end` |
| `POST /api/session/:id/chest` | `{ chestId, rewardId }`: a choice of 1 of 3; the server has already fixed the chest's contents |
| `POST /api/session/:id/answer` | an answer to a task (first or second attempt); the server replies with `AnswerOut`: the game outcome (for the first attempt), the streak, the grants, the correct answer and the short solution; no words «верно/неверно» (right/wrong) |
| `POST /api/item/:itemId/hint` | before the answer: spends 1 thread and returns the next hint level; the attempt becomes assisted; a repeat call with the same `clientSeq` doesn't spend a second thread |
| `POST /api/item/:itemId/explain` | after the answer: spends 1 thread and starts a detailed explanation; replies `pending` at once, and the finished explanation arrives as the SSE event `explanation_ready`, or a fallback template explanation after 10 seconds |
| `POST /api/item/:itemId/second-attempt` | after the review: a parallel task for the second attempt; idempotent, so a repeat call returns the same task |
| `POST /api/game/forge` | `{ recipeId }`: forging by recipe from materials |
| `POST /api/game/shop/buy` | `{ offerId }`: a purchase in the shop for buttons |
| `POST /api/session/:id/pause` | `{ reason: "background" \| "idle" \| "leave" }` (`leave` is «Сохранить и уйти») |
| `POST /api/session/:id/break` | the «Привал» button: the next packet is a `break` of type `camp`, and the session stays `active` |
| `POST /api/session/:id/resume` | continue after a pause (a synonym of `adventure/resume` for the current session) |
| `POST /api/session/:id/extend` | extend by 20 minutes (the draft said 15) |
| `POST /api/session/:id/scene/input` | free text or a choice of option in a scene |
| `GET /api/session/:id/events` | SSE: scene ready, explanation ready, lease passed to another device, safety pause |
| `GET /api/session/:id/poll?after=` | a polling fallback for SSE |
| `POST /api/parent/login` | PIN → a parent session (cookie, 30 minutes without activity) |
| `GET /api/parent/report` | summary, VWO, map; `?at=` gives a snapshot for a date |
| `GET /api/parent/node/:id` | node card |
| `GET /api/parent/export/events.{jsonl,parquet}` | raw event log |
| `GET /api/parent/export/{attempts,items}.{csv,parquet}` | flat tables of attempts and tasks shown, field dictionary |
| `POST /api/parent/recompute` | `{ modelVersion?, thresholdVersion? }`: rebuild the derived tables from the log; the reply is a summary of differences from the old version |
| `POST /api/parent/tags`, `DELETE /api/parent/tags/:id` | tags «занимались на уроке» (worked on this in a lesson) |
| `POST /api/parent/items/:id/flag` | the task is ambiguous |
| `POST /api/parent/finish-today` | «Закончить на сегодня» (Finish for today): the next boundary brings `stop_offer` with `canExtend: false`, and no extension is offered that day (added by research on 2026-09-27, on the owner's instruction) |
| `GET`/`PUT /api/parent/settings` | period of the three-day rule, default device, creepiness level (0/1/2), personal data to clean |
| `POST /api/parent/devices/pair-code`, `DELETE /api/parent/devices/:id` | pairing and revoking devices |
| `GET`/`POST /api/parent/review/*` | queues: frames, lines, graphics, scenes, and glossary entries whose Dutch equivalent the parent approves before it shows (the glossary queue added by research on 2026-09-27, on the owner's instruction; RES-0800) |
| `GET /api/parent/alerts` | safety alarms, shown in the Parent Room only in the MVP, as the owner decided on 2026-09-27 (RES-1800); the web push to the parent's phones comes after the MVP (the earlier text sent each alarm as a web push too) |
| `GET`/`POST /api/parent/bakeoff` | blind rating of candidate models' answers, key reveal, results |

Deferred until after the MVP by the draft: the session modes `checkpoint` and `free`. Deferred until after the MVP by the owner's decision of 2026-09-27: the push subscription endpoints and the web push of alarms, so the MVP API has no push route.

### The draft gives a fragment of the shared TypeScript types

The fragment is quoted as the draft gives it, with its Russian comments:

```typescript
// src/shared/api.ts (фрагмент)
import { z } from "zod";

export const Room = z.object({
  kind: z.literal("room"),                       // одно задание внутри комнаты-боя
  itemId: z.string(),                            // непрозрачный случайный id; соответствие заданию — только на сервере
  roomId: z.string(),                            // комната-бой из 3–5 заданий
  slot: z.number().int(), roomLength: z.number().int(), // номер заклинания и длина комнаты, заданная до начала
  attempt: z.union([z.literal(1), z.literal(2)]),  // 2 — вторая попытка на параллельном задании
  threads: z.number().int(),                     // запас путеводных нитей (поле кода)
  hintLevelShown: z.number().int().min(0).max(3), // уже купленные ступени подсказки (после продолжения)
  view: ItemViewOut,                             // готовое представление: text, svg?, options?, terms (без frameId/anchorId)
  input: InputSpec,                              // вид ввода: kind, fields, maxPlaces?, grid?, count?, stepsMax?, scratch
  leadIn: z.string().optional(),                 // подводка Мастера
});                                              // nodeId, templateId, seed, params, purpose, scored клиенту не передаются

export const AnswerIn = z.object({
  itemId: z.string(),
  raw: z.string(),
  parsed: z.unknown().optional(),                // клиентский разбор; сервер разбирает заново
  firstKeyMs: z.number(), submitMs: z.number(),
  edits: z.number().int(),
  inputMethod: z.enum(["ipad-touch", "ipad-pencil", "ipad-keyboard",
    "desktop-keyboard", "desktop-mouse"]),
  steps: z.array(z.string()).optional(),
  modelChoice: z.number().int().optional(),
  scratchKind: z.enum(["none", "canvas", "grid-text"]),
  glossaryOpened: z.array(z.string()),
  focusLostMs: z.number(),
  clientSeq: z.number().int(),                   // для повторной отправки без дублей
});

export const AnswerOut = z.object({                // что клиент узнаёт после ответа
  itemId: z.string(),
  outcome: z.enum(["clean", "partial", "alt"]),  // игровой исход; верный ответ не передаётся
  combo: z.enum(["none", "clean_row", "big_clean_row"]),
  critical: z.boolean(),
  battleLine: z.object({ id: z.string(), text: z.string() }), // из пула по исходу
  grants: z.object({ xp: z.number().int(), buttons: z.number().int(),
                     shards: z.number().int(), yarn: z.number().int() }),
  attempt: z.union([z.literal(1), z.literal(2)]),
  feedback: z.object({                           // приходит после каждой попытки
    correctAnswer: z.string(),                   // отформатированный верный ответ
    solution: SolutionView.optional(),           // короткое решение: сразу после alt, по кнопке после clean
    secondAttempt: z.boolean(),                  // будет ли вторая попытка
    explainAvailable: z.boolean(),               // можно купить объяснение за нить
  }),
  threads: z.number().int(),
  roomEnd: z.object({ branch: z.enum(["success", "alt", "ascent"]), sceneId: z.string() }).optional(), // ascent — позже, только Восхождение
  floorEnd: z.object({ state: z.enum(["triumph", "victory", "cunning"]).optional(), // нет у этажа без комнат и Стража
                      sceneId: z.string().optional() }).optional(),        // концовка Стража или строка Системы
});

export const HintOut = z.object({ itemId: z.string(), level: z.number().int().min(1).max(3),
                                  text: z.string(), threads: z.number().int() }); // попытка теперь assisted

export const ExplainOut = z.object({ itemId: z.string(), status: z.enum(["pending", "ready"]),
  source: z.enum(["llm", "cache", "template"]).optional(),
  lines: z.array(z.object({ speaker: z.string(), text: z.string() })).optional(), // числа уже подставлены кодом
  threads: z.number().int() });

export const ResumeOut = z.object({ adventureId: z.string(), next: z.lazy(() => Next),
  pendingRewards: z.array(z.unknown()), wrapUp: z.boolean() }); // wrapUp — после текущей комнаты сработает правило трёх дней

export const Next = z.discriminatedUnion("kind", [
  Room,
  z.object({ kind: z.literal("scene"), sceneId: z.string(), lines: z.array(z.unknown()),
             dreamcore: z.boolean() }),
  z.object({ kind: z.literal("break"), type: z.enum(["eyes", "camp"]) }),
  z.object({ kind: z.literal("chest"), chestId: z.string(), source: z.enum(["room", "floor", "zero"]),
             options: z.array(z.object({ rewardId: z.string(), quality: z.enum(["common", "good", "sparkling"]) })).length(3) }),
  z.object({ kind: z.literal("stop_offer"), canExtend: z.boolean() }),
  z.object({ kind: z.literal("end"), summary: z.unknown() }),
]);
```

The comments carry these rules, glossed in English:

- `Room` is one task inside a battle room of 3-5 tasks. `itemId` is an opaque random identifier, and only the server maps it to a task. `slot` and `roomLength` give the spell number and the room length, fixed before the room starts. `attempt` 2 is the second attempt on a parallel task. `threads` is the stock of guiding threads. `hintLevelShown` (0-3) is the hint levels already bought, for a resume. `view` is the ready view (text, optional SVG, options, terms, without `frameId` or `anchorId`). `input` is the kind of input (kind, fields, optional max places, grid, count, max steps, scratch). `leadIn` is the Master's lead-in. The client never receives `nodeId`, `templateId`, `seed`, `params`, `purpose` or `scored`.
- `AnswerIn.parsed` is the client's parse, and the server parses again. `clientSeq` lets the client resend without duplicates.
- `AnswerOut.outcome` is the game outcome. `battleLine` comes from a pool by outcome. `feedback` arrives after every attempt: `correctAnswer` is the formatted correct answer; `solution` is the short solution, shown at once after `alt` and by a button after `clean`; `secondAttempt` says whether a second attempt follows; `explainAvailable` says whether an explanation can be bought for a thread. `roomEnd.branch` value `ascent` is for the Ascent only and comes later. `floorEnd.state` is absent on a floor with no rooms and no Guardian, and `floorEnd.sceneId` is the Guardian's ending or a System line.
- `HintOut` makes the attempt assisted.
- `ExplainOut.lines` already have numbers put in by code.
- `ResumeOut.wrapUp` means the three-day rule fires after the current room.

Deferred until after the MVP by the draft: the `ascent` branch of `roomEnd`.

### Resolved: AnswerOut carries the correct answer in `feedback.correctAnswer` after every attempt, and no packet carries it before the first attempt

Proposed by research on 2026-09-26; the owner approves it with this record.

The draft said both things. The comment on `AnswerOut.outcome` reads «игровой исход; верный ответ не передаётся» (game outcome; the correct answer is not sent). The same schema has `feedback.correctAnswer`, commented «отформатированный верный ответ» (formatted correct answer), and the endpoint table says the reply to `answer` carries «верный ответ и короткое решение» (the correct answer and the short solution).

I compared three options:

| Option | Better at | Why it loses or wins |
| --- | --- | --- |
| `AnswerOut` carries the correct answer after every attempt | one round trip; the answer arrives with the outcome, so the offline catch-up scene shows both at once | wins: RES-0400 (conclusion 13), RES-1200, RES-1700, RES-0100 and RES-0010 all show the correct answer after every attempt |
| A separate request fetches the answer when the task window opens the review | keeps the answer off the client until the player looks | loses: daily play always shows the answer, so the extra request buys nothing and adds one more call that fails offline |
| No reply carries the answer | the strictest reading of the comment | loses: it breaks the single mode in RES-0400, where the first attempt measures and learning follows it |

The comment on `outcome` is read as saying that `outcome` is a game outcome and not a verdict word, and that the `Room` packet never carries the answer before the first attempt. RES-2550 (conclusion 7) and RES-1200 keep the answer on the server until then. Anchor tasks, which hide the answer, come later with the Ascents (RES-0400, RES-1100) and will need a flag that leaves `correctAnswer` out.

### Resolved: `AnswerOut.outcome` keeps `clean | partial | alt`, `AnswerIn` gains `dontKnow`, and the client picks the outcome badge from the outcome, `critical` and its own «Не знаю»

Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's design has five outcome badges, including `crit` and a separate `unknown` («Принято», Accepted) for «Не знаю» (RES-3200). RES-1700 compares a fourth game outcome for «Не знаю» with one `alt` outcome shown two ways, and holds the reason for one outcome: every consequence is the same as a wrong answer's. The API needs one change for that. The draft's `AnswerIn` has no field that says the player pressed «Не знаю»; an empty `raw` would be ambiguous with a submit before typing. So `AnswerIn` gains `dontKnow: z.boolean()`, and the server records the verdict `dont_know` from it (RES-2550). I compared this with adding a `badge` field to `AnswerOut`. That would work too, but the client already knows it sent «Не знаю» and already receives `critical`, so a new reply field would repeat what the client holds. The client maps `outcome`, `critical` and its own `dontKnow` to the badge by the table in RES-1700. This is display, not a verdict, so it keeps the rule that the client never computes an outcome.

### The client can't tell a scored task from any other task

The client doesn't know the node, the template, `purpose` or `scored`. Warm-up, easy, review, anchor and ordinary tasks arrive in one shape and look the same. The client shows the outcome (`AnswerOut`) the same way for scored and unscored tasks. For debugging, the parent sees everything in the node card, not in the game client.

### The client validates input format only, and the server decides everything else

The client shows the `view` it receives and an input field built from `input`. It validates input locally only for the interface, that is, the input format. The verdict, the estimates and the choice of the next room stay on the server.

### Every answer goes through an IndexedDB queue with retries, and the server drops duplicates

Each answer is first written to a queue of unsent answers in IndexedDB and sent with retries. The server drops duplicates by `clientSeq`.

### Without a connection the client shows a neutral flash and waits, and no answer may be lost

Hints, explanations and second attempts need the server: without a connection their buttons are inactive, and the short solution catches up with the outcome. When the connection drops, the client never computes an outcome itself, because only the server gives a verdict. The spell shows as a neutral flash, and the outcome and grants catch up after reconnection in one scene, «Нити вспомнили, что случилось» (The threads remembered what happened). No new task appears without the server: after a queued answer the client shows a story waiting scene, «Туман над тропой, фамильяр ищет дорогу» (Mist over the path, the familiar is looking for the way), and waits. The room continues from the same slot. After reconnection the server recomputes everything from the answers that arrived.

## Conclusions

1. The server must hold the event log, the Director, graph traversal, verdicts and estimates, and the client must only render packets and send answers.
2. Client and server must share one set of request and response schemas.
3. The game must track an adventure through the states planned, active, paused, complete and wrapped_up, and a session through active and ended.
4. The game must pause the adventure on «Сохранить и уйти», on the app going to the background, after 90 seconds idle outside the task window, and after 5 minutes idle with a task open; the draft's pause at the daily maximum is removed.
5. A rest stop or an eye exercise must keep the session active and must not pause the adventure.
6. Resuming from any paired device must return the exact point stored in the resume snapshot: the same task, attempt step, scene line and rewards not yet given.
7. The soft stop must come at 60 minutes of active time, the owner's decision, because a soft stop at the draft's 45 minutes would interrupt the adventure before its target length.
8. An extension must add 20 minutes, and the soft stop must return when they run out on an unfinished adventure; the game has no daily maximum, as the owner decided on 2026-09-27.
9. On return on a new game day to an adventure that already has three adventure days, the game must finish the open task and room and then play a short wrap-up.
10. Only one device must hold an adventure at a time, through a lease with a 15-second heartbeat, and a sign-in on another device must move the lease and leave the first device view-only.
11. The soft stop must count all active time including breaks, while the eye-exercise counter and task times must exclude breaks.
12. The answer reply must never contain the words «верно» or «неверно», and must carry the game outcome, streak, grants, correct answer and short solution.
13. A hint must cost 1 guiding thread, mark the attempt as assisted and never charge twice for the same `clientSeq`.
14. An explanation must cost 1 guiding thread, reply `pending` at once and fall back to a template explanation after 10 seconds.
15. The second-attempt request must be idempotent and return the same parallel task on repeat.
16. The chest's contents must be fixed on the server before the player chooses 1 of 3.
17. The client must never receive a task's node, template, seed, parameters, purpose or scored flag, and must show every task and outcome the same way whether it is scored or not.
18. The client must validate only the input format, and must never compute a verdict or an outcome, even offline.
19. Every answer must go through a persistent client queue with retries, the server must drop duplicates by `clientSeq`, and no answer may be lost.
20. Without a connection the client must disable hints, explanations and second attempts, show no new task, and show a story waiting scene until the server returns.
21. A parent session must start from the PIN and expire after 30 minutes without activity.
22. The reply to every attempt must carry the formatted correct answer in `feedback.correctAnswer`, and no packet the client receives before the first attempt may carry the correct answer.
23. `AnswerIn` must carry `dontKnow`, the server must record the verdict `dont_know` from it, and `AnswerOut.outcome` must stay `clean | partial | alt`, with the client choosing the outcome badge from `outcome`, `critical` and `dontKnow`.
24. The parent settings must carry no daily maximum, and the server must send `stop_offer` again each time an extension's 20 minutes run out on an unfinished adventure.
25. In the MVP, `GET /api/parent/alerts` must be the only way an alarm reaches the parent, and the API must have no push subscription route until after the MVP, as the owner decided on 2026-09-27.
26. `POST /api/parent/finish-today` must make the server send `stop_offer` with `canExtend: false` at the next boundary and offer no extension for the rest of that game day, as research decided on 2026-09-27 on the owner's instruction.
27. `GET /api/parent/report` must mark each day whose active time passed 120 minutes, and the screens after the finale must send no tasks while their time counts towards the eye exercise counter, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's draft «Хроники Башни — спецификация», sections «Текущий объём (MVP)» and «API и жизненный цикл» with «Жизненный цикл приключения и сессии», «Конечные точки» and «Клиент и связь», read 2026-09-26; not kept in the repository - every finding and conclusion above.
- The owner's decision that the adventure lasts 60 minutes and the soft stop comes at 60 minutes of active time, relayed 2026-09-26 - conclusion 7 and the resolved finding.
- The owner's decision that the game has no daily maximum, relayed 2026-09-27 - conclusions 4, 8 and 24 and the resolved finding on it.
- Canadian Society for Exercise Physiology, «Children & Youth 5-17 Years - 24-Hour Movement Guidelines», https://csepguidelines.ca/guidelines/children-youth/, read 2026-09-26 - no more than 2 hours of recreational screen time a day, behind the default daily maximum the owner later removed.
