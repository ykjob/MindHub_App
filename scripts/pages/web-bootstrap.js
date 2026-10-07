// Start SQLite only after isolation is ready. The first visit reloads once.
(() => {
  const entry = document.currentScript.dataset.entry;
  const base = new URL('./', document.currentScript.src);
  const retryKey = 'mindhub-pages-isolation-retry';
  const message = (text) => {
    const status = document.getElementById('web-startup');
    if (status) status.textContent = text;
  };
  async function start() {
    if (!window.isSecureContext || !('serviceWorker' in navigator) || !navigator.storage?.getDirectory) {
      message('このブラウザではWeb版の保存機能を利用できません。最新版のChromeやEdgeなどでお試しください。');
      return;
    }
    await navigator.serviceWorker.register(new URL('web-isolation-sw.js', base), { scope: base.pathname });
    if (!window.crossOriginIsolated) {
      if (sessionStorage.getItem(retryKey)) {
        message('Web版を起動できませんでした。通常のブラウザで開き直してください。');
        return;
      }
      await navigator.serviceWorker.ready;
      sessionStorage.setItem(retryKey, '1');
      window.location.reload();
      return;
    }
    sessionStorage.removeItem(retryKey);
    const script = document.createElement('script');
    script.src = entry;
    script.onerror = () => message('読み込みに失敗しました。通信環境を確認して再読み込みしてください。');
    document.body.appendChild(script);
  }
  start().catch(() => message('Web版を起動できませんでした。ブラウザの保存設定と通信環境をご確認ください。'));
})();
