# データモデル仕様

## 1. DB方針

データ保存にはSQLiteを使う。

理由。

* PCローカルで完結させたい
* サーバー不要
* メモの保存、一覧、検索、分類に向いている
* 個人利用に十分
* DBを使ったアプリ開発経験として説明しやすい

## 2. notesテーブル

想定テーブル。

```text
notes
- id
- title
- body
- project
- type
- tags
- source
- visibility
- is_git_candidate
- export_dir
- export_filename
- export_path
- exported_at
- created_at
- updated_at
- archived_at
```

## 3. カラム定義

### id

メモの一意ID。

### title

メモタイトル。

一覧表示、検索、Markdownファイル名生成に使う。

### body

Markdown本文。

ChatGPT整理結果、作業ログ、コマンド手順、思考メモなどを保存する。

### project

プロジェクト名。

例。

* memo_app
* mindhub_app
* cocoro_call
* pead
* jobsearch
* claude_code
* chatgpt
* study
* life
* general

### type

メモカテゴリ。

例。

* worklog
* research
* command
* design
* thought
* chatgpt_log
* claude_prompt
* jobsearch
* error_note
* template
* family（2026-07-06追加。`04-categories-and-tags.md` 1.1参照）

### tags

タグ。

初期実装ではカンマ区切りまたはJSON文字列でよい。

将来的にはタグテーブル分離も検討可能。

### source

作成元。

候補。

* manual
* chatgpt
* claude_code
* imported_file
* system

### visibility

公開・保存方針。

候補。

* private
* internal
* git_candidate
* family（2026-07-06 配布・共有方針で追加）

意味。

* private：個人的メモ。Gitに出さない
* internal：アプリ内管理用。必要なら後で整理
* git_candidate：Git書き出し候補
* family：家族に見せてよいメモ。ただし公開GitHub Pagesには出さない（家族向けの非公開共有手段の対象候補。`17-distribution-and-sharing.md` 4.1〜4.2、`13-mobile-view-export.md` 3.3参照）

公開判定はカテゴリ（type）だけで行わず、visibilityを併用する。type = family でも visibility = private / family のものは公開GitHub Pagesに出さない。

2026-07-07実装済み：type / visibilityのfamily値をコード定義（noteTypes.ts / noteCategories.ts）に追加した。notes列はTEXT型のためDBマイグレーションは不要だった。公開判定は `src/features/notes/mobileViewPolicy.ts` に実装済み（Phase 10で使用予定）。

### is_git_candidate

Gitに書き出す候補かどうか。

trueの場合、Markdown書き出し候補になる。

### export_dir

Markdown書き出し先ディレクトリ。

自動生成またはユーザー指定。

### export_filename

Markdown書き出しファイル名。

### export_path

実際に書き出されたファイルパス。

### exported_at

最後にMarkdown書き出しされた日時。

### created_at

作成日時。

### updated_at

更新日時。

### archived_at

アーカイブ日時。

通常一覧では、値が入っているものを非表示にする。

## 4. 将来の一括書き出しを見据えた設計

将来的に、Git候補メモだけをまとめてMarkdown出力するスクリプトを作る。

そのため、以下をDBに持つ。

* is_git_candidate
* export_dir
* export_filename
* export_path
* exported_at
* updated_at

未出力または更新済みのメモが判定できるようにする。

## 5. 既存memosテーブルとの関係（実装時の決定）

MindHub_Appには既存のmemosテーブル（body / category / GitHub連携状態）がある。

既存機能を壊さないため、notesテーブルは既存memosテーブルとは独立した新テーブルとして追加する。

既存memosのデータ移行・統合は行わない（未確定事項として `11-open-issues.md` に記録）。

## 6. カテゴリ・テンプレート管理テーブル（2026-07-06 追加仕様）

カテゴリ・テンプレートのコード固定定義をDB管理へ移行するため、以下のテーブルを追加する（詳細は `12-template-db-management.md`）。

### 6.1 note_categories

```text
note_categories
- id
- type
- label
- description
- git_candidate_default
- visibility_default
- source_default
- sort_order
- is_builtin
- is_active
- created_at
- updated_at
```

### 6.2 note_templates

```text
note_templates
- id
- category_type
- name
- prompt_body
- template_body
- extra_note
- is_default
- is_builtin
- sort_order
- created_at
- updated_at
```

### 6.3 既存notesテーブルとの関係

* notesテーブルの `type` は、note_categoriesの `type` と対応する
* 既存notesテーブルには破壊的変更を加えない
* note_templatesの `category_type` はnote_categoriesの `type` を参照する

### 6.4 seed方針

* 既存10カテゴリ（worklog / research / command / design / thought / chatgpt_log / claude_prompt / jobsearch / error_note / template）を初期データとしてseedする
* 既存の表示名、Git候補初期値、Markdownテンプレート、ChatGPT整理プロンプトはなるべく維持する
* seedデータには `is_builtin = true` を付け、「初期状態に戻す」機能の対象にする

### 6.5 DB優先・fallback方針

* 通常運用ではDB上のカテゴリ・テンプレートを優先する
* DBにカテゴリやテンプレートが存在しない場合のみ、コード上の初期定義をfallbackとして使う

実装タイミングとマイグレーション方法は未確定（`11-open-issues.md` 参照）。DB変更時は schema_version 方式に従う。
