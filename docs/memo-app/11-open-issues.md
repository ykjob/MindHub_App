# 未確定事項

## 1. 技術構成

確認結果（2026-07-03 実装時確認）。

* MindHub_App（リポジトリ名。アプリ内部名は FlowDock）は Expo SDK 56 / React Native 0.85 / expo-router 構成
* ルーティングは expo-router（ファイルベース）
* 既存保存方式は expo-sqlite（`flowdock.db`、memos / ai_outputs / settings テーブル、schema_version=1）
* 既存メモ機能あり（body + category のみの軽量メモ、GitHub手動アップロード連携付き）
* PC用Webアプリとしては `npx expo start --web`（react-native-web）で動かす

## 2. SQLite導入

決定（実装時仮置き）。

* 既存の expo-sqlite をそのまま使う
* マイグレーションは settings テーブルの schema_version 方式を踏襲し、v2 で notes テーブルを追加
* DBファイルは既存と同じ `flowdock.db`（Webでは OPFS / IndexedDB 上に保存される）

未確定。

* Web実行時のDB実体はブラウザ内ストレージにあり、PythonスクリプトやエクスプローラーからDBファイルへ直接アクセスできない。一括書き出しスクリプト（Phase 7）をWeb版DBに対してどう動かすかは未確定（案：アプリ側にDBエクスポート機能を追加する / ネイティブ実行時のDBファイルを対象にする）

## 3. Markdownプレビュー

決定（実装時仮置き）。

* 外部Markdownライブラリは追加せず、自作の軽量レンダラー（見出し・箇条書き・番号付きリスト・コードブロック・区切り線・強調・リンク対応）で実装
* 理由：react-native-markdown-display 等はメンテが停滞しており React 19 / RN 0.85 との互換リスクがあるため。将来必要になれば置き換え可能なコンポーネント境界にしてある

未確定。

* テーブル・画像などの拡張記法への対応要否

## 4. ファイル書き出し

決定（実装時仮置き）。

* Webアプリではセキュリティ制約上、任意フォルダへの直接書き込みができない
* 代替案として、ブラウザのダウンロード機能でMarkdownファイルをダウンロードする方式を採用
* 推奨出力先パス `docs/notes/{project}/{date}_{type}_{slug}.md` は画面に表示し、`export_dir` / `export_filename` / `export_path` / `exported_at` としてDBに記録する
* ユーザーはダウンロードしたファイルを表示されたパスへ手動配置する運用

未確定。

* File System Access API（Chromium系のみ対応）でフォルダ指定書き出しに対応するか
* 将来的にデスクトップアプリ化（Tauri / Electron）するか

## 5. Git候補一括書き出し

現状。

* `scripts/export_git_notes.py` の土台を作成済み（--db でSQLiteファイルパスを指定する前提、--dry-run / --only-git-candidates / --project / --type 対応）
* ただし上記2の通り、Web実行時のDBファイルにPythonから直接アクセスできないため、実運用にはDBファイルの取り出し手段が必要（Phase 7未完了タスク）

## 6. 推奨タグ

決定（実装時仮置き）。

* 初期実装では手動入力＋過去タグ候補表示のみ
* 本文からの自動抽出は行わない

## 7. ダッシュボード

現状。

* 初期実装ではダッシュボードは作らず、notes一覧（検索・絞り込み付き）を入口とする
* Phase 8で対応

## 8. MindHub_App既存機能との統合

決定（実装時仮置き）。

* 既存メモ機能（memos テーブル / `/memo/*` 画面 / GitHubアップロード）は一切変更せず残す
* 新メモ管理機能は notes テーブル / `/notes/*` 画面として並列に追加
* ホーム画面（既存メモ一覧）のヘッダーに「ノート」ボタンを追加して導線とする（既存機能への変更はこのボタン追加のみ）

未確定。

* 既存memosデータをnotesへ移行・統合するか
* 将来的に既存メモ機能を廃止してnotesに一本化するか

## 9. カテゴリ・テンプレートDB管理（2026-07-06 追加仕様。確認待ち）

* note_categories / note_templates の実装タイミング（schema v3としていつマイグレーションするか）
* 既存コード固定カテゴリ定義（src/features/notes/noteCategories.ts、chatgptPrompts.ts）との移行方法（seed後にコード定義をfallback専用に縮小するか、当面二重管理するか）
* テンプレート管理画面の画面構成（設定画面をどこに置くか。既存 /notes 配下か新規 /settings 配下か）
* note_templatesのprompt_bodyとtemplate_bodyを1レコードで持つか分離するか（追加仕様は1レコード案）

## 10. スマホ閲覧用HTML/JSON（2026-07-06 追加仕様。確認待ち）

* スマホ閲覧HTMLの生成方式（アプリ内でHTML文字列を組み立ててダウンロードするか、テンプレートHTML＋JSON読み込み方式にするか）
* notes-data.jsonの具体的な形式（フィールド構成、Markdown本文をそのまま入れるか）
* Web版DB（ブラウザ内OPFS）からの出力手段（既存Phase 7のDBアクセス問題と共通）
* GitHub Pagesへの配置方法（リポジトリのPages設定、docs/配下公開の可否。※このリポジトリを公開するかどうか自体の確認が必要）
* 自分のWebページへ移す場合の構成
* private情報を扱う将来案（就活終了後に検討。認証方法など）
* スマホ用プロンプト集HTML（14）の生成方式 →【決定済み 2026-07-06】短期は(b)を採用：note_templatesのDB化を待たず、コード固定プロンプト定義（chatgptPrompts.ts）からdocs配下へスマホ閲覧用HTMLを生成する。将来、note_templates実装後に出力元をDBへ切り替える（14 §1.6に反映済み）。出力先・起動方法も確定（2026-07-06実装済み：docs/mobile-view/prompts.html、npm run generate:prompt-hub）。残る未確定：14 §1.3の不足5プロンプト（時間帯別タスク化・Googleタスク整形・カレンダー整形・優先順位整理・Codexレビュー依頼）の本文作成と追加方法（コード追加か、note_templates実装後にDBへ追加か）

## 11. その他（2026-07-06 追加仕様。確認待ち）

* Supabase同期を検討するタイミング（検討条件は 15-future-and-rejected-policies.md 参照）
* 既存00-overview.mdの「スマホ確認はGitHubアプリで代用」記述は、13-mobile-view-export.mdの方針で置き換え済み（01-decisions-and-scope.mdに反映）。00-overview.md本文の全面改稿は今回見送り

## 12. Android APK版・iPhone Web閲覧版（2026-07-06 端末別運用方針）

方針は決定済み（`16-platform-and-distribution.md`）。

決定済み（2026-07-06）。

* APKのビルド方式：初回はEASクラウドビルドで進める（profile: preview / internal distribution / APK形式）。ローカルビルド（Android Studio / Gradle / Java環境整備）は重いため後回し
* ビルド対象のSDKバージョン：SDK 54を正式採用候補のまま進める（SDK 56固有機能は未使用。SDK 54でtsc・Webバンドル・expo-doctor合格）。SDK 56へ戻す・上げる判断はSDK 56固有機能が必要になった時に再検討

残る未確定。

* JSONインポートの仕様：何をインポートするか（PC Web版のnotesデータをAndroid APK版へ移すためのエクスポート/インポートか、notes-data.jsonの取り込みか）、ファイル形式、ID重複時の扱い（上書き / スキップ / 複製）、インポート画面の場所。PC側に対応するJSONエクスポート機能も未実装
* Android APK版初版に含める機能範囲：テンプレート管理（Phase 8〜9）とJSONインポートを初版に含めるか、まず現行機能のみでAPK化して動作確認を先行するか
* EASアカウントの準備状況（Expoアカウントでのログインが必要）、Androidパッケージ名
* check-expo-sdk54ブランチのmainへのマージタイミング（SDK 54正式採用候補の決定を受けて）

## 13. 配布・共有方針（2026-07-06 追加）

三区分（自分用・家族用・配布用）の方針は決定済み（`17-distribution-and-sharing.md`）。

決定済み（2026-07-06）。

* 家族用の公開範囲：家族間の決まり事・家庭内マニュアルは公開GitHub Pagesに置かない。公開GitHub Pagesに出してよいのは公開されても困らない内容だけに限定する
* familyカテゴリを追加する。ただし公開可否はカテゴリだけで判定せず、visibilityを併用する。category = family でも visibility = private / family のものは公開GitHub Pagesに出さない（04 / 03 / 13に反映済み）
* 配布用は別リポジトリに分ける。汎用テンプレート・汎用知識データ・サンプルデータ・説明書だけを含め、個人情報・家族情報・家庭内ルール・自分用の完全DBは含めない
* 配布物の範囲：まずWeb / PWA・JSON・説明書を優先する。配布用APK・ソース公開は将来候補とし、初期必須にはしない

残る未確定。

* 家庭内情報の共有手段をどれから着手するか：非公開配置先、ローカルHTML共有、PDF、JSONインポート、将来のprivate向けPWA
* familyカテゴリ・visibility = family値の実装タイミング：コード固定定義（noteCategories.ts等）へ先行追加するか、note_categories（Phase 8）実装時に合わせるか
* 配布用リポジトリの名称・構成・作成タイミング
* 配布用データエクスポート機能の仕様（将来候補。当面は手動選別）
