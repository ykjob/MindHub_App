// 現場適応モード 質問タイミング判断支援（Phase 16B-1）の判定ロジック。
// 仕様正本：docs/memo-app/32-workplace-question-timing-rules.md
//
// このモジュールは純粋なTypeScriptとして実装し、React / Expo Router へ依存させない。
// 判定途中の入力・結果はDBへ保存しない（画面遷移中の一時データのみ。32 §3・§14）。
// 危険条件の弱体化・10分/20分の変更・AI自動判定・現場ルール本文の保存はしない（32 §19）。

// --- 判定結果（3段階。表示文言は変更しない。32 §10） ---

export type Verdict = 'urgent' | 'soon' | 'investigate';

export const VERDICT_LABEL: Record<Verdict, string> = {
  urgent: 'すぐ確認する',
  soon: '早めに質問する',
  investigate: 'もう少し調査する',
};

// 優先順位：urgent ＞ soon ＞ investigate（32 §10.1）。

// --- 入力の選択肢キーと表示（32 §9） ---

export type SiteRuleAnswer = 'yes' | 'no_unknown';
export type StopState = 'stopped' | 'partial' | 'just_started';
export type Elapsed = 'lt10' | 'ten_twenty' | 'gte20';

export interface Option<K extends string> {
  key: K;
  label: string;
}

// QT-INPUT-01 現場ルール（ラジオ相当）
export const SITE_RULE_OPTIONS: Option<SiteRuleAnswer>[] = [
  { key: 'yes', label: '現場で質問タイミングや確認手順が決められている' },
  { key: 'no_unknown', label: '決められていない／分からない' },
];

// QT-INPUT-03 作業停止状態（ラジオ相当）
export const STOP_STATE_OPTIONS: Option<StopState>[] = [
  { key: 'stopped', label: '完全に止まっていて、次に安全に試せることがない' },
  { key: 'partial', label: '一部は進められる' },
  { key: 'just_started', label: 'まだ調査を始めたばかり' },
];

// QT-INPUT-04 経過時間（ラジオ相当。タイマー・通知は持たない）
export const ELAPSED_OPTIONS: Option<Elapsed>[] = [
  { key: 'lt10', label: '10分未満' },
  { key: 'ten_twenty', label: '10分以上20分未満' },
  { key: 'gte20', label: '20分以上' },
];

// QT-INPUT-02 危険・高影響条件（複数選択。具体的な会社名・システム名・URL・認証情報は入力しない）
export type DangerKey =
  | 'prod'
  | 'customer'
  | 'pii'
  | 'auth'
  | 'irreversible'
  | 'security'
  | 'external'
  | 'authority';

interface DangerDef {
  key: DangerKey;
  label: string;
  reason: string;
}

export const DANGER_OPTIONS: DangerDef[] = [
  { key: 'prod', label: '本番環境・公開環境へ影響する', reason: '本番・公開環境へ影響するため、時間を待たず確認してください' },
  { key: 'customer', label: '顧客・利用者へ影響する', reason: '顧客・利用者へ影響するため、進める前に確認してください' },
  { key: 'pii', label: '個人情報・機密情報を扱う', reason: '個人情報・機密情報を扱うため、実行前の確認を優先してください' },
  { key: 'auth', label: 'ID・パスワード・トークン・APIキー・権限を扱う', reason: '認証情報・権限に関わるため、時間を待たず確認してください' },
  { key: 'irreversible', label: 'データ削除・上書き・移行など元に戻しにくい操作', reason: '元に戻しにくい操作のため、実行前の確認を優先してください' },
  { key: 'security', label: 'セキュリティ・障害・事故につながる可能性', reason: 'セキュリティ・障害・事故を防ぐため、確認を優先してください' },
  { key: 'external', label: '外部への送信・公開・リリースを伴う', reason: '外部への送信・公開を伴うため、実行前に確認してください' },
  { key: 'authority', label: '自分の権限・担当範囲で判断してよいか分からない', reason: '権限・担当範囲の判断が必要です' },
];

// QT-INPUT-05 期限・周囲への影響（複数選択）
export type ImpactKey =
  | 'deadline'
  | 'blockOthers'
  | 'rework'
  | 'specDecision'
  | 'beyondScope';

interface ImpactDef {
  key: ImpactKey;
  label: string;
  reason: string;
}

export const IMPACT_OPTIONS: ImpactDef[] = [
  { key: 'deadline', label: '今日中・直近の期限に影響する', reason: '期限に影響するため、早めの共有が適切です' },
  { key: 'blockOthers', label: '他の人の作業を止める', reason: '他の人の作業を止めるため、早めに共有してください' },
  { key: 'rework', label: '手戻りが大きくなる可能性がある', reason: '手戻りが大きくなる可能性があるため、早めに確認してください' },
  { key: 'specDecision', label: '仕様・要件の判断が必要', reason: '仕様・要件の判断が必要です' },
  { key: 'beyondScope', label: '自分の裁量を超えている', reason: '自分の裁量を超えるため、確認が必要です' },
];

// QT-INPUT-06 最低限の確認（複数選択。0件でも「まだ何も確認していない」という有効な入力）
export type MinCheckKey =
  | 'readInstructions'
  | 'readManual'
  | 'checkedError'
  | 'triedSmall'
  | 'canStateInOne';

interface MinCheckDef {
  key: MinCheckKey;
  label: string;
  nextAction: string;
}

export const MIN_CHECK_OPTIONS: MinCheckDef[] = [
  { key: 'readInstructions', label: '指示・チケット・仕様を読み直した', nextAction: '指示・チケット・仕様をもう一度確認する' },
  { key: 'readManual', label: 'マニュアル・README・過去記録を確認した', nextAction: 'マニュアル・README・過去の記録を確認する' },
  { key: 'checkedError', label: 'エラー表示・ログ・再現条件を確認した', nextAction: 'エラー表示・ログ・再現条件を整理する' },
  { key: 'triedSmall', label: '影響の小さい範囲で試せることを試した', nextAction: '影響の小さい範囲で試せることを試す' },
  { key: 'canStateInOne', label: '何を聞きたいかを一文で言える', nextAction: '聞きたいことを一文にまとめる' },
];

const MIN_CHECK_KEYS: MinCheckKey[] = MIN_CHECK_OPTIONS.map((o) => o.key);

// --- 複数選択の回答（未回答／該当なし／1件以上 を区別する。32 §4.3） ---
// 空配列を自動的に「該当なし」とみなさない。ユーザーが該当なしを明示した場合のみ 'none'。

export type MultiAnswer<K extends string> =
  | { kind: 'unanswered' }
  | { kind: 'none' }
  | { kind: 'selected'; keys: K[] };

// --- 判定入力・結果 ---

export interface QuestionTimingInput {
  siteRule: SiteRuleAnswer | null; // null = 未回答
  danger: MultiAnswer<DangerKey>;
  stopState: StopState | null; // null = 未回答
  elapsed: Elapsed | null; // null = 未回答
  impact: MultiAnswer<ImpactKey>;
  minChecks: MinCheckKey[]; // 0件でも有効（未回答概念を持たない）
}

export interface QuestionTimingResult {
  verdict: Verdict;
  verdictLabel: string;
  reasons: string[]; // 定型文。最大3件
  nextActions: string[]; // investigate時のみ。未実施の確認から最大3件
  siteRulePriority: boolean; // 判定結果とは独立（QT-RULE-04）
  urgencyCandidate: string | null; // 質問フォームの急ぎ度候補
}

export interface ValidationResult {
  ok: boolean;
  missing: string[]; // 未回答の必須群の表示名
}

const MAX_REASONS = 3;
const MAX_NEXT_ACTIONS = 3;

// --- 入力検証（32 §4.4） ---
// 必須：現場ルール／危険・高影響条件／作業停止状態／経過時間／期限・周囲への影響。
// 「最低限の確認」は0件でも有効なので必須にしない。
// 危険条件・影響条件は kind==='unanswered'（＝未回答）のみ不足扱い。空配列や 'none' は回答済み。
export function validateQuestionTimingInput(
  input: QuestionTimingInput
): ValidationResult {
  const missing: string[] = [];
  if (input.siteRule === null) missing.push('現場ルール');
  if (input.danger.kind === 'unanswered') missing.push('危険・高影響条件');
  if (input.stopState === null) missing.push('作業停止状態');
  if (input.elapsed === null) missing.push('経過時間');
  if (input.impact.kind === 'unanswered') missing.push('期限・周囲への影響');
  return { ok: missing.length === 0, missing };
}

// 複数選択で1件以上選ばれたキー配列（該当なし・未回答は空配列扱い）。
function selectedKeys<K extends string>(answer: MultiAnswer<K>): K[] {
  return answer.kind === 'selected' ? answer.keys : [];
}

// 完全停止かつ10分以上（QT-RULE-02 の「完全停止10分以上」）。
function isCompleteStop10Plus(input: QuestionTimingInput): boolean {
  return (
    input.stopState === 'stopped' &&
    (input.elapsed === 'ten_twenty' || input.elapsed === 'gte20')
  );
}

// 一般的な確認をすべて実施済み（次に安全に試せる項目が残っていない目安。QT-RULE-02）。
function allChecksDone(input: QuestionTimingInput): boolean {
  return MIN_CHECK_KEYS.every((k) => input.minChecks.includes(k));
}

// --- 判定（32 §11） ---
// 入力は validate 済みを前提とするが、未回答が残っていてもクラッシュしない。
// 未回答／該当なしの危険・影響条件は「選択なし」として安全に扱う（未回答を自動的に危険ありにしない）。
export function judgeQuestionTiming(
  input: QuestionTimingInput
): QuestionTimingResult {
  const siteRulePriority = input.siteRule === 'yes';
  const danger = selectedKeys(input.danger);
  const impact = selectedKeys(input.impact);

  // QT-RULE-01：危険・高影響条件が1件以上 → すぐ確認する（時間・他条件より優先）。
  if (danger.length > 0) {
    const reasons = DANGER_OPTIONS.filter((d) => danger.includes(d.key))
      .map((d) => d.reason)
      .slice(0, MAX_REASONS);
    return {
      verdict: 'urgent',
      verdictLabel: VERDICT_LABEL.urgent,
      reasons,
      nextActions: [],
      siteRulePriority,
      urgencyCandidate: '作業を進める前に確認したい',
    };
  }

  // QT-RULE-02：危険条件がなくても以下のいずれか → 早めに質問する。
  const soonReasons: string[] = [];
  if (isCompleteStop10Plus(input)) {
    soonReasons.push('完全に止まった状態が10分以上続いています');
  }
  if (input.elapsed === 'gte20') {
    soonReasons.push('通常の調査目安20分を超えています');
  }
  for (const def of IMPACT_OPTIONS) {
    if (impact.includes(def.key)) soonReasons.push(def.reason);
  }
  if (allChecksDone(input)) {
    soonReasons.push('一般的な確認は済んでおり、次に安全に試せる調査が残っていません');
  }

  if (soonReasons.length > 0) {
    return {
      verdict: 'soon',
      verdictLabel: VERDICT_LABEL.soon,
      reasons: soonReasons.slice(0, MAX_REASONS),
      nextActions: [],
      siteRulePriority,
      urgencyCandidate: '早めに確認したい',
    };
  }

  // QT-RULE-03：上記いずれにも該当しない → もう少し調査する。
  // （危険なし・完全停止10分以上でない・通常20分未満・影響なし・未実施の一般確認あり）
  const nextActions = MIN_CHECK_OPTIONS.filter(
    (c) => !input.minChecks.includes(c.key)
  )
    .map((c) => c.nextAction)
    .slice(0, MAX_NEXT_ACTIONS);

  return {
    verdict: 'investigate',
    verdictLabel: VERDICT_LABEL.investigate,
    reasons: [
      '危険・高影響条件はなく、影響の小さい範囲で確認を続けられます',
    ],
    nextActions,
    siteRulePriority,
    urgencyCandidate: null,
  };
}
