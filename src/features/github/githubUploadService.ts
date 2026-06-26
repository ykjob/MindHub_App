import type { SQLiteDatabase } from 'expo-sqlite';
import { getMemoById, setGitHubUploaded, setGitHubFailed } from '../memos/memoRepository';
import { generateMarkdown } from '../memos/memoMarkdown';
import { getCategoryFolder } from '../memos/memoCategories';
import { getGitHubSettings } from './githubSettings';
import { getToken } from './githubTokenStore';
import { createFile, updateFile } from './githubApi';
import { resolveUploadPath } from './githubPath';
import { nowISOString } from '../../utils/date';

export async function uploadMemo(
  db: SQLiteDatabase,
  memoId: string
): Promise<void> {
  const memo = await getMemoById(db, memoId);
  if (!memo) throw new Error('メモが見つかりません');

  const settings = await getGitHubSettings(db);
  if (!settings) throw new Error('GitHub設定が未設定です（設定画面で入力してください）');

  const token = await getToken();
  if (!token) throw new Error('GitHubトークンが未設定です（設定画面で入力してください）');

  const folder = getCategoryFolder(memo.category);
  const filePath = await resolveUploadPath(
    settings,
    token,
    folder,
    memo.github_path
  );

  const markdownContent = generateMarkdown(memo);

  try {
    let result;

    if (memo.github_path && memo.github_sha) {
      result = await updateFile({
        owner: settings.owner,
        repo: settings.repo,
        branch: settings.branch,
        token,
        path: filePath,
        content: markdownContent,
        sha: memo.github_sha,
        message: `Update note: ${filePath}`,
      });
    } else {
      result = await createFile({
        owner: settings.owner,
        repo: settings.repo,
        branch: settings.branch,
        token,
        path: filePath,
        content: markdownContent,
        message: `Add note: ${filePath}`,
      });
    }

    await setGitHubUploaded(db, memoId, {
      path: result.path,
      sha: result.sha,
      uploadedAt: nowISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await setGitHubFailed(db, memoId, message);
    throw error;
  }
}
