import * as Crypto from 'expo-crypto';

// Webのcrypto.randomUUIDはiOS/AndroidのHermesには存在しないため、
// 全プラットフォーム対応のexpo-cryptoを使う。
export function generateId(): string {
  return Crypto.randomUUID();
}
