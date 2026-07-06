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
* JSONインポートの対象・形式は未確定（`11-open-issues.md` 12章参照）
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
