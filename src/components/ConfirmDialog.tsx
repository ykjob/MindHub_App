import { confirmDialog } from '../utils/dialog';

interface Options {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

// 既存API互換の薄いラッパー。確認ダイアログの実体は src/utils/dialog.ts の confirmDialog に集約し、
// 環境差（Web=window.confirm／Android・iOS=Alert.alert）はそこで吸収する。
// 既存の showConfirmDialog 呼び出し側（さくっとメモ削除など）はそのままWeb対応になる。
// 【Webの制約】window.confirm はボタン文言を変更できないため confirmLabel/cancelLabel はWebでは反映されない。
export function showConfirmDialog({
  title,
  message,
  confirmLabel = '削除',
  cancelLabel = 'キャンセル',
  onConfirm,
}: Options): void {
  confirmDialog({ title, message, confirmLabel, cancelLabel, onConfirm });
}
