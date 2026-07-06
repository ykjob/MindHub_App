# カテゴリ・テンプレートDB管理仕様

追加日：2026-07-06

## 1. 目的

現状のnotes機能では、カテゴリ一覧、Git候補初期値、ChatGPT整理プロンプト、Markdownテンプレートがコード固定（`src/features/notes/noteCategories.ts`、`chatgptPrompts.ts`）になっている。

初期実装としては問題ないが、以下の問題がある。

* カテゴリを増やすたびにコード修正が必要
* テンプレートの見出しを変えるだけでもコード修正が必要
* ChatGPT整理プロンプトを自分用に調整しにくい
* カテゴリごとのGit候補初期値が画面から変えられない
* ベタコードで運用が変わるたび、メモアプリとしての意味が弱くなる

このため、カテゴリ・テンプレート・Git候補初期値・表示順をDB管理に移行する。

## 2. 追加するDB案

### 2.1 note_categories

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

* type：内部type（worklog等）。notesテーブルの `type` と対応する
* label：表示名
* git_candidate_default：新規メモ作成時のGit候補初期値
* visibility_default：新規メモ作成時のvisibility初期値
* source_default：新規メモ作成時のsource初期値
* sort_order：表示順
* is_builtin：初期seed由来かどうか（初期状態に戻す機能で使う）
* is_active：有効 / 無効

### 2.2 note_templates

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

* category_type：対象カテゴリのtype
* name：テンプレート名
* prompt_body：ChatGPT整理プロンプト本文
* template_body：Markdown本文テンプレート
* extra_note：追加注意文
* is_default：そのカテゴリのデフォルトテンプレートかどうか
* is_builtin：初期seed由来かどうか
* sort_order：表示順

## 3. 既存10カテゴリのseed方針

既存10カテゴリは、初期データとしてDBへseedする。

対象カテゴリ。

```text
worklog
research
command
design
thought
chatgpt_log
claude_prompt
jobsearch
error_note
template
```

既存の表示名、Git候補初期値、Markdownテンプレート（`05-markdown-templates.md`）、ChatGPT整理プロンプト（`06-chatgpt-prompt-copy.md`）、追加注意文はなるべく維持する。

## 4. DB優先・fallback方針

* 通常運用では、DB上のカテゴリ・テンプレートを優先する
* DBにカテゴリやテンプレートが存在しない場合のみ、コード上の初期定義をfallbackとして使う
* コード上の初期定義は、seedおよび「初期状態に戻す」機能の元データとしても使う

## 5. カテゴリ管理画面

### 5.1 画面案

```text
設定
  └ メモ管理設定
      ├ カテゴリ管理
      └ テンプレート管理
```

### 5.2 カテゴリ管理で扱う項目

* 表示名
* 内部type
* 説明
* Git候補初期値
* visibility初期値
* source初期値
* 表示順
* 有効 / 無効
* 初期状態に戻す

## 6. テンプレート管理画面

### 6.1 目的

ChatGPT整理プロンプトやMarkdownテンプレートを、コード修正なしでアプリ上から編集できるようにする。

### 6.2 テンプレート管理で扱う項目

* 対象カテゴリ
* テンプレート名
* ChatGPT整理プロンプト本文
* Markdown本文テンプレート
* 追加注意文
* デフォルト指定
* 表示順
* 初期状態に戻す

## 7. カテゴリごとの複数テンプレート

### 7.1 方針

1カテゴリにつき1テンプレートだけではなく、カテゴリごとに複数テンプレートを持てるようにする。

カテゴリを増やしすぎるより、同じカテゴリ内に複数テンプレートを持てる方が実用的である。

### 7.2 例

```text
思考メモ
- 通常版
- 朝の予定整理
- 不安整理
- 作業前整理

作業ログ
- 通常版
- Claude Code作業版
- 不具合修正版
- レビュー依頼版

コマンド・手順
- 通常手順
- Git手順
- PowerShell手順
- GitHub Actions手順
```

### 7.3 初期実装方針

初期実装では、各カテゴリにデフォルトテンプレートを1つ持たせる。

その後、必要に応じて複数テンプレートを追加できる構造にする。

## 8. 初期状態に戻す機能

テンプレートやカテゴリ設定を自由編集できるようにすると、設定が崩れて戻せなくなる可能性がある。

そのため、以下を用意する。

* カテゴリ単位で初期状態に戻す
* テンプレート単位で初期状態に戻す
* 全テンプレートを初期状態に戻す

初期状態に戻す際は、既存メモ本文は変更しない。

## 9. Codex / Claude Code依頼プロンプトのテンプレート保存

### 9.1 方針

CodexやClaude Codeへ渡す依頼文は、毎回考えると負担が大きい。

そのため、よく使う依頼文はテンプレートとして保存できるようにする。

### 9.2 初期テンプレート候補

* Claude Code実装依頼
* Claude Code修正依頼
* Claude Code作業ログ更新依頼
* Codexコードレビュー依頼
* Codexレビュー専用依頼
* 挙動確認チェックリスト
* 不具合修正依頼
* 仕様書更新依頼

### 9.3 注意点

CodexやClaude Codeへ渡すテンプレートには、以下のような安全条件を含めやすいようにする。

* commit / pushしない
* レビュー専用で変更しない
* 既存機能を壊さない
* 未確定事項は勝手に決めない
* 作業ログを更新する
* 変更ファイルと確認結果を報告する

## 10. 関連仕様書

* データモデル詳細：`03-data-model.md`
* 既存カテゴリ定義：`04-categories-and-tags.md`
* 既存Markdownテンプレート（seed元）：`05-markdown-templates.md`
* 既存ChatGPT整理プロンプト（seed元）：`06-chatgpt-prompt-copy.md`
