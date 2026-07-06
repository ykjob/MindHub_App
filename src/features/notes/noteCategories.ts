import type { NoteType, NoteSource, NoteVisibility } from './noteTypes';

export interface NoteCategory {
  type: NoteType;
  label: string;
  gitCandidateDefault: boolean;
}

export const NOTE_CATEGORIES: NoteCategory[] = [
  { type: 'worklog', label: '作業ログ', gitCandidateDefault: true },
  { type: 'research', label: '調査メモ', gitCandidateDefault: true },
  { type: 'command', label: 'コマンド・手順', gitCandidateDefault: true },
  { type: 'design', label: '設計メモ', gitCandidateDefault: true },
  { type: 'thought', label: '思考メモ', gitCandidateDefault: false },
  { type: 'chatgpt_log', label: 'ChatGPT保存ログ', gitCandidateDefault: false },
  { type: 'claude_prompt', label: 'Claude Code用プロンプト', gitCandidateDefault: true },
  { type: 'jobsearch', label: '就活メモ', gitCandidateDefault: false },
  { type: 'error_note', label: 'エラー対応メモ', gitCandidateDefault: true },
  { type: 'template', label: 'テンプレート', gitCandidateDefault: true },
  // 家庭内情報用（2026-07-06決定）。末尾に追加すること
  // （getNoteCategoryのfallbackがNOTE_CATEGORIES[4]=thoughtを指すため、途中挿入禁止）
  { type: 'family', label: '家族共有', gitCandidateDefault: false },
];

export const DEFAULT_NOTE_TYPE: NoteType = 'thought';

export function getNoteCategory(type: string): NoteCategory {
  return NOTE_CATEGORIES.find((c) => c.type === type) ?? NOTE_CATEGORIES[4];
}

export function getNoteCategoryLabel(type: string): string {
  return getNoteCategory(type).label;
}

export function getGitCandidateDefault(type: string): boolean {
  return getNoteCategory(type).gitCandidateDefault;
}

export const NOTE_SOURCES: { value: NoteSource; label: string }[] = [
  { value: 'manual', label: '手入力' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude_code', label: 'Claude Code' },
  { value: 'imported_file', label: 'ファイル取込' },
  { value: 'system', label: 'システム' },
];

export function getNoteSourceLabel(source: string): string {
  return NOTE_SOURCES.find((s) => s.value === source)?.label ?? source;
}

export const NOTE_VISIBILITIES: {
  value: NoteVisibility;
  label: string;
  description: string;
}[] = [
  { value: 'private', label: 'private', description: '個人的メモ。Gitに出さない' },
  { value: 'internal', label: 'internal', description: 'アプリ内管理用。必要なら後で整理' },
  { value: 'git_candidate', label: 'git_candidate', description: 'Git書き出し候補' },
  {
    value: 'family',
    label: 'family',
    description: '家族に見せてよいメモ。公開GitHub Pagesには出さない',
  },
];

export const SUGGESTED_PROJECTS: string[] = [
  'memo_app',
  'mindhub_app',
  'cocoro_call',
  'pead',
  'jobsearch',
  'claude_code',
  'chatgpt',
  'study',
  'life',
  'general',
];
