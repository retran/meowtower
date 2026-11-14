-- ADR-3360: a version a generator writes waits until the parent keeps it. Versions stay append-only,
-- so a waiting version is one numbered above the node's current version, and a discarded one is
-- one at or below `discarded_to`.
ALTER TABLE story_nodes ADD COLUMN discarded_to BIGINT NOT NULL DEFAULT 0;
