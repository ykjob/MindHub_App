import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import NoteForm from '../../../src/components/NoteForm';
import { getNoteById } from '../../../src/features/notes/noteRepository';
import { updateNote } from '../../../src/features/notes/noteService';
import type { Note, NoteInput } from '../../../src/features/notes/noteTypes';

export default function NoteEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getNoteById(db, id).then((result) => {
      setNote(result);
      setLoading(false);
    });
  }, [id, db]);

  async function handleSave(input: NoteInput) {
    if (!id) return;
    setSaving(true);
    try {
      await updateNote(db, id, input);
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

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>メモが見つかりません</Text>
      </View>
    );
  }

  return (
    <NoteForm
      initial={{
        title: note.title,
        body: note.body,
        project: note.project,
        type: note.type,
        tags: note.tags,
        source: note.source,
        visibility: note.visibility,
        isGitCandidate: note.is_git_candidate === 1,
      }}
      saving={saving}
      saveLabel="更新"
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 15, color: '#6B7280' },
});
