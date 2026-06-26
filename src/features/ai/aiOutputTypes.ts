export type AIOutputType =
  | 'summary'
  | 'task_schedule'
  | 'prompt'
  | 'spec'
  | 'review';

export interface AIOutput {
  id: string;
  memo_id: string;
  output_type: AIOutputType;
  content_json: string;
  created_at: string;
  updated_at: string;
}
