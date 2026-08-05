import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

// 画面遷移の二重操作防止（Phase 16C レビュー指摘対応）。
//
// Reactのstate更新は非同期のため、`navigating` のようなstateだけでボタンを無効化しても、
// 同一イベント周期の高速二重押下では2回目の push を止められない。
// そこで同期的な ref でロックし、UI表示用のstateは別に持つ。
//
//  - run() は最初の呼び出しだけ navigate を実行し、2回目以降は同期的に無視する（false を返す）
//  - navigate が同期的に例外を投げた場合はロックを解除し、onError で呼び出し側が後始末できる
//    （例：引き継ぎデータの破棄）。例外の内容・本文はここでログへ出さない
//  - 遷移先から戻ってきたとき（画面が再フォーカスされたとき）にロックを解除する
//    ＝ロックが永続してボタンが使えなくならない
//  - アンマウント後はstateを更新しない
export function useNavigationLock() {
  const lockedRef = useRef(false);
  const mountedRef = useRef(true);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const release = useCallback(() => {
    lockedRef.current = false;
    if (mountedRef.current) setNavigating(false);
  }, []);

  // 画面へ戻ったとき（初回フォーカス含む）にロックを解除して再操作できるようにする。
  useFocusEffect(
    useCallback(() => {
      release();
    }, [release])
  );

  const run = useCallback(
    (navigate: () => void, onError?: () => void): boolean => {
      if (lockedRef.current) return false;
      lockedRef.current = true;
      if (mountedRef.current) setNavigating(true);
      try {
        navigate();
        return true;
      } catch {
        release();
        onError?.();
        return false;
      }
    },
    [release]
  );

  return { navigating, run, release };
}
