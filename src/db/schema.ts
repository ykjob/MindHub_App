export const DB_NAME = 'flowdock.db';

export const SCHEMA_VERSION = 2;

export const CREATE_MEMOS_TABLE = `
  CREATE TABLE IF NOT EXISTS memos (
    id TEXT PRIMARY KEY,
    body TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'inbox',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT,
    github_status TEXT NOT NULL DEFAULT 'not_uploaded',
    github_path TEXT,
    github_sha TEXT,
    github_uploaded_at TEXT,
    github_error_message TEXT,
    google_task_status TEXT NOT NULL DEFAULT 'not_exported',
    google_calendar_status TEXT NOT NULL DEFAULT 'not_exported',
    created_ai_output_count INTEGER NOT NULL DEFAULT 0
  );
`;

export const CREATE_AI_OUTPUTS_TABLE = `
  CREATE TABLE IF NOT EXISTS ai_outputs (
    id TEXT PRIMARY KEY,
    memo_id TEXT NOT NULL,
    output_type TEXT NOT NULL,
    content_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (memo_id) REFERENCES memos(id)
  );
`;

export const CREATE_NOTES_TABLE = `
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    project TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'thought',
    tags TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT 'manual',
    visibility TEXT NOT NULL DEFAULT 'private',
    is_git_candidate INTEGER NOT NULL DEFAULT 0,
    export_dir TEXT,
    export_filename TEXT,
    export_path TEXT,
    exported_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    archived_at TEXT
  );
`;

export const CREATE_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;
