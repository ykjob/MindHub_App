import type { SQLiteDatabase } from 'expo-sqlite';
import type { Note, NoteInput } from './noteTypes';
import {
  insertNote,
  updateNoteFields,
  setNoteArchived,
  setNoteExported,
} from './noteRepository';
import { generateId } from '../../utils/id';
import { nowISOString } from '../../utils/date';

function normalizeTags(tags: string): string {
  return tags
    .split(/[,、，]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .join(',');
}

export async function createNote(
  db: SQLiteDatabase,
  input: NoteInput
): Promise<Note> {
  const now = nowISOString();
  const note: Note = {
    id: generateId(),
    title: input.title.trim(),
    body: input.body,
    project: input.project.trim(),
    type: input.type,
    tags: normalizeTags(input.tags),
    source: input.source,
    visibility: input.visibility,
    is_git_candidate: input.isGitCandidate ? 1 : 0,
    export_dir: null,
    export_filename: null,
    export_path: null,
    exported_at: null,
    created_at: now,
    updated_at: now,
    archived_at: null,
  };
  await insertNote(db, note);
  return note;
}

export async function updateNote(
  db: SQLiteDatabase,
  id: string,
  input: NoteInput
): Promise<void> {
  await updateNoteFields(db, id, {
    title: input.title.trim(),
    body: input.body,
    project: input.project.trim(),
    type: input.type,
    tags: normalizeTags(input.tags),
    source: input.source,
    visibility: input.visibility,
    is_git_candidate: input.isGitCandidate ? 1 : 0,
    updated_at: nowISOString(),
  });
}

export async function archiveNote(db: SQLiteDatabase, id: string): Promise<void> {
  await setNoteArchived(db, id, nowISOString());
}

export async function unarchiveNote(
  db: SQLiteDatabase,
  id: string
): Promise<void> {
  await setNoteArchived(db, id, null);
}

export async function markNoteExported(
  db: SQLiteDatabase,
  id: string,
  params: { exportDir: string; exportFilename: string; exportPath: string }
): Promise<void> {
  await setNoteExported(db, id, {
    ...params,
    exportedAt: nowISOString(),
  });
}
