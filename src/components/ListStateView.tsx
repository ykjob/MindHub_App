import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

export type ListStatus = 'loading' | 'empty' | 'filtered-empty' | 'error';

interface ListStateViewProps {
  status: ListStatus;
  /** empty時の主メッセージ（省略時は汎用文言） */
  emptyMessage?: string;
  /** empty時の補助文（作成への誘導など） */
  emptyHint?: string;
  /** error時の再試行。渡された場合のみ再試行ボタンを表示する */
  onRetry?: () => void;
}

// 一覧画面の状態表示（29 §6.3・§7）。loading／empty／filtered-empty／errorを区別して表示する。
// データ取得ロジックは持たない（状態判定は各画面に残す）。
// バッチ1では表示基盤のみ作成（既存画面への適用は各画面の改修タスクで行う）。
export default function ListStateView({ status, emptyMessage, emptyHint, onRetry }: ListStateViewProps) {
  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  if (status === 'filtered-empty') {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>条件に一致するデータがありません</Text>
        <Text style={styles.hintText}>検索キーワードや絞り込み条件を解除すると表示されます</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>読み込みに失敗しました</Text>
        <Text style={styles.hintText}>データが消えたわけではありません。再試行してください。</Text>
        {onRetry ? (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="再試行"
          >
            <Text style={styles.retryBtnText}>再試行</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  // empty
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>{emptyMessage ?? 'データがありません'}</Text>
      {emptyHint ? <Text style={styles.hintText}>{emptyHint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  mainText: {
    fontSize: typography.sectionTitle,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorText: {
    fontSize: typography.sectionTitle,
    color: colors.danger,
    fontWeight: '500',
    textAlign: 'center',
  },
  hintText: {
    fontSize: typography.caption + 1,
    color: colors.textFaint,
    textAlign: 'center',
    lineHeight: 19,
  },
  retryBtn: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
  },
  retryBtnText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.surface,
  },
});
