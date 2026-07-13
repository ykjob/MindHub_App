# 端末別運用・配布方針（Android APK / iPhone Web閲覧版）

追加日：2026-07-06

## 1. 目的

PC / Android / iPhone のそれぞれで、このアプリをどう動かし、誰が何をするかを決める。

方針の骨子。

* 自分（Android端末）：Android APK版をアプリとして端末にインストールして使う
* 家族（iPhone）：閲覧専用のWebページで確認する。アプリ配布はしない
* PC / Android / iPhone間の自動同期は今回の対象外

データ・配布物を誰に渡すか・見せるかの区分（自分用・家族用・配布用）は `17-distribution-and-sharing.md` を参照。

## 2. 自分用：Android APK版

### 2.1 位置付け

開発サーバー（Expo Go / `expo start`）なしで単体動作するAPKをビルドし、自分のAndroid端末にアプリとしてインストールして使う。動作確認用と実用を兼ねる。

### 2.2 Android APK版でやること

* メモ作成
* 編集
* テンプレート管理
* JSONインポート
* オフライン利用の確認

補足。

* テンプレート管理はPhase 8〜9（`12-template-db-management.md`）の実装が前提
* JSONインポートの仕様は `18-json-import-export.md` で確定（2026-07-07）。実装時期は未定
* データはAndroid端末内ローカルSQLiteに保存される（expo-sqliteのネイティブ動作。PC Web版のOPFS上DBとは別物）

### 2.3 ビルド方式（2026-07-06決定）

初回のAndroid APKは、EASクラウドビルドで進める。

* profile：preview
* distribution：internal
* 形式：APK

ローカルビルド（`expo prebuild` ＋ Android Studio / Gradle / Java環境）は、環境整備が重いため後回しにする。

### 2.4 SDKバージョン（2026-07-06決定）

Expo SDK 54を正式採用候補のまま進める。

理由。

* 現時点でSDK 56固有機能を使っていない
* SDK 54構成で型チェック（tsc）・Webバンドル・expo-doctorが通っている（check-expo-sdk54ブランチで検証済み）
* 使える環境を減らす理由がない

SDK 56へ戻す・上げる判断は、SDK 56固有機能が必要になった時に再検討する。

### 2.5 APK初版の機能範囲と確認項目（2026-07-07追加）

APK初版は現行機能のみで作る。テンプレートDB管理（Phase 8〜9）とJSONインポート（`18-json-import-export.md`）は初版の必須条件にしない。

ビルド設定の現状。

* eas.json：preview / production とも internal distribution・APK形式
* app.json：android.package = com.ykjob.mindhub（2026-07-07確定）
* versionCode：初回APK（実機確認済み）は versionCode = 1。**2回目APKは versionCode = 2 でビルド予定**（2026-07-07に app.json を 1→2 へ更新）。初回インストール済み端末へ更新版として安全に上書きインストールするための採番
* 初回ビルドは実施済み（EASクラウドビルド成功→Android端末インストール成功。§2.5参照）。2回目ビルド（クリップボード修正 9338a07・アプリ内プロンプト一覧画面 e80a5bf の反映）は未実行

インストール後の確認チェックリスト（初版実機確認結果：2026-07-07）。

* [x] 開発サーバーなしで起動する（成功）
* [x] メモ管理（notes）：作成・編集・保存（成功。一覧表示も確認）
* [ ] メモ管理：検索・絞り込み・並び替え（未確認）
* [ ] Markdownプレビュー表示（未確認）
* [x] FlowDock（既存メモ）：作成・編集（成功）
* [x] アプリ再起動後もデータが残る（端末内SQLite）（成功）
* [ ] 機内モード（オフライン）でメモ作成・編集・保存ができる（未確認）
* [x] familyカテゴリ・visibility=familyが選択・保存できる（表示・保存とも成功）
* [ ] prompts.htmlをAndroidのブラウザで開いてコピーできる（閲覧経路はPages判断まではファイル直接送付またはGitHub経由）

初版実機確認のまとめ：起動・保存・再起動後保持・カテゴリ/visibility表示・FlowDock作成編集は成功。Android APKとしての土台は成立。上記の未確認項目は次回以降に確認する。

既知の制約（将来改善候補）。

* ~~アプリ内のプロンプトコピー・本文コピーはWeb専用実装のためAPK上では動作しない~~ → **修正済み（`9338a07`。expo-clipboard導入でネイティブ対応）。次回のEAS再ビルド後のAPKで実機再確認が必要。**
* アプリ内プロンプト一覧画面（`app/prompts`）を追加（2026-07-07）。prompts.html（ブラウザ側）を探して開く運用に加え、APK内から直接プロンプトを一覧・検索・コピーできるようにした。**EAS再ビルド後のAPKで実機確認が必要。**
* Markdown書き出しはブラウザダウンロード方式（Blob + アンカー）のため、APK上では動作しない想定。書き出しはPC Web版で行う（今回は対応対象外）
* Androidのキーボードで保存ボタンが隠れる問題は許容済み（キーボードを閉じて操作）
* GitHub連携（expo-secure-store利用）の実機動作は未確認

### 2.6 JSONインポート（将来。仕様確定済み）

PC Web版からAndroid APK版へのメモ移行・バックアップ用。仕様は `18-json-import-export.md`。APK初版には含めない。

## 3. 家族用：iPhone向けWeb閲覧版

### 3.1 位置付け

家族はiPhoneを使うが、編集や管理はしない想定。そのため、iPhone向けのアプリ配布・EAS iOSビルドは行わず、閲覧専用のWebページで確認してもらう。

実体はスマホ閲覧用HTML/JSON（`13-mobile-view-export.md`）をそのまま使う。

### 3.2 iPhone Web閲覧版でやること

* Safari等のブラウザで閲覧
* 必要に応じてコピー

### 3.3 iPhone Web閲覧版でやらないこと

* 編集
* メモ作成・管理
* アプリインストール

## 4. 同期の扱い

PC / Android / iPhone間の自動同期は今回の対象外。

* PC Web版とAndroid APK版のDBは別々に持つ。データ移行が必要な場合の手段（JSONインポート等）は `11-open-issues.md` 12章で確認待ち
* iPhoneはWeb閲覧版（PC側から出力した静的HTML/JSON）を見るだけで、同期は発生しない
* 将来同期が必要になった場合はSupabase同期を検討する（`15-future-and-rejected-policies.md` 1.1参照）

## 5. 不採用

* iPhone向けアプリ配布（EAS iOSビルド、TestFlight等）：家族は閲覧のみのため不要
* PC / Android / iPhone間の自動同期：今回の対象外

## 6. 関連仕様書

* 配布・共有方針（自分用・家族用・配布用の三区分）：`17-distribution-and-sharing.md`
* スマホ閲覧用HTML/JSON：`13-mobile-view-export.md`
* スマホ用プロンプト集HTML・mobile-inbox：`14-mobile-prompt-hub-and-inbox.md`
* 将来候補・不採用方針：`15-future-and-rejected-policies.md`
* 未確定事項：`11-open-issues.md` 12章

## 7. Phase 15 UI・UX検証との分担（2026-07-13追記）

* 本ファイル（`16`）はAPKを**作成・配布・導入する手順と端末運用**の正本のまま変更しない
* **作成済みAPKを使ったUI・UXの検証項目・判定・証跡**は `30-ui-validation-checklist.md` を正本とする（§2.5の初版チェックリストは初版APKの記録として残す）
* Phase 15期間中のAPKビルド確認は**原則2回**（共通UI基盤＋ホーム＋主要4画面の基本改修後／Phase 15全体完成後。`30` §12.1）。毎タスクごとのAPKビルドは行わない
* versionCode 4 APK（対象コミット6605d43）の基準確認項目（ホーム2×2・`/notes` 上部余白・Safe Area・戻る操作・ステータスバー等）は `30` §12.2に**未確認**として記録されている
