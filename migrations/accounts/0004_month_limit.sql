-- ADR-3340: each account's own monthly budget in dollars. Null means the default, the play key's limit.
ALTER TABLE accounts ADD COLUMN month_limit_usd DOUBLE PRECISION;
