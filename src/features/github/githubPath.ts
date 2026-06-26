import type { GitHubSettings } from './githubTypes';
import { listContents } from './githubApi';
import { getDateString } from '../../utils/date';

export function generateFilePath(
  folder: string,
  dateStr: string,
  seq: number
): string {
  const seqStr = String(seq).padStart(3, '0');
  return `${folder}/${dateStr}-${seqStr}.md`;
}

// MVPでは同時アップロード競合は対象外（手動1件ずつのため）
export async function getNextSequenceNumber(
  settings: GitHubSettings,
  token: string,
  folder: string,
  dateStr: string
): Promise<number> {
  const files = await listContents({
    owner: settings.owner,
    repo: settings.repo,
    branch: settings.branch,
    token,
    path: folder,
  });

  const pattern = new RegExp(`^${dateStr}-(\\d{3})\\.md$`);
  const numbers = files
    .filter((f) => f.type === 'file' && pattern.test(f.name))
    .map((f) => parseInt(f.name.match(pattern)![1], 10));

  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
}

export async function resolveUploadPath(
  settings: GitHubSettings,
  token: string,
  folder: string,
  existingPath: string | null
): Promise<string> {
  if (existingPath) return existingPath;

  const dateStr = getDateString();
  const seq = await getNextSequenceNumber(settings, token, folder, dateStr);
  return generateFilePath(folder, dateStr, seq);
}
