import { Buffer } from 'buffer';
import type { GitHubContentItem, GitHubUploadResult } from './githubTypes';

const BASE_URL = 'https://api.github.com';

interface RequestParams {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

interface FileParams extends RequestParams {
  path: string;
  content: string;
  message: string;
}

interface UpdateFileParams extends FileParams {
  sha: string;
}

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

export function encodeBase64(text: string): string {
  return Buffer.from(text, 'utf-8').toString('base64');
}

export async function listContents(
  params: RequestParams & { path: string }
): Promise<GitHubContentItem[]> {
  const url = `${BASE_URL}/repos/${params.owner}/${params.repo}/contents/${params.path}?ref=${params.branch}`;
  const res = await fetch(url, { headers: headers(params.token) });

  if (res.status === 404) return [];
  if (!res.ok) {
    const body = await res.text();
    throw Object.assign(new Error(`GitHub API error: ${res.status} ${body}`), {
      status: res.status,
    });
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createFile(
  params: FileParams
): Promise<GitHubUploadResult> {
  const url = `${BASE_URL}/repos/${params.owner}/${params.repo}/contents/${params.path}`;
  const body = JSON.stringify({
    message: params.message,
    content: encodeBase64(params.content),
    branch: params.branch,
  });

  const res = await fetch(url, {
    method: 'PUT',
    headers: headers(params.token),
    body,
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw Object.assign(
      new Error(`GitHub create error: ${res.status} ${errBody}`),
      { status: res.status }
    );
  }

  const data = await res.json();
  return {
    path: params.path,
    sha: data.content.sha as string,
  };
}

export async function updateFile(
  params: UpdateFileParams
): Promise<GitHubUploadResult> {
  const url = `${BASE_URL}/repos/${params.owner}/${params.repo}/contents/${params.path}`;
  const body = JSON.stringify({
    message: params.message,
    content: encodeBase64(params.content),
    sha: params.sha,
    branch: params.branch,
  });

  const res = await fetch(url, {
    method: 'PUT',
    headers: headers(params.token),
    body,
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw Object.assign(
      new Error(`GitHub update error: ${res.status} ${errBody}`),
      { status: res.status }
    );
  }

  const data = await res.json();
  return {
    path: params.path,
    sha: data.content.sha as string,
  };
}
