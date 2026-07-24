import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  InteractionManager,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { spacing } from '../../../src/theme';
import { useSQLiteContext } from 'expo-sqlite';
import { getMemoById } from '../../../src/features/memos/memoRepository';
import { updateMemo } from '../../../src/features/memos/memoService';
import CategorySelector from '../../../src/components/CategorySelector';
import FormFooterBar, {
  inputAccessoryProps,
} from '../../../src/components/FormFooterBar';
import NativeHeaderBackButton from '../../../src/components/NativeHeaderBackButton';
import ListStateView from '../../../src/components/ListStateView';
import { showMessage } from '../../../src/utils/dialog';
import type { CategoryKey } from '../../../src/features/memos/memoCategories';

const FOOTER_ACCESSORY_ID = 'memo-edit-footer';

// フッター上側(区切り線〜ボタン)と下側(ボタン〜キーボード)の余白を視覚的に揃えるための調整量。
// Phase 15デザインシステムの8dp spacing（spacing.sm）を使用する（作成画面と同一・端末固有値ではない）。
const KEYBOARD_FOOTER_SPACING_ADJUSTMENT = spacing.sm;

export default function MemoEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<CategoryKey>('inbox');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [currentGithubStatus, setCurrentGithubStatus] = useState<
    'not_uploaded' | 'uploaded' | 'modified_after_upload' | 'failed'
  >('not_uploaded');
  const inputRef = useRef<TextInput>(null);
  // 編集画面を開いた初回だけ、(1)カーソルを既存本文の末尾へ配置し (2)自動フォーカスしてキーボードを開く。
  // 1つのフラグで初期化（末尾配置＋自動フォーカス）を1回に統一する。
  // selectionは初回に一度だけ制御し、反映後はundefinedへ戻して以降はユーザー操作に委ねる（常時制御しない）。
  const initialEditReadyRef = useRef(false);
  const mountedRef = useRef(true);
  const [initialSelection, setInitialSelection] = useState<
    { start: number; end: number } | undefined
  >(undefined);
  // Safe Areaの上下inset合計を keyboardVerticalOffset として補正する（作成画面と同一。固定px補正はしない）。
  const insets = useSafeAreaInsets();
  const keyboardVerticalOffset =
    insets.top + insets.bottom + KEYBOARD_FOOTER_SPACING_ADJUSTMENT;

  // 読み込み失敗（例外）・該当なし（取得成功・null）・取得成功を区別する。
  // アンマウント後に古い取得が状態を更新しないよう active フラグで保護する。
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    setNotFound(false);
    (async () => {
      try {
        const memo = id ? await getMemoById(db, id) : null;
        if (!active) return;
        if (memo) {
          setBody(memo.body);
          setCategory(memo.category as CategoryKey);
          setCurrentGithubStatus(memo.github_status);
        } else {
          setNotFound(true);
        }
      } catch {
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, db, reloadKey]);

  // rAFのフォーカスがアンマウント後に走らないよう、マウント状態を保持する。
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 初回だけ：カーソルを既存本文の末尾へ置き、本文欄へフォーカスして自動でキーボードを開く。
  // selection反映の次フレームでfocusし、カーソルが中途半端になるのを防ぐ。二重実行はrefで防止。
  const runInitialEditFocusOnce = () => {
    if (initialEditReadyRef.current) return;
    initialEditReadyRef.current = true;
    const endPosition = body.length;
    setInitialSelection({ start: endPosition, end: endPosition });
    requestAnimationFrame(() => {
      if (mountedRef.current) inputRef.current?.focus();
    });
  };

  // Android：画面遷移アニメーション完了後（InteractionManager）に一度だけ自動フォーカスする。
  // 遷移中・TextInputのレイアウト確定前にfocusするとキーボードが確実に開かないため。
  // iOS/Web は FormFooterBar の onAccessoryReady 側で実行する（同一画面で二重にfocusしない）。
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (loading || loadError || notFound) return;
    if (initialEditReadyRef.current) return;
    const task = InteractionManager.runAfterInteractions(() => {
      runInitialEditFocusOnce();
    });
    return () => task.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadError, notFound, body]);

  async function handleSave() {
    if (!id || !body.trim() || saving) return;
    setSaving(true);
    try {
      await updateMemo(
        db,
        { id, body: body.trim(), category },
        currentGithubStatus
      );
      router.back();
    } catch (error) {
      // 失敗時は保存中を解除し文字で通知（本文・カテゴリは維持して再保存可能にする）。
      setSaving(false);
      showMessage(
        '保存できませんでした',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  // 編集画面の戻る先は対応する詳細画面（動的ID）。直アクセス時はここへ戻す（履歴があればback）。
  const editHeaderLeft = () => (
    <NativeHeaderBackButton fallback={id ? `/memo/${id}` : '/'} />
  );

  // loading／読み込み失敗＋再試行／該当なし の各状態でも「← 戻る」（Stack.Screen headerLeft）を維持する。
  if (loading || loadError || notFound) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerLeft: editHeaderLeft }} />
        {loading ? (
          <ListStateView status="loading" />
        ) : loadError ? (
          <ListStateView status="error" onRetry={() => setReloadKey((k) => k + 1)} />
        ) : (
          <ListStateView status="empty" emptyMessage="メモが見つかりません" />
        )}
      </View>
    );
  }

  return (
    // 入力フォーム全体（カテゴリ＋本文＋フッター）を1つの KeyboardAvoidingView で囲む。
    // Androidのみ有効。iOS（既存 InputAccessoryView）・Web では enabled=false で従来表示。作成画面と同一。
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      keyboardVerticalOffset={keyboardVerticalOffset}
      enabled={Platform.OS === 'android'}
    >
      <Stack.Screen options={{ headerLeft: editHeaderLeft }} />
      <View style={styles.toolbar}>
        <CategorySelector selected={category} onChange={setCategory} />
      </View>

      <TextInput
        ref={inputRef}
        style={styles.input}
        multiline
        value={body}
        onChangeText={setBody}
        textAlignVertical="top"
        placeholder="メモを入力..."
        placeholderTextColor="#9CA3AF"
        selection={initialSelection}
        onSelectionChange={() => {
          // 初回の末尾配置が反映されたら selection 制御を解除し、以降の位置はユーザーに委ねる
          if (initialSelection) setInitialSelection(undefined);
        }}
        {...inputAccessoryProps(FOOTER_ACCESSORY_ID)}
      />

      <FormFooterBar
        accessoryId={FOOTER_ACCESSORY_ID}
        // iOS：InputAccessoryView準備後（バーが出る前にfocusしてキーボードだけ出るのを防ぐ）、
        // Web：即時に、一度だけ自動フォーカス＋カーソル末尾配置する。
        // Androidは画面遷移後の InteractionManager で実行するため、ここでは行わない（二重focus防止）。
        onAccessoryReady={() => {
          if (Platform.OS === 'android') return;
          runInitialEditFocusOnce();
        }}
      >
        <TouchableOpacity
          style={[styles.saveBtn, !body.trim() && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!body.trim() || saving}
          accessibilityRole="button"
          accessibilityLabel="メモを保存"
          accessibilityState={{ disabled: !body.trim() || saving, busy: saving }}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveText}>保存</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="編集をキャンセル"
        >
          <Text style={styles.cancelText}>キャンセル</Text>
        </TouchableOpacity>
      </FormFooterBar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  toolbar: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    lineHeight: 26,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cancelText: { fontSize: 14, color: '#374151' },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#2563EB',
    minWidth: 80,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#93C5FD' },
  saveText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});
