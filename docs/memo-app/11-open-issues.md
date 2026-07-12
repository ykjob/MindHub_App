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

決定済み・整理済み（2026-07-07追加分）。

* JSONインポートの仕様：`18-json-import-export.md` で具体化済み（形式・schemaVersion・重複ID処理・件数表示・責務分担）。実装は未着手
* APK初版の機能範囲：現行機能のみで作る。テンプレート管理・JSONインポートは初版に含めない。確認チェックリストと既知の制約（アプリ内コピー・Markdown書き出しはWeb専用実装のためAPKでは動かない想定）は16 §2.5に整理済み
* eas.json / app.json整備済み
* Androidパッケージ名は `com.ykjob.mindhub` で確定（2026-07-07決定。アプリ全体がFlowDock単体でなくメモ管理・プロンプト集・家族共有・配布用データ等を含む方向のため。表示名 / slug / scheme はFlowDockのまま変更しない）

残る未確定。

* EASアカウントの準備（Expoアカウントでの `npx eas-cli login`、`eas build:configure` によるprojectId付与はユーザー操作待ち）
* JSONインポートの実装時期と、Android側ファイル選択の依存（expo-document-picker等）導入判断（18 §7参照）
* check-expo-sdk54ブランチはmainへマージ済み（2026-07-06解消）

## 13. 配布・共有方針（2026-07-06 追加）

三区分（自分用・家族用・配布用）の方針は決定済み（`17-distribution-and-sharing.md`）。

決定済み（2026-07-06）。

* 家族用の公開範囲：家族間の決まり事・家庭内マニュアルは公開GitHub Pagesに置かない。公開GitHub Pagesに出してよいのは公開されても困らない内容だけに限定する
* familyカテゴリを追加する。ただし公開可否はカテゴリだけで判定せず、visibilityを併用する。category = family でも visibility = private / family のものは公開GitHub Pagesに出さない（04 / 03 / 13に反映済み）
* 配布用は別リポジトリに分ける。汎用テンプレート・汎用知識データ・サンプルデータ・説明書だけを含め、個人情報・家族情報・家庭内ルール・自分用の完全DBは含めない
* 配布物の範囲：まずWeb / PWA・JSON・説明書を優先する。配布用APK・ソース公開は将来候補とし、初期必須にはしない

決定済み・整理済み（2026-07-07追加分）。

* familyカテゴリ・visibility = family値はコード固定定義へ先行追加済み（noteTypes.ts / noteCategories.ts / chatgptPrompts.ts。DBマイグレーション不要を確認）。note_categories（Phase 8）実装時はこの定義をseed元にする
* 公開GitHub Pages出力可否の判定は mobileViewPolicy.ts に先行実装済み（Phase 10で使用予定）

残る未確定。

* 家庭内情報の共有手段をどれから着手するか：非公開配置先、ローカルHTML共有、PDF、JSONインポート、将来のprivate向けPWA
* 配布用リポジトリの名称・構成・作成タイミング
* 配布用データエクスポート機能の仕様（将来候補。当面は手動選別）

## 14. 現場適応モード（確認待ち）

* 生成した質問文・報告文・再開メモを notes に保存するか、コピーのみに留めるか（初期はコピー中心。`22` 8章 / `23`）
* 入口・画面の配置（ホーム／`app/notes`配下／新規ルート `app/workplace/*`。`21` 9章）
* 現場プロファイルの保存構造（案A notes再利用のタグ運用か、将来の案B/C移行か。`22`）
* 場面タグ・現場タグの具体的な命名（workplace_* を採用するか等。`04` 1.2 / `22` 4章）
* 複数現場切り替えの実装時期（初期は単一現場。`20` 7.2）
* 将来スマホで現場適応モードの内容（現場ルール・再開メモ等）を確認できるようにする場合でも、公開GitHub Pagesには現場情報を出さない。スマホ閲覧を実装する場合は、非公開チャネル・ローカル閲覧・認証付き環境など、公開配布（`13-mobile-view-export.md` / `17-distribution-and-sharing.md`）と分離した方法を検討する。具体的な方式は未確定（守秘方針の正本は `23` §7・§3.1）

## 15. 開発リファレンス（確認待ち）

開発リファレンス（`24-development-reference.md`）は現場適応モードとは別機能の補助参照。方針は `24` を正本とする。

決定済み（2026-07-10）。

* 初期実装は案A（専用画面・固定データ画面・新規ルートを作らず、`command` カテゴリで運用）を正式採用（`24` §6.1）
* 参照用タグは `dev-ref` で確定（旧「命名未確定」を解消。`04` §1.3 / `24` §6）
* 登録候補は `25-development-reference-candidates.md` に整理済み（31件、高優先度7件を先行登録候補として明記）

決定済み（2026-07-12）。

* 目的を2本柱（柱1＝技術リファレンス、柱2＝現場理解カード）に拡張（`24` §1）。案Aの枠（専用画面・新規ルート・DB変更なし、`command`＋`dev-ref`）は不変
* 現場理解カードG-01〜G-20を追加（一覧は `25` §10、登録用本文は `27-development-reference-fieldwork-cards.md`）
* 現場理解カードのサブ観点タグは6種で確定（onboarding / ask-report / troubleshoot / git-db / security / closing。`25` §10.3）。旧「サブタグ併記するか」の未確定はG側について解消。R側（例 `dev-ref,expo`）は引き続き任意
* GカードのGit候補は `command` 初期値どおり true（20枚とも汎用内容のみ。G-17/G-18も本文は汎用判断基準に限定。`25` §10.4）
* 面接質問プロンプトは開発リファレンスの対象外（`25` §7）

残る未確定。

* R側（技術リファレンス）にサブ観点タグ（例 `dev-ref,expo` `dev-ref,git`）を併記するか（検索性を見て判断。`25` §2・§8）
* Gカード20枚のDB登録の実施タイミングと順序（高優先5枚から始めるか、20枚まとめてか。`25` §10.5 / §8-5。ユーザーの手動登録）
* `command` カテゴリの既存メモと、開発リファレンス用途の登録メモを区別するか（区別する場合の方法。当面は区別せず登録基準（`24` §5）と `dev-ref` タグで運用）
* 専用の一覧・検索画面／専用テーブルを作る時期（初期は作らない。実運用で「手が止まる回数が多い」「既存notes運用では探しにくい」と確認できてから。`24` §7）
* 現場適応モードの詰まり記録・質問文作成からリファレンスへ横断参照する導線の要否・時期（将来候補。`24` §7）
