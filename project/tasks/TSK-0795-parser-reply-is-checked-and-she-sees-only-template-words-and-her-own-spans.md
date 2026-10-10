---
id: TSK-0795
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5234, REQ-5288]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The engine refuses an invalid parse reply as `unparsed`, and the paraphrase holds only template strings and spans found in her own text

After this task, a parse reply is accepted only as strict JSON that passes its schema, names no token outside `n1` to `nm` of the text sent, quotes spans found word for word in the masked text and has a question, a timeout, invalid reply or graph with no question gives `unparsed` with base experience and no observation, and the paraphrase she sees is built from per-language template strings and the checked spans.

## Acceptance criteria

1. Given replayed replies, a 10-second timeout, invalid JSON, a graph with no question, a graph naming `n9` for a text with 3 tokens and a span not in her text, when each is read, then each gives `unparsed` with base experience and no observation (REQ-5288). Closed by: replayed tests, one for each case.
2. Given a valid reply, when the engine builds the graph, then it puts her own number forms back into the spans from the mapping, and the paraphrase holds only template strings of the per-language file for the problem type and operation plus spans found word for word in her text (REQ-5234). Closed by: a unit test over fixture replies.
3. Given a reply whose span holds a word the text doesn't, when the paraphrase is built, then the reply is refused and no model-written word reaches her (REQ-5234). Closed by: a unit test with a fixture reply.
4. Given the paraphrase, when it is read, then it retells the story and the question in words and holds no expression, sign or value (REQ-5234). Closed by: a unit test that searches paraphrases for digits, operation signs and number words.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the reply schema: a list of quantities, each with its token and the span of her text that names it, the question with its span, a graph of operations over the tokens and, for each division, whether it shares into parts or groups by a size. The engine refuses the reply as invalid when the JSON fails the schema, when the graph names a number or a token that isn't one of the tokens sent, or when a span isn't found in the masked text. ADR-0440 changes the refusal to the `n` and `d` tokens and the fixed constants of a named operation, and its epic extends this check.

Write the paraphrase templates, one set for each problem type and operation, into `content/i18n/ru.json`, so that no word a model wrote reaches her and every other text shown to her comes from content or checked output. The paraphrase retells meaning so she compares meanings and not a number with the target.

## Depends on

- TSK-0788 (not blocking): the graph shape both read; either task can land first with a fixture graph.

The epic realising ADR-0210 supplies the `PARSE_MODEL` role and the checked-output rule; this task adds the riddle's own schema and fallbacks.

## Evidence

Not yet.

## Left alone

Number words outside the masked set, which a requirement change widens, and the parse prompt's wording, which belongs to the specification.
