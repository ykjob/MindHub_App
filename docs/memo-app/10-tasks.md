# タスクリスト

## 1. タスク状態

タスクは以下の状態で管理する。

* 未着手
* 進行中
* 完了
* 保留
* 確認待ち
* 後回し

## 2. Phase 0：仕様書・管理ファイル整備

* [x] 既存MindHub_App構成確認
* [x] CLAUDE.md確認（存在せず、新規作成）
* [x] CLAUDE.md作成または更新
* [x] 00_START_HERE.md作成
* [x] current-tasks.md作成
* [x] docs/worklog/current.md作成
* [x] docs/memo-app/00-overview.md作成
* [x] docs/memo-app/01-decisions-and-scope.md作成
* [x] docs/memo-app/02-features.md作成
* [x] docs/memo-app/03-data-model.md作成
* [x] docs/memo-app/04-categories-and-tags.md作成
* [x] docs/memo-app/05-markdown-templates.md作成
* [x] docs/memo-app/06-chatgpt-prompt-copy.md作成
* [x] docs/memo-app/07-export-and-git-rules.md作成
* [x] docs/memo-app/08-ui-flow.md作成
* [x] docs/memo-app/09-roadmap.md作成
* [x] docs/memo-app/10-tasks.md作成
* [x] docs/memo-app/11-open-issues.md作成

## 3. Phase 1：SQLite保存・基本CRUD

* [x] SQLite導入方法確認（既存expo-sqliteを利用）
* [x] notesテーブル設計確認
* [x] notesテーブル作成（schema v2マイグレーション）
* [x] メモ作成画面作成（/notes/create）
* [x] メモ保存処理実装
* [x] メモ一覧表示（/notes）
* [x] メモ詳細表示（/notes/[id]）
* [x] メモ編集処理（/notes/[id]/edit）
* [x] archived_atによるアーカイブ処理
* [ ] 基本動作確認（ブラウザでの手動確認は未実施。確認待ち）

## 4. Phase 2：分類機能

* [x] カテゴリ選択実装
* [x] プロジェクト自由入力実装
* [x] 過去プロジェクト候補表示
* [x] タグ入力実装
* [x] 過去タグ候補表示
* [x] Git候補フラグ実装
* [x] visibility実装
* [x] カテゴリごとのGit候補初期値実装

## 5. Phase 3：Markdownプレビュー

* [x] Markdownプレビューライブラリ確認（自作軽量レンダラーを採用。理由は11-open-issues.md参照）
* [x] Markdown表示実装
* [x] 編集とプレビュー切り替え
* [x] コードブロック表示確認
* [ ] ChatGPT整理結果の表示確認（実データでの確認待ち）

## 6. Phase 4：ChatGPT整理プロンプトコピー

* [x] プロンプトテンプレート定義（全10カテゴリ）
* [x] カテゴリ別プロンプト取得処理
* [x] クリップボードコピー処理
* [x] コピー完了メッセージ
* [x] 初期5カテゴリ対応（＋残り5カテゴリも対応済み）
* [ ] 動作確認（ブラウザでの手動確認は未実施。確認待ち）

## 7. Phase 5：検索・絞り込み

* [x] キーワード検索
* [x] プロジェクト絞り込み
* [x] カテゴリ絞り込み
* [x] タグ絞り込み
* [x] Git候補のみ表示
* [x] アーカイブ除外（表示切り替え）
* [x] 並び替え（更新日順・作成日順）

## 8. Phase 6：Markdown書き出し

* [x] 出力先ルール実装（docs/notes/{project}/{date}_{type}_{slug}.md）
* [x] slug生成処理
* [x] メモ単体書き出し（ブラウザダウンロード方式。制約は11-open-issues.md参照）
* [x] 保存先フォルダ指定方法確認（Web制約により推奨パス表示＋手動配置運用）
* [x] export_path保存
* [x] exported_at保存
* [x] 書き出し後の確認表示

## 9. Phase 7：Git候補一括書き出しスクリプト

* [x] スクリプト方針確認
* [x] Git候補メモ取得
* [x] dry-run対応
* [x] project指定
* [x] type指定
* [x] 一括Markdown出力
* [x] 対象ファイル一覧表示
* [ ] Web版DBファイルへのアクセス手段確立（未確定事項。11-open-issues.md参照）

## 10. Phase 8：ダッシュボード化

* [ ] 最近更新したメモ表示
* [ ] プロジェクト別最新メモ表示
* [ ] Git候補一覧
* [ ] 未整理メモ一覧
* [ ] 次回再開メモ一覧
