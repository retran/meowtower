---
id: RES-3910
artifact: research
status: approved
revised: 2026-09-27
elaborates: RES-1600
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An open model on the Mac host can answer the judge's fixed-answer checks inside 1500 ms only with a warm prompt cache, and the stage 0 test set has to show which model takes each check and whether the checks split

## Summary

An open model can take Jev's checks on the family Mac, but it has to run as a native macOS process beside the containers, because no container runtime on macOS that I read about gives a Linux container the Mac's GPU through Metal. llama.cpp's server fits the role best of the runtimes I read. It installs from Homebrew with Metal on by default, constrains output with a grammar or a JSON schema, returns token probabilities, keeps a prompt prefix cached and takes an API key. The evidence favours one general instruction model, from Qwen3.5 9B or 4B or Gemma 4 12B or E4B, taking every check. Each answer is read as a probability from the logprobs of a one-token label, so the thresholds work as they do with Jev. Shieldstral 3B, Mistral's policy-adaptive yes-or-no classifier with Russian among its twelve languages, is the strongest challenger for the yes-or-no safety checks. So the split between safety checks and judgement checks is a question for the stage 0 test set, per check. A published M4 Max benchmark puts prompt processing near 700 to 900 tokens a second for a 7B model. A cold 3,000-token check then takes about 3.4 to 4.2 seconds and misses the 1500 ms timeout, while a check that reuses a cached prefix fits it by my estimate. No published evaluation measures any of these models on Russian checks like the game's, so the Russian quality stays unknown until the test set runs. This record compares four options, keeping Jev among them, and leaves the choice to the decision step. It doesn't cover the Master or any role that writes text.

The reader is evaluating the design: the owner and the decision step that follows.

## The question

The owner said on 2026-09-27: "regarding Jev - I guess we can use some open source analogue locally." Today the approved record makes Jev, TypeSafe's decision model reached as `typesafe/jev-1.13` through OpenRouter's zero-retention route, the `JUDGE_MODEL`. Jev answers every check with a fixed set of answers: the safety check on her cleaned free text and on each Master reply, the shaming check, the creepiness level, the signal level none, everyday or serious, sorting free text into a scene's options, and the safety step of the explanation and frame checks (RES-1600). `SAFETY_MODEL`, `google/gemini-3.8-flash`, is its fallback, and a check moves to the judge only after the judge matches that model on a labelled Russian test set at the stage 0 bake-off (RES-1600, RES-2600). The question is which open model, run on the Mac, should answer those checks in Jev's place, and how it runs beside the server, which lives in a Linux container under OrbStack (ADR-0010).

The question assumes one local model takes every check, as Jev does. That assumption comes from Jev's own design: Jev is one model with three question types, Noul (yes or no), Choice and Score. The open models split along a different line. Safety classifiers are trained on a fixed or a written policy and answer yes or no, and general instruction models answer any question but were never trained as classifiers. The game's checks also split: the safety, shaming and placeholder-safety checks are yes-or-no questions against a written checklist, while the creepiness level, the signal level and sorting into options are Choice and Score questions that no safety taxonomy names. So the question has to stay open on whether one model is enough, and the findings below answer it with a rule that decides per check.

The question also assumes that a local judge keeps her text at home. It keeps the judge's copy at home, but the Master still reads the same cleaned free text at Mistral, because the Master has to react to it (RES-1600). The finding on privacy below measures what a local judge actually keeps home.

## Method

On 2026-09-27 I read the approved records that name Jev: RES-1600 (the model table and the resolved finding on Jev), RES-1800 (the signal level), RES-2600 (the privacy tiers and the Jev route), RES-2700 (the cost of Jev's checks), RES-3000 (what Jev is), ADR-0100 (the gateway, the judge's 1500 ms timeout and the start-up check), ADR-0110 (where the checks run in a scene), ADR-0010 (the containers) and the twelve approved requirements that name or govern the judge model. I searched `project/` for "jev", "judge", "typesafe", "local model" and "ollama".

On the web, on the same day, I read the model cards of Llama Guard 4, Qwen3Guard-Gen-4B and 8B, ShieldGemma 2, Granite Guardian 3.3 and 4.1, Shieldstral 1.0, Qwen3.5-9B, Qwen3.8-27B, Qwen3.8-Flash-Next, Gemma 4 and Llama 3.1 8B. I read the Qwen3Guard, HaloGuard 1.0, PolyGuard and ML-Bench&Guard papers and an April 2026 benchmark of fourteen open guard models. For the runtimes I read llama.cpp's server README, build guide and install guide, Ollama's structured-output page, FAQ, v0.12.11 release notes and two MLX blog posts, the `mlx-lm` server guide, OrbStack's networking page and its GPU feature request, the llama.cpp discussions on Apple silicon speed and on GPU-backed containers, a post by Chariot Solutions on Docker and Ollama, and search results on Docker Model Runner.

I ran no model and measured nothing on the family Mac, because neither Ollama nor llama.cpp is installed there. Every latency below is therefore a published figure or my arithmetic on one. I found no per-language table with Russian in the PolyGuard paper's HTML, no per-language figures for Russian in the Shieldstral, HaloGuard or Gemma 4 material, and no Russian-specific safety benchmark that evaluates any of these models. I found no published prefill figure for a 3B, 4B or 9B model on an M4 Max, and no statement from OrbStack on whether `host.docker.internal` reaches a Mac service bound to `127.0.0.1`. I didn't read Docker Model Runner's own documentation, only search results describing it, so I record nothing about it as a finding beyond what those results claim. I didn't read which GPU variant the family's M4 Max has.

## Findings

### The approved record ties Jev to twelve requirements and five decisions, and six of the requirements are model-neutral

Five approved requirements name Jev or TypeSafe in their text. One puts "TypeSafe for Jev only" in the player-tier provider list. One says the company that reads her cleaned text "is now TypeSafe, in the United States". Three define the judge model as "now Jev": the rule that a judge request carries only cleaned text, the rule that the judge's calls go "on the play key", and the rule that automated checks make no live judge call. A local model has no use for the play key. Six more speak of "the judge model" without naming one: the fixed-answer rule, the per-check test-set gate, the fallback on error or timeout, the placeholder rule for the explanation's safety check, and the two rules that cost and budget every call. They hold for any judge, though a local judge incurs no cost for the last two to count. The twelfth makes the server refuse to start when a configured model, "the judge model" included, "is missing from the model catalogue", which is OpenRouter's catalogue in ADR-0100 and has no meaning for a model file on the Mac.

ADR-0100 names `typesafe/jev-1.13` as the judge's default, puts `JUDGE_MODEL` in the player tier and adds `typesafe` to the provider list. It sets the 1500 ms timeout "as three times the 500 ms upper latency RES-1600 cites" and has the Parent Room page name "TypeSafe, in the United States". Its own alternatives table rejected "A local model on the Mac for the player tier" because "RES-2600 found no Mac-sized model in the Russian bake-off", a finding made about models that write the story. Its reversal list says the local route replaces the player tier for a role once "The owner decides the Mac can run a model for the player tier". ADR-0110, ADR-0120 and ADR-0130 name Jev as the judge in their check steps, and ADR-0190 lists "Jev's among them" in its recorded answers and answers the Jev question as "the judge model on OpenRouter's zero-retention route". Among the research records, RES-0600, RES-0720, RES-1600, RES-1800, RES-2500, RES-2600, RES-2700, RES-2900, RES-3000 and RES-3900 mention Jev.

### No container runtime on this Mac gives a Linux container the GPU, so the model has to run on the Mac host

OrbStack's feature request for GPU acceleration in containers, opened on 2025-03-05, was still open on 2026-09-27 with no assignee and no maintainer reply that I could see. Chariot Solutions found in February 2024 that Ollama in Docker Desktop on an M1 Mac saw "no GPU detected", while the same Ollama run natively offloaded "33/33 layers to GPU" through Metal, and advised "Don't virtualize Ollama in Docker". The one working route to a GPU from a container that I read is Podman with krunkit, which passes Vulkan through a paravirtual GPU. On an M2 Max it ran llama.cpp at 428 tokens a second for prompt processing against 746 natively, and at 35.9 for generation against 71.4 (llama.cpp discussion 12985, April 2025). That is about 40 to 50 % slower. That route also means leaving OrbStack for Podman.

Search results on Docker Model Runner say it runs llama.cpp as a native host process with Metal and proxies requests from containers at `model-runner.docker.internal`. I didn't read Docker's own documentation, and I found nothing on whether it works under OrbStack, so I treat it as unverified. The finding that holds is this: a judge that uses the GPU runs as a native macOS process, and the `tower` container calls it across the virtual machine boundary.

### A container under OrbStack reaches a Mac service at host.docker.internal, and the binding address is unverified

OrbStack's networking page says "You can use the `host.docker.internal` domain to connect to a server running on Mac". The page doesn't say whether the Mac service must listen on all addresses or whether one bound to `127.0.0.1` is reachable, and the answer decides who else can call the judge. Ollama "binds 127.0.0.1 port 11434 by default" and widens with `OLLAMA_HOST`, and llama.cpp's server takes `--host`. A service that listens on all addresses is also open to every device on the home network, the iPad included. llama.cpp's server takes `--api-key`, which closes that gap, and its `/health` endpoint "is public and requires no authentication". Ollama's FAQ, which I read, names no authentication setting. A stage 0 test on the family Mac has to settle whether loopback binding works under OrbStack.

### llama.cpp's server gives the judge everything Jev's interface does; Ollama gives most of it; MLX's server does not

A judge needs four things from its runtime. It needs output limited to the allowed labels, a probability for each label, a warm prompt prefix and a stable local endpoint.

llama.cpp's server README documents all four. It takes a GBNF `grammar` and a `response_format` of `{"type": "json_schema", "schema": {...}}` on `/v1/chat/completions`. It returns `n_probs`, `logprobs` and `top_logprobs`. It has `cache_prompt`, "Re-use KV cache from a previous request if possible", on by default, and `--parallel N` server slots. Its build guide says "On MacOS, Metal is enabled by default", and its install guide gives `brew install llama.cpp`.

Ollama takes a JSON schema in `format`, or `response_format` on its OpenAI-compatible API. It has returned log probabilities, with `top_logprobs`, since v0.12.11 of 2025-11-12, whose notes name "classification tasks" as a use. A GitHub issue says `top_logprobs` is capped at 20, which is enough for any label set here. It unloads a model after 5 minutes unless `keep_alive` or `OLLAMA_KEEP_ALIVE` says otherwise, and `OLLAMA_NUM_PARALLEL` defaults to 1. Its MLX engine arrived as a preview on 2026-03-30 for Macs "with more than 32GB of unified memory", first for Qwen3.5-35B-A3B, and by 2026-06-11 it also served Gemma 4 12B. Neither MLX post says whether structured output or log probabilities work on that engine.

The `mlx-lm` server returns logprobs, but its guide says "The MLX LM server is not recommended for production as it only implements basic security checks" and documents no schema or grammar constraint.

### A cold 3,000-token check misses the 1500 ms timeout on an M4 Max, and a check with a cached prefix fits it by estimate

llama.cpp's Apple silicon table gives, for its 7B test model at Q4_0, 714 tokens a second of prompt processing and 70 of generation on the 32-core M4 Max, and 886 and 83 on the 40-core one (discussion 4167). RES-2700 estimates about 3,000 input tokens a check, "for the checklist and the text". Processing 3,000 tokens cold then takes about 3.4 to 4.2 seconds on a 7B model, more than twice the 1500 ms timeout ADR-0100 sets.

Most of those tokens are the fixed checklist, which is the same on every call. With `cache_prompt` the server processes only the part that differs. By my estimate a suffix of about 300 tokens, her text and the question, takes 0.34 to 0.42 seconds on a 7B model, and one label token about 15 ms more. A 9B model would take about 0.45 to 0.55 seconds and a 4B model about half the 7B figure, if prefill scales inversely with parameter count. That is my arithmetic and not a measurement, and Qwen3.5's hybrid architecture may scale differently from the 7B test model. A 27B dense model would take about 1.3 to 1.6 seconds for the same suffix, too close to the timeout to leave room for anything else.

A cache helps only while it stays warm. Ollama drops a model after 5 idle minutes by default. A llama.cpp slot keeps one prefix, so the safety checklist, the creepiness question, the signal question and the sorting question each need their own slot to stay warm. ADR-0110 also runs the safety check and the creepiness Score in parallel, which needs two slots at once. For comparison, Jev answers in 70 to 500 ms by the source RES-1600 cites. I found no published cold-load time for these models on an M4 Max.

### A 3B to 9B judge fits in memory beside the server; a 27B one fits but misses the time

The community Q8_0 GGUF of Shieldstral 1.0 3B is 3.65 GB and its Q4_K_M 2.15 GB. By the usual ratio of about one byte a parameter at 8 bits, a 4B model takes about 4 to 5 GB at Q8_0 and a 9B model about 9 to 10 GB, plus the key-value cache for each slot. These are estimates, not file sizes I read. Any of them fits in the family Mac's 64 GB beside OrbStack's virtual machine and the server. The limit on size is time, as the finding above shows, and not memory.

### The fixed-taxonomy guards don't cover the game's checklist, and three of them don't cover Russian

Five open guard families were current on 2026-09-27. Only Qwen3Guard publishes Russian figures, and only Shieldstral and Granite Guardian accept a policy the game writes.

| Model | Sizes, licence | What it classifies | Russian |
| --- | --- | --- | --- |
| Llama Guard 4 | 12B, Llama 4 Community License | 14 fixed MLCommons hazards, text and images | not among its supported languages; 37.7 on Russian RTP-LX in Qwen's report |
| ShieldGemma 2 | 4B, Gemma licence | images only, three policies | training data "in English only" |
| Granite Guardian 4.1 | 8B, Apache 2.0, April 2026 | harm, bias, jailbreak, hallucination, and criteria the user writes, as yes or no with an optional reasoning trace | "only trained and tested on English data" |
| Qwen3Guard-Gen | 0.6B, 4B, 8B, Apache 2.0, report of 2025-10-16 | nine fixed categories at three levels: safe, controversial, unsafe | Russian RTP-LX prompts: 85.7, 90.7 and 91.9 (0.6B, 4B, 8B); Russian PolyGuard responses: 75.9, 79.0 and 78.2 |
| HaloGuard 1.0 | 0.8B, 4B, on Qwen3.5, CC BY 4.0, 2026-07-02 | the user's prompt only, against a fixed constitution of 29 harmful policies | Russian among 46 languages; no per-language figure |
| Shieldstral 1.0 | 3B, Apache 2.0, 2026-08-04 | any policy written in plain language, one per call, as a yes-or-no probability; text and images | Russian among twelve languages; no per-language figure |

The game's checklist asks whether a reply asks for personal data, claims to be human, discusses the heroine's abilities, judges or shames her, shows a Guardian defeated or uses a phrase of guilt or attachment (ADR-0110). Qwen3Guard's nine categories cover PII, self-harm, violence and sexual content, but none of the others. Its model card describes no way to add a category. HaloGuard reads only a prompt sent to an assistant, so it can't check the Master's replies. Llama Guard 4, ShieldGemma 2 and Granite Guardian leave out Russian, which the game's player text and Master replies are written in.

Qwen3Guard is still the only guard with a published Russian number. Its 4B model scores 90.7 on Russian prompts, where Llama Guard 4 scores 37.7 and PolyGuard-Qwen-7B 91.3 (Qwen3Guard report, table 5). Those prompts are general toxicity, not a child's game, so the figure shows the model reads Russian and not that it reads her text well.

### Shieldstral has Jev's shape for yes-or-no checks: a written policy in, one probability out

Shieldstral's model card says its score comes from softmax-normalising "yes" and "no" token probabilities at the final position into a value between 0 and 1. Mistral's cookbook gives the formula `score = exp(z_yes) / (exp(z_yes) + exp(z_no))`, a default threshold of 0.5, and prompts that carry an instruction, a yes-or-no query and the document. The policy is written in plain language at inference time, so the game's own checklist items can be the queries. That is what RES-1600 asks of Jev's Noul questions: a probability against a threshold the test set sets.

Shieldstral has three limits for this use. It answers "a single yes/no question per call", so a checklist of about a dozen items is a dozen calls unless the items merge into one question. It has no Choice or Score form, so it can't take the signal level, the creepiness level or sorting without turning each into yes-or-no questions. Its model card names "Uneven language coverage" as a limitation and publishes no Russian figure. The card lists vLLM, llama.cpp, SGLang and Transformers for serving. The only GGUF files I found are a community conversion.

### A general instruction model can take all three question types, with the label forced by a grammar and the probability read from logprobs

A general model answers a Choice or a Score as readily as a yes or no. A grammar or JSON schema that allows only the label set forces a valid answer, and the logprob of each label token gives the probability that RES-1600 thresholds. Both mechanisms are in llama.cpp's server and in Ollama, as the finding on runtimes shows.

The candidates I read are all Apache 2.0:

- Qwen3.5-9B, published in 2026 with a 4B sibling, claims 201 languages and dialects. It reports MMMLU 81.2, MMLU-ProX 76.3 and INCLUDE 75.6, and it thinks by default until `enable_thinking` is false, which a one-token judge must set.
- Gemma 4 comes in E2B, E4B, 12B, 26B A4B and 31B. Its model card, last updated 2026-07-30, claims "35+ languages" out of the box and gives MMMLU of 83.4 for the 12B and 76.6 for the E4B.
- Qwen3.8-27B, published in August 2026, misses the time budget by the latency finding. Qwen3.8-Flash-Next, with 125B parameters of which 6B are active, carries its own `qwen-community-1.0` licence and is too large to keep resident beside the rest.

Llama 3.1 8B lists eight supported languages, and Russian isn't one of them.

None of these model cards gives a Russian figure of its own, and none was evaluated as a classifier. MMMLU averages many languages, so it shows breadth and not Russian judgement. The benchmark of fourteen guard models from April 2026 tested English only.

### A local judge keeps one company and one copy of her text at home, and nothing it gains is large

RES-2700 estimates Jev at about $0.005 an adventure, about $0.15 a month, with the checks on `google/gemini-3.8-flash` at about $0.09 an adventure. A local judge has no per-call price, so the money saved is about $0.15 a month while Jev passes its gate, and up to about $2.70 in a 30-day month when Gemini takes every check.

The privacy gain is also narrow. Through OpenRouter's zero-retention route TypeSafe keeps nothing already (RES-2600). The Master reads the same cleaned free text at Mistral, and the frames and explanations the judge checks carry no text of hers (RES-0720, RES-0600). A local judge removes TypeSafe from the list of companies that read her text, and it keeps the judge's copy on the Mac.

The safety gain is larger than the privacy gain. ADR-0110 lets the trigger's level stand when neither the judge nor `SAFETY_MODEL` answers, so during a network fault a signal she writes in her own words reaches no model at all. A local judge still answers then. It could also read her raw text before the clean-up. RES-1800 notes that the clean-up removes names "that may matter to a signal", and RES-1800 conclusion 9 requires cleaning before text goes to "any external model service", which a process on the Mac isn't.

### The stage 0 gate already decides per check, so it can decide the split

RES-1600 moves a check to the judge only after the judge matches `google/gemini-3.8-flash` "on a labelled Russian test set of that check at the stage 0 bake-off". ADR-0100 has the server refuse to start when `JUDGE_CHECKS` names a check with no passing test-set record "for the configured judge". So the gate is already written per check and per model. A bake-off that runs local candidates on the same test sets decides which checks each candidate may take. That makes the split an outcome of the test, not a design choice made now.

The gate has two gaps for a local judge. The bake-off tool sends every candidate through the gateway to OpenRouter (ADR-0100), and it doesn't know a local endpoint. The gate also measures agreement and not time, although a local model can agree with the reference and still miss 1500 ms on the family Mac. RES-1600 pins Jev to one version, because each threshold is set on one version. A local model is pinned by its file, which the Mac holds, so a stable hash of that file does the same job.

### Four options answer the question, and each is better at something

| Option | Better at | Against it |
| --- | --- | --- |
| A. Do nothing: keep Jev through OpenRouter's zero-retention route, `SAFETY_MODEL` as fallback | Approved and written into five decisions. Answers in 70 to 500 ms with no warm-up. Costs about $0.15 a month. Nothing to install, keep alive or secure on the Mac. Jev answers Noul, Choice and Score natively with a probability. | Her cleaned text goes to one more company. TypeSafe says Jev is most accurate in English. Released on 2026-09-15 behind an alpha API. No answer during a network fault. |
| B. One general instruction model on the Mac host, taking every check, with grammar-forced labels and logprob probabilities | One model, one runtime and one threshold procedure for all three question types. Written checklist items need no taxonomy. Answers during a network fault. May read raw text. No company reads the judge's copy. | Never trained as a classifier. No Russian classification figure published for any candidate. Meets 1500 ms only with a warm cache. A native process outside Docker to keep running. |
| C. Split: Shieldstral 3B on the host for the yes-or-no safety and shaming checks, a general model for the Choice and Score checks | The safety checks go to a model trained to give a calibrated yes-or-no score against a written policy, Jev's own shape. Russian is in its language list. Its 3B size is fast. | Two models, two resident memory costs and two threshold sets. One policy per call multiplies the calls for a dozen-item checklist. No Russian figure published. Only community GGUF files. |
| D. Qwen3Guard-Gen-4B as a first safety layer, then a general model for the game's own items and the Choice and Score checks | The only guard with a published Russian score, 90.7 on RTP-LX prompts. Its "controversial" level gives a middle band. | Its nine categories miss most of the game's checklist, so the general model runs anyway. Three models to run in the worst case, for coverage the general model already gives. |

Option A is better at every operational measure: latency, setup, attention and a native Choice and Score. Option B is better at simplicity among the local routes and at covering the checklist as written. Option C is better at the safety checks themselves, if its training carries into Russian. Option D is better only at published Russian evidence, and that evidence is general toxicity.

The evidence favours option B as the design, with Shieldstral entered at the bake-off as a challenger for the yes-or-no checks, so option C happens only where the test set shows it wins. The runtime is llama.cpp's server on the Mac host, because it is the one runtime I read that documents grammar constraints, logprobs, a default prompt cache, parallel slots and an API key together.

The case against option B is strong. First, it buys little: about $0.15 a month and one company fewer, while the Master still reads the same text at Mistral. Second, it adds the first native process to a system ADR-0010 built as containers, one that `./tower up` has to start, a reboot has to restore, and nothing in Docker's hardening covers. Third, it meets the timeout only while its caches stay warm. After a reboot or a model reload the first checks of an adventure fall back to `SAFETY_MODEL`, and her text leaves the Mac anyway. Fourth, no published figure says a 4B to 9B general model judges shame, creepiness or a child's real-life signal in Russian as well as Gemini 3.8 Flash does. If it doesn't, the gate keeps every check on `SAFETY_MODEL`, which sends her text to Google at eighteen times Jev's price. Keeping Jev loses none of this. The only thing that settles it is the test set on the family Mac, and the verdict may be to abandon the local judge.

### The fallback decides whether her text still leaves the Mac

A local judge fails for local reasons: the process is down, the model is still loading, or the GPU is busy past the timeout. Its fallback can take three forms. `SAFETY_MODEL` on OpenRouter, as today, keeps every check answered but sends her text out whenever the local judge fails. Jev as the fallback keeps TypeSafe on the provider list. No model at all, with the triggers and the library as ADR-0110 already does when neither judge answers, keeps her text home and costs a live scene each time. The approved record chose the first form for Jev. Only the owner can weigh a scene lost against text sent, so the decision step has to ask.

## Conclusions

1. The judge's model must run as a native macOS process on the Mac host, outside the containers, because no container runtime on the Mac gives a Linux container the Metal GPU. The one GPU route into a container that I read, Podman with krunkit, runs 40 to 50 % slower.
2. The `tower` container must reach the local judge only through the model gateway. The judge must answer only the Mac, bound to loopback or behind an API key, because a judge open on all addresses without a key answers every device on the home network. A stage 0 test on the family Mac must show which of the two works under OrbStack.
3. The local runtime must constrain each answer to the check's label set and return the probability of each label, so the thresholds the Russian test set sets work as they do for Jev. llama.cpp's server documents both, and so does Ollama since v0.12.11.
4. The judge must keep its model loaded and each check's fixed prompt prefix cached, because a cold 3,000-token check misses the 1500 ms timeout on an M4 Max. That takes one slot for each distinct check prompt and for each check that runs in parallel.
5. The stage 0 bake-off must run each local candidate on the same labelled Russian test set as the reference model, check by check. It must also measure each check's 95th-percentile latency on the family Mac with a warm cache, and a check must move to a local model only when it passes both.
6. The local candidates at stage 0 must include at least one general instruction model, from Qwen3.5-9B or 4B or Gemma 4 12B or E4B, for every check, and Shieldstral 1.0 3B for the yes-or-no checks. The split between safety checks and judgement checks must follow from those results, check by check, and not be fixed before them.
7. Llama Guard 4, ShieldGemma 2 and Granite Guardian must not be candidates, because none lists Russian among its supported languages, and ShieldGemma 2 reads images only.
8. A local judge's model must be pinned by the hash of its model file and run with deterministic decoding, because each threshold is set on one version. A changed file must rerun each check's test set before it answers her text.
9. The server's start-up check must confirm, for a local judge, that the runtime answers and serves the pinned file, in place of the OpenRouter catalogue and zero-retention checks that apply to a hosted judge.
10. The automated checks must keep answering the judge from recordings, local judge included, so a test run gives the same answer every time.
11. The Parent Room's page on what leaves the Mac must say where the judge runs and which company, if any, reads her text when the judge falls back.
12. The decision must say what answers a check when the local judge fails, `SAFETY_MODEL`, Jev or no model at all, and whether a local judge may read her uncleaned text. Each choice changes whether her text leaves the Mac, and only the owner can weigh that against a lost live scene.
13. The decision must record keeping Jev as a result it can reach: if no local candidate passes both the agreement and the latency test for a check, that check stays with the approved judge.

## Sources

- `project/research/RES-1600-master-and-director.md`, `RES-1800-safety-wellbeing.md`, `RES-2600-privacy.md`, `RES-2700-daily-cost.md`, `RES-3000-stages-open-questions.md`, read 2026-09-27 at commit 6076a0f - Jev's checks, route, gate, cost and fallback; the clean-up rule and its reason.
- `project/adrs/ADR-0010`, `ADR-0100`, `ADR-0110`, `ADR-0120`, `ADR-0130`, `ADR-0190`, read 2026-09-27 at commit 6076a0f - the containers, the gateway, the 1500 ms timeout, the start-up check, where checks run, and the records that name Jev.
- `project/requirements/`, the twelve approved requirements found by searching for "jev", "typesafe" and "judge model", read 2026-09-27 at commit 6076a0f - the requirements that name or govern the judge.
- [meta-llama/Llama-Guard-4-12B](https://huggingface.co/meta-llama/Llama-Guard-4-12B), read 2026-09-27 - size, licence, 14 categories, supported languages without Russian.
- [Qwen/Qwen3Guard-Gen-8B](https://huggingface.co/Qwen/Qwen3Guard-Gen-8B) and [Qwen/Qwen3Guard-Gen-4B](https://huggingface.co/Qwen/Qwen3Guard-Gen-4B), read 2026-09-27 - sizes, Apache 2.0, nine fixed categories, three levels, no custom categories described.
- [QwenLM/Qwen3Guard README](https://github.com/QwenLM/Qwen3Guard/blob/main/README.md), read 2026-09-27 - variants, output format, vLLM and SGLang serving.
- [Qwen3Guard Technical Report](https://arxiv.org/html/2510.14276v1), read 2026-09-27 - Russian RTP-LX and PolyGuard figures, tables 5 and 6.
- [Hugging Face search for Qwen3Guard-Gen-4B GGUF](https://huggingface.co/models?search=Qwen3Guard-Gen-4B%20GGUF), read 2026-09-27 - community GGUF conversions exist.
- [google/shieldgemma-2-4b-it](https://huggingface.co/google/shieldgemma-2-4b-it), read 2026-09-27 - images only, English-only training data.
- [ibm-granite/granite-guardian-3.3-8b](https://huggingface.co/ibm-granite/granite-guardian-3.3-8b) and [ibm-granite/granite-guardian-4.1-8b](https://huggingface.co/ibm-granite/granite-guardian-4.1-8b), read 2026-09-27 - criteria the user writes, yes-or-no output, English only.
- [HaloGuard 1.0](https://arxiv.org/html/2607.02079v1), read 2026-09-27 - input-only classifier, sizes, licence, 46 languages, no per-language figure.
- [mistralai/Shieldstral-1.0-3B](https://huggingface.co/mistralai/Shieldstral-1.0-3B), read 2026-09-27 - licence, twelve languages with Russian, yes-or-no score, one policy per call, serving options, limitations.
- [Introducing Shieldstral](https://mistral.ai/news/shieldstral/), read 2026-09-27 - release date 2026-08-04, multilingual coverage named as work in progress.
- [Mistral cookbook: policy-based moderation with Shieldstral](https://docs.mistral.ai/resources/cookbooks/mistral-moderation-shieldstral_policy_moderation), read 2026-09-27 - prompt format, score formula, thresholds.
- [Abiray/Shieldstral-1.0-3B-GGUF](https://huggingface.co/Abiray/Shieldstral-1.0-3B-GGUF), read 2026-09-27 - community GGUF file sizes.
- [PolyGuard](https://arxiv.org/html/2504.04377), read 2026-09-27 - sizes and licence; no Russian per-language table in the HTML I read.
- [ML-Bench&Guard](https://arxiv.org/html/2605.00689), read 2026-09-27 - Russian not among its 14 languages.
- [Benchmarking Open-Source Safety Guard Models](https://arxiv.org/html/2605.28830v1), read 2026-09-27 - fourteen guard models, English only.
- [Qwen/Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B), read 2026-09-27 - licence, 201 languages, multilingual scores, thinking switch, serving.
- [Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) and [Qwen/Qwen3.8-Flash-Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next), read 2026-09-27 - sizes, licences, release month.
- [Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4), read 2026-09-27 - sizes, Apache 2.0, languages, MMMLU.
- [meta-llama/Llama-3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct), read 2026-09-27 - eight supported languages without Russian.
- [OrbStack issue 1818, GPU acceleration in containers](https://github.com/orbstack/orbstack/issues/1818), read 2026-09-27 - open since 2025-03-05 with no maintainer reply.
- [OrbStack docs, container networking](https://docs.orbstack.dev/docker/network), read 2026-09-27 - `host.docker.internal` reaches a server on the Mac.
- [Chariot Solutions, Apple Silicon GPUs, Docker and Ollama: pick two](https://chariotsolutions.com/blog/post/apple-silicon-gpus-docker-and-ollama-pick-two/), read 2026-09-27 - no GPU in Docker on a Mac; native Ollama uses Metal.
- [llama.cpp discussion 12985, GPU-accelerated containers on M-series Macs](https://github.com/ggml-org/llama.cpp/discussions/12985), read 2026-09-27 - Podman and krunkit figures against native Metal.
- [llama.cpp discussion 4167, performance on Apple silicon](https://github.com/ggml-org/llama.cpp/discussions/4167), read 2026-09-27 - M4 Max prompt processing and generation for the 7B test model.
- [llama.cpp server README](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md), read 2026-09-27 - grammar, JSON schema, logprobs, `cache_prompt`, `--parallel`, `--host`, `--api-key`, `/health`.
- [llama.cpp build guide](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md) and [install guide](https://github.com/ggml-org/llama.cpp/blob/master/docs/install.md), read 2026-09-27 - Metal on by default on macOS; `brew install llama.cpp`.
- [Ollama structured outputs](https://docs.ollama.com/capabilities/structured-outputs), read 2026-09-27 - JSON schema in `format` and `response_format`.
- [Ollama v0.12.11 release notes](https://github.com/ollama/ollama/releases/tag/v0.12.11), read 2026-09-27 - log probabilities from 2025-11-12.
- [Ollama issue 18590](https://github.com/ollama/ollama/issues/18590), seen in search results 2026-09-27 - `top_logprobs` capped at 20.
- [Ollama FAQ](https://docs.ollama.com/faq), read 2026-09-27 - `OLLAMA_HOST`, `keep_alive`, `OLLAMA_NUM_PARALLEL`, macOS settings.
- [Ollama is now powered by MLX on Apple Silicon in preview](https://ollama.com/blog/mlx) and [Ollama's highest performance on Apple Silicon yet with MLX](https://ollama.com/blog/mlx-performance), read 2026-09-27 - MLX engine dates, memory requirement and models.
- [mlx-lm server guide](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md), read 2026-09-27 - logprobs; not recommended for production; no schema constraint documented.
- Search results on Docker Model Runner, including [Docker Model Runner adds vLLM support on macOS](https://www.docker.com/blog/docker-model-runner-vllm-metal-macos/), seen 2026-09-27 and not read - a claimed host-side llama.cpp with Metal, recorded as unverified.
