# FlowDock 実装ログ

---

## 2026-06-26｜フェーズ0：設計確認・ドキュメント整備

### 作業内容

FlowDockのMVP開発を始めるにあたり、まず開発管理用ドキュメントを整備した。

### リポジトリ確認結果

- リポジトリ名：MindHub_App
- ブランチ：main
- 初期コミット済み（.gitignore, README.md のみ）
- Expoプロジェクトはまだない
- docs/ ディレクトリはなかった → 新規作成

### 作成ファイル一覧

| ファイル | 内容 |
|---------|------|
| docs/flowdock_mvp_design.md | FlowDock MVP設計書（仕様のフルテキスト） |
| docs/development_status.md | 開発状況・MVP完了条件の達成管理 |
| docs/roadmap.md | MVP／MVP後／将来機能のロードマップ |
| docs/task_board.md | 現在・次・後回し・ブロッカーのタスク管理 |
| docs/implementation_log.md | 本ファイル。作業履歴を追記していく |
| docs/claude_workflow.md | Claude Codeが作業時に守るルール |

### 動作確認

ドキュメント作成のみのため、アプリとしての動作確認はなし。

### 残課題

- Expoプロジェクト作成（フェーズ1）
- ライブラリ選定の確定（フェーズ1前に判断）
  - Expo Router vs React Navigation
  - uuid生成方法
  - expo-sqlite バージョン確認

### 仕様との差分・仮決定事項

なし。設計書の内容をそのままドキュメントに反映した。

---

## 2026-06-26｜フェーズ1〜6：MVP全実装

### 作業内容

Expoプロジェクト作成から画面実装まで、MVPを一気通貫で実装した。

### 変更ファイル（新規作成）

| ファイル | 内容 |
|---------|------|
| package.json | name:flowdock, expo-router/entry, buffer追加 |
| app.json | name:FlowDock, scheme:flowdock, plugins設定 |
| tsconfig.json | strict, @/*パスエイリアス |
| src/db/schema.ts | memos/ai_outputs/settingsテーブルDDL |
| src/db/migrations.ts | schema_version管理・WALモード設定 |
| src/db/database.ts | DB_NAME・runMigrationsの再エクスポート |
| src/utils/date.ts | JST ISO文字列・フォーマット関数 |
| src/utils/id.ts | crypto.randomUUID ラッパー |
| src/features/memos/memoTypes.ts | Memo・GithubStatus型定義 |
| src/features/memos/memoCategories.ts | 6カテゴリ定義 |
| src/features/memos/memoRepository.ts | SQLite CRUD全クエリ |
| src/features/memos/memoService.ts | ビジネスロジック（status連動） |
| src/features/memos/memoMarkdown.ts | front matter付きMarkdown生成 |
| src/features/ai/aiOutputTypes.ts | AIOutput型 |
| src/features/ai/aiOutputRepository.ts | スタブ（MVP後実装） |
| src/features/settings/settingsRepository.ts | key-value SQLite |
| src/features/github/githubTypes.ts | GitHubSettings型等 |
| src/features/github/githubTokenStore.ts | SecureStoreラッパー |
| src/features/github/githubSettings.ts | GitHub設定のSQLite R/W |
| src/features/github/githubApi.ts | GitHub REST APIクライアント |
| src/features/github/githubPath.ts | ファイルパス・連番生成 |
| src/features/github/githubUploadService.ts | アップロードオーケストレーション |
| src/components/CategorySelector.tsx | カテゴリ選択チップUI |
| src/components/SyncStatusBadge.tsx | GitHub状態バッジ |
| src/components/ConfirmDialog.tsx | 削除確認Alert |
| app/_layout.tsx | SQLiteProvider + Stackナビゲーション |
| app/index.tsx | メモ一覧・FABボタン |
| app/settings.tsx | GitHub設定フォーム・token伏せ字 |
| app/memo/create.tsx | メモ作成画面 |
| app/memo/[id]/index.tsx | メモ詳細・アップロードボタン |
| app/memo/[id]/edit.tsx | メモ編集画面 |
| docs/architecture.md | ディレクトリ構成・プログラム流れ解説 |

### 動作確認結果

未実施（次のステップで実機確認）

### 残課題

- `npx expo start` での起動確認
- 実機（またはシミュレーター）での全機能動作確認
- GitHubへの実際のアップロード確認

### 仕様との差分・仮決定事項

| 差分 | 理由 | 影響 |
|------|------|------|
| Expo SDK 56（要求54） | create-expo-app@latestがSDK 56を生成 | Expo Go互換性要確認。機能差は小さい。 |
| bufferインストールに--legacy-peer-deps | react-dom依存競合 | 動作への影響なし |
| MVP並列アップロード競合保護なし | 手動操作のため実質1件ずつ。仕様書にも記載なし | githubPath.tsのコメントに記録済み |

---

## テンプレート（次回以降の追記形式）

```
## YYYY-MM-DD｜フェーズX：作業タイトル

### 作業内容

（何をやったかを簡潔に）

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| src/... | ... |

### 動作確認結果

（確認した内容と結果）

### 残課題

（この作業で解決できなかった課題）

### 仕様との差分・仮決定事項

（設計書と異なる判断をした場合はここに記録。理由も必ず書く）
```
