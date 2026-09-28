---
id: REQ-6298
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4120
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6298

The event log MUST hold the event types `system_unlocked`, `route_offered`, `route_chosen`, `free_pen_started`, `free_pen_ended`, `starter_inserted`, `share_card_created`, `share_card_viewed`, `scene_rewatched`, `chapter_reread`, `scene_favorited`, `hidden_detail_found`, `parent_day_marked` and `text_freshness_scored`.

The routes offered and chosen tell the parent what the player avoids, and the other events feed the "Interest" section of REQ-6288 and the 60-day acceptance run of REQ-6296.

Written from RES-4120 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
