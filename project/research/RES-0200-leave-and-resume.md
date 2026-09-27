---
id: RES-0200
artifact: research
status: draft
revised: 2026-09-26
---

# The draft proposes that the player can leave at any moment and resume at the same step on any paired device

## Summary

The draft proposes a «Сохранить и уйти» (Save and leave) button that is always present, even in the middle of a task or a review. Closing the app, a flat battery or a change of device give the same result as the button. On return the player lands at the same floor, room, slot, task, attempt step, unread scene line and undelivered rewards. A resume snapshot kept on the server holds that position, and it is derived entirely from the event log. One device is active at a time, holding a lease with a heartbeat every 15 seconds. An adventure left unfinished carries over to the next day, and a three-day rule closes it with a short ending. This record covers leaving, the resume snapshot, the resume rules, the change of device and the unfinished adventure. It leaves the daily structure, clocks and breaks, and the event log's full contents to other records.

## The question

What must survive when the player stops, and how does the game put her back? The draft assumes that one server-side snapshot, derived from the log, can restore every step exactly. A challenge to that: a snapshot that includes prepared story branches and free-text drafts holds more than the log's facts, so the claim that it derives wholly from the log needs those items to be logged as events too.

## Method

Read the owner's draft «Хроники Башни — спецификация», section «Выход в любой момент и продолжение с того же места» (Leaving at any moment and resuming from the same place) inside «Текущий объём (MVP)», on 2026-09-26.

The draft leaves open whether three days is the right limit for an unfinished adventure, or whether it should close on the second day, and whether the days are calendar days or days of play; the resolved finding below settles the second question. It doesn't say how devices are paired, and it doesn't define a device type for the rule on comparing times.

## Findings

### The save-and-leave button is always present, and every other way out behaves the same

The button «Сохранить и уйти» is always available, including in the middle of a task and in the middle of a review. A closed app, a flat battery or a change of device produce the same result as pressing it.

### Resume restores the exact position, down to the task representation

The player returns to the same point: the same floor, room and slot, the same task (the same `itemId` and the same representation, not a new task), the same attempt step, the same unread scene and the same undelivered rewards.

### The resume snapshot lives on the server and derives from the event log

The resume snapshot (`ResumeSnapshot`) is stored on the server and updated after each adventure event. It derives entirely from the event log. The stored copy exists only for speed, and a test checks that it matches what the log yields.

| Field | What it holds |
| --- | --- |
| `adventureId`, `lastEventSeq` | the adventure and the number of the last event taken into account |
| `route`, `floorIndex`, `floor` | the adventure's route and the current floor |
| `roomId`, `roomLength`, `slot` | the room, its length (assigned before it starts) and the slot number |
| `pendingItem` | `itemId`, attempt number (1 or 2), attempt state: `shown`, `hint_shown` (with the hint level), `answered_feedback_pending`, `solution_shown`, `explanation_pending`, `explanation_shown`, `second_attempt_shown`; threads spent on the task |
| `pendingScene` | `sceneId`, line number, options shown, draft of free text |
| `pendingRewards` | an unchosen chest, undelivered credits, pending ceremonies (level, evolution, hatching) |
| `pendingBreak` | an eye exercise or rest stop already started |
| adventure state | the streak (the garland), the flow window, the 20-minute eye counter, quest progress, the current plan beat, the seed generator's state, prepared scenes and branches |

### An open task comes back unchanged, and an unanswered one stays a first attempt

An open task is shown again as the same task. If no answer was given, it is still the first attempt: its accuracy counts towards the estimate, and its time doesn't (`interrupted: true`).

### A review, explanation or second attempt resumes at the same step without charging a thread twice

If the player left during a review, an explanation or a second attempt, it is shown again from the same step. A guiding thread already spent isn't charged again.

### An unread scene continues from the same line without a new call to the Master

The prepared branches are stored with the snapshot, so the scene resumes at the same line without a new request to the Master.

### Undelivered rewards are delivered at once, and an unchosen chest reopens with the same three options

After the player returns, undelivered rewards arrive at once. An unchosen chest opens again with the same three options.

### A break longer than 5 minutes brings an unscored warm-up before the next new task

After a break longer than 5 minutes, an unscored warm-up comes before the next new task, as after any pause. An open task still stays first.

### One device is active at a time, holding a lease with a 15-second heartbeat

The adventure isn't tied to a device: the player can continue on any paired device. Only one device is active at a time; it holds a lease and sends a signal every 15 seconds. When the player signs in from another device, the server hands the lease there. The first device shows «Приключение продолжено в другом месте» (The adventure has continued elsewhere) and switches to view-only mode. The change of device is written as an event.

### Task times are compared only within one device type

Times are compared only within one type of device. A task started on one device and finished on another therefore has no usable time.

### An unfinished adventure carries over, and a three-day rule closes it

On the next day the game continues the same adventure from the same place; a new adventure starts only after the old one's finale. By default a three-day rule applies: if an adventure has already had three adventure days and is still open, the player on return first finishes the open task and the current room. (The draft said «began three or more days ago»; the resolved finding below defines the adventure day.) A short ending then closes the adventure. The remaining floors «перевязываются за ночь» (are retied overnight), the final scene comes from the library (without waiting for the LLM, the large language model), everything earned stays, and unopened secrets go to the queue of missed rewards. A new adventure starts straight after. The parent can change the limit or switch the rule off.

### Resolved: The three-day rule counts adventure days, the game days on which she played the open adventure

An adventure day is a game day, ending at 04:00, on which the player spent any active time in the open adventure. The rule fires when she returns on a new game day and the open adventure already has three adventure days.

The draft's «began three or more days ago» fits two readings:

- Calendar days. The server needs only the start date, and a story left over a holiday or an illness closes instead of resuming from a week-old plan. But every missed day brings the ending closer, and after an absence she meets the short ending the moment she returns. That breaks the draft's rule that a missed day takes nothing away and brings no reproach (RES-2000).
- Adventure days. The count moves only when she plays, so it bounds what the rule exists to bound: one adventure dragging over more than three sittings. When she plays every day, the two readings give the same result. The Director recomputes its forecast before each floor from current estimates (RES-1000), and the adventure opens with «В прошлый раз…» (Last time…), so a gap leaves neither the plan nor her memory of the story as stale as the calendar reading assumes.

I chose adventure days. The default limit stays at three: the draft's question whether an adventure should close on the second day waits for the two weeks of play in stage 0.3 (RES-3000). The parent's setting holds the limit in adventure days. Proposed by research on 2026-09-26; the owner approves it with this record.

## Conclusions

1. The player must be able to save and leave at any moment, including mid-task and mid-review, and a closed app, a flat battery or a device change must give the same result.
2. Resume must restore the same floor, room, slot, task identifier and representation, attempt step, scene line and undelivered rewards.
3. The resume snapshot must be stored on the server, updated after each adventure event, and derivable from the event log alone, with a test that the stored copy matches the derivation.
4. Every item the snapshot holds, including prepared scenes and branches and free-text drafts, must be recoverable from the event log, or the snapshot can't derive from it.
5. An unanswered task must resume as the same first attempt, with its accuracy counted and its time excluded as `interrupted: true`.
6. A resumed review, explanation or second attempt must not charge a guiding thread twice.
7. A resumed scene must continue from the same line without a new request to the storyteller.
8. An unchosen chest must reopen with the same three options.
9. After a break longer than 5 minutes, an unscored warm-up must precede the next new task, while an open task stays first.
10. Only one device must be active at a time, through a lease with a 15-second heartbeat, and the displaced device must turn view-only and say that the adventure continued elsewhere.
11. A task whose attempt spans two device types must not contribute its time to any measure.
12. A new adventure must start only after the previous one's finale.
13. An adventure open for three or more adventure days must close with a short ending from the library after the open task and room, keeping all earnings and queuing unopened secrets, and the parent must be able to change the limit or switch the rule off.
14. The three-day rule must count adventure days, the game days ending at 04:00 on which the player spent active time in the open adventure, and a day she doesn't play must not count.

## Sources

- The owner's draft «Хроники Башни — спецификация», «Выход в любой момент и продолжение с того же места» inside «Текущий объём (MVP)», read 2026-09-26; not kept in the repository - leaving, the resume snapshot and its fields, the resume rules, device leases and the three-day rule.
