import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import NoteForm from '../../../src/components/NoteForm';
import NativeHeaderBackButton from '../../../src/components/NativeHeaderBackButton';
import ListStateView from '../../../src/components/ListStateView';
import { getNoteById } from '../../../src/features/notes/noteRepository';
import { updateNote } from '../../../src/features/notes/noteService';
import type { Note, NoteInput } from '../../../src/features/notes/noteTypes';
import { showMessage } from '../../../src/utils/dialog';

export default function NoteEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);

  // 読み込み失敗（例外）・該当なし（取得成功・null）・取得成功を区別する。
  // アンマウント後に古い取得が状態を更新しないよう active フラグで保護する。
  // 編集対象が確定するまで空フォームを表示しない（loaded時のみNoteFormを描画）。
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    setNotFound(false);
    (async () => {
      try {
        const result = id ? await getNoteById(db, id) : null;
        if (!active) return;
        if (result) {
          setNote(result);
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

  async function handleSave(input: NoteInput) {
    if (!id) return;
    setSaving(true);
    try {
      await updateNote(db, id, input);
      router.back();
    } catch (error) {
      setSaving(false);
      showMessage(
        '保存できませんでした',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  // 編集画面の戻る先は対応する詳細画面（動的ID）。直アクセス時はここへ戻す（履歴があればback）。
  const editHeaderLeft = () => (
    <NativeHeaderBackButton fallback={id ? `/notes/${id}` : '/notes'} />
  );

  // loading／読み込み失敗＋再試行／該当なし の各状態でも「← 戻る」（headerLeft）を維持する。
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
    <>
      <Stack.Screen options={{ headerLeft: editHeaderLeft }} />
      <NoteForm
        initial={{
          title: note!.title,
          body: note!.body,
          project: note!.project,
          type: note!.type,
          tags: note!.tags,
          source: note!.source,
          visibility: note!.visibility,
          isGitCandidate: note!.is_git_candidate === 1,
        }}
        saving={saving}
        saveLabel="更新"
        onSave={handleSave}
        onCancel={() => router.back()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
});
