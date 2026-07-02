import { Platform } from 'react-native';

// PC用Webアプリを優先するため、navigator.clipboardのみ対応する。
// ネイティブ対応が必要になったらexpo-clipboard導入を検討する。
export async function copyToClipboard(text: string): Promise<boolean> {
  if (Platform.OS !== 'web') {
    return false;
  }
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  return false;
}
