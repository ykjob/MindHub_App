import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getNotes, getDistinctProjects, getDistinctTags } from '../../src/features/notes/noteRepository';
import type { Note, NoteFilter, NoteType, NoteSortKey } from '../../src/features/notes/noteTypes';
import { parseTags } from '../../src/features/notes/noteTypes';
import { NOTE_CATEGORIES, getNoteCategoryLabel } from '../../src/features/notes/noteCategories';
import { formatDisplayDate } from '../../src/utils/date';

export default function NoteListScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [project, setProject] = useState<string | undefined>(undefined);
  const [type, setType] = useState<NoteType | undefined>(undefined);
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [gitOnly, setGitOnly] = useState(false);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [sortBy, setSortBy] = useState<NoteSortKey>('updated');
  const [projects, setProjects] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  const filter: NoteFilter = {
    keyword,
    project,
    type,
    tag,
    gitCandidateOnly: gitOnly,
    includeArchived,
    sortBy,
  };

  const load = useCallback(() => {
    let active = true;
    getNotes(db, filter)
      .then((result) => {
        if (active) {
          setNotes(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    Promise.all([getDistinctProjects(db), getDistinctTags(db)])
      .then(([p, t]) => {
        if (active) {
          setProjects(p);
          setAllTags(t);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [db, keyword, project, type, tag, gitOnly, includeArchived, sortBy]);

  useFocusEffect(useCallback(() => load(), [load]));

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: 16 + insets.top }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={goBack} hitSlop={8}>
            <Text style={styles.backBtnText}>← 戻る</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>メモ管理</Text>
        </View>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push('/notes/create')}
        >
          <Text style={styles.createBtnText}>＋ 新規作成</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="キーワード検索（タイトル・本文・プロジェクト・タグ）"
          placeholderTextColor="#9CA3AF"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          <FilterChip label="全カテゴリ" selected={type === undefined} onPress={() => setType(undefined)} />
          {NOTE_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.type}
              label={cat.label}
              selected={type === cat.type}
              onPress={() => setType(type === cat.type ? undefined : cat.type)}
            />
          ))}
        </ScrollView>

        {projects.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            <FilterChip label="全プロジェクト" selected={project === undefined} onPress={() => setProject(undefined)} />
            {projects.map((p) => (
              <FilterChip
                key={p}
                label={p}
                selected={project === p}
                onPress={() => setProject(project === p ? undefined : p)}
              />
            ))}
          </ScrollView>
        ) : null}

        {allTags.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            <FilterChip label="全タグ" selected={tag === undefined} onPress={() => setTag(undefined)} />
            {allTags.map((t) => (
              <FilterChip
                key={t}
                label={`#${t}`}
                selected={tag === t}
                onPress={() => setTag(tag === t ? undefined : t)}
              />
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.toggleRow}>
          <FilterChip label="Git候補のみ" selected={gitOnly} onPress={() => setGitOnly(!gitOnly)} />
          <FilterChip
            label="アーカイブ済みも表示"
            selected={includeArchived}
            onPress={() => setIncludeArchived(!includeArchived)}
          />
          <FilterChip
            label={sortBy === 'updated' ? '更新日順' : '作成日順'}
            selected
            onPress={() => setSortBy(sortBy === 'updated' ? 'created' : 'updated')}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.center} size="large" color="#2563EB" />
      ) : notes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>メモがありません</Text>
          <Text style={styles.emptySubText}>右上の「＋ 新規作成」から作成してください</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, item.archived_at && styles.cardArchived]}
              onPress={() => router.push(`/notes/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title || '（無題）'}
                </Text>
                {item.is_git_candidate === 1 ? (
                  <Text style={styles.gitBadge}>Git候補</Text>
                ) : null}
                {item.archived_at ? (
                  <Text style={styles.archivedBadge}>アーカイブ</Text>
                ) : null}
              </View>
              <Text style={styles.cardBody} numberOfLines={2}>
                {item.body || '（本文なし）'}
              </Text>
              <View style={styles.cardMeta}>
                <Text style={styles.metaText}>{getNoteCategoryLabel(item.type)}</Text>
                {item.project ? <Text style={styles.metaText}>{item.project}</Text> : null}
                {parseTags(item.tags).map((t) => (
                  <Text key={t} style={styles.tagText}>#{t}</Text>
                ))}
              </View>
              <Text style={styles.dateText}>{formatDisplayDate(item.updated_at)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  backBtn: { paddingVertical: 4, paddingRight: 4 },
  backBtnText: { fontSize: 14, color: '#2563EB', fontWeight: '600' },
  createBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  createBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  filters: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  chipRow: { flexDirection: 'row', gap: 6 },
  toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelected: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipText: { fontSize: 12, color: '#374151' },
  chipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  list: { padding: 12, gap: 8 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 6,
  },
  cardArchived: { opacity: 0.6 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111827' },
  gitBadge: {
    fontSize: 11,
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  archivedBadge: {
    fontSize: 11,
    color: '#B45309',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardBody: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 12, color: '#6B7280' },
  tagText: { fontSize: 12, color: '#2563EB' },
  dateText: { fontSize: 12, color: '#9CA3AF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
  emptySubText: { fontSize: 13, color: '#9CA3AF' },
});
