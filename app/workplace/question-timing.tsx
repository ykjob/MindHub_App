import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, radius, touchTarget } from '../../src/theme';
import {
  SITE_RULE_OPTIONS,
  STOP_STATE_OPTIONS,
  ELAPSED_OPTIONS,
  DANGER_OPTIONS,
  IMPACT_OPTIONS,
  MIN_CHECK_OPTIONS,
  validateQuestionTimingInput,
  judgeQuestionTiming,
  type SiteRuleAnswer,
  type StopState,
  type Elapsed,
  type DangerKey,
  type ImpactKey,
  type MinCheckKey,
  type MultiAnswer,
  type QuestionTimingInput,
  type QuestionTimingResult,
} from '../../src/features/workplace/questionTiming';
import {
  getQuestionTimingHandoff,
  clearQuestionTimingHandoff,
  setQuestionFormHandoff,
  type QuestionTimingHandoff,
} from '../../src/features/workplace/workplaceHandoff';

const PRIVACY_NOTICE =
  '会社名・システム名・URL・認証情報などの具体的な対象名は入力しないでください。危険条件は一般化された選択肢だけで判断します。';

// 複数選択のトグル（未回答／該当なし／1件以上を区別）。空になったら未回答へ戻す。
function toggleMultiKey<K extends string>(
  answer: MultiAnswer<K>,
  key: K
): MultiAnswer<K> {
  if (answer.kind === 'selected') {
    if (answer.keys.includes(key)) {
      const rest = answer.keys.filter((k) => k !== key);
      return rest.length > 0 ? { kind: 'selected', keys: rest } : { kind: 'unanswered' };
    }
    return { kind: 'selected', keys: [...answer.keys, key] };
  }
  return { kind: 'selected', keys: [key] };
}

// 「該当なし」トグル（他の選択とは排他。再度押すと未回答へ戻す）。
function toggleMultiNone<K extends string>(answer: MultiAnswer<K>): MultiAnswer<K> {
  return answer.kind === 'none' ? { kind: 'unanswered' } : { kind: 'none' };
}

function isKeySelected<K extends string>(answer: MultiAnswer<K>, key: K): boolean {
  return answer.kind === 'selected' && answer.keys.includes(key);
}

// 詰まり記録の引き継ぎ＋急ぎ度候補から、質問フォームの初期値を組み立てる（32 §13）。
// 判定理由は含めない。同じ内容を複数欄へ重複させない。
function buildQuestionFormValues(
  stuck: QuestionTimingHandoff | null,
  urgency: string
) {
  const situation = stuck?.situation ?? '';
  const error = stuck?.error ?? '';
  const backgroundParts: string[] = [];
  if (situation.trim().length > 0) backgroundParts.push(situation);
  if (error.trim().length > 0) backgroundParts.push(`エラー内容：\n${error}`);
  return {
    ask: stuck?.wantToConfirm ?? '',
    background: backgroundParts.join('\n\n'),
    checked: '',
    tried: stuck?.tried ?? '',
    decision: '',
    urgency,
  };
}

export default function WorkplaceQuestionTimingScreen() {
  const insets = useSafeAreaInsets();

  // 詰まり記録からの引き継ぎ。useState初期化関数では純粋に get するだけ（副作用なし＝Strict Mode安全）。
  // 初回commit後に useEffect で1回だけ clear する（clearは複数回でも安全）。
  const [stuck] = useState<QuestionTimingHandoff | null>(() =>
    getQuestionTimingHandoff()
  );
  useEffect(() => {
    clearQuestionTimingHandoff();
  }, []);

  const [siteRule, setSiteRule] = useState<SiteRuleAnswer | null>(null);
  const [danger, setDanger] = useState<MultiAnswer<DangerKey>>({ kind: 'unanswered' });
  const [stopState, setStopState] = useState<StopState | null>(null);
  const [elapsed, setElapsed] = useState<Elapsed | null>(null);
  const [impact, setImpact] = useState<MultiAnswer<ImpactKey>>({ kind: 'unanswered' });
  const [minChecks, setMinChecks] = useState<MinCheckKey[]>([]);

  const [result, setResult] = useState<QuestionTimingResult | null>(null);
  const [missing, setMissing] = useState<string[]>([]);

  // 「判定する」直後だけ、結果ブロックまたは不足案内の先頭へ1回自動スクロールする。
  // 初回表示：未表示 → 待ちフラグ → onLayoutでスクロール。
  // 再押下：既に表示（Y座標取得済み）→ onLayout非発火のため rAF で1回スクロール。
  // 固定setTimeout・measureInWindow・絶対座標は使わない。content内Y座標だけを使う。
  const scrollRef = useRef<ScrollView>(null);
  const pendingJudgeScrollRef = useRef(false);
  const resultYRef = useRef<number | null>(null);
  const missingYRef = useRef<number | null>(null);
  const judgeScrollRafRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (judgeScrollRafRef.current != null) cancelAnimationFrame(judgeScrollRafRef.current);
    };
  }, []);

  // 結果欄先頭へスクロール（余白を残す）。content内Y座標のみ使用。
  function scrollJudgeTo(y: number) {
    scrollRef.current?.scrollTo({ y: Math.max(y - spacing.md, 0), animated: true });
  }

  // 入力を変更したら、古い判定結果・不足案内をクリアする（再度「判定する」が必要な状態へ）。
  // 表示が消えるのでY座標も無効化し、次回は初回表示（onLayout）扱いにする。スクロールはしない。
  function clearResult() {
    setResult(null);
    setMissing([]);
    resultYRef.current = null;
    missingYRef.current = null;
    pendingJudgeScrollRef.current = false;
  }

  // 判定/不足案内の表示後にスクロールを予約する。
  // Y座標取得済み（再押下でonLayout非発火）→ rAFで1回スクロール。未取得（初回）→ onLayoutで実行。
  function scheduleJudgeScroll(yRef: React.MutableRefObject<number | null>) {
    if (yRef.current != null) {
      if (judgeScrollRafRef.current != null) cancelAnimationFrame(judgeScrollRafRef.current);
      const y = yRef.current;
      judgeScrollRafRef.current = requestAnimationFrame(() => {
        if (mountedRef.current) scrollJudgeTo(y);
      });
      pendingJudgeScrollRef.current = false;
    } else {
      pendingJudgeScrollRef.current = true;
    }
  }

  // 結果/不足案内の onLayout：Y座標を保持し、初回表示（pendingフラグtrue）ならスクロールする。
  function onJudgeTargetLayout(yRef: React.MutableRefObject<number | null>, y: number) {
    yRef.current = y;
    if (!pendingJudgeScrollRef.current) return;
    pendingJudgeScrollRef.current = false;
    scrollJudgeTo(y);
  }

  const currentInput = (): QuestionTimingInput => ({
    siteRule,
    danger,
    stopState,
    elapsed,
    impact,
    minChecks,
  });

  function handleJudge() {
    const input = currentInput();
    const v = validateQuestionTimingInput(input);
    if (!v.ok) {
      setResult(null);
      setMissing(v.missing);
      // 不足案内の先頭へ（初回はonLayout、再押下はrAFで）1回スクロールする。
      scheduleJudgeScroll(missingYRef);
      return;
    }
    setMissing([]);
    setResult(judgeQuestionTiming(input));
    // 結果ブロックの先頭へ（初回はonLayout、再押下はrAFで）1回スクロールする。
    scheduleJudgeScroll(resultYRef);
  }

  // 判定せず質問文を作る：判定結果・急ぎ度を自動決定せず、詰まり内容だけ引き継ぐ。
  function handleSkipToQuestion() {
    setQuestionFormHandoff(buildQuestionFormValues(stuck, ''));
    router.push('/workplace/question');
  }

  // 判定結果から質問文を作る：急ぎ度候補を引き継ぐ。
  function handleResultToQuestion() {
    const urgency = result?.urgencyCandidate ?? '';
    setQuestionFormHandoff(buildQuestionFormValues(stuck, urgency));
    router.push('/workplace/question');
  }

  function goBackToStuck() {
    if (router.canGoBack()) router.back();
    else router.replace('/workplace/stuck');
  }

  function goToWorkplace() {
    router.replace('/workplace');
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: spacing.xl + insets.bottom },
      ]}
    >
      <Text style={styles.intro}>
        質問へ切り替える目安を整理します。これは正解の自動判定ではなく、安全側に整理するための補助です。
      </Text>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          現場で質問・確認の時間や手順が決められている場合は、そのルールを優先してください。
        </Text>
      </View>
      <View style={styles.notice}>
        <Text style={styles.noticeText}>{PRIVACY_NOTICE}</Text>
      </View>

      {/* QT-INPUT-01 現場ルール（ラジオ） */}
      <Group title="現場のルール">
        {SITE_RULE_OPTIONS.map((o) => (
          <SelectRow
            key={o.key}
            kind="radio"
            label={o.label}
            selected={siteRule === o.key}
            onPress={() => {
              setSiteRule(o.key);
              clearResult();
            }}
          />
        ))}
      </Group>

      {/* QT-INPUT-02 危険・高影響条件（複数選択＋該当なし排他） */}
      <Group title="危険・高影響条件（当てはまるものすべて）">
        {DANGER_OPTIONS.map((o) => (
          <SelectRow
            key={o.key}
            kind="check"
            label={o.label}
            selected={isKeySelected(danger, o.key)}
            onPress={() => {
              setDanger((prev) => toggleMultiKey(prev, o.key));
              clearResult();
            }}
          />
        ))}
        <SelectRow
          kind="check"
          label="該当なし"
          selected={danger.kind === 'none'}
          onPress={() => {
            setDanger((prev) => toggleMultiNone(prev));
            clearResult();
          }}
        />
      </Group>

      {/* QT-INPUT-03 作業停止状態（ラジオ） */}
      <Group title="作業の停止状態">
        {STOP_STATE_OPTIONS.map((o) => (
          <SelectRow
            key={o.key}
            kind="radio"
            label={o.label}
            selected={stopState === o.key}
            onPress={() => {
              setStopState(o.key);
              clearResult();
            }}
          />
        ))}
      </Group>

      {/* QT-INPUT-04 経過時間（ラジオ） */}
      <Group title="経過時間">
        {ELAPSED_OPTIONS.map((o) => (
          <SelectRow
            key={o.key}
            kind="radio"
            label={o.label}
            selected={elapsed === o.key}
            onPress={() => {
              setElapsed(o.key);
              clearResult();
            }}
          />
        ))}
      </Group>

      {/* QT-INPUT-05 期限・周囲への影響（複数選択＋該当なし排他） */}
      <Group title="期限・周囲への影響（当てはまるものすべて）">
        {IMPACT_OPTIONS.map((o) => (
          <SelectRow
            key={o.key}
            kind="check"
            label={o.label}
            selected={isKeySelected(impact, o.key)}
            onPress={() => {
              setImpact((prev) => toggleMultiKey(prev, o.key));
              clearResult();
            }}
          />
        ))}
        <SelectRow
          kind="check"
          label="該当なし"
          selected={impact.kind === 'none'}
          onPress={() => {
            setImpact((prev) => toggleMultiNone(prev));
            clearResult();
          }}
        />
      </Group>

      {/* QT-INPUT-06 最低限の確認（複数選択・0件でも有効） */}
      <Group title="質問前に確認できたこと（できたものすべて）">
        {MIN_CHECK_OPTIONS.map((o) => (
          <SelectRow
            key={o.key}
            kind="check"
            label={o.label}
            selected={minChecks.includes(o.key)}
            onPress={() => {
              setMinChecks((prev) =>
                prev.includes(o.key)
                  ? prev.filter((k) => k !== o.key)
                  : [...prev, o.key]
              );
              clearResult();
            }}
          />
        ))}
      </Group>

      {missing.length > 0 ? (
        <View
          style={styles.missingBox}
          // 入力不足時：Y座標を保持し、初回表示ならこの不足案内の先頭へ1回スクロール（判定する直後のみ）。
          onLayout={(e) => onJudgeTargetLayout(missingYRef, e.nativeEvent.layout.y)}
        >
          <Text style={styles.missingText}>
            次の項目に回答してください：{missing.join('、')}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={handleJudge}
        accessibilityRole="button"
        accessibilityLabel="質問タイミングを判定する"
      >
        <Text style={styles.primaryBtnText}>判定する</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkBtn}
        onPress={handleSkipToQuestion}
        accessibilityRole="button"
        accessibilityLabel="判定せず質問文を作る"
      >
        <Text style={styles.linkBtnText}>判定せず質問文を作る</Text>
      </TouchableOpacity>

      {result ? (
        <View
          style={styles.resultArea}
          // 判定成功時：Y座標を保持し、初回表示なら結果ブロック全体の先頭（現場ルール優先注意があれば
          // その先頭、なければ判定結果見出し）へ1回スクロール（判定する直後のみ）。
          onLayout={(e) => onJudgeTargetLayout(resultYRef, e.nativeEvent.layout.y)}
        >
          {result.siteRulePriority ? (
            <View style={styles.siteRuleBox}>
              <Text style={styles.siteRuleText}>
                現場ルールを優先してください。MindHubの目安と現場ルールが異なる場合があります。
              </Text>
            </View>
          ) : null}

          <Text style={styles.resultLabel} accessibilityRole="header">
            判定結果：{result.verdictLabel}
          </Text>

          {result.reasons.length > 0 ? (
            <View style={styles.resultBlock}>
              <Text style={styles.blockTitle}>判定理由</Text>
              {result.reasons.map((r, i) => (
                <Text key={i} style={styles.bullet}>
                  ・{r}
                </Text>
              ))}
            </View>
          ) : null}

          {result.nextActions.length > 0 ? (
            <View style={styles.resultBlock}>
              <Text style={styles.blockTitle}>次に行うこと</Text>
              {result.nextActions.map((a, i) => (
                <Text key={i} style={styles.bullet}>
                  ・{a}
                </Text>
              ))}
            </View>
          ) : null}

          <Text style={styles.resultHint}>
            これは目安です。結果に関わらず、質問文を作ることも、調査を続けることも選べます。
          </Text>

          {/* もう少し調査する：主要＝調査を見直す。それ以外：主要＝質問文を作る（32 §12.1） */}
          {result.verdict === 'investigate' ? (
            <>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={goBackToStuck}
                accessibilityRole="button"
                accessibilityLabel="調査内容を見直す"
              >
                <Text style={styles.primaryBtnText}>調査内容を見直す</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={handleResultToQuestion}
                accessibilityRole="button"
                accessibilityLabel="質問文を作る"
              >
                <Text style={styles.secondaryBtnText}>質問文を作る</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleResultToQuestion}
                accessibilityRole="button"
                accessibilityLabel="質問文を作る"
              >
                <Text style={styles.primaryBtnText}>質問文を作る</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={goBackToStuck}
                accessibilityRole="button"
                accessibilityLabel="詰まり記録へ戻る"
              >
                <Text style={styles.secondaryBtnText}>詰まり記録へ戻る</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={goToWorkplace}
            accessibilityRole="button"
            accessibilityLabel="現場適応へ戻る"
          >
            <Text style={styles.linkBtnText}>現場適応へ戻る</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
}

// --- 選択行・グループ（色だけで状態を表さず、記号・文字・accessibilityStateを併用） ---

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

function SelectRow({
  kind,
  label,
  selected,
  onPress,
}: {
  kind: 'radio' | 'check';
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const marker = kind === 'radio' ? (selected ? '◉' : '○') : selected ? '☑' : '☐';
  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowSelected]}
      onPress={onPress}
      accessibilityRole={kind === 'radio' ? 'radio' : 'checkbox'}
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={label}
    >
      <Text style={[styles.marker, selected && styles.markerSelected]}>{marker}</Text>
      <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  intro: { fontSize: typography.body, color: '#374151', lineHeight: 20 },
  notice: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  noticeText: { fontSize: typography.caption, color: colors.warningText, lineHeight: 18 },
  group: { gap: spacing.xs, marginTop: spacing.sm },
  groupTitle: {
    fontSize: typography.sectionTitle,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: touchTarget.min,
  },
  rowSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  marker: { fontSize: 16, color: colors.textFaint, width: 20, textAlign: 'center' },
  markerSelected: { color: colors.brand },
  rowLabel: { flex: 1, fontSize: typography.body, color: colors.textPrimary, lineHeight: 19 },
  rowLabelSelected: { fontWeight: '600', color: colors.brandStrongText },
  missingBox: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  missingText: { fontSize: typography.body, color: colors.danger, lineHeight: 19 },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    minHeight: touchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: { fontSize: typography.cardTitle, fontWeight: '600', color: colors.surface },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.brand,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    minHeight: touchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: { fontSize: typography.body, fontWeight: '600', color: colors.brand },
  linkBtn: {
    minHeight: touchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkBtnText: { fontSize: typography.body, color: colors.textSecondary, textDecorationLine: 'underline' },
  resultArea: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  siteRuleBox: {
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: colors.brandBorder,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  siteRuleText: { fontSize: typography.body, color: colors.brandStrongText, lineHeight: 19 },
  resultLabel: {
    fontSize: typography.pageTitle,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resultBlock: { gap: spacing.xs },
  blockTitle: { fontSize: typography.body, fontWeight: '700', color: colors.textPrimary },
  bullet: { fontSize: typography.body, color: '#374151', lineHeight: 20 },
  resultHint: { fontSize: typography.caption, color: colors.textSecondary, lineHeight: 18 },
});
