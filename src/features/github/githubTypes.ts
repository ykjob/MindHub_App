export interface GitHubSettings {
  owner: string;
  repo: string;
  branch: string;
}

export interface GitHubContentItem {
  name: string;
  path: string;
  sha: string;
  type: 'file' | 'dir';
}

export interface GitHubUploadResult {
  path: string;
  sha: string;
}
