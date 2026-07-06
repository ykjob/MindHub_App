// スマホ用プロンプト集HTML生成スクリプト（Phase 11 短期対応）
//
// コード固定のプロンプト定義（src/features/notes/chatgptPrompts.ts）から
// docs/mobile-view/prompts.html を生成する。
// 将来 note_templates（DB）実装後は loadPromptEntries() だけを差し替える。
//
// 使い方: npm run generate:prompt-hub  （または node scripts/generate_prompt_hub.mjs）
//
// 仕様: docs/memo-app/14-mobile-prompt-hub-and-inbox.md §1.6

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = path.join(projectRoot, 'node_modules', '.cache', 'prompt-hub');
const outFile = path.join(projectRoot, 'docs', 'mobile-view', 'prompts.html');

// ---------------------------------------------------------------------------
// データ取得層
// アプリのTSソースは拡張子なしimportのためNodeから直接importできない。
// 既存devDependencyのTypeScriptコンパイラAPIでCommonJSに変換してから読む。
// ---------------------------------------------------------------------------

function compilePromptModules() {
  const ts = require('typescript');
  const notesDir = path.join(projectRoot, 'src', 'features', 'notes');
  const entryFiles = [
    path.join(notesDir, 'chatgptPrompts.ts'),
    path.join(notesDir, 'mobilePrompts.ts'),
  ];
  const program = ts.createProgram(entryFiles, {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    outDir: cacheDir,
    skipLibCheck: true,
    types: [],
  });
  const result = program.emit();
  if (result.emitSkipped) {
    const messages = result.diagnostics.map((d) =>
      ts.flattenDiagnosticMessageText(d.messageText, '\n')
    );
    throw new Error(`プロンプト定義のコンパイルに失敗しました:\n${messages.join('\n')}`);
  }
}

/**
 * @typedef {object} PromptEntry
 * @property {string} id            コピー対象の一意ID（note_templates.name相当のキー）
 * @property {string} name          表示名
 * @property {string} groupKey      セクションのキー
 * @property {string} promptBody    note_templates.prompt_body に対応
 * @property {string} [badge]       カードに表示するバッジ文言
 * @property {string} [note]        カードに表示する補足注記（公開範囲の注意など）
 */

/**
 * @typedef {object} PromptGroup
 * @property {string} key
 * @property {string} label
 * @property {PromptEntry[]} entries
 */

/**
 * セクション別のプロンプト一覧を返す。現在はコード固定定義から構築する。
 * 将来 note_templates（DB）へ切り替える場合はこの関数だけを差し替える。
 * @returns {PromptGroup[]}
 */
function loadPromptEntries() {
  compilePromptModules();
  const { NOTE_CATEGORIES } = require(path.join(cacheDir, 'noteCategories.js'));
  const { buildChatGptPrompt } = require(path.join(cacheDir, 'chatgptPrompts.js'));
  const { MOBILE_PROMPTS, MOBILE_PROMPT_GROUP_LABELS } = require(
    path.join(cacheDir, 'mobilePrompts.js')
  );

  // 既存のメモ整理プロンプト（カテゴリ別）
  const categoryGroup = {
    key: 'category',
    label: 'メモ整理プロンプト（カテゴリ別）',
    entries: NOTE_CATEGORIES.map((category) => ({
      id: category.type,
      name: category.label,
      groupKey: 'category',
      promptBody: buildChatGptPrompt(category.type),
      badge: category.gitCandidateDefault ? undefined : '個人情報注意',
    })),
  };

  // 追加プロンプト（mobilePrompts.ts）。定義順を保ったままグループ分けする
  const extraGroups = Object.entries(MOBILE_PROMPT_GROUP_LABELS).map(
    ([key, label]) => ({
      key,
      label,
      entries: MOBILE_PROMPTS.filter((p) => p.group === key).map((p) => ({
        id: p.id,
        name: p.name,
        groupKey: p.group,
        promptBody: p.promptBody,
        badge: p.group === 'family' ? 'private / family用' : undefined,
        note: p.note,
      })),
    })
  );

  return [categoryGroup, ...extraGroups].filter((g) => g.entries.length > 0);
}

// ---------------------------------------------------------------------------
// 描画層（データ源に依存しない純関数）
// ---------------------------------------------------------------------------

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * @param {PromptEntry} entry
 * @param {string} groupLabel
 * @returns {string}
 */
function renderCard(entry, groupLabel) {
  const badge = entry.badge
    ? `<span class="badge">${escapeHtml(entry.badge)}</span>`
    : '';
  const note = entry.note
    ? `\n        <p class="note">${escapeHtml(entry.note)}</p>`
    : '';
  return `      <section class="card" data-search="${escapeHtml(
    `${entry.name} ${entry.id} ${groupLabel}`.toLowerCase()
  )}">
        <div class="card-head">
          <div class="card-title">
            <h3>${escapeHtml(entry.name)}</h3>
            <span class="type">${escapeHtml(entry.id)}</span>
            ${badge}
          </div>
          <button type="button" class="copy-btn" data-copy="prompt-${escapeHtml(entry.id)}">コピー</button>
        </div>${note}
        <details>
          <summary>プロンプトを表示</summary>
          <pre id="prompt-${escapeHtml(entry.id)}">${escapeHtml(entry.promptBody)}</pre>
        </details>
      </section>`;
}

/**
 * @param {PromptGroup[]} groups
 * @param {string} generatedAt
 * @returns {string}
 */
function renderHtml(groups, generatedAt) {
  const total = groups.reduce((sum, g) => sum + g.entries.length, 0);
  const sections = groups
    .map(
      (group) => `    <div class="group">
    <h2 class="section-title">${escapeHtml(group.label)}</h2>
${group.entries.map((entry) => renderCard(entry, group.label)).join('\n')}
    </div>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>プロンプト集 | MindHub_App</title>
<style>
  :root {
    --accent: #2563EB;
    --bg: #F3F4F6;
    --card-bg: #FFFFFF;
    --text: #111827;
    --sub: #6B7280;
    --border: #E5E7EB;
    --pre-bg: #F9FAFB;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #111827;
      --card-bg: #1F2937;
      --text: #F9FAFB;
      --sub: #9CA3AF;
      --border: #374151;
      --pre-bg: #111827;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 16px;
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif;
    line-height: 1.6;
  }
  header h1 {
    font-size: 20px;
    margin: 0 0 4px;
  }
  header p {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--sub);
  }
  #search {
    width: 100%;
    padding: 10px 12px;
    font-size: 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--card-bg);
    color: var(--text);
    margin-bottom: 16px;
  }
  .card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 12px;
  }
  .card.hidden, .group.hidden { display: none; }
  .card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }
  .card-title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    min-width: 0;
  }
  .card-title h3 {
    font-size: 16px;
    margin: 0;
  }
  .section-title {
    font-size: 15px;
    color: var(--accent);
    border-bottom: 2px solid var(--accent);
    padding-bottom: 4px;
    margin: 20px 0 10px;
  }
  .note {
    font-size: 12px;
    color: #B45309;
    margin: 6px 0 0;
  }
  .type {
    font-size: 11px;
    color: var(--sub);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 6px;
  }
  .badge {
    font-size: 11px;
    color: #B91C1C;
    background: #FEE2E2;
    border-radius: 4px;
    padding: 1px 6px;
    white-space: nowrap;
  }
  .copy-btn {
    flex-shrink: 0;
    background: var(--accent);
    color: #FFFFFF;
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 14px;
    cursor: pointer;
  }
  .copy-btn.done { background: #16A34A; }
  details { margin-top: 8px; }
  summary {
    font-size: 13px;
    color: var(--accent);
    cursor: pointer;
  }
  pre {
    background: var(--pre-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px;
    font-size: 12px;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 8px 0 0;
  }
  footer {
    margin-top: 20px;
    font-size: 12px;
    color: var(--sub);
  }
</style>
</head>
<body>
  <header>
    <h1>プロンプト集</h1>
    <p>コピーして ChatGPT / Gemini / Claude Code / Codex に貼り付けて使ってください。</p>
    <input type="search" id="search" placeholder="プロンプト名・分類で絞り込み">
  </header>
  <main>
${sections}
  </main>
  <footer>
    <p>生成日時：${escapeHtml(generatedAt)}（収録 ${total} プロンプト）</p>
    <p>コード固定定義（chatgptPrompts.ts）から生成。将来はnote_templates（DB）へ出力元を切り替え予定。</p>
    <p>再生成コマンド：npm run generate:prompt-hub</p>
  </footer>
  <script>
    // コピー：Clipboard APIが使えない環境では選択＋execCommandへフォールバック
    function fallbackCopy(text) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      var ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (e) {
        ok = false;
      }
      document.body.removeChild(textarea);
      return ok;
    }

    function markDone(btn, ok) {
      var original = 'コピー';
      btn.textContent = ok ? 'コピーしました' : 'コピー失敗';
      if (ok) btn.classList.add('done');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('done');
      }, 1500);
    }

    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pre = document.getElementById(btn.getAttribute('data-copy'));
        var text = pre ? pre.textContent : '';
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(
            function () { markDone(btn, true); },
            function () { markDone(btn, fallbackCopy(text)); }
          );
        } else {
          markDone(btn, fallbackCopy(text));
        }
      });
    });

    document.getElementById('search').addEventListener('input', function (e) {
      var keyword = e.target.value.trim().toLowerCase();
      document.querySelectorAll('.card').forEach(function (card) {
        var hit = !keyword || card.getAttribute('data-search').indexOf(keyword) !== -1;
        card.classList.toggle('hidden', !hit);
      });
      // ヒットするカードが1枚もないセクションは見出しごと隠す
      document.querySelectorAll('.group').forEach(function (group) {
        var visible = group.querySelectorAll('.card:not(.hidden)').length > 0;
        group.classList.toggle('hidden', !visible);
      });
    });
  </script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// メイン
// ---------------------------------------------------------------------------

const groups = loadPromptEntries();
const total = groups.reduce((sum, g) => sum + g.entries.length, 0);
const generatedAt = new Date().toLocaleString('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});
mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, renderHtml(groups, generatedAt), 'utf8');
console.log(
  `生成完了: ${path.relative(projectRoot, outFile)}（${groups.length}セクション・${total}プロンプト）`
);
