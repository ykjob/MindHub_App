# Current Tasks

## 現在のフェーズ

* **Phase 15：UI・UX品質改善（2026-07-13、文書整備段階＝完了・未コミット）**：DOC-02（`28-ui-ux-quality-improvement.md` 作成）／DOC-03（`29-ui-design-system.md` 作成）／DOC-04（`30-ui-validation-checklist.md` 作成）／DOC-05（既存仕様書10ファイルへの反映）／DOC-06（管理ファイル更新）／DOC-07（最終文書監査：AUDIT-01〜18全項目合格）まで**すべて完了。Gate 1（仕様書整備）は完了**（2026-07-13）。タスク全体は `10-tasks.md` §20、監査記録は `docs/worklog/current.md`
* **Phase 15実機基準確認完了（2026-07-13）**：versionCode 4 APKのAndroid実機基準確認7項目（ホーム2×2表示／`/notes` 上部余白／Safe Area／戻る操作／ステータスバーとの重なり／横方向の表示崩れ／既存機能への影響）を**すべて問題なし＝合格**として `30` §12.2 に記録。AppHeader実装の着手条件（`29` §5.4）は解消。追加所見：FlowDockメモ作成画面の保存・キャンセルボタンが画面下端に近い（単独修正せず、Phase 15全体仕上げ時にSafe Area・キーボード挙動・他入力画面との統一を含めて確認。`30` §12.2・`11` §16に記録）
* **Phase 15の次に行う1作業**：バッチ1実装＝テーマファイル（`src/theme/index.ts`）＋初期共通コンポーネント4種＋主要4画面（ホーム・メモ管理一覧・現場適応入口・プロンプト集）のAppHeader適用（Safe Area・Web直アクセス戻るフォールバック・ネイティブヘッダー二重表示防止）
* **Phase 15の未確定事項（代表。正本は `11-open-issues.md` §16）**：最近のメモの取得元／現場適応モードの短い表示名／プロンプト集の状況別分類／AppHeaderの具体値／アイコン導入／app.json表示名変更／ConfirmDialog二重実装の扱い
* EAS preview APK 4回目ビルド成功（2026-07-13）：モバイルヘッダー修正（e12aed6）＋versionCode 4（6605d43）をcommit/push後にビルド完了。対象コミット6605d43・appBuildVersion=4確認済み。APK：https://expo.dev/accounts/ykjob/projects/flowdock/builds/11b19c5e-853c-4d9f-9971-f6c39e6cf0a4 （期限2026-07-27）。Android実機確認（ステータスバー・ホーム2×2・/notes 2段化要否）はユーザー待ち
* /notes/index ヘッダーのSafe Area対応（2026-07-13、コミット済み e12aed6）：APK 3回目のAndroid実機確認フィードバック対応。`useSafeAreaInsets` で上余白に `insets.top` を加算（ステータスバー被り解消、Webは不変）＋「← 戻る」にhitSlop追加。一度実装したスマホ幅2段化は「窮屈なのはホーム画面の可能性が高い」との指摘で撤回（実機表示を見て要否再判断）。tsc合格・Web両幅で従来どおり1行を確認済み
* ホーム画面ヘッダーのスマホ幅2×2グリッド化（2026-07-13、未コミット・承認済み案を実装）：`app/index.tsx` のみ変更。`width < 480` で「メモ一覧」＋「現場適応/プロンプト集」＋「メモ管理/設定」の2×2グリッド（各ボタン中央寄せ・縦padding拡大）、480以上は従来の1行を完全維持。tsc合格・Web両幅レイアウト実測・コンソールエラー0件。Android実機確認はAPK再ビルド後
* EAS preview APK 3回目ビルド成功（2026-07-13）：メモ管理修正（3e0c7ee）＋versionCode 3（f277c12）をcommit/push後、`eas build -p android --profile preview` でビルド完了。対象コミットf277c12・appBuildVersion=3を確認。APK：https://expo.dev/accounts/ykjob/projects/flowdock/builds/0547c079-4dbf-43c5-8508-1e6bc2ec56ff （アーティファクト期限2026-07-27）。実機インストール・基本動作確認はユーザー待ち
* メモ管理画面の不具合2件修正完了（2026-07-13、未コミット）：(1) `/notes` の画面内ヘッダーに「← 戻る」ボタンを追加（`canGoBack()` なら `back()`、直アクセス時は `replace('/')`。履歴依存を解消）。追加で `notes/index` のみ `headerShown: false` にしてネイティブヘッダーを消し、戻る導線を画面内「← 戻る」1つに統一（他画面のヘッダーは無変更）。(2) Web更新時の `NoModificationAllowedError`（OPFS access handle競合）に対し、`_layout.tsx` の SQLiteProvider に `onError` を追加してWebでは1回だけ自動リロードで回復（sessionStorageフラグで無限リロード防止）。あわせて `/notes` 一覧の `useEffect`＋`useFocusEffect` 二重読み込みを `useFocusEffect` のみに整理。tsc合格・ヘッドレスブラウザで実操作確認済み（戻るボタン両経路・フィルタ再読み込み・リロード連打回復・PC/スマホ幅表示・フラグ残留なし）
* 開発リファレンス 目的2本柱化＋現場理解カード20枚の下書き作成完了（2026-07-12、未コミット）：目的を「柱1＝技術リファレンス（即参照・事故駆動）」「柱2＝現場理解カード（現場での動き方の確認手順・判断基準）」の2本柱に拡張（`24` §1）。現場理解カードG-01〜G-20（6グループ・サブタグ6種・高優先5枚）を `25` §10 に整理し、`/notes` へコピペ登録できる完成本文20枚を `27-development-reference-fieldwork-cards.md` に新規作成。案Aの枠（専用画面・新規ルート・DB変更なし、command＋dev-ref）は不変。面接質問プロンプトは対象外と明記。DB登録はユーザーの手動登録待ち
* 発表用サンプルデータのデモリハーサル完了（2026-07-12、未コミット）：`26` §2のサンプル文を原文どおり8082の実画面へ入力し、5場面＋終業前メモ保存＋翌朝再開導線を確認。全32チェック項目OK・コンソールエラー0件・修正必須の問題なし。`26` §3にデモ運営上の注意（サンプル文は事前用意してコピペ入力）を1行追記
* 現場適応モード 発表用サンプルデータ作成完了（2026-07-12、未コミット）：`docs/memo-app/26-workplace-demo-samples.md` を新規作成。架空シナリオ（新人が架空の在庫管理Webアプリの画面確認タスクを担当する1日）で5場面の入力例・デモ手順・ChatGPT活用例・守秘ルールを整理。ドキュメントのみ・実装コード/DB/ルート構造は無変更
* 現場適応モード5場面のブラウザ確認完了（2026-07-12、ドキュメント記録のみ）：`http://localhost:8082/workplace` 以下で5場面＋入口＋翌朝再開導線を実操作確認。47チェック項目すべてOK・コンソールエラー0件・表示崩れなし・アプリ側の修正不要。8081は現場適応モード追加前から動いていた古い開発サーバーで `/workplace` が Unmatched Route になるため8082で確認
* 名称方針の整理完了（2026-07-12、コミット済み 09bb952・push済み）：MindHub＝アプリ全体名（思考メモ・作業ログ・AI活用・プロンプト集・現場適応モードのハブ）、FlowDock＝初期からある軽量メモ機能（`/memo` 系）の説明名として整理し、`01-decisions-and-scope.md` §1.6 に正本化。`00_START_HERE.md`・`CLAUDE.md` に参照追記。app.json・package.json・ルート名・DB・実装コードは無変更
* 開発リファレンス 案A正式採用＋登録候補整理完了（2026-07-10、未コミット）：案A（専用画面・固定データ画面・新規ルートを作らず `command` カテゴリで運用）を正式方針として確定し docs 反映（24 §6.1 / 04 §1.3 / 11 §15 / 10 §17）。参照用タグは `dev-ref` で確定。登録候補31件を `docs/memo-app/25-development-reference-candidates.md` に整理し、高優先度7件（R-01/R-02/R-03/R-04/R-09/R-14/R-15）を先行登録候補として明記。DB登録・コード変更なし。DB登録可否はユーザー判断待ち
* 開発リファレンス（現場適応モードとは別機能）の仕様書新規作成＋既存仕様への参照追記完了（2026-07-10、コミット済み b2092b9）：`docs/memo-app/24-development-reference.md` を新規作成。作業中に手が止まったとき手順・コマンド・最小コード例をすぐ確認する補助参照集として整理。初期は既存notesの `command` カテゴリ／タグ運用で扱い専用DB・専用画面は作らない。実装コード変更なし
* 現場適応モード（Phase 14）の仕様書新規作成＋既存仕様への参照追記完了（2026-07-09）
* 現場適応モード（Phase 14）MVP実装完了（2026-07-09、コミット済み 37aa1e8・push済み）：入口＋場面選択＋作業開始/詰まり記録/終業前メモ＋翌朝再開導線＋再開時の引き継ぎ初期入力。守秘既定強制・schema無変更・既存導線無変更 → ブラウザ確認済み
* 現場適応モード（Phase 14）次点2場面追加（2026-07-10、コミット済み 09d34fd）：質問文作成・進捗報告作成を追加し5場面をそろえた。どちらも `WorkplaceSceneForm` 再利用でコピーのみ・保存なし（`onSave` 未指定）。schema無変更・notes保存処理追加なし・既存導線無変更 → ブラウザ確認済み（2026-07-12、5場面47項目すべてOK）
* Phase 0〜7 一括実装完了（実験的一括実装）→ 動作確認・レビュー待ち
* 追加仕様（カテゴリ・テンプレートDB管理／スマホ閲覧用HTML/JSON等）の仕様書統合完了（2026-07-06）→ Phase 8以降の実装は未着手・着手判断待ち
* 端末別運用方針の決定・仕様書反映完了（2026-07-06）：自分用Android APK版（Phase 12）＋家族用iPhone Web閲覧版（Phase 10で対応、アプリ配布なし）。自動同期は対象外
* 配布・共有方針の決定・仕様書反映完了（2026-07-06）：自分用（完全版）・家族用（見せてよい情報のみ）・配布用（別リポジトリ、汎用データのみ）の三区分
* 運用方針の詳細確定・仕様書反映完了（2026-07-06）：EASクラウドビルド採用、SDK 54継続、家族用情報は公開Pagesに出さない、familyカテゴリ追加、配布物はWeb/PWA・JSON・説明書優先、プロンプト集HTMLはコード固定定義から先行生成

## 現在の目的

MindHub_Appのメモ管理機能拡張について、

1. Phase 0〜7実装分のユーザーによる実機（ブラウザ）確認と、commit判断待ち
2. 追加仕様（docs/memo-app/12〜15）の実装着手判断待ち

## 完了したこと

### Phase 15 UI・UX品質改善の文書整備（第1〜4B段階）（2026-07-13、未コミット）

* `docs/memo-app/28-ui-ux-quality-improvement.md` を新規作成（画面別改善・情報設計・UX-01〜UX-16の正本）
* `docs/memo-app/29-ui-design-system.md` を新規作成（デザイントークン・ヘッダー方式・共通コンポーネント・状態表示・アクセシビリティ基準の正本）
* `docs/memo-app/30-ui-validation-checklist.md` を新規作成（検証手順・判定・Gate 1〜7・証跡記録の正本）
* Phase 15を既存の正式仕様書10ファイルへ反映（`01` / `08` / `09` / `10` / `11` / `14` / `16` / `21`、`CLAUDE.md`、`00_START_HERE.md`）。古いホーム方針（入口ボタン追加のみ）とUI踏襲規則（#2563EB基調をそのまま踏襲）は置換注記つきで現行方針へ更新
* 28・29・30の正本分担を確定（重複正本なし）
* 共通UI設計判断DS-01〜DS-10を確定（AppHeader案A・theme1ファイル・既存色の役割化＋AI色 `#7C3AED`・スケール定義・初期部品4個・表示のみ共通化・実用a11y基準・アイコン保留・一括置換禁止）
* UX-01〜UX-16を追跡可能な状態にした（`28` §16・`30` §14の追跡表。判定はすべて未確認から開始）
* Gate 1〜Gate 7の検証構造を定義（`30` §15）
* versionCode 4 APKの基準確認項目を**未確認**として記録（`30` §12.2。推測判定なし）
* 実装コード・DB・依存関係・app.json・eas.json・28〜30作成後の再編集はなし。commit・push・git addは未実施

### メモ管理画面の不具合2件修正（2026-07-13、未コミット）

* 問題1（戻るボタン消失）：`app/notes/index.tsx` の画面内ヘッダー左に「← 戻る」ボタンを追加。`router.canGoBack()` で戻れるなら `router.back()`、Webの更新・直アクセスで履歴がない場合は `router.replace('/')` でホームへ。さらに戻るボタン2重表示の解消として `_layout.tsx` の `notes/index` のみ `headerShown: false` を設定し、画面内「← 戻る」を全環境で唯一の戻る導線に統一（`/notes/create`・`/notes/[id]` 等のネイティブヘッダーは従来どおり）
* 問題2（Web更新時の NoModificationAllowedError）：原因は expo-sqlite Web実装のOPFS access handle 競合（リロード時に旧worker のhandle解放より先に新workerが取得を試みる）。worker は初期化失敗後にページ内リトライで回復できない構造のため、`app/_layout.tsx` の SQLiteProvider に `onError` を追加し、Webでこのエラーの場合のみ sessionStorage フラグ付きで1回だけ自動リロード。成功時（onInit）にフラグ解除。2回連続失敗（別タブで開いている等）は再リロードせずエラー表示
* 副次修正：`/notes` 一覧の `useFocusEffect`＋`useEffect` の二重 `load()` を `useFocusEffect` のみに整理（初回・フォーカス復帰・フィルタ変更をすべてカバー。競合の原因ではないが冗長のため）
* 検証：`npx tsc --noEmit` 合格。ヘッドレスブラウザ実操作確認済み（2026-07-13、8083で確認：直アクセス/通常遷移の戻るボタン両経路・フィルタ変更での再読み込みサイクル・リロード6連打回復・sessionStorageフラグ残留なし・PC 1280px/スマホ390px幅で表示崩れなし・コンソールエラー0件）。コミット・pushは未実施

### 開発リファレンス 目的2本柱化＋現場理解カード20枚の下書き作成（2026-07-12、未コミット）

* 目的を2本柱に拡張（`24-development-reference.md` §1改定）：柱1＝技術リファレンス（作業中の即参照。事故駆動でR-01〜R-31を1件ずつ）、柱2＝現場理解カード（実際の開発現場でどう動くかの確認手順・判断基準。行動基準のため初期セット登録を許容）。§3対象・§4対象外・§5登録基準（5.1/5.2に分割）・§6も整合するよう修正
* 現場理解カードG-01〜G-20を `25-development-reference-candidates.md` §10 に整理：6グループ（onboarding／ask-report／troubleshoot／git-db／security／closing＝サブタグ6種で確定）、Rカードとの関係（G＝汎用手順の親・R＝本プロジェクトの個別実例の子。統合せず相互リンク）、高優先5枚（G-02タスク受領時／G-06質問前整理／G-08報告内容／G-10エラー切り分け／G-19終業前再開情報）
* `docs/memo-app/27-development-reference-fieldwork-cards.md` を新規作成：20枚すべてのコピペ用登録ブロック（タイトル／カテゴリcommand／タグ `dev-ref,サブタグ`／本文）。本文は1枚15〜25行の「いつ見るか・確認すること・判断基準・MindHub_Appでの実例・関連」構成で、ポートフォリオ上「仕事に対する姿勢」を説明できる実務手順として記述
* 守秘確認：20枚とも汎用内容のみ（実在企業・現場固有情報・機密なし。G-17/G-18も本文は汎用判断基準に限定）。Git候補はcommand初期値どおりtrue
* 面接質問プロンプトは今回の対象外と `25` §7 に明記
* 関連更新：`04` §1.3（2本柱とも command＋dev-ref 運用のまま・サブタグ6種）、`11` §15（決定済み事項の追記・残る未確定の整理）、`10` §17
* 実装コード・DB・ルート・専用画面は無変更（ドキュメントのみ）。DB登録・コミット・pushは未実施

### 発表用サンプルデータのデモリハーサル（2026-07-12、未コミット）

* `26-workplace-demo-samples.md` §2のサンプル文を原文どおり `http://localhost:8082/workplace` の実画面へ入力し、発表と同じ流れをリハーサル確認。全32チェック項目OK・コンソールエラー0件・**修正必須の問題なし**
* 確認範囲：5場面の入力→整理→出力→コピー（クリップボード実内容も確認）、終業前メモ保存→入口の「前回の再開メモ」表示→「この続きから作業開始」の引き継ぎ初期入力。翌朝再開デモとして文章が自然につながることを確認
* 表示崩れなし・守秘面問題なし（固有名なし）。質問文作成の「急ぎ度」の文体は自然なため変更しない判断
* 反映：`26` §3に「サンプル文は事前にテキストファイルへ用意し、デモ中はコピペ入力する」旨を1行追記
* コミット・pushは未実施

### 現場適応モード 発表用サンプルデータの作成（2026-07-12、未コミット）

* `docs/memo-app/26-workplace-demo-samples.md` を新規作成（ドキュメントのみ）
* 架空シナリオ：未経験に近い新人が、架空の社内向け「在庫管理Webアプリ」の会員登録画面の入力チェック確認を担当する1日。5場面が朝→詰まり→質問→報告→終業前の流れでつながる
* 5場面の入力例は画面ラベルと一致させ、そのまま入力してデモできる形にした。各場面に「デモでの見せ方」「ChatGPTに貼るとどう役立つか」を併記
* 発表用デモの推奨手順（前日に終業前メモを保存→入口の再開メモから始めて引き継ぎで締める）と短時間版（詰まり記録→質問文作成のみ）も記載
* 実在の会社名・職場名・個人名・顧客名・秘密情報は不使用（守秘ルールを§4に明記）
* 実装コード・DB・app.json・package.json・ルート構造は無変更。コミット・pushは未実施

### 現場適応モード5場面のブラウザ確認（2026-07-12、ドキュメント記録のみ）

* `http://localhost:8082/workplace` 以下で、5場面（作業開始・詰まり記録・質問文作成・進捗報告作成・終業前メモ）＋入口＋翌朝再開導線をヘッドレスブラウザで実操作確認。47チェック項目すべてOK・コンソールエラー0件・表示崩れなし・**アプリ側の修正不要**
* 確認内容：各場面の表示・入力欄・整理→出力・コピー（クリップボード実内容も検証）・保存動作の有無（終業前メモのみ保存あり、他4場面はコピーのみ＝仕様どおり）・守秘注意文の全場面表示・終業前メモ保存→「前回の再開メモ」表示→「この続きから作業開始」の引き継ぎ初期入力
* **8082で確認した理由**：8081の開発サーバーは現場適応モードのルート追加前から起動していた古いプロセスで `/workplace` が Unmatched Route になるため、8081には触らず8082で新規起動して確認
* puppeteer-core を一時的にプロジェクト本体へ誤インストールしたが、`git restore` ＋ `npm prune` で復旧し `git status` クリーンを確認済み（最終的にセッション用一時ディレクトリへ隔離）
* 記録先：`docs/worklog/current.md`、`docs/memo-app/10-tasks.md` §16
* コミット・pushは未実施

### 名称方針の整理（2026-07-12、コミット済み 09bb952・push済み）

* MindHub と FlowDock の呼び分けを整理し、`docs/memo-app/01-decisions-and-scope.md` §1.6「追加決定事項（2026-07-12 名称方針）」として正本化
  * MindHub：アプリ全体名。思考メモ、作業ログ、AI活用、プロンプト集、現場適応モードをまとめるハブ。表向き名称は今後 MindHub に寄せる
  * FlowDock：初期からある軽量メモ機能の説明名。スマホで素早くメモを流し込み、あとで整理につなげる入口。消さずに残す
  * `/memo` 系＝FlowDock由来の既存軽量メモ機能、`/notes` 系＝メモ管理機能、`/workplace` 系＝現場適応モード
* `00_START_HERE.md` §1 と `CLAUDE.md` プロジェクト概要の「アプリ内部名：FlowDock」を「アプリ全体名：MindHub」に改め、名称方針の参照を追記
* app.json（name/slug/scheme）・package.json・ルート名・DB・実装コード（画面タイトル「FlowDock」含む）は変更なし。表示名等を実際に MindHub へ変更する時期は未確定として `01` §1.6 に明記
* `docs/flowdock_mvp_design.md` は FlowDock（既存軽量メモ機能）の仕様基準としてそのまま参照
* コミット・pushは未実施（ドキュメントのみ）

### 開発リファレンス 案A正式採用と登録候補の整理（2026-07-10、未コミット）

* 案A（開発リファレンス専用画面・固定データ画面・`app/reference` などの新規ルートを作らず、既存notesの `command` カテゴリで運用）を正式方針として確定し、docsに反映（`24` §6.1新設 / `04` §1.3 / `11` §15を決定済みへ / `10` §17）
* 参照用タグを `dev-ref` に確定（旧「命名未確定」を `11` §15 / `04` §1.3 / `24` §6 で解消）
* 登録候補31件を `docs/memo-app/25-development-reference-candidates.md` に新規整理。各候補を8観点（タイトル／見るタイミング／MindHub_Appでの具体例／この手順の意味／現場で置き換えるポイント／関連コマンド／関連ファイル／優先度）で記載
* 高優先度7件（R-01 検証2コマンド／R-02 保存無反応の確認順／R-03 ID生成はexpo-crypto／R-04 ネイティブcopyはexpo-clipboard／R-09 schema_version方式／R-14 commit/pushは指示後／R-15 既存機能を壊さない）を「最初にDB登録する候補」として §3 に明記
* 統合案（§6）・登録しない候補（§7）・人間判断事項（§8）も整理
* DB登録・コード変更・コミットは未実施（ドキュメントのみ）。DB登録可否はユーザー判断待ち

### 開発リファレンスの仕様書新規作成と既存仕様への参照追記（2026-07-10、コミット済み b2092b9）

* 現場適応モードとは**別機能**の「開発リファレンス」仕様として `docs/memo-app/24-development-reference.md` を新規作成。目的（暗記でなく作業中に迷ったとき手順・コマンド・最小コード例をすぐ確認し集中を切らさず作業へ戻る）・現場適応モードとの関係（5場面支援が主、リファレンスは詰まったときの補助参照）・対象/非対象・登録基準・初期実装方針・将来候補を記載
* 方針：現場適応モードの中核機能ではない。5場面（作業開始・詰まり記録・質問文作成・進捗報告作成・終業前メモ）で手が止まったとき横から参照する補助導線。初期は専用DB・専用画面を作らず既存notesの `command` カテゴリ／タグ運用で扱う
* 登録基準：実際に手が止まった／2回以上調べた／1分以内に見返したい／コピペか短い確認で作業へ戻れるものに限定。AIが重要と言っただけの用語・未使用の知識・網羅的関数一覧・公式ドキュメント丸写し・現場固有情報・機密は対象外
* 既存仕様書6件へ参照追記：04（§1.3 command カテゴリ／タグ運用）／09（別機能・当面ロードマップ外）／10（§17 タスク）／11（§15 確認待ち）／20（§7.2 非スコープに別機能として明記）／21（§7.1 別機能・補助参照）
* 完了条件どおり：別機能であり補助参照として扱うこと、初期は `command` カテゴリ／タグ運用で専用DB・専用画面は後回しであることを明記
* 実装コード・DBスキーマ・専用画面は変更なし。コミット・pushは未実施（ドキュメントのみ）

### 現場適応モード（Phase 14）次点2場面追加：質問文作成・進捗報告作成（2026-07-10、未コミット）

* `app/workplace/question.tsx`（質問文作成）・`app/workplace/report.tsx`（進捗報告作成）を新規追加。`WorkplaceSceneForm` を `onSave` 未指定で再利用＝**コピーのみ・保存ボタンなし・DB非接続**
* `src/features/workplace/workplaceService.ts` に `buildQuestionText`（結論先頭・丸投げに見えない体裁）／`buildReportText`（結論先・完了/未完了/次の作業を分離・相談は最後）を追加
* `src/features/workplace/workplaceTags.ts` に場面定数 `workplace_question` / `workplace_report` を**定義のみ**追加（今回は未保存。将来保存時も private / isGitCandidate=false 固定の前提は不変）
* `app/workplace/index.tsx` の場面カードに「質問文作成」「進捗報告作成」を追加（作業開始→詰まり記録→質問文作成→進捗報告作成→終業前メモ の並び）。`app/_layout.tsx` にStack.Screen 2件登録
* 守秘：既存注意文に加え、両画面 intro に「AI・チャット・メールに貼る前に、顧客名・会社名・個人名・内部URL・システム名・社内マニュアル本文・職場固有の判断基準は一般化してから使う」旨を明記
* 境界固定どおり：schema変更なし、notes保存処理なし、`createNote`・保存系関数は呼ばない、既存 `/notes` `/memo` `/prompts` `/settings` 無変更、公開出力・GitHub Pages・配布用HTML・家族用表示への接続なし
* 検証：tsc 合格、`expo export`（web）合格、新2画面に保存系コード（onSave/createNote/save）が無いことを確認。ブラウザ実操作はユーザー確認待ち
* コミット・pushは未実施

### 現場適応モード（Phase 14）MVP実装（2026-07-09、未コミット）

* 新規ルート `app/workplace/*` を追加（既存 `/notes` `/memo` `/prompts` `/settings` は無変更）。`_layout.tsx` にStack.Screen 4件登録
  * `app/workplace/index.tsx`：場面選択＋直近の終業前メモ（再開メモ）を上部表示＋「この続きから作業開始」
  * `app/workplace/start.tsx`（作業開始）・`stuck.tsx`（詰まり記録）・`end.tsx`（終業前メモ）
* 共通部品 `src/components/WorkplaceSceneForm.tsx`：入力→整理→コピー（終業前のみ保存）。守秘注意文を常時表示
* ロジック層 `src/features/workplace/`：
  * `workplaceTags.ts`：場面タグ（`workplace_start` / `workplace_stuck` / `workplace_end`）＋共通タグ `workplace`、守秘既定定数、守秘注意文
  * `workplaceService.ts`：終業前メモ保存（`createNote` 経由で `visibility=private` / `isGitCandidate=false` 固定・type=thought・`getGitCandidateDefault` 不使用）、直近終業前メモ取得、各場面の生成テキスト組み立て
* `src/features/notes/noteRepository.ts` に `getLatestNoteByTag` を**追加のみ**（既存関数無変更）。タグ境界を `,` で厳密一致、LIKEワイルドカード（% _）をエスケープ、`archived_at IS NULL`、`updated_at DESC, id DESC`、1件
* `app/index.tsx` ホームヘッダーに「現場適応」ボタンを1つ追加（既存挙動は無変更）
* 保存対象は翌朝再開に必要な終業前メモのみ。作業開始・詰まり記録はコピーのみ
* 再開時の引き継ぎ（2026-07-09追加）：`/workplace` 上部の「この続きから作業開始」は `?fromRestart=1` を付けて遷移し、start画面が直近終業前メモを取得して作業開始フォームへ初期入力（明日最初にやること→今日の作業、未完了・補足→先に確認すること。構造が取れない本文はそのまま先に確認すること欄へ）。青い引き継ぎ案内文を表示。通常の作業開始導線は空欄。作業開始は保存しない
* 境界固定どおり：schema変更なし、既存導線無変更、公開出力・GitHub Pages・配布用HTML・家族用表示への接続なし
* 次点（質問文作成・進捗報告作成）・現場プロファイル・複数現場切り替えは今回対象外
* 検証：tsc 合格、`expo export`（web）合格（787モジュール・4画面をバンドル）。ブラウザ実操作確認はユーザー待ち
* コミット・pushは未実施

### 現場適応モード仕様書の新規作成と既存仕様への参照追記（2026-07-09、未コミット）

* 未経験者・訓練校生・SES配属直後向けの「現場適応モード」仕様として、`docs/memo-app/20-workplace-adaptation-overview.md`〜`23-workplace-adaptation-security-and-portfolio.md` の4ファイルを新規作成
* 既存仕様書11ファイルへ参照追記を適用（01 / 03 / 04 / 07 / 08 / 09 / 10 / 11 / 17、00_START_HERE.md、CLAUDE.md）
* 命名は `workplace-adaptation` を採用（IT開発現場を指す・`field`はDBフィールドと紛らわしいため）
* 5場面モデル（作業開始／詰まり記録／質問文作成／進捗報告作成／終業前メモ）を正本とし、翌朝の再開導線は5場面と分離した補助導線として整理
* DB方針は既存notes再利用（案A）を第一候補とし破壊的変更なし（案B/Cは比較として保持・将来候補）。DB定義正本は03、schema_version方式
* 現場情報は既定でvisibility=private・Git候補false、公開HTML・配布用・家族用に非混入
* 既存正本との整合性チェックで大きな矛盾なし（DB定義は03に一元化しスキーマ追加なし／画面は08=入口・21=詳細で排他／Phase番号は09・10とも14）
* 未確定事項：出力物の保存可否、入口配置、現場プロファイル構造、タグ命名、複数現場切り替え時期（11 §14）
* レビュー後修正（同日）：Git候補初期値の衝突を解消（現場適応モードはカテゴリ初期値に依らず既定 is_git_candidate=false / visibility=private に守秘優先で上書き。23 §6.1新設、22 §4・04 §1.2・07 §13に反映）。軽微4点（20節参照ミス／「既存の主要導線・既存機能を壊さない」への表現統一／場面タグは例で命名は11管理／22 §6.1の実態修正）も反映。観点3・6を解消
* 守秘・公開配布・スマホ閲覧の境界追記（同日）：職場情報の範囲（職場固有ルール・報告経路・判断基準・システム操作手順・例外対応・社内資料本文も含む。抽象化した個人用チェック項目に留める）を23 §3.1に正本化、20 §5・22 §5は参照。将来スマホ閲覧時も公開Pagesに現場情報を出さず公開配布と分離する未確定事項を11 §14に追加
* コード実装・コミット・pushは未実施（ドキュメントのみ）

### 2回目APKビルド前のversionCode更新（2026-07-07、未push）

* app.json の android.versionCode を 1 → 2 に更新（初回versionCode 1インストール済み端末への上書き更新用）。2回目APKにはクリップボード修正（9338a07）とアプリ内プロンプト一覧画面（e80a5bf）が載る
* `npx expo config` で versionCode: 2 / package: com.ykjob.mindhub を確認。16 §2.5の記述を実態に更新
* EAS build未実行・アプリ本体無変更

### Androidエミュレータ自動確認の調査記録＋Maestro雛形作成（2026-07-07、未push）

* `docs/memo-app/19-android-emulator-testing.md` 新規：調査結果・導入案（adb=配管／Maestro=UIシナリオ／CIは後回し。Detox・Appiumは実リリースAPK検証に重く非推奨。Windowsは WSL2 経由推奨）
* `.maestro/` 新規：README.md＋flows/01_create_and_persist.yaml（作成〜再起動後の永続化）＋flows/02_prompt_copy.yaml（プロンプト検索・展開・コピー）。**未実行の雛形**
* 方針：testID未整備のため可視テキスト操作。コピー成功は「コピーしました」表示で判定。CI化は後回し
* 今回対応せず：Maestro/エミュレータ実行、CI設定、testID追加、アプリ本体コード変更、EAS build、Pages有効化、PWA化、配布用リポジトリ
* 検証：追加はドキュメントと.maestro雛形のみ。アプリ本体無変更。実エミュレータ実行はこれから

### APK初版実機確認の記録＋アプリ内プロンプト一覧画面の追加（2026-07-07、未push）

* APK初版の実機確認結果を記録（起動・保存・再起動後保持・familyカテゴリ/visibility表示・FlowDock作成編集は成功。Androidキーボード隠れは許容。検索/絞り込み/Markdownプレビュー/オフライン保存/prompts.htmlコピーは未確認）。16 §2.5のチェックリストに反映
* クリップボード不具合は `9338a07` で修正済み。既存APKには未反映のため、EAS再ビルド後に実機再確認が必要（16 §2.5に明記）
* アプリ内プロンプト一覧画面 `app/prompts` を新規追加。promptHub.ts（chatgptPrompts＋mobilePrompts統合の共有データ層。42件・7セクション）＋SectionListでセクション別表示・検索・展開・コピー（修正済みcopyToClipboard使用）。ホームヘッダーに「プロンプト集」導線を追加
* 設計判断：mobilePrompts.tsの「アプリからimportしない」方針を今回のAPK内表示要件で上書き（冒頭コメント更新）。prompts.htmlはWebView表示せずRN画面で描画。generate_prompt_hub.mjsは無変更で温存
* 検証：tsc・expo export（web）・generate:prompt-hub（7セクション42プロンプト）すべて合格。APK実機確認はEAS再ビルド後
* 今回対応せず：Markdown書き出しのAPK対応、Androidキーボード追加修正、Phase 8、JSONインポート、Pages有効化、PWA化、配布用リポジトリ、EAS build、push

### 配布・実機運用前の土台整備（2026-07-07、未push）

* familyカテゴリ・visibility=family値をコード反映（noteTypes / noteCategories / chatgptPrompts。DBマイグレーション不要。作成・編集画面に自動表示）。公開Pages出力可否判定 mobileViewPolicy.ts を先行実装（Phase 10で使用予定）
* EASビルド準備：eas.json新規（preview / internal / APK）、app.jsonにandroid.package（com.ykjob.flowdock仮置き）とversionCode追加。eas build実行・loginはユーザー操作待ち
* APK初版の機能範囲・確認チェックリストを16 §2.5に整理（現行機能のみ。既知の制約：アプリ内コピーとMarkdown書き出しはWeb専用実装のためAPKでは動かない想定）
* JSONインポート仕様を18-json-import-export.mdとして具体化（形式・schemaVersion・重複ID処理・件数表示・責務分担。実装は未着手）
* prompts.html軽微改善：セクション件数・絞り込み中の表示件数・familyカテゴリカード追加（計42本）
* 検証：tsc / expo export / expo config / 生成HTML構造チェックすべて合格

### プロンプト集への追加31プロンプト実装（2026-07-06、push済み）

* src/features/notes/mobilePrompts.ts 新規作成（データ専用モジュール。アプリ画面からはimportしない）。不足5本＋追加26本の計31本を定義
* prompts.htmlを7セクション・41プロンプト構成に拡張（メモ整理カテゴリ別10／タスク・予定整理4／開発・AI作業8／思考整理・行動化5／就活5／生活・家庭共有5／投資・検証4）
* 生活・家庭共有系5本に「private / family用」バッジ＋公開Pagesに載せない前提の注記を追加。本文に個人情報・家庭内情報は含めていない
* 今回見送り：Claude Code報告確認・リポジトリ状況整理・検証結果レビュー
* 検証：生成成功・構造検証合格・tsc / Web export合格（バンドルにmobilePrompts.tsは含まれずアプリ非影響）。ブラウザ実操作はユーザー確認待ち

### プロンプト集HTML先行生成の実装（2026-07-06、未コミット）

* scripts/generate_prompt_hub.mjs 新規作成。`npm run generate:prompt-hub` で docs/mobile-view/prompts.html を生成（カテゴリ整理プロンプト10個収録）
* データ取得層と描画層を分離し、将来のnote_templates（DB）切替はloadPromptEntries()差し替えのみで対応可能
* 新規ライブラリなし（既存TypeScriptコンパイラAPIを利用）。アプリ本体（app/ / src/）は無変更
* 検証：生成成功・HTML構造検証合格・インラインJS構文合格・tsc / Web export合格。ブラウザとスマホでの実操作確認はユーザー確認待ち
* 14 §1.3の不足5プロンプト（時間帯別タスク化・Googleタスク整形・カレンダー整形・優先順位整理・Codexレビュー依頼）は本文未作成のため後続対応

### 端末別運用方針の決定・仕様書反映（2026-07-06）

* 方針決定：自分（Android）はAndroid APK版をアプリとしてインストールして使う（メモ作成・編集・テンプレート管理・JSONインポート・オフライン利用の確認）。家族（iPhone）は編集・管理をしない想定のため、アプリ配布・EAS iOSビルドは行わず、閲覧専用Webページ（スマホ閲覧用HTML/JSON）で確認してもらう。PC/Android/iPhone間の自動同期は今回の対象外
* docs/memo-app/16-platform-and-distribution.md を新規作成
* 既存ドキュメントへ反映：01（追加決定事項1.3）、09（Phase 12=Android APK版を追加、将来拡張はPhase 13へ）、10（Phase 12タスク追加）、11（12章：ビルド方式・SDKバージョン・JSONインポート仕様等の未確定事項）、13（家族iPhone閲覧が主用途の追記）、15（iPhoneアプリ配布を不採用に追加）、00_START_HERE.md、CLAUDE.md
* 実装は未着手（ドキュメントのみ）。ビルド方式・JSONインポート仕様などは11-open-issues.md 12章で確認待ち

### 運用方針の詳細確定・仕様書反映（2026-07-06）

ユーザー決定7項目をドキュメントへ反映した。

* APKビルド方式：初回はEASクラウドビルド（preview / internal distribution / APK形式）。ローカルビルドは環境整備が重いため後回し（16 §2.3）
* SDKバージョン：SDK 54を正式採用候補のまま進める。SDK 56固有機能が必要になった時に再検討（16 §2.4）
* 家族用ページの公開範囲：家庭内の決まり事・マニュアルは公開GitHub Pagesに置かない。公開Pagesは公開されても困らない内容のみ。家庭内情報の共有手段（非公開配置先・ローカルHTML・PDF・JSONインポート・private向けPWA）は別途検討（17 §4.1、13 §6.2）
* familyカテゴリ追加。公開可否はカテゴリ＋visibility併用で判定し、category=familyでもvisibility=private / familyは公開しない。visibilityにfamily値を追加（04 §1.1、03、13 §3.2〜3.3、17 §4.2）
* 配布用は別リポジトリで決定。汎用テンプレート・汎用知識データ・サンプルデータ・説明書のみ（17 §5）
* 配布物の範囲：Web/PWA・JSON・説明書を優先。配布用APK・ソース公開は将来候補（17 §5.5）
* プロンプト集HTML生成方式：短期はコード固定プロンプト定義（chatgptPrompts.ts）からdocs配下へ生成、note_templates実装後にDBへ切替（14 §1.6）。Phase 11はPhase 8〜9に依存せず先行着手可能になった
* 11-open-issues.md の10・12・13章を決定済み／残る未確定に整理。09 / 10のPhase 11・12を更新

### 配布・共有方針の決定・仕様書反映（2026-07-06）

* 三区分を決定：自分用＝完全版（Android APK版。私的メモ・家族用データ・家庭内の決まり事・個人的知識を含めてよい）／家族用＝Web閲覧のみ（家族間の決まり事・家庭内マニュアル・共有したい情報。自分用データから見せてよい情報だけを出力）／配布用＝別リポジトリ（汎用知識データ・汎用テンプレート・サンプルデータ・説明書のみ。個人情報・家族情報・私的メモは含めない。完全版をそのまま渡さない）
* ディレクトリ分離ではなく別リポジトリ分離を採用（更新の手間より情報混入リスク低減を優先）。配布用データエクスポート機能は将来候補
* docs/memo-app/17-distribution-and-sharing.md を新規作成。01 / 09 / 11 / 13 / 15 / 16、00_START_HERE.md、CLAUDE.mdへ反映
* 未確定事項は11-open-issues.md 13章に記録（家族用情報の配置先と公開範囲の整合、家族向けカテゴリ設計、配布用リポジトリの名称・構成・タイミング、配布物の形）

### スマホ実機の保存不具合修正（2026-07-06、check-expo-sdk54ブランチ・未コミット）

* 保存無反応の根本原因を特定：`generateId()` がWeb専用 `crypto.randomUUID()` を使用し、iPhoneのHermesで例外→空catchで無反応化。expo-crypto導入で修正（既存memo作成の同一不具合も同時に解消）
* NoteFormにkeyboardShouldPersistTaps追加（1タップ目が反応しない問題の修正）
* 実機確認で保存成功を確認。キーボード回避はKAV・JSイベントpadding方式とも実機で効かず、InputAccessoryView方式に変更
* 実機切り分け（notes編集○／notes作成×／FlowDock×）を受け、共通のFormFooterBar（遷移完了後にキーボード直上バーをマウント）を新設し、notes作成・編集＋FlowDockのmemo作成・編集の全4画面に適用。保存ボタンは全画面で左下配置に統一
* 最終実機確認：notes編集○／FlowDock作成・編集○。**メモ管理の新規作成画面とAndroid全画面は未改善だが今回は許容として完了扱い**（2026-07-06、将来の改善候補）
* notes作成・編集画面の保存失敗時にエラー表示を追加
* キーボード回避（再修正後）と「再起動後も残る」の実機確認はユーザー確認待ち

### Expo SDK 54ダウングレード調査（2026-07-06）

* iPhone Expo Go 54.0.2対応のためのSDK 56→54ダウングレード影響調査
* 調査用ブランチ `check-expo-sdk54` で expo@~54.0.0 ＋ expo install --fix を実施しコミット済み（mainは無変更、マージ・pushなし）
* 変更は package.json / package-lock.json / tsconfig.json のみ。アプリコードの修正は不要
* SDK 54構成で expo-doctor 18/18・tsc・Webエクスポート（wa-sqlite含む）すべて合格
* 詳細は docs/worklog/current.md 参照。SDK 54採用可否はユーザー判断待ち

### Phase 0〜7（2026-07-03）

* 分割仕様書の配置（docs/memo-app/00〜11）
* CLAUDE.md / 00_START_HERE.md / current-tasks.md / docs/worklog/current.md 整備
* notesテーブル追加（schema v2、既存memosテーブルは無変更）
* メモ作成・一覧・詳細・編集・アーカイブ（/notes 系画面）
* カテゴリ（10種）・プロジェクト・タグ・source・visibility・Git候補フラグ
* Markdownプレビュー（自作軽量レンダラー）
* ChatGPT整理プロンプトコピー（全10カテゴリ）
* 検索・絞り込み・並び替え
* Markdown書き出し（ブラウザダウンロード方式＋export_path/exported_at記録）
* scripts/export_git_notes.py 土台
* Web実行対応（react-native-web導入、metro.config.js）

### 追加仕様の仕様書統合（2026-07-06）

* 追加仕様書4ファイル作成（docs/memo-app/12〜15）
* 既存仕様書への追記（01 / 03 / 05 / 06 / 07 / 09 / 10 / 11、00_START_HERE.md、CLAUDE.md）
* ロードマップ再整理（Phase 8〜11を追加仕様に割り当て、旧Phase 8ダッシュボードは将来候補へ）
* 実装は未着手（仕様書のみ）

## 次にやること

1. `npx expo start --web` でブラウザ動作確認（メモ作成→一覧→詳細→編集→アーカイブ）
2. ChatGPT整理プロンプトコピーとMarkdown書き出しの実動確認
3. 未コミット分のcommitと、check-expo-sdk54ブランチのmainマージ判断（ユーザー判断）
4. 次の実装候補から着手対象を選ぶ（ユーザー判断）
   * Phase 11先行分：コード固定プロンプト定義からのプロンプト集HTML生成（依存なし・すぐ着手可）
   * familyカテゴリ・visibility=family値のコード定義への先行追加（小規模）
   * Phase 12：EASビルド準備（EASアカウント・eas.json・app.json整備。Expoアカウントログインが必要）
   * Phase 8：カテゴリ・テンプレートDB管理（schema v3）

## 未完了事項

* ブラウザでの手動動作確認（起動とバンドルのコンパイルまでは確認済み）
* Web版DBファイルへのPythonスクリプトアクセス手段（Phase 7残タスク。スマホ閲覧用HTML/JSON出力とも共通の課題）
* Phase 8〜11（追加仕様）の実装
* Phase 12（Android APK版ビルド・JSONインポート）の実装

## 確認待ち

決定済み（2026-07-06）：SDK 54継続（正式採用候補）、APKはEASクラウドビルド（preview / internal / APK）、家庭内情報は公開Pagesに出さない、familyカテゴリ追加（visibility併用判定）、配布用は別リポジトリ（Web/PWA・JSON・説明書優先）、プロンプト集HTMLはコード固定定義から先行生成。

残る確認待ち。

* EASアカウント準備（`npx eas-cli login`・`eas build:configure`。ユーザー操作）。※Androidパッケージ名は com.ykjob.mindhub で確定済み（2026-07-07）
* 既存memosデータをnotesへ統合するか（docs/memo-app/11-open-issues.md 参照）
* File System Access APIによるフォルダ指定書き出し対応の要否
* note_categories / note_templates の実装タイミング（11-open-issues.md 9章）
* スマホ閲覧HTMLの生成方式・notes-data.json形式・GitHub Pages配置方法（11-open-issues.md 10章）
* JSONインポートの実装時期とファイル選択の依存導入判断（18-json-import-export.md §7）
* 家庭内情報の共有手段をどれから着手するか、配布用リポジトリの名称・構成・作成タイミング（11-open-issues.md 13章）

## 後回し・将来候補（詳細：docs/memo-app/15-future-and-rejected-policies.md）

* クラウド同期・Supabase同期（PC/Android/iPhone間の自動同期は今回の対象外）
* OpenAI API連携
* ChatGPT共有受け取り
* ダッシュボード化（旧Phase 8）
* ワンコマンド更新スクリプト
* カテゴリ自由追加、テンプレートのエクスポート・インポート
* mobile-inboxのGitHub連携
* 配布用データエクスポート機能（当面は配布用リポジトリの中身を手動選別）

## 不採用（詳細：docs/memo-app/15-future-and-rejected-policies.md）

* アプリ内GitHub自動push
* Codexによる日常的なスマホ入力取り込み
* スマホからSQLite直接共有
* iPhone向けアプリ配布・EAS iOSビルド（家族は閲覧専用Webページで対応。2026-07-06）
