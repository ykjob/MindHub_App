import type { SQLiteDatabase } from 'expo-sqlite';
import {
  CREATE_MEMOS_TABLE,
  CREATE_AI_OUTPUTS_TABLE,
  CREATE_SETTINGS_TABLE,
  SCHEMA_VERSION,
} from './schema';

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');

  await db.execAsync(CREATE_SETTINGS_TABLE);

  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'schema_version'"
  );
  const currentVersion = row ? parseInt(row.value, 10) : 0;

  if (currentVersion < 1) {
    await db.execAsync(CREATE_MEMOS_TABLE);
    await db.execAsync(CREATE_AI_OUTPUTS_TABLE);
    await db.runAsync(
      "INSERT OR REPLACE INTO settings (key, value) VALUES ('schema_version', ?)",
      [String(SCHEMA_VERSION)]
    );
  }
}
