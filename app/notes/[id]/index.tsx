import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getNoteById } from '../../../src/features/notes/noteRepository';
import {
  archiveNote,
  unarchiveNote,
  markNoteExported,
} from '../../../src/features/notes/noteService';
import type { Note } from '../../../src/features/notes/noteTypes';
import { parseTags } from '../../../src/features/notes/noteTypes';
import {
  getNoteCategoryLabel,
  getNoteSourceLabel,
} from '../../../src/features/notes/noteCategories';
import {
  buildExportInfo,
  buildNoteMarkdown,
  downloadMarkdownFile,
} from '../../../src/features/notes/noteExport';
import { buildChatGptPrompt } from '../../../src/features/notes/chatgptPrompts';
import { copyToClipboard } from '../../../src/utils/clipboard';
import { confirmDialog, showMessage } from '../../../src/utils/dialog';
import { formatDisplayDate } from '../../../src/utils/date';
import MarkdownPreview from '../../../src/components/MarkdownPreview';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadNote = useCallback(async () => {
    if (!id) return;
    const result = await getNoteById(db, id);
    setNote(result);
    setLoading(false);
  }, [id, db]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadNote();
    }, [loadNote])
  );

  function handleArchive() {
    if (!id || !note) return;
    if (note.archived_at) {
      confirmDialog({
        title: 'アーカイブを解除',
        message: 'このメモをアーカイブから戻しますか？',
        confirmLabel: '解除',
        onConfirm: async () => {
          await unarchiveNote(db, id);
          await loadNote();
        },
      });
    } else {
      confirmDialog({
        title: 'メモをアーカイブ',
        message: 'このメモをアーカイブしますか？通常一覧から非表示になります（削除はされません）。',
        confirmLabel: 'アーカイブ',
        onConfirm: async () => {
          await archiveNote(db, id);
          await loadNote();
        },
      });
    }
  }

  async function handleExport() {
    if (!id || !note) return;
    const info = buildExportInfo(note);
    const ok = downloadMarkdownFile(info.filename, buildNoteMarkdown(note));
    if (!ok) {
      showMessage(
        '書き出しできませんでした',
        'Markdown書き出しは現在Web版のみ対応です。'
      );
      return;
    }
    await markNoteExported(db, id, {
      exportDir: info.dir,
      exportFilename: info.filename,
      exportPath: info.path,
    });
    await loadNote();
    showMessage(
      'Markdownをダウンロードしました',
      `推奨配置先：\n${info.path}\n\nダウンロードしたファイルを上記パスに配置してください。`
    );
  }

  async function handleCopyPrompt() {
    if (!note) return;
    const ok = await copyToClipboard(buildChatGptPrompt(note.type));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      showMessage('コピーできませんでした', 'この環境ではクリップボードを使用できません。');
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>メモが見つかりません</Text>
      </View>
    );
  }

  const tags = parseTags(note.tags);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{note.title || '（無題）'}</Text>
          {note.archived_at ? (
            <Text style={styles.archivedBadge}>アーカイブ済み</Text>
          ) : null}
        </View>
        <View style={styles.metaSection}>
          <MetaRow label="カテゴリ" value={getNoteCategoryLabel(note.type)} />
          <MetaRow label="プロジェクト" value={note.project || '（未設定）'} />
          <MetaRow label="タグ" value={tags.length > 0 ? tags.map((t) => `#${t}`).join(' ') : '（なし）'} />
          <MetaRow label="source" value={getNoteSourceLabel(note.source)} />
          <MetaRow label="visibility" value={note.visibility} />
          <MetaRow label="Git候補" value={note.is_git_candidate === 1 ? '✓ Git候補' : '対象外'} />
          <MetaRow label="作成日時" value={formatDisplayDate(note.created_at)} />
          <MetaRow label="更新日時" value={formatDisplayDate(note.updated_at)} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>本文プレビュー</Text>
        <MarkdownPreview markdown={note.body || '（本文なし）'} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Markdown書き出し</Text>
        {note.exported_at ? (
          <>
            <MetaRow label="書き出し先" value={note.export_path ?? ''} mono />
            <MetaRow label="書き出し日時" value={formatDisplayDate(note.exported_at)} />
          </>
        ) : (
          <Text style={styles.hint}>まだ書き出されていません</Text>
        )}
        <MetaRow label="推奨パス" value={buildExportInfo(note).path} mono />
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
          <Text style={styles.exportBtnText}>Markdown書き出し（ダウンロード）</Text>
        </TouchableOpacity>
        {note.is_git_candidate !== 1 ? (
          <Text style={styles.hint}>
            このメモはGit候補ではありません。書き出す場合はGitに含めないよう注意してください。
          </Text>
        ) : null}
      </View>

      <TouchableOpacity style={styles.promptBtn} onPress={handleCopyPrompt}>
        <Text style={styles.promptBtnText}>
          {copied ? 'コピーしました ✓' : 'ChatGPT整理プロンプトをコピー'}
        </Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/notes/${id}/edit`)}
        >
          <Text style={styles.editBtnText}>編集</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.archiveBtn} onPress={handleArchive}>
          <Text style={styles.archiveBtnText}>
            {note.archived_at ? 'アーカイブ解除' : 'アーカイブ'}
          </Text>
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
      <Text style={[metaStyles.value, mono && metaStyles.mono]}>{value}</Text>
    </View>
  );
}

const metaStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
    gap: 8,
  },
  label: { fontSize: 13, color: '#6B7280', width: 90 },
  value: { flex: 1, fontSize: 13, color: '#374151' },
  mono: { fontFamily: 'monospace', fontSize: 12 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: '#111827' },
  archivedBadge: {
    fontSize: 12,
    color: '#B45309',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  metaSection: { gap: 0 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  hint: { fontSize: 12, color: '#9CA3AF' },
  exportBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    marginTop: 4,
  },
  exportBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  promptBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
  },
  promptBtnText: { fontSize: 13, fontWeight: '600', color: '#2563EB' },
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
  archiveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  archiveBtnText: { fontSize: 14, fontWeight: '500', color: '#B45309' },
  errorText: { fontSize: 15, color: '#6B7280' },
});
