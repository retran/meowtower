-- ADR-0160, TSK-0683: the lines the text gate blocked, kept at most 1,000, and the lines checked and
-- blocked per source and game day. Both are operational tables of the server, outside the event log.
CREATE TABLE text_blocked (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  source TEXT NOT NULL,
  kind TEXT NOT NULL,
  rule TEXT NOT NULL,
  match TEXT NOT NULL,
  line TEXT NOT NULL
) STRICT;

CREATE TABLE text_counters (
  game_day INTEGER NOT NULL,
  source TEXT NOT NULL,
  checked INTEGER NOT NULL DEFAULT 0,
  blocked INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (game_day, source)
) STRICT;
