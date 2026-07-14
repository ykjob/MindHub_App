import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getLatestEndNote } from '../../src/features/workplace/workplaceService';
import type { Note } from '../../src/features/notes/noteTypes';
import AppHeader from '../../src/components/AppHeader';
import ListStateView from '../../src/components/ListStateView';
import { colors, spacing, typography, radius, touchTarget } from '../../src/theme';
import { formatDisplayDate } from '../../src/utils/date';

// 動作種別：コピーのみ／コピーと保存（保存されるのは終業前メモのみ＝23 §6.1）
type SceneAction = 'copy' | 'copySave';

interface SceneDef {
  key: string;
  label: string;
  desc: string;
  route: string;
  action: SceneAction;
}

const SCENES: Record<string, SceneDef> = {
  start: {
    key: 'start',
    label: '作業開始',
    desc: '今日の作業・完了条件・触る範囲・確認事項を整理する',
    route: '/workplace/start',
    action: 'copy',
  },
  stuck: {
    key: 'stuck',
    label: '行き詰まり記録',
    desc: '状況・試したこと・確認したいことを言語化する',
    route: '/workplace/stuck',
    action: 'copy',
  },
  question: {
    key: 'question',
    label: '質問文作成',
    desc: '相手が答えやすい質問文に整理する',
    route: '/workplace/question',
    action: 'copy',
  },
  report: {
    key: 'report',
    label: '進捗報告作成',
    desc: '結論から短く分かりやすい進捗報告に整理する',
    route: '/workplace/report',
    action: 'copy',
  },
  end: {
    key: 'end',
    label: '終業前メモ',
    desc: '今日やったこと・未完了・明日の再開メモを残す',
    route: '/workplace/end',
    action: 'copySave',
  },
};

// 一日の流れの3区分（28 §9.1）。場面の順序は従来どおり
// 作業開始→行き詰まり記録→質問文作成→進捗報告作成→終業前メモ。
const SECTIONS: { key: string; title: string; desc: string; scenes: SceneDef[] }[] = [
  {
    key: 'begin',
    title: '開始',
    desc: '今日やることを決め、前日の続きから作業を再開します。',
    scenes: [SCENES.start],
  },
  {
    key: 'during',
    title: '作業中',
    desc: '行き詰まり、質問、進捗報告を整理します。',
    scenes: [SCENES.stuck, SCENES.question, SCENES.report],
  },
  {
    key: 'finish',
    title: '終了',
    desc: '今日の状態を残し、翌日の再開につなげます。',
    scenes: [SCENES.end],
  },
];

const ACTION_LABELS: Record<SceneAction, string> = {
  copy: 'コピーのみ',
  copySave: 'コピーと保存',
};

const PRIVACY_NOTICE =
  '実名・顧客名・認証情報・社内URL・業務コードの全文は入力しないでください。内容は一般化した個人用の覚書に留めます。';

export default function WorkplaceHomeScreen() {
  const db = useSQLiteContext();
  const [latestEnd, setLatestEnd] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setLoadError(false);
      getLatestEndNote(db)
        .then((n) => {
          if (active) {
            setLatestEnd(n);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) {
            setLoadError(true);
            setLoading(false);
          }
        });
      return () => {
        active = false;
      };
    }, [db, reloadKey])
  );

  const renderSceneCard = (s: SceneDef) => (
    <TouchableOpacity
      key={s.key}
      style={styles.sceneCard}
      onPress={() => router.push(s.route)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${s.label}、${ACTION_LABELS[s.action]}`}
      accessibilityHint={`${s.label}画面を開きます`}
    >
      <View style={styles.sceneHeader}>
        <Text style={styles.sceneLabel}>{s.label}</Text>
        <Text style={s.action === 'copySave' ? styles.saveBadge : styles.copyBadge}>
          {ACTION_LABELS[s.action]}
        </Text>
      </View>
      <Text style={styles.sceneDesc}>{s.desc}</Text>
    </TouchableOpacity>
  );

  // 「開始」区分：前回の再開メモ→作業開始の順に置き、
  // 前日の終業前メモ→この続きから作業開始→今日のフォーム、の流れを表示順で示す
  const renderRestartArea = () => {
    if (loading) {
      return <ListStateView status="loading" />;
    }
    if (loadError) {
      return (
        <ListStateView status="error" onRetry={() => setReloadKey((k) => k + 1)} />
      );
    }
    if (!latestEnd) {
      return (
        <ListStateView
          status="empty"
          emptyMessage="前回の再開メモはありません"
          emptyHint="終業前メモを保存すると、次回ここから作業を再開できます。"
        />
      );
    }
    return (
      <View style={styles.restartCard}>
        <Text style={styles.restartLabel}>前回の再開メモ</Text>
        <Text style={styles.restartDate}>{formatDisplayDate(latestEnd.updated_at)}</Text>
        <Text style={styles.restartBody} numberOfLines={8}>
          {latestEnd.body}
        </Text>
        <TouchableOpacity
          style={styles.restartBtn}
          onPress={() => router.push('/workplace/start?fromRestart=1')}
          accessibilityRole="button"
          accessibilityLabel="この続きから作業開始"
          accessibilityHint="前回の再開メモの内容を作業開始フォームへ引き継ぎます"
        >
          <Text style={styles.restartBtnText}>この続きから作業開始</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <AppHeader
        title="現場適応モード"
        subtitle="仕事の5場面を整理し、質問・報告・翌日の再開につなげます。"
        showBack
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.inner}>
          <View style={styles.notice} accessible>
            <Text style={styles.noticeText}>{PRIVACY_NOTICE}</Text>
          </View>

          {SECTIONS.map((section) => (
            <View key={section.key} style={styles.section}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                {section.title}
              </Text>
              <Text style={styles.sectionDesc}>{section.desc}</Text>
              {section.key === 'begin' ? renderRestartArea() : null}
              {section.scenes.map(renderSceneCard)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  inner: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  notice: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  noticeText: {
    fontSize: typography.caption + 1,
    color: colors.warningText,
    lineHeight: 19,
  },
  section: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sectionTitle,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionDesc: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  sceneCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  sceneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sceneLabel: {
    flex: 1,
    fontSize: typography.sectionTitle,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  copyBadge: {
    fontSize: typography.badge,
    color: colors.brandStrongText,
    backgroundColor: colors.brandSoft,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  saveBadge: {
    fontSize: typography.badge,
    color: colors.success,
    backgroundColor: colors.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  sceneDesc: {
    fontSize: typography.caption + 1,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  restartCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.brandBorder,
    borderRadius: radius.md,
    padding: 14,
    gap: 6,
  },
  restartLabel: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.brand,
  },
  restartDate: {
    fontSize: typography.caption,
    color: colors.textFaint,
  },
  restartBody: {
    fontSize: typography.caption + 1,
    color: '#374151',
    lineHeight: 20,
  },
  restartBtn: {
    marginTop: 6,
    minHeight: touchTarget.min,
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restartBtnText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.surface,
  },
});
