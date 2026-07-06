# Current Tasks

## 現在のフェーズ

* Phase 0〜7 一括実装完了（実験的一括実装）→ 動作確認・レビュー待ち
* 追加仕様（カテゴリ・テンプレートDB管理／スマホ閲覧用HTML/JSON等）の仕様書統合完了（2026-07-06）→ Phase 8以降の実装は未着手・着手判断待ち

## 現在の目的

MindHub_Appのメモ管理機能拡張について、

1. Phase 0〜7実装分のユーザーによる実機（ブラウザ）確認と、commit判断待ち
2. 追加仕様（docs/memo-app/12〜15）の実装着手判断待ち

## 完了したこと

### Phase 0〜7（2026-07-03）

* 分割仕様書の配置（docs/memo-app/00〜11）
* CLAUDE.md / 00_START_HERE.md / current-tasks.md / docs/worklog/current.md 整備
* notesテーブル追加（schema v2、既存memosテーブルは無変更）
* メモ作成・一覧・詳細・編集・アーカイブ（/notes 系画面）
* カテゴリ（10種）・プロジェクト・タグ・source・visibility・Git候補フラグ
* Markdownプレビュー（自作軽量レンダラー）
* ChatGPT整理プロンプトコピー（全10カテゴリ）
* 検索・絞り込み・並び替え
* Markdown書き出し（ブラウザダウンロード方式＋export_path/exported_at記録）
* scripts/export_git_notes.py 土台
* Web実行対応（react-native-web導入、metro.config.js）

### 追加仕様の仕様書統合（2026-07-06）

* 追加仕様書4ファイル作成（docs/memo-app/12〜15）
* 既存仕様書への追記（01 / 03 / 05 / 06 / 07 / 09 / 10 / 11、00_START_HERE.md、CLAUDE.md）
* ロードマップ再整理（Phase 8〜11を追加仕様に割り当て、旧Phase 8ダッシュボードは将来候補へ）
* 実装は未着手（仕様書のみ）

## 次にやること

1. `npx expo start --web` でブラウザ動作確認（メモ作成→一覧→詳細→編集→アーカイブ）
2. ChatGPT整理プロンプトコピーとMarkdown書き出しの実動確認
3. 問題なければcommit（ユーザー判断）
4. Phase 8（カテゴリ・テンプレートDB管理）の着手判断（ユーザー判断）

## 未完了事項

* ブラウザでの手動動作確認（起動とバンドルのコンパイルまでは確認済み）
* Web版DBファイルへのPythonスクリプトアクセス手段（Phase 7残タスク。スマホ閲覧用HTML/JSON出力とも共通の課題）
* Phase 8〜11（追加仕様）の実装

## 確認待ち

* 既存memosデータをnotesへ統合するか（docs/memo-app/11-open-issues.md 参照）
* File System Access APIによるフォルダ指定書き出し対応の要否
* note_categories / note_templates の実装タイミング（11-open-issues.md 9章）
* スマホ閲覧HTMLの生成方式・notes-data.json形式・GitHub Pages配置方法（11-open-issues.md 10章）

## 後回し・将来候補（詳細：docs/memo-app/15-future-and-rejected-policies.md）

* スマホ対応（アプリとして）
* クラウド同期・Supabase同期
* OpenAI API連携
* ChatGPT共有受け取り
* ダッシュボード化（旧Phase 8）
* ワンコマンド更新スクリプト
* カテゴリ自由追加、テンプレートのエクスポート・インポート
* mobile-inboxのGitHub連携

## 不採用（詳細：docs/memo-app/15-future-and-rejected-policies.md）

* アプリ内GitHub自動push
* Codexによる日常的なスマホ入力取り込み
* スマホからSQLite直接共有
