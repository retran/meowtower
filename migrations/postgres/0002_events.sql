-- ADR-0020, ADR-3310: the append-only event log, the only record of what happened in play.
CREATE TABLE events (
  seq BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  ts TEXT NOT NULL,
  client_ms BIGINT NOT NULL,
  device_id TEXT NOT NULL,
  session_id TEXT,
  adventure_id TEXT,
  type TEXT NOT NULL,
  v BIGINT NOT NULL,
  payload TEXT NOT NULL CHECK (payload::jsonb IS NOT NULL),
  idem_key TEXT UNIQUE
);

-- The task a verdict or a hint belongs to is read from the payload.
CREATE INDEX events_item ON events ((payload::jsonb ->> 'itemId'));

-- REQ-2226: the database itself refuses every change and removal.
CREATE FUNCTION append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'events are append-only';
END;
$$;

CREATE TRIGGER events_no_update BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION append_only();

CREATE TRIGGER events_no_delete BEFORE DELETE ON events
  FOR EACH ROW EXECUTE FUNCTION append_only();

CREATE TRIGGER events_no_truncate BEFORE TRUNCATE ON events
  FOR EACH STATEMENT EXECUTE FUNCTION append_only();
