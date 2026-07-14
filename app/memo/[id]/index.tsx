import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getMemoById } from '../../../src/features/memos/memoRepository';
import { deleteMemo } from '../../../src/features/memos/memoService';
import { uploadMemo } from '../../../src/features/github/githubUploadService';
import type { Memo } from '../../../src/features/memos/memoTypes';
import { getCategoryLabel } from '../../../src/features/memos/memoCategories';
import SyncStatusBadge from '../../../src/components/SyncStatusBadge';
import { showConfirmDialog } from '../../../src/components/ConfirmDialog';
import { copyToClipboard } from '../../../src/utils/clipboard';
import { formatDisplayDate } from '../../../src/utils/date';

export default function MemoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [memo, setMemo] = useState<Memo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [bodyCopied, setBodyCopied] = useState(false);
  const [bodyCopyFailed, setBodyCopyFailed] = useState(false);

  async function loadMemo() {
    if (!id) return;
    const result = await getMemoById(db, id);
    setMemo(result);
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadMemo();
    }, [id, db])
  );

  async function handleUpload() {
    if (!id) return;
    setUploading(true);
    try {
      await uploadMemo(db, id);
    } catch (error) {
      Alert.alert(
        'アップロードエラー',
        error instanceof Error ? error.message : 'アップロードに失敗しました'
      );
    } finally {
      setUploading(false);
      await loadMemo();
    }
  }

  function handleDelete() {
    if (!id) return;
    showConfirmDialog({
      title: 'メモを削除',
      message: 'このメモを削除しますか？この操作は元に戻せません。',
      onConfirm: async () => {
        await deleteMemo(db, id);
        router.replace('/');
      },
    });
  }

  async function handleCopyBody() {
    if (!memo || !memo.body.trim()) return;
    const ok = await copyToClipboard(memo.body);
    if (ok) {
      setBodyCopied(true);
      setBodyCopyFailed(false);
      setTimeout(() => setBodyCopied(false), 2000);
    } else {
      setBodyCopyFailed(true);
      setBodyCopied(false);
      setTimeout(() => setBodyCopyFailed(false), 2500);
    }
  }

  function getUploadButtonLabel(): string {
    if (!memo) return '';
    switch (memo.github_status) {
      case 'not_uploaded': return 'GitHubへアップロード';
      case 'uploaded': return 'GitHubで更新';
      case 'modified_after_upload': return 'GitHubで更新';
      case 'failed': return '再アップロード';
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!memo) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>メモが見つかりません</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 本文 */}
      <View style={styles.section}>
        <Text style={styles.bodyText}>{memo.body}</Text>
        {memo.body.trim() ? (
          <TouchableOpacity
            style={styles.copyBodyBtn}
            onPress={handleCopyBody}
            accessibilityRole="button"
            accessibilityLabel="本文をコピー"
          >
            <Text
              style={[
                styles.copyBodyBtnText,
                bodyCopyFailed && styles.copyBodyBtnTextFailed,
              ]}
            >
              {bodyCopied
                ? 'コピーしました ✓'
                : bodyCopyFailed
                  ? 'コピーできませんでした'
                  : '本文をコピー'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.copyBodyEmptyText}>本文がありません</Text>
        )}
      </View>

      {/* メタ情報 */}
      <View style={styles.metaSection}>
        <MetaRow label="カテゴリ" value={getCategoryLabel(memo.category)} />
        <MetaRow label="作成日時" value={formatDisplayDate(memo.created_at)} />
        <MetaRow label="更新日時" value={formatDisplayDate(memo.updated_at)} />
      </View>

      {/* GitHub状態 */}
      <View style={styles.githubSection}>
        <Text style={styles.sectionTitle}>GitHub</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>状態</Text>
          <SyncStatusBadge status={memo.github_status} />
        </View>
        {memo.github_path ? (
          <MetaRow label="パス" value={memo.github_path} mono />
        ) : null}
        {memo.github_status === 'failed' && memo.github_error_message ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>エラー内容</Text>
            <Text style={styles.errorMessage}>{memo.github_error_message}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.uploadBtnText}>{getUploadButtonLabel()}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* アクションボタン */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/memo/${id}/edit`)}
        >
          <Text style={styles.editBtnText}>編集</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>削除</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function MetaRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={metaStyles.row}>
      <Text style={metaStyles.label}>{label}</Text>
      <Text style={[metaStyles.value, mono && metaStyles.mono]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const metaStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    gap: 8,
  },
  label: { fontSize: 13, color: '#6B7280', width: 72 },
  value: { flex: 1, fontSize: 13, color: '#374151' },
  mono: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontSize: 12 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bodyText: { fontSize: 16, color: '#111827', lineHeight: 26 },
  copyBodyBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
  },
  copyBodyBtnText: { fontSize: 13, fontWeight: '600', color: '#2563EB' },
  copyBodyBtnTextFailed: { color: '#DC2626' },
  copyBodyEmptyText: { marginTop: 10, fontSize: 12, color: '#9CA3AF' },
  metaSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  githubSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusLabel: { fontSize: 13, color: '#6B7280', width: 72 },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  errorTitle: { fontSize: 12, fontWeight: '600', color: '#DC2626' },
  errorMessage: { fontSize: 12, color: '#991B1B' },
  uploadBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    marginTop: 4,
  },
  uploadBtnDisabled: { backgroundColor: '#93C5FD' },
  uploadBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  editBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editBtnText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBtnText: { fontSize: 14, fontWeight: '500', color: '#DC2626' },
  errorText: { fontSize: 15, color: '#6B7280' },
});
