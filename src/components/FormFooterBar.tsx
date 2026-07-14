import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  InputAccessoryView,
  InteractionManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 保存・キャンセル用の共通フッター。画面下部に通常表示しつつ、
// iOSではキーボード直上にも同じボタンを表示する（InputAccessoryView）。
// KeyboardAvoidingViewやキーボードイベント監視によるレイアウト調整は
// 新アーキテクチャのExpo Go実機で効かないため、この方式に統一する。

// TextInputに展開してキーボード直上バーと紐付けるためのprops
export function inputAccessoryProps(accessoryId: string) {
  return Platform.OS === 'ios' ? { inputAccessoryViewID: accessoryId } : {};
}

interface Props {
  // 画面ごとに一意なID。TextInput側のinputAccessoryPropsと同じ値を渡す
  accessoryId: string;
  // キーボード直上バーの準備完了後に一度だけ呼ばれる（iOS以外は即時）。
  // autoFocusの代わりにここでfocus()すると、バーが出る前に
  // キーボードだけが表示されてしまうのを防げる
  onAccessoryReady?: () => void;
  children: React.ReactNode;
}

export default function FormFooterBar({
  accessoryId,
  onAccessoryReady,
  children,
}: Props) {
  const [accessoryReady, setAccessoryReady] = useState(Platform.OS !== 'ios');
  const notified = useRef(false);
  // 画面下端に近すぎる問題への対応：通常フッターにのみ下部Safe Areaを加算する。
  // iOSのInputAccessoryView（キーボード直上バー）はキーボード上に浮くため加算しない（重複回避）。
  // Web・下部インセットのない端末ではinsets.bottom=0となり従来表示に一致する。
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    // 画面遷移アニメーション中にInputAccessoryViewをマウントすると
    // キーボードへの登録に失敗することがあるため、遷移完了後にマウントする
    const task = InteractionManager.runAfterInteractions(() => {
      setAccessoryReady(true);
    });
    return () => task.cancel();
  }, []);

  useEffect(() => {
    if (accessoryReady && !notified.current) {
      notified.current = true;
      onAccessoryReady?.();
    }
  }, [accessoryReady, onAccessoryReady]);

  return (
    <>
      <View style={[styles.footer, { paddingBottom: FOOTER_PADDING + insets.bottom }]}>
        {children}
      </View>
      {Platform.OS === 'ios' && accessoryReady ? (
        <InputAccessoryView nativeID={accessoryId}>
          <View style={styles.footer}>{children}</View>
        </InputAccessoryView>
      ) : null}
    </>
  );
}

const FOOTER_PADDING = 12;

const styles = StyleSheet.create({
  // 保存ボタンを左下に置く（保存が左端、キャンセルがその右）
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
});
