import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { GithubStatus } from '../features/memos/memoTypes';

interface Props {
  status: GithubStatus;
  compact?: boolean;
}

const STATUS_CONFIG: Record<GithubStatus, { label: string; color: string; bg: string }> = {
  not_uploaded: { label: '未アップロード', color: '#6B7280', bg: '#F3F4F6' },
  uploaded: { label: 'アップロード済み', color: '#059669', bg: '#D1FAE5' },
  modified_after_upload: { label: '変更あり', color: '#D97706', bg: '#FEF3C7' },
  failed: { label: '失敗', color: '#DC2626', bg: '#FEE2E2' },
};

export default function SyncStatusBadge({ status, compact = false }: Props) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.color }, compact && styles.compact]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  compact: {
    fontSize: 11,
  },
});
