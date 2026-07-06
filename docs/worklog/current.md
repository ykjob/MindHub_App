# 最新作業ログ

最終更新：2026-07-06

## 今回の目的

追加仕様書（カテゴリ・テンプレートDB管理、スマホ閲覧用HTML/JSONエクスポート、スマホ用プロンプト集HTML、mobile-inbox運用、将来候補・不採用方針）を、既存のメモ管理機能仕様書へ統合する。今回は仕様書・ロードマップ・タスクリスト・作業ログの更新のみで、コード実装は行わない。

## 今回やったこと

* 既存仕様書（docs/memo-app/00〜11）と作業管理ファイルを確認した
* 追加仕様を4ファイルに分割して新規作成した
  * docs/memo-app/12-template-db-management.md（note_categories / note_templates テーブル案、seed方針、DB優先・fallback方針、カテゴリ・テンプレート管理画面、複数テンプレート、初期状態に戻す機能、Codex / Claude Code依頼プロンプトのテンプレート保存）
  * docs/memo-app/13-mobile-view-export.md（docs/mobile-view/ へのHTML/JSON出力、安全条件、公開許可・除外カテゴリ、出力前確認画面、閲覧ページ機能、GitHub Pages / 自分のWebページ方針、手動push運用）
  * docs/memo-app/14-mobile-prompt-hub-and-inbox.md（スマホ用プロンプト集HTML、初期10プロンプト、将来追加候補、mobile-inbox運用）
  * docs/memo-app/15-future-and-rejected-policies.md（将来候補と不採用方針の整理）
* 既存仕様書へ追記した
  * 01-decisions-and-scope.md：追加決定事項（2026-07-06）の節を追加。採用・将来候補・不採用を明記
  * 03-data-model.md：note_categories / note_templates テーブル案、既存notesとの関係、seed方針、fallback方針を追記
  * 05-markdown-templates.md：テンプレートのDB管理移行方針を冒頭に追記
  * 06-chatgpt-prompt-copy.md：DBテンプレート優先・コード固定fallback・プロンプト集HTML再利用の方針を追記
  * 07-export-and-git-rules.md：スマホ閲覧用HTML/JSON出力の条件・確認画面・手動push運用を追記
  * 09-roadmap.md：Phase 8〜11を追加仕様に割り当て、Phase 12を将来拡張として再整理
  * 10-tasks.md：Phase 8〜11のタスクを追加。今回の仕様書整理分を完了扱いにした
  * 11-open-issues.md：追加仕様の確認待ち事項（9〜11章）を追加
* 00_START_HERE.md と CLAUDE.md の「作業内容別に読む仕様書」案内へ新規4ファイルを追加した
* current-tasks.md を更新した

## 既存仕様との食い違いと採用した方針（置き換えの理由）

* 「スマホ確認は当面GitHubアプリで代用する」（00-overview.md / 01-decisions-and-scope.md）
  → 追加仕様のスマホ閲覧用HTML/JSON（13）で置き換え。01-decisions-and-scope.md の該当行を更新した。00-overview.md 本文の全面改稿は今回は見送り、11-open-issues.md に記録した
* カテゴリ・テンプレート・ChatGPT整理プロンプトのコード固定定義（04 / 05 / 06 の前提）
  → DB管理優先＋コード固定定義はseed元・fallbackという位置付けに変更。05 / 06 に方針を追記し、既存のテンプレート・プロンプト本文自体は初期データの元としてそのまま残した
* 旧Phase 8（ダッシュボード化）
  → 追加仕様の優先順位を反映し、Phase 8〜11を追加仕様（DB管理／テンプレート管理画面／スマホ閲覧エクスポート／プロンプト集HTML）に割り当て。ダッシュボードは将来候補（Phase 12、15-future-and-rejected-policies.md）へ移動

## 決まったこと（追加決定事項）

* カテゴリ・テンプレートDB管理（note_categories / note_templates）
* テンプレート管理画面・カテゴリ管理画面
* カテゴリごとの複数テンプレート
* 初期状態に戻す機能（既存メモ本文は変更しない）
* Codex / Claude Code依頼プロンプトのテンプレート保存
* スマホ閲覧用HTML/JSON出力（安全なメモのみ。出力前確認画面あり）
* スマホ閲覧ページの検索・絞り込み・簡易Markdown表示・コピーボタン
* スマホ用プロンプト集HTML（初期10プロンプト）
* mobile-inbox運用（初期は保存場所を作らずChatGPT送信で代用）
* GitHub Pages / 将来自分のWebページ配置
* 自動pushはしない。手動push運用

## 変更したファイル

新規：

* docs/memo-app/12-template-db-management.md
* docs/memo-app/13-mobile-view-export.md
* docs/memo-app/14-mobile-prompt-hub-and-inbox.md
* docs/memo-app/15-future-and-rejected-policies.md

変更（すべてドキュメントのみ）：

* CLAUDE.md、00_START_HERE.md、current-tasks.md、docs/worklog/current.md
* docs/memo-app/01-decisions-and-scope.md
* docs/memo-app/03-data-model.md
* docs/memo-app/05-markdown-templates.md
* docs/memo-app/06-chatgpt-prompt-copy.md
* docs/memo-app/07-export-and-git-rules.md
* docs/memo-app/09-roadmap.md
* docs/memo-app/10-tasks.md
* docs/memo-app/11-open-issues.md

コード（app/ / src/ / scripts/ / package.json等）は一切変更していない。

## 未完了事項・確認待ち

* Phase 8〜11の実装（未着手。着手判断待ち）
* note_categories / note_templates の実装タイミング、既存コード固定定義との移行方法（11-open-issues.md 9章）
* スマホ閲覧HTMLの生成方式、notes-data.json形式、GitHub Pages配置方法、リポジトリ公開可否（11-open-issues.md 10章）
* 前回からの持ち越し：ブラウザでの手動動作確認、Web版DBファイルへのアクセス手段

## 次にやること

1. ブラウザで動作確認する（`npx expo start --web`）
2. 問題なければユーザー判断でcommit
3. Phase 8（カテゴリ・テンプレートDB管理）の着手判断

## 次回最初に読むファイル

* CLAUDE.md
* 00_START_HERE.md
* current-tasks.md
* docs/worklog/current.md
* docs/memo-app/09-roadmap.md
* docs/memo-app/10-tasks.md
* docs/memo-app/11-open-issues.md

## 注意点

* commit / pushはしていない（ユーザー確認待ち）
* 既存機能（memos / GitHub連携）は削除・変更していない
* 個人情報を含むメモはGit候補にしない

---

# 過去ログ（2026-07-03）

## 今回の目的

分割仕様書（docs/memo-app/）に沿って、MindHub_AppにPC用Webアプリとして使えるメモ管理機能を一括実装する（通常の段階的実装ではなく一括実装の実験）。

## 今回やったこと

* 既存構成を確認した（Expo SDK 56 / expo-router / expo-sqlite。既存の軽量メモ機能とGitHub連携あり。アプリ内部名はFlowDock）
* 分割仕様書をdocs/memo-app/00〜11として配置した
* CLAUDE.md / 00_START_HERE.md / current-tasks.md を新規作成した（既存docs/claude_workflow.md等は残し、CLAUDE.mdから参照する形で統合）
* notesテーブルを追加した（schema_version 2。既存memos/ai_outputs/settingsテーブルは無変更）
* /notes系画面（一覧・作成・詳細・編集）を追加した
* カテゴリ10種、プロジェクト自由入力＋候補、タグ自由入力＋候補、source、visibility、Git候補フラグを実装した
* カテゴリごとのGit候補初期値を実装した（フラグ手動変更後はカテゴリ変更に追従しない）
* Markdownプレビューを実装した
* ChatGPT整理プロンプトコピーを全10カテゴリ分実装した
* 検索（title/body/project/tags/type）・絞り込み（プロジェクト/カテゴリ/タグ/Git候補のみ/アーカイブ表示切替）・並び替え（更新日順/作成日順）を実装した
* Markdown書き出し（ブラウザダウンロード方式）とexport_dir/export_filename/export_path/exported_at記録を実装した
* scripts/export_git_notes.py（一括書き出しの土台）を作成した
* Web実行対応：react-native-web / react-dom / @expo/metro-runtime を導入し、expo-sqlite Web用のmetro.config.jsを追加した
* 既存ホーム画面ヘッダーに「メモ管理」ボタンを追加した（既存画面への変更はこれと_layoutへの画面タイトル追加のみ）

## 決まったこと（実装時の仮置き含む）

* 既存memosテーブルは触らず、notesテーブルを並列追加する
* Markdownプレビューは外部ライブラリを追加せず自作の軽量レンダラーにする。理由：react-native-markdown-display等はメンテ停滞でReact 19 / RN 0.85との互換リスクがあるため。仕様が求める記法（見出し・リスト・コードブロック・区切り線・強調・リンク）は自作でカバーできる
* Markdown書き出しはWebの制約（任意フォルダへ直接書き込めない）により、ブラウザダウンロード＋推奨パス表示＋手動配置の運用にする
* クリップボードはnavigator.clipboard（Web）のみ対応。ネイティブは将来expo-clipboard導入で対応
* RN WebのAlert.alertは複数ボタン非対応のため、Webではwindow.confirm/window.alertを使うユーティリティ（src/utils/dialog.ts）を追加

## 変更したファイル

変更：

* app/_layout.tsx（notes系画面のタイトル登録）
* app/index.tsx（ヘッダーに「メモ管理」ボタン追加）
* src/db/schema.ts（CREATE_NOTES_TABLE追加、SCHEMA_VERSION=2）
* src/db/migrations.ts（v2マイグレーション追加）
* tsconfig.json（TypeScript 6のbaseUrl非推奨エラー回避のためignoreDeprecations追加。includeはexpoが自動更新）
* package.json / package-lock.json（react-native-web / react-dom / @expo/metro-runtime追加）

新規：

* CLAUDE.md、00_START_HERE.md、current-tasks.md
* docs/memo-app/00〜11（12ファイル）
* docs/worklog/current.md
* metro.config.js
* scripts/export_git_notes.py
* app/notes/index.tsx、app/notes/create.tsx、app/notes/[id]/index.tsx、app/notes/[id]/edit.tsx
* src/features/notes/noteTypes.ts、noteCategories.ts、noteRepository.ts、noteService.ts、noteExport.ts、chatgptPrompts.ts
* src/components/MarkdownPreview.tsx、NoteForm.tsx
* src/utils/clipboard.ts、dialog.ts

## 確認したこと

* `npx tsc --noEmit` がエラーなしで通る
* `npx expo start --web` でMetroが起動し、Webバンドル（962モジュール）がエラーなしでビルドされる
* バンドルにnotes系コードが含まれている

## 未完了事項

* ブラウザでの手動動作確認（メモ作成〜アーカイブ、プロンプトコピー、Markdown書き出し）。バンドルビルドまでは確認済みだが、ブラウザ実操作は未実施
* Web版DB（ブラウザ内OPFS）へのPythonスクリプトアクセス手段（Phase 7残タスク）
* 既存設定画面（GitHub連携）はexpo-secure-store依存のため、Web実行時の動作は未確認（既存機能。コードは無変更）
