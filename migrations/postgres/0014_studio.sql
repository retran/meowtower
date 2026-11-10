-- ADR-3280: the studio's storage. A story node is a campaign, an arc, an adventure or an encounter;
-- every edit adds a version and never changes an older one. The libraries hold characters, places,
-- factions, items, facts, events and summaries, with the nodes each is used in. A job is one
-- background run of a generator or an edit, with its progress.
CREATE TABLE story_nodes (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL CHECK (level IN ('campaign', 'arc', 'adventure', 'encounter')),
  parent_id TEXT REFERENCES story_nodes (id),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'playing', 'played')),
  current_version BIGINT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX story_nodes_parent ON story_nodes (parent_id);

CREATE TABLE story_versions (
  node_id TEXT NOT NULL REFERENCES story_nodes (id),
  version BIGINT NOT NULL,
  body TEXT NOT NULL CHECK (body::jsonb IS NOT NULL),
  prompt TEXT,
  author TEXT NOT NULL CHECK (author IN ('parent', 'generator')),
  created_at TEXT NOT NULL,
  PRIMARY KEY (node_id, version)
);

CREATE FUNCTION story_versions_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'story versions are append-only';
END;
$$;

CREATE TRIGGER story_versions_no_update BEFORE UPDATE ON story_versions
  FOR EACH ROW EXECUTE FUNCTION story_versions_append_only();

CREATE TRIGGER story_versions_no_delete BEFORE DELETE ON story_versions
  FOR EACH ROW EXECUTE FUNCTION story_versions_append_only();

CREATE TABLE library_entries (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('character', 'place', 'faction', 'item', 'fact', 'event', 'summary')),
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  version BIGINT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE library_versions (
  entry_id TEXT NOT NULL REFERENCES library_entries (id),
  version BIGINT NOT NULL,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (entry_id, version)
);

CREATE TABLE library_uses (
  entry_id TEXT NOT NULL REFERENCES library_entries (id),
  node_id TEXT NOT NULL REFERENCES story_nodes (id),
  PRIMARY KEY (entry_id, node_id)
);

CREATE TABLE studio_jobs (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  node_id TEXT REFERENCES story_nodes (id),
  state TEXT NOT NULL CHECK (state IN ('queued', 'running', 'done', 'failed')),
  progress BIGINT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  message TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
