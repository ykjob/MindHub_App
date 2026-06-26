# FlowDock タスクボード

最終更新：2026-06-26

---

## 現在やっていること

**MVP実装完了。次のステップは実機での動作確認。**

---

## 次にやること（MVP動作確認）

- [ ] `npx expo start` でExpo Goサーバー起動
- [ ] 実機またはシミュレーターでの起動確認
- [ ] メモ作成・一覧表示・詳細・編集・削除の動作確認
- [ ] カテゴリ選択の動作確認
- [ ] GitHub設定（owner/repo/branch/token）の保存確認
- [ ] GitHubアップロード実動作確認（実際のリポジトリへ）
- [ ] アップロード後のステータス変化確認
- [ ] 編集後のmodified_after_upload状態確認
- [ ] 再アップロードでのファイル更新確認（SHAを使ったUPDATE）
- [ ] アップロード失敗時のエラー表示確認
- [ ] MVP完了条件22項目のチェック

---

## 完了済みタスク

### フェーズ0：設計確認・ドキュメント整備
- [x] 設計書を読む
- [x] docs/ ディレクトリ作成
- [x] 管理ドキュメント群の初期作成（6ファイル）

### フェーズ1：Expo初期構成
- [x] Expoプロジェクト作成（create-expo-app）
- [x] Expo Router 設定（app.json plugins）
- [x] tsconfig.json 設定（strict, paths @/*）
- [x] package.json 設定（name: flowdock, main: expo-router/entry）
- [x] bufferパッケージ追加

### フェーズ2：SQLite保存
- [x] src/db/schema.ts 作成（DDL定義）
- [x] src/db/migrations.ts 作成（schema_version管理）
- [x] src/db/database.ts 作成（再エクスポート）
- [x] src/utils/date.ts 作成（JST ISO文字列）
- [x] src/utils/id.ts 作成（crypto.randomUUID）
- [x] src/features/memos/memoTypes.ts 作成
- [x] src/features/memos/memoRepository.ts 作成（CRUD）
- [x] src/features/memos/memoService.ts 作成
- [x] src/features/ai/aiOutputTypes.ts 作成
- [x] src/features/ai/aiOutputRepository.ts スタブ作成
- [x] src/features/settings/settingsRepository.ts 作成

### フェーズ3：カテゴリと状態表示
- [x] src/features/memos/memoCategories.ts 作成（6カテゴリ）
- [x] src/components/CategorySelector.tsx 作成
- [x] src/components/SyncStatusBadge.tsx 作成

### フェーズ4：GitHub設定
- [x] src/features/github/githubTokenStore.ts 作成（SecureStore）
- [x] src/features/github/githubSettings.ts 作成
- [x] app/settings.tsx 実装（token伏せ字表示）

### フェーズ5：GitHub手動アップロード
- [x] src/features/github/githubTypes.ts 作成
- [x] src/features/github/githubApi.ts 作成（fetch使用）
- [x] src/features/github/githubPath.ts 作成（連番採番）
- [x] src/features/memos/memoMarkdown.ts 作成（front matter）
- [x] src/features/github/githubUploadService.ts 作成

### フェーズ6：MVP仕上げ
- [x] src/components/ConfirmDialog.tsx 作成
- [x] app/_layout.tsx 実装（SQLiteProvider + Stack）
- [x] app/index.tsx 実装（一覧・FAB・useFocusEffect）
- [x] app/memo/create.tsx 実装
- [x] app/memo/[id]/index.tsx 実装（詳細・アップロードボタン）
- [x] app/memo/[id]/edit.tsx 実装
- [x] docs/architecture.md 作成（ディレクトリ構成・流れ解説）
- [x] docs管理ファイル更新（development_status・task_board・implementation_log）

---

## 後回しタスク（MVP後）

- [ ] Markdownプレビュー（app/memo/[id]/index.tsx に追加）
- [ ] AI整理機能（Claude API連携）
- [ ] Googleタスク出力
- [ ] Googleカレンダー出力
- [ ] 設計書生成機能
- [ ] プロンプト生成機能
- [ ] 全文検索
- [ ] タグ機能
- [ ] 複数端末同期
- [ ] 自動バックアップ
- [ ] 並列アップロード競合保護
- [ ] テスト自動化

---

## 既知のブロッカー・注意事項

| # | 内容 | 影響範囲 | 対処方針 |
|---|------|---------|---------|
| 1 | SDK 56（要求54）で作成された | Expo Go互換性 | 実機確認で問題なければ継続 |
| 2 | buffer --legacy-peer-deps で追加 | react-dom依存競合 | 動作に影響なし |
