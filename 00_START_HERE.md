# 作業開始時に最初に読むファイル

## 1. このプロジェクトでやること

MindHub_App（アプリ内部名：FlowDock）をベースに、PC用Webアプリとして使えるメモ管理機能を拡張する。

目的は、ChatGPT整理結果、Claude Code用プロンプト、開発作業ログ、調査メモ、コマンド手順、就活メモ、普段の思考メモを、保存・分類・検索・Markdown書き出しできるようにすること。

既存のスマホ向け軽量メモ機能（`app/memo/*`）はそのまま残し、新機能は `app/notes/*` として追加している。

## 2. 作業開始時に必ず読むファイル

* CLAUDE.md
* 00_START_HERE.md
* current-tasks.md
* docs/worklog/current.md

## 3. 作業内容別に読む仕様書

全体方針を確認する場合。

* docs/memo-app/00-overview.md
* docs/memo-app/01-decisions-and-scope.md

機能を実装する場合。

* docs/memo-app/02-features.md
* docs/memo-app/08-ui-flow.md

DBを触る場合。

* docs/memo-app/03-data-model.md

カテゴリ、タグ、Git候補を触る場合。

* docs/memo-app/04-categories-and-tags.md

Markdownテンプレートを触る場合。

* docs/memo-app/05-markdown-templates.md

ChatGPT整理プロンプトコピー機能を触る場合。

* docs/memo-app/06-chatgpt-prompt-copy.md
* docs/memo-app/05-markdown-templates.md

Markdown書き出しやGit候補管理を触る場合。

* docs/memo-app/07-export-and-git-rules.md
* docs/memo-app/03-data-model.md

UIを触る場合。

* docs/memo-app/08-ui-flow.md

実装順を確認する場合。

* docs/memo-app/09-roadmap.md
* docs/memo-app/10-tasks.md

判断に迷った場合。

* docs/memo-app/01-decisions-and-scope.md
* docs/memo-app/11-open-issues.md
* docs/worklog/current.md

既存機能（memos / GitHub連携）を触る場合。

* docs/flowdock_mvp_design.md
* docs/architecture.md
* docs/development_status.md

## 4. 作業終了時に更新するファイル

* current-tasks.md
* docs/worklog/current.md
* docs/memo-app/10-tasks.md

必要に応じて更新する。

* docs/memo-app/11-open-issues.md
* docs/memo-app/09-roadmap.md
