import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography } from '../theme';

interface NativeHeaderBackButtonProps {
  /** 履歴がない直アクセス時に戻る先（例：'/' や '/notes'）。行き止まりを防ぐ */
  fallback: string;
}

// ネイティブStackヘッダー用の戻るボタン（memo/create・notes/create・settings と
// 現場適応5入力画面 workplace/start・stuck・question・report・end で使用＝計8画面）。
// React Navigation Web既定の戻るボタンはマスク画像のシェブロンで、ブラウザによって表示されない
// ことがあり、履歴がない直アクセス時はそもそも描画されない。テキスト「← 戻る」で常に視認でき、
// 直アクセス時もフォールバックで行き止まりにしない（画面をAppHeader方式へ変えずに視認性だけ直す）。
export default function NativeHeaderBackButton({ fallback }: NativeHeaderBackButtonProps) {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={goBack}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="戻る"
    >
      <Text style={styles.text}>← 戻る</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  text: {
    fontSize: typography.body,
    color: colors.brand,
    fontWeight: '600',
  },
});
