import type { SQLiteDatabase } from 'expo-sqlite';
import { getSetting, setSetting } from '../settings/settingsRepository';
import type { GitHubSettings } from './githubTypes';

const KEY_OWNER = 'github_owner';
const KEY_REPO = 'github_repo';
const KEY_BRANCH = 'github_branch';

export async function getGitHubSettings(
  db: SQLiteDatabase
): Promise<GitHubSettings | null> {
  const owner = await getSetting(db, KEY_OWNER);
  const repo = await getSetting(db, KEY_REPO);
  const branch = await getSetting(db, KEY_BRANCH);

  if (!owner || !repo || !branch) return null;
  return { owner, repo, branch };
}

export async function saveGitHubSettings(
  db: SQLiteDatabase,
  settings: GitHubSettings
): Promise<void> {
  await setSetting(db, KEY_OWNER, settings.owner);
  await setSetting(db, KEY_REPO, settings.repo);
  await setSetting(db, KEY_BRANCH, settings.branch);
}
