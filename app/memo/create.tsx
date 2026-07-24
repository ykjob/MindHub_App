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
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { spacing } from '../../src/theme';
import { createMemo } from '../../src/features/memos/memoService';
import CategorySelector from '../../src/components/CategorySelector';
import FormFooterBar, {
  inputAccessoryProps,
} from '../../src/components/FormFooterBar';
import { showMessage } from '../../src/utils/dialog';
import type { CategoryKey } from '../../src/features/memos/memoCategories';

const FOOTER_ACCESSORY_ID = 'memo-create-footer';

// フッター上側(区切り線〜ボタン)と下側(ボタン〜キーボード)の余白を視覚的に揃えるための調整量。
// Phase 15デザインシステムの8dp spacing（spacing.sm）を使用する（Pixel固有の座標補正値ではない）。
const KEYBOARD_FOOTER_SPACING_ADJUSTMENT = spacing.sm;

export default function MemoCreateScreen() {
  const db = useSQLiteContext();
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<CategoryKey>('inbox');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);
  // 作成画面を開いた初回だけ自動フォーカスしてキーボードを開く（本文は空なのでカーソルは先頭のまま）。
  const initialCreateFocusRef = useRef(false);
  const mountedRef = useRef(true);
  // Safe Areaの上下inset合計 ＋ フッター余白調整(8dp=spacing.sm) を keyboardVerticalOffset とする（固定px補正なし）。
  // KAVの式は frame（親相対・原点はtop-inset分下）と screenHeight（画面絶対・下inset含む）を混在させるため、
  // top+bottom insetが座標系の不一致を打ち消し、+8dpで上下余白を12dp/12dpに揃える（Android実機計測で確定）。
  const insets = useSafeAreaInsets();
  const keyboardVerticalOffset =
    insets.top + insets.bottom + KEYBOARD_FOOTER_SPACING_ADJUSTMENT;

  // rAFのフォーカスがアンマウント後に走らないよう、マウント状態を保持する。
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Android：画面遷移アニメーション完了後（InteractionManager）に一度だけ自動フォーカスする。
  // 遷移中・TextInputのレイアウト確定前にfocusするとキーボードが確実に開かないため。
  // iOS/Web は FormFooterBar の onAccessoryReady 側で実行する（同一画面で二重にfocusしない）。
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (initialCreateFocusRef.current) return;
    const task = InteractionManager.runAfterInteractions(() => {
      if (!mountedRef.current || initialCreateFocusRef.current) return;
      initialCreateFocusRef.current = true;
      requestAnimationFrame(() => {
        if (mountedRef.current) inputRef.current?.focus();
      });
    });
    return () => task.cancel();
  }, []);

  async function handleSave() {
    const trimmed = body.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      const memo = await createMemo(db, { body: trimmed, category });
      router.replace(`/memo/${memo.id}`);
    } catch (error) {
      // 失敗時は保存中を解除し文字で通知（入力本文・カテゴリは維持して再保存可能にする）。
      // notes作成・編集と同じ通知形式（showMessage）に整合させる。
      setSaving(false);
      showMessage(
        '保存できませんでした',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return (
    // 入力フォーム全体（カテゴリ＋本文＋フッター）を1つの KeyboardAvoidingView で囲む。
    // Androidのみ有効。iOS（既存 InputAccessoryView）・Web では enabled=false で従来表示。
    <KeyboardAvoidingView
      style={styles.container}
      behavior="height"
      keyboardVerticalOffset={keyboardVerticalOffset}
      enabled={Platform.OS === 'android'}
    >
      <View style={styles.toolbar}>
        <CategorySelector selected={category} onChange={setCategory} />
      </View>

      <TextInput
        ref={inputRef}
        style={styles.input}
        multiline
        placeholder="メモを入力..."
        placeholderTextColor="#9CA3AF"
        value={body}
        onChangeText={setBody}
        textAlignVertical="top"
        {...inputAccessoryProps(FOOTER_ACCESSORY_ID)}
      />

      <FormFooterBar
        accessoryId={FOOTER_ACCESSORY_ID}
        // iOS：InputAccessoryView準備後、Web：即時にフォーカスする（autoFocusの代替）。
        // Androidは画面遷移後の InteractionManager で実行するため、ここでは行わない（二重focus防止）。
        onAccessoryReady={() => {
          if (Platform.OS === 'android') return;
          inputRef.current?.focus();
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
          accessibilityLabel="作成をキャンセル"
        >
          <Text style={styles.cancelText}>キャンセル</Text>
        </TouchableOpacity>
      </FormFooterBar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
