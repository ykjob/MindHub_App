import React, { useRef, useState } from 'react';
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
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { createMemo } from '../../src/features/memos/memoService';
import CategorySelector from '../../src/components/CategorySelector';
import type { CategoryKey } from '../../src/features/memos/memoCategories';

export default function MemoCreateScreen() {
  const db = useSQLiteContext();
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<CategoryKey>('inbox');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<TextInput>(null);

  async function handleSave() {
    const trimmed = body.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const memo = await createMemo(db, { body: trimmed, category });
      router.replace(`/memo/${memo.id}`);
    } catch {
      setSaving(false);
    }
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
        ref={inputRef}
        style={styles.input}
        multiline
        autoFocus
        placeholder="メモを入力..."
        placeholderTextColor="#9CA3AF"
        value={body}
        onChangeText={setBody}
        textAlignVertical="top"
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
