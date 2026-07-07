// アプリ内プロンプト一覧画面（app/prompts）向けのデータ提供層。
//
// docs/mobile-view/prompts.html を生成する scripts/generate_prompt_hub.mjs の
// loadPromptEntries() と同じ構造（セクション別 PromptGroup[]）をReact Native側にも
// 提供する。HTMLとアプリで同じプロンプト定義（chatgptPrompts.ts / mobilePrompts.ts）を
// 共有し、収録内容がずれないようにする。
//
// 仕様: docs/memo-app/14-mobile-prompt-hub-and-inbox.md

import { NOTE_CATEGORIES } from './noteCategories';
import { buildChatGptPrompt } from './chatgptPrompts';
import { MOBILE_PROMPTS, MOBILE_PROMPT_GROUP_LABELS } from './mobilePrompts';

export interface PromptEntry {
  id: string;
  name: string;
  promptBody: string;
  // カードに表示するバッジ（公開範囲や個人情報の注意）
  badge?: string;
  // カードに表示する補足注記
  note?: string;
}

export interface PromptGroup {
  key: string;
  label: string;
  entries: PromptEntry[];
}

/**
 * セクション別のプロンプト一覧を返す。コード固定定義から構築する。
 * generate_prompt_hub.mjs の loadPromptEntries() とセクション構成を一致させる。
 */
export function getPromptGroups(): PromptGroup[] {
  // メモ整理プロンプト（カテゴリ別）
  const categoryGroup: PromptGroup = {
    key: 'category',
    label: 'メモ整理プロンプト（カテゴリ別）',
    entries: NOTE_CATEGORIES.map((category) => ({
      id: category.type,
      name: category.label,
      promptBody: buildChatGptPrompt(category.type),
      badge:
        category.type === 'family'
          ? 'private / family用'
          : category.gitCandidateDefault
            ? undefined
            : '個人情報注意',
    })),
  };

  // 追加プロンプト（mobilePrompts.ts）。定義順を保ったままグループ分けする
  const extraGroups: PromptGroup[] = (
    Object.entries(MOBILE_PROMPT_GROUP_LABELS) as [
      keyof typeof MOBILE_PROMPT_GROUP_LABELS,
      string,
    ][]
  ).map(([key, label]) => ({
    key,
    label,
    entries: MOBILE_PROMPTS.filter((p) => p.group === key).map((p) => ({
      id: p.id,
      name: p.name,
      promptBody: p.promptBody,
      badge: p.group === 'family' ? 'private / family用' : undefined,
      note: p.note,
    })),
  }));

  return [categoryGroup, ...extraGroups].filter((g) => g.entries.length > 0);
}
