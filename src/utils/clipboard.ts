import { Platform } from 'react-native';
import * as ExpoClipboard from 'expo-clipboard';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      return false;
    } else {
      await ExpoClipboard.setStringAsync(text);
      return true;
    }
  } catch {
    return false;
  }
}
