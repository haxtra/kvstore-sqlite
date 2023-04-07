--- kvstore ---
CREATE TABLE kvstore (
key TEXT PRIMARY KEY,
value TEXT,
updated INTEGER NOT NULL DEFAULT 0,
created INTEGER NOT NULL DEFAULT 0
);