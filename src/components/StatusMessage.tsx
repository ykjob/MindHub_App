import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

export type StatusKind = 'success' | 'error' | 'information';

interface StatusMessageProps {
  kind: StatusKind;
  message: string;
}

// 操作結果（保存・コピー等）の表示統一（29 §6.4）。色だけでなく文字で結果を示す。
// 表示タイミング・自動消去は呼び出し側が管理する（トースト・タイマーは持たない）。
// バッチ1では表示基盤のみ作成（既存画面への適用は各画面の改修タスクで行う）。
export default function StatusMessage({ kind, message }: StatusMessageProps) {
  return (
    <View style={[styles.container, containerByKind[kind]]}>
      <Text style={[styles.text, textByKind[kind]]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    fontSize: typography.caption + 1,
    lineHeight: 19,
  },
  success: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  error: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  information: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brandBorder,
  },
  successText: { color: colors.success },
  errorText: { color: colors.danger },
  informationText: { color: colors.brandStrongText },
});

const containerByKind = {
  success: styles.success,
  error: styles.error,
  information: styles.information,
} as const;

const textByKind = {
  success: styles.successText,
  error: styles.errorText,
  information: styles.informationText,
} as const;
