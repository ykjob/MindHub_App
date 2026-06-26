import type { SQLiteDatabase } from 'expo-sqlite';
import type { Memo, GithubStatus } from './memoTypes';

export async function getAllMemos(db: SQLiteDatabase): Promise<Memo[]> {
  return db.getAllAsync<Memo>(
    'SELECT * FROM memos WHERE deleted_at IS NULL ORDER BY updated_at DESC'
  );
}

export async function getMemoById(
  db: SQLiteDatabase,
  id: string
): Promise<Memo | null> {
  return db.getFirstAsync<Memo>(
    'SELECT * FROM memos WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
}

export async function insertMemo(db: SQLiteDatabase, memo: Memo): Promise<void> {
  await db.runAsync(
    `INSERT INTO memos (
      id, body, category, created_at, updated_at, deleted_at,
      github_status, github_path, github_sha, github_uploaded_at,
      github_error_message, google_task_status, google_calendar_status,
      created_ai_output_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      memo.id,
      memo.body,
      memo.category,
      memo.created_at,
      memo.updated_at,
      memo.deleted_at,
      memo.github_status,
      memo.github_path,
      memo.github_sha,
      memo.github_uploaded_at,
      memo.github_error_message,
      memo.google_task_status,
      memo.google_calendar_status,
      memo.created_ai_output_count,
    ]
  );
}

export async function updateMemoBodyAndCategory(
  db: SQLiteDatabase,
  id: string,
  body: string,
  category: string,
  updatedAt: string,
  newGithubStatus: GithubStatus
): Promise<void> {
  await db.runAsync(
    `UPDATE memos SET body = ?, category = ?, updated_at = ?, github_status = ?
     WHERE id = ? AND deleted_at IS NULL`,
    [body, category, updatedAt, newGithubStatus, id]
  );
}

export async function softDeleteMemo(
  db: SQLiteDatabase,
  id: string,
  deletedAt: string
): Promise<void> {
  await db.runAsync(
    'UPDATE memos SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL',
    [deletedAt, id]
  );
}

export async function setGitHubUploaded(
  db: SQLiteDatabase,
  id: string,
  params: { path: string; sha: string; uploadedAt: string }
): Promise<void> {
  await db.runAsync(
    `UPDATE memos SET
       github_status = 'uploaded',
       github_path = ?,
       github_sha = ?,
       github_uploaded_at = ?,
       github_error_message = NULL
     WHERE id = ?`,
    [params.path, params.sha, params.uploadedAt, id]
  );
}

export async function setGitHubFailed(
  db: SQLiteDatabase,
  id: string,
  errorMessage: string
): Promise<void> {
  await db.runAsync(
    `UPDATE memos SET github_status = 'failed', github_error_message = ?
     WHERE id = ?`,
    [errorMessage, id]
  );
}
