-- ADR-3100: every model call in full, and every live frame with its status. Both are operational
-- tables of the server, outside the event log, and no projection reads them.
CREATE TABLE llm_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  role TEXT NOT NULL,
  route TEXT NOT NULL,
  model TEXT NOT NULL,
  tier TEXT NOT NULL,
  bucket TEXT NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost_usd REAL NOT NULL,
  latency_ms INTEGER NOT NULL,
  outcome TEXT NOT NULL,
  request TEXT NOT NULL,
  response TEXT NOT NULL
) STRICT;

CREATE TABLE frames (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id TEXT NOT NULL,
  seed TEXT NOT NULL,
  lang TEXT NOT NULL,
  text TEXT NOT NULL,
  status TEXT NOT NULL,
  step TEXT,
  game_day INTEGER NOT NULL,
  at TEXT NOT NULL
) STRICT;

CREATE INDEX frames_task ON frames (template_id, seed, lang, status);
CREATE INDEX frames_day ON frames (game_day);
