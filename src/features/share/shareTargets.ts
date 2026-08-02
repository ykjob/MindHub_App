// さくっとメモ共有の用途（5用途）と、共有文章の組み立て。
// 仕様正本：docs/memo-app/33-external-handoff-and-sharing.md §7.2（SHARE-MEMO-02・SHARE-MEMO-03）。
//
// 方針：
//   - 用途1・2・4 は既存プロンプト定義（chatgptPrompts.ts / mobilePrompts.ts）をIDで参照する。
//     プロンプト本文をこのファイルへ複製しない（複製すると42件と二重管理になる）
//   - 用途3「質問内容を整理する」だけは、既存42件に意味の合う定義がないため、
//     共有専用の固定依頼文（QUESTION_ORGANIZE_REQUEST）を使う。33 §7.2 の例外記録を参照
//   - 用途5は依頼文を付けず、さくっとメモ本文だけを初期表示する
//   - マッピングは名前の部分一致ではなくIDで固定する（33 §7.2）

import { getPromptGroups } from '../notes/promptHub';

/** 共有確認画面で選べる用途（さくっとメモのみ）。初期選択は organize。 */
export type MemoSharePurposeKey =
  | 'organize'
  | 'tasks'
  | 'question'
  | 'devrequest'
  | 'free';

export const DEFAULT_MEMO_SHARE_PURPOSE: MemoSharePurposeKey = 'organize';

/**
 * 用途3専用の固定依頼文（共有文章の組み立てだけに使う内部定義）。
 *
 * 既存42件に「質問内容を整理する」意味に合うプロンプトが存在せず、意味の合わない
 * 既存プロンプトを流用しないための例外として新設した（33 §7.2）。
 * この依頼文は次のいずれにも含めない：プロンプト集の42件 / MOBILE_PROMPTS /
 * NOTE_CATEGORIES / Prompt Hubの検索・分類 / DBテンプレート（note_templates）/
 * ユーザー編集可能なプロンプト / `35` の用途別プロンプト編集構想。
 *
 * 現場適応の質問構造（21〜23・32）を参考にした共有専用仕様であり、
 * buildQuestionText（未記入欄を含む完成質問文の生成）は呼び出さない。
 */
export const QUESTION_ORGANIZE_REQUEST = `以下のメモから、相手が答えやすい質問内容に整理してください。
メモに書かれていない事実を補わず、聞きたいこと、背景、自分で確認したこと、試したこと、相手に判断してほしいこと、不足している情報を分けてください。

出力形式：

# 質問内容の整理

## 聞きたいこと

## 背景

## 自分で確認したこと

## 試したこと

## 相手に判断してほしいこと

## 追加で確認が必要な情報`;

/** 依頼文の取得元。prompt＝既存定義をIDで参照、fixed＝共有専用固定文、none＝依頼文なし */
type PurposeRequestSource =
  | { type: 'prompt'; promptId: string }
  | { type: 'fixed'; body: string }
  | { type: 'none' };

export interface MemoSharePurpose {
  key: MemoSharePurposeKey;
  label: string;
  request: PurposeRequestSource;
}

export const MEMO_SHARE_PURPOSES: readonly MemoSharePurpose[] = [
  {
    // 思考メモとしてMarkdown整理する既存プロンプト（ダーッと書く／整理すると／決める必要があること）
    key: 'organize',
    label: '内容を整理する',
    request: { type: 'prompt', promptId: 'thought' },
  },
  {
    // だーっと書いたメモの行動化（今日やる／後日やる／保留／やらなくていい／確認が必要）
    key: 'tasks',
    label: 'やることを抽出する',
    request: { type: 'prompt', promptId: 'brain_dump_to_action' },
  },
  {
    // 既存42件に該当なし。共有専用の固定依頼文を使う（上記コメント・33 §7.2）
    key: 'question',
    label: '質問内容を整理する',
    request: { type: 'fixed', body: QUESTION_ORGANIZE_REQUEST },
  },
  {
    // Claude Code用プロンプトとして整理する既存プロンプト（作業目的／変更範囲／完了条件など）
    key: 'devrequest',
    label: '開発依頼に整える',
    request: { type: 'prompt', promptId: 'claude_prompt' },
  },
  {
    key: 'free',
    label: '自由に編集する',
    request: { type: 'none' },
  },
];

export function getMemoSharePurpose(
  key: MemoSharePurposeKey
): MemoSharePurpose {
  return (
    MEMO_SHARE_PURPOSES.find((p) => p.key === key) ?? MEMO_SHARE_PURPOSES[0]
  );
}

// 既存プロンプト本文の末尾にある入力待ち行（「整理対象：」「整理対象（説明文）：」）。
// 共有文章では【整理対象】見出しを別に付けるため、末尾に完全一致する場合だけ表示用に取り除く。
// 本文途中の記述や、プロンプト定義そのものは変更しない。
const TRAILING_TARGET_LINE = /^整理対象(?:（[^）]*）)?：$/;

/** 末尾の入力待ち行だけを取り除く（該当しなければ元の本文をそのまま返す） */
export function stripTrailingTargetPlaceholder(body: string): string {
  const lines = body.split('\n');
  let end = lines.length;
  while (end > 0 && lines[end - 1].trim() === '') end -= 1;
  if (end === 0) return body;
  if (!TRAILING_TARGET_LINE.test(lines[end - 1].trim())) return body;
  return lines.slice(0, end - 1).join('\n').replace(/\s+$/, '');
}

// 既存プロンプト定義（42件）からIDで本文を引く。定義側は読み取るだけで変更しない。
let promptBodyCache: Map<string, string> | null = null;

function getPromptBodyById(id: string): string | null {
  if (!promptBodyCache) {
    promptBodyCache = new Map();
    for (const group of getPromptGroups()) {
      for (const entry of group.entries) {
        promptBodyCache.set(entry.id, entry.promptBody);
      }
    }
  }
  return promptBodyCache.get(id) ?? null;
}

/** 用途に対応する依頼文を返す。依頼文なし（用途5）・定義が見つからない場合は null */
export function getPurposeRequestText(key: MemoSharePurposeKey): string | null {
  const { request } = getMemoSharePurpose(key);
  if (request.type === 'none') return null;
  if (request.type === 'fixed') return request.body;
  const body = getPromptBodyById(request.promptId);
  return body ? stripTrailingTargetPlaceholder(body) : null;
}

/**
 * さくっとメモの共有文章を組み立てる（33 §7.2）。
 *   【依頼内容】＜用途に対応する依頼文＞
 *   【整理対象】＜さくっとメモ本文＞
 * 依頼文がない用途（自由に編集する）と、依頼文を取得できなかった場合は本文だけを返す。
 */
export function buildMemoShareText(
  key: MemoSharePurposeKey,
  memoBody: string
): string {
  const request = getPurposeRequestText(key);
  if (!request) return memoBody;
  return `【依頼内容】\n${request}\n\n【整理対象】\n${memoBody}`;
}
