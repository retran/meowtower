-- The SQLite migration of this number dropped an old `node_snapshots`; a new schema never had one.
DROP TABLE IF EXISTS node_snapshots;
