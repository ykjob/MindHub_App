# 最新作業ログ

最終更新：2026-07-13（Phase 15実機基準確認の完了記録と文書基準点の確定。同日：Phase 15文書監査・Gate 1完了＝下記の別記録）

## Phase 15実機基準確認の完了記録と文書基準点の確定（2026-07-13）

* versionCode 4 APK（対象コミット6605d43）のAndroid実機基準確認を、ユーザー確認の結果に基づき**7項目すべて問題なし＝合格**として記録した
  * 項目：ホーム2×2表示／`/notes` 上部余白／Safe Area／戻る操作／ステータスバーとの重なり／横方向の表示崩れ／既存機能への影響
  * 判定記録先：`30-ui-validation-checklist.md` §12.2（表を未確認→合格へ更新。§7の着手条件再掲にも完了を追記）。`11-open-issues.md` §16のブロッカーを解消済みへ更新
  * これによりAppHeader実装の着手条件（`29` §5.4）が満たされた。`/notes` ヘッダー2段化は現時点で不要と判断（問題が出た場合に再判断）
* **追加所見（記録のみ・今回は修正しない）**：FlowDockのメモ作成画面で、保存ボタンとキャンセルボタンが画面下端に近く見た目に余裕が少ない
  * 単独修正はせず、Phase 15の全体仕上げ時にSafe Area・キーボード表示時の挙動・他の入力画面との統一を含めて確認する。具体的な余白値・実装方法は未確定
  * 記録先：`30` §12.2（追加所見）・`11` §16（保留事項）
* この記録をもって、Phase 15文書一式（28・29・30＋既存仕様書反映＋管理ファイル）を文書基準点としてコミットする（コミットメッセージ：docs: finalize phase 15 ui ux specification。pushはしない）

---


## Phase 15文書全体の最終監査とGate 1完了（2026-07-13）

* DOC-07として、Phase 15文書体系（28・29・30＋反映済み既存仕様書10ファイル＋管理ファイル）をAUDIT-01〜18の18項目で監査し、**全項目合格**
  * 参照切れ0件（参照された全Markdownの実在を機械確認。存在しない `19-maestro-test-template.md` への参照は0件、実在する `19-android-emulator-testing.md` のみ）
  * 正本分担が明確（28＝画面別改善／29＝共通UI／30＝検証／16＝APK運用／21＝現場適応詳細／14＝プロンプト本文。重複正本なし）
  * UX-01〜UX-16が追跡可能（`28` §4・§16、`30` §14の3表とも16件・重複/欠番なし・判定はすべて未確認）
  * DS-01〜DS-10が `29` に反映済み（AppHeader案A・theme1ファイル・既存色役割化＋`#7C3AED`・スケール・初期部品4個・表示のみ共通化・実用a11y・アイコン保留）
  * 古い方針（ホーム＝入口追加のみ／#2563EB無条件踏襲／新画面追加のみ）は、すべて置換注記つきの履歴としてのみ残存
  * 未確定12項目は `11` §16で未確定のまま管理。**versionCode 4の実機基準確認は未確認のまま**（推測判定なし）
* 軽微な指摘3件（今回は修正せず記録のみ）：(1) `28` §1・§19と `29` §1・§13の「後続作成予定・未作成」表記が、29・30作成済みの現在では時点ズレ（参照自体は有効。次回28/29編集時に表記更新） (2) `28` §17・`29` §12の「11への正式記録は後続で行う」は実施済みのため過去形の記述として読む（`11` §16に記録済み） (3) `28` §16の対応方針列の「§15-5」等は§15内の項番を指す内部表記（誤読の恐れは低いが次回編集時に表現統一を検討）
* 状態更新：DOC-02〜DOC-07すべて完了、**Gate 1（仕様書整備）完了**（`10-tasks.md` §20に記録）
* 次の作業：versionCode 4 APKのAndroid実機基準確認（ホーム2×2・/notes上部余白・Safe Area・戻る・ステータスバー・横方向表示・既存機能。`30` §12.2）。AppHeader実装・ホーム本格改修はその後
* 実装・テーマファイル作成・共通コンポーネント作成・APKビルド・git add・commit・pushは行っていない

---

## Phase 15 UI・UX品質改善の文書整備と既存仕様への反映（2026-07-13）

### 今回の目的

* 4視点レビュー（プロダクト／技術／UI・UX／品質・セキュリティ）で確認されたUI・UX問題（UX-01〜UX-16）を、実装可能なPhase 15の正式仕様へ変換する
* 実装前に情報設計・共通UI・検証基準を正本化し、正本の所在を1箇所ずつに固定する
* 既存機能（DB・保存・ルート・守秘既定）を壊さず、画面改善を1タスク1目的で段階的に進められる状態にする

### 新規作成した文書（3件）

* `docs/memo-app/28-ui-ux-quality-improvement.md`：Phase 15の目的・UX-01〜16・情報設計・画面別改善方針・変更禁止範囲の正本
* `docs/memo-app/29-ui-design-system.md`：デザイントークン・ヘッダー方式・共通コンポーネント・状態表示・アクセシビリティ基準・移行ルールの正本
* `docs/memo-app/30-ui-validation-checklist.md`：検証手順・判定ステータス・Gate 1〜7・UX完了判定表・証跡記録の正本

### 既存文書への反映（10件）

`01-decisions-and-scope.md`（§1.7 Phase 15採用決定・APK現状認識の更新）／`08-ui-flow.md`（§1ホーム役割を「MindHub全体の入口」へ改訂・§9入口制限の置換注記・§10正本分担）／`09-roadmap.md`（Phase 15節新設。旧ダッシュボード構想＝Phase 13将来候補との分離を明記）／`10-tasks.md`（§20 Phase 15タスク構造：DOC/IA/UI/HOME/HEADER/NOTES/WORK/PROMPT/STATE/A11Y/VISUAL/TEST/REVIEW）／`11-open-issues.md`（§16未確定事項12項目・§7旧Phase 8記述の現状化）／`14-mobile-prompt-hub-and-inbox.md`（§1.8状況別入口の可能性のみ最小追記。42件・生成ロジック無変更）／`16-platform-and-distribution.md`（§7 APK運用=16とUI検証=30の分担・APK確認は原則2回）／`21-workplace-adaptation-flows-and-ui.md`（§1入口制限の置換注記・§5スタイル踏襲を29優先へ。5場面・保存・守秘条件は不変）／`CLAUDE.md`（読み分け表にUI・UX3行追加。実装ルール：踏襲規則→29準拠へ置き換え・28範囲内の画面内再構成を許可・AppHeader着手条件・30での検証義務）／`00_START_HERE.md`（目的別の読み分け導線：UI・UX改善→28、共通UI→29、UI検証→30＋16）

### 確定した主な判断（DS-01〜DS-10。正本は `29`）

* 主要4画面（ホーム・メモ管理一覧・現場適応入口・プロンプト集）を将来的に画面内 `AppHeader` へ統一（作成・編集・詳細・設定はネイティブヘッダー維持）
* `src/theme/index.ts` の1ファイル構成から開始（colors / spacing / typography / radius / touchTarget）
* 既存の青基調（Tailwind系の使用実績値）を役割名で管理。AI・プロンプト色に `#7C3AED` を新規採用
* 余白5段階（4/8/12/16/24）・文字6段階（20/16/15/14/12/11）・角丸3段階（8/12/pill）の基本スケールを定義
* 初期共通コンポーネントは4個に限定（AppHeader / FilterChip / ListStateView / StatusMessage）。FilterChipは絞り込み専用でCategorySelectorとは統合しない
* 状態ロジックは各画面に残し、表示だけを共通化（状態管理ライブラリ・共通フック化はしない）
* 実用範囲に限定したアクセシビリティ基準（44相当・role/label/hint/state・色非依存・TalkBack対象6画面）
* アイコン導入は視覚仕上げ段階まで保留（`@expo/vector-icons` は未導入。導入時は事前承認＋APK再確認必須）
* 全画面一括置換を禁止（画面改修タスク単位の段階移行）

### 変更しない範囲（今回変更していないことの確認）

実装コード／DBスキーマ／保存ロジック／既存ルート／GitHub連携／OPFS自動リロード／SDK 54／依存関係／app.json／eas.json／守秘既定／プロンプト本文と生成ロジック。

### 現在の状態

* DOC-02〜DOC-05（28・29・30作成＋既存仕様書反映）＝完了。DOC-06（管理ファイル更新）＝今回で完了。DOC-07（最終文書監査・Gate 1判定）＝未着手
* **Gate 1は未完了**（DOC-07完了まで合格判定しない）
* versionCode 4 APKの実機基準確認（ホーム2×2・/notes上部余白・Safe Area・戻る・ステータスバー・横方向表示・既存機能）は**未完了**（`30` §12.2にすべて未確認として記録。結果は推測しない）
* AppHeader実装とホームの本格改修は、実機基準確認の完了後に着手する
* 次の作業：DOC-07（Phase 15文書全体の最終監査とGate 1判定）

### Git状態

* commit・push・git add はいずれも未実施
* 28・29・30は未追跡（`??`）
* 正式仕様書10ファイル（01 / 08 / 09 / 10 / 11 / 14 / 16 / 21 / CLAUDE.md / 00_START_HERE.md）は変更済み・未コミット
* `current-tasks.md` と本ファイルには、既存のAPK 4回目ビルド記録（別スレッド作業・未コミット）と今回のPhase 15記録が共存している（既存記録は無変更で保持）

---

## モバイルヘッダー修正のcommit/push＋EAS preview APK 4回目ビルド（2026-07-13）

* UI修正（ホーム2×2グリッド＋/notes Safe Area）を e12aed6、versionCode 3→4 を 6605d43 でcommit・push（HEAD=origin/main一致・status clean確認済み）
* `eas build -p android --profile preview` → **ビルド成功**（status FINISHED、ビルド約6分）
  * build URL：https://expo.dev/accounts/ykjob/projects/flowdock/builds/11b19c5e-853c-4d9f-9971-f6c39e6cf0a4
  * APK：https://expo.dev/artifacts/eas/wrq-4E4hdHtVquWdshn1jOwEGIbEAp7LhUWf1fd29QU.apk（期限 2026-07-27）
  * gitCommitHash=6605d434…・appBuildVersion=4・SDK 54・preview/INTERNAL をメタデータで確認
* Android実機確認（ステータスバー非被り・戻るボタンタップ・ホーム2×2表示・/notes 2段化の要否判断）はユーザー待ち

---

## ホーム画面ヘッダーのスマホ幅2×2グリッド化（2026-07-13、コミット済み e12aed6）

### 今回の目的

スマホ幅でホーム（FlowDock）の「メモ一覧」タイトルと4ボタン（現場適応・プロンプト集・メモ管理・設定）が1行に詰まって窮屈なため、承認済みの案どおりレスポンシブ化する。

### 変更したファイル

* `app/index.tsx` のみ：
  * `useWindowDimensions` の `width < 480` で分岐（/notes と同じ基準）
  * スマホ幅：1段目「メモ一覧」、2段目「現場適応/プロンプト集」、3段目「メモ管理/設定」の2×2グリッド（`flexWrap`＋`flexBasis: '48%'`＋`flexGrow: 1`）。ラベル中央寄せ・縦padding 6→10でタップしやすく
  * PC幅（480以上）：従来の1行レイアウトを完全維持（スタイル無変更）
  * Safe Area対応は不要（ホームはネイティブヘッダー「FlowDock」を残しており、ステータスバー分はネイティブヘッダーが確保）
* 非対象を厳守：`_layout.tsx`・`/notes` 系画面・FAB・メモ一覧本体・既存ボタンの遷移先は無変更

### 検証

* `npx tsc --noEmit` エラーなし
* ヘッドレスChrome（8083）：PC 1280pxは従来どおり1行（タイトルy82・ボタンy86の右寄せ）。390pxは2×2グリッド（各ボタン175×40px・ラベル中央・列間/行間8px）。コンソールエラー・ページエラー0件。スクリーンショット目視で余白・整列とも自然
* Android実機確認はAPK再ビルド後（ユーザー待ち）

---

## /notes/index ヘッダーのSafe Area対応（2026-07-13、未コミット）

### 今回の目的

Android実機確認で判明した追加修正。`headerShown: false` にした結果、画面内ヘッダーがステータスバー領域に被り「← 戻る」が押しにくい。

### 変更したファイル

* `app/notes/index.tsx` のみ（他画面・`_layout.tsx` は無変更）：
  * `useSafeAreaInsets` を導入し、画面内ヘッダーの上余白を `16 + insets.top` に（Android実機ではステータスバー分下がる。Web/PCでは insets.top=0 のため見た目不変）。`headerShown: false` は維持
  * 「← 戻る」に `hitSlop={8}` を追加してタップ領域を拡大
* 一度実装したスマホ幅2段化（`width < 480`）は方針変更で撤回（同日）。「窮屈」の対象は `/notes` ではなくホーム画面 `app/index.tsx` の可能性が高いとのユーザー指摘。`/notes` の2段化は上余白修正後の実機表示を見てから要否判断（`11-open-issues.md` ではなくユーザー判断待ち）
* ホーム画面 `app/index.tsx` のヘッダーレスポンシブ化は同日承認され実装済み（下記）

### 検証

* `npx tsc --noEmit` エラーなし
* ヘッドレスChrome（8083）：390px・1280pxとも従来どおり1行ヘッダー（撤回後の確認済み）。Web/PCの見た目はSafe Area対応前と不変
* Android実機でのステータスバー非被り・タップ確認はユーザー確認待ち（insets適用のためWebでは検証不可）

### 備考

* 空状態の文言「右上の『＋ 新規作成』から作成してください」は今回未修正

---

## EAS preview APK 3回目ビルド（2026-07-13）

* メモ管理修正2件（3e0c7ee）とversionCode 2→3（f277c12）をcommit・push済み（いずれもorigin/main反映確認済み）
* `eas build -p android --profile preview` 実行 → **ビルド成功**（status FINISHED、ビルド時間約5.6分）
  * build URL：https://expo.dev/accounts/ykjob/projects/flowdock/builds/0547c079-4dbf-43c5-8508-1e6bc2ec56ff
  * APKダウンロード：https://expo.dev/artifacts/eas/-OITlCs5lojbcrciJDpt8HFQkEmk0LiwYbtqXsi0af8.apk（アーティファクト有効期限 2026-07-27）
  * ビルド対象コミット f277c12f84be…（gitCommitHashで確認）、appBuildVersion=3、appVersion=1.0.0、SDK 54、profile=preview（INTERNAL/APK）
* versionCode 3のため、versionCode 1/2インストール済み端末へそのまま上書きインストール可能
* 実機での動作確認（今回のWeb向け修正はAPK動作に影響しない想定だが、起動・保存の基本確認）はユーザー待ち

---



## メモ管理画面の戻るボタン追加＋Web更新時OPFSロック競合の回復処理（2026-07-13）

### 今回の目的

`/notes` で報告された2件の不具合修正。(1) Webで更新・直アクセスすると戻る履歴がなく戻るボタンが消える。(2) Web更新時に `NoModificationAllowedError`（createSyncAccessHandle）が出てDBが開けない。

### 原因調査の結果

* 問題1：Stackの戻る履歴依存。直アクセス時は履歴が空でネイティブヘッダーの戻るボタンが出ない
* 問題2：expo-sqlite Web実装は worker 起動時に `AccessHandlePoolVFS` がOPFSプールファイル全部の sync access handle を一括取得する。リロード時、旧ページの worker が handle を解放し終える前に新ページの worker が取得を試みると競合して失敗する。さらに worker 内部は初期化失敗後 `_sqlite3` のみセット済み・`_vfs` は null の壊れた状態で固定され（以後 `Invalid VFS state`）、**同一ページ内のリトライでは回復不可能**
* アプリ側のDBオープンは `app/_layout.tsx` の SQLiteProvider 1箇所のみで二重オープンなし。`app/notes/index.tsx` の `useFocusEffect`＋`useEffect` の二重 `load()` は初回マウント時に同じクエリを2回走らせる冗長だが、単一コネクション経由のためOPFS競合の原因ではない

### 変更したファイル

* `app/_layout.tsx`：
  * `onError`（`handleDatabaseError`）を追加。Webで Access Handle 競合エラーのときだけ sessionStorage フラグを立てて1回だけ `window.location.reload()`（リロード後は旧workerが確実に消えているため成功する）。2回連続で失敗した場合（別タブで開いている等）はフラグが残っているため再リロードせずエラーをそのまま投げる
  * `onInit` を `runMigrations` 直渡しから `initDatabase`（runMigrations＋成功時にフラグ解除）に変更。どちらもモジュールレベル関数で SQLiteProvider の再マウントを起こさない
* `app/notes/index.tsx`：
  * 画面内ヘッダー左に「← 戻る」ボタンを追加。`router.canGoBack()` なら `router.back()`、戻れなければ `router.replace('/')`（履歴依存を解消）
  * `useEffect(() => load(), [load])` を削除し `useFocusEffect` のみに（初回マウント・フォーカス復帰・フィルタ変更のすべてを `useFocusEffect` がカバーするため二重読み込みを解消）

### 検証

* `npx tsc --noEmit` エラーなし
* ブラウザ実操作確認済み（2026-07-13 追加確認、ポート8083で新規サーバーを起動しヘッドレスChromeで実施。puppeteer-coreはセッション用一時ディレクトリに隔離導入しプロジェクトは無変更）：
  * `/notes` 直アクセスで「← 戻る」表示→クリックでホーム表示（`replace('/')` 経路）、通常遷移からの「← 戻る」も正常（`back()` 経路）
  * メモ作成→キーワード絞り込みで0件→クリアで再表示→並び替え切り替え、の再読み込みサイクルが `useFocusEffect` のみで動作
  * リロード6連打後も一覧表示（エラーなし）、通常起動・リロード後とも sessionStorage フラグは null（残留なし）
  * PC幅1280px・スマホ幅390pxの両方でヘッダー表示崩れなし。コンソールエラー・ページエラー0件
* ネイティブ安全性は静的確認：`onError`／`onInit` とも `Platform.OS === 'web'` が最初の条件で短絡評価されるため、Android / iOS では window / sessionStorage に一切触れない

### 追加修正：/notes/index の戻る導線を1つに統一（2026-07-13）

* 戻るボタンが2つ（Stackネイティブヘッダー＋画面内「← 戻る」）表示されて紛らわしいため、`app/_layout.tsx` の `notes/index` のみ `headerShown: false` を追加し、画面内「← 戻る」を全環境で唯一の戻る導線にした。`title: 'メモ管理'` は残置（Webのdocument title用）。他画面（`notes/create`・`notes/[id]` 等）のネイティブヘッダーは無変更
* ヘッドレスChromeで確認（8083、PC 1280px／スマホ390px、コンソールエラー0件）：
  * `/notes` でネイティブヘッダー消失。可視の「メモ管理」は画面内ヘッダー1箇所のみ（ホーム→遷移時にDOM上2箇所検出されるのは、非表示レイヤー＝aria-hidden・サイズ0で残るホーム画面の「メモ管理」ボタンで、表示上は1つ）
  * 「← 戻る」「メモ管理」「＋ 新規作成」が両幅とも1行（y中心一致）で表示崩れなし
  * ホーム→メモ管理→「← 戻る」でホーム／直アクセス・更新後も「← 戻る」でホーム
  * `/notes/create` に「メモ作成」・`/notes/[id]` に「メモ詳細」のネイティブヘッダーが従来どおり表示
* `npx tsc --noEmit` エラーなし

### やっていないこと（今回の非対象）

* expo-sqlite 本体（node_modules）へのパッチ／別タブ同時オープン時のUI表示（現状はエラーのまま）／他の `/notes` 系画面へのボタン・ヘッダー変更／コミット・push

---


## 開発リファレンス 目的2本柱化＋現場理解カード20枚の下書き作成（2026-07-12）

### 今回の目的

開発リファレンスの目的を「単なるコマンド集」から広げ、実際の開発現場でどう動くか——最初に押さえること・確認手順・判断基準——を理解して現場で困らないための実務理解リファレンスにする。ドキュメントのみで、実装コード・DB・ルート・専用画面は変更しない。

### 変更したファイル

* `docs/memo-app/24-development-reference.md`：目的を2本柱に改定（§1）
  * 柱1＝技術リファレンス：作業中の即参照（従来の目的。R-01〜R-31。事故駆動で1件ずつ）
  * 柱2＝現場理解カード：現場での動き方の確認手順・判断基準（G-01〜G-20。行動基準のため初期セット登録を許容。ポートフォリオで「仕事に対する姿勢」を示す素材を兼ねる）
  * 整合修正：§3対象（柱別に整理）、§4対象外（「先回りの知識」除外は柱1に適用と明記）、§5登録基準（5.1柱1／5.2柱2に分割）、§6（網羅seed禁止はGカード初期セットを例外に）、§6.2新設（登録方式）、§8参照
* `docs/memo-app/25-development-reference-candidates.md`：§10新設（現場理解系カードG-01〜G-20）
  * 6グループ＝サブタグ6種で確定：onboarding（G-01〜05 着手前）／ask-report（G-06〜09 質問・報告）／troubleshoot（G-10〜12 トラブル）／git-db（G-13〜16）／security（G-17〜18）／closing（G-19〜20）
  * Rカードとの関係：G＝汎用の確認手順・判断基準（親）、R＝本プロジェクトの個別実例（子）。統合せず相互リンク（例 G-10一般切り分け⇔R-02保存無反応）
  * 高優先5枚：G-02（タスク受領時）・G-06（質問前整理）・G-08（報告内容）・G-10（エラー切り分け）・G-19（終業前再開情報）
  * 現場適応モードとの境界：Gカード＝判断基準の正本、workplace画面＝入力支援ツール。5場面モデルは不変
  * §7に「面接質問プロンプトは今回の対象外（dev-refに混ぜない）」を明記
* `docs/memo-app/27-development-reference-fieldwork-cards.md`（新規）：20枚すべてのコピペ用登録ブロック
  * 各ブロック＝タイトル／カテゴリ `command`／タグ `dev-ref,サブタグ`／本文（```markdown フェンス内をそのまま `/notes` へ貼れる完成形）
  * 本文構成は「いつ見るか／確認すること／判断基準／MindHub_Appでの実例／関連」で1枚15〜25行に収めた
  * 将来JSONインポート（`18`）実装後は本ファイルをJSON化して一括投入できる構造
* `docs/memo-app/04-categories-and-tags.md` §1.3：2本柱とも command＋dev-ref 運用のまま・Gカードのサブタグ6種を追記
* `docs/memo-app/11-open-issues.md` §15：2026-07-12決定分（2本柱化・G追加・サブタグG側確定・Git候補true・面接プロンプト対象外）を追記し、残る未確定をR側サブタグ・登録タイミングに整理
* `docs/memo-app/10-tasks.md` §17：今回分のタスクと運用タスク（高優先5枚→残り15枚の手動登録）を更新

### 設計判断

* 登録方式はコピペ方式：Web版DBはブラウザ内OPFSで外部スクリプトが直接触れない（R-28と同じ制約）ため、seedスクリプトは採らない。アプリ内seedボタンも今回はコード変更なしで済む下書き方式で足りるため見送り
* 題材が重なるGとR（Git・DB・守秘・終業）は統合しない：Gは現場を問わず通用する手順、Rはこのリポジトリ固有の再現例で、圧縮すると片方の用途が失われるため相互リンクで残す
* 守秘確認：20枚とも実在企業名・現場固有情報・機密なし。G-17/G-18も本文は「何を出さないか」の汎用判断基準に限定し、Git候補はcommand初期値どおりtrueで問題ないことを作成時に確認

### やっていないこと（今回の非対象）

* 実装コード・DB・ルート・専用画面の変更／GカードのDB登録（ユーザーの手動登録待ち）／面接質問プロンプトの追加／コミット・push

---


## 発表用サンプルデータのデモリハーサル（2026-07-12）

### 今回の目的

`26-workplace-demo-samples.md` §2のサンプル文を実際にアプリ画面へ入力し、発表と同じ流れ（5場面→終業前メモ保存→翌朝再開導線）が自然に成立するかリハーサル確認する。

### 確認結果（全32チェック項目OK・コンソールエラー0件・修正必須の問題なし）

* `http://localhost:8082/workplace` 以下で、§2のサンプル文を原文どおり入力（ヘッドレスブラウザで実操作）
* 5場面すべてで入力→「整理する」→出力→「コピー」が正常動作。クリップボードの実内容にサンプル文が含まれることも確認
* 出力体裁の確認：質問文作成は冒頭に「お手すきのときに…判断・助言をいただけますか」＋結論先頭（丸投げに見えない体裁）、進捗報告は「■ 現在の状態（結論）」が先頭
* 終業前メモの「再開メモとして保存」→入口に「前回の再開メモ」がサンプル本文つきで表示→「この続きから作業開始」で引き継ぎバナー＋初期入力（今日の作業＝明日最初にやること、先に確認すること＝未完了＋補足の2行）を確認。翌朝再開デモとして文章が自然につながる
* スクリーンショット目視：全画面で入力文はPC幅1〜2行に収まり、表示崩れ・不自然な折り返しなし
* 守秘面：固有名なし・役割名（リーダー・自分）と一般名のみで問題なし

### 反映した修正（26のみ・任意改善1件）

* `26` §3の事前準備に「サンプル文は事前にテキストファイルへ用意し、デモ中はライブで手入力せずコピーして貼り付ける」旨を1行追記（入力時間の短縮とタイプミス防止）
* 質問文作成の「急ぎ度」の文体（です・ます混在）は、チャットに貼る文として自然なため変更しない（判断として記録）

### やっていないこと（今回の非対象）

* 実装コード・DB・app.json・package.json・ルート構造の変更／コミット・push

---


## 現場適応モード 発表用サンプルデータの作成（2026-07-12）

### 今回の目的

現場適応モードを「見せられる・説明できる・意見をもらえる」状態にするため、発表・デモで実際にアプリ画面へ入力して見せられるサンプルデータを作る。ドキュメントのみで、実装コード・DB・app.json・package.json・ルート構造は変更しない。

### 新規作成したファイル（1件）

* `docs/memo-app/26-workplace-demo-samples.md`：発表用サンプル集
  * 架空シナリオ：未経験に近い新人が、架空の社内向け「在庫管理Webアプリ」の会員登録画面の入力チェック確認（テスト仕様書 項目1〜20）を担当する1日。5場面が朝→詰まり→質問→夕方の報告→終業前の流れでつながる
  * 5場面それぞれの入力例（§2）：入力欄名はアプリの画面ラベル（start / stuck / question / report / end の fields 定義）と一致させ、そのまま入力してデモできる形にした
  * 各場面に「デモでの見せ方」と「ChatGPTに貼るとどう役立つか」を併記
  * 発表用デモの推奨手順（§3）：前日に終業前メモを保存しておき、入口の「前回の再開メモ」→5場面→保存→「この続きから作業開始」の引き継ぎで締める流れ。短時間版（詰まり記録→質問文作成の2画面）も記載
  * サンプル作成時の守秘ルール（§4）：実在の会社名・職場名・個人名・顧客名・秘密情報は入れない。役割名（リーダー・自分）と一般名（検証環境・テスト用アカウント）のみ使用

### 設計判断

* シナリオに「画面確認タスク」を採用：未経験者が最初に任されやすく、聞き手が専門知識なしでイメージできる。詰まり内容は「仕様書と実際の表示の文言不一致」で、新人が不具合/仕様書更新漏れ/自分のミスを判断できず抱え込む典型例のため、質問文作成の価値が伝わりやすい
* 5場面を独立した例にせず1日のストーリーとして連結：発表時に導線（詰まり記録→質問文作成、終業前メモ→翌朝再開）を自然に見せられる

### やっていないこと（今回の非対象）

* 実装コード・DB・app.json・package.json・ルート構造の変更／サンプルのDB登録（デモ時に画面から入力する前提）／コミット・push

---


## 現場適応モード5場面のブラウザ確認（2026-07-12）

### 今回の目的

現場適応モードを「見せられる・説明できる・意見をもらえる」状態にするため、5場面（作業開始・詰まり記録・質問文作成・進捗報告作成・終業前メモ）＋入口＋翌朝再開導線をブラウザで実操作確認する。MindHub本体の大きな機能追加はしない。

### 確認方法と確認URL

* 確認URLは `http://localhost:8082/workplace` 以下の各画面
* **8082で確認した理由**：ポート8081で動いていた開発サーバーは現場適応モードのルート追加**前**から起動していた古いプロセスで、`/workplace` が「Unmatched Route」になるため。8081のプロセスには触らず、8082で新しい開発サーバーを起動して確認した。手元のブラウザで確認する場合も、古いサーバーの再起動または8082の利用が必要
* ヘッドレスChrome（puppeteer-core、セッション用一時ディレクトリに隔離してインストール）で実操作し、全画面のスクリーンショットを目視確認した

### 確認結果（47チェック項目すべてOK・コンソールエラー0件・アプリ側の修正不要）

* `/workplace`（入口）：5場面カード表示、再開メモ領域表示、カードクリックで `/workplace/start` へ遷移
* `/workplace/start`：表示OK・入力4欄・整理→出力・コピー成功（クリップボード実内容も検証）・保存ボタンなし＋「コピーのみ」注記（仕様どおり）
* `/workplace/stuck`：同上（入力4欄）
* `/workplace/question`：同上（入力6欄）
* `/workplace/report`：同上（入力7欄）
* `/workplace/end`：表示OK・入力4欄・整理→出力・コピー成功・「再開メモとして保存」→「保存しました」表示
* 保存後の再開導線：入口に「前回の再開メモ」が本文つきで表示→「この続きから作業開始」→引き継ぎバナー表示＋作業開始フォームへ初期入力（明日最初にやること→今日の作業、未完了→先に確認すること）
* 守秘注意文（黄色帯）は全場面で表示。スクリーンショット目視で表示崩れなし
* 保存動作の検証はヘッドレスブラウザ内の使い捨てDBで実施（ユーザーのブラウザのDB・プロジェクトのDBには影響なし）

### 確認中に発生した問題（すべてアプリ以外が原因。アプリ側の不具合ゼロ）

* 確認スクリプト側の照合ミス2件（守秘注意文の検索語・終業前メモの保存ボタンラベル「再開メモとして保存」）と、再開メモ非同期読み込みの待ち不足1件。いずれもスクリプトを修正して全件OKを確認
* **puppeteer-coreの誤インストールと復旧**：確認ツールを一時的にプロジェクト本体へ誤インストール（package.json / package-lock.json / node_modules が変化）したが、即座に `git restore package.json package-lock.json` ＋ `npm prune` で復旧し、`git status` がクリーンであることを確認済み。最終的にツールはセッション用一時ディレクトリへ隔離してインストールした

### やっていないこと（今回の非対象）

* 実装コード・app.json・package.json・package-lock.json・DB関連ファイルの変更（アプリ側の修正は不要だった）／コミット・push

---


## 名称方針の整理（2026-07-12）

### 今回の目的

今後の開発やAIへの依頼時に MindHub と FlowDock の呼び分けが混乱しないよう、名称方針を仕様書に正本化する。今回はドキュメント追記のみで、実装コード・app.json・package.json・ルート名・DBは変更しない。

### 決めた名称方針

* **MindHub**：アプリ全体名。思考メモ、作業ログ、AI活用、プロンプト集、現場適応モードをまとめるハブ。アプリ全体の表向き名称は今後 MindHub に寄せる
* **FlowDock**：初期からある軽量メモ機能の説明名。スマホで素早くメモを流し込み、あとで整理につなげる入口。消さずに、既存軽量メモ機能・旧スマホメモ機能の説明名として残す
* `/memo` 系（memosテーブル、`app/memo/*`）＝FlowDock由来の既存軽量メモ機能
* `/notes` 系（notesテーブル、`app/notes/*`）＝メモ管理機能
* `/workplace` 系（`app/workplace/*`）＝現場適応モード
* リポジトリ名は MindHub_App のまま

### 変更ファイル（すべてドキュメント）

* `docs/memo-app/01-decisions-and-scope.md`：§1.6「追加決定事項（2026-07-12 名称方針）」を新設（正本）。名称の定義・機能系統と名称の対応表・現時点で変更しないもの（app.json / package.json / ルート名 / DB / 実装コード）を明記
* `00_START_HERE.md`：§1の「アプリ内部名：FlowDock」を「アプリ全体名：MindHub」に改め、名称方針の要約と `01` §1.6 への参照を追記
* `CLAUDE.md`：冒頭とプロジェクト概要に名称方針の要約と `01` §1.6 への参照を追記
* `docs/memo-app/10-tasks.md`：§18（名称方針の整理）を新設
* `current-tasks.md` / `docs/worklog/current.md`：本記録

### 現状確認の結果（変更しないことを確認したもの）

* `app.json`：name「FlowDock」・slug/scheme「flowdock」のまま。android.package は com.ykjob.mindhub で確定済み（2026-07-07）と方針整合
* `app/_layout.tsx`：ホーム画面タイトル「FlowDock」のまま（実装コードのため今回対象外）
* `docs/flowdock_mvp_design.md`：FlowDock（既存軽量メモ機能）の仕様基準としてそのまま参照（本文無変更）

### 未確定として残したもの

* app.json の表示名・slug 等を実際に MindHub へ変更するかどうか・その時期（変更する場合は影響範囲確認のうえ別途判断。`01` §1.6 に明記）

### やっていないこと（今回の非対象）

* 実装コード・app.json・package.json・ルート名・DB・schema の変更／コミット・push

---

## 開発リファレンス 案A正式採用と登録候補の整理（2026-07-10）

### 今回の目的

先の調査（案A / 案B比較）を受けて案Aを正式方針として確定し、docsに反映する。あわせて、先に広く抽出した開発リファレンス登録候補31件を作業用の候補一覧として整理する。今回はコード変更・DB登録・コミットを行わない（`app/` / `src/` / DB / schema 無変更）。

### 固定した条件（ユーザー指定）

* コード変更なし。`app/` / `src/` / DB / schema には触らない
* 案Aを正式方針：専用画面・固定データ画面・`app/reference` などの新規ルートを作らない。既存 `command` カテゴリで運用。タグは `dev-ref`
* 31件を `docs/memo-app/25-development-reference-candidates.md` に整理
* 高優先度7件を「最初にDB登録する候補」として明記
* 各候補は8観点（タイトル／見るタイミング／MindHub_Appでの具体例／この手順の意味／現場で置き換えるポイント／関連コマンド／関連ファイル／優先度）で整理
* DB登録はしない・コミットはしない

### 新規作成したファイル（1件）

* `docs/memo-app/25-development-reference-candidates.md`：案A正式方針・運用ルール・高優先度7件（§3）・優先度サマリ（§4）・残り24件の詳細（§5、テーマ別）・統合案（§6）・登録しない候補（§7）・人間判断事項（§8）・関連仕様（§9）

### 既存仕様書への反映（4件・すべてドキュメント）

* `24-development-reference.md`：§6の参照タグ行を `dev-ref` 確定に更新／§6.1「案A正式採用と登録候補一覧」を新設／§8関連参照に `25` を追加
* `04-categories-and-tags.md`：§1.3を案A正式採用・タグ `dev-ref` 確定・`25` 参照に更新
* `11-open-issues.md`：§15を「決定済み（案A・`dev-ref`・`25`整理）」と「残る未確定（サブタグ併記可否・既存commandメモとの区別）」に再整理
* `10-tasks.md`：§17に案A確定・`dev-ref`確定・`25`整理を完了として追加。運用タスクを先行登録7件・残り登録・サブタグ判断に更新

### 高優先度7件（最初にDB登録する候補）

R-01（実装後の検証2コマンド）／R-02（保存無反応の確認順）／R-03（ID生成はexpo-crypto）／R-04（ネイティブcopyはexpo-clipboard）／R-09（DB変更はschema_version方式）／R-14（commit/pushは指示後）／R-15（既存機能を壊さない）。

### 抽出方針の反映

* 情報源の重み付けは指示どおり：実際に困った記録（実機確認1〜4回目・SDK54調査・clipboard/crypto/footer修正）＞ 繰り返す確認手順 ＞ 繰り返す判断 ＞ プロンプト本文
* プロンプト本文そのもの（ChatGPT定型文）は登録候補から除外し、「なぜその確認が必要だったか」に変換して候補化（`25` §7）

### やっていないこと（今回の非対象）

* DB登録（`/notes` への `command`＋`dev-ref` 登録）／アプリ本体・DB・schema変更／専用画面・固定データ画面・新規ルート作成／現場適応モードのUI・仕様変更／コミット・push

### 補足（R-18の実例を解消）

* 開発リファレンス仕様（`24` 等）は `b2092b9` でコミット済みだが、worklog冒頭とcurrent-tasksが「未コミット」のまま残っていた。current-tasks の該当フェーズ行を「コミット済み b2092b9」に修正した

---

## 開発リファレンスの仕様書新規作成と既存仕様への参照追記（2026-07-10）

### 今回の目的

現場適応モードとは別機能として「開発リファレンス」の方針を仕様書にまとめる。開発リファレンスは単語を覚える辞書ではなく、作業中に迷ったとき手順・コマンド・最小コード例をすぐ確認し、集中力を切らさず作業へ戻るための参照集。今回は仕様書の新規作成と既存仕様への参照追記のみで、実装コード変更・コミットは行わない。

### 決めたこと・固定した方針（ユーザー指定）

* 開発リファレンスは現場適応モードの中核機能ではない。現場適応モードは5場面（作業開始・詰まり記録・質問文作成・進捗報告作成・終業前メモ）を支援し、開発リファレンスはそれらの場面で手が止まったとき横から参照する補助導線
* 初期実装では専用DB・専用管理画面を作らず、既存notesの `command` カテゴリまたはタグ運用で扱う
* 登録対象は、実際に作業中に手が止まった／2回以上調べた／1分以内に見返したい／コピペか短い確認で作業へ戻れるものに限定
* AIが重要と言っただけの用語・未使用の知識は対象外。網羅的な関数一覧・公式ドキュメント丸写し・長文解説・現場固有のシステム名/顧客名/内部URL/業務手順・機密を含むコマンドや設定値も対象外
* 対象にするもの：よく使う確認手順／よく使うコマンド／関数・メソッドの最小例／ライブラリの最小利用例／エラー時の確認順／質問前チェック／報告前チェック／会話でよく出る一般IT用語の短い説明

### 新規作成したファイル（1件）

* `docs/memo-app/24-development-reference.md`：目的・現場適応モードとの関係・対象にするもの・対象にしないもの・登録基準・初期実装方針・将来候補・関連仕様への参照

### 既存仕様書への参照追記（6件・すべてドキュメント）

* `04-categories-and-tags.md`：§1.3 を新設（別機能・補助参照。初期は `command` カテゴリ／タグ運用、新type・新カテゴリ追加なし、タグ命名は11で管理、現場固有情報・機密は登録しない）
* `09-roadmap.md`：Phase 14の後に「開発リファレンス（別機能・当面ロードマップ外）」節を追加（初期は `command` カテゴリ／タグ運用、専用画面・専用テーブルは将来候補、独立Phaseは設けない）
* `10-tasks.md`：§17 を新設（仕様書整理タスク＝完了、運用タスク・将来候補、今回の非対象）
* `11-open-issues.md`：§15 を新設（参照用タグ命名、command 既存メモとの区別、専用UI・専用テーブルの時期、横断参照導線の要否）
* `20-workplace-adaptation-overview.md`：§7.2 非スコープに「開発リファレンスの機能化は別機能・本モードの中核ではない」旨を追加（正本は24、初期は command カテゴリ／タグ運用）
* `21-workplace-adaptation-flows-and-ui.md`：§7.1 を新設（別機能・補助参照。5場面に数えない。初期は現場適応モード画面から専用UIへ接続しない。横断参照は将来候補）

### 完了条件の確認

* 新規仕様書 `24-development-reference.md` が作成されている（済）
* 既存仕様書に、別機能であり補助参照として扱うことが追記されている（04 / 09 / 10 / 11 / 20 / 21）
* 初期は既存notesの `command` カテゴリ／タグ運用で扱い、専用DB・専用画面は後回しであることが明記されている（04 §1.3 / 09 / 24 §6）
* `current-tasks.md` と `docs/worklog/current.md` に作業内容を記録（済）
* 実装コードは変更していない（app/ / src/ / DB / schema 無変更）

### やっていないこと（今回の非対象）

* アプリ本体の実装変更・DBスキーマ変更・専用画面作成・AI自動抽出・用語/関数/ライブラリの大量seed作成・現場適応モードのUI変更・既存notes機能の破壊的変更・push

### レビュー後の軽微修正（同日 2026-07-10）

* 内容レビューで矛盾なしを確認。任意改善として `24-development-reference.md` §2 の5場面出典に `20 §7.1`（5場面モデルの明示列挙箇所）を併記（`20 §5・§7.1、21 §2`）。構造変更なし
* Git候補の扱いはレビューで整合を確認：開発リファレンスは `command` の初期値（Git候補true）に従うが、§4・§5 で現場固有情報・機密を除外するため汎用内容に限られ、現場適応モードの守秘上書き（false）とは独立（`24` §2・§6）
* 本コミットでドキュメントのみをコミット（コミットメッセージ：`docs: add development reference policy`）。push は行わない

---

## 現場適応モード 次点2場面追加：質問文作成・進捗報告作成（2026-07-10）

## 現場適応モード 次点2場面追加：質問文作成・進捗報告作成（2026-07-10）

### 今回の目的

MVP（作業開始・詰まり記録・終業前メモ＋翌朝再開）に続き、次点の質問文作成・進捗報告作成を追加し、5場面モデルを画面上でそろえる。どちらもコピーのみで保存しない。

### 固定した条件（ユーザー指定）

* 質問文作成・進捗報告作成は保存しない・保存ボタンを出さない（`WorkplaceSceneForm` に `onSave` を渡さない）
* schema変更なし／notes保存処理を追加しない／`createNote`・保存系関数を呼ばない
* `WorkplaceSceneForm` を再利用／急ぎ度は自由入力／場面タグ定数は定義のみ追加
* 守秘注意に加え、AI・チャット・メールに貼る前に一般化する旨を intro に明記
* 既存 `/notes` `/memo` `/prompts` `/settings` 無変更／公開出力・GitHub Pages・配布用HTML・家族用表示へ非接続

### 変更ファイル

* 新規：`app/workplace/question.tsx`（質問文作成）、`app/workplace/report.tsx`（進捗報告作成）。ともに `WorkplaceSceneForm` を `onSave` 未指定で使用＝コピーのみ
* `src/features/workplace/workplaceService.ts`：`buildQuestionText`（聞きたいこと結論→背景→確認→試したこと→判断してほしいこと→急ぎ度。冒頭に丸投げに見えない一文）、`buildReportText`（現在の状態結論→今日やったこと→完了→残り→詰まり→次→相談）を追加
* `src/features/workplace/workplaceTags.ts`：`WORKPLACE_QUESTION_TAG='workplace_question'` / `WORKPLACE_REPORT_TAG='workplace_report'` を定義のみ追加
* `app/workplace/index.tsx`：場面カードに2件追加
* `app/_layout.tsx`：`workplace/question` / `workplace/report` のStack.Screen登録

### 設計判断

* 急ぎ度は `WorkplaceSceneForm` の自由入力を使用（選択UIは足さず、placeholderで「急ぎ / 今日中 / 今週中 など」を誘導）。任意項目
* 出力はAI書き換えせず、入力を結論先頭・ラベル区切りで構造化（既存 start/stuck/end と同方式）
* 保存経路は `saveEndNote`（終業前のみ）のまま。質問・報告はDBに一切触れない

### 検証結果

* `npx tsc --noEmit`：合格（EXIT 0）
* `npx expo export --platform web`：合格（バンドル成功）
* 新2画面に保存系コード（`onSave` / `createNote` / `save`）が無いことを grep で確認
* ブラウザ実操作（カード追加・整理/コピー・保存ボタン非表示・notes未保存）はユーザー確認待ち

### 今回対応せず

* 現場プロファイル、複数現場切り替え／コミット・push

## 現場適応モード 翌朝再開の引き継ぎ初期入力（2026-07-09、MVP後の追加修正）

## 現場適応モード 翌朝再開の引き継ぎ初期入力（2026-07-09、MVP後の追加修正）

### 今回の目的

ブラウザ確認で挙動は良好だったが、「この続きから作業開始」を押しても作業開始フォームに再開内容が反映されない点を修正する。目的は、直近の終業前メモから作業開始フォームへ再開用の内容を初期入力すること。

### 固定した条件（ユーザー指定・維持）

* schema変更なし／作業開始メモは保存せずコピーのみ／終業前メモの保存ルール（private・isGitCandidate=false）は不変
* 既存 `/notes` `/memo` `/prompts` `/settings` 無変更／公開出力・GitHub Pages・配布用HTMLへ非接続

### 実装方針（安全側を選択）

URLに終業前メモ本文を載せず、`?fromRestart=1` のフラグのみ渡し、start画面側で直近終業前メモを取得して初期入力する方式にした。単一の取得元（`getLatestEndNote`）を再利用でき、長文をURLに乗せない。

* 引き継ぎマッピング：明日最初にやること→「今日の作業」、未完了・補足→「先に確認すること」（`未完了: ` / `補足: ` を付けて連結）
* 終業前メモ本文は `buildEndText` の生成フォーマット（`■ ラベル\n値`、空欄は「（未記入）」）を前提にパース。構造が取り出せない本文はそのまま「先に確認すること」に入れるフォールバックあり
* 画面上に青い案内「前回の再開メモから引き継ぎました。内容を確認・修正してから使ってください。」を表示

### 変更ファイル

* `src/features/workplace/workplaceService.ts`：`buildStartPrefillFromEndNote`（＋内部の `parseEndNoteSections`）を追加
* `src/components/WorkplaceSceneForm.tsx`：`initialValues`（マウント時に反映）と `banner` propを追加。values の初期化を initialValues 由来に変更
* `app/workplace/start.tsx`：`fromRestart` 判定を追加。再開時のみ `getLatestEndNote` を待って初期値を組み立て、通常導線は即空欄表示（取得中は ActivityIndicator）
* `app/workplace/index.tsx`：「この続きから作業開始」を `/workplace/start?fromRestart=1` へ変更（通常の作業開始カードは `/workplace/start` のまま＝空欄）

### 検証結果

* `npx tsc --noEmit`：合格（EXIT 0）
* `npx expo export --platform web`：合格（バンドル成功）
* ブラウザ実操作（引き継ぎ有無の分岐・通常導線が空欄）はユーザー確認待ち

### 今回対応せず

* 質問文作成・進捗報告作成、現場プロファイル、複数現場切り替え／コミット・push

## 現場適応モード Phase 14 MVP実装（2026-07-09）

### 今回の目的

先に作成した仕様書（20〜23）に基づき、現場適応モードのMVPを最小実装する。範囲は「入口追加＋場面選択＋作業開始・詰まり記録・終業前メモ＋翌朝再開導線」。質問文作成・進捗報告作成・現場プロファイル・複数現場切り替えは対象外。コミットは行わない。

### 固定した境界条件（ユーザー指定）

* 入口は新規ルート `app/workplace/*` で分離。既存 `/notes` `/memo` `/prompts` `/settings` は無変更
* 保存時は必ず `visibility=private` / `is_git_candidate=false` を固定。`getGitCandidateDefault` は使わない
* schema変更なし・既存DB構造を壊さない
* 公開出力・GitHub Pages・配布用HTML・家族用表示へは接続しない
* 保存禁止情報の注意文を各画面で常時表示
* 場面タグは `workplace_` 接頭辞。共通タグ `workplace` を併記
* 直近終業前メモ取得は専用関数 `getLatestNoteByTag`（タグ境界厳密一致・`updated_at DESC, id DESC`・1件）

### 実装した進め方

進め方1（終業前メモ→翌朝再開表示→作業開始→詰まり記録）を採用。共通部品を先に固め、保存経路（終業前）を最初に通した。

### 新規作成ファイル

* `src/features/workplace/workplaceTags.ts`：場面タグ・共通タグ・守秘既定定数（visibility=private / git候補false）・守秘注意文・タグ組み立て
* `src/features/workplace/workplaceService.ts`：終業前メモ保存（`createNote` 経由で守秘既定を強制、type=thought）／直近終業前メモ取得／作業開始・詰まり記録・終業前の生成テキスト組み立て
* `src/components/WorkplaceSceneForm.tsx`：入力→整理→コピー（任意で保存）を共通化した画面部品。守秘注意を常時表示
* `app/workplace/index.tsx`：場面選択＋直近の終業前メモ表示＋「この続きから作業開始」
* `app/workplace/start.tsx` / `stuck.tsx` / `end.tsx`：3場面の画面（endのみ保存あり）

### 既存への追記（非破壊）

* `src/features/notes/noteRepository.ts`：`getLatestNoteByTag` を**追加のみ**。既存 `getNotes` 等は無変更。タグ境界を `,` で厳密一致し、タグ内の LIKE ワイルドカード（% _、例：`workplace_end` の `_`）を `ESCAPE '\'` でエスケープ。誤マッチ（前方一致・`_` の任意1文字マッチ）を防止
* `app/index.tsx`：ホームヘッダーに「現場適応」ボタンを1つ追加（`/workplace` へ遷移）。既存3ボタンの挙動は無変更
* `app/_layout.tsx`：`workplace/index` `workplace/start` `workplace/stuck` `workplace/end` のStack.Screen（タイトル）を追加

### 守秘・安全側設計の担保点

* 終業前メモの保存は `saveEndNote` → `createNote` に `visibility='private'` / `isGitCandidate=false` を直接渡す。カテゴリ初期値（`getGitCandidateDefault`）は経路に一切登場しない
* type は gitCandidateDefault=false の `thought` を採用（`/notes` 側で開いた場合の二重防御）
* 作業開始・詰まり記録は保存せずコピーのみ（DBに残さない）

### 検証結果

* `npx tsc --noEmit`：合格（EXIT 0）
* `npx expo export --platform web`：合格（787モジュール、workplace 4画面を含めてバンドル成功、import解決エラーなし）
* ブラウザでの実操作（入口→終業前メモ保存→再開メモ表示→作業開始／詰まり記録のコピー、`/notes` 側での private・Git候補外の目視）はユーザー確認待ち

### 今回対応せず

* 質問文作成・進捗報告作成（次点）、現場プロファイル、複数現場切り替え
* notes保存の作業開始・詰まり記録への拡大（コピーのみ）
* コミット・push

## 現場適応モード仕様書の新規作成と既存仕様への参照追記（2026-07-09）

### 今回の目的

未経験者・訓練校生・SES配属直後向けの「現場適応モード」（新しい開発現場・配属先に早く適応するための作業支援モード）の仕様を、既存のメモ管理機能仕様書へ整合的に追加する。今回は仕様書の新規作成と既存仕様への参照追記のみで、コード実装・コミットは行わない。

### 決めたこと・採用した方針

* 命名は `workplace-adaptation` を採用（物理現場でなくIT開発現場を指すこと、`field` がDBのフィールドと紛らわしいことが理由）
* 5場面モデル（作業開始／詰まり記録／質問文作成／進捗報告作成／終業前メモ）を正本とし、「翌朝の再開導線」は5場面に数えず、終業前メモの出力を翌朝表示して作業開始へつなぐ補助導線として分離
* MVP優先は 作業開始／詰まり記録／終業前メモ・翌朝再開。質問文作成／進捗報告作成は次点
* DB方針は既存notes再利用（案A）を第一候補とし、破壊的変更なし。案B（notesカラム追加）・案C（専用テーブル）は比較として残し将来候補。正式なDB定義が要る場合は 03-data-model.md を正本に schema_version 方式に従う
* 現場情報は既定で visibility=private・is_git_candidate=false。公開HTML・配布用・家族用には非混入
* 初期スコープはPC用Webアプリ優先。Android APK・オフラインは将来候補（スマホで現場ルール・再開メモを見る可能性は残す）
* 既存 memos / app/memo/* は変更しない。既存notesへの破壊的変更なし

### 新規作成したファイル（4件）

* docs/memo-app/20-workplace-adaptation-overview.md（方針・目的・対象・定義・スコープ/非スコープ・MVP範囲・本体との境界の正本）
* docs/memo-app/21-workplace-adaptation-flows-and-ui.md（5場面導線と画面フローの正本。翌朝再開導線を別見出しで分離。08へは入口導線のみ委譲）
* docs/memo-app/22-workplace-adaptation-data-and-integration.md（案A/B/C比較と推奨、既存統合方針の正本。DB定義正本は03）
* docs/memo-app/23-workplace-adaptation-security-and-portfolio.md（守秘・セキュリティ運用とポートフォリオ説明の正本）

### 既存仕様書への参照追記（11件・すべてドキュメント）

* CLAUDE.md：読み分け表に現場適応モード行を追加（参照先＝20〜23、08、03、04、07、17）
* 00_START_HERE.md：作業内容別読み分けに「現場適応モード → 20〜23」を追加
* 01-decisions-and-scope.md：1.5節（採用・MVP・案A・コピー中心・PC Web優先／将来候補）
* 03-data-model.md：7章（案A採用でスキーマ追加なし。移行時のみ03を正本に）
* 04-categories-and-tags.md：1.2節（既存type/tags/visibility再利用。具体的なタグ命名は11で管理）
* 07-export-and-git-rules.md：13章（現場情報は既定is_git_candidate=false、書き出し・HTML対象外）
* 08-ui-flow.md：9章（入口導線のみ。「既存の主要導線・既存機能を壊さず」入口追加に留め、詳細は21へ委譲）
* 09-roadmap.md：Phase 14を新設
* 10-tasks.md：16章（Phase 14タスク）
* 11-open-issues.md：14章（現場適応モードの確認待ち）
* 17-distribution-and-sharing.md：6.1節（三区分いずれにも現場情報を非混入）

### 正本範囲の整合性チェック（大きな矛盾なし）

* DB定義は03に一元化（03へはスキーマ追加なし＝案A）／カテゴリ・visibilityは04が正本で新値定義なし
* 画面は08＝入口導線の正本・21＝詳細フローの正本で排他（08に「詳細は21」を明記）
* Git除外・公開範囲は07/17への参照追記のみで既存ルールに従う
* 09と10のPhase番号はともに14で一致／11に未確定事項を反映
* memos / app/memo は不変、notes破壊的変更なしを20/22/03で明記

### 未確定事項（11-open-issues.md §14）

* 生成テキスト（質問文・報告文・再開メモ）を notesに保存するか、コピーのみか（初期はコピー中心）
* 入口・画面の配置（ホーム／app/notes配下／新規ルート app/workplace/*）
* 現場プロファイルの保存構造（案A notes再利用か将来の案B/C移行か）
* 場面タグ・現場タグの具体的な命名（workplace_* を採用するか等）
* 複数現場切り替えの実装時期（初期は単一現場）

### やっていないこと

* コード実装（app/ / src/ / DB）・コミット・push は行っていない（ドキュメントのみ）

### レビュー後の仕様修正（同日 2026-07-09）

内容レビューの指摘を反映した。実装・コミットは行っていない。

* 【要修正】Git候補初期値の衝突を解消：現場適応モードは既存カテゴリのGit候補初期値（`04` §2、worklog等はtrue）に依らず、守秘優先で既定を `is_git_candidate=false` / `visibility=private` に上書きする旨を明記。優先順位（現場適応モードの守秘ルール ＞ カテゴリ初期値）を示した
  * 23に §6.1「カテゴリ初期値に対する守秘優先の上書き」を新設（正本）
  * 22 §4のデータ表現に上書き注意を追記
  * 04 §1.2・07 §13へ参照追記（カテゴリ正本・Git除外正本の双方から上書きを辿れるようにした）
* 【軽微1】20 §3の節参照ミス「8. 非スコープ」→「8. 対象プラットフォーム」に修正
* 【軽微2】「既存ルーティングを壊さない」→「既存の主要導線・既存機能を壊さない（新規ルート追加は可）」に表現統一（21 §1.1、22 §7）
* 【軽微3】22 §4の場面タグ（workplace_*）は確定名でなく例であり、命名は `11` §14で管理する旨を明記
* 【軽微4】22 §6.1「差分案は…別途提示」を「03 §7に参照追記済み」へ実態修正
* 解消した観点：観点3（正本間の整合＝Git候補初期値の矛盾リスク）、観点6（実装前に直すべき記述）。観点1・2・4・5は既に問題なし

### 守秘・公開配布・スマホ閲覧の境界追記（同日 2026-07-09）

コミット前に、守秘・公開配布・スマホ閲覧に関する未確定事項と境界定義を追加した。実装・コミットは行っていない。

* 【職場情報の範囲を守秘設計として明記】23に §3.1「職場情報の範囲（守秘設計）」を新設（正本）。職場情報は個人情報・顧客情報だけでなく、職場固有の業務ルール・報告経路・判断基準・システム操作手順・例外対応・社内資料の内容も含む。現場適応モードは職場固有ルール・内部手順を蓄積する機能ではなく、抽象化された個人用チェック項目に留める。実名・会社名・顧客名・社員名・システム名・内部URL・具体的画面名・社内マニュアル本文・会社固有の判断基準は保存・Git出力・外部AI投入・公開用データ化しない
  * 20 §5・22 §5へは参照追記のみ（範囲の正本は23 §3.1。重複定義にしない）
* 【スマホ閲覧と公開配布の分離】11 §14に未確定事項を1項目追加。将来スマホで現場適応モードの内容を確認できるようにする場合でも公開GitHub Pagesには現場情報を出さず、非公開チャネル・ローカル閲覧・認証付き環境など公開配布と分離した方法を検討する（方式は未確定。守秘正本は23 §7・§3.1）

---

## 2回目APKビルド前のversionCode更新（2026-07-07）

* app.json の android.versionCode を 1 → 2 に更新。初回APK（versionCode 1）をインストール済みの端末へ、更新版を安全に上書きインストールするための採番
* 2回目APKに載る主な差分：クリップボード修正（9338a07）、アプリ内プロンプト一覧画面（e80a5bf）
* `npx expo config --type public` で versionCode: 2 / package: com.ykjob.mindhub が正常に読めることを確認
* 16-platform-and-distribution.md §2.5 のビルド設定記述を実態に更新（旧仮置きの com.ykjob.flowdock / versionCode 1 の記述を修正、初回ビルド実施済み・2回目はversionCode 2予定を明記）
* EAS build は未実行。アプリ本体コードは無変更。pushはユーザー確認待ち

---

## Androidエミュレータ自動確認の調査記録とMaestro雛形作成（2026-07-07）

## Androidエミュレータ自動確認の調査記録とMaestro雛形作成（2026-07-07）

### 今回の目的

Android APKを毎回スマホで手動確認する手間を減らすため、エミュレータ上で最低限の回帰確認を自動化する土台を作る。今回は調査結果のドキュメント化とMaestroフロー雛形の作成のみ（実行・CI化・コード変更はしない）。

### 作成したもの

* `docs/memo-app/19-android-emulator-testing.md` 新規：調査結果と導入案。目的／現状前提（EAS preview=APK・internal、appId=com.ykjob.mindhub、testID未整備）／adbでできること・厳しいこと／Maestroでできること／Detox・Appium・Maestro比較（Maestro推奨）／Windows導入方針（WSL2推奨）／推奨構成（adb=配管・Maestro=UIシナリオ・CIは後回し）／最小テスト2本／すぐやる・後回し／既知の制約／残る未決事項
* `.maestro/README.md` 新規：ディレクトリの目的・前提（エミュレータ起動・APKインストール済み・appId）・実行イメージ・雛形である旨・文言変更時は要修正
* `.maestro/flows/01_create_and_persist.yaml` 新規：起動→メモ管理→新規作成→本文入力→カテゴリ選択→visibility選択→保存→表示確認→stopApp→launchApp→永続化確認。冒頭のみ clearState:true、再起動時はclearStateなし
* `.maestro/flows/02_prompt_copy.yaml` 新規：起動→プロンプト集→検索→カード展開→コピー→「コピーしました」確認

### 方針・設計判断

* ツールはMaestro（可視テキストベース）＋adb（配管）を推奨。Detox/Appiumは実リリースAPK検証には重く非推奨
* testID未整備のため可視テキスト（保存・コピー・カテゴリ名・visibility名など）で操作する。フローは文言変更に弱い旨を明記
* コピー成功はクリップボード内容の直接検証ではなく「コピーしました」表示で判定
* 作成保存後は router.replace で詳細画面へ遷移するため、一覧確認は back で戻る構成にした
* タイトル欄はラベルとplaceholderが同じ「タイトル」で曖昧になるため、placeholderが一意な本文欄にテスト文字列を入れる構成にした
* CI化は後回し（UI流動的・EASビルド10〜20分のため時期尚早）

### やっていないこと（今回の対象外）

* Maestro/エミュレータの実行、CI設定、testID追加、アプリ本体コード変更、EAS build、GitHub Pages有効化、PWA化、配布用リポジトリ作成

### 検証結果

* 追加・変更はドキュメントと `.maestro/` 雛形のみ。アプリ本体（app/ / src/）は無変更
* YAMLはappId＋`---`＋コマンド配列の構造で記述（Maestro標準形式）。実エミュレータでの実行はこれから（未実行の雛形）
* `git status` と変更ファイル一覧で確認

### 残る未決事項（19 §12）

* Maestro実行環境（WSL2 or Windowsネイティブ）、AVDイメージ選定、実行タイミング（手動/CI）、testID付与範囲、テストメモのクリーンアップ方針

---

## APK初版実機確認の記録とアプリ内プロンプト一覧画面の追加（2026-07-07）

## APK初版実機確認の記録とアプリ内プロンプト一覧画面の追加（2026-07-07）

### APK初版の実機確認結果

初回EAS APKビルド成功→Android端末インストール成功→開発サーバーなしで起動成功。以下を実機確認した。

* 成功：単体起動、メモ管理（notes）の作成・編集・保存、一覧表示、再起動後のデータ保持、familyカテゴリ／visibility=family表示・保存、FlowDock（既存メモ）の作成・編集
* 許容（未改善）：Androidキーボードで保存ボタンが隠れる件（キーボードを閉じて操作）
* 未確認（次回以降）：検索・絞り込み・並び替え、Markdownプレビュー、機内モードでの保存、prompts.htmlのブラウザコピー
* 判断：起動・保存・再起動後保持・カテゴリ/visibility表示は成功。Android APKとしての土台は成立
* 記録先：docs/memo-app/16-platform-and-distribution.md §2.5 のチェックリストに結果を反映

### クリップボード不具合（前タスク）の位置づけ

* 「クリップボードを使用できません」は `9338a07 fix: support clipboard copy on native builds` で修正済み（expo-clipboardでネイティブ分岐）
* 既存APKには未反映。次回EAS再ビルド後のAPKで実機再確認が必要（16 §2.5に明記）

### アプリ内プロンプト一覧画面の追加（今回の実装対象）

APK上で「プロンプト集をどこから開くか分からない」状態を解消するため、生成済みHTMLを探して開く運用に加え、アプリ内画面としてプロンプトを一覧・検索・コピーできるようにした。

* `src/features/notes/promptHub.ts` 新規：generate_prompt_hub.mjs の loadPromptEntries() と同じセクション構成（PromptGroup[]）をReact Native側へ提供する共有データ層。chatgptPrompts.ts（カテゴリ別10）＋mobilePrompts.ts（追加31）を統合し計42件・7セクション。HTMLとアプリで同じ定義を共有し収録内容がずれないようにした
* `app/prompts/index.tsx` 新規：SectionListでセクション別表示。検索（プロンプト名・ID・分類）、カード展開で本文表示（selectable）、コピーボタンは修正済み `copyToClipboard()` を使用。コピー成功＝緑「コピーしました」／失敗＝赤「コピー失敗」を2〜2.5秒表示。family系は「private / family用」バッジ＋公開範囲の注記、個人情報注意バッジも表示（prompts.htmlと同等の情報）
* `app/_layout.tsx`：`prompts/index`（タイトル「プロンプト集」）を登録
* `app/index.tsx`：ホームヘッダーに「プロンプト集」ボタンを追加（既存の「メモ管理」「設定」の左）

### 設計判断（記録）

* mobilePrompts.ts は従来「アプリ画面からはimportしない（バンドル軽量化）」としていたが、今回のAPK内プロンプト表示要件により方針を上書き。アプリから読めるようにし、ファイル冒頭コメントを「HTML生成スクリプトとpromptHub.tsの2系統が共有する」旨に更新した
* prompts.html 自体をWebViewで表示する方式は採らず、既存のプロンプト定義をReact Native画面で描画する方式を採用（ユーザー指定の優先方針）
* generate_prompt_hub.mjs は無変更。prompts.htmlの生成は従来どおり動作することを確認（7セクション・42プロンプト。タイムスタンプのみの差分は破棄）

### 今回対応しないもの

* Markdown書き出しのAPK対応（Web版のみで可とする）／Androidキーボード問題の追加修正／Phase 8テンプレDB管理／JSONインポート／GitHub Pages有効化／PWA化／配布用リポジトリ／EAS build実行／push

### 変更したファイル

* コード（新規）：src/features/notes/promptHub.ts、app/prompts/index.tsx
* コード（変更）：src/features/notes/mobilePrompts.ts（冒頭コメントのみ）、app/_layout.tsx（ルート登録）、app/index.tsx（導線ボタン）
* ドキュメント：docs/memo-app/16-platform-and-distribution.md §2.5、current-tasks.md、docs/worklog/current.md、docs/memo-app/10-tasks.md
* DB（schema/migrations）・保存処理・FlowDock・EAS設定・依存関係は無変更

### 検証結果

* `npx tsc --noEmit` エラーなし
* `npx expo export --platform web` 成功（Web版非破壊）
* `npm run generate:prompt-hub` 成功（7セクション・42プロンプト。prompts.html生成が壊れていないことを確認）
* Android APKでのプロンプト一覧・コピーの実機確認は、EAS再ビルド後に行う（要再ビルド）

### 次にやること

* ユーザー確認後にpush → EAS再ビルド → Android端末へ再インストール → プロンプトコピー成功とプロンプト一覧画面の実機確認

---


## Androidパッケージ名の確定（2026-07-07）

* android.package を `com.ykjob.flowdock`（仮置き）→ **`com.ykjob.mindhub` で確定**（app.json変更）
* 理由：アプリ全体がFlowDock単体ではなく、メモ管理・プロンプト集・家族共有・配布用データ・Android APK・将来のJSONインポートまで含む方向のため。パッケージ名は初回インストール後に変えにくい
* 表示名（FlowDock）・slug・schemeは変更しない（今回の変更はandroid.packageの1行のみ）
* 11-open-issues.md 12章の仮置き項目を決定済みへ移動
* 検証：`npx expo config` で正常に読めることを確認
* EAS buildは未実行。pushはユーザー確認待ち

## 配布・実機運用前の土台整備（2026-07-07）

### 今回の目的

Android APK運用・家族用/配布用データ分離・スマホ用プロンプト閲覧・将来のJSONインポートに向けて、小〜中規模の実装と仕様整理をまとめて行う。

### 実装したもの

1. **familyカテゴリ / visibility=family のコード反映**（コミット 40b3aed）
   * noteTypes.ts：NoteType / NoteVisibilityに'family'追加
   * noteCategories.ts：NOTE_CATEGORIES末尾に家族共有（Git候補初期値false。fallbackのNOTE_CATEGORIES[4]=thoughtを維持するため末尾固定）、NOTE_VISIBILITIESにfamily追加
   * chatgptPrompts.ts：家族共有メモの整理テンプレート・注意書き追加
   * mobileViewPolicy.ts新設：公開Pages出力可否判定（judgeMobileViewExport。除外理由つき。13 §3準拠。family / private / internal / アーカイブ / 非Git候補を除外）。アプリ画面からは未import、Phase 10で使用予定
   * notes列はTEXT型のため**DBマイグレーション不要**を確認。作成・編集画面はNOTE_CATEGORIES / NOTE_VISIBILITIESの動的描画のため自動で選択肢に出る
2. **EASビルド準備**（コミット 98ec741）
   * eas.json新規（preview / production とも internal distribution・APK形式）
   * app.json：android.package=com.ykjob.flowdock（**仮置き**。初回ビルド前まで変更可）、versionCode=1。`npx expo config` で解析確認
   * eas build / login / build:configure は未実行（Expoアカウントのユーザー操作待ち）
3. **prompts.html軽微改善**（コミット c9f7210）
   * セクション見出しに件数表示、検索欄下に「全42件／表示中 n / 42件」表示
   * familyカテゴリカード追加で計42本。familyカードは「private / family用」バッジ

### 仕様整理だけに留めたもの（実装していない）

* JSONインポート・エクスポート：docs/memo-app/18-json-import-export.md 新規作成（形式=format+schemaVersion+notes全カラム、v1はnotesのみ、重複IDはupdated_at比較で上書き/スキップ、結果は追加/更新/スキップ/失敗の件数表示、PC=エクスポート・Android=インポートの責務分担、自動同期は対象外のまま）
* APK初版の機能範囲・確認チェックリスト：16 §2.5に整理。現行機能のみで作る。既知の制約として、アプリ内コピー（clipboard.tsがWeb専用）とMarkdown書き出し（Blob+アンカー方式）はAPK上で動かない想定を明記
* Phase 8（テンプレートDB管理）本体・JSONインポート実装・GitHub Pages有効化・リポジトリ公開設定・PWA化・配布用リポジトリ作成は行っていない

### 未決定として残したもの

* Androidパッケージ名仮置きの確定、EASアカウント準備（ユーザー操作）
* JSONインポートの実装時期・Android側ファイル選択の依存（expo-document-picker等）導入判断
* 家庭内情報の共有手段の着手順、配布用リポジトリの名称・構成・タイミング

### 変更したファイル

* コード：src/features/notes/noteTypes.ts / noteCategories.ts / chatgptPrompts.ts / mobileViewPolicy.ts（新規）、scripts/generate_prompt_hub.mjs、eas.json（新規）、app.json、docs/mobile-view/prompts.html（再生成）
* ドキュメント：docs/memo-app/03 / 04 / 09 / 10 / 11 / 13 / 14 / 16 / 18（新規）、CLAUDE.md、00_START_HERE.md、current-tasks.md、docs/worklog/current.md
* app/ 配下・保存処理・DB処理（schema / migrations）・FlowDock・SDK設定は無変更。依存関係の追加なし

### 検証結果

* コミット1後：`npx tsc --noEmit` エラーなし、`npx expo export --platform web` 成功（769モジュール）
* コミット2後：`npx expo config --type public` 正常（SDK 54認識）
* コミット3後：生成成功（7セクション・42プロンプト）、構造チェック全OK（カード42・familyバッジ6・個人情報注意3・ID一意）、インラインJS構文OK

### 次にやること

* ドキュメントコミット（4コミット目）→ ユーザー確認後にpush
* EASアカウント準備（ユーザー操作）→ 初回APKビルド
* prompts.htmlのスマホ実機確認

---

## プロンプト集への追加31プロンプト実装（2026-07-06）

### 今回の目的

prompts.htmlを、ChatGPT / Gemini / Claude Code / Codexへ貼り付けやすい実用プロンプト集にする。14 §1.3の不足5本に加え、利用傾向から必要性が高い26本を追加する。

### 実装内容

* `src/features/notes/mobilePrompts.ts` 新規作成（計31本）
  * データ専用モジュール。アプリ画面からはimportしない（Metroバンドル非対象を確認済み）。NOTE_CATEGORIESには追加せず、メモ作成画面のカテゴリ選択肢には混ざらない
  * 構造：`{ id, name, group, promptBody, note? }` ＋ グループ見出し定義。将来はnote_templates（category_type='template'の複数テンプレート）としてseed予定
* `scripts/generate_prompt_hub.mjs` 拡張
  * chatgptPrompts.tsとmobilePrompts.tsの両方をコンパイル・読み込み
  * セクション別描画（7セクション）、グループ見出し、絞り込みで空になったセクションは見出しごと非表示
  * 生活・家庭共有系に「private / family用」バッジと注記を表示
* 収録内訳（計41本）：メモ整理カテゴリ別10／タスク・予定整理4（time_slot_tasks, google_tasks, google_calendar, daily_priority）／開発・AI作業8（codex_review, chat_handoff_summary, claude_work_start, spec_update_request, bug_report, implementation_review_request, device_checklist, worklog_close_summary）／思考整理・行動化5（brain_dump_to_action, stuck_reason, one_day_plan, stop_overthinking, next_one_action）／就活5（career_experience, interview_answer_draft, ses_application_adjust, job_posting_match, plain_talk_training）／生活・家庭共有5（family_manual, household_rule, wife_schedule, outing_plan, shopping_memo）／投資・検証4（pead_result_summary, trading_rule_check, validation_log, release_note_draft）
* 今回見送り（ユーザー指定）：Claude Code報告確認・リポジトリ状況整理・検証結果レビュー
* プロンプト本文に個人情報・家庭内情報は含めていない（店名等も一般名詞の例示のみ）

### 変更したファイル

* src/features/notes/mobilePrompts.ts（新規・データ専用）
* scripts/generate_prompt_hub.mjs
* docs/mobile-view/prompts.html（再生成）
* docs/memo-app/14-mobile-prompt-hub-and-inbox.md（§1.2追記・§1.7追加）
* docs/memo-app/10-tasks.md、current-tasks.md、docs/worklog/current.md

app/ 配下・保存処理・DB処理・FlowDock・SDK設定は無変更。依存関係の追加なし。

### 検証結果

* `npm run generate:prompt-hub` 成功（7セクション・41プロンプト）
* HTML構造検証：カード41・コピーボタン41・pre41、ID一意・紐付け完全、個人情報注意バッジ3、private/familyバッジ5＋注記5、外部リソース参照なし
* インラインJS構文チェック合格
* `npx tsc --noEmit` エラーなし、`npx expo export --platform web` 成功（748モジュール。mobilePrompts.tsはバンドルに含まれず、アプリ本体への影響なし）
* ブラウザでの表示・コピー・絞り込みの実操作はユーザー確認待ち

### 次にやること

* ユーザーの表示・コピー確認 → 問題なければcommit（ユーザー判断。pushは別途指示待ち）
* 見送り3本の追加要否は将来判断

---

## プロンプト集HTML先行生成（Phase 11短期分）の実装（2026-07-06）

### 今回の目的

note_templatesのDB化を待たず、コード固定のプロンプト定義（chatgptPrompts.ts）からスマホ閲覧用プロンプト集HTMLをdocs配下へ生成する（14 §1.6の短期方針）。スマホでプロンプトを見てコピーできることの先行検証が目的。

### 実装内容

* `scripts/generate_prompt_hub.mjs` を新規作成。`npm run generate:prompt-hub` で `docs/mobile-view/prompts.html` を生成する
* データ取得層 `loadPromptEntries()` と描画層 `renderHtml(entries)` を分離。PromptEntryの形はnote_templatesのカラム（category_type / name / prompt_body / sort_order）に対応させており、将来のDB切替はloadPromptEntries()の差し替えのみ
* 技術方式：既存コードの拡張子なしimportによりNode 24のTS直接実行が使えないため、既存devDependencyのTypeScriptコンパイラAPIで `node_modules/.cache/prompt-hub/` へCommonJSコンパイルしてからrequireする。**新規ライブラリ追加なし**
* HTML仕様：単一ファイル完結（CSS/JSインライン・外部リソースなし・noindex）、#2563EB基調、ライト/ダーク対応、カテゴリ別カード10枚（カテゴリ名・typeチップ・個人情報注意バッジ・コピーボタン・detailsで折りたたみの全文pre）、カテゴリ名絞り込み、コピーはClipboard API＋execCommandフォールバック、生成日時と「コード固定定義から生成・将来DB切替予定」の注記
* v1収録：カテゴリ整理プロンプト10個（chatgptPrompts.ts由来）。14 §1.3の不足5本（時間帯別タスク化・Googleタスク整形・カレンダー整形・優先順位整理・Codexレビュー依頼）は本文未作成のため後続対応
* package.jsonに `generate:prompt-hub` スクリプトを追加（アプリ依存関係は無変更）

### 変更したファイル

* scripts/generate_prompt_hub.mjs（新規）
* docs/mobile-view/prompts.html（新規・生成物。Git管理に含める方針）
* package.json（scriptsに1行追加）
* docs/memo-app/10-tasks.md、11-open-issues.md、current-tasks.md、docs/worklog/current.md

アプリ本体（app/ / src/）・保存処理・FlowDock・SDK設定は無変更。

### 検証結果

* `npm run generate:prompt-hub` 成功（10プロンプト、約17KB）
* 生成HTML構造検証：カード10・コピーボタン10・pre10、個人情報注意バッジ3（thought / chatgpt_log / jobsearch）、ID一意・ボタンとpreの紐付け完全、viewportあり、外部リソース参照なし
* インラインJSの構文チェック（node --check）合格
* `npx tsc --noEmit` エラーなし、`npx expo export --platform web` 成功（アプリ非破壊を確認）
* ブラウザでの表示・コピーボタンのタップ動作・スマホ幅での見え方はユーザー確認待ち

### 未完了・次にやること

* ユーザーによるブラウザ・スマホでの表示/コピー確認 → 問題なければcommit（ユーザー判断）
* GitHub Pages有効化（main / docsフォルダ）とリポジトリ公開可否の判断（11-open-issues.md 10章）
* 14 §1.3の不足5プロンプトの本文作成と追加方法の決定

---

## 運用方針の詳細確定と仕様書反映（2026-07-06）

### 決定内容（ユーザー決定7項目）

1. APKビルド方式：初回はEASクラウドビルド（profile: preview / internal distribution / APK形式）。ローカルビルド（Android Studio / Gradle / Java）は環境整備が重いため後回し
2. SDKバージョン：SDK 54を正式採用候補のまま進める。SDK 56固有機能は未使用で、SDK 54でtsc・Webバンドル・expo-doctorが通っているため。SDK 56への変更はSDK 56固有機能が必要になった時に再検討
3. 家族用ページの公開範囲：家族間の決まり事・家庭内マニュアルは公開GitHub Pagesに置かない。公開Pagesに出してよいのは公開されても困らない内容だけ。家庭内情報は非公開配置先・ローカルHTML共有・PDF・JSONインポート・将来のprivate向けPWAなどを別途検討
4. familyカテゴリを追加。公開可否はカテゴリだけで判定せず、visibilityを併用（category=familyでもvisibility=private / familyは公開Pagesに出さない）。visibilityにfamily値を追加
5. 配布用は別リポジトリで決定。汎用テンプレート・汎用知識データ・サンプルデータ・説明書のみ。個人情報・家族情報・家庭内ルール・自分用完全DBは含めない
6. 配布物の範囲：まずWeb/PWA・JSON・説明書を優先。配布用APK・ソース公開は将来候補（初期必須にしない）
7. プロンプト集HTML生成方式：短期はコード固定プロンプト定義（src/features/notes/chatgptPrompts.ts）からdocs配下へ生成し、note_templates実装後に出力元をDBへ切り替える（仕様の穴を解消。Phase 11がPhase 8〜9非依存になった）

### 反映したファイル（すべてドキュメントのみ。コード変更なし）

* docs/memo-app/16-platform-and-distribution.md（2.3ビルド方式・2.4 SDKバージョンを決定として記載）
* docs/memo-app/17-distribution-and-sharing.md（4.1公開範囲・4.2 familyカテゴリ・5.5配布物の範囲を追加）
* docs/memo-app/13-mobile-view-export.md（3.2除外カテゴリにfamily追加、3.3 familyカテゴリとvisibilityの扱い、6.2を決定内容に更新）
* docs/memo-app/04-categories-and-tags.md（1.1追加カテゴリ：family）
* docs/memo-app/03-data-model.md（typeとvisibilityにfamily追加、カテゴリ＋visibility併用判定を追記）
* docs/memo-app/14-mobile-prompt-hub-and-inbox.md（1.6生成方式を追加）
* docs/memo-app/09-roadmap.md（Phase 11に短期方針・先行着手可を追記、Phase 12のやることをEAS前提に更新）
* docs/memo-app/10-tasks.md（Phase 12のビルド方式・SDK確定タスクを完了化しEAS準備タスクを追加、Phase 11に生成実装タスク、Phase 8にfamilyカテゴリタスク、Phase 10の対象条件にfamily除外を追記）
* docs/memo-app/11-open-issues.md（10・12・13章を決定済み／残る未確定に整理）
* current-tasks.md

### 残る未確定（11-open-issues.md参照）

* JSONインポートの仕様、APK初版の機能範囲、EASアカウント準備・Androidパッケージ名（12章）
* 家庭内情報の共有手段の着手順、familyカテゴリの実装タイミング、配布用リポジトリの名称・構成・作成タイミング（13章）
* プロンプト集HTMLの出力先ファイル名・生成の起動方法（10章）
* check-expo-sdk54ブランチのmainマージタイミング

### 次にやること

* 次の実装候補から着手対象のユーザー判断（プロンプト集HTML先行生成／familyカテゴリ追加／EASビルド準備／Phase 8 DB管理）

---

## 配布・共有方針の決定と仕様書反映（2026-07-06）

### 決定内容（三区分）

* 自分用：完全版として運用。Android APK版で自分が使用。自分のメモ・テンプレート・家族用データ・家庭内の決まり事・個人的な知識データを含めてよい
* 家族用：家族は編集せず、Webページで閲覧。家族間の決まり事・家庭内マニュアル・共有したい情報を表示。自分用データから出力するが、家族に見せてよい情報だけを対象にする
* 配布用：知人などに渡す可能性があるため、自分用・家族用とは分離。配布用リポジトリを別に作り、汎用の知識データ・汎用テンプレート・サンプルデータ・説明書だけを含める。個人情報・家族情報・家庭内の決まり事・私的メモは含めない。自分用の完全版をそのまま渡さない
* 同一リポジトリ内のディレクトリ分離ではなく別リポジトリ分離を採用（更新の手間より情報混入リスク低減を優先）
* 将来候補：配布用データだけを書き出すエクスポート機能（当面は手動選別）

### 反映したファイル（すべてドキュメントのみ。コード変更なし）

* docs/memo-app/17-distribution-and-sharing.md（新規。三区分の方針）
* docs/memo-app/01-decisions-and-scope.md（1.4 追加決定事項）
* docs/memo-app/09-roadmap.md（Phase 13将来拡張に配布用リポジトリ整備・エクスポート機能を追加）
* docs/memo-app/10-tasks.md（14章の仕様書整理に完了分を追加、15章将来候補に配布用タスクを追加）
* docs/memo-app/11-open-issues.md（13章を追加：家族用ページの配置先・公開範囲の整合、家族向けカテゴリ設計、配布用リポジトリの名称・構成・タイミング、配布物の形、エクスポート機能仕様）
* docs/memo-app/13-mobile-view-export.md（6.2に家庭内情報と公開前提の整合が確認待ちである旨を追記）
* docs/memo-app/15-future-and-rejected-policies.md（1.10 配布用データエクスポート機能を将来候補に追加）
* docs/memo-app/16-platform-and-distribution.md（17への参照を追加）
* 00_START_HERE.md / CLAUDE.md（読み分けガイドに17を追加）
* current-tasks.md

### 見つかった論点（11-open-issues.md 13章に記録。勝手に決めていない）

* 家族用に表示する家庭内の決まり事・マニュアルは、既存のスマホ閲覧ページの「公開されても困らない内容だけ（公開GitHub Pages前提）」と性質が異なる。配置先を公開Pagesのままにするか、非公開配置・簡易認証を検討するかは確認待ち
* 現行の公開許可カテゴリに家庭内情報用カテゴリがない。家族向けカテゴリ追加か既存カテゴリ＋visibilityでの対応かは確認待ち（note_categories実装（Phase 8）との関係も考慮）

### 次にやること

* 11-open-issues.md 13章の各項目のユーザー判断（特に家族用ページの配置先・公開範囲）
* 配布用リポジトリの作成タイミングの判断

---

## 端末別運用方針の決定と仕様書反映（2026-07-06）

### 決定内容

* 自分用（Android端末）：開発サーバーなしで動くAndroid APK版をビルドし、アプリとして端末にインストールして使う（動作確認用と実用を兼ねる）。用途：メモ作成、編集、テンプレート管理、JSONインポート、オフライン利用の確認
* 家族用（iPhone）：編集や管理はしない想定のため、iPhone向けアプリ配布・EAS iOSビルドは行わない。閲覧専用Webページ（スマホ閲覧用HTML/JSON、仕様書13）をSafari等で見てもらう。編集なし・必要に応じてコピー・インストール不要
* PC / Android / iPhone間の自動同期は今回の対象外

### 反映したファイル（すべてドキュメントのみ。コード変更なし）

* docs/memo-app/16-platform-and-distribution.md（新規。端末別運用・配布方針）
* docs/memo-app/01-decisions-and-scope.md（1.3 追加決定事項、§4後回しの「スマホ対応」を更新）
* docs/memo-app/09-roadmap.md（Phase 12=Android APK版ビルドを追加。旧Phase 12将来拡張はPhase 13へ繰り下げ、「スマホ対応（アプリとして）」の項を整理済みとして削除）
* docs/memo-app/10-tasks.md（14章にPhase 12タスクを追加。将来候補は15章へ）
* docs/memo-app/11-open-issues.md（12章を追加：APKビルド方式、対象SDKバージョン、JSONインポート仕様、初版に含める機能範囲、家族用閲覧ページの配置先）
* docs/memo-app/13-mobile-view-export.md（§1に「主な閲覧者は家族のiPhone」を追記）
* docs/memo-app/15-future-and-rejected-policies.md（2.3にiPhone向けアプリ配布・EAS iOSビルドの不採用を追加。旧2.3は2.4へ）
* 00_START_HERE.md / CLAUDE.md（読み分けガイドに16を追加）
* current-tasks.md（フェーズ・完了・確認待ち・将来候補・不採用を更新）

### 未確定事項（11-open-issues.md 12章に記録。勝手に決めていない）

* APKのビルド方式（EASビルドかローカルビルドか。eas.jsonは未作成）
* ビルド対象SDK（SDK 54調査はiPhone Expo Go対応が目的だったため、iPhoneアプリ配布を行わない本方針の下でSDK 54に留める必要があるか再判断が必要）
* JSONインポートの仕様（対象データ・形式・重複時の扱い・PC側エクスポート機能の要否）
* APK初版に含める機能範囲（テンプレート管理はPhase 8〜9依存）

### 次にやること

* 11-open-issues.md 12章の各項目のユーザー判断
* Phase 12（Android APK版）の着手判断

---

## 今回の目的（スマホ保存導線の修正）

iPhone実機（Expo Go 54 / check-expo-sdk54ブランチ）でのメモ作成画面の不具合を修正する。(1)保存ボタンがキーボードに隠れる、(2)キーボード表示中のタップが分かりにくい、(3)保存ボタンが無反応でメモが保存されない。SDK 54化とは別件の既存UI/保存不具合として扱う。

## 原因

* **保存無反応の根本原因**：`src/utils/id.ts` の `generateId()` が Web専用の `crypto.randomUUID()` を使用。iPhoneのHermesエンジンには `crypto` が存在しないため保存時に例外が発生し、`app/notes/create.tsx` の空catchが握りつぶして「無反応」に見えていた
* 同じ `generateId` を既存の軽量メモ（`src/features/memos/memoService.ts`）も使用しており、**スマホ実機では既存メモ作成も同様に失敗する状態だった**（今回の修正で同時に直る）
* DB自体は問題なし：expo-sqliteはネイティブでは端末内ローカルSQLiteに自動保存される（Web=OPFS、実機=アプリ内サンドボックスで元々別DB）。「スマホ側ローカルDBに保存」は追加実装不要
* 保存ボタンがキーボードに隠れる件：フッターがKeyboardAvoidingView無しの固定配置だったため

## 修正内容

* `src/utils/id.ts`：`crypto.randomUUID()` → `expo-crypto` の `Crypto.randomUUID()` に変更（iOS/Android/Web全対応）。`npx expo install expo-crypto`（~15.0.9、Expo Go内蔵モジュール）を追加
* `src/components/NoteForm.tsx`：
  * 全体を `KeyboardAvoidingView`（iOSは `behavior="padding"`、offset=ヘッダー高さ `useHeaderHeight()`）で包み、キーボード表示中も保存フッターが上に押し上げられて見えるようにした
  * ScrollViewに `keyboardShouldPersistTaps="handled"` を追加（キーボード表示中でもボタン・チップの1タップ目が反応する）
  * `keyboardDismissMode="on-drag"` を追加（スクロールでキーボードが閉じる）
* `app/notes/create.tsx` / `app/notes/[id]/edit.tsx`：保存失敗時に握りつぶさず `showMessage`（実機はAlert、Webはwindow.alert）でエラー内容を表示するようにした
* 保存成功時の挙動は従来どおり（作成→詳細画面へ遷移、編集→前画面へ戻る）で、これが保存完了の合図になる

## 実機確認3回目：画面ごとの適用漏れ修正（同日）

* 実機切り分け結果：notes編集=成功／notes作成=バーが出ない／FlowDock（memo作成・編集）=未対応のまま
* 原因分析：notes作成と編集は同じNoteFormを使っており、差は「編集はDB読み込み後（遷移完了後）にマウント、作成は遷移アニメーション中に即マウント」のみ。iOSは**画面遷移中にInputAccessoryViewをマウントするとキーボードへの登録に失敗する**ため、作成だけ効かなかったと判断
* 対応：共通コンポーネント `src/components/FormFooterBar.tsx` を新設し全4画面に適用
  * 通常フッター＋iOSのキーボード直上バーをセットで描画。バーは `InteractionManager.runAfterInteractions` で**遷移完了後にマウント**（今回の失敗原因への対策）
  * フッターは保存が左端・キャンセルがその右（justifyContent: flex-start）で統一
  * `inputAccessoryProps(id)` ヘルパーでTextInputに紐付け。IDは画面ごとに一意（note-form-footer / memo-create-footer / memo-edit-footer）
  * `onAccessoryReady` コールバックを用意。FlowDock側の `autoFocus` はバー登録前にキーボードが出てしまうため廃止し、バー準備完了後に `focus()` する方式に変更（キーボードは従来どおり自動で開く）
* 適用画面：NoteForm（notes作成・編集）、app/memo/create.tsx、app/memo/[id]/edit.tsx。FlowDock側の効いていなかったKeyboardAvoidingViewは撤去し、保存ボタンを左下配置に変更
* 既存機能への変更はUI（フッター配置・キーボード対応・フォーカス方式）のみ。保存処理・DB処理・GitHub連携は無変更
* 検証：`npx tsc --noEmit` エラーなし、`npx expo export --platform web` 成功

## 実機確認4回目：iPhone保存・キーボード対応を一旦完了扱いに（同日）

* 実機確認結果：メモ管理の編集画面○、FlowDockの作成・編集画面○
* **メモ管理の新規作成画面はキーボードに隠れるが今回は許容（未改善のまま完了扱い）**
* **Androidは全画面でキーボードに隠れるが、キーボードを閉じるボタンがあるため優先度低として今回は許容（未改善のまま完了扱い）**
* iPhoneでの保存（expo-crypto ID生成）・保存導線は解決済み。上記2点は将来の改善候補として残す

## スマホ閲覧・プロンプト集仕様の確認（同日）

* 「プロンプトテンプレートがスマホで見られない」件を受けて、仕様書12〜14の記載を確認した
* 確認結果：テンプレート管理画面（12 §5〜6）、閲覧対象の安全条件 is_git_candidate=true＋visibility=git_candidate＋公開許可カテゴリ（13 §3）、コピーボタン（13 §5.4）、docs/mobile-view/＋GitHub Pages閲覧（13 §2・§6）、PC出力→スマホ閲覧・手動push方針（13 §1・§7、14 §2.3）はすべて仕様に入っている
* **仕様の穴を1点発見**：スマホ用プロンプト集HTML（14）の生成方式が未定義。note_templatesからのHTML/JSON出力仕様がどこにも書かれておらず、note_templates自体も未実装（Phase 8）。11-open-issues.md 10章に記録した（コード固定プロンプトから先に生成する案も併記）
* 現時点ではスマホ閲覧用HTML/JSON・プロンプト集HTMLはすべて未実装（Phase 10〜11、仕様のみ）。実装着手はユーザー判断待ち

## 実機確認2回目とInputAccessoryView方式への変更（同日）

* 実機確認2回目：キーボードイベント監視＋paddingBottom方式でも**保存ボタンはキーボードに隠れたまま**だった。JSでキーボード高さを取得して動かす方式はこの環境（Expo Go SDK 54＝新アーキ＋native-stack）では信頼できないと判断
* 方式変更：`InputAccessoryView`（iOSネイティブがキーボード直上への固定表示を保証するバー）に保存・キャンセルボタンを載せる方式へ変更。JSのイベント取得・レイアウト計算に依存しないため、キーボード表示中は必ずボタンが見える
  * NoteFormに `FOOTER_ACCESSORY_ID` を定義し、全TextInput（タイトル・プロジェクト・タグ・本文）の `inputAccessoryViewID` に紐付け
  * `Platform.OS === 'ios'` のときだけInputAccessoryViewを描画（react-native-webに実装がないため。PC Webは通常フッターのみで変化なし）
  * 通常フッターはキーボード非表示時にそのまま画面下部に表示される
* フッターのボタン配置を右下→左下に変更（保存が左端、キャンセルがその右。justifyContent: flex-start）
* `src/utils/keyboard.ts`（useKeyboardBottomInset）は効果がなかったため削除
* 検証：`npx tsc --noEmit` エラーなし、`npx expo export --platform web` 成功。**iPhone実機での確認はユーザー確認待ち**

## 実機確認結果と再修正（同日・1回目）

* 実機確認の結果：**保存は成功するようになった**（generateId / expo-crypto修正は有効）。ただし**保存ボタンがキーボードに隠れる問題は未解消**だった
* 原因：KeyboardAvoidingViewは新アーキテクチャ＋native-stack（react-native-screens）環境でフレーム計測に失敗して動作しない既知問題があり、Expo Go SDK 54（新アーキ固定）が該当。フッター配置・flex構造・KAV内側配置は正しかったがKAV自体が効いていなかった
* 再修正：KAVを廃止し、`src/utils/keyboard.ts` の `useKeyboardBottomInset()`（keyboardWillShow/WillHideイベントからキーボード高さを直接取得。iOSのみ。Androidはデフォルトresizeで対応済み、Webは常に0）を新設。NoteFormのルートViewに `paddingBottom: keyboardInset` を適用してフッターをキーボードの上へ押し上げる方式に変更
* PC Web側はinsetが常に0のためレイアウト変化なし

## 検証状況

* `npx tsc --noEmit` エラーなし、`npx expo export --platform web` 成功（PC Web側は非破壊を確認）
* iPhone実機：保存・一覧反映は確認済み。**キーボード回避（再修正後）と「再起動後も残る」の実機確認はユーザー確認待ち**

## 変更したファイル（check-expo-sdk54ブランチ、未コミット）

* src/utils/id.ts
* src/components/FormFooterBar.tsx（新規。共通フッター＋キーボード直上バー）
* src/components/NoteForm.tsx（FormFooterBar適用・保存ボタン左下化）
* app/memo/create.tsx / app/memo/[id]/edit.tsx（FlowDock側。FormFooterBar適用・KAV撤去・autoFocus→onAccessoryReady方式・保存ボタン左下化）
* app/notes/create.tsx
* app/notes/[id]/edit.tsx
* package.json / package-lock.json（expo-crypto追加）

## 見送った項目

* 作成画面から戻る時の自動保存（候補として保留。まず手動保存の確実化を優先）
* 既存memo系画面（app/memo/*）のUI変更（根本原因のid.ts修正で保存自体は直るため、画面には触れていない）

---

# 過去ログ（2026-07-06 Expo SDK 54調査）

## 今回の目的

iPhoneのExpo Go 54.0.2に合わせるため、PC側プロジェクト（現在Expo SDK 56）をSDK 54へ下げた場合の依存関係リスクを調査する。実装・機能変更はしない。削除ボタン不具合とは別件として扱う。

## 今回やったこと

* 設定ファイルを確認した（package.json / package-lock.json / app.json / metro.config.js / tsconfig.json。babel.config.js / app.config.* / eas.json はルートに存在しない）
* 現状バージョンを確認した：expo 56.0.12 / react 19.2.3 / react-native 0.85.3 / expo-router 56.2.11 / expo-sqlite 56.0.5 / typescript 6.0.3
* コードの直接import対象を確認した：expo-sqlite / expo-router / expo-secure-store / expo-status-bar / react-native のみ。expo-file-system と react-native-reanimated は間接依存でコードからは未使用（＝SDK差の影響を受けにくい）
* 調査用ブランチ `check-expo-sdk54` を作成し、`expo@~54.0.0` ＋ `npx expo install --fix` を実行した
  * expo-router v6 の必須peer依存として expo-constants / expo-linking の直接追加が必要だった（初回の npm install 失敗の原因）
  * TypeScript が 6.0.3 → 5.9 に下がるため、tsconfig.json の `"ignoreDeprecations": "6.0"` が無効値エラーになる。baseUrl ごと削除して解決（paths は TS 4.1以降 baseUrl 不要。TS 5.9 / 6.0 両対応）
* SDK 54構成での検証：expo-doctor 18/18合格、`npx tsc --noEmit` エラーなし、`npx expo export --platform web` 成功（wa-sqlite.wasm も正しくバンドルされ、expo-sqlite Web対応は動作）
* 結果を `check-expo-sdk54` ブランチにコミットした（2a3d446）。mainは無変更。push・マージはしていない

## SDK 54化での変更ファイル（git diff結果）

* package.json：全Expo系依存の書き換え（expo ~54.0.0 / react-native 0.81.5 / react 19.1.0 / expo-router ~6.0.24 / expo-sqlite ~16.0.10 / expo-secure-store ~15.0.8 / expo-status-bar ~3.0.9 / typescript ~5.9.2 / @types/react ~19.1.10）＋ expo-constants / expo-linking 追加
* package-lock.json：全面再生成
* tsconfig.json：`ignoreDeprecations` と `baseUrl` の2行削除
* app/ / src/ / metro.config.js / app.json のコード変更は一切不要だった

## 未確認事項

* ブラウザでの手動操作確認（バンドル生成までは確認済み）
* iPhone実機のExpo Go 54.0.2からの接続確認（実機が必要）

## ブランチ状態と戻し方

* 現在 `check-expo-sdk54` をチェックアウト中（node_modules もSDK 54版）
* mainに戻る場合：`git checkout main` のあと `npm install` を実行して node_modules をSDK 56に戻すこと

---

# 過去ログ（2026-07-06 仕様書統合）

## 今回の目的

追加仕様書（カテゴリ・テンプレートDB管理、スマホ閲覧用HTML/JSONエクスポート、スマホ用プロンプト集HTML、mobile-inbox運用、将来候補・不採用方針）を、既存のメモ管理機能仕様書へ統合する。今回は仕様書・ロードマップ・タスクリスト・作業ログの更新のみで、コード実装は行わない。

## 今回やったこと

* 既存仕様書（docs/memo-app/00〜11）と作業管理ファイルを確認した
* 追加仕様を4ファイルに分割して新規作成した
  * docs/memo-app/12-template-db-management.md（note_categories / note_templates テーブル案、seed方針、DB優先・fallback方針、カテゴリ・テンプレート管理画面、複数テンプレート、初期状態に戻す機能、Codex / Claude Code依頼プロンプトのテンプレート保存）
  * docs/memo-app/13-mobile-view-export.md（docs/mobile-view/ へのHTML/JSON出力、安全条件、公開許可・除外カテゴリ、出力前確認画面、閲覧ページ機能、GitHub Pages / 自分のWebページ方針、手動push運用）
  * docs/memo-app/14-mobile-prompt-hub-and-inbox.md（スマホ用プロンプト集HTML、初期10プロンプト、将来追加候補、mobile-inbox運用）
  * docs/memo-app/15-future-and-rejected-policies.md（将来候補と不採用方針の整理）
* 既存仕様書へ追記した
  * 01-decisions-and-scope.md：追加決定事項（2026-07-06）の節を追加。採用・将来候補・不採用を明記
  * 03-data-model.md：note_categories / note_templates テーブル案、既存notesとの関係、seed方針、fallback方針を追記
  * 05-markdown-templates.md：テンプレートのDB管理移行方針を冒頭に追記
  * 06-chatgpt-prompt-copy.md：DBテンプレート優先・コード固定fallback・プロンプト集HTML再利用の方針を追記
  * 07-export-and-git-rules.md：スマホ閲覧用HTML/JSON出力の条件・確認画面・手動push運用を追記
  * 09-roadmap.md：Phase 8〜11を追加仕様に割り当て、Phase 12を将来拡張として再整理
  * 10-tasks.md：Phase 8〜11のタスクを追加。今回の仕様書整理分を完了扱いにした
  * 11-open-issues.md：追加仕様の確認待ち事項（9〜11章）を追加
* 00_START_HERE.md と CLAUDE.md の「作業内容別に読む仕様書」案内へ新規4ファイルを追加した
* current-tasks.md を更新した

## 既存仕様との食い違いと採用した方針（置き換えの理由）

* 「スマホ確認は当面GitHubアプリで代用する」（00-overview.md / 01-decisions-and-scope.md）
  → 追加仕様のスマホ閲覧用HTML/JSON（13）で置き換え。01-decisions-and-scope.md の該当行を更新した。00-overview.md 本文の全面改稿は今回は見送り、11-open-issues.md に記録した
* カテゴリ・テンプレート・ChatGPT整理プロンプトのコード固定定義（04 / 05 / 06 の前提）
  → DB管理優先＋コード固定定義はseed元・fallbackという位置付けに変更。05 / 06 に方針を追記し、既存のテンプレート・プロンプト本文自体は初期データの元としてそのまま残した
* 旧Phase 8（ダッシュボード化）
  → 追加仕様の優先順位を反映し、Phase 8〜11を追加仕様（DB管理／テンプレート管理画面／スマホ閲覧エクスポート／プロンプト集HTML）に割り当て。ダッシュボードは将来候補（Phase 12、15-future-and-rejected-policies.md）へ移動

## 決まったこと（追加決定事項）

* カテゴリ・テンプレートDB管理（note_categories / note_templates）
* テンプレート管理画面・カテゴリ管理画面
* カテゴリごとの複数テンプレート
* 初期状態に戻す機能（既存メモ本文は変更しない）
* Codex / Claude Code依頼プロンプトのテンプレート保存
* スマホ閲覧用HTML/JSON出力（安全なメモのみ。出力前確認画面あり）
* スマホ閲覧ページの検索・絞り込み・簡易Markdown表示・コピーボタン
* スマホ用プロンプト集HTML（初期10プロンプト）
* mobile-inbox運用（初期は保存場所を作らずChatGPT送信で代用）
* GitHub Pages / 将来自分のWebページ配置
* 自動pushはしない。手動push運用

## 変更したファイル

新規：

* docs/memo-app/12-template-db-management.md
* docs/memo-app/13-mobile-view-export.md
* docs/memo-app/14-mobile-prompt-hub-and-inbox.md
* docs/memo-app/15-future-and-rejected-policies.md

変更（すべてドキュメントのみ）：

* CLAUDE.md、00_START_HERE.md、current-tasks.md、docs/worklog/current.md
* docs/memo-app/01-decisions-and-scope.md
* docs/memo-app/03-data-model.md
* docs/memo-app/05-markdown-templates.md
* docs/memo-app/06-chatgpt-prompt-copy.md
* docs/memo-app/07-export-and-git-rules.md
* docs/memo-app/09-roadmap.md
* docs/memo-app/10-tasks.md
* docs/memo-app/11-open-issues.md

コード（app/ / src/ / scripts/ / package.json等）は一切変更していない。

## 未完了事項・確認待ち

* Phase 8〜11の実装（未着手。着手判断待ち）
* note_categories / note_templates の実装タイミング、既存コード固定定義との移行方法（11-open-issues.md 9章）
* スマホ閲覧HTMLの生成方式、notes-data.json形式、GitHub Pages配置方法、リポジトリ公開可否（11-open-issues.md 10章）
* 前回からの持ち越し：ブラウザでの手動動作確認、Web版DBファイルへのアクセス手段

## 次にやること

1. ブラウザで動作確認する（`npx expo start --web`）
2. 問題なければユーザー判断でcommit
3. Phase 8（カテゴリ・テンプレートDB管理）の着手判断

## 次回最初に読むファイル

* CLAUDE.md
* 00_START_HERE.md
* current-tasks.md
* docs/worklog/current.md
* docs/memo-app/09-roadmap.md
* docs/memo-app/10-tasks.md
* docs/memo-app/11-open-issues.md

## 注意点

* commit / pushはしていない（ユーザー確認待ち）
* 既存機能（memos / GitHub連携）は削除・変更していない
* 個人情報を含むメモはGit候補にしない

---

# 過去ログ（2026-07-03）

## 今回の目的

分割仕様書（docs/memo-app/）に沿って、MindHub_AppにPC用Webアプリとして使えるメモ管理機能を一括実装する（通常の段階的実装ではなく一括実装の実験）。

## 今回やったこと

* 既存構成を確認した（Expo SDK 56 / expo-router / expo-sqlite。既存の軽量メモ機能とGitHub連携あり。アプリ内部名はFlowDock）
* 分割仕様書をdocs/memo-app/00〜11として配置した
* CLAUDE.md / 00_START_HERE.md / current-tasks.md を新規作成した（既存docs/claude_workflow.md等は残し、CLAUDE.mdから参照する形で統合）
* notesテーブルを追加した（schema_version 2。既存memos/ai_outputs/settingsテーブルは無変更）
* /notes系画面（一覧・作成・詳細・編集）を追加した
* カテゴリ10種、プロジェクト自由入力＋候補、タグ自由入力＋候補、source、visibility、Git候補フラグを実装した
* カテゴリごとのGit候補初期値を実装した（フラグ手動変更後はカテゴリ変更に追従しない）
* Markdownプレビューを実装した
* ChatGPT整理プロンプトコピーを全10カテゴリ分実装した
* 検索（title/body/project/tags/type）・絞り込み（プロジェクト/カテゴリ/タグ/Git候補のみ/アーカイブ表示切替）・並び替え（更新日順/作成日順）を実装した
* Markdown書き出し（ブラウザダウンロード方式）とexport_dir/export_filename/export_path/exported_at記録を実装した
* scripts/export_git_notes.py（一括書き出しの土台）を作成した
* Web実行対応：react-native-web / react-dom / @expo/metro-runtime を導入し、expo-sqlite Web用のmetro.config.jsを追加した
* 既存ホーム画面ヘッダーに「メモ管理」ボタンを追加した（既存画面への変更はこれと_layoutへの画面タイトル追加のみ）

## 決まったこと（実装時の仮置き含む）

* 既存memosテーブルは触らず、notesテーブルを並列追加する
* Markdownプレビューは外部ライブラリを追加せず自作の軽量レンダラーにする。理由：react-native-markdown-display等はメンテ停滞でReact 19 / RN 0.85との互換リスクがあるため。仕様が求める記法（見出し・リスト・コードブロック・区切り線・強調・リンク）は自作でカバーできる
* Markdown書き出しはWebの制約（任意フォルダへ直接書き込めない）により、ブラウザダウンロード＋推奨パス表示＋手動配置の運用にする
* クリップボードはnavigator.clipboard（Web）のみ対応。ネイティブは将来expo-clipboard導入で対応
* RN WebのAlert.alertは複数ボタン非対応のため、Webではwindow.confirm/window.alertを使うユーティリティ（src/utils/dialog.ts）を追加

## 変更したファイル

変更：

* app/_layout.tsx（notes系画面のタイトル登録）
* app/index.tsx（ヘッダーに「メモ管理」ボタン追加）
* src/db/schema.ts（CREATE_NOTES_TABLE追加、SCHEMA_VERSION=2）
* src/db/migrations.ts（v2マイグレーション追加）
* tsconfig.json（TypeScript 6のbaseUrl非推奨エラー回避のためignoreDeprecations追加。includeはexpoが自動更新）
* package.json / package-lock.json（react-native-web / react-dom / @expo/metro-runtime追加）

新規：

* CLAUDE.md、00_START_HERE.md、current-tasks.md
* docs/memo-app/00〜11（12ファイル）
* docs/worklog/current.md
* metro.config.js
* scripts/export_git_notes.py
* app/notes/index.tsx、app/notes/create.tsx、app/notes/[id]/index.tsx、app/notes/[id]/edit.tsx
* src/features/notes/noteTypes.ts、noteCategories.ts、noteRepository.ts、noteService.ts、noteExport.ts、chatgptPrompts.ts
* src/components/MarkdownPreview.tsx、NoteForm.tsx
* src/utils/clipboard.ts、dialog.ts

## 確認したこと

* `npx tsc --noEmit` がエラーなしで通る
* `npx expo start --web` でMetroが起動し、Webバンドル（962モジュール）がエラーなしでビルドされる
* バンドルにnotes系コードが含まれている

## 未完了事項

* ブラウザでの手動動作確認（メモ作成〜アーカイブ、プロンプトコピー、Markdown書き出し）。バンドルビルドまでは確認済みだが、ブラウザ実操作は未実施
* Web版DB（ブラウザ内OPFS）へのPythonスクリプトアクセス手段（Phase 7残タスク）
* 既存設定画面（GitHub連携）はexpo-secure-store依存のため、Web実行時の動作は未確認（既存機能。コードは無変更）
