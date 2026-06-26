import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getMemoById } from '../../../src/features/memos/memoRepository';
import { updateMemo } from '../../../src/features/memos/memoService';
import CategorySelector from '../../../src/components/CategorySelector';
import type { CategoryKey } from '../../../src/features/memos/memoCategories';

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.toolbar}>
        <CategorySelector selected={category} onChange={setCategory} />
      </View>

      <TextInput
        style={styles.input}
        multiline
        autoFocus
        value={body}
        onChangeText={setBody}
        textAlignVertical="top"
        placeholder="メモを入力..."
        placeholderTextColor="#9CA3AF"
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>キャンセル</Text>
        </TouchableOpacity>
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
      </View>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
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
