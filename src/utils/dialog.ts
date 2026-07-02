import { Alert, Platform } from 'react-native';

// RN WebのAlert.alertは複数ボタンに対応しないため、Webではwindow.confirm/alertを使う。
export function confirmDialog(options: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
}): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${options.title}\n\n${options.message}`)) {
      options.onConfirm();
    }
    return;
  }
  Alert.alert(options.title, options.message, [
    { text: 'キャンセル', style: 'cancel' },
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
