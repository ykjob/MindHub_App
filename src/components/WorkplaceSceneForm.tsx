import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  type KeyboardEvent,
} from 'react-native';
import { useCopyFeedback } from '../hooks/useCopyFeedback';
import { WORKPLACE_PRIVACY_NOTICE } from '../features/workplace/workplaceTags';

type SaveState = 'idle' | 'saving' | 'done' | 'failed';

// 自動スクロール時に結果見出しを画面上端へ密着させないための余白（spacing.md 相当）。
const RESULT_SCROLL_TOP_GAP = 12;

export interface WorkplaceFieldDef {
  key: string;
  label: string;
  placeholder?: string;
  optional?: boolean;
}

// 出力表示後に1件だけ追加できる操作（Phase 16B：詰まり→質問タイミング確認への導線など）。
// render propではなく固定形式にし、現在の入力値・出力を受け取れるようにする。
export interface WorkplaceOutputAction {
  label: string;
  accessibilityLabel: string;
  onPress: (ctx: { values: Record<string, string>; output: string }) => void;
}

// 完了後の画面フロー操作（Phase 16B：質問文作成後の「ホームへ戻る／現場適応へ戻る」など）。
// outputAction（内容に対する導線）とは役割を分け、コピー・保存とも別セクションに置く。
// Phase 16Cで共有ボタンが増えても「内容操作（コピー/保存/共有）」と「画面フロー操作（戻る）」を分離できる。
export interface WorkplaceCompletionButton {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
}
export interface WorkplaceCompletionActions {
  primary: WorkplaceCompletionButton;
  secondary?: WorkplaceCompletionButton;
}

interface Props {
  intro: string;
  fields: WorkplaceFieldDef[];
  buildText: (values: Record<string, string>) => string;
  // 保存が必要な場面のみ渡す（現場適応モードでは終業前メモ・質問文）。
  onSave?: (text: string) => Promise<void>;
  saveLabel?: string;
  // 保存ヒント文の上書き（未指定時は既存文言を維持：onSaveありは終業前メモ向け、
  // onSaveなしは「この場面はコピーのみです」）。
  saveHint?: string;
  // 初期入力（翌朝再開・詰まり記録からの引き継ぎなど）。マウント時のみ反映する。
  initialValues?: Record<string, string>;
  // 引き継ぎ元が分かる案内文（あれば入力欄の上に表示）。
  banner?: string;
  // 出力表示後に表示する追加操作（1件・任意）。既存コピー／保存は維持する。
  outputAction?: WorkplaceOutputAction;
  // 出力表示後に表示する完了後の画面フロー操作（任意）。内容操作（コピー/保存）とは別セクション。
  completionActions?: WorkplaceCompletionActions;
}

// 現場適応モードの「入力 → 整理 → コピー（任意で保存）」を共通化した画面部品。
export default function WorkplaceSceneForm({
  intro,
  fields,
  buildText,
  onSave,
  saveLabel = '保存する',
  saveHint,
  initialValues,
  banner,
  outputAction,
  completionActions,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...(initialValues ?? {}),
  }));
  const [output, setOutput] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  // Androidでキーボード表示中に下側の入力欄が隠れ下までスクロールできない問題への局所対応。
  // KeyboardAvoidingViewは他入力画面で不安定だったため、キーボード高さぶんだけ
  // ScrollViewの下部余白を増やす方式にする（非表示時は0＝通常余白のまま）。
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // コピーは共通hookで二重実行防止・成功/失敗表示・タイマー解除・アンマウント安全を担保。
  const copy = useCopyFeedback({ failedMs: 2000 });

  // 保存中の二重実行防止と、失敗表示タイマー／アンマウント安全のための参照。
  const savingRef = useRef(false);
  const mountedRef = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 「整理する」直後だけ、出力欄の先頭へ1回自動スクロールする。
  // 初回表示：出力欄が未表示 → 待ちフラグ → 出力欄onLayoutでスクロール。
  // 再押下：出力欄が既に表示（Y座標取得済み）→ onLayoutが再発火しないため rAF で1回スクロール。
  // 固定setTimeout・measureInWindow・絶対座標は使わない。content内Y座標だけを使う。
  const scrollRef = useRef<ScrollView>(null);
  const pendingBuildScrollRef = useRef(false);
  const outputYRef = useRef<number | null>(null);
  const buildScrollRafRef = useRef<number | null>(null);

  // 出力欄先頭へスクロール（余白を残す）。content内Y座標のみ使用。
  function scrollOutputTo(y: number) {
    scrollRef.current?.scrollTo({
      y: Math.max(y - RESULT_SCROLL_TOP_GAP, 0),
      animated: true,
    });
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (buildScrollRafRef.current != null) cancelAnimationFrame(buildScrollRafRef.current);
    };
  }, []);

  // キーボード表示・非表示を監視し、表示中だけ下部余白へキーボード高さを加算する。
  // アンマウント時に両listenerを解除する。
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (event: KeyboardEvent) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  function setField(key: string, text: string) {
    setValues((prev) => ({ ...prev, [key]: text }));
    setOutput(null);
    setSaveState('idle');
    // 出力が消えるのでY座標を無効化し、次回は初回表示（onLayout）扱いにする。待ちフラグも解除。
    outputYRef.current = null;
    pendingBuildScrollRef.current = false;
  }

  function handleBuild() {
    // 整理する時点でソフトキーボードを閉じ、出力・操作を見やすくする（全5場面共通）。
    // 入力値・生成内容・保存/コピー処理は変更しない。固定setTimeoutは追加しない。
    Keyboard.dismiss();
    const filled: Record<string, string> = {};
    for (const f of fields) {
      filled[f.key] = values[f.key] ?? '';
    }
    setOutput(buildText(filled));
    setSaveState('idle');
    if (outputYRef.current != null) {
      // 再押下：出力欄が既に表示されており、入力不変だと onLayout が再発火しない。
      // 取得済みY座標へ rAF で1回だけスクロールする。
      if (buildScrollRafRef.current != null) cancelAnimationFrame(buildScrollRafRef.current);
      const y = outputYRef.current;
      buildScrollRafRef.current = requestAnimationFrame(() => {
        if (mountedRef.current) scrollOutputTo(y);
      });
    } else {
      // 初回表示：出力欄の onLayout でスクロールする。
      pendingBuildScrollRef.current = true;
    }
  }

  async function handleSave() {
    if (!output || !onSave) return;
    // 保存中・保存済みの再実行を防止（保存失敗後は再保存できる）。
    if (savingRef.current || saveState === 'saving' || saveState === 'done') return;
    savingRef.current = true;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    setSaveState('saving');
    try {
      await onSave(output);
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

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        // 表示中だけ通常の下部余白(40)へキーボード高さを加算（paddingBottomを上書き＝二重加算しない）。
        keyboardHeight > 0 && { paddingBottom: 40 + keyboardHeight },
      ]}
      keyboardShouldPersistTaps="handled"
      // ドラッグでキーボードが閉じてスクロールできない問題への対応。ドラッグ中は閉じない（明示）。
      keyboardDismissMode="none"
    >
      <Text style={styles.intro}>{intro}</Text>

      {banner ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{banner}</Text>
        </View>
      ) : null}

      <View style={styles.notice}>
        <Text style={styles.noticeText}>{WORKPLACE_PRIVACY_NOTICE}</Text>
      </View>

      {fields.map((f) => (
        <View key={f.key} style={styles.field}>
          <Text style={styles.label}>
            {f.label}
            {f.optional ? <Text style={styles.optional}>（任意）</Text> : null}
          </Text>
          <TextInput
            style={styles.input}
            value={values[f.key] ?? ''}
            onChangeText={(t) => setField(f.key, t)}
            placeholder={f.placeholder}
            placeholderTextColor="#9CA3AF"
            multiline
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.buildBtn}
        onPress={handleBuild}
        accessibilityRole="button"
        accessibilityLabel="入力内容を整理する"
      >
        <Text style={styles.buildBtnText}>整理する</Text>
      </TouchableOpacity>

      {output ? (
        <View
          style={styles.outputArea}
          // 出力欄はScrollViewの直接の子なので、layout.yはcontent内Y座標。
          // Y座標は毎回保持し（再押下時の rAF スクロールで再利用）、初回表示（pendingフラグtrue）の
          // ときだけこの先頭へ1回スクロールする。
          onLayout={(e) => {
            const y = e.nativeEvent.layout.y;
            outputYRef.current = y;
            if (!pendingBuildScrollRef.current) return;
            pendingBuildScrollRef.current = false;
            scrollOutputTo(y);
          }}
        >
          <Text style={styles.outputLabel} accessibilityRole="header">出力</Text>
          <View style={styles.outputBox}>
            <Text style={styles.outputText} selectable>
              {output}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.copyBtn,
                copy.done && styles.btnDone,
                copy.failed && styles.btnFailed,
              ]}
              onPress={() => copy.run(output)}
              disabled={copy.copying}
              accessibilityRole="button"
              accessibilityLabel="出力をコピー"
              accessibilityState={{ disabled: copy.copying }}
              accessibilityLiveRegion="polite"
            >
              <Text style={styles.actionText}>
                {copy.done
                  ? 'コピーしました'
                  : copy.failed
                  ? 'コピー失敗'
                  : 'コピー'}
              </Text>
            </TouchableOpacity>

            {onSave ? (
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  saveState === 'done' && styles.btnDone,
                  saveState === 'failed' && styles.btnFailed,
                ]}
                onPress={handleSave}
                disabled={saveState === 'saving' || saveState === 'done'}
                accessibilityRole="button"
                accessibilityLabel={saveLabel}
                accessibilityState={{
                  disabled: saveState === 'saving' || saveState === 'done',
                }}
                accessibilityLiveRegion="polite"
              >
                <Text style={styles.actionText}>
                  {saveState === 'saving'
                    ? '保存中…'
                    : saveState === 'done'
                    ? '保存しました'
                    : saveState === 'failed'
                    ? '保存失敗'
                    : saveLabel}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {outputAction ? (
            <TouchableOpacity
              style={styles.outputActionBtn}
              onPress={() => outputAction.onPress({ values, output })}
              accessibilityRole="button"
              accessibilityLabel={outputAction.accessibilityLabel}
            >
              <Text style={styles.outputActionText}>{outputAction.label}</Text>
            </TouchableOpacity>
          ) : null}

          {onSave ? (
            <Text style={styles.saveHint}>
              {saveHint ??
                '保存すると private・Git候補外で記録され、翌日この画面の上部に再開メモとして表示されます。'}
            </Text>
          ) : (
            <Text style={styles.saveHint}>
              {saveHint ?? 'この場面はコピーのみです（保存はしません）。'}
            </Text>
          )}

          {/* 完了後の画面フロー操作（内容操作＝コピー/保存とは別セクション・縦配置の全幅ボタン）。
              outputが存在する間は saveState に依らず表示する（保存前後・失敗後いずれも表示）。 */}
          {completionActions ? (
            <View style={styles.completionSection}>
              <Text style={styles.completionTitle} accessibilityRole="header">
                完了後の移動
              </Text>
              <TouchableOpacity
                style={styles.completionPrimaryBtn}
                onPress={completionActions.primary.onPress}
                accessibilityRole="button"
                accessibilityLabel={completionActions.primary.accessibilityLabel}
              >
                <Text style={styles.completionPrimaryText}>
                  {completionActions.primary.label}
                </Text>
              </TouchableOpacity>
              {completionActions.secondary ? (
                <TouchableOpacity
                  style={styles.completionSecondaryBtn}
                  onPress={completionActions.secondary.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={completionActions.secondary.accessibilityLabel}
                >
                  <Text style={styles.completionSecondaryText}>
                    {completionActions.secondary.label}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  intro: { fontSize: 14, color: '#374151', lineHeight: 20 },
  notice: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 8,
    padding: 10,
  },
  noticeText: { fontSize: 12, color: '#92400E', lineHeight: 18 },
  banner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    padding: 10,
  },
  bannerText: { fontSize: 12, color: '#1D4ED8', lineHeight: 18 },
  field: { gap: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#111827' },
  optional: { fontSize: 12, fontWeight: '400', color: '#9CA3AF' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  buildBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buildBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  outputArea: { gap: 8, marginTop: 4 },
  outputLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },
  outputBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  outputText: { fontSize: 13, color: '#374151', lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 8 },
  copyBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 8,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDone: { backgroundColor: '#16A34A' },
  btnFailed: { backgroundColor: '#DC2626' },
  actionText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  // 追加操作は既存コピー／保存の横へ詰め込まず、下段の全幅ボタンにする（44相当）。
  outputActionBtn: {
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outputActionText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
  saveHint: { fontSize: 12, color: '#6B7280', lineHeight: 17 },
  // 完了後の移動：内容操作と分けるため上に区切り線を入れ、全幅ボタンを縦配置する。
  completionSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  completionTitle: { fontSize: 13, fontWeight: '700', color: '#111827' },
  completionPrimaryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionPrimaryText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  completionSecondaryBtn: {
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionSecondaryText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
});
