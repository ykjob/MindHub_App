import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import NoteForm from '../../src/components/NoteForm';
import { createNote } from '../../src/features/notes/noteService';
import type { NoteInput } from '../../src/features/notes/noteTypes';
import { showMessage } from '../../src/utils/dialog';
import {
  getNoteDraftHandoff,
  clearNoteDraftHandoff,
} from '../../src/features/share/shareHandoff';

export default function NoteCreateScreen() {
  const db = useSQLiteContext();
  const [saving, setSaving] = useState(false);

  // 共有確認画面からの「新しい記録として保存」で本文だけを引き継ぐ（Phase 16C-2）。
  // useState初期化関数では純粋に get し、初回commit後の useEffect で1回だけ clear する。
  // 引き継ぎがなければ従来どおり空フォーム。タイトル・カテゴリ・公開範囲はユーザーが決める。
  const [draft] = useState(() => getNoteDraftHandoff());
  useEffect(() => {
    clearNoteDraftHandoff();
  }, []);

  async function handleSave(input: NoteInput) {
    setSaving(true);
    try {
      const note = await createNote(db, input);
      router.replace(`/notes/${note.id}`);
    } catch (error) {
      setSaving(false);
      showMessage(
        '保存できませんでした',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return (
    <NoteForm
      initial={draft ? { body: draft.body } : undefined}
      saving={saving}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}
