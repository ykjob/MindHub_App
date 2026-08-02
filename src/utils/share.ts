import { Platform, Share } from 'react-native';

// OS／ブラウザの共有画面を開くだけの薄いユーティリティ（Phase 16C・仕様正本 docs/memo-app/33 §10）。
//
// - 新規依存を追加せず、React Native標準 Share（native）と Web Share API（web）だけを使う
// - ChatGPT等の特定アプリへ直接送信しない。共有先の選択はユーザーが行う
// - 「送信できたか」はMindHubからは分からないため、成功＝共有画面を開けたところまでとする
// - 共有本文はログ・URL・エラーメッセージへ出さない（14章）
//
// web版 react-native-web の Share は navigator.share の有無を Error でしか区別できないため、
// 「非対応（コピー案内）」と「失敗」を分けるために web は自前で分岐する。

export type ShareOutcome =
  /** 共有画面を開けた（送信できたかは不明。完了と断定しない） */
  | 'opened'
  /** ユーザーが共有画面を閉じた・キャンセルした（エラー扱いにしない） */
  | 'dismissed'
  /** この環境に共有機能がない（コピー案内へ倒す） */
  | 'unavailable'
  /** 共有画面の起動に失敗した */
  | 'failed';

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { name?: unknown }).name === 'AbortError'
  );
}

/** この環境で共有画面を開けるか（Webのみ実際に判定し、nativeは常にtrue） */
export function isShareAvailable(): boolean {
  if (Platform.OS !== 'web') return true;
  return (
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  );
}

/**
 * 共有画面を開く。呼び出し側で空文字と二重実行を防いだうえで使う。
 * 例外は投げず、結果を ShareOutcome で返す（本文は返り値・ログへ含めない）。
 */
export async function openShareSheet(text: string): Promise<ShareOutcome> {
  if (!text.trim()) return 'failed';

  if (Platform.OS === 'web') {
    if (!isShareAvailable()) return 'unavailable';
    try {
      await navigator.share({ text });
      return 'opened';
    } catch (error) {
      // キャンセルは AbortError。失敗（NotAllowedError等）と区別する。
      return isAbortError(error) ? 'dismissed' : 'failed';
    }
  }

  try {
    const result = await Share.share({ message: text });
    // Androidは常に sharedAction を返す（キャンセルを検出できない）。
    // iOSのみ dismissedAction を返すため、取得できた場合だけ区別する。
    return result.action === Share.dismissedAction ? 'dismissed' : 'opened';
  } catch {
    return 'failed';
  }
}
