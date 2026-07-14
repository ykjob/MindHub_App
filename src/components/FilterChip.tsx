import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../theme';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

// 一覧の絞り込み専用チップ（29 §6.2）。選択＝ブランド色塗り＋白文字＋太字、pill形状。
// CategorySelector（フォームの入力値選択）の置き換えには使わない。
// 並び順操作はフィルターではないため、本コンポーネントを使わない。
// バッチ1では表示基盤のみ作成（既存画面への適用はメモ管理改修タスクで行う）。
export default function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.pill,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  text: {
    fontSize: typography.caption,
    color: '#374151',
  },
  textSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
});
