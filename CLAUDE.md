# CLAUDE.md

MindHub_App（アプリ内部名：FlowDock）で作業するときのルール。

## プロジェクト概要

Expo（React Native + expo-router）製のメモアプリ。

* 既存機能：軽量メモ（memosテーブル、`app/memo/*` 画面）＋ GitHub手動アップロード。スマホ向けに作られた
* 拡張機能：PC用Webアプリとして使うメモ管理機能（notesテーブル、`app/notes/*` 画面）。仕様は `docs/memo-app/` 配下

実行方法：

```bash
npm install
npx expo start --web   # PC用Webアプリとして起動
```

## 作業開始時に必ず読むファイル

1. `CLAUDE.md`（このファイル）
2. `00_START_HERE.md`
3. `current-tasks.md`
4. `docs/worklog/current.md`

## 仕様書の読み分けルール（メモ管理機能）

| 作業内容 | 読むファイル |
|---------|------------|
| 全体方針の確認 | `docs/memo-app/00-overview.md`、`01-decisions-and-scope.md` |
| 機能の実装 | `docs/memo-app/02-features.md`、`08-ui-flow.md` |
| DBを触る | `docs/memo-app/03-data-model.md` |
| カテゴリ・タグ・Git候補 | `docs/memo-app/04-categories-and-tags.md` |
| Markdownテンプレート | `docs/memo-app/05-markdown-templates.md` |
| ChatGPT整理プロンプトコピー | `docs/memo-app/06-chatgpt-prompt-copy.md`、`05-markdown-templates.md` |
| Markdown書き出し・Git候補管理 | `docs/memo-app/07-export-and-git-rules.md`、`03-data-model.md` |
| UIを触る | `docs/memo-app/08-ui-flow.md` |
| カテゴリ・テンプレートDB管理、テンプレート管理画面 | `docs/memo-app/12-template-db-management.md`、`03-data-model.md` |
| スマホ閲覧用HTML/JSONエクスポート | `docs/memo-app/13-mobile-view-export.md`、`07-export-and-git-rules.md` |
| スマホ用プロンプト集HTML、mobile-inbox | `docs/memo-app/14-mobile-prompt-hub-and-inbox.md` |
| 将来候補・不採用方針の確認 | `docs/memo-app/15-future-and-rejected-policies.md` |
| Android APK版・iPhone Web閲覧版・端末別運用 | `docs/memo-app/16-platform-and-distribution.md`、`13-mobile-view-export.md` |
| 配布・共有の区分（自分用・家族用・配布用） | `docs/memo-app/17-distribution-and-sharing.md`、`16-platform-and-distribution.md` |
| JSONエクスポート・インポート（PC⇔Android移行） | `docs/memo-app/18-json-import-export.md`、`03-data-model.md` |
| 実装順の確認 | `docs/memo-app/09-roadmap.md`、`10-tasks.md` |
| 判断に迷った | `docs/memo-app/01-decisions-and-scope.md`、`11-open-issues.md`、`docs/worklog/current.md` |
| 現場適応モード（現場適応・5場面導線・現場プロファイル・守秘） | `docs/memo-app/20-workplace-adaptation-overview.md`〜`23`、`08-ui-flow.md`、`03-data-model.md`、`04-categories-and-tags.md`、`07-export-and-git-rules.md`、`17-distribution-and-sharing.md` |

## 既存機能（FlowDock由来）のドキュメント

既存メモ機能・GitHub連携を触る場合は以下も読む。

* `docs/flowdock_mvp_design.md`（既存機能の仕様基準）
* `docs/architecture.md`（アーキテクチャ解説）
* `docs/development_status.md`（既存機能の達成状況）
* `docs/task_board.md`、`docs/implementation_log.md`、`docs/roadmap.md`
* `docs/claude_workflow.md`（既存機能向けの旧作業ルール。メモ管理機能の作業ではこのCLAUDE.mdを優先）

## 作業終了時に必ず更新するファイル

* `current-tasks.md`
* `docs/worklog/current.md`
* `docs/memo-app/10-tasks.md`

必要に応じて更新する。

* `docs/memo-app/11-open-issues.md`
* `docs/memo-app/09-roadmap.md`
* 既存機能を触った場合は `docs/development_status.md`、`docs/task_board.md`、`docs/implementation_log.md`

## 実装ルール

* 既存機能（memos / `app/memo/*` / GitHub連携）を壊さない。削除しない
* 既存ルーティングを壊さない。新画面は追加のみ
* 既存のUIスタイル（`#2563EB` 基調、カード型、StyleSheet方式）を踏襲する
* DB変更は `src/db/schema.ts` + `src/db/migrations.ts` の schema_version 方式で行う。既存テーブルの破壊的変更はしない
* 破壊的変更が必要な場合は実装せず、確認待ちとして `docs/memo-app/11-open-issues.md` に記録する
* 未確定事項は勝手に決めず `docs/memo-app/11-open-issues.md` に記録する。作業が止まる場合は最小限の仮置きをして、その内容を作業ログにも記録する
* 仕様と実装が食い違う場合は実装を優先し、仕様書またはタスクリストを更新する

## Git運用ルール

* アプリ内からのGit自動push・自動commitは実装しない
* Claude Codeもユーザーの指示なしにcommit / pushしない
* 個人情報を含むメモはGit候補にしない（詳細は `docs/memo-app/07-export-and-git-rules.md`）
