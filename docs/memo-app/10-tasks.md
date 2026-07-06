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

## 10. Phase 8：カテゴリ・テンプレートDB管理（2026-07-06 追加仕様）

旧Phase 8（ダッシュボード化）は将来候補へ移動した（本ファイル末尾および `15-future-and-rejected-policies.md` 参照）。

仕様書整理（今回完了分）。

* [x] 追加仕様書4ファイル作成（12〜15）
* [x] 既存仕様書への参照・要約追記（01 / 03 / 05 / 06 / 07 / 09 / 10 / 11、00_START_HERE.md）
* [x] 将来候補・不採用方針整理（15-future-and-rejected-policies.md）
* [x] mobile-inbox運用整理（14-mobile-prompt-hub-and-inbox.md）

実装タスク（未着手。実装タイミングは確認待ち）。

* [ ] note_categoriesテーブル設計
* [ ] note_templatesテーブル設計
* [ ] 既存10カテゴリseed方針整理（seedデータ作成）
* [ ] schema_versionマイグレーション設計
* [ ] DB優先・コード固定定義fallback実装
* [ ] 既存コード固定定義（noteCategories.ts / chatgptPrompts.ts）からの移行方法確定

## 11. Phase 9：テンプレート管理画面

* [ ] カテゴリ管理画面設計
* [ ] テンプレート管理画面設計
* [ ] 複数テンプレート設計（カテゴリごとのデフォルト指定含む）
* [ ] 初期状態に戻す仕様（カテゴリ単位・テンプレート単位・全体）
* [ ] Codex / Claude Code依頼プロンプトテンプレートの初期候補整備

## 12. Phase 10：スマホ閲覧用HTML/JSONエクスポート

* [ ] スマホ閲覧用HTML/JSON設計（docs/mobile-view/ index.html / notes-data.json）
* [ ] notes-data.jsonの形式設計
* [ ] スマホ閲覧対象条件設計（安全条件・公開許可カテゴリ）
* [ ] 出力対象確認画面設計
* [ ] スマホ閲覧HTMLの検索・絞り込み設計
* [ ] 簡易Markdown表示設計
* [ ] コピーボタン設計（本文・コマンド・ChatGPT用・Gemini用・Googleタスク用）
* [ ] 手動push運用手順の整理

## 13. Phase 11：スマホ用プロンプト集HTML

* [ ] スマホ用プロンプト集HTML設計
* [ ] 初期10プロンプト本文作成

## 14. 将来候補（旧Phase 8ダッシュボード含む）

将来候補・不採用の詳細は `15-future-and-rejected-policies.md` を参照。

* [ ] 最近更新したメモ表示（旧Phase 8）
* [ ] プロジェクト別最新メモ表示（旧Phase 8）
* [ ] Git候補一覧（旧Phase 8）
* [ ] 未整理メモ一覧（旧Phase 8）
* [ ] 次回再開メモ一覧（旧Phase 8）
