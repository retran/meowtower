-- TSK-0527: a derived table also records the version of the state rules it was computed
-- with, so a change of the rules recomputes at start-up. Rows written before this column
-- read 'none', which differs from any rules version and recomputes once.
ALTER TABLE derived_meta ADD COLUMN rules_version TEXT NOT NULL DEFAULT 'none';
