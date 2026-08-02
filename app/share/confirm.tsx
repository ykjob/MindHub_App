import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { colors, radius, spacing, touchTarget, typography } from '../../src/theme';
import { useCopyFeedback } from '../../src/hooks/useCopyFeedback';
import { useNavigationLock } from '../../src/hooks/useNavigationLock';
import { confirmDialog } from '../../src/utils/dialog';
import { openShareSheet, type ShareOutcome } from '../../src/utils/share';
import {
  getSharePayload,
  clearSharePayload,
  setNoteDraftHandoff,
  clearNoteDraftHandoff,
  type SharePayload,
} from '../../src/features/share/shareHandoff';
import {
  MEMO_SHARE_PURPOSES,
  DEFAULT_MEMO_SHARE_PURPOSE,
  buildMemoShareText,
  type MemoSharePurposeKey,
} from '../../src/features/share/shareTargets';
import {
  saveQuestionNote,
  saveReportNote,
} from '../../src/features/workplace/workplaceService';

// 共通の共有確認画面（Phase 16C-1）。仕様正本：docs/memo-app/33 §8・§10・§11・§13。
//
// - プロンプト集／さくっとメモ／現場適応の質問・報告から再利用する
// - 共有対象は shareHandoff（モジュール変数）で受け取る。URLクエリへ全文を入れない
// - 共有・コピー・保存はいずれもユーザー操作。MindHubから自動送信しない
// - 送信できたかは分からないため「共有画面を開きました」までしか表示しない（33 §10 SHARE-OS-04）
// - 現場適応（質問・報告）は守秘3チェック完了までコピー・共有を無効にする（23 §5.1・33 §8.4）
// - 元のプロンプト・さくっとメモ・質問／報告の元データは、この画面の編集で変更しない

const WORKPLACE_CONFIDENTIAL_CHECKS: readonly string[] = [
  '顧客名・会社名・個人名を含んでいない',
  '認証情報・社内URL・内部システム名を含んでいない',
  '会社固有の手順・判断基準・非公開情報を含んでいない',
];

const NORMAL_NOTICE =
  '氏名、会社名、認証情報、非公開URLなど、外部サービスへ渡してはいけない情報が含まれていないか確認してください。';

// 共有結果の表示は仕様の範囲に限定する。「共有が完了しました」等は表示しない（33 §10）。
const SHARE_RESULT_MESSAGE: Record<Exclude<ShareOutcome, 'dismissed'>, string> = {
  opened: '共有画面を開きました',
  unavailable:
    'この環境では共有画面を開けないため、コピーして利用してください。',
  failed: '共有画面を開けませんでした',
};

type SaveState = 'idle' | 'saving' | 'done' | 'failed';

function isWorkplaceKind(payload: SharePayload): boolean {
  return (
    payload.kind === 'workplace_question' || payload.kind === 'workplace_report'
  );
}

// 初期表示内容。さくっとメモは既定用途で組み立て、既存プロンプトを取得できなかった場合は
// 本文だけへフォールバックせず、理由を表示して操作を無効にする（`33` §20.2）。
function buildInitialContent(payload: SharePayload | null): {
  text: string;
  error: string | null;
} {
  if (!payload) return { text: '', error: null };
  if (payload.kind !== 'memo') return { text: payload.baseText, error: null };
  const result = buildMemoShareText(
    DEFAULT_MEMO_SHARE_PURPOSE,
    payload.baseText
  );
  return result.ok
    ? { text: result.text, error: null }
    : { text: '', error: result.message };
}

export default function ShareConfirmScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  // 共有対象の受け取り。useState初期化関数では純粋に get するだけ（Strict Mode安全）。
  // stateへ取り込んだ後、初回commit後の useEffect で1回だけ clear する。
  const [payload] = useState(() => getSharePayload());
  useEffect(() => {
    clearSharePayload();
  }, []);

  const [purpose, setPurpose] = useState<MemoSharePurposeKey>(
    DEFAULT_MEMO_SHARE_PURPOSE
  );
  const [initialContent] = useState(() => buildInitialContent(payload));
  // 共有用の編集文章（一時データ）。元データは書き換えない。
  const [text, setText] = useState(initialContent.text);
  // 現在の用途で生成した直後の文章。text と異なれば利用者が編集している。
  const [baseline, setBaseline] = useState(initialContent.text);
  // 用途に対応する依頼文を準備できなかった場合の理由（内部ID・本文は含めない）。
  const [purposeError, setPurposeError] = useState<string | null>(
    initialContent.error
  );
  const [checked, setChecked] = useState<boolean[]>(() =>
    WORKPLACE_CONFIDENTIAL_CHECKS.map(() => false)
  );

  const copy = useCopyFeedback();
  // 記録作成画面への遷移（通常系の保存）の二重push防止。
  const saveNavigation = useNavigationLock();
  const [shareResult, setShareResult] = useState<ShareOutcome | null>(null);
  const [sharing, setSharing] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const mountedRef = useRef(true);
  const sharingRef = useRef(false);
  const savingRef = useRef(false);
  const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const goBack = useCallback(() => {
    // 直アクセスで履歴がない場合もホームへ戻れるようにする（33 §13）。
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, []);

  const isMemo = payload?.kind === 'memo';
  const isWorkplace = payload ? isWorkplaceKind(payload) : false;
  const isNormalKind = payload
    ? payload.kind === 'prompt' || payload.kind === 'memo'
    : false;
  const hasText = text.trim().length > 0;
  // 依頼文を準備できていない場合は、本文だけを正常な生成結果として扱わない。
  const contentReady = hasText && purposeError === null;
  const checksDone = !isWorkplace || checked.every(Boolean);
  const canCopyOrShare = contentReady && checksDone;
  const saving = saveState === 'saving';

  function clearShareResult() {
    if (shareTimerRef.current) {
      clearTimeout(shareTimerRef.current);
      shareTimerRef.current = null;
    }
    setShareResult(null);
  }

  // 保存結果の表示・タイマーを現在の文章に合わせて解除する（古い結果を残さない）。
  function resetSaveState() {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    setSaveState((prev) => (prev === 'saving' ? prev : 'idle'));
  }

  // 文章が変わったら、直前のコピー結果・共有結果・保存結果はすべて現在の文章のものではない。
  // 現場適応系では守秘3チェックも「編集前の文章」に対する確認なので未選択へ戻し、
  // 編集後の最終文章を再確認しないとコピー・共有できないようにする（23 §5.1・33 §8.4）。
  // 保存（private・Git候補外の記録作成）は守秘チェックと連動させない（33 §20.5）。
  function handleTextChange(next: string) {
    // 実際に変わったときだけ状態を解除する（同じ文字列の再通知では何もしない）。
    if (next === text) return;
    setText(next);
    copy.reset();
    clearShareResult();
    resetSaveState();
    if (isWorkplace) {
      setChecked((prev) => (prev.some(Boolean) ? prev.map(() => false) : prev));
    }
  }

  // 用途を適用して共有文章を組み立て直す（元のさくっとメモ本文は変更しない）。
  function applyPurpose(key: MemoSharePurposeKey) {
    if (!payload || payload.kind !== 'memo') return;
    const result = buildMemoShareText(key, payload.baseText);
    setPurpose(key);
    if (result.ok) {
      setText(result.text);
      setBaseline(result.text);
      setPurposeError(null);
    } else {
      // 取得失敗時は本文だけへフォールバックせず、理由を表示して操作を無効にする。
      setText('');
      setBaseline('');
      setPurposeError(result.message);
    }
    copy.reset();
    clearShareResult();
    resetSaveState();
  }

  // 同じ用途の再選択は何も変更しない（no-op）。別用途は編集済みなら確認してから破棄する。
  function handlePurposeChange(key: MemoSharePurposeKey) {
    if (!payload || payload.kind !== 'memo') return;
    if (key === purpose) return;
    if (text === baseline) {
      applyPurpose(key);
      return;
    }
    confirmDialog({
      title: '用途を変更',
      message:
        '用途を変更すると、現在の編集内容は破棄されます。変更しますか？',
      confirmLabel: '変更する',
      cancelLabel: 'キャンセル',
      onConfirm: () => applyPurpose(key),
    });
  }

  function toggleCheck(index: number) {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }

  function showShareResult(outcome: ShareOutcome) {
    if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
    setShareResult(outcome);
    shareTimerRef.current = setTimeout(
      () => {
        if (mountedRef.current) setShareResult(null);
      },
      outcome === 'opened' ? 2500 : 5000
    );
  }

  async function handleShare() {
    if (sharingRef.current || !canCopyOrShare) return;
    sharingRef.current = true;
    setSharing(true);
    let outcome: ShareOutcome = 'failed';
    try {
      outcome = await openShareSheet(text);
    } catch {
      outcome = 'failed';
    }
    if (!mountedRef.current) {
      sharingRef.current = false;
      return;
    }
    setSharing(false);
    // キャンセルはエラーにも送信済みにもしない（編集文章はそのまま維持する）。
    if (outcome === 'dismissed') {
      setShareResult(null);
    } else {
      showShareResult(outcome);
    }
    sharingRef.current = false;
  }

  async function handleSave() {
    if (!payload || !contentReady) return;
    if (savingRef.current || saveState === 'saving' || saveState === 'done') {
      return;
    }
    // 通常系（プロンプト・さくっとメモ）は記録作成画面へ本文を引き継ぎ、
    // タイトル・カテゴリ・公開範囲はユーザーが確認して保存する（33 §11 SHARE-SAVE-02）。
    // 高速二重押下でも push は1回だけにする（ロック → 引き継ぎ → push の順）。
    if (payload.kind === 'prompt' || payload.kind === 'memo') {
      const body = text;
      saveNavigation.run(
        () => {
          setNoteDraftHandoff({ body });
          router.push('/notes/create');
        },
        () => {
          // 遷移が同期的に失敗した場合は引き継ぎを残さない（本文はログ・表示へ出さない）。
          clearNoteDraftHandoff();
        }
      );
      return;
    }
    // 現場適応系は一般の記録作成画面へ渡さず、専用保存処理で
    // private・Git候補false・現場適応タグを強制する（23 §5.1・33 §11 SHARE-SAVE-03）。
    // 保存開始時点の文章を確定させ、保存中は入力欄を編集不可にする（競合防止）。
    const snapshot = text;
    savingRef.current = true;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    setSaveState('saving');
    try {
      if (payload.kind === 'workplace_question') {
        await saveQuestionNote(db, snapshot);
      } else {
        await saveReportNote(db, snapshot);
      }
      if (mountedRef.current) setSaveState('done');
    } catch {
      if (mountedRef.current) {
        setSaveState('failed');
        saveTimerRef.current = setTimeout(() => {
          if (mountedRef.current) setSaveState('idle');
        }, 2500);
      }
    } finally {
      savingRef.current = false;
    }
  }

  // 直アクセス・リロードで共有対象がない場合。本文は復元せず、行き止まりにもしない。
  if (!payload) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle} accessibilityRole="header">
          共有する内容がありません
        </Text>
        <Text style={styles.emptyText}>
          プロンプト集・さくっとメモ・現場適応の画面から「ChatGPTなどへ共有」を選ぶと、この画面で内容を確認できます。
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace('/')}
          accessibilityRole="button"
          accessibilityLabel="ホームへ戻る"
        >
          <Text style={styles.primaryBtnText}>ホームへ戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 通常系の保存は記録作成画面への遷移操作、現場適応系はこの画面でのDB保存。
  // 表示・無効化条件を混同しない。
  const saveLabel = isNormalKind
    ? saveNavigation.navigating
      ? '記録作成画面へ移動しています…'
      : '新しい記録として保存'
    : saveState === 'saving'
      ? '保存中…'
      : saveState === 'done'
        ? '保存しました'
        : saveState === 'failed'
          ? '保存失敗'
          : '新しい記録として保存';
  const saveDisabled = isNormalKind
    ? !contentReady || saveNavigation.navigating
    : !contentReady || saving || saveState === 'done';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      keyboardVerticalOffset={insets.top + insets.bottom + spacing.sm}
      enabled={Platform.OS === 'android'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: spacing.xl + insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        {/* 出所（どの画面の内容か） */}
        <View style={styles.originRow}>
          <Text style={styles.originLabel}>共有元</Text>
          <Text style={styles.originValue}>{payload.originLabel}</Text>
        </View>

        {/* 用途選択（さくっとメモのみ） */}
        {isMemo ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              用途
            </Text>
            <View style={styles.chipRow}>
              {MEMO_SHARE_PURPOSES.map((p) => {
                const selected = purpose === p.key;
                return (
                  <TouchableOpacity
                    key={p.key}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => handlePurposeChange(p.key)}
                    accessibilityRole="button"
                    accessibilityLabel={p.label}
                    accessibilityState={{ selected }}
                    hitSlop={8}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {selected ? '◉ ' : '○ '}
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.hint}>
              用途を変えると文章を作り直します。元のさくっとメモは変わりません。
            </Text>
          </View>
        ) : null}

        {/* 編集可能な全文 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            外部で使う文章
          </Text>
          <TextInput
            style={[styles.input, saving && styles.inputDisabled]}
            value={text}
            onChangeText={handleTextChange}
            multiline
            textAlignVertical="top"
            placeholder="共有する文章"
            placeholderTextColor={colors.textFaint}
            accessibilityLabel="外部で使う文章"
            // 保存中は入力を止め、保存対象と表示中の文章がずれないようにする。
            editable={!saving}
            accessibilityState={{ disabled: saving }}
          />
          {purposeError ? (
            <Text style={styles.warnText} accessibilityLiveRegion="polite">
              {purposeError}
            </Text>
          ) : !hasText ? (
            <Text style={styles.warnText}>
              文章が空のため、コピー・共有・保存はできません。
            </Text>
          ) : null}
          {saving ? (
            <Text style={styles.hint}>保存中は文章を編集できません。</Text>
          ) : null}
        </View>

        {/* 通常注意 または 現場適応の守秘チェック */}
        {isWorkplace ? (
          <View style={styles.checkSection}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              外部へ出す前の確認（必須）
            </Text>
            {WORKPLACE_CONFIDENTIAL_CHECKS.map((label, index) => (
              <TouchableOpacity
                key={label}
                style={styles.checkRow}
                onPress={() => toggleCheck(index)}
                accessibilityRole="checkbox"
                accessibilityLabel={label}
                accessibilityState={{ checked: checked[index] }}
                // react-native-web は accessibilityState.checked を aria-checked へ反映しないため、
                // Webのスクリーンリーダー向けに明示する（nativeでは同じ値がaccessibilityStateへ写る）。
                aria-checked={checked[index]}
              >
                <Text style={styles.checkGlyph}>
                  {checked[index] ? '☑' : '☐'}
                </Text>
                <Text style={styles.checkLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
            {!checksDone ? (
              <Text style={styles.warnText}>
                3項目すべてを確認するまで、コピーと共有はできません。
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{NORMAL_NOTICE}</Text>
          </View>
        )}

        {/* 内容の操作（コピー・共有） */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.copyBtn,
              !canCopyOrShare && styles.btnDisabled,
              copy.done && styles.btnDone,
              copy.failed && styles.btnFailed,
            ]}
            onPress={() => copy.run(text)}
            disabled={!canCopyOrShare || copy.copying}
            accessibilityRole="button"
            accessibilityLabel="表示中の文章をコピー"
            accessibilityState={{ disabled: !canCopyOrShare || copy.copying }}
            accessibilityLiveRegion="polite"
          >
            <Text style={styles.actionText}>
              {copy.copying
                ? 'コピー中…'
                : copy.done
                  ? 'コピーしました'
                  : copy.failed
                    ? 'コピーできませんでした'
                    : 'コピー'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shareBtn,
              (!canCopyOrShare || sharing) && styles.btnDisabled,
            ]}
            onPress={handleShare}
            disabled={!canCopyOrShare || sharing}
            accessibilityRole="button"
            accessibilityLabel="ChatGPTなどへ共有"
            accessibilityState={{
              disabled: !canCopyOrShare || sharing,
              busy: sharing,
            }}
          >
            <Text style={styles.actionText}>
              {sharing ? '共有を開始しました' : 'ChatGPTなどへ共有'}
            </Text>
          </TouchableOpacity>
        </View>

        {shareResult && shareResult !== 'dismissed' ? (
          <View accessibilityLiveRegion="polite">
            <Text
              style={[
                styles.resultText,
                shareResult !== 'opened' && styles.resultTextWarn,
              ]}
            >
              {SHARE_RESULT_MESSAGE[shareResult]}
            </Text>
          </View>
        ) : null}

        <Text style={styles.hint}>
          共有先はご自身で選びます。MindHubは共有画面を開くところまでを行い、送信されたかどうかは確認できません。
        </Text>

        {/* 保存（任意）とキャンセル */}
        <View style={styles.footerSection}>
          <TouchableOpacity
            style={[
              styles.saveBtn,
              saveDisabled && styles.saveBtnDisabled,
              saveState === 'done' && styles.saveBtnDone,
              saveState === 'failed' && styles.saveBtnFailed,
            ]}
            onPress={handleSave}
            disabled={saveDisabled}
            accessibilityRole="button"
            accessibilityLabel={saveLabel}
            accessibilityState={{
              disabled: saveDisabled,
              busy: isNormalKind ? saveNavigation.navigating : saving,
            }}
            accessibilityLiveRegion="polite"
          >
            <Text
              style={[
                styles.saveBtnText,
                saveState === 'done' && styles.saveBtnTextDone,
                saveState === 'failed' && styles.saveBtnTextFailed,
              ]}
            >
              {saveLabel}
            </Text>
          </TouchableOpacity>
          <Text style={styles.hint}>
            {isWorkplace
              ? '保存するとprivate・Git候補外の新しい記録になります。元の入力内容は変わりません。'
              : '保存する場合は記録作成画面へ引き継ぎます。元のプロンプト・さくっとメモは変わりません。'}
          </Text>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="共有をやめて戻る"
          >
            <Text style={styles.cancelBtnText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    gap: spacing.md,
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: typography.sectionTitle,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    minHeight: touchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.surface,
  },
  originRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  originLabel: { fontSize: typography.caption, color: colors.textSecondary },
  originValue: {
    flex: 1,
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  section: { gap: spacing.sm },
  sectionTitle: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipSelected: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  chipText: { fontSize: typography.caption, color: colors.textSecondary },
  chipTextSelected: { color: colors.brandStrongText, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: 21,
    minHeight: 220,
    maxHeight: 420,
  },
  inputDisabled: { backgroundColor: '#F3F4F6', color: colors.textSecondary },
  notice: {
    backgroundColor: colors.warningSoft,
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  noticeText: {
    fontSize: typography.caption,
    color: colors.warningText,
    lineHeight: 18,
  },
  checkSection: {
    backgroundColor: colors.warningSoft,
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: radius.sm,
    padding: spacing.md,
    gap: spacing.sm,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    minHeight: touchTarget.min,
    paddingVertical: spacing.xs,
  },
  checkGlyph: { fontSize: typography.sectionTitle, color: colors.textPrimary },
  checkLabel: {
    flex: 1,
    fontSize: typography.caption,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  actions: { flexDirection: 'row', gap: spacing.sm },
  copyBtn: {
    flex: 1,
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    minHeight: touchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtn: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    minHeight: touchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: colors.disabledBackground },
  btnDone: { backgroundColor: '#16A34A' },
  btnFailed: { backgroundColor: colors.danger },
  actionText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.surface,
    textAlign: 'center',
  },
  resultText: { fontSize: typography.caption, color: colors.textPrimary },
  resultTextWarn: { color: colors.warningBadgeText },
  warnText: { fontSize: typography.caption, color: colors.warningBadgeText },
  hint: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  footerSection: {
    marginTop: spacing.xs,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  saveBtn: {
    borderWidth: 1,
    borderColor: colors.brand,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    minHeight: touchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnDisabled: { borderColor: colors.border },
  saveBtnDone: { borderColor: colors.success, backgroundColor: colors.successSoft },
  saveBtnFailed: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  saveBtnText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.brand,
  },
  saveBtnTextDone: { color: colors.success },
  saveBtnTextFailed: { color: colors.danger },
  cancelBtn: {
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    minHeight: touchTarget.min,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelBtnText: { fontSize: typography.body, color: colors.textSecondary },
});
