---
id: TSK-1117
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0430
closes: [REQ-7166, REQ-7168, REQ-7170, REQ-7172, REQ-7174, REQ-7176, REQ-7178]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Letters feed only the stream `nl_probe`, and no other measure counts them

After this task, every attempt on a letter is recorded in the stream `nl_probe` and in no other, and the «сама» estimates, the Sources track's rows, the language-risk limit, the bridge's share, the refusal guard and the Director's success share count no letter.

## Acceptance criteria

1. Given a letter shown, when its `item_shown` is written, then it carries `purpose: "nl_probe"`, `forms: ["nl_probe"]` and the `probe` field, and its attempt appears in the stream `nl_probe` and in no other stream, bare and Russian presentations included (REQ-7166). Closed by: a projection test over a fixture log.
2. Given random logs, when a property test changes the answers of `nl_probe` attempts, then every «сама» estimate of any node, every track row, every limit, the bridge's share, the refusal guard's window and the Director's success share stays equal (REQ-7168). Closed by: the property test.
3. Given tasks with risk terms, when the language-risk limit counts mistakes, then it counts those on tasks other than letters whose term explanation she didn't open; given the bridge on, then its keywords appear in 15 % to 25 % of the T1 to T4 and Sources tasks other than letters shown on nodes at «Понимает» or above over any 14 game days on which she plays (REQ-7170, REQ-7172). Closed by: a limit test and a bridge-share test.
4. Given a window of her last 20 solvable T1 to T4 word problems, when it is built, then it counts no letter, and with «Нельзя узнать» on 3 or more of the 20 the report shows «склонна отказываться от задачи» and the Director halves the share of unanswerable problems once, until a later window holds 2 or fewer (REQ-7174, REQ-7176). Closed by: a guard test over fixture windows with and without letters.
5. Given the Russian presentation of a family, when its text is built, then it carries no Dutch bridge keyword, and the bridge's renderer never picks a letter (REQ-7178). Closed by: a renderer test over fixture families.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the stream `nl_probe` as the projection of attempts whose `forms` holds `nl_probe`, and make every other projection skip them. The exceptions serve play and not measurement: the thread ledger, rewards and streak, the day's active time and eye count, and the `postFeedback` mark a shown solution sets on later tasks of the node. Retention and transfer take no observation from a letter, which ADR-0400 and ADR-0410 already leave at none. Model v1 admits no form, so ADR-0210's rule keeps the attempt out of «сама».

## Depends on

- TSK-1113 (blocking): the `item_shown` fields it keys on come from that task.

The epic realising ADR-0210 supplies the streams and the epic realising ADR-0180 the limit and the guard; the task changes each and runs on fixtures of both.

## Evidence

Not yet.

## Left alone

The report section that reads the stream, which TSK-1118 and TSK-1119 build, and the profile's dimension «Язык и формат», which ADR-0390 builds.
