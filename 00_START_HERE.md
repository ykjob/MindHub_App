# 作業開始時に最初に読むファイル

## 1. このプロジェクトでやること

MindHub_App（アプリ全体名：MindHub）をベースに、PC用Webアプリとして使えるメモ管理機能を拡張する。

名称方針：MindHub＝アプリ全体名（思考メモ・作業ログ・AI活用・プロンプト集・現場適応モードのハブ）、FlowDock＝初期からある軽量メモ機能（`/memo` 系）の説明名。詳細は `docs/memo-app/01-decisions-and-scope.md` §1.6 を参照。

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

* docs/memo-app/08-ui-flow.md（画面構成の横断正本）
* docs/memo-app/28-ui-ux-quality-improvement.md（Phase 15の画面別改善・情報設計の正本）
* docs/memo-app/29-ui-design-system.md（共通UI基盤の正本）

UI・UX改善（Phase 15）を扱う場合。

* docs/memo-app/28-ui-ux-quality-improvement.md

共通UI（色・余白・文字・角丸・ヘッダー・共通部品・状態表示・アクセシビリティ）を扱う場合。

* docs/memo-app/29-ui-design-system.md

UI検証（Web・Android・幅別・状態別・回帰・合格判定）を行う場合。

* docs/memo-app/30-ui-validation-checklist.md
* docs/memo-app/16-platform-and-distribution.md（APKの作成・配布・導入は16、作成済みAPKでのUI検証は30）

カテゴリ・テンプレートDB管理、テンプレート管理画面を触る場合。

* docs/memo-app/12-template-db-management.md
* docs/memo-app/03-data-model.md

スマホ閲覧用HTML/JSONエクスポート、出力対象確認画面を触る場合。

* docs/memo-app/13-mobile-view-export.md
* docs/memo-app/07-export-and-git-rules.md

スマホ用プロンプト集HTML、mobile-inbox運用を触る場合。

* docs/memo-app/14-mobile-prompt-hub-and-inbox.md

将来候補・不採用方針を確認する場合。

* docs/memo-app/15-future-and-rejected-policies.md
* docs/memo-app/01-decisions-and-scope.md

Android APK版ビルド・iPhone Web閲覧版・端末別運用を触る場合。

* docs/memo-app/16-platform-and-distribution.md
* docs/memo-app/13-mobile-view-export.md

配布・共有の区分（自分用・家族用・配布用）を確認する場合。

* docs/memo-app/17-distribution-and-sharing.md
* docs/memo-app/16-platform-and-distribution.md

JSONエクスポート・インポート（PC⇔Android移行）を触る場合。

* docs/memo-app/18-json-import-export.md
* docs/memo-app/03-data-model.md

実装順を確認する場合。

* docs/memo-app/09-roadmap.md
* docs/memo-app/10-tasks.md

判断に迷った場合。

* docs/memo-app/01-decisions-and-scope.md
* docs/memo-app/11-open-issues.md
* docs/worklog/current.md

現場適応モード（作業開始・詰まり・質問・報告・終業前の導線）を触る場合。

* docs/memo-app/20-workplace-adaptation-overview.md
* docs/memo-app/21-workplace-adaptation-flows-and-ui.md
* docs/memo-app/22-workplace-adaptation-data-and-integration.md
* docs/memo-app/23-workplace-adaptation-security-and-portfolio.md

Phase 16（未着手。文書のみ承認済み・実装前）を触る場合。

* さくっとメモ入力・ホーム操作性（Phase 16A）：docs/memo-app/31-quick-memo-usability-improvement.md
* 質問タイミング判断支援（Phase 16B）：docs/memo-app/32-workplace-question-timing-rules.md ＋ docs/memo-app/20〜23
* コピー・外部共有（Phase 16C）：docs/memo-app/33-external-handoff-and-sharing.md ＋ docs/memo-app/06-chatgpt-prompt-copy.md ＋ docs/memo-app/23-workplace-adaptation-security-and-portfolio.md

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
