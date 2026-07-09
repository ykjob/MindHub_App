# Markdown書き出しとGit管理ルール

## 1. 基本方針

Git自動pushはしない。

アプリは以下を担当する。

* Git候補メモを選別する
* Markdownとして書き出す
* 出力先パスを自動生成する
* 書き出し状態を記録する

Git操作は初期実装では手動または別スクリプトで行う。

## 2. Git候補フラグ

各メモに `is_git_candidate` を持たせる。

trueの場合、Gitに書き出す候補になる。

falseの場合、基本的にMarkdown書き出し対象から除外する。

## 3. 出力対象

Markdown書き出し対象は以下。

* `is_git_candidate = true`
* `archived_at is null`
* ユーザーが書き出し対象として選択したメモ

## 4. 基本出力ルール

```text
docs/notes/{project}/{date}_{type}_{slug}.md
```

例。

```text
docs/notes/memo_app/2026-07-02_design_markdown-format.md
docs/notes/pead/2026-07-02_command_actions-check.md
docs/notes/cocoro_call/2026-07-02_worklog_release-preview.md
```

## 5. projectの扱い

DBの `project` を使う。

projectが空の場合は `general` を使う。

## 6. dateの扱い

基本は作成日を使う。

必要に応じて書き出し日を使う案も検討可能。

初期案。

* ファイル名の日付は `created_at` の日付
* exported_atは別途DBに保存

## 7. typeの扱い

DBの `type` を使う。

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

## 8. slugの扱い

titleから生成する。

ルール。

* 空白はハイフンにする
* ファイル名に使えない記号は除去する
* 長すぎる場合は短縮する
* titleが空なら `untitled` を使う

## 9. Gitに上げるもの

Gitに書き出してよい候補。

* 開発作業ログ
* 技術調査メモ
* コマンド手順
* エラー対応メモ
* 設計メモ
* Claude Code用プロンプト
* 再利用できるテンプレート
* 公開して問題ない就活用の技術説明
* プロジェクト方針
* 実装判断の記録
* 環境構築手順

## 10. Gitに上げないもの

Gitに書き出さないもの。

* 素な思考メモ
* 体調、気分、眠気などの個人状態メモ
* 家庭や生活の個人的メモ
* 個人情報を含むメモ
* 非公開情報を含むメモ
* 未整理のダーッと書いたメモ
* 公開や共有に向かないChatGPTログ
* 就活先の詳細情報を含むメモ
* 住所、メールアドレス、電話番号などを含むメモ

## 11. 将来の一括書き出しスクリプト

将来的に以下のようなスクリプトを作る。

```text
scripts/export_git_notes.py --dry-run
scripts/export_git_notes.py --only-git-candidates
scripts/export_git_notes.py --project memo_app
scripts/export_git_notes.py --type command
```

初期実装では必須ではない。

ただし、DB設計と出力ルールは一括書き出しも想定しておく。

## 12. スマホ閲覧用HTML/JSON出力（2026-07-06 追加仕様）

詳細は `13-mobile-view-export.md` を参照。ここでは書き出し・Git管理に関わるルールだけをまとめる。

* スマホ閲覧用HTML/JSON（docs/mobile-view/）の出力対象は、`archived_at IS NULL` かつ `is_git_candidate = true` かつ `visibility = git_candidate` のメモに限定する
* さらに公開許可カテゴリ（worklog / research / command / design / error_note / template / claude_prompt）に限定する
* thought / chatgpt_log / jobsearch は初期の除外カテゴリとする
* HTML/JSON生成前に出力対象確認画面を設ける（private / internalメモ・個人情報入りメモの誤公開防止）
* 自動pushはしない。docs/mobile-view/ への配置後、手動でgit add / commit / pushする運用を基本にする
* 将来、生成からpushまでをまとめるワンコマンド更新スクリプトを検討する（`15-future-and-rejected-policies.md` 参照）。ただしアプリ内から直接pushする機能は採用しない

## 13. 現場適応モードのGit除外（2026-07-09 追加）

現場適応モード（`20`〜`23`）で扱う現場情報・場面メモは、既定で `is_git_candidate = false` とし、Markdown書き出し・Git候補・スマホ閲覧用HTML/JSONの対象にしない。
これは本ファイル2章・10章、`13-mobile-view-export.md`、`17-distribution-and-sharing.md` の既存ルールに従う。守秘方針の正本は `23`。

なお、この既定 false は `04-categories-and-tags.md` §2 のカテゴリ別Git候補初期値（worklog 等は true）よりも優先される。優先順位と根拠は `23` §6.1 を参照。
