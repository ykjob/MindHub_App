import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllMemos } from '../src/features/memos/memoRepository';
import type { Memo } from '../src/features/memos/memoTypes';
import { getCategoryLabel } from '../src/features/memos/memoCategories';
import SyncStatusBadge from '../src/components/SyncStatusBadge';
import { formatDisplayDate } from '../src/utils/date';

export default function MemoListScreen() {
  const db = useSQLiteContext();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getAllMemos(db)
        .then((result) => { if (active) { setMemos(result); setLoading(false); } })
        .catch(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }, [db])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>メモ一覧</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/prompts')} style={styles.settingsBtn}>
            <Text style={styles.settingsBtnText}>プロンプト集</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notes')} style={styles.settingsBtn}>
            <Text style={styles.settingsBtnText}>メモ管理</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsBtn}>
            <Text style={styles.settingsBtnText}>設定</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.center} size="large" color="#2563EB" />
      ) : memos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>メモがありません</Text>
          <Text style={styles.emptySubText}>右下の＋ボタンから作成してください</Text>
        </View>
      ) : (
        <FlatList
          data={memos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
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
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/memo/create')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  headerActions: { flexDirection: 'row', gap: 8 },
  settingsBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  settingsBtnText: { fontSize: 14, color: '#374151' },
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
  cardBody: { fontSize: 15, color: '#111827', lineHeight: 22 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryText: { fontSize: 12, color: '#6B7280' },
  dateText: { fontSize: 12, color: '#9CA3AF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
  emptySubText: { fontSize: 13, color: '#9CA3AF' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { fontSize: 28, color: '#FFFFFF', lineHeight: 32 },
});
