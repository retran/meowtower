---
id: RES-1800
artifact: research
status: approved
revised: 2026-09-27
---

# The draft proposes that the Master is honest about being a program, never harms or shames the child, and hands serious real-life signals to the parents

## Summary

The owner's draft proposes safety rules for the Master, the LLM narrator, speaking with a primary-school child. The system prompt names the child's age, forbids asking for personal data and forbids talk of schoolwork and grades. The Master stays in character, but answers a direct "are you human?" with a fixed line saying it is a computer program. A fixed list of content is forbidden, including guilt and attachment phrases and romance. The draft sets two levels of reaction to real life: an everyday one that stays in the story and flags the scene, and a serious one that leaves the story, pauses the game and alerts the parent. Text is cleaned of personal data before it leaves for OpenRouter, and every dialogue is kept for the parents to read. This record covers those rules. It leaves the creepiness levels and dreamcore prohibitions to RES-1500, the reply checks to RES-1600 and the privacy cleaning itself to the record on privacy.

## The question

How should an AI narrator talk with a child so that the story never harms her and real trouble reaches her parents? The draft assumes two fixed levels with hand-written triggers catch what matters. Keyword triggers miss what a child says in her own words, and flag what she writes in the story; the draft's answer, "when in doubt, serious", trades missed signals for false alarms that pause her game.

## Method

Read the owner's draft «Хроники Башни — спецификация» (Tower Chronicles: specification), section «Безопасность и благополучие» (Safety and wellbeing), on 2026-09-26, with its opening paragraph and «Текущий объём (MVP)» (Current scope, MVP) summary for context.

The draft leaves these points open:

- the triggers and lines in `content/safety.ru.json`, which a person writes by hand;
- how the parent receives the "prominent notification" (in the app, by message or otherwise), which the resolved finding below settles;
- what "when in doubt" means in a test, and who judges the doubt, which the resolved finding on Jev below gives a testable form;
- what canon section 11 holds, which the system prompt cites.

## Findings

### The draft builds the Master's system prompt around the player's age

The system prompt states:

- the Master is talking with a child of the player's age (kept in `personal/player.md`);
- tone and prohibitions follow canon section 11;
- the creepiness level and dreamcore rules follow canon section 13;
- never ask for personal data;
- never talk about schoolwork or grades;
- tell trial outcomes as events in the world, never as a verdict on the heroine.

### The draft requires the Master to admit it is a program when asked directly

The Master does not leave its role for chatter. On a direct question «ты человек?» (are you human?) or «ты ИИ?» (are you an AI?) it answers with a fixed System line: «Рассказчик этой истории — компьютерная программа. Человеком не является. Историю мы пишем вместе.» (The narrator of this story is a computer program. It is not a human. We write the story together.) Passing itself off as a human is forbidden.

### The draft forbids a fixed list of content, with a safety test for each item

- the death or suffering of familiars;
- body horror;
- "stuck forever";
- kidnapping;
- guilt and attachment phrases («мне будет грустно без тебя», I'll be sad without you; «не уходи», don't go);
- passing itself off as a human;
- romance;
- shaming words and judging the heroine after outcomes;
- everything on the "always forbidden" list of the dreamcore section (jump scares, blood, death, melting faces, no way out, threats to family, realistic dangers);
- creepiness above the parent's level.

Safety tests cover every item.

### The draft sets two levels of reaction to real life, with hand-written triggers and lines

The triggers and lines live in `content/safety.ru.json`, written by hand.

| Level | Examples | Reaction |
| --- | --- | --- |
| Everyday | tired, a bad day, fell out with a friend | the Master answers warmly inside the story (a familiar sits beside her, «Рекомендуется привал», A rest stop is recommended); the scene is quietly flagged for the parent |
| Serious | danger, someone hurting her, being asked to keep a secret from her parents, thoughts of self-harm, an unknown adult online | the Master leaves its role with a fixed line «Это звучит серьёзно. Об этом лучше рассказать маме или папе — они помогут» (This sounds serious. It's better to tell Mum or Dad about it; they'll help); the game pauses with a «Вернуться в историю» (Back to the story) button, and the parent gets a prominent notification |

When in doubt, the draft chooses the serious level.

### Resolved: A serious signal reaches the parent as a Parent Room notice and a web push to the parent's phone

A notice in the Parent Room alone waits until the parent opens the room, which can be days after a serious signal. The game runs on a Mac at home with no cloud account, so I compared the ways to reach a phone from there:

- Web push to the Parent Room, installed as a home-screen web app on the parent's iPhone. It needs iOS 16.4 or later, a manifest and a service worker, the Caddy certificate trusted on the phone, and a permission the parent grants with a tap. It needs no app, no Apple Developer Program membership and no account, and Apple's push service delivers it while the phone is away from home. The Web Push standard encrypts the payload so the push service can't read it.
- ntfy, self-hosted on the Mac. The iOS app gets instant delivery only when the Mac forwards a poll request to ntfy.sh, and the phone then fetches the message from the Mac. The home network is the only way to reach the Mac, so an alarm sent while the parent is out waits until they come home.
- ntfy.sh, the public server. It works anywhere with no setup on the Mac, but the message sits on a third party's server, readable by anyone who guesses the topic name.
- E-mail. Every parent reads it, but it needs a mail provider's account and its password on the Mac, and it can wait unread for hours.
- SMS needs a paid gateway account, so it fails the constraint outright.

I chose web push, because it alone reaches the parent away from home without an account or a third party that can read the message. The push carries a fixed line with no details, «В Башне есть сигнал для родителя» (There is a signal for the parent in the Tower), and opens the Parent Room, where the details stay behind the PIN. It goes only to phones the parent has paired and subscribed from the Parent Room, never to the child's devices, so the game still sends the player no notifications (RES-2000). The Parent Room notice stays the record of the alarm: if no phone is subscribed or a push fails, the notice is still there, and the game logs the failed delivery. An everyday signal gets no push, only its quiet flag. RES-2500 holds the setup. Proposed by research on 2026-09-26; the owner approves it with this record.

The owner's decision of 2026-09-27 replaced this finding for the MVP: alarms go to the Parent Room only, and the web push waits until after the MVP. The next finding holds it.

### Resolved: in the MVP a serious signal reaches the parent as a Parent Room notice only, and web push comes after the MVP

The owner decided on 2026-09-27: alarms go to the Parent Room only, and the web push to the parent's iPhone is postponed until after the MVP. In the MVP the Parent Room notice is the whole "prominent notification": it sits at the top of the Parent Room until the parent opens it, and the parent sees it on their next visit, which can be hours or days after the signal. The child's side doesn't change: the Master leaves its role with the fixed line and pauses the game, so the child is sent to an adult at once. The comparison above stays as the plan for the later item, so web push remains the chosen channel when it is built. An everyday signal keeps its quiet flag.

### The draft chooses the serious level over the everyday one when in doubt

The draft states the rule, «При сомнении — серьёзный уровень» (When in doubt, the serious level), and gives no reason for it. My reading, not the draft's: a false alarm costs a paused story and a parent's attention, while a missed serious signal leaves a real risk unreported.

### The draft cleans personal data locally before any text goes to OpenRouter

Before text is sent to OpenRouter, it passes local cleaning of personal data. The draft describes the cleaning in its privacy section, outside this range. Since the owner's decision of 2026-09-27, the same cleaning also comes before any text goes to Jev, which reaches TypeSafe through OpenRouter's zero-retention route; the next finding holds it.

### Resolved: Jev may take the safety check on her free text and judge a signal's level beside the hand-written triggers, which still run first on the Mac

The owner decided on 2026-09-27: Jev can be used to evaluate safety and similar judgements, for example the safety check on free text and sorting free-text choices. Jev runs at TypeSafe, outside OpenRouter, and receives the child's cleaned text under retention terms TypeSafe doesn't publish. RES-1600 lists the checks Jev may take as `JUDGE_MODEL`, and RES-2600 the rules for its requests.

For this record Jev may take two checks. It checks her cleaned free text and each Master reply against the forbidden-content list, as yes-or-no questions. It also judges the level of a real-life signal in her free text, as a choice among none, everyday and serious. I compared two ways to place the level check. Jev alone would catch signals she writes in her own words, which the draft's keyword triggers miss. Hand-written triggers alone need no outside service and run on her raw text, before the clean-up removes names that may matter to a signal. Both together win: the triggers in `content/safety.ru.json` run first on the Mac and fire on their own, and Jev's answer can raise a signal the triggers missed but never lower one they found. The draft's rule that doubt means the serious level gets a testable form: Jev's probability for «serious» above a threshold counts as serious, and the stage 0 test set of labelled Russian lines sets that threshold. When Jev errs or times out, `SAFETY_MODEL` answers the same question. Proposed by research on 2026-09-27; the owner approves it with this record.

Decided on 2026-09-27 by research, on the owner's instruction to answer the open questions; the owner approves it with this record. Jev runs through OpenRouter's zero-data-retention route, `typesafe/jev-1.13`, not TypeSafe's direct API, so TypeSafe keeps nothing of her text and Jev stays inside the player tier (RES-2600). Only cleaned text with no personal data reaches it, on the parent's account. Jev takes these two checks in play only once it matches `SAFETY_MODEL` on the Russian test set at the stage 0 bake-off, run through that route; until then `SAFETY_MODEL` takes them. The paragraph above first placed Jev at TypeSafe outside OpenRouter, under unpublished retention terms.

### The draft keeps every dialogue for the parents to read as a book

All dialogues are saved and can be read in the Parent Room as a book.

## Conclusions

1. The Master's system prompt must state the child's age, forbid asking for personal data and forbid talk of schoolwork or grades.
2. The Master must tell trial outcomes as events in the world and never as a verdict on the heroine.
3. On a direct question whether it is a human or an AI, the Master must answer with the fixed System line saying it is a computer program, and must never pass itself off as a human.
4. The Master must never produce any item on the forbidden-content list, and a safety test must cover every item.
5. The trigger lists and the fixed lines for real-life signals must be written by hand, not generated.
6. An everyday real-life signal must get a warm in-story answer and a quiet flag for the parent.
7. A serious real-life signal must make the Master leave its role with the fixed line, pause the game with a way back to the story, and send the parent a prominent notification.
8. When a signal's level is in doubt, the game must treat it as serious.
9. Text must be cleaned of personal data locally before it is sent to any external model service.
10. Every dialogue must be saved and readable by the parent in the Parent Room.
11. In the MVP the prominent notification for a serious signal must be a Parent Room notice only, as the owner decided on 2026-09-27; after the MVP a web push to every phone the parent has subscribed, carrying a fixed line with no details, must join it, and a failed push must be logged without losing the notice. (The draft of this conclusion put the web push in the MVP.)
12. Jev, as `JUDGE_MODEL`, may check her cleaned free text and each Master reply against the forbidden-content list and judge a signal's level, by the owner's decision of 2026-09-27, with `SAFETY_MODEL` as the fallback when Jev errs or times out.
13. The hand-written triggers must run first on the Mac, and Jev's level may raise a signal the triggers missed but must never lower one they found; a signal counts as serious when Jev's probability for serious passes the threshold the stage 0 test set sets.
14. Jev's safety and signal checks must go through OpenRouter's zero-retention route to `typesafe/jev-1.13` with only cleaned text, and must run in play only once Jev matches `SAFETY_MODEL` on the Russian test set at the stage 0 bake-off through that route, as research decided on 2026-09-27 on the owner's instruction.

## Sources

- The owner's draft «Хроники Башни — спецификация», section «Безопасность и благополучие», with the opening and «Текущий объём (MVP)» for context, read 2026-09-26; not kept in the repository - every finding above.
- WebKit, «Web Push for Web Apps on iOS and iPadOS», https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/, read 2026-09-26 - iOS 16.4, a home-screen web app, a permission asked on a tap, no Apple Developer Program membership.
- IETF, RFC 8291 «Message Encryption for Web Push», https://www.rfc-editor.org/rfc/rfc8291, read 2026-09-26 - the payload is protected against inspection by the push service.
- ntfy documentation, «Configuration», https://docs.ntfy.sh/config/, read 2026-09-26 - a self-hosted server on iOS needs ntfy.sh as upstream, and the phone fetches the message from the self-hosted server.
- The owner's decision of 2026-09-27, relayed that day: Jev can be used to evaluate safety and similar judgements, sending the child's cleaned text to a service outside OpenRouter.
- TypeSafe AI, «Models», https://docs.typesafe.ai/models, read 2026-09-27 - Jev's yes-or-no, choice and score questions with a probability, and English as its main language.
