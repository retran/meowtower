# Requirements

None yet: the project is at the research stage.

<!-- meow-flow index -->

982 requirements in all: 969 approved, 10 draft, 3 superseded.

| Identifier | What it requires | Status |
| --- | --- | --- |
| [REQ-0100](REQ-0100-adventure-lasts-sixty-minutes.md) | The adventure of the day MUST be planned to take about 60 minutes of the player's active time. | approved |
| [REQ-0102](REQ-0102-adventure-runs-in-fixed-order.md) | The adventure of the day MUST run in this order: «В прошлый раз…» (Last time…) with the daily quests, then 3 maths floors, or 4 when the forecast leaves time, then a finale that ends on a cliffhanger. | approved |
| [REQ-0104](REQ-0104-floor-runs-in-fixed-order.md) | Each maths floor MUST run in this order: an entry scene, an unscored warm-up, 2 mental arithmetic tasks, 1 or 2 rooms of trials, sometimes a Guardian, then the floor chest. | approved |
| [REQ-0106](REQ-0106-task-window-separate-panel.md) | Every task MUST open in the task window, a flat panel separate from System windows. | approved |
| [REQ-0108](REQ-0108-task-window-holds-only-controls.md) | The task window MUST hold only the task, the answer field or options, the keypad, «Не знаю» (I don't know), the guiding thread button and «Готово» (Done), with no sprite, effect or story text. | approved |
| [REQ-0110](REQ-0110-task-window-shows-no-verdict.md) | The task window MUST NOT show the words «верно» (correct), «неверно» (incorrect) or «ошибка» (mistake), or a tick or a cross. | approved |
| [REQ-0112](REQ-0112-review-named-knot-scheme.md) | The task window MUST title the review after an attempt «Схема узла» (The knot's scheme). | approved |
| [REQ-0114](REQ-0114-warm-up-after-entry-scene.md) | When a floor's entry scene ends, the next task MUST be an unscored warm-up. | approved |
| [REQ-0116](REQ-0116-warm-up-after-pause.md) | When a pause has lasted longer than 5 minutes, the next new task MUST be an unscored warm-up, while a task left open stays first. | approved |
| [REQ-0118](REQ-0118-easy-task-after-three-loosened.md) | When three first attempts in a row end in the loosened outcome, `alt`, the next task MUST be one easy unscored task. | approved |
| [REQ-0120](REQ-0120-easy-tasks-also-appear-at-random.md) | At each boundary between tasks, an easy unscored task MUST appear with probability 1/12, whatever the player's answers, and at most once in any 5 tasks. | approved |
| [REQ-0122](REQ-0122-easy-task-takes-room-slot.md) | An easy unscored task inside a room MUST take one of the room's slots, leaving the room's length unchanged. | approved |
| [REQ-0124](REQ-0124-room-length-fixed-at-opening.md) | A room's length MUST be set to between 3 and 5 tasks when the room opens and stay unchanged until the room ends. | approved |
| [REQ-0126](REQ-0126-heroine-takes-no-damage.md) | The heroine MUST NOT take damage in a battle, whatever the player answers. | approved |
| [REQ-0128](REQ-0128-tangle-never-attacks-or-mocks.md) | A Tangle MUST NOT attack or mock the heroine. | approved |
| [REQ-0130](REQ-0130-transitions-hide-director-moves.md) | The story transitions between nodes or floors MUST follow a sequence that doesn't depend on which nodes the Director chooses. | approved |
| [REQ-0132](REQ-0132-session-zero-lasts-twenty-minutes.md) | Session 0 MUST last 20 to 25 minutes. | approved |
| [REQ-0134](REQ-0134-session-zero-updates-no-estimate.md) | Session 0 MUST NOT update any skill estimate. | approved |
| [REQ-0136](REQ-0136-session-zero-runs-eight-steps.md) | Session 0 MUST run these eight steps in order: the transparency talk; creating the heroine; choosing the starting familiar; the first chest; training on trivial numbers; motor calibration of 10 plain-input tasks; the vocabulary probe; and the campaign's first scene with the end of the row. | approved |
| [REQ-0138](REQ-0138-session-zero-heroine-choices.md) | Session 0 MUST let the player choose the heroine's name, cloak colour and focus. | approved |
| [REQ-0140](REQ-0140-session-zero-offers-no-look.md) | Session 0 MUST NOT offer a choice of the heroine's look. | approved |
| [REQ-0142](REQ-0142-parent-room-talk-memo.md) | The Parent Room MUST hold a memo on how to talk with the child about the game: don't discuss node estimates with her, share her joy at triumphs while praising effort and courage and never «ум» (cleverness), don't question her about «хитрые обходы» (clever detours) or turn them into reproach, and don't use the game as a reward or a punishment. | approved |
| [REQ-0144](REQ-0144-system-announces-knot.md) | Before each task, the System MUST announce the knot in a System window. | approved |
| [REQ-0146](REQ-0146-system-speaks-outcome-line.md) | After each first attempt, the System MUST speak the outcome line. | approved |
| [REQ-0148](REQ-0148-end-of-row-shows-growth.md) | The end of the row MUST show in words the growth the player made in the adventure: experience, level, familiars, quests, and the star-steel shards and star yarn she collected. | approved |
| [REQ-0200](REQ-0200-save-and-leave-any-moment.md) | The player MUST be able to save and leave at any moment, including in the middle of a task or a review. | approved |
| [REQ-0202](REQ-0202-interruption-acts-as-save.md) | When the app closes, the battery runs flat or the player changes device, the game MUST keep the same state that «Сохранить и уйти» (Save and leave) would keep. | approved |
| [REQ-0204](REQ-0204-resume-restores-exact-point.md) | When the player resumes, the game MUST restore the same floor, room, slot, task and its representation, attempt step, scene line and undelivered rewards. | approved |
| [REQ-0206](REQ-0206-resume-point-matches-log.md) | After every adventure event, the stored resume point MUST equal the resume point derived from the event log alone. | approved |
| [REQ-0208](REQ-0208-resume-items-recoverable-from-log.md) | Every item the resume point holds, including prepared scenes and branches and free-text drafts, MUST be recoverable from the event log. | approved |
| [REQ-0210](REQ-0210-unanswered-task-same-attempt.md) | When the player resumes a task she left unanswered, the game MUST present it as the same first attempt and count its answer towards accuracy. | approved |
| [REQ-0212](REQ-0212-interrupted-time-excluded.md) | The answer time of a first attempt interrupted by leaving MUST be left out of every time measure. | approved |
| [REQ-0214](REQ-0214-resume-charges-no-thread-twice.md) | A review, explanation or second attempt that resumes after leaving MUST NOT charge a guiding thread the player has already paid. | approved |
| [REQ-0216](REQ-0216-resumed-scene-needs-no-new-request.md) | When a scene resumes, the game MUST continue it without a new request to the storyteller. | approved |
| [REQ-0218](REQ-0218-chest-reopens-same-options.md) | When the player resumes before choosing from a chest, the chest MUST reopen with the same three options. | approved |
| [REQ-0220](REQ-0220-one-device-plays-at-a-time.md) | The game MUST let only one device play the adventure at a time. | approved |
| [REQ-0222](REQ-0222-displaced-device-turns-view-only.md) | When another device takes over the adventure, the displaced device MUST turn view-only and say that the adventure continued elsewhere. | approved |
| [REQ-0224](REQ-0224-cross-device-attempt-no-time.md) | A task whose attempt spans two device types MUST NOT contribute its time to any measure. | approved |
| [REQ-0226](REQ-0226-new-adventure-after-finale.md) | A new adventure MUST NOT start while an earlier adventure is still open, until that adventure reaches its finale or the short ending of the three-day rule. | approved |
| [REQ-0228](REQ-0228-three-day-rule-closes-adventure.md) | When the player returns to an adventure that has been open for the parent's limit of adventure days, three by default, the game MUST finish the open task and room and then close the adventure with a short ending. | approved |
| [REQ-0230](REQ-0230-short-ending-keeps-earnings.md) | The short ending of the three-day rule MUST keep everything the player earned in the adventure. | approved |
| [REQ-0232](REQ-0232-short-ending-queues-secrets.md) | When the three-day rule closes an adventure, the game MUST queue the secrets the player didn't open so that they return later. | approved |
| [REQ-0234](REQ-0234-parent-sets-three-day-rule.md) | The Parent Room MUST let the parent change the three-day limit or switch the rule off. | approved |
| [REQ-0236](REQ-0236-three-day-rule-counts-adventure-days.md) | The three-day rule MUST count only adventure days: game days, each ending at 04:00, on which the player spent active time in the open adventure. | approved |
| [REQ-0300](REQ-0300-no-clock-on-player-screens.md) | The player's screens MUST NOT show a timer, a countdown, a clock or a time bar. | approved |
| [REQ-0302](REQ-0302-timed-event-lines-without-time.md) | The line that announces a timed event MUST NOT contain minutes, numbers or any hint of a countdown. | approved |
| [REQ-0304](REQ-0304-eye-exercise-every-twenty-minutes.md) | When 20 minutes of active time have passed since the last eye exercise, the game MUST show an eye exercise at the next boundary, after an answer with its review or after a scene, and never in the middle of a task. | approved |
| [REQ-0306](REQ-0306-eye-exercise-lasts-half-minute.md) | An eye exercise MUST last 30 to 40 seconds. | approved |
| [REQ-0308](REQ-0308-eye-exercises-take-turns.md) | The game MUST show the four eye exercises in turn: looking far out of the window, blinking, tracing a figure eight with the eyes and covering the eyes with the palms. | approved |
| [REQ-0310](REQ-0310-eye-counter-excludes-breaks.md) | The 20-minute count towards the next eye exercise MUST exclude the time of eye exercises and of rest stops. | approved |
| [REQ-0312](REQ-0312-long-pause-resets-eye-counter.md) | When play pauses for longer than 5 minutes, the game MUST restart the 20-minute count towards the next eye exercise from zero. | approved |
| [REQ-0314](REQ-0314-eye-exercise-has-no-skip.md) | The eye exercise MUST NOT offer a way to skip it unless the parent has switched skipping on. | approved |
| [REQ-0316](REQ-0316-parent-switches-eye-skip.md) | The Parent Room MUST offer a setting that switches on a «Пропустить» (Skip) button for the eye exercise, off until the parent changes it. | approved |
| [REQ-0318](REQ-0318-breaks-count-towards-soft-stop.md) | The day's active time that brings the soft stop MUST include the time of eye exercises and rest stops. | approved |
| [REQ-0320](REQ-0320-soft-stop-at-sixty-minutes.md) | When the day's active time reaches 60 minutes and the adventure isn't finished, the game MUST bring the soft stop at the next boundary, where the story offers to save the adventure and continue tomorrow. | approved |
| [REQ-0322](REQ-0322-no-daily-maximum.md) | The game MUST NOT end play or withhold tasks because the day's total active time has reached any maximum. | approved |
| [REQ-0324](REQ-0324-no-daily-maximum-setting.md) | The Parent Room MUST NOT offer a setting for a daily maximum of play time. | approved |
| [REQ-0326](REQ-0326-soft-stop-offers-extension.md) | When the soft stop comes because the day's active time ran out on an unfinished adventure, it MUST offer «Ещё один ряд» (One more row) beside the offer to save, each time it comes. | approved |
| [REQ-0328](REQ-0328-extension-continues-with-tasks.md) | When the player chooses «Ещё один ряд» (One more row), the adventure MUST continue with tasks. | approved |
| [REQ-0330](REQ-0330-extension-adds-twenty-minutes.md) | Each «Ещё один ряд» (One more row) the player chooses MUST add 20 minutes of active time before the soft stop comes again. | approved |
| [REQ-0332](REQ-0332-soft-stop-returns-after-extension.md) | When an extension's 20 minutes run out and the adventure isn't finished, the game MUST bring the soft stop again at the next boundary. | approved |
| [REQ-0334](REQ-0334-game-day-ends-at-four.md) | The game day MUST end at 04:00 local time. | approved |
| [REQ-0336](REQ-0336-after-finale-only-taskless-screens.md) | After the day's finale and until the game day ends, the game MUST open only screens without tasks, such as the room, the Diary, the forge, the shop and the familiars. | approved |
| [REQ-0338](REQ-0338-taskless-screens-count-for-eyes.md) | Time on the screens without tasks after the finale MUST count towards the 20-minute count for the next eye exercise. | approved |
| [REQ-0340](REQ-0340-accepted-save-stops-through-story.md) | When the player accepts the soft stop's offer to save, the game MUST end the day's play through a story scene at the next boundary. | approved |
| [REQ-0342](REQ-0342-rest-stop-button-always-present.md) | The «Привал» (Rest stop) button MUST always be on screen during play. | approved |
| [REQ-0344](REQ-0344-rest-stop-button-cooldown.md) | For 10 minutes after a rest stop ends, the «Привал» (Rest stop) button MUST stay inactive. | approved |
| [REQ-0346](REQ-0346-dont-know-run-offers-rest.md) | When the player answers «Не знаю» (I don't know) three times in a row, the game MUST offer her a rest stop. | approved |
| [REQ-0348](REQ-0348-dont-know-run-logs-avoidance.md) | When the player answers «Не знаю» (I don't know) three times in a row, the game MUST record an avoidance signal in the event log. | approved |
| [REQ-0350](REQ-0350-anxiety-signal-gets-gentle-sequence.md) | When the game detects an anxiety signal, the next task MUST be an easy one, followed by a campfire scene or a funny scene. | approved |
| [REQ-0352](REQ-0352-second-anxiety-lowers-frontier.md) | When a second anxiety signal comes in one session, the game MUST lower the share of frontier tasks for the rest of the game day. | approved |
| [REQ-0354](REQ-0354-anxiety-signal-logged.md) | When the game detects an anxiety signal, it MUST record the signal in the event log. | approved |
| [REQ-0356](REQ-0356-measure-symbol-stays-still.md) | The sand in the «Мера» (Measure) hourglass symbol MUST never move or change level. | approved |
| [REQ-0358](REQ-0358-no-hourglass-near-timing.md) | The game MUST NOT show an hourglass in the task window, on the screen of a timed event or as a sign that it is waiting. | approved |
| [REQ-0360](REQ-0360-parent-finish-for-today-control.md) | The Parent Room MUST offer a «Закончить на сегодня» (Finish for today) control. | approved |
| [REQ-0362](REQ-0362-finish-today-brings-soft-stop.md) | When the parent uses «Закончить на сегодня» (Finish for today), the game MUST bring the soft stop at the next boundary, after an answer with its review or after a scene. | approved |
| [REQ-0364](REQ-0364-finish-today-offers-no-extension.md) | When the parent has used «Закончить на сегодня» (Finish for today), the soft stop that comes at the next boundary MUST NOT offer «Ещё один ряд» (One more row). | approved |
| [REQ-0400](REQ-0400-one-mode-trains-and-measures.md) | The first version MUST have no measurement mode separate from daily play, so every task of the adventure both trains and measures. | approved |
| [REQ-0402](REQ-0402-correct-answer-shown-accepted.md) | After a correct first attempt, the task window MUST show the answer as accepted, with a dry outcome line. | approved |
| [REQ-0404](REQ-0404-correct-offers-short-solution.md) | After a correct first attempt, the task window MUST offer the short solution under «Как легла нить» (How the thread lay). | approved |
| [REQ-0406](REQ-0406-correct-offers-detailed-explanation.md) | After a correct first attempt, the task window MUST offer the detailed explanation. | approved |
| [REQ-0408](REQ-0408-short-solution-after-miss.md) | When a first attempt ends with a wrong answer, a partial answer or «Не знаю» (I don't know), the task window MUST show the short solution at once, with no extra tap. | approved |
| [REQ-0410](REQ-0410-short-solution-steps-and-answer.md) | The short solution MUST show the task's solution steps and the correct answer. | approved |
| [REQ-0412](REQ-0412-short-solution-numbers-from-engine.md) | Every number in the short solution MUST be the number the engine computed for the task. | approved |
| [REQ-0414](REQ-0414-one-parallel-second-attempt.md) | When a first attempt ends with a wrong answer or «Не знаю» (I don't know), the game MUST give one second attempt on a parallel task with the same template, subtype and difficulty features. | approved |
| [REQ-0416](REQ-0416-no-third-attempt.md) | The game MUST NOT give a third attempt on a task. | approved |
| [REQ-0418](REQ-0418-no-second-attempt-after-partial.md) | When a first attempt ends with a partial answer («почти», almost), the game MUST NOT give a second attempt. | approved |
| [REQ-0420](REQ-0420-second-attempt-recorded-assisted.md) | The event log MUST record every second attempt as assisted. | approved |
| [REQ-0422](REQ-0422-correct-second-attempt-line.md) | When the player answers a second attempt correctly, the task window MUST show the line «Нить закреплена» (The thread is secured). | approved |
| [REQ-0424](REQ-0424-second-attempt-base-experience-only.md) | When the player answers a second attempt correctly, the game MUST give base experience and no bonus. | approved |
| [REQ-0426](REQ-0426-review-stays-in-task-window.md) | The short solution and the second attempt MUST stay inside the task window. | approved |
| [REQ-0428](REQ-0428-later-tasks-marked-post-feedback.md) | After the player sees the short solution of a task, the event log MUST mark every later task of the same node on the same game day as coming after feedback. | approved |
| [REQ-0430](REQ-0430-correct-answer-after-every-attempt.md) | After every attempt in daily play, the task window MUST show the correct answer. | approved |
| [REQ-0432](REQ-0432-no-answer-before-first-attempt.md) | Before and during a first attempt, the game MUST NOT show the correct answer or solution steps, apart from the hint rungs the player buys. | approved |
| [REQ-0500](REQ-0500-three-threads-each-morning.md) | At the start of each game day, the game MUST add 3 guiding threads to the player's stock. | approved |
| [REQ-0502](REQ-0502-daily-quest-gives-thread.md) | When the player completes a daily quest, the game MUST give her 1 guiding thread. | approved |
| [REQ-0504](REQ-0504-clean-row-gives-thread.md) | When the player makes a clean row, the game MUST give her 1 guiding thread. | approved |
| [REQ-0506](REQ-0506-big-clean-row-gives-no-thread.md) | A big clean row MUST NOT give a guiding thread. | approved |
| [REQ-0508](REQ-0508-find-gives-one-or-two.md) | A story find or a chest find of guiding threads MUST give 1 or 2 threads. | approved |
| [REQ-0510](REQ-0510-familiar-growth-gives-two.md) | When the player's familiar hatches or evolves, the game MUST give her 2 guiding threads. | approved |
| [REQ-0512](REQ-0512-typical-day-yields-eight-to-ten.md) | A typical day of play MUST yield 8 to 10 guiding threads. | approved |
| [REQ-0514](REQ-0514-pocket-thread-once-per-room.md) | When the player presses the thread button with no threads and the backpack pocket hasn't yet given a thread in this room, the game MUST give her 1 guiding thread from the pocket. | approved |
| [REQ-0516](REQ-0516-canon-states-pocket-limit.md) | The canon MUST state that the backpack pocket gives at most one guiding thread in each room, and only when the player reaches for a thread with none left. | approved |
| [REQ-0518](REQ-0518-thread-stock-capped-at-thirty.md) | The player's stock of guiding threads MUST never exceed 30. | approved |
| [REQ-0520](REQ-0520-surplus-thread-two-buttons.md) | Each guiding thread the player earns above the cap of 30 MUST turn into 2 buttons. | approved |
| [REQ-0522](REQ-0522-surplus-conversion-silent.md) | Turning surplus guiding threads into buttons MUST NOT interrupt play. | approved |
| [REQ-0524](REQ-0524-shop-sells-no-threads.md) | The shop MUST NOT sell guiding threads. | approved |
| [REQ-0526](REQ-0526-hint-rung-costs-one-thread.md) | Each hint rung the player buys before answering MUST cost exactly 1 guiding thread, on any task of the adventure. | approved |
| [REQ-0528](REQ-0528-explanation-costs-one-thread.md) | Each detailed explanation the player buys after answering MUST cost exactly 1 guiding thread, on any task of the adventure. | approved |
| [REQ-0530](REQ-0530-hint-makes-attempt-assisted.md) | When the player buys a hint rung before answering, the event log MUST record that attempt as assisted. | approved |
| [REQ-0532](REQ-0532-hint-ladder-has-three-rungs.md) | The hint ladder of every task MUST have three rungs. | approved |
| [REQ-0534](REQ-0534-hints-without-language-model.md) | The game MUST build every hint rung without a call to a language model. | approved |
| [REQ-0536](REQ-0536-hint-numbers-from-engine.md) | Every number in a hint rung MUST be the number the engine computed for the task. | approved |
| [REQ-0538](REQ-0538-first-rung-has-no-numbers.md) | The first hint rung MUST contain no numbers. | approved |
| [REQ-0540](REQ-0540-second-rung-gives-first-step.md) | The second hint rung MUST give the first step of the solution with the task's numbers. | approved |
| [REQ-0542](REQ-0542-third-rung-stops-before-last.md) | The third hint rung MUST give every step of the solution except the last calculation. | approved |
| [REQ-0544](REQ-0544-short-solution-costs-nothing.md) | The short solution MUST NOT cost a guiding thread. | approved |
| [REQ-0546](REQ-0546-stock-shown-as-yarn-ball.md) | The game screen MUST show the player's stock of guiding threads as a ball of yarn with the current number. | approved |
| [REQ-0548](REQ-0548-thread-button-always-in-window.md) | The task window MUST always show the thread button with the player's current number of guiding threads. | approved |
| [REQ-0550](REQ-0550-empty-thread-button-inactive.md) | When the player has no guiding threads and the backpack pocket has already given its thread in this room, the thread button MUST stay visible and inactive. | approved |
| [REQ-0552](REQ-0552-no-words-about-running-out.md) | The game MUST NOT show words about the player running out of guiding threads. | approved |
| [REQ-0600](REQ-0600-explanation-follows-engine-solution.md) | The detailed explanation MUST state only steps that the engine's step-by-step solution for the task contains. | approved |
| [REQ-0602](REQ-0602-explanation-in-familiar-voice.md) | The player MUST see every detailed explanation as her familiar speaking in its own voice. | approved |
| [REQ-0604](REQ-0604-explanation-addresses-player-answer.md) | The detailed explanation MUST address the answer the player gave. | approved |
| [REQ-0606](REQ-0606-explanation-addresses-matched-trap.md) | When the player's answer matched a trap, the detailed explanation MUST address that trap. | approved |
| [REQ-0608](REQ-0608-explanation-numbers-from-engine.md) | Every number in a detailed explanation MUST be the number the engine computed, and none written by the language model. | approved |
| [REQ-0610](REQ-0610-explanation-at-most-eight-sentences.md) | The game MUST NOT show a detailed explanation longer than 8 sentences. | approved |
| [REQ-0612](REQ-0612-explanation-cites-real-steps.md) | The game MUST NOT show a detailed explanation that cites a step the engine's solution lacks. | approved |
| [REQ-0614](REQ-0614-explanation-names-every-result.md) | The game MUST NOT show a detailed explanation that fails to name the result of every step, in the order of the engine's solution. | approved |
| [REQ-0616](REQ-0616-explanation-passes-blind-solve.md) | The game MUST NOT show a detailed explanation from which a blind solver, given only the task and the explanation, reaches an answer other than the engine's. | approved |
| [REQ-0618](REQ-0618-explanation-passes-safety-check.md) | The game MUST NOT show a detailed explanation that fails the safety check. | approved |
| [REQ-0620](REQ-0620-explanation-avoids-forbidden-words.md) | The game MUST NOT show a detailed explanation that holds any form of a word on the forbidden list of the game's voice guideline (RES-3300). | approved |
| [REQ-0622](REQ-0622-template-explanation-as-fallback.md) | When a generated explanation fails any check or doesn't arrive within 10 seconds, the game MUST show the engine's template explanation, framed by the same familiar. | approved |
| [REQ-0624](REQ-0624-fallback-uses-spent-thread.md) | When the game shows the template explanation in place of a generated one, the guiding thread already spent MUST pay for it, with no refund and no second charge. | approved |
| [REQ-0626](REQ-0626-at-most-three-variants.md) | The game MUST show at most 3 different detailed explanation texts for tasks that share the same template, template version, trap, graph shape and familiar. | approved |
| [REQ-0628](REQ-0628-variants-shown-in-turn.md) | When tasks share the same template, template version, trap, graph shape and familiar, the game MUST show their detailed explanation variants in turn. | approved |
| [REQ-0630](REQ-0630-variants-prepared-before-play.md) | The game MUST accept detailed explanation variants prepared before play, outside any session. | approved |
| [REQ-0632](REQ-0632-parent-hides-explanation-variant.md) | The Parent Room MUST let the parent hide any stored detailed explanation variant from the player. | approved |
| [REQ-0634](REQ-0634-explanations-stay-out-of-story.md) | Detailed explanation texts MUST NOT enter the story or the Master's memory. | approved |
| [REQ-0636](REQ-0636-explainer-never-appears.md) | The Explainer MUST NOT appear in the world or in any text the player sees. | approved |
| [REQ-0638](REQ-0638-safety-check-sees-placeholders-only.md) | The safety check of a detailed explanation MUST receive the text with its number placeholders unfilled and without the player's answer. | approved |
| [REQ-0700](REQ-0700-free-input-by-default.md) | Every task MUST take its answer as free input, except tasks on recognising shapes, nets, symmetry, «объясни, почему» (explain why), natural science and problem models, which take a choice of options. | approved |
| [REQ-0701](REQ-0701-frame-risk-term-count.md) | The game MUST NOT use a story frame that holds more than 2 risk terms. | approved |
| [REQ-0702](REQ-0702-choice-wrong-options-from-traps.md) | The wrong options of a choice task MUST be the answers its template's traps compute, as far as the traps give distinct answers. | approved |
| [REQ-0703](REQ-0703-compound-step-input-share.md) | Between 40% and 60% of the compound word problems (tiers T2 to T4) the player gets in any 30 days MUST take step-by-step input, and the rest the final answer only. | approved |
| [REQ-0704](REQ-0704-choice-filler-options-close-in-form.md) | When a choice task's traps give fewer wrong answers than the task needs, each remaining option MUST be close in form to the correct answer: the same answer kind, and the same number of digits or the same denominator. | approved |
| [REQ-0705](REQ-0705-step-input-any-valid-path.md) | When a word problem takes step-by-step input, the engine MUST match the entered steps against every valid solution path of the problem, so both 3 · 5 + 3 · 7 and 3 · (5 + 7) count. | approved |
| [REQ-0706](REQ-0706-scored-choice-four-options.md) | Every scored choice task MUST offer at least 4 options. | approved |
| [REQ-0707](REQ-0707-step-labels.md) | The engine MUST label each entered step as a correct step, the right operation with a calculation error, the wrong operation matching a structure trap, or «не классифицирован» (unclassified). | approved |
| [REQ-0708](REQ-0708-scored-comparison-as-choice-or-order.md) | A scored task that compares numbers MUST ask the player to choose the largest of four numbers or to order 3 to 4 numbers. | approved |
| [REQ-0709](REQ-0709-unrecognised-step-not-error.md) | The engine MUST NOT count a step it doesn't recognise as an error. | approved |
| [REQ-0710](REQ-0710-sign-comparison-unscored-only.md) | The sign form of comparison (<, =, >) MUST NOT appear outside warm-ups, easy unscored tasks and the Session 0 tutorial. | approved |
| [REQ-0711](REQ-0711-unrecognised-step-in-report.md) | The parent's report MUST list each step the engine didn't recognise as unclassified, for the parent to review by hand. | approved |
| [REQ-0712](REQ-0712-keypad-keys.md) | The on-screen maths keypad MUST provide the digits, a decimal comma, «дробь» (fraction), «целая часть» (whole part), «остаток» (remainder), «:» for time, minus and erase. | approved |
| [REQ-0713](REQ-0713-model-choice-logged-separately.md) | When a word problem starts with a choice of model, the event log MUST record the chosen model separately from the answer. | approved |
| [REQ-0714](REQ-0714-fraction-two-storey-field.md) | A fraction answer field MUST show the numerator above the denominator as a two-storey field. | approved |
| [REQ-0716](REQ-0716-mixed-number-three-fields.md) | A mixed-number answer field MUST give separate fields for the whole part, the numerator and the denominator. | approved |
| [REQ-0718](REQ-0718-answer-units-labelled.md) | An answer field for a quantity with a unit MUST show the unit's label beside the field. | approved |
| [REQ-0720](REQ-0720-done-button-in-task-window.md) | «Готово» (Done) MUST be a button in the task window's action row and never a key of the keypad. | approved |
| [REQ-0722](REQ-0722-dont-know-in-every-task.md) | Every task MUST offer «Не знаю» (I don't know), whatever its answer form, including choice, model-choice and grid tasks that show no keypad. | approved |
| [REQ-0724](REQ-0724-dont-know-placement.md) | «Не знаю» (I don't know) MUST sit in the task window's action row, away from the digit keys, and never on the keypad. | approved |
| [REQ-0726](REQ-0726-wrong-answer-trap-class.md) | When a wrong answer equals the answer one of the task's traps computes, the engine MUST classify the answer as that trap's type. | approved |
| [REQ-0728](REQ-0728-wrong-answer-computational-class.md) | When a wrong answer matches no trap and differs from the correct answer by one digit, by a swap of two digits or as a neighbouring times-table fact, the engine MUST classify the answer as «вычислительная» (computational). | approved |
| [REQ-0730](REQ-0730-wrong-answer-unclassified.md) | When a wrong answer matches no trap and isn't computational, the engine MUST classify the answer as «не классифицирована» (unclassified). | approved |
| [REQ-0732](REQ-0732-integer-spaces-leading-zeros.md) | The engine MUST accept an integer answer of the correct value when it holds spaces between digit groups or extra leading zeros, such as «12 500» or «007». | approved |
| [REQ-0734](REQ-0734-integer-other-characters-unparsed.md) | When an integer entry holds any character other than digits, spaces and a leading minus, the engine MUST return the entry to the player as unparsed input to correct. | approved |
| [REQ-0736](REQ-0736-unparsed-not-an-answer.md) | Input the engine can't parse, such as «3,,5», MUST NOT count as an answer. | approved |
| [REQ-0738](REQ-0738-unparsed-soft-highlight.md) | When the engine can't parse an entry, the answer field MUST mark the entry softly, with no words about an error. | approved |
| [REQ-0740](REQ-0740-unparsed-timer-runs.md) | When the engine can't parse an entry, the game MUST keep timing the task without a reset or a pause. | approved |
| [REQ-0742](REQ-0742-decimal-acceptance.md) | The engine MUST accept a decimal answer of the correct value written with «,» or «.», with or without trailing zeros, and a whole-number answer written without «,0». | approved |
| [REQ-0744](REQ-0744-fraction-equivalent-acceptance.md) | When a fraction task accepts equivalent fractions, the engine MUST accept any fraction equal to the correct answer, including an improper fraction. | approved |
| [REQ-0746](REQ-0746-fraction-equivalent-rejects-decimal.md) | When a fraction task accepts equivalent fractions, the engine MUST reject an answer written as a decimal, even when its value is equal. | approved |
| [REQ-0748](REQ-0748-fraction-simplest-full-credit.md) | When a fraction task asks for the simplest form, the engine MUST give full credit only to the fully reduced fraction. | approved |
| [REQ-0750](REQ-0750-fraction-simplest-half-credit.md) | When a fraction task asks for the simplest form, the engine MUST give half credit (0.5) to a correct fraction that isn't fully reduced. | approved |
| [REQ-0752](REQ-0752-mixed-equivalent-acceptance.md) | When a mixed-number task accepts equivalent forms, the engine MUST accept a mixed number or an improper fraction equal to the correct answer. | approved |
| [REQ-0754](REQ-0754-mixed-simplest-full-credit.md) | When a mixed-number task asks for the simplest form, the engine MUST give full credit only to a mixed number with a fully reduced fractional part. | approved |
| [REQ-0756](REQ-0756-mixed-simplest-half-credit.md) | When a mixed-number task asks for the simplest form, the engine MUST give half credit (0.5) to an equal improper fraction or to a mixed number whose fractional part isn't fully reduced. | approved |
| [REQ-0758](REQ-0758-remainder-below-divisor.md) | The engine MUST reject a quotient-and-remainder answer whose remainder is equal to or greater than the divisor, even when the quotient times the divisor plus the remainder gives the dividend. | approved |
| [REQ-0760](REQ-0760-analogue-time-acceptance.md) | For a time read from an analogue clock, the engine MUST accept both the morning and the afternoon reading of the hands, with or without a leading zero, such as 3:15, 03:15 and 15:15. | approved |
| [REQ-0762](REQ-0762-digital-time-acceptance.md) | For a digital time, the engine MUST accept the 24-hour time with or without a leading zero in the hour, such as «9:05» and «09:05». | approved |
| [REQ-0764](REQ-0764-point-entered-on-grid.md) | A point answer MUST be entered by choosing a node of the coordinate grid. | approved |
| [REQ-0766](REQ-0766-point-swap-is-trap.md) | The engine MUST classify a point answer with its coordinates swapped, (y; x) in place of (x; y), as a trap. | approved |
| [REQ-0768](REQ-0768-choice-single-selection.md) | A choice task or a sign comparison MUST take exactly one option or one sign as the answer. | approved |
| [REQ-0770](REQ-0770-grid-exact-set.md) | The engine MUST accept a grid answer only when the marked cells are exactly the correct set. | approved |
| [REQ-0772](REQ-0772-order-exact-permutation.md) | The engine MUST accept an order answer only when it is exactly the correct permutation. | approved |
| [REQ-0774](REQ-0774-steps-full-credit.md) | The engine MUST give full credit to a step-by-step answer whose final answer is correct and whose steps match one valid solution path of the problem. | approved |
| [REQ-0776](REQ-0776-steps-half-credit.md) | The engine MUST give half credit (0.5) to a step-by-step answer whose final answer is correct and whose steps it doesn't recognise. | approved |
| [REQ-0778](REQ-0778-equation-value-acceptance.md) | The engine MUST accept an equation answer given as the value of the unknown, either a number or a fraction equal to the correct value. | approved |
| [REQ-0780](REQ-0780-word-problem-structures.md) | Every word problem MUST take its structure from the catalogue of structures: a chain, a fork followed by a comparison, «части и целое» (parts and whole), «на N больше / в N раз» (N more / N times as many), «цена · количество → сдача» (price times quantity to change), motion or work. | approved |
| [REQ-0782](REQ-0782-word-problem-frame-after-numbers.md) | The engine MUST fix a word problem's steps, numbers and answer before it chooses the problem's story frame. | approved |
| [REQ-0784](REQ-0784-word-problem-fluent-numbers.md) | Every calculation in a word problem MUST use only nodes the player currently has in the state «бегло» (fluent). | approved |
| [REQ-0786](REQ-0786-tier-four-one-irrelevant-number.md) | A word problem of tier T4 MUST contain exactly one number the solution doesn't use. | approved |
| [REQ-0788](REQ-0788-noun-agrees-with-number.md) | A noun after a number in a word problem MUST take the Russian form that number requires, such as «1 зелье, 3 зелья, 5 зелий» (1 potion, 3 potions, 5 potions). | approved |
| [REQ-0790](REQ-0790-word-problem-sentence-count.md) | A word problem of k steps MUST have at most k+1 sentences. | approved |
| [REQ-0792](REQ-0792-word-problem-sentence-length.md) | Every sentence of a word problem MUST have at most 14 words. | approved |
| [REQ-0794](REQ-0794-word-problem-question-last.md) | The question of a word problem MUST be a sentence of its own at the end of the problem. | approved |
| [REQ-0796](REQ-0796-frame-mean-sentence-length.md) | The game MUST NOT use a story frame whose mean sentence length is above 10 words. | approved |
| [REQ-0798](REQ-0798-frame-rare-word-share.md) | The game MUST NOT use a story frame in which more than 10% of the words lie outside the frequency dictionary for the player's age (kept in `personal/player.md`). | approved |
| [REQ-0800](REQ-0800-skill-graph-node-set.md) | The skill graph MUST hold the 79 maths nodes in nine domains that the node tables of RES-0800 list, 69 at level 1F or 1S and 10 at stretch, with the codes, levels and prerequisites those tables give. | approved |
| [REQ-0802](REQ-0802-science-topics-outside-graph.md) | The skill graph MUST NOT make any of the five science topics E1 to E5 a prerequisite or a descendant of a maths node. | approved |
| [REQ-0804](REQ-0804-skill-graph-versioned.md) | Every change to the skill graph MUST produce a new graph version. | approved |
| [REQ-0806](REQ-0806-graph-change-without-code.md) | The parent or a developer MUST be able to change a node, a prerequisite, a level or a weight in the skill graph without changing code. | approved |
| [REQ-0808](REQ-0808-node-record-fields.md) | Each node in the skill graph MUST record its identifier, domain, level, typical school group, prerequisites, weighted subtypes each with its own level, and a flag for a topic only the Russian programme holds, plus, for a stretch node, the gate nodes that admit it. | approved |
| [REQ-0810](REQ-0810-subtype-prerequisite-descent.md) | When a subtype that has a prerequisite of its own fails, the descent MUST go to that prerequisite only and never to the node's other prerequisites. | approved |
| [REQ-0812](REQ-0812-slo-goal-coverage.md) | Every goal of the SLO levels 1F and 1S in «Concretisering referentieniveaus rekenen 1F/1S» MUST map to at least one node or subtype of the skill graph. | approved |
| [REQ-0814](REQ-0814-slo-node-levels.md) | Each node's level in the skill graph MUST match the SLO text as the correction table in RES-0800 gives it, with N3, N6, N7, A11, A13, A14, F3, F4, F5, F6, F7, D4, D6, P5, P6, M4 and S5 at 1F/1S. | approved |
| [REQ-0816](REQ-0816-area-volume-subtype-levels.md) | The skill graph MUST place area and volume by formula in 1S subtypes, and keep at 1F only the perimeter and area of rectangular figures with simple numbers, found by squares or from the sides without a formula, and volume found by counting cubes. | approved |
| [REQ-0818](REQ-0818-m4-perimeter-levels.md) | Node M4 (perimeter) MUST hold the perimeter of a rectangle as 1F subtypes, and the perimeter of a figure that isn't a rectangle, a side from the perimeter and "one area, different perimeters" as 1S subtypes. | approved |
| [REQ-0820](REQ-0820-stretch-gate-admission.md) | The Director MUST NOT choose a stretch node until each of its prerequisites and each node in its gate is «Бегло» (fluent) or «Устойчиво» (stable) by a tested result, which is a probe or a full block and never an inferred state. | approved |
| [REQ-0822](REQ-0822-stretch-block-within-seven-days.md) | When a stretch node's probe leaves its state open, the Director MUST complete the node's full block within 7 days of the probe. | approved |
| [REQ-0824](REQ-0824-stretch-never-a-gap.md) | The report MUST NOT list an unmastered stretch node among the gaps. | approved |
| [REQ-0826](REQ-0826-stretch-ceiling-list.md) | The report MUST list the mastered stretch nodes as the ceiling above 1S. | approved |
| [REQ-0828](REQ-0828-coverage-by-level.md) | The report MUST show coverage of 1F, of 1S and of stretch as three separate figures. | approved |
| [REQ-0830](REQ-0830-independent-mental-arithmetic.md) | Each of the 2 mental arithmetic tasks that open a floor MUST come from its own template and seed and never use the answer of the task before it. | approved |
| [REQ-0832](REQ-0832-stable-node-mental-arithmetic.md) | A node in the state «Устойчиво» (stable) MUST enter mental arithmetic no more than once in any 7 consecutive days. | approved |
| [REQ-0834](REQ-0834-word-problem-matrix.md) | The report MUST show word problem results as a matrix of problem type by number of steps, using the classical problem types RES-0800 lists. | approved |
| [REQ-0836](REQ-0836-model-choice-word-problems.md) | The game MUST include word problems that ask the player to choose the right short note or bar model out of four before she solves them. | approved |
| [REQ-0838](REQ-0838-modelling-apart-from-calculation.md) | The report MUST show a modelling error in a word problem apart from a calculation error. | approved |
| [REQ-0840](REQ-0840-risky-term-marking.md) | The task window MUST mark every maths term in a task's text that has a glossary entry. | approved |
| [REQ-0842](REQ-0842-term-tap-explanation.md) | When the player taps a marked term, the game MUST show the term's Russian explanation, its picture and, once the parent has approved it, its Dutch equivalent. | approved |
| [REQ-0844](REQ-0844-glossary-term-coverage.md) | The glossary MUST hold an entry for every Russian maths term in the task text of every MVP template. | approved |
| [REQ-0846](REQ-0846-dutch-word-parent-approval.md) | The game MUST NOT show a glossary entry's Dutch word before the parent approves that entry in the Parent Room. | approved |
| [REQ-0848](REQ-0848-answer-by-result.md) | The game MUST mark an answer by its result, whatever method the player used to reach it. | approved |
| [REQ-0850](REQ-0850-split-level-nodes-subtypes.md) | Each of the nodes N3, N6, N7, A11, A13, A14, F3, F4, F5, F6, F7, D4, D6, P5, P6, M4 and S5 MUST have at least one subtype at 1F and at least one at 1S in the skill graph. | approved |
| [REQ-0852](REQ-0852-graph-single-source.md) | The skill graph MUST be the only place that holds each subtype's level and weight. | approved |
| [REQ-0854](REQ-0854-graph-full-scope.md) | The skill graph MUST keep every node up to the end of group 8, level 1S, whatever the player's current school group (kept in `personal/player.md`). | approved |
| [REQ-0900](REQ-0900-recompute-after-adventure.md) | After every adventure, every node estimate and state MUST reflect all events up to the adventure's end, computed with the current versions of the model, the thresholds and the rules. | approved |
| [REQ-0902](REQ-0902-recompute-on-rule-change.md) | When the version of the state or inference rules changes, the game MUST recompute every estimate and state over the whole history. | approved |
| [REQ-0904](REQ-0904-keep-earlier-rule-snapshots.md) | When the version of the state or inference rules changes, the game MUST keep the snapshots made under the earlier version for comparison. | approved |
| [REQ-0906](REQ-0906-daily-estimate-snapshot.md) | The game MUST save one snapshot of the node estimates for each game day on which the player plays. | approved |
| [REQ-0908](REQ-0908-node-subtype-estimate.md) | The knowledge model MUST keep a separate estimate for each pair of node and subtype. | approved |
| [REQ-0910](REQ-0910-node-aggregate-by-weight.md) | A node's estimate MUST aggregate its subtypes' estimates by the subtype weights in the skill graph. | approved |
| [REQ-0912](REQ-0912-estimate-forgetting.md) | The "on her own" estimate of a node MUST fall as time passes since the node's last observation, while no new evidence arrives. | approved |
| [REQ-0914](REQ-0914-unassisted-first-attempts-only.md) | The "on her own" estimate MUST take evidence from unassisted first attempts only. | approved |
| [REQ-0916](REQ-0916-parent-excluded-tasks.md) | When the parent marks a task as ambiguous, the next recompute MUST drop that task from every estimate, state, probe and block. | approved |
| [REQ-0918](REQ-0918-partial-answer-half-right.md) | The knowledge model MUST count a partially correct answer as half right and half wrong. | approved |
| [REQ-0920](REQ-0920-feedback-learning-opportunity.md) | When a walkthrough, explanation or hint on a node is shown, the "on her own" estimate MUST treat it as a chance to learn before the next observation of that node. | approved |
| [REQ-0922](REQ-0922-assisted-estimate-separate.md) | Assisted attempts MUST feed only a separate "with help" estimate and never the "on her own" estimate. | approved |
| [REQ-0924](REQ-0924-assisted-estimate-half-life.md) | The "with help" estimate MUST give an assisted attempt half its weight once the attempt is 30 days old. | approved |
| [REQ-0926](REQ-0926-fluency-estimate-separate.md) | The knowledge model MUST keep a separate fluency estimate of the share of first attempts that are right, unassisted and no slower than the fluency threshold. | approved |
| [REQ-0928](REQ-0928-fluency-half-life.md) | The fluency estimate MUST give an attempt half its weight once the attempt is 30 days old. | approved |
| [REQ-0930](REQ-0930-control-facts-update-estimate.md) | A control fact MUST update the estimate of its node. | approved |
| [REQ-0932](REQ-0932-control-facts-outside-blocks.md) | A control fact MUST NOT enter a full block or a probe. | approved |
| [REQ-0934](REQ-0934-states-from-explicit-rules.md) | Every node state in the report MUST follow from the explicit state rules applied to the node's listed attempts, never from the model's probabilities. | approved |
| [REQ-0936](REQ-0936-block-not-mastered.md) | When a full block scores 2,5 or less, counting a partially correct answer as 0,5, the node's state MUST become "not mastered". | approved |
| [REQ-0938](REQ-0938-block-understands.md) | When a full block scores 3 or 3,5, counting a partially correct answer as 0,5, the node's state MUST become "understands". | approved |
| [REQ-0940](REQ-0940-understands-needs-speed.md) | When a full block scores 4 or more and the median time of its right answers is above the fluency threshold, the node's state MUST become "understands" with the label «Понимает, нужна скорость» (understands, needs speed). | approved |
| [REQ-0942](REQ-0942-fluent-state-rule.md) | When a full block scores 4 or more with the median time of its right answers at or below the fluency threshold, or both tasks of a probe are right and each is no slower than the threshold, the node's state MUST become "fluent". | approved |
| [REQ-0944](REQ-0944-stable-state-rule.md) | A node's state MUST become "stable" only after "fluent" in two checks at least 14 days apart, at least one of them a full block and no later check worse than "fluent", where a check is a full block, or once Ascents exist an Ascent anchor form, and never a probe. | approved |
| [REQ-0946](REQ-0946-not-mastered-label.md) | The report MUST label the state "not mastered" «Пока не освоено» (not mastered yet). | approved |
| [REQ-0950](REQ-0950-full-block-definition.md) | A full block MUST consist of the node's last 5 graded tasks within 7 days, covering every subtype of weight 0,2 or more. | approved |
| [REQ-0952](REQ-0952-block-lesson-mark.md) | A full block MUST NOT span a lesson mark for its node. | approved |
| [REQ-0954](REQ-0954-probe-shape.md) | A probe MUST hold either 2 tasks of different subtypes or, for a node tested only by choice tasks, 3 choice tasks with at least 4 options each. | approved |
| [REQ-0956](REQ-0956-probe-escalation.md) | When a probe ends short of "fluent (probe)", the Director MUST escalate the node to a full block. | approved |
| [REQ-0958](REQ-0958-zero-probe-completion.md) | When a probe scores 0 out of 2, the Director MUST complete the node's full block in the same session, or first in the next session when time runs out. | approved |
| [REQ-0960](REQ-0960-choice-probe-no-inference.md) | A probe made only of choice tasks MUST NOT support inference to the node's ancestors. | approved |
| [REQ-0962](REQ-0962-inference-fluent-ancestors.md) | When a node is tested "fluent", each ancestor not tested for 30 days MUST get "fluent (inferred)", and for a subtype with a prerequisite of its own only that prerequisite gets it. | approved |
| [REQ-0964](REQ-0964-inference-cut-off-descendants.md) | When a full block gives a node "not mastered", each of its descendants MUST get the state "not tested, cut off by node X", naming that node. | approved |
| [REQ-0966](REQ-0966-cut-off-not-chosen.md) | The Director MUST NOT choose a node cut off by node X until X is tested again, except for an island check probe. | approved |
| [REQ-0968](REQ-0968-cut-off-not-a-gap.md) | The report MUST NOT count a node cut off by a prerequisite as a gap. | approved |
| [REQ-0970](REQ-0970-understands-probes-descendants.md) | When a node gets the state "understands", the Director MUST give each of its direct descendants one probe. | approved |
| [REQ-0972](REQ-0972-daily-island-checks.md) | Each adventure day MUST include 1 or 2 probes of randomly chosen nodes in the state "fluent (inferred)" or cut off by a prerequisite. | approved |
| [REQ-0974](REQ-0974-island-failure-queue.md) | When an island check probe fails, the Director MUST queue the node and its prerequisites for testing. | approved |
| [REQ-0976](REQ-0976-inferred-never-summed.md) | Inferred results MUST NOT add up with tested results in estimates, coverage percentages or trends. | approved |
| [REQ-0978](REQ-0978-stale-node-priority.md) | A node whose last unassisted first attempt is more than 30 days old MUST get priority in task selection. | approved |
| [REQ-0980](REQ-0980-model-version-acceptance.md) | A new model version MUST replace the current one only when it predicts the next unassisted first attempt on held-out days better, by log-loss and by calibration. | approved |
| [REQ-0982](REQ-0982-starting-estimate-by-group.md) | The starting estimate of each node MUST follow its level and the player's current school group (kept in `personal/player.md`), highest at 1F, lower at 1S and lowest at stretch. | approved |
| [REQ-0984](REQ-0984-other-group-new-version.md) | The starting estimates for a school group other than the player's current one MUST take effect only through a new model version. | approved |
| [REQ-0986](REQ-0986-right-answer-never-lowers.md) | An unassisted right answer MUST NOT lower the "on her own" estimate of its node, for any parameter set and any template. | approved |
| [REQ-0988](REQ-0988-uncertainty-shrinks.md) | Each node estimate MUST carry an uncertainty that falls as fresh observations of the node accumulate and stays high while the node has none. | approved |
| [REQ-0990](REQ-0990-review-ladder-success.md) | After the 1st, 2nd, 3rd, 4th and 5th unassisted success in a row on a node, the node's next review MUST fall 1, 3, 7, 14 and 30 days later, and 30 days after each further success. | approved |
| [REQ-0992](REQ-0992-review-after-failure.md) | After an unassisted failure on a node, the node's next review MUST fall 1 day later. | approved |
| [REQ-0994](REQ-0994-model-full-scope.md) | The knowledge model MUST estimate every node up to the end of group 8, level 1S, and every stretch node, whatever the player's current school group (kept in `personal/player.md`). | approved |
| [REQ-1000](REQ-1000-room-slot-sources.md) | The Director MUST fill every room slot from one of three sources: the frontier, spaced review or the parent's lesson topics. | approved |
| [REQ-1002](REQ-1002-frontier-value-ranking.md) | For a frontier slot, the Director MUST choose the candidate node of highest value, where value rises with the node's uncertainty, the time since it was last seen, its place on the frontier, a due lesson recheck, an open escalation, a due review and a fresh lesson mark, and falls with its shows in the last 3 days. | approved |
| [REQ-1004](REQ-1004-stretch-daily-cap.md) | The Director MUST give stretch nodes no more than 2 tasks in an adventure day. | approved |
| [REQ-1006](REQ-1006-flow-below-corridor.md) | Before each room slot, when the success share over the last 10 graded tasks, counting `clean` as 1 and `partial` as 0,5, is below 0,70, the Director MUST give the slot a review task. | approved |
| [REQ-1008](REQ-1008-flow-above-corridor.md) | Before each room slot, when the success share over the last 10 graded tasks, counting `clean` as 1 and `partial` as 0,5, is above 0,80, the Director MUST give the slot a frontier task. | approved |
| [REQ-1010](REQ-1010-flow-inside-corridor.md) | Before each room slot, when the success share over the last 10 graded tasks, counting `clean` as 1 and `partial` as 0,5, is from 0,70 to 0,80, the Director MUST give between 30 % and 40 % of such slots to review. | approved |
| [REQ-1012](REQ-1012-review-eligibility.md) | A review task MUST come from a node in the state «Бегло» (fluent) or «Устойчиво» (stable) whose expected chance of success is at least 0,85. | approved |
| [REQ-1014](REQ-1014-review-longest-unchecked.md) | Among the nodes eligible for review, the Director MUST choose the one unchecked for longest first. | approved |
| [REQ-1016](REQ-1016-review-looks-ordinary.md) | A review task MUST look to the player like any other graded task. | approved |
| [REQ-1018](REQ-1018-review-counts-as-graded.md) | A review task MUST count as a graded task in the estimates and states. | approved |
| [REQ-1020](REQ-1020-no-engineered-failure.md) | The Director MUST NOT choose a task in order to make the player fail. | approved |
| [REQ-1022](REQ-1022-no-hard-tasks-for-balance.md) | The Director MUST NOT give a task it knows is too hard for the player in order to balance the success share. | approved |
| [REQ-1024](REQ-1024-three-day-domain-window.md) | In any 3 consecutive adventure days, each of the 8 maths domains with a floor of its own MUST get its floor at least once. | approved |
| [REQ-1026](REQ-1026-missing-domains-first.md) | When a maths domain has had no floor for 2 adventure days in a row, the route MUST take that domain before any other. | approved |
| [REQ-1028](REQ-1028-guardian-first-task-steps.md) | The first Guardian task of an adventure day MUST have k + 1 steps, where k is the largest number for which word problem node T_k is «Бегло» (fluent) or «Устойчиво» (stable), inferred states included. | approved |
| [REQ-1030](REQ-1030-guardian-next-task-steps.md) | After a `clean` outcome on a Guardian task, the next Guardian task that day MUST have k + 2 steps, at most 4, where k is the largest number for which T_k is fluent or stable, and k steps after any other outcome. | approved |
| [REQ-1032](REQ-1032-guardian-t1-start.md) | When no T node is fluent or stable, or during cold start, which lasts from the first adventure until fewer than half of the 1F and 1S nodes remain unchecked or the 10th adventure ends, whichever comes first, the first Guardian task of the day MUST have 1 step. | approved |
| [REQ-1034](REQ-1034-cold-start-top-down.md) | During cold start, which lasts from the first adventure until fewer than half of the 1F and 1S nodes remain unchecked or the 10th adventure ends, whichever comes first, the Director MUST probe each domain's prerequisite chain from a typical node of group 7-8 downwards, going lower only after a probe escalates. | approved |
| [REQ-1036](REQ-1036-cold-start-bottom-review.md) | During cold start, which lasts from the first adventure until fewer than half of the 1F and 1S nodes remain unchecked or the 10th adventure ends, whichever comes first, the Director MUST use the nodes N1 to N3, A1 to A4 and F1 as review tasks. | approved |
| [REQ-1038](REQ-1038-opening-closing-control-facts.md) | Each adventure MUST hold 2 control facts at its start and 2 at its end. | approved |
| [REQ-1040](REQ-1040-graded-attempt-minimum.md) | An adventure the player completes MUST hold at least 28 graded first attempts, or at least 25 when the Director has trimmed rooms for a slow pace. | approved |
| [REQ-1042](REQ-1042-story-time-cap.md) | Story MUST take no more than 10 minutes of an adventure's active time. | approved |
| [REQ-1044](REQ-1044-extension-rooms-by-value.md) | Each extension MUST add only rooms chosen by value. | approved |
| [REQ-1046](REQ-1046-extension-no-new-floor.md) | An extension MUST NOT open a new floor. | approved |
| [REQ-1048](REQ-1048-forecast-before-each-floor.md) | Before each floor, the Director MUST recompute its forecast of the adventure's volume from the player's actual pace. | approved |
| [REQ-1050](REQ-1050-trim-order.md) | When the forecast shows the adventure won't fit before the soft stop, the Director MUST trim first the number of rooms on a floor, down to one, then the length of new rooms, down to 3 tasks, and only then move a fourth floor to the next day. | approved |
| [REQ-1052](REQ-1052-trim-protected-parts.md) | The Director MUST NOT trim mental arithmetic, control facts, or the last room on a floor with an open probe or escalation. | approved |
| [REQ-1054](REQ-1054-window-counts-completed-floors.md) | When the Director checks the three-day domain window, it MUST count only the floors the player completed. | approved |
| [REQ-1056](REQ-1056-selection-accuracy-simulation.md) | A 30-day simulation of daily play under the planned frontier budget MUST classify at least 90 % of the simulated nodes into their true state. | approved |
| [REQ-1100](REQ-1100-generated-task-no-repeat-window.md) | The game MUST NOT show a generated task again, meaning the same template with the same parameters, within 30 days or within the next shows of its subtype numbering 20 % of the subtype's parameter space, whichever ends first, except for times-table facts, addition to 20 and control facts. | approved |
| [REQ-1102](REQ-1102-report-shows-subtype-exposure.md) | The report MUST show, for each subtype, how many times the player has been shown a task of that subtype, beside her accuracy before the review and after the review. | approved |
| [REQ-1104](REQ-1104-fatigue-signal-from-time-only.md) | The game MUST raise the fatigue signal when, and only when, the median answer time at a control-fact point exceeds 1.5 times the median at the adventure's opening point, whatever the accuracy at either point. | approved |
| [REQ-1106](REQ-1106-fatigue-signal-offers-rest-stop.md) | When the fatigue signal fires, the story MUST offer the player a rest stop. | approved |
| [REQ-1108](REQ-1108-post-fatigue-tasks-half-weight.md) | A task answered after the fatigue signal MUST count with half the weight of an ordinary task in the node estimates, for the rest of that session. | approved |
| [REQ-1110](REQ-1110-post-fatigue-no-not-mastered.md) | A task answered after the fatigue signal MUST NOT be the cause of a node's state becoming «не освоен» (not mastered). | approved |
| [REQ-1112](REQ-1112-fast-answer-marked-rapid-guess.md) | When an answer arrives faster than its template's minimum time, the game MUST mark the answer as a rapid guess. | approved |
| [REQ-1114](REQ-1114-minimum-time-ordinary-templates.md) | The minimum time of a template outside the small spaces MUST be max(1500 ms, min(0.15 x the template's fluency threshold, 10,000 ms)) plus the motor correction. | approved |
| [REQ-1116](REQ-1116-minimum-time-small-spaces.md) | The minimum time of a times-table fact, an addition fact to 20 or a control fact MUST be the motor correction plus 600 ms. | approved |
| [REQ-1118](REQ-1118-motor-correction-per-key-press.md) | The motor correction in a minimum time MUST equal the player's median time per key press in the pure-input tasks of Session 0 on the device type in use, times the number of key presses in the correct answer, «Готово» (Done) included. | approved |
| [REQ-1120](REQ-1120-motor-correction-zero-before-session0.md) | Until Session 0 exists on a device type, the motor correction in a minimum time on that device type MUST be 0. | approved |
| [REQ-1122](REQ-1122-rapid-guess-excluded-from-estimates.md) | A rapid guess MUST stay out of every node estimate and every block. | approved |
| [REQ-1124](REQ-1124-rapid-guesses-raise-free-input.md) | When rapid guesses exceed 15 % of a session's answers, the Director MUST raise the share of free-input tasks and review tasks for the rest of that session and for the next session. | approved |
| [REQ-1126](REQ-1126-rapid-guesses-flag-parent.md) | When rapid guesses exceed 15 % of a session's answers, the report MUST show the parent a flag on that session. | approved |
| [REQ-1128](REQ-1128-help-share-flags-parent.md) | When «Не знаю» (I don't know) and hints before the answer together exceed 30 % of an adventure's first attempts and exceed their mean share over up to 7 adventures before it by at least 10 percentage points, the report MUST show the parent a flag on that adventure. | approved |
| [REQ-1130](REQ-1130-help-share-raises-review.md) | When «Не знаю» (I don't know) and hints before the answer together exceed 30 % of an adventure's first attempts and exceed their mean share over up to 7 adventures before it by at least 10 percentage points, the Director MUST raise the share of review tasks in the next adventure. | approved |
| [REQ-1132](REQ-1132-guessing-profiles-inflate-little.md) | In the simulation, the "guesses" profile and the "rushes for bonuses" profile, which answers faster than the minimum time in 30 % of tasks, MUST each raise node estimates by no more than 5 percentage points over the same profile without guessing. | approved |
| [REQ-1200](REQ-1200-tasks-generated-from-templates.md) | Every maths task in daily play MUST be generated during play from a template and a seed. | approved |
| [REQ-1202](REQ-1202-same-seed-same-task.md) | The same template, template version and seed MUST rebuild exactly the same task. | approved |
| [REQ-1204](REQ-1204-exact-arithmetic.md) | Every solution, trap answer and answer check MUST be computed exactly, with no rounding error, decimals included. | approved |
| [REQ-1206](REQ-1206-subtype-constraints-met.md) | Every generated task MUST meet each constraint its subtype sets, such as the number of carries, zeros, divisibility and irreducibility. | approved |
| [REQ-1208](REQ-1208-generation-fallback-parameters.md) | When sampling finds no valid parameters within its attempt limit, the generator MUST take parameters from the template's fallback list. | approved |
| [REQ-1210](REQ-1210-traps-distinguishable.md) | The generator MUST NOT produce a task in which a trap's answer equals the correct answer or another trap's answer. | approved |
| [REQ-1212](REQ-1212-solution-hints-explanation-agree.md) | A task's short solution, its three hint rungs and its per-trap template explanations MUST use the same steps and the same numbers. | approved |
| [REQ-1214](REQ-1214-template-explanation-per-trap.md) | Every template MUST provide a template explanation for each of its traps. | approved |
| [REQ-1216](REQ-1216-no-numbers-from-language-model.md) | A language model MUST NOT compute any number, answer or picture in a task. | approved |
| [REQ-1218](REQ-1218-opaque-task-identifier.md) | The identifier the client receives for a task MUST reveal nothing about the task's node, subtype, template, seed or parameters. | approved |
| [REQ-1220](REQ-1220-traps-and-paths-stay-on-server.md) | The client MUST NOT receive a task's traps or its valid solution paths. | approved |
| [REQ-1222](REQ-1222-short-solution-after-attempt.md) | The server MUST NOT send a task's short solution to the client before the player's first attempt. | approved |
| [REQ-1224](REQ-1224-parallel-task-new-numbers.md) | The parallel task of a second attempt MUST use numbers different from the original task's. | approved |
| [REQ-1226](REQ-1226-russian-number-format.md) | Task text rendered in Russian MUST write numbers with a decimal comma and a space between digit groups, such as 3,5 and 12 500. | approved |
| [REQ-1228](REQ-1228-russian-operation-signs.md) | Task text rendered in Russian MUST write «·» for multiplication and «:» for division. | approved |
| [REQ-1230](REQ-1230-pictures-from-parameters.md) | Every mathematical picture in a task MUST be drawn by code from the task's own parameters. | approved |
| [REQ-1232](REQ-1232-catalogue-subtypes-answer-kinds.md) | Every node in the template catalogue MUST have templates for each subtype and answer kind the catalogue gives it. | approved |
| [REQ-1234](REQ-1234-catalogue-traps.md) | Every template MUST compute the wrong answer of each trap the template catalogue lists for its node and subtype. | approved |
| [REQ-1236](REQ-1236-science-forty-per-topic.md) | The science bank MUST hold at least 40 questions for each topic. | approved |
| [REQ-1238](REQ-1238-science-misconception-options.md) | Each wrong option of a natural science question, asked as a choice from four, MUST name a known misconception. | approved |
| [REQ-1240](REQ-1240-risky-terms-declared.md) | Every MVP template MUST list as a risky term each Russian maths term its task text uses. | approved |
| [REQ-1242](REQ-1242-risky-term-glossary-build-check.md) | The build MUST fail when a template lists a risky term that has no glossary entry. | approved |
| [REQ-1244](REQ-1244-subtype-in-graph-build-check.md) | The build MUST fail when a template names a subtype the skill graph lacks. | approved |
| [REQ-1300](REQ-1300-limits-from-play-only.md) | Every limit MUST be computed from the tasks the player answers in play, with no task given only to measure a limit. | approved |
| [REQ-1302](REQ-1302-limits-smoothed-over-seven-sessions.md) | Every limit MUST be computed for each session and reported as the value smoothed over the last 7 sessions, or over as many as exist. | approved |
| [REQ-1304](REQ-1304-timings-exclude-background-pause.md) | Every task timing MUST exclude the time the game spent in the background or paused. | approved |
| [REQ-1306](REQ-1306-full-limits-screen-views.md) | After the MVP, the full report's limits screen MUST show these views of the twelve limits: | approved |
| [REQ-1308](REQ-1308-avoidance-anxiety-not-grades.md) | The report MUST present avoidance and anxiety as observations and reasons to talk with the player, never as grades. | approved |
| [REQ-1310](REQ-1310-endurance-uses-control-facts.md) | The endurance limit MUST measure the median time at each control-fact point, from times-table control facts only: 2 at the start of the adventure, 2 at the end and 2 in each extension. | approved |
| [REQ-1312](REQ-1312-endurance-time-growth-flag.md) | The endurance limit MUST raise its time flag when the median time at the last control-fact point exceeds 1.5 times the median at the first point. | approved |
| [REQ-1314](REQ-1314-endurance-accuracy-flag-separate.md) | The endurance limit MUST raise an accuracy flag, kept apart from its time measure, when the last control-fact point has a mistake and the first point has none. | approved |
| [REQ-1316](REQ-1316-endurance-reports-each-extension.md) | The endurance limit MUST compare the control facts of each extension the player takes, every extension starting after the soft stop at 60 minutes of active time, with those at the start and the end of the adventure. | approved |
| [REQ-1318](REQ-1318-steps-held-definition.md) | The holding-steps value MUST be the largest k at which the player's last 2 counted attempts on k-step word problems, both within the last 30 days, are right, and empty until some k has 2 counted attempts. | approved |
| [REQ-1320](REQ-1320-daily-word-problems-count-steps.md) | Every unassisted first attempt on a k-step word problem in daily play, from a Guardian or from a room, MUST count towards step k of the holding-steps limit unless it is a rapid guess or the parent excluded it. | approved |
| [REQ-1322](REQ-1322-basics-speed-measure.md) | The speed-of-the-basics limit MUST measure the median time of correct answers on nodes A1, A3, A4 and A6a. | approved |
| [REQ-1324](REQ-1324-scratchpad-use-recorded.md) | For every attempt on a task that offers a scratchpad, the game MUST record whether the player opened one and which kind. | approved |
| [REQ-1326](REQ-1326-mental-written-measure.md) | The mental-or-written limit MUST measure, for each node, the player's accuracy with a scratchpad opened and without one. | approved |
| [REQ-1328](REQ-1328-error-type-classes.md) | The error-type limit MUST place every mistake in one of four classes, conceptual, procedural, computational or unclassified, and use unclassified where the task's traps and steps don't settle the class. | approved |
| [REQ-1330](REQ-1330-carelessness-measure.md) | The carelessness limit MUST count a mistake as careless when the node is in «бегло» (fluent) at the time and the answer differs from the correct one by one digit or by one transposition. | approved |
| [REQ-1332](REQ-1332-too-fast-mistakes-measure.md) | The impulsiveness limit MUST measure the share of wrong answers given faster than 30 % of the task's fluency threshold. | approved |
| [REQ-1334](REQ-1334-rapid-guess-share-measure.md) | The impulsiveness limit MUST measure the share of rapid guesses among each session's answers. | approved |
| [REQ-1336](REQ-1336-avoidance-measure.md) | The avoidance limit MUST count runs of 3 «Не знаю» (I don't know) in a row and the rest stops offered. | approved |
| [REQ-1338](REQ-1338-anxiety-measure-mvp-signals.md) | Until the game records erasures, long hesitation and the phrases «страшно» (scary) and «не хочу» (I don't want to), the anxiety limit MUST use only runs of 3 `alt` outcomes in a row and a share of rapid guesses in the last third of a session higher than in its first two thirds. | approved |
| [REQ-1340](REQ-1340-flow-measure.md) | The flow limit MUST measure the success share by session and by floor against the 70-80 % target, and the share of review slots. | approved |
| [REQ-1342](REQ-1342-language-risk-measure.md) | The language-risk limit MUST count the mistakes on tasks with a risk term whose explanation the player didn't open. | approved |
| [REQ-1344](REQ-1344-help-measure.md) | The help limit MUST measure the hints taken before the answer with their level, «Не знаю» (I don't know) on first attempts, the correctness of second attempts, and the detailed explanations opened with their reading time. | approved |
| [REQ-1346](REQ-1346-every-limit-in-mvp.md) | Every one of the twelve limits MUST be measured from the MVP on, the language-risk limit included, without waiting for the Dutch task language. | approved |
| [REQ-1348](REQ-1348-fluency-threshold-external.md) | The fluency threshold MUST NOT be fitted to the player's own times on target nodes, and the only adjustment from the external standard for her age is the device's input speed. | approved |
| [REQ-1350](REQ-1350-starting-threshold-catalogue-plus-motor.md) | The starting fluency threshold of a template MUST be the catalogue value plus the Session 0 motor correction, which is the difference between the player's time for pure input and the reference time, times the number of key presses in the template's answer. | approved |
| [REQ-1352](REQ-1352-threshold-fallback-adult-calibration.md) | When Session 0 is missing on a device type, the starting fluency threshold on that device type MUST be max(catalogue value, 2.5 x the median time of an adult who solves 3 tasks of the node in the Parent Room). | approved |
| [REQ-1354](REQ-1354-monthly-pure-input-check.md) | Once a month on each device type, the game MUST give the player the 10 pure-input tasks of Session 0 again and update the motor correction from them. | approved |
| [REQ-1356](REQ-1356-motor-correction-new-version.md) | When the monthly check updates the motor correction, the game MUST store the update as a new version and keep the version it replaces. | approved |
| [REQ-1358](REQ-1358-only-person-changes-catalogue.md) | The game MUST NOT change a catalogue fluency threshold by itself; only a person changes one, and each change creates a new threshold version. | approved |
| [REQ-1360](REQ-1360-threshold-change-decision-record.md) | Every change a person makes to a catalogue fluency threshold MUST come with a decision record in `project/adrs/` that gives the reason and that the owner approves. | approved |
| [REQ-1362](REQ-1362-thresholds-per-device-type.md) | The game MUST keep fluency thresholds separately for each device type, iPad and computer. | approved |
| [REQ-1364](REQ-1364-fast-probe-every-task.md) | A "fast" probe MUST require every task in it to finish within the task's fluency threshold, not only the median time. | approved |
| [REQ-1400](REQ-1400-parent-marks-lesson-topics.md) | The Parent Room MUST let the parent mark nodes or subtypes as «занимались на уроке» (we worked on this in the lesson), with a date and an optional note. | approved |
| [REQ-1402](REQ-1402-lesson-recheck-within-three-days.md) | When the parent marks a node with a lesson, the Director MUST collect a full block on that node between 1 and 3 days after the mark. | approved |
| [REQ-1404](REQ-1404-lesson-retention-recheck.md) | When the parent marks a node with a lesson, the Director MUST collect a second full block on that node between 12 and 16 days after the mark. | approved |
| [REQ-1406](REQ-1406-label-improved-after-lesson.md) | When a lesson mark exists on a node or on one of its prerequisites, and the node's state at a check after the mark is higher than at the last check before it, in the order «Пока не освоено» (not mastered yet), «Понимает» (understands), «Понимает, нужна скорость» (understands, needs speed), «Бегло» (fluent), «Устойчиво» (stable), the report MUST label the node «Улучшилось после урока» (improved after a lesson). | approved |
| [REQ-1408](REQ-1408-label-improved-without-lesson.md) | When a node's state at a check is higher than at the check before it, in the order «Пока не освоено» (not mastered yet), «Понимает» (understands), «Понимает, нужна скорость» (understands, needs speed), «Бегло» (fluent), «Устойчиво» (stable), and neither the node nor any of its prerequisites has a lesson mark in the 30 days before the check, the report MUST label the node «Улучшилось без урока» (improved without a lesson). | approved |
| [REQ-1410](REQ-1410-label-held.md) | When the lesson's second recheck gives a state no lower than the first recheck, in the order «Пока не освоено» (not mastered yet), «Понимает» (understands), «Понимает, нужна скорость» (understands, needs speed), «Бегло» (fluent), «Устойчиво» (stable), the report MUST label the node «Сохранилось» (held). | approved |
| [REQ-1412](REQ-1412-label-did-not-hold.md) | When the lesson's second recheck gives a state lower than the first recheck, in the order «Пока не освоено» (not mastered yet), «Понимает» (understands), «Понимает, нужна скорость» (understands, needs speed), «Бегло» (fluent), «Устойчиво» (stable), the report MUST label the node «Не сохранилось» (did not hold). | approved |
| [REQ-1414](REQ-1414-dynamics-from-unassisted-first-attempts.md) | Every dynamics view MUST use only unassisted first attempts from blocks, probes and review. | approved |
| [REQ-1416](REQ-1416-dynamics-exclude-inferred-states.md) | Dynamics views MUST NOT show inferred states or add them to checked ones. | approved |
| [REQ-1418](REQ-1418-dynamics-lower-comparability-label.md) | Until Ascents exist, every dynamics view MUST carry the label «без контрольных прогонов: сравнимость ниже» (no control runs: lower comparability). | approved |
| [REQ-1420](REQ-1420-times-compare-same-device.md) | The report MUST compare times only between tasks answered on the same device type. | approved |
| [REQ-1422](REQ-1422-accuracy-across-devices.md) | The report MAY compare accuracy between tasks answered on different device types. | approved |
| [REQ-1424](REQ-1424-changed-template-comparison-label.md) | When a node's template changed, the report MUST label that node's comparison «контент изменён» (content changed). | approved |
| [REQ-1426](REQ-1426-player-sees-no-diagnostics.md) | The screens the player sees MUST NOT show node states, estimates, percentages or topic names, only game progress and story outcomes. | approved |
| [REQ-1500](REQ-1500-trial-shown-as-spell.md) | The game MUST present every trial as a spell that untangles or loosens a knot. | approved |
| [REQ-1502](REQ-1502-rename-keeps-everything-else.md) | When the player renames a floor, a creature or a focus, the game MUST show the new name wherever that thing appears and keep everything else tied to it unchanged. | approved |
| [REQ-1504](REQ-1504-guardians-agree-to-pass.md) | Every Guardian ending MUST show the Guardian agreeing to let the heroine pass. | approved |
| [REQ-1506](REQ-1506-guardians-never-defeated.md) | The game MUST NOT show a Guardian as defeated. | approved |
| [REQ-1508](REQ-1508-diary-ciphers-not-maths.md) | The game MUST NOT score a cipher puzzle in the Keeper's Diary or log it as maths. | approved |
| [REQ-1510](REQ-1510-art-reuses-no-other-work.md) | Every art asset and art prompt MUST reuse no other work's characters, assets, logos or recognisable silhouettes. | approved |
| [REQ-1512](REQ-1512-no-ticking-music.md) | The game's music MUST contain no ticking sound. | approved |
| [REQ-1514](REQ-1514-creepiness-level-setting.md) | The Parent Room MUST offer the parent a creepiness level of 0, 1 or 2, set to 1 until the parent changes it. | approved |
| [REQ-1516](REQ-1516-creepiness-level-names.md) | The Parent Room MUST name the creepiness levels «Уютно» (Cosy), «Чуть жутковато» (A little eerie) and «Загадочно» (Mysterious), the names the canon and the Master's scene orders use. | approved |
| [REQ-1518](REQ-1518-order-carries-creepiness.md) | Every scene order to the Master MUST carry the creepiness level in force. | approved |
| [REQ-1520](REQ-1520-pool-lines-within-level.md) | The game MUST NOT show a pool line whose creepiness level is above the level in force. | approved |
| [REQ-1522](REQ-1522-always-forbidden-content.md) | The game MUST NOT show, at any creepiness level, jump scares or sudden loud sounds, blood or injury, death, body horror, faces that melt or distort, being stuck forever with no way out, threats to family or loved ones, realistic dangers such as fire, drowning, kidnapping or strangers, the heroine being chased, darkness with no light source, possession, or people being replaced. | approved |
| [REQ-1524](REQ-1524-calm-places-stay-calm.md) | Eye exercises, rest stops, the end of the row, the heroine's room and the task window MUST carry no dreamcore and no creepy content at any creepiness level. | approved |
| [REQ-1526](REQ-1526-underside-at-most-weekly.md) | A slip into the Underside MUST happen at most once in any 7 days. | approved |
| [REQ-1528](REQ-1528-underside-scene-count.md) | A slip into the Underside MUST last 2 to 3 scenes. | approved |
| [REQ-1530](REQ-1530-underside-always-returns.md) | Every slip into the Underside MUST end with the heroine back where she slipped from. | approved |
| [REQ-1532](REQ-1532-dreamcore-changes-scenery-only.md) | A floor's dreamcore variant MUST change only the background, the music, the lines and the scenes, and leave the trials, their order, the floor's budget and the task window as the plain variant has them. | approved |
| [REQ-1534](REQ-1534-no-dreamcore-ascent-session-zero.md) | A floor's dreamcore variant MUST NOT appear in an Ascent or in Session 0. | approved |
| [REQ-1536](REQ-1536-dreamcore-familiar-beside.md) | Every dreamcore scene MUST show a familiar beside the heroine. | approved |
| [REQ-1538](REQ-1538-dreamcore-exit-visible.md) | Every dreamcore scene MUST show a visible exit beside the heroine, such as a door, a light or a stair home. | approved |
| [REQ-1540](REQ-1540-fear-resolves-intrigue.md) | When the player writes that she is scared, or skips a creepy scene without finishing it twice in a row on one day, the game MUST resolve the scene's intrigue kindly at once. | approved |
| [REQ-1542](REQ-1542-fear-flags-scene.md) | When the player writes that she is scared, or skips a creepy scene without finishing it twice in a row on one day, the game MUST flag the scene for the parent. | approved |
| [REQ-1544](REQ-1544-fear-lowers-level.md) | When the player writes that she is scared, or skips a creepy scene without finishing it twice in a row on one day, the game MUST lower the creepiness level by one, down to 0 at the lowest, for the rest of that day. | approved |
| [REQ-1546](REQ-1546-no-jokes-in-tasks.md) | Task statements MUST carry no jokes. | approved |
| [REQ-1548](REQ-1548-no-numerals-in-story-text.md) | The Master's text and the pool lines MUST contain no digit and no numeral word from the game's shared numeral list, outside names from the canon's entity list and names the player gives. | approved |
| [REQ-1550](REQ-1550-pool-lines-parent-approved.md) | A pool line MUST NOT enter the game until the parent approves it. | approved |
| [REQ-1552](REQ-1552-pool-lines-no-repeat.md) | A pool line MUST NOT show twice in one session, or again before every other line of its category has shown. | approved |
| [REQ-1554](REQ-1554-no-fault-in-alt-lines.md) | The lines for a loosened knot and for the other path MUST NOT hint that the heroine is at fault. | approved |
| [REQ-1556](REQ-1556-parent-flags-master-scene.md) | The Parent Room MUST let the parent flag any Master scene as a failure. | approved |
| [REQ-1558](REQ-1558-flagged-scene-counter-example.md) | When the parent flags a Master scene as a failure, the Master's later scene orders MUST carry that scene as an example of what not to write. | approved |
| [REQ-1560](REQ-1560-tangle-names-avoid-school.md) | A Tangle's name, from the canon or invented by the Master, MUST NOT rest on a school term or joke about the maths. | approved |
| [REQ-1562](REQ-1562-reverse-one-wants-nothing.md) | The Reverse One MUST NOT want the heroine's place, name, home, family, room, familiars or friends. | approved |
| [REQ-1564](REQ-1564-reverse-one-reversed-colours.md) | The Reverse One MUST always appear in the heroine's colours reversed. | approved |
| [REQ-1566](REQ-1566-reverse-one-backwards-speech.md) | The Reverse One MUST always speak back to front. | approved |
| [REQ-1568](REQ-1568-reverse-one-never-poses.md) | The Reverse One MUST NOT pretend to be the heroine. | approved |
| [REQ-1570](REQ-1570-single-look-alike.md) | The Reverse One MUST be the only look-alike of the heroine in the story. | approved |
| [REQ-1572](REQ-1572-mvp-eerie-tangles.md) | The MVP's eerie-cute Tangles MUST be «Шепотун» (the Whisperer), «Шкатулочница» (the Casket Keeper) and «Портретница» (the Portrait Keeper). | approved |
| [REQ-1574](REQ-1574-eerie-tangles-level-one.md) | Each of the MVP's eerie-cute Tangles MUST carry creepiness level 1, so that none of them appears at level 0. | approved |
| [REQ-1600](REQ-1600-director-decides-events.md) | Every decision on what happens in the game, from the tasks and their outcomes to rest stops and rewards, MUST come from the Director. | approved |
| [REQ-1602](REQ-1602-director-writes-no-story.md) | The Director MUST NOT write story text. | approved |
| [REQ-1604](REQ-1604-master-sees-no-maths.md) | The requests to the Master and to the planner MUST NOT contain numbers, answers, verdicts, single-task outcomes, node identifiers, node states, estimates, response times or lesson tags. | approved |
| [REQ-1606](REQ-1606-reply-checkable-by-field.md) | Every Master reply MUST be structured data that a program can check field by field against its scene order's schema. | approved |
| [REQ-1608](REQ-1608-closed-effect-set.md) | The Director MUST apply only effects from the closed set of scene effects. | approved |
| [REQ-1610](REQ-1610-discard-malformed-reply.md) | When a Master reply names an unknown speaker, carries an extra field, holds an effect outside the closed set, or lacks a branch or an ending its order requires, the game MUST discard the whole reply. | approved |
| [REQ-1612](REQ-1612-master-writes-no-task.md) | The Master MUST NOT write a task statement. | approved |
| [REQ-1614](REQ-1614-instant-consequence.md) | When the player answers a task, the game MUST show the answer's consequence without waiting for a language model. | approved |
| [REQ-1616](REQ-1616-reply-passes-checks.md) | Every Master reply MUST pass the schema, length, speaker, numeral, safety, shame-word, intelligence-praise and creepiness-level checks before it shows. | approved |
| [REQ-1618](REQ-1618-retry-then-library.md) | When a Master reply fails a check, the game MUST retry the order once and, if the retry also fails, show a scene from the fallback library. | approved |
| [REQ-1620](REQ-1620-fallback-library-coverage.md) | The fallback library MUST hold fallback branches and Guardian endings for every floor. | approved |
| [REQ-1622](REQ-1622-free-text-reply-latency.md) | After the player sends free text, the 95th percentile of the wait for the Master's reply MUST be at most 6 seconds. | approved |
| [REQ-1624](REQ-1624-reply-timeout-fallback.md) | When the Master hasn't replied 12 seconds after an order, the scene MUST continue with a line from the fallback pool. | approved |
| [REQ-1626](REQ-1626-three-options-and-next.md) | Every scene MUST offer three options and a «Дальше» (Next) button. | approved |
| [REQ-1628](REQ-1628-one-strange-option.md) | One of every scene's three options MUST be strange and funny. | approved |
| [REQ-1630](REQ-1630-free-text-points.md) | The free-text field MUST open only on entering a floor, before a Guardian, at the campfire on a rest stop, at the session finale and on meeting a new creature. | approved |
| [REQ-1632](REQ-1632-free-text-parent-note.md) | The free-text field MUST show the note «Эту историю могут читать мама и папа» (Mum and Dad can read this story). | approved |
| [REQ-1634](REQ-1634-canon-hand-written.md) | Every canon text MUST be written by a person. | approved |
| [REQ-1636](REQ-1636-game-never-changes-canon.md) | The game MUST NOT change the canon. | approved |
| [REQ-1638](REQ-1638-no-future-secrets.md) | The Master's prompt MUST NOT contain a secret of a later checkpoint. | approved |
| [REQ-1640](REQ-1640-planner-after-session.md) | After each session, the planner MUST write a session summary and the next session's plan. | approved |
| [REQ-1642](REQ-1642-models-set-by-configuration.md) | Each model role MUST be set by configuration, so that switching a role's model needs no code change and no rebuild. | approved |
| [REQ-1644](REQ-1644-missing-model-stops-server.md) | When a configured model is missing from the model catalogue, the server MUST refuse to start. | approved |
| [REQ-1646](REQ-1646-check-every-new-model.md) | When a role's configured model changes, the model check MUST run on the new value before the game uses it. | approved |
| [REQ-1648](REQ-1648-blind-bakeoff.md) | The text models MUST be chosen by a blind bake-off on the game's own prompts, in which the parent scores anonymised answers. | approved |
| [REQ-1650](REQ-1650-bakeoff-safety-exclusion.md) | A model with any safety failure in the bake-off MUST be excluded from play. | approved |
| [REQ-1652](REQ-1652-bakeoff-owner-candidates.md) | The Master's bake-off MUST include every story candidate the owner named on 2026-09-27 and the Master's fallback model. | approved |
| [REQ-1654](REQ-1654-bakeoff-play-route.md) | Each bake-off candidate MUST run through the route and endpoint that play would use. | approved |
| [REQ-1656](REQ-1656-model-needs-approved-decision.md) | A model MUST NOT enter the play configuration until a decision record that the owner approved names it, whether it is the bake-off's choice or a substitute. | approved |
| [REQ-1658](REQ-1658-campaign-keeps-diagnostics.md) | Changing the campaign MUST leave every diagnostic record unchanged. | approved |
| [REQ-1660](REQ-1660-player-names-things.md) | The player MUST be able to name and rename her heroine, her familiars, her forged items, the floors she has opened, every Tangle she has met and her room. | approved |
| [REQ-1662](REQ-1662-names-pass-content-check.md) | Every name the player gives MUST pass the content check before the game uses it. | approved |
| [REQ-1664](REQ-1664-name-length-limit.md) | A name the player gives MUST be at most 24 characters long. | approved |
| [REQ-1666](REQ-1666-floor-tangle-placeholder-names.md) | A floor or a Tangle MUST carry its canon name only as a placeholder until the player first meets it, when the game offers three name suggestions, the canon name among them, and her choice replaces the placeholder. | approved |
| [REQ-1668](REQ-1668-other-canon-names-fixed.md) | Every canon name other than a familiar's, a floor's, a Tangle's or a Guardian's MUST stay fixed. | approved |
| [REQ-1670](REQ-1670-guardian-names-fixed.md) | A Guardian's name MUST stay fixed, and the player can't replace it. | approved |
| [REQ-1672](REQ-1672-no-numeral-names-in-tasks.md) | The engine MUST NOT put a name that contains a digit or a listed numeral word into a task statement. | approved |
| [REQ-1674](REQ-1674-director-sets-generated-limits.md) | When the game generates items and creatures after the MVP, the Director MUST set each one's type, rarity and limits. | approved |
| [REQ-1676](REQ-1676-parent-hides-generated.md) | When the game generates items and creatures after the MVP, the Parent Room MUST let the parent hide or redraw each one. | approved |
| [REQ-1678](REQ-1678-chapter-finale-in-adventure.md) | In the MVP, each chapter MUST end with a story finale inside a daily adventure that awards the chapter title and the chapter's main reward. | approved |
| [REQ-1680](REQ-1680-season-finale-keeps-rank.md) | In the MVP, a season finale MUST award its chapter title and main reward and leave the rank unchanged. | approved |
| [REQ-1682](REQ-1682-rank-opening-by-date.md) | In the MVP, a rank opening MUST open on its rank's calendar date while the rank badge stays E. | approved |
| [REQ-1684](REQ-1684-diary-page-arrives-developed.md) | In the MVP, an enciphered Diary page MUST arrive already developed. | approved |
| [REQ-1686](REQ-1686-judge-fixed-answer-checks.md) | The judge model MUST take only checks with a fixed set of answers, and never write text, solve a task or judge a picture. | approved |
| [REQ-1688](REQ-1688-judge-gated-by-test-set.md) | A check MUST move to the judge model only after the judge matches the reference model on a labelled Russian test set built for the check being moved, at the stage 0 bake-off. | approved |
| [REQ-1690](REQ-1690-judge-falls-back.md) | When the judge model errs or times out, the check MUST run on the safety model. | approved |
| [REQ-1692](REQ-1692-master-second-model.md) | When the Master's model fails an order, the order MUST go to a second, fallback model before the scene falls back to the library. | approved |
| [REQ-1694](REQ-1694-parent-picks-approved-model.md) | The Parent Room MUST let the parent switch the Master's model only among the models the bake-off approved. | approved |
| [REQ-1696](REQ-1696-model-switch-next-adventure.md) | A switch of the Master's model in the Parent Room MUST take effect at the next adventure. | approved |
| [REQ-1700](REQ-1700-deterministic-outcomes.md) | The same verdicts, seeds and scene order MUST always give the same task, room and floor outcomes. | approved |
| [REQ-1702](REQ-1702-first-attempt-decides.md) | A task's outcome MUST depend only on the unassisted first attempt. | approved |
| [REQ-1704](REQ-1704-second-attempt-changes-nothing.md) | A second attempt MUST NOT change the streak, any bonus or the room branch. | approved |
| [REQ-1706](REQ-1706-every-outcome-moves-on.md) | Every task outcome, a wrong answer and «Не знаю» (I don't know) included, MUST move the story on and never end it. | approved |
| [REQ-1708](REQ-1708-streak-shown-as-garland.md) | The streak MUST show only as a garland, with no digits. | approved |
| [REQ-1710](REQ-1710-streak-break-silent.md) | The game MUST NOT announce a broken streak by word or by sound. | approved |
| [REQ-1712](REQ-1712-rapid-guess-half-weight.md) | A rapid guess MUST count at most 0.5 in the room and floor clean shares: 0.5 when correct and 0 when wrong. | approved |
| [REQ-1714](REQ-1714-rapid-guess-looks-same.md) | The game MUST show a rapid guess exactly as it shows any other answer with the same verdict. | approved |
| [REQ-1716](REQ-1716-room-branch-by-share.md) | A room MUST take the `success` branch when its clean share over all its slots reaches the room threshold, and the `alt` branch otherwise. | approved |
| [REQ-1718](REQ-1718-branches-advance-equally.md) | Both room branches and all three floor states MUST advance the campaign equally, differing only in scenes, lines and bonuses. | approved |
| [REQ-1720](REQ-1720-missed-rewards-return.md) | Every reward missed on an `alt` branch MUST return within 7 sessions, except checkpoint pages and legendary rewards, which come by the calendar. | approved |
| [REQ-1722](REQ-1722-no-state-for-empty-floor.md) | A floor with no rooms and no Guardian MUST get no floor state. | approved |
| [REQ-1724](REQ-1724-stateless-floor-excluded.md) | A floor with no floor state MUST stay out of the day's summary and out of the chapter-finale thresholds. | approved |
| [REQ-1726](REQ-1726-guardian-endings-ready.md) | On a floor with a Guardian, all three Guardian endings MUST exist, from the Master or from the fallback library, before the Guardian's problem starts. | approved |
| [REQ-1728](REQ-1728-thresholds-versioned-outside-code.md) | Every set of outcome thresholds MUST live outside the code under a version, so that a threshold changes without a code change. | approved |
| [REQ-1730](REQ-1730-thresholds-meet-target-shares.md) | Before release, the outcome thresholds MUST produce, in a simulation on mixed-knowledge profiles after a cold start, the `success` branch in 55-75 % of rooms, the cunning bypass in at most 25 % of floor-days, triumph in 15-35 % of floor-days and the chapter finale's triumph variant in about half of chapters. | approved |
| [REQ-1732](REQ-1732-thresholds-share-test.md) | An automatic test MUST check that the outcome thresholds in force produce the target shares. | approved |
| [REQ-1734](REQ-1734-thresholds-decision-record.md) | The tuned outcome thresholds MUST be recorded in a decision record the owner approves, naming the version of the thresholds they set. | approved |
| [REQ-1736](REQ-1736-starting-thresholds.md) | Until the stage 0.1 simulation calibrates them, the outcome thresholds MUST be room 0.6, floor triumph 0.8 and floor victory 0.5. | approved |
| [REQ-1738](REQ-1738-chapter-triumph-variant.md) | Until calibration changes the values, the chapter finale MUST take its triumph variant when at least half of the chapter's floor-days are triumph or victory and at least 0.3 of them are triumph. | approved |
| [REQ-1740](REQ-1740-first-month-review.md) | The first-month review MUST check the actual share of triumph chapters and adjust the chapter triumph share before any other threshold. | approved |
| [REQ-1742](REQ-1742-three-spell-outcomes.md) | A single spell MUST have exactly three outcomes: `clean` for a correct verdict, `partial` («почти», almost) for a partial verdict, and `alt` («ослаблен», loosened) for a wrong answer or «Не знаю» (I don't know). | approved |
| [REQ-1744](REQ-1744-canon-uses-three-outcomes.md) | The canon and the line pool MUST name a spell's outcomes by the same three: clean, almost and loosened. | approved |
| [REQ-1746](REQ-1746-streak-grows.md) | The streak MUST grow by one only on a `clean` unassisted first attempt on a scored task that isn't a rapid guess. | approved |
| [REQ-1748](REQ-1748-streak-holds.md) | The streak MUST stay unchanged on a `partial` outcome, a rapid guess, a warm-up, a check fact and an unscored task. | approved |
| [REQ-1750](REQ-1750-streak-ends-on-alt.md) | An `alt` outcome MUST end the streak. | approved |
| [REQ-1752](REQ-1752-clean-row-at-three.md) | When the streak reaches 3, the game MUST fire a clean row that gives 1 guiding thread. | approved |
| [REQ-1754](REQ-1754-big-clean-row-at-fives.md) | When the streak reaches a multiple of 5, the game MUST fire a big clean row. | approved |
| [REQ-1756](REQ-1756-streak-starts-each-adventure.md) | The streak MUST start at 0 with each adventure. | approved |
| [REQ-1758](REQ-1758-streak-survives-resume.md) | The streak MUST survive leaving and resuming the same adventure. | approved |
| [REQ-1760](REQ-1760-outcome-badge-mapping.md) | The outcome badge MUST show `crit` for a `clean` outcome that closes a clean row, `clean` for any other `clean` outcome, `partial` for a `partial` outcome, `soft` for an `alt` outcome after a wrong answer and `unknown` for an `alt` outcome after «Не знаю» (I don't know). | approved |
| [REQ-1762](REQ-1762-alt-badge-labels.md) | The `soft` badge MUST read «Узел ослаблен» (Knot loosened) and the `unknown` badge «Принято» (Accepted). | approved |
| [REQ-1764](REQ-1764-canon-branch-rule-in-words.md) | The canon MUST describe the room's branch rule in words and give no threshold value. | approved |
| [REQ-1800](REQ-1800-master-writes-for-age.md) | The Master's text MUST suit the player's age (kept in `personal/player.md`). | superseded |
| [REQ-1802](REQ-1802-no-personal-data-questions.md) | The Master MUST NOT ask the player for personal data. | approved |
| [REQ-1804](REQ-1804-no-schoolwork-talk.md) | The Master MUST NOT talk about schoolwork or grades. | approved |
| [REQ-1806](REQ-1806-outcomes-as-world-events.md) | The Master MUST tell every trial outcome as an event in the world, never as a verdict on the heroine. | approved |
| [REQ-1808](REQ-1808-human-question-fixed-line.md) | When the player asks directly whether the narrator is a human or an AI, the Master MUST answer with the fixed System line «Рассказчик этой истории — компьютерная программа. Человеком не является. Историю мы пишем вместе.» (The narrator of this story is a computer program. It is not a human. We write the story together.). | approved |
| [REQ-1810](REQ-1810-never-poses-as-human.md) | The Master MUST NOT pass itself off as a human. | approved |
| [REQ-1812](REQ-1812-no-forbidden-content.md) | The Master MUST NOT produce any item on the forbidden-content list. | approved |
| [REQ-1814](REQ-1814-safety-test-covers-list.md) | The safety test MUST cover every item on the forbidden-content list. | approved |
| [REQ-1816](REQ-1816-hand-written-triggers.md) | The real-life signal triggers and their fixed lines MUST be written by a person, never generated. | approved |
| [REQ-1818](REQ-1818-everyday-signal-warm-answer.md) | When the player's text carries an everyday real-life signal, such as being tired, a bad day or falling out with a friend, the Master MUST answer warmly inside the story. | approved |
| [REQ-1820](REQ-1820-everyday-signal-quiet-flag.md) | When the player's text carries an everyday real-life signal, the game MUST quietly flag the scene for the parent. | approved |
| [REQ-1822](REQ-1822-serious-signal-leaves-role.md) | When the player's text carries a serious real-life signal, such as danger, someone hurting her, a request to keep a secret from her parents, thoughts of self-harm or an unknown adult online, the Master MUST leave its role with the fixed line «Это звучит серьёзно. Об этом лучше рассказать маме или папе — они помогут» (This sounds serious. It's better to tell Mum or Dad about it; they'll help). | approved |
| [REQ-1824](REQ-1824-serious-signal-pauses.md) | When the player's text carries a serious real-life signal, such as danger, someone hurting her, a request to keep a secret from her parents, thoughts of self-harm or an unknown adult online, the game MUST pause with a «Вернуться в историю» (Back to the story) button. | approved |
| [REQ-1826](REQ-1826-serious-signal-parent-notice.md) | When the player's text carries a serious real-life signal, such as danger, someone hurting her, a request to keep a secret from her parents, thoughts of self-harm or an unknown adult online, the game MUST put a notice at the top of the Parent Room that stays there until the parent opens it. | approved |
| [REQ-1828](REQ-1828-serious-signal-web-push.md) | After the MVP, when the player's text carries a serious real-life signal, the server MUST also send a web push to every phone the parent has subscribed, carrying a fixed line with no details. | approved |
| [REQ-1830](REQ-1830-failed-push-logged.md) | When a push for a serious signal fails, the game MUST log the failure and keep the Parent Room notice. | approved |
| [REQ-1832](REQ-1832-doubt-means-serious.md) | When a signal's level is in doubt, the game MUST treat the signal as serious. | approved |
| [REQ-1834](REQ-1834-triggers-run-locally-first.md) | The hand-written triggers MUST check the player's text on the parent's Mac before any outside model reads it. | approved |
| [REQ-1836](REQ-1836-judge-never-lowers-signal.md) | A model's judgement of a signal's level MUST NOT lower a level the hand-written triggers found. | approved |
| [REQ-1838](REQ-1838-dialogues-readable-by-parent.md) | Every dialogue MUST be saved and readable by the parent in the Parent Room. | approved |
| [REQ-1840](REQ-1840-master-writes-for-configured-age.md) | The Master MUST write for the age the parent set in the Parent Room. | approved |
| [REQ-1900](REQ-1900-planned-friendship-always-succeeds.md) | When the story reaches a planned friendship with a roster familiar, the friendship MUST succeed whatever the player answered in the tasks. | approved |
| [REQ-1902](REQ-1902-friendship-growth-ignores-answers.md) | A familiar's friendship MUST grow by the same amount whether the player's answers are right, wrong or «Не знаю» (I don't know). | approved |
| [REQ-1904](REQ-1904-evolution-timing-ignores-answers.md) | The moment a familiar evolves MUST NOT depend on whether the player's answers are right or wrong. | approved |
| [REQ-1906](REQ-1906-element-ring-spares-tasks.md) | The element ring MUST NOT affect any task, its outcome or its measurement. | approved |
| [REQ-1908](REQ-1908-familiars-never-come-to-harm.md) | A familiar MUST NOT die, fall seriously ill or disappear. | approved |
| [REQ-1910](REQ-1910-lost-battle-costs-nothing.md) | When the player loses a familiar battle, the game MUST NOT take away any familiar, item, currency or progress she holds. | approved |
| [REQ-1912](REQ-1912-session-zero-starter-choice.md) | In Session 0 the player MUST choose her first familiar from «Пуговка» (Pugovka, Little Button), «Винтик» (Vintik, Little Screw) and «Безешка» (Bezeshka, Little Meringue). | approved |
| [REQ-1914](REQ-1914-session-zero-starter-name.md) | In Session 0 the game MUST ask the player to name the starter she chose. | approved |
| [REQ-1916](REQ-1916-session-zero-starter-traits.md) | In Session 0 the game MUST ask the player to give the starter she chose one or two traits. | approved |
| [REQ-1918](REQ-1918-mvp-roster-required-six.md) | The MVP roster MUST contain six required familiars: «Пуговка» (Pugovka) and «Шуршик» (Shurshik, Rustler) for Spark, «Винтик» (Vintik) and «Бубенец» (Bubenets, Sleigh Bell) for Stride, and «Безешка» (Bezeshka) and «Корица» (Koritsa, Cinnamon) for Crumb. | approved |
| [REQ-1920](REQ-1920-mvp-extra-familiar-needs-art.md) | A familiar beyond the six required ones MUST NOT enter the MVP roster until a person has approved every picture of it. | approved |
| [REQ-1922](REQ-1922-mvp-roster-at-most-nine.md) | The MVP roster MUST hold no familiars beyond the six required ones other than «Запятый» (Zapyaty, Comma-ish), «Грошик» (Groshik, Little Penny) and «Рулетик» (Ruletik, Little Roll). | approved |
| [REQ-1924](REQ-1924-stage-pictures-stay-recognisable.md) | Each evolution stage picture of a familiar MUST keep it recognisable as the same creature as its previous stage. | approved |
| [REQ-1926](REQ-1926-mvp-starters-three-stages.md) | In the MVP each starter MUST have three evolution stages. | approved |
| [REQ-1928](REQ-1928-mvp-non-starters-two-stages.md) | In the MVP each familiar other than a starter MUST ship with only its first two evolution stages. | approved |
| [REQ-1930](REQ-1930-evolution-data-without-code-change.md) | Changing a familiar's evolution stages or friendship thresholds MUST NOT require a change to the game's code. | approved |
| [REQ-1932](REQ-1932-canon-gives-three-stages.md) | The canon MUST give every roster familiar three evolution stages. | approved |
| [REQ-1934](REQ-1934-mvp-non-starter-evolves-at-five.md) | In the MVP a familiar other than a starter MUST evolve to its second stage when its friendship reaches level 5. | approved |
| [REQ-1936](REQ-1936-third-stage-at-next-rest-stop.md) | When an update brings a familiar's third stage and that familiar's friendship is already past level 12, the familiar MUST evolve in its own scene at the next rest stop. | approved |
| [REQ-1938](REQ-1938-familiar-waits-for-third-stage.md) | Until a familiar's third stage has shipped, a familiar whose friendship passes level 12 MUST stay at its second stage. | approved |
| [REQ-1940](REQ-1940-bestiary-page-per-creature.md) | The bestiary MUST show a page for each creature the player has met. | approved |
| [REQ-1942](REQ-1942-bestiary-completion-percentage.md) | The bestiary MUST show the share of the shipped roster the player has met, as a percentage. | approved |
| [REQ-1944](REQ-1944-bestiary-unmet-silhouettes.md) | The bestiary MUST show a silhouette for each roster creature the player hasn't met yet. | approved |
| [REQ-1946](REQ-1946-bestiary-habitats-by-floor.md) | The bestiary MUST show each creature's habitat by floor. | approved |
| [REQ-1948](REQ-1948-familiar-names-are-original.md) | Every familiar name, creature and term MUST be original, with nothing taken from a known franchise. | approved |
| [REQ-1950](REQ-1950-battles-settled-by-tactics.md) | If familiar battles are built, the outcome of a battle MUST depend only on the player's tactical choices, so the same choices against the same opponent always give the same result. | approved |
| [REQ-1952](REQ-1952-hatching-offers-canon-name-first.md) | When a familiar hatches, the game MUST offer the familiar's canon name as the first name suggestion. | approved |
| [REQ-1954](REQ-1954-canon-name-replaceable.md) | When a familiar hatches, the player MUST be able to replace its canon name with a name of her own. | approved |
| [REQ-2000](REQ-2000-first-attempt-same-experience.md) | An unassisted first attempt MUST earn the same experience whether the answer is right, wrong or «Не знаю» (I don't know). | approved |
| [REQ-2002](REQ-2002-earned-progress-never-shrinks.md) | The game MUST NOT reduce the player's experience, level, rank or any other progress she has earned after an answer, a mistake or a missed day. | approved |
| [REQ-2004](REQ-2004-experience-sized-for-sixty-minutes.md) | The experience amounts and the level curve MUST give about 500 to 650 experience for one 60-minute adventure. | approved |
| [REQ-2006](REQ-2006-quests-completable-by-play.md) | Every daily quest MUST be completable without answering any task correctly. | approved |
| [REQ-2008](REQ-2008-unmet-quest-vanishes-quietly.md) | When a game day ends with a daily quest unmet, the quest MUST disappear without any penalty. | approved |
| [REQ-2010](REQ-2010-total-day-count-shown.md) | The game MUST show the player the total number of days she has spent in the Tower, counting each game day on which she played at least one task. | approved |
| [REQ-2012](REQ-2012-no-day-streak.md) | The game MUST NOT keep or show a streak of consecutive days. | approved |
| [REQ-2014](REQ-2014-no-player-notifications.md) | The game MUST NOT send the player any notification or reminder to come back. | approved |
| [REQ-2016](REQ-2016-nearest-goal-always-shown.md) | The main screen and the end of every scene MUST show the player's nearest goal. | approved |
| [REQ-2018](REQ-2018-experience-bar-in-points.md) | The experience bar MUST show experience in points. | approved |
| [REQ-2020](REQ-2020-mvp-rank-stays-e.md) | In the MVP the heroine's rank MUST stay E from Session 0 onward. | approved |
| [REQ-2022](REQ-2022-stats-reach-master-relatively.md) | If stats are built, the Master MUST receive each stat only as low, medium or high relative to the others. | approved |
| [REQ-2024](REQ-2024-stats-never-affect-tasks.md) | If stats are built, they MUST NOT affect any task. | approved |
| [REQ-2026](REQ-2026-level-up-ceremony.md) | In the MVP a level-up MUST show a ceremony of light and sound. | approved |
| [REQ-2028](REQ-2028-mvp-level-up-grants-nothing.md) | In the MVP a level-up MUST NOT grant stat points, buttons, guiding threads or any other reward. | approved |
| [REQ-2030](REQ-2030-mvp-offers-no-stats.md) | The MVP MUST NOT show or offer stats. | approved |
| [REQ-2032](REQ-2032-mvp-offers-no-paths.md) | The MVP MUST NOT offer paths. | approved |
| [REQ-2034](REQ-2034-quest-gives-fifty-experience.md) | Each daily quest the player meets MUST give 50 experience. | approved |
| [REQ-2036](REQ-2036-mirra-holds-rank-d.md) | The rival «Мирра Шпилька» (Mirra Hairpin) MUST hold rank D, one above the heroine's starting E, through the MVP. | approved |
| [REQ-2038](REQ-2038-canon-names-no-rank-month.md) | The canon MUST NOT name a month for any rank. | approved |
| [REQ-2100](REQ-2100-mistakes-take-nothing-away.md) | A mistake or «Не знаю» (I don't know) MUST NOT take away any currency, item or other reward the player has earned. | approved |
| [REQ-2102](REQ-2102-rewards-ignore-speed.md) | Every reward MUST be independent of how fast the player answers. | approved |
| [REQ-2104](REQ-2104-chest-shows-rewards-first.md) | Every chest MUST show all three of its rewards before the player picks one. | approved |
| [REQ-2106](REQ-2106-chest-filled-by-visible-rules.md) | Every chest MUST be filled by visible rules alone, so the same state on the same day always gives the same chest, with no random draw, hidden odds or pity counter. | approved |
| [REQ-2108](REQ-2108-success-chest-has-sparkling.md) | When a room ends on a `success` branch, one of its chest's three rewards MUST be sparkling. | approved |
| [REQ-2110](REQ-2110-alt-chest-ordinary-or-good.md) | When a room ends on an `alt` branch, all three of its chest's rewards MUST be ordinary or good. | approved |
| [REQ-2112](REQ-2112-shop-sells-for-buttons.md) | The shop MUST sell for buttons only. | approved |
| [REQ-2114](REQ-2114-shop-prices-fixed-visible.md) | Every shop price MUST be fixed and shown before the player buys. | approved |
| [REQ-2116](REQ-2116-tricks-change-look-only.md) | A trick MUST change only a spell's animation and sound, never its power. | approved |
| [REQ-2118](REQ-2118-no-real-money-purchases.md) | The game MUST NOT offer any purchase with real money. | approved |
| [REQ-2120](REQ-2120-no-premium-currency.md) | The game MUST NOT have a premium currency. | approved |
| [REQ-2122](REQ-2122-no-leaderboard.md) | The game MUST NOT show a leaderboard. | approved |
| [REQ-2124](REQ-2124-shop-open-from-day-one.md) | In the MVP the shop MUST be open from the player's first day. | approved |
| [REQ-2126](REQ-2126-forge-open-first-week.md) | In the MVP the Thread Forge MUST open for the player no later than her seventh day of play. | approved |
| [REQ-2128](REQ-2128-first-attempt-gives-button.md) | Every first attempt MUST give 1 button, whatever its outcome. | approved |
| [REQ-2130](REQ-2130-second-attempt-gives-no-button.md) | A second attempt MUST give no button. | approved |
| [REQ-2132](REQ-2132-quest-gives-ten-buttons.md) | Each daily quest the player meets MUST give 10 buttons. | approved |
| [REQ-2134](REQ-2134-chest-button-amounts.md) | A chest's button reward MUST be 15, 25 or 40 buttons for an ordinary, good or sparkling reward. | approved |
| [REQ-2136](REQ-2136-clean-attempt-gives-shard.md) | Each clean first attempt on a scored task that isn't a rapid guess MUST give 1 star-steel shard. | approved |
| [REQ-2138](REQ-2138-finished-floor-gives-shards.md) | Each finished floor MUST give 2 star-steel shards, whatever the floor's state. | approved |
| [REQ-2140](REQ-2140-chest-shard-amounts.md) | A chest's shard reward MUST be 5, 8 or 12 star-steel shards for an ordinary, good or sparkling reward. | approved |
| [REQ-2142](REQ-2142-guardian-gives-yarn.md) | Each finished Guardian problem MUST give 3 star yarn, whatever its ending. | approved |
| [REQ-2144](REQ-2144-pattern-row-gives-yarn-only.md) | Each optional pattern row the player meets MUST give 2 star yarn and nothing else. | approved |
| [REQ-2146](REQ-2146-chest-yarn-amounts.md) | A chest's yarn reward MUST be 2, 3 or 4 star yarn for an ordinary, good or sparkling reward. | approved |
| [REQ-2148](REQ-2148-room-chest-gives-material.md) | Each room chest MUST give 1 of its floor's material beside the reward the player picks. | approved |
| [REQ-2150](REQ-2150-floor-chest-gives-materials.md) | Each floor chest MUST give 2 of its floor's material beside the reward the player picks. | approved |
| [REQ-2152](REQ-2152-success-find-gives-material.md) | Each success-branch find MUST give 1 more of its floor's material. | approved |
| [REQ-2154](REQ-2154-observatory-visit-gives-moon-mote.md) | Each Observatory visit MUST give 1 moon mote. | approved |
| [REQ-2156](REQ-2156-shop-prices-by-category.md) | Shop prices MUST start at 80 buttons for a curiosity, 200 for an accessory, 450 for an outfit and 800 for a focus. | approved |
| [REQ-2158](REQ-2158-shop-prices-without-code-change.md) | Changing a shop price MUST NOT require a change to the game's code. | approved |
| [REQ-2160](REQ-2160-shelf-category-mix.md) | The shop shelf MUST hold six items: 1 focus, 2 outfits, 2 accessories and 1 curiosity. | approved |
| [REQ-2162](REQ-2162-shelf-daily-replacement.md) | At the start of each game day the shelf MUST replace 2 slots with items of the same category, taking the slots the player emptied by buying first and then the slots that have stood longest. | approved |
| [REQ-2164](REQ-2164-shelf-same-for-same-day.md) | The shelf's daily replacement MUST give the same items for the same day and the same shelf. | approved |
| [REQ-2166](REQ-2166-shelf-never-offers-owned-item.md) | The shelf MUST NOT offer an item the player owns. | approved |
| [REQ-2168](REQ-2168-unsold-item-rests-seven-days.md) | An item that leaves the shelf unsold MUST NOT return to it for 7 days. | approved |
| [REQ-2170](REQ-2170-recipe-has-three-rows.md) | Every forge recipe MUST have three rows: star-steel shards, star yarn and one floor material. | approved |
| [REQ-2172](REQ-2172-recipe-amounts-by-tier.md) | Forge recipes MUST ask for 5 shards, 2 yarn and 2 floor material for the first recipe, 25, 6 and 3 for an accessory, 80, 20 and 5 for an outfit, and 160, 40 and 6 for a focus. | approved |
| [REQ-2174](REQ-2174-recipes-without-code-change.md) | Changing a forge recipe MUST NOT require a change to the game's code. | approved |
| [REQ-2176](REQ-2176-mvp-ships-six-recipes.md) | The MVP MUST ship six forge recipes: «Шарф Туманной Погоды» (Scarf of Foggy Weather), «Очки Второго Взгляда» (Glasses of the Second Look), «Капюшон с Ушками Путаницы» (Hood with Tangle Ears), «Сапожки Точного Шага» (Boots of the Exact Step), «Фонарь Терпеливого Света» (Lantern of Patient Light) and «Гримуар Чистых Страниц» (Grimoire of Clean Pages). | approved |
| [REQ-2178](REQ-2178-mvp-catalogue-twenty-items.md) | The MVP shop catalogue MUST hold at least 20 items outside the forge recipes. | approved |
| [REQ-2180](REQ-2180-chest-three-categories.md) | Every chest MUST offer three rewards from three different categories, drawn from cosmetics, shards and yarn, buttons, and Diary pages. | approved |
| [REQ-2182](REQ-2182-nine-floor-worlds.md) | The Tower MUST have nine floor-worlds, with the Observatory as the ninth floor outside the ring of eight elements. | approved |
| [REQ-2184](REQ-2184-chest-favours-largest-shortfall.md) | The Director MUST fill a chest from the three categories where the player's stock falls furthest short of its next goal. | approved |
| [REQ-2186](REQ-2186-chest-tie-ignores-answers.md) | When two chest categories fall equally short, the Director MUST break the tie the same way for the same state on the same day, and never by the player's answers. | approved |
| [REQ-2200](REQ-2200-derived-views-rebuild-from-log.md) | When any derived view is deleted and a full recompute runs with the same model, threshold and graph versions, the game MUST rebuild that view from the event log alone, identical to the view before deletion. | approved |
| [REQ-2202](REQ-2202-event-carries-time-device-context.md) | Every event MUST carry the server time, the device time, the device identifier and, where the event happens inside a session or an adventure, that session and that adventure. | approved |
| [REQ-2204](REQ-2204-log-records-task-shown.md) | When the game shows a task, the event log MUST record its full rendered view, its template and template version, seed, parameters, node, subtype, purpose and attempt number. | approved |
| [REQ-2206](REQ-2206-second-attempt-links-original.md) | When the game shows a second attempt, the event log MUST link it to the original task it follows. | approved |
| [REQ-2208](REQ-2208-log-records-every-attempt.md) | When the player submits an attempt, the event log MUST record the input summary, the answer as entered and as parsed, the verdict, the game outcome, the trap, the error class, the step matching, the assisted flag, the hint level, the guiding threads spent, and whether and for how long the short solution and the detailed explanation were shown. | approved |
| [REQ-2210](REQ-2210-log-records-draft-snapshots.md) | When the player submits an answer with a draft pad in use, the event log MUST refer to an image of the draft as it stood at that moment, in a way that shows whether the stored image has changed since. | approved |
| [REQ-2212](REQ-2212-log-records-term-hint-taps.md) | When the player taps a term hint, the event log MUST record the tap with the term and the task it belongs to. | approved |
| [REQ-2214](REQ-2214-log-records-story-events.md) | The event log MUST record every scene shown, every choice the player makes, her free text in its cleaned form and every name she gives. | approved |
| [REQ-2216](REQ-2216-log-records-economy-events.md) | The event log MUST record every game-economy event: rewards, chests offered and chosen, forging, purchases, levels, quest progress, familiar friendship, hatching and evolution, and guiding threads earned and spent. | approved |
| [REQ-2218](REQ-2218-log-records-pauses-and-breaks.md) | The event log MUST record every pause, resume, change of device, eye exercise, rest stop, soft stop and extension. | approved |
| [REQ-2220](REQ-2220-log-records-parent-actions.md) | The event log MUST record every parent action: lesson tags added and removed, tasks flagged or excluded, and changes of settings. | approved |
| [REQ-2222](REQ-2222-log-records-safety-and-model-calls.md) | The event log MUST record every safety event and a reference to the record of every language model call. | approved |
| [REQ-2224](REQ-2224-logged-decisions-never-rewritten.md) | The game MUST NOT change an outcome, a reward or a branch it has logged, even when a recompute under new versions would decide it differently. | approved |
| [REQ-2226](REQ-2226-stored-events-never-change.md) | The event log MUST reject every attempt to change or remove a stored event, whichever part of the system makes it. | approved |
| [REQ-2228](REQ-2228-corrections-are-new-events.md) | When a fact in the log needs correcting, such as a task the parent excludes, the game MUST record the correction as a new event and leave the original event as it was. | approved |
| [REQ-2230](REQ-2230-version-change-triggers-recompute.md) | When the model version or the threshold version changes, the game MUST recompute every derived view from the whole event log. | approved |
| [REQ-2232](REQ-2232-startup-rebuilds-missing-views.md) | When the server starts and finds a derived view missing, the server MUST rebuild it from the event log. | approved |
| [REQ-2234](REQ-2234-export-raw-log-formats.md) | When the parent exports the raw event log, the game MUST offer it both as JSONL and as Parquet. | approved |
| [REQ-2236](REQ-2236-export-flat-tables-formats.md) | When the parent exports the flat tables of attempts and of tasks shown, the game MUST offer each both as CSV and as Parquet. | approved |
| [REQ-2238](REQ-2238-export-from-mac-command.md) | The parent MUST be able to run the export from a command on the Mac, as well as from the Parent Room. | approved |
| [REQ-2240](REQ-2240-export-only-on-the-mac.md) | The game MUST offer the export only in a Parent Room opened on the Mac and through the command on the Mac, so a Parent Room opened on another device offers none. | approved |
| [REQ-2242](REQ-2242-recompute-keeps-service-data.md) | A full recompute MUST leave unchanged the scratchpad images and their metadata, the explanation cache, the paired devices, the language model call records, the art job queue, the live frames with their statuses and the bake-off results. | approved |
| [REQ-2300](REQ-2300-report-current-after-adventure.md) | When an adventure ends, the report MUST reflect every event of that adventure. | approved |
| [REQ-2302](REQ-2302-report-answers-three-questions.md) | The report MUST answer three questions: what the player has mastered, where her frontier is and what holds her back. | approved |
| [REQ-2304](REQ-2304-no-lesson-plan.md) | The game MUST NOT produce a lesson plan. | approved |
| [REQ-2306](REQ-2306-labels-non-judgemental.md) | Every report label MUST be non-judgemental, in the style of «пока не освоено» (not mastered yet), «понимает, нужна скорость» (understands, needs speed) and «прочно» (solid), never «плохо» (bad) or «отстаёт» (falls behind). | approved |
| [REQ-2308](REQ-2308-report-v1-eight-screens.md) | Report v1 MUST have eight screens: the summary, VWO readiness, the graph map, the node card, misconceptions, limits, science and the story book. | approved |
| [REQ-2310](REQ-2310-skill-map-unassisted-only.md) | The skill map MUST be computed from unassisted first attempts only. | approved |
| [REQ-2312](REQ-2312-assisted-only-in-with-help.md) | Assisted attempts MUST appear in the report only in the «с помощью» (with help) figures. | approved |
| [REQ-2314](REQ-2314-skill-map-state-and-estimate.md) | The skill map MUST show, for each node, its state and its «сама» (on her own) estimate with the estimate's uncertainty. | approved |
| [REQ-2316](REQ-2316-solves-with-hint-per-node.md) | The report MUST show, for each node, the share of correct assisted attempts beside the node's «сама» (on her own) estimate, under «решает с подсказкой» (solves with a hint). | approved |
| [REQ-2318](REQ-2318-nearly-ready-mark.md) | The report MUST mark a node «почти готово» (nearly ready) when its state is below «бегло» (fluent) and its «с помощью» (with help) estimate is at least 0.7 over at least 3 assisted attempts within the last 30 days. | approved |
| [REQ-2320](REQ-2320-frontier-by-domain.md) | The report MUST show the frontier nodes grouped by domain. | approved |
| [REQ-2322](REQ-2322-not-checked-for-long.md) | The report MUST list a node as not checked for a long time when its last unassisted first attempt is more than 30 days old. | approved |
| [REQ-2324](REQ-2324-misconceptions-with-examples.md) | The misconceptions screen MUST list the traps that fired, by frequency, with examples. | approved |
| [REQ-2326](REQ-2326-misconception-one-row.md) | A misconception that fires in several nodes MUST appear as one row on the misconceptions screen. | approved |
| [REQ-2328](REQ-2328-node-card-shows-tasks-as-shown.md) | The node card MUST show every task exactly as the player saw it, with her answer, the correct answer, the time, the help she used and the review. | approved |
| [REQ-2330](REQ-2330-vwo-block-three-measures.md) | The VWO readiness block MUST show three measures: 1F coverage, the share of verified 1F nodes at «понимает» (understands) or above; the 1S margin, the share of 1S nodes in «бегло» (fluent) or «устойчиво» (stable); and the ceiling, the number of stretch nodes mastered. | approved |
| [REQ-2332](REQ-2332-vwo-ladder-verified-only.md) | The VWO readiness ladder MUST count verified states only. | approved |
| [REQ-2334](REQ-2334-vwo-inferred-separate-figure.md) | The VWO readiness block MUST show inferred states as a figure of their own, beside the ladder and outside every step. | approved |
| [REQ-2336](REQ-2336-vwo-unverified-not-covered.md) | The VWO readiness ladder MUST treat an unverified node and a cut-off node as not covered. | approved |
| [REQ-2338](REQ-2338-vwo-step-covered-no-margin.md) | The VWO readiness ladder MUST give the step «1S покрыт без запаса» (1S covered with no margin) when at least 90 % of 1F nodes and at least 90 % of 1S nodes are verified at «понимает» (understands) or above and no 1F node is in «не освоен» (not mastered). | approved |
| [REQ-2340](REQ-2340-vwo-step-with-margin.md) | The VWO readiness ladder MUST give the step «1S с запасом» (1S with a margin) when the conditions for «1S покрыт без запаса» hold and at least 80 % of 1S nodes are in «бегло» (fluent) or «устойчиво» (stable). | approved |
| [REQ-2342](REQ-2342-vwo-step-margin-and-ceiling.md) | The VWO readiness ladder MUST give the step «1S с запасом и потолком выше» (1S with a margin and a ceiling above) when the conditions for «1S с запасом» hold and at least 3 stretch nodes are in «бегло» (fluent) or «устойчиво» (stable). | approved |
| [REQ-2344](REQ-2344-vwo-step-not-covered.md) | When the conditions for «1S покрыт без запаса» (1S covered with no margin) don't hold, the VWO readiness ladder MUST give the step «1S ещё не покрыт» (1S not covered yet). | approved |
| [REQ-2346](REQ-2346-vwo-thresholds-versioned.md) | The VWO readiness thresholds MUST live as data outside the code and change only with a new version. | approved |
| [REQ-2348](REQ-2348-vwo-disclaimer-always.md) | The VWO readiness block MUST always show the note «Ориентировочный домашний инструмент. Не официальный совет школы и не стандартизированный тест» (An approximate home tool. Not official school advice and not a standardised test). | approved |
| [REQ-2350](REQ-2350-vwo-preliminary-mark-mvp.md) | In the MVP, the VWO readiness block MUST carry the mark «предварительно: без контрольных прогонов» (preliminary: no control runs). | approved |
| [REQ-2352](REQ-2352-report-behind-parent-pin.md) | The report MUST open only inside the Parent Room after the parent's PIN is entered, so the child never sees it. | approved |
| [REQ-2354](REQ-2354-full-export-pdf-snapshot.md) | After the MVP, the full report's export MUST include a PDF snapshot of the report. | approved |
| [REQ-2356](REQ-2356-v1-limits-row-per-limit.md) | The v1 limits screen MUST show one row for each of the twelve limits, holding steps, endurance, speed of the basics, mental or written, error type, carelessness, impulsiveness and rapid guesses, avoidance, anxiety, flow, language risk and help, each with its current value, the number of sessions behind it and its flag where the limit has one. | approved |
| [REQ-2358](REQ-2358-v1-limits-too-little-data.md) | When fewer than 3 sessions hold data for a limit, its row on the v1 limits screen MUST show «мало данных» (too little data) in place of the value. | approved |
| [REQ-2360](REQ-2360-v1-limits-no-charts.md) | The v1 limits screen MUST NOT show charts or split a limit by part of the session or by task kind. | approved |
| [REQ-2362](REQ-2362-v1-science-answers-by-topic.md) | The v1 science screen MUST list, for each topic, every question the player answered, the option she chose first, and for a wrong option the misconception it names. | approved |
| [REQ-2364](REQ-2364-v1-science-repeated-misconception.md) | When the player chooses the same misconception twice or more, the v1 science screen MUST mark it as a topic to talk about. | approved |
| [REQ-2366](REQ-2366-v1-science-no-scores.md) | The v1 science screen MUST NOT show a score, a state or a percentage. | approved |
| [REQ-2368](REQ-2368-language-cause-mark-node-card.md) | When the player answers wrong on a task with a risk term whose explanation she didn't open, the node card MUST mark that attempt «возможна языковая причина» (possibly a language cause). | approved |
| [REQ-2370](REQ-2370-language-risk-row-lists-terms.md) | The language-risk row of the v1 limits screen MUST list the terms and nodes marked «возможна языковая причина» (possibly a language cause). | approved |
| [REQ-2372](REQ-2372-summary-highlights-language-nodes.md) | The summary screen MUST highlight a node whose errors all carry the mark «возможна языковая причина» (possibly a language cause). | approved |
| [REQ-2374](REQ-2374-graph-map-frontier-ring.md) | The graph map MUST draw a ring around each frontier node. | approved |
| [REQ-2376](REQ-2376-summary-daily-active-time.md) | The summary screen MUST show each day's active time for the week, counted as the soft stop counts it. | approved |
| [REQ-2378](REQ-2378-summary-long-day-mark.md) | When a day's active time passes 120 minutes, the summary screen MUST mark that day «долгий день» (a long day). | approved |
| [REQ-2400](REQ-2400-client-computes-no-verdict.md) | The client MUST NOT compute a verdict, a game outcome, an estimate or the next task, even without a connection. | approved |
| [REQ-2402](REQ-2402-client-checks-input-format-only.md) | The client MUST limit its own check of an answer to the input format. | approved |
| [REQ-2404](REQ-2404-finished-adventure-never-reopens.md) | Once an adventure is complete or wrapped up, the game MUST NOT make it active again. | approved |
| [REQ-2406](REQ-2406-background-pauses-adventure.md) | When the app goes to the background during play, the game MUST pause the adventure. | approved |
| [REQ-2408](REQ-2408-idle-outside-task-pauses.md) | When the player does nothing for 90 seconds outside the task window, the game MUST pause the adventure. | approved |
| [REQ-2410](REQ-2410-idle-in-task-pauses.md) | When the player does nothing for 5 minutes with a task open, the game MUST pause the adventure. | approved |
| [REQ-2412](REQ-2412-break-keeps-session-active.md) | A rest stop or an eye exercise MUST NOT pause the adventure or end the session. | approved |
| [REQ-2414](REQ-2414-answer-reply-no-verdict-words.md) | The reply to an answer MUST NOT contain the words «верно» (right) or «неверно» (wrong). | approved |
| [REQ-2416](REQ-2416-answer-reply-carries-results.md) | The reply to an answer MUST carry the streak, the grants and the short solution, and for a first attempt also the game outcome. | approved |
| [REQ-2418](REQ-2418-reply-carries-correct-answer.md) | The reply to every attempt MUST carry the correct answer, formatted for display. | approved |
| [REQ-2420](REQ-2420-no-correct-answer-before-attempt.md) | The server MUST NOT send a task's correct answer to the client before the player submits the first attempt on that task. | approved |
| [REQ-2422](REQ-2422-repeated-hint-charges-once.md) | When the client repeats a hint request it has already sent, the server MUST NOT spend a second guiding thread for it. | approved |
| [REQ-2424](REQ-2424-explanation-purchase-acknowledged-at-once.md) | When the player buys a detailed explanation, the server MUST confirm the purchase at once, without waiting for the explanation's text. | approved |
| [REQ-2426](REQ-2426-second-attempt-request-repeatable.md) | When the client repeats a second-attempt request for a task, the server MUST return the same parallel task it returned the first time. | approved |
| [REQ-2428](REQ-2428-client-never-learns-task-design.md) | The server MUST NOT send the client a task's node, template, seed, parameters, purpose or whether it is scored. | approved |
| [REQ-2430](REQ-2430-scored-and-unscored-look-alike.md) | The client MUST show every task and every outcome the same way whether the task is scored or not. | approved |
| [REQ-2432](REQ-2432-duplicate-answers-recorded-once.md) | When the same answer reaches the server more than once, the server MUST record it once. | approved |
| [REQ-2434](REQ-2434-no-answer-lost.md) | Every answer the player submits MUST reach the event log, even when the connection drops, the app closes or the device restarts before the answer is sent. | approved |
| [REQ-2436](REQ-2436-offline-disables-server-actions.md) | While the client has no connection to the server, the client MUST keep the hint, detailed explanation and second attempt controls inactive. | approved |
| [REQ-2438](REQ-2438-offline-shows-waiting-scene.md) | When the client has sent an answer to its queue with no connection, the client MUST show a story waiting scene and no new task until the server answers again. | approved |
| [REQ-2440](REQ-2440-parent-session-expires.md) | A parent session MUST expire after 30 minutes without activity. | approved |
| [REQ-2442](REQ-2442-dont-know-recorded-as-verdict.md) | When the player chooses «Не знаю» (I don't know), the server MUST record the verdict "don't know", distinct from a wrong answer and from an empty one. | approved |
| [REQ-2444](REQ-2444-finish-today-blocks-extensions.md) | Once the soft stop that «Закончить на сегодня» (Finish for today) brings has come, the game MUST NOT offer «Ещё один ряд» (One more row) again for the rest of that game day. | approved |
| [REQ-2500](REQ-2500-game-runs-in-browser-from-mac.md) | The game MUST run in a web browser on the iPad and on the computer, served by a server on the parent's Mac over the home network. | approved |
| [REQ-2502](REQ-2502-all-data-on-parents-mac.md) | The server MUST store all game data on the parent's Mac. | approved |
| [REQ-2504](REQ-2504-model-keys-stay-on-server.md) | The server MUST NOT send the key of any external model service to a client. | approved |
| [REQ-2506](REQ-2506-model-service-failure-keeps-game-running.md) | When the external model service fails or can't be reached, the game MUST continue the adventure on texts from the scene library and the fallback pools. | approved |
| [REQ-2508](REQ-2508-answer-stored-before-reply.md) | When the server receives an answer, the server MUST store it durably before it replies to the client. | approved |
| [REQ-2510](REQ-2510-server-reachable-from-home-only.md) | The server MUST accept connections only from the home network, with no port open to the internet. | approved |
| [REQ-2512](REQ-2512-server-runs-unprivileged.md) | Every server process MUST run as an unprivileged user. | approved |
| [REQ-2514](REQ-2514-ipad-trusted-encrypted-connection.md) | The iPad MUST reach the game over an encrypted connection that it trusts without a certificate warning, after a setup done once for each device. | approved |
| [REQ-2516](REQ-2516-pairing-code-expires.md) | A device MUST pair with the server by a 6-digit code that expires 5 minutes after the server issues it. | approved |
| [REQ-2518](REQ-2518-paired-device-keeps-access.md) | A paired device MUST keep its access without pairing again until the parent revokes it. | approved |
| [REQ-2520](REQ-2520-revoked-device-refused.md) | When the parent revokes a device in the Parent Room, the server MUST refuse every later request from that device. | approved |
| [REQ-2522](REQ-2522-lockout-after-wrong-attempts.md) | After 5 wrong attempts at a pairing code or at the PIN, the server MUST refuse further attempts of that kind for 15 minutes. | approved |
| [REQ-2524](REQ-2524-mac-programs-read-copies-only.md) | A program on the Mac other than the server MUST read game data only from a copy, never from the live data the server writes. | approved |
| [REQ-2526](REQ-2526-backup-after-session.md) | When a session ends, the server MUST take a backup copy of the game data. | approved |
| [REQ-2528](REQ-2528-backup-before-structure-change.md) | Before each change to the structure of the stored data, the server MUST take a backup copy of the game data. | approved |
| [REQ-2530](REQ-2530-backup-retention.md) | The server MUST keep the last 30 backup copies and one copy for each calendar month. | approved |
| [REQ-2532](REQ-2532-backup-holds-log-and-blobs.md) | Every backup copy MUST hold the event log and the stored binary data (blobs). | approved |
| [REQ-2534](REQ-2534-tablet-and-computer-interfaces.md) | The game MUST offer a full tablet interface and a full computer interface, each covering every screen of the game and the Parent Room. | approved |
| [REQ-2536](REQ-2536-interface-chosen-by-device.md) | When the game starts on a device, the game MUST choose the tablet or the computer interface from the device's input and screen size. | approved |
| [REQ-2538](REQ-2538-interface-switch-in-settings.md) | The settings MUST let the player switch between the tablet interface and the computer interface. | approved |
| [REQ-2540](REQ-2540-computer-keyboard-operable.md) | On the computer interface, every screen MUST be usable from the keyboard alone. | approved |
| [REQ-2542](REQ-2542-device-keeps-only-unsent-answers.md) | A device MUST keep no game data locally except answers it has not yet sent to the server. | approved |
| [REQ-2544](REQ-2544-pushes-only-to-parent-subscriptions.md) | After the MVP, the server MUST send alarm pushes only to push subscriptions made from the Parent Room on a paired device. | approved |
| [REQ-2546](REQ-2546-revoked-device-loses-pushes.md) | When the parent revokes a device, the server MUST delete that device's push subscription. | approved |
| [REQ-2600](REQ-2600-only-three-kinds-leave-mac.md) | The server MUST NOT send off the parent's Mac any data other than content made without the player, the player's story material (her cleaned free text, invented names, story memory and summary outcome events) and the one-task explanation request. | superseded |
| [REQ-2602](REQ-2602-explanation-request-only-on-thread.md) | An explanation request MUST leave the Mac only when the player spends a guiding thread on that task's explanation. | approved |
| [REQ-2604](REQ-2604-explanation-request-contents.md) | An explanation request MUST hold only the task text as shown, the engine's solution steps and answer, the player's answer, any matched misconception with its engine calculation, the error class and the familiar's kind, name, traits and sample lines. | approved |
| [REQ-2606](REQ-2606-blind-check-input.md) | The blind check of an explanation MUST receive only the task text and the finished explanation. | approved |
| [REQ-2608](REQ-2608-master-requests-name-no-topic.md) | A request to the Master or the planner MUST NOT name a maths topic. | approved |
| [REQ-2610](REQ-2610-no-talk-of-abilities.md) | Text from the Master and the planner MUST NOT discuss the heroine's abilities. | approved |
| [REQ-2612](REQ-2612-personal-data-replaced.md) | Before any request leaves the Mac, the server MUST replace the family names, school, street and city the parent sets, and every phone number, postal address and e-mail address, with neutral labels. | approved |
| [REQ-2614](REQ-2614-no-storage-or-training.md) | Every request to an external model service MUST go under terms that forbid the service and its provider to collect the request or train on it. | approved |
| [REQ-2616](REQ-2616-story-material-zero-retention.md) | Every request that carries the player's story material (her cleaned free text, invented names, story memory and summary outcome events) or an explanation request MUST go only to an endpoint that keeps no copy of the request after answering it. | approved |
| [REQ-2618](REQ-2618-player-tier-providers-only.md) | Every request that carries the player's story material (her cleaned free text, invented names, story memory and summary outcome events) or an explanation request MUST go only to a provider on the player-tier list. | approved |
| [REQ-2620](REQ-2620-other-requests-listed-providers.md) | Every other request to an external model service MUST go only to a provider on the player-tier list or the content-tier list. | approved |
| [REQ-2622](REQ-2622-player-tier-list-default.md) | The player-tier list MUST start as Google Vertex, Amazon Bedrock, Azure and xAI, with Mistral for GLM models only and TypeSafe for Jev only. | approved |
| [REQ-2624](REQ-2624-content-tier-list-default.md) | The content-tier list MUST start as Anthropic, OpenAI, Google AI Studio, Seed and Mistral. | approved |
| [REQ-2626](REQ-2626-provider-lists-are-settings.md) | The owner MUST be able to change the player-tier list and the content-tier list without a code change or a rebuild. | approved |
| [REQ-2628](REQ-2628-startup-refuses-without-zero-retention.md) | The server MUST refuse to start when a player-tier model has no zero-retention endpoint at a provider on the player-tier list. | approved |
| [REQ-2630](REQ-2630-parent-master-pick-checked.md) | When the Master model the parent picked in the Parent Room has no zero-retention endpoint at a provider on the player-tier list, the server MUST start the next adventure on the default Master model and tell the parent in the Parent Room. | approved |
| [REQ-2632](REQ-2632-picture-prompts-exclude-player-text.md) | A picture prompt MUST NOT contain text the player wrote. | approved |
| [REQ-2634](REQ-2634-heroine-by-game-name.md) | Every request that leaves the Mac MUST name the heroine only by the name the player gave her in the game. | approved |
| [REQ-2636](REQ-2636-parent-told-what-leaves.md) | The Parent Room MUST tell the parent the three kinds of data that leave the Mac: content made without the player, the player's story material (her cleaned free text, invented names, story memory and summary outcome events) and the one-task explanation request. | approved |
| [REQ-2638](REQ-2638-disclosure-states-residual-risk.md) | The Parent Room's account of what leaves the Mac MUST state that summary outcome events coarsely reflect how well the player does in a domain. | approved |
| [REQ-2640](REQ-2640-judge-request-minimal.md) | A request to the judge model MUST carry only the cleaned text its question needs, and no story memory, outcome events, answers, times, estimates or other maths result. | approved |
| [REQ-2642](REQ-2642-parent-told-judge-company.md) | The Parent Room MUST tell the parent which company reads the player's cleaned text for safety checks, in which country, and that the company keeps none of it. | approved |
| [REQ-2644](REQ-2644-player-tier-any-region.md) | The player tier MAY use zero-retention endpoints in any region. | approved |
| [REQ-2646](REQ-2646-data-leaving-the-mac.md) | The server MUST NOT send off the parent's Mac any data other than content made without the player, the player's story material (her cleaned free text, invented names, story memory and summary outcome events), the age the parent set, and the one-task explanation request. | approved |
| [REQ-2648](REQ-2648-parent-told-where-checks-run.md) | The Parent Room MUST tell the parent, for each check on the player's text, where it runs and, for each place off the Mac, which company reads the text, in which country and whether it keeps any of it, the fallback included, as the gateway is configured when the parent opens the page. | draft |
| [REQ-2700](REQ-2700-every-model-call-costed.md) | The server MUST record every call to an external model service, the judge model's included, with its cost. | approved |
| [REQ-2702](REQ-2702-adventure-budget.md) | An adventure's spend on the Master, the planner, live frames, blind checks and the judge model's checks MUST stop at the adventure budget, which starts at $1.5. | approved |
| [REQ-2704](REQ-2704-explanation-daily-spend.md) | The day's spend on live explanations MUST stop at the explanation budget, which starts at $0.3. | approved |
| [REQ-2706](REQ-2706-explanation-daily-count.md) | The game MUST generate at most 20 live explanations a day. | approved |
| [REQ-2708](REQ-2708-art-run-budget.md) | An offline art run MUST stop at the art budget, which starts at $40. | approved |
| [REQ-2710](REQ-2710-bakeoff-budget.md) | The model bake-off MUST stop at the bake-off budget, which starts at $25. | approved |
| [REQ-2712](REQ-2712-live-art-budget-after-mvp.md) | Once AI-made items and creatures arrive after the MVP, an adventure's spend on live art MUST stop at the live art budget, which starts at $0.5. | approved |
| [REQ-2714](REQ-2714-adventure-budget-fallback.md) | When the adventure budget runs out, the game MUST continue on the scene library and the fallback pools, with no live frames, at the story's usual pace. | approved |
| [REQ-2716](REQ-2716-explanation-budget-fallback.md) | When the explanation budget runs out, a guiding thread spent on an explanation MUST still produce one, from the cache or the template. | approved |
| [REQ-2718](REQ-2718-play-key-monthly-limit.md) | The play key MUST carry a spending limit of $60 that resets each month. | approved |
| [REQ-2720](REQ-2720-monthly-limit-fallback.md) | When the month's play spend reaches $60, by the game's own count or because the service refuses a call for the limit, every session until the end of the month MUST use the fallbacks. | approved |
| [REQ-2722](REQ-2722-monthly-limit-notice.md) | When the month's play spend has reached its limit, the Parent Room MUST show the parent a notice. | approved |
| [REQ-2724](REQ-2724-judge-on-play-key.md) | The judge model's calls during play MUST go on the play key and count inside its monthly limit. | approved |
| [REQ-2726](REQ-2726-no-unchecked-text-when-budget-out.md) | When a budget runs out, the game MUST NOT show any text that has not passed a safety check. | approved |
| [REQ-2728](REQ-2728-offline-runs-separate-key.md) | Offline runs MUST spend from a key other than the play key. | approved |
| [REQ-2730](REQ-2730-offline-key-limit.md) | The key for an offline run MUST carry a spending limit equal to that run's budget. | approved |
| [REQ-2732](REQ-2732-hosted-judge-on-play-key.md) | Every call to a hosted judge model during play MUST go on the play key, so that it counts inside the key's monthly limit. | draft |
| [REQ-2800](REQ-2800-floor-assets-use-floor-palette.md) | Every art asset that belongs to a floor MUST use that floor's palette. | approved |
| [REQ-2802](REQ-2802-character-sheet-contents.md) | Each character MUST have a character sheet that shows the character from the front and the side and with 3 to 4 emotions. | approved |
| [REQ-2804](REQ-2804-character-sheet-comes-first.md) | An asset of a character other than its character sheet MUST NOT be generated before that sheet exists. | approved |
| [REQ-2806](REQ-2806-asset-catalogue-entry.md) | Every art asset MUST have a catalogue entry that gives its id, its description, its size, whether it needs a transparent background, and its references. | approved |
| [REQ-2808](REQ-2808-transparent-assets-clean-edges.md) | Every asset that needs a transparent background MUST ship with one that keeps no trace of the colour it was generated on. | approved |
| [REQ-2810](REQ-2810-no-cutout-without-part-masks.md) | A character MUST NOT be animated by moving separate parts of its picture until a person has approved that character's part masks. | approved |
| [REQ-2812](REQ-2812-emotions-are-separate-pictures.md) | Each emotion of a character MUST be shown as a separate picture. | approved |
| [REQ-2814](REQ-2814-dreamcore-asset-minimum-level.md) | Each dreamcore asset MUST carry a minimum creepiness level. | approved |
| [REQ-2816](REQ-2816-asset-within-creepiness-level.md) | The game MUST NOT show an asset whose minimum creepiness level is above the level the parent set. | approved |
| [REQ-2818](REQ-2818-cosy-background-at-level-zero.md) | When the parent has set creepiness level 0, the game MUST show the «уютный» (cosy) variant of a background that has a dreamcore variant. | approved |
| [REQ-2820](REQ-2820-every-asset-scored.md) | Every generated art variant MUST get a score from 1 to 10 against the art checklist. | approved |
| [REQ-2822](REQ-2822-low-score-never-used.md) | A variant scored below 7 MUST NOT be offered for choice or used in the game. | approved |
| [REQ-2824](REQ-2824-interrupted-run-resumes.md) | When an offline art run is interrupted, the next run MUST continue from where it stopped without generating again the assets already done. | approved |
| [REQ-2826](REQ-2826-art-run-stops-at-budget.md) | An offline art run MUST start no new generation once the cost the provider reported for that run reaches the run's budget. | approved |
| [REQ-2828](REQ-2828-person-chooses-final-variant.md) | A person MUST choose the final variant of each asset before the asset ships. | approved |
| [REQ-2830](REQ-2830-choice-from-four-scored-variants.md) | The Parent Room MUST offer each asset as 4 variants, each shown with its checklist score. | approved |
| [REQ-2832](REQ-2832-art-fallback-chain.md) | When an asset has no chosen variant, the game MUST show its draft, or a placeholder where no draft exists either. | approved |
| [REQ-2834](REQ-2834-reject-adult-presentation.md) | An art variant with adult presentation, a maid uniform, a suggestive pose or an adult body MUST be rejected, whatever its score. | approved |
| [REQ-2836](REQ-2836-mvp-no-art-during-play.md) | The MVP MUST NOT generate any picture during play. | approved |
| [REQ-2838](REQ-2838-model-check-finds-image-models.md) | The art tool's model check MUST NOT report a configured image model as missing when the provider lists it among its image models. | approved |
| [REQ-2840](REQ-2840-no-volume-art-before-style-choice.md) | The offline art queue MUST NOT generate any asset other than the four heroine sheets until the family has shown the player the key-art pictures and the four heroine sheets and recorded her choice. | approved |
| [REQ-2900](REQ-2900-one-verify-command.md) | One command MUST run every automated check and write one report of all the results. | approved |
| [REQ-2902](REQ-2902-templates-match-reference-solver.md) | For each task template, the engine's answers on 10,000 seeds MUST equal those of a reference solver written independently of the template. | approved |
| [REQ-2904](REQ-2904-templates-no-unfilled-placeholders.md) | A task generated from any template on any of 10,000 seeds MUST NOT contain an unfilled placeholder. | approved |
| [REQ-2906](REQ-2906-templates-declensions-agree.md) | In every task generated from any template on 10,000 seeds, each noun MUST agree in form with the number before it. | approved |
| [REQ-2908](REQ-2908-simulation-node-identification.md) | A simulation of synthetic student profiles MUST classify at least 90 % of nodes correctly on every profile. | approved |
| [REQ-2910](REQ-2910-thirty-day-estimates-converge.md) | In a 30-day simulation, each node's estimate MUST converge towards the synthetic profile's true state. | approved |
| [REQ-2912](REQ-2912-adventure-yields-attempts-at-threshold.md) | A simulated adventure of 60 minutes MUST yield at least 28 scored first attempts when answer times equal 1.0 times the fluency threshold. | approved |
| [REQ-2914](REQ-2914-adventure-yields-attempts-when-slow.md) | A simulated adventure of 60 minutes MUST yield at least 25 scored first attempts when answer times equal 1.5 times the fluency threshold. | approved |
| [REQ-2916](REQ-2916-session-success-share-range.md) | On mixed profiles after the cold start, each session's success share MUST stay between 0.65 and 0.85. | approved |
| [REQ-2918](REQ-2918-session-success-share-mean.md) | On mixed profiles after the cold start, the mean session success share MUST lie between 0.70 and 0.80. | approved |
| [REQ-2920](REQ-2920-knows-accuracy-after-thirty-days.md) | After 30 simulated days, the knowledge model MUST tell "knows" from "doesn't know" with at least 90 % accuracy. | approved |
| [REQ-2922](REQ-2922-model-accuracy-no-regression.md) | A new version of the knowledge model MUST NOT score lower than the version before it on any accuracy metric of the simulation. | approved |
| [REQ-2924](REQ-2924-replay-determinism.md) | Given the same seeds, times and verdicts, the game MUST produce the same outcomes, branches, states, awards, chests, reward queue and chapter finale. | approved |
| [REQ-2926](REQ-2926-export-row-count-matches.md) | The row count of every export MUST match the number of matching records in the event log. | approved |
| [REQ-2928](REQ-2928-field-dictionary-complete.md) | The field dictionary MUST describe every column of every export. | approved |
| [REQ-2930](REQ-2930-exports-open-in-analysis-tools.md) | Every export in JSONL, CSV and Parquet MUST open without error in DuckDB and in pandas. | approved |
| [REQ-2932](REQ-2932-live-frame-discard-share.md) | With live model calls, the share of live frames discarded MUST NOT exceed 30 %. | approved |
| [REQ-2934](REQ-2934-room-branches-ready.md) | With live model calls, both room branches MUST be ready before the room ends in at least 95 % of rooms. | approved |
| [REQ-2936](REQ-2936-real-ipad-checklist.md) | From stage 0 on, every stage MUST be checked on a real iPad by an adult following a checklist. | approved |
| [REQ-2938](REQ-2938-agent-defers-key-decisions.md) | The building agent MUST leave every decision that changes the method, the budget or the child's safety to a person. | approved |
| [REQ-2940](REQ-2940-run-ends-with-handoff.md) | Every run of the building agent MUST end with a handoff listing what waits for a person and the run's spend on the external model service. | approved |
| [REQ-2942](REQ-2942-decisions-as-draft-records.md) | The building agent MUST record every decision that reaches past one task as a draft decision record in the project record. | approved |
| [REQ-2944](REQ-2944-questions-in-owning-record.md) | The building agent MUST record every open question on method, budget or safety in the record it concerns. | approved |
| [REQ-2946](REQ-2946-nothing-built-on-unapproved.md) | The building agent MUST NOT build on a draft decision record or an open question until the owner approves it. | approved |
| [REQ-2948](REQ-2948-no-decision-log-outside-record.md) | The building agent MUST NOT keep a log of decisions or questions outside the project record. | approved |
| [REQ-2950](REQ-2950-checks-run-without-live-judge.md) | The automated checks MUST run with no live call to the judge model. | approved |
| [REQ-2952](REQ-2952-no-shame-check-uses-play-model.md) | The no-shame check in the automated checks MUST use the model that play uses for the same check. | approved |
| [REQ-3000](REQ-3000-ipad-spike-comes-first.md) | The spike on a real iPad MUST be finished before work on any other stage begins. | approved |
| [REQ-3002](REQ-3002-spike-proves-ipad-input.md) | The spike MUST show on a real iPad that the maths keyboard enters fractions and that sound, dictation and the home-screen icon work. | approved |
| [REQ-3004](REQ-3004-spike-loses-no-answers-offline.md) | When a real iPad loses Wi-Fi for 30 seconds during the spike, the game MUST lose 0 of the answers given in that time. | approved |
| [REQ-3006](REQ-3006-core-before-game-shell.md) | The diagnostic core MUST pass its checks before work on the game shell begins. | approved |
| [REQ-3008](REQ-3008-stage-waits-for-previous-acceptance.md) | A stage MUST NOT begin until the stage before it has passed its automatic check and its human acceptance. | approved |
| [REQ-3010](REQ-3010-stage-two-adult-plays-an-hour.md) | The human acceptance of stage 0.2 MUST include an adult playing through an adventure of about 60 minutes. | approved |
| [REQ-3012](REQ-3012-mvp-accepted-after-two-weeks.md) | The MVP MUST be accepted only after two weeks of daily play in which the player wants to come back, spends guiding threads without fear and isn't upset by the other path. | approved |
| [REQ-3014](REQ-3014-mvp-fast-guesses-below-fifteen.md) | Over the two weeks of MVP acceptance play, fast guesses MUST stay below 15 % of the player's scored first attempts. | approved |
| [REQ-3016](REQ-3016-backlog-one-item-at-a-time.md) | After the MVP, work MUST NOT start on a backlog item until the backlog item before it has been accepted. | approved |
| [REQ-3018](REQ-3018-backlog-item-accepted-after-week.md) | A backlog item MUST be accepted only after a week of play in which the player shows no loss of interest. | approved |
| [REQ-3020](REQ-3020-open-questions-settled-before-build.md) | Each of the nine open questions in the draft MUST be answered or deferred on the record before the part of the game it affects is built. | approved |
| [REQ-3100](REQ-3100-interface-text-off-art-palette.md) | Interface text MUST NOT take its colour from the art palette or from a location's palette. | approved |
| [REQ-3102](REQ-3102-theme-choice-at-any-time.md) | The player's settings MUST let the player switch between the light and the dark theme at any time. | approved |
| [REQ-3104](REQ-3104-palette-choice-at-any-time.md) | The player's settings MUST let the player choose any of the four preset palettes or a custom palette at any time. | approved |
| [REQ-3106](REQ-3106-no-lock-on-themes-palettes.md) | The game MUST NOT lock any theme or palette behind progress or ask any price for it. | approved |
| [REQ-3108](REQ-3108-dreamcore-theme-not-offered.md) | The player's settings MUST NOT offer the dreamcore theme as a choice. | approved |
| [REQ-3110](REQ-3110-looks-restored-on-every-device.md) | When the player opens the game on any paired device, the game MUST show the theme, palette and custom colours she last chose. | approved |
| [REQ-3112](REQ-3112-text-contrast-4-5.md) | Every text on screen MUST reach a contrast of at least 4.5:1 against the ground or fill behind it, in every theme, preset palette and custom palette. | approved |
| [REQ-3114](REQ-3114-focus-ring-contrast-3.md) | The keyboard focus indicator MUST reach a contrast of at least 3:1 against every surface it appears on, in every theme, preset palette and custom palette. | approved |
| [REQ-3116](REQ-3116-outline-contrast-3.md) | Every outline that marks the edge of a control or panel MUST reach a contrast of at least 3:1 against each surface it sits on, in every theme, preset palette and custom palette. | approved |
| [REQ-3118](REQ-3118-no-red-for-bad.md) | The player's screens MUST NOT use red to mark a wrong answer or a poor result. | approved |
| [REQ-3120](REQ-3120-long-text-column-width.md) | A column of long text MUST be no wider than 68 characters. | approved |
| [REQ-3122](REQ-3122-long-text-on-solid-ground.md) | Long text MUST sit on a solid, opaque surface, and never over a picture or on a translucent panel. | approved |
| [REQ-3124](REQ-3124-minimum-text-size.md) | Text on any screen MUST NOT be smaller than 13 CSS pixels. | approved |
| [REQ-3126](REQ-3126-story-text-size.md) | Story text MUST be at least 20 CSS pixels high in the normal text size. | approved |
| [REQ-3128](REQ-3128-task-text-size.md) | Task text MUST be at least 24 CSS pixels high in the normal text size. | approved |
| [REQ-3130](REQ-3130-large-story-text-size.md) | When the player turns on large text, story text MUST be at least 24 CSS pixels high. | approved |
| [REQ-3132](REQ-3132-large-task-text-size.md) | When the player turns on large text, task text MUST be at least 28 CSS pixels high. | approved |
| [REQ-3134](REQ-3134-fonts-cover-cyrillic.md) | Every font the game uses MUST draw the whole Russian alphabet, «ё» included, without falling back to another font. | approved |
| [REQ-3136](REQ-3136-equal-width-digits.md) | Digits in answers, keypad keys and counters MUST all have the same width. | approved |
| [REQ-3138](REQ-3138-no-black-or-grey-shadows.md) | Shadows in the interface MUST NOT be black or neutral grey. | approved |
| [REQ-3140](REQ-3140-element-colour-fixed.md) | Each element's colour MUST stay the same in every palette. | approved |
| [REQ-3142](REQ-3142-parent-state-colours-fixed.md) | The colours of skill states in the Parent Room MUST NOT change with the player's palette. | approved |
| [REQ-3144](REQ-3144-no-emoji.md) | The interface MUST NOT use emoji for icons or labels. | approved |
| [REQ-3146](REQ-3146-no-fast-flashing.md) | The game MUST NOT show anything that flashes more than three times in any one second. | approved |
| [REQ-3148](REQ-3148-no-sudden-loud-sound.md) | The game MUST NOT play a sudden loud sound. | approved |
| [REQ-3200](REQ-3200-no-tick-or-cross.md) | The player's screens MUST NOT show a tick or a cross to mark an answer or a result. | approved |
| [REQ-3202](REQ-3202-system-window-announced.md) | When a System window appears, a screen reader MUST announce it without interrupting what it is reading. | approved |
| [REQ-3204](REQ-3204-keypad-key-size.md) | Every key of the maths keypad MUST be at least 64 CSS pixels in both directions. | approved |
| [REQ-3206](REQ-3206-keypad-on-the-right.md) | On the tablet the maths keypad MUST sit on the right side of the screen, under the player's thumb. | approved |
| [REQ-3208](REQ-3208-keypad-fixed-layout.md) | Each key of the maths keypad MUST keep the same position in every task, and a key a task doesn't use leaves its cell empty. | approved |
| [REQ-3210](REQ-3210-physical-keyboard-answers.md) | When a physical keyboard is attached, the answer field MUST accept typed digits and signs as the on-screen keypad would. | approved |
| [REQ-3212](REQ-3212-options-not-coloured.md) | After a multiple-choice answer, the game MUST NOT colour any option as right or wrong. | approved |
| [REQ-3214](REQ-3214-outcome-icon-and-word.md) | Every outcome MUST show an icon and a word together. | approved |
| [REQ-3216](REQ-3216-scheme-shows-her-answer.md) | The knot scheme MUST show the player's own answer beside the steps the code builds. | approved |
| [REQ-3218](REQ-3218-xp-bar-no-daily-progress.md) | The experience bar MUST NOT show progress through the day. | approved |
| [REQ-3220](REQ-3220-element-shown-whole.md) | An element MUST always appear with its colour, its icon and its name together. | approved |
| [REQ-3222](REQ-3222-element-shows-her-name.md) | When the player has given an element her own name, every place that shows the element MUST show her name in place of the default one. | approved |
| [REQ-3224](REQ-3224-counters-named-to-readers.md) | Every resource counter MUST name its resource to a screen reader. | approved |
| [REQ-3226](REQ-3226-chest-quality-in-words.md) | Each reward in a chest MUST state its quality in words. | approved |
| [REQ-3228](REQ-3228-unmet-creature-name-hidden.md) | A creature the player hasn't met MUST show «???» in place of its name. | approved |
| [REQ-3230](REQ-3230-story-lines-announced.md) | When a new line appears in the story log, a screen reader MUST announce it without interrupting what it is reading. | approved |
| [REQ-3232](REQ-3232-story-speakers-distinct.md) | The story log MUST give the narrator, characters, familiars, the heroine, the Diary and System windows each a look of its own. | approved |
| [REQ-3234](REQ-3234-story-voice-input.md) | The story input MUST offer voice input beside the text field. | approved |
| [REQ-3236](REQ-3236-keys-pick-suggestion.md) | When the player presses 1, 2 or 3 on a physical keyboard while the story input's text field is empty, the game MUST pick the matching suggestion. | approved |
| [REQ-3238](REQ-3238-keys-select-option.md) | When the player presses 1, 2, 3 or 4 on a physical keyboard during a multiple-choice task, the game MUST select the matching option. | approved |
| [REQ-3240](REQ-3240-quests-never-failed.md) | The game MUST NOT mark an unfinished quest as failed. | approved |
| [REQ-3242](REQ-3242-palette-choice-preview.md) | Each palette on offer MUST preview its own colours in the current theme. | approved |
| [REQ-3244](REQ-3244-custom-colour-any-pick.md) | Each colour role of a custom palette MUST accept any colour the player picks, from the offered swatches or from the device's colour picker. | approved |
| [REQ-3246](REQ-3246-task-window-follows-looks.md) | The task window MUST follow the player's chosen theme and palette. | approved |
| [REQ-3300](REQ-3300-system-lines-short-formal.md) | Every System line MUST be short, formal and in the present tense. | approved |
| [REQ-3302](REQ-3302-system-no-exclamation.md) | A System line MUST NOT contain an exclamation mark. | approved |
| [REQ-3304](REQ-3304-self-correction-separate.md) | When the System corrects itself, the correction MUST appear as a line of its own after a pause. | approved |
| [REQ-3306](REQ-3306-system-marks-events.md) | A System line MUST describe an event in the world, and never the heroine's mind or abilities. | approved |
| [REQ-3308](REQ-3308-system-numbers-from-code.md) | Every number in a System window MUST come from a field the code fills, and never from the text of the line. | approved |
| [REQ-3310](REQ-3310-world-labels.md) | The interface MUST use the world's labels: «Схема узла» (the knot scheme) and «Как легла нить» (how the thread lay) for the review, «Твоё заклинание» (your spell) for her answer, «Готово» (Done), «Не знаю» (I don't know) and «Путеводная нить» (guiding thread) for the task buttons, «Распутан начисто» (untangled cleanly), «Почти чисто» (nearly clean), «Узел ослаблен» (the knot is loosened) and «Принято» (accepted) for outcomes, «Привал» (rest stop), «Сохранить и уйти» (Save and leave) and «Ещё один ряд» (One more row) for leaving, and «Дней в Башне» (Days in the Tower) for the day counter. | approved |
| [REQ-3312](REQ-3312-no-rejected-labels.md) | An interface label MUST NOT read «Правильный ответ» (the correct answer), «Решение» (the solution), «Твой ответ» (your answer), «Проверить» (Check), «Подсказка» (Hint), «Сдаться» (Give up), «Верно» (correct), «Выйти» (Exit), «Пауза» (Pause), «Осталось N минут» (N minutes left), «Серия» (Streak) or «Дней подряд» (Days in a row). | approved |
| [REQ-3314](REQ-3314-forbidden-list.md) | Text the heroine sees MUST NOT contain, in any inflected form, «неправильно», «неверно», «ошибка», «ошиблась», «промах», «мимо», «провал», «жаль», «не получилось», «не смогла», «плохо», «неудача», «ты не поняла», «это же просто», «задача», «пример», «урок», «школа», «оценка», «умница», «гений», «ты умная» or «ты самая умная»; only her own words shown back as she wrote them and the Parent Room are exempt. | approved |
| [REQ-3316](REQ-3316-no-guilt-phrases.md) | Text the heroine sees MUST NOT contain a phrase of guilt or attachment, such as «я скучал, почему ты не приходила» (I missed you, why didn't you come) or «Ты нас подвела» (You let us down). | approved |
| [REQ-3318](REQ-3318-jokes-never-at-heroine.md) | A joke in the game's text MUST target the world, the System, the Tangles or the Guardians, and never the heroine. | approved |
| [REQ-3320](REQ-3320-knot-never-uzelok.md) | Text the heroine sees MUST NOT call a knot «узелок». | approved |
| [REQ-3322](REQ-3322-thread-button-label.md) | The guiding thread button MUST read «Путеводная нить · N» (guiding thread · N), with N the current thread count filled by code. | approved |
| [REQ-3324](REQ-3324-no-running-out-of-threads.md) | Text the heroine sees MUST NOT tell her that she has run out of guiding threads. | approved |
| [REQ-3326](REQ-3326-forbidden-check-every-source.md) | Every line the heroine sees MUST pass an automatic check against the forbidden list before she sees it, whether the line comes from the Master, the line pool, the Explainer, a task template or the interface. | approved |
| [REQ-3328](REQ-3328-one-forbidden-list.md) | Every forbidden-list check MUST read the same single list, so a word added once is blocked in every kind of text. | approved |
| [REQ-3330](REQ-3330-ally-named-bantik.md) | From the autumn chapter's finale on, every text MUST name the ally Mister Knot becomes «Бантик» (Little Bow), and never «Узелок» (Little Knot). | approved |
| [REQ-3400](REQ-3400-one-art-style.md) | Every picture in the game MUST follow one style: soft pastel patisserie anime in the manner of a visual novel, with a thin warm brown line. | approved |
| [REQ-3402](REQ-3402-no-pure-black-in-art.md) | Pictures in the game MUST NOT use pure black, in lines or in fills. | approved |
| [REQ-3404](REQ-3404-heroine-matches-sheet.md) | Every picture of the heroine MUST show her as a catgirl matching the character sheet the family chose, or keyart-heroine until the family has chosen. | approved |
| [REQ-3406](REQ-3406-cloak-colour-tints-cardigan.md) | The cloak colour the player chooses MUST tint only the heroine's cardigan and bows. | approved |
| [REQ-3408](REQ-3408-child-proportions-covered.md) | Every character MUST be drawn with child proportions and covered clothes: shoulders covered, hems at the knee or longer, no maid costume and no suggestive pose. | approved |
| [REQ-3410](REQ-3410-creatures-round-plush.md) | Familiars, Tangles and Guardians MUST be drawn round and plush, with a silhouette that reads at first glance. | approved |
| [REQ-3412](REQ-3412-no-text-in-art.md) | Art assets MUST NOT contain text in any language. | approved |
| [REQ-3414](REQ-3414-icon-drawing-style.md) | Every icon and element symbol MUST be the game's own flat drawing, with a warm brown outline, pastel fills and a white highlight. | approved |
| [REQ-3416](REQ-3416-cloak-is-the-cardigan.md) | «Плащ охотницы» (the huntress's cloak) MUST be drawn as the heroine's hooded cable-knit cardigan, with knitted ears on the hood and a heart patch on the sleeve, and never as a second garment over it. | approved |
| [REQ-3418](REQ-3418-pugovka-look.md) | «Пуговка» (Little Button) MUST be drawn honey-coloured, with four holes that spill sparks. | approved |
| [REQ-3420](REQ-3420-no-grey-mouse.md) | Pictures of the heroine MUST NOT show a grey mouse in her backpack. | approved |
| [REQ-3422](REQ-3422-heroine-sheets-vary-little.md) | The four heroine character sheets MUST differ only in hair colour and style, eye colour and the cardigan's colour, and keep the catgirl ears and tail, the cardigan and the dress silhouette the same. | approved |
| [REQ-3500](REQ-3500-story-text-at-centre.md) | Every story screen MUST give its centre to the story log and the input line, with the scene picture in a side column. | approved |
| [REQ-3502](REQ-3502-scene-picture-no-buttons.md) | The scene picture on a story screen MUST hold no buttons. | approved |
| [REQ-3504](REQ-3504-save-and-leave-visible.md) | Every story screen MUST show «Сохранить и уйти» (Save and leave). | approved |
| [REQ-3506](REQ-3506-settings-visible.md) | Every story screen MUST show the way into the player's settings. | approved |
| [REQ-3508](REQ-3508-task-window-no-animation.md) | The task window MUST NOT animate anything. | approved |
| [REQ-3510](REQ-3510-thread-button-beside-done.md) | The task window MUST place the guiding thread button beside «Готово» (Done). | approved |
| [REQ-3512](REQ-3512-guardian-starts-with-model.md) | When a Guardian sets a word problem, the problem MUST open with a choice of one short model from four before the step-by-step input. | approved |
| [REQ-3514](REQ-3514-underside-scared-button.md) | Every Underside screen MUST show the «Мне страшно» (I'm scared) button. | approved |
| [REQ-3516](REQ-3516-underside-shows-light.md) | Every Underside screen MUST show a light. | approved |
| [REQ-3518](REQ-3518-test-mode-leaves-record.md) | Play in the parent's test mode MUST NOT change the player's record, except for the parent's notes and ambiguous-task marks. | approved |
| [REQ-3520](REQ-3520-test-mode-marked.md) | Every test-mode screen MUST show a frame and a label that mark it as test mode. | approved |
| [REQ-3522](REQ-3522-text-size-choice.md) | The player's settings MUST let the player choose normal or large text at any time. | approved |
| [REQ-3524](REQ-3524-sound-choice.md) | The player's settings MUST let the player turn sound on or off at any time. | approved |
| [REQ-3526](REQ-3526-creepiness-heading.md) | The parent's creepiness setting MUST carry the heading «Уровень жуткости» (Creepiness level). | approved |
| [REQ-3528](REQ-3528-awakening-closing-line.md) | The Awakening's closing System line MUST read «Пробуждение завершено. Добро пожаловать в Башню.» (Awakening complete. Welcome to the Tower.) | approved |
| [REQ-3530](REQ-3530-awakening-rank-badge.md) | At the Awakening's closing line, the rank badge beside the System window MUST show rank E. | approved |
| [REQ-3532](REQ-3532-hatch-no-move-name.md) | The hatching screen MUST NOT suggest a move's name as a familiar's name. | approved |
| [REQ-3534](REQ-3534-hatch-no-used-name.md) | The hatching screen MUST NOT suggest a name already in use in the player's game. | approved |
| [REQ-3600](REQ-3600-llm-text-safety-check.md) | Every text a language model writes MUST pass the automatic safety check before the player sees it. | approved |
| [REQ-3602](REQ-3602-task-text-placeholder-frames-only.md) | Language-model text MUST enter a task's text only as a story frame whose numbers are placeholders that code fills. | approved |
| [REQ-3604](REQ-3604-library-frames-for-probes-guardian-fallback.md) | Probes, the Guardian ladder (лестница Стражей) and fallback cases MUST take their story frames from the approved frame library. | approved |
| [REQ-3606](REQ-3606-library-five-frames-per-structure.md) | The frame library MUST hold at least 5 frames for every word-problem structure by stage 0.2. | approved |
| [REQ-3608](REQ-3608-library-twenty-frames-per-structure.md) | The frame library MUST hold at least 20 frames for every word-problem structure by stage 0.4. | approved |
| [REQ-3610](REQ-3610-frame-no-repeat-fortnight.md) | The game MUST NOT show the player a story frame it showed her in the last 14 days while the structure has a frame it hasn't. | approved |
| [REQ-3612](REQ-3612-frame-repeat-longest-ago.md) | When a structure has no story frame left unshown for 14 days, the game MUST use the frame it showed longest ago. | approved |
| [REQ-3614](REQ-3614-frame-repeat-logged.md) | When the game shows a story frame again within 14 days, the event log MUST mark the repeat. | approved |
| [REQ-3616](REQ-3616-live-frames-top-up-only.md) | The game MUST NOT use a live story frame except for a task added to complete a node's full block. | approved |
| [REQ-3618](REQ-3618-live-frame-queue-ahead.md) | While live generation is on, the game MUST hold checked live frames for the next 2 to 3 rooms before the player reaches them. | approved |
| [REQ-3620](REQ-3620-frame-request-specification.md) | Every request for a story frame MUST give the author model the problem's steps, the role of each number, the floor, the characters in the scene and the limits on length and vocabulary. | approved |
| [REQ-3622](REQ-3622-frame-variants-per-request.md) | Every request for a story frame MUST ask the author model for 5 variants. | approved |
| [REQ-3624](REQ-3624-frame-reply-schema.md) | The game MUST discard a frame author's reply that doesn't conform to the fixed reply schema. | approved |
| [REQ-3626](REQ-3626-frame-placeholders-exactly-once.md) | The game MUST reject a story frame in which any placeholder is missing or appears more than once. | approved |
| [REQ-3628](REQ-3628-frame-no-other-numbers.md) | The game MUST reject a story frame that holds any number besides its placeholders, in digits or in words, such as «два» (two), «половина» (half) or «дюжина» (dozen). | approved |
| [REQ-3630](REQ-3630-frame-three-blind-solves.md) | The game MUST accept a story frame only when a checking model, solving it blind with each of three sets of numbers, gets the engine's answer all three times. | approved |
| [REQ-3632](REQ-3632-live-frame-final-blind-solve.md) | A live story frame MUST pass one more blind solve with the task's actual numbers before the player sees it. | approved |
| [REQ-3634](REQ-3634-blind-solver-sees-no-answer.md) | The blind solve of a story frame MUST NOT show the checking model the engine's answer or any list of candidate answers. | approved |
| [REQ-3636](REQ-3636-offline-frame-review-actions.md) | The Parent Room MUST let the parent accept, reject or edit each offline story frame in the review queue. | approved |
| [REQ-3638](REQ-3638-library-holds-accepted-frames.md) | The frame library MUST hold only frames the parent accepted, as written or as edited. | approved |
| [REQ-3640](REQ-3640-live-generation-off-on-high-rejection.md) | When more than 30% of the live frames checked on a game day are rejected, the game MUST stop generating live frames until the day ends and take frames from the library. | approved |
| [REQ-3642](REQ-3642-live-frames-kept-with-status.md) | The game MUST keep every live story frame with its check status. | approved |
| [REQ-3644](REQ-3644-live-frame-to-library.md) | The Parent Room MUST let the parent move a live story frame into the frame library with one action. | approved |
| [REQ-3646](REQ-3646-llm-calls-recorded.md) | The game MUST record every language-model request and its response. | approved |
| [REQ-3648](REQ-3648-science-from-bank-only.md) | Natural science questions MUST come only from the hand-made science bank. | superseded |
| [REQ-3650](REQ-3650-science-parent-approval.md) | A natural science question MUST reach the player only after the parent approves that question. | approved |
| [REQ-3652](REQ-3652-science-repeat-window-small-bank.md) | Before stage 0.5, the game MUST NOT repeat a natural science question within 45 days while its topic has a question not shown in that time. | approved |
| [REQ-3654](REQ-3654-science-repeat-window-large-bank.md) | From stage 0.5, the game MUST NOT repeat a natural science question within 90 days while its topic has a question not shown in that time. | approved |
| [REQ-3656](REQ-3656-science-repeat-longest-ago.md) | When a topic has no fresh natural science question, the game MUST use the question it showed longest ago. | approved |
| [REQ-3658](REQ-3658-science-repeat-logged.md) | When the game repeats a natural science question within its no-repeat window, the event log MUST mark the repeat. | approved |
| [REQ-3660](REQ-3660-science-only-from-approved-bank.md) | Natural science questions MUST come only from the science bank, never from text generated during play. | approved |
| [REQ-3700](REQ-3700-first-version-includes-mvp-parts.md) | The first version MUST include every part of the MVP contents list: levels and experience with daily quests; chests with a choice of 1 from 3, the forge and the buttons-only shop; the MVP familiar roster with friendship and evolution; the Master's story with success and other-path branches, floor states, Diary pages, names the player gives, free text and light dreamcore; the single mode with guiding threads, explanations, the event log and knowledge model v1; and, for the parent, lesson marks, report v1 and the raw data export. | approved |
| [REQ-3702](REQ-3702-first-version-excludes-deferred-items.md) | The first version MUST NOT contain any item the draft defers until after the MVP: Ascents and anchor forms; story battles between familiars and the ring of elements; items and familiars made by AI, and live pictures; Diary ciphers; the free mode «Свободная прогулка» (Free Walk); characteristics, paths and story ranks by the calendar; room decor; the Dutch layer; and the full roster of familiars with the full set of dreamcore. | approved |
| [REQ-3704](REQ-3704-player-facing-text-in-russian.md) | Every text and task the player sees in the first version MUST be in Russian. | approved |
| [REQ-3706](REQ-3706-game-teaches-no-new-topics.md) | The game MUST NOT offer lessons that teach a new maths topic. | approved |
| [REQ-3708](REQ-3708-canon-agrees-with-specification.md) | The canon MUST NOT contradict the specification on method, time, rewards or safety. | approved |
| [REQ-3710](REQ-3710-parent-sets-age-and-group.md) | The Parent Room MUST let the parent set the player's real name, age and school group, and change each at any time. | approved |
| [REQ-3712](REQ-3712-rules-read-configured-age-and-group.md) | Every rule that depends on the player's real name, age or school group MUST read the values the parent set, never a value fixed in the code, the content or a tracked file. | approved |
| [REQ-3714](REQ-3714-game-named-meowtower.md) | The game, its repository and its technical names MUST carry the name Meowtower («Мяубашня» in the player's language). | approved |
| [REQ-3800](REQ-3800-event-identity-and-order.md) | Every event MUST carry a unique identifier, a sequence number that places it in one increasing order over the whole log, its event type and the version of its payload schema. | approved |
| [REQ-3802](REQ-3802-derived-data-records-versions.md) | Every derived table and snapshot MUST record the model, threshold and graph versions it was computed with, the sequence number of the last event it took into account and the time it was computed. | approved |
| [REQ-3804](REQ-3804-shown-task-records-answer.md) | When the game shows a task, the event log MUST record its correct answer and its short solution as they would be shown. | approved |
| [REQ-3808](REQ-3808-task-parameters-language-free.md) | A task's parameters MUST NOT depend on the display language. | approved |
| [REQ-3810](REQ-3810-strings-in-language-files.md) | Every player-facing string MUST come from a per-language file outside the code. | approved |
| [REQ-3812](REQ-3812-graph-overlay-keeps-base-graph.md) | A curriculum overlay on the skill graph MUST add nodes and links without changing any node or link of the base graph. | approved |
| [REQ-3814](REQ-3814-report-keeps-layers-apart.md) | The report MUST NOT mix results from different graph layers unless the parent chooses to mix them. | approved |
| [REQ-3816](REQ-3816-explanation-cache-holds-no-fact.md) | Emptying the explanation cache MUST lose no fact about play. | approved |
| [REQ-3910](REQ-3910-judge-answers-only-the-mac.md) | A judge model running on the parent's Mac MUST give no model answer to a request from any device other than that Mac. | draft |
| [REQ-3912](REQ-3912-judge-answer-carries-probabilities.md) | The server MUST treat a local judge's answer to a check as an error unless it names one of the check's fixed answers and gives a probability, between 0 and 1, for each of them. | draft |
| [REQ-3914](REQ-3914-local-judge-meets-timeout.md) | A check MUST move to a judge model on the Mac only after that judge answers the check's test set on the family Mac, with the check's fixed prompt already cached and as many checks running at once as the game sends in one turn, within the judge timeout ADR-0100 sets, now 1500 ms, at the 95th percentile, measured at the gateway. | draft |
| [REQ-3916](REQ-3916-judge-chosen-per-check.md) | Among the models on the Mac that pass a judge check's agreement test (REQ-1688) and latency test (REQ-3914), the one with the highest agreement with the reference model MUST answer the check; models within one percentage point of each other tie, and a tie goes to the model that answers the most checks, then to the smaller model. | draft |
| [REQ-3918](REQ-3918-judge-supports-russian.md) | A model on the Mac whose model card lists its supported languages without Russian MUST NOT answer a judge check. | draft |
| [REQ-3920](REQ-3920-changed-judge-retested.md) | When the model file a judge on the Mac serves has a different hash from the one a check passed on, the server MUST NOT send that judge the check until the check's agreement test (REQ-1688) and latency test (REQ-3914) have passed on the file it serves. | draft |
| [REQ-3922](REQ-3922-startup-confirms-local-judge.md) | When the server starts, it MUST confirm that each judge on the Mac answers, and read the hash of the model file it serves, before it sends that judge a check. | draft |
| [REQ-3924](REQ-3924-unpassed-check-stays-hosted.md) | A judge check for which no model on the Mac passes both its agreement test (REQ-1688) and its latency test (REQ-3914) MUST stay with the hosted judge if that judge passed the check's test set, and otherwise with the safety model, as the approved record places it (RES-1600, RES-3910). | draft |

By topic:

- adventure: REQ-0100, REQ-0102, REQ-0104, REQ-0106, REQ-0108, REQ-0110, REQ-0112, REQ-0114, REQ-0116, REQ-0118, REQ-0120, REQ-0122, REQ-0124, REQ-0126, REQ-0128, REQ-0130, REQ-0132, REQ-0134, REQ-0136, REQ-0138, REQ-0140, REQ-0142, REQ-0144, REQ-0146, REQ-0148
- answer-input: REQ-0700, REQ-0701, REQ-0702, REQ-0703, REQ-0704, REQ-0705, REQ-0706, REQ-0707, REQ-0708, REQ-0709, REQ-0710, REQ-0711, REQ-0712, REQ-0713, REQ-0714, REQ-0716, REQ-0718, REQ-0720, REQ-0722, REQ-0724, REQ-0726, REQ-0728, REQ-0730, REQ-0732, REQ-0734, REQ-0736, REQ-0738, REQ-0740, REQ-0742, REQ-0744, REQ-0746, REQ-0748, REQ-0750, REQ-0752, REQ-0754, REQ-0756, REQ-0758, REQ-0760, REQ-0762, REQ-0764, REQ-0766, REQ-0768, REQ-0770, REQ-0772, REQ-0774, REQ-0776, REQ-0778, REQ-0780, REQ-0782, REQ-0784, REQ-0786, REQ-0788, REQ-0790, REQ-0792, REQ-0794, REQ-0796, REQ-0798
- api: REQ-2400, REQ-2402, REQ-2404, REQ-2406, REQ-2408, REQ-2410, REQ-2412, REQ-2414, REQ-2416, REQ-2418, REQ-2420, REQ-2422, REQ-2424, REQ-2426, REQ-2428, REQ-2430, REQ-2432, REQ-2434, REQ-2436, REQ-2438, REQ-2440, REQ-2442, REQ-2444
- art: REQ-3400, REQ-3402, REQ-3404, REQ-3406, REQ-3408, REQ-3410, REQ-3412, REQ-3414, REQ-3416, REQ-3418, REQ-3420, REQ-3422
- attempts: REQ-0400, REQ-0402, REQ-0404, REQ-0406, REQ-0408, REQ-0410, REQ-0412, REQ-0414, REQ-0416, REQ-0418, REQ-0420, REQ-0422, REQ-0424, REQ-0426, REQ-0428, REQ-0430, REQ-0432
- components: REQ-3200, REQ-3202, REQ-3204, REQ-3206, REQ-3208, REQ-3210, REQ-3212, REQ-3214, REQ-3216, REQ-3218, REQ-3220, REQ-3222, REQ-3224, REQ-3226, REQ-3228, REQ-3230, REQ-3232, REQ-3234, REQ-3236, REQ-3238, REQ-3240, REQ-3242, REQ-3244, REQ-3246
- cost: REQ-2700, REQ-2702, REQ-2704, REQ-2706, REQ-2708, REQ-2710, REQ-2712, REQ-2714, REQ-2716, REQ-2718, REQ-2720, REQ-2722, REQ-2724, REQ-2726, REQ-2728, REQ-2730, REQ-2732
- data-model: REQ-3800, REQ-3802, REQ-3804, REQ-3808, REQ-3810, REQ-3812, REQ-3814, REQ-3816
- design-system: REQ-3100, REQ-3102, REQ-3104, REQ-3106, REQ-3108, REQ-3110, REQ-3112, REQ-3114, REQ-3116, REQ-3118, REQ-3120, REQ-3122, REQ-3124, REQ-3126, REQ-3128, REQ-3130, REQ-3132, REQ-3134, REQ-3136, REQ-3138, REQ-3140, REQ-3142, REQ-3144, REQ-3146, REQ-3148
- development: REQ-2900, REQ-2902, REQ-2904, REQ-2906, REQ-2908, REQ-2910, REQ-2912, REQ-2914, REQ-2916, REQ-2918, REQ-2920, REQ-2922, REQ-2924, REQ-2926, REQ-2928, REQ-2930, REQ-2932, REQ-2934, REQ-2936, REQ-2938, REQ-2940, REQ-2942, REQ-2944, REQ-2946, REQ-2948, REQ-2950, REQ-2952
- event-log: REQ-2200, REQ-2202, REQ-2204, REQ-2206, REQ-2208, REQ-2210, REQ-2212, REQ-2214, REQ-2216, REQ-2218, REQ-2220, REQ-2222, REQ-2224, REQ-2226, REQ-2228, REQ-2230, REQ-2232, REQ-2234, REQ-2236, REQ-2238, REQ-2240, REQ-2242
- explanations: REQ-0600, REQ-0602, REQ-0604, REQ-0606, REQ-0608, REQ-0610, REQ-0612, REQ-0614, REQ-0616, REQ-0618, REQ-0620, REQ-0622, REQ-0624, REQ-0626, REQ-0628, REQ-0630, REQ-0632, REQ-0634, REQ-0636, REQ-0638
- familiars: REQ-1900, REQ-1902, REQ-1904, REQ-1906, REQ-1908, REQ-1910, REQ-1912, REQ-1914, REQ-1916, REQ-1918, REQ-1920, REQ-1922, REQ-1924, REQ-1926, REQ-1928, REQ-1930, REQ-1932, REQ-1934, REQ-1936, REQ-1938, REQ-1940, REQ-1942, REQ-1944, REQ-1946, REQ-1948, REQ-1950, REQ-1952, REQ-1954
- graphics: REQ-2800, REQ-2802, REQ-2804, REQ-2806, REQ-2808, REQ-2810, REQ-2812, REQ-2814, REQ-2816, REQ-2818, REQ-2820, REQ-2822, REQ-2824, REQ-2826, REQ-2828, REQ-2830, REQ-2832, REQ-2834, REQ-2836, REQ-2838, REQ-2840
- judge: REQ-3910, REQ-3912, REQ-3914, REQ-3916, REQ-3918, REQ-3920, REQ-3922, REQ-3924
- knowledge-model: REQ-0900, REQ-0902, REQ-0904, REQ-0906, REQ-0908, REQ-0910, REQ-0912, REQ-0914, REQ-0916, REQ-0918, REQ-0920, REQ-0922, REQ-0924, REQ-0926, REQ-0928, REQ-0930, REQ-0932, REQ-0934, REQ-0936, REQ-0938, REQ-0940, REQ-0942, REQ-0944, REQ-0946, REQ-0950, REQ-0952, REQ-0954, REQ-0956, REQ-0958, REQ-0960, REQ-0962, REQ-0964, REQ-0966, REQ-0968, REQ-0970, REQ-0972, REQ-0974, REQ-0976, REQ-0978, REQ-0980, REQ-0982, REQ-0984, REQ-0986, REQ-0988, REQ-0990, REQ-0992, REQ-0994
- lessons: REQ-1400, REQ-1402, REQ-1404, REQ-1406, REQ-1408, REQ-1410, REQ-1412, REQ-1414, REQ-1416, REQ-1418, REQ-1420, REQ-1422, REQ-1424, REQ-1426
- limits: REQ-1300, REQ-1302, REQ-1304, REQ-1306, REQ-1308, REQ-1310, REQ-1312, REQ-1314, REQ-1316, REQ-1318, REQ-1320, REQ-1322, REQ-1324, REQ-1326, REQ-1328, REQ-1330, REQ-1332, REQ-1334, REQ-1336, REQ-1338, REQ-1340, REQ-1342, REQ-1344, REQ-1346, REQ-1348, REQ-1350, REQ-1352, REQ-1354, REQ-1356, REQ-1358, REQ-1360, REQ-1362, REQ-1364
- master: REQ-1600, REQ-1602, REQ-1604, REQ-1606, REQ-1608, REQ-1610, REQ-1612, REQ-1614, REQ-1616, REQ-1618, REQ-1620, REQ-1622, REQ-1624, REQ-1626, REQ-1628, REQ-1630, REQ-1632, REQ-1634, REQ-1636, REQ-1638, REQ-1640, REQ-1642, REQ-1644, REQ-1646, REQ-1648, REQ-1650, REQ-1652, REQ-1654, REQ-1656, REQ-1658, REQ-1660, REQ-1662, REQ-1664, REQ-1666, REQ-1668, REQ-1670, REQ-1672, REQ-1674, REQ-1676, REQ-1678, REQ-1680, REQ-1682, REQ-1684, REQ-1686, REQ-1688, REQ-1690, REQ-1692, REQ-1694, REQ-1696
- measurement: REQ-1100, REQ-1102, REQ-1104, REQ-1106, REQ-1108, REQ-1110, REQ-1112, REQ-1114, REQ-1116, REQ-1118, REQ-1120, REQ-1122, REQ-1124, REQ-1126, REQ-1128, REQ-1130, REQ-1132
- outcomes: REQ-1700, REQ-1702, REQ-1704, REQ-1706, REQ-1708, REQ-1710, REQ-1712, REQ-1714, REQ-1716, REQ-1718, REQ-1720, REQ-1722, REQ-1724, REQ-1726, REQ-1728, REQ-1730, REQ-1732, REQ-1734, REQ-1736, REQ-1738, REQ-1740, REQ-1742, REQ-1744, REQ-1746, REQ-1748, REQ-1750, REQ-1752, REQ-1754, REQ-1756, REQ-1758, REQ-1760, REQ-1762, REQ-1764
- platform: REQ-2500, REQ-2502, REQ-2504, REQ-2506, REQ-2508, REQ-2510, REQ-2512, REQ-2514, REQ-2516, REQ-2518, REQ-2520, REQ-2522, REQ-2524, REQ-2526, REQ-2528, REQ-2530, REQ-2532, REQ-2534, REQ-2536, REQ-2538, REQ-2540, REQ-2542, REQ-2544, REQ-2546
- privacy: REQ-2600, REQ-2602, REQ-2604, REQ-2606, REQ-2608, REQ-2610, REQ-2612, REQ-2614, REQ-2616, REQ-2618, REQ-2620, REQ-2622, REQ-2624, REQ-2626, REQ-2628, REQ-2630, REQ-2632, REQ-2634, REQ-2636, REQ-2638, REQ-2640, REQ-2642, REQ-2644, REQ-2646, REQ-2648
- progression: REQ-2000, REQ-2002, REQ-2004, REQ-2006, REQ-2008, REQ-2010, REQ-2012, REQ-2014, REQ-2016, REQ-2018, REQ-2020, REQ-2022, REQ-2024, REQ-2026, REQ-2028, REQ-2030, REQ-2032, REQ-2034, REQ-2036, REQ-2038
- report: REQ-2300, REQ-2302, REQ-2304, REQ-2306, REQ-2308, REQ-2310, REQ-2312, REQ-2314, REQ-2316, REQ-2318, REQ-2320, REQ-2322, REQ-2324, REQ-2326, REQ-2328, REQ-2330, REQ-2332, REQ-2334, REQ-2336, REQ-2338, REQ-2340, REQ-2342, REQ-2344, REQ-2346, REQ-2348, REQ-2350, REQ-2352, REQ-2354, REQ-2356, REQ-2358, REQ-2360, REQ-2362, REQ-2364, REQ-2366, REQ-2368, REQ-2370, REQ-2372, REQ-2374, REQ-2376, REQ-2378
- resume: REQ-0200, REQ-0202, REQ-0204, REQ-0206, REQ-0208, REQ-0210, REQ-0212, REQ-0214, REQ-0216, REQ-0218, REQ-0220, REQ-0222, REQ-0224, REQ-0226, REQ-0228, REQ-0230, REQ-0232, REQ-0234, REQ-0236
- rewards: REQ-2100, REQ-2102, REQ-2104, REQ-2106, REQ-2108, REQ-2110, REQ-2112, REQ-2114, REQ-2116, REQ-2118, REQ-2120, REQ-2122, REQ-2124, REQ-2126, REQ-2128, REQ-2130, REQ-2132, REQ-2134, REQ-2136, REQ-2138, REQ-2140, REQ-2142, REQ-2144, REQ-2146, REQ-2148, REQ-2150, REQ-2152, REQ-2154, REQ-2156, REQ-2158, REQ-2160, REQ-2162, REQ-2164, REQ-2166, REQ-2168, REQ-2170, REQ-2172, REQ-2174, REQ-2176, REQ-2178, REQ-2180, REQ-2182, REQ-2184, REQ-2186
- safety: REQ-1800, REQ-1802, REQ-1804, REQ-1806, REQ-1808, REQ-1810, REQ-1812, REQ-1814, REQ-1816, REQ-1818, REQ-1820, REQ-1822, REQ-1824, REQ-1826, REQ-1828, REQ-1830, REQ-1832, REQ-1834, REQ-1836, REQ-1838, REQ-1840
- scope: REQ-3700, REQ-3702, REQ-3704, REQ-3706, REQ-3708, REQ-3710, REQ-3712, REQ-3714
- screens: REQ-3500, REQ-3502, REQ-3504, REQ-3506, REQ-3508, REQ-3510, REQ-3512, REQ-3514, REQ-3516, REQ-3518, REQ-3520, REQ-3522, REQ-3524, REQ-3526, REQ-3528, REQ-3530, REQ-3532, REQ-3534
- selection: REQ-1000, REQ-1002, REQ-1004, REQ-1006, REQ-1008, REQ-1010, REQ-1012, REQ-1014, REQ-1016, REQ-1018, REQ-1020, REQ-1022, REQ-1024, REQ-1026, REQ-1028, REQ-1030, REQ-1032, REQ-1034, REQ-1036, REQ-1038, REQ-1040, REQ-1042, REQ-1044, REQ-1046, REQ-1048, REQ-1050, REQ-1052, REQ-1054, REQ-1056
- skill-graph: REQ-0800, REQ-0802, REQ-0804, REQ-0806, REQ-0808, REQ-0810, REQ-0812, REQ-0814, REQ-0816, REQ-0818, REQ-0820, REQ-0822, REQ-0824, REQ-0826, REQ-0828, REQ-0830, REQ-0832, REQ-0834, REQ-0836, REQ-0838, REQ-0840, REQ-0842, REQ-0844, REQ-0846, REQ-0848, REQ-0850, REQ-0852, REQ-0854
- stages: REQ-3000, REQ-3002, REQ-3004, REQ-3006, REQ-3008, REQ-3010, REQ-3012, REQ-3014, REQ-3016, REQ-3018, REQ-3020
- task-text: REQ-3600, REQ-3602, REQ-3604, REQ-3606, REQ-3608, REQ-3610, REQ-3612, REQ-3614, REQ-3616, REQ-3618, REQ-3620, REQ-3622, REQ-3624, REQ-3626, REQ-3628, REQ-3630, REQ-3632, REQ-3634, REQ-3636, REQ-3638, REQ-3640, REQ-3642, REQ-3644, REQ-3646, REQ-3648, REQ-3650, REQ-3652, REQ-3654, REQ-3656, REQ-3658, REQ-3660
- templates: REQ-1200, REQ-1202, REQ-1204, REQ-1206, REQ-1208, REQ-1210, REQ-1212, REQ-1214, REQ-1216, REQ-1218, REQ-1220, REQ-1222, REQ-1224, REQ-1226, REQ-1228, REQ-1230, REQ-1232, REQ-1234, REQ-1236, REQ-1238, REQ-1240, REQ-1242, REQ-1244
- threads: REQ-0500, REQ-0502, REQ-0504, REQ-0506, REQ-0508, REQ-0510, REQ-0512, REQ-0514, REQ-0516, REQ-0518, REQ-0520, REQ-0522, REQ-0524, REQ-0526, REQ-0528, REQ-0530, REQ-0532, REQ-0534, REQ-0536, REQ-0538, REQ-0540, REQ-0542, REQ-0544, REQ-0546, REQ-0548, REQ-0550, REQ-0552
- time: REQ-0300, REQ-0302, REQ-0304, REQ-0306, REQ-0308, REQ-0310, REQ-0312, REQ-0314, REQ-0316, REQ-0318, REQ-0320, REQ-0322, REQ-0324, REQ-0326, REQ-0328, REQ-0330, REQ-0332, REQ-0334, REQ-0336, REQ-0338, REQ-0340, REQ-0342, REQ-0344, REQ-0346, REQ-0348, REQ-0350, REQ-0352, REQ-0354, REQ-0356, REQ-0358, REQ-0360, REQ-0362, REQ-0364
- voice: REQ-3300, REQ-3302, REQ-3304, REQ-3306, REQ-3308, REQ-3310, REQ-3312, REQ-3314, REQ-3316, REQ-3318, REQ-3320, REQ-3322, REQ-3324, REQ-3326, REQ-3328, REQ-3330
- world: REQ-1500, REQ-1502, REQ-1504, REQ-1506, REQ-1508, REQ-1510, REQ-1512, REQ-1514, REQ-1516, REQ-1518, REQ-1520, REQ-1522, REQ-1524, REQ-1526, REQ-1528, REQ-1530, REQ-1532, REQ-1534, REQ-1536, REQ-1538, REQ-1540, REQ-1542, REQ-1544, REQ-1546, REQ-1548, REQ-1550, REQ-1552, REQ-1554, REQ-1556, REQ-1558, REQ-1560, REQ-1562, REQ-1564, REQ-1566, REQ-1568, REQ-1570, REQ-1572, REQ-1574
<!-- /meow-flow index -->
