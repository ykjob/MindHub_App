# 開発リファレンス 登録候補一覧

本ファイルは、開発リファレンス（`24-development-reference.md`）にDB登録する候補を整理した一覧である。
方針の正本は `24`、本ファイルは候補の作業用リスト。登録可否・登録順の判断材料として使う。

作成：2026-07-10（案A正式採用・候補31件整理）。本時点ではDB登録・コード変更は行っていない。

## 1. 確定した方針（案A）

先の調査（案A / 案B比較）を踏まえ、開発リファレンスは**案A**を正式方針とする。

* 開発リファレンス専用画面は作らない（固定データ画面・`app/reference` などの新規ルートも作らない）
* 既存 `notes` の `command` カテゴリ（`04-categories-and-tags.md` §1「コマンド・手順」type=command）で運用する
* 参照用タグは **`dev-ref`** を使う（2026-07-10 決定。旧「命名未確定」は解消。`11-open-issues.md` §15 / `04` §1.3）
* 専用DB・専用テーブル・schema変更は行わない（`03-data-model.md` の schema_version 方式に従い、当面は変更なし）
* 現場適応モード（`20`〜`23`）とは別機能。5場面には数えない補助参照（`24` §2）

## 2. 運用ルール

* 登録先：`/notes` でカテゴリ `command`、タグに `dev-ref` を付けて登録する
* 参照方法：既存 `/notes` の一覧・検索・絞り込み（タグ `dev-ref`）・Markdownプレビュー・コピーを使う。専用UIは作らない
* 登録基準（`24` §5）：実際に手が止まった／2回以上調べた／1分以内に見返したい／コピペか短い確認で作業へ戻れるもの
* 除外（`24` §4）：現場固有のシステム名・顧客名・内部URL・業務手順・機密（認証情報・接続文字列など）は登録しない
* Git候補・公開：`command` の初期値（`04` §2、Git候補 true）に従うが、登録内容は上記除外により汎用的な内容に限られる。現場適応モードの守秘既定強制（`23` §6.1、private/false 上書き）とは独立
* 検索性のため、必要に応じて `dev-ref` にサブ観点タグを併記してよい（例 `dev-ref,expo` `dev-ref,git`）。サブタグの整備方針は未確定（`11` §15）

## 3. 最初にDB登録する候補（優先度：高／7件）

作業復帰に直結する、または絶対ルールにあたる7件。まずこの7件から登録する。
一覧：R-01 / R-02 / R-03 / R-04 / R-09 / R-14 / R-15。

### R-01 実装したら `tsc --noEmit` → `expo export --platform web`
* **見るタイミング**：コードを変更した後、コミット可否を判断する前
* **MindHub_Appでの具体例**：workplace追加・prompt hub変更・SDK54調査のいずれもこの2コマンドの合格を締めにしてから完了扱いにした
* **この手順の意味**：型エラーとWebバンドル切れを早期に潰す最小合格ライン。ブラウザ実操作確認はこの後の別工程
* **現場で置き換えるポイント**：現場では「コミット前に必ず走らせる最小チェック（型／ビルド／lint／test）」に置き換える
* **関連コマンド**：`npx tsc --noEmit` / `npx expo export --platform web`
* **関連ファイル**：（プロジェクト全体）
* **優先度**：高

### R-02 保存が「無反応」のときの確認順
* **見るタイミング**：ボタンを押しても何も起きない／DBに入らない時
* **MindHub_Appでの具体例**：iPhoneで保存が無反応→原因は `generateId()` の例外を空catchが握り潰していた
* **この手順の意味**：「無反応」は成功でも失敗表示でもない＝例外の握り潰しをまず疑うサイン
* **現場で置き換えるポイント**：空catch・握り潰しログ・エラー非表示を探す手順は言語・現場を問わず有効
* **関連コマンド**：（grep）空の `catch {}` を探す
* **関連ファイル**：[src/utils/id.ts](../../src/utils/id.ts)、[app/notes/create.tsx](../../app/notes/create.tsx)
* **優先度**：高

### R-03 ID生成は expo-crypto（`crypto.randomUUID` はWeb専用）
* **見るタイミング**：UUID・IDを生成するコードを書く／実機だけ落ちる時
* **MindHub_Appでの具体例**：`crypto.randomUUID()` がiOSのHermesに無く例外→保存失敗。既存memoも同時に壊れていた。`expo-crypto` で解消
* **この手順の意味**：ブラウザ前提のグローバルAPIを実機で使うと落ちる典型例
* **現場で置き換えるポイント**：現場でも「Web専用APIを実行環境（モバイル／サーバー）で使っていないか」の確認観点に置き換える
* **関連コマンド**：`npx expo install expo-crypto`
* **関連ファイル**：[src/utils/id.ts](../../src/utils/id.ts)
* **優先度**：高

### R-04 ネイティブのコピーは expo-clipboard
* **見るタイミング**：コピー機能を追加する／APKでコピーが効かない時
* **MindHub_Appでの具体例**：`navigator.clipboard`（Web専用）のままでAPK上のコピーが失敗。`expo-clipboard` でネイティブ分岐して解消
* **この手順の意味**：Web実装をそのまま実機に載せると無言で失敗する
* **現場で置き換えるポイント**：現場では「ブラウザAPIとネイティブ／サーバーAPIの分岐が要る機能」の一覧に置き換える
* **関連コマンド**：`npx expo install expo-clipboard`
* **関連ファイル**：[src/utils/clipboard.ts](../../src/utils/clipboard.ts)
* **優先度**：高

### R-09 DB変更は schema.ts ＋ migrations.ts（schema_version 方式）
* **見るタイミング**：テーブル・カラムを足す時
* **MindHub_Appでの具体例**：notesテーブルは schema v2 として追加し、既存 memos/settings は無変更にした
* **この手順の意味**：既存テーブルの破壊的変更を避け、バージョン管理で安全に移行するための固定ルール
* **現場で置き換えるポイント**：現場のマイグレーション手順（migrationファイル・バージョン採番・ロールバック）に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[src/db/schema.ts](../../src/db/schema.ts)、[src/db/migrations.ts](../../src/db/migrations.ts)
* **優先度**：高

### R-14 commit / push はユーザー指示後のみ
* **見るタイミング**：作業完了時、コミット判断をする時
* **MindHub_Appでの具体例**：仕様・実装のどのタスクも「コミット・pushは未実施（確認待ち）」で止めている
* **この手順の意味**：意図しない公開・情報混入を防ぐ境界。勝手にリポジトリ状態を変えない
* **現場で置き換えるポイント**：現場のブランチ運用・PR前確認・レビュー必須ルールに置き換える
* **関連コマンド**：`git status` / `git log --oneline`（状態確認まで）。コミットは指示後
* **関連ファイル**：[CLAUDE.md](../../CLAUDE.md)
* **優先度**：高

### R-15 既存機能を壊さない（memos / memo / GitHub連携は追加のみ）
* **見るタイミング**：既存に触れそうな変更を設計する時
* **MindHub_Appでの具体例**：新機能は notes / `app/workplace/*` / `app/prompts/*` として並列追加し、既存導線は無変更にした
* **この手順の意味**：既存の動作保証を壊さないための前提。破壊的変更は実装せず `11-open-issues.md` に記録して確認待ちにする
* **現場で置き換えるポイント**：現場では「既存機能の回帰を出さない」「影響範囲を新規追加に限定する」判断に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[CLAUDE.md](../../CLAUDE.md)
* **優先度**：高

## 4. 優先度サマリ（中・低）

* **中（18件）**：R-05 / R-06 / R-07 / R-08 / R-10 / R-11 / R-13 / R-16 / R-17 / R-18 / R-19 / R-20 / R-22 / R-25 / R-26 / R-27 / R-29 / R-30
* **低（6件）**：R-12 / R-21 / R-23 / R-24 / R-28 / R-31

## 5. 候補詳細（残り24件・テーマ別）

### 5.1 Expo / React Native / Expo Router

#### R-05 KeyboardAvoidingViewが効かない環境がある
* **見るタイミング**：保存ボタンがキーボードに隠れる／KAVを入れても動かない時
* **MindHub_Appでの具体例**：Expo Go SDK54（新アーキ）＋native-stackでKAV・keyboard高さpadding方式が不安定。iOSはInputAccessoryViewでキーボード直上に固定して解消
* **この手順の意味**：環境依存でUI回避策が効かないことがある、という既知の落とし穴
* **現場で置き換えるポイント**：現場では「環境固有の既知不具合と回避策」を1件ずつ貯める枠に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[src/components/FormFooterBar.tsx](../../src/components/FormFooterBar.tsx)、[src/components/NoteForm.tsx](../../src/components/NoteForm.tsx)
* **優先度**：中

#### R-06 InputAccessoryViewは遷移完了後にマウントする
* **見るタイミング**：作成画面だけキーボード直上バーが出ない時
* **MindHub_Appでの具体例**：「編集は出る／作成は出ない」の差は遷移アニメ中マウント。`InteractionManager.runAfterInteractions` で遷移後に出して解消
* **この手順の意味**：画面遷移アニメ中のマウントはキーボード登録に失敗する、という非自明な原因
* **現場で置き換えるポイント**：現場では「ライフサイクル／タイミング依存の初期化不具合」の確認観点に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[src/components/FormFooterBar.tsx](../../src/components/FormFooterBar.tsx)
* **優先度**：中

#### R-07 RN WebのAlertは複数ボタン非対応
* **見るタイミング**：確認ダイアログ・複数ボタンAlertを書く時
* **MindHub_Appでの具体例**：`Alert.alert` の複数ボタンがRN Webで効かず、`dialog.ts`（window.confirm/alert）に分岐した
* **この手順の意味**：同じAPIでもプラットフォームで挙動が違う（Webで無言で動かない）
* **現場で置き換えるポイント**：現場では「プラットフォーム差でUIが動かない箇所」の一覧に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[src/utils/dialog.ts](../../src/utils/dialog.ts)
* **優先度**：中

#### R-08 新画面追加の手順（expo-router）
* **見るタイミング**：新しい画面／ルートを足す時
* **MindHub_Appでの具体例**：workplace・promptsとも `app/配下にファイル`＋`_layout.tsx` に `Stack.Screen` を1行追加で対応。既存行は無変更
* **この手順の意味**：ファイルベースルーティングの追加は「ファイル＋タイトル登録」の2点セット
* **現場で置き換えるポイント**：現場のルーティング登録手順（ルート定義・ナビゲーション登録）に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[app/_layout.tsx](../../app/_layout.tsx)
* **優先度**：中

#### R-12 SDKバージョン変更で必要だったこと
* **見るタイミング**：Expoバージョンを変える／`npm install` が失敗する時
* **MindHub_Appでの具体例**：expo-router v6のpeerに expo-constants / expo-linking の直接追加が必要。tsconfigの `ignoreDeprecations:"6.0"` がTS5.9で無効→baseUrlごと削除
* **この手順の意味**：メジャー依存を動かすと peer依存とツール設定の追随が要る
* **現場で置き換えるポイント**：現場では「フレームワーク／SDK更新時に付随して直す設定」のチェックリストに置き換える
* **関連コマンド**：`npx expo install --fix`
* **関連ファイル**：[package.json](../../package.json)、[tsconfig.json](../../tsconfig.json)
* **優先度**：低

### 5.2 DB / SQLite / schema

#### R-10 値の追加はマイグレーション不要
* **見るタイミング**：新しいカテゴリ・visibility値を足す時
* **MindHub_Appでの具体例**：familyカテゴリ・visibility=family を追加したが、notesのtype/visibilityはTEXT列のためDBマイグレ不要だった
* **この手順の意味**：スキーマ変更（R-09）と値追加は別物。値追加で身構えなくてよい
* **現場で置き換えるポイント**：現場では「スキーマ変更が要る変更／要らない変更」の切り分け観点に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[src/features/notes/noteCategories.ts](../../src/features/notes/noteCategories.ts)、[noteTypes.ts](../../src/features/notes/noteTypes.ts)
* **優先度**：中

#### R-28 Web版DBはOPFSで外部から直接触れない
* **見るタイミング**：一括書き出し・エクスポートを設計する時
* **MindHub_Appでの具体例**：Web実行のDBはブラウザ内OPFS/IndexedDBでファイルパスが無く、`export_git_notes.py`（--db指定）が届かない（Phase7が保留中の根本理由）
* **この手順の意味**：実行環境によってデータの所在と外部アクセス可否が変わる
* **現場で置き換えるポイント**：現場では「データストアの物理的な所在とアクセス経路」の確認観点に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[scripts/export_git_notes.py](../../scripts/export_git_notes.py)
* **優先度**：低

#### R-29 タグ完全一致検索のLIKEエスケープ
* **見るタイミング**：タグでnotesを厳密検索するSQLを書く時（`dev-ref` 検索も該当）
* **MindHub_Appでの具体例**：`getLatestNoteByTag` はタグ境界を `,` で一致させ、LIKEの `%` `_` を `ESCAPE '\'` でエスケープ（`workplace_end` の `_` が任意1文字にマッチする誤爆を防止）
* **この手順の意味**：LIKE検索はワイルドカードの誤爆と前方一致の取りこぼしに注意が要る
* **現場で置き換えるポイント**：現場では「部分一致検索の境界・エスケープ・インジェクション対策」の確認観点に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[src/features/notes/noteRepository.ts](../../src/features/notes/noteRepository.ts)
* **優先度**：中

### 5.3 ビルド・実機確認

#### R-19 APKで動かないWeb専用機能がある
* **見るタイミング**：APK初版の機能範囲・確認項目を決める時
* **MindHub_Appでの具体例**：初期実装のclipboard（Web）とMarkdown書き出し（Blob＋アンカーDL）はAPKで動かない前提。確認チェックリストは `16` §2.5
* **この手順の意味**：実機確認で未対応を「バグ」と誤認しないための期待値調整
* **現場で置き換えるポイント**：現場では「動作保証する環境／しない環境の切り分け」に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[docs/memo-app/16-platform-and-distribution.md](16-platform-and-distribution.md)
* **優先度**：中

#### R-20 再ビルド前に versionCode を上げる
* **見るタイミング**：2回目以降のEAS APKビルド前
* **MindHub_Appでの具体例**：上書きインストール用に `android.versionCode` を 1→2 に更新し、`npx expo config --type public` で反映を確認
* **この手順の意味**：同一端末への上書き更新には採番の繰り上げが要る
* **現場で置き換えるポイント**：現場のビルド番号・バージョン採番ルールに置き換える
* **関連コマンド**：`npx expo config --type public`
* **関連ファイル**：[app.json](../../app.json)
* **優先度**：中

#### R-21 EAS初回準備コマンド
* **見るタイミング**：初回APKビルド環境を用意する時
* **MindHub_Appでの具体例**：`npx eas-cli login`→`eas build:configure`（projectId付与）→build。profileはpreview/production＝internal/APK
* **この手順の意味**：クラウドビルドはアカウント連携とprojectId付与が前段に要る
* **現場で置き換えるポイント**：現場のCI/CD初期セットアップ手順に置き換える
* **関連コマンド**：`npx eas-cli login` / `eas build:configure`
* **関連ファイル**：[eas.json](../../eas.json)、[app.json](../../app.json)
* **優先度**：低

### 5.4 プロンプト集・固定データ運用

#### R-22 プロンプト定義を触ったら再生成する
* **見るタイミング**：chatgptPrompts / mobilePrompts を編集した後
* **MindHub_Appでの具体例**：定義変更後に `npm run generate:prompt-hub` で prompts.html を再生成し、カード数・バッジ・ID一意を確認した
* **この手順の意味**：ソース定義と生成物のズレを防ぐ再生成＋構造チェックの定型
* **現場で置き換えるポイント**：現場の「ソースから生成物（コード生成・ドキュメント・型）を作り直す」手順に置き換える
* **関連コマンド**：`npm run generate:prompt-hub`
* **関連ファイル**：[scripts/generate_prompt_hub.mjs](../../scripts/generate_prompt_hub.mjs)、[docs/mobile-view/prompts.html](../mobile-view/prompts.html)
* **優先度**：中

#### R-23 Node直実行できないTSはコンパイラAPIでcache経由require
* **見るタイミング**：TSの固定データをNodeスクリプトから読み込む時
* **MindHub_Appでの具体例**：拡張子なしimportのためNode24でTS直実行不可→TypeScript Compiler APIで `node_modules/.cache` へCJSコンパイルしrequire。新ライブラリ不要
* **この手順の意味**：新規依存を足さずにTSをスクリプトから読む回避策
* **現場で置き換えるポイント**：現場では「ビルドツールに頼らず既存ツールで回避した実装メモ」の枠に置き換える
* **関連コマンド**：`npm run generate:prompt-hub`
* **関連ファイル**：[scripts/generate_prompt_hub.mjs](../../scripts/generate_prompt_hub.mjs)
* **優先度**：低

#### R-24 プロンプト定義は2系統で共有される
* **見るタイミング**：プロンプト定義を編集する時（片方だけ直さない）
* **MindHub_Appでの具体例**：`mobilePrompts.ts` は generate_prompt_hub.mjs（HTML）と promptHub.ts（アプリ画面）の2系統が共有。編集は両方に効く
* **この手順の意味**：共有データの片側修正は不整合を生む
* **現場で置き換えるポイント**：現場では「複数の利用者がいる共有定義・共通モジュール」の把握に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[src/features/notes/mobilePrompts.ts](../../src/features/notes/mobilePrompts.ts)、[promptHub.ts](../../src/features/notes/promptHub.ts)
* **優先度**：低

### 5.5 Web export / GitHub Pages / private・Git管理

#### R-25 公開HTMLに出さない条件
* **見るタイミング**：スマホ閲覧HTML・公開出力の対象を決める時
* **MindHub_Appでの具体例**：`judgeMobileViewExport` が family / private / internal / archived / 非Git候補を除外。カテゴリ＋visibility併用で判定
* **この手順の意味**：守秘の中核判定。何を公開に含めないかを機械的に決める
* **現場で置き換えるポイント**：現場では「外部公開・共有に出してよい情報の判定基準」に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[src/features/notes/mobileViewPolicy.ts](../../src/features/notes/mobileViewPolicy.ts)
* **優先度**：中

#### R-26 Git候補にしないもの
* **見るタイミング**：メモのGit候補フラグ・公開可否を決める時
* **MindHub_Appでの具体例**：thought / chatgpt_log / jobsearch / family はGit候補初期値 false。個人情報・住所/電話/メール・未整理メモは上げない
* **この手順の意味**：情報混入を防ぐ判断基準。カテゴリ初期値の根拠
* **現場で置き換えるポイント**：現場では「リポジトリ・チケット・チャットに書いてよい情報／ダメな情報」の線引きに置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[docs/memo-app/04-categories-and-tags.md](04-categories-and-tags.md)
* **優先度**：中

#### R-27 GitHub Pages公開はリポジトリ公開可否から
* **見るタイミング**：スマホ閲覧HTMLを公開配置しようとする時
* **MindHub_Appでの具体例**：Pages有効化はリポジトリ公開が前提。このリポは私的メモを含むため公開可否をまず判断する（未確定・人間判断）
* **この手順の意味**：公開機能を有効化する前に「そもそも公開してよいか」を確認する
* **現場で置き換えるポイント**：現場では「公開・外部連携を有効化する前の可否確認」に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[docs/memo-app/11-open-issues.md](11-open-issues.md)
* **優先度**：中

### 5.6 作業開始・終了・ログ管理

#### R-16 作業開始時に読む4ファイル
* **見るタイミング**：作業再開・セッション開始時
* **MindHub_Appでの具体例**：開始時に CLAUDE.md → 00_START_HERE.md → current-tasks.md → worklog/current.md を読み、作業内容別の仕様はCLAUDE.mdの読み分け表で引く
* **この手順の意味**：文脈を取り戻す起点を固定し、読み漏れを防ぐ
* **現場で置き換えるポイント**：現場では「着手前に読むオンボーディング資料・運用ルール」に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[CLAUDE.md](../../CLAUDE.md)、[00_START_HERE.md](../../00_START_HERE.md)
* **優先度**：中

#### R-17 作業終了時に更新する3ファイル
* **見るタイミング**：タスク完了・区切り時
* **MindHub_Appでの具体例**：終了時に current-tasks.md / worklog/current.md / 10-tasks.md を更新。必要に応じて 11-open-issues・09-roadmap も
* **この手順の意味**：次回の再開に必要な状態を残すための更新漏れ防止
* **現場で置き換えるポイント**：現場では「終業前・PR前に更新する進捗・チケット・引き継ぎ」に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[current-tasks.md](../../current-tasks.md)、[docs/memo-app/10-tasks.md](10-tasks.md)
* **優先度**：中

#### R-18 worklogのコミット状態を実態に合わせる
* **見るタイミング**：worklog・current-tasksを締める時
* **MindHub_Appでの具体例**：開発リファレンス仕様は `b2092b9` でコミット済みだが、worklog冒頭とcurrent-tasksは「未コミット」のまま残っていた
* **この手順の意味**：ログとgit履歴のズレは次回の混乱を生むため、コミット後に表記を更新する
* **現場で置き換えるポイント**：現場では「ステータス表記と実際の状態を一致させる」運用に置き換える
* **関連コマンド**：`git log --oneline`（実態確認）
* **関連ファイル**：[docs/worklog/current.md](../worklog/current.md)、[current-tasks.md](../../current-tasks.md)
* **優先度**：中

### 5.7 現場適応モードとの境界

#### R-30 現場適応モードと開発リファレンスの境界
* **見るタイミング**：どちらの機能に載せるか迷った時
* **MindHub_Appでの具体例**：現場適応＝5場面支援（保存は守秘強制で private/false 上書き）。dev-ref＝詰まったとき横から見る補助参照で command カテゴリの通常運用（Git候補 true・汎用内容のみ）。5場面には数えない
* **この手順の意味**：責務と守秘の扱いが違う2機能を混同しないための線引き
* **現場で置き換えるポイント**：現場では「個人ノウハウ（汎用）と現場固有情報（守秘）を分けて記録する」運用に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[docs/memo-app/24-development-reference.md](24-development-reference.md)
* **優先度**：中

#### R-31 現場適応の守秘既定強制の実装形
* **見るタイミング**：workplace系で保存処理を書く／読む時
* **MindHub_Appでの具体例**：workplace保存は `createNote` に `visibility='private'`／`isGitCandidate=false` を直渡しし `getGitCandidateDefault` を通さない。type=thoughtで二重防御。作業開始・詰まり・質問・報告はコピーのみ（`onSave` 未指定＝保存なし）
* **この手順の意味**：守秘を「初期値任せ」にせず明示的に固定する型。dev-refには適用しない対比材料
* **現場で置き換えるポイント**：現場では「守秘情報を扱う経路で既定値に頼らず明示的に安全側へ固定する」設計に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[src/features/workplace/workplaceService.ts](../../src/features/workplace/workplaceService.ts)
* **優先度**：低

### 5.8 設計方針・その他

#### R-11 Web専用APIを実機で使わない（原則）
* **見るタイミング**：ブラウザで動くAPIを実装に使う時
* **MindHub_Appでの具体例**：`crypto`（R-03）・`navigator.clipboard`（R-04）・Blob＋アンカーDL（R-19）の3件が実機で落ちた／動かなかった共通原因
* **この手順の意味**：R-03/R-04/R-19を貫く根本原因の一般化
* **現場で置き換えるポイント**：現場では「実行環境ごとに使えるAPIが違う」前提の確認観点に置き換える
* **関連コマンド**：（なし）
* **関連ファイル**：[src/utils/id.ts](../../src/utils/id.ts)、[src/utils/clipboard.ts](../../src/utils/clipboard.ts)
* **優先度**：中

#### R-13 ブランチ切替時は node_modules を入れ直す
* **見るタイミング**：依存が違うブランチをcheckoutした後、挙動がおかしい時
* **MindHub_Appでの具体例**：SDK54調査ブランチとmainの往復で、`git checkout main` の後に `npm install` を実行してnode_modulesをSDK56へ戻す必要があった
* **この手順の意味**：node_modulesはブランチと一緒に切り替わらない
* **現場で置き換えるポイント**：現場では「ブランチ切替・依存更新後の再インストール」手順に置き換える
* **関連コマンド**：`git checkout main` → `npm install`
* **関連ファイル**：[package.json](../../package.json)
* **優先度**：中

## 6. 統合できそうな候補

1件ずつ登録（`24` §6）を基本とするが、参照頻度と探しやすさを見て統合してもよい。

| 統合案 | 対象 | 方針 |
|--------|------|------|
| Web専用APIの地雷集 | R-03 / R-04 / R-11（＋R-19の一部） | R-11を親メモにしR-03/R-04を内包 |
| キーボード／フッター対応 | R-05 / R-06 | 症状→原因→対処で1メモ |
| 作業開始／終了チェックリスト | R-16 / R-17 / R-18 | 開始・終了・締めのズレ防止を1枚 |
| 現場適応とdev-refの境界 | R-30 / R-31 | R-30を主・R-31を実装例として内包 |
| 公開・Git候補の守秘判断 | R-25 / R-26（＋R-27） | 何を出さないかの基準を1枚 |

統合すると31件→実質20件前後に圧縮できる。

## 7. 今回は登録しない候補

* プロンプト本文そのもの（chatgptPrompts / mobilePrompts の42本）：ChatGPT定型文で `24` §4「丸写し」に該当（「なぜ使うか」の観点はR-22で吸収）
* 未確定事項そのもの（`11` の各論）：判断が固まっておらず辞書化は時期尚早（制約の事実のみR-27/R-28で切り出し）
* 現場適応モードの5場面の中身：別機能（境界のR-30のみ登録し中身は持ち込まない）
* 一度きりの環境セットアップ（R-21/R-12）：手順書寄り。登録するなら低優先で参照用に留める
* 仕様書の要約全般：`24` §4「長文解説・体系的教材」に該当。関連ファイルのリンクで足りる

## 8. 人間が次に判断すること

1. 登録スコープ：31件全部か、§3の高優先7件から始めるか、§6で統合した約20件か
2. 統合方針：`24` §6「1件ずつ登録」を厳守するか、§6の統合メモを許容するか
3. タグ粒度：`dev-ref` 単独か、`dev-ref` ＋ サブ観点タグ（例 `dev-ref,expo`）を併用するか（`11` §15）
4. Git候補の扱い：`command` 初期値 true のまま公開許容か、dev-refは当面 false 運用にするか（`24` §6 は true 前提）
5. 登録の実作業者：ユーザーが手で `/notes` に入れるか、次セッションで下書きMarkdownを用意するか

## 9. 関連仕様への参照

* 方針正本：`24-development-reference.md`
* カテゴリ・タグ：`04-categories-and-tags.md`（§1.3、`command` カテゴリ、`dev-ref` タグ）
* 未確定事項：`11-open-issues.md`（§15）
* DB定義：`03-data-model.md`（schema_version 方式。初期は変更なし）
* 現場適応モード（別機能）：`20`〜`23`
* ロードマップ・タスク：`09-roadmap.md`、`10-tasks.md`（§17）
