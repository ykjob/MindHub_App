// 現場適応モードのタグ定義。
// 仕様正本：docs/memo-app/22-workplace-adaptation-data-and-integration.md §4、
//           docs/memo-app/23-workplace-adaptation-security-and-portfolio.md §6.1
//
// 既存 notes を再利用し（schema変更なし）、場面はタグで区別する。
// 誤マッチ回避のため場面タグには workplace_ 接頭辞を付け、
// さらに共通タグ workplace を併記して将来の一括除外に備える。

export const WORKPLACE_COMMON_TAG = 'workplace';

export const WORKPLACE_START_TAG = 'workplace_start';
export const WORKPLACE_STUCK_TAG = 'workplace_stuck';
export const WORKPLACE_END_TAG = 'workplace_end';

// 保存・出力時に必ず守る守秘既定（23 §6.1）。
// カテゴリ初期値（getGitCandidateDefault）に依らず常に安全側で固定する。
export const WORKPLACE_FORCED_VISIBILITY = 'private' as const;
export const WORKPLACE_FORCED_GIT_CANDIDATE = false as const;

// 各入力・出力画面に常時表示する守秘注意（23 §3.1 / §4）。
export const WORKPLACE_PRIVACY_NOTICE =
  '顧客名・会社名・氏名・認証情報・社内URL・システム名・社内資料の本文は入力しないでください。' +
  '現場のルールや手順は一般化・抽象化し、個人用の覚書に留めてください。';

// 共通タグ ＋ 場面タグを notes の tags 形式（カンマ区切り）で組み立てる。
export function buildWorkplaceTags(sceneTag: string): string {
  return `${WORKPLACE_COMMON_TAG},${sceneTag}`;
}
