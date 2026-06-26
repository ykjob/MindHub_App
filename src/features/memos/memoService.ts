import type { SQLiteDatabase } from 'expo-sqlite';
import type { Memo, CreateMemoInput, UpdateMemoInput, GithubStatus } from './memoTypes';
import {
  insertMemo,
  updateMemoBodyAndCategory,
  softDeleteMemo,
} from './memoRepository';
import { DEFAULT_CATEGORY } from './memoCategories';
import { generateId } from '../../utils/id';
import { nowISOString } from '../../utils/date';

export async function createMemo(
  db: SQLiteDatabase,
  input: CreateMemoInput
): Promise<Memo> {
  const now = nowISOString();
  const memo: Memo = {
    id: generateId(),
    body: input.body,
    category: input.category ?? DEFAULT_CATEGORY,
    created_at: now,
    updated_at: now,
    deleted_at: null,
    github_status: 'not_uploaded',
    github_path: null,
    github_sha: null,
    github_uploaded_at: null,
    github_error_message: null,
    google_task_status: 'not_exported',
    google_calendar_status: 'not_exported',
    created_ai_output_count: 0,
  };
  await insertMemo(db, memo);
  return memo;
}

export async function updateMemo(
  db: SQLiteDatabase,
  input: UpdateMemoInput,
  currentGithubStatus: GithubStatus
): Promise<void> {
  const now = nowISOString();

  let newStatus: GithubStatus = currentGithubStatus;
  if (currentGithubStatus === 'uploaded') {
    newStatus = 'modified_after_upload';
  }

  await updateMemoBodyAndCategory(
    db,
    input.id,
    input.body,
    input.category,
    now,
    newStatus
  );
}

export async function deleteMemo(db: SQLiteDatabase, id: string): Promise<void> {
  const now = nowISOString();
  await softDeleteMemo(db, id, now);
}
