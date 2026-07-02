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

意味。

* private：個人的メモ。Gitに出さない
* internal：アプリ内管理用。必要なら後で整理
* git_candidate：Git書き出し候補

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
