-- REQ-2210: one row per stored draft-pad image, keyed by its SHA-256 hash. A row never changes and
-- is never removed, so the log's reference to an image stays true.
CREATE TABLE blobs (
  sha256 TEXT PRIMARY KEY CHECK (length(sha256) = 64),
  bytes BIGINT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TRIGGER blobs_no_update BEFORE UPDATE ON blobs
  FOR EACH ROW EXECUTE FUNCTION append_only();

CREATE TRIGGER blobs_no_delete BEFORE DELETE ON blobs
  FOR EACH ROW EXECUTE FUNCTION append_only();
