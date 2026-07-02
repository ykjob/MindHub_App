# MindHub_App メモ管理機能 分割仕様書セット

以下の内容を、ファイルごとに分けて配置する。

---

# `docs/memo-app/00-overview.md`

# MindHub_App メモ管理機能拡張 全体概要

## 1. 背景

ChatGPTやClaude Codeとの会話、開発作業ログ、調査メモ、コマンド手順、就活準備メモ、普段の思考メモが分散している。

その結果、以下の問題が起きている。

* ChatGPTで決めた内容が後から探しにくい
* Claude Codeに渡した指示や作業結果が流れやすい
* 開発プロジェクトごとの現在地が分かりにくい
* コマンドや調査内容を再利用しにくい
* Gitに残すべき情報と個人的なメモを分けにくい
* 作業ログを毎回手動で整理する運用は忘れやすい
* ノートPCとデスクトップPCを使い分ける中で、情報の置き場が曖昧になりやすい

このため、MindHub_Appをベースに、PC用Webアプリとして使えるメモ管理機能を拡張する。

## 2. 目的

本機能の目的は、単なるメモ帳ではなく、以下を一元管理できるメモ管理アプリを作ることである。

* ChatGPT整理結果の保存
* Claude Code用プロンプトの保存
* 開発作業ログの保存
* 技術調査メモの保存
* コマンド手順の保存
* エラー対応メモの保存
* 就活用メモの保存
* 普段の思考メモの保存
* Gitに上げるメモと上げないメモの分離
* Markdown形式での書き出し
* 後から検索・分類・参照しやすい表示

## 3. 基本コンセプト

MindHub_Appは、思考メモ、作業ログ、調査メモ、ChatGPT整理結果をまとめて扱う、個人用のメモ管理アプリとして拡張する。

中心となる考え方は以下。

* 普段のメモも開発ログもMindHub_Appに集約する
* メモアプリを分けすぎない
* ChatGPTには形式を記憶させず、アプリ側に整理プロンプトを持たせる
* Gitに上げるものと上げないものを明確に分ける
* 最初はPC用Webアプリとして実用できる状態を優先する
* スマホ確認は当面GitHubアプリで代用する
* クラウド同期やスマホアプリ対応は後回しにする

## 4. MindHub_Appをベースにする理由

新規メモアプリを別リポジトリで作ると、普段の思考メモと開発作業ログをどちらに書くか判断する必要が出る。

そのため、既存のMindHub_Appをベースに拡張する。

ただし、就活で説明しやすくするため、以下の機能名や説明を明確にする。

* 思考メモ管理
* 作業ログ管理
* 技術調査メモ管理
* ChatGPT整理ログ管理
* Claude Code用プロンプト管理
* Markdownエクスポート
* SQLiteによるローカルDB保存

## 5. PC用Webアプリを優先する理由

主な利用場面はPC作業中である。

PCでは以下を行う。

* ChatGPTの回答を貼り付けて保存する
* Claude Code用プロンプトを保存する
* 作業ログを整理する
* 調査メモやコマンドを検索する
* Markdownとして書き出す
* Gitに上げたい情報を整理する

スマホ対応は初期実装では行わない。

外出先で確認したい場合は、GitHubに上げたMarkdownをスマホのGitHubアプリで見ることで代用する。

---

# `docs/memo-app/01-decisions-and-scope.md`

# 決定事項とスコープ

## 1. 決定事項

現時点の決定事項は以下。

* MindHub_Appをベースにする
* 最初はPC用Webアプリとして作る
* 普段の思考メモも保存対象に含める
* データ保存にはSQLiteを使う
* 本文はMarkdown形式を基本にする
* Markdownプレビューを入れる
* ChatGPTとの連携はAPIではなく、プロンプトコピー運用にする
* ChatGPT側に形式を記憶させない
* アプリ側にカテゴリ別の整理プロンプトを持たせる
* Git自動pushは初期実装では行わない
* Gitに上げたいメモはアプリ上で候補として選べるようにする
* Git候補メモはMarkdownとして書き出せるようにする
* 削除は完全削除ではなくアーカイブ方式にする
* プロジェクト名は自由入力と候補選択の両方に対応する
* タグも自由入力と候補選択の両方に対応する
* スマホ確認は当面GitHubアプリで代用する

## 2. 初期実装でやること

初期実装の対象は以下。

* SQLiteによるメモ保存
* メモ作成
* メモ一覧表示
* メモ詳細表示
* メモ編集
* アーカイブ
* カテゴリ管理
* プロジェクト管理
* タグ管理
* Git候補フラグ
* Markdown本文保存
* Markdownプレビュー
* カテゴリ別ChatGPT整理プロンプトコピー
* 検索
* 絞り込み
* Markdown書き出し
* Markdown出力先ルールの実装準備

## 3. 初期実装でやらないこと

初期実装では以下を行わない。

* スマホアプリ対応
* クラウド同期
* Supabase連携
* OpenAI API連携
* ChatGPT共有ボタンからの直接受け取り
* アプリ内Git push
* 自動commit
* 自動push
* 複数ユーザー対応
* ログイン機能
* 画像管理
* 音声メモ
* 添付ファイル管理
* リアルタイム同期
* 完全削除前提の削除機能

## 4. 後回しにすること

以下は将来拡張として扱う。

* スマホ対応
* クラウド同期
* Supabase連携
* OpenAI API連携
* ChatGPT共有受け取り
* Git候補一括書き出しスクリプトの高度化
* アプリ内Git操作
* 添付ファイル管理
* 音声入力
* 自動タグ抽出

## 5. 判断ルール

仕様と実装が食い違う場合は、実装を優先せず、仕様書またはタスクリストを更新する。

未確定事項は勝手に決定せず、`docs/memo-app/11-open-issues.md` に記録する。

---

# `docs/memo-app/02-features.md`

# 機能仕様

## 1. メモ作成

ユーザーは新規メモを作成できる。

入力項目は以下。

* タイトル
* プロジェクト
* カテゴリ
* タグ
* 本文
* source
* visibility
* Git候補フラグ

本文はMarkdown形式を基本とする。

## 2. メモ一覧

保存済みメモを一覧表示する。

一覧に表示する項目。

* タイトル
* プロジェクト
* カテゴリ
* タグ
* 更新日時
* Git候補状態
* アーカイブ状態

通常一覧では、アーカイブ済みメモは非表示にする。

## 3. メモ詳細

メモ詳細画面では、保存済みメモを表示する。

表示内容。

* タイトル
* プロジェクト
* カテゴリ
* タグ
* Markdownプレビュー
* 更新日時
* Git候補状態
* 書き出し状態

## 4. メモ編集

保存済みメモを編集できる。

編集対象。

* タイトル
* 本文
* プロジェクト
* カテゴリ
* タグ
* source
* visibility
* Git候補フラグ

編集後は `updated_at` を更新する。

## 5. アーカイブ

削除は完全削除ではなくアーカイブ方式にする。

アーカイブ時は `archived_at` に日時を入れる。

通常一覧では `archived_at` が入っているメモを表示しない。

必要に応じて、アーカイブ済み一覧を表示できるようにする。

## 6. 検索

メモ本文、タイトル、タグ、プロジェクトを対象に検索できるようにする。

検索対象。

* title
* body
* project
* tags
* type

## 7. 絞り込み

以下で絞り込みできるようにする。

* プロジェクト
* カテゴリ
* タグ
* Git候補のみ
* アーカイブ済みを含めるか
* 更新日順
* 作成日順

## 8. Markdownプレビュー

本文をMarkdownとして表示できるようにする。

対応したい表示。

* 見出し
* 箇条書き
* 番号付きリスト
* コードブロック
* 区切り線
* 強調
* リンク

## 9. ChatGPT整理プロンプトコピー

カテゴリごとに、ChatGPTへ貼るための整理プロンプトをコピーできる。

初期対応カテゴリ。

* 作業ログ
* 調査メモ
* コマンド・手順
* 設計メモ
* 思考メモ

後から追加するカテゴリ。

* ChatGPT保存ログ
* Claude Code用プロンプト
* 就活メモ
* エラー対応メモ
* テンプレート

## 10. Markdown書き出し

メモをMarkdownファイルとして書き出せる。

初期実装では、メモ単体の書き出しを優先する。

出力先は、プロジェクト、日付、カテゴリ、タイトルから自動生成する。

基本ルール。

`docs/notes/{project}/{date}_{type}_{slug}.md`

---

# `docs/memo-app/03-data-model.md`

# データモデル仕様

## 1. DB方針

データ保存にはSQLiteを使う。

理由。

* PCローカルで完結しやすい
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

実際に書き出したファイルパス。

### exported_at

最後にMarkdown書き出しした日時。

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

未出力または更新済みのメモを判定できるようにする。

---

# `docs/memo-app/04-categories-and-tags.md`

# カテゴリ・プロジェクト・タグ設計

## 1. カテゴリ一覧

初期カテゴリは以下。

| 表示名               | type          | 用途                           | Git候補初期値 |
| ----------------- | ------------- | ---------------------------- | -------- |
| 作業ログ              | worklog       | 開発作業やClaude Code作業の記録        | true     |
| 調査メモ              | research      | 技術調査、比較検討、仕様確認               | true     |
| コマンド・手順           | command       | Git、PowerShell、Python、環境構築など | true     |
| 設計メモ              | design        | アプリ設計、DB設計、画面設計、仕様整理         | true     |
| 思考メモ              | thought       | 普段のだーっと書くメモ、頭の整理             | false    |
| ChatGPT保存ログ       | chatgpt_log   | 会話の区切り保存                     | false    |
| Claude Code用プロンプト | claude_prompt | Claude Codeへ渡す指示             | true     |
| 就活メモ              | jobsearch     | 職務経歴書、面接、求人比較など              | false    |
| エラー対応メモ           | error_note    | エラー原因、試したこと、解決方法             | true     |
| テンプレート            | template      | 再利用するプロンプトや定型文               | true     |

## 2. Git候補初期値の考え方

個人情報が混ざりやすいカテゴリはfalseにする。

falseにするカテゴリ。

* 思考メモ
* ChatGPT保存ログ
* 就活メモ

trueにするカテゴリ。

* 作業ログ
* 調査メモ
* コマンド・手順
* 設計メモ
* Claude Code用プロンプト
* エラー対応メモ
* テンプレート

ただし、ユーザーが手動で変更できるようにする。

## 3. Gitに上げる候補

以下はGitに書き出してよい候補。

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

## 4. Gitに上げないもの

以下はGitに書き出さない。

* 雑な思考メモ
* 体調、気分、眠気などの個人状態メモ
* 家庭や生活の個人的メモ
* 個人情報を含むメモ
* 非公開情報を含むメモ
* 未整理のだーっと書いたメモ
* 公開や共有に向かないChatGPTログ
* 就活先の詳細情報を含むメモ
* 住所、メールアドレス、電話番号などを含むメモ

## 5. プロジェクト管理

プロジェクト名は自由入力できる。

ただし、過去に使ったプロジェクト名を候補として表示する。

想定プロジェクト。

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

projectが空の場合、Markdown出力時は `general` を使う。

## 6. タグ管理

タグは自由入力できる。

ただし、過去に使ったタグを候補として表示する。

ChatGPT整理結果に「推奨タグ」が含まれる場合、その内容をタグ候補として使える設計にする。

初期実装では、本文からの自動抽出は必須ではない。

まずは以下を優先する。

* 手動入力
* 過去タグ候補
* 推奨タグを見て貼り付けられる運用

---

# `docs/memo-app/05-markdown-templates.md`

# Markdown本文テンプレート

## 1. 方針

本文はMarkdown形式を基本にする。

アプリ側でテンプレートを本文欄に入れて手作業で埋めることは主目的ではない。

主な運用は以下。

1. アプリ側でカテゴリ別のChatGPT整理プロンプトをコピーする
2. ChatGPTへ貼り付ける
3. ChatGPTがカテゴリ別Markdown形式で整理する
4. 整理結果をMindHub_Appに貼り戻す
5. Markdownプレビューで読みやすく表示する

## 2. 作業ログ

```md
# 作業ログ：タイトル

## 今回の目的

## 今回やったこと

## 決まったこと

## 変更したファイル

## 確認したこと

## 未完了事項

## 次にやること

## Claude Codeに渡すなら

## 次回再開メモ

## 推奨タグ
```

## 3. 調査メモ

```md
# 調査メモ：タイトル

## 調べた目的

## 結論

## 重要ポイント

## 比較・選択肢

## 採用する方針

## 採用しない方針

## 注意点

## 未確認事項

## 次に調べること

## 参考情報

## 推奨タグ
```

## 4. コマンド・手順

````md
# コマンド手順：タイトル

## 目的

## 前提条件

## 実行環境

## 実行場所

## 手順

```bash
```

## 確認コマンド

```bash
```

## 成功時の状態

## 失敗時の確認ポイント

## 注意点

## 関連メモ

## 推奨タグ
````

## 5. 設計メモ

```md
# 設計メモ：タイトル

## 背景

## 目的

## 解決したい課題

## 決定事項

## 未確定事項

## 画面設計

## データ設計

## 処理フロー

## 初期実装範囲

## 初期実装でやらないこと

## 実装ロードマップ

## Claude Codeに渡す要点

## 次に決めること

## 推奨タグ
```

## 6. 思考メモ

```md
# 思考メモ：タイトル

## 今の状態

- 眠気：
- 体調：
- 気分：
- 頭の回り具合：

## だーっと書く

## 整理すると

## 気になっていること

## 今すぐやること

## 後で考えること

## 決める必要があること

## 今日やらなくていいこと

## 次に見るメモ

## 推奨タグ
```

## 7. ChatGPT保存ログ

```md
# ChatGPT保存ログ：タイトル

## 今回の会話テーマ

## 今回の内容

## 決まったこと

## 変更された方針

## 次にやること

## 未決事項

## 保存しておくべき要点

## Claude Codeに渡せる内容

## Gitに上げる場合の注意

## 次回再開メモ

## 推奨タグ
```

## 8. Claude Code用プロンプト

```md
# Claude Code用プロンプト：タイトル

## 作業目的

## 対象リポジトリ

## 作業前に確認するファイル

## やってほしいこと

## やらないでほしいこと

## 変更範囲

## 完了条件

## 確認してほしいこと

## テスト・検証方法

## 作業ログ記録ルール

## 注意点

## Claude Codeに渡す本文

## 実行後の結果メモ

## 推奨タグ
```

## 9. 就活メモ

```md
# 就活メモ：タイトル

## 用途

## 関連求人・企業

## 自分の経験

## アピールできる点

## 不安点

## 相談した内容

## 決まった方針

## 次にやること

## 応募書類に使える表現

## 面接で話せる内容

## 公開してよい内容か

## 個人情報の有無

## 推奨タグ
```

## 10. エラー対応メモ

```md
# エラー対応メモ：タイトル

## 発生したエラー

## エラー全文

## 発生した状況

## 再現手順

## 原因

## 試したこと

## 効果がなかったこと

## 解決方法

## 修正したファイル

## 確認方法

## 再発防止メモ

## 関連コマンド

## 推奨タグ
```

---

# `docs/memo-app/06-chatgpt-prompt-copy.md`

# ChatGPT整理プロンプトコピー機能

## 1. 方針

ChatGPT側に形式を記憶させる運用にはしない。

理由。

* 会話ごとに形式がぶれる可能性がある
* メモリに依存すると信頼性が下がる
* 毎回長いテンプレートを手入力するのは面倒
* アプリ側でテンプレートを管理した方が確実

MindHub_App側にカテゴリ別の整理プロンプトを保持し、ボタンでコピーできるようにする。

## 2. 利用フロー

1. ユーザーがカテゴリを選ぶ
2. 「ChatGPT整理プロンプトをコピー」を押す
3. カテゴリ別テンプレート込みプロンプトがクリップボードにコピーされる
4. ユーザーがChatGPTに貼り付ける
5. 整理対象の内容を貼り付ける
6. ChatGPTがMarkdown形式で整理する
7. ユーザーが整理結果をMindHub_Appへ貼り戻す
8. メモとして保存する

## 3. 初期対応カテゴリ

初期対応するプロンプト。

* 作業ログ
* 調査メモ
* コマンド・手順
* 設計メモ
* 思考メモ

## 4. 後から追加するカテゴリ

後から追加するプロンプト。

* ChatGPT保存ログ
* Claude Code用プロンプト
* 就活メモ
* エラー対応メモ
* テンプレート

## 5. プロンプト共通ルール

整理プロンプトには以下を含める。

* どのカテゴリとして整理するか
* Markdown形式で出力すること
* 指定された見出しを使うこと
* 不明な項目は無理に埋めず「未記載」または「該当なし」とすること
* 推奨タグを最後に出すこと
* Gitに上げる場合の注意がある場合は明記すること

## 6. 作業ログ用プロンプト

```text
以下の内容を、作業ログとしてMarkdown形式で整理してください。

出力形式：

# 作業ログ：タイトル

## 今回の目的

## 今回やったこと

## 決まったこと

## 変更したファイル

## 確認したこと

## 未完了事項

## 次にやること

## Claude Codeに渡すなら

## 次回再開メモ

## 推奨タグ

整理対象：
```

## 7. 調査メモ用プロンプト

```text
以下の内容を、調査メモとしてMarkdown形式で整理してください。

出力形式：

# 調査メモ：タイトル

## 調べた目的

## 結論

## 重要ポイント

## 比較・選択肢

## 採用する方針

## 採用しない方針

## 注意点

## 未確認事項

## 次に調べること

## 参考情報

## 推奨タグ

整理対象：
```

## 8. コマンド・手順用プロンプト

```text
以下の内容を、コマンド・手順メモとしてMarkdown形式で整理してください。

出力形式：

# コマンド手順：タイトル

## 目的

## 前提条件

## 実行環境

## 実行場所

## 手順

## 確認コマンド

## 成功時の状態

## 失敗時の確認ポイント

## 注意点

## 関連メモ

## 推奨タグ

整理対象：
```

## 9. 設計メモ用プロンプト

```text
以下の内容を、設計メモとしてMarkdown形式で整理してください。

出力形式：

# 設計メモ：タイトル

## 背景

## 目的

## 解決したい課題

## 決定事項

## 未確定事項

## 画面設計

## データ設計

## 処理フロー

## 初期実装範囲

## 初期実装でやらないこと

## 実装ロードマップ

## Claude Codeに渡す要点

## 次に決めること

## 推奨タグ

整理対象：
```

## 10. 思考メモ用プロンプト

```text
以下の内容を、思考メモとしてMarkdown形式で整理してください。

出力形式：

# 思考メモ：タイトル

## 今の状態

- 眠気：
- 体調：
- 気分：
- 頭の回り具合：

## だーっと書く

## 整理すると

## 気になっていること

## 今すぐやること

## 後で考えること

## 決める必要があること

## 今日やらなくていいこと

## 次に見るメモ

## 推奨タグ

整理対象：
```

---

# `docs/memo-app/07-export-and-git-rules.md`

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

* 雑な思考メモ
* 体調、気分、眠気などの個人状態メモ
* 家庭や生活の個人的メモ
* 個人情報を含むメモ
* 非公開情報を含むメモ
* 未整理のだーっと書いたメモ
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

ただし、DB設計と出力ルールは一括書き出しを想定しておく。

---

# `docs/memo-app/08-ui-flow.md`

# 画面構成と操作フロー

## 1. メイン画面

メイン画面では、現在のメモ状況を把握できるようにする。

表示候補。

* 最近更新したメモ
* Git候補メモ
* プロジェクト別メモ
* カテゴリ別メモ
* 未整理メモ
* アーカイブを除いた一覧

## 2. メモ作成画面

入力項目。

* タイトル
* プロジェクト
* カテゴリ
* タグ
* 本文
* source
* visibility
* Git候補フラグ

操作。

* 保存
* Markdownプレビュー切り替え
* ChatGPT整理プロンプトコピー

## 3. メモ詳細画面

表示内容。

* タイトル
* プロジェクト
* カテゴリ
* タグ
* Markdownプレビュー
* 更新日時
* Git候補状態
* 書き出し状態

操作。

* 編集
* アーカイブ
* Markdown書き出し
* ChatGPT整理プロンプトコピー

## 4. メモ編集画面

編集できる項目。

* タイトル
* プロジェクト
* カテゴリ
* タグ
* 本文
* source
* visibility
* Git候補フラグ

## 5. 検索画面

検索条件。

* キーワード
* プロジェクト
* カテゴリ
* タグ
* Git候補のみ
* アーカイブ済みを含めるか
* 更新日順
* 作成日順

## 6. ChatGPT整理プロンプトコピー操作

流れ。

1. カテゴリを選ぶ
2. 「ChatGPT整理プロンプトをコピー」を押す
3. クリップボードにコピーされる
4. コピー完了メッセージを表示する
5. ユーザーがChatGPTに貼り付ける
6. 整理結果を本文に貼り戻す

## 7. Markdown書き出し操作

流れ。

1. メモ詳細を開く
2. Git候補状態を確認する
3. Markdown書き出しを押す
4. 出力先パスを自動生成する
5. 必要なら保存先フォルダを指定する
6. Markdownファイルを書き出す
7. export_pathとexported_atを保存する

## 8. アーカイブ操作

流れ。

1. メモ詳細を開く
2. アーカイブを押す
3. 確認ダイアログを表示する
4. archived_atを保存する
5. 通常一覧から非表示にする

---

# `docs/memo-app/09-roadmap.md`

# 実装ロードマップ

## Phase 0：仕様書・管理ファイル整備

やること。

* 分割仕様書作成
* CLAUDE.md整備
* 00_START_HERE.md作成
* current-tasks.md作成
* worklog/current.md作成
* タスクリスト作成

完了条件。

* 実装前の方針が明文化されている
* 作業内容別に読む仕様書が明確になっている
* Phase 1に進むためのタスクが整理されている

## Phase 1：SQLite保存・基本CRUD

やること。

* SQLite導入
* notesテーブル作成
* メモ作成
* メモ一覧
* メモ詳細
* メモ編集
* アーカイブ

完了条件。

* ChatGPTの回答を貼り付けて保存できる
* 一覧から開いて編集できる
* アーカイブできる

## Phase 2：分類機能

やること。

* カテゴリ選択
* プロジェクト自由入力
* 過去プロジェクト候補
* タグ入力
* 過去タグ候補
* Git候補フラグ
* visibility

完了条件。

* メモをプロジェクト、カテゴリ、タグで分類できる
* Gitに上げる候補と上げないメモを分けられる

## Phase 3：Markdownプレビュー

やること。

* Markdown本文保存
* Markdownプレビュー表示
* 編集とプレビューの切り替え
* コードブロック表示

完了条件。

* ChatGPT整理結果を読みやすく表示できる

## Phase 4：ChatGPT整理プロンプトコピー

やること。

* カテゴリ別プロンプト定義
* クリップボードコピー
* コピー完了表示
* 初期5カテゴリ対応

完了条件。

* カテゴリを選ぶだけで、ChatGPTに貼る整理依頼文をコピーできる

## Phase 5：検索・絞り込み

やること。

* キーワード検索
* プロジェクト絞り込み
* カテゴリ絞り込み
* タグ絞り込み
* Git候補のみ表示
* アーカイブ除外

完了条件。

* 保存済みメモを後から探せる

## Phase 6：Markdown書き出し

やること。

* メモ単体のMarkdown書き出し
* 保存先フォルダ指定
* ファイル名自動生成
* export_path保存
* exported_at保存

完了条件。

* Gitに上げたいメモをMarkdownとして出力できる

## Phase 7：Git候補一括書き出しスクリプト

やること。

* Git候補メモ取得
* 対象一覧表示
* dry-run対応
* project指定
* type指定
* Markdown一括出力

完了条件。

* Git候補メモだけをまとめて書き出せる

## Phase 8：ダッシュボード化

やること。

* 最近更新したメモ
* プロジェクト別最新メモ
* Git候補一覧
* 未整理メモ一覧
* 次回再開メモ一覧

完了条件。

* アプリを開けば、現在地と次にやることが見えやすい

## Phase 9：将来拡張

候補。

* スマホ対応
* クラウド同期
* Supabase連携
* OpenAI API連携
* ChatGPT共有受け取り
* アプリ内Git操作
* 添付ファイル管理
* 画像管理
* 音声メモ

---

# `docs/memo-app/10-tasks.md`

# タスクリスト

## 1. タスク状態

タスクは以下の状態で管理する。

* 未着手
* 進行中
* 完了
* 保留
* 確認待ち
* 後回し

## 2. Phase 0：仕様書・管理ファイル整備

* [ ] 既存MindHub_App構成確認
* [ ] CLAUDE.md確認
* [ ] CLAUDE.md作成または更新
* [ ] 00_START_HERE.md作成
* [ ] current-tasks.md作成
* [ ] docs/worklog/current.md作成
* [ ] docs/memo-app/00-overview.md作成
* [ ] docs/memo-app/01-decisions-and-scope.md作成
* [ ] docs/memo-app/02-features.md作成
* [ ] docs/memo-app/03-data-model.md作成
* [ ] docs/memo-app/04-categories-and-tags.md作成
* [ ] docs/memo-app/05-markdown-templates.md作成
* [ ] docs/memo-app/06-chatgpt-prompt-copy.md作成
* [ ] docs/memo-app/07-export-and-git-rules.md作成
* [ ] docs/memo-app/08-ui-flow.md作成
* [ ] docs/memo-app/09-roadmap.md作成
* [ ] docs/memo-app/10-tasks.md作成
* [ ] docs/memo-app/11-open-issues.md作成

## 3. Phase 1：SQLite保存・基本CRUD

* [ ] SQLite導入方法確認
* [ ] notesテーブル設計確認
* [ ] notesテーブル作成
* [ ] メモ作成画面作成
* [ ] メモ保存処理実装
* [ ] メモ一覧表示
* [ ] メモ詳細表示
* [ ] メモ編集処理
* [ ] archived_atによるアーカイブ処理
* [ ] 基本動作確認

## 4. Phase 2：分類機能

* [ ] カテゴリ選択実装
* [ ] プロジェクト自由入力実装
* [ ] 過去プロジェクト候補表示
* [ ] タグ入力実装
* [ ] 過去タグ候補表示
* [ ] Git候補フラグ実装
* [ ] visibility実装
* [ ] カテゴリごとのGit候補初期値実装

## 5. Phase 3：Markdownプレビュー

* [ ] Markdownプレビューライブラリ確認
* [ ] Markdown表示実装
* [ ] 編集とプレビュー切り替え
* [ ] コードブロック表示確認
* [ ] ChatGPT整理結果の表示確認

## 6. Phase 4：ChatGPT整理プロンプトコピー

* [ ] プロンプトテンプレート定義
* [ ] カテゴリ別プロンプト取得処理
* [ ] クリップボードコピー処理
* [ ] コピー完了メッセージ
* [ ] 初期5カテゴリ対応
* [ ] 動作確認

## 7. Phase 5：検索・絞り込み

* [ ] キーワード検索
* [ ] プロジェクト絞り込み
* [ ] カテゴリ絞り込み
* [ ] タグ絞り込み
* [ ] Git候補のみ表示
* [ ] アーカイブ除外
* [ ] 並び替え

## 8. Phase 6：Markdown書き出し

* [ ] 出力先ルール実装
* [ ] slug生成処理
* [ ] メモ単体書き出し
* [ ] 保存先フォルダ指定方法確認
* [ ] export_path保存
* [ ] exported_at保存
* [ ] 書き出し後の確認表示

## 9. Phase 7：Git候補一括書き出しスクリプト

* [ ] スクリプト方針確認
* [ ] Git候補メモ取得
* [ ] dry-run対応
* [ ] project指定
* [ ] type指定
* [ ] 一括Markdown出力
* [ ] 対象ファイル一覧表示

## 10. Phase 8：ダッシュボード化

* [ ] 最近更新したメモ表示
* [ ] プロジェクト別最新メモ表示
* [ ] Git候補一覧
* [ ] 未整理メモ一覧
* [ ] 次回再開メモ一覧

---

# `docs/memo-app/11-open-issues.md`

# 未確定事項

## 1. 技術構成

確認待ち。

* MindHub_Appの現在の技術構成
* 現在のルーティング方式
* PC用Webアプリとして動かす方法
* 既存の保存方式
* 既存DBの有無

## 2. SQLite導入

確認待ち。

* 使用するSQLiteライブラリ
* 既存構成との相性
* マイグレーション管理方法
* DBファイルの保存場所

## 3. Markdownプレビュー

確認待ち。

* 使用するMarkdownプレビューライブラリ
* コードブロック表示方法
* スタイル調整範囲

## 4. ファイル書き出し

確認待ち。

* Webアプリでのファイル書き出し方法
* 保存先フォルダ指定の可否
* PCローカルでの保存先管理
* 将来的にデスクトップアプリ化が必要か

## 5. Git候補一括書き出し

確認待ち。

* Phase 6直後に作るか
* Phase 7として後回しにするか
* Pythonスクリプトにするか
* Node.jsスクリプトにするか

## 6. 推奨タグ

確認待ち。

* ChatGPT整理結果から自動抽出するか
* 初期実装では手動入力のみでよいか
* タグ候補のUIをどこまで作るか

## 7. ダッシュボード

確認待ち。

* 初期実装に含めるか
* Phase 8まで後回しにするか
* 何を「現在地」として表示するか

## 8. MindHub_App既存機能との統合

確認待ち。

* 既存画面を流用するか
* 新しい画面を追加するか
* 既存メモ機能がある場合に統合するか
* 既存機能を壊さないための方針

---

# `00_START_HERE.md`

# 作業開始時に最初に読むファイル

## 1. このプロジェクトでやること

MindHub_Appをベースに、PC用Webアプリとして使えるメモ管理機能を拡張する。

目的は、ChatGPT整理結果、Claude Code用プロンプト、開発作業ログ、調査メモ、コマンド手順、就活メモ、普段の思考メモを、保存・分類・検索・Markdown書き出しできるようにすること。

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

## 4. 作業終了時に更新するファイル

* current-tasks.md
* docs/worklog/current.md
* docs/memo-app/10-tasks.md

必要に応じて更新する。

* docs/memo-app/11-open-issues.md
* docs/memo-app/09-roadmap.md

---

# `current-tasks.md`

# Current Tasks

## 現在のフェーズ

Phase 0：仕様書・管理ファイル整備

## 現在の目的

MindHub_Appのメモ管理機能拡張に入る前に、分割仕様書、作業ルール、ロードマップ、タスクリスト、作業ログ運用を整備する。

## 進行中

* 分割仕様書の配置
* CLAUDE.md整備
* 00_START_HERE.md整備
* worklog/current.md整備

## 次にやること

1. 既存MindHub_Appの構成を確認する
2. 既存のCLAUDE.mdや作業ログがあるか確認する
3. 分割仕様書をdocs/memo-app/配下に配置する
4. CLAUDE.mdに作業ルールと仕様書読み分けルールを追加する
5. Phase 1に進む前のタスクを整理する

## 未完了事項

* 既存構成確認
* SQLite導入方法確認
* Markdownプレビューライブラリ確認
* ファイル書き出し方法確認

## 確認待ち

* 既存MindHub_Appの技術構成
* 既存メモ機能の有無
* Webアプリとしての実行方法
* 既存ルーティング方式

## 後回し

* スマホ対応
* クラウド同期
* OpenAI API連携
* ChatGPT共有受け取り
* アプリ内Git push

---

# `docs/worklog/current.md`

# 最新作業ログ

## 今回の目的

MindHub_Appのメモ管理機能拡張に向けて、実装前の仕様書、ロードマップ、タスクリスト、作業ログ運用を整備する。

## 今回やったこと

* メモ管理機能の目的を整理した
* 初期実装範囲を整理した
* 初期実装でやらないことを整理した
* Gitに上げるものと上げないものの線引きを整理した
* カテゴリ設計を整理した
* Markdownテンプレートを整理した
* ChatGPT整理プロンプトコピー機能の方針を整理した
* Markdown書き出しとGit候補管理の方針を整理した
* 仕様書を分割する構成を決めた

## 変更したファイル

初回作業時に作成予定。

* CLAUDE.md
* 00_START_HERE.md
* current-tasks.md
* docs/memo-app/00-overview.md
* docs/memo-app/01-decisions-and-scope.md
* docs/memo-app/02-features.md
* docs/memo-app/03-data-model.md
* docs/memo-app/04-categories-and-tags.md
* docs/memo-app/05-markdown-templates.md
* docs/memo-app/06-chatgpt-prompt-copy.md
* docs/memo-app/07-export-and-git-rules.md
* docs/memo-app/08-ui-flow.md
* docs/memo-app/09-roadmap.md
* docs/memo-app/10-tasks.md
* docs/memo-app/11-open-issues.md
* docs/worklog/current.md

## 未完了事項

* 既存MindHub_Appの構成確認
* 既存ドキュメント確認
* 既存CLAUDE.md確認
* Phase 1実装前の技術選定確認

## 次にやること

1. Claude Codeに分割仕様書を配置させる
2. CLAUDE.mdに作業ルールと読み分けルールを追加させる
3. 既存構成を確認させる
4. Phase 1に進むためのタスクを整理させる

## 次回最初に読むファイル

* CLAUDE.md
* 00_START_HERE.md
* current-tasks.md
* docs/worklog/current.md
* docs/memo-app/09-roadmap.md
* docs/memo-app/10-tasks.md

## 注意点

* 初回はまだ実装しない
* 既存MindHub_Appを壊さない
* 未確定事項は勝手に確定しない
* Git自動pushはしない
* 個人情報を含むメモはGit候補にしない
