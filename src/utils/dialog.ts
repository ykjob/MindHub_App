import { Alert, Platform } from 'react-native';

// アプリ全体の確認ダイアログの正本（環境差の吸収はここに集約する）。
// RN WebのAlert.alertは複数ボタン確認に適さないため、Webではwindow.confirmを使う。
// 【Webの制約】ブラウザ標準の window.confirm はボタン文言（OK/キャンセル）を変更できないため、
// Web環境では confirmLabel / cancelLabel は反映されない（title・messageのみ表示）。
// Android/iOSでは Alert.alert で cancelLabel（style='cancel'）・confirmLabel（style='destructive'）を反映する。
export function confirmDialog(options: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}): void {
  if (Platform.OS === 'web') {
    // window.confirm はブロッキング（表示中は他JSが走らない）ため二重表示は起きない。
    // ボタン文言は変更できない＝confirmLabel/cancelLabelはWebでは無視される（上記コメント参照）。
    if (typeof window !== 'undefined' && window.confirm(`${options.title}\n\n${options.message}`)) {
      options.onConfirm();
    }
    return;
  }
  Alert.alert(options.title, options.message, [
    { text: options.cancelLabel ?? 'キャンセル', style: 'cancel' },
    {
      text: options.confirmLabel ?? 'OK',
      style: 'destructive',
      onPress: options.onConfirm,
    },
  ]);
}

export function showMessage(title: string, message?: string): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.alert(message ? `${title}\n\n${message}` : title);
    }
    return;
  }
  Alert.alert(title, message);
}
