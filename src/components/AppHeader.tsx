import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, typography } from '../theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

// 主要4画面（ホーム・メモ管理一覧・現場適応入口・プロンプト集）用の画面内共通ヘッダー（29 §5・§6.1）。
// 対象画面はネイティブヘッダーを headerShown: false にして本コンポーネントへ統一する。
// ネイティブヘッダーの戻るは履歴依存で、Webの直アクセス・更新時に消えるため、
// 履歴がない場合はホームへ戻るフォールバックを持つ。
export default function AppHeader({ title, subtitle, showBack, right }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={goBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="戻る"
          >
            <Text style={styles.backBtnText}>← 戻る</Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.titleBlock}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    // Safe Areaを除く内容領域はminHeight 56から開始（固定高さにせず文字を切らない）
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backBtn: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.xs,
  },
  backBtnText: {
    fontSize: typography.body,
    color: colors.brand,
    fontWeight: '600',
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: typography.pageTitle,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  right: {
    flexShrink: 0,
  },
});
