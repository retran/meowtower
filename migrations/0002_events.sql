-- ADR-0020: the append-only event log, the only record of what happened in
-- play. It replaces stage 0's spike table.
DROP TABLE stage0_writes;

CREATE TABLE events (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  id TEXT NOT NULL UNIQUE,
  ts TEXT NOT NULL,
  client_ms INTEGER NOT NULL,
  device_id TEXT NOT NULL,
  session_id TEXT,
  adventure_id TEXT,
  type TEXT NOT NULL,
  v INTEGER NOT NULL,
  payload TEXT NOT NULL CHECK (json_valid(payload)),
  idem_key TEXT UNIQUE
) STRICT;

-- REQ-2226: the database itself refuses every change and removal.
CREATE TRIGGER events_no_update BEFORE UPDATE ON events
BEGIN
  SELECT RAISE(ABORT, 'events are append-only');
END;

CREATE TRIGGER events_no_delete BEFORE DELETE ON events
BEGIN
  SELECT RAISE(ABORT, 'events are append-only');
END;
