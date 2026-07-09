import type { SQLiteDatabase } from 'expo-sqlite';
import type { Note, NoteFilter } from './noteTypes';
import { parseTags } from './noteTypes';

export async function getNotes(
  db: SQLiteDatabase,
  filter: NoteFilter = {}
): Promise<Note[]> {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (!filter.includeArchived) {
    conditions.push('archived_at IS NULL');
  }
  if (filter.keyword && filter.keyword.trim()) {
    const kw = `%${filter.keyword.trim()}%`;
    conditions.push(
      '(title LIKE ? OR body LIKE ? OR project LIKE ? OR tags LIKE ? OR type LIKE ?)'
    );
    params.push(kw, kw, kw, kw, kw);
  }
  if (filter.project) {
    conditions.push('project = ?');
    params.push(filter.project);
  }
  if (filter.type) {
    conditions.push('type = ?');
    params.push(filter.type);
  }
  if (filter.tag) {
    conditions.push("(',' || tags || ',') LIKE ?");
    params.push(`%,%${filter.tag}%,%`);
  }
  if (filter.gitCandidateOnly) {
    conditions.push('is_git_candidate = 1');
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderBy =
    filter.sortBy === 'created' ? 'created_at DESC' : 'updated_at DESC';

  return db.getAllAsync<Note>(
    `SELECT * FROM notes ${where} ORDER BY ${orderBy}`,
    params
  );
}

export async function getNoteById(
  db: SQLiteDatabase,
  id: string
): Promise<Note | null> {
  return db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?', [id]);
}

// 指定タグを持つ最新の未アーカイブノートを1件取得する（現場適応モードの翌朝再開導線用）。
// getNotes の filter.tag は緩いLIKEで前方一致の誤マッチが起こりうるため、
// ここではタグ境界を ',' で厳密一致させる専用クエリを使う。
// タグ内に含まれ得る LIKE ワイルドカード（% _）はエスケープする（例: workplace_end の _）。
export async function getLatestNoteByTag(
  db: SQLiteDatabase,
  tag: string
): Promise<Note | null> {
  const escaped = tag.replace(/[\\%_]/g, (c) => `\\${c}`);
  return db.getFirstAsync<Note>(
    `SELECT * FROM notes
       WHERE archived_at IS NULL
         AND (',' || tags || ',') LIKE ('%,' || ? || ',%') ESCAPE '\\'
       ORDER BY updated_at DESC, id DESC
       LIMIT 1`,
    [escaped]
  );
}

export async function insertNote(db: SQLiteDatabase, note: Note): Promise<void> {
  await db.runAsync(
    `INSERT INTO notes (
      id, title, body, project, type, tags, source, visibility,
      is_git_candidate, export_dir, export_filename, export_path,
      exported_at, created_at, updated_at, archived_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      note.id,
      note.title,
      note.body,
      note.project,
      note.type,
      note.tags,
      note.source,
      note.visibility,
      note.is_git_candidate,
      note.export_dir,
      note.export_filename,
      note.export_path,
      note.exported_at,
      note.created_at,
      note.updated_at,
      note.archived_at,
    ]
  );
}

export async function updateNoteFields(
  db: SQLiteDatabase,
  id: string,
  fields: {
    title: string;
    body: string;
    project: string;
    type: string;
    tags: string;
    source: string;
    visibility: string;
    is_git_candidate: number;
    updated_at: string;
  }
): Promise<void> {
  await db.runAsync(
    `UPDATE notes SET
       title = ?, body = ?, project = ?, type = ?, tags = ?,
       source = ?, visibility = ?, is_git_candidate = ?, updated_at = ?
     WHERE id = ?`,
    [
      fields.title,
      fields.body,
      fields.project,
      fields.type,
      fields.tags,
      fields.source,
      fields.visibility,
      fields.is_git_candidate,
      fields.updated_at,
      id,
    ]
  );
}

export async function setNoteArchived(
  db: SQLiteDatabase,
  id: string,
  archivedAt: string | null
): Promise<void> {
  await db.runAsync('UPDATE notes SET archived_at = ? WHERE id = ?', [
    archivedAt,
    id,
  ]);
}

export async function setNoteExported(
  db: SQLiteDatabase,
  id: string,
  params: {
    exportDir: string;
    exportFilename: string;
    exportPath: string;
    exportedAt: string;
  }
): Promise<void> {
  await db.runAsync(
    `UPDATE notes SET
       export_dir = ?, export_filename = ?, export_path = ?, exported_at = ?
     WHERE id = ?`,
    [
      params.exportDir,
      params.exportFilename,
      params.exportPath,
      params.exportedAt,
      id,
    ]
  );
}

export async function getDistinctProjects(db: SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ project: string }>(
    "SELECT DISTINCT project FROM notes WHERE project != '' ORDER BY project"
  );
  return rows.map((r) => r.project);
}

export async function getDistinctTags(db: SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ tags: string }>(
    "SELECT tags FROM notes WHERE tags != ''"
  );
  const set = new Set<string>();
  for (const row of rows) {
    for (const tag of parseTags(row.tags)) {
      set.add(tag);
    }
  }
  return Array.from(set).sort();
}
