import React, { useState } from 'react';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import NoteForm from '../../src/components/NoteForm';
import { createNote } from '../../src/features/notes/noteService';
import type { NoteInput } from '../../src/features/notes/noteTypes';

export default function NoteCreateScreen() {
  const db = useSQLiteContext();
  const [saving, setSaving] = useState(false);

  async function handleSave(input: NoteInput) {
    setSaving(true);
    try {
      const note = await createNote(db, input);
      router.replace(`/notes/${note.id}`);
    } catch {
      setSaving(false);
    }
  }

  return (
    <NoteForm saving={saving} onSave={handleSave} onCancel={() => router.back()} />
  );
}
