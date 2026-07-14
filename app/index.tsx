import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllMemos } from '../src/features/memos/memoRepository';
import type { Memo } from '../src/features/memos/memoTypes';
import { getCategoryLabel } from '../src/features/memos/memoCategories';
import SyncStatusBadge from '../src/components/SyncStatusBadge';
import AppHeader from '../src/components/AppHeader';
import ListStateView from '../src/components/ListStateView';
import { colors, spacing, typography, radius, touchTarget } from '../src/theme';
import { formatDisplayDate } from '../src/utils/date';

/** 最近の軽量メモの初期表示件数（28 §7.2） */
const RECENT_MEMO_LIMIT = 3;

// ホームの主要機能カード4件（表示順含め 28 §7.2 で確定）。
// ホーム専用のためローカル定義（共通化は2画面以上で必要になってから＝29 §6.5）。
// カードラベル「現場適応」はホーム上の入口ラベルのみ。遷移先の正式名称「現場適応モード」は変更しない（28 §11）。
// カードラベル「記録確認」に対し遷移先 /notes の正式タイトルも「記録確認」に統一。「さくっとメモ」「プロンプト集」の
// 遷移先タイトルは「メモ作成」「プロンプト集」のままで、カード名と遷移先タイトルの完全一致は要件としない（28 §11）。
const FEATURE_CARDS = [
  {
    key: 'memo',
    title: 'さくっとメモ',
    description: '思いついた内容を素早く残す',
    path: '/memo/create',
  },
  {
    key: 'workplace',
    title: '現場適応',
    description: '仕事中の5つの場面を整理する',
    path: '/workplace',
  },
  {
    key: 'notes',
    title: '記録確認',
    description: '保存した記録を確認・分類する',
    path: '/notes',
  },
  {
    key: 'prompts',
    title: 'プロンプト集',
    description: '目的別のプロンプトを選んでコピーする',
    path: '/prompts',
  },
] as const;

// 主要機能カードの2×2グリッド。4枚は同じ外観とし、優先順位は表示順（上段＝最重要）だけで表す（28 §6.2）
function FeatureCardGrid() {
  return (
    <View style={styles.cardGrid}>
      {FEATURE_CARDS.map((card) => (
        <TouchableOpacity
          key={card.key}
          style={styles.featureCard}
          onPress={() => router.push(card.path)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={card.title}
          accessibilityHint={card.description}
        >
          <Text style={styles.featureCardTitle}>{card.title}</Text>
          <Text style={styles.featureCardDescription}>{card.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showAllMemos, setShowAllMemos] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setLoadError(false);
      getAllMemos(db)
        .then((result) => { if (active) { setMemos(result); setLoading(false); } })
        .catch(() => { if (active) { setLoadError(true); setLoading(false); } });
      return () => { active = false; };
    }, [db, reloadKey])
  );

  const showList = !loading && !loadError;
  const visibleMemos = showList
    ? (showAllMemos ? memos : memos.slice(0, RECENT_MEMO_LIMIT))
    : [];
  const canToggle = showList && memos.length > RECENT_MEMO_LIMIT;

  return (
    <View style={styles.container}>
      {/* ネイティブヘッダー（旧FlowDock）は headerShown: false。ホームは戻るボタンを表示しない（30 §7）。
          設定は主要カードに含めず、AppHeaderのright（共有部品は無変更）へ補助導線として置く（28 §7.2） */}
      <AppHeader
        title="MindHub"
        subtitle="思考メモ・仕事の整理・AI活用をまとめるハブ"
        right={
          <TouchableOpacity
            style={styles.settingsLink}
            onPress={() => router.push('/settings')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="設定"
          >
            <Text style={styles.settingsLinkText}>設定</Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={visibleMemos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.sectionsHeader}>
            <FeatureCardGrid />
            <Text style={styles.sectionTitle} accessibilityRole="header">
              最近のさくっとメモ
            </Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ListStateView status="loading" />
          ) : loadError ? (
            <ListStateView
              status="error"
              onRetry={() => setReloadKey((k) => k + 1)}
            />
          ) : (
            <ListStateView
              status="empty"
              emptyMessage="さくっとメモがありません"
              emptyHint="右下の＋ボタン、または「さくっとメモ」から作成できます"
            />
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/memo/${item.id}`)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardBody} numberOfLines={2}>
              {item.body || '（本文なし）'}
            </Text>
            <View style={styles.cardMeta}>
              <Text style={styles.categoryText}>
                {getCategoryLabel(item.category)}
              </Text>
              <SyncStatusBadge status={item.github_status} compact />
            </View>
            <Text style={styles.dateText}>
              {formatDisplayDate(item.updated_at)}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          canToggle ? (
            // 全件はホーム内展開で表示する（別ルートは追加しない。28 §7.2）
            <TouchableOpacity
              style={styles.toggleBtn}
              onPress={() => setShowAllMemos((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={showAllMemos ? '3件に戻す' : 'すべて表示'}
            >
              <Text style={styles.toggleBtnText}>
                {showAllMemos ? '3件に戻す' : 'すべて表示'}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/memo/create')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="さくっとメモを作成"
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: {
    padding: spacing.md,
    // FABが最下部のメモ・展開切り替えを覆わないよう下余白を確保
    paddingBottom: 96,
    gap: spacing.sm,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  sectionsHeader: {
    gap: spacing.lg,
    marginBottom: spacing.xs,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureCard: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
    minHeight: touchTarget.min + spacing.lg,
  },
  featureCardTitle: {
    fontSize: typography.sectionTitle,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  featureCardDescription: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  sectionTitle: {
    fontSize: typography.sectionTitle,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settingsLink: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  settingsLinkText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: spacing.xs + 2,
  },
  cardBody: {
    fontSize: typography.cardTitle,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  categoryText: { fontSize: typography.caption, color: colors.textSecondary },
  dateText: { fontSize: typography.caption, color: colors.textFaint },
  toggleBtn: {
    alignSelf: 'center',
    minHeight: touchTarget.min,
    justifyContent: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
  },
  toggleBtnText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.brand,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { fontSize: 28, color: '#FFFFFF', lineHeight: 32 },
});
