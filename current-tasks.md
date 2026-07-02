# Current Tasks

## 現在のフェーズ

Phase 0〜7 一括実装完了（実験的一括実装）→ 動作確認・レビュー待ち

## 現在の目的

MindHub_Appのメモ管理機能拡張を、仕様書（docs/memo-app/）に沿って一括実装した。
ユーザーによる実機（ブラウザ）確認と、commit判断待ち。

## 完了したこと

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

## 次にやること

1. `npx expo start --web` でブラウザ動作確認（メモ作成→一覧→詳細→編集→アーカイブ）
2. ChatGPT整理プロンプトコピーとMarkdown書き出しの実動確認
3. 問題なければcommit（ユーザー判断）
4. Phase 8（ダッシュボード化）の着手判断

## 未完了事項

* ブラウザでの手動動作確認（起動とバンドルのコンパイルまでは確認済み）
* Web版DBファイルへのPythonスクリプトアクセス手段（Phase 7残タスク）

## 確認待ち

* 既存memosデータをnotesへ統合するか（docs/memo-app/11-open-issues.md 参照）
* File System Access APIによるフォルダ指定書き出し対応の要否

## 後回し

* スマホ対応
* クラウド同期
* OpenAI API連携
* ChatGPT共有受け取り
* アプリ内Git push
* Phase 8 ダッシュボード化
