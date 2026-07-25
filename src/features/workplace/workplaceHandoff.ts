// 現場適応モード Phase 16B の画面間一時引き継ぎ。
// 仕様正本：docs/memo-app/32-workplace-question-timing-rules.md §13、docs/memo-app/33 §13（露出回避の考え方）。
//
// 本文・入力内容を URLクエリ / route params / SQLite / ログ / エラー / analytics へ入れない。
// モジュールレベルの一時変数のみで保持し、リロードで失われてよい。
// 直アクセスで値がなくてもクラッシュしない。
//
// set / get / clear の3操作に分ける（React Strict Modeで useState 初期化関数が複数回呼ばれても
// 安全にするため、読み取り副作用のある consume は持たない）。
//   - set  ：古い値を新しい値で上書きする
//   - get  ：現在値を返すだけ（変更・削除しない純粋な読み取り）
//   - clear：対象値を null へ戻す（すでに null でもエラーにならず、複数回実行できる）
// 読み取りは useState 初期化関数で get し、clear は useEffect（初回commit後）で1回行う。
//
// 用途の異なる2種類の引き継ぎを型と関数名で分離し、混同できない構造にする。
//   A：詰まり記録 → 質問タイミング確認   （QuestionTimingHandoff）
//   B：質問タイミング確認 → 質問文作成     （QuestionFormHandoff）

// --- A：詰まり記録 → 質問タイミング確認 ---
// 詰まり記録の現在値だけを渡す（判定はしない。判定は質問タイミング画面で行う）。

export interface QuestionTimingHandoff {
  situation: string;
  tried: string;
  wantToConfirm: string;
  error: string;
}

let questionTimingHandoff: QuestionTimingHandoff | null = null;

export function setQuestionTimingHandoff(data: QuestionTimingHandoff): void {
  questionTimingHandoff = data;
}

// 純粋な読み取り。現在値を返すだけで変更・削除しない（何度呼んでも同じ値）。
export function getQuestionTimingHandoff(): QuestionTimingHandoff | null {
  return questionTimingHandoff;
}

// 対象値を null へ戻す。すでに null でも安全で、複数回呼べる。
export function clearQuestionTimingHandoff(): void {
  questionTimingHandoff = null;
}

// --- B：質問タイミング確認 → 質問文作成 ---
// 質問フォームの initialValues に対応する引き継ぎ。急ぎ度は判定結果からの候補（スキップ時は空）。
// 判定理由はここに含めない（相手へ送る質問文へ自動挿入しないため。32 §13.1）。

export interface QuestionFormHandoff {
  ask: string;
  background: string;
  checked: string;
  tried: string;
  decision: string;
  urgency: string;
}

let questionFormHandoff: QuestionFormHandoff | null = null;

export function setQuestionFormHandoff(data: QuestionFormHandoff): void {
  questionFormHandoff = data;
}

// 純粋な読み取り。現在値を返すだけで変更・削除しない（何度呼んでも同じ値）。
export function getQuestionFormHandoff(): QuestionFormHandoff | null {
  return questionFormHandoff;
}

// 対象値を null へ戻す。すでに null でも安全で、複数回呼べる。
export function clearQuestionFormHandoff(): void {
  questionFormHandoff = null;
}
