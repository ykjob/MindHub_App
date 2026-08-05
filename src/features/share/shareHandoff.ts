// Phase 16C の画面間一時引き継ぎ。仕様正本：docs/memo-app/33 §12・§13。
//
// 共有本文・共有用編集文章は一時データであり、次を守る。
//   - URLクエリ / route params / SQLite / ログ / エラー / analytics へ入れない
//   - モジュールレベルの一時変数だけで保持する（リロード・直アクセスでは復元されない）
//   - 値がなくてもクラッシュせず、受け側は空状態を表示する
//
// Phase 16B の workplaceHandoff.ts と同じ set / get / clear の3操作に分ける
// （React Strict Modeで useState 初期化関数が複数回呼ばれても安全にするため、
//  読み取り副作用のある consume は持たない）。
//   - set  ：古い値を新しい値で上書きする（新しい共有を開始した時点で前の値は破棄される）
//   - get  ：現在値を返すだけの純粋な読み取り
//   - clear：対象値を null へ戻す（すでに null でもエラーにならず複数回実行できる）
// 受け側は useState 初期化関数で get し（＝stateへ取り込んでから）、
// 初回commit後の useEffect で clear する。stateへ取り込む前には消さない。
//
// 用途の異なる2種類を別スロット・別型・別関数名に分離し、混線しない構造にする。
//   A：共有確認画面へ渡す共有対象      （SharePayload）
//   B：記録作成画面へ渡す本文prefill    （NoteDraftHandoff）

// --- A：対象画面 → 共有確認画面 ---

/** 共有元の種別。用途選択（5用途）と守秘チェックの要否をこれで決める。 */
export type ShareOriginKind =
  | 'prompt'
  | 'memo'
  | 'workplace_question'
  | 'workplace_report';

export interface SharePayload {
  kind: ShareOriginKind;
  /** 共有確認画面に表示する出所（プロンプト名・さくっとメモ・現場適応・質問／報告） */
  originLabel: string;
  /**
   * 共有対象の元テキスト。
   *   prompt              ：プロンプト本文
   *   memo                ：さくっとメモ本文（用途に応じて依頼文と組み立てる）
   *   workplace_question  ：完成質問文
   *   workplace_report    ：完成報告文
   */
  baseText: string;
}

let sharePayload: SharePayload | null = null;

export function setSharePayload(data: SharePayload): void {
  sharePayload = data;
}

/** 純粋な読み取り。現在値を返すだけで変更・削除しない。 */
export function getSharePayload(): SharePayload | null {
  return sharePayload;
}

export function clearSharePayload(): void {
  sharePayload = null;
}

// --- B：共有確認画面 → 記録作成画面（通常系の「新しい記録として保存」） ---
// 元のプロンプト・さくっとメモは上書きせず、新しい notes として作る前段のprefillだけを渡す。
// タイトル・カテゴリ・公開範囲はユーザーが記録作成画面で確認して決める（33 §11 SHARE-SAVE-02）。

export interface NoteDraftHandoff {
  body: string;
}

let noteDraftHandoff: NoteDraftHandoff | null = null;

export function setNoteDraftHandoff(data: NoteDraftHandoff): void {
  noteDraftHandoff = data;
}

/** 純粋な読み取り。現在値を返すだけで変更・削除しない。 */
export function getNoteDraftHandoff(): NoteDraftHandoff | null {
  return noteDraftHandoff;
}

export function clearNoteDraftHandoff(): void {
  noteDraftHandoff = null;
}
