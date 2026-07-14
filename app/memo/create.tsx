import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { createMemo } from '../../src/features/memos/memoService';
import CategorySelector from '../../src/components/CategorySelector';
import FormFooterBar, {
  inputAccessoryProps,
} from '../../src/components/FormFooterBar';
import { showMessage } from '../../src/utils/dialog';
import type { CategoryKey } from '../../src/features/memos/memoCategories';

const FOOTER_ACCESSORY_ID = 'memo-create-footer';

export default function MemoCreateScreen() {
  const db = useSQLiteContext();
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<CategoryKey>('inbox');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

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
    <View style={styles.container}>
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
        // autoFocusの代替。キーボード直上バーの準備完了後にフォーカスする
        onAccessoryReady={() => inputRef.current?.focus()}
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
    </View>
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
