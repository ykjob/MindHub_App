import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
import { confirmDialog, showMessage } from '../../../src/utils/dialog';
import { formatDisplayDate } from '../../../src/utils/date';
import { useCopyFeedback } from '../../../src/hooks/useCopyFeedback';
import MarkdownPreview from '../../../src/components/MarkdownPreview';
import ListStateView from '../../../src/components/ListStateView';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // 本文コピーはインライン成功／失敗表示、プロンプトコピーは失敗時のみダイアログ（従来挙動を維持）。
  const bodyCopy = useCopyFeedback();
  const promptCopy = useCopyFeedback({
    showInlineFailed: false,
    onFailed: () =>
      showMessage('コピーできませんでした', 'この環境ではクリップボードを使用できません。'),
  });

  // 主読み込み。例外は握りつぶさず loadError に分岐し、取得成功でnullは「該当なし」として扱う。
  // フォーカス解除・アンマウント後に古い取得が状態を更新しないよう active フラグで保護する。
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setLoadError(false);
      (async () => {
        try {
          const result = id ? await getNoteById(db, id) : null;
          if (active) setNote(result);
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

  // アーカイブ・書き出し後などの再取得。失敗しても未処理rejectionを出さず現在表示は保持する
  // （画面全体はエラーへ倒さない）。
  async function reloadNote() {
    if (!id) return;
    try {
      setNote(await getNoteById(db, id));
    } catch {
      // 再取得失敗は非致命（バッジ・書き出し日時が更新されないだけ）。
    }
  }

  function handleArchive() {
    if (!id || !note) return;
    if (note.archived_at) {
      confirmDialog({
        title: 'アーカイブを解除',
        message: 'このメモをアーカイブから戻しますか？',
        confirmLabel: '解除',
        onConfirm: async () => {
          await unarchiveNote(db, id);
          await reloadNote();
        },
      });
    } else {
      confirmDialog({
        title: 'メモをアーカイブ',
        message: 'このメモをアーカイブしますか？通常一覧から非表示になります（削除はされません）。',
        confirmLabel: 'アーカイブ',
        onConfirm: async () => {
          await archiveNote(db, id);
          await reloadNote();
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
    await reloadNote();
    showMessage(
      'Markdownをダウンロードしました',
      `推奨配置先：\n${info.path}\n\nダウンロードしたファイルを上記パスに配置してください。`
    );
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

  if (!note) {
    return <ListStateView status="empty" emptyMessage="メモが見つかりません" />;
  }

  const tags = parseTags(note.tags);
  const hasBody = note.body.trim().length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <View style={styles.titleRow}>
          <Text style={styles.title} accessibilityRole="header">
            {note.title || '（無題）'}
          </Text>
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
        <Text style={styles.sectionTitle} accessibilityRole="header">本文プレビュー</Text>
        <MarkdownPreview markdown={note.body || '（本文なし）'} />
        {hasBody ? (
          <TouchableOpacity
            style={styles.copyBodyBtn}
            onPress={() => bodyCopy.run(note.body)}
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
                ? '本文をコピーしました ✓'
                : bodyCopy.failed
                  ? '本文をコピーできませんでした'
                  : '本文をコピー'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.hint}>本文がありません</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">Markdown書き出し</Text>
        {note.exported_at ? (
          <>
            <MetaRow label="書き出し先" value={note.export_path ?? ''} mono />
            <MetaRow label="書き出し日時" value={formatDisplayDate(note.exported_at)} />
          </>
        ) : (
          <Text style={styles.hint}>まだ書き出されていません</Text>
        )}
        <MetaRow label="推奨パス" value={buildExportInfo(note).path} mono />
        <TouchableOpacity
          style={styles.exportBtn}
          onPress={handleExport}
          accessibilityRole="button"
          accessibilityLabel="Markdownを書き出してダウンロード"
        >
          <Text style={styles.exportBtnText}>Markdown書き出し（ダウンロード）</Text>
        </TouchableOpacity>
        {note.is_git_candidate !== 1 ? (
          <Text style={styles.hint}>
            このメモはGit候補ではありません。書き出す場合はGitに含めないよう注意してください。
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.promptBtn}
        onPress={() => promptCopy.run(buildChatGptPrompt(note.type))}
        disabled={promptCopy.copying}
        accessibilityRole="button"
        accessibilityLabel="ChatGPT整理プロンプトをコピー"
        accessibilityState={{ disabled: promptCopy.copying }}
        accessibilityLiveRegion="polite"
      >
        <Text style={styles.promptBtnText}>
          {promptCopy.done ? 'コピーしました ✓' : 'ChatGPT整理プロンプトをコピー'}
        </Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/notes/${id}/edit`)}
          accessibilityRole="button"
          accessibilityLabel="このメモを編集"
        >
          <Text style={styles.editBtnText}>編集</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.archiveBtn}
          onPress={handleArchive}
          accessibilityRole="button"
          accessibilityLabel={note.archived_at ? 'アーカイブを解除' : 'このメモをアーカイブ'}
        >
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
  copyBodyBtn: {
    marginTop: 4,
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
  exportBtn: {
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    marginTop: 4,
  },
  exportBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  promptBtn: {
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
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
    minHeight: 44,
    justifyContent: 'center',
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
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  archiveBtnText: { fontSize: 14, fontWeight: '500', color: '#B45309' },
  errorText: { fontSize: 15, color: '#6B7280' },
});
