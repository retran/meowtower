---
id: REQ-2234
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-2200
verification: behavioural
---

# REQ-2234

When the parent exports the raw event log, the game MUST offer it both as JSONL and as Parquet.

JSONL keeps one event a line for reading and scripting, and Parquet opens in data tools without conversion.
