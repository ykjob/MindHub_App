export type NoteType =
  | 'worklog'
  | 'research'
  | 'command'
  | 'design'
  | 'thought'
  | 'chatgpt_log'
  | 'claude_prompt'
  | 'jobsearch'
  | 'error_note'
  | 'template'
  | 'family';

export type NoteSource =
  | 'manual'
  | 'chatgpt'
  | 'claude_code'
  | 'imported_file'
  | 'system';

// family：家族に見せてよいメモ。公開GitHub Pagesには出さない
export type NoteVisibility = 'private' | 'internal' | 'git_candidate' | 'family';

export interface Note {
  id: string;
  title: string;
  body: string;
  project: string;
  type: NoteType;
  tags: string;
  source: NoteSource;
  visibility: NoteVisibility;
  is_git_candidate: number;
  export_dir: string | null;
  export_filename: string | null;
  export_path: string | null;
  exported_at: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface NoteInput {
  title: string;
  body: string;
  project: string;
  type: NoteType;
  tags: string;
  source: NoteSource;
  visibility: NoteVisibility;
  isGitCandidate: boolean;
}

export type NoteSortKey = 'updated' | 'created';

export interface NoteFilter {
  keyword?: string;
  project?: string;
  type?: NoteType;
  tag?: string;
  gitCandidateOnly?: boolean;
  includeArchived?: boolean;
  sortBy?: NoteSortKey;
}

export function parseTags(tags: string): string[] {
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}
