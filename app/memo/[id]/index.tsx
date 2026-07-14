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
import ListStateView from '../../../src/components/ListStateView';
import { showConfirmDialog } from '../../../src/components/ConfirmDialog';
import { useCopyFeedback } from '../../../src/hooks/useCopyFeedback';
import { formatDisplayDate } from '../../../src/utils/date';

export default function MemoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [memo, setMemo] = useState<Memo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [uploading, setUploading] = useState(false);
  const bodyCopy = useCopyFeedback();

  // 主読み込み。例外は握りつぶさず loadError に分岐し、取得成功でnullは「該当なし」として扱う。
  // フォーカス解除・アンマウント後に古い取得が状態を更新しないよう active フラグで保護する。
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setLoadError(false);
      (async () => {
        try {
          const result = id ? await getMemoById(db, id) : null;
          if (active) setMemo(result);
        } catch {
          if (active) setLoadError(true);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [id, db, reloadKey])
  );

  // アップロード後などの再取得。失敗しても未処理rejectionを出さず、現在表示は保持する（画面全体は落とさない）。
  async function reloadMemo() {
    if (!id) return;
    try {
      setMemo(await getMemoById(db, id));
    } catch {
      // 再取得失敗は非致命（GitHubステータス表示が更新されないだけ）。エラー画面へは倒さない。
    }
  }

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
      await reloadMemo();
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
    return <ListStateView status="loading" />;
  }

  // 読み込み失敗（例外）と該当なし（取得成功・null）を別表示にする。失敗はデータ消失と断定しない。
  if (loadError) {
    return (
      <ListStateView status="error" onRetry={() => setReloadKey((k) => k + 1)} />
    );
  }

  if (!memo) {
    return <ListStateView status="empty" emptyMessage="メモが見つかりません" />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 本文 */}
      <View style={styles.section}>
        <Text style={styles.bodyText}>{memo.body}</Text>
        {memo.body.trim() ? (
          <TouchableOpacity
            style={styles.copyBodyBtn}
            onPress={() => bodyCopy.run(memo.body)}
            disabled={bodyCopy.copying}
            accessibilityRole="button"
            accessibilityLabel="本文をコピー"
            accessibilityState={{ disabled: bodyCopy.copying }}
            accessibilityLiveRegion="polite"
          >
            <Text
              style={[
                styles.copyBodyBtnText,
                bodyCopy.failed && styles.copyBodyBtnTextFailed,
              ]}
            >
              {bodyCopy.done
                ? 'コピーしました ✓'
                : bodyCopy.failed
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
        <Text style={styles.sectionTitle} accessibilityRole="header">GitHub</Text>
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
          accessibilityRole="button"
          accessibilityLabel={uploading ? 'アップロード中' : getUploadButtonLabel()}
          accessibilityState={{ disabled: uploading, busy: uploading }}
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
          accessibilityRole="button"
          accessibilityLabel="このメモを編集"
        >
          <Text style={styles.editBtnText}>編集</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="このメモを削除"
        >
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
    minHeight: 44,
    justifyContent: 'center',
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
    minHeight: 44,
    justifyContent: 'center',
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
    minHeight: 44,
    justifyContent: 'center',
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
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBtnText: { fontSize: 14, fontWeight: '500', color: '#DC2626' },
  errorText: { fontSize: 15, color: '#6B7280' },
});
