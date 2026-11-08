-- TSK-0527: a derived table also records the version of the state rules it was computed with.
ALTER TABLE derived_meta ADD COLUMN rules_version TEXT NOT NULL DEFAULT 'none';
