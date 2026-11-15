-- ADR-3390: a node is archived and never deleted. Archiving hides it from its level and from play and keeps
-- every version; `archived_at` is the time it was archived, null for a node that is shown.
ALTER TABLE story_nodes ADD COLUMN archived_at TEXT;
