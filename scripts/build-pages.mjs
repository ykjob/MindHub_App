import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const result = spawnSync(process.execPath, [
  'node_modules/expo/bin/cli', 'export', '--platform', 'web', '--output-dir', 'dist',
], { stdio: 'inherit', env: { ...process.env, MINDHUB_PAGES: '1' } });
if (result.status !== 0) process.exit(result.status ?? 1);

let html = readFileSync('dist/index.html', 'utf8');
const entries = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)];
if (entries.length !== 1 || !entries[0][1].startsWith('/MindHub_App/_expo/')) {
  throw new Error('Unexpected Expo entry script; review the export before publishing.');
}
html = html.replace(entries[0][0], '');
html = html.replace('<html lang="en">', '<html lang="ja">');
html = html.replace(/<title>.*?<\/title>/, '<title>MindHub | 思考整理ハブ</title>');
html = html.replace('</head>', `<meta name="description" content="スマホでメモを作成し、思考や仕事の整理、AI向けプロンプトの活用を試せるMindHubのWeb版。">
<style>
body { background: #E5E7EB; }
#root { width: 100%; max-width: 480px; margin: 0 auto; background: #F9FAFB; }
#web-startup { padding: 24px 16px; font: 14px/1.5 system-ui, sans-serif; color: #111827; }
</style>
<script defer src="/MindHub_App/web-bootstrap.js" data-entry="${entries[0][1]}"></script></head>`);
html = html.replace('<div id="root"></div>', '<div id="root"><p id="web-startup" role="status">MindHubを準備しています…</p></div>');
writeFileSync('dist/index.html', html);
// Pages uses this document for direct visits to local-data IDs and other routes.
writeFileSync('dist/404.html', html);
writeFileSync('dist/.nojekyll', '');
for (const file of ['web-bootstrap.js', 'web-isolation-sw.js']) {
  copyFileSync(`scripts/pages/${file}`, `dist/${file}`);
}

// Upload the Expo export only. Reject accidental documents, databases or maps.
for (const file of readdirSync('dist', { recursive: true, withFileTypes: true })) {
  if (!file.isFile()) continue;
  const path = relative(resolve('dist'), resolve(file.parentPath, file.name)).replaceAll('\\', '/');
  if (!/^(index\.html|404\.html|favicon\.ico|metadata\.json|\.nojekyll|web-bootstrap\.js|web-isolation-sw\.js|_expo\/static\/js\/web\/[^/]+\.js|assets\/.+\.(png|jpg|jpeg|gif|webp|svg|ttf|otf|woff2?|wasm))$/.test(path)) {
    throw new Error(`Unexpected public file: ${path}`);
  }
}
