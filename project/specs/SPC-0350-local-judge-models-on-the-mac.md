---
id: SPC-0350
artifact: spec
status: live
revised: 2026-09-28
checked-at:
states: [REQ-2648, REQ-2732, REQ-3910, REQ-3912, REQ-3914, REQ-3916, REQ-3918, REQ-3920, REQ-3922, REQ-3924]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The local judge models on the Mac and the route each judge check takes

## Scope

This document covers the local judges: the `llama-server` processes that answer judge checks on the parent's Mac, how they are configured, started and probed, the local bake-off that tests them, the route the model gateway resolves for each judge check, how a local answer is read, the costs and log rows of judge calls, and the Parent Room's list of where each check on the player's text runs. It is a child of SPC-0100, the model gateway: SPC-0100 states the gateway as a whole, the hosted judge `JUDGE_MODEL`, `SAFETY_MODEL`, the judge timeout, the agreement test a check passes against the reference model, and the fallback to `SAFETY_MODEL` when a judge fails. This document states the local route inside it and the contract between that route and the rest of the gateway.

It is written at the component level: processes, the HTTP requests between the gateway and a judge, settings, tables, events and states. The containers, the operator command and the notices file belong to SPC-0010, which names the commands that start, stop and report a judge. The cleaning of her text before any judge reads it belongs to SPC-0230, what the checks decide in the story to SPC-0110, and the recordings that replace model calls in automated checks to SPC-0190. The Master and every role that writes text stay on SPC-0100's routes and are not covered here.

## Boundary

### Settings and files

| Surface | What it is |
| --- | --- |
| `LOCAL_JUDGES` in `.env` | A JSON array of at most 2 entries, each `{ name, file, port, params }`: the judge's name, its model file as a path under `models/`, its port on the Mac, and its parameter count in billions, which the route's tie-break reads (REQ-3916). ADR-0350 sets the ceiling of 2. Empty or absent, no local judge runs. |
| `LOCAL_JUDGE_KEY` in `.env` | The API key every request to a judge carries: 32 random bytes as 64 hexadecimal characters. |
| `LOCAL_JUDGE_BIND` in `.env` | `loopback` (the default) or `all`: the address a judge listens on, `127.0.0.1` or every address. |
| `models/` | The GGUF model files at Q8_0, one per candidate, ignored by git and mounted read-only into `meowtower` and `tools`. |
| `tools/judge-candidates.json` | One entry per local candidate: its name, its file, its parameter count, the repository it was downloaded from, the languages its model card lists, as a list or as a count, and `checks`, the checks the candidate may take. |
| The launchd daemon `meowtower.judge.<name>` | The system launchd daemon that runs one judge as the judge account, with `KeepAlive` true. |
| The judge account | The standard macOS account, without administrator rights, that `./meowtower setup` creates and every judge process runs as. |
| `data/judges/owners.json` | One entry per judge, written by `./meowtower up`: the user its process runs as and that user's groups. |
| `tools/bakeoff.ts --local` | The local bake-off, run in the `tools` container on the family Mac. |

### A judge process

Each judge is one `llama-server` process from the Homebrew formula `llama.cpp`, run as the judge account, pinned with `brew pin llama.cpp`, started with `--model <file>`, `--host 127.0.0.1` (or `0.0.0.0` when `LOCAL_JUDGE_BIND` is `all`), `--port <port>`, `--api-key <LOCAL_JUDGE_KEY>`, `--parallel 10` and `--ctx-size 40960`, 4,096 tokens for each of the 10 slots. The gateway calls four of its routes, at `http://host.docker.internal:<port>`, each with the key as a bearer token:

| Route | What the gateway reads |
| --- | --- |
| `GET /health` | Whether the process answers and has its model loaded. |
| `GET /props` | The model file's path and the runtime's build. |
| `POST /apply-template` | The prompt rendered by the model's own chat template, with thinking off. |
| `POST /tokenize` | How the model's tokenizer splits each label, read by the bake-off. |
| `POST /completion` | One check's answer. |

A request to `/props`, `/apply-template`, `/tokenize` or `/completion` without the key, or with a wrong one, gets `401` and no model answer (REQ-3910). `GET /health` answers without the key, with a status and no model answer (REQ-3910).

### The checks and their labels

Every judge check has a fixed set of at most 8 answers, each mapped in the check's fixed prompt to one Latin capital label from `A` to `H`. This document defines the check names, and SPC-0100's `JUDGE_CHECKS` takes them.

| Check | What it reads | Answers and labels | Slots |
| --- | --- | --- | --- |
| `safety` | her cleaned free text, or a Master reply, against the forbidden-content checklist | `A` breaks no item, `B` breaks an item | 0, 1, 2 |
| `creepiness` | a Master reply against the order's creepiness level | `A` level 0, `B` level 1, `C` level 2 | 3, 4, 5 |
| `signal` | her cleaned free text | `A` none, `B` everyday, `C` serious | 6 |
| `sorting` | her cleaned free text against the scene's three options | `A`, `B` and `C` the options in the order the scene lists them, `D` none | 7 |
| `shaming` | a text shown to her: does it judge or shame the heroine? | `A` no, `B` yes | 8 |
| `placeholder_safety` | an explanation or a frame with its placeholders, before numbers fill them | `A` breaks no item, `B` breaks an item | 9 |

The checks sent at once in one turn, the in-flight count, is 6: up to three drafted Master replies in check at the same time, each with its `safety` check and its `creepiness` Score in parallel. Each check owns the slots its row names, so its fixed prompt stays cached in them, and `safety` and `creepiness` hold three slots each for the three replies. A request whose check has no free slot waits in the gateway for one, and the wait counts toward the 1500 ms timeout.

### Tables

| Table | What a row holds |
| --- | --- |
| `bakeoff`, local rows | `check`, `judge`, `model_file_hash`, `runtime_build`, `prompt_hash` (the SHA-256 of the check's fixed prompt), `test_set_version`, `in_flight`, `agreement`, `p95_ms`, `thresholds` (JSON, one value per label that the check thresholds), `agreement_passed`, `latency_passed` and `ran_at`. A row holds only for all seven inputs together. |
| `local_judge_files`, a service table | `path`, `size`, `mtime` and `sha256`: the cached hash of a model file. |
| `llm_log`, local rows | provider `local`, the judge's name, the file hash, the check, the latency, the parsed answer, cost 0 and no key. |

### Event

The server appends `judge_route_changed`, version 1, through `appendEvents`. Its payload is `check`; `route`, one of `local`, `hosted` or `safety`; `model`, the local judge's name or the hosted model id; `modelHash`, the file hash for a local route and otherwise null; `runtimeBuild`, null for a hosted route; and `reason`, one of `startup`, `file_changed`, `prompt_changed`, `test_set_changed`, `in_flight_changed`, `bakeoff_record` or `config_changed`.

### The route resolver

This part offers the gateway one function, `resolveJudgeRoute(check)`, which SPC-0100's gateway calls for each `JudgeRequest`. It reads the route table, the judges' states and their probe results, all held in memory, and returns `{ route: "local", judge, state, address }`, `{ route: "hosted", model }` or `{ route: "safety", model }`. For a check whose resolved route is local and whose judge isn't `up`, it returns the standby route in place of the local one, and the route table keeps the local route. It opens no connection and never waits.

### What this part requires from other parts

- SPC-0100 supplies the gateway this route lives in, the play key and its modes, the judge timeout of 1500 ms, the agreement test and its measure, the `JUDGE_CHECKS` start-up check, the fallback to `SAFETY_MODEL`, the provider facts it checks at start-up (company, country, retention), and `llm_log`.
- SPC-0230 supplies the cleaned text every judge reads.
- SPC-0010 supplies `./meowtower up`, `down` and `status`, the notices file `data/snapshots/notices.json`, and the `models/` mount.
- SPC-0020 supplies `appendEvents` and the event catalogue that lists `judge_route_changed`.
- ADR-0180's Parent Room supplies the page that shows where each check runs, and ADR-0160's language file its strings.

### Permitted dependencies

The dependencies run one way. Only the gateway in `meowtower` calls a judge's routes; the bake-off reaches a judge through the gateway's local route, and no other code, the client included, opens a connection to a judge. A judge process depends on nothing in `meowtower`: it reads its model file and answers HTTP, and never opens the database. The route table depends on `LOCAL_JUDGES`, the `bakeoff` table, `local_judge_files` and each judge's probe results, and the Parent Room page depends only on the route table, the judges' states and SPC-0100's provider facts.

## Behaviour

### Starting and stopping a judge

`./meowtower setup`, run once with administrator rights, creates the judge account. `./meowtower up` reads `LOCAL_JUDGES` and, when it names any judge, runs `brew pin llama.cpp`, generates `LOCAL_JUDGE_KEY` as 32 random bytes when `.env` holds none, writes each judge's launchd daemon with `UserName` set to the judge account and loads it with `launchctl bootstrap system`, so launchd restarts the judge when it exits. Once the judge runs, `./meowtower up` reads the user its process runs as and that user's groups, and writes them to `data/judges/owners.json` (REQ-2512). It refuses to start a judge, with `model_config_invalid` naming the entry and the fault, when `LOCAL_JUDGES` has more than 2 entries (REQ-3916), when the key is missing or shorter than 32 bytes, when the file lies outside `models/`, when the file has no entry in `tools/judge-candidates.json`, or when the file's candidate entry lists languages without Russian (REQ-3918). `./meowtower down` unloads the daemons with `launchctl bootout system`.

A judge listens on `127.0.0.1` and answers only with the key, so no device other than the Mac gets a model answer from it (REQ-3910). A request from `meowtower` or `tools` through `host.docker.internal` counts as coming from the Mac. When the stage 0 test on the family Mac shows that a container can't reach a judge bound to `127.0.0.1`, the owner sets `LOCAL_JUDGE_BIND=all`, and then the key alone keeps every other device from a model answer, the iPad included (REQ-3910).

### Candidates

`tools/judge-candidates.json` lists Qwen3.5-9B, Qwen3.5-4B, Gemma 4 12B and Gemma 4 E4B for every check, and Shieldstral 1.0 3B for the yes-or-no checks `safety`, `shaming` and `placeholder_safety`. A group 1 check of `verify` fails an entry whose card lists its languages without Russian, and passes an entry whose card gives only a count, which the test set then judges (REQ-3918). The bake-off refuses such an entry too, and the route never gives a check to a judge serving its file (REQ-3918). The hosted judge and `SAFETY_MODEL` meet the test set alone.

### The local bake-off

`tools/bakeoff.ts --local` refuses to start while an adventure is open. For each candidate and each check its entry's `checks` lists, it runs through the gateway's local route:

1. It reads the candidate's tokenizer through `/tokenize` and refuses the candidate for every check when a label splits into more than one token.
2. It warms the check's slots by sending the check's fixed prompt once to each of them.
3. It sends the check's labelled Russian test set, the one SPC-0100's agreement test uses for the reference model, with 6 requests in flight in total: for `safety` or `creepiness`, 3 of the check under test and 3 of the other; for any other check, 1 of the check under test, 3 `safety` and 2 `creepiness`.
4. It measures the 95th-percentile latency at the gateway, from the request leaving the gateway to the parsed answer, and the check passes latency when that is at most 1500 ms (REQ-3914).
5. It computes agreement with the reference model by SPC-0100's measure, sets the check's thresholds from the test set, and writes one `bakeoff` row with the inputs, the results and both pass flags.

A local run spends nothing from the bake-off budget, because a local call costs $0.

### The route of each check

The gateway resolves each judge check to one route at start and on every 60-second probe, from evidence alone, in this order:

1. A local judge, when a judge in `LOCAL_JUDGES` serves a file whose hash and runtime build have a `bakeoff` row that passes both the agreement test and the latency test for the check, with the check's current prompt hash, the current test-set version and the current in-flight count (REQ-3914). Among several, the one with the highest agreement answers; judges within one percentage point of the best tie, and a tie goes to the judge that passes the most checks, then to the one with fewer parameters (REQ-3916).
2. Otherwise `JUDGE_MODEL`, when `JUDGE_CHECKS` names the check and SPC-0100's start-up check found its passing record (REQ-3924).
3. Otherwise `SAFETY_MODEL` (REQ-3924).

A check with no passing local row therefore never reaches a local judge, a row that passed agreement and failed latency included (REQ-3924).

When a check's resolved route, model, file hash or runtime build differs from the last `judge_route_changed` logged for it, the gateway appends one with the reason that moved it. A judge's availability doesn't change the route and appends no event.

### A judge's state

Each judge is `unverified`, `up` or `down`. A check whose route is local and whose judge isn't `up` goes to its standby route, the route the list above resolves with that judge left out.

Before the gateway sends a judge any check, the judge passes four steps, at start and whenever it isn't `up` (REQ-3922):

1. `data/judges/owners.json` names, for the judge, a user other than root that isn't a member of `admin` (REQ-2512).
2. `GET /health` answers 200.
3. `GET /props` names the file its entry names and a runtime build. The gateway reads the file's size and modification time through the read-only mount and takes its SHA-256 from `local_judge_files`, hashing the file again when the path, the size or the time differs from the cached row (REQ-3922).
4. For each check routed to the judge, one warm-up request per slot, carrying a fixed synthetic text, returns an answer the gateway accepts, each within 30 seconds.

The server listens while these run, and the judge stays `unverified` until all four pass; then it is `up`. When `GET /props` names a file other than the configured one while the server starts, the server refuses to start with `judge_file_mismatch`, naming both files, as SPC-0100 states (REQ-1644). A refused connection to a judge, or a `/props` answer whose file or build differs from the last one read, makes the judge `unverified` at once, and it takes no check until the four steps pass again (REQ-3920).

Every 60 seconds the gateway probes each judge with `/health` and `/props` and reads the file's size and modification time again. When the file hash, the runtime build, a check's prompt hash, the test-set version or the in-flight count differs from the `bakeoff` row a check passed on, the gateway stops sending that judge the check at once, resolves its route again, and holds back only the checks whose row no longer matches (REQ-3920). A check held back returns to the judge on the first probe after `tools/bakeoff.ts --local` writes a passing row for the new inputs, with no restart (REQ-3920).

### A local judge's answer

Each request is `POST /completion` with the check's fixed prompt first and the cleaned text after it, rendered once per check by `POST /apply-template` with thinking off, and cached by the gateway, and with `id_slot` set to a free slot of that check, `cache_prompt` true, `temperature` 0, a fixed `seed`, `n_predict` 1, a GBNF grammar that allows only the check's labels, `n_probs` 100 and `post_sampling_probs` false, so the runtime reports the model's distribution before the grammar and the sampler act. A request longer than the slot's 4,096 tokens isn't sent.

The gateway reads the probability the runtime reports for each label token among those 100 at the answer position and divides each by their sum, so the label probabilities sum to 1. It treats the answer as an error when the chosen token isn't one of the check's labels, when any label's probability is missing, or when a reported value lies outside 0 to 1 (REQ-3912). Otherwise the answer is the chosen label with its probability for each label, and the check applies the thresholds of the judge's `bakeoff` row, which the bake-off set on the same renormalised distribution.

An error, no answer within 1500 ms, or a request over 4,096 tokens sends the same question to `SAFETY_MODEL`, as SPC-0100's fallback does, and logs `judge_fell_back` in `llm_log`. `SAFETY_MODEL` and `JUDGE_MODEL` apply their own thresholds, never a local judge's. After 3 errors or timeouts in a row the gateway marks the judge `down` and sends its checks straight to their standby route, and the next probe whose four steps pass marks it `up`.

### Keys, costs and the log

A local call carries no OpenRouter key, reserves no budget and costs $0 (REQ-2732). Every hosted judge call during play, `JUDGE_MODEL`'s and `SAFETY_MODEL`'s as a fallback or a standby route alike, goes on the play key in `play` mode and counts inside its monthly limit (REQ-2732). A static test asserts that the key table gives `JUDGE_MODEL` and `SAFETY_MODEL` the play key in `play` mode, and that the local route has no key (REQ-2732).

Every local call writes an `llm_log` row. In `replay` mode the gateway answers a local request from `tests/recordings/` by the request's hash, which includes the judge's name and file hash, and `verify --record` records local answers on the family Mac.

### Where each check runs, in the Parent Room

The Parent Room's page on what leaves the Mac lists each check on her text, built from the route table and the judges' states when the parent opens it (REQ-2648). For each check it says where the check runs now, on the Mac or at a company, and for each company that can read the text, the fallback `SAFETY_MODEL`'s included, the company's name, its country and whether it keeps any of the text, from SPC-0100's provider facts (REQ-2648). A check whose route is local while its judge isn't `up` shows its standby route and the line «Сейчас проверка идёт через интернет» (right now the check goes over the internet), whose string lives in the language file. The page notifies nobody. A test builds the page for three configurations, no local judge, one judge taking some checks, and a judge that is `down`, and compares every row with the route table and the judges' states (REQ-2648).

### Storage

`models/` grows only by the owner's downloads. When it passes 50 GB, `./meowtower status` and the Mac's notices show `models_ceiling` once. Nothing deletes a model file.

## Failure paths

| State | What happens | Audience |
| --- | --- | --- |
| `model_config_invalid`: more than 2 local judges, a missing or short key, a file outside `models/`, a file with no candidate entry, or a candidate whose card lists no Russian | `./meowtower up` or the bake-off names the entry and the fault and starts nothing for it; the other judges start | the owner |
| `judge_file_mismatch`: while the server starts, a judge's `/props` names a file other than the configured one | the server doesn't start, and the message names both files | the owner |
| `local_judge_unverified`: the judge runs as root or as a member of `admin`, doesn't answer at start, serves another file after start, or fails its warm-up | its checks go to their standby route, and the probe retries every 60 seconds | the owner, in `./meowtower status` |
| `local_judge_down`: 3 errors or timeouts in a row | its checks go to their standby route until a probe and a warm-up pass | the owner, in `./meowtower status` |
| `local_judge_falling_back`: in one game day, more than 5 % of the checks routed to a judge were answered by a fallback or a standby route | one notice when the share first passes 5 %, naming the share, the day's local p95 latency, the hours the fallbacks fell in and the judge's state; it rises again only after a game day below 5 %, or when the share doubles | the owner, in `./meowtower status` and the Mac's notices |
| `local_judge_retest`: the file hash, the runtime build, a check's prompt hash, the test-set version or the in-flight count differs from the row a check passed on | the checks it held take their route again without that judge; one notice per changed input, naming it and `tools/bakeoff.ts --local` | the owner, in `./meowtower status` and the Mac's notices |
| `judge_fell_back`: a local judge erred, timed out, went over 4,096 tokens or gave an answer REQ-3912 refuses | the same question goes to `SAFETY_MODEL` | the owner, in `llm_log` |
| The bake-off starts while an adventure is open | it refuses and runs nothing | the owner |
| `models_ceiling`: `models/` passes 50 GB | one notice | the owner, in `./meowtower status` and the Mac's notices |
| A device other than the Mac sends a judge a request | the connection is refused, the reply is `401`, or `GET /health` gives a status; no reply carries a model answer (REQ-3910) | nobody |

The player sees none of these states: a check on a standby or fallback route reads the same to her.

## Open findings

- `data/judges/owners.json`, written by `./meowtower up` and read at the judge's first step, is a choice this document makes, because ADR-0360 decides that no check routes to a judge running as root or as a member of `admin` and names no way for the server in its container to read the owner of a process on the Mac.

## Open review findings

- The agent review found that SPC-0100 states no agreement measure, although this document cites it for bake-off step 5 and the tie. ADR-0350 leaves the measure, and whether it weights the serious class of `signal`, to the specification. Open: SPC-0100 or this document has to state it before the bake-off can be built.
- The agent review found that SPC-0100's provider facts name no country, which the Parent Room page needs (REQ-2648). Open: SPC-0100 has to name each provider's country, or a provider table has to be added.
- The agent review asked for the reasons behind `n_probs` 100 and the one-slot checks. I keep them without reasons, as S8 asks.
- The agent review asked for each rule's reason in its sentence: the 8-label limit, the refusal while an adventure is open, the 30-second warm-up, the 3 errors in a row and the 50 GB ceiling. I keep them without reasons, because a specification states what the system does and never why (S8), and ADR-0350 holds each reason.
