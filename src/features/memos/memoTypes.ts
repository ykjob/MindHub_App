export type GithubStatus =
  | 'not_uploaded'
  | 'uploaded'
  | 'modified_after_upload'
  | 'failed';

export type GoogleExportStatus = 'not_exported' | 'exported' | 'failed';

export interface Memo {
  id: string;
  body: string;
  category: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  github_status: GithubStatus;
  github_path: string | null;
  github_sha: string | null;
  github_uploaded_at: string | null;
  github_error_message: string | null;
  google_task_status: GoogleExportStatus;
  google_calendar_status: GoogleExportStatus;
  created_ai_output_count: number;
}

export interface CreateMemoInput {
  body: string;
  category?: string;
}

export interface UpdateMemoInput {
  id: string;
  body: string;
  category: string;
}
