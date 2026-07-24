# AGENTS.md

MindHub_App（アプリ全体名：MindHub）で作業するときのルール。

## プロジェクト概要

Expo（React Native + expo-router）製のメモアプリ。

* 既存機能：軽量メモ（memosテーブル、`app/memo/*` 画面）＋ GitHub手動アップロード。スマホ向けに作られた
* 拡張機能：PC用Webアプリとして使うメモ管理機能（notesテーブル、`app/notes/*` 画面）。仕様は `docs/memo-app/` 配下

名称方針（詳細は `docs/memo-app/01-decisions-and-scope.md` §1.6）：

* MindHub＝アプリ全体名（思考メモ・作業ログ・AI活用・プロンプト集・現場適応モードのハブ）
* FlowDock＝初期からある軽量メモ機能（`/memo` 系）の説明名。消さずに残す
* `/memo` 系＝FlowDock由来の既存軽量メモ機能、`/notes` 系＝メモ管理機能、`/workplace` 系＝現場適応モード
* app.json・package.json・ルート名・DB・実装コードの名称は現時点では変更しない

実行方法：

```bash
npm install
npx expo start --web   # PC用Webアプリとして起動
```

## 作業開始時に必ず読むファイル

1. `AGENTS.md`（このファイル）
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
| UIを触る | `docs/memo-app/08-ui-flow.md`、`28-ui-ux-quality-improvement.md`、`29-ui-design-system.md` |
| UI・UX改善（Phase 15：画面別改善・情報設計） | `docs/memo-app/28-ui-ux-quality-improvement.md` |
| 共通UI基盤（トークン・色・余白・ヘッダー・共通部品・状態表示・アクセシビリティ） | `docs/memo-app/29-ui-design-system.md` |
| UI検証（幅別・状態別・回帰・Android実機・合格判定） | `docs/memo-app/30-ui-validation-checklist.md`、`16-platform-and-distribution.md` |
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
| Phase 16（未着手・文書のみ承認済み）：さくっとメモ入力・ホーム操作性（16A）／質問タイミング判断支援（16B）／外部AI・共有受け渡し（16C） | まず `docs/memo-app/31-quick-memo-usability-improvement.md`〜`33`。関連正本：16Aは`08-ui-flow.md`・`flowdock_mvp_design.md`・`28`〜`30`／16Bは`20`〜`23`・`03`・`04`／16Cは`06-chatgpt-prompt-copy.md`・`14`・`21`〜`23`・`07` |

## 既存機能（FlowDock由来）のドキュメント

既存メモ機能・GitHub連携を触る場合は以下も読む。

* `docs/flowdock_mvp_design.md`（既存機能の仕様基準）
* `docs/architecture.md`（アーキテクチャ解説）
* `docs/development_status.md`（既存機能の達成状況）
* `docs/task_board.md`、`docs/implementation_log.md`、`docs/roadmap.md`
* `docs/claude_workflow.md`（既存機能向けの旧作業ルール。メモ管理機能の作業ではこのAGENTS.mdを優先）

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
* 既存ルーティング（ルート名・ルート構成）を壊さない。新画面は追加のみ。ただし**画面内の再構成（レイアウト・表示文言の変更）は `28-ui-ux-quality-improvement.md` の範囲内なら認める**（ホーム再構成を含む）
* UIスタイルは `29-ui-design-system.md` のデザイントークン・色の役割・移行ルールに従う（旧ルール「`#2563EB` 基調、カード型、StyleSheet方式を踏襲する」は2026-07-13にこの規則へ置き換え。青基調・カード型・StyleSheet方式自体は29のトークンとして継続する）
* UI・UX作業（Phase 15）の追加ルール：
  * 1タスク1目的。複数画面の同時変更・全画面一括置換をしない（`29` §10）
  * 保存ロジック・取得処理を共通化のために書き換えない
  * AppHeaderの実装は、versionCode 4 APKの基準確認（`30` §12.2）が完了するまで着手しない
  * 実装後は `30-ui-validation-checklist.md` に従って検証し、判定（未確認／合格／条件付き合格／不合格／対象外）を記録する。未実施の項目を推測で合格にしない
* Phase 16（16A/16B/16C）の追加ルール：
  * 着手時はまず `31`〜`33` を先に読む。3件はユーザーとChatGPTが作成・承認済みの正本であり、要件内容を勝手に再設計・変更しない
  * DB・依存・守秘既定を勝手に変更しない（16Aはmemos無変更、16Bは判定途中・結果を保存しない、16Cは共有本文・共有履歴を自動保存しない）
  * ルートは、既存ルートの名称変更・削除・移動・構成破壊をしない。ただしPhase 16Cでは `33` §13 を満たす共通共有確認ルートの追加は可（route名は実装判断・共有に不要な別ルートは追加しない）
  * 共有（16C）はOS／ブラウザ共有を開くだけで、ChatGPT等への自動送信ではない。「送信しました」「共有完了」と断定しない。コピー機能は廃止しない
  * 現場適応の外部共有（質問・報告）は守秘チェック必須（`23`／`33`）。通常系は注意文
  * 未決定事項は勝手に決めず `docs/memo-app/11-open-issues.md` に記録する
  * Phase 16の実装を開始する場合も、最初は調査・計画・変更予定ファイル報告のみとし、コードは変更しない
* **EASビルド・実機検証の運用ルール**：
  * 用語の区別：「実機確認」と書くときは、(a) **Expo GoによるAndroid実機確認**か、(b) **EAS APKをインストールした配布状態でのAndroid実機確認**かを明記する。両者をまとめて呼ぶときは「実機テスト」とし、EASビルドが必須であるかのように扱わない
  * EAS無料枠の月間ビルド回数には制限があるため、EAS APKビルドは消費回数を抑える前提で計画する
  * 「Android実機確認」と「EAS APKビルド」を区別する。Expo Goで可能な実機確認は、原則として先にExpo Goで行う
  * UI、JavaScript／TypeScript、React Native標準機能だけの変更では、変更のたびにEASビルドを行わない
  * 実装途中の確認は、可能な限りTypeScript、Web、Web export、Expo Goで行う
  * 同じPhaseまたは関連する複数の修正は、機械確認・Web・Expo Goで問題を減らしてからまとめ、原則として最終受入用のEASビルドを1回行う
  * 軽微な不具合は、直すたびに再ビルドせず、可能な範囲で複数件をまとめてから再ビルドする
  * EASビルドが必要になる可能性がある場合も、ユーザーの明示的な承認前にビルドを開始しない
  * EASビルド開始前に、次をユーザーへ報告する
    * Expo GoやWebでは確認できない理由
    * 今回のビルドへ含める変更範囲
    * APKで確認する受入項目
    * このビルドが途中確認か、Phase全体をまとめた最終確認か
    * versionCode変更の要否
  * 次の場合はEASビルドが必要な候補になる
    * 新しいネイティブ依存を追加した
    * `app.json`、Androidネイティブ設定、SDK、ビルド設定を変更した
    * Expo GoとインストールAPKで挙動が異なる問題を確認した
    * Expo Goでは利用・再現できない機能を検証する
    * Phaseまたは配布版の最終受入確認を行う
  * EASビルドが必要な候補であっても、実際に開始するかはユーザーが決定する
  * 実機確認が必要という理由だけで、直ちにEASビルドが必要と判断しない
  * ビルド回数の節約によって未検証項目が残る場合は、推測で合格にせず「Expo Go確認済み」「APK未確認」など確認範囲を分けて記録する
  * Codexは、ユーザーから明示的な指示がない限り、EASビルド、versionCode更新、配布用APK作成を行わない
* DB変更は `src/db/schema.ts` + `src/db/migrations.ts` の schema_version 方式で行う。既存テーブルの破壊的変更はしない
* 破壊的変更が必要な場合は実装せず、確認待ちとして `docs/memo-app/11-open-issues.md` に記録する
* 未確定事項は勝手に決めず `docs/memo-app/11-open-issues.md` に記録する。作業が止まる場合は最小限の仮置きをして、その内容を作業ログにも記録する
* 仕様と実装が食い違う場合は実装を優先し、仕様書またはタスクリストを更新する
* CLAUDE.mdとAGENTS.mdで共通するプロジェクトルール（Phase固有ルール、ビルド・検証、DB・守秘、Git運用）を変更する場合は、原則として同じ作業内で両方を更新する。Claude Code／Codex固有の名称や指示だけは各ファイルに合わせて書き分ける

## Git運用ルール

* アプリ内からのGit自動push・自動commitは実装しない
* Codexもユーザーの指示なしにcommit / pushしない
* 個人情報を含むメモはGit候補にしない（詳細は `docs/memo-app/07-export-and-git-rules.md`）
