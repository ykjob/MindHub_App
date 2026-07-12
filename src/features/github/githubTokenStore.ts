import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'github_token';

// expo-secure-store はWeb実装を持たないため、Webでは呼ばない。
// WebではGitHubトークン保存は非対応（保存はAndroid / iOSのみ）。
const isWeb = Platform.OS === 'web';

export async function saveToken(token: string): Promise<void> {
  if (isWeb) return;
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  if (isWeb) return null;
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken(): Promise<void> {
  if (isWeb) return;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
