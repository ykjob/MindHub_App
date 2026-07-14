import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getLatestEndNote } from '../../src/features/workplace/workplaceService';
import type { Note } from '../../src/features/notes/noteTypes';
import AppHeader from '../../src/components/AppHeader';
import { formatDisplayDate } from '../../src/utils/date';

interface SceneDef {
  key: string;
  label: string;
  desc: string;
  route: string;
}

const SCENES: SceneDef[] = [
  {
    key: 'start',
    label: '作業開始',
    desc: '今日の作業・完了条件・触る範囲・確認事項を整理する',
    route: '/workplace/start',
  },
  {
    key: 'stuck',
    label: '詰まり記録',
    desc: '状況・試したこと・確認したいことを言語化する',
    route: '/workplace/stuck',
  },
  {
    key: 'question',
    label: '質問文作成',
    desc: '相手が答えやすい質問文に整理する',
    route: '/workplace/question',
  },
  {
    key: 'report',
    label: '進捗報告作成',
    desc: '結論から短く分かりやすい進捗報告に整理する',
    route: '/workplace/report',
  },
  {
    key: 'end',
    label: '終業前メモ',
    desc: '今日やったこと・未完了・明日の再開メモを残す',
    route: '/workplace/end',
  },
];

export default function WorkplaceHomeScreen() {
  const db = useSQLiteContext();
  const [latestEnd, setLatestEnd] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getLatestEndNote(db)
        .then((n) => {
          if (active) {
            setLatestEnd(n);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [db])
  );

  return (
    <View style={styles.root}>
      <AppHeader title="現場適応モード" showBack />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.lead}>
        毎日の場面ごとに整理してコピー・保存できます。現場固有の情報は保存しません（一般化した個人用の覚書に留めます）。
      </Text>

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#2563EB" />
      ) : latestEnd ? (
        <View style={styles.restartCard}>
          <Text style={styles.restartLabel}>前回の再開メモ</Text>
          <Text style={styles.restartDate}>
            {formatDisplayDate(latestEnd.updated_at)}
          </Text>
          <Text style={styles.restartBody} numberOfLines={8}>
            {latestEnd.body}
          </Text>
          <TouchableOpacity
            style={styles.restartBtn}
            onPress={() => router.push('/workplace/start?fromRestart=1')}
          >
            <Text style={styles.restartBtnText}>この続きから作業開始</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.restartEmpty}>
          <Text style={styles.restartEmptyText}>
            まだ再開メモはありません。終業前メモを保存すると、翌日ここに表示されます。
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>今日の場面</Text>
      {SCENES.map((s) => (
        <TouchableOpacity
          key={s.key}
          style={styles.sceneCard}
          onPress={() => router.push(s.route)}
          activeOpacity={0.7}
        >
          <Text style={styles.sceneLabel}>{s.label}</Text>
          <Text style={styles.sceneDesc}>{s.desc}</Text>
        </TouchableOpacity>
      ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  lead: { fontSize: 13, color: '#6B7280', lineHeight: 19 },
  loader: { marginVertical: 24 },
  restartCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  restartLabel: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  restartDate: { fontSize: 12, color: '#9CA3AF' },
  restartBody: { fontSize: 13, color: '#374151', lineHeight: 20 },
  restartBtn: {
    marginTop: 6,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  restartBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  restartEmpty: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
  },
  restartEmptyText: { fontSize: 13, color: '#6B7280', lineHeight: 19 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  sceneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  sceneLabel: { fontSize: 16, fontWeight: '600', color: '#111827' },
  sceneDesc: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
});
