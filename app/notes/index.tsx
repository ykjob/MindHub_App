import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getNotes, getDistinctProjects, getDistinctTags } from '../../src/features/notes/noteRepository';
import type { Note, NoteFilter, NoteType, NoteSortKey } from '../../src/features/notes/noteTypes';
import { parseTags } from '../../src/features/notes/noteTypes';
import { NOTE_CATEGORIES, getNoteCategoryLabel } from '../../src/features/notes/noteCategories';
import AppHeader from '../../src/components/AppHeader';
import FilterChip from '../../src/components/FilterChip';
import ListStateView from '../../src/components/ListStateView';
import { colors, spacing, typography, radius, touchTarget } from '../../src/theme';
import { formatDisplayDate } from '../../src/utils/date';

export default function NoteListScreen() {
  const db = useSQLiteContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [project, setProject] = useState<string | undefined>(undefined);
  const [type, setType] = useState<NoteType | undefined>(undefined);
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [gitOnly, setGitOnly] = useState(false);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [sortBy, setSortBy] = useState<NoteSortKey>('updated');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
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
    setLoading(true);
    setLoadError(false);
    getNotes(db, filter)
      .then((result) => {
        if (active) {
          setNotes(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setLoadError(true);
          setLoading(false);
        }
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
  }, [db, keyword, project, type, tag, gitOnly, includeArchived, sortBy, reloadKey]);

  useFocusEffect(useCallback(() => load(), [load]));

  // 絞り込みとして結果を狭める条件（filtered-empty判定用）。
  // includeArchivedは対象を広げる条件、sortByは表示順だけを変える条件のため含めない。
  const isFiltered =
    keyword.trim() !== '' ||
    project !== undefined ||
    type !== undefined ||
    tag !== undefined ||
    gitOnly;

  // 折りたたみ内で設定されている絞り込み条件数（常時表示の検索・カテゴリは含めない。
  // 並び順はフィルターではなく並び順操作のため数えない＝要約には表示する）
  const detailCount =
    (project !== undefined ? 1 : 0) +
    (tag !== undefined ? 1 : 0) +
    (gitOnly ? 1 : 0) +
    (includeArchived ? 1 : 0);

  const summaryParts: string[] = [];
  if (keyword.trim() !== '') summaryParts.push(`キーワード「${keyword.trim()}」`);
  if (type !== undefined) summaryParts.push(`カテゴリ「${getNoteCategoryLabel(type)}」`);
  if (project !== undefined) summaryParts.push(project);
  if (tag !== undefined) summaryParts.push(`#${tag}`);
  if (gitOnly) summaryParts.push('Git候補');
  if (includeArchived) summaryParts.push('アーカイブ含む');
  if (sortBy === 'created') summaryParts.push('作成日順');
  const hasConditions = summaryParts.length > 0;

  const resetFilters = () => {
    setKeyword('');
    setProject(undefined);
    setType(undefined);
    setTag(undefined);
    setGitOnly(false);
    setIncludeArchived(false);
    setSortBy('updated');
  };

  const sortLabel = sortBy === 'updated' ? '更新日順' : '作成日順';
  const sortNextLabel = sortBy === 'updated' ? '作成日順' : '更新日順';

  return (
    <View style={styles.container}>
      {/* 戻るフォールバック（履歴なし→ホーム）はAppHeader内で処理される */}
      <AppHeader
        title="メモ管理"
        showBack
        right={
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/notes/create')}
            accessibilityRole="button"
            accessibilityLabel="新規作成"
            hitSlop={8}
          >
            <Text style={styles.createBtnText}>＋ 新規作成</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.filters}>
        <View style={styles.filtersInner}>
          <TextInput
            style={styles.searchInput}
            value={keyword}
            onChangeText={setKeyword}
            placeholder="キーワード検索（タイトル・本文・プロジェクト・タグ）"
            placeholderTextColor={colors.textFaint}
            accessibilityLabel="キーワード検索"
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

          <TouchableOpacity
            style={styles.expandBtn}
            onPress={() => setFiltersExpanded(!filtersExpanded)}
            accessibilityRole="button"
            accessibilityState={{ expanded: filtersExpanded }}
            accessibilityHint="プロジェクト・タグ・Git候補・アーカイブ・並び順の絞り込みを開閉します"
          >
            <Text style={styles.expandBtnText}>
              {filtersExpanded
                ? '絞り込みを閉じる'
                : detailCount > 0
                  ? `詳細な絞り込み（${detailCount}）`
                  : '詳細な絞り込み'}
            </Text>
          </TouchableOpacity>

          {filtersExpanded ? (
            <View style={styles.detailFilters}>
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
              </View>

              {/* 並び順はフィルターではないため、FilterChip（pill・選択塗り）と区別した切替ボタンにする（29 §6.2） */}
              <TouchableOpacity
                style={styles.sortBtn}
                onPress={() => setSortBy(sortBy === 'updated' ? 'created' : 'updated')}
                accessibilityRole="button"
                accessibilityLabel={`並び順：${sortLabel}`}
                accessibilityHint={`押すと${sortNextLabel}に切り替わります`}
              >
                <Text style={styles.sortBtnText}>並び順：{sortLabel}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {hasConditions ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>適用中：{summaryParts.join('・')}</Text>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={resetFilters}
                accessibilityRole="button"
                accessibilityLabel="表示条件をリセット"
                hitSlop={8}
              >
                <Text style={styles.resetBtnText}>表示条件をリセット</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.listHeaderRow}>
        <Text style={styles.listHeaderTitle} accessibilityRole="header">
          メモ一覧
        </Text>
        {!loading && !loadError ? <Text style={styles.listCountText}>{notes.length}件</Text> : null}
      </View>

      {loading ? (
        <ListStateView status="loading" />
      ) : loadError ? (
        <ListStateView status="error" onRetry={() => setReloadKey((k) => k + 1)} />
      ) : notes.length === 0 ? (
        isFiltered ? (
          <ListStateView status="filtered-empty" />
        ) : (
          <ListStateView
            status="empty"
            emptyMessage="メモがありません"
            emptyHint="右上の「＋ 新規作成」から作成してください"
          />
        )
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
              accessibilityRole="button"
              accessibilityLabel={`メモ「${item.title || '無題'}」`}
              accessibilityHint="詳細を開きます"
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  createBtn: {
    paddingHorizontal: 14,
    paddingVertical: spacing.sm,
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
  },
  createBtnText: { fontSize: typography.body, fontWeight: '600', color: colors.surface },
  filters: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersInner: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    minHeight: touchTarget.min,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  chipRow: { flexDirection: 'row', gap: 6 },
  expandBtn: {
    minHeight: touchTarget.min,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingRight: spacing.sm,
  },
  expandBtnText: {
    fontSize: typography.body,
    color: colors.brand,
    fontWeight: '600',
  },
  detailFilters: { gap: spacing.sm },
  toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  sortBtn: {
    minHeight: touchTarget.min,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  sortBtnText: {
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  summaryRow: { gap: spacing.xs },
  summaryText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  resetBtn: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  resetBtnText: {
    fontSize: typography.caption + 1,
    color: colors.brand,
    fontWeight: '600',
  },
  listHeaderRow: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  listHeaderTitle: {
    fontSize: typography.sectionTitle,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  listCountText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  list: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: spacing.md,
    paddingTop: spacing.xs,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 6,
  },
  cardArchived: { opacity: 0.6 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardTitle: { flex: 1, fontSize: typography.sectionTitle, fontWeight: '600', color: colors.textPrimary },
  gitBadge: {
    fontSize: typography.badge,
    color: colors.success,
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  archivedBadge: {
    fontSize: typography.badge,
    color: colors.warningBadgeText,
    backgroundColor: colors.warningBadgeSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardBody: { fontSize: typography.body, color: '#4B5563', lineHeight: 20 },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  metaText: { fontSize: typography.caption, color: colors.textSecondary },
  tagText: { fontSize: typography.caption, color: colors.brand },
  dateText: { fontSize: typography.caption, color: colors.textFaint },
});
