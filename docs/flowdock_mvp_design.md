# FlowDock 設計書

## 0. Claude Codeへの依頼方針

この設計書は、Expo製スマホアプリ「FlowDock」のMVP実装方針をまとめたものです。

まずはこの設計書を読み、以下を行ってください。

1. 実装に必要な画面や保存処理、GitHub連携処理、設定管理処理を洗い出す
2. 推奨ディレクトリ構成を提案する
3. 使用する主要ライブラリを提案する
4. SQLiteテーブル設計を確認する
5. MVP実装の作業順を提案する
6. 作成・編集予定ファイル一覧を出す

最初の返答では、まだコード変更しないでください。
まずは実装計画やファイル構成や懸念点や確認事項だけを報告してください。

---

# 1. アプリ概要

## アプリ名

FlowDock

## 開発リポジトリ名

MindHub_App

## コンセプト

FlowDockは、スマホで素早くメモを書いた後、「整理・分類・GitHub保存・Googleタスク出力・Googleカレンダー出力・AI整理」へつながれるための思考整理ハブアプリです。

最初のMVPでは、AI機能とGoogle連携は実装しません。
ただし、後で大きく書き換えなくて済むように、SQLite設計とディレクトリ構成には拡張余地を持たせます。

---

# 2. 技術方針

## アプリ形式

Expoを使ったReact Nativeスマホアプリとして作成する。

## 保存方針

* 基本はオフライン優先
* メモ本文は端末内に即保存
* 内部保存はSQLite
* GitHubトークンなどの秘密情報はSQLiteに入れない
* GitHubトークンはSecureStoreに保存する
* メモ本文は端末内では通常のテキストとして保存する
* GitHubへ送るときにMarkdownファイルとして生成する

## 将来追加予定

* AI整理
* タスク候補生成
* スケジュール候補生成
* Googleタスク出力
* Googleカレンダー出力
* 設計書生成
* Claude Code向けプロンプト生成

---

# 3. MVP範囲

MVPで実装する機能は以下。

* メモ作成
* SQLite保存
* メモ一覧
* メモ詳細
* メモ編集
* カテゴリ選択
* GitHub手動アップロード
* アップロード状態表示
* 削除ボタン
* 削除前確認ダイアログ
* GitHub設定画面
* GitHubトークン保存
* GitHubアップロード失敗時の状態管理
* AIアウトプット用テーブルの作成のみ

MVPでは以下は実装しない。

* AI整理処理本体
* Googleタスク作成処理
* Googleカレンダー作成処理
* 設計書生成機能
* プロンプト生成機能
* 自動同期
* 複数端末同期
* 通知
* Markdownプレビュー

---

# 4. 画面構成

## 4.1 メモ一覧画面

目的：保存済みメモを一覧表示する。

表示内容：

* メモの摘要
* 作成日時または更新日時
* カテゴリ
* GitHubアップロード状態
* Googleタスク出力状態
* Googleカレンダー出力状態

MVPではGoogle出力機能自体は未実装だが、将来表示できるように状態項目は持たせる。

一覧上の状態表示例：

* 未アップロード
* アップロード済み
* アップロード後に変更あり
* アップロード失敗

操作：

* 新規メモ作成
* メモ詳細へ移動
* 設定画面へ移動

---

## 4.2 メモ作成画面

目的：素早くメモを書く。

仕様：

* 起動後すぐ書ける軽さが重要
* 本文入力欄を中心にする
* 保存ボタンを押すとSQLiteに保存
* 同時にカテゴリはインデックス
* 保存後はメモ詳細画面へ遷移するか、一覧へ戻る

本文はMarkdownとして使えるが、プレーンテキストとして扱う。
ただし、入力画面上ではMarkdown記法を強制しない。

---

## 4.3 メモ詳細画面

目的：1件のメモを確認・編集・GitHubアップロードする。

表示内容：

* 本文
* カテゴリ
* 作成日時
* 更新日時
* GitHubステータス
* GitHub保存ファイルパス
* GitHubエラーメッセージ
* Googleタスク出力状態
* Googleカレンダー出力状態

操作：

* 編集
* カテゴリ変更
* GitHubへアップロード
* GitHubで更新
* 再アップロード
* 削除

GitHubアップロード操作は、このメモ詳細画面から1件ずつ手動で行う。

---

## 4.4 メモ編集画面

目的：既存メモを編集する。

仕様：

* 本文を編集できる
* カテゴリを変更できる
* 保存するとupdated_atが更新される
* GitHubアップロード済みメモを編集した場合、github_statusをmodified_after_uploadにする
* まだGitHub未アップロードの場合はnot_uploadedのままにする
* GitHubアップロード失敗中のメモを編集した場合はfailedのままでも、再アップロード可能にする

---

## 4.4.1 後続仕様による追加（Phase 16A / 16C。2026-07-23追記）

本設計書はFlowDock（`/memo` 系）MVP当時の仕様であり、以下は削除せず歴史的記述として残す。MVP後にPhase 16で次の改善・拡張を追加する（未実装。正本は各ファイル）。

* メモ作成（4.2）・メモ編集（4.4）：長文入力・音声入力後の長文編集・本文内スクロール・キーボード表示中の保存/キャンセル操作の詳細は `docs/memo-app/31-quick-memo-usability-improvement.md`（Phase 16A）を正本とする
* メモ詳細（4.3）：本文コピー導線は維持する。加えて `ChatGPTなどへ共有`（OS／ブラウザ共有）を追加する。共有確認・用途選択・編集・Web fallback・共有前の任意保存の詳細は `docs/memo-app/33-external-handoff-and-sharing.md`（Phase 16C）を正本とする。共有はChatGPT等への自動送信ではなく、コピー機能は廃止しない
* 保存形式（memosテーブル）・GitHub連携・削除（論理削除）は変更しない

## 4.5 GitHubアップロードUI

メモ詳細画面に配置する。

UIイメージ：

* カテゴリ選択ボタン
* GitHubアップロードボタン
* 状態表示
* 保存先パス表示
* エラー表示

ボタン表示は状態に応じて変わる。

状態別ボタン：

* not_uploaded → GitHubへアップロード
* uploaded → GitHubで更新
* modified_after_upload → GitHubで更新
* failed → 再アップロード

アップロード済みかどうかは一目で分かるようにする。

---

## 4.6 設定画面

GitHub連携に必要な情報を入力する。

設定項目：

* GitHub owner
* GitHub repository
* GitHub branch
* GitHub token

branchの初期値はmain。

GitHub tokenはSecureStoreに保存する。
画面上では伏せ字表示にする。
SQLiteには保存しない。

---

# 5. カテゴリ仕様

アプリ表示名とGitHub保存フォルダ名を対応させる。

## 初期カテゴリ

* インデックス
* 日常
* 学習
* 開発
* 就活
* アイデア

## GitHub保存先対応

* インデックス → notes/inbox/
* 日常 → notes/daily/
* 学習 → notes/study/
* 開発 → notes/dev/
* 就活 → notes/job/
* アイデア → notes/ideas/

## 内部カテゴリキー

アプリ内部では英字キーを使う。

* inbox
* daily
* study
* dev
* job
* ideas

メモ作成時の初期カテゴリはinbox。

---

# 6. GitHub連携仕様

## 6.1 基本方針

* 自動同期しない
* メモ詳細画面から1件ずつ手動アップロードする
* カテゴリ選択後にアップロードボタンを押す
* カテゴリに応じて保存先フォルダを決める
* GitHub上ではMarkdownファイルとして保存する
* 既にアップロード済みのメモは新規作成せず既存ファイルを更新する
* アップロード失敗時、SQLite内のメモは消えない

---

## 6.2 GitHub保存ルート

GitHub保存ルートは以下で固定。

notes/

---

## 6.3 ファイル名規則

ファイル名は以下。

YYYY-MM-DD-001.md

例：

* 2026-06-24-001.md
* 2026-06-24-002.md
* 2026-06-24-003.md

連番はカテゴリ別・日付別に採番する。

例：

* notes/dev/2026-06-24-001.md
* notes/dev/2026-06-24-002.md
* notes/study/2026-06-24-001.md

devとstudyでは別々に001から始まる。

---

## 6.4 連番採番ルール

アップロード時に、対象カテゴリフォルダ内の当日ファイルを確認し、最大番号の次を採番する。

例：

対象フォルダ：

notes/dev/

既存ファイル：

* 2026-06-24-001.md
* 2026-06-24-002.md

次に作るファイル：

* 2026-06-24-003.md

既にgithub_pathを持つメモの場合は、新規採番せず既存パスを更新する。

---

## 6.5 Markdown生成仕様

端末内では本文をテキスト保存する。
GitHub送信時にMarkdown文字列を生成する。

Markdown出力例：

---

createdAt: 2026-06-24T12:00:00+09:00
updatedAt: 2026-06-24T12:10:00+09:00
category: dev
source: FlowDock

---

本文がここに入る。

front matterはMVP時点で入れる。
後から検索や整理に使えるようにするため。

---

## 6.6 GitHubステータス

github_statusは以下のいずれか。

* not_uploaded
* uploaded
* modified_after_upload
* failed

意味：

not_uploaded：
まだGitHubに送っていない。

uploaded：
GitHubに送信済みで、ローカル本文とGitHub側が一致している状態。

modified_after_upload：
一度GitHubに送った後、ローカル本文を編集した状態。

failed：
GitHubアップロードまたは更新に失敗した状態。

---

## 6.7 GitHubアップロード失敗時

失敗時の仕様：

* SQLite内のメモは残る
* github_statusをfailedにする
* github_error_messageにエラー内容を保存する
* 詳細画面にエラー内容を表示する
* 再アップロードボタンを表示する

---

# 7. Google連携の将来方針

MVPではGoogle連携は実装しない。
ただし、状態管理カラムは先に用意する。

GoogleタスクとGoogleカレンダーについては、FlowDockから一度出力した後の編集はGoogle側で行う。

FlowDock側では、以下だけ管理すればよい。

* 未出力
* 出力済み
* 出力失敗

Googleタスク状態：

* not_exported
* exported
* failed

Googleカレンダー状態：

* not_exported
* exported
* failed

将来的には、AI整理結果からタスク候補と予定候補を作り、ユーザーが確認した後だけGoogleへ出力する。

---

# 8. AI機能の将来方針

MVPではAI処理本体は実装しない。
ただし、後で大きく書き換えなくて済むように、AIアウトプット保存用のテーブルは先に作る。

将来やりたいこと：

* ぐっと書いたメモを整理する
* 要約を作る
* タスク候補を作る
* スケジュール候補を作る
* Googleタスク用データに整形する
* Googleカレンダー用データに整形する
* 設計書を作る
* Claude Code向けプロンプトを作る
* Codexレビュー向けプロンプトを作る

AIアウトプットは文章だけでなく、JSONとして保存できるようにする。

---

# 9. SQLite設計

## 9.1 memosテーブル

MVPの中心テーブル。

カラム案：

id TEXT PRIMARY KEY

body TEXT NOT NULL

category TEXT NOT NULL

created_at TEXT NOT NULL

updated_at TEXT NOT NULL

deleted_at TEXT

github_status TEXT NOT NULL

github_path TEXT

github_sha TEXT

github_uploaded_at TEXT

github_error_message TEXT

google_task_status TEXT NOT NULL

google_calendar_status TEXT NOT NULL

created_ai_output_count INTEGER NOT NULL DEFAULT 0

初期値：

category:
inbox

github_status:
not_uploaded

google_task_status:
not_exported

google_calendar_status:
not_exported

deleted_at:
NULL

削除は物理削除ではなく、MVPでできればdeleted_atを入れる論理削除にする。
ただし、UIは通常の削除として扱っていく。

---

## 9.2 ai_outputsテーブル

AI機能用の将来拡張テーブル。
MVPでは作成だけして、画面ではまだ使わない。

カラム案：

id TEXT PRIMARY KEY

memo_id TEXT NOT NULL

output_type TEXT NOT NULL

content_json TEXT NOT NULL

created_at TEXT NOT NULL

updated_at TEXT NOT NULL

FOREIGN KEY memo_id REFERENCES memos(id)

output_type候補：

* summary
* task_schedule
* prompt
* spec
* review

content_jsonにはAIアウトプット結果をJSON文字列として保存する。

---

## 9.3 settingsテーブルについて

GitHub ownerやrepoやbranchなどの非秘密情報はSQLiteに保存しておく。

settingsテーブル案：

key TEXT PRIMARY KEY

value TEXT NOT NULL

保存する値：

* github_owner
* github_repo
* github_branch

GitHub tokenは保存しない。
GitHub tokenはSecureStoreに保存する。

---

## 9.4 マイグレーション

SQLiteは後からカラムやテーブルを追加する可能性があるため、schema_versionを管理する。

方法案：

* settingsテーブルにschema_versionを保存する
* アプリ起動時にschema_versionを確認する
* 不足しているテーブルやカラムを作成する

MVP時点では、以下を初期作成する。

* memos
* ai_outputs
* settings

---

# 10. データ操作仕様

## 10.1 メモ作成

処理：

1. idを生成
2. bodyを保存
3. categoryは指定しなければinbox
4. created_atを現在時刻で保存
5. updated_atを現在時刻で保存
6. github_statusはnot_uploaded
7. google_task_statusはnot_exported
8. google_calendar_statusはnot_exported
9. SQLiteへinsert

---

## 10.2 メモ編集

処理：

1. bodyまたはcategoryを更新
2. updated_atを更新
3. github_statusがuploadedならmodified_after_uploadに変更
4. github_statusがnot_uploadedならnot_uploadedのまま
5. github_statusがfailedならfailedのままでよい
6. SQLiteへupdate

---

## 10.3 メモ削除

処理：

1. 削除前に確認ダイアログを表示
2. ユーザーが確認した場合のみ削除
3. deleted_atに現在時刻を入れる
4. 一覧からはdeleted_atがNULLのメモだけ表示

---

## 10.4 GitHub初回アップロード

処理：

1. GitHub設定を取得
2. SecureStoreからGitHub tokenを取得
3. 対象メモを取得
4. 選択カテゴリに応じて保存フォルダを決める
5. 同じカテゴリ・同じ日付の既存ファイルを確認
6. 次の連番を決める
7. Markdown文字列を生成
8. GitHub APIでファイル作成
9. 成功したらgithub_statusをuploadedにする
10. github_pathを保存する
11. github_shaを保存する
12. github_uploaded_atを保存する
13. github_error_messageをNULLにする

---

## 10.5 GitHub更新

処理：

1. GitHub設定を取得
2. SecureStoreからGitHub tokenを取得
3. 対象メモを取得
4. github_pathを使って既存ファイルを更新
5. 更新にはgithub_shaを使う
6. Markdown文字列を生成
7. GitHub APIでファイル更新
8. 成功したらgithub_statusをuploadedに戻す
9. 新しいgithub_shaを保存する
10. github_uploaded_atを更新する
11. github_error_messageをNULLにする

---

## 10.6 GitHub失敗時

処理：

1. github_statusをfailedにする
2. github_error_messageにエラー内容を保存
3. メモ本文は消えない
4. github_pathがある場合は残す
5. github_shaがある場合は残す
6. UIに再アップロードボタンを表示する

---

# 11. GitHub設定仕様

設定画面に以下を置く。

* owner
* repository
* branch
* token

branchの初期値はmain。

tokenの扱い：

* アプリ内に直書きしない
* 設定画面から入力する
* SecureStoreに保存する
* 画面上では伏せ字にする
* SQLiteには保存しない

GitHub tokenは、可能なら対象リポジトリだけに権限を絞ったものを使う想定。

---

# 12. ブランチ運用

## メモ保存先リポジトリ

メモ保存先リポジトリでは、基本的にbranchはmainである。

カテゴリはフォルダで分ける。デフォルトで分ける。

例：

* notes/inbox/
* notes/daily/
* notes/study/
* notes/dev/
* notes/job/
* notes/ideas/

## アプリ開発リポジトリ

開発リポジトリMindHub_Appでは、mainを安定版として扱う。

大きな機能追加ではfeatureブランチを使っていく。

例：

* feature/sqlite-memos
* feature/github-upload
* feature/ai-output-storage
* feature/google-export

MVP初期実装では、まずmainに初期構成を作ってから、必要に応じてfeatureブランチを使う。

---

# 13. 推奨ディレクトリ構成案

Claude Code側でよい構成があれば提案してほしい。
現時点の希望構成は以下。

```
src/
  app/
    screens/
      MemoListScreen.tsx
      MemoCreateScreen.tsx
      MemoDetailScreen.tsx
      MemoEditScreen.tsx
      SettingsScreen.tsx
  features/
    memos/
      memoTypes.ts
      memoRepository.ts
      memoService.ts
      memoMarkdown.ts
      memoCategories.ts
    github/
      githubTypes.ts
      githubSettings.ts
      githubTokenStore.ts
      githubApi.ts
      githubUploadService.ts
      githubPath.ts
    ai/
      aiOutputTypes.ts
      aiOutputRepository.ts
    settings/
      settingsRepository.ts
  db/
    database.ts
    migrations.ts
    schema.ts
  components/
    CategorySelector.tsx
    SyncStatusBadge.tsx
    ConfirmDialog.tsx
  utils/
    date.ts
    id.ts
```

この構成では、画面とロジックを分ける。
GitHub API処理を画面内に直接書かない。
SQLite処理を画面内に直接書かない。

---

# 14. UI方針

FlowDockは軽さが重要。

## 優先されること

* 起動してすぐ書ける
* 入力欄が使いやすい
* メモ一覧が見やすい
* 同期状態が一目で分かる
* 設定が複雑にならない
* GitHubアップロードは明示的にボタン操作する

## 後回しにしてよいこと

* 凝ったアニメーション
* Markdownプレビュー
* タグ機能
* 複雑な検索
* 自動同期
* 通知
* 複数端末同期

---

# 15. 状態表示ラベル案

GitHubステータス：

not_uploaded:
未アップロード

uploaded:
アップロード済み

modified_after_upload:
アップロード後に変更あり

failed:
アップロード失敗

Googleタスク状態：

not_exported:
タスク未出力

exported:
タスク出力済み

failed:
タスク出力失敗

Googleカレンダー状態：

not_exported:
予定未出力

exported:
予定出力済み

failed:
予定出力失敗

MVPではGoogle出力ボタンは作らないが、状態カラムは持っておく。

---

# 16. 実装フェーズ案

## フェーズ0：設計確認

* この設計書を読む
* 必要ライブラリを確認する
* Expoプロジェクト構成を提案する
* SQLite設計を確認する
* 作成予定ファイル一覧を出す
* 懸念点を出す

この段階ではコード変更しない。

---

## フェーズ1：Expo初期構成

* Expoプロジェクト作成
* TypeScript設定
* 基本画面遷移
* 最低限の画面だけ作る

対象画面：

* メモ一覧
* メモ作成
* メモ詳細
* メモ編集
* 設定

---

## フェーズ2：SQLite保存

* SQLite導入
* migrations作成
* memosテーブル作成
* ai_outputsテーブル作成
* settingsテーブル作成
* メモ作成
* メモ一覧
* メモ詳細
* メモ編集
* 論理削除

---

## フェーズ3：カテゴリと状態表示

* カテゴリ定義
* カテゴリ選択UI
* GitHubステータス表示
* Google出力状態の内部管理
* 一覧の表示改善

---

## フェーズ4：GitHub設定

* GitHub owner保存
* GitHub repo保存
* GitHub branch保存
* GitHub tokenをSecureStore保存
* token伏せ字表示

---

## フェーズ5：GitHub手動アップロード

* GitHub APIクライアント作成
* カテゴリ別保存パス生成
* 日付別連番採番
* Markdown生成
* 初回アップロード
* 既存ファイル更新
* github_sha保存
* エラー保存
* 再アップロード

---

## フェーズ6：MVP仕上げ

* 削除確認ダイアログ
* エラー表示
* 空状態表示
* ローディング表示
* 画面の文言調整
* 実機確認
* 最低限のテスト観点整理

---

# 17. 完了条件

MVP完了条件：

1. スマホでメモを作成できる
2. SQLiteに保存される
3. アプリを再起動してもメモが残る
4. メモ一覧に表示される
5. メモ詳細を開ける
6. メモを編集できる
7. メモを削除できる
8. 削除前に確認ダイアログが出る
9. カテゴリを選べる
10. GitHub設定を保存できる
11. GitHubトークンがSecureStoreに保存される
12. メモ詳細からGitHubへ手動アップロードできる
13. カテゴリ別フォルダにMarkdown保存される
14. ファイル名がYYYY-MM-DD-001.md形式になる
15. 同じカテゴリ・同じ日付では連番が増える
16. アップロード済み状態が表示される
17. アップロード後に編集すると「アップロード後に変更あり」になる
18. 再アップロード時は既存ファイルが更新される
19. アップロード失敗時、メモ本文は消えない
20. アップロード失敗時にエラー内容が保存・表示される
21. AIアウトプット用テーブルが作成されている
22. Google出力状態を保存できるカラムがある

---

# 18. Claude Codeへの最初の返答でほしいもの

最初の返答では、以下を報告してください。

1. この設計で問題ないか
2. 追加で決めるべきこと
3. 推奨ライブラリ
4. 推奨ディレクトリ構成
5. SQLiteテーブル設計の修正案
6. 実装フェーズの順番
7. 作成予定ファイル一覧
8. 実装時の注意点
9. セキュリティ上の注意点
10. 最初に着手すべき具体作業

まだコード変更はしないでください。
