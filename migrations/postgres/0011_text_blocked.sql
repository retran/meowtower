-- ADR-0160, TSK-0683: the lines the text gate blocked, and the lines checked and blocked per source
-- and game day. Both are operational tables of the server, outside the event log.
CREATE TABLE text_blocked (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  at TEXT NOT NULL,
  source TEXT NOT NULL,
  kind TEXT NOT NULL,
  rule TEXT NOT NULL,
  match TEXT NOT NULL,
  line TEXT NOT NULL
);

CREATE TABLE text_counters (
  game_day BIGINT NOT NULL,
  source TEXT NOT NULL,
  checked BIGINT NOT NULL DEFAULT 0,
  blocked BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (game_day, source)
);
