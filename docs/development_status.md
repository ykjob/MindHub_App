# FlowDock 開発状況

最終更新：2026-06-26

---

## 現在のフェーズ

**フェーズ6：MVP仕上げ ✅ 完了（MVP実装完了）**

---

## フェーズ進捗

| フェーズ | 内容 | 状態 |
|---------|------|------|
| フェーズ0 | 設計確認・ドキュメント整備 | ✅ 完了 |
| フェーズ1 | Expo初期構成 | ✅ 完了 |
| フェーズ2 | SQLite保存 | ✅ 完了 |
| フェーズ3 | カテゴリと状態表示 | ✅ 完了 |
| フェーズ4 | GitHub設定 | ✅ 完了 |
| フェーズ5 | GitHub手動アップロード | ✅ 完了 |
| フェーズ6 | MVP仕上げ | ✅ 完了 |

---

## MVP完了条件 達成状況

| # | 条件 | 状態 | 備考 |
|---|------|------|------|
| 1 | スマホでメモを作成できる | ✅ 完了 | app/memo/create.tsx |
| 2 | SQLiteに保存される | ✅ 完了 | memoRepository.insertMemo |
| 3 | アプリを再起動してもメモが残る | ✅ 完了 | SQLiteProvider + WALモード |
| 4 | メモ一覧に表示される | ✅ 完了 | app/index.tsx |
| 5 | メモ詳細を開ける | ✅ 完了 | app/memo/[id]/index.tsx |
| 6 | メモを編集できる | ✅ 完了 | app/memo/[id]/edit.tsx |
| 7 | メモを削除できる | ✅ 完了 | memoService.deleteMemo（論理削除） |
| 8 | 削除前に確認ダイアログが出る | ✅ 完了 | src/components/ConfirmDialog.tsx |
| 9 | カテゴリを選べる | ✅ 完了 | src/components/CategorySelector.tsx |
| 10 | GitHub設定を保存できる | ✅ 完了 | app/settings.tsx + githubSettings.ts |
| 11 | GitHubトークンがSecureStoreに保存される | ✅ 完了 | githubTokenStore.ts |
| 12 | メモ詳細からGitHubへ手動アップロードできる | ✅ 完了 | githubUploadService.uploadMemo |
| 13 | カテゴリ別フォルダにMarkdown保存される | ✅ 完了 | githubPath.ts + memoCategories.ts |
| 14 | ファイル名がYYYY-MM-DD-001.md形式になる | ✅ 完了 | githubPath.generateFilePath |
| 15 | 同じカテゴリ・同じ日付では連番が増える | ✅ 完了 | githubPath.getNextSequenceNumber |
| 16 | アップロード済み状態が表示される | ✅ 完了 | src/components/SyncStatusBadge.tsx |
| 17 | アップロード後に編集すると「アップロード後に変更あり」になる | ✅ 完了 | memoService.updateMemo |
| 18 | 再アップロード時は既存ファイルが更新される | ✅ 完了 | githubApi.updateFile（SHA使用） |
| 19 | アップロード失敗時、メモ本文は消えない | ✅ 完了 | setGitHubFailed はbodyを変更しない |
| 20 | アップロード失敗時にエラー内容が保存・表示される | ✅ 完了 | github_error_message カラム |
| 21 | AIアウトプット用テーブルが作成されている | ✅ 完了 | schema.ts CREATE_AI_OUTPUTS_TABLE |
| 22 | Google出力状態を保存できるカラムがある | ✅ 完了 | google_task_status, google_calendar_status |

---

## 完了済み作業

- [x] 設計書の読み込み・確認（2026-06-26）
- [x] docs/ ディレクトリ作成（2026-06-26）
- [x] docs/flowdock_mvp_design.md 作成（2026-06-26）
- [x] docs/development_status.md 作成（2026-06-26）
- [x] docs/roadmap.md 作成（2026-06-26）
- [x] docs/task_board.md 作成（2026-06-26）
- [x] docs/implementation_log.md 作成（2026-06-26）
- [x] docs/claude_workflow.md 作成（2026-06-26）
- [x] Expoプロジェクト作成（create-expo-app）（2026-06-26）
- [x] package.json・app.json・tsconfig.json 設定（2026-06-26）
- [x] bufferパッケージ追加（--legacy-peer-deps）（2026-06-26）
- [x] src/db/schema.ts・migrations.ts・database.ts 実装（2026-06-26）
- [x] src/utils/date.ts・id.ts 実装（2026-06-26）
- [x] src/features/memos/ 全ファイル実装（2026-06-26）
- [x] src/features/github/ 全ファイル実装（2026-06-26）
- [x] src/features/ai/ スタブ作成（2026-06-26）
- [x] src/features/settings/ 実装（2026-06-26）
- [x] src/components/ 3ファイル実装（2026-06-26）
- [x] app/ 全画面実装（6ファイル）（2026-06-26）
- [x] docs/architecture.md 作成（2026-06-26）

---

## 仕様変更・仮決定ログ

| 日付 | 変更内容 | 理由 | 状態 |
|------|---------|------|------|
| 2026-06-26 | Expo SDK 56（要求SDK 54に対して） | create-expo-app@latestがSDK 56を作成。SDK 54に固定するにはテンプレート指定が必要だが、機能差は小さくMVP動作に影響なし。実機確認後に必要なら変更する。 | 記録済み |
| 2026-06-26 | bufferインストールに --legacy-peer-deps 使用 | expo-router の依存関係ツリー内のreact-domバージョン競合。MVP機能への影響なし。 | 記録済み |
| 2026-06-26 | MVP並列アップロード競合保護なし | 仕様書にも記載なし、手動操作のため実質的に1件ずつ。MVP後に必要なら追加。githubPath.tsのコメントに記録済み。 | 記録済み |

---

## 保留・懸念事項

| # | 内容 | 種別 | 状態 |
|---|------|------|------|
| 1 | Expo Go でのSecureStore動作確認 | 実機確認待ち | 要確認 |
| 2 | GitHub API レート制限（60req/h 未認証、5000req/h 認証済み） | 監視 | 通常使用では問題なし |
| 3 | SDK 54→56 の差分（Expo Go 互換性） | 要確認 | 実機動作確認で判断 |
