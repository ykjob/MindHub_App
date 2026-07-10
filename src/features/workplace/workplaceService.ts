import type { SQLiteDatabase } from 'expo-sqlite';
import type { Note } from '../notes/noteTypes';
import { createNote } from '../notes/noteService';
import { getLatestNoteByTag } from '../notes/noteRepository';
import { getDateString } from '../../utils/date';
import {
  WORKPLACE_END_TAG,
  WORKPLACE_FORCED_GIT_CANDIDATE,
  WORKPLACE_FORCED_VISIBILITY,
  buildWorkplaceTags,
} from './workplaceTags';

// 現場適応モードの保存は必ず守秘既定を強制する（23 §6.1）。
// type は gitCandidateDefault=false の 'thought' を使い、
// getGitCandidateDefault は経由しない（既定の二重防御）。
async function saveWorkplaceNote(
  db: SQLiteDatabase,
  params: { title: string; body: string; sceneTag: string }
): Promise<Note> {
  return createNote(db, {
    title: params.title.trim(),
    body: params.body,
    project: '',
    type: 'thought',
    tags: buildWorkplaceTags(params.sceneTag),
    source: 'manual',
    visibility: WORKPLACE_FORCED_VISIBILITY,
    isGitCandidate: WORKPLACE_FORCED_GIT_CANDIDATE,
  });
}

// 終業前メモを保存する（翌朝再開導線で読み出す唯一の保存対象）。
export async function saveEndNote(
  db: SQLiteDatabase,
  body: string
): Promise<Note> {
  return saveWorkplaceNote(db, {
    title: `終業前メモ ${getDateString()}`,
    body,
    sceneTag: WORKPLACE_END_TAG,
  });
}

// 直近の終業前メモ（再開メモ）を1件取得する。
export async function getLatestEndNote(
  db: SQLiteDatabase
): Promise<Note | null> {
  return getLatestNoteByTag(db, WORKPLACE_END_TAG);
}

// --- 生成テキスト組み立て（コピー・保存用） ---

function section(label: string, value: string): string {
  const v = value.trim();
  return `■ ${label}\n${v.length > 0 ? v : '（未記入）'}`;
}

export function buildStartText(v: {
  today: string;
  doneCondition: string;
  scope: string;
  checkFirst: string;
}): string {
  return [
    '【作業開始メモ】',
    section('今日の作業', v.today),
    section('完了条件', v.doneCondition),
    section('触る範囲', v.scope),
    section('先に確認すること', v.checkFirst),
  ].join('\n\n');
}

// 終業前メモ本文（buildEndText で生成した構造）を場面別に読み戻す。
// 生成フォーマット（■ ラベル\n値、空欄は「（未記入）」）を前提にパースする。
function parseEndNoteSections(body: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const block of body.split('\n\n')) {
    const m = block.match(/^■ (.+?)\n([\s\S]*)$/);
    if (m) {
      const label = m[1].trim();
      const value = m[2].trim();
      result[label] = value === '（未記入）' ? '' : value;
    }
  }
  return result;
}

// 翌朝再開時、直近の終業前メモから作業開始フォームの初期値を組み立てる。
// 「明日最初にやること」→「今日の作業」、「未完了」「補足」→「先に確認すること」。
// 構造が取り出せない本文は、そのまま「先に確認すること」に入れる（フォールバック）。
export function buildStartPrefillFromEndNote(body: string): {
  today: string;
  checkFirst: string;
} {
  const sections = parseEndNoteSections(body);
  if (Object.keys(sections).length === 0) {
    return { today: '', checkFirst: body.trim() };
  }
  const tomorrow = sections['明日最初にやること'] ?? '';
  const todo = sections['未完了'] ?? '';
  const note = sections['補足'] ?? '';
  const checkParts: string[] = [];
  if (todo) checkParts.push(`未完了: ${todo}`);
  if (note) checkParts.push(`補足: ${note}`);
  return { today: tomorrow, checkFirst: checkParts.join('\n') };
}

export function buildStuckText(v: {
  situation: string;
  tried: string;
  wantToConfirm: string;
  error: string;
}): string {
  const parts = [
    '【詰まり記録】',
    section('状況', v.situation),
    section('試したこと', v.tried),
    section('確認したいこと', v.wantToConfirm),
  ];
  if (v.error.trim().length > 0) {
    parts.push(section('エラー内容', v.error));
  }
  return parts.join('\n\n');
}

export function buildEndText(v: {
  doneToday: string;
  todo: string;
  firstTomorrow: string;
  note: string;
}): string {
  return [
    '【終業前メモ / 再開メモ】',
    section('今日やったこと', v.doneToday),
    section('未完了', v.todo),
    section('明日最初にやること', v.firstTomorrow),
    section('補足', v.note),
  ].join('\n\n');
}

// 質問文：相手が答えやすいよう結論から並べ、丸投げに見えない体裁にする。
export function buildQuestionText(v: {
  ask: string;
  background: string;
  checked: string;
  tried: string;
  decision: string;
  urgency: string;
}): string {
  const parts = [
    '【質問】',
    'お手すきのときに、以下について判断・助言をいただけますか。',
    section('聞きたいこと（結論）', v.ask),
    section('背景', v.background),
    section('自分で確認したこと', v.checked),
    section('試したこと', v.tried),
    section('判断してほしいこと', v.decision),
  ];
  if (v.urgency.trim().length > 0) {
    parts.push(section('急ぎ度', v.urgency));
  }
  return parts.join('\n\n');
}

// 進捗報告：結論を先に、完了・未完了・次の作業を分け、相談は最後に置く。
export function buildReportText(v: {
  state: string;
  doneToday: string;
  completed: string;
  remaining: string;
  blocker: string;
  next: string;
  consult: string;
}): string {
  const parts = [
    '【進捗報告】',
    section('現在の状態（結論）', v.state),
    section('今日やったこと', v.doneToday),
    section('完了したこと', v.completed),
    section('残っていること', v.remaining),
    section('詰まっていること', v.blocker),
    section('次にやること', v.next),
  ];
  if (v.consult.trim().length > 0) {
    parts.push(section('相談・確認したいこと', v.consult));
  }
  return parts.join('\n\n');
}
