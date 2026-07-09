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

* 実装前の方針が文書化されている
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
* Gitに上げる候補と上げないメモが分けられる

## Phase 3：Markdownプレビュー

やること。

* Markdown本文保存
* Markdownプレビュー表示
* 編集とプレビューの切り替え
* コードブロック表示

完了条件。

* ChatGPT整理結果が読みやすく表示できる

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

* 保存済みメモが後から探せる

## Phase 6：Markdown書き出し

やること。

* メモ単体のMarkdown書き出し
* 保存先フォルダ指定
* ファイル名自動生成
* export_path保存
* exported_at保存

完了条件。

* Gitに上げたいメモがMarkdownとして出力できる

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

## Phase 8：カテゴリ・テンプレートDB管理（2026-07-06 追加仕様で再整理）

旧Phase 8（ダッシュボード化）はPhase 12の将来拡張候補へ移動した。

やること。

* note_categoriesテーブル追加
* note_templatesテーブル追加
* 既存10カテゴリ・テンプレート・ChatGPT整理プロンプトのseed
* DB優先・コード固定定義fallbackへの切り替え

完了条件。

* カテゴリ・テンプレートがDBから読まれる
* DBが空でもfallbackで従来通り動く

仕様：`12-template-db-management.md`、`03-data-model.md`

## Phase 9：テンプレート管理画面

やること。

* カテゴリ管理画面
* テンプレート管理画面
* カテゴリごとの複数テンプレート対応
* 初期状態に戻す機能（カテゴリ単位・テンプレート単位・全体）
* Codex / Claude Code依頼プロンプトのテンプレート保存

完了条件。

* コード修正なしでプロンプト・テンプレートを編集できる
* 崩れた設定を初期状態に戻せる

仕様：`12-template-db-management.md`

## Phase 10：スマホ閲覧用HTML/JSONエクスポート

やること。

* docs/mobile-view/（index.html / notes-data.json）出力
* 安全条件による対象限定（Git候補true・visibility=git_candidate・公開許可カテゴリ）
* 出力対象確認画面
* スマホ閲覧ページの検索・絞り込み
* 簡易Markdown表示
* コピーボタン

完了条件。

* 安全なメモだけがHTML/JSONに出力される
* スマホから閲覧・検索・コピーができる

仕様：`13-mobile-view-export.md`

## Phase 11：スマホ用プロンプト集HTML

やること。

* 初期10プロンプトの掲載
* プロンプトコピー機能
* 短期方針（2026-07-06決定）：note_templatesのDB化を待たず、コード固定プロンプト定義（chatgptPrompts.ts）からdocs配下へHTMLを生成する。note_templates実装後に出力元をDBへ切り替える

完了条件。

* 外出先のスマホからプロンプトをコピーしてChatGPT / Geminiで使える

仕様：`14-mobile-prompt-hub-and-inbox.md`（生成方式は §1.6）

※短期方針によりPhase 8〜9への依存がなくなったため、Phase 11は先行着手できる。

## Phase 12：Android APK版ビルド（2026-07-06 端末別運用方針で追加）

自分（Android端末）用に、開発サーバーなしで動くAPKをビルドしてアプリとしてインストールする。家族（iPhone）はアプリ配布せず、Phase 10のスマホ閲覧用HTML/JSONで閲覧する。

ビルド方式は決定済み（2026-07-06）：EASクラウドビルド（profile: preview / internal distribution / APK形式）、SDK 54を正式採用候補として進める（`16-platform-and-distribution.md` 2.3〜2.4）。

やること（2026-07-07更新：eas.json / app.json整備・確認項目整理・JSONインポート仕様確定まで完了）。

* [完了] eas.json作成・app.json整備（パッケージ名は仮置き com.ykjob.flowdock）
* [完了] APK初版の機能範囲・確認チェックリスト整理（`16-platform-and-distribution.md` 2.5）
* [完了] JSONインポートの仕様確定（`18-json-import-export.md`）
* EASアカウント準備（ユーザー操作：eas-cli login / build:configure）
* EASクラウドビルドでAPK生成、Android実機へのインストール
* 確認チェックリスト実施（オフライン利用・再起動後保持含む）
* JSONインポート実装（実装時期は未定）
* テンプレート管理の動作確認（Phase 8〜9実装後）

完了条件。

* 開発サーバーなしでAndroid実機上でメモ作成・編集ができる
* オフラインで利用できる

仕様：`16-platform-and-distribution.md`

※Phase 8〜11との実施順は固定しない。着手タイミングはユーザー判断。

## Phase 13：将来拡張（旧Phase 12）

候補（詳細は `15-future-and-rejected-policies.md`）。

* ダッシュボード化（旧Phase 8：最近更新メモ、プロジェクト別最新メモ、Git候補一覧、未整理メモ一覧、次回再開メモ一覧）
* Supabase同期
* OpenAI API連携
* ワンコマンド更新スクリプト
* カテゴリ自由追加
* テンプレートのエクスポート・インポート
* mobile-inboxのGitHub連携
* 家事DB・月次作業アナウンス・自分のWebページ拡張
* ChatGPT共有受け取り
* 添付ファイル管理
* 画像管理
* 音声メモ
* 配布用リポジトリの整備・配布用データエクスポート機能（配布・共有方針は決定済み：`17-distribution-and-sharing.md`。リポジトリ作成タイミング・エクスポート機能は将来判断）

※「スマホ対応（アプリとしての対応）」は端末別運用方針（2026-07-06）で整理済み：Android APK版はPhase 12で採用、iPhone向けアプリ配布は不採用（`16-platform-and-distribution.md`）。

## Phase 14：現場適応モード（追加仕様）

未経験者・訓練校生・SES配属直後向けの作業支援モードを追加する。仕様は `20`〜`23`。

やること。

* 5場面導線（作業開始／詰まり記録／質問文作成／進捗報告作成／終業前メモ）
* 翌朝の再開導線（終業前メモの翌朝表示→作業開始への接続。5場面とは別）
* 現場プロファイル（単一現場で成立する範囲）
* 生成テキストのコピー、守秘チェックの導線組み込み

MVP優先。

* 作業開始／詰まり記録／終業前メモ・翌朝再開を先行実装
* 質問文作成／進捗報告作成は次点

完了条件。

* 「作業開始→終業前メモ→翌朝再開」の1日ループが回せる
* 既存notes再利用で破壊的変更なしに保存・参照できる

仕様：`20`〜`23`。データ方針は既存notes再利用が第一候補（`22`）。UI詳細フローの正本は `21`。
