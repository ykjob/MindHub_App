import { useCallback, useEffect, useRef, useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';

// コピー処理の共通挙動（Phase 15 §4.3・4.4）を1か所に集約する。
//  - 二重実行防止（copying中はrunを無視し、呼び出し側はcopyingでボタンを無効化する）
//  - 成功／失敗の文字表示状態（done／failed）を保持
//  - 結果表示タイマーのID保持・古いタイマー解除・アンマウント時解除
//  - アンマウント後にsetStateしない
// クリップボードへ渡す内容自体は呼び出し側が決める（このhookは加工しない）。
//
// Phase 16C レビュー指摘対応：コピー対象が変わったときに古い結果を出さないための reset を追加した。
//  - reset() は世代（generation）を進め、進行中のコピーの結果表示を無効化する
//  - 進行中のクリップボード処理自体は中断しない（中断できない）。完了時に世代が変わっていれば
//    done／failed を表示せず idle へ戻す＝古い文章の結果を新しい文章へ表示しない
//  - reset() は copying 中のロックを解除しない（処理が終わるまで二重コピーは防止したまま）
//  - 既存の利用箇所は run / status / copying / done / failed のみで従来どおり動作する（後方互換）。

export type CopyStatus = 'idle' | 'copying' | 'done' | 'failed';

interface Options {
  /** 成功表示の維持時間（ms） */
  successMs?: number;
  /** 失敗表示の維持時間（ms） */
  failedMs?: number;
  /** 失敗時に文字表示ではなくダイアログ等を出す場合に指定 */
  onFailed?: () => void;
  /** falseなら失敗をインライン表示せず即idleへ戻す（onFailed併用時に使う） */
  showInlineFailed?: boolean;
}

export function useCopyFeedback(options: Options = {}) {
  const {
    successMs = 2000,
    failedMs = 2500,
    onFailed,
    showInlineFailed = true,
  } = options;

  const [status, setStatus] = useState<CopyStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const copyingRef = useRef(false);
  // コピー対象の世代。reset で進め、完了時に一致しない結果は表示しない。
  const generationRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimer();
    };
  }, [clearTimer]);

  // 現在の結果表示を無効化する（コピー対象が変わったとき等に呼ぶ）。
  // 進行中のコピーは中断しないが、その結果は表示しない（世代を進めるため）。
  const reset = useCallback(() => {
    generationRef.current += 1;
    clearTimer();
    if (!mountedRef.current) return;
    // copying 中はロックを保ったまま表示も維持し、完了時に idle へ戻す。
    setStatus((prev) => (prev === 'copying' ? prev : 'idle'));
  }, [clearTimer]);

  const run = useCallback(
    async (text: string | null | undefined) => {
      if (copyingRef.current) return;
      if (!text || !text.trim()) return;
      copyingRef.current = true;
      const generation = generationRef.current;
      clearTimer();
      setStatus('copying');
      let ok = false;
      try {
        ok = await copyToClipboard(text);
      } catch {
        ok = false;
      }
      if (!mountedRef.current) {
        copyingRef.current = false;
        return;
      }
      // コピー中に対象が変わっていた場合、古い対象の結果は表示しない。
      if (generation !== generationRef.current) {
        setStatus('idle');
        copyingRef.current = false;
        return;
      }
      if (ok) {
        setStatus('done');
        timerRef.current = setTimeout(() => {
          if (mountedRef.current) setStatus('idle');
        }, successMs);
      } else {
        onFailed?.();
        if (showInlineFailed) {
          setStatus('failed');
          timerRef.current = setTimeout(() => {
            if (mountedRef.current) setStatus('idle');
          }, failedMs);
        } else {
          setStatus('idle');
        }
      }
      copyingRef.current = false;
    },
    [clearTimer, successMs, failedMs, onFailed, showInlineFailed]
  );

  return {
    status,
    copying: status === 'copying',
    done: status === 'done',
    failed: status === 'failed',
    run,
    reset,
  };
}
