# 未確定事項

## 1. 技術構成

確認結果（2026-07-03 実装時確認）。

* MindHub_App（リポジトリ名。アプリ内部名は FlowDock）は Expo SDK 56 / React Native 0.85 / expo-router 構成
* ルーティングは expo-router（ファイルベース）
* 既存保存方式は expo-sqlite（`flowdock.db`、memos / ai_outputs / settings テーブル、schema_version=1）
* 既存メモ機能あり（body + category のみの軽量メモ、GitHub手動アップロード連携付き）
* PC用Webアプリとしては `npx expo start --web`（react-native-web）で動かす

## 2. SQLite導入

決定（実装時仮置き）。

* 既存の expo-sqlite をそのまま使う
* マイグレーションは settings テーブルの schema_version 方式を踏襲し、v2 で notes テーブルを追加
* DBファイルは既存と同じ `flowdock.db`（Webでは OPFS / IndexedDB 上に保存される）

未確定。

* Web実行時のDB実体はブラウザ内ストレージにあり、PythonスクリプトやエクスプローラーからDBファイルへ直接アクセスできない。一括書き出しスクリプト（Phase 7）をWeb版DBに対してどう動かすかは未確定（案：アプリ側にDBエクスポート機能を追加する / ネイティブ実行時のDBファイルを対象にする）

## 3. Markdownプレビュー

決定（実装時仮置き）。

* 外部Markdownライブラリは追加せず、自作の軽量レンダラー（見出し・箇条書き・番号付きリスト・コードブロック・区切り線・強調・リンク対応）で実装
* 理由：react-native-markdown-display 等はメンテが停滞しており React 19 / RN 0.85 との互換リスクがあるため。将来必要になれば置き換え可能なコンポーネント境界にしてある

未確定。

* テーブル・画像などの拡張記法への対応要否

## 4. ファイル書き出し

決定（実装時仮置き）。

* Webアプリではセキュリティ制約上、任意フォルダへの直接書き込みができない
* 代替案として、ブラウザのダウンロード機能でMarkdownファイルをダウンロードする方式を採用
* 推奨出力先パス `docs/notes/{project}/{date}_{type}_{slug}.md` は画面に表示し、`export_dir` / `export_filename` / `export_path` / `exported_at` としてDBに記録する
* ユーザーはダウンロードしたファイルを表示されたパスへ手動配置する運用

未確定。

* File System Access API（Chromium系のみ対応）でフォルダ指定書き出しに対応するか
* 将来的にデスクトップアプリ化（Tauri / Electron）するか

## 5. Git候補一括書き出し

現状。

* `scripts/export_git_notes.py` の土台を作成済み（--db でSQLiteファイルパスを指定する前提、--dry-run / --only-git-candidates / --project / --type 対応）
* ただし上記2の通り、Web実行時のDBファイルにPythonから直接アクセスできないため、実運用にはDBファイルの取り出し手段が必要（Phase 7未完了タスク）

## 6. 推奨タグ

決定（実装時仮置き）。

* 初期実装では手動入力＋過去タグ候補表示のみ
* 本文からの自動抽出は行わない

## 7. ダッシュボード

現状。

* 初期実装ではダッシュボードは作らず、notes一覧（検索・絞り込み付き）を入口とする
* Phase 8で対応

## 8. MindHub_App既存機能との統合

決定（実装時仮置き）。

* 既存メモ機能（memos テーブル / `/memo/*` 画面 / GitHubアップロード）は一切変更せず残す
* 新メモ管理機能は notes テーブル / `/notes/*` 画面として並列に追加
* ホーム画面（既存メモ一覧）のヘッダーに「ノート」ボタンを追加して導線とする（既存機能への変更はこのボタン追加のみ）

未確定。

* 既存memosデータをnotesへ移行・統合するか
* 将来的に既存メモ機能を廃止してnotesに一本化するか

## 9. カテゴリ・テンプレートDB管理（2026-07-06 追加仕様。確認待ち）

* note_categories / note_templates の実装タイミング（schema v3としていつマイグレーションするか）
* 既存コード固定カテゴリ定義（src/features/notes/noteCategories.ts、chatgptPrompts.ts）との移行方法（seed後にコード定義をfallback専用に縮小するか、当面二重管理するか）
* テンプレート管理画面の画面構成（設定画面をどこに置くか。既存 /notes 配下か新規 /settings 配下か）
* note_templatesのprompt_bodyとtemplate_bodyを1レコードで持つか分離するか（追加仕様は1レコード案）

## 10. スマホ閲覧用HTML/JSON（2026-07-06 追加仕様。確認待ち）

* スマホ閲覧HTMLの生成方式（アプリ内でHTML文字列を組み立ててダウンロードするか、テンプレートHTML＋JSON読み込み方式にするか）
* notes-data.jsonの具体的な形式（フィールド構成、Markdown本文をそのまま入れるか）
* Web版DB（ブラウザ内OPFS）からの出力手段（既存Phase 7のDBアクセス問題と共通）
* GitHub Pagesへの配置方法（リポジトリのPages設定、docs/配下公開の可否。※このリポジトリを公開するかどうか自体の確認が必要）
* 自分のWebページへ移す場合の構成
* private情報を扱う将来案（就活終了後に検討。認証方法など）

## 11. その他（2026-07-06 追加仕様。確認待ち）

* Supabase同期を検討するタイミング（検討条件は 15-future-and-rejected-policies.md 参照）
* 既存00-overview.mdの「スマホ確認はGitHubアプリで代用」記述は、13-mobile-view-export.mdの方針で置き換え済み（01-decisions-and-scope.mdに反映）。00-overview.md本文の全面改稿は今回見送り
