# 最新作業ログ

最終更新：2026-07-03

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

## 次にやること

1. ブラウザで動作確認する（`npx expo start --web`）
2. 問題なければユーザー判断でcommit
3. Phase 8（ダッシュボード化）の着手判断

## 次回最初に読むファイル

* CLAUDE.md
* 00_START_HERE.md
* current-tasks.md
* docs/worklog/current.md
* docs/memo-app/10-tasks.md
* docs/memo-app/11-open-issues.md

## 注意点

* commit / pushはしていない（ユーザー確認待ち）
* 既存機能（memos / GitHub連携）は削除・変更していない
* 個人情報を含むメモはGit候補にしない
