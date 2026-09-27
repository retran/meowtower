---
id: REQ-2242
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-2200
verification: behavioural
---

# REQ-2242

A full recompute MUST leave unchanged the scratchpad images and their metadata, the explanation cache, the paired devices, the language model call records, the art job queue, the live frames with their statuses and the bake-off results.

None of these can be rebuilt from the log: the images aren't in it, the cached explanations cost money to write again, and the rest are service records, not facts about play.
