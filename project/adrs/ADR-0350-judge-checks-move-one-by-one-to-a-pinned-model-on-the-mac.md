---
id: ADR-0350
artifact: adr
status: approved
revised: 2026-09-28
addresses: [REQ-2648, REQ-2732, REQ-3910, REQ-3912, REQ-3914, REQ-3916, REQ-3918, REQ-3920, REQ-3922, REQ-3924]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0350. Judge checks move one by one to open models that llama.cpp serves on the Mac host, each check to the model that passed its Russian test set and its 1500 ms test on the file it serves, behind a loopback endpoint with a key or, failing that, the key alone, and every other check stays on its hosted route

## Decision

The server can route a judge check to an open model running on the Mac host,
a local judge, in place of the hosted judge of ADR-0100. The server computes
each check's route at start from the stage 0 test results. A check moves to a
local judge only when that judge passed the check's agreement test (REQ-1688)
and latency test (REQ-3914) on the exact model file it serves. Every other
check keeps the route ADR-0100 gives it. With no local judge configured, the
game runs exactly as ADR-0100 describes, so this decision adds an increment
that can be switched off by an empty setting.

### The local judge process

Each local judge is one `llama-server` process from llama.cpp, installed with
`brew install llama.cpp` and held at its version with `brew pin llama.cpp`.
It runs as a native macOS process, because no container runtime on the Mac
gives a Linux container the Metal GPU (RES-3910). I chose llama.cpp's server
because it is the one runtime RES-3910 read that documents grammar-limited
output, token probabilities, a prompt cache on by default, parallel slots and
an API key together.

- The setting `LOCAL_JUDGES` in `.env` lists at most 2 judges. Each entry
  names the judge, its model file under `models/` in the repository folder,
  its port and its parameter count. I chose 2 as the ceiling because RES-3910
  expects at most one split, yes-or-no checks against Choice and Score
  checks, and each extra model adds its resident memory, slots and
  thresholds (REQ-3916).
- `./meowtower up` writes a user launchd agent for each judge and loads it,
  with `KeepAlive` so launchd restarts a crashed process. `./meowtower down`
  unloads it. The agent runs `llama-server` with `--host 127.0.0.1`, the port
  from the entry, `--api-key` from `LOCAL_JUDGE_KEY`, `--parallel` set to the
  judge's slot count and a context of 4,096 tokens a slot, which I chose as
  RES-2700's estimate of about 3,000 tokens a check, the fixed prompt and her
  text, plus about 1,000 tokens for a longer text. `./meowtower up`
  generates `LOCAL_JUDGE_KEY` as 32 random bytes when `.env` has none.
- The `tower` and `tools` containers reach a judge at
  `host.docker.internal:<port>`, and the key is on every request. A request
  without the key gets 401, which carries no model answer, and the loopback
  binding keeps other devices from connecting at all (REQ-3910). RES-3910
  couldn't confirm that a container reaches a service bound to `127.0.0.1`.
  A stage 0 test on the family Mac settles it. If it fails, the judge binds
  to all addresses and the key alone meets REQ-3910; `./meowtower up` then
  refuses to start a judge whose key is missing or shorter than 32 bytes.
- Model files are GGUF files at Q8_0, which I chose because each
  quantisation answers differently and the Mac's 64 GB holds two files of
  about 3.5 to 13 GB each, from Shieldstral 3B to Gemma 4 12B, with room to
  spare (RES-3910's rule of about one byte a parameter). The owner downloads them once into
  `models/`, which git ignores and which both containers mount read-only.

### Candidates and the test

`tools/judge-candidates.json` lists each local candidate with its name, its
file, its parameter count and the languages its model card lists. The stage 0
candidates are Qwen3.5-9B, Qwen3.5-4B, Gemma 4 12B and Gemma 4 E4B for every
check, and Shieldstral 1.0 3B for the yes-or-no checks, as RES-3910 conclusion
6 sets. A group 1 check of ADR-0190 fails a candidate whose card lists its
languages without Russian (REQ-3918). A card that gives only a count, such as
Gemma 4's "35+ languages", passes this filter and goes to the test set, which
is the real gate. The hosted judge and `SAFETY_MODEL` meet the test set alone.

`tools/bakeoff.ts --local` runs each candidate through the gateway's local
route on the family Mac, check by check, over the same labelled Russian test
set as the reference model (REQ-1688). It refuses to start while an adventure
is open, because play and a bake-off would share the GPU and each would slow
the other. For each check and candidate it:

1. warms the check's slots by sending the check's fixed prompt once per slot;
2. sends the test set with as many requests in flight as the game sends in
   one turn, which I set at 6, three drafted Master replies times the safety
   and creepiness checks ADR-0110 runs in parallel, until the specification
   counts it from ADR-0110's steps;
3. measures the 95th-percentile latency at the gateway, from the request
   leaving the gateway to the parsed answer (REQ-3914);
4. computes agreement with the reference model by REQ-1688's measure and sets
   the check's thresholds from the test set, as RES-1600 does for Jev;
5. writes one row to the `bakeoff` table keyed by check, judge, model file
   hash, runtime build, the hash of the check's fixed prompt, the test set's
   version and the in-flight count, with the agreement, the p95 latency, the
   thresholds and whether each test passed. Each of these inputs changes the
   answers or the latency, so a row holds only for all of them together.

A local run spends nothing from the $25 bake-off bucket, because a local call
has no price.

### Which model answers a check

The server resolves each judge check to one route at start and again on each
60-second probe, which reads the judges' files and any new `bakeoff` rows, so a
new file or a new passing row takes effect within a minute with no restart.
The route rests on evidence alone, in this order:

1. A local judge, when a judge in `LOCAL_JUDGES` serves a file whose hash and
   runtime build have a `bakeoff` row passing both tests for the check, with
   the check's current prompt hash, the current test-set version and the
   current in-flight count. Among several, the one with the
   highest agreement wins. Judges within one percentage point tie, the margin
   REQ-3916 imposes, which on a test set of a few hundred items is below its
   sampling error, so a smaller gap says nothing about which judge is better;
   a tie goes to the judge that passes the most checks, then to the one with fewer
   parameters (REQ-3916).
2. Otherwise `JUDGE_MODEL`, when `JUDGE_CHECKS` names the check and ADR-0100's
   start-up check found its passing record (REQ-3924).
3. Otherwise `SAFETY_MODEL` (REQ-3924).

A passing local judge wins over Jev. I chose this because the owner asked on
2026-09-27 for a local analogue, and a local judge that passed both of the
check's tests meets the same evidence standard Jev met. The route ignores a
local model the owner hasn't configured, because only a served model has a
file to hash.

The server appends one `judge_route_changed` event, which this decision owns,
for each check whose route differs from the last one logged. Its payload holds
`check`, `route` (`local`, `hosted` or `safety`), `model` (the local judge's
name or the hosted model id), `modelHash` (the file hash for a local judge,
otherwise null), `runtimeBuild` (null for a hosted route) and `reason`
(`startup`, `file_changed`, `prompt_changed`, `test_set_changed`,
`in_flight_changed`, `bakeoff_record` or `config_changed`). The event records evidence, so it appears only when a
file, a prompt, a row or the configuration changes, about 10 events at most
each time.

Whether a judge can answer now is a separate state, `up`, `unverified` or
`down`. A check whose route is local and whose judge isn't `up` is sent to its
standby route, the one the list above gives when the local judge is left out.
The route and the event don't change while that lasts.

### Start-up and file changes

Before the server sends a local judge any check, it confirms three things
(REQ-3922):

1. `GET /health` answers.
2. `GET /props` names the file the entry names and the runtime build. The
   server reads that file's SHA-256 through the read-only mount and caches it
   by path, size and modification time in the service table
   `local_judge_files`, because hashing a 10 GB file takes seconds and the
   file seldom changes.
3. A warm-up request for each check routed to the judge, one per slot, with a
   fixed synthetic text, returns an answer REQ-3912 accepts. Each warm-up
   call may take up to 30 seconds, a limit I chose to cover a cold load and a
   cold 3,000-token prompt, which RES-3910 puts at 3.4 to 4.2 seconds.

The server listens while these run. Until a judge passes them, it stays
`unverified` and its checks go to their standby route, because a start that waited on the judge would keep her
waiting on a process she can't fix. This replaces, for a local judge, the
catalogue and zero-retention checks of ADR-0100 part 5, which read OpenRouter
lists that don't describe a file on the Mac. I read REQ-1644's "model
catalogue" for a local judge as the judge's own `/props` answer, and a
configured file that the runtime doesn't serve fails it.

While the server runs, it probes each judge every 60 seconds with
`/health` and `/props` and restats the file. I chose 60 seconds as the longest
a changed file may go unnoticed, for the cost of two local requests a minute.
When the hash, the runtime build, a check's prompt hash, the test set's
version or the in-flight count differs from the row a check passed on, the server stops sending that judge the check at once and
resolves the route again (REQ-3920). Only the checks whose row doesn't match
are held back. They return within a minute of `tools/bakeoff.ts --local`
writing a passing row for the new inputs.

### A local judge's answer

Each local request puts the check's fixed prompt first and the cleaned text
after it, so the prompt cache reuses the fixed part and processes about 300
tokens a call (RES-3910). The request names a slot (`id_slot`) that belongs to
that check, so each check's prefix stays warm in its own slot. It sets
temperature 0, a fixed seed and thinking off, so the same text gets the same
probabilities and the thresholds hold, and it asks for one output token, a grammar that
allows only the check's labels and `n_probs` at least as large as the label
set. The labels are the Latin capitals `A` to `H`, which the prompt maps to
the check's answers. The bake-off refuses a candidate whose tokenizer, read
through `/tokenize`, splits a label into more than one token. A check with
more than 8 answers stays on its hosted route; I chose 8 because the prompt
maps each letter to an answer in its fixed part, and a longer map lengthens
every check's prompt and gives the small candidates more letters to confuse.

The gateway reads the probability the runtime reports for each label token at
the answer position and renormalises them over the label set. It treats the
answer as an error when the chosen label is outside the set, when any label's
probability is missing, or when a value falls outside 0 to 1 (REQ-3912). An
error, a timeout past ADR-0100's 1500 ms, or a request over the slot's 4,096
tokens sends the same question to `SAFETY_MODEL`, as REQ-1690 requires. After
3 errors or timeouts in a row, the gateway marks the judge `down` and sends
its checks straight to their standby route. I chose 3 because one timeout can
be a passing load on the GPU, and three in a row cap her extra wait at 4.5
seconds before the gateway stops trying. The next probe that passes warms the
slots again and marks the judge `up`.

A local judge reads the same cleaned text a hosted judge reads (REQ-5212).
RES-3910 conclusion 12 left open whether it could read her raw text, and
REQ-5212 settles it for every judge. Each model that answers a check applies
its own thresholds: a local judge those of its `bakeoff` row, and
`SAFETY_MODEL` and Jev those RES-1600's bake-off set for them, so a fallback
never reads a local judge's thresholds.
REQ-1690 settles the other question conclusion 12 left open: the fallback is
`SAFETY_MODEL`, not Jev and not no model.

### Keys, costs and the log

A local call carries no OpenRouter key, reserves nothing and costs $0. Every
hosted judge call, Jev's and `SAFETY_MODEL`'s as the fallback, goes on the play
key in `play` mode and counts inside its monthly limit (REQ-2732). A static
test asserts that the key table gives `JUDGE_MODEL` and `SAFETY_MODEL` the play
key in `play` mode. Every local call writes an `llm_log` row with provider
`local`, the judge's name, the file hash, cost 0 and no key, because the p95
latency and the fallback share are read from that table. In `replay` mode the
gateway answers local requests from `tests/recordings/` by the request's hash,
which includes the judge's name and file hash, so no automated check calls a
local judge (REQ-2950). `verify --record` records them on the family Mac.

### What the Parent Room says

The Parent Room's page on what leaves the Mac lists each check on her text.
For each check it says where the check runs, on the Mac or at a company, and
for each company, the fallback included, the company, its country and whether
it keeps any of her text (REQ-2648). The server builds the list from the route
table when the parent opens the page, and takes the company, country and
retention from the provider facts the gateway checks at start-up (ADR-0100).
A check whose route is local while its judge isn't `up` shows its standby
route with the line «Сейчас проверка идёт через интернет» (right now the check goes over
the internet). The Russian strings live in ADR-0160's content file. A test
builds the page for three configurations, no local judge, one judge taking
some checks and a judge that is `down`, and compares every row with the route
table and the judges' states.

### Failure states

Each state has one audience, and the player sees none of them: a check on a
hosted route reads the same to her.

| State | Next step | Audience |
| --- | --- | --- |
| `model_config_invalid`: more than 2 local judges, a missing or short key, a file outside `models/`, or a candidate whose card lists no Russian | `./meowtower up` or the bake-off names the entry and the fault and starts nothing for it | the owner |
| `local_judge_unverified`: the judge doesn't answer at start, serves another file, or fails its warm-up | its checks go to their standby route; the probe retries every 60 seconds | the owner, in `./meowtower status` |
| `local_judge_down`: 3 errors or timeouts in a row | its checks go to their standby route until a probe and a warm-up pass | the owner, in `./meowtower status` |
| `local_judge_falling_back`: in one game day, more than 5 % of the checks routed to a judge were answered elsewhere, by a fallback or a standby route | one notice when the share first passes 5 %, naming the share, the day's local p95 latency, the hours the fallbacks fell in and the judge's state; it fires again only after a game day below 5 %, or when the share doubles, because a doubling is new information and a steady share is not | the owner, in `./meowtower status` and the Mac's notices |
| `local_judge_retest`: the file hash, the runtime build, a check's prompt hash, the test set's version or the in-flight count differs from the row a check passed on | the checks it held take their hosted route; one notice per changed input, naming it and `tools/bakeoff.ts --local` | the owner, in `./meowtower status` and the Mac's notices |
| `judge_fell_back`: a local judge erred, timed out or gave an answer REQ-3912 refuses | the same question goes to `SAFETY_MODEL` | the owner, in `llm_log` |

`local_judge_unverified` and `local_judge_down` both send checks to their
standby route. They stay two states because the owner fixes the first by
looking at the configuration and the second by looking at the process.

### The security boundary

The boundary protects her cleaned text and the answers that decide her
safety path. The threats, most likely first:

1. Another device on the home network, the iPad included, calls the judge
   directly and skips the gateway's checks. The loopback binding and the key
   stop it (REQ-3910).
2. Her text carries an instruction that tries to flip the verdict. The
   grammar allows only the labels, the triggers run first on her raw text,
   and a model never lowers a trigger's level (REQ-1836).
3. A model file from a community conversion, such as Shieldstral's, is
   crafted to exploit the runtime's file parser. The owner downloads each file
   once from the repository the candidate list names, and the hash pins it
   after that; I accept the rest of this risk, because the process runs as the
   owner's user with no key that spends money.
4. Someone reads `LOCAL_JUDGE_KEY` from `.env`. It buys judge answers and
   nothing else.

### What works once this is accepted

With `LOCAL_JUDGES` empty, the game runs on ADR-0100's routes. Once the owner
installs llama.cpp, downloads the candidates and runs the local bake-off, each
check that a local model passes moves to it within a minute, and the others
stay where they were. The stage 0 tests of the loopback binding and of the
label probabilities haven't run yet, so no check can move before them. The
test sets are RES-1600's and REQ-1688's work and don't exist yet either. The
Parent Room page needs ADR-0180's Parent Room; until it lands, the route table
and the `judge_route_changed` events exist, and no screen shows them.

## Why

RES-3910 settles most of the design. A judge that uses the GPU has to run as a
native process, llama.cpp's server documents every feature the judge needs,
and a check fits the 1500 ms timeout only with a warm prompt cache. RES-3910
also found that no published figure measures any candidate on Russian checks
like the game's. So the design decides nothing about which model is good. It
builds the path by which each check's own test decides, and it leaves every
check where it is until that test passes.

The per-check route follows from REQ-3916, REQ-3924 and the gate ADR-0100
already runs per check and per model. Computing the route from the `bakeoff`
table, in place of a hand-written list, makes REQ-3916's rule a program: the
owner can't give a check to a model that failed it, and a new passing row
moves the check without an edit to `.env`.

The hash and the runtime build pin the thresholds. RES-1600 pins Jev to one
version because each threshold holds for one version. A file on the Mac is
pinned by its hash (REQ-3920). I added the runtime build, which REQ-3920 does
not ask for, because a llama.cpp upgrade can change how the same file
tokenises a label or reports its probability, and the thresholds would then
hold for a runtime nobody tested.

The warm-up and the slot per check follow from RES-3910's latency finding: a
cold 3,000-token check takes about 3.4 to 4.2 seconds on an M4 Max, and a
cached one about 0.34 to 0.55 seconds by estimate. Without the warm-up, the
first checks after every restart would miss the timeout and send her text to
Google anyway.

The strongest objection is that this buys little and costs a moving part.
RES-2700 puts Jev at about $0.15 a month, TypeSafe already keeps nothing
through the zero-retention route, and the Master still reads the same cleaned
text at Mistral. Against that, the design adds the first native process to a
system ADR-0010 built as containers. A macOS update, a Homebrew change or a
cold cache can each break it, and each failure sends her text out on the
fallback while the owner may not notice. A second part of the objection is
statistical: a local model can match the reference on a test set's average
and still miss the rare serious signal more often. I keep the design because
the owner asked for a local judge, because it also answers during a network
fault when ADR-0110 would otherwise let the trigger's level stand alone, and
because the gate bounds the harm. The worst case isn't today's routes: a check
Jev holds today, once moved, falls back to `SAFETY_MODEL` on every local error
or timeout (REQ-1690), so her text for that check can reach Google where today
it reaches TypeSafe, up to the fallback share, which the notice and the
reversal below cap at 5 %. The statistical part
belongs to REQ-1688's agreement measure, which the specification has to weight
toward the serious class; I list it under What this does not settle.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: Jev on OpenRouter's zero-retention route, `SAFETY_MODEL` as fallback | answers in 70 to 500 ms with no warm-up, nothing to install or keep running on the Mac, Choice and Score native | the owner asked for a local analogue on 2026-09-27, and ten approved requirements now govern one; TypeSafe keeps reading her text, and no judge answers during a network fault |
| Ollama as the runtime | the simplest install, a desktop app, models managed for the owner | the FAQ RES-3910 read names no authentication setting, so REQ-3910 would rest on a loopback binding nobody has tested under the container runtime; it unloads a model after 5 idle minutes and runs one request at a time by default, which lose the warm cache and the parallel checks |
| The judge in a container, through Podman with krunkit | keeps ADR-0010's all-container setup and its hardening | it means leaving the current container runtime for Podman, and prompt processing runs 40 to 50 % slower (RES-3910), which eats most of the 1500 ms |
| One local model, chosen now by hand, for every check | one model, one threshold set, no route computation | REQ-3916 makes the choice per check from test results, and a choice made now would pass over Shieldstral's chance on the yes-or-no checks before any Russian figure exists |
| MLX's `mlx-lm` server as the runtime | Apple's own framework, tuned for the Mac's GPU | its guide says it "is not recommended for production" and documents no schema or grammar limit, so REQ-3912's fixed answers would rest on the prompt alone (RES-3910) |
| A local judge that reads her raw text | it would see the names RES-1800 says can matter to a signal | REQ-5212 requires cleaned text for every judge, and a local judge on raw text would need thresholds its cleaned-text fallback can't share |

## What it costs

The owner does more work. They install llama.cpp once and download about 35
to 40 GB of candidate files at Q8_0 for the stage 0 bake-off, by RES-3910's
rule of about one byte a parameter, then keep only the files that won a check. They run the local
bake-off on the family Mac at stage 0 and again after each model or runtime
change, while no adventure is open. The parent labels no new data, because the
local run reuses REQ-1688's test sets.

The system gains a process outside Docker's hardening that `./meowtower up`
starts, launchd restarts and `./meowtower status` reports. The gateway gains a
route, a probe, a warm-up, a circuit breaker and the route table. Each change to a
check's prompt, its test set or the in-flight count now needs a local rerun
as well as a hosted one, because the `bakeoff` row is keyed by all three and
the old row stops matching.

The Mac carries one or two resident models of about 3.5 to 13 GB each at Q8_0,
plus their slots, whenever the game runs. The family's other use of the Mac
pays for this, in memory and in GPU time, and a heavy job on the GPU in turn
slows the judge.

She pays in waiting and in exposure. Each local error or timeout adds up to
1500 ms before the fallback call starts, and a judge failing in a row adds up
to 4.5 seconds before the gateway stops trying it. A check that Jev held and
that moved to a local judge sends her text to `SAFETY_MODEL`'s provider on
each fallback, where today it goes to TypeSafe.

The interruption budget: the owner gets at most one notice per changed input
of a `bakeoff` row, and one per judge when its fallback share passes
5 %, repeated only after a game day below 5 % or when the share doubles. The parent gets
none; the Parent Room page shows the routes when opened and never notifies.
Nobody acts in real time: a judge that is down sends its checks to their
standby route, and play goes on.

If nobody attends for two weeks, play goes on with no data lost. A judge that
is down or held back costs only that her text takes the hosted route, which
the Parent Room page shows. The one pile that grows is `models/`, which
reports once to the owner at 50 GB, a ceiling I chose because the whole stage
0 candidate set is about 35 to 40 GB, so passing 50 GB means files are left
over from a later trial. Nothing drains `models/`
automatically, because a file no route uses may be the one the owner rolls
back to. `llm_log` gains about 40 local rows an adventure, inside ADR-0100's
90-day drain and 1 GB notice. The `bakeoff` table gains one row per check,
candidate, file, prompt and test-set version, a few hundred rows a year.

## What would reverse it

- The stage 0 local bake-off passes no check for any candidate on the family
  Mac. Then `LOCAL_JUDGES` stays empty and the local route leaves the code at
  the next stage, because a route that never runs goes untested.
- In the first month of play, more than 5 % of the checks routed to local
  judges are answered by another route, a fallback or a standby route alike,
  by the measure of `local_judge_falling_back`. Then the warm cache or the
  process doesn't hold in real play, her text leaves the Mac anyway, and the
  checks return to their hosted route until the cause is found. I chose 5 %
  because at about 40 checks an adventure it is two checks, above the one a
  single cold start costs and low enough that the local judge still keeps
  almost all of her text on the Mac.
- launchd fails to bring a judge back after a Mac restart on two occasions in
  the first month. Then the judge moves under the same fix ADR-0010's second
  reversal gives the server.
- The container runtime on the Mac gains Metal access for Linux containers.
  Then the judge moves into a container beside `tower`, and the native process
  goes.

## Consequences

- `.env` gains `LOCAL_JUDGES` and `LOCAL_JUDGE_KEY`. `compose.yaml` mounts
  `models/` read-only into `tower` and `tools`, and `models/` joins
  `.gitignore`.
- `./meowtower up` gains the launchd agents, the pin on llama.cpp and the key
  generation. `./meowtower down` unloads the agents, and `./meowtower status`
  prints one line per judge with its state and the game day's share of its
  calls that fell back to `SAFETY_MODEL`, read from `llm_log`.
- The `bakeoff` table gains the columns judge, model file hash, runtime build,
  prompt hash, test-set version, in-flight count, p95 latency and the two pass
  flags. `tools/judge-candidates.json` and the
  service table `local_judge_files` are created.
- The event type `judge_route_changed` joins ADR-0020's log with the payload
  above.
- ADR-0190's group 1 gains the language check on candidates, and its Baselines
  table gains the numbers listed under Amends.
- The specification counts the checks in flight in one turn from ADR-0110,
  lists the label set of each check and fixes each check's slot count.

## Amends

- ADR-0100: "It's the only code in the game or its tools that opens a connection to an external model service" becomes "It's the only code in the game or its tools that opens a connection to a model service, the local judges of ADR-0350 included".
- ADR-0100: "A `JudgeRequest` goes only to `JUDGE_MODEL`" becomes "A `JudgeRequest` goes to the route ADR-0350 resolves for its check: a local judge, `JUDGE_MODEL` or `SAFETY_MODEL`".
- ADR-0100: "When Jev errs or passes its timeout of 1500 ms, the gateway sends the same question to `SAFETY_MODEL`" becomes "When the judge that answers a check, local or hosted, errs, passes its timeout of 1500 ms or gives an answer REQ-3912 refuses, the gateway sends the same question to `SAFETY_MODEL`".
- ADR-0100 part 5: the start-up check gains "for a local judge, the health, served-file and warm-up checks of ADR-0350 replace the catalogue and zero-retention checks, and a failure sends its checks to their standby route without stopping the server".
- ADR-0100 part 6: "Every call, the judge's included, writes a row to `llm_log`" gains "a local judge's call writes one with provider `local`, its file hash, cost 0 and no key, and reserves nothing".
- ADR-0100: "It names TypeSafe, in the United States, as the company that reads her cleaned text for safety checks and keeps none of it (REQ-2642)" becomes "It lists each check on her text with where it runs and, for each company, the fallback included, its name, country and retention, built from the route table when the page opens (REQ-2648)", and the disclosure test compares the page with the route table.
- ADR-0100: the `judge_fell_back` row "Jev erred or timed out" becomes "the check's judge, local or hosted, erred, timed out or gave an answer REQ-3912 refuses".
- ADR-0100: "The bake-off tool, `tools/bakeoff.ts`, sends every candidate through the gateway with the tier and provider list play would use" gains "and a local candidate through the gateway's local route on the family Mac, measuring its p95 latency as ADR-0350 sets".
- ADR-0100: the reversal "The owner decides the Mac can run a model for the player tier" is met for the judge's checks, one check at a time, by ADR-0350's gate.
- ADR-0110 step 5.6: "the safety check by `JUDGE_MODEL`, or `SAFETY_MODEL` as its fallback" becomes "the safety check by the judge ADR-0350 routes it to, or `SAFETY_MODEL` as its fallback".
- ADR-0120 step 6 and ADR-0130 step 4: "on `JUDGE_MODEL` (Jev) ... and on `SAFETY_MODEL` when Jev errs or times out" becomes "on the judge ADR-0350 routes the check to, and on `SAFETY_MODEL` when that judge errs or times out".
- ADR-0010 and SPC-0010: "`up` runs `docker compose up -d` and `caffeinate`" gains "and loads a launchd agent for each judge in `LOCAL_JUDGES`", and `status` gains one line per local judge with its state and the day's fallback share.
- ADR-0190: row 5 "recorded OpenRouter answers, Jev's among them" becomes "recorded model answers, the local judges' and Jev's among them", and "Jev as `JUDGE_MODEL` or `SAFETY_MODEL` as RES-1600 assigns it" becomes "the model ADR-0350 routes the check to".
- ADR-0190: the answered question 8, "Jev: the judge model on OpenRouter's zero-retention route", gains "or, check by check, a local judge that passed ADR-0350's gate".
- ADR-0190: the Baselines table gains "Local judge p95 per check | at most 1500 ms, warm, at 6 in flight | ADR-0350 | imposed by REQ-3914", "Local judge probe | every 60 s | ADR-0350 | chosen", "Local judge marked down | after 3 errors or timeouts in a row | ADR-0350 | chosen", "Local warm-up call | at most 30 s | ADR-0350 | chosen", "Local judge context | 4,096 tokens a slot | ADR-0350 | chosen", "Local judges | at most 2 | ADR-0350 | chosen", "Labels per local check | at most 8 | ADR-0350 | chosen", "Local judge fallback notice | more than 5 % of a game day's routed checks | ADR-0350 | chosen" and "`models/` | notice at 50 GB | ADR-0350 | chosen".

## How I will know it was realised

1. With `LOCAL_JUDGES` empty, a test resolves every check's route and finds
   the routes ADR-0100 gives, and a replayed adventure makes the same calls it
   made before this decision.
2. From the iPad and from a second machine on the home network, a completion
   request to each judge's port gets no model answer: the connection is
   refused, or the reply is 401.
3. A stage 0 test on the family Mac shows whether the `tower` container
   reaches a judge bound to `127.0.0.1`, and records which binding the Mac
   uses.
4. A test with a mocked local judge returns a label outside the set, a
   missing label probability and a probability of 1.2; each time the same
   question reaches `SAFETY_MODEL` and `llm_log` records `judge_fell_back`.
5. A route test over synthetic `bakeoff` rows gives a check to the judge at
   95 % over the one at 91 %, breaks a tie of 95.0 % and 94.5 % by the number
   of checks passed and then by parameters, and keeps on its hosted route a
   check whose only local row failed latency.
6. A test changes the served file's hash while the server runs, and a second
   test changes one check's prompt. Within 60 seconds the checks whose row no
   longer matches take their hosted route, one `local_judge_retest` notice
   appears for each change, and the other checks don't move. A passing row
   written after that moves them back within 60 seconds, with no restart.
7. A test starts the server with a judge down. The server listens, the
   judge's checks go to their standby route while their route stays local,
   no `judge_route_changed` event is appended, and `./meowtower status` names
   `local_judge_unverified`; when the judge comes up, its calls resume after
   the warm-up.
8. The group 1 check fails a candidate list entry whose card languages omit
   Russian and passes one that gives only a count.
9. The disclosure test builds the Parent Room page for the three
   configurations and finds every row equal to the route table and the
   judges' states.
10. A static test finds the play key on `JUDGE_MODEL` and `SAFETY_MODEL` in
    `play` mode and no key on a local call.
11. At stage 0 on the family Mac, each check that moved has a `bakeoff` row
    with p95 at or under 1500 ms at 6 in flight. In the first week of play,
    `llm_log` shows the local calls' fallback share and their p95 latency
    beside the bake-off figure.

## What this does not settle

- Which model answers which check. The stage 0 local bake-off decides it, and
  it may decide that every check stays hosted.
- How REQ-1688's agreement is measured, and whether it weighs the serious
  class of the signal check apart from the average. The specification sets
  the measure; I'd weight it, because an average can hide a missed serious
  signal.
- The test sets themselves, which RES-1600 and REQ-1688 own.
- The Master and every role that writes text, which stay on ADR-0100's routes.
- Whether `JUDGE_MODEL` stays Jev for the checks no local judge passes. It
  does until an approved decision names another model (REQ-1656).
- The exact prompt text of each check and its label mapping, which the
  specification writes from ADR-0110's checklist.

A premortem, written as though it had already happened. The stage 0
bake-off ran on a quiet Mac in the evening, and every check that moved passed
latency with room to spare. In play, the parent's video exports shared the GPU
on weekday afternoons, local p95 rose past 1500 ms, and a fifth of the
afternoon's checks fell back to Gemini. The fallback notice fired once. The
owner read it as a model problem, reran the bake-off in the evening, saw every
check pass and changed nothing, and her afternoon text went to Google for a
month. The test had measured an idle Mac. The notice now names the day's local
p95 and the hours the fallbacks fell in, which points at the load on the Mac,
and the reversal on a fallback share above 5 % in the first month returns the
checks to their hosted route if the load can't be moved.

## Open review findings

- The second agent review asked for a shorter title, with the fallback
  binding moved into Decision. I keep the title, because a list of decisions
  reads as a list of positions (D3) and the approved decisions ADR-0080 and
  ADR-0100 carry titles of the same length.
- The second agent review asked to move the `judge_route_changed` payload, the
  `bakeoff` columns and the Russian line of the Parent Room page to the
  specification. I keep the payload, because the decision that needs a new
  event type names it and its fields and owns it. The columns and the line
  stay as the smallest statement of what the table and the page must hold;
  the specification may rename them.

Amended by ADR-0360, approved on 2026-09-28, whose `## Amends` section changes parts of this record; where it differs from the text above, it holds.
