import type { Note, NoteType, NoteVisibility } from './noteTypes';

// スマホ閲覧用HTML/JSON（公開GitHub Pages想定）へ出してよいメモの判定。
// 仕様: docs/memo-app/13-mobile-view-export.md §3、17-distribution-and-sharing.md §4
//
// Phase 10（スマホ閲覧用エクスポート）実装時にこの判定を使う。
// アプリ画面からはまだimportしない（判定ポリシーの先行定義）。

// 公開許可カテゴリ（13 §3.1）。family / thought / chatgpt_log / jobsearch は除外（13 §3.2〜3.3）
export const MOBILE_VIEW_ALLOWED_TYPES: NoteType[] = [
  'worklog',
  'research',
  'command',
  'design',
  'error_note',
  'template',
  'claude_prompt',
];

// 公開判定はカテゴリだけで行わず、visibilityを併用する（17 §4.2）。
// git_candidate以外（private / internal / family）はすべて公開しない
const MOBILE_VIEW_ALLOWED_VISIBILITY: NoteVisibility = 'git_candidate';

export type MobileViewJudgement = {
  exportable: boolean;
  // 除外理由（出力前確認画面での表示用。13 §4）
  reason?: string;
};

export function judgeMobileViewExport(
  note: Pick<Note, 'type' | 'visibility' | 'is_git_candidate' | 'archived_at'>
): MobileViewJudgement {
  if (note.archived_at !== null) {
    return { exportable: false, reason: 'アーカイブ済み' };
  }
  if (!note.is_git_candidate) {
    return { exportable: false, reason: 'Git候補ではない' };
  }
  if (note.visibility !== MOBILE_VIEW_ALLOWED_VISIBILITY) {
    return {
      exportable: false,
      reason: `visibilityが${note.visibility}（git_candidateのみ公開対象）`,
    };
  }
  if (!MOBILE_VIEW_ALLOWED_TYPES.includes(note.type)) {
    return { exportable: false, reason: `カテゴリ${note.type}は公開対象外` };
  }
  return { exportable: true };
}
