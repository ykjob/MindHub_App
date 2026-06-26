import { Alert } from 'react-native';

interface Options {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

export function showConfirmDialog({
  title,
  message,
  confirmLabel = '削除',
  cancelLabel = 'キャンセル',
  onConfirm,
}: Options): void {
  Alert.alert(title, message, [
    { text: cancelLabel, style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
