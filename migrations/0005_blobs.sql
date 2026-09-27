-- REQ-2210: one row per stored draft-pad image, keyed by its SHA-256 hash.
-- A row never changes and is never removed, so the log's
-- reference to an image stays true. A service table outside the log (ADR-0020).
CREATE TABLE blobs (
  sha256 TEXT PRIMARY KEY CHECK (length(sha256) = 64),
  bytes INTEGER NOT NULL,
  created_at TEXT NOT NULL
) STRICT;

CREATE TRIGGER blobs_no_update BEFORE UPDATE ON blobs
BEGIN
  SELECT RAISE(ABORT, 'events are append-only');
END;

CREATE TRIGGER blobs_no_delete BEFORE DELETE ON blobs
BEGIN
  SELECT RAISE(ABORT, 'events are append-only');
END;
