import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getMemoById } from '../../../src/features/memos/memoRepository';
import { updateMemo } from '../../../src/features/memos/memoService';
import CategorySelector from '../../../src/components/CategorySelector';
import FormFooterBar, {
  inputAccessoryProps,
} from '../../../src/components/FormFooterBar';
import NativeHeaderBackButton from '../../../src/components/NativeHeaderBackButton';
import type { CategoryKey } from '../../../src/features/memos/memoCategories';

const FOOTER_ACCESSORY_ID = 'memo-edit-footer';

export default function MemoEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<CategoryKey>('inbox');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentGithubStatus, setCurrentGithubStatus] = useState<
    'not_uploaded' | 'uploaded' | 'modified_after_upload' | 'failed'
  >('not_uploaded');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!id) return;
    getMemoById(db, id).then((memo) => {
      if (memo) {
        setBody(memo.body);
        setCategory(memo.category as CategoryKey);
        setCurrentGithubStatus(memo.github_status);
      }
      setLoading(false);
    });
  }, [id, db]);

  async function handleSave() {
    if (!id || !body.trim()) return;
    setSaving(true);
    try {
      await updateMemo(
        db,
        { id, body: body.trim(), category },
        currentGithubStatus
      );
      router.back();
    } catch {
      setSaving(false);
    }
  }

  // 編集画面の戻る先は対応する詳細画面（動的ID）。直アクセス時はここへ戻す（履歴があればback）。
  const editHeaderLeft = () => (
    <NativeHeaderBackButton fallback={id ? `/memo/${id}` : '/'} />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerLeft: editHeaderLeft }} />
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveText}>保存</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>キャンセル</Text>
        </TouchableOpacity>
      </FormFooterBar>
    </View>
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
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  cancelText: { fontSize: 14, color: '#374151' },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    minWidth: 80,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: '#93C5FD' },
  saveText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});
