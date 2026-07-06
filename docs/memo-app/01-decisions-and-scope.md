# 決定事項とスコープ

## 1. 決定事項

現時点の決定事項は以下。

* MindHub_Appをベースにする
* 最初はPC用Webアプリとして作る
* 普段の思考メモも保存対象に含める
* データ保存にはSQLiteを使う
* 本文はMarkdown形式を基本にする
* Markdownプレビューを入れる
* ChatGPTとの連携はAPIではなくプロンプトコピー運用にする
* ChatGPT側に形式を記憶させない
* アプリ側にカテゴリ別の整理プロンプトを持たせる
* Git自動pushは初期実装では行わない
* Gitに上げたいメモはアプリ上で候補として選べるようにする
* Git候補メモはMarkdownとして書き出せるようにする
* 削除は完全削除ではなくアーカイブ方式にする
* プロジェクト名は自由入力と候補選択の両方に対応する
* タグも自由入力と候補選択の両方に対応する
* スマホ確認はスマホ閲覧用HTML/JSONで行う（当初の「GitHubアプリで代用する」方針は2026-07-06の追加決定で置き換え。`13-mobile-view-export.md` 参照）

## 1.2 追加決定事項（2026-07-06）

追加仕様（`12-template-db-management.md` 〜 `15-future-and-rejected-policies.md`）により、以下を決定事項として追加する。

採用。

* カテゴリ・テンプレートをDB管理にする（note_categories / note_templates）
* テンプレート管理画面を作る
* カテゴリごとに複数テンプレートを持てるようにする
* カテゴリ・テンプレートを初期状態に戻す機能を持たせる
* Codex / Claude Code依頼プロンプトをテンプレートとして保存できるようにする
* スマホ閲覧用HTML/JSON（docs/mobile-view/）を出力できるようにする
* スマホ閲覧対象は安全なメモ（archived_at IS NULL かつ is_git_candidate = true かつ visibility = git_candidate かつ公開許可カテゴリ）だけに限定する
* HTML/JSON出力前に出力対象確認画面を設ける
* スマホ閲覧ページに検索・絞り込み・簡易Markdown表示・コピーボタンを付ける
* スマホ用プロンプト集HTMLを作る
* mobile-inbox運用を採用する。ただし初期は保存場所を作らずChatGPT送信で代用する
* GitHub Pagesまたは将来自分のWebページに配置できる構造にする
* 自動pushはしない。手動push運用を基本にする

将来候補（`15-future-and-rejected-policies.md` 参照）。

* Supabase同期
* OpenAI API連携
* ワンコマンド更新スクリプト
* カテゴリ自由追加
* テンプレートのエクスポート・インポート
* mobile-inboxのGitHub連携
* ダッシュボード（旧Phase 8）
* 家事DB・月次作業アナウンス・自分のWebページ拡張
* private情報も扱えるスマホ閲覧方法

不採用（`15-future-and-rejected-policies.md` 参照）。

* アプリ内GitHub自動push
* Codexによる日常的なスマホ入力取り込み
* スマホからSQLite直接共有

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

仕様と実装が食い違う場合は、実装を優先し、仕様書またはタスクリストを更新する。

未確定事項は勝手に決定せず、`docs/memo-app/11-open-issues.md` に記録する。
